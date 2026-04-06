import {
  collection,
  doc,
  getDocs,
  runTransaction,
  updateDoc,
} from 'firebase/firestore'
import { firestore } from '@/lib/firebase'
import type { ClinicPatient } from '@/types/patient'
import type { QueueEntry, QueueStatus } from '@/types/queue'

const queueCollection = collection(firestore, 'queue')
const countersCollection = collection(firestore, 'counters')
const queueTokenCounterRef = doc(countersCollection, 'queueToken')

function formatToken(value: number) {
  return String(value)
}

function todayString() {
  return new Date().toLocaleDateString('en-CA')
}

function nowTime() {
  return new Date().toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

function mapQueue(documentId: string, data: Record<string, unknown>): QueueEntry {
  return {
    id: documentId,
    token: String(data.token ?? ''),
    tokenSequence: Number(data.tokenSequence ?? 0),
    patientId: String(data.patientId ?? ''),
    patientName: String(data.patientName ?? ''),
    age: Number(data.age ?? 0),
    time: String(data.time ?? ''),
    complaint: String(data.complaint ?? ''),
    status: (data.status as QueueStatus) ?? 'Waiting',
    queueDate: String(data.queueDate ?? ''),
  }
}

export const queueService = {
  async listQueue(): Promise<QueueEntry[]> {
    const today = todayString()
    const snapshot = await getDocs(queueCollection)
    return snapshot.docs
      .map((queueDoc) => mapQueue(queueDoc.id, queueDoc.data()))
      .filter((item) => item.queueDate === today)
      .sort((left, right) => left.tokenSequence - right.tokenSequence)
  },

  async getNextTokenNumber(): Promise<string> {
    const today = todayString()
    const snapshot = await getDocs(queueCollection)
    const todayEntries = snapshot.docs
      .map((queueDoc) => mapQueue(queueDoc.id, queueDoc.data()))
      .filter((item) => item.queueDate === today)

    const maxSequence = todayEntries.reduce((max, item) => Math.max(max, item.tokenSequence), 0)
    return formatToken(maxSequence + 1)
  },

  async addToQueue(patient: ClinicPatient, complaint = 'General checkup'): Promise<QueueEntry> {
    const queueRef = doc(queueCollection)
    let createdEntry: QueueEntry | null = null

    await runTransaction(firestore, async (transaction) => {
      const today = todayString()
      const counterSnapshot = await transaction.get(queueTokenCounterRef)
      const counterDate = counterSnapshot.exists()
        ? String(counterSnapshot.data().date ?? '')
        : ''
      const currentSequence =
        counterSnapshot.exists() && counterDate === today
          ? Number(counterSnapshot.data().value ?? 0)
          : 0
      const nextSequence = currentSequence + 1

      const record = {
        tokenSequence: nextSequence,
        token: formatToken(nextSequence),
        patientId: patient.id,
        patientName: patient.fullName,
        age: patient.age,
        time: nowTime(),
        complaint,
        status: 'Waiting' as const,
        queueDate: today,
      }

      transaction.set(queueTokenCounterRef, {
        value: nextSequence,
        date: today,
        updatedAt: new Date().toISOString(),
      })
      transaction.set(queueRef, record)

      createdEntry = mapQueue(queueRef.id, record)
    })

    if (!createdEntry) {
      throw new Error('Queue entry failed. Please try again.')
    }

    return createdEntry
  },

  async updateStatus(queueId: string, status: QueueStatus): Promise<QueueEntry | null> {
    const queueRef = doc(queueCollection, queueId)
    await updateDoc(queueRef, { status })
    const snapshot = await getDocs(queueCollection)
    const updated = snapshot.docs
      .map((queueDoc) => mapQueue(queueDoc.id, queueDoc.data()))
      .find((item) => item.id === queueId)

    return updated ?? null
  },
}
