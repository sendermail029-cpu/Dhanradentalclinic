export type BillingPaymentMode = 'Cash' | 'UPI' | 'Card'
export type BillPaidStatus = 'Paid' | 'Pending'

export interface BillLineItem {
  label: string
  amount: number
}

export interface BillRecord {
  id: string
  billNumber: string
  patientId?: string
  patientName: string
  date: string
  visitType: string
  items: BillLineItem[]
  amount: number
  discount: number
  finalAmount: number
  paymentMode: BillingPaymentMode
  paidStatus: BillPaidStatus
}

export interface CreateBillInput {
  patientId?: string
  patientName: string
  visitType: string
  amount: number
  discount: number
  paymentMode: BillingPaymentMode
}
