'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import type { ReactNode } from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { CalendarClock, ClipboardList, FilePenLine, Landmark, Search, UserRound, Users } from 'lucide-react'
import PortalShell from '@/components/internal/PortalShell'
import ActionButton from '@/components/internal/ui/ActionButton'
import DataTable from '@/components/internal/ui/DataTable'
import SectionCard from '@/components/internal/ui/SectionCard'
import StatusBadge from '@/components/internal/ui/StatusBadge'
import { doctorService } from '@/lib/internal/doctorService'
import { mockDoctorProfile } from '@/lib/internal/mockData'
import { patientService } from '@/lib/internal/patientService'
import { queueService } from '@/lib/internal/queueService'
import { registrationService } from '@/lib/internal/registrationService'
import type { ClinicPatient, Gender } from '@/types/patient'
import type { QueueEntry } from '@/types/queue'
import type { OpRegistrationRecord } from '@/types/registration'
import type { ConsultationInput, VisitRecord } from '@/types/visit'

type DoctorView = 'dashboard' | 'queue' | 'patients'

function todayString() {
  return new Date().toLocaleDateString('en-CA')
}

const emptyConsultation: ConsultationInput = {
  patientId: '',
  patientName: '',
  age: 0,
  gender: '',
  mobileNumber: '',
  visitDate: todayString(),
  chiefComplaint: '',
  findings: '',
  diagnosis: '',
  treatmentGiven: '',
  prescriptionNotes: '',
  followUpDate: '',
  toothNumber: '',
  procedure: '',
  notes: '',
}

const emptyRegistration: OpRegistrationRecord = {
  id: '',
  registrationNumber: '',
  tokenNumber: '',
  patientId: '',
  patientName: '',
  registrationDate: todayString(),
  age: 0,
  gender: 'Male',
  maritalStatus: '',
  bloodGroup: '',
  dateOfBirth: '',
  occupation: '',
  address: '',
  mobileNumber: '',
  email: '',
  reference: '',
  chiefComplaint: '',
  dentalHistory: '',
  oralExamination: [],
  diagnosis: '',
  advisedNotes: '',
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
    visitType: '',
    amount: 0,
    discount: 0,
    finalAmount: 0,
    paymentMode: 'Cash',
  },
  createdAt: '',
  updatedAt: '',
}

type RegistrationListRow = {
  registration: OpRegistrationRecord
  queueEntry: QueueEntry | null
  visit: VisitRecord | null
}

const CLOSED_OP_SENTINEL = '__closed__'

export default function DoctorPortal({ initialView = 'dashboard' }: { initialView?: DoctorView }) {
  const searchParams = useSearchParams()
  const [patients, setPatients] = useState<ClinicPatient[]>([])
  const [queue, setQueue] = useState<QueueEntry[]>([])
  const [visits, setVisits] = useState<VisitRecord[]>([])
  const [registrations, setRegistrations] = useState<OpRegistrationRecord[]>([])
  const [draftRegistration, setDraftRegistration] = useState<OpRegistrationRecord>(emptyRegistration)
  const [consultation, setConsultation] = useState<ConsultationInput>(emptyConsultation)
  const [activeRegistrationNumber, setActiveRegistrationNumber] = useState('')
  const [feedback, setFeedback] = useState('')
  const [searchText, setSearchText] = useState('')
  const [dateFilter, setDateFilter] = useState<'today' | 'custom' | 'all'>('today')
  const [dateFrom, setDateFrom] = useState(todayString())
  const [dateTo, setDateTo] = useState(todayString())
  const requestedRegistration = searchParams.get('registration') ?? ''

  const loadData = useCallback(async () => {
    const [patientRows, queueRows, visitRows, registrationRows] = await Promise.all([
      patientService.listPatients(),
      queueService.listQueue(),
      doctorService.listVisits(),
      registrationService.listRegistrations(),
    ])

    setPatients(patientRows)
    setQueue(queueRows)
    setVisits(visitRows)
    setRegistrations(registrationRows)

    return {
      patientRows,
      queueRows,
      visitRows,
      registrationRows,
    }
  }, [])

  useEffect(() => {
    void loadData()
  }, [loadData])

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      void loadData()
    }, 60000)

    return () => window.clearInterval(intervalId)
  }, [loadData])

  const today = todayString()
  const queueByPatientId = useMemo(
    () => Object.fromEntries(queue.map((entry) => [entry.patientId, entry])),
    [queue],
  )
  const visitByPatientId = useMemo(
    () => Object.fromEntries(visits.map((visit) => [visit.patientId, visit])),
    [visits],
  )

  const withDoctorEntry = queue.find((item) => item.status === 'With Doctor') ?? null
  const waitingEntries = queue.filter((item) => item.status === 'Waiting')
  const todayRegistrations = registrations.filter((item) => item.registrationDate === today)
  const todayCompleted = queue.filter((item) => item.status === 'Done').length
  const openVisits = visits.filter((item) => item.status === 'Open').length
  const registrationRows = useMemo<RegistrationListRow[]>(
    () =>
      registrations.map((registration) => ({
        registration,
        queueEntry: queueByPatientId[registration.patientId] ?? null,
        visit: visitByPatientId[registration.patientId] ?? null,
      })),
    [registrations, queueByPatientId, visitByPatientId],
  )

  const filteredRows = useMemo(() => {
    const query = searchText.trim().toLowerCase()

    return registrationRows.filter(({ registration }) => {
      const matchesSearch =
        !query ||
        registration.patientName.toLowerCase().includes(query) ||
        registration.registrationNumber.toLowerCase().includes(query) ||
        registration.tokenNumber.toLowerCase().includes(query) ||
        registration.mobileNumber.includes(query)

      const matchesDate =
        dateFilter === 'all'
          ? true
          : dateFilter === 'today'
            ? registration.registrationDate === today
            : registration.registrationDate >= dateFrom && registration.registrationDate <= dateTo

      return matchesSearch && matchesDate
    })
  }, [dateFilter, dateFrom, dateTo, registrationRows, searchText, today])

  function handleDateFilterChange(value: 'today' | 'custom' | 'all') {
    const currentDay = todayString()

    setDateFilter(value)

    if (value === 'today') {
      setDateFrom(currentDay)
      setDateTo(currentDay)
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

  useEffect(() => {
    if (requestedRegistration) {
      setActiveRegistrationNumber(requestedRegistration)
    }
  }, [requestedRegistration])

  useEffect(() => {
    if (requestedRegistration || activeRegistrationNumber === CLOSED_OP_SENTINEL) return

    if (withDoctorEntry) {
      const sentRegistration = registrations.find((item) => item.patientId === withDoctorEntry.patientId)
      if (sentRegistration) {
        setActiveRegistrationNumber(sentRegistration.registrationNumber)
        return
      }
    }

    if (!activeRegistrationNumber) {
      const nextPendingRegistrationNumber = getNextPendingRegistrationNumber(filteredRows)
      if (nextPendingRegistrationNumber) {
        setActiveRegistrationNumber(nextPendingRegistrationNumber)
      }
    }
  }, [activeRegistrationNumber, filteredRows, registrations, requestedRegistration, withDoctorEntry])

  const activeRegistration =
    registrations.find((item) => item.registrationNumber === activeRegistrationNumber) ?? null
  const activeQueueEntry = activeRegistration ? queueByPatientId[activeRegistration.patientId] ?? null : null
  const activeVisit = activeRegistration ? visitByPatientId[activeRegistration.patientId] ?? null : null

  useEffect(() => {
    if (!activeRegistration) {
      setDraftRegistration(emptyRegistration)
      setConsultation(emptyConsultation)
      return
    }

    setDraftRegistration(JSON.parse(JSON.stringify(activeRegistration)) as OpRegistrationRecord)

    const sourceVisit = visits.find((visit) => visit.patientId === activeRegistration.patientId && visit.status === 'Open') ?? null
    setConsultation({
      patientId: activeRegistration.patientId,
      patientName: activeRegistration.patientName,
      age: activeRegistration.age,
      gender: activeRegistration.gender,
      mobileNumber: activeRegistration.mobileNumber,
      visitDate: sourceVisit?.visitDate ?? activeRegistration.registrationDate,
      chiefComplaint: sourceVisit?.chiefComplaint ?? activeRegistration.chiefComplaint,
      findings: sourceVisit?.findings ?? activeRegistration.findings,
      diagnosis: sourceVisit?.diagnosis ?? activeRegistration.diagnosis,
      treatmentGiven: sourceVisit?.treatmentGiven ?? activeRegistration.treatmentGiven,
      prescriptionNotes: sourceVisit?.prescriptionNotes ?? activeRegistration.prescriptionNotes,
      followUpDate: sourceVisit?.followUpDate ?? activeRegistration.followUpDate,
      toothNumber: sourceVisit?.toothNumber ?? activeRegistration.toothNumber,
      procedure: sourceVisit?.procedure ?? activeRegistration.procedure,
      notes: sourceVisit?.notes ?? activeRegistration.doctorNotes,
    })
  }, [activeRegistration, visits])

  function updateDraft<K extends keyof OpRegistrationRecord>(key: K, value: OpRegistrationRecord[K]) {
    setDraftRegistration((current) => ({ ...current, [key]: value }))
  }

  function updateMedicalHistory<K extends keyof OpRegistrationRecord['medicalHistory']>(
    key: K,
    value: OpRegistrationRecord['medicalHistory'][K],
  ) {
    setDraftRegistration((current) => ({
      ...current,
      medicalHistory: {
        ...current.medicalHistory,
        [key]: value,
      },
    }))
  }

  function updateAdvisedTreatments<K extends keyof OpRegistrationRecord['advisedTreatments']>(
    key: K,
    value: OpRegistrationRecord['advisedTreatments'][K],
  ) {
    setDraftRegistration((current) => ({
      ...current,
      advisedTreatments: {
        ...current.advisedTreatments,
        [key]: value,
      },
    }))
  }

  function buildRegistrationPayload() {
    return {
      registrationNumber: draftRegistration.registrationNumber,
      tokenNumber: draftRegistration.tokenNumber,
      patientId: draftRegistration.patientId,
      patientName: draftRegistration.patientName,
      registrationDate: draftRegistration.registrationDate,
      age: draftRegistration.age,
      gender: draftRegistration.gender,
      maritalStatus: draftRegistration.maritalStatus,
      bloodGroup: draftRegistration.bloodGroup,
      dateOfBirth: draftRegistration.dateOfBirth,
      occupation: draftRegistration.occupation,
      address: draftRegistration.address,
      mobileNumber: draftRegistration.mobileNumber,
      email: draftRegistration.email,
      reference: draftRegistration.reference,
      chiefComplaint: consultation.chiefComplaint || draftRegistration.chiefComplaint,
      dentalHistory: draftRegistration.dentalHistory,
      oralExamination: draftRegistration.oralExamination,
      diagnosis: consultation.diagnosis || draftRegistration.diagnosis,
      advisedNotes: draftRegistration.advisedNotes,
      findings: consultation.findings,
      treatmentGiven: consultation.treatmentGiven,
      prescriptionNotes: consultation.prescriptionNotes,
      followUpDate: consultation.followUpDate,
      toothNumber: consultation.toothNumber,
      procedure: consultation.procedure,
      doctorNotes: consultation.notes,
      medicalHistory: draftRegistration.medicalHistory,
      advisedTreatments: draftRegistration.advisedTreatments,
      treatmentRows: draftRegistration.treatmentRows,
      payment: draftRegistration.payment,
    }
  }

  function getNextPendingRegistrationNumber(
    registrationRowsInput: RegistrationListRow[],
    currentRegistrationNumber?: string,
  ) {
    const prioritizedRows = registrationRowsInput
      .filter((row) => row.registration.registrationNumber !== currentRegistrationNumber)
      .filter((row) => row.queueEntry?.status === 'With Doctor' || row.queueEntry?.status === 'Waiting')
      .sort((left, right) => {
        const leftPriority = left.queueEntry?.status === 'With Doctor' ? 0 : left.queueEntry?.status === 'Waiting' ? 1 : 2
        const rightPriority = right.queueEntry?.status === 'With Doctor' ? 0 : right.queueEntry?.status === 'Waiting' ? 1 : 2

        if (leftPriority !== rightPriority) return leftPriority - rightPriority

        const leftToken = Number(left.registration.tokenNumber || Number.MAX_SAFE_INTEGER)
        const rightToken = Number(right.registration.tokenNumber || Number.MAX_SAFE_INTEGER)
        return leftToken - rightToken
      })

    return prioritizedRows[0]?.registration.registrationNumber ?? ''
  }

  async function saveRegistrationEdits() {
    if (!draftRegistration.registrationNumber) {
      setFeedback('Open an OP first.')
      return
    }

    await registrationService.createOrUpdateRegistration(buildRegistrationPayload())
    await doctorService.saveConsultation(consultation)
    setFeedback('OP form edits saved.')
    await loadData()
  }

  async function saveAndComplete() {
    if (!draftRegistration.patientId || !activeQueueEntry) {
      setFeedback('Open a sent OP first.')
      return
    }

    const currentRegistrationNumber = draftRegistration.registrationNumber

    await registrationService.createOrUpdateRegistration(buildRegistrationPayload())
    const currentVisit = await doctorService.saveConsultation(consultation)
    await doctorService.completeVisit(currentVisit.id)
    await queueService.updateStatus(activeQueueEntry.id, 'Done')
    const refreshedData = await loadData()
    const refreshedRows = refreshedData.registrationRows.map((registration) => ({
      registration,
      queueEntry: refreshedData.queueRows.find((entry) => entry.patientId === registration.patientId) ?? null,
      visit: refreshedData.visitRows.find((visit) => visit.patientId === registration.patientId) ?? null,
    }))
    const nextRegistrationNumber = getNextPendingRegistrationNumber(refreshedRows, currentRegistrationNumber)

    setActiveRegistrationNumber(nextRegistrationNumber || CLOSED_OP_SENTINEL)
    setFeedback(nextRegistrationNumber ? 'OP form saved and visit completed. Next OP opened.' : 'OP form saved and visit completed.')
  }

  const sidebarRows = useMemo(() => {
    const sentFirst = filteredRows
      .filter((row) => row.queueEntry?.status === 'With Doctor')
      .concat(filteredRows.filter((row) => row.queueEntry?.status === 'Waiting'))

    const remaining = filteredRows.filter(
      (row) => row.queueEntry?.status !== 'With Doctor' && row.queueEntry?.status !== 'Waiting',
    )

    return [...sentFirst, ...remaining]
  }, [filteredRows])

  const filteredAmountSummary = useMemo(() => {
    const registrationsInFilter = filteredRows.map((row) => row.registration)

    return {
      totalAmount: registrationsInFilter.reduce((sum, item) => sum + (item.payment.finalAmount || 0), 0),
      cashAmount: registrationsInFilter
        .filter((item) => item.payment.paymentMode === 'Cash')
        .reduce((sum, item) => sum + (item.payment.finalAmount || 0), 0),
      upiAmount: registrationsInFilter
        .filter((item) => item.payment.paymentMode === 'UPI')
        .reduce((sum, item) => sum + (item.payment.finalAmount || 0), 0),
      cardAmount: registrationsInFilter
        .filter((item) => item.payment.paymentMode === 'Card')
        .reduce((sum, item) => sum + (item.payment.finalAmount || 0), 0),
    }
  }, [filteredRows])

  const amountSummaryLabel =
    dateFilter === 'today'
      ? 'Showing amount details for today\'s filtered OP list.'
      : dateFilter === 'custom'
        ? `Showing amount details from ${dateFrom || '--'} to ${dateTo || '--'}.`
        : 'Showing amount details for all filtered OP records.'

  return (
    <PortalShell
      roleLabel="Doctor Panel"
      clinicName="Dhanra Dental Aesthetic and Implant Care"
      clinicSubtitle="Editable OP dashboard for live consultation and history."
      title={initialView === 'patients' ? 'Doctor OP History' : 'Doctor Dashboard'}
      subtitle={`Reception handoff, editable OP form, and day-wise OP list for ${mockDoctorProfile.name}.`}
      items={[
        { label: 'Dashboard', href: '/doctor' },
        { label: 'Today OPs', href: '/doctor/queue' },
        { label: 'Total OP List', href: '/doctor/patients' },
      ]}
      topRight={feedback ? <div className="w-full rounded-2xl bg-[#eef4f8] px-4 py-3 text-sm font-medium text-[#0f2f56] md:w-auto">{feedback}</div> : null}
    >
      <div className="space-y-6 pt-4 md:pt-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <DoctorDashboardStatCard
            title="With Doctor"
            value={withDoctorEntry?.token ?? '--'}
            helper={withDoctorEntry?.patientName ?? 'No patient in consultation'}
            icon={<UserRound size={20} />}
            accent="blue"
          />
          <DoctorDashboardStatCard
            title="Today OPs"
            value={todayRegistrations.length}
            helper="Registrations created today"
            icon={<Users size={20} />}
            accent="sky"
          />
          <DoctorDashboardStatCard
            title="Waiting Today"
            value={waitingEntries.length}
            helper="Next OPs from reception"
            icon={<ClipboardList size={20} />}
            accent="amber"
          />
          <DoctorDashboardStatCard
            title="Completed Today"
            value={todayCompleted}
            helper="Visits finished today"
            icon={<CalendarClock size={20} />}
            accent="green"
          />
        </div>

        {(initialView === 'dashboard' || initialView === 'queue') && (
          <div className="space-y-6">
            <SectionCard id="doctor-op-panel" title="OP Panel" subtitle="The OP sent by reception appears here first. The doctor can edit the OP form and save it.">
              {draftRegistration.registrationNumber ? (
                <div className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <DoctorInput label="Registration No" value={draftRegistration.registrationNumber} onChange={() => undefined} readOnly />
                    <DoctorInput label="Token No" value={draftRegistration.tokenNumber} onChange={() => undefined} readOnly />
                    <DoctorInput label="Date" type="date" value={draftRegistration.registrationDate} onChange={(value) => updateDraft('registrationDate', value)} />
                    <DoctorStatusCard label="Queue Status" value={activeQueueEntry?.status ?? activeVisit?.status ?? 'Saved'} />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <DoctorInput label="Patient Name" value={draftRegistration.patientName} onChange={(value) => updateDraft('patientName', value)} />
                    <DoctorInput label="Age" value={String(draftRegistration.age || '')} onChange={(value) => updateDraft('age', Number(value || 0))} />
                    <DoctorSelect label="Gender" value={draftRegistration.gender} onChange={(value) => updateDraft('gender', value as Gender)} options={['Male', 'Female', 'Other']} />
                    <DoctorInput label="Mobile" value={draftRegistration.mobileNumber} onChange={(value) => updateDraft('mobileNumber', value)} />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <DoctorSelect label="Marital Status" value={draftRegistration.maritalStatus} onChange={(value) => updateDraft('maritalStatus', value)} options={['', 'Single', 'Married', 'Divorced', 'Widowed']} />
                    <DoctorSelect label="Blood Group" value={draftRegistration.bloodGroup} onChange={(value) => updateDraft('bloodGroup', value)} options={['', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']} />
                    <DoctorInput label="Date of Birth" type="date" value={draftRegistration.dateOfBirth} onChange={(value) => updateDraft('dateOfBirth', value)} />
                    <DoctorInput label="Occupation" value={draftRegistration.occupation} onChange={(value) => updateDraft('occupation', value)} />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <DoctorInput label="Address" value={draftRegistration.address} onChange={(value) => updateDraft('address', value)} />
                    <DoctorInput label="Email" value={draftRegistration.email} onChange={(value) => updateDraft('email', value)} />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <DoctorInput label="Reference" value={draftRegistration.reference} onChange={(value) => updateDraft('reference', value)} />
                    <DoctorInput label="Payment Visit Type" value={draftRegistration.payment.visitType} onChange={() => undefined} readOnly />
                  </div>

                  <DoctorTextarea label="Chief Complaint" value={draftRegistration.chiefComplaint} onChange={(value) => updateDraft('chiefComplaint', value)} rows={3} />
                  <DoctorTextarea label="Dental History" value={draftRegistration.dentalHistory} onChange={(value) => updateDraft('dentalHistory', value)} rows={3} />
                  <DoctorTextarea label="Diagnosis" value={draftRegistration.diagnosis} onChange={(value) => updateDraft('diagnosis', value)} rows={5} />
                  <DoctorTextarea label="Advised Notes" value={draftRegistration.advisedNotes} onChange={(value) => updateDraft('advisedNotes', value)} rows={3} />

                  <div className="grid gap-6 lg:grid-cols-2">
                    <CheckGroupCard title="Medical History">
                      <DoctorCheckbox label="Asthma" checked={draftRegistration.medicalHistory.asthma} onChange={(value) => updateMedicalHistory('asthma', value)} />
                      <DoctorCheckbox label="Blood Pressure" checked={draftRegistration.medicalHistory.bloodPressure} onChange={(value) => updateMedicalHistory('bloodPressure', value)} />
                      <DoctorCheckbox label="Diabetes" checked={draftRegistration.medicalHistory.diabetes} onChange={(value) => updateMedicalHistory('diabetes', value)} />
                      <DoctorCheckbox label="Drug Allergy" checked={draftRegistration.medicalHistory.drugAllergy} onChange={(value) => updateMedicalHistory('drugAllergy', value)} />
                      <DoctorCheckbox label="Heart Problem" checked={draftRegistration.medicalHistory.heartProblem} onChange={(value) => updateMedicalHistory('heartProblem', value)} />
                      <DoctorCheckbox label="Gastric" checked={draftRegistration.medicalHistory.gastric} onChange={(value) => updateMedicalHistory('gastric', value)} />
                      <DoctorCheckbox label="Other Issue" checked={draftRegistration.medicalHistory.otherMedicalIssue} onChange={(value) => updateMedicalHistory('otherMedicalIssue', value)} />
                      <div className="lg:col-span-2">
                        <DoctorInput label="Other Issue Details" value={draftRegistration.medicalHistory.otherMedicalIssueDetails} onChange={(value) => updateMedicalHistory('otherMedicalIssueDetails', value)} />
                      </div>
                    </CheckGroupCard>

                    <CheckGroupCard title="Advised Treatments">
                      <DoctorCheckbox label="Scaling" checked={draftRegistration.advisedTreatments.scaling} onChange={(value) => updateAdvisedTreatments('scaling', value)} />
                      <DoctorCheckbox label="Extraction" checked={draftRegistration.advisedTreatments.extraction} onChange={(value) => updateAdvisedTreatments('extraction', value)} />
                      <DoctorCheckbox label="RCT" checked={draftRegistration.advisedTreatments.rootCanal} onChange={(value) => updateAdvisedTreatments('rootCanal', value)} />
                      <DoctorCheckbox label="Pedo" checked={draftRegistration.advisedTreatments.pedo} onChange={(value) => updateAdvisedTreatments('pedo', value)} />
                      <DoctorCheckbox label="FPD/RPD/CD" checked={draftRegistration.advisedTreatments.fpdRpdCd} onChange={(value) => updateAdvisedTreatments('fpdRpdCd', value)} />
                      <DoctorCheckbox label="Other Treatment" checked={draftRegistration.advisedTreatments.otherTreatment} onChange={(value) => updateAdvisedTreatments('otherTreatment', value)} />
                      <div className="lg:col-span-2">
                        <DoctorInput label="Other Treatment Details" value={draftRegistration.advisedTreatments.otherTreatmentDetails} onChange={(value) => updateAdvisedTreatments('otherTreatmentDetails', value)} />
                      </div>
                    </CheckGroupCard>
                  </div>

                  <SectionCard id="doctor-clinical-notes" title="Doctor Clinical Notes" subtitle="Doctor can edit and save visit notes before completion.">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <DoctorInput label="Chief Complaint" value={consultation.chiefComplaint} onChange={(value) => setConsultation((current) => ({ ...current, chiefComplaint: value }))} />
                      <DoctorInput label="Findings" value={consultation.findings} onChange={(value) => setConsultation((current) => ({ ...current, findings: value }))} />
                      <DoctorInput label="Diagnosis" value={consultation.diagnosis} onChange={(value) => setConsultation((current) => ({ ...current, diagnosis: value }))} />
                      <DoctorInput label="Treatment Given" value={consultation.treatmentGiven} onChange={(value) => setConsultation((current) => ({ ...current, treatmentGiven: value }))} />
                      <DoctorInput label="Prescription Notes" value={consultation.prescriptionNotes} onChange={(value) => setConsultation((current) => ({ ...current, prescriptionNotes: value }))} />
                      <DoctorInput label="Follow-up Date" type="date" value={consultation.followUpDate} onChange={(value) => setConsultation((current) => ({ ...current, followUpDate: value }))} />
                      <DoctorInput label="Tooth Number" value={consultation.toothNumber} onChange={(value) => setConsultation((current) => ({ ...current, toothNumber: value }))} />
                      <DoctorInput label="Procedure" value={consultation.procedure} onChange={(value) => setConsultation((current) => ({ ...current, procedure: value }))} />
                      <div className="sm:col-span-2">
                        <DoctorTextarea label="Notes" value={consultation.notes} onChange={(value) => setConsultation((current) => ({ ...current, notes: value }))} rows={4} />
                      </div>
                    </div>
                  </SectionCard>

                  <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                    <ActionButton className="w-full sm:w-auto" onClick={() => void saveRegistrationEdits()}>
                      <span className="inline-flex items-center gap-2">
                        <FilePenLine size={16} />
                        Save OP Form
                      </span>
                    </ActionButton>
                    <ActionButton className="w-full sm:w-auto" variant="success" onClick={() => void saveAndComplete()}>Save and Complete</ActionButton>
                  </div>
                </div>
              ) : (
                <EmptyState
                  title="No OP opened in doctor panel."
                  description="When reception clicks Send to Doctor, that OP will appear here automatically. You can also open any OP from the list on the right."
                />
              )}
            </SectionCard>

            <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
              <SectionCard id="doctor-ops-list" title="OPs List" subtitle="Current OP, next OPs, and total filtered OP list. Click Show OP to load it into the doctor panel.">
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <SearchField label="Search OP" value={searchText} onChange={setSearchText} icon={<Search size={16} />} />
                  <DoctorSelect
                    label="Date Filter"
                    value={dateFilter}
                    onChange={(value) => handleDateFilterChange(value as 'today' | 'custom' | 'all')}
                    options={['today', 'custom', 'all']}
                    optionLabel={(option) => option === 'today' ? 'Today' : option === 'custom' ? 'Custom Range' : 'All'}
                  />
                  <SearchField label="From Date" value={dateFrom} onChange={handleDateFromChange} type="date" icon={<CalendarClock size={16} />} />
                  <SearchField label="To Date" value={dateTo} onChange={handleDateToChange} type="date" icon={<CalendarClock size={16} />} />
                </div>

                <div className="mt-5 grid gap-3 xl:grid-cols-2">
                  {sidebarRows.length === 0 ? (
                    <div className="xl:col-span-2">
                      <EmptyState title="No OPs found." description="No registrations match the current filter." />
                    </div>
                  ) : (
                    sidebarRows.map(({ registration, queueEntry, visit }) => (
                      <div key={registration.registrationNumber} className={`rounded-[24px] border p-4 ${activeRegistrationNumber === registration.registrationNumber ? 'border-[#b8cee5] bg-[#f3f8fd]' : 'border-[#dbe5ef] bg-white'}`}>
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <div className="text-base font-bold text-[#102132]">{registration.patientName}</div>
                            <div className="mt-1 text-sm text-[#6b7f94]">
                              Token {registration.tokenNumber || '--'} | {registration.registrationNumber}
                            </div>
                            <div className="mt-2 text-sm text-[#7b8ea2]">{registration.registrationDate}</div>
                          </div>
                          <div className="sm:pt-1">
                            <StatusBadge label={queueEntry?.status ?? visit?.status ?? 'Saved'} />
                          </div>
                        </div>
                        <div className="mt-4">
                          <ActionButton variant="secondary" className="min-h-[40px] w-full px-4 sm:w-auto" onClick={() => setActiveRegistrationNumber(registration.registrationNumber)}>
                            Show OP
                          </ActionButton>
                        </div>
                      </div>
                    ))
                  )}
                </div>

              </SectionCard>

              <SectionCard id="doctor-summary" title="Today OP Summary" subtitle="Quick numbers for current consultation and day OP load.">
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
                  <MiniCountCard label="Active Consultation" value={withDoctorEntry?.token ?? '--'} helper={withDoctorEntry?.patientName ?? 'No active token'} />
                  <MiniCountCard label="Open Visits" value={openVisits} helper="Saved visit notes still open" />
                </div>
              </SectionCard>
            </div>

            <AmountCollectedCard
              totalAmount={filteredAmountSummary.totalAmount}
              cashAmount={filteredAmountSummary.cashAmount}
              upiAmount={filteredAmountSummary.upiAmount}
              cardAmount={filteredAmountSummary.cardAmount}
              helper={amountSummaryLabel}
            />
          </div>
        )}

        {initialView === 'patients' && (
          <SectionCard id="doctor-history" title="Day-wise OP History" subtitle="Search and filter all OPs date-wise, with token and visit status.">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <SearchField label="Search OP" value={searchText} onChange={setSearchText} icon={<Search size={16} />} />
              <DoctorSelect
                label="Date Filter"
                value={dateFilter}
                onChange={(value) => handleDateFilterChange(value as 'today' | 'custom' | 'all')}
                options={['today', 'custom', 'all']}
                optionLabel={(option) => option === 'today' ? 'Today' : option === 'custom' ? 'Custom Range' : 'All'}
              />
              <SearchField label="From Date" value={dateFrom} onChange={handleDateFromChange} type="date" icon={<CalendarClock size={16} />} />
              <SearchField label="To Date" value={dateTo} onChange={handleDateToChange} type="date" icon={<CalendarClock size={16} />} />
            </div>

            <div className="mt-5 md:hidden">
              <div className="space-y-3">
                {filteredRows.length === 0 ? (
                  <EmptyState title="No OP history found." description="No registrations match the current search or date filter." />
                ) : (
                  filteredRows.map((row) => (
                    <DoctorHistoryMobileCard key={row.registration.registrationNumber} row={row} />
                  ))
                )}
              </div>
            </div>

            <div className="mt-5 hidden md:block">
              <DataTable
                rows={filteredRows}
                emptyText="No OP history found."
                columns={[
                  { key: 'token', header: 'Token', render: (row) => row.registration.tokenNumber || '--' },
                  { key: 'registration', header: 'Registration No', render: (row) => row.registration.registrationNumber },
                  { key: 'name', header: 'Patient Name', render: (row) => row.registration.patientName },
                  { key: 'mobile', header: 'Mobile', render: (row) => row.registration.mobileNumber },
                  { key: 'date', header: 'Date', render: (row) => row.registration.registrationDate },
                  { key: 'status', header: 'Status', render: (row) => <StatusBadge label={row.queueEntry?.status ?? row.visit?.status ?? 'Saved'} /> },
                  {
                    key: 'action',
                    header: 'Open',
                    render: (row) => (
                      <Link
                        href={`/doctor?registration=${encodeURIComponent(row.registration.registrationNumber)}`}
                        className="inline-flex min-h-[40px] w-full items-center justify-center rounded-full border border-[#dbe5ef] bg-white px-4 text-sm font-semibold text-[#153b68] transition hover:bg-[#f8fbfe] sm:w-auto"
                      >
                        Show OP
                      </Link>
                    ),
                  },
                ]}
              />
            </div>

            <div className="mt-5">
              <AmountCollectedCard
                totalAmount={filteredAmountSummary.totalAmount}
                cashAmount={filteredAmountSummary.cashAmount}
                upiAmount={filteredAmountSummary.upiAmount}
                cardAmount={filteredAmountSummary.cardAmount}
                helper={amountSummaryLabel}
              />
            </div>
          </SectionCard>
        )}
      </div>
    </PortalShell>
  )
}

function AmountCollectedCard({
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
              Active Filter
            </div>
          </div>
          <div className="mt-6">
            <div className="h-3 overflow-hidden rounded-full bg-white/15">
              <div
                className="h-full rounded-full bg-white/90 transition-all"
                style={{ width: `${Math.min(100, Math.max(8, (totalAmount / largestModeAmount) * 100))}%` }}
              />
            </div>
            <div className="mt-2 text-sm text-[#d7e5f5]">Overall collection for the current OP filter.</div>
          </div>
        </div>
        <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-1">
          {modeRows.map((mode) => (
            <AmountModePill
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

function DoctorDashboardStatCard({
  title,
  value,
  helper,
  icon,
  accent,
}: {
  title: string
  value: string | number
  helper: string
  icon: ReactNode
  accent: 'blue' | 'sky' | 'amber' | 'green'
}) {
  const accentStyles = {
    blue: {
      iconWrap: 'bg-[linear-gradient(135deg,#eff5fb_0%,#dce9f8_100%)] text-[#153b68]',
      glow: 'from-[#163d6b]/10 via-[#2e5f95]/5 to-transparent',
      border: 'border-[#d8e5f2]',
      value: 'text-[#102132]',
      pill: 'bg-[#edf4fb] text-[#244c78]',
    },
    sky: {
      iconWrap: 'bg-[linear-gradient(135deg,#eef8fc_0%,#dbedf8_100%)] text-[#1d6380]',
      glow: 'from-[#4d9bc0]/12 via-[#77b7d5]/6 to-transparent',
      border: 'border-[#d9eaf4]',
      value: 'text-[#102132]',
      pill: 'bg-[#edf8fc] text-[#2a6e88]',
    },
    amber: {
      iconWrap: 'bg-[linear-gradient(135deg,#fff7ea_0%,#f7e7c2_100%)] text-[#9a6a2f]',
      glow: 'from-[#d9b062]/16 via-[#e8ca8a]/7 to-transparent',
      border: 'border-[#efe1bf]',
      value: 'text-[#102132]',
      pill: 'bg-[#fff8ed] text-[#96662f]',
    },
    green: {
      iconWrap: 'bg-[linear-gradient(135deg,#eef9f3_0%,#daf0e4_100%)] text-[#2b6f56]',
      glow: 'from-[#56a27f]/14 via-[#7bc09d]/6 to-transparent',
      border: 'border-[#d9ecdf]',
      value: 'text-[#102132]',
      pill: 'bg-[#eef9f3] text-[#2f7258]',
    },
  }[accent]

  return (
    <div className={`group relative overflow-hidden rounded-[28px] border ${accentStyles.border} bg-white p-5 md:p-6 shadow-[0_18px_40px_rgba(15,47,86,0.07)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_50px_rgba(15,47,86,0.10)]`}>
      <div className={`pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-br ${accentStyles.glow}`} />
      <div className="relative flex h-full flex-col">
        <div className="flex items-start justify-between gap-4">
          <div className={`inline-flex h-14 w-14 items-center justify-center rounded-[20px] md:h-18 md:w-18 md:rounded-[22px] ${accentStyles.iconWrap}`}>
            {icon}
          </div>
          <div className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${accentStyles.pill}`}>
            Live
          </div>
        </div>
        <div className="mt-5 text-[15px] font-semibold text-[#57708b] md:mt-8">{title}</div>
        <div className={`mt-3 text-[34px] font-bold leading-none md:text-[48px] ${accentStyles.value}`}>{value}</div>
        <div className="mt-4 text-[14px] leading-6 text-[#70869d] md:text-[15px]">{helper}</div>
      </div>
    </div>
  )
}

function AmountModePill({
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
      <div className="mt-2 text-xl font-bold text-[#102132] md:text-2xl">Rs. {value}</div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#dde7f1]">
        <div
          className={`h-full rounded-full transition-all ${colorClass}`}
          style={{ width: `${Math.min(100, Math.max(value > 0 ? 10 : 0, percentage))}%` }}
        />
      </div>
    </div>
  )
}

function DoctorInput({
  label,
  value,
  onChange,
  type = 'text',
  readOnly = false,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  type?: 'text' | 'date'
  readOnly?: boolean
}) {
  return (
    <label className="block">
      <div className="mb-2 text-sm font-semibold text-[#4f6277]">{label}</div>
      <input
        type={type}
        value={value}
        readOnly={readOnly}
        onChange={(event) => onChange(event.target.value)}
        className={`min-h-[56px] w-full rounded-[22px] border border-[#dce6ef] px-4 text-base outline-none ${readOnly ? 'bg-[#eef4f8] text-[#5f7287]' : 'bg-[#f9fbfd]'}`}
      />
    </label>
  )
}

function DoctorTextarea({
  label,
  value,
  onChange,
  rows,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  rows: number
}) {
  return (
    <label className="block">
      <div className="mb-2 text-sm font-semibold text-[#4f6277]">{label}</div>
      <textarea rows={rows} value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded-[22px] border border-[#dce6ef] bg-[#f9fbfd] px-4 py-3 text-base outline-none" />
    </label>
  )
}

function DoctorSelect({
  label,
  value,
  onChange,
  options,
  optionLabel,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  options: string[]
  optionLabel?: (option: string) => string
}) {
  return (
    <label className="block">
      <div className="mb-2 text-sm font-semibold text-[#4f6277]">{label}</div>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="min-h-[56px] w-full rounded-[22px] border border-[#dce6ef] bg-[#f9fbfd] px-4 text-base outline-none">
        {options.map((option) => (
          <option key={option} value={option}>
            {optionLabel ? optionLabel(option) : option || 'Select'}
          </option>
        ))}
      </select>
    </label>
  )
}

function DoctorCheckbox({
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

function CheckGroupCard({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-[24px] border border-[#dbe5ef] bg-white p-5">
      <div className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-[#6b7f94]">{title}</div>
      <div className="grid gap-3 lg:grid-cols-2">{children}</div>
    </div>
  )
}

function DoctorStatusCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[22px] border border-[#dbe5ef] bg-[#f8fbfe] p-4">
      <div className="mb-3 text-sm font-semibold text-[#4f6277]">{label}</div>
      <StatusBadge label={value} />
    </div>
  )
}

function SearchField({
  label,
  value,
  onChange,
  icon,
  type = 'text',
}: {
  label: string
  value: string
  onChange: (value: string) => void
  icon: React.ReactNode
  type?: 'text' | 'date'
}) {
  return (
    <label className="block">
      <div className="mb-2 text-sm font-semibold text-[#4f6277]">{label}</div>
      <div className="flex min-h-[56px] items-center gap-3 rounded-[22px] border border-[#dce6ef] bg-[#f9fbfd] px-4">
        <span className="text-[#5f7287]">{icon}</span>
        <input type={type} value={value} onChange={(event) => onChange(event.target.value)} className="w-full bg-transparent text-base outline-none" />
      </div>
    </label>
  )
}

function MiniCountCard({ label, value, helper }: { label: string; value: string | number; helper: string }) {
  return (
    <div className="rounded-[22px] border border-[#dbe5ef] bg-[#f8fbfe] p-4">
      <div className="text-sm font-semibold text-[#6b7f94]">{label}</div>
      <div className="mt-3 text-3xl font-black text-[#102132]">{value}</div>
      <div className="mt-2 text-sm text-[#7b8ea2]">{helper}</div>
    </div>
  )
}

function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-[24px] border border-dashed border-[#d3e0eb] bg-[#f8fbfe] px-5 py-8">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-[#eaf2fb] p-3 text-[#153b68]">
          <UserRound size={18} />
        </div>
        <div>
          <div className="text-lg font-bold text-[#102132]">{title}</div>
          <div className="mt-1 text-sm leading-7 text-[#6b7f94]">{description}</div>
        </div>
      </div>
    </div>
  )
}

function DoctorHistoryMobileCard({ row }: { row: RegistrationListRow }) {
  return (
    <div className="rounded-[24px] border border-[#dbe5ef] bg-white p-4 shadow-[0_12px_30px_rgba(15,47,86,0.05)]">
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="text-base font-bold text-[#102132]">{row.registration.patientName}</div>
            <div className="mt-1 text-sm text-[#6b7f94]">{row.registration.registrationNumber}</div>
          </div>
          <div className="sm:pt-1">
            <StatusBadge label={row.queueEntry?.status ?? row.visit?.status ?? 'Saved'} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <MobileInfoTile label="Token" value={row.registration.tokenNumber || '--'} />
          <MobileInfoTile label="Date" value={row.registration.registrationDate} />
          <MobileInfoTile label="Mobile" value={row.registration.mobileNumber || '--'} />
          <MobileInfoTile label="Mode" value={row.registration.payment.paymentMode || '--'} />
        </div>

        <Link
          href={`/doctor?registration=${encodeURIComponent(row.registration.registrationNumber)}`}
          className="inline-flex min-h-[44px] w-full items-center justify-center rounded-full border border-[#dbe5ef] bg-[#f8fbfe] px-4 text-sm font-semibold text-[#153b68] transition hover:bg-white"
        >
          Show OP
        </Link>
      </div>
    </div>
  )
}

function MobileInfoTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[18px] bg-[#f8fbfe] px-3 py-3">
      <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#7b8ea2]">{label}</div>
      <div className="mt-1 text-sm font-semibold text-[#102132]">{value}</div>
    </div>
  )
}
