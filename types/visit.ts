export type VisitStatus = 'Open' | 'Completed'
export type VisitBillingStatus = 'Pending' | 'Sent to Billing' | 'Paid'

export interface VisitRecord {
  id: string
  patientId: string
  patientName: string
  age: number
  gender: string
  mobileNumber: string
  visitDate: string
  chiefComplaint: string
  findings: string
  diagnosis: string
  treatmentGiven: string
  prescriptionNotes: string
  followUpDate: string
  toothNumber: string
  procedure: string
  notes: string
  status: VisitStatus
  billingStatus: VisitBillingStatus
}

export interface ConsultationInput {
  patientId: string
  patientName: string
  age: number
  gender: string
  mobileNumber: string
  visitDate: string
  chiefComplaint: string
  findings: string
  diagnosis: string
  treatmentGiven: string
  prescriptionNotes: string
  followUpDate: string
  toothNumber: string
  procedure: string
  notes: string
}
