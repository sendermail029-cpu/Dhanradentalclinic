import type { ReactNode } from 'react'

export default function SectionCard({
  id,
  title,
  subtitle,
  children,
  action,
}: {
  id?: string
  title: string
  subtitle?: string
  children: ReactNode
  action?: ReactNode
}) {
  return (
    <section
      id={id}
      className="border-b border-[#e2ebf3] bg-transparent px-1 py-5 md:px-2 md:py-6"
    >
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-[#102132]">{title}</h2>
          {subtitle ? <p className="mt-1 text-sm text-[#6d8195]">{subtitle}</p> : null}
        </div>
        {action}
      </div>
      {children}
    </section>
  )
}
