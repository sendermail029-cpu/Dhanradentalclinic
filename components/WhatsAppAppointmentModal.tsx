'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { CalendarDays, Clock3, MessageCircle, Phone, User, X } from 'lucide-react'
import { buildWhatsAppUrl } from '@/lib/whatsapp'

type AppointmentForm = {
  name: string
  mobile: string
  appointmentDate: string
  appointmentTime: string
  concern: string
}

const EMPTY_FORM: AppointmentForm = {
  name: '',
  mobile: '',
  appointmentDate: '',
  appointmentTime: '',
  concern: '',
}

export default function WhatsAppAppointmentModal({
  source,
  buttonLabel = 'Book Appointment',
  buttonClassName = '',
  panelTitle = 'Book Appointment',
  panelDescription = 'Enter your details and continue on WhatsApp.',
  onOpen,
}: {
  source: string
  buttonLabel?: string
  buttonClassName?: string
  panelTitle?: string
  panelDescription?: string
  onOpen?: () => void
}) {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [form, setForm] = useState<AppointmentForm>(EMPTY_FORM)
  const [errors, setErrors] = useState<Partial<Record<keyof AppointmentForm, string>>>({})

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!open) return

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [open])

  function validate() {
    const nextErrors: Partial<Record<keyof AppointmentForm, string>> = {}
    if (!form.name.trim()) nextErrors.name = 'Name is required'
    if (!form.mobile.trim()) nextErrors.mobile = 'Mobile number is required'
    else if (!/^\d{10}$/.test(form.mobile.replace(/\D/g, ''))) nextErrors.mobile = 'Enter a valid 10-digit mobile number'
    if (!form.appointmentDate) nextErrors.appointmentDate = 'Appointment date is required'
    if (!form.appointmentTime) nextErrors.appointmentTime = 'Appointment time is required'
    return nextErrors
  }

  function openModal() {
    onOpen?.()
    setOpen(true)
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors = validate()
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    setErrors({})

    const url = buildWhatsAppUrl([
      'New Appointment Request',
      `Source: ${source}`,
      `Name: ${form.name.trim()}`,
      `Mobile Number: ${form.mobile.trim()}`,
      `Appointment Date: ${form.appointmentDate}`,
      `Appointment Time: ${form.appointmentTime}`,
      form.concern.trim() ? `Treatment / Concern: ${form.concern.trim()}` : undefined,
    ])

    window.open(url, '_blank', 'noopener,noreferrer')
    setForm(EMPTY_FORM)
    setOpen(false)
  }

  return (
    <>
      <button type="button" onClick={openModal} className={buttonClassName}>
        {buttonLabel}
      </button>

      {mounted && open
        ? createPortal(
        <div className="fixed inset-0 z-[1200] overflow-y-auto bg-[#041018]/72 backdrop-blur-sm">
          <div className="absolute inset-0" onClick={() => setOpen(false)} aria-hidden="true" />
          <div className="relative z-10 flex min-h-full items-start justify-center px-4 py-6 sm:items-center sm:px-6">
            <div className="w-full max-w-3xl rounded-[2rem] bg-white shadow-[0_32px_90px_rgba(0,0,0,0.28)]">
              <div className="flex items-start justify-between gap-6 border-b border-neutral-100 px-6 py-5 md:px-8">
                <div className="min-w-0">
                  <h3 className="text-2xl font-bold tracking-tight text-[#041018] md:text-3xl">
                    {panelTitle}
                  </h3>
                  <p className="mt-3 max-w-xl text-sm leading-6 text-neutral-500">
                    {panelDescription}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="inline-flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-neutral-100 text-neutral-700 transition-colors hover:bg-neutral-200"
                  aria-label="Close appointment form"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="max-h-[calc(100vh-14rem)] overflow-y-auto px-6 py-6 md:px-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid gap-5 md:grid-cols-2">
                    <FieldShell icon={<User size={20} />} error={errors.name}>
                      <input
                        type="text"
                        value={form.name}
                        onChange={(event) => setForm({ ...form, name: event.target.value })}
                        placeholder="Name"
                        className="w-full bg-transparent text-base text-neutral-900 outline-none placeholder:text-neutral-400"
                      />
                    </FieldShell>

                    <FieldShell icon={<Phone size={20} />} error={errors.mobile}>
                      <input
                        type="tel"
                        value={form.mobile}
                        onChange={(event) => setForm({ ...form, mobile: event.target.value })}
                        placeholder="Mobile Number"
                        className="w-full bg-transparent text-base text-neutral-900 outline-none placeholder:text-neutral-400"
                      />
                    </FieldShell>

                    <FieldShell icon={<CalendarDays size={20} />} error={errors.appointmentDate}>
                      <input
                        type="date"
                        value={form.appointmentDate}
                        onChange={(event) => setForm({ ...form, appointmentDate: event.target.value })}
                        className="w-full bg-transparent text-base text-neutral-900 outline-none"
                      />
                    </FieldShell>

                    <FieldShell icon={<Clock3 size={20} />} error={errors.appointmentTime}>
                      <input
                        type="time"
                        value={form.appointmentTime}
                        onChange={(event) => setForm({ ...form, appointmentTime: event.target.value })}
                        className="w-full bg-transparent text-base text-neutral-900 outline-none"
                      />
                    </FieldShell>
                  </div>

                  <FieldShell icon={<MessageCircle size={20} />} error={errors.concern}>
                    <input
                      type="text"
                      value={form.concern}
                      onChange={(event) => setForm({ ...form, concern: event.target.value })}
                      placeholder="Treatment / Concern (Optional)"
                      className="w-full bg-transparent text-base text-neutral-900 outline-none placeholder:text-neutral-400"
                    />
                  </FieldShell>

                  <button
                    type="submit"
                    className="inline-flex w-full items-center justify-center whitespace-nowrap rounded-full bg-[#0D3460] px-6 py-4 text-base font-bold text-white transition-all hover:bg-[#0a284a] hover:shadow-xl hover:shadow-[#0D3460]/20"
                  >
                    Send to WhatsApp
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )
        : null}
    </>
  )
}

function FieldShell({
  children,
  icon,
  error,
}: {
  children: React.ReactNode
  icon: React.ReactNode
  error?: string
}) {
  return (
    <div>
      <div
        className={`flex items-center gap-4 rounded-[1.2rem] border px-4 py-4 ${
          error ? 'border-red-300 bg-red-50/60' : 'border-neutral-200 bg-white'
        }`}
      >
        <div className={`flex-shrink-0 ${error ? 'text-red-500' : 'text-[#f28b2f]'}`}>{icon}</div>
        {children}
      </div>
      {error ? <p className="mt-2 text-sm text-red-500">{error}</p> : null}
    </div>
  )
}
