export type Gender = 'Male' | 'Female' | 'Other'

export interface ClinicPatient {
  id: string
  registrationNumber: string
  fullName: string
  mobileNumber: string
  age: number
  gender: Gender
  address: string
  createdAt: string
  lastVisit: string
}

export interface NewPatientInput {
  registrationNumber?: string
  fullName: string
  mobileNumber: string
  age: number
  gender: Gender
  address: string
}
