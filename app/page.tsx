'use client'

import Link from 'next/link'
import { AnimatePresence, motion, useInView, useScroll, useTransform } from 'framer-motion'
import {
  Activity,
  ArrowRight,
  Award,
  Building2,
  CalendarDays,
  ChevronRight,
  Clock3,
  Home,
  MapPin,
  Microscope,
  Phone,
  ShieldCheck,
  Sparkles,
  Star,
  Stethoscope,
  Trophy,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import AppointmentInlineForm from '@/components/AppointmentInlineForm'
import SiteImage from '@/components/SiteImage'
import WhatsAppAppointmentModal from '@/components/WhatsAppAppointmentModal'
import { CLINIC_INFO, SERVICES } from '@/lib/data'

const heroSlides: ReadonlyArray<{
  image: string
  imageClassName: string
  mobileImageClassName?: string
  secondaryImage?: string
  secondaryImageClassName?: string
  eyebrow: string
  title: string
  description: string
  mobileTitle?: string
  mobileDescription?: string
  ctaLabel: string
  ctaHref: string
  layout: 'split' | 'immersive'
  theme: 'hospital' | 'doorstep' | 'doctor' | 'treatment' | 'kids'
  metaTitle?: string
  metaBody?: string
}> = [
  {
    image: '/about1.webp',
    imageClassName: 'object-[52%_40%]',
    mobileImageClassName: 'object-[52%_34%]',
    eyebrow: 'Welcome To Dhanra Dental Hospital',
    title: 'Trusted dental care in Vijayawada.',
    description:
      'Modern diagnostics, specialist-led planning, and a calmer care experience from consultation to treatment.',
    mobileTitle: 'Trusted dental care in Vijayawada.',
    mobileDescription: 'Modern diagnostics and specialist-led care in a calmer clinical setting.',
    ctaLabel: 'Know More',
    ctaHref: '/about',
    layout: 'immersive',
    theme: 'hospital',
  },
  {
    image: '/door.webp',
    imageClassName: 'object-[72%_40%]',
    secondaryImage: '/clinicgal (2).webp',
    secondaryImageClassName: 'object-[48%_50%]',
    eyebrow: 'Doorstep Dentistry',
    title: 'Doorstep dentistry.',
    description:
      'Professional dental care at home with structured support, comfort, and hospital-grade guidance.',
    ctaLabel: 'Know More',
    ctaHref: '/services/doorstep-dentistry',
    layout: 'split',
    theme: 'doorstep',
    metaTitle: 'Home Visit Support',
    metaBody: 'Designed for access, elderly care, and more comfortable follow-up.',
  },
  {
    image: '/led.webp',
    imageClassName: 'object-[58%_20%]',
    secondaryImage: '/fu.jpeg',
    secondaryImageClassName: 'object-[52%_38%]',
    eyebrow: 'Lead Specialist',
    title: 'Specialist patient guidance.',
    description:
      'Surgical care, implantology, and treatment planning guided with clarity, ethics, and a more human approach.',
    ctaLabel: 'Know More',
    ctaHref: '/about',
    layout: 'split',
    theme: 'doctor',
    metaTitle: 'Dr. Sanketh Raju K',
    metaBody: 'Oral & Maxillofacial Surgeon | Implantologist',
  },
  {
    image: '/implant.webp',
    imageClassName: 'object-[50%_40%]',
    secondaryImage: '/di.webp',
    secondaryImageClassName: 'object-[55%_45%]',
    eyebrow: 'Implants Dentistry',
    title: 'Implants dentistry',
    description:
      'Advanced implant care designed to restore comfort, chewing strength, and a more natural-looking smile.',
    ctaLabel: 'Know More',
    ctaHref: '/services/dental-implants',
    layout: 'split',
    theme: 'treatment',
    metaTitle: 'Long-Term Stability',
    metaBody: 'Precision planning with a more natural-looking restorative finish.',
  },
  {
    image: '/kids.webp',
    imageClassName: 'object-[68%_24%]',
    mobileImageClassName: 'object-[68%_24%]',
    eyebrow: 'Kids Dentistry',
    title: 'Kids dentistry',
    description:
      'Gentle dental care for children in a setting designed to feel calmer, kinder, and easier.',
    mobileTitle: 'Kids dentistry',
    mobileDescription: 'Gentle dental care for children in a calmer, kinder, and easier setting.',
    ctaLabel: 'Know More',
    ctaHref: '/services/kids-dentistry',
    layout: 'immersive',
    theme: 'kids',
  },
  {
    image: '/sank.webp',
    imageClassName: 'object-[58%_40%]',
    secondaryImage: '/cb.webp',
    secondaryImageClassName: 'object-[50%_36%]',
    eyebrow: 'Smile Design',
    title: 'Smile design and restorative dentistry',
    description:
      'Aesthetic and restorative treatments planned for function, facial harmony, and a natural finish.',
    ctaLabel: 'Know More',
    ctaHref: '/services/cosmetic-dentistry',
    layout: 'split',
    theme: 'treatment',
    metaTitle: 'Aesthetic Planning',
    metaBody: 'Refined smile enhancement with restorative detail and clinical clarity.',
  },
]

const trustPoints = [
  {
    icon: ShieldCheck,
    title: 'Sterilization & Safety',
    body: 'We maintain strict sterilization protocols, clean treatment workflows, and careful safety standards for every patient visit.',
  },
  {
    icon: Stethoscope,
    title: 'Specialist-Led Guidance',
    body: 'Every case is guided with clear diagnosis, ethical treatment planning, and practical advice you can trust.',
  },
  {
    icon: Trophy,
    title: 'Advanced Dental Solutions',
    body: 'From implants and oral surgery to aesthetic and family dentistry, we provide complete care under one roof.',
  },
] as const

const treatmentStrip = [
  { title: 'Dental Implants', subtitle: 'Implants and replacement care', image: '/implant.webp', href: '/services/dental-implants' },
  { title: 'Root Canal Treatment', subtitle: 'Pain relief and tooth preservation', image: '/rc.webp', href: '/services/root-canal-treatment' },
  { title: 'Crowns & Bridges', subtitle: 'Restore strength and appearance', image: '/cb.webp', href: '/services/crowns-and-bridges' },
  { title: 'Braces & Aligners', subtitle: 'Orthodontic smile correction', image: '/b.webp', href: '/services/braces-and-aligners' },
  { title: 'Gum Treatments', subtitle: 'Periodontal care and gum health', image: '/gum.webp', href: '/services/gum-treatments' },
  { title: 'Kids Dentistry', subtitle: 'Child-friendly dental care', image: '/kd.webp', href: '/services/kids-dentistry' },
  { title: 'Cosmetic Dentistry', subtitle: 'Smile enhancement treatments', image: '/smile.webp', href: '/services/cosmetic-dentistry' },
  
] as const

const specialtyCards = [
  {
    icon: Microscope,
    title: 'Digital Diagnostics',
    body: 'CBCT and 3D intra-oral scanning for precise diagnosis, treatment planning, and confident case review.',
    focus: 'CBCT • 3D Scanning',
  },
  {
    icon: Award,
    title: 'Implantology',
    body: 'Advanced implant workflows designed for long-term stability, function, and natural-looking restoration.',
    focus: 'Precision Implant Planning',
  },
  {
    icon: Activity,
    title: 'Maxillofacial Surgery',
    body: 'Specialist-led surgical care for complex oral and maxillofacial conditions with careful planning at every stage.',
    focus: 'Complex Surgical Care',
  },
  {
    icon: ShieldCheck,
    title: 'Aesthetic Dentistry',
    body: 'Smile enhancement treatments built around facial balance, detail, and digitally guided cosmetic planning.',
    focus: 'Smile Design • Balance',
  },
] as const

const careModes = {
  hospital: {
    label: 'Hospital Experience',
    icon: Building2,
    points: [
      {
        title: 'Surgical Theaters',
        body: 'Well-equipped clinical rooms support surgical and advanced dental procedures with organized treatment flow.',
      },
      {
        title: '3D Digital Suite',
        body: 'Digital diagnostics and imaging help us evaluate cases precisely and plan treatment with more confidence.',
      },
      {
        title: 'Sterilization Core',
        body: 'Strict sterilization and infection-control protocols are followed across instruments, rooms, and patient workflows.',
      },
      {
        title: 'Specialist Planning',
        body: 'Every advanced case is reviewed with proper diagnosis, clear communication, and specialist-guided treatment planning.',
      },
    ],
  },
  doorstep: {
    label: 'Doorstep Initiative',
    icon: Home,
    points: [
      {
        title: 'Pioneer Status',
        body: 'Dhanra Dental Hospital is among the first in Andhra Pradesh to bring structured doorstep dentistry to patients.',
      },
      {
        title: 'Portable Dental Care',
        body: 'Selected services are delivered with mobile equipment designed for convenience, safety, and patient comfort.',
      },
      {
        title: 'Elderly Priority',
        body: 'This initiative is especially helpful for elderly patients, those with mobility challenges, and home-bound care needs.',
      },
      {
        title: 'At-Home Access',
        body: 'Doorstep consultations and support reduce travel stress while extending professional dental care beyond the clinic.',
      },
    ],
  },
} as const

const testimonials = [
  {
    quote:
      "The precision of Dr. Sanketh's surgical planning was unlike anything I had experienced. My implant recovery was seamless and reassuring from start to finish.",
    name: 'Ramakrishna M.',
    tag: 'Full Arch Implants',
  },
  {
    quote:
      "The Doorstep Dentistry team came to my elderly mother's home with proper equipment and excellent care. It made treatment possible when travel was difficult.",
    name: 'P.Pradeep .',
    tag: 'Home Visit Patient',
  },
  {
    quote:
      'The digital scan and explanation gave me real confidence in the treatment plan. Everything felt modern, clear, and professionally handled.',
    name: 'Rachana E.',
    tag: 'Digital Diagnostics',
  },
] as const

const aboutGalleryItems = [
  {
    image: '/fu.jpeg',
    title: 'Clinical interiors',
  },
  {
    image: '/exterior.webp',
    title: 'Reception Area',
  },
  {
    image: '/ab.webp',
    title: 'Treatment Area',
  },
] as const

const aboutHighlights = [
  {
    text: 'Advanced treatment planning with clear guidance',
    featured: false,
  },
  {
    text: 'Comfort-focused care for families and individuals',
    featured: false,
  },
  {
    text: "AP's first hospital to launch doorstep dentistry",
    featured: true,
  },
  {
    text: 'Modern infrastructure for safe clinical care',
    featured: false,
  },
] as const

const revealEase = [0.22, 1, 0.36, 1] as const

function ScrollReveal({
  children,
  className,
  delay = 0,
  amount = 0.18,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
  amount?: number
}) {
  const ref = useRef<HTMLDivElement | null>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 92%', 'start 52%'],
  })
  const opacity = useTransform(scrollYProgress, [0, 0.45, 1], [0.18, 0.72, 1])
  const y = useTransform(scrollYProgress, [0, 1], [22, 0])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.2, delay }}
      style={{ opacity, y, willChange: 'transform, opacity' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

const heroSlideMotion = {
  enter: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? 72 : -72,
    scale: 0.985,
  }),
  center: {
    opacity: 1,
    x: 0,
    scale: 1,
  },
  exit: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? -72 : 72,
    scale: 0.985,
  }),
} as const

function SectionTag({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-[#0D3460]/10 bg-white/80 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.24em] text-[#31557A] shadow-sm">
      <Sparkles size={12} />
      <span>{children}</span>
    </div>
  )
}

function DarkEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="mb-4 block text-[10px] font-bold uppercase tracking-[0.38em] text-[#7BAFD4] md:tracking-[0.65em]">
      {children}
    </span>
  )
}

function HeroCarousel() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [direction, setDirection] = useState(1)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % heroSlides.length)
    }, 6000)

    return () => window.clearInterval(timer)
  }, [])

  const activeSlide = heroSlides[activeIndex]
  const prioritizeHeroImage = activeIndex === 0

  function goToSlide(index: number) {
    setDirection(index > activeIndex ? 1 : -1)
    setActiveIndex(index)
  }

  function goNext() {
    setDirection(1)
    setActiveIndex((current) => (current + 1) % heroSlides.length)
  }

  function goPrevious() {
    setDirection(-1)
    setActiveIndex((current) => (current - 1 + heroSlides.length) % heroSlides.length)
  }

  const splitSlide = activeSlide.layout === 'split'
  const fullBackgroundMobileSlide = activeSlide.theme === 'hospital' || activeSlide.theme === 'kids'
  const fullBackgroundMobileSplitSlide =
    activeSlide.theme === 'doorstep' || activeSlide.theme === 'doctor' || activeSlide.theme === 'treatment'
  const whiteDesktopSplitSlide = activeSlide.theme === 'doorstep'
  const blackBackgroundSplitSlide = activeSlide.title === 'Implants dentistry'

  return (
    <section className="relative overflow-hidden bg-[#f6f8fb] text-[#102230]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(23,63,115,0.12),transparent_30%),radial-gradient(circle_at_88%_10%,rgba(198,164,92,0.14),transparent_18%),linear-gradient(180deg,#ffffff_0%,#f6f8fb_100%)]" />
      <div className="absolute left-[-7rem] top-14 h-[21rem] w-[21rem] rounded-full bg-[#eaf2fb] blur-3xl" />
      <div className="absolute right-[-5rem] top-8 h-[18rem] w-[18rem] rounded-full bg-[#f3e7cf] blur-3xl" />

      <div className="relative z-10 px-0 pb-0 pt-0">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeSlide.title}
            custom={direction}
            variants={heroSlideMotion}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className={`overflow-hidden rounded-none shadow-none ${
              splitSlide
                ? blackBackgroundSplitSlide
                  ? 'bg-black'
                  : whiteDesktopSplitSlide
                  ? 'bg-white'
                  : 'bg-[linear-gradient(135deg,#2b6c88_0%,#337d99_52%,#59b7dd_100%)]'
                : 'bg-[#102230]'
            }`}
          >
            {splitSlide ? (
<div className="grid md:min-h-[38rem] lg:min-h-[40rem] lg:grid-cols-[minmax(0,0.94fr)_minmax(26rem,1.06fr)] lg:items-stretch xl:min-h-[46rem]">
              <div className={`${fullBackgroundMobileSplitSlide ? 'hidden md:flex' : 'order-2'} flex-col justify-center px-6 py-8 pb-8 ${whiteDesktopSplitSlide ? 'text-[#102230]' : 'text-white'} sm:px-8 md:px-10 md:py-10 md:pb-10 lg:order-1 lg:justify-center lg:px-14 lg:py-16 xl:px-16`}>
                <motion.div
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.12, duration: 0.45 }}
                  className={`text-[0.72rem] font-bold uppercase tracking-[0.28em] ${whiteDesktopSplitSlide ? 'text-[#31557A]' : 'text-white/76'}`}
                >
                  {activeSlide.eyebrow}
                </motion.div>
                <motion.h1
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.18, duration: 0.48 }}
                  className={`mt-4 max-w-[9ch] text-[clamp(2.45rem,5vw,4rem)] font-black uppercase leading-[0.98] tracking-[-0.04em] ${whiteDesktopSplitSlide ? 'text-[#102230]' : 'text-white'}`}
                >
                  {activeSlide.title}
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.24, duration: 0.48 }}
                  className={`mt-5 max-w-[27rem] text-[0.98rem] leading-8 md:text-[1.04rem] ${whiteDesktopSplitSlide ? 'text-[#31557A]' : 'text-white/90'}`}
                >
                  {activeSlide.description}
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.48 }}
                  className="mt-8 flex flex-col gap-4 sm:flex-row"
                >
                  <Link
                    href={activeSlide.ctaHref}
                    className="inline-flex min-h-[3.7rem] items-center justify-center rounded-[0.85rem] bg-[#4fb3db] px-8 text-base font-semibold text-white transition hover:brightness-105"
                  >
                    {activeSlide.ctaLabel}
                  </Link>
                  <WhatsAppAppointmentModal
                    source={`Home Hero - ${activeSlide.title}`}
                    buttonLabel="Request Appointment"
                    buttonClassName="inline-flex min-h-[3.7rem] items-center justify-center rounded-[0.85rem] bg-[#ff8c2a] px-8 text-base font-semibold text-white transition hover:brightness-105"
                  />
                </motion.div>
                {activeSlide.metaTitle && activeSlide.metaBody ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.36, duration: 0.45 }}
                    className={`mt-8 hidden md:flex md:max-w-[22rem] md:items-start md:gap-4 md:rounded-[1.25rem] md:px-4 md:py-4 ${
                      activeSlide.metaTitle === 'Home Visit Support'
                        ? 'md:border md:border-black/20 md:bg-black'
                        : 'md:border md:border-white/12 md:bg-white/8 md:backdrop-blur-md'
                    }`}
                  >
                    <div className="mt-1 h-2.5 w-2.5 rounded-full bg-[#7BAFD4]" />
                    <div>
                      <div className={`text-sm font-semibold ${activeSlide.metaTitle === 'Home Visit Support' ? 'text-white' : 'text-white'}`}>
                        {activeSlide.metaTitle}
                      </div>
                      <div
                        className={`mt-1 text-sm leading-6 ${activeSlide.metaTitle === 'Home Visit Support' ? 'text-white/75' : 'text-white/70'}`}
                      >
                        {activeSlide.metaBody}
                      </div>
                    </div>
                  </motion.div>
                ) : null}
              </div>

              <div className={`${fullBackgroundMobileSplitSlide ? 'hidden md:block' : 'order-1'} px-0 pb-0 pt-0 lg:order-2 lg:p-0`}>
                <div className="relative min-h-[15rem] overflow-hidden rounded-none md:min-h-[17rem] lg:min-h-full lg:px-8 lg:py-8">
                  <div className="absolute inset-y-0 left-0 hidden w-[18%] bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0))] lg:block" />
                  <motion.div
                    initial={{ opacity: 0, x: 36, scale: 1.04 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{ delay: 0.16, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute right-[4%] top-[7%] h-[54%] w-[78%] overflow-hidden rounded-[1.6rem] border border-white/15 shadow-[0_30px_80px_rgba(0,0,0,0.22)] lg:backdrop-blur-sm"
                  >
                    <SiteImage
                      src={activeSlide.image}
                      alt={activeSlide.title}
                      fill
                      priority={prioritizeHeroImage}
                      sizes="(max-width: 1024px) 100vw, 48vw"
                      quality={74}
                      className={`object-cover ${activeSlide.imageClassName}`}
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.04),rgba(0,0,0,0.16))]" />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: 44, scale: 1.04 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{ delay: 0.24, duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute bottom-[7%] left-[6%] h-[44%] w-[70%] overflow-hidden rounded-[1.6rem] border border-white/12 shadow-[0_26px_70px_rgba(0,0,0,0.2)]"
                  >
                    <SiteImage
                      src={activeSlide.secondaryImage ?? activeSlide.image}
                      alt={`${activeSlide.title} supporting image`}
                      fill
                      sizes="(max-width: 1024px) 100vw, 44vw"
                      quality={68}
                      className={`object-cover ${activeSlide.secondaryImageClassName ?? activeSlide.imageClassName}`}
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.02),rgba(0,0,0,0.12))]" />
                  </motion.div>
                </div>
              </div>

              {fullBackgroundMobileSplitSlide ? (
                <div className="relative md:hidden min-h-[42rem]">
                  <motion.div
                    initial={{ opacity: 0, scale: 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-0"
                  >
                    <SiteImage
                      src={activeSlide.image}
                      alt={activeSlide.title}
                      fill
                      priority={prioritizeHeroImage}
                      sizes="100vw"
                      quality={72}
                      className={`object-cover ${activeSlide.mobileImageClassName ?? activeSlide.imageClassName}`}
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,19,29,0.14)_0%,rgba(8,19,29,0.3)_28%,rgba(8,19,29,0.8)_100%)]" />
                  </motion.div>

                  <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 px-5 pb-24 text-white sm:px-8">
                    <motion.div
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.12, duration: 0.45 }}
                      className="text-[0.68rem] font-bold uppercase tracking-[0.3em] text-[#d8e2eb]"
                    >
                      {activeSlide.eyebrow}
                    </motion.div>
                    <motion.h1
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.18, duration: 0.48 }}
                      className="mt-4 max-w-[6.8ch] text-[clamp(2.25rem,8.8vw,3.6rem)] font-black uppercase leading-[0.94] tracking-[-0.045em] text-white"
                    >
                      {activeSlide.title}
                    </motion.h1>
                    <motion.p
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.24, duration: 0.48 }}
                      className="mt-4 max-w-[17rem] text-[0.92rem] leading-7 text-white/90"
                    >
                      {activeSlide.description}
                    </motion.p>
                    <motion.div
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.48 }}
                      className="pointer-events-auto mt-6 flex flex-col gap-3"
                    >
                      <Link
                        href={activeSlide.ctaHref}
                        className="inline-flex min-h-[3.35rem] items-center justify-center rounded-[0.95rem] bg-[#4fb3db] px-6 text-[0.98rem] font-semibold text-white transition hover:brightness-105"
                      >
                        {activeSlide.ctaLabel}
                      </Link>
                      <WhatsAppAppointmentModal
                        source={`Home Hero - ${activeSlide.title}`}
                        buttonLabel="Request Appointment"
                        buttonClassName="inline-flex min-h-[3.35rem] items-center justify-center rounded-[0.95rem] bg-[#ff8c2a] px-6 text-[0.98rem] font-semibold text-white transition hover:brightness-105"
                      />
                    </motion.div>
                  </div>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="relative md:min-h-[38rem] lg:min-h-[40rem] xl:min-h-[44rem]">
              <div className="relative md:hidden">
                <motion.div
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
                  className={fullBackgroundMobileSlide ? 'relative min-h-[42rem]' : 'relative h-[15.5rem] sm:h-[17.5rem]'}
                >
                  <SiteImage
                    src={activeSlide.image}
                    alt={activeSlide.title}
                    fill
                    priority={prioritizeHeroImage}
                    sizes="100vw"
                    quality={72}
                    className={`object-cover ${activeSlide.mobileImageClassName ?? activeSlide.imageClassName}`}
                  />
                  <div
                    className={`absolute inset-0 ${
                      fullBackgroundMobileSlide
                        ? 'bg-[linear-gradient(180deg,rgba(8,19,29,0.18)_0%,rgba(8,19,29,0.34)_30%,rgba(8,19,29,0.8)_100%)]'
                        : 'bg-[linear-gradient(180deg,rgba(13,22,35,0.28)_0%,rgba(13,22,35,0.08)_100%)]'
                    }`}
                  />
                </motion.div>

                {fullBackgroundMobileSlide ? (
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 px-5 pb-24 text-white sm:px-8">
                    <motion.div
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.12, duration: 0.45 }}
                      className="text-[0.68rem] font-bold uppercase tracking-[0.3em] text-[#d8e2eb]"
                    >
                      {activeSlide.eyebrow}
                    </motion.div>
                    <motion.h1
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.18, duration: 0.48 }}
                      className="mt-4 max-w-[6.6ch] text-[clamp(2.2rem,8.6vw,3.45rem)] font-black uppercase leading-[0.94] tracking-[-0.045em] text-white"
                    >
                      {activeSlide.mobileTitle ?? activeSlide.title}
                    </motion.h1>
                    <motion.p
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.24, duration: 0.48 }}
                      className="mt-4 max-w-[16.5rem] text-[0.88rem] leading-6 text-white/88"
                    >
                      {activeSlide.mobileDescription ?? activeSlide.description}
                    </motion.p>
                    <motion.div
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.48 }}
                      className="pointer-events-auto mt-6 flex flex-col gap-3"
                    >
                      <Link
                        href={activeSlide.ctaHref}
                        className="inline-flex min-h-[3.35rem] items-center justify-center rounded-[0.95rem] bg-[#4fb3db] px-6 text-[0.98rem] font-semibold text-white transition hover:brightness-105"
                      >
                        {activeSlide.ctaLabel}
                      </Link>
                      <WhatsAppAppointmentModal
                        source={`Home Hero - ${activeSlide.title}`}
                        buttonLabel="Request Appointment"
                        buttonClassName="inline-flex min-h-[3.35rem] items-center justify-center rounded-[0.95rem] bg-[#ff8c2a] px-6 text-[0.98rem] font-semibold text-white transition hover:brightness-105"
                      />
                    </motion.div>
                  </div>
                ) : (
                  <div className="bg-[#102230] px-6 py-8 pb-8 text-white sm:px-8">
                    <motion.div
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.12, duration: 0.45 }}
                      className="text-[0.72rem] font-bold uppercase tracking-[0.28em] text-[#cbd7e3]"
                    >
                      {activeSlide.eyebrow}
                    </motion.div>
                    <motion.h1
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.18, duration: 0.48 }}
                      className="mt-4 max-w-[7ch] text-[clamp(2.4rem,9vw,3.7rem)] font-black uppercase leading-[0.94] tracking-[-0.04em] text-white"
                    >
                      {activeSlide.mobileTitle ?? activeSlide.title}
                    </motion.h1>
                    <motion.p
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.24, duration: 0.48 }}
                      className="mt-5 max-w-[17rem] text-[0.92rem] leading-7 text-white/90"
                    >
                      {activeSlide.mobileDescription ?? activeSlide.description}
                    </motion.p>
                    <motion.div
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.48 }}
                      className="mt-8 flex flex-col gap-3"
                    >
                      <Link
                        href={activeSlide.ctaHref}
                        className="inline-flex min-h-[3.55rem] items-center justify-center rounded-[1rem] bg-[#4fb3db] px-8 text-[1.02rem] font-semibold text-white transition hover:brightness-105"
                      >
                        {activeSlide.ctaLabel}
                      </Link>
                      <WhatsAppAppointmentModal
                        source={`Home Hero - ${activeSlide.title}`}
                        buttonLabel="Request Appointment"
                        buttonClassName="inline-flex min-h-[3.55rem] items-center justify-center rounded-[1rem] bg-[#ff8c2a] px-8 text-[1.02rem] font-semibold text-white transition hover:brightness-105"
                      />
                    </motion.div>
                  </div>
                )}
              </div>

              <div className="relative hidden md:block md:min-h-[38rem] lg:min-h-[40rem] xl:min-h-[44rem]">
                <motion.div
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0"
                >
                  <SiteImage
                    src={activeSlide.image}
                    alt={activeSlide.title}
                    fill
                    priority={prioritizeHeroImage}
                    sizes="100vw"
                    quality={74}
                    className={`object-cover ${activeSlide.imageClassName}`}
                  />
                  <div className={`absolute inset-0 ${
                    fullBackgroundMobileSlide
                      ? 'bg-[linear-gradient(90deg,rgba(8,19,29,0.72)_0%,rgba(8,19,29,0.48)_34%,rgba(8,19,29,0.18)_68%,rgba(8,19,29,0.1)_100%)]'
                      : 'bg-[linear-gradient(90deg,rgba(13,22,35,0.68)_0%,rgba(13,22,35,0.45)_34%,rgba(13,22,35,0.12)_72%,rgba(13,22,35,0.08)_100%)]'
                  }`} />
                </motion.div>

                <div className={`relative bg-[#102230] px-6 py-8 text-white sm:px-8 md:absolute md:inset-y-0 md:left-0 md:flex md:flex-col md:justify-center md:px-10 md:py-12 lg:px-14 lg:py-16 ${
                  fullBackgroundMobileSlide ? 'md:w-full xl:w-full' : 'md:w-[46%] xl:w-[44%]'
                } ${fullBackgroundMobileSlide ? 'md:bg-transparent' : ''}`}>
                  <div
                    className={`md:w-fit md:max-w-[35rem] md:rounded-[2rem] md:border md:border-white/15 md:bg-[linear-gradient(180deg,rgba(8,19,29,0.48)_0%,rgba(8,19,29,0.66)_100%)] md:px-8 md:py-8 md:shadow-[0_30px_80px_rgba(0,0,0,0.22)] md:backdrop-blur-xl lg:max-w-[37rem] lg:px-10 lg:py-10 ${
                      fullBackgroundMobileSlide ? '' : 'md:bg-[linear-gradient(180deg,rgba(8,19,29,0.42)_0%,rgba(8,19,29,0.58)_100%)]'
                    }`}
                  >
                  <motion.div
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.12, duration: 0.45 }}
                    className={`text-[0.72rem] font-bold uppercase tracking-[0.28em] ${fullBackgroundMobileSlide ? 'text-[#dbe5ee]' : 'text-[#cbd7e3]'}`}
                  >
                    {activeSlide.eyebrow}
                  </motion.div>
                  <motion.h1
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.18, duration: 0.48 }}
                    className={`mt-5 max-w-[8.5ch] font-black uppercase tracking-[-0.045em] text-white ${
                      fullBackgroundMobileSlide
                        ? 'text-[clamp(3rem,4.4vw,5rem)] leading-[0.9]'
                        : 'text-[clamp(2.8rem,4vw,4.4rem)] leading-[0.92]'
                    }`}
                  >
                    {activeSlide.title}
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.24, duration: 0.48 }}
                    className={`mt-6 max-w-[30rem] text-white/88 ${
                      fullBackgroundMobileSlide
                        ? 'text-[1.02rem] leading-8 lg:text-[1.08rem]'
                        : 'text-[1rem] leading-8 lg:text-[1.06rem]'
                    }`}
                  >
                    {activeSlide.description}
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.48 }}
                    className={`mt-8 flex flex-col gap-4 sm:flex-row ${fullBackgroundMobileSlide ? 'md:mt-7' : ''}`}
                  >
                    <Link
                      href={activeSlide.ctaHref}
                      className={`inline-flex items-center justify-center bg-[#4fb3db] font-semibold text-white transition hover:brightness-105 ${
                        fullBackgroundMobileSlide ? 'min-h-[3.85rem] rounded-[1rem] px-8 text-[1rem]' : 'min-h-[3.7rem] rounded-[0.85rem] px-8 text-base'
                      }`}
                    >
                      {activeSlide.ctaLabel}
                    </Link>
                    <WhatsAppAppointmentModal
                      source={`Home Hero - ${activeSlide.title}`}
                      buttonLabel="Request Appointment"
                      buttonClassName={`inline-flex items-center justify-center bg-[#ff8c2a] font-semibold text-white transition hover:brightness-105 ${
                        fullBackgroundMobileSlide ? 'min-h-[3.85rem] rounded-[1rem] px-8 text-[1rem]' : 'min-h-[3.7rem] rounded-[0.85rem] px-8 text-base'
                      }`}
                    />
                  </motion.div>
                  {activeSlide.metaTitle && activeSlide.metaBody ? (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.36, duration: 0.45 }}
                      className={`mt-8 hidden md:flex md:max-w-[22rem] md:items-start md:gap-4 md:rounded-[1.25rem] md:px-4 md:py-4 ${
                        activeSlide.metaTitle === 'Home Visit Support'
                          ? 'md:border md:border-black/20 md:bg-black'
                          : whiteDesktopSplitSlide
                          ? 'md:border md:border-[#0D3460]/12 md:bg-[#f7fbff]'
                          : 'md:border md:border-white/12 md:bg-white/8 md:backdrop-blur-md'
                      }`}
                    >
                      <div className="mt-1 h-2.5 w-2.5 rounded-full bg-[#7BAFD4]" />
                      <div>
                        <div
                          className={`text-sm font-semibold ${
                            activeSlide.metaTitle === 'Home Visit Support'
                              ? 'text-white'
                              : whiteDesktopSplitSlide
                                ? 'text-[#102230]'
                                : 'text-white'
                          }`}
                        >
                          {activeSlide.metaTitle}
                        </div>
                        <div
                          className={`mt-1 text-sm leading-6 ${
                            activeSlide.metaTitle === 'Home Visit Support'
                              ? 'text-white/75'
                              : whiteDesktopSplitSlide
                                ? 'text-[#4d6784]'
                                : 'text-white/70'
                          }`}
                        >
                          {activeSlide.metaBody}
                        </div>
                      </div>
                    </motion.div>
                  ) : null}
                  </div>
                </div>
              </div>
            </div>
          )}
          </motion.div>
        </AnimatePresence>

        <div className="relative z-20 mx-auto mt-4 hidden w-[min(18rem,calc(100%-2rem))] items-center justify-between rounded-[1.4rem] border border-[#0d3460]/8 bg-white/92 px-4 py-3 shadow-[0_12px_26px_rgba(16,34,48,0.05)] md:flex lg:absolute lg:bottom-8 lg:left-1/2 lg:mt-0 lg:w-auto lg:min-w-[24rem] lg:-translate-x-1/2 lg:rounded-full lg:border lg:border-white/20 lg:bg-white/78 lg:px-5 lg:py-3 lg:shadow-[0_22px_50px_rgba(16,34,48,0.16)] lg:backdrop-blur-xl">
          <button
            type="button"
            onClick={goPrevious}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#0d3460]/10 bg-[#f8fbff] text-[#173f73] transition hover:bg-white"
            aria-label="Previous slide"
          >
            <ChevronRight size={18} className="rotate-180" />
          </button>
          <div className="flex gap-2">
            {heroSlides.map((slide, index) => (
              <button
                key={slide.title}
                type="button"
                onClick={() => goToSlide(index)}
                aria-label={`Show slide ${index + 1}`}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  index === activeIndex ? 'w-10 bg-[#173f73] lg:w-12' : 'w-2.5 bg-[#c9d8e9] hover:bg-[#9fb8d3]'
                }`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={goNext}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#0d3460]/10 bg-[#f8fbff] text-[#173f73] transition hover:bg-white"
            aria-label="Next slide"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  )
}

function CountUpStat({
  value,
  suffix = '',
  label,
  formatter,
}: {
  value: number
  suffix?: string
  label: string
  formatter?: (value: number) => string
}) {
  const ref = useRef<HTMLDivElement | null>(null)
  const inView = useInView(ref, { once: true, margin: '-10% 0px' })
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    if (!inView) return

    let start = 0
    const duration = 1400
    let frameId = 0
    const startedAt = performance.now()

    const tick = (now: number) => {
      const progress = Math.min((now - startedAt) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const nextValue = Math.round(start + (value - start) * eased)
      setDisplayValue(nextValue)

      if (progress < 1) {
        frameId = window.requestAnimationFrame(tick)
      }
    }

    frameId = window.requestAnimationFrame(tick)

    return () => window.cancelAnimationFrame(frameId)
  }, [inView, value])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, ease: revealEase }}
    >
      <div className="font-black leading-none tracking-[-0.05em] text-white" style={{ fontSize: 'clamp(2.4rem,5vw,4.8rem)' }}>
        {formatter ? formatter(displayValue) : displayValue}
        <span className="text-[#7BAFD4]">{suffix}</span>
      </div>
      <div className="mt-3 text-[9px] font-bold uppercase tracking-[0.28em] text-white/45 md:text-[10px] md:tracking-[0.5em]">
        {label}
      </div>
    </motion.div>
  )
}

function StatsStrip() {
  const stats = [
    { value: 2025, suffix: '', label: 'Established' },
    { value: 20, suffix: 'k+', label: 'Successful Outcomes' },
    { value: 1, suffix: 'st', label: 'Doorstep Pioneer - AP', formatter: (value: number) => String(value).padStart(2, '0') },
    { value: 100, suffix: '%', label: 'Sterilization Protocol' },
  ] as const

  return (
    <section className="relative overflow-hidden border-b border-white/8 bg-[#08131d] py-10 text-white md:py-12">
      <div className="mx-auto max-w-7xl px-6 md:px-10 lg:px-16">
        <div className="grid grid-cols-2 gap-x-8 gap-y-8 md:grid-cols-4 md:gap-12">
          {stats.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: index * 0.08 }}
            >
              <CountUpStat
                value={item.value}
                suffix={item.suffix}
                label={item.label}
                formatter={'formatter' in item ? item.formatter : undefined}
              />
            </motion.div>
          ))}
        </div>
      </div>
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2 }}
        className="absolute bottom-0 left-0 h-px w-full origin-left bg-gradient-to-r from-transparent via-[#7BAFD4]/50 to-transparent"
      />
    </section>
  )
}

function IntroSection() {
  return (
    <section className="section-shell bg-[#f7f2e9]">
      <ScrollReveal className="mx-auto grid max-w-7xl gap-8 px-6 md:px-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:px-16">
        <div>
          <SectionTag>Why Families Choose Us</SectionTag>
          <h2 className="section-title mt-6">
            Dental care that feels reassuring, professional, and genuinely patient-first.
          </h2>
          <p className="mt-6 max-w-xl text-base leading-8 text-[#425462] md:text-lg">
            At Dhanra Dental Hospital, we focus on making every visit feel clear, comfortable, and well managed. From routine checkups and preventive care to implants, smile correction, and surgical support, our team combines clinical skill with personal attention.
          </p>
          <p className="mt-4 max-w-xl text-base leading-8 text-[#425462]">
            We believe good dentistry is not only about treatment. It is also about honest communication, proper diagnosis, safe clinical practice, and making patients feel confident before, during, and after care.
          </p>
        </div>

        <div className="grid gap-4">
          {trustPoints.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: index * 0.08, ease: revealEase }}
              className="premium-card flex items-start gap-4 rounded-[1.8rem] bg-white/88"
            >
              <div className="inline-flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-[#0D3460] text-white">
                <item.icon size={20} />
              </div>
              <div>
                <h3 className="text-xl font-semibold tracking-tight text-[#102230]">{item.title}</h3>
                <p className="mt-2 text-sm leading-7 text-[#5d7180]">{item.body}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </ScrollReveal>
    </section>
  )
}

function AboutImageGrid() {
  return (
    <div className="grid gap-4">
      <div className="relative overflow-hidden rounded-[2rem] border border-[#0D3460]/8 bg-[#102230] shadow-[0_24px_70px_rgba(16,34,48,0.12)]">
        <div className="relative aspect-[5/6]">
          <SiteImage
            src={aboutGalleryItems[0].image}
            alt={aboutGalleryItems[0].title}
            fill
            sizes="(min-width: 1024px) 36vw, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#102230]/78 via-transparent to-transparent" />
        </div>
        <div className="absolute inset-x-0 bottom-0 p-6 text-white">
          <div className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#e6d5ad]">About Dhanra</div>
          <div className="mt-2 text-2xl font-semibold">AP's first hospital to launch doorstep dentistry
</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 md:gap-4">
        {aboutGalleryItems.slice(1).map((item, index) => (
            <motion.div
              key={item.image}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.5, delay: index * 0.08, ease: revealEase }}
              className="overflow-hidden rounded-[1.35rem] border border-[#0D3460]/8 bg-white shadow-[0_16px_40px_rgba(16,34,48,0.08)]"
            >
            <div className="relative aspect-[4/4.6]">
              <SiteImage
                src={item.image}
                alt={item.title}
                fill
                quality={92}
                sizes="(min-width: 1280px) 19vw, (min-width: 1024px) 22vw, 50vw"
                className="h-full w-full object-cover object-center"
              />
            </div>
            <div className="border-t border-[#0D3460]/6 px-3 py-3 text-center text-xs font-semibold text-[#31557A] md:text-sm">
              {item.title}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function AboutSection() {
  return (
    <section className="bg-white py-20 md:py-24">
      <ScrollReveal className="mx-auto grid max-w-7xl gap-10 px-6 md:px-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:px-16">
        <AboutImageGrid />

        <div>
          <SectionTag>About Us</SectionTag>
          <h2 className="section-title mt-6">
            Advanced dental implants, smile design, oral surgery, and doorstep dentistry in Vijayawada.
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-8 text-[#425462] md:text-lg">
            <span className="font-semibold text-[#C62828]">Dhanra Dental Hospital</span> is dedicated to providing advanced
            dental treatment in a setting that feels professional, welcoming, and well organized. We focus on helping every
            patient understand their treatment clearly while receiving care with comfort and confidence.
          </p>
          <p className="mt-4 max-w-2xl text-base leading-8 text-[#425462]">
            From preventive dentistry and smile correction to implants, oral surgery, and doorstep dentistry, our team is
            committed to delivering complete care with proper diagnosis, ethical treatment planning, and genuine attention to
            patient needs.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {aboutHighlights.map((item, index) => (
              <ScrollReveal
                key={item.text}
                delay={index * 0.06}
                className={`flex min-h-[132px] items-start rounded-[1.4rem] px-5 py-5 text-sm leading-7 shadow-[0_14px_34px_rgba(16,34,48,0.05)] transition-transform duration-300 hover:-translate-y-1 ${
                  item.featured
                    ? 'border border-[#c6a45c]/35 bg-[linear-gradient(135deg,#0D3460_0%,#133d70_100%)] text-white shadow-[0_20px_44px_rgba(13,52,96,0.18)] sm:col-span-2'
                    : 'border border-[#0D3460]/8 bg-[#f7f3ec] text-[#425462]'
                }`}
              >
                <div className="flex h-full flex-col justify-between">
                  {item.featured ? (
                    <span className="mb-3 inline-flex w-fit rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-[#e6d5ad]">
                      Key Highlight
                    </span>
                  ) : null}
                  <span className={`text-base font-semibold leading-8 ${item.featured ? 'text-white' : 'text-[#425462]'}`}>
                    {item.text}
                  </span>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </ScrollReveal>
    </section>
  )
}

function TreatmentsMarqueeSection() {
  return (
    <section className="overflow-hidden bg-[#faf9f6] py-20 text-[#102230] md:py-24">
      <ScrollReveal className="mx-auto max-w-[1800px] px-6 md:px-10 lg:px-16">
        <div className="mb-12 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <SectionTag>Our Treatments</SectionTag>
            <h2 className="mt-6 font-display text-[clamp(2.8rem,6vw,5.8rem)] font-semibold leading-[0.9] tracking-[-0.05em] text-[#102230]">
              Treatments.
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-[#5d7180] md:text-base">
            Explore the major treatment areas at Dhanra Dental Hospital, from preventive and restorative dentistry to implants,
            surgery, and smile-focused care.
          </p>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-6 no-scrollbar snap-x snap-mandatory md:gap-5">
          {treatmentStrip.map((item, index) => (
            <motion.div
              key={`${item.title}-${index}`}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55, delay: index * 0.06, ease: revealEase }}
              whileHover={{ y: -6 }}
              className="group relative shrink-0 snap-start overflow-hidden rounded-[2rem] bg-[#102230] md:rounded-[2.2rem]"
              style={{ width: 'min(84vw, 320px)', height: 'clamp(360px, 78vw, 620px)' }}
            >
              <Link href={item.href} className="block h-full w-full">
                <div className="relative h-full w-full">
                  <SiteImage
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(min-width: 1024px) 28vw, 280px"
                    className="object-cover opacity-60 transition-all duration-700 group-hover:scale-105 group-hover:opacity-78"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#102230] via-[#102230]/18 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-white md:p-8">
                  <div className="mb-3 text-[9px] font-bold uppercase tracking-[0.26em] text-[#c6a45c] md:text-[10px] md:tracking-[0.35em]">
                    {item.subtitle}
                  </div>
                  <h3 className="text-[1.55rem] font-semibold leading-tight tracking-[-0.03em] md:text-[1.9rem]">{item.title}</h3>
                  <div className="my-5 h-px w-full bg-white/15" />
                  <div className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#d8bc82] transition group-hover:text-white md:text-[11px] md:tracking-[0.24em]">
                    Explore More
                    <ChevronRight size={14} />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, delay: treatmentStrip.length * 0.06, ease: revealEase }}
            className="flex shrink-0 snap-start items-center justify-center"
            style={{ width: 'min(84vw, 320px)', height: 'clamp(360px, 78vw, 620px)' }}
          >
            <Link href="/services" className="premium-button">
              Explore More
              <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </ScrollReveal>
    </section>
  )
}

function SpecialistDomainsSection() {
  return (
    <section className="bg-[#07131d] py-24 text-white md:py-32">
      <ScrollReveal className="mx-auto max-w-7xl px-6 md:px-10 lg:px-16">
        <div className="mb-14 grid gap-8 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-end">
          <div>
            <DarkEyebrow>Our Disciplines</DarkEyebrow>
            <h2
              className="max-w-[10ch] font-black leading-[0.88] tracking-[-0.05em] text-white"
              style={{ fontSize: 'clamp(2.9rem,6.6vw,6.4rem)' }}
            >
              Specialist
              <br />
              <span className="font-display italic font-medium text-white">Domains.</span>
            </h2>
          </div>
          <p className="max-w-md text-sm leading-7 text-white/56 md:text-base md:leading-8">
            Every department is shaped around careful diagnosis, specialist-led planning, and treatment standards patients can trust.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {specialtyCards.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -4, borderColor: 'rgba(123, 175, 212, 0.45)' }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: index * 0.08, ease: revealEase }}
              className="group flex min-h-[16.5rem] flex-col rounded-[2rem] border border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.05)_0%,rgba(255,255,255,0.025)_100%)] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.16)] backdrop-blur-sm md:min-h-[17.5rem] md:p-7"
            >
              <div className="mb-5 flex items-start justify-between md:mb-6">
                <div className="inline-flex rounded-[1.35rem] bg-[#102236] p-4 text-[#7BAFD4] ring-1 ring-white/5 md:rounded-[1.5rem] md:p-5">
                  <item.icon size={28} />
                </div>
                <span className="pt-2 text-[0.7rem] font-semibold tracking-[0.28em] text-white/26">
                  0{index + 1}
                </span>
              </div>
              <h3 className="max-w-none text-[1.65rem] font-semibold leading-[1.02] tracking-[-0.04em] text-white md:text-[1.95rem]">
                {item.title}
              </h3>
              <p className="mt-3 max-w-none text-sm leading-7 text-white/60 md:mt-4 md:text-[0.98rem] md:leading-8">
                {item.body}
              </p>
              <div className="mt-auto pt-5">
                <div className="mb-4 h-px w-full bg-gradient-to-r from-[#7BAFD4]/45 via-white/12 to-transparent" />
                <div className="text-[0.68rem] font-bold uppercase tracking-[0.34em] text-[#7BAFD4] md:text-[0.72rem]">
                  {item.focus}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </ScrollReveal>
    </section>
  )
}

function ChooseJourneySection() {
  const [activeMode, setActiveMode] = useState<keyof typeof careModes>('hospital')
  const mode = careModes[activeMode]

  return (
    <section className="bg-[radial-gradient(circle_at_top,rgba(32,63,92,0.28),transparent_24%),linear-gradient(180deg,#07131d_0%,#0a1721_100%)] py-24 text-white md:py-32">
      <ScrollReveal className="mx-auto max-w-7xl px-6 md:px-10 lg:px-16">
        <div className="text-center">
          <DarkEyebrow>Two Ways To Experience Excellence</DarkEyebrow>
          <h2
            className="font-black tracking-[-0.05em] text-white"
            style={{ fontSize: 'clamp(2.8rem,6vw,5.8rem)' }}
          >
            Choose Your <span className="font-display italic font-medium">Journey.</span>
          </h2>
        </div>

        <div className="mt-10 flex justify-center">
          <div className="flex w-full max-w-[28rem] flex-col rounded-[1.8rem] border border-white/10 bg-white/[0.03] p-1.5 md:inline-flex md:w-auto md:max-w-none md:flex-row md:flex-wrap md:items-center md:justify-center md:rounded-full">
            {(['doorstep','hospital'] as const).map((key) => {
              const Icon = careModes[key].icon

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActiveMode(key)}
                  className={`inline-flex items-center justify-center gap-3 rounded-[1.2rem] px-5 py-4 text-[10px] font-bold uppercase tracking-[0.18em] transition-all md:rounded-full md:px-8 md:text-[11px] md:tracking-[0.35em] ${
                    activeMode === key ? 'bg-[#7BAFD4] text-[#07131d]' : 'text-white/40 hover:text-white/75'
                  }`}
                >
                  <Icon size={16} />
                  {careModes[key].label}
                </button>
              )
            })}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeMode}
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35 }}
            className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-4"
          >
            {mode.points.map((point, index) => (
              <motion.div
                key={point.title}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.07 }}
                className="rounded-[2rem] border border-white/14 bg-white/[0.02] p-6 md:p-8"
              >
                <div className="mb-6 h-px w-8 bg-[#7BAFD4]" />
                <h3 className="text-[1.55rem] font-semibold tracking-[-0.04em] text-white md:text-[1.8rem]">{point.title}</h3>
                <p className="mt-4 text-sm leading-7 text-white/46 md:text-base md:leading-8">{point.body}</p>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </ScrollReveal>
    </section>
  )
}

function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % testimonials.length)
    }, 5000)

    return () => window.clearInterval(timer)
  }, [])

  const active = testimonials[activeIndex]

  return (
    <section className="bg-[#faf9f6] py-24 text-[#07131d] md:py-32">
      <ScrollReveal className="mx-auto max-w-7xl px-6 md:px-10 lg:px-16">
        <div className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <DarkEyebrow>Patient Voices</DarkEyebrow>
            <h2
              className="font-black leading-[0.84] tracking-[-0.05em] text-[#07131d]"
              style={{ fontSize: 'clamp(3rem,7vw,7rem)' }}
            >
              Voices of
              <br />
              <span className="font-display italic font-medium text-[#133d70]">Excellence.</span>
            </h2>
          </div>
          <div className="flex gap-3 md:gap-4">
            {testimonials.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`h-2 rounded-full transition-all ${
                  index === activeIndex ? 'w-10 bg-[#133d70] md:w-14' : 'w-5 bg-[#133d70]/20 md:w-6'
                }`}
                aria-label={`Show testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active.name}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-[2rem] bg-[#08131d] p-6 text-white md:rounded-[2.5rem] md:p-14"
          >
            <div className="mb-8 flex gap-2 text-[#7BAFD4]">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star key={index} size={18} className="fill-current" />
              ))}
            </div>
            <p
              className="max-w-5xl font-display text-[clamp(1.45rem,6vw,3.5rem)] italic leading-[1.35] tracking-[-0.03em] text-white/82"
            >
              "{active.quote}"
            </p>
            <div className="mt-12 flex flex-col gap-6 border-t border-white/10 pt-8 md:flex-row md:items-center">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#183149] text-2xl font-bold text-[#7BAFD4]">
                  {active.name[0]}
                </div>
                <div>
                  <div className="text-xl font-semibold tracking-[-0.03em] text-white md:text-2xl">{active.name}</div>
                  <div className="mt-2 text-[10px] font-bold uppercase tracking-[0.24em] text-[#7BAFD4] md:tracking-[0.45em]">
                    {active.tag}
                  </div>
                </div>
              </div>
              <div className="md:ml-auto text-[10px] font-bold uppercase tracking-[0.24em] text-white/22 md:tracking-[0.45em]">
                Verified - Dhanra Dental
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </ScrollReveal>
    </section>
  )
}

function ServicesOverviewSection() {
  const featuredServices = SERVICES.slice(0, 6)

  return (
    <section className="section-shell bg-transparent">
      <ScrollReveal className="mx-auto max-w-7xl px-6 md:px-10 lg:px-16">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <SectionTag>Core Treatments</SectionTag>
            <h2 className="section-title mt-6">Complete dental support under one roof.</h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-[#5d7180] md:text-base">
            From pain relief and preventive care to implants, aligners, cosmetic corrections, pediatric dentistry, and home visit support, the clinic is positioned to handle both everyday dental needs and more advanced treatment journeys.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {featuredServices.map((service, index) => (
            <motion.div
              key={service.name}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08, ease: revealEase }}
              className="premium-card rounded-[1.8rem] bg-white/90"
            >
              <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#31557A]">
                {service.category}
              </div>
              <h3 className="mt-3 text-2xl font-semibold tracking-tight text-[#102230]">{service.name}</h3>
              <p className="mt-3 text-sm leading-7 text-[#5d7180]">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </ScrollReveal>
    </section>
  )
}

function DoctorSection() {
  return (
    <section className="bg-white py-20 md:py-24">
      <ScrollReveal className="mx-auto grid max-w-7xl gap-10 px-6 md:px-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:px-16">
        <ScrollReveal className="relative overflow-hidden rounded-[2rem] border border-[#0D3460]/8 bg-[#102230] shadow-[0_24px_70px_rgba(16,34,48,0.12)]">
          <div className="relative aspect-[4/5]">
            <SiteImage
              src="/dhanra.webp"
              alt="Dr. Sanketh Raju K"
              fill
              sizes="(min-width: 1024px) 32vw, 100vw"
              className="object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#102230] via-transparent to-transparent" />
          </div>
          <div className="absolute inset-x-0 bottom-0 p-6 text-white">
            <div className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#e6d5ad]">Lead Specialist</div>
            <div className="mt-2 text-2xl font-semibold">Dr. Sanketh Raju K</div>
            <div className="mt-1 text-sm text-white/70">Oral and Maxillofacial Surgeon | Implantologist</div>
          </div>
        </ScrollReveal>

        <div>
          <SectionTag>Meet the Doctor</SectionTag>
          <h2 className="section-title mt-6">
            Experience matters, but so does the way treatment is explained.
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-8 text-[#425462] md:text-lg">
            Dr. Sanketh Raju K leads care with a balance of surgical knowledge, implant expertise, and patient-first communication. The goal is not only to perform treatment well, but to help every patient understand what is needed, why it matters, and what to expect next.
          </p>
          <p className="mt-4 max-w-2xl text-base leading-8 text-[#425462]">
            That combination of technical confidence and human reassurance is what helps the clinic feel dependable for both advanced cases and routine visits.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {[
              'Detailed diagnosis before treatment begins',
              'Clear planning for surgical and restorative cases',
              'Comfort-focused communication for anxious patients',
              'Trusted support for long-term dental health goals',
            ].map((point, index) => (
              <ScrollReveal
                key={point}
                delay={index * 0.05}
                className="rounded-[1.4rem] border border-[#0D3460]/8 bg-[#f7f3ec] px-5 py-4 text-sm leading-7 text-[#425462]"
              >
                {point}
              </ScrollReveal>
            ))}
          </div>
        </div>
      </ScrollReveal>
    </section>
  )
}

function VisitSection() {
  return (
    <section className="bg-[#f7f3ec] py-20 md:py-24">
      <ScrollReveal className="mx-auto grid max-w-7xl gap-6 px-6 md:px-10 lg:grid-cols-[1.05fr_0.95fr] lg:px-16">
        <ScrollReveal className="premium-card premium-card-dark rounded-[2rem] text-white">
          <div className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#e6d5ad]">Visit The Clinic</div>
          <h2 className="mt-4 font-display text-[clamp(2.3rem,4vw,4.2rem)] font-semibold leading-[0.96] tracking-[-0.05em]">
            Clean spaces, calm support, and a smoother patient journey.
          </h2>
          <p className="mt-5 max-w-xl text-base leading-8 text-white/74">
            The clinic environment is designed to feel welcoming for families, individuals, and elderly patients. From the front desk to treatment rooms, the experience is built around good communication, reduced stress, and well-organized care.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.4rem] border border-white/10 bg-white/5 p-5">
              <div className="flex items-center gap-3 text-[#e6d5ad]">
                <MapPin size={18} />
                <span className="text-sm font-semibold text-white">Location</span>
              </div>
              <p className="mt-3 text-sm leading-7 text-white/70">{CLINIC_INFO.address}</p>
            </div>
            <div className="rounded-[1.4rem] border border-white/10 bg-white/5 p-5">
              <div className="flex items-center gap-3 text-[#e6d5ad]">
                <Clock3 size={18} />
                <span className="text-sm font-semibold text-white">Timings</span>
              </div>
              <p className="mt-3 text-sm leading-7 text-white/70">{CLINIC_INFO.timings}</p>
            </div>
          </div>
        </ScrollReveal>

        <div className="grid gap-6">
          <ScrollReveal className="relative overflow-hidden rounded-[2rem] border border-[#0D3460]/8 bg-white shadow-[0_20px_60px_rgba(16,34,48,0.1)]">
            <div className="relative aspect-[16/11]">
              <SiteImage
                src="/exterior.webp"
                alt="Dhanra Dental clinic"
                fill
                sizes="(min-width: 1024px) 36vw, 100vw"
                className="object-cover"
              />
            </div>
          </ScrollReveal>
          <div className="grid gap-6 sm:grid-cols-2">
            <ScrollReveal
              delay={0.05}
              className="premium-card rounded-[1.6rem] bg-white/88 transition hover:-translate-y-1"
            >
              <a href={`tel:+91${CLINIC_INFO.phone1}`} className="block">
                <div className="flex items-center gap-3 text-[#31557A]">
                  <Phone size={18} />
                  <span className="text-sm font-semibold uppercase tracking-[0.18em]">Call Us</span>
                </div>
                <div className="mt-4 text-xl font-semibold text-[#102230]">+91 {CLINIC_INFO.phone1}</div>
              </a>
            </ScrollReveal>
            <ScrollReveal
              delay={0.1}
              className="premium-card rounded-[1.6rem] bg-white/88 transition hover:-translate-y-1"
            >
              <Link href="/contact" className="block">
                <div className="flex items-center gap-3 text-[#31557A]">
                  <CalendarDays size={18} />
                  <span className="text-sm font-semibold uppercase tracking-[0.18em]">Quick Booking</span>
                </div>
                <div className="mt-4 text-xl font-semibold text-[#102230]">Request an appointment</div>
              </Link>
            </ScrollReveal>
          </div>
        </div>
      </ScrollReveal>
    </section>
  )
}

export default function HomePage() {
  return (
    <main className="overflow-x-hidden text-[#102230] selection:bg-[#c6a45c]/30 selection:text-[#102230]">
      <HeroCarousel />
      <StatsStrip />
      <AboutSection />
      <TreatmentsMarqueeSection />
      <IntroSection />
      <SpecialistDomainsSection />
      <DoctorSection />
      <ChooseJourneySection />
      <TestimonialsSection />
      <VisitSection />
      <AppointmentInlineForm source="Home Page" />
    </main>
  )
}
