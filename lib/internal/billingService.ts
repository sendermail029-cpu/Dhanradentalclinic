import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  runTransaction,
  updateDoc,
} from 'firebase/firestore'
import { firestore } from '@/lib/firebase'
import type { BillRecord, CreateBillInput } from '@/types/bill'

const billsCollection = collection(firestore, 'bills')
const countersCollection = collection(firestore, 'counters')
const billCounterRef = doc(countersCollection, 'billNumber')
const billStart = 2400

function todayString() {
  return new Date().toISOString().slice(0, 10)
}

function formatBillNumber(value: number) {
  return `DD-${value}`
}

function mapBill(documentId: string, data: Record<string, unknown>): BillRecord {
  return {
    id: documentId,
    billNumber: String(data.billNumber ?? ''),
    patientId: data.patientId ? String(data.patientId) : undefined,
    patientName: String(data.patientName ?? ''),
    date: String(data.date ?? ''),
    visitType: String(data.visitType ?? ''),
    items: Array.isArray(data.items) ? (data.items as BillRecord['items']) : [],
    amount: Number(data.amount ?? 0),
    discount: Number(data.discount ?? 0),
    finalAmount: Number(data.finalAmount ?? 0),
    paymentMode: (data.paymentMode as BillRecord['paymentMode']) ?? 'Cash',
    paidStatus: (data.paidStatus as BillRecord['paidStatus']) ?? 'Pending',
  }
}

export const billingService = {
  async listBills(): Promise<BillRecord[]> {
    const snapshot = await getDocs(query(billsCollection, orderBy('billSequence', 'desc')))
    return snapshot.docs.map((billDoc) => mapBill(billDoc.id, billDoc.data()))
  },

  async createBill(input: CreateBillInput): Promise<BillRecord> {
    const billRef = doc(billsCollection)
    let createdBill: BillRecord | null = null

    await runTransaction(firestore, async (transaction) => {
      const counterSnapshot = await transaction.get(billCounterRef)
      const currentSequence = counterSnapshot.exists()
        ? Number(counterSnapshot.data().value ?? billStart)
        : billStart
      const nextSequence = currentSequence + 1
      const finalAmount = Math.max(0, input.amount - input.discount)

      const record = {
        billSequence: nextSequence,
        billNumber: formatBillNumber(nextSequence),
        patientId: input.patientId ?? null,
        patientName: input.patientName,
        date: todayString(),
        visitType: input.visitType,
        items: [{ label: input.visitType, amount: input.amount }],
        amount: input.amount,
        discount: input.discount,
        finalAmount,
        paymentMode: input.paymentMode,
        paidStatus: 'Pending' as const,
      }

      transaction.set(billCounterRef, {
        value: nextSequence,
        updatedAt: new Date().toISOString(),
      })
      transaction.set(billRef, record)

      createdBill = mapBill(billRef.id, record)
    })

    if (!createdBill) {
      throw new Error('Bill creation failed. Please try again.')
    }

    return createdBill as BillRecord
  },

  async markBillPaid(billId: string): Promise<BillRecord | null> {
    const billRef = doc(billsCollection, billId)
    await updateDoc(billRef, { paidStatus: 'Paid' })

    const updatedSnapshot = await getDoc(billRef)
    if (!updatedSnapshot.exists()) return null
    return mapBill(updatedSnapshot.id, updatedSnapshot.data())
  },
}
