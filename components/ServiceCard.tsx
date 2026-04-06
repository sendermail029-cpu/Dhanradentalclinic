import type { ServiceItem } from '@/types'
import {
  Activity,
  Anchor,
  Circle,
  Crown,
  GitBranch,
  Heart,
  Home,
  Layers,
  Scissors,
  Shield,
  Smile,
  Sparkles,
  Zap,
} from 'lucide-react'

const ICON_MAP: Record<string, React.ElementType> = {
  Anchor,
  Smile,
  Sparkles,
  GitBranch,
  Activity,
  Layers,
  Zap,
  Scissors,
  Heart,
  Shield,
  Crown,
  Circle,
  Home,
}

interface Props {
  service: ServiceItem
  compact?: boolean
}

export default function ServiceCard({ service, compact = false }: Props) {
  const Icon = ICON_MAP[service.icon] || Circle

  return (
    <article className="group h-full rounded-[30px] border border-[var(--line-soft)] bg-[rgba(255,255,255,0.82)] p-6 shadow-[0_28px_70px_rgba(7,27,43,0.07)] backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:shadow-[0_36px_90px_rgba(7,27,43,0.12)]">
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(145deg,rgba(198,164,92,0.16),rgba(135,174,188,0.12))] shadow-[inset_0_1px_0_rgba(255,255,255,0.55)]">
          <Icon size={20} strokeWidth={1.7} color="var(--accent-strong)" />
        </div>
        <div className="rounded-full bg-[rgba(16,34,48,0.05)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
          {service.category}
        </div>
      </div>

      <h3 className="mt-6 font-display text-[1.95rem] leading-none tracking-[-0.03em] text-[var(--ink)]">
        {service.name}
      </h3>

      {!compact && (
        <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
          {service.description}
        </p>
      )}

      <div className="mt-6 flex items-center justify-between gap-3">
        {service.homeVisit ? (
          <div className="inline-flex items-center gap-2 rounded-full bg-[rgba(36,102,82,0.08)] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--success)]">
            <Home size={12} />
            Home Visit
          </div>
        ) : (
          <div className="inline-flex items-center gap-2 rounded-full bg-[rgba(16,34,48,0.05)] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
            In Clinic
          </div>
        )}

        <span className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--accent-strong)] transition-transform duration-300 group-hover:translate-x-1">
          Signature Care
        </span>
      </div>
    </article>
  )
}
