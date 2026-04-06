export type QueueStatus = 'Waiting' | 'With Doctor' | 'Done'

export interface QueueEntry {
  id: string
  token: string
  tokenSequence: number
  patientId: string
  patientName: string
  age: number
  time: string
  complaint: string
  status: QueueStatus
  queueDate: string
}
