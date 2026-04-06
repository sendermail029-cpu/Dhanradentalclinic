'use client'

import Link from 'next/link'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { ArrowRight, CalendarCheck2, CheckCircle2, Clock3, CreditCard, FilePlus2, History, Landmark, Send, Stethoscope, UserRound, Users } from 'lucide-react'
import PortalShell from '@/components/internal/PortalShell'
import BillPrintCard from '@/components/internal/billing/BillPrintCard'
import ActionButton from '@/components/internal/ui/ActionButton'
import DataTable from '@/components/internal/ui/DataTable'
import SectionCard from '@/components/internal/ui/SectionCard'
import StatusBadge from '@/components/internal/ui/StatusBadge'
import { billingService } from '@/lib/internal/billingService'
import { patientService } from '@/lib/internal/patientService'
import { queueService } from '@/lib/internal/queueService'
import { registrationService } from '@/lib/internal/registrationService'
import { smsService } from '@/lib/internal/smsService'
import { whatsappService } from '@/lib/internal/whatsappService'
import type { BillRecord, BillingPaymentMode } from '@/types/bill'
import type { ClinicPatient, Gender } from '@/types/patient'
import type { QueueEntry } from '@/types/queue'
import type { OpRegistrationRecord, RegistrationOralExaminationEntry } from '@/types/registration'

type ReceptionistView = 'dashboard' | 'billing' | 'new-registration' | 'registration-ledger'

type RegistrationForm = {
  caseNo: string
  registrationDate: string
  fullName: string
  mobileNumber: string
  age: string
  gender: Gender
  maritalStatus: string
  bloodGroup: string
  dateOfBirth: string
  occupation: string
  address: string
  email: string
  reference: string
  chiefComplaint: string
  dentalHistory: string
  oralExamFinding: string
  oralExamination: RegistrationOralExaminationEntry[]
  diagnosis: string
  advisedNotes: string
  asthma: boolean
  bloodPressure: boolean
  diabetes: boolean
  drugAllergy: boolean
  heartProblem: boolean
  gastric: boolean
  otherMedicalIssue: boolean
  otherMedicalIssueDetails: string
  scaling: boolean
  extraction: boolean
  rootCanal: boolean
  pedo: boolean
  fpdRpdCd: boolean
  otherTreatment: boolean
  otherTreatmentDetails: string
  treatmentRows: { date: string; treatment: string; payment: string }[]
}

type BillingForm = {
  patientId: string
  patientName: string
  visitType: string
  amount: string
  discount: string
  paymentMode: BillingPaymentMode
}

function todayString() {
  return new Date().toLocaleDateString('en-CA')
}

const defaultTreatmentRows = Array.from({ length: 14 }, () => ({
  date: '',
  treatment: '',
  payment: '',
}))

const emptyRegistrationForm: RegistrationForm = {
  caseNo: '',
  registrationDate: todayString(),
  fullName: '',
  mobileNumber: '',
  age: '',
  gender: 'Male',
  maritalStatus: '',
  bloodGroup: '',
  dateOfBirth: '',
  occupation: '',
  address: '',
  email: '',
  reference: '',
  chiefComplaint: '',
  dentalHistory: '',
  oralExamFinding: 'Caries',
  oralExamination: [],
  diagnosis: '',
  advisedNotes: '',
  asthma: false,
  bloodPressure: false,
  diabetes: false,
  drugAllergy: false,
  heartProblem: false,
  gastric: false,
  otherMedicalIssue: false,
  otherMedicalIssueDetails: '',
  scaling: false,
  extraction: false,
  rootCanal: false,
  pedo: false,
  fpdRpdCd: false,
  otherTreatment: false,
  otherTreatmentDetails: '',
  treatmentRows: defaultTreatmentRows,
}

const emptyBillingForm: BillingForm = {
  patientId: '',
  patientName: '',
  visitType: 'Clinic Visit',
  amount: '200',
  discount: '0',
  paymentMode: 'Cash',
}

const oralExamFindingOptions = ['Caries', 'Missing', 'Root Stump', 'Impacted', 'Mobility', 'Stains', 'Calculus', 'Fracture']

function sanitizeNameInput(value: string) {
  return value.replace(/[^A-Za-z\s]/g, '').replace(/\s{2,}/g, ' ').trimStart()
}

function sanitizeMobileInput(value: string) {
  return value.replace(/\D/g, '').slice(0, 10)
}

function sanitizeAgeInput(value: string) {
  return value.replace(/\D/g, '').slice(0, 3)
}

function formatOralExamToothLabel(tooth: string) {
  const match = tooth.match(/^(upper|lower)-(\d+)$/)
  if (!match) return tooth

  const chartNumbers = ['8', '7', '6', '5', '4', '3', '2', '1', '1', '2', '3', '4', '5', '6', '7', '8']
  const index = Number(match[2]) - 1
  return chartNumbers[index] ?? tooth
}

export default function ReceptionistPortal({ initialView = 'dashboard' }: { initialView?: ReceptionistView }) {
  const [patients, setPatients] = useState<ClinicPatient[]>([])
  const [queue, setQueue] = useState<QueueEntry[]>([])
  const [bills, setBills] = useState<BillRecord[]>([])
  const [registrations, setRegistrations] = useState<OpRegistrationRecord[]>([])
  const [registrationForm, setRegistrationForm] = useState<RegistrationForm>(emptyRegistrationForm)
  const [billingForm, setBillingForm] = useState<BillingForm>(emptyBillingForm)
  const [registrationStep, setRegistrationStep] = useState<1 | 2>(1)
  const [nextRegistrationNumber, setNextRegistrationNumber] = useState('D25001')
  const [nextTokenNumber, setNextTokenNumber] = useState('1')
  const [registrationSearch, setRegistrationSearch] = useState('')
  const [registrationDateFilter, setRegistrationDateFilter] = useState<'today' | 'custom' | 'all'>('today')
  const [registrationDateFrom, setRegistrationDateFrom] = useState(todayString())
  const [registrationDateTo, setRegistrationDateTo] = useState(todayString())
  const [searchText, setSearchText] = useState('')
  const [messageTemplate, setMessageTemplate] = useState<'appointment' | 'follow-up' | 'payment'>('appointment')
  const [messagePatientId, setMessagePatientId] = useState('')
  const [selectedBill, setSelectedBill] = useState<BillRecord | null>(null)
  const [feedback, setFeedback] = useState('')
  const [isSavingRegistration, setIsSavingRegistration] = useState(false)
  const [successPopup, setSuccessPopup] = useState<{ open: boolean; message: string }>({
    open: false,
    message: '',
  })

  const loadData = useCallback(async () => {
    const [patientRows, queueRows, billRows, registrationRows] = await Promise.all([
      patientService.listPatients(),
      queueService.listQueue(),
      billingService.listBills(),
      registrationService.listRegistrations(),
    ])
    setPatients(patientRows)
    setQueue(queueRows)
    setBills(billRows)
    setRegistrations(registrationRows)
    setSelectedBill((current) => current ?? billRows[0] ?? null)
  }, [])

  const loadNextRegistrationNumber = useCallback(async () => {
    const nextNumber = await patientService.getNextRegistrationNumber()
    setNextRegistrationNumber(nextNumber)
    setRegistrationForm((current) => ({
      ...current,
      caseNo: current.caseNo ? current.caseNo : nextNumber,
    }))
  }, [])

  const loadNextTokenNumber = useCallback(async () => {
    const nextToken = await queueService.getNextTokenNumber()
    setNextTokenNumber(nextToken)
  }, [])

  useEffect(() => {
    void loadData()
    void loadNextRegistrationNumber()
    void loadNextTokenNumber()
  }, [loadData, loadNextRegistrationNumber, loadNextTokenNumber])

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      void loadData()
      void loadNextTokenNumber()
    }, 60000)

    return () => window.clearInterval(intervalId)
  }, [loadData, loadNextTokenNumber])

  const filteredPatients = useMemo(() => {
    const query = searchText.trim().toLowerCase()
    if (!query) return patients
    return patients.filter(
      (patient) =>
        patient.fullName.toLowerCase().includes(query) ||
        patient.mobileNumber.includes(query),
    )
  }, [patients, searchText])

  const registrationFinalAmount = useMemo(
    () => Math.max(0, Number(billingForm.amount || 0) - Number(billingForm.discount || 0)),
    [billingForm.amount, billingForm.discount],
  )

  const filteredRegistrations = useMemo(() => {
    const query = registrationSearch.trim().toLowerCase()

    return registrations.filter((registration) => {
      const matchesSearch =
        !query ||
        registration.registrationNumber.toLowerCase().includes(query) ||
        registration.patientName.toLowerCase().includes(query) ||
        registration.mobileNumber.includes(query)

      const matchesDate =
        registrationDateFilter === 'all'
          ? true
          : registrationDateFilter === 'today'
            ? registration.registrationDate === registrationDateFrom
            : registration.registrationDate >= registrationDateFrom && registration.registrationDate <= registrationDateTo

      return matchesSearch && matchesDate
    })
  }, [registrations, registrationSearch, registrationDateFilter, registrationDateFrom, registrationDateTo])
  const matchedRegistration = useMemo(() => {
    const normalized = registrationSearch.trim().toLowerCase()
    if (!normalized) return null
    return registrations.find((registration) => registration.registrationNumber.toLowerCase() === normalized) ?? null
  }, [registrations, registrationSearch])
  const patientsById = useMemo(
    () => Object.fromEntries(patients.map((patient) => [patient.id, patient])),
    [patients],
  )
  function updateRegistrationForm<K extends keyof RegistrationForm>(key: K, value: RegistrationForm[K]) {
    setRegistrationForm((current) => ({ ...current, [key]: value }))
  }

  function updateTreatmentRow(index: number, key: 'date' | 'treatment' | 'payment', value: string) {
    setRegistrationForm((current) => ({
      ...current,
      treatmentRows: current.treatmentRows.map((row, rowIndex) =>
        rowIndex === index ? { ...row, [key]: value } : row,
      ),
    }))
  }

  async function persistRegistration() {
    if (!registrationForm.fullName || !registrationForm.mobileNumber || !registrationForm.age) {
      setFeedback('Please fill name, mobile, and age/sex before continuing.')
      return null
    }

    if (!/^[A-Za-z\s]+$/.test(registrationForm.fullName)) {
      setFeedback('Full name should contain letters only.')
      return null
    }

    if (!/^\d{10}$/.test(registrationForm.mobileNumber)) {
      setFeedback('Mobile number must be exactly 10 digits.')
      return null
    }

    if (!/^\d+$/.test(registrationForm.age)) {
      setFeedback('Age should contain numbers only.')
      return null
    }

    const created = await patientService.createPatient({
      fullName: registrationForm.fullName,
      mobileNumber: registrationForm.mobileNumber,
      age: Number(registrationForm.age),
      gender: registrationForm.gender,
      address: registrationForm.address,
    })

    let createdBill: BillRecord | null = null
    if (billingForm.amount && Number(billingForm.amount) > 0) {
      createdBill = await billingService.createBill({
        patientId: created.id,
        patientName: created.fullName,
        visitType: billingForm.visitType || 'Registration',
        amount: Number(billingForm.amount),
        discount: Number(billingForm.discount || 0),
        paymentMode: billingForm.paymentMode,
      })
      setSelectedBill(createdBill)
    }

    const linkedBillId = createdBill ? createdBill.id : undefined
    const linkedBillNumber = createdBill ? createdBill.billNumber : undefined
    const createdQueueEntry = await queueService.addToQueue(
      created,
      registrationForm.chiefComplaint.trim() || 'General checkup',
    )

    await registrationService.createOrUpdateRegistration({
      registrationNumber: created.registrationNumber,
      tokenNumber: createdQueueEntry.token,
      patientId: created.id,
      patientName: created.fullName,
      registrationDate: registrationForm.registrationDate,
      age: Number(registrationForm.age),
      gender: registrationForm.gender,
      maritalStatus: registrationForm.maritalStatus,
      bloodGroup: registrationForm.bloodGroup,
      dateOfBirth: registrationForm.dateOfBirth,
      occupation: registrationForm.occupation,
      address: registrationForm.address,
      mobileNumber: registrationForm.mobileNumber,
      email: registrationForm.email,
      reference: registrationForm.reference,
      chiefComplaint: registrationForm.chiefComplaint,
      dentalHistory: registrationForm.dentalHistory,
      oralExamination: registrationForm.oralExamination,
      diagnosis: registrationForm.diagnosis,
      advisedNotes: registrationForm.advisedNotes,
      findings: '',
      treatmentGiven: '',
      prescriptionNotes: '',
      followUpDate: '',
      toothNumber: '',
      procedure: '',
      doctorNotes: '',
      medicalHistory: {
        asthma: registrationForm.asthma,
        bloodPressure: registrationForm.bloodPressure,
        diabetes: registrationForm.diabetes,
        drugAllergy: registrationForm.drugAllergy,
        heartProblem: registrationForm.heartProblem,
        gastric: registrationForm.gastric,
        otherMedicalIssue: registrationForm.otherMedicalIssue,
        otherMedicalIssueDetails: registrationForm.otherMedicalIssueDetails,
      },
      advisedTreatments: {
        scaling: registrationForm.scaling,
        extraction: registrationForm.extraction,
        rootCanal: registrationForm.rootCanal,
        pedo: registrationForm.pedo,
        fpdRpdCd: registrationForm.fpdRpdCd,
        otherTreatment: registrationForm.otherTreatment,
        otherTreatmentDetails: registrationForm.otherTreatmentDetails,
      },
      treatmentRows: registrationForm.treatmentRows.filter(
        (row) => row.date.trim() || row.treatment.trim() || row.payment.trim(),
      ),
      payment: {
        visitType: billingForm.visitType || 'Clinic Visit',
        amount: Number(billingForm.amount || 0),
        discount: Number(billingForm.discount || 0),
        finalAmount: Math.max(0, Number(billingForm.amount || 0) - Number(billingForm.discount || 0)),
        paymentMode: billingForm.paymentMode,
        billId: linkedBillId,
        billNumber: linkedBillNumber,
      },
    })

    setBillingForm((current) => ({
      ...current,
      patientId: created.id,
      patientName: created.fullName,
    }))
    setRegistrationForm((current) => ({
      ...current,
      caseNo: created.registrationNumber,
    }))
    await loadData()
    await loadNextRegistrationNumber()
    await loadNextTokenNumber()
    return { patient: created, bill: createdBill, queueEntry: createdQueueEntry }
  }

  async function saveRegistration() {
    if (isSavingRegistration) return
    setIsSavingRegistration(true)
    try {
    const result = await persistRegistration()
    if (!result) return
    const refreshedNextNumber = await patientService.getNextRegistrationNumber()
    const refreshedNextToken = await queueService.getNextTokenNumber()
    setNextRegistrationNumber(refreshedNextNumber)
    setNextTokenNumber(refreshedNextToken)

    setFeedback(result.bill ? 'Registration and payment saved.' : 'Registration saved.')
    setRegistrationForm({
      ...emptyRegistrationForm,
      caseNo: refreshedNextNumber,
      registrationDate: todayString(),
      treatmentRows: defaultTreatmentRows.map((row) => ({ ...row })),
    })
    setBillingForm(emptyBillingForm)
    setRegistrationStep(1)
    setSuccessPopup({
      open: true,
      message: `OP registered successfully. Registration No: ${result.patient.registrationNumber}. Token No: ${result.queueEntry.token}`,
    })
    } finally {
      setIsSavingRegistration(false)
    }
  }

  function printRegistrationSheet(input?: { lockedRegistrationNumber?: string; lockedTokenNumber?: string; registrationRecord?: OpRegistrationRecord }) {
    if (typeof window === 'undefined') return

    const printWindow = window.open('', '_blank', 'width=1100,height=900')
    if (!printWindow) {
      setFeedback('Please allow popups to print the registration form.')
      return
    }

    const safe = (value: string) =>
      value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')

    const printableRegistration = input?.registrationRecord
    const printableCaseNo = input?.lockedRegistrationNumber ?? printableRegistration?.registrationNumber ?? registrationForm.caseNo
    const printableTokenNumber = input?.lockedTokenNumber ?? printableRegistration?.tokenNumber ?? nextTokenNumber
    const printableDate = printableRegistration?.registrationDate ?? registrationForm.registrationDate
    const printableName = printableRegistration?.patientName ?? registrationForm.fullName
    const printableAge = printableRegistration ? String(printableRegistration.age) : registrationForm.age
    const printableGender = printableRegistration?.gender ?? registrationForm.gender
    const printableMaritalStatus = printableRegistration?.maritalStatus ?? registrationForm.maritalStatus
    const printableBloodGroup = printableRegistration?.bloodGroup ?? registrationForm.bloodGroup
    const printableDob = printableRegistration?.dateOfBirth ?? registrationForm.dateOfBirth
    const printableOccupation = printableRegistration?.occupation ?? registrationForm.occupation
    const printableAddress = printableRegistration?.address ?? registrationForm.address
    const printableMobile = printableRegistration?.mobileNumber ?? registrationForm.mobileNumber
    const printableEmail = printableRegistration?.email ?? registrationForm.email
    const printableReference = printableRegistration?.reference ?? registrationForm.reference
    const printableChiefComplaint = printableRegistration?.chiefComplaint ?? registrationForm.chiefComplaint
    const printableMedicalHistory = printableRegistration?.medicalHistory ?? {
      asthma: registrationForm.asthma,
      bloodPressure: registrationForm.bloodPressure,
      diabetes: registrationForm.diabetes,
      drugAllergy: registrationForm.drugAllergy,
      heartProblem: registrationForm.heartProblem,
      gastric: registrationForm.gastric,
      otherMedicalIssue: registrationForm.otherMedicalIssue,
      otherMedicalIssueDetails: registrationForm.otherMedicalIssueDetails,
    }
    const printableDentalHistory = printableRegistration?.dentalHistory ?? registrationForm.dentalHistory
    const printableOralExamination = printableRegistration?.oralExamination ?? registrationForm.oralExamination
    const printableDiagnosis = printableRegistration?.diagnosis ?? registrationForm.diagnosis
    const printableFindings = printableRegistration?.findings ?? ''
    const printableAdvisedTreatments = printableRegistration?.advisedTreatments ?? {
      scaling: registrationForm.scaling,
      extraction: registrationForm.extraction,
      rootCanal: registrationForm.rootCanal,
      pedo: registrationForm.pedo,
      fpdRpdCd: registrationForm.fpdRpdCd,
      otherTreatment: registrationForm.otherTreatment,
      otherTreatmentDetails: registrationForm.otherTreatmentDetails,
    }
    const printableAdvisedNotes = printableRegistration?.advisedNotes ?? registrationForm.advisedNotes
    const printableTreatmentGiven = printableRegistration?.treatmentGiven ?? ''
    const printablePrescriptionNotes = printableRegistration?.prescriptionNotes ?? ''
    const printableFollowUpDate = printableRegistration?.followUpDate ?? ''
    const printableToothNumber = printableRegistration?.toothNumber ?? ''
    const printableProcedure = printableRegistration?.procedure ?? ''
    const printableDoctorNotes = printableRegistration?.doctorNotes ?? ''
    const printableTreatmentRows = printableRegistration?.treatmentRows ?? registrationForm.treatmentRows
    const printablePayment = printableRegistration?.payment ?? {
      visitType: billingForm.visitType,
      paymentMode: billingForm.paymentMode,
      amount: Number(billingForm.amount || 0),
      discount: Number(billingForm.discount || 0),
      finalAmount: registrationFinalAmount,
    }

    const checkbox = (value: boolean) => (value ? '&#9745;' : '&#9744;')
    const logoUrl = `${window.location.origin}/log.webp`
    const treatmentRowsForPrint = Array.from({ length: 30 }, (_, index) => printableTreatmentRows[index] ?? { date: '', treatment: '', payment: '' })
    const treatmentRowsHtml = treatmentRowsForPrint
      .map(
        (row) => `
          <tr>
            <td>${safe(row.date)}</td>
            <td>${safe(row.treatment)}</td>
            <td>${safe(row.payment)}</td>
          </tr>`,
      )
      .join('')
    const oralExaminationHtml = printableOralExamination.length
      ? printableOralExamination.map((entry) => `<span class="oral-chip">${safe(formatOralExamToothLabel(entry.tooth))} - ${safe(entry.finding)}</span>`).join('')
      : ['1 - Caries', '2 - Caries', '3 - Caries'].map((label) => `<span class="oral-chip muted">${safe(label)}</span>`).join('')
    const upperTeethRow = [8, 7, 6, 5, 4, 3, 2, 1, 1, 2, 3, 4, 5, 6, 7, 8].map((tooth) => `<div class="tooth">${tooth}</div>`).join('')
    const lowerTeethRow = [8, 7, 6, 5, 4, 3, 2, 1, 1, 2, 3, 4, 5, 6, 7, 8].map((tooth) => `<div class="tooth">${tooth}</div>`).join('')

    const html = `
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <title>Dhanra Dental Clinic Form</title>
    <style>
        @page { size: A4; margin: 0; }
        :root {
            --form-blue: #1D406F;
            --form-blue-soft: #EEF4FB;
            --brand-red: #D2332F;
        }
        * { box-sizing: border-box; -webkit-print-color-adjust: exact; }
        
        body { 
            margin: 0; 
            padding: 0;
            font-family: 'Segoe UI', Arial, sans-serif; 
            color: var(--form-blue);
        }

        .page {
            width: 210mm;
            height: 297mm;
            padding: 12mm;
            margin: 0 auto;
            background: white;
            page-break-after: always;
            position: relative;
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }
        .page-watermark {
            position: absolute;
            inset: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            pointer-events: none;
            z-index: 0;
        }
        .page-watermark img {
            width: 92mm;
            height: 92mm;
            object-fit: contain;
            opacity: 0.08;
        }

        /* HEADER - OUTSIDE THE BOX */
        .header-outside {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 4mm;
            padding: 0 5mm;
            position: relative;
            z-index: 1;
        }

        .brand-section { display: flex; align-items: center; gap: 14px; }
        .logo-box { 
            width: 82px; height: 92px;
            display: flex; align-items: center; justify-content: center;
            flex-shrink: 0;
        }
        .logo-box img { width: 100%; height: 100%; object-fit: contain; }
        .brand-text h1 { margin: 0; font-size: 50pt; letter-spacing: 2.4px; font-weight: 900; line-height: 1; color: var(--brand-red); font-family: 'Arial Black', 'Trebuchet MS', Arial, sans-serif; }
        .brand-text p { margin: 3px 0 0 0; font-size: 13pt; font-weight: 800; letter-spacing: 0.2px; color: var(--form-blue); }

        .doctor-details { text-align: right; font-size: 9.5pt; font-weight: bold; line-height: 1.25; color: var(--form-blue); padding-top: 10px; }
        .dr-name { font-size: 12.5pt; margin-bottom: 2px; border-bottom: 1px solid var(--form-blue); display: inline-block; }

        /* MAIN CONTENT BOX */
        .main-container-box {
            border: 2px solid var(--form-blue);
            flex-grow: 1;
            padding: 6mm;
            display: flex;
            flex-direction: column;
            position: relative;
            z-index: 1;
            background: transparent;
        }

        /* FORM STYLING */
        .row { display: flex; gap: 15px; margin-bottom: 4mm; width: 100%; align-items: flex-end; }
        .field { display: flex; align-items: flex-end; font-size: 9.5pt; font-weight: bold; }
        .line { flex-grow: 1; border-bottom: 1.5px solid var(--form-blue); min-height: 18px; margin-left: 5px; padding: 0 4px 1px; color: #111; }
        
        .case-input { border: 1.6px solid var(--form-blue); padding: 2px 8px; min-width: 120px; text-align: center; font-size: 11pt; color: #111; }
        .date-input { border: 1.6px solid var(--form-blue); width: 100px; height: 22px; padding: 2px 6px; color: #111; }

        .section-subbox { border: 1.4px solid var(--form-blue); padding: 3mm; margin-top: 3mm; }
        .section-title { font-weight: 800; font-size: 10pt; margin-bottom: 2mm; text-decoration: underline; }
        
        .complaint-lines { height: 24px; border-bottom: 1.4px solid var(--form-blue); width: 100%; margin-bottom: 10px; padding: 0 4px 1px; color: #111; }
        .single-line-field { display: flex; align-items: flex-end; gap: 6px; margin-top: 3mm; font-size: 10pt; font-weight: 800; }
        .single-line-fill { flex: 1; border-bottom: 1.4px solid var(--form-blue); min-height: 18px; padding: 0 4px 1px; color: #111; font-weight: 600; }
        .notes-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px 16px; margin: 4mm 0; }
        .notes-grid .single-line-field { margin-top: 0; }
        .notes-grid.full-width { grid-template-columns: 1fr; }

        /* CHECKBOXES */
        .check-wrap { display: flex; flex-wrap: wrap; gap: 12px; margin: 2mm 0; }
        .check-item { display: flex; align-items: center; gap: 6px; font-size: 9pt; font-weight: bold; }
        .sq { width: 13px; height: 13px; border: 1.5px solid var(--form-blue); display: flex; align-items: center; justify-content: center; font-size: 10px; line-height: 1; color: var(--form-blue); }

        /* DENTAL CHART */
        .oral-exam-title { text-align: center; font-weight: bold; font-size: 12pt; margin: 2mm 0 3mm; }
        .tooth-grid { display: grid; grid-template-columns: repeat(16, 1fr); border: 1.4px solid var(--form-blue); }
        .tooth { border: 0.8px solid var(--form-blue); height: 32px; display: flex; align-items: center; justify-content: center; font-size: 9pt; font-weight: bold; color: var(--form-blue); }
        .label-bar { background: var(--form-blue-soft); font-size: 8pt; font-weight: bold; padding: 2px 10px; border: 1.4px solid var(--form-blue); color: var(--form-blue); }
        .diagnosis-lines { margin-top: 3mm; }
        .diagnosis-line { height: 24px; border-bottom: 1.4px solid var(--form-blue); width: 100%; margin-top: 6px; padding: 0 4px 1px; color: #111; }

        /* TABLE STYLING (BACK PAGE) */
        table { width: 100%; border-collapse: collapse; margin-top: 2mm; position: relative; z-index: 1; }
        th, td { border: 1.5px solid var(--form-blue); padding: 4px 8px; text-align: left; height: 26px; }
        th { font-size: 11pt; font-weight: 800; text-transform: uppercase; }

        /* FOOTER CONSENT (FRONT ONLY) */
        .consent-footer { margin-top: auto; font-size: 7.2pt; line-height: 1.4; color: #333; padding-top: 3mm; }
        .sig-row { display: flex; justify-content: space-between; margin-top: 6mm; }
        .sig-box { border-top: 1.2px solid var(--form-blue); width: 160px; text-align: center; font-size: 8pt; font-weight: bold; padding-top: 4px; }

    </style>
</head>
<body>

    <div class="page">
        <div class="page-watermark"><img src="${logoUrl}" alt="Security watermark" /></div>
        <div class="header-outside">
            <div class="brand-section">
                <div class="logo-box"><img src="${logoUrl}" alt="Dhanra logo" /></div>
                <div class="brand-text">
                    <h1>DHANRA</h1>
                    <p>DENTAL AESTHETIC & IMPLANT CARE</p>
                </div>
            </div>
            <div class="doctor-details">
                <div class="dr-name">DR. SANKEETH K</div><br>
                B.D.S, F.D.S<br>
                IFED CERTIFIED <br>
                IMPLANTOLOGIST
            </div>
        </div>

        <div class="main-container-box">
            <div class="row">
                <div class="field">Case no: <div class="case-input">${safe(printableCaseNo)}</div></div>
                <div style="flex-grow: 1;"></div>
                <div class="field">Date: <div class="date-input">${safe(printableDate)}</div></div>
            </div>

            <div class="row">
                <div class="field" style="width: 70%;">Name: <div class="line">${safe(printableName)}</div></div>
                <div class="field" style="width: 30%;">Age/Sex: <div class="line">${safe(printableAge)} / ${safe(printableGender)}</div></div>
            </div>

            <div class="row">
                <div class="field" style="width: 33%;">Marital Status: <div class="line">${safe(printableMaritalStatus)}</div></div>
                <div class="field" style="width: 33%;">Blood group: <div class="line">${safe(printableBloodGroup)}</div></div>
                <div class="field" style="width: 33%;">Date of birth: <div class="line">${safe(printableDob)}</div></div>
            </div>

            <div class="row">
                <div class="field" style="width: 100%;">Address: <div class="line">${safe(printableAddress)}</div></div>
            </div>

            <div class="row">
                <div class="field" style="width: 34%;">Mobile no: <div class="line">${safe(printableMobile)}</div></div>
                <div class="field" style="width: 33%;">E-mail: <div class="line">${safe(printableEmail)}</div></div>
                <div class="field" style="width: 33%;">References: <div class="line">${safe(printableReference)}</div></div>
            </div>

            <div class="section-subbox">
                <div class="section-title">Chief Complaint:</div>
                <div class="complaint-lines">${safe(printableChiefComplaint)}</div>
                <div class="complaint-lines"></div>
            </div>

            <div class="section-subbox">
                <div class="section-title">Medical History:</div>
                <div class="check-wrap">
                    <div class="check-item"><div class="sq">${printableMedicalHistory.asthma ? '&#10003;' : ''}</div> Asthma</div>
                    <div class="check-item"><div class="sq">${printableMedicalHistory.bloodPressure ? '&#10003;' : ''}</div> Blood pressure</div>
                    <div class="check-item"><div class="sq">${printableMedicalHistory.diabetes ? '&#10003;' : ''}</div> Diabetes</div>
                    <div class="check-item"><div class="sq">${printableMedicalHistory.drugAllergy ? '&#10003;' : ''}</div> Drug allergy</div>
                    <div class="check-item"><div class="sq">${printableMedicalHistory.heartProblem ? '&#10003;' : ''}</div> Heart Problem</div>
                    <div class="check-item"><div class="sq">${printableMedicalHistory.gastric ? '&#10003;' : ''}</div> Gastric</div>
                </div>
                <div class="field" style="margin-top: 2mm;">Others: <div class="line">${safe(printableMedicalHistory.otherMedicalIssueDetails)}</div></div>
            </div>

            <div class="single-line-field"><span>DENTAL HISTORY:</span><span class="single-line-fill">${safe(printableDentalHistory)}</span></div>
            <div class="oral-exam-title">Oral Examination:</div>
             
            <div class="label-bar">UPPER</div>
            <div class="tooth-grid">
                <div class="tooth">8</div><div class="tooth">7</div><div class="tooth">6</div><div class="tooth">5</div><div class="tooth">4</div><div class="tooth">3</div><div class="tooth">2</div><div class="tooth">1</div>
                <div class="tooth">1</div><div class="tooth">2</div><div class="tooth">3</div><div class="tooth">4</div><div class="tooth">5</div><div class="tooth">6</div><div class="tooth">7</div><div class="tooth">8</div>
            </div>
            <div class="tooth-grid" style="border-top: none;">
                <div class="tooth">8</div><div class="tooth">7</div><div class="tooth">6</div><div class="tooth">5</div><div class="tooth">4</div><div class="tooth">3</div><div class="tooth">2</div><div class="tooth">1</div>
                <div class="tooth">1</div><div class="tooth">2</div><div class="tooth">3</div><div class="tooth">4</div><div class="tooth">5</div><div class="tooth">6</div><div class="tooth">7</div><div class="tooth">8</div>
            </div>
            <div class="label-bar">LOWER</div>

            <div class="diagnosis-lines">
                <div class="single-line-field"><span>Diagnosis:</span><span class="single-line-fill">${safe(printableDiagnosis)}</span></div>
                <div class="single-line-field"><span>Findings:</span><span class="single-line-fill">${safe(printableFindings)}</span></div>
                <div class="diagnosis-line"></div>
                <div class="diagnosis-line"></div>
            </div>

            <div class="consent-footer">
                I hereby authorise and request the performance of dental service for myself or for ____________________. I also give my consent to any advisable and necessary dental procedures, medication, or anaesthetic to be administered by the attending dentist or by the supervised staff for diagnostic purpose of dental treatment. I understand and acknowledge that I am financially responsible for the service provided for myself at the above named.
            </div>

            <div class="sig-row">
                <div class="sig-box">Age</div>
                <div class="sig-box">Patient signature</div>
            </div>
        </div>
        </div>

    <div class="page">
        <div class="page-watermark"><img src="${logoUrl}" alt="Security watermark" /></div>
        <div class="main-container-box">
            <div class="check-wrap" style="padding-bottom: 5mm;">
                <div class="check-item"><div class="sq">${printableAdvisedTreatments.scaling ? '&#10003;' : ''}</div> Scaling</div>
                <div class="check-item"><div class="sq">${printableAdvisedTreatments.extraction ? '&#10003;' : ''}</div> Extraction</div>
                <div class="check-item"><div class="sq">${printableAdvisedTreatments.rootCanal ? '&#10003;' : ''}</div> RCT</div>
                <div class="check-item"><div class="sq">${printableAdvisedTreatments.pedo ? '&#10003;' : ''}</div> Pedo</div>
                <div class="check-item"><div class="sq">${printableAdvisedTreatments.fpdRpdCd ? '&#10003;' : ''}</div> FPD/RPD/CD</div>
                <div class="check-item"><div class="sq">${printableAdvisedTreatments.otherTreatment ? '&#10003;' : ''}</div> OTHERS</div>
            </div>
            <div class="field" style="margin: 4mm 0;">Advised: <div class="line">${safe(printableAdvisedNotes)}</div></div>
            <div class="notes-grid">
                <div class="single-line-field"><span>Treatment Given:</span><span class="single-line-fill">${safe(printableTreatmentGiven)}</span></div>
                <div class="single-line-field"><span>Follow-up Date:</span><span class="single-line-fill">${safe(printableFollowUpDate)}</span></div>
                <div class="single-line-field"><span>Prescription:</span><span class="single-line-fill">${safe(printablePrescriptionNotes)}</span></div>
                <div class="single-line-field"><span>Procedure:</span><span class="single-line-fill">${safe(printableProcedure)}</span></div>
                <div class="single-line-field"><span>Tooth Number:</span><span class="single-line-fill">${safe(printableToothNumber)}</span></div>
                <div class="single-line-field"><span>Visit Type:</span><span class="single-line-fill">${safe(printablePayment.visitType)}</span></div>
            </div>
            <div class="notes-grid full-width">
                <div class="single-line-field"><span>Doctor Notes:</span><span class="single-line-fill">${safe(printableDoctorNotes)}</span></div>
            </div>

            <table>
                <thead>
                    <tr>
                        <th style="width: 18%;">Date</th>
                        <th style="width: 60%;">Treatment</th>
                        <th style="width: 22%;">Payment</th>
                    </tr>
                </thead>
                <tbody>
                    ${treatmentRowsHtml}
                </tbody>
            </table>
        </div>
    </div>

</body>
</html>
    `

    printWindow.document.open()
    printWindow.document.write(html)
    printWindow.document.close()
    setFeedback('Opening A4 print layout.')
  }

  async function saveAndPrintRegistration() {
    if (isSavingRegistration) return
    setIsSavingRegistration(true)
    try {
    const result = await persistRegistration()
    if (!result) return
    const refreshedNextNumber = await patientService.getNextRegistrationNumber()
    const refreshedNextToken = await queueService.getNextTokenNumber()
    setNextRegistrationNumber(refreshedNextNumber)
    setNextTokenNumber(refreshedNextToken)
    setFeedback(result.bill ? 'Registration saved. Opening print layout.' : 'Registration saved. Opening form print.')
    printRegistrationSheet({
      lockedRegistrationNumber: result.patient.registrationNumber,
      lockedTokenNumber: result.queueEntry.token,
    })
    setRegistrationForm({
      ...emptyRegistrationForm,
      caseNo: refreshedNextNumber,
      registrationDate: todayString(),
      treatmentRows: defaultTreatmentRows.map((row) => ({ ...row })),
    })
    setBillingForm(emptyBillingForm)
    setRegistrationStep(1)
    setSuccessPopup({
      open: true,
      message: `OP registered successfully. Registration No: ${result.patient.registrationNumber}. Token No: ${result.queueEntry.token}`,
    })
    } finally {
      setIsSavingRegistration(false)
    }
  }

  async function addExistingPatientToQueue(patient: ClinicPatient) {
    await queueService.addToQueue(patient, 'Follow-up')
    setFeedback(`${patient.fullName} added to queue.`)
    await loadData()
  }

  async function updateQueueStatus(queueId: string, status: QueueEntry['status']) {
    await queueService.updateStatus(queueId, status)
    setFeedback(`Queue status updated to ${status}.`)
    await loadData()
  }

  async function sendPatientToDoctor(queueEntry: QueueEntry) {
    if (queueEntry.status !== 'Waiting') {
      setFeedback('Only waiting tokens can be sent to doctor.')
      return
    }

    if (withDoctorToken && withDoctorToken.id !== queueEntry.id) {
      setFeedback('Please complete the current doctor token first.')
      return
    }

    await updateQueueStatus(queueEntry.id, 'With Doctor')
  }

  async function completeReceptionVisit(queueEntry: QueueEntry) {
    if (queueEntry.status !== 'With Doctor') {
      setFeedback('Only the token with doctor can be marked completed.')
      return
    }

    await updateQueueStatus(queueEntry.id, 'Done')
  }

  async function generateBill() {
    if (!billingForm.patientName || !billingForm.visitType || !billingForm.amount) {
      setFeedback('Please fill patient name, visit type, and amount.')
      return
    }

    const bill = await billingService.createBill({
      patientId: billingForm.patientId || undefined,
      patientName: billingForm.patientName,
      visitType: billingForm.visitType,
      amount: Number(billingForm.amount),
      discount: Number(billingForm.discount || 0),
      paymentMode: billingForm.paymentMode,
    })

    setSelectedBill(bill)
    setBillingForm(emptyBillingForm)
    setFeedback('Bill generated.')
    await loadData()
  }

  async function markBillPaid(billId: string) {
    const updated = await billingService.markBillPaid(billId)
    if (updated) setSelectedBill(updated)
    setFeedback('Bill marked as paid.')
    await loadData()
  }

  async function sendMessage(channel: 'sms' | 'whatsapp') {
    const patient = patients.find((item) => item.id === messagePatientId)
    if (!patient) {
      setFeedback('Please choose a patient first.')
      return
    }

    if (messageTemplate === 'appointment') {
      await (channel === 'sms'
        ? smsService.sendAppointmentReminder(patient.fullName, patient.mobileNumber, '2026-04-02', '10:30 AM')
        : whatsappService.sendAppointmentReminder(patient.fullName, patient.mobileNumber, '2026-04-02', '10:30 AM'))
    } else if (messageTemplate === 'follow-up') {
      await (channel === 'sms'
        ? smsService.sendFollowUpReminder(patient.fullName, patient.mobileNumber, '2026-04-07')
        : whatsappService.sendFollowUpReminder(patient.fullName, patient.mobileNumber, '2026-04-07'))
    } else {
      await (channel === 'sms'
        ? smsService.sendPaymentReminder(patient.fullName, patient.mobileNumber, 1500)
        : whatsappService.sendPaymentReminder(patient.fullName, patient.mobileNumber, 1500))
    }

    setFeedback(`${channel === 'sms' ? 'SMS' : 'WhatsApp'} message sent with mock handler.`)
  }

  const today = new Date().toISOString().slice(0, 10)
  const todayPatients = patients.filter((patient) => patient.lastVisit === today).length
  const waitingQueue = queue.filter((item) => item.status === 'Waiting').length
  const completedVisits = queue.filter((item) => item.status === 'Done').length
  const todayQueueRows = queue.filter((item) => item.queueDate === today)
  const pendingBills = bills.filter((bill) => bill.paidStatus === 'Pending').length
  const totalAmountGeneratedToday = bills
    .filter((bill) => bill.date === today)
    .reduce((sum, bill) => sum + bill.finalAmount, 0)
  const todayRegistrationRows = registrations.filter((registration) => registration.registrationDate === today)
  const todayRegistrationCashAmount = todayRegistrationRows
    .filter((registration) => registration.payment.paymentMode === 'Cash')
    .reduce((sum, registration) => sum + (registration.payment.finalAmount || 0), 0)
  const todayRegistrationUpiAmount = todayRegistrationRows
    .filter((registration) => registration.payment.paymentMode === 'UPI')
    .reduce((sum, registration) => sum + (registration.payment.finalAmount || 0), 0)
  const todayRegistrationCardAmount = todayRegistrationRows
    .filter((registration) => registration.payment.paymentMode === 'Card')
    .reduce((sum, registration) => sum + (registration.payment.finalAmount || 0), 0)
  const withDoctorToken = queue.find((item) => item.status === 'With Doctor') ?? null
  const waitingTokens = queue.filter((item) => item.status === 'Waiting')
  const activeTokens = queue.filter((item) => item.status !== 'Done')
  const currentToken = withDoctorToken ?? waitingTokens[0] ?? null
  const nextToken = withDoctorToken ? waitingTokens[0] ?? null : waitingTokens[1] ?? null
  const queueHistoryRows = [...todayQueueRows].sort((left, right) => right.tokenSequence - left.tokenSequence)
  const dashboardTimeLabel = new Date().toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <PortalShell
      roleLabel="Receptionist Panel"
      clinicName="Dhanra Dental Aesthetic and Implant Care"
      clinicSubtitle="Reception workflow for registrations, tokens, and OP tracking."
      title={
        initialView === 'new-registration'
          ? 'New Registration'
          : initialView === 'registration-ledger'
            ? 'OPs History'
          : initialView === 'billing'
              ? 'Billing'
              : 'Dashboard'
      }
      subtitle={
        initialView === 'new-registration'
          ? 'Fill the registration form, add payment, and print the A4 sheet.'
          : initialView === 'registration-ledger'
            ? 'Search, filter, and reprint completed registration records.'
          : initialView === 'billing'
             ? 'Generate a bill, print it, and mark paid.'
            : 'Welcome to Dhanra Dental Hospital. Manage registrations, tokens, and live OP flow from one place.'
      }
      items={[
        { label: 'Dashboard', href: '/receptionist' },
        { label: 'New Registration', href: '/receptionist/new-registration' },
        { label: 'OPs History', href: '/receptionist/registration-ledger' },
      ]}
      topRight={feedback ? <div className="w-full rounded-2xl bg-[#eef4f8] px-4 py-3 text-sm font-medium text-[#0f2f56] md:w-auto">{feedback}</div> : null}
    >
      <div className="space-y-6">
        {initialView === 'billing' ? (
          <BillingSection
            patients={patients}
            bills={bills}
            billingForm={billingForm}
            setBillingForm={setBillingForm}
            selectedBill={selectedBill}
            setSelectedBill={setSelectedBill}
            generateBill={generateBill}
            markBillPaid={markBillPaid}
          />
        ) : initialView === 'new-registration' ? (
          <RegistrationSection
            registrationStep={registrationStep}
            setRegistrationStep={setRegistrationStep}
            registrationForm={registrationForm}
            nextRegistrationNumber={nextRegistrationNumber}
            nextTokenNumber={nextTokenNumber}
            updateRegistrationForm={updateRegistrationForm}
            updateTreatmentRow={updateTreatmentRow}
            billingForm={billingForm}
            setBillingForm={setBillingForm}
            registrationFinalAmount={registrationFinalAmount}
            isSavingRegistration={isSavingRegistration}
            saveRegistration={saveRegistration}
            saveAndPrintRegistration={saveAndPrintRegistration}
            printRegistrationSheet={printRegistrationSheet}
            filteredRegistrations={filteredRegistrations}
            registrationSearch={registrationSearch}
            setRegistrationSearch={setRegistrationSearch}
            registrationDateFilter={registrationDateFilter}
            setRegistrationDateFilter={setRegistrationDateFilter}
            registrationDateFrom={registrationDateFrom}
            setRegistrationDateFrom={setRegistrationDateFrom}
            registrationDateTo={registrationDateTo}
            setRegistrationDateTo={setRegistrationDateTo}
            matchedRegistration={matchedRegistration}
          />
        ) : initialView === 'registration-ledger' ? (
          <RegistrationLedgerSection
            filteredRegistrations={filteredRegistrations}
            registrationSearch={registrationSearch}
            setRegistrationSearch={setRegistrationSearch}
            registrationDateFilter={registrationDateFilter}
            setRegistrationDateFilter={setRegistrationDateFilter}
            registrationDateFrom={registrationDateFrom}
            setRegistrationDateFrom={setRegistrationDateFrom}
            registrationDateTo={registrationDateTo}
            setRegistrationDateTo={setRegistrationDateTo}
            matchedRegistration={matchedRegistration}
            printRegistrationSheet={printRegistrationSheet}
          />
        ) : (
            <div className="space-y-6 pt-5 md:pt-8">
            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <SmallDeskCard
                title="Total OPs"
                value={todayPatients}
                helper="Registered today"
                icon={<Users size={18} />}
              />
              <SmallDeskCard
                title="Completed"
                value={completedVisits}
                helper="Treatment finished"
                icon={<CheckCircle2 size={18} />}
              />
              <SmallDeskCard
                title="Amount Collected"
                value={`Rs. ${totalAmountGeneratedToday}`}
                helper="Collected today"
                icon={<Landmark size={18} />}
                accent="blue"
              />
              <Link
                href="/receptionist/new-registration"
                className="rounded-[26px] border border-[#dbe5ef] bg-white p-5 shadow-[0_14px_35px_rgba(16,33,50,0.04)] transition hover:border-[#bfd4ea] hover:bg-[#f8fbfe]"
              >
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold text-[#6b7f94]">New Registration</div>
                  <div className="rounded-2xl bg-[#eaf2fb] p-3 text-[#153b68]">
                    <FilePlus2 size={18} />
                  </div>
                </div>
                <div className="mt-6 text-lg font-bold text-[#102132]">Open Registration Form</div>
                <div className="mt-2 text-sm leading-6 text-[#7b8ea2]">Create a fresh OP with today&apos;s token number.</div>
              </Link>
            </section>

            <section>
              <SectionCard id="live-token-board" title="Token Desk" subtitle="Current token, next patient, and quick front-desk actions.">
                <div className="grid gap-4 lg:grid-cols-2">
                  <CompactPatientCard
                    label="Current Token"
                    queueEntry={currentToken}
                    registrationNumber={currentToken ? patientsById[currentToken.patientId]?.registrationNumber ?? '--' : '--'}
                    badgeLabel={currentToken?.status ?? 'Idle'}
                    badgeTone={currentToken?.status === 'With Doctor' ? 'orange' : 'green'}
                  />
                  <CompactPatientCard
                    label="Next Patient"
                    queueEntry={nextToken}
                    registrationNumber={nextToken ? patientsById[nextToken.patientId]?.registrationNumber ?? '--' : '--'}
                    badgeLabel={nextToken?.status ?? 'Queue Empty'}
                    badgeTone="blue"
                  />
                </div>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <ActionButton
                    className="w-full sm:w-auto"
                    onClick={() => currentToken && void sendPatientToDoctor(currentToken)}
                    disabled={!currentToken || currentToken.status !== 'Waiting' || Boolean(withDoctorToken && withDoctorToken.id !== currentToken.id)}
                  >
                    <span className="inline-flex items-center gap-2">
                      <Send size={16} />
                      Send to Doctor
                    </span>
                  </ActionButton>
                  <ActionButton
                    variant="secondary"
                    className="w-full sm:w-auto"
                    onClick={() => currentToken && void completeReceptionVisit(currentToken)}
                    disabled={!currentToken || currentToken.status !== 'With Doctor'}
                  >
                    <span className="inline-flex items-center gap-2">
                      <CheckCircle2 size={16} />
                      Visit Completed
                    </span>
                  </ActionButton>
                
                </div>
              </SectionCard>
            </section>

            <SectionCard id="queue-overview" title="All Queue Records" subtitle="Today&apos;s OP queue with token, patient, status, and actions.">
              <div className="space-y-3 md:hidden">
                {queueHistoryRows.length === 0 ? (
                  <ReceptionEmptyState title="No tokens in queue." description="Today&apos;s OP queue will appear here once registrations are created." />
                ) : (
                  queueHistoryRows.map((row) => (
                    <ReceptionQueueMobileCard
                      key={row.id}
                      row={row}
                      registrationNumber={patientsById[row.patientId]?.registrationNumber ?? '--'}
                      onSend={() => void sendPatientToDoctor(row)}
                      onComplete={() => void completeReceptionVisit(row)}
                      sendDisabled={row.status !== 'Waiting' || Boolean(withDoctorToken && withDoctorToken.id !== row.id)}
                      completeDisabled={row.status !== 'With Doctor'}
                    />
                  ))
                )}
              </div>

              <div className="hidden md:block">
                <DataTable
                  rows={queueHistoryRows}
                  emptyText="No tokens in queue."
                  columns={[
                    { key: 'token', header: 'Token', render: (row) => row.token },
                    { key: 'registration', header: 'Registration No', render: (row) => patientsById[row.patientId]?.registrationNumber ?? '--' },
                    { key: 'name', header: 'Patient Name', render: (row) => row.patientName },
                    { key: 'time', header: 'Time', render: (row) => row.time },
                    { key: 'status', header: 'Status', render: (row) => <StatusBadge label={row.status} /> },
                    {
                      key: 'action',
                      header: 'Action',
                      render: (row) => (
                        <div className="flex flex-wrap gap-2">
                          <ActionButton
                            className="min-h-[40px] px-4"
                            onClick={() => void sendPatientToDoctor(row)}
                            disabled={row.status !== 'Waiting' || Boolean(withDoctorToken && withDoctorToken.id !== row.id)}
                          >
                            Send
                          </ActionButton>
                          <ActionButton
                            variant="secondary"
                            className="min-h-[40px] px-4"
                            onClick={() => void completeReceptionVisit(row)}
                            disabled={row.status !== 'With Doctor'}
                          >
                            Completed
                          </ActionButton>
                        </div>
                      ),
                    },
                  ]}
                />
              </div>
            </SectionCard>

            <ReceptionAmountSummaryCard
              totalAmount={todayRegistrationRows.reduce((sum, registration) => sum + (registration.payment.finalAmount || 0), 0)}
              cashAmount={todayRegistrationCashAmount}
              upiAmount={todayRegistrationUpiAmount}
              cardAmount={todayRegistrationCardAmount}
              helper="Showing amount details for today's OP registrations."
            />
          </div>
        )}
      </div>

      {successPopup.open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#102132]/35 px-4">
          <div className="w-full max-w-md rounded-[28px] bg-white p-6 shadow-[0_24px_80px_rgba(16,33,50,0.22)]">
            <div className="text-xl font-bold text-[#153b68]">Success</div>
            <div className="mt-3 text-base leading-7 text-[#102132]">{successPopup.message}</div>
            <div className="mt-6 flex justify-end">
              <ActionButton onClick={() => setSuccessPopup({ open: false, message: '' })}>OK</ActionButton>
            </div>
          </div>
        </div>
      ) : null}
    </PortalShell>
  )
}

function RegistrationSection({
  registrationStep,
  setRegistrationStep,
  registrationForm,
  nextRegistrationNumber,
  nextTokenNumber,
  updateRegistrationForm,
  updateTreatmentRow,
  billingForm,
  setBillingForm,
  registrationFinalAmount,
  isSavingRegistration,
  saveRegistration,
  saveAndPrintRegistration,
  printRegistrationSheet,
  filteredRegistrations,
  registrationSearch,
  setRegistrationSearch,
  registrationDateFilter,
  setRegistrationDateFilter,
  registrationDateFrom,
  setRegistrationDateFrom,
  registrationDateTo,
  setRegistrationDateTo,
  matchedRegistration,
}: {
  registrationStep: 1 | 2
  setRegistrationStep: React.Dispatch<React.SetStateAction<1 | 2>>
  registrationForm: RegistrationForm
  nextRegistrationNumber: string
  nextTokenNumber: string
  updateRegistrationForm: <K extends keyof RegistrationForm>(key: K, value: RegistrationForm[K]) => void
  updateTreatmentRow: (index: number, key: 'date' | 'treatment' | 'payment', value: string) => void
  billingForm: BillingForm
  setBillingForm: React.Dispatch<React.SetStateAction<BillingForm>>
  registrationFinalAmount: number
  isSavingRegistration: boolean
  saveRegistration: () => Promise<void>
  saveAndPrintRegistration: () => Promise<void>
  printRegistrationSheet: (input?: { lockedRegistrationNumber?: string; lockedTokenNumber?: string; registrationRecord?: OpRegistrationRecord }) => void
  filteredRegistrations: OpRegistrationRecord[]
  registrationSearch: string
  setRegistrationSearch: React.Dispatch<React.SetStateAction<string>>
  registrationDateFilter: 'today' | 'custom' | 'all'
  setRegistrationDateFilter: React.Dispatch<React.SetStateAction<'today' | 'custom' | 'all'>>
  registrationDateFrom: string
  setRegistrationDateFrom: React.Dispatch<React.SetStateAction<string>>
  registrationDateTo: string
  setRegistrationDateTo: React.Dispatch<React.SetStateAction<string>>
  matchedRegistration: OpRegistrationRecord | null
}) {
  const [stepOneError, setStepOneError] = useState('')
  const requiredFieldErrors = {
    fullName: !registrationForm.fullName.trim(),
    mobileNumber: !registrationForm.mobileNumber.trim(),
    age: !registrationForm.age.trim(),
    address: !registrationForm.address.trim(),
  }
  const missingRequiredFields = [
    requiredFieldErrors.fullName ? 'Full Name' : null,
    requiredFieldErrors.mobileNumber ? 'Mobile Number' : null,
    requiredFieldErrors.age ? 'Age' : null,
    requiredFieldErrors.address ? 'Address' : null,
  ].filter(Boolean) as string[]
  const nameValidationError =
    registrationForm.fullName && !/^[A-Za-z\s]+$/.test(registrationForm.fullName)
      ? 'Name should contain letters only.'
      : ''
  const mobileValidationError =
    registrationForm.mobileNumber && registrationForm.mobileNumber.length !== 10
      ? 'Mobile number must be exactly 10 digits.'
      : ''
  const ageValidationError =
    registrationForm.age && !/^\d+$/.test(registrationForm.age)
      ? 'Age should contain numbers only.'
      : ''

  const goToPaymentStep = () => {
    if (missingRequiredFields.length > 0) {
      setStepOneError(`Please fill the required fields: ${missingRequiredFields.join(', ')}.`)
      return
    }

    if (nameValidationError || mobileValidationError || ageValidationError) {
      setStepOneError(nameValidationError || mobileValidationError || ageValidationError)
      return
    }

    setStepOneError('')
    setRegistrationStep(2)
  }

  const toggleOralExamination = (tooth: string) => {
    const selectedFinding = registrationForm.oralExamFinding
    const exists = registrationForm.oralExamination.some((entry) => entry.tooth === tooth && entry.finding === selectedFinding)

    updateRegistrationForm(
      'oralExamination',
      exists
        ? registrationForm.oralExamination.filter((entry) => !(entry.tooth === tooth && entry.finding === selectedFinding))
        : [...registrationForm.oralExamination, { tooth, finding: selectedFinding }],
    )
  }

  const removeOralExaminationEntry = (entryToRemove: RegistrationOralExaminationEntry) => {
    updateRegistrationForm(
      'oralExamination',
      registrationForm.oralExamination.filter(
        (entry) => !(entry.tooth === entryToRemove.tooth && entry.finding === entryToRemove.finding),
      ),
    )
  }

  return (
    <SectionCard id="new-registration" title="New OP Registration" subtitle="">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <div className={`rounded-full px-4 py-2 text-sm font-semibold ${registrationStep === 1 ? 'bg-[#0f2f56] text-white' : 'bg-[#eef4f8] text-[#5b7085]'}`}>
          Step 1: Registration Form
        </div>
        <div className={`rounded-full px-4 py-2 text-sm font-semibold ${registrationStep === 2 ? 'bg-[#0f2f56] text-white' : 'bg-[#eef4f8] text-[#5b7085]'}`}>
          Step 2: Payment & Print
        </div>
      </div>

      {registrationStep === 1 ? (
        <div className="space-y-6">
          <div className="rounded-[28px] bg-[#f7fafc] p-5">
            <div className="mb-4 text-lg font-bold text-[#102132]">Quick Registration Details</div>
            <div className="mb-4 rounded-[20px] border border-[#d8e2ec] bg-white px-4 py-3">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <div className="text-sm font-semibold text-[#6b7f94]">Next Registration Number</div>
                  <div className="mt-1 text-2xl font-black tracking-[0.08em] text-[#153b68]">{nextRegistrationNumber}</div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-[#6b7f94]">Today&apos;s Next Token</div>
                  <div className="mt-1 text-2xl font-black tracking-[0.08em] text-[#153b68]">{nextTokenNumber}</div>
                </div>
              </div>
              <div className="mt-2 text-xs text-[#6b7f94]">Token numbers are created only when the OP is saved, and the counter resets fresh every day after 12:00 AM.</div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
              <LargeInput label="Full Name" required value={registrationForm.fullName} onChange={(value) => updateRegistrationForm('fullName', sanitizeNameInput(value))} error={requiredFieldErrors.fullName || Boolean(nameValidationError)} helperText={nameValidationError || 'Letters only'} />
              <LargeInput label="Mobile Number" required value={registrationForm.mobileNumber} onChange={(value) => updateRegistrationForm('mobileNumber', sanitizeMobileInput(value))} error={requiredFieldErrors.mobileNumber || Boolean(mobileValidationError)} helperText={mobileValidationError || 'Enter 10 digits'} inputMode="numeric" maxLength={10} />
              <LargeInput label="Age" required value={registrationForm.age} onChange={(value) => updateRegistrationForm('age', sanitizeAgeInput(value))} error={requiredFieldErrors.age || Boolean(ageValidationError)} helperText={ageValidationError || 'Numbers only'} inputMode="numeric" maxLength={3} />
              <LargeSelect label="Gender" value={registrationForm.gender} onChange={(value) => updateRegistrationForm('gender', value as Gender)} options={['Male', 'Female', 'Other']} />
              <LargeInput label="Address" required value={registrationForm.address} onChange={(value) => updateRegistrationForm('address', value)} error={requiredFieldErrors.address} />
            </div>
          </div>

          <div className="rounded-[28px] border-2 border-[#28408f] bg-white p-5 shadow-[0_24px_60px_rgba(15,47,86,0.08)]">
            <div className="flex flex-col gap-4 border-b-2 border-[#28408f] pb-4 md:flex-row md:items-start md:justify-between">
              <div>
                <div className="text-2xl font-black tracking-[0.14em] text-[#28408f] sm:text-3xl sm:tracking-[0.18em]">DHANRA</div>
                <div className="text-xs font-bold tracking-[0.1em] text-[#28408f] sm:text-sm sm:tracking-[0.14em]">DENTAL AESTHETIC & IMPLANT CARE</div>
              </div>
              <div className="text-left text-sm font-bold leading-6 text-[#28408f] md:text-right">
                <div>DR. SANKEETH K</div>
                <div>B.D.S, F.I.D.S</div>
                <div>IMPLENTOLOGIST</div>
              </div>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2 md:grid-cols-12">
              <div className="md:col-span-3"><PrintInput label="Registration No" value={registrationForm.caseNo || nextRegistrationNumber} onChange={() => undefined} readOnly /></div>
              <div className="md:col-span-3"><PrintInput label="Date" type="date" value={registrationForm.registrationDate} onChange={(value) => updateRegistrationForm('registrationDate', value)} /></div>
              <div className="md:col-span-3"><PrintInput label="Token No" value={nextTokenNumber} onChange={() => undefined} readOnly /></div>
              <div className="md:col-span-3"><PrintInput label="Name" required value={registrationForm.fullName} onChange={(value) => updateRegistrationForm('fullName', sanitizeNameInput(value))} error={requiredFieldErrors.fullName || Boolean(nameValidationError)} helperText={nameValidationError || 'Letters only'} /></div>
              <div className="md:col-span-3"><PrintInput label="Age" required value={registrationForm.age} onChange={(value) => updateRegistrationForm('age', sanitizeAgeInput(value))} error={requiredFieldErrors.age || Boolean(ageValidationError)} helperText={ageValidationError || 'Numbers only'} inputMode="numeric" maxLength={3} /></div>
              <div className="md:col-span-3"><LargeSelect label="Sex" value={registrationForm.gender} onChange={(value) => updateRegistrationForm('gender', value as Gender)} options={['Male', 'Female', 'Other']} /></div>
              <div className="md:col-span-3">
                <LargeSelect
                  label="Marital Status"
                  value={registrationForm.maritalStatus}
                  onChange={(value) => updateRegistrationForm('maritalStatus', value)}
                  options={['Single', 'Married', 'Divorced', 'Widowed']}
                />
              </div>
              <div className="md:col-span-3">
                <LargeSelect
                  label="Blood Group"
                  value={registrationForm.bloodGroup}
                  onChange={(value) => updateRegistrationForm('bloodGroup', value)}
                  options={['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']}
                />
              </div>
              <div className="md:col-span-4"><PrintInput label="Date of Birth" type="date" value={registrationForm.dateOfBirth} onChange={(value) => updateRegistrationForm('dateOfBirth', value)} /></div>
              <div className="md:col-span-4"><PrintInput label="Occupation" value={registrationForm.occupation} onChange={(value) => updateRegistrationForm('occupation', value)} /></div>
              <div className="md:col-span-12"><PrintInput label="Address" required value={registrationForm.address} onChange={(value) => updateRegistrationForm('address', value)} error={requiredFieldErrors.address} /></div>
              <div className="md:col-span-4"><PrintInput label="Mobile No" required value={registrationForm.mobileNumber} onChange={(value) => updateRegistrationForm('mobileNumber', sanitizeMobileInput(value))} error={requiredFieldErrors.mobileNumber || Boolean(mobileValidationError)} helperText={mobileValidationError || 'Enter 10 digits'} inputMode="numeric" maxLength={10} /></div>
              <div className="md:col-span-4"><PrintInput label="E-mail" value={registrationForm.email} onChange={(value) => updateRegistrationForm('email', value)} /></div>
              <div className="md:col-span-4"><PrintInput label="References" value={registrationForm.reference} onChange={(value) => updateRegistrationForm('reference', value)} /></div>
            </div>

            <div className="mt-6 rounded-[22px] border-2 border-[#28408f] p-4">
              <SectionLabel title="Chief Complaint" />
              <PrintTextarea value={registrationForm.chiefComplaint} onChange={(value) => updateRegistrationForm('chiefComplaint', value)} rows={3} />
            </div>

              <div className="mt-4 rounded-[22px] border-2 border-[#28408f] p-4">
                <SectionLabel title="Medical History" />
                <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                <PrintCheckbox label="Asthma" checked={registrationForm.asthma} onChange={(value) => updateRegistrationForm('asthma', value)} />
                <PrintCheckbox label="Blood pressure" checked={registrationForm.bloodPressure} onChange={(value) => updateRegistrationForm('bloodPressure', value)} />
                <PrintCheckbox label="Diabetes" checked={registrationForm.diabetes} onChange={(value) => updateRegistrationForm('diabetes', value)} />
                <PrintCheckbox label="Drug allergy" checked={registrationForm.drugAllergy} onChange={(value) => updateRegistrationForm('drugAllergy', value)} />
                <PrintCheckbox label="Heart Problem" checked={registrationForm.heartProblem} onChange={(value) => updateRegistrationForm('heartProblem', value)} />
                <PrintCheckbox label="Gastric" checked={registrationForm.gastric} onChange={(value) => updateRegistrationForm('gastric', value)} />
                <PrintCheckbox label="Others" checked={registrationForm.otherMedicalIssue} onChange={(value) => updateRegistrationForm('otherMedicalIssue', value)} />
              </div>
              <div className="mt-3">
                <PrintInput label="Other details" value={registrationForm.otherMedicalIssueDetails} onChange={(value) => updateRegistrationForm('otherMedicalIssueDetails', value)} />
              </div>
            </div>

              <div className="mt-4 rounded-[22px] border-2 border-[#28408f] p-4">
                <SectionLabel title="Dental History" />
                <LinedTextarea value={registrationForm.dentalHistory} onChange={(value) => updateRegistrationForm('dentalHistory', value)} rows={2} />
                <div className="mt-4 text-center text-xl font-extrabold text-[#28408f]">Oral Examination:</div>
                <div className="mt-4 grid gap-4 md:grid-cols-[260px_1fr] md:items-start">
                  <LargeSelect
                    label="Select Finding"
                    value={registrationForm.oralExamFinding}
                  onChange={(value) => updateRegistrationForm('oralExamFinding', value)}
                  options={oralExamFindingOptions}
                />
                
              </div>
                <div className="-mx-1 overflow-x-auto px-1">
                  <div className="min-w-[720px]">
                    <DentalChart
                      selectedFinding={registrationForm.oralExamFinding}
                      selections={registrationForm.oralExamination}
                      onToothToggle={toggleOralExamination}
                    />
                  </div>
                </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {registrationForm.oralExamination.length === 0 ? (
                  <div className="text-sm text-[#6b7f94]">No oral examination findings selected yet.</div>
                ) : (
                  registrationForm.oralExamination.map((entry) => (
                    <button
                      key={`${entry.tooth}-${entry.finding}`}
                      type="button"
                      onClick={() => removeOralExaminationEntry(entry)}
                      className="rounded-full border border-[#bfd0e3] bg-[#f5f9fd] px-3 py-1 text-sm font-medium text-[#153b68] transition hover:bg-[#edf4fb]"
                    >
                      {formatOralExamToothLabel(entry.tooth)} - {entry.finding} x
                    </button>
                  ))
                )}
              </div>
              <div className="mt-4">
                <div className="mb-2 text-sm font-semibold text-[#28408f]">Diagnosis</div>
                <LinedTextarea value={registrationForm.diagnosis} onChange={(value) => updateRegistrationForm('diagnosis', value)} rows={4} />
              </div>
            </div>

              <div className="mt-4 rounded-[22px] border-2 border-[#28408f] p-4">
              <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6">
                <PrintCheckbox label="Scaling" checked={registrationForm.scaling} onChange={(value) => updateRegistrationForm('scaling', value)} />
                <PrintCheckbox label="Extraction" checked={registrationForm.extraction} onChange={(value) => updateRegistrationForm('extraction', value)} />
                <PrintCheckbox label="RCT" checked={registrationForm.rootCanal} onChange={(value) => updateRegistrationForm('rootCanal', value)} />
                <PrintCheckbox label="Pedo" checked={registrationForm.pedo} onChange={(value) => updateRegistrationForm('pedo', value)} />
                <PrintCheckbox label="FPD/RPD/CD" checked={registrationForm.fpdRpdCd} onChange={(value) => updateRegistrationForm('fpdRpdCd', value)} />
                <PrintCheckbox label="Others" checked={registrationForm.otherTreatment} onChange={(value) => updateRegistrationForm('otherTreatment', value)} />
              </div>
              <div className="mt-3">
                <PrintInput label="Other treatment details" value={registrationForm.otherTreatmentDetails} onChange={(value) => updateRegistrationForm('otherTreatmentDetails', value)} />
              </div>
              <div className="mt-3">
                <PrintInput label="Advised" value={registrationForm.advisedNotes} onChange={(value) => updateRegistrationForm('advisedNotes', value)} />
              </div>
            </div>

              <div className="mt-4 overflow-hidden rounded-[22px] border-2 border-[#28408f]">
              <div className="overflow-x-auto">
              <table className="min-w-[640px] w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-[#f3f7fb] text-left text-[#28408f]">
                    <th className="border-b border-r border-[#28408f] px-3 py-3 font-bold">Date</th>
                    <th className="border-b border-r border-[#28408f] px-3 py-3 font-bold">Treatment</th>
                    <th className="border-b px-3 py-3 font-bold">Payment</th>
                  </tr>
                </thead>
                <tbody>
                  {registrationForm.treatmentRows.map((row, index) => (
                    <tr key={index}>
                      <td className="border-r border-t border-[#28408f] px-2 py-1"><input value={row.date} onChange={(event) => updateTreatmentRow(index, 'date', event.target.value)} className="min-h-[38px] w-full bg-transparent outline-none" /></td>
                      <td className="border-r border-t border-[#28408f] px-2 py-1"><input value={row.treatment} onChange={(event) => updateTreatmentRow(index, 'treatment', event.target.value)} className="min-h-[38px] w-full bg-transparent outline-none" /></td>
                      <td className="border-t border-[#28408f] px-2 py-1"><input value={row.payment} onChange={(event) => updateTreatmentRow(index, 'payment', event.target.value)} className="min-h-[38px] w-full bg-transparent outline-none" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            </div>
          </div>

          {stepOneError ? (
            <div className="rounded-[18px] border border-[#f3c7c1] bg-[#fff5f2] px-4 py-3 text-sm font-medium text-[#b14d41]">
              {stepOneError}
            </div>
          ) : null}
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <ActionButton className="w-full sm:w-auto" onClick={goToPaymentStep}>Next: Payment</ActionButton>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <LargeInput label="Patient Name" value={registrationForm.fullName} onChange={(value) => updateRegistrationForm('fullName', value)} />
            <LargeSelect
              label="Visit Type"
              value={billingForm.visitType}
              onChange={(value) => setBillingForm((current) => ({ ...current, visitType: value }))}
              options={['Clinic Visit', 'Door Step Dentistry']}
            />
            <LargeInput label="Amount" value={billingForm.amount} onChange={(value) => setBillingForm((current) => ({ ...current, amount: value }))} />
            <LargeSelect label="Payment Mode" value={billingForm.paymentMode} onChange={(value) => setBillingForm((current) => ({ ...current, paymentMode: value as BillingPaymentMode }))} options={['Cash', 'UPI', 'Card']} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[24px] bg-[#f7fafc] p-5">
              <div className="text-sm font-semibold text-[#6b7f94]">Registration Summary</div>
              <div className="mt-3 space-y-2 text-sm text-[#102132]">
                <div><span className="font-semibold">Case No:</span> {registrationForm.caseNo || 'Auto/manual'}</div>
                <div><span className="font-semibold">Token No:</span> {nextTokenNumber}</div>
                <div><span className="font-semibold">Patient:</span> {registrationForm.fullName || 'Not filled'}</div>
                <div><span className="font-semibold">Mobile:</span> {registrationForm.mobileNumber || 'Not filled'}</div>
                <div><span className="font-semibold">Date:</span> {registrationForm.registrationDate}</div>
              </div>
            </div>
            <div className="rounded-[24px] bg-[#f7fafc] p-5">
              <div className="text-sm font-semibold text-[#6b7f94]">Payment Preview</div>
              <div className="mt-3 space-y-2 text-sm text-[#102132]">
                <div><span className="font-semibold">Visit Type:</span> {billingForm.visitType}</div>
                <div><span className="font-semibold">Mode:</span> {billingForm.paymentMode}</div>
                <div><span className="font-semibold">Amount:</span> Rs. {billingForm.amount || 0}</div>
                <div><span className="font-semibold">Final:</span> Rs. {registrationFinalAmount}</div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <ActionButton className="w-full sm:w-auto" variant="secondary" onClick={() => setRegistrationStep(1)} disabled={isSavingRegistration}>Back to Form</ActionButton>
            <ActionButton className="w-full sm:w-auto" variant="ghost" onClick={() => void saveRegistration()} disabled={isSavingRegistration}>
              {isSavingRegistration ? 'Saving...' : 'Save Registration'}
            </ActionButton>
            <ActionButton className="w-full sm:w-auto" onClick={() => void saveAndPrintRegistration()} disabled={isSavingRegistration}>
              {isSavingRegistration ? 'Saving...' : 'Save & Print A4 Form'}
            </ActionButton>
            <ActionButton className="w-full sm:w-auto" variant="success" onClick={() => printRegistrationSheet()} disabled={isSavingRegistration}>Print Preview Only</ActionButton>
          </div>
        </div>
      )}

    </SectionCard>
  )
}

function ReceptionAmountSummaryCard({
  totalAmount,
  cashAmount,
  upiAmount,
  cardAmount,
  helper,
}: {
  totalAmount: number
  cashAmount: number
  upiAmount: number
  cardAmount: number
  helper: string
}) {
  const modeRows = [
    { label: 'Cash', value: cashAmount, color: 'bg-[#153b68]' },
    { label: 'UPI', value: upiAmount, color: 'bg-[#2c6e63]' },
    { label: 'Card', value: cardAmount, color: 'bg-[#9a6a2f]' },
  ]
  const largestModeAmount = Math.max(totalAmount, cashAmount, upiAmount, cardAmount, 1)

  return (
    <div className="overflow-hidden rounded-[26px] border border-[#dbe5ef] bg-white shadow-[0_16px_34px_rgba(15,47,86,0.06)]">
      <div className="flex items-start justify-between gap-4 border-b border-[#edf3f8] bg-[linear-gradient(135deg,#f8fbfe_0%,#eef4fb_100%)] px-4 py-4 md:px-5">
        <div>
          <div className="text-sm font-semibold text-[#5f7287]">Amount Details</div>
          <div className="mt-1 text-xs leading-5 text-[#7b8ea2]">{helper}</div>
        </div>
        <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-[#153b68] shadow-[0_10px_20px_rgba(15,47,86,0.08)] md:h-11 md:w-11">
          <Landmark size={18} />
        </div>
      </div>
      <div className="grid gap-4 px-4 py-4 md:px-5 md:py-5 xl:grid-cols-[1.15fr_1.35fr]">
        <div className="rounded-[24px] bg-[linear-gradient(135deg,#153b68_0%,#21497c_55%,#2c5d98_100%)] px-4 py-4 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] md:px-5 md:py-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[#d7e5f5]">Total Collected</div>
              <div className="mt-2 text-3xl font-bold md:text-4xl">Rs. {totalAmount}</div>
            </div>
            <div className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-[#e5eef8]">
              Today
            </div>
          </div>
          <div className="mt-6">
            <div className="h-3 overflow-hidden rounded-full bg-white/15">
              <div
                className="h-full rounded-full bg-white/90 transition-all"
                style={{ width: `${Math.min(100, Math.max(8, (totalAmount / largestModeAmount) * 100))}%` }}
              />
            </div>
            <div className="mt-2 text-sm text-[#d7e5f5]">Overall collection for today&apos;s reception OP list.</div>
          </div>
        </div>
        <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-1">
          {modeRows.map((mode) => (
            <ReceptionAmountModePill
              key={mode.label}
              label={mode.label}
              value={mode.value}
              percentage={Math.round((mode.value / largestModeAmount) * 100)}
              colorClass={mode.color}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function ReceptionAmountModePill({
  label,
  value,
  percentage,
  colorClass,
}: {
  label: string
  value: number
  percentage: number
  colorClass: string
}) {
  return (
    <div className="rounded-[20px] border border-[#e3ebf4] bg-[#f8fbfe] px-4 py-4">
      <div className="flex items-center justify-between gap-3">
        <div className="text-xs font-semibold uppercase tracking-[0.12em] text-[#7b8ea2]">{label}</div>
        <div className="text-xs font-semibold text-[#7b8ea2]">{percentage}%</div>
      </div>
      <div className="mt-2 text-2xl font-bold text-[#102132]">Rs. {value}</div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#dde7f1]">
        <div
          className={`h-full rounded-full transition-all ${colorClass}`}
          style={{ width: `${Math.min(100, Math.max(value > 0 ? 10 : 0, percentage))}%` }}
        />
      </div>
    </div>
  )
}

function RegistrationLedgerSection({
  filteredRegistrations,
  registrationSearch,
  setRegistrationSearch,
  registrationDateFilter,
  setRegistrationDateFilter,
  registrationDateFrom,
  setRegistrationDateFrom,
  registrationDateTo,
  setRegistrationDateTo,
  matchedRegistration,
  printRegistrationSheet,
}: {
  filteredRegistrations: OpRegistrationRecord[]
  registrationSearch: string
  setRegistrationSearch: React.Dispatch<React.SetStateAction<string>>
  registrationDateFilter: 'today' | 'custom' | 'all'
  setRegistrationDateFilter: React.Dispatch<React.SetStateAction<'today' | 'custom' | 'all'>>
  registrationDateFrom: string
  setRegistrationDateFrom: React.Dispatch<React.SetStateAction<string>>
  registrationDateTo: string
  setRegistrationDateTo: React.Dispatch<React.SetStateAction<string>>
  matchedRegistration: OpRegistrationRecord | null
  printRegistrationSheet: (input?: { lockedRegistrationNumber?: string; lockedTokenNumber?: string; registrationRecord?: OpRegistrationRecord }) => void
}) {
  function handleRegistrationDateFilterChange(value: 'today' | 'custom' | 'all') {
    const today = todayString()

    setRegistrationDateFilter(value)

    if (value === 'today') {
      setRegistrationDateFrom(today)
      setRegistrationDateTo(today)
    }
  }

  function handleRegistrationDateFromChange(value: string) {
    setRegistrationDateFrom(value)
    setRegistrationDateFilter('custom')
  }

  function handleRegistrationDateToChange(value: string) {
    setRegistrationDateTo(value)
    setRegistrationDateFilter('custom')
  }

  return (
    <SectionCard id="registration-ledger" title="OP Registration Ledger" subtitle="Saved OP applications with date filter, search, and reprint support.">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div className="text-sm text-[#6b7f94]">Search and reprint saved OP registration applications.</div>
        <div className="text-sm font-semibold text-[#153b68]">Showing: {filteredRegistrations.length} records</div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <LargeInput label="Search" value={registrationSearch} onChange={setRegistrationSearch} />
        <LargeSelect
          label="Date Filter"
          value={registrationDateFilter}
          onChange={(value) => handleRegistrationDateFilterChange(value as 'today' | 'custom' | 'all')}
          options={['today', 'custom', 'all']}
          optionLabel={(option) => option === 'today' ? 'Today' : option === 'custom' ? 'Custom Range' : 'All'}
        />
        <PrintInput label="From Date" type="date" value={registrationDateFrom} onChange={handleRegistrationDateFromChange} />
        <PrintInput label="To Date" type="date" value={registrationDateTo} onChange={handleRegistrationDateToChange} />
        <div className="flex items-end">
          <ActionButton variant="secondary" className="w-full" onClick={() => {
            const today = new Date().toISOString().slice(0, 10)
            setRegistrationSearch('')
            setRegistrationDateFilter('today')
            setRegistrationDateFrom(today)
            setRegistrationDateTo(today)
          }}>
            Reset Filters
          </ActionButton>
        </div>
      </div>

      {matchedRegistration ? (
        <div className="mt-5 rounded-[24px] bg-[#f2f7fb] p-5">
          <div className="text-sm font-semibold text-[#6b7f94]">Registration Number Match</div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 md:grid-cols-4 text-sm text-[#102132]">
            <div><span className="font-semibold">Registration No:</span> {matchedRegistration.registrationNumber}</div>
            <div><span className="font-semibold">Token No:</span> {matchedRegistration.tokenNumber || '--'}</div>
            <div><span className="font-semibold">Name:</span> {matchedRegistration.patientName}</div>
            <div><span className="font-semibold">Mobile:</span> {matchedRegistration.mobileNumber}</div>
            <div><span className="font-semibold">Date:</span> {matchedRegistration.registrationDate}</div>
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <ActionButton onClick={() => printRegistrationSheet({ registrationRecord: matchedRegistration })}>Print Application</ActionButton>
          </div>
        </div>
      ) : null}

      <div className="mt-5 md:hidden">
        <div className="space-y-3">
          {filteredRegistrations.length === 0 ? (
            <ReceptionEmptyState title="No saved OP registrations found." description="Saved applications will appear here after registration." />
          ) : (
            filteredRegistrations.map((row) => (
              <ReceptionRegistrationMobileCard
                key={row.id}
                row={row}
                onPrint={() => printRegistrationSheet({ registrationRecord: row })}
              />
            ))
          )}
        </div>
      </div>

      <div className="mt-5 hidden md:block">
        <DataTable
          rows={filteredRegistrations}
          emptyText="No saved OP registrations found."
          columns={[
            { key: 'registrationNumber', header: 'Registration No', render: (row) => row.registrationNumber },
            { key: 'tokenNumber', header: 'Token No', render: (row) => row.tokenNumber || '--' },
            { key: 'name', header: 'Name', render: (row) => row.patientName },
            { key: 'mobile', header: 'Mobile Number', render: (row) => row.mobileNumber },
            { key: 'date', header: 'Date', render: (row) => row.registrationDate },
            {
              key: 'action',
              header: 'Application',
              render: (row) => (
                <ActionButton variant="secondary" className="min-h-[40px] px-4" onClick={() => printRegistrationSheet({ registrationRecord: row })}>
                  Print Application
                </ActionButton>
              ),
            },
          ]}
        />
      </div>
    </SectionCard>
  )
}

function BillingSection({
  patients,
  bills,
  billingForm,
  setBillingForm,
  selectedBill,
  setSelectedBill,
  generateBill,
  markBillPaid,
}: {
  patients: ClinicPatient[]
  bills: BillRecord[]
  billingForm: BillingForm
  setBillingForm: React.Dispatch<React.SetStateAction<BillingForm>>
  selectedBill: BillRecord | null
  setSelectedBill: React.Dispatch<React.SetStateAction<BillRecord | null>>
  generateBill: () => Promise<void>
  markBillPaid: (billId: string) => Promise<void>
}) {
  const finalAmountPreview = Math.max(0, Number(billingForm.amount || 0) - Number(billingForm.discount || 0))

  return (
    <SectionCard id="billing" title="Billing" subtitle="Generate a bill, print it, and mark paid.">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
        <LargeSelect
          label="Patient Name"
          value={billingForm.patientId}
          onChange={(value) => {
            const patient = patients.find((item) => item.id === value)
            setBillingForm((current) => ({ ...current, patientId: value, patientName: patient?.fullName ?? current.patientName }))
          }}
          options={patients.map((patient) => `${patient.id}|${patient.fullName}`)}
          optionLabel={(option) => option.split('|')[1]}
          optionValue={(option) => option.split('|')[0]}
        />
        <LargeInput label="Visit Type" value={billingForm.visitType} onChange={(value) => setBillingForm((current) => ({ ...current, visitType: value }))} />
        <LargeInput label="Amount" value={billingForm.amount} onChange={(value) => setBillingForm((current) => ({ ...current, amount: value }))} />
        <LargeInput label="Discount" value={billingForm.discount} onChange={(value) => setBillingForm((current) => ({ ...current, discount: value }))} />
        <div className="rounded-[24px] bg-[#f7fafc] p-4">
          <div className="text-sm font-medium text-[#6b7f94]">Final Amount</div>
          <div className="mt-3 text-3xl font-bold text-[#102132]">Rs. {finalAmountPreview}</div>
        </div>
        <LargeSelect label="Payment Mode" value={billingForm.paymentMode} onChange={(value) => setBillingForm((current) => ({ ...current, paymentMode: value as BillingPaymentMode }))} options={['Cash', 'UPI', 'Card']} />
      </div>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <ActionButton className="w-full sm:w-auto" onClick={() => void generateBill()}>Generate Bill</ActionButton>
        {selectedBill ? (
          <>
            <ActionButton className="w-full sm:w-auto" variant="secondary" onClick={() => setSelectedBill(selectedBill)}>Print Bill</ActionButton>
            <ActionButton className="w-full sm:w-auto" variant="success" onClick={() => void markBillPaid(selectedBill.id)}>Mark Paid</ActionButton>
          </>
        ) : null}
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div>
          <div className="space-y-3 md:hidden">
            {bills.length === 0 ? (
              <ReceptionEmptyState title="No bills yet." description="Generated bills will appear here for printing and payment tracking." />
            ) : (
              bills.map((bill) => (
                <ReceptionBillMobileCard key={bill.id} bill={bill} onOpen={() => setSelectedBill(bill)} />
              ))
            )}
          </div>

          <div className="hidden md:block">
            <DataTable
              rows={bills}
              emptyText="No bills yet."
              columns={[
                { key: 'name', header: 'Patient Name', render: (bill) => bill.patientName },
                { key: 'visit', header: 'Visit Type', render: (bill) => bill.visitType },
                { key: 'amount', header: 'Final Amount', render: (bill) => `Rs. ${bill.finalAmount}` },
                { key: 'mode', header: 'Payment Mode', render: (bill) => bill.paymentMode },
                { key: 'status', header: 'Paid Status', render: (bill) => <StatusBadge label={bill.paidStatus} /> },
                { key: 'action', header: 'Action', render: (bill) => <ActionButton variant="ghost" className="min-h-[40px] px-4" onClick={() => setSelectedBill(bill)}>Open Bill</ActionButton> },
              ]}
            />
          </div>
        </div>
        {selectedBill ? <BillPrintCard bill={selectedBill} clinicName="Clinic Name Placeholder" /> : null}
      </div>
    </SectionCard>
  )
}

function LargeInput({
  label,
  value,
  onChange,
  icon,
  required = false,
  error = false,
  helperText,
  inputMode,
  maxLength,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  icon?: React.ReactNode
  required?: boolean
  error?: boolean
  helperText?: string
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode']
  maxLength?: number
}) {
  return (
    <label className="block">
      <div className="mb-2 text-sm font-semibold text-[#4f6277]">{label}{required ? <span className="ml-1 text-[#d84c47]">*</span> : null}</div>
      <div className={`flex min-h-[56px] items-center gap-3 rounded-[22px] border px-4 ${error ? 'border-[#efb5af] bg-[#fff8f6]' : 'border-[#dce6ef] bg-[#f9fbfd]'}`}>
        {icon}
        <input value={value} inputMode={inputMode} maxLength={maxLength} onChange={(event) => onChange(event.target.value)} className="w-full bg-transparent text-base outline-none" />
      </div>
      {helperText ? <div className={`mt-2 text-xs ${error ? 'text-[#c5534c]' : 'text-[#7b8ea2]'}`}>{helperText}</div> : null}
    </label>
  )
}

function LargeSelect({
  label,
  value,
  onChange,
  options,
  optionLabel,
  optionValue,
  required = false,
  error = false,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  options: string[]
  optionLabel?: (option: string) => string
  optionValue?: (option: string) => string
  required?: boolean
  error?: boolean
}) {
  return (
    <label className="block">
      <div className="mb-2 text-sm font-semibold text-[#4f6277]">{label}{required ? <span className="ml-1 text-[#d84c47]">*</span> : null}</div>
      <select value={value} onChange={(event) => onChange(event.target.value)} className={`min-h-[56px] w-full rounded-[22px] border px-4 text-base outline-none ${error ? 'border-[#efb5af] bg-[#fff8f6]' : 'border-[#dce6ef] bg-[#f9fbfd]'}`}>
        <option value="">Select</option>
        {options.map((option) => (
          <option key={option} value={optionValue ? optionValue(option) : option}>
            {optionLabel ? optionLabel(option) : option}
          </option>
        ))}
      </select>
    </label>
  )
}

function PrintInput({
  label,
  value,
  onChange,
  type = 'text',
  readOnly = false,
  required = false,
  error = false,
  helperText,
  inputMode,
  maxLength,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  type?: 'text' | 'date'
  readOnly?: boolean
  required?: boolean
  error?: boolean
  helperText?: string
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode']
  maxLength?: number
}) {
  return (
    <label className="block">
      <div className="mb-2 text-sm font-semibold text-[#28408f]">{label}{required ? <span className="ml-1 text-[#d84c47]">*</span> : null}</div>
      <input
        type={type}
        value={value}
        readOnly={readOnly}
        inputMode={inputMode}
        maxLength={maxLength}
        onChange={(event) => onChange(event.target.value)}
        className={`min-h-[52px] w-full rounded-[18px] border px-4 text-base text-[#102132] outline-none ${readOnly ? 'border-[#9fb1db] bg-[#f2f6fb] font-semibold tracking-[0.04em]' : error ? 'border-[#efb5af] bg-[#fff8f6]' : 'border-[#9fb1db] bg-[#fbfdff]'}`}
      />
      {helperText ? <div className={`mt-2 text-xs ${error ? 'text-[#c5534c]' : 'text-[#5f7287]'}`}>{helperText}</div> : null}
    </label>
  )
}

function PrintTextarea({
  value,
  onChange,
  rows,
  required = false,
  error = false,
}: {
  value: string
  onChange: (value: string) => void
  rows: number
  required?: boolean
  error?: boolean
}) {
  return (
    <div>
      {required ? <div className="mb-2 text-sm font-semibold text-[#28408f]">Required<span className="ml-1 text-[#d84c47]">*</span></div> : null}
      <textarea
        rows={rows}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`w-full rounded-[18px] border px-4 py-3 text-base text-[#102132] outline-none ${error ? 'border-[#efb5af] bg-[#fff8f6]' : 'border-[#9fb1db] bg-[#fbfdff]'}`}
      />
    </div>
  )
}

function LinedTextarea({
  value,
  onChange,
  rows,
}: {
  value: string
  onChange: (value: string) => void
  rows: number
}) {
  return (
    <textarea
      rows={rows}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="w-full rounded-[18px] border border-[#9fb1db] px-4 py-3 text-base text-[#102132] outline-none [background-image:linear-gradient(to_bottom,transparent_calc(100%-2px),#c8d6eb_calc(100%-2px))] [background-size:100%_2.25rem] bg-[#fbfdff]"
      style={{ lineHeight: '2.25rem' }}
    />
  )
}

function SectionLabel({ title, required = false }: { title: string; required?: boolean }) {
  return <div className="mb-3 text-sm font-extrabold uppercase tracking-[0.12em] text-[#28408f]">{title}{required ? <span className="ml-1 text-[#d84c47]">*</span> : null}</div>
}

function PrintCheckbox({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}) {
  return (
    <label className="flex items-center gap-3 rounded-[16px] border border-[#d7e0f3] bg-[#f8fbff] px-3 py-3 text-sm font-medium text-[#102132]">
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="h-4 w-4 accent-[#28408f]" />
      <span>{label}</span>
    </label>
  )
}

function DentalChart({
  selectedFinding,
  selections,
  onToothToggle,
}: {
  selectedFinding: string
  selections: RegistrationOralExaminationEntry[]
  onToothToggle: (tooth: string) => void
}) {
  const chartNumbers = ['8', '7', '6', '5', '4', '3', '2', '1', '1', '2', '3', '4', '5', '6', '7', '8']
  const upperChartCells = chartNumbers.map((label, index) => ({ id: `upper-${index + 1}`, label }))
  const lowerChartCells = chartNumbers.map((label, index) => ({ id: `lower-${index + 1}`, label }))

  const isSelected = (tooth: string) =>
    selections.some((entry) => entry.tooth === tooth && entry.finding === selectedFinding)

  const renderToothButton = (cell: { id: string; label: string }) => (
    <button
      key={cell.id}
      type="button"
      onClick={() => onToothToggle(cell.id)}
      className={`min-h-[48px] border-r border-[#28408f] text-sm font-bold transition ${
        isSelected(cell.id)
          ? 'bg-[#28408f] text-white'
          : 'bg-white text-[#28408f] hover:bg-[#f3f7fb]'
      }`}
      title={`${cell.label} - ${selectedFinding}`}
    >
      <div>{cell.label}</div>
    </button>
  )

  return (
    <div className="mt-4 overflow-hidden rounded-[18px] border-2 border-[#28408f]">
      <div className="border-b border-[#28408f] px-5 py-2 text-sm font-extrabold uppercase tracking-[0.16em] text-[#28408f]">
        Upper
      </div>
      <div className="grid border-b border-[#28408f]" style={{ gridTemplateColumns: 'repeat(16, minmax(0, 1fr))' }}>
        {chartNumbers.map((_, index) => (
          <div key={`top-empty-${index}`} className="min-h-[34px] border-r border-[#28408f] bg-white last:border-r-0" />
        ))}
      </div>
      <div className="grid border-b border-[#28408f]" style={{ gridTemplateColumns: 'repeat(16, minmax(0, 1fr))' }}>
        {upperChartCells.map(renderToothButton)}
      </div>
      <div className="grid border-b border-[#28408f]" style={{ gridTemplateColumns: 'repeat(16, minmax(0, 1fr))' }}>
        {lowerChartCells.map(renderToothButton)}
      </div>
      <div className="grid" style={{ gridTemplateColumns: 'repeat(16, minmax(0, 1fr))' }}>
        {chartNumbers.map((_, index) => (
          <div key={`bottom-empty-${index}`} className="min-h-[34px] border-r border-[#28408f] bg-white last:border-r-0" />
        ))}
      </div>
      <div className="border-t border-[#28408f] px-5 py-2 text-sm font-extrabold uppercase tracking-[0.16em] text-[#28408f]">
        Lower
      </div>
    </div>
  )
}

function DashboardMetricCard({
  title,
  value,
  helper,
  icon,
}: {
  title: string
  value: string | number
  helper: string
  icon: React.ReactNode
}) {
  return (
    <div className="rounded-[26px] border border-[#dbe5ef] bg-white p-5 shadow-[0_14px_35px_rgba(16,33,50,0.04)]">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold text-[#6b7f94]">{title}</div>
        <div className="text-[#153b68]">{icon}</div>
      </div>
      <div className="mt-4 text-4xl font-black text-[#102132]">{value}</div>
      <div className="mt-2 max-w-[18ch] text-sm leading-6 text-[#7b8ea2]">{helper}</div>
    </div>
  )
}

function SmallDeskCard({
  title,
  value,
  helper,
  icon,
  accent = 'default',
}: {
  title: string
  value: string | number
  helper: string
  icon: React.ReactNode
  accent?: 'default' | 'blue'
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-[28px] border p-5 shadow-[0_18px_45px_rgba(16,33,50,0.08)] transition ${
        accent === 'blue'
          ? 'border-[#b9d3ef] bg-[linear-gradient(135deg,#eef7ff_0%,#ffffff_58%,#f7fbff_100%)]'
          : 'border-[#dbe5ef] bg-[linear-gradient(135deg,#ffffff_0%,#fbfdff_100%)]'
      }`}
    >
      <div
        className={`absolute inset-x-0 top-0 h-1 ${
          accent === 'blue'
            ? 'bg-[linear-gradient(90deg,#2f80ed_0%,#56ccf2_100%)]'
            : 'bg-[linear-gradient(90deg,#153b68_0%,#8fb7de_100%)]'
        }`}
      />
      <div
        className={`absolute -right-8 -top-8 h-24 w-24 rounded-full blur-2xl ${
          accent === 'blue' ? 'bg-[#d7ecff]' : 'bg-[#eef5fb]'
        }`}
      />
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold text-[#6b7f94]">{title}</div>
        <div
          className={`rounded-2xl p-3 text-[#153b68] ${
            accent === 'blue'
              ? 'bg-[linear-gradient(135deg,#dff1ff_0%,#eef7ff_100%)]'
              : 'bg-[linear-gradient(135deg,#edf4fb_0%,#f7fbff_100%)]'
          }`}
        >
          {icon}
        </div>
      </div>
      <div className="mt-5 text-4xl font-black text-[#102132]">{value}</div>
      <div className="mt-2 text-sm leading-6 text-[#7b8ea2]">{helper}</div>
    </div>
  )
}

function CompactPatientCard({
  label,
  queueEntry,
  registrationNumber,
  badgeLabel,
  badgeTone,
}: {
  label: string
  queueEntry: QueueEntry | null
  registrationNumber: string
  badgeLabel: string
  badgeTone: 'green' | 'orange' | 'blue'
}) {
  const badgeStyle =
    badgeTone === 'green'
      ? 'bg-[#e7f8ef] text-[#147a49]'
      : badgeTone === 'orange'
        ? 'bg-[#fff0e4] text-[#c25b12]'
        : 'bg-[#edf4fb] text-[#24558a]'
  const cardStyle =
    badgeTone === 'orange'
      ? 'border-[#f5c9ab] bg-[linear-gradient(180deg,#fff6ef_0%,#fffdfb_100%)] shadow-[0_16px_40px_rgba(194,91,18,0.10)]'
      : badgeTone === 'blue'
        ? 'border-[#294f7d] bg-[#183b67] shadow-[0_18px_42px_rgba(24,59,103,0.22)]'
        : 'border-[#dbe5ef] bg-[linear-gradient(180deg,#ffffff_0%,#fbfdff_100%)] shadow-[0_16px_40px_rgba(16,33,50,0.05)]'
  const labelStyle =
    badgeTone === 'orange'
      ? 'text-[#b7621f]'
      : badgeTone === 'blue'
        ? 'text-[#d9e8fb]'
        : 'text-[#6b7f94]'
  const tokenStyle =
    badgeTone === 'orange'
      ? 'text-[#b7621f]'
      : badgeTone === 'blue'
        ? 'text-white'
        : 'text-[#153b68]'
  const iconStyle =
    badgeTone === 'orange'
      ? 'text-[#b7621f]'
      : badgeTone === 'blue'
        ? 'text-[#d9e8fb]'
        : 'text-[#153b68]'
  const contentTone = badgeTone === 'blue' ? 'text-[#d9e8fb]' : 'text-[#5f7287]'
  const nameTone = badgeTone === 'blue' ? 'text-white' : 'text-[#102132]'

  return (
    <div className={`rounded-[26px] border p-5 ${cardStyle}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className={`text-xs font-bold uppercase tracking-[0.22em] ${labelStyle}`}>{label}</div>
          <div className={`mt-4 text-4xl font-black tracking-[0.12em] ${tokenStyle}`}>{queueEntry?.token ?? '--'}</div>
        </div>
        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] ${badgeStyle}`}>
          {badgeLabel}
        </span>
      </div>
      <div className="mt-5 space-y-3 text-sm text-[#5f7287]">
        <div className="flex items-center gap-3">
          <UserRound size={16} className={iconStyle} />
          <span className={`font-semibold ${nameTone}`}>{queueEntry?.patientName ?? 'No patient selected'}</span>
        </div>
        <div className={`flex items-center gap-3 ${contentTone}`}>
          <Clock3 size={16} className={iconStyle} />
          <span>{queueEntry?.time ?? '--'}</span>
        </div>
        <div className={`flex items-center gap-3 ${contentTone}`}>
          <Stethoscope size={16} className={iconStyle} />
          <span>{registrationNumber}</span>
        </div>
      </div>
    </div>
  )
}

function CompactStatCard({
  title,
  value,
  helper,
  icon,
}: {
  title: string
  value: string | number
  helper: string
  icon: React.ReactNode
}) {
  return (
    <div className="rounded-[26px] border border-[#dbe5ef] bg-white p-5 shadow-[0_14px_35px_rgba(16,33,50,0.04)]">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold text-[#6b7f94]">{title}</div>
        <div className="text-[#153b68]">{icon}</div>
      </div>
      <div className="mt-4 text-4xl font-black text-[#102132]">{value}</div>
      <div className="mt-2 text-sm text-[#7b8ea2]">{helper}</div>
    </div>
  )
}

function ReceptionEmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-[24px] border border-dashed border-[#d3e0eb] bg-[#f8fbfe] px-5 py-7">
      <div className="text-lg font-bold text-[#102132]">{title}</div>
      <div className="mt-2 text-sm leading-6 text-[#6b7f94]">{description}</div>
    </div>
  )
}

function ReceptionInfoTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[18px] bg-[#f8fbfe] px-3 py-3">
      <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#7b8ea2]">{label}</div>
      <div className="mt-1 text-sm font-semibold text-[#102132]">{value}</div>
    </div>
  )
}

function ReceptionQueueMobileCard({
  row,
  registrationNumber,
  onSend,
  onComplete,
  sendDisabled,
  completeDisabled,
}: {
  row: QueueEntry
  registrationNumber: string
  onSend: () => void
  onComplete: () => void
  sendDisabled: boolean
  completeDisabled: boolean
}) {
  return (
    <div className="rounded-[24px] border border-[#dbe5ef] bg-white p-4 shadow-[0_12px_30px_rgba(15,47,86,0.05)]">
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="text-base font-bold text-[#102132]">{row.patientName}</div>
            <div className="mt-1 text-sm text-[#6b7f94]">{registrationNumber}</div>
          </div>
          <div className="sm:pt-1">
            <StatusBadge label={row.status} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <ReceptionInfoTile label="Token" value={row.token} />
          <ReceptionInfoTile label="Time" value={row.time} />
        </div>
        <div className="flex flex-col gap-2">
          <ActionButton className="w-full" onClick={onSend} disabled={sendDisabled}>Send</ActionButton>
          <ActionButton className="w-full" variant="secondary" onClick={onComplete} disabled={completeDisabled}>Completed</ActionButton>
        </div>
      </div>
    </div>
  )
}

function ReceptionRegistrationMobileCard({
  row,
  onPrint,
}: {
  row: OpRegistrationRecord
  onPrint: () => void
}) {
  return (
    <div className="rounded-[24px] border border-[#dbe5ef] bg-white p-4 shadow-[0_12px_30px_rgba(15,47,86,0.05)]">
      <div className="flex flex-col gap-3">
        <div>
          <div className="text-base font-bold text-[#102132]">{row.patientName}</div>
          <div className="mt-1 text-sm text-[#6b7f94]">{row.registrationNumber}</div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <ReceptionInfoTile label="Token" value={row.tokenNumber || '--'} />
          <ReceptionInfoTile label="Date" value={row.registrationDate} />
          <ReceptionInfoTile label="Mobile" value={row.mobileNumber || '--'} />
          <ReceptionInfoTile label="Mode" value={row.payment.paymentMode || '--'} />
        </div>
        <ActionButton className="w-full" variant="secondary" onClick={onPrint}>Print Application</ActionButton>
      </div>
    </div>
  )
}

function ReceptionBillMobileCard({
  bill,
  onOpen,
}: {
  bill: BillRecord
  onOpen: () => void
}) {
  return (
    <div className="rounded-[24px] border border-[#dbe5ef] bg-white p-4 shadow-[0_12px_30px_rgba(15,47,86,0.05)]">
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="text-base font-bold text-[#102132]">{bill.patientName}</div>
            <div className="mt-1 text-sm text-[#6b7f94]">{bill.visitType}</div>
          </div>
          <div className="sm:pt-1">
            <StatusBadge label={bill.paidStatus} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <ReceptionInfoTile label="Amount" value={`Rs. ${bill.finalAmount}`} />
          <ReceptionInfoTile label="Mode" value={bill.paymentMode} />
        </div>
        <ActionButton className="w-full" variant="ghost" onClick={onOpen}>Open Bill</ActionButton>
      </div>
    </div>
  )
}
