'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Quote,
  Sparkles,
  Star,
  Users,
} from 'lucide-react'
import SiteImage from '@/components/SiteImage'

const fader = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.9, ease: [0.19, 1, 0.22, 1] },
}

const riseIn = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.7, ease: [0.19, 1, 0.22, 1] },
}

const testimonials = [
  {
    quote:
      'The treatment experience was smooth, professional, and very reassuring. The doctor explained everything clearly and made me feel completely comfortable.',
    name: 'Hema Latha',
    category: 'General Dentistry',
    stars: 5,
  },
  {
    quote:
      'We were impressed by the hygiene, the attention to detail, and the overall quality of care. It truly felt like we were in trusted hands throughout the process.',
    name: 'Ravi Kiran',
    category: 'Implant Care',
    stars: 5,
  },
  {
    quote:
      'From consultation to treatment, the experience was calm, well-organized, and patient-focused. The care felt premium and highly professional.',
    name: 'Suresh',
    category: 'Maxillofacial Surgery',
    stars: 5,
  },
] as const

const doorwayPoints = [
  'Hospital-backed dental care at home',
  'Portable advanced dental equipment',
  'Comfort for families, seniors, and busy patients',
  'Professional care with strict hygiene protocols',
] as const

const hospitalHighlights = [
  { label: 'Specialist-Led', value: 'Expert Care' },
  { label: 'Hospital-Grade', value: 'Safety and Hygiene' },
  { label: 'Patient-First', value: 'Comfort Focused' },
] as const

const specialistPoints = [
  { title: 'Oral and Maxillofacial Surgery', body: 'Specialist-led surgical diagnosis and treatment planning.' },
  { title: 'Implantology Expertise', body: 'Precision-driven implant care built for function and confidence.' },
  { title: 'Patient-Centered Care', body: 'Clear communication, reassurance, and comfort at every step.' },
  { title: 'Hospital-Grade Standards', body: 'Advanced care delivered with disciplined clinical systems.' },
] as const

const trustCards = [
  { title: 'Specialist-Led Dental Care', text: 'Treatments planned and performed with specialist guidance.', img: '/led.webp' },
  { title: 'Sterilization Excellence', text: 'Strict hygiene protocols to ensure complete patient safety.', img: '/st.webp' },
  { title: 'Digital Diagnostics', text: 'Advanced imaging that supports precise diagnosis.', img: '/dig.webp' },
  { title: 'Patient Consultation', text: 'Treatment is explained clearly so patients feel informed.', img: '/exp.webp' },
  { title: 'Surgical Expertise', text: 'Focused expertise in implantology and oral surgical care.', img: '/st.webp' },
  { title: 'Premium Environment', text: 'A calm dental setting created for smooth visits.', img: '/about1.webp' },
] as const

const philosophyPillars = [
  { title: 'Clinical Excellence', body: 'Precision in every procedure.' },
  { title: 'Ethical Approach', body: 'Transparent and honest care.' },
  { title: 'Patient Focus', body: 'Comfort-first treatment.' },
] as const

export default function FinalPioneerAboutPage() {
  return (
    <main className="overflow-x-hidden bg-[#041018] font-sans text-white selection:bg-[#8FB3E0]/30">
      <section className="relative h-[280px] w-full overflow-hidden md:h-[380px]">
        <div
          className="absolute inset-0 scale-105 bg-cover bg-center"
          style={{
            backgroundImage: "url('/abo.webp')",
          }}
        />
        <div className="absolute inset-0 bg-[#041018]/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#041018] via-[#041018]/40 to-black/10" />

        <div className="relative z-10 flex h-full items-center">
          <div className="w-full px-4 md:px-6 xl:px-8">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-xl pt-14 md:pt-20"
            >
              <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.28em] text-[#C62828]">
                Dhanra Dental Hospital
              </p>
              <h1 className="text-[2.55rem] font-semibold leading-tight tracking-tight text-white md:text-[4.2rem]">
                About Us
              </h1>
              <p className="mt-3 max-w-md text-sm leading-7 text-white/75 md:text-[15px]">
                Advanced dental and maxillofacial care in Vijayawada with a patient-first approach.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="relative border-b border-white/5 bg-[#041018] py-3 md:py-4">
        <div className="flex w-full overflow-hidden select-none opacity-[0.25]">
          <motion.div
            className="flex whitespace-nowrap text-[0.72rem] font-bold uppercase tracking-[0.24em] text-[#8FB3E0] md:text-[0.85rem] md:tracking-[0.35em]"
            animate={{ x: ['0%', '-50%'] }}
            transition={{ ease: 'linear', duration: 30, repeat: Infinity }}
          >
            {[1, 2, 3, 4].map((i) => (
              <span key={i} className="flex-shrink-0 px-8 md:px-12">
                ANDHRA PRADESH&apos;S FIRST DOORSTEP DENTISTRY • CLINICAL EXCELLENCE • PIONEERING CARE • DHANRA DENTAL •
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#F2F5F8] py-16 text-[#041018] md:py-32">
        <div className="w-full px-4 md:px-6 xl:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:gap-20">
            <motion.div {...fader}>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-[#0F2F56] px-4 py-2 text-white shadow-lg md:mb-8">
                <Sparkles size={14} />
                <span className="text-[10px] font-bold uppercase tracking-[0.25em]">A First in Andhra Pradesh</span>
              </div>

              <h2 className="mb-6 text-[2.5rem] font-bold leading-[0.98] tracking-tighter md:mb-10 md:text-7xl">
                Hospital-Grade Care,
                <br />
                <span className="font-serif italic text-[#0F2F56]">Now At Your Doorstep.</span>
              </h2>

              <div className="mb-10 space-y-5 text-base leading-8 text-[#425462] md:mb-12 md:space-y-6 md:text-lg">
                <p className="text-lg font-semibold leading-8 text-[#041018] md:text-xl">
                  Dhanra Doorstep Dentistry brings the clinical discipline, hygiene standards, and specialist-led care of our hospital directly to the patient&apos;s home.
                </p>
                <p>
                  Introduced as a first-of-its-kind initiative in Andhra Pradesh, this service is designed for patients who need professional dental care with greater convenience, comfort, and accessibility.
                </p>
                <p>
                  From consultations and routine dental care to selected advanced treatments, our doorstep model combines portable technology, hospital-grade protocols, and trusted expertise beyond the hospital setting.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 md:gap-4">
                {doorwayPoints.map((point, index) => (
                  <motion.div
                    key={point}
                    {...riseIn}
                    transition={{ ...riseIn.transition, delay: index * 0.08 }}
                    className="flex items-center gap-4 rounded-[1.4rem] border border-gray-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md md:p-5"
                  >
                    <CheckCircle2 size={20} className="flex-shrink-0 text-[#0F2F56]" />
                    <span className="text-sm font-bold leading-6 text-[#041018]">{point}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div {...riseIn} className="relative">
              <div className="overflow-hidden rounded-[2rem] shadow-2xl md:rounded-[40px]">
                <SiteImage
                  src="/door.webp"
                  alt="Doorstep service"
                  width={1200}
                  height={1500}
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  className="aspect-[4/5] w-full object-cover"
                />
              </div>
              <motion.div
                initial={{ x: 60, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
                className="absolute -bottom-10 -left-10 hidden w-2/3 md:block"
              >
                <SiteImage
                  src="/tre.webp"
                  alt="At home care"
                  width={1000}
                  height={1200}
                  sizes="(max-width: 1024px) 66vw, 28vw"
                  className="rounded-3xl border-[12px] border-[#F2F5F8] shadow-2xl"
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#041018] py-16 md:py-32">
        <div className="w-full px-4 md:px-6 xl:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20">
            <motion.div {...fader} className="relative order-2 lg:order-1">
              <div className="overflow-hidden rounded-[2rem] border border-white/10 shadow-2xl md:rounded-[40px]">
                <SiteImage
                  src="/about1.webp"
                  alt="Hospital interior"
                  width={1200}
                  height={1560}
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  className="aspect-[4/5.2] w-full object-cover"
                />
              </div>
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
                className="absolute -bottom-10 -right-10 hidden w-1/2 md:block"
              >
                <SiteImage
                  src="/about3.webp"
                  alt="Clinical ambience"
                  width={1000}
                  height={1200}
                  sizes="(max-width: 1024px) 50vw, 22vw"
                  className="rounded-3xl border-[12px] border-[#041018] shadow-2xl"
                />
              </motion.div>
            </motion.div>

            <motion.div {...fader} className="order-1 lg:order-2">
              <span className="mb-5 block text-[11px] font-bold uppercase tracking-[0.32em] text-[#8FB3E0] md:mb-6 md:text-xs md:tracking-[0.4em]">
                02. Institutional Excellence
              </span>
              <h2 className="mb-6 text-[2.45rem] font-bold leading-[1] tracking-tighter text-white md:mb-8 md:text-6xl">
                Dhanra Dental
                <br />
                <span className="font-serif italic text-[#8FB3E0]">Aesthetic and Implant Care</span>
              </h2>

              <div className="space-y-5 text-base leading-8 text-white/72 md:space-y-6 md:text-[17px]">
                <p className="text-lg font-light italic leading-8 text-white md:text-xl">
                  Advanced Dental and Maxillofacial Care in Vijayawada.
                </p>
                <p>
                  Dhanra Dental Aesthetic and Implant Care represents a refined standard of dental excellence rooted in clinical discipline, specialist expertise, and patient-first treatment.
                </p>
                <p>
                  Our hospital delivers advanced dental and maxillofacial care in a carefully designed clinical environment focused on safety, hygiene, and precision at every stage.
                </p>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-3 md:mt-12">
                {hospitalHighlights.map((item, index) => (
                  <motion.div
                    key={item.label}
                    {...riseIn}
                    transition={{ ...riseIn.transition, delay: index * 0.08 }}
                    className="flex min-h-[120px] flex-col items-center justify-center rounded-[1.7rem] border border-white/10 bg-white/[0.04] px-6 py-7 text-center shadow-[0_18px_40px_rgba(0,0,0,0.14)]"
                  >
                    <p className="mb-2 text-[0.95rem] font-bold uppercase tracking-[0.12em] text-[#77A6F3] md:text-[10px] md:tracking-widest">
                      {item.label}
                    </p>
                    <p className="text-base font-semibold text-white/82 md:text-sm">{item.value}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 text-[#041018] md:py-32">
        <div className="w-full px-4 md:px-6 xl:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <motion.div {...fader} className="relative">
              <div className="overflow-hidden rounded-[2rem] shadow-2xl md:rounded-[40px]">
                <div className="relative aspect-[3/4.2]">
                  <SiteImage
                    src="/dhanra.webp"
                    alt="Dr. Sanketh Raju K"
                    fill
                    sizes="(max-width: 1024px) 100vw, 34vw"
                    className="h-full w-full object-cover object-top"
                  />
                </div>
              </div>
              <div className="relative mx-4 -mt-8 rounded-[1.7rem] bg-[#0F2F56] p-5 text-white shadow-2xl md:absolute md:-bottom-6 md:-right-6 md:m-0 md:rounded-3xl md:p-8">
                <p className="text-xl font-bold leading-none md:text-2xl">Dr. Sanketh Raju K</p>
                <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.18em] opacity-75 md:text-[10px] md:tracking-widest">
                  Oral and Maxillofacial Surgeon
                </p>
              </div>
            </motion.div>

            <motion.div {...fader}>
              <span className="mb-5 block text-[11px] font-bold uppercase tracking-[0.3em] text-[#0F2F56]/60 md:mb-6 md:text-xs md:tracking-[0.4em]">
                03. Meet Your Specialist
              </span>
              <h2 className="mb-6 text-[2.45rem] font-bold leading-[1] tracking-tighter md:mb-8 md:text-7xl">
                Expertise You Can
                <br />
                <span className="font-serif italic text-[#0F2F56]">Trust With Confidence.</span>
              </h2>

              <div className="space-y-5 text-base leading-8 text-[#425462] md:space-y-6 md:text-lg">
                <p className="text-lg font-medium leading-8 text-[#041018] md:text-xl">
                  Dr. Sanketh Raju K combines surgical expertise, implantology knowledge, and a patient-first clinical approach in every treatment.
                </p>
                <p>
                  With a strong foundation in oral and maxillofacial care, he focuses on precise diagnosis, ethical treatment planning, and delivering outcomes that support both function and confidence.
                </p>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2 md:mt-12">
                {specialistPoints.map((item, index) => (
                  <motion.div
                    key={item.title}
                    {...riseIn}
                    transition={{ ...riseIn.transition, delay: index * 0.08 }}
                    className="flex items-start gap-4 rounded-[1.4rem] border border-gray-100 bg-[#FAF9F6] p-5"
                  >
                    <Sparkles size={20} className="mt-1 flex-shrink-0 text-[#0F2F56]" />
                    <div>
                      <h5 className="text-sm font-bold text-[#041018]">{item.title}</h5>
                      <p className="mt-1 text-sm leading-6 text-gray-500">{item.body}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="bg-[#FAF9F6] py-16 text-[#041018] md:py-32">
        <div className="w-full px-4 md:px-6 xl:px-8">
          <motion.div {...fader} className="mb-12 max-w-3xl md:mb-16">
            <span className="mb-4 block text-[10px] font-bold uppercase tracking-[0.34em] text-[#0F2F56]/60">
              Our Commitment
            </span>
            <h2 className="mb-6 text-[2.3rem] font-bold leading-[1.02] tracking-tighter md:mb-8 md:text-5xl">
              Dental Care Designed Around
              <br />
              <span className="text-[#0F2F56]">Safety, Precision and Comfort.</span>
            </h2>
            <p className="text-base leading-8 text-[#425462] md:text-lg">
              At Dhanra Dental Hospital, every treatment experience is shaped by clinical expertise, modern diagnostics, sterilization standards, and a patient-first approach to care.
            </p>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 md:gap-8">
            {trustCards.map((item, index) => (
              <motion.div
                key={item.title}
                {...riseIn}
                transition={{ ...riseIn.transition, delay: index * 0.08 }}
                className="group overflow-hidden rounded-[2rem] border border-gray-100 bg-white transition-all duration-500 hover:shadow-2xl md:rounded-[40px]"
              >
                <div className="relative h-56 overflow-hidden md:h-64">
                  <SiteImage
                    src={item.img}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                </div>
                <div className="p-6 md:p-10">
                  <h4 className="mb-3 text-[1.45rem] font-bold leading-tight tracking-tight md:mb-4 md:text-2xl">
                    {item.title}
                  </h4>
                  <p className="text-sm leading-7 text-gray-500">{item.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#02080D] py-16 text-center md:py-32">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(143,179,224,0.05),transparent_60%)]" />

        <div className="relative z-10 w-full px-4 md:px-6 xl:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            className="mb-10 flex justify-center opacity-40 md:mb-12"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10">
              <Quote size={18} className="text-[#8FB3E0]" />
            </div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
            className="mx-auto max-w-4xl text-[1.9rem] font-light leading-[1.35] tracking-tight text-white/90 md:text-5xl md:leading-[1.4]"
          >
            &quot;At Dhanra Dental Hospital, we believe dentistry is not just about treatment, but about{' '}
            <span className="font-serif italic text-[#8FB3E0]">trust, comfort, and long-term well-being.</span>&quot;
          </motion.h2>

          <div className="mt-14 h-[1px] w-full bg-gradient-to-r from-transparent via-white/10 to-transparent md:mt-20" />

          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3 md:mt-16 md:gap-8">
            {philosophyPillars.map((item, index) => (
              <motion.div
                key={item.title}
                {...riseIn}
                transition={{ ...riseIn.transition, delay: index * 0.08 }}
                className="rounded-[1.6rem] border border-white/10 bg-white/[0.03] px-6 py-7 text-center shadow-[0_18px_40px_rgba(0,0,0,0.18)]"
              >
                <h4 className="text-[0.95rem] font-bold uppercase tracking-[0.2em] text-[#8FB3E0] md:text-[11px] md:tracking-[0.3em]">
                  {item.title}
                </h4>
                <p className="mt-3 text-sm leading-6 text-white/55 md:text-[10px] md:uppercase md:tracking-widest md:leading-none">
                  {item.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="overflow-hidden bg-white py-16 md:py-32">
        <div className="w-full px-4 md:px-6 xl:px-8">
          <div className="mb-12 grid items-end gap-6 lg:mb-20 lg:grid-cols-[1fr_auto] lg:gap-8">
            <motion.div {...fader}>
              <span className="mb-4 block text-[11px] font-bold uppercase tracking-[0.3em] text-[#0F2F56]/60 md:tracking-[0.4em]">
                Patient Experiences
              </span>
              <h2 className="text-[2.7rem] font-bold leading-[0.95] tracking-tighter text-[#041018] md:text-7xl md:leading-[0.9]">
                Trusted by <span className="font-serif italic text-[#0F2F56]">Thousands.</span>
              </h2>
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              className="max-w-xs text-sm font-medium leading-relaxed text-gray-400"
            >
              Our clinical excellence is reflected in the smiles and confidence of our patients across Andhra Pradesh.
            </motion.p>
          </div>

          <div className="grid gap-6 md:grid-cols-3 md:gap-8">
            {testimonials.map((item, index) => (
              <motion.div
                key={item.quote}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="group relative rounded-[2rem] border border-gray-100 bg-[#FAF9F6] p-6 transition-all duration-500 hover:bg-white hover:shadow-[0_40px_80px_-15px_rgba(4,16,24,0.08)] md:rounded-[48px] md:p-10 lg:p-12"
              >
                <div className="absolute right-6 top-6 text-[#0F2F56] opacity-[0.05] transition-opacity group-hover:opacity-10 md:right-10 md:top-10">
                  <Quote size={80} />
                </div>
                <div className="mb-6 flex gap-1 md:mb-8">
                  {Array.from({ length: item.stars }).map((_, starIndex) => (
                    <Star key={starIndex} size={14} className="fill-[#0F2F56] text-[#0F2F56]" />
                  ))}
                </div>
                <p className="relative z-10 mb-8 text-lg font-light italic leading-[1.7] text-[#425462] md:mb-12 md:text-2xl md:leading-[1.6]">
                  &quot;{item.quote}&quot;
                </p>
                <div className="flex items-center gap-5 border-t border-gray-200/60 pt-8">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0F2F56] text-white shadow-lg shadow-[#0F2F56]/20">
                    <Users size={24} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-[#041018]">{item.name}</h4>
                    <p className="mt-1 text-[11px] font-bold text-[#0F2F56]/60">{item.category}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#041018] py-16 text-white md:py-24">
        <motion.div {...fader} className="mx-auto max-w-5xl px-6 text-center md:px-10">
          <span className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#8FB3E0]/80">
            Continue Your Journey
          </span>
          <h2 className="mt-4 text-[2.3rem] font-bold leading-[1] tracking-tighter md:text-6xl">
            Ready to experience <span className="font-serif italic text-[#8FB3E0]">thoughtful dental care?</span>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-white/70 md:text-lg">
            Visit the clinic, book a consultation, or speak with the team about treatment planning and doorstep care.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex min-w-[220px] items-center justify-center gap-2 rounded-full bg-[#8FB3E0] px-7 py-4 text-sm font-semibold text-[#041018] transition hover:bg-[#a3c0e8]"
            >
              Book Appointment
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/services"
              className="inline-flex min-w-[220px] items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-7 py-4 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Explore Treatments
              <ChevronRight size={16} />
            </Link>
          </div>
        </motion.div>
      </section>
    </main>
  )
}
