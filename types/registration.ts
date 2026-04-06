import type { BillingPaymentMode } from '@/types/bill'
import type { Gender } from '@/types/patient'

export interface RegistrationTreatmentRow {
  date: string
  treatment: string
  payment: string
}

export interface RegistrationOralExaminationEntry {
  tooth: string
  finding: string
}

export interface RegistrationMedicalHistory {
  asthma: boolean
  bloodPressure: boolean
  diabetes: boolean
  drugAllergy: boolean
  heartProblem: boolean
  gastric: boolean
  otherMedicalIssue: boolean
  otherMedicalIssueDetails: string
}

export interface RegistrationAdvisedTreatments {
  scaling: boolean
  extraction: boolean
  rootCanal: boolean
  pedo: boolean
  fpdRpdCd: boolean
  otherTreatment: boolean
  otherTreatmentDetails: string
}

export interface RegistrationPaymentDetails {
  visitType: string
  amount: number
  discount: number
  finalAmount: number
  paymentMode: BillingPaymentMode
  billId?: string
  billNumber?: string
}

export interface OpRegistrationRecord {
  id: string
  registrationNumber: string
  tokenNumber: string
  patientId: string
  patientName: string
  registrationDate: string
  age: number
  gender: Gender
  maritalStatus: string
  bloodGroup: string
  dateOfBirth: string
  occupation: string
  address: string
  mobileNumber: string
  email: string
  reference: string
  chiefComplaint: string
  dentalHistory: string
  oralExamination: RegistrationOralExaminationEntry[]
  diagnosis: string
  advisedNotes: string
  findings: string
  treatmentGiven: string
  prescriptionNotes: string
  followUpDate: string
  toothNumber: string
  procedure: string
  doctorNotes: string
  medicalHistory: RegistrationMedicalHistory
  advisedTreatments: RegistrationAdvisedTreatments
  treatmentRows: RegistrationTreatmentRow[]
  payment: RegistrationPaymentDetails
  createdAt: string
  updatedAt: string
}

export interface CreateOpRegistrationInput {
  registrationNumber: string
  tokenNumber: string
  patientId: string
  patientName: string
  registrationDate: string
  age: number
  gender: Gender
  maritalStatus: string
  bloodGroup: string
  dateOfBirth: string
  occupation: string
  address: string
  mobileNumber: string
  email: string
  reference: string
  chiefComplaint: string
  dentalHistory: string
  oralExamination: RegistrationOralExaminationEntry[]
  diagnosis: string
  advisedNotes: string
  findings: string
  treatmentGiven: string
  prescriptionNotes: string
  followUpDate: string
  toothNumber: string
  procedure: string
  doctorNotes: string
  medicalHistory: RegistrationMedicalHistory
  advisedTreatments: RegistrationAdvisedTreatments
  treatmentRows: RegistrationTreatmentRow[]
  payment: RegistrationPaymentDetails
}
