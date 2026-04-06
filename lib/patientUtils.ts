import type { PatientRecord, OPFormErrors, DateFilterRange, PaymentMode } from '@/types'

// ─── Date helpers ──────────────────────────────────────────────────────────────

export function todayString(): string {
  const d = new Date()
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export function daysAgoString(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

function pad(n: number): string {
  return String(n).padStart(2, '0')
}

export function formatDisplayDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-')
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  return `${d} ${months[parseInt(m) - 1]} ${y}`
}

export function generateOPId(count: number): string {
  return `OP${String(count).padStart(4, '0')}`
}

// ─── Validation ────────────────────────────────────────────────────────────────

export interface OPFormData {
  patientName: string
  age: string
  mobileNumber: string
  address: string
  height: string
  weight: string
  bp: string
  sugar: string
  patientProblem: string
  paymentMode: PaymentMode
}

export function validateOPForm(data: OPFormData): OPFormErrors {
  const errors: OPFormErrors = {}

  if (!data.patientName.trim()) {
    errors.patientName = 'Patient name is required'
  } else if (data.patientName.trim().length < 2) {
    errors.patientName = 'Enter a valid full name'
  }

  if (!data.age.trim()) {
    errors.age = 'Age is required'
  } else {
    const ageNum = parseInt(data.age)
    if (isNaN(ageNum) || ageNum < 1 || ageNum > 120) {
      errors.age = 'Enter a valid age (1–120)'
    }
  }

  if (!data.mobileNumber.trim()) {
    errors.mobileNumber = 'Mobile number is required'
  } else {
    const clean = data.mobileNumber.replace(/\s/g, '')
    if (!/^\d{10}$/.test(clean)) {
      errors.mobileNumber = 'Enter a valid 10-digit mobile number'
    }
  }

  if (!data.address.trim()) {
    errors.address = 'Address is required'
  } else if (data.address.trim().length < 5) {
    errors.address = 'Please enter a complete address'
  }

  return errors
}

// ─── Filtering ─────────────────────────────────────────────────────────────────

export interface FilterParams {
  search: string
  paymentMode: string
  dateFilter: DateFilterRange
  dateFrom: string
  dateTo: string
}

export function filterPatients(
  patients: PatientRecord[],
  params: FilterParams
): PatientRecord[] {
  let list = [...patients]
  const today = todayString()

  // Text search
  if (params.search.trim()) {
    const q = params.search.toLowerCase().trim()
    list = list.filter(
      (p) =>
        p.patientName.toLowerCase().includes(q) ||
        p.mobileNumber.includes(q) ||
        (p.patientProblem || '').toLowerCase().includes(q) ||
        p.paymentMode.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q)
    )
  }

  // Payment filter
  if (params.paymentMode) {
    list = list.filter((p) => p.paymentMode === params.paymentMode)
  }

  // Date filter
  if (params.dateFilter === 'today') {
    list = list.filter((p) => p.createdAt === today)
  } else if (params.dateFilter === '7') {
    list = list.filter((p) => p.createdAt >= daysAgoString(7))
  } else if (params.dateFilter === '10') {
    list = list.filter((p) => p.createdAt >= daysAgoString(10))
  } else if (params.dateFilter === 'custom') {
    if (params.dateFrom) list = list.filter((p) => p.createdAt >= params.dateFrom)
    if (params.dateTo) list = list.filter((p) => p.createdAt <= params.dateTo)
  }

  return list
}

// ─── Stats ─────────────────────────────────────────────────────────────────────

export interface PortalStats {
  todayCount: number
  last7Count: number
  totalPatients: number
  pendingCOD: number
}

export function computeStats(patients: PatientRecord[]): PortalStats {
  const today = todayString()
  return {
    todayCount: patients.filter((p) => p.createdAt === today).length,
    last7Count: patients.filter((p) => p.createdAt >= daysAgoString(7)).length,
    totalPatients: patients.length,
    pendingCOD: patients.filter((p) => p.paymentMode === 'COD').length,
  }
}

// ─── Export / CSV ──────────────────────────────────────────────────────────────

const CSV_HEADERS = [
  'OP ID',
  'Date',
  'Patient Name',
  'Age',
  'Mobile Number',
  'Address',
  'Height (cm)',
  'Weight (kg)',
  'BP (mmHg)',
  'Sugar (mg/dL)',
  'Patient Problem',
  'Payment Mode',
]

function escapeCSV(val: string): string {
  if (val.includes(',') || val.includes('"') || val.includes('\n')) {
    return `"${val.replace(/"/g, '""')}"`
  }
  return val
}

export function exportToCSV(patients: PatientRecord[], filename: string): void {
  const rows = patients.map((p) =>
    [
      p.id,
      p.createdAt,
      p.patientName,
      p.age,
      p.mobileNumber,
      p.address,
      p.height || '',
      p.weight || '',
      p.bp || '',
      p.sugar || '',
      p.patientProblem || '',
      p.paymentMode,
    ].map(escapeCSV)
  )

  const csv = [CSV_HEADERS, ...rows].map((r) => r.join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${filename}_${todayString()}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

// ─── localStorage persistence ──────────────────────────────────────────────────

const STORAGE_KEY = 'dhanra_op_patients'
const COUNTER_KEY = 'dhanra_op_counter'

export function loadPatients(): PatientRecord[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as PatientRecord[]) : []
  } catch {
    return []
  }
}

export function savePatients(patients: PatientRecord[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(patients))
}

export function loadCounter(): number {
  if (typeof window === 'undefined') return 1
  return parseInt(localStorage.getItem(COUNTER_KEY) || '1', 10)
}

export function saveCounter(n: number): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(COUNTER_KEY, String(n))
}
