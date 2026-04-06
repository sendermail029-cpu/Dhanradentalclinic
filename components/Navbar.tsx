'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { ChevronDown, ChevronRight, Menu, Phone, X } from 'lucide-react'
import SiteImage from '@/components/SiteImage'
import WhatsAppAppointmentModal from '@/components/WhatsAppAppointmentModal'
import { CLINIC_INFO } from '@/lib/data'

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
]

const TREATMENT_LINKS = [
  { href: '/services/dental-implants', label: 'Dental Implants', description: 'Implants and replacement care', iconText: 'DI', imageSrc: '/navbar/treatments/di.webp' },
  { href: '/services/root-canal-treatment', label: 'Root Canal Treatment', description: 'Pain relief and tooth preservation', iconText: 'RC', imageSrc: '/navbar/treatments/rc.webp' },
  { href: '/services/crowns-and-bridges', label: 'Crowns & Bridges', description: 'Restore strength and appearance', iconText: 'CB', imageSrc: '/navbar/treatments/cr.webp' },
  { href: '/services/braces-and-aligners', label: 'Braces & Aligners', description: 'Orthodontic smile correction', iconText: 'BA', imageSrc: '/navbar/treatments/br.webp' },
  { href: '/services/gum-treatments', label: 'Gum Treatments', description: 'Periodontal care and gum health', iconText: 'GT', imageSrc: '/navbar/treatments/gum.webp' },
  { href: '/services/kids-dentistry', label: 'Kids Dentistry', description: 'Child-friendly dental care', iconText: 'KD', imageSrc: '/navbar/treatments/pd.webp' },
  { href: '/services/dentures', label: 'Dentures', description: 'Comfortable tooth replacement options', iconText: 'DE', imageSrc: '/navbar/treatments/de.webp' },
  { href: '/services/cosmetic-dentistry', label: 'Cosmetic Dentistry', description: 'Smile enhancement treatments', iconText: 'CD', imageSrc: '/navbar/treatments/cs.webp' },
  { href: '/services/extractions', label: 'Extractions', description: 'Safe and careful tooth removal', iconText: 'EX', imageSrc: '/navbar/treatments/es.webp' },
  { href: '/services/oral-surgeries', label: 'Oral Surgeries', description: 'Advanced surgical dental care', iconText: 'OS', imageSrc: '/navbar/treatments/os.webp' },
  { href: '/services/preventive-dentistry', label: 'Preventive Dentistry', description: 'Regular maintenance and prevention', iconText: 'PD', imageSrc: '/navbar/treatments/pde.webp' },
  { href: '/services/doorstep-dentistry', label: 'Doorstep Dentistry', description: 'Dental care at your location', iconText: 'DD', imageSrc: '/navbar/treatments/ds.webp' },
]

const GALLERY_LINKS = [
  {
    href: '/gallery/before-after',
    label: 'Before / After Treatment',
    description: 'Smile transformation results',
  },
  {
    href: '/gallery/clinic',
    label: 'Clinic Gallery',
    description: 'Clinic rooms and interiors',
  },
]

function BrandMark({
  compact = false,
  homeHero = false,
}: {
  compact?: boolean
  homeHero?: boolean
}) {
  return (
    <div className={`flex items-center ${compact ? 'gap-2.5' : 'gap-3'} text-left`}>
      <div className={`relative flex-shrink-0 overflow-hidden rounded-full bg-white ${compact ? 'h-11 w-11' : 'h-14 w-14'}`}>
        <SiteImage
          src="/log.webp"
          alt="Dhanra Dental logo"
          width={64}
          height={64}
          priority
          className="h-full w-full object-contain"
        />
      </div>
      <div className="min-w-0">
        <div
          className={`font-black uppercase leading-none tracking-[0.22em] text-[#C62828] ${
            compact ? 'text-[1.15rem]' : 'text-[1.55rem] md:text-[1.7rem]'
          }`}
        >
          Dhanra
        </div>
        <div
          className={`mt-1 pt-1 font-semibold uppercase tracking-[0.18em] ${
            homeHero ? 'border-t border-white/30 text-white' : 'border-t border-[#0D3460]/18 text-[#0D3460]'
          } ${
            compact ? 'text-[0.5rem]' : 'text-[0.58rem] md:text-[0.64rem]'
          }`}
        >
          Dental Aesthetic & Implant Care
        </div>
      </div>
    </div>
  )
}

function TreatmentIcon({
  src,
  alt,
  fallback,
  compact = false,
}: {
  src?: string
  alt: string
  fallback: string
  compact?: boolean
}) {
  const [imageFailed, setImageFailed] = useState(false)
  const showImage = src && !imageFailed

  return (
    <div
      className={`relative flex flex-shrink-0 items-center justify-center overflow-hidden font-bold ${
        compact ? 'h-9 w-9 rounded-xl text-[11px]' : 'h-11 w-11 rounded-2xl text-xs'
      }`}
      style={{
        background: 'rgba(13,52,96,0.07)',
        color: '#1A4A8C',
        border: '1px solid rgba(13,52,96,0.1)',
      }}
    >
      {showImage ? (
        <SiteImage
          src={src}
          alt={alt}
          fill
          sizes={compact ? '36px' : '44px'}
          quality={74}
          className="object-cover"
          onError={() => setImageFailed(true)}
        />
      ) : null}
      <span className={showImage ? 'sr-only' : ''}>{fallback}</span>
    </div>
  )
}

export default function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [desktopMenu, setDesktopMenu] = useState<'treatments' | 'gallery' | null>(null)
  const [mobileSection, setMobileSection] = useState<'treatments' | 'gallery' | null>('treatments')
  const treatmentActive = pathname.startsWith('/services')
  const galleryActive = pathname.startsWith('/gallery')

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [open])

  useEffect(() => {
    setDesktopMenu(null)
    setOpen(false)
  }, [pathname])

  const isStaffPage = pathname === '/staff' || pathname === '/receptionist'

  if (isStaffPage) {
    return (
      <header className="sticky top-0 z-50 border-b border-neutral-100 bg-white/80 backdrop-blur-md">
        <nav className="flex h-24 w-full items-center justify-between px-4 md:px-6 xl:px-8">
          <Link href="/" className="flex items-center gap-4">
            <BrandMark compact />
            <span className="hidden sm:block text-[10px] font-bold tracking-widest text-neutral-400 uppercase border-l pl-4 border-neutral-200">
              Staff Portal
            </span>
          </Link>
          <Link href="/" className="text-xs font-bold uppercase tracking-wider text-[#0D3460] hover:underline">
            Exit to Website
          </Link>
        </nav>
      </header>
    )
  }

  return (
    <>
      <header className="sticky top-0 z-[90] w-full border-b border-neutral-100 bg-white/70 backdrop-blur-xl">
        <nav className="flex h-24 w-full items-center justify-between gap-6 px-4 md:px-6 xl:px-8">
          
          {/* LOGO AREA */}
          <Link href="/" className="relative z-[60] min-w-0 flex-shrink-0">
            <BrandMark />
          </Link>

          {/* DESKTOP NAV (Pill Style) */}
          <div className="hidden xl:flex items-center rounded-full border border-neutral-100 bg-neutral-50/50 p-1 shadow-sm">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  prefetch
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                    active ? 'bg-[#0D3460] text-white shadow-md' : 'text-neutral-500 hover:text-neutral-900'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}

            <div
              className="relative"
              onMouseEnter={() => setDesktopMenu('treatments')}
              onMouseLeave={() => setDesktopMenu((current) => (current === 'treatments' ? null : current))}
            >
              <Link
                href="/services"
                prefetch
                className={`inline-flex items-center gap-2 px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  treatmentActive ? 'bg-[#0D3460] text-white shadow-md' : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                Treatments
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-200 ${
                    desktopMenu === 'treatments' ? 'rotate-180' : ''
                  }`}
                />
              </Link>

              <div
                className={`absolute left-1/2 top-full z-[120] w-[64rem] max-w-[calc(100vw-3rem)] -translate-x-1/2 pt-3 transition-all duration-200 ${
                  desktopMenu === 'treatments'
                    ? 'pointer-events-auto opacity-100'
                    : 'pointer-events-none opacity-0'
                }`}
              >
                <div className="rounded-[1.6rem] border border-[#0D3460]/10 bg-white p-4 shadow-[0_24px_70px_rgba(7,27,43,0.14)]">
                  <div className="mb-3 px-2 text-[11px] font-bold uppercase tracking-[0.22em] text-[#1A4A8C]">
                    Our Expertise
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {TREATMENT_LINKS.map((link) => (
                      <Link
                        key={`${link.label}-${link.description}`}
                        href={link.href}
                        prefetch
                        onClick={() => setDesktopMenu(null)}
                        className="block rounded-[1.2rem] px-4 py-4 text-[#0D3460] transition-colors hover:bg-[#f4f7fb]"
                      >
                        <div className="flex items-start gap-3">
                          <TreatmentIcon
                            src={link.imageSrc}
                            alt={`${link.label} thumbnail`}
                            fallback={link.iconText}
                          />
                          <div>
                            <div className="text-sm font-semibold">{link.label}</div>
                            <div className="mt-1 text-xs text-neutral-500">{link.description}</div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div
              className="relative"
              onMouseEnter={() => setDesktopMenu('gallery')}
              onMouseLeave={() => setDesktopMenu((current) => (current === 'gallery' ? null : current))}
            >
              <Link
                href="/gallery/before-after"
                prefetch
                className={`inline-flex items-center gap-2 px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  galleryActive ? 'bg-[#0D3460] text-white shadow-md' : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                Gallery
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-200 ${
                    desktopMenu === 'gallery' ? 'rotate-180' : ''
                  }`}
                />
              </Link>

              <div
                className={`absolute left-1/2 top-full z-[120] w-80 -translate-x-1/2 pt-3 transition-all duration-200 ${
                  desktopMenu === 'gallery'
                    ? 'pointer-events-auto opacity-100'
                    : 'pointer-events-none opacity-0'
                }`}
              >
                <div className="rounded-[1.6rem] border border-[#0D3460]/10 bg-white p-3 shadow-[0_24px_70px_rgba(7,27,43,0.14)]">
                  {GALLERY_LINKS.map((link) => {
                    const active = pathname === link.href

                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        prefetch
                        onClick={() => setDesktopMenu(null)}
                        className={`block rounded-[1.2rem] px-4 py-4 transition-colors ${
                          active ? 'bg-[#0D3460] text-white' : 'text-[#0D3460] hover:bg-[#f4f7fb]'
                        }`}
                      >
                        <div className="text-sm font-semibold">{link.label}</div>
                        <div className={`mt-1 text-xs ${active ? 'text-white/75' : 'text-neutral-500'}`}>
                          {link.description}
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            </div>

            <Link
              href="/contact"
              prefetch
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                pathname === '/contact' ? 'bg-[#0D3460] text-white shadow-md' : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              Contact
            </Link>
          </div>

          {/* RIGHT SIDE ACTIONS */}
          <div className="flex items-center gap-4">
            <a
              href={`tel:+91${CLINIC_INFO.phone1}`}
              className="hidden whitespace-nowrap items-center gap-2 rounded-full border border-[#0D3460]/10 bg-[#0D3460]/5 px-4 py-2 text-[0.95rem] font-semibold text-[#0D3460] md:flex"
            >
              <Phone size={14} />
              <span>+91 {CLINIC_INFO.phone1}</span>
            </a>
             
            <WhatsAppAppointmentModal
              source="Navbar"
              buttonLabel="Book Appointment"
              buttonClassName="hidden lg:inline-flex items-center justify-center whitespace-nowrap rounded-full bg-[#0D3460] px-5 py-2.5 text-[0.82rem] font-bold text-white transition-all hover:bg-[#0a284a] shadow-lg shadow-blue-900/10"
            />

            {/* MOBILE HAMBURGER */}
            <button
              onClick={() => setOpen(!open)}
              className="relative z-[60] flex h-11 w-11 items-center justify-center rounded-full bg-neutral-900 text-white xl:hidden shadow-lg"
              aria-label="Toggle Menu"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>

      </header>
      {open ? (
        <div className="fixed inset-0 z-[999] overflow-y-auto bg-white xl:hidden">
          <div className="sticky top-0 z-[1000] flex h-24 items-center justify-between border-b border-[#0D3460]/12 bg-white px-6">
            <Link href="/" onClick={() => setOpen(false)} className="min-w-0 pr-3">
              <BrandMark compact />
            </Link>

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-neutral-900 text-white shadow-lg"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>

          <div className="min-h-[calc(100vh-6rem)] bg-white pb-8">
            <div className="border-t border-[#0D3460]/10">
              {[
                { href: '/', label: 'Home', active: pathname === '/' },
                { href: '/about', label: 'About Us', active: pathname === '/about' },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  prefetch
                  onClick={() => setOpen(false)}
                  className={`flex items-center justify-between border-b border-[#0D3460]/12 px-6 py-5 text-[1.15rem] font-medium ${
                    link.active ? 'bg-[#173f73] text-white' : 'bg-white text-[#102230]'
                  }`}
                >
                  <span>{link.label}</span>
                  {!link.active ? <ChevronRight size={22} className="text-[#05080c]" /> : null}
                </Link>
              ))}

              <div className="border-b border-[#0D3460]/12 bg-white">
                <button
                  type="button"
                  onClick={() => setMobileSection((current) => (current === 'treatments' ? null : 'treatments'))}
                  className={`flex w-full items-center justify-between px-6 py-5 text-left text-[1.15rem] font-medium ${
                    treatmentActive ? 'bg-[#173f73] text-white' : 'text-[#102230]'
                  }`}
                >
                  <span>Treatments</span>
                  <ChevronDown
                    size={22}
                    className={`transition-transform ${mobileSection === 'treatments' ? 'rotate-180' : ''} ${
                      treatmentActive ? 'text-white' : 'text-[#05080c]'
                    }`}
                  />
                </button>
                <div className={`${mobileSection === 'treatments' ? 'block' : 'hidden'} border-t border-[#0D3460]/8 bg-[#fbfcfe] px-6 py-4`}>
                  <div className="grid gap-2">
                    {TREATMENT_LINKS.map((link) => (
                      <Link
                        key={`${link.label}-${link.description}`}
                        href={link.href}
                        prefetch
                        onClick={() => setOpen(false)}
                        className="flex items-start gap-3 rounded-xl bg-white px-3 py-3 text-sm font-medium text-[#0D3460] shadow-sm ring-1 ring-[#0D3460]/6"
                      >
                        <TreatmentIcon
                          src={link.imageSrc}
                          alt={`${link.label} thumbnail`}
                          fallback={link.iconText}
                          compact
                        />
                        <div className="min-w-0">
                          <div>{link.label}</div>
                          <div className="mt-1 text-xs font-normal text-neutral-500">{link.description}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              <div className="border-b border-[#0D3460]/12 bg-white">
                <button
                  type="button"
                  onClick={() => setMobileSection((current) => (current === 'gallery' ? null : 'gallery'))}
                  className={`flex w-full items-center justify-between px-6 py-5 text-left text-[1.15rem] font-medium ${
                    galleryActive ? 'bg-[#173f73] text-white' : 'text-[#102230]'
                  }`}
                >
                  <span>Gallery</span>
                  <ChevronDown
                    size={22}
                    className={`transition-transform ${mobileSection === 'gallery' ? 'rotate-180' : ''} ${
                      galleryActive ? 'text-white' : 'text-[#05080c]'
                    }`}
                  />
                </button>
                <div className={`${mobileSection === 'gallery' ? 'block' : 'hidden'} border-t border-[#0D3460]/8 bg-[#fbfcfe] px-6 py-4`}>
                  <div className="grid gap-2">
                    {GALLERY_LINKS.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        prefetch
                        onClick={() => setOpen(false)}
                        className={`group rounded-[1.3rem] border px-4 py-4 transition-all ${
                          pathname === link.href
                            ? 'border-[#05080c] bg-[#05080c] text-white shadow-[0_12px_24px_rgba(5,8,12,0.18)]'
                            : 'border-[#0D3460]/10 bg-[linear-gradient(135deg,#ffffff_0%,#f6f9fd_100%)] text-[#102230] shadow-[0_10px_24px_rgba(13,52,96,0.06)]'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <div className="text-[0.98rem] font-semibold tracking-[-0.02em]">
                              {link.label}
                            </div>
                            <div className={`mt-1 text-xs ${
                              pathname === link.href ? 'text-white/70' : 'text-[#5d7180]'
                            }`}>
                              {link.description}
                            </div>
                          </div>
                          <span
                            className={`inline-flex h-10 w-10 items-center justify-center rounded-full transition ${
                              pathname === link.href
                                ? 'bg-white/10 text-white'
                                : 'bg-[#eaf2fb] text-[#1A4A8C] group-hover:bg-[#dfeaf8]'
                            }`}
                          >
                            <ChevronRight size={18} />
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              <Link
                href="/contact"
                prefetch
                onClick={() => setOpen(false)}
                className={`flex items-center justify-between border-b border-[#0D3460]/12 px-6 py-5 text-[1.15rem] font-medium ${
                  pathname === '/contact' ? 'bg-[#173f73] text-white' : 'bg-white text-[#102230]'
                }`}
              >
                <span>Contact Us</span>
                {pathname !== '/contact' ? <ChevronRight size={22} className="text-[#05080c]" /> : null}
              </Link>
            </div>

            <div className="mx-6 mt-8 rounded-2xl border border-[#0D3460]/20 bg-[#f7f9fc] p-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#1A4A8C]">
                Call For Appointment
              </p>
              <a
                href={`tel:+91${CLINIC_INFO.phone1}`}
                className="mt-3 flex items-center gap-3 text-base font-semibold text-[#0D3460]"
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#0D3460]/15 bg-white">
                  <Phone size={15} />
                </span>
                +91 {CLINIC_INFO.phone1}
              </a>

              <WhatsAppAppointmentModal
                source="Mobile Menu"
                buttonLabel="Book Appointment"
                buttonClassName="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-[#0D3460] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1A4A8C]"
              />
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
