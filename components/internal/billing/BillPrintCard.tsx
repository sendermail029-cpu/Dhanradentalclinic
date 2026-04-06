'use client'

import ActionButton from '@/components/internal/ui/ActionButton'
import StatusBadge from '@/components/internal/ui/StatusBadge'
import type { BillRecord } from '@/types/bill'

export default function BillPrintCard({
  bill,
  clinicName = 'Clinic Name',
}: {
  bill: BillRecord
  clinicName?: string
}) {
  return (
    <div className="space-y-4">
      <div className="print-hidden">
        <ActionButton onClick={() => window.print()}>Print Bill</ActionButton>
      </div>

      <div className="print-surface mx-auto max-w-3xl rounded-[28px] border border-[#dfe8f0] bg-white p-8 shadow-[0_12px_28px_rgba(15,47,86,0.08)]">
        <div className="flex items-start justify-between gap-4 border-b border-[#ebf0f5] pb-6">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.24em] text-[#6d8195]">Print Ready Bill</div>
            <h2 className="mt-2 text-3xl font-semibold text-[#102132]">{clinicName}</h2>
            <p className="mt-2 text-sm text-[#708398]">Billing receipt</p>
          </div>
          <StatusBadge label={bill.paidStatus} />
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Info label="Patient Name" value={bill.patientName} />
          <Info label="Date" value={bill.date} />
          <Info label="Bill Number" value={bill.billNumber} />
          <Info label="Payment Mode" value={bill.paymentMode} />
          <Info label="Visit Type" value={bill.visitType} />
          <Info label="Paid Status" value={bill.paidStatus} />
        </div>

        <div className="mt-6 overflow-hidden rounded-3xl border border-[#e5edf4]">
          <table className="min-w-full">
            <thead className="bg-[#f7fafc]">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-[0.16em] text-[#6d8195]">Item</th>
                <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-[0.16em] text-[#6d8195]">Amount</th>
              </tr>
            </thead>
            <tbody>
              {bill.items.map((item, index) => (
                <tr key={`${item.label}-${index}`} className="border-t border-[#edf3f7]">
                  <td className="px-4 py-4 text-sm text-[#122131]">{item.label}</td>
                  <td className="px-4 py-4 text-right text-sm font-medium text-[#122131]">Rs. {item.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 ml-auto max-w-sm space-y-3 rounded-3xl bg-[#f7fafc] p-5">
          <TotalRow label="Amount" value={bill.amount} />
          <TotalRow label="Discount" value={bill.discount} />
          <TotalRow label="Final Amount" value={bill.finalAmount} strong />
        </div>
      </div>
    </div>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-[#f7fafc] p-4">
      <div className="text-xs font-bold uppercase tracking-[0.16em] text-[#6d8195]">{label}</div>
      <div className="mt-2 text-base font-semibold text-[#102132]">{value}</div>
    </div>
  )
}

function TotalRow({ label, value, strong = false }: { label: string; value: number; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className={`text-sm ${strong ? 'font-semibold text-[#102132]' : 'text-[#708398]'}`}>{label}</span>
      <span className={`text-sm ${strong ? 'font-bold text-[#102132]' : 'font-medium text-[#122131]'}`}>Rs. {value}</span>
    </div>
  )
}
