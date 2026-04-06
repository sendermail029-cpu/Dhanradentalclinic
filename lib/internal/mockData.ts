import type { BillRecord } from '@/types/bill'
import type { DoctorProfile } from '@/types/doctor'
import type { ClinicPatient } from '@/types/patient'
import type { QueueEntry } from '@/types/queue'
import type { VisitRecord } from '@/types/visit'

export const mockDoctorProfile: DoctorProfile = {
  id: 'DOC-1',
  name: 'Dr. Demo',
  department: 'Dental Care',
  room: 'Room 2',
}

export const mockPatients: ClinicPatient[] = [
  {
    id: 'PAT-1001',
    registrationNumber: 'D25001',
    fullName: 'Sujatha Rao',
    mobileNumber: '9876543210',
    age: 52,
    gender: 'Female',
    address: 'Ramavarapadu, Vijayawada',
    createdAt: '2026-04-01',
    lastVisit: '2026-04-01',
  },
  {
    id: 'PAT-1002',
    registrationNumber: 'D25002',
    fullName: 'Kiran Kumar',
    mobileNumber: '9123456780',
    age: 34,
    gender: 'Male',
    address: 'Benz Circle, Vijayawada',
    createdAt: '2026-03-30',
    lastVisit: '2026-03-31',
  },
  {
    id: 'PAT-1003',
    registrationNumber: 'D25003',
    fullName: 'Meena Devi',
    mobileNumber: '9988776655',
    age: 41,
    gender: 'Female',
    address: 'Gunadala, Vijayawada',
    createdAt: '2026-03-28',
    lastVisit: '2026-03-29',
  },
]

export const mockQueue: QueueEntry[] = [
  {
    id: 'QUE-1',
    token: '1',
    tokenSequence: 1,
    patientId: 'PAT-1001',
    patientName: 'Sujatha Rao',
    age: 52,
    time: '09:30 AM',
    complaint: 'Tooth pain',
    status: 'Waiting',
    queueDate: '2026-04-01',
  },
  {
    id: 'QUE-2',
    token: '2',
    tokenSequence: 2,
    patientId: 'PAT-1002',
    patientName: 'Kiran Kumar',
    age: 34,
    time: '10:00 AM',
    complaint: 'Implant review',
    status: 'With Doctor',
    queueDate: '2026-04-01',
  },
  {
    id: 'QUE-3',
    token: '3',
    tokenSequence: 3,
    patientId: 'PAT-1003',
    patientName: 'Meena Devi',
    age: 41,
    time: '10:20 AM',
    complaint: 'Cleaning',
    status: 'Done',
    queueDate: '2026-04-01',
  },
]

export const mockBills: BillRecord[] = [
  {
    id: 'BILL-1',
    billNumber: 'DD-2401',
    patientId: 'PAT-1002',
    patientName: 'Kiran Kumar',
    date: '2026-04-01',
    visitType: 'Implant Review',
    items: [{ label: 'Consultation', amount: 600 }],
    amount: 600,
    discount: 100,
    finalAmount: 500,
    paymentMode: 'UPI',
    paidStatus: 'Paid',
  },
  {
    id: 'BILL-2',
    billNumber: 'DD-2402',
    patientId: 'PAT-1003',
    patientName: 'Meena Devi',
    date: '2026-04-01',
    visitType: 'Scaling',
    items: [{ label: 'Scaling', amount: 1500 }],
    amount: 1500,
    discount: 0,
    finalAmount: 1500,
    paymentMode: 'Cash',
    paidStatus: 'Pending',
  },
]

export const mockVisits: VisitRecord[] = [
  {
    id: 'VIS-1',
    patientId: 'PAT-1002',
    patientName: 'Kiran Kumar',
    age: 34,
    gender: 'Male',
    mobileNumber: '9123456780',
    visitDate: '2026-04-01',
    chiefComplaint: 'Implant review',
    findings: 'Healing is good',
    diagnosis: 'Normal healing',
    treatmentGiven: 'Review and advice',
    prescriptionNotes: 'Continue mouth rinse for 5 days',
    followUpDate: '2026-04-10',
    toothNumber: '26',
    procedure: 'Implant review',
    notes: 'Patient comfortable',
    status: 'Open',
    billingStatus: 'Pending',
  },
  {
    id: 'VIS-2',
    patientId: 'PAT-1001',
    patientName: 'Sujatha Rao',
    age: 52,
    gender: 'Female',
    mobileNumber: '9876543210',
    visitDate: '2026-03-28',
    chiefComplaint: 'Tooth pain',
    findings: 'Deep caries in lower molar',
    diagnosis: 'Pulp infection',
    treatmentGiven: 'Pain relief medicine',
    prescriptionNotes: 'Start antibiotics after food',
    followUpDate: '2026-04-03',
    toothNumber: '46',
    procedure: 'Root canal plan',
    notes: 'Needs next visit for treatment',
    status: 'Completed',
    billingStatus: 'Paid',
  },
]

export function cloneMockData<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}
