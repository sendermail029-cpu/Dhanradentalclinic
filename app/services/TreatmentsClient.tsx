'use client'

import Link from 'next/link'
import { ArrowRight, Home } from 'lucide-react'
import SiteImage from '@/components/SiteImage'
import AppointmentInlineForm from '@/components/AppointmentInlineForm'
import { SERVICES } from '@/lib/data'
import { TREATMENT_DETAIL_PAGES } from '@/lib/treatmentPages'

const homeTreatments = SERVICES.filter((item) => item.homeVisit)

export default function TreatmentsClient() {
  return (
    <>
      <section className="relative h-[300px] w-full overflow-hidden md:h-[380px]">
        <div className="absolute inset-0">
          <SiteImage
            src="/about3.webp"
            alt="Treatments hero"
            fill
            sizes="100vw"
            className="scale-105 object-cover object-center"
          />
        </div>
        <div className="absolute inset-0 bg-[#041018]/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#041018] via-[#041018]/40 to-black/10" />

        <div className="relative z-10 flex h-full items-center">
          <div className="w-full px-4 md:px-6 xl:px-8">
            <div className="max-w-2xl pt-16 md:pt-20">
              <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.28em] text-[#C62828]">
                Dhanra Dental Hospital
              </p>
              <h1 className="text-[2.6rem] font-semibold leading-tight tracking-tight text-white md:text-[4.2rem]">
                Treatments
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-white/75 md:text-[15px]">
                Browse all treatment sections clearly and open any treatment page to view complete details, benefits,
                process, and suitability.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative border-b border-white/5 bg-[#041018] py-4">
        <div className="flex w-full overflow-hidden select-none opacity-[0.25]">
          <div className="marquee-track flex whitespace-nowrap text-[0.85rem] font-bold uppercase tracking-[0.35em] text-[#8FB3E0]">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <span key={i} className="flex-shrink-0 px-12">
                ADVANCED DENTISTRY / CLINICAL CARE / SMILE PLANNING / TREATMENT OPTIONS /
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full px-4 py-16 md:px-6 xl:px-8">
        <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <div
              className="mb-3 inline-block rounded-full px-3 py-1.5 text-xs font-medium tracking-widest"
              style={{ background: 'rgba(30,107,186,0.08)', color: 'var(--dm)' }}
            >
              TREATMENT DIRECTORY
            </div>
            <h2 className="font-display text-4xl font-light" style={{ color: 'var(--db)' }}>
              Choose a treatment to explore fully
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-7" style={{ color: 'var(--muted)' }}>
            Each card opens its own dedicated treatment page, just like the treatment links in the navbar, so patients
            can read the full treatment information clearly.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {TREATMENT_DETAIL_PAGES.map((item, index) => (
            <Link
              key={item.slug}
              href={`/services/${item.slug}`}
              className="group overflow-hidden rounded-[2rem] border bg-white transition-all duration-300 hover:-translate-y-1"
              style={{
                borderColor: 'rgba(16, 34, 48, 0.08)',
                boxShadow: '0 20px 50px rgba(7, 27, 43, 0.06)',
              }}
            >
              <div className="relative aspect-[5/4] overflow-hidden">
                <SiteImage
                  src={item.beforeImage}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                  className="object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#041018] via-[#041018]/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#e6d5ad]">
                    {item.shortDescription}
                  </div>
                  <h3 className="mt-2 text-[2rem] font-semibold leading-tight tracking-[-0.04em]">
                    {item.navLabel}
                  </h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-sm leading-7" style={{ color: 'var(--muted)' }}>
                  {item.intro}
                </p>
                <div className="mt-5 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#9c7c25] transition group-hover:text-[#1A5276]">
                  Explore More
                  <ArrowRight size={14} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section
        className="border-t px-6 py-16"
        style={{ background: 'var(--off)', borderColor: 'var(--border)' }}
      >
        <div className="w-full">
          <div
            className="rounded-[28px] p-8 md:p-10"
            style={{ background: 'linear-gradient(135deg, var(--db), #1A5276)' }}
          >
            <div className="grid gap-10 md:grid-cols-[0.9fr_1.1fr] md:items-start">
              <div>
                <div
                  className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium"
                  style={{
                    background: 'rgba(201,168,76,0.15)',
                    border: '0.5px solid rgba(201,168,76,0.35)',
                    color: 'var(--gold-light)',
                  }}
                >
                  <Home size={10} />
                  DOORSTEP DENTISTRY
                </div>
                <h2 className="mt-5 font-display text-3xl font-light" style={{ color: '#fff' }}>
                  Treatments available at home
                </h2>
                <p className="mt-4 text-sm leading-7" style={{ color: 'rgba(255,255,255,0.68)' }}>
                  We also provide selected treatments at home for elderly care, comfort, convenience, and patients who
                  need more flexible treatment access.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {homeTreatments.map((item) => (
                  <div
                    key={item.name}
                    className="rounded-2xl px-4 py-3 text-sm"
                    style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.82)' }}
                  >
                    {item.name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 text-center md:px-6 xl:px-8">
        <div
          className="w-full rounded-[2rem] border bg-white p-8"
          style={{ borderColor: 'var(--border)', boxShadow: '0 18px 50px rgba(10,37,64,0.06)' }}
        >
          <div
            className="inline-flex rounded-full px-3 py-1.5 text-xs font-medium tracking-widest"
            style={{ background: 'rgba(201,168,76,0.14)', color: '#9c7c25' }}
          >
            CONSULTATION
          </div>
          <h2 className="font-display mt-4 text-4xl font-light" style={{ color: 'var(--db)' }}>
            Need help choosing the right treatment?
          </h2>
          <p className="mt-4 text-sm leading-8" style={{ color: 'var(--muted)' }}>
            Speak with the Dhanra Dental team to understand your options, get the right guidance, and move toward the
            most suitable treatment plan.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/contact" className="premium-button">
              Book Consultation
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/services/doorstep-dentistry"
              className="premium-button premium-button-secondary"
              style={{ color: 'var(--db)', borderColor: 'rgba(16,34,48,0.12)', background: 'transparent' }}
            >
              Doorstep Dentistry
            </Link>
          </div>
        </div>
      </section>

      <AppointmentInlineForm source="Treatments Page" />
    </>
  )
}
