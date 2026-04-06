import { collection, doc, getDoc, getDocs, orderBy, query, serverTimestamp, setDoc } from 'firebase/firestore'
import { firestore } from '@/lib/firebase'
import type { CreateOpRegistrationInput, OpRegistrationRecord } from '@/types/registration'

const registrationsCollection = collection(firestore, 'opRegistrations')

function mapRegistration(documentId: string, data: Record<string, unknown>): OpRegistrationRecord {
  return {
    id: documentId,
    registrationNumber: String(data.registrationNumber ?? ''),
    tokenNumber: String(data.tokenNumber ?? ''),
    patientId: String(data.patientId ?? ''),
    patientName: String(data.patientName ?? ''),
    registrationDate: String(data.registrationDate ?? ''),
    age: Number(data.age ?? 0),
    gender: (data.gender as OpRegistrationRecord['gender']) ?? 'Male',
    maritalStatus: String(data.maritalStatus ?? ''),
    bloodGroup: String(data.bloodGroup ?? ''),
    dateOfBirth: String(data.dateOfBirth ?? ''),
    occupation: String(data.occupation ?? ''),
    address: String(data.address ?? ''),
    mobileNumber: String(data.mobileNumber ?? ''),
    email: String(data.email ?? ''),
    reference: String(data.reference ?? ''),
    chiefComplaint: String(data.chiefComplaint ?? ''),
    dentalHistory: String(data.dentalHistory ?? ''),
    oralExamination: Array.isArray(data.oralExamination) ? (data.oralExamination as OpRegistrationRecord['oralExamination']) : [],
    diagnosis: String(data.diagnosis ?? ''),
    advisedNotes: String(data.advisedNotes ?? ''),
    findings: String(data.findings ?? ''),
    treatmentGiven: String(data.treatmentGiven ?? ''),
    prescriptionNotes: String(data.prescriptionNotes ?? ''),
    followUpDate: String(data.followUpDate ?? ''),
    toothNumber: String(data.toothNumber ?? ''),
    procedure: String(data.procedure ?? ''),
    doctorNotes: String(data.doctorNotes ?? ''),
    medicalHistory: (data.medicalHistory as OpRegistrationRecord['medicalHistory']) ?? {
      asthma: false,
      bloodPressure: false,
      diabetes: false,
      drugAllergy: false,
      heartProblem: false,
      gastric: false,
      otherMedicalIssue: false,
      otherMedicalIssueDetails: '',
    },
    advisedTreatments: (data.advisedTreatments as OpRegistrationRecord['advisedTreatments']) ?? {
      scaling: false,
      extraction: false,
      rootCanal: false,
      pedo: false,
      fpdRpdCd: false,
      otherTreatment: false,
      otherTreatmentDetails: '',
    },
    treatmentRows: Array.isArray(data.treatmentRows) ? (data.treatmentRows as OpRegistrationRecord['treatmentRows']) : [],
    payment: (data.payment as OpRegistrationRecord['payment']) ?? {
      visitType: '',
      amount: 0,
      discount: 0,
      finalAmount: 0,
      paymentMode: 'Cash',
    },
    createdAt: String(data.createdAt ?? ''),
    updatedAt: String(data.updatedAt ?? ''),
  }
}

export const registrationService = {
  async listRegistrations(): Promise<OpRegistrationRecord[]> {
    const snapshot = await getDocs(query(registrationsCollection, orderBy('registrationNumber', 'desc')))
    return snapshot.docs.map((registrationDoc) => mapRegistration(registrationDoc.id, registrationDoc.data()))
  },

  async getRegistrationByNumber(registrationNumber: string): Promise<OpRegistrationRecord | null> {
    const registrationRef = doc(registrationsCollection, registrationNumber)
    const snapshot = await getDoc(registrationRef)
    if (!snapshot.exists()) return null
    return mapRegistration(snapshot.id, snapshot.data())
  },

  async createOrUpdateRegistration(input: CreateOpRegistrationInput): Promise<OpRegistrationRecord> {
    const registrationRef = doc(registrationsCollection, input.registrationNumber)
    const now = new Date().toISOString()

    await setDoc(
      registrationRef,
      {
        ...input,
        createdAt: now,
        updatedAt: now,
        serverUpdatedAt: serverTimestamp(),
      },
      { merge: true },
    )

    const snapshot = await getDoc(registrationRef)
    if (!snapshot.exists()) {
      throw new Error('Registration save failed. Please try again.')
    }

    return mapRegistration(snapshot.id, snapshot.data())
  },
}
