import { cloneMockData, mockVisits } from '@/lib/internal/mockData'
import type { ConsultationInput, VisitRecord } from '@/types/visit'

let visitsStore: VisitRecord[] = cloneMockData(mockVisits)

function nextVisitId() {
  return `VIS-${visitsStore.length + 1}`
}

export const doctorService = {
  async listVisits() {
    return cloneMockData(visitsStore)
  },

  async saveConsultation(input: ConsultationInput) {
    const existing = visitsStore.find((visit) => visit.patientId === input.patientId && visit.status === 'Open')

    if (existing) {
      visitsStore = visitsStore.map((visit) =>
        visit.id === existing.id
          ? {
              ...visit,
              ...input,
            }
          : visit,
      )

      return cloneMockData(visitsStore.find((visit) => visit.id === existing.id)!)
    }

    const record: VisitRecord = {
      id: nextVisitId(),
      ...input,
      status: 'Open',
      billingStatus: 'Pending',
    }

    visitsStore = [record, ...visitsStore]
    return cloneMockData(record)
  },

  async completeVisit(visitId: string) {
    visitsStore = visitsStore.map((visit) =>
      visit.id === visitId ? { ...visit, status: 'Completed' } : visit,
    )

    return cloneMockData(visitsStore.find((visit) => visit.id === visitId) ?? null)
  },

  async sendToBilling(visitId: string) {
    visitsStore = visitsStore.map((visit) =>
      visit.id === visitId ? { ...visit, billingStatus: 'Sent to Billing' } : visit,
    )

    return cloneMockData(visitsStore.find((visit) => visit.id === visitId) ?? null)
  },

  async addFollowUp(visitId: string, followUpDate: string) {
    visitsStore = visitsStore.map((visit) =>
      visit.id === visitId ? { ...visit, followUpDate } : visit,
    )

    return cloneMockData(visitsStore.find((visit) => visit.id === visitId) ?? null)
  },
}
