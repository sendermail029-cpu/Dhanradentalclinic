export default function StatusBadge({ label }: { label: string }) {
  const styleMap: Record<string, string> = {
    Waiting: 'bg-[#fff4de] text-[#9a6700]',
    'With Doctor': 'bg-[#ffe8d8] text-[#c25b12]',
    Done: 'bg-[#e8f7ee] text-[#1c7c54]',
    Paid: 'bg-[#e8f7ee] text-[#1c7c54]',
    Pending: 'bg-[#fff4de] text-[#9a6700]',
    Open: 'bg-[#f1ecff] text-[#5b3aa8]',
    Completed: 'bg-[#e8f7ee] text-[#1c7c54]',
    'Sent to Billing': 'bg-[#e7f1ff] text-[#1557a0]',
  }

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${styleMap[label] ?? 'bg-[#eef4f8] text-[#0f2f56]'}`}>
      {label}
    </span>
  )
}
