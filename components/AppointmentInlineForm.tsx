'use client'

import { useState } from 'react'
import { CalendarDays, Clock3, Mail, MessageSquareText, Phone, User } from 'lucide-react'
import SiteImage from '@/components/SiteImage'
import { SERVICES } from '@/lib/data'
import { buildWhatsAppUrl } from '@/lib/whatsapp'

type InlineFormState = {
  name: string
  mobile: string
  email: string
  treatment: string
  appointmentDate: string
  appointmentTime: string
  enquiry: string
}

const EMPTY_FORM: InlineFormState = {
  name: '',
  mobile: '',
  email: '',
  treatment: '',
  appointmentDate: '',
  appointmentTime: '',
  enquiry: '',
}

export default function AppointmentInlineForm({ source }: { source: string }) {
  const [form, setForm] = useState<InlineFormState>(EMPTY_FORM)
  const [errors, setErrors] = useState<Partial<Record<keyof InlineFormState, string>>>({})

  function validate() {
    const nextErrors: Partial<Record<keyof InlineFormState, string>> = {}
    if (!form.name.trim()) nextErrors.name = 'Name is required'
    if (!form.mobile.trim()) nextErrors.mobile = 'Mobile number is required'
    else if (!/^\d{10}$/.test(form.mobile.replace(/\D/g, ''))) nextErrors.mobile = 'Enter a valid 10-digit mobile number'
    if (!form.appointmentDate) nextErrors.appointmentDate = 'Date is required'
    if (!form.appointmentTime) nextErrors.appointmentTime = 'Time is required'
    return nextErrors
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
      form.email.trim() ? `Email: ${form.email.trim()}` : undefined,
      form.treatment ? `Treatment: ${form.treatment}` : undefined,
      `Appointment Date: ${form.appointmentDate}`,
      `Appointment Time: ${form.appointmentTime}`,
      form.enquiry.trim() ? `Enquiry: ${form.enquiry.trim()}` : undefined,
    ])

    window.open(url, '_blank', 'noopener,noreferrer')
    setForm(EMPTY_FORM)
  }

  return (
    <section className="bg-white px-6 py-16 md:px-10 md:py-24">
      <div className="mx-auto max-w-7xl">
        
        {/* --- EMERGENCY STYLE BANNER --- */}
        <div className="relative overflow-visible rounded-[2.5rem] bg-[linear-gradient(90deg,#1a4a8c_0%,#2b67a9_48%,#3a8bc2_100%)] shadow-[0_24px_60px_rgba(60,145,179,0.22)]">
          <div className="absolute inset-0 overflow-hidden rounded-[2.5rem]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_28%,rgba(255,255,255,0.12),transparent_22%),linear-gradient(90deg,rgba(255,255,255,0.06)_0%,rgba(255,255,255,0)_100%)]" />
          </div>

          <div className="pointer-events-none absolute bottom-0 right-0 z-20 w-[7rem] sm:w-[8.5rem] md:w-[11rem] lg:w-[13rem] xl:w-[14.5rem]">
            <div className="relative aspect-[1/1.55] w-full">
              <SiteImage
                src="/ach.webp"
                alt="Emergency support"
                fill
                sizes="(max-width: 640px) 112px, (max-width: 1024px) 176px, 232px"
                className="object-contain object-bottom-right"
              />
            </div>
          </div>

          <div className="relative z-10 flex min-h-[7rem] items-center justify-center px-6 py-5 pr-20 text-center sm:min-h-[8rem] sm:pr-24 md:min-h-[9rem] md:px-10 md:pr-40 lg:min-h-[10.5rem] lg:px-14 lg:pr-52">
            <a
              href="tel:+919133743734"
              className="inline-flex flex-col items-center gap-1 text-[#16243a]"
            >
              <span className="text-[1rem] font-medium tracking-tight sm:text-[1.25rem] md:text-[1.9rem] lg:text-[2.2rem]">
                For Dental Emergency Call
              </span>
              <span className="inline-flex items-center gap-2 text-[1.95rem] font-black leading-none tracking-tight text-white drop-shadow-[0_4px_18px_rgba(0,0,0,0.16)] sm:text-[2.35rem] md:text-[3.2rem] lg:text-[4rem]">
                <Phone size={34} className="text-[#152235] sm:h-10 sm:w-10 md:h-14 md:w-14 lg:h-[4.2rem] lg:w-[4.2rem]" />
                9133743734
              </span>
            </a>
          </div>
        </div>

        {/* --- FORM HEADER --- */}
        <div className="text-center">
          <h2 className="mt-20 text-4xl font-extrabold tracking-tight text-[#ff8b2d] md:text-6xl">
            Book Appointment
          </h2>
          <p className="mt-4 text-lg font-medium text-neutral-600">
            To request an appointment, please enter the information
          </p>
        </div>

        {/* --- FORM SECTION --- */}
        <form onSubmit={handleSubmit} className="mt-14 space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <InputShell icon={<User size={22} />} error={errors.name}>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Name"
                className="w-full bg-transparent text-[1.05rem] font-medium text-neutral-900 outline-none placeholder:text-neutral-400"
              />
            </InputShell>

            <InputShell icon={<Phone size={22} />} error={errors.mobile}>
              <input
                type="tel"
                value={form.mobile}
                onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                placeholder="Mobile Number"
                className="w-full bg-transparent text-[1.05rem] font-medium text-neutral-900 outline-none placeholder:text-neutral-400"
              />
            </InputShell>

            <InputShell icon={<Mail size={22} />} error={errors.email}>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="Email Id"
                className="w-full bg-transparent text-[1.05rem] font-medium text-neutral-900 outline-none placeholder:text-neutral-400"
              />
            </InputShell>
          </div>

          <div className="grid gap-6 md:grid-cols-[1.2fr_1fr_1fr_1.2fr]">
            <InputShell icon={<MessageSquareText size={22} />} error={errors.treatment}>
              <select
                value={form.treatment}
                onChange={(e) => setForm({ ...form, treatment: e.target.value })}
                className="w-full cursor-pointer bg-transparent text-[1.05rem] font-medium text-neutral-900 outline-none"
              >
                <option value="">Treatments</option>
                {SERVICES.map((s) => (
                  <option key={s.name} value={s.name}>{s.name}</option>
                ))}
              </select>
            </InputShell>

            <InputShell icon={<CalendarDays size={22} />} error={errors.appointmentDate}>
              <input
                type="date"
                value={form.appointmentDate}
                onChange={(e) => setForm({ ...form, appointmentDate: e.target.value })}
                className="w-full bg-transparent text-[1.05rem] font-medium text-neutral-900 outline-none"
              />
            </InputShell>

            <InputShell icon={<Clock3 size={22} />} error={errors.appointmentTime}>
              <input
                type="time"
                value={form.appointmentTime}
                onChange={(e) => setForm({ ...form, appointmentTime: e.target.value })}
                className="w-full bg-transparent text-[1.05rem] font-medium text-neutral-900 outline-none"
              />
            </InputShell>

            <InputShell icon={<MessageSquareText size={22} />} error={errors.enquiry}>
              <input
                type="text"
                value={form.enquiry}
                onChange={(e) => setForm({ ...form, enquiry: e.target.value })}
                placeholder="Enquiry"
                className="w-full bg-transparent text-[1.05rem] font-medium text-neutral-900 outline-none placeholder:text-neutral-400"
              />
            </InputShell>
          </div>

          <div className="flex justify-center pt-6">
            <button
              type="submit"
              className="group relative inline-flex min-w-[300px] items-center justify-center overflow-hidden rounded-2xl bg-[#ff8b2d] px-10 py-5 text-2xl font-bold text-white shadow-lg shadow-orange-200 transition-all hover:bg-[#e7781d] hover:shadow-orange-300 active:scale-95"
            >
              Submit Now
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}

function InputShell({ children, icon, error }: { children: React.ReactNode; icon: React.ReactNode; error?: string }) {
  return (
    <div className="w-full">
      <div
        className={`flex min-h-[72px] items-center gap-4 rounded-2xl border-2 px-6 transition-all ${
          error ? 'border-red-300 bg-red-50' : 'border-neutral-100 bg-[#f9fafb] focus-within:border-[#ff8b2d] focus-within:bg-white'
        }`}
      >
        <div className={`flex-shrink-0 ${error ? 'text-red-500' : 'text-[#ff8b2d]'}`}>
          {icon}
        </div>
        <div className="flex-1">{children}</div>
      </div>
      {error && <p className="ml-2 mt-2 text-xs font-bold uppercase tracking-wider text-red-500">{error}</p>}
    </div>
  )
}
