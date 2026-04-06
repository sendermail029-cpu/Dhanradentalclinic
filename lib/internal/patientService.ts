import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  runTransaction,
  setDoc,
  where,
} from 'firebase/firestore'
import { firestore } from '@/lib/firebase'
import type { ClinicPatient, NewPatientInput } from '@/types/patient'

const patientsCollection = collection(firestore, 'patients')
const countersCollection = collection(firestore, 'counters')
const registrationCounterRef = doc(countersCollection, 'registrationNumber')
const registrationPrefix = 'D'
const registrationStart = 25001

function todayString() {
  return new Date().toISOString().slice(0, 10)
}

function parseRegistrationNumber(value?: string) {
  if (!value) return registrationStart - 1
  const numeric = Number(value.replace(/^\D+/, ''))
  return Number.isFinite(numeric) ? numeric : registrationStart - 1
}

function formatRegistrationNumber(value: number) {
  return `${registrationPrefix}${String(value).padStart(5, '0')}`
}

async function getCurrentRegistrationSequence() {
  const counterSnapshot = await getDoc(registrationCounterRef)
  if (counterSnapshot.exists()) {
    const value = Number(counterSnapshot.data().value)
    if (Number.isFinite(value)) return value
  }

  const latestPatientSnapshot = await getDocs(query(patientsCollection, orderBy('registrationNumber', 'desc'), limit(1)))
  if (!latestPatientSnapshot.empty) {
    const latestRegistrationNumber = latestPatientSnapshot.docs[0].data().registrationNumber as string | undefined
    return parseRegistrationNumber(latestRegistrationNumber)
  }

  return registrationStart - 1
}

async function registrationNumberExists(registrationNumber: string) {
  const snapshot = await getDocs(
    query(
      patientsCollection,
      where('registrationNumber', '==', registrationNumber),
      limit(1),
    ),
  )

  return !snapshot.empty
}

function mapPatient(documentId: string, data: Record<string, unknown>): ClinicPatient {
  return {
    id: documentId,
    registrationNumber: String(data.registrationNumber ?? ''),
    fullName: String(data.fullName ?? ''),
    mobileNumber: String(data.mobileNumber ?? ''),
    age: Number(data.age ?? 0),
    gender: (data.gender as ClinicPatient['gender']) ?? 'Male',
    address: String(data.address ?? ''),
    createdAt: String(data.createdAt ?? ''),
    lastVisit: String(data.lastVisit ?? ''),
  }
}

export const patientService = {
  async listPatients(): Promise<ClinicPatient[]> {
    const snapshot = await getDocs(query(patientsCollection, orderBy('registrationNumber', 'desc')))
    return snapshot.docs.map((patientDoc) => mapPatient(patientDoc.id, patientDoc.data()))
  },

  async searchPatients(searchText: string): Promise<ClinicPatient[]> {
    const queryText = searchText.trim().toLowerCase()
    const patients = await this.listPatients()
    if (!queryText) return patients

    return patients.filter(
      (patient) =>
        patient.fullName.toLowerCase().includes(queryText) ||
        patient.mobileNumber.includes(queryText) ||
        patient.registrationNumber.toLowerCase().includes(queryText),
    )
  },

  async getPatientById(patientId: string): Promise<ClinicPatient | null> {
    const patientSnapshot = await getDoc(doc(patientsCollection, patientId))
    if (!patientSnapshot.exists()) return null
    return mapPatient(patientSnapshot.id, patientSnapshot.data())
  },

  async getNextRegistrationNumber(): Promise<string> {
    const currentSequence = await getCurrentRegistrationSequence()
    return formatRegistrationNumber(currentSequence + 1)
  },

  async setNextRegistrationNumber(nextRegistrationNumber: string): Promise<string> {
    const nextSequence = parseRegistrationNumber(nextRegistrationNumber)
    const lockedSequence = Math.max(nextSequence - 1, registrationStart - 1)

    await setDoc(
      registrationCounterRef,
      {
        value: lockedSequence,
        updatedAt: new Date().toISOString(),
      },
      { merge: true },
    )

    return formatRegistrationNumber(lockedSequence + 1)
  },

  async createPatient(input: NewPatientInput): Promise<ClinicPatient> {
    if (input.registrationNumber) {
      const normalizedRegistrationNumber = input.registrationNumber.toUpperCase()
      const exists = await registrationNumberExists(normalizedRegistrationNumber)
      if (exists) {
        throw new Error(`Case number ${normalizedRegistrationNumber} already exists.`)
      }
    }

    const patientRef = doc(patientsCollection)
    let createdPatient: ClinicPatient | null = null

    await runTransaction(firestore, async (transaction) => {
      const counterSnapshot = await transaction.get(registrationCounterRef)
      const currentSequence = counterSnapshot.exists()
        ? Number(counterSnapshot.data().value ?? registrationStart - 1)
        : registrationStart - 1
      const manualSequence = input.registrationNumber ? parseRegistrationNumber(input.registrationNumber) : null
      const nextSequence = manualSequence ?? currentSequence + 1
      const lockedRegistrationNumber = input.registrationNumber || formatRegistrationNumber(nextSequence)
      const nextCounterValue = Math.max(currentSequence, nextSequence)

      const record = {
        registrationNumber: lockedRegistrationNumber,
        fullName: input.fullName,
        mobileNumber: input.mobileNumber,
        age: input.age,
        gender: input.gender,
        address: input.address,
        createdAt: todayString(),
        lastVisit: todayString(),
      }

      transaction.set(registrationCounterRef, {
        value: nextCounterValue,
        updatedAt: new Date().toISOString(),
      })
      transaction.set(patientRef, record)

      createdPatient = mapPatient(patientRef.id, record)
    })

    if (!createdPatient) {
      throw new Error('Patient registration failed. Please try again.')
    }

    return createdPatient as ClinicPatient
  },
}
