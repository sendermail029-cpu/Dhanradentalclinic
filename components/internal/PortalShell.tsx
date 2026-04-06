'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, type ReactNode } from 'react'
import { signOutPortal } from '@/lib/internal/portalAuth'

type SidebarItem = {
  label: string
  href: string
}

export default function PortalShell({
  roleLabel,
  title,
  subtitle,
  items,
  children,
  topRight,
  navExtra,
  clinicName = 'Clinic Portal',
  clinicSubtitle = 'Simple workflow for daily clinic work.',
}: {
  roleLabel: string
  title: string
  subtitle: string
  items: SidebarItem[]
  children: ReactNode
  topRight?: ReactNode
  navExtra?: ReactNode
  clinicName?: string
  clinicSubtitle?: string
}) {
  const pathname = usePathname()
  const [isSigningOut, setIsSigningOut] = useState(false)

  async function handleSignOut() {
    if (isSigningOut) return

    setIsSigningOut(true)
    try {
      await signOutPortal()
    } finally {
      setIsSigningOut(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#f3f7fa] text-[#102132]">
      <div className="min-h-screen">
        <aside className="border-b border-[#14365d] bg-[linear-gradient(135deg,#173a66_0%,#0f2f56_100%)] px-5 py-4 text-white md:px-8">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex items-center gap-4">
              <div className="rounded-[24px] bg-white p-2.5 shadow-[0_10px_30px_rgba(15,47,86,0.18)]">
                <Image
                  src="/log.png"
                  alt="Dhanra logo"
                  width={52}
                  height={52}
                  className="h-[52px] w-[52px] object-contain"
                />
              </div>
              <div className="min-w-0">
                <div className="text-[2rem] font-bold uppercase tracking-[0.26em] text-[#ff6b6b] md:text-[2.2rem]">
                  Dhanra
                </div>
                <div className="mt-1 whitespace-nowrap text-[0.86rem] font-medium uppercase tracking-[0.12em] text-white/92 md:text-[0.98rem]">
                  Dental Aesthetic &amp; Implant Care
                </div>
              </div>
            </div>
            <nav className="flex flex-nowrap items-center gap-3 overflow-x-auto pb-1 xl:flex-wrap xl:justify-end xl:overflow-visible xl:pb-0">
              {items.map((item) => {
                const active = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`inline-flex min-h-[44px] shrink-0 items-center rounded-full px-5 py-2.5 text-[0.98rem] font-medium whitespace-nowrap transition ${
                      active
                        ? 'bg-white text-[#0f2f56] shadow-[0_12px_30px_rgba(8,23,43,0.18)]'
                        : 'bg-transparent text-white/90 hover:bg-white/10'
                    }`}
                  >
                    {item.label}
                  </Link>
                )
              })}
              {navExtra}
              <button
                type="button"
                onClick={() => void handleSignOut()}
                disabled={isSigningOut}
                className="inline-flex min-h-[44px] shrink-0 items-center rounded-full border border-white/30 px-5 py-2.5 text-[0.98rem] font-medium whitespace-nowrap text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSigningOut ? 'Signing Out...' : 'Sign Out'}
              </button>
            </nav>
          </div>
        </aside>

        <div className="flex min-h-[calc(100vh-94px)] flex-col">
          <div className="flex-1 p-5 pt-0 md:p-8 md:pt-0">
            {topRight ? <div className="mb-5 pt-5">{topRight}</div> : null}
            {children}
          </div>
        </div>
      </div>
    </main>
  )
}
