'use client'

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import SiteImage from '@/components/SiteImage'

const TRANSITION_DURATION_MS = 260

export default function PageTransitionShell({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isInternalPortal =
    pathname.startsWith('/doctor') ||
    pathname.startsWith('/receptionist') ||
    pathname.startsWith('/admin')
  const prefersReducedMotion = useReducedMotion()
  const previousPathnameRef = useRef(pathname)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [showTransition, setShowTransition] = useState(false)

  useEffect(() => {
    const previousPathname = previousPathnameRef.current

    if (previousPathname !== pathname) {
      setShowTransition(true)

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = setTimeout(() => {
        setShowTransition(false)
      }, prefersReducedMotion ? 220 : TRANSITION_DURATION_MS)

      previousPathnameRef.current = pathname
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [pathname, prefersReducedMotion])

  return (
    <>
      {isInternalPortal ? null : <Navbar />}
      <AnimatePresence mode="sync" initial={false}>
        <motion.main
          key={pathname}
          initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.995 }}
          animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
          exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -10, scale: 1.002 }}
          transition={{
            duration: prefersReducedMotion ? 0.14 : 0.24,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {children}
        </motion.main>
      </AnimatePresence>
      {isInternalPortal ? null : <Footer />}

      <AnimatePresence>
        {showTransition && !isInternalPortal ? (
          <motion.div
            key="route-brand-transition"
            className="pointer-events-none fixed inset-0 z-[200] flex items-center justify-center bg-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0.08 : 0.14, ease: 'easeOut' }}
            aria-hidden="true"
          >
            <motion.div
              className="relative flex flex-col items-center justify-center gap-5 px-6 text-center"
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.96, y: 8 }}
              animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
              exit={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, scale: 1.02, y: -6 }}
              transition={{
                duration: prefersReducedMotion ? 0.08 : 0.2,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <div className="brand-transition-glow" />
              <div className="brand-transition-ring" />
              <motion.div
                className="relative z-[2] overflow-hidden rounded-full bg-white shadow-[0_20px_45px_rgba(13,52,96,0.14)]"
                animate={prefersReducedMotion ? undefined : { scale: [1, 1.03, 1] }}
                transition={{ duration: 0.5, repeat: prefersReducedMotion ? 0 : 1, ease: 'easeInOut' }}
              >
                <SiteImage
                  src="/log.webp"
                  alt="Dhanra Dental logo"
                  width={112}
                  height={112}
                  priority
                  className="h-24 w-24 object-contain sm:h-28 sm:w-28"
                />
              </motion.div>

              <motion.div
                className="relative z-[2] space-y-2"
                initial={prefersReducedMotion ? undefined : { opacity: 0, y: 10 }}
                animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                transition={{ delay: prefersReducedMotion ? 0 : 0.12, duration: 0.36 }}
              >
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.42em] text-[#C62828]">
                  Dhanra
                </p>
                <p className="text-[0.68rem] uppercase tracking-[0.22em] text-[#0D3460]/72 sm:text-[0.72rem]">
                  Dental Aesthetic & Implant Care
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  )
}
