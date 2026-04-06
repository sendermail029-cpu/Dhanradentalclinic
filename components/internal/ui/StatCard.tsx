import type { ReactNode } from 'react'

export default function StatCard({
  title,
  value,
  helper,
  icon,
}: {
  title: string
  value: string | number
  helper: string
  icon: ReactNode
}) {
  return (
    <div className="rounded-[24px] bg-white p-5 shadow-[0_10px_30px_rgba(15,47,86,0.08)] ring-1 ring-[#e2ebf3]">
      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eef4f8] text-[#0f2f56]">
        {icon}
      </div>
      <div className="text-sm font-medium text-[#5f7287]">{title}</div>
      <div className="mt-2 text-3xl font-bold text-[#102132]">{value}</div>
      <div className="mt-2 text-sm text-[#71859a]">{helper}</div>
    </div>
  )
}
