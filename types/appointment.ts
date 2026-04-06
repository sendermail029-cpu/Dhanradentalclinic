export type AppointmentStatus = 'Scheduled' | 'Checked In' | 'Completed'

export interface AppointmentRecord {
  id: string
  patientId: string
  patientName: string
  mobileNumber: string
  date: string
  time: string
  purpose: string
  status: AppointmentStatus
}
