import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight, CheckCircle } from 'lucide-react'
import AppointmentInlineForm from '@/components/AppointmentInlineForm'
import SiteImage from '@/components/SiteImage'
import { getTreatmentDetailBySlug, TREATMENT_DETAIL_PAGES } from '@/lib/treatmentPages'

export function generateStaticParams() {
  return TREATMENT_DETAIL_PAGES.map((item) => ({ slug: item.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const treatment = getTreatmentDetailBySlug(params.slug)

  if (!treatment) {
    return {
      title: 'Treatment',
    }
  }

  return {
    title: treatment.title,
    description: treatment.intro,
  }
}

export default function TreatmentDetailPage({ params }: { params: { slug: string } }) {
  const treatment = getTreatmentDetailBySlug(params.slug)

  if (!treatment) {
    notFound()
  }

  return (
    <>
      <section className="relative h-[300px] w-full overflow-hidden md:h-[380px]">
        <div className="absolute inset-0">
          <SiteImage
            src={treatment.beforeImage}
            alt={treatment.title}
            fill
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>
        <div className="absolute inset-0 bg-[#041018]/58" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#041018] via-[#041018]/34 to-black/10" />

        <div className="relative z-10 flex h-full items-center">
          <div className="w-full px-4 md:px-6 xl:px-8">
            <div className="max-w-2xl pt-16 md:pt-20">
              <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.28em] text-[#C62828]">
                Dhanra Dental Hospital
              </p>
              <h1 className="text-[2.6rem] font-semibold leading-tight tracking-tight text-white md:text-[4.2rem]">
                {treatment.title}
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-white/75 md:text-[15px]">
                {treatment.intro}
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
                {`${treatment.title.toUpperCase()} / PERSONALIZED CARE / TREATMENT PLANNING / CONSULTATION /`}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full px-4 py-14 md:px-6 md:py-16 xl:px-8">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.08fr)_22rem]">
          <div className="content-reveal rounded-[1.8rem] border bg-white p-6 shadow-[0_18px_50px_rgba(10,37,64,0.05)] md:p-7" style={{ borderColor: 'var(--border)' }}>
            <div
              className="inline-flex rounded-full px-3 py-1.5 text-xs font-medium tracking-widest"
              style={{ background: 'rgba(30,107,186,0.08)', color: 'var(--dm)' }}
            >
              ABOUT THIS TREATMENT
            </div>
            <h2 className="mt-4 max-w-4xl text-[clamp(2.25rem,4.6vw,3.9rem)] font-semibold leading-[1.02] tracking-[-0.045em]" style={{ color: 'var(--db)' }}>
              {treatment.title} planned around function, comfort, and lasting confidence.
            </h2>

            <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
              <div className="content-reveal content-reveal-delay-1 space-y-5 text-[1.08rem] leading-9 md:text-[1.12rem]" style={{ color: 'var(--muted)' }}>
                <p>{treatment.intro}</p>
                {treatment.details.map((item) => (
                  <p key={item}>{item}</p>
                ))}
              </div>

              <div className="content-reveal content-reveal-delay-2 overflow-hidden rounded-[1.6rem] border bg-white" style={{ borderColor: 'rgba(16,34,48,0.08)' }}>
                <div className="relative aspect-[5/4.2]">
                  <SiteImage
                    src={treatment.afterImage}
                    alt={`${treatment.title} treatment image`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 24vw"
                    className="object-cover"
                  />
                </div>
                <div className="px-4 py-4">
                  <div className="text-[10px] font-bold uppercase tracking-[0.24em]" style={{ color: 'var(--dm)' }}>
                    Treatment image
                  </div>
                  <p className="mt-2 text-[0.98rem] leading-8" style={{ color: 'var(--muted)' }}>
                    A relevant treatment visual is shown here. You can replace this image later with the exact final image you prefer.
                  </p>
                </div>
              </div>
            </div>

            <div className="content-reveal content-reveal-delay-2 mt-6 grid gap-4 md:grid-cols-2">
              {treatment.benefits.slice(0, 2).map((item) => (
                <div
                  key={item}
                  className="rounded-[1.35rem] border bg-[#f8fbfe] px-4 py-4"
                  style={{ borderColor: 'rgba(16,34,48,0.08)' }}
                >
                  <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full" style={{ background: 'rgba(30,107,186,0.1)', color: 'var(--dm)' }}>
                    <CheckCircle size={17} />
                  </div>
                  <p className="text-[0.98rem] leading-8" style={{ color: 'var(--db)' }}>
                    {item}
                  </p>
                </div>
              ))}
            </div>

            <div className="content-reveal content-reveal-delay-3 mt-6 rounded-[1.6rem] border bg-[linear-gradient(135deg,#ffffff,#f8fbfe)] p-5" style={{ borderColor: 'rgba(16,34,48,0.08)' }}>
              <div className="text-[11px] font-bold uppercase tracking-[0.24em]" style={{ color: 'var(--dm)' }}>
                Treatment process
              </div>
              <div className="mt-4 grid gap-3">
                {treatment.process.map((item, index) => (
                  <div key={item} className="flex items-start gap-4 rounded-[1.2rem] bg-white px-4 py-4">
                    <div
                      className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-sm font-semibold"
                      style={{ background: 'rgba(30,107,186,0.1)', color: 'var(--dm)' }}
                    >
                      {index + 1}
                    </div>
                    <p className="text-[0.98rem] leading-8" style={{ color: 'var(--db)' }}>
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="content-reveal content-reveal-delay-3 mt-6 rounded-[1.6rem] border bg-[linear-gradient(135deg,#ffffff,#f8fbfe)] p-5" style={{ borderColor: 'rgba(16,34,48,0.08)' }}>
              <div className="text-[11px] font-bold uppercase tracking-[0.24em]" style={{ color: 'var(--dm)' }}>
                Ideal for
              </div>
              <div className="mt-4 grid gap-3">
                {treatment.idealFor.map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-[1.2rem] bg-white px-4 py-4">
                    <CheckCircle size={17} style={{ color: 'var(--dm)', marginTop: 3, flexShrink: 0 }} />
                    <p className="text-[0.98rem] leading-8" style={{ color: 'var(--db)' }}>
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="content-reveal content-reveal-delay-2 h-fit space-y-5 xl:sticky xl:top-28">
            <div className="overflow-hidden rounded-[1.8rem] border bg-white shadow-[0_18px_50px_rgba(10,37,64,0.05)]" style={{ borderColor: 'var(--border)' }}>
              <div className="bg-[#173f73] px-5 py-5 text-white">
                <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/72">Our Treatments</div>
                <div className="mt-2 text-[1.8rem] font-semibold tracking-[-0.03em]">Treatment List</div>
              </div>
              <div className="divide-y" style={{ borderColor: 'rgba(16,34,48,0.08)' }}>
                {TREATMENT_DETAIL_PAGES.map((item) => {
                  const active = item.slug === treatment.slug

                  return (
                    <Link
                      key={item.slug}
                      href={`/services/${item.slug}`}
                      className={`flex items-center gap-4 px-5 py-4 transition-colors ${active ? 'bg-[#f3f8fd]' : 'bg-white hover:bg-[#f8fbfe]'}`}
                    >
                      <span
                        className="inline-flex h-3.5 w-3.5 flex-shrink-0 rounded-full"
                        style={{ background: active ? 'var(--dm)' : '#f28b2f' }}
                      />
                      <span className="text-[1.05rem] font-medium leading-7" style={{ color: active ? 'var(--dm)' : 'var(--db)' }}>
                        {item.navLabel}
                      </span>
                    </Link>
                  )
                })}
              </div>
            </div>

            <div className="rounded-[1.8rem] border bg-white p-5 shadow-[0_18px_50px_rgba(10,37,64,0.05)]" style={{ borderColor: 'var(--border)' }}>
              <div className="text-[11px] font-bold uppercase tracking-[0.22em]" style={{ color: 'var(--dm)' }}>
                Key benefits
              </div>
              <div className="mt-4 space-y-3">
                {treatment.benefits.map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-[1.1rem] bg-[#f8fbfe] px-4 py-4">
                    <CheckCircle size={17} style={{ color: 'var(--dm)', marginTop: 3, flexShrink: 0 }} />
                    <p className="text-[0.98rem] leading-8" style={{ color: 'var(--muted)' }}>
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="content-reveal content-reveal-delay-3 mt-8 rounded-[1.8rem] border bg-white p-6 shadow-[0_18px_50px_rgba(10,37,64,0.05)] md:p-7" style={{ borderColor: 'var(--border)' }}>
          <div
            className="inline-flex rounded-full px-3 py-1.5 text-xs font-medium tracking-widest"
            style={{ background: 'rgba(201,168,76,0.14)', color: '#9c7c25' }}
          >
            CONSULTATION
          </div>
          <h2 className="mt-4 text-[clamp(2rem,4vw,3rem)] font-semibold tracking-[-0.03em]" style={{ color: 'var(--db)' }}>
            Book your consultation now
          </h2>
          <p className="mt-3 max-w-3xl text-[1rem] leading-8 md:text-[1.05rem]" style={{ color: 'var(--muted)' }}>
            Speak with the Dhanra Dental team to discuss your concerns, understand treatment options, and get a clear plan tailored to your smile goals.
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <Link href="/contact" className="premium-button">
              Book Consultation
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/services"
              className="premium-button premium-button-secondary"
              style={{ color: 'var(--db)', borderColor: 'rgba(16,34,48,0.12)', background: 'transparent' }}
            >
              View All Treatments
            </Link>
          </div>
        </div>
      </section>

      <AppointmentInlineForm source={`${treatment.title} Treatment Page`} />
    </>
  )
}
