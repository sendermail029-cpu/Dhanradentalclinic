// Patient / OP Record — core data model
// Ready to connect to Prisma / Supabase / Firebase

export interface PatientRecord {
  id: string             // e.g. "OP0001"
  createdAt: string      // ISO date string "YYYY-MM-DD"
  patientName: string
  age: string
  mobileNumber: string
  address: string
  height: string         // optional — cm
  weight: string         // optional — kg
  bp: string             // optional — e.g. "120/80"
  sugar: string          // optional — mg/dL
  patientProblem: string // optional
  paymentMode: PaymentMode
}

export type PaymentMode = 'COD' | 'UPI' | 'Card'

export type DateFilterRange = 'today' | '7' | '10' | 'all' | 'custom'

// Form validation error map
export type OPFormErrors = Partial<Record<keyof PatientRecord, string>>

// Service item for public website
export interface ServiceItem {
  name: string
  description: string
  details: string[]
  icon: string       // lucide icon name
  homeVisit: boolean // available as doorstep service
  category: ServiceCategory
}

export type ServiceCategory =
  | 'aesthetic'
  | 'restorative'
  | 'preventive'
  | 'surgical'
  | 'orthodontic'
  | 'pediatric'
  | 'specialty'

// Testimonial
export interface Testimonial {
  name: string
  location: string
  text: string
  rating: number
  service: string
}

// FAQ item
export interface FAQItem {
  question: string
  answer: string
}

// Gallery item
export interface GalleryItem {
  title: string
  subtitle: string
  type: string
  category: string
}

// Doctor profile
export interface Doctor {
  name: string
  qualification: string
  specialization: string
  experience: string
  bio: string
  initials: string
}

// Clinic value / why-choose-us item
export interface ClinicValue {
  emoji: string
  title: string
  description: string
}
