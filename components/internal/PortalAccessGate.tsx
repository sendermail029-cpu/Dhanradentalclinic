'use client'

import { useEffect, useMemo, useState } from 'react'
import ActionButton from '@/components/internal/ui/ActionButton'
import {
  getPortalCredential,
  signInToPortal,
  watchPortalSession,
  type PortalRole,
} from '@/lib/internal/portalAuth'

export default function PortalAccessGate({
  role,
  children,
}: {
  role: PortalRole
  children: React.ReactNode
}) {
  const [ready, setReady] = useState(false)
  const [authenticated, setAuthenticated] = useState(false)
  const [configured, setConfigured] = useState(role === 'admin')
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [feedback, setFeedback] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    let mounted = true

    async function load() {
      if (role !== 'admin') {
        const profile = await getPortalCredential(role)
        if (mounted) {
          setConfigured(Boolean(profile?.email))
        }
      }
    }

    void load()

    const unsubscribe = watchPortalSession(({ profile }) => {
      if (!mounted) return
      setAuthenticated(profile?.role === role)
      setReady(true)
    })

    return () => {
      mounted = false
      unsubscribe()
    }
  }, [role])

  useEffect(() => {
    if (!successMessage) return

    const timeoutId = window.setTimeout(() => {
      setSuccessMessage('')
    }, 3500)

    return () => window.clearTimeout(timeoutId)
  }, [successMessage])

  const roleCopy = useMemo(() => {
    return role === 'admin'
      ? {
          title: 'Admin Portal Login',
          subtitle: 'Sign in with the admin email or mobile number and password.',
        }
      : role === 'doctor'
        ? {
            title: 'Doctor Portal Login',
            subtitle: 'Use the doctor account created in admin to open the doctor panel.',
          }
        : {
            title: 'Reception Portal Login',
            subtitle: 'Use the receptionist account created in admin to open the reception panel.',
          }
  }, [role])

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f3f7fa] px-4">
        <div className="rounded-[28px] border border-[#dbe5ef] bg-white px-6 py-5 text-sm font-medium text-[#153b68] shadow-[0_18px_50px_rgba(15,47,86,0.08)]">
          Loading portal access...
        </div>
      </div>
    )
  }

  if (authenticated) {
    return (
      <>
        {successMessage ? (
          <div className="fixed right-4 top-4 z-50 max-w-sm rounded-[20px] border border-[#cce6d1] bg-[#f3fff5] px-4 py-3 text-sm font-medium leading-6 text-[#25643b] shadow-[0_18px_40px_rgba(37,100,59,0.16)]">
            {successMessage}
          </div>
        ) : null}
        {children}
      </>
    )
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#173a66_0%,#0f2f56_220px,#f3f7fa_220px,#f3f7fa_100%)] px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-md rounded-[32px] border border-[#dbe5ef] bg-white p-6 shadow-[0_30px_80px_rgba(15,47,86,0.16)] sm:p-7">
        <div className="rounded-[24px] bg-[linear-gradient(135deg,#eef4fb_0%,#f8fbfe_100%)] px-5 py-5">
          <div className="text-sm font-bold uppercase tracking-[0.18em] text-[#5f7287]">{role.toUpperCase()}</div>
          <div className="mt-3 text-2xl font-bold text-[#102132]">{roleCopy.title}</div>
          <div className="mt-2 text-sm leading-6 text-[#6b7f94]">{roleCopy.subtitle}</div>
        </div>

        <div className="mt-6 space-y-4">
          <label className="block">
            <div className="mb-2 text-sm font-semibold text-[#4f6277]">Email or Mobile Number</div>
            <input
              value={identifier}
              onChange={(event) => setIdentifier(event.target.value)}
              className="min-h-[56px] w-full rounded-[22px] border border-[#dce6ef] bg-[#f9fbfd] px-4 text-base outline-none"
              placeholder="Enter your email or mobile number"
            />
          </label>

          <label className="block">
            <div className="mb-2 text-sm font-semibold text-[#4f6277]">Password</div>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="min-h-[56px] w-full rounded-[22px] border border-[#dce6ef] bg-[#f9fbfd] px-4 text-base outline-none"
              placeholder="Enter password"
            />
          </label>

          {!configured && role !== 'admin' ? (
            <div className="rounded-[20px] border border-[#eed8b6] bg-[#fff9ef] px-4 py-3 text-sm leading-6 text-[#7b5a1d]">
              This portal login is not created yet. Please create the {role} email/mobile and password first from the admin panel.
            </div>
          ) : null}

          {feedback ? (
            <div className="rounded-[20px] border border-[#f0c8c3] bg-[#fff6f4] px-4 py-3 text-sm leading-6 text-[#b04a42]">
              {feedback}
            </div>
          ) : null}

          <ActionButton
            className="w-full"
            onClick={() => void (async () => {
              if (!identifier.trim() || !password) {
                setFeedback('Enter email/mobile number and password to continue.')
                return
              }

              const result = await signInToPortal(role, identifier, password)
              if (!result.ok) {
                setFeedback(result.message)
                return
              }

              setFeedback('')
              setSuccessMessage(`${role === 'admin' ? 'Admin' : role === 'doctor' ? 'Doctor' : 'Reception'} panel logged in successfully.`)
              setAuthenticated(true)
            })()}
          >
            Sign In
          </ActionButton>
        </div>
      </div>
    </div>
  )
}
