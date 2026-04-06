'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import PortalShell from '@/components/internal/PortalShell'
import ActionButton from '@/components/internal/ui/ActionButton'
import DataTable from '@/components/internal/ui/DataTable'
import SectionCard from '@/components/internal/ui/SectionCard'
import { getPortalCredential, savePortalCredential, sendPortalPasswordReset, updateAdminPortalMobile } from '@/lib/internal/portalAuth'
import { patientService } from '@/lib/internal/patientService'
import { registrationService } from '@/lib/internal/registrationService'
import type { BillingPaymentMode } from '@/types/bill'
import type { ClinicPatient, Gender } from '@/types/patient'
import type { OpRegistrationRecord } from '@/types/registration'

type AdminTab = 'data' | 'case-management' | 'patient-contacts'

type AdminManualForm = {
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
  diagnosis: string
  advisedNotes: string
  visitType: string
  amount: string
  discount: string
  paymentMode: BillingPaymentMode
}

function todayString() {
  return new Date().toLocaleDateString('en-CA')
}

function parseCaseSequence(value: string) {
  const numeric = Number(value.replace(/^\D+/, ''))
  return Number.isFinite(numeric) ? numeric : Number.MAX_SAFE_INTEGER
}

const emptyManualForm: AdminManualForm = {
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
  diagnosis: '',
  advisedNotes: '',
  visitType: 'Manual Registration',
  amount: '0',
  discount: '0',
  paymentMode: 'Cash',
}

export default function AdminPage() {
  const [patients, setPatients] = useState<ClinicPatient[]>([])
  const [registrations, setRegistrations] = useState<OpRegistrationRecord[]>([])
  const [feedback, setFeedback] = useState('')
  const [searchText, setSearchText] = useState('')
  const [dateFilter, setDateFilter] = useState<'today' | 'custom' | 'all'>('today')
  const [dateFrom, setDateFrom] = useState(todayString())
  const [dateTo, setDateTo] = useState(todayString())
  const [nextCaseNumber, setNextCaseNumber] = useState('')
  const [nextCaseInput, setNextCaseInput] = useState('')
  const [manualForm, setManualForm] = useState<AdminManualForm>(emptyManualForm)
  const [selectedRegistrationNumber, setSelectedRegistrationNumber] = useState('')
  const [activeTab, setActiveTab] = useState<AdminTab>('data')
  const [doctorAccessForm, setDoctorAccessForm] = useState({ email: '', mobile: '', password: '' })
  const [receptionAccessForm, setReceptionAccessForm] = useState({ email: '', mobile: '', password: '' })
  const [adminAccessForm, setAdminAccessForm] = useState({ email: '', mobile: '' })
  const [portalStatusMessage, setPortalStatusMessage] = useState({
    admin: '',
    doctor: '',
    receptionist: '',
  })
  const [successPopup, setSuccessPopup] = useState<{ open: boolean; message: string }>({
    open: false,
    message: '',
  })

  const loadData = useCallback(async () => {
    const [patientRows, registrationRows, nextRegistrationNumber] = await Promise.all([
      patientService.listPatients(),
      registrationService.listRegistrations(),
      patientService.getNextRegistrationNumber(),
    ])

    setPatients(patientRows)
    setRegistrations(registrationRows)
    setNextCaseNumber(nextRegistrationNumber)
    setNextCaseInput(nextRegistrationNumber)
    setManualForm((current) => ({
      ...current,
      caseNo: current.caseNo || nextRegistrationNumber,
    }))

    return { patientRows, registrationRows, nextRegistrationNumber }
  }, [])

  useEffect(() => {
    void loadData()
  }, [loadData])

  useEffect(() => {
    let mounted = true

    async function loadPortalCredentials() {
      const [adminCredential, doctorCredential, receptionistCredential] = await Promise.all([
        getPortalCredential('admin'),
        getPortalCredential('doctor'),
        getPortalCredential('receptionist'),
      ])

      if (!mounted) return

      setAdminAccessForm({
        email: adminCredential?.email ?? '',
        mobile: adminCredential?.mobile ?? '',
      })
      setDoctorAccessForm({
        email: doctorCredential?.email ?? '',
        mobile: doctorCredential?.mobile ?? '',
        password: '',
      })
      setReceptionAccessForm({
        email: receptionistCredential?.email ?? '',
        mobile: receptionistCredential?.mobile ?? '',
        password: '',
      })
    }

    void loadPortalCredentials()

    return () => {
      mounted = false
    }
  }, [])

  const patientByRegistration = useMemo(
    () => Object.fromEntries(patients.map((patient) => [patient.registrationNumber, patient])),
    [patients],
  )

  const filteredRegistrations = useMemo(() => {
    const query = searchText.trim().toLowerCase()

    return registrations
      .filter((registration) => {
        const matchesSearch =
          !query ||
          registration.registrationNumber.toLowerCase().includes(query) ||
          registration.patientName.toLowerCase().includes(query) ||
          registration.mobileNumber.includes(query) ||
          registration.chiefComplaint.toLowerCase().includes(query)

        const matchesDate =
          dateFilter === 'all'
            ? true
            : dateFilter === 'today'
              ? registration.registrationDate === todayString()
              : registration.registrationDate >= dateFrom && registration.registrationDate <= dateTo

        return matchesSearch && matchesDate
      })
      .sort((left, right) => parseCaseSequence(left.registrationNumber) - parseCaseSequence(right.registrationNumber))
  }, [dateFilter, dateFrom, dateTo, registrations, searchText])

  const filteredSummary = useMemo(() => {
    return {
      totalRecords: filteredRegistrations.length,
      cash: filteredRegistrations
        .filter((item) => item.payment.paymentMode === 'Cash')
        .reduce((sum, item) => sum + item.payment.finalAmount, 0),
      upi: filteredRegistrations
        .filter((item) => item.payment.paymentMode === 'UPI')
        .reduce((sum, item) => sum + item.payment.finalAmount, 0),
      card: filteredRegistrations
        .filter((item) => item.payment.paymentMode === 'Card')
        .reduce((sum, item) => sum + item.payment.finalAmount, 0),
      totalAmount: filteredRegistrations.reduce((sum, item) => sum + item.payment.finalAmount, 0),
    }
  }, [filteredRegistrations])

  const filteredPatients = useMemo(() => {
    const query = searchText.trim().toLowerCase()

    return patients.filter((patient) => {
      const patientDate = patient.lastVisit || patient.createdAt || ''
      const matchesDate =
        dateFilter === 'all'
          ? true
          : dateFilter === 'today'
            ? patientDate === todayString()
            : patientDate >= dateFrom && patientDate <= dateTo

      if (!matchesDate) return false
      if (!query) return true

      return (
        patient.registrationNumber.toLowerCase().includes(query) ||
        patient.fullName.toLowerCase().includes(query) ||
        patient.mobileNumber.includes(query) ||
        patient.address.toLowerCase().includes(query)
      )
    })
  }, [patients, searchText])

  function handleDateFilterChange(value: 'today' | 'custom' | 'all') {
    const today = todayString()

    setDateFilter(value)

    if (value === 'today') {
      setDateFrom(today)
      setDateTo(today)
    }
  }

  function handleDateFromChange(value: string) {
    setDateFrom(value)
    setDateFilter('custom')
  }

  function handleDateToChange(value: string) {
    setDateTo(value)
    setDateFilter('custom')
  }

  function updateManualForm<K extends keyof AdminManualForm>(key: K, value: AdminManualForm[K]) {
    setManualForm((current) => ({ ...current, [key]: value }))
  }

  function downloadCsv(filename: string, headers: string[], rows: string[][]) {
    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(','))
      .join('\n')

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.click()
    URL.revokeObjectURL(url)
  }

  function downloadFilteredOpData() {
    downloadCsv(
      `admin-op-data-${dateFilter}-${todayString()}.csv`,
      ['Case No', 'Date', 'Patient Name', 'Mobile', 'Address', 'Chief Complaint', 'Diagnosis', 'Visit Type', 'Final Amount', 'Payment Mode'],
      filteredRegistrations.map((row) => [
        row.registrationNumber,
        row.registrationDate,
        row.patientName,
        row.mobileNumber,
        row.address,
        row.chiefComplaint,
        row.diagnosis,
        row.payment.visitType,
        String(row.payment.finalAmount),
        row.payment.paymentMode,
      ]),
    )
    setFeedback('Filtered OP data downloaded.')
  }

  function downloadFilteredPatientContacts() {
    downloadCsv(
      `patient-contacts-${dateFilter}-${todayString()}.csv`,
      ['Patient Name', 'Mobile Number', 'Address', 'Last Visit'],
      filteredPatients.map((row) => [
        row.fullName,
        row.mobileNumber,
        row.address,
        row.lastVisit,
      ]),
    )
    setFeedback('Filtered patient contacts downloaded.')
  }

  async function applyNextCaseNumber() {
    if (!nextCaseInput.trim()) {
      setFeedback('Enter the case number to continue from.')
      return
    }

    const applied = await patientService.setNextRegistrationNumber(nextCaseInput.trim().toUpperCase())
    setNextCaseNumber(applied)
    setNextCaseInput(applied)
    setManualForm((current) => ({
      ...current,
      caseNo: applied,
    }))
    setFeedback(`Reception will continue from ${applied}.`)
    setSuccessPopup({
      open: true,
      message: `Applied successfully. Reception will continue from ${applied}.`,
    })
  }

  async function saveManualRegistration() {
    if (!manualForm.caseNo || !manualForm.fullName || !manualForm.mobileNumber || !manualForm.age) {
      setFeedback('Fill case number, name, mobile, and age before saving.')
      return
    }

    const normalizedCaseNo = manualForm.caseNo.trim().toUpperCase()
    if (registrations.some((registration) => registration.registrationNumber === normalizedCaseNo)) {
      setFeedback(`Case number ${normalizedCaseNo} already exists.`)
      return
    }

    const createdPatient = await patientService.createPatient({
      registrationNumber: normalizedCaseNo,
      fullName: manualForm.fullName,
      mobileNumber: manualForm.mobileNumber,
      age: Number(manualForm.age || 0),
      gender: manualForm.gender,
      address: manualForm.address,
    })

    const amount = Number(manualForm.amount || 0)
    const discount = Number(manualForm.discount || 0)

    await registrationService.createOrUpdateRegistration({
      registrationNumber: normalizedCaseNo,
      tokenNumber: '',
      patientId: createdPatient.id,
      patientName: manualForm.fullName,
      registrationDate: manualForm.registrationDate,
      age: Number(manualForm.age || 0),
      gender: manualForm.gender,
      maritalStatus: manualForm.maritalStatus,
      bloodGroup: manualForm.bloodGroup,
      dateOfBirth: manualForm.dateOfBirth,
      occupation: manualForm.occupation,
      address: manualForm.address,
      mobileNumber: manualForm.mobileNumber,
      email: manualForm.email,
      reference: manualForm.reference,
      chiefComplaint: manualForm.chiefComplaint,
      dentalHistory: manualForm.dentalHistory,
      oralExamination: [],
      diagnosis: manualForm.diagnosis,
      advisedNotes: manualForm.advisedNotes,
      findings: '',
      treatmentGiven: '',
      prescriptionNotes: '',
      followUpDate: '',
      toothNumber: '',
      procedure: '',
      doctorNotes: '',
      medicalHistory: {
        asthma: false,
        bloodPressure: false,
        diabetes: false,
        drugAllergy: false,
        heartProblem: false,
        gastric: false,
        otherMedicalIssue: false,
        otherMedicalIssueDetails: '',
      },
      advisedTreatments: {
        scaling: false,
        extraction: false,
        rootCanal: false,
        pedo: false,
        fpdRpdCd: false,
        otherTreatment: false,
        otherTreatmentDetails: '',
      },
      treatmentRows: [],
      payment: {
        visitType: manualForm.visitType,
        amount,
        discount,
        finalAmount: Math.max(0, amount - discount),
        paymentMode: manualForm.paymentMode,
      },
    })

    await loadData()
    setActiveTab('data')
    setManualForm({
      ...emptyManualForm,
      caseNo: nextCaseInput,
      registrationDate: manualForm.registrationDate,
    })
    setFeedback(`Manual OP ${normalizedCaseNo} saved successfully.`)
    setSuccessPopup({
      open: true,
      message: `Manual application ${normalizedCaseNo} saved successfully.`,
    })
  }

  async function savePortalAccess(role: 'doctor' | 'receptionist') {
    const currentForm = role === 'doctor' ? doctorAccessForm : receptionAccessForm

    try {
      const savedCredential = await savePortalCredential(role, currentForm)
      if (role === 'doctor') {
        setDoctorAccessForm({
          email: savedCredential.email,
          mobile: savedCredential.mobile,
          password: '',
        })
      } else {
        setReceptionAccessForm({
          email: savedCredential.email,
          mobile: savedCredential.mobile,
          password: '',
        })
      }

      setPortalStatusMessage((current) => ({
        ...current,
        [role]: `${role === 'doctor' ? 'Doctor' : 'Reception'} login submitted and saved successfully.`,
      }))
      setFeedback(`${role === 'doctor' ? 'Doctor' : 'Receptionist'} login saved successfully.`)
      setSuccessPopup({
        open: true,
        message: `${role === 'doctor' ? 'Doctor' : 'Receptionist'} panel login saved successfully.`,
      })
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : 'Unable to save portal credentials.')
    }
  }

  async function saveAdminMobileAccess() {
    try {
      const updated = await updateAdminPortalMobile(adminAccessForm.mobile)
      setAdminAccessForm({
        email: updated.email,
        mobile: updated.mobile,
      })
      setPortalStatusMessage((current) => ({
        ...current,
        admin: 'Admin mobile number submitted and saved successfully.',
      }))
      setFeedback('Admin mobile login saved successfully.')
      setSuccessPopup({
        open: true,
        message: 'Admin mobile number saved successfully for portal login.',
      })
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : 'Unable to save admin mobile number.')
    }
  }

  async function handlePasswordReset(role: 'admin' | 'doctor' | 'receptionist') {
    try {
      const result = await sendPortalPasswordReset(role)
      const roleLabel = role === 'admin' ? 'Admin' : role === 'doctor' ? 'Doctor' : 'Reception'
      setFeedback(`${roleLabel} password reset link sent successfully.`)
      setSuccessPopup({
        open: true,
        message: `${roleLabel} password reset link sent to ${result.email}. Open that email inbox and complete the reset to restore access.`,
      })
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : 'Unable to send password reset link.')
    }
  }

  return (
    <>
      <PortalShell
        roleLabel="Admin Panel"
        clinicName="Dhanra Dental Aesthetic and Implant Care"
        clinicSubtitle="Master control for OP records, numbering, and manual recovery entry."
        title="Admin Portal"
        subtitle="Search full OP data, manage case number continuity, and enter paper forms after power or network issues."
        items={[]}
        navExtra={
          <div className="flex w-full gap-2 overflow-x-auto pb-1 xl:w-auto xl:justify-end">
            <AdminHeaderTabButton label="Case Number & Manual Applications" active={activeTab === 'case-management'} onClick={() => setActiveTab('case-management')} />
            <AdminHeaderTabButton label="Data" active={activeTab === 'data'} onClick={() => setActiveTab('data')} />
            <AdminHeaderTabButton label="Patient Contacts" active={activeTab === 'patient-contacts'} onClick={() => setActiveTab('patient-contacts')} />
          </div>
        }
        topRight={feedback ? <div className="rounded-2xl bg-[#eef4f8] px-4 py-3 text-sm font-medium text-[#0f2f56]">{feedback}</div> : null}
      >
        <div className="space-y-6 pt-4 md:pt-6">
        {activeTab === 'data' ? (
        <SectionCard
          id="admin-filters"
          title="Full OP Data"
          subtitle="Search every OP and filter by today, custom range, or all records. Download the visible sheet when needed."
          action={<ActionButton variant="secondary" onClick={downloadFilteredOpData}>Download Sheet</ActionButton>}
        >
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            <FieldShell label="Search">
              <div className="relative">
                <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#72869a]" />
                <input value={searchText} onChange={(event) => setSearchText(event.target.value)} className="min-h-[56px] w-full rounded-[22px] border border-[#dce6ef] bg-[#f9fbfd] pl-11 pr-4 text-base outline-none" />
              </div>
            </FieldShell>
            <FieldShell label="Date Filter">
              <select value={dateFilter} onChange={(event) => handleDateFilterChange(event.target.value as 'today' | 'custom' | 'all')} className="min-h-[56px] w-full rounded-[22px] border border-[#dce6ef] bg-[#f9fbfd] px-4 text-base outline-none">
                <option value="today">Today</option>
                <option value="custom">Custom Range</option>
                <option value="all">All</option>
              </select>
            </FieldShell>
            <FieldShell label="From Date">
              <input type="date" value={dateFrom} onChange={(event) => handleDateFromChange(event.target.value)} className="min-h-[56px] w-full rounded-[22px] border border-[#dce6ef] bg-[#f9fbfd] px-4 text-base outline-none" />
            </FieldShell>
            <FieldShell label="To Date">
              <input type="date" value={dateTo} onChange={(event) => handleDateToChange(event.target.value)} className="min-h-[56px] w-full rounded-[22px] border border-[#dce6ef] bg-[#f9fbfd] px-4 text-base outline-none" />
            </FieldShell>
            <div className="flex items-end">
              <ActionButton
                variant="secondary"
                className="w-full"
                onClick={() => {
                  const today = todayString()
                  setSearchText('')
                  setDateFilter('today')
                  setDateFrom(today)
                  setDateTo(today)
                }}
              >
                Reset Filters
              </ActionButton>
            </div>
          </div>

          <div className="mt-5">
            <DataTable
              rows={filteredRegistrations}
              emptyText="No OP records found for the selected filter."
              columns={[
                { key: 'case', header: 'Case No', render: (row) => row.registrationNumber },
                { key: 'date', header: 'Date', render: (row) => row.registrationDate },
                { key: 'name', header: 'Patient Name', render: (row) => row.patientName },
                { key: 'mobile', header: 'Mobile', render: (row) => row.mobileNumber },
                { key: 'complaint', header: 'Chief Complaint', render: (row) => row.chiefComplaint || '--' },
                { key: 'payment', header: 'Payment', render: (row) => `Rs. ${row.payment.finalAmount}` },
                { key: 'mode', header: 'Mode', render: (row) => row.payment.paymentMode },
                ]}
              />
            </div>
        </SectionCard>
        ) : null}

        {activeTab === 'case-management' ? (
        <SectionCard
          id="admin-case-sequence"
          title="Case Number Control"
          subtitle="Set the next case number when paper forms were used during a power or network issue."
        >
          <div className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
            <div className="rounded-[28px] border border-[#dce6ef] bg-[linear-gradient(135deg,#f8fbfe_0%,#eef4fb_100%)] p-6">
              <div className="text-sm font-semibold uppercase tracking-[0.16em] text-[#6b7f94]">Current Next Case Number</div>
              <div className="mt-4 text-5xl font-bold text-[#153b68]">{nextCaseNumber || '--'}</div>
              <div className="mt-3 text-sm leading-6 text-[#6b7f94]">If you set this to `D25040`, the receptionist portal will continue from `D25040` automatically.</div>
            </div>

            <div className="rounded-[28px] border border-[#dce6ef] bg-white p-6">
              <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
                <FieldShell label="Start Reception From Case No">
                  <input value={nextCaseInput} onChange={(event) => setNextCaseInput(event.target.value.toUpperCase())} className="min-h-[56px] w-full rounded-[22px] border border-[#dce6ef] bg-[#f9fbfd] px-4 text-base outline-none" />
                </FieldShell>
                <ActionButton className="w-full md:w-auto" onClick={() => void applyNextCaseNumber()}>Apply Next Number</ActionButton>
              </div>
              <div className="mt-4 rounded-[22px] bg-[#f7fafc] p-4 text-sm leading-6 text-[#5f7287]">
                Example: if paper forms were written from `D25020` to `D25039`, set the next case here to `D25040`. Then you can enter the missed paper forms below with their exact case numbers, and reception will continue correctly from the new number.
              </div>
            </div>
          </div>
        </SectionCard>
        ) : null}

      
        {activeTab === 'case-management' ? (
        <SectionCard
          id="admin-manual-entry"
          title="Manual Paper Form Entry"
          subtitle="Enter paper OP applications here with exact case number and date, then save them into the digital records."
          action={
            <div className="rounded-full bg-[#edf4fb] px-4 py-2 text-sm font-semibold text-[#183f6f]">
              Manual recovery mode
            </div>
          }
        >
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <FieldShell label="Case No">
              <input value={manualForm.caseNo} onChange={(event) => updateManualForm('caseNo', event.target.value.toUpperCase())} className="min-h-[56px] w-full rounded-[22px] border border-[#dce6ef] bg-[#f9fbfd] px-4 text-base outline-none" />
            </FieldShell>
            <FieldShell label="Date">
              <input type="date" value={manualForm.registrationDate} onChange={(event) => updateManualForm('registrationDate', event.target.value)} className="min-h-[56px] w-full rounded-[22px] border border-[#dce6ef] bg-[#f9fbfd] px-4 text-base outline-none" />
            </FieldShell>
            <FieldShell label="Patient Name">
              <input value={manualForm.fullName} onChange={(event) => updateManualForm('fullName', event.target.value)} className="min-h-[56px] w-full rounded-[22px] border border-[#dce6ef] bg-[#f9fbfd] px-4 text-base outline-none" />
            </FieldShell>
            <FieldShell label="Mobile">
              <input value={manualForm.mobileNumber} onChange={(event) => updateManualForm('mobileNumber', event.target.value)} className="min-h-[56px] w-full rounded-[22px] border border-[#dce6ef] bg-[#f9fbfd] px-4 text-base outline-none" />
            </FieldShell>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <FieldShell label="Age">
              <input value={manualForm.age} onChange={(event) => updateManualForm('age', event.target.value)} className="min-h-[56px] w-full rounded-[22px] border border-[#dce6ef] bg-[#f9fbfd] px-4 text-base outline-none" />
            </FieldShell>
            <FieldShell label="Gender">
              <select value={manualForm.gender} onChange={(event) => updateManualForm('gender', event.target.value as Gender)} className="min-h-[56px] w-full rounded-[22px] border border-[#dce6ef] bg-[#f9fbfd] px-4 text-base outline-none">
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </FieldShell>
            <FieldShell label="Marital Status">
              <select value={manualForm.maritalStatus} onChange={(event) => updateManualForm('maritalStatus', event.target.value)} className="min-h-[56px] w-full rounded-[22px] border border-[#dce6ef] bg-[#f9fbfd] px-4 text-base outline-none">
                <option value="">Select</option>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Divorced">Divorced</option>
                <option value="Widowed">Widowed</option>
              </select>
            </FieldShell>
            <FieldShell label="Blood Group">
              <select value={manualForm.bloodGroup} onChange={(event) => updateManualForm('bloodGroup', event.target.value)} className="min-h-[56px] w-full rounded-[22px] border border-[#dce6ef] bg-[#f9fbfd] px-4 text-base outline-none">
                <option value="">Select</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </FieldShell>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <FieldShell label="Date of Birth">
              <input type="date" value={manualForm.dateOfBirth} onChange={(event) => updateManualForm('dateOfBirth', event.target.value)} className="min-h-[56px] w-full rounded-[22px] border border-[#dce6ef] bg-[#f9fbfd] px-4 text-base outline-none" />
            </FieldShell>
            <FieldShell label="Occupation">
              <input value={manualForm.occupation} onChange={(event) => updateManualForm('occupation', event.target.value)} className="min-h-[56px] w-full rounded-[22px] border border-[#dce6ef] bg-[#f9fbfd] px-4 text-base outline-none" />
            </FieldShell>
            <FieldShell label="Email">
              <input value={manualForm.email} onChange={(event) => updateManualForm('email', event.target.value)} className="min-h-[56px] w-full rounded-[22px] border border-[#dce6ef] bg-[#f9fbfd] px-4 text-base outline-none" />
            </FieldShell>
            <FieldShell label="Reference">
              <input value={manualForm.reference} onChange={(event) => updateManualForm('reference', event.target.value)} className="min-h-[56px] w-full rounded-[22px] border border-[#dce6ef] bg-[#f9fbfd] px-4 text-base outline-none" />
            </FieldShell>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <FieldShell label="Address">
              <textarea rows={3} value={manualForm.address} onChange={(event) => updateManualForm('address', event.target.value)} className="w-full rounded-[22px] border border-[#dce6ef] bg-[#f9fbfd] px-4 py-3 text-base outline-none" />
            </FieldShell>
            <FieldShell label="Chief Complaint">
              <textarea rows={3} value={manualForm.chiefComplaint} onChange={(event) => updateManualForm('chiefComplaint', event.target.value)} className="w-full rounded-[22px] border border-[#dce6ef] bg-[#f9fbfd] px-4 py-3 text-base outline-none" />
            </FieldShell>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <FieldShell label="Dental History">
              <textarea rows={3} value={manualForm.dentalHistory} onChange={(event) => updateManualForm('dentalHistory', event.target.value)} className="w-full rounded-[22px] border border-[#dce6ef] bg-[#f9fbfd] px-4 py-3 text-base outline-none" />
            </FieldShell>
            <FieldShell label="Diagnosis">
              <textarea rows={3} value={manualForm.diagnosis} onChange={(event) => updateManualForm('diagnosis', event.target.value)} className="w-full rounded-[22px] border border-[#dce6ef] bg-[#f9fbfd] px-4 py-3 text-base outline-none" />
            </FieldShell>
          </div>

          <div className="mt-4">
            <FieldShell label="Advised Notes">
              <textarea rows={3} value={manualForm.advisedNotes} onChange={(event) => updateManualForm('advisedNotes', event.target.value)} className="w-full rounded-[22px] border border-[#dce6ef] bg-[#f9fbfd] px-4 py-3 text-base outline-none" />
            </FieldShell>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <FieldShell label="Visit Type">
              <input value={manualForm.visitType} onChange={(event) => updateManualForm('visitType', event.target.value)} className="min-h-[56px] w-full rounded-[22px] border border-[#dce6ef] bg-[#f9fbfd] px-4 text-base outline-none" />
            </FieldShell>
            <FieldShell label="Amount">
              <input value={manualForm.amount} onChange={(event) => updateManualForm('amount', event.target.value)} className="min-h-[56px] w-full rounded-[22px] border border-[#dce6ef] bg-[#f9fbfd] px-4 text-base outline-none" />
            </FieldShell>
            <FieldShell label="Discount">
              <input value={manualForm.discount} onChange={(event) => updateManualForm('discount', event.target.value)} className="min-h-[56px] w-full rounded-[22px] border border-[#dce6ef] bg-[#f9fbfd] px-4 text-base outline-none" />
            </FieldShell>
            <FieldShell label="Payment Mode">
              <select value={manualForm.paymentMode} onChange={(event) => updateManualForm('paymentMode', event.target.value as BillingPaymentMode)} className="min-h-[56px] w-full rounded-[22px] border border-[#dce6ef] bg-[#f9fbfd] px-4 text-base outline-none">
                <option value="Cash">Cash</option>
                <option value="UPI">UPI</option>
                <option value="Card">Card</option>
              </select>
            </FieldShell>
          </div>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <ActionButton className="w-full sm:w-auto" onClick={() => void saveManualRegistration()}>Save Manual OP</ActionButton>
                <ActionButton
                  variant="secondary"
                  className="w-full sm:w-auto"
                  onClick={() => setManualForm({ ...emptyManualForm, caseNo: nextCaseNumber, registrationDate: todayString() })}
                >
                  Reset Manual Form
            </ActionButton>
          </div>
        </SectionCard>
        ) : null}
  {activeTab === 'case-management' ? (
        <SectionCard
          id="admin-portal-access"
          title="Portal Login Setup"
          subtitle="Create or update the doctor and receptionist portal login credentials here. Admin login is fixed with the provided email/mobile and password."
        >
          <div className="grid gap-5 xl:grid-cols-2">
            <PortalAccessReadonlyCard
              title="Admin Panel Login"
              subtitle="Admin uses Firebase email/password sign-in. Save the mobile number here once after the first email login to allow admin mobile login too."
              email={adminAccessForm.email}
              mobile={adminAccessForm.mobile}
              onMobileChange={(value) => setAdminAccessForm((current) => ({ ...current, mobile: value }))}
              onSave={() => void saveAdminMobileAccess()}
              onResetPassword={() => void handlePasswordReset('admin')}
              statusMessage={portalStatusMessage.admin}
            />
            <PortalAccessSetupCard
              title="Doctor Panel Login"
              subtitle="This email/mobile number and password will open the doctor portal."
              email={doctorAccessForm.email}
              mobile={doctorAccessForm.mobile}
              password={doctorAccessForm.password}
              onEmailChange={(value) => setDoctorAccessForm((current) => ({ ...current, email: value }))}
              onMobileChange={(value) => setDoctorAccessForm((current) => ({ ...current, mobile: value }))}
              onPasswordChange={(value) => setDoctorAccessForm((current) => ({ ...current, password: value }))}
              onSave={() => savePortalAccess('doctor')}
              onResetPassword={() => void handlePasswordReset('doctor')}
              statusMessage={portalStatusMessage.doctor}
            />
            <PortalAccessSetupCard
              title="Reception Panel Login"
              subtitle="This email/mobile number and password will open the receptionist portal."
              email={receptionAccessForm.email}
              mobile={receptionAccessForm.mobile}
              password={receptionAccessForm.password}
              onEmailChange={(value) => setReceptionAccessForm((current) => ({ ...current, email: value }))}
              onMobileChange={(value) => setReceptionAccessForm((current) => ({ ...current, mobile: value }))}
              onPasswordChange={(value) => setReceptionAccessForm((current) => ({ ...current, password: value }))}
              onSave={() => savePortalAccess('receptionist')}
              onResetPassword={() => void handlePasswordReset('receptionist')}
              statusMessage={portalStatusMessage.receptionist}
            />
          </div>
          <div className="mt-4 rounded-[22px] bg-[#f7fafc] p-4 text-sm leading-6 text-[#5f7287]">
            Admin password is no longer stored in this code. Create the admin Firebase Authentication email/password account first, then sign in by email once and save the admin mobile number here if you want mobile login too.
          </div>
          <div className="mt-4 rounded-[22px] border border-[#d9e4ef] bg-white p-5">
            <div className="text-lg font-bold text-[#153b68]">Password Reset Option</div>
            <div className="mt-2 text-sm leading-6 text-[#5f7287]">
              If anyone forgets a password, use the <span className="font-semibold text-[#153b68]">Send Reset Link</span> button in this admin panel. The reset email will be sent to the saved portal email so access can be recovered safely.
            </div>
            <div className="mt-3 text-sm leading-6 text-[#5f7287]">
              For admin password reset: use the <span className="font-semibold text-[#153b68]">Send Reset Link</span> button inside the <span className="font-semibold text-[#153b68]">Admin Panel Login</span> card.
            </div>
          </div>
        </SectionCard>
        ) : null}
  
        {activeTab === 'patient-contacts' ? (
        <SectionCard
          id="admin-patient-contacts"
          title="Patient Contacts"
          subtitle="Use this list for greetings, follow-up calls, and marketing communication. Filter date-wise and download the visible list."
          action={<ActionButton variant="secondary" onClick={downloadFilteredPatientContacts}>Download Sheet</ActionButton>}
        >
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            <FieldShell label="Search Patients">
              <div className="relative">
                <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#72869a]" />
                <input value={searchText} onChange={(event) => setSearchText(event.target.value)} className="min-h-[56px] w-full rounded-[22px] border border-[#dce6ef] bg-[#f9fbfd] pl-11 pr-4 text-base outline-none" />
              </div>
            </FieldShell>
            <FieldShell label="Date Filter">
              <select value={dateFilter} onChange={(event) => handleDateFilterChange(event.target.value as 'today' | 'custom' | 'all')} className="min-h-[56px] w-full rounded-[22px] border border-[#dce6ef] bg-[#f9fbfd] px-4 text-base outline-none">
                <option value="today">Today</option>
                <option value="custom">Custom Range</option>
                <option value="all">All</option>
              </select>
            </FieldShell>
            <FieldShell label="From Date">
              <input type="date" value={dateFrom} onChange={(event) => handleDateFromChange(event.target.value)} className="min-h-[56px] w-full rounded-[22px] border border-[#dce6ef] bg-[#f9fbfd] px-4 text-base outline-none" />
            </FieldShell>
            <FieldShell label="To Date">
              <input type="date" value={dateTo} onChange={(event) => handleDateToChange(event.target.value)} className="min-h-[56px] w-full rounded-[22px] border border-[#dce6ef] bg-[#f9fbfd] px-4 text-base outline-none" />
            </FieldShell>
            <div className="flex items-end">
              <ActionButton
                variant="secondary"
                className="w-full"
                onClick={() => {
                  const today = todayString()
                  setSearchText('')
                  setDateFilter('today')
                  setDateFrom(today)
                  setDateTo(today)
                }}
              >
                Reset Filters
              </ActionButton>
            </div>
          </div>

          <div className="mt-5">
            <DataTable
              rows={filteredPatients}
              emptyText="No patient contacts found."
              columns={[
                { key: 'name', header: 'Patient Name', render: (row) => row.fullName },
                { key: 'mobile', header: 'Mobile Number', render: (row) => row.mobileNumber },
                { key: 'address', header: 'Address', render: (row) => row.address || '--' },
              ]}
            />
          </div>
        </SectionCard>
        ) : null}
        </div>
      </PortalShell>
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
    </>
  )
}

function AdminHeaderTabButton({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex min-h-[44px] shrink-0 items-center rounded-full px-5 py-2.5 text-[0.98rem] font-medium whitespace-nowrap transition ${
        active
          ? 'bg-white text-[#0f2f56] shadow-[0_12px_30px_rgba(8,23,43,0.18)]'
          : 'bg-transparent text-white/90 hover:bg-white/10'
      }`}
    >
      {label}
    </button>
  )
}

function FieldShell({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <div className="mb-2 text-sm font-semibold text-[#4f6277]">{label}</div>
      {children}
    </label>
  )
}

function PortalAccessSetupCard({
  title,
  subtitle,
  email,
  mobile,
  password,
  onEmailChange,
  onMobileChange,
  onPasswordChange,
  onSave,
  onResetPassword,
  statusMessage,
}: {
  title: string
  subtitle: string
  email: string
  mobile: string
  password: string
  onEmailChange: (value: string) => void
  onMobileChange: (value: string) => void
  onPasswordChange: (value: string) => void
  onSave: () => void
  onResetPassword: () => void
  statusMessage?: string
}) {
  return (
    <div className="rounded-[28px] border border-[#dce6ef] bg-white p-6">
      <div className="text-xl font-bold text-[#153b68]">{title}</div>
      <div className="mt-2 text-sm leading-6 text-[#6b7f94]">{subtitle}</div>

      <div className="mt-5 grid gap-4">
        <FieldShell label="Email">
          <input value={email} onChange={(event) => onEmailChange(event.target.value)} className="min-h-[56px] w-full rounded-[22px] border border-[#dce6ef] bg-[#f9fbfd] px-4 text-base outline-none" />
        </FieldShell>
        <FieldShell label="Mobile Number">
          <input value={mobile} onChange={(event) => onMobileChange(event.target.value.replace(/\D/g, '').slice(0, 10))} inputMode="numeric" maxLength={10} className="min-h-[56px] w-full rounded-[22px] border border-[#dce6ef] bg-[#f9fbfd] px-4 text-base outline-none" />
        </FieldShell>
        <FieldShell label="Password">
          <input type="password" value={password} onChange={(event) => onPasswordChange(event.target.value)} className="min-h-[56px] w-full rounded-[22px] border border-[#dce6ef] bg-[#f9fbfd] px-4 text-base outline-none" />
        </FieldShell>
        <div className="flex flex-col gap-3 sm:flex-row">
          <ActionButton className="w-full sm:w-auto" onClick={onSave}>Save Login</ActionButton>
          <ActionButton variant="secondary" className="w-full sm:w-auto" onClick={onResetPassword}>Send Reset Link</ActionButton>
        </div>
        {statusMessage ? (
          <div className="rounded-[18px] border border-[#cfe4d4] bg-[#f3fff5] px-4 py-3 text-sm font-medium text-[#25643b]">
            {statusMessage}
          </div>
        ) : null}
      </div>
    </div>
  )
}

function PortalAccessReadonlyCard({
  title,
  subtitle,
  email,
  mobile,
  onMobileChange,
  onSave,
  onResetPassword,
  statusMessage,
}: {
  title: string
  subtitle: string
  email: string
  mobile: string
  onMobileChange: (value: string) => void
  onSave: () => void
  onResetPassword: () => void
  statusMessage?: string
}) {
  return (
    <div className="rounded-[28px] border border-[#dce6ef] bg-white p-6">
      <div className="text-xl font-bold text-[#153b68]">{title}</div>
      <div className="mt-2 text-sm leading-6 text-[#6b7f94]">{subtitle}</div>

      <div className="mt-5 grid gap-4">
        <FieldShell label="Firebase Email">
          <input value={email} readOnly className="min-h-[56px] w-full rounded-[22px] border border-[#dce6ef] bg-[#eef4f8] px-4 text-base outline-none" />
        </FieldShell>
        <FieldShell label="Mobile Number">
          <input value={mobile} onChange={(event) => onMobileChange(event.target.value.replace(/\D/g, '').slice(0, 10))} inputMode="numeric" maxLength={10} className="min-h-[56px] w-full rounded-[22px] border border-[#dce6ef] bg-[#f9fbfd] px-4 text-base outline-none" />
        </FieldShell>
        <div className="flex flex-col gap-3 sm:flex-row">
          <ActionButton className="w-full sm:w-auto" onClick={onSave}>Save Admin Mobile</ActionButton>
          <ActionButton variant="secondary" className="w-full sm:w-auto" onClick={onResetPassword}>Send Reset Link</ActionButton>
        </div>
        {statusMessage ? (
          <div className="rounded-[18px] border border-[#cfe4d4] bg-[#f3fff5] px-4 py-3 text-sm font-medium text-[#25643b]">
            {statusMessage}
          </div>
        ) : null}
      </div>
    </div>
  )
}
