'use client'

import React from 'react'
import Link from 'next/link'
import { 
  Phone, Instagram, Facebook, MessageCircle,
  ArrowUpRight, MapPin
} from 'lucide-react'
import SiteImage from '@/components/SiteImage'
import WhatsAppAppointmentModal from '@/components/WhatsAppAppointmentModal'

export default function ZenithFooter() {
  const currentYear = new Date().getFullYear();
  const socialLinks = [
    {
      name: 'Instagram',
      href: 'https://www.instagram.com/dhanradental?igsh=MTJiNHFoanA1a3dubg==',
      icon: Instagram,
    },
    {
      name: 'Facebook',
      href: '#',
      icon: Facebook,
    },
    {
      name: 'WhatsApp',
      href: 'https://wa.me/918121288804',
      icon: MessageCircle,
    },
  ]

  return (
    <footer className="relative overflow-hidden bg-[#030406] pt-20 text-white">
      
      {/* --- 1. PRE-FOOTER CTA (THE BRIDGE) --- */}
      <div className="relative z-10 w-full px-4 pb-24 md:px-6 xl:px-8">
        <div className="group relative overflow-hidden rounded-[40px] bg-[#FAF9F6] p-12 text-[#041018] md:p-20">
          <div className="absolute -right-20 -top-20 hidden text-[15vw] font-black uppercase tracking-tighter opacity-[0.03] lg:block">
           DHANRA
          </div>
          
          <div className="relative z-10 grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="text-5xl font-bold tracking-tighter md:text-7xl">
                Ready for your <br />
                <span className="text-[#0F2F56] italic font-serif leading-none">Aesthetic?</span>
              </h2>
              <p className="mt-6 max-w-sm text-lg text-gray-500">
                Join the elite circle of patients experiencing the future of dental artistry in Vijayawada.
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row lg:justify-end">
              <WhatsAppAppointmentModal
                source="Footer CTA"
                buttonLabel="Book Consultation"
                panelTitle="Book Appointment"
                panelDescription="Enter your details and continue with the appointment request."
                buttonClassName="inline-flex items-center justify-center gap-3 rounded-full bg-[#041018] px-10 py-5 text-sm font-bold text-white transition-all hover:scale-105 hover:bg-[#0F2F56]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* --- 2. BACKGROUND MARQUEE --- */}
      <div className="pointer-events-none absolute top-1/2 left-0 w-full overflow-hidden opacity-[0.02] select-none translate-y-20">
        <div className="flex whitespace-nowrap text-[18vw] font-black uppercase tracking-tighter leading-none animate-marquee">
          <span>DHANRA DENTAL • EXPERT CARE • HAPPY SMILES •&nbsp;</span>
          <span>DHANRA DENTAL • EXPERT CARE • HAPPY SMILES •&nbsp;</span>
        </div>
      </div>

      <div className="relative z-10 w-full px-4 md:px-6 xl:px-8">
        
        {/* --- 3. THE INFO GRID --- */}
        <div className="grid grid-cols-1 gap-16 border-t border-white/10 pt-20 pb-20 lg:grid-cols-12">
          
          {/* Column 1: Identity & Updated Address */}
          <div className="lg:col-span-4 space-y-8">
            <div className="flex items-center gap-5">
              <div className="h-16 w-16 overflow-hidden rounded-2xl bg-white p-2">
                <SiteImage src="/log.webp" alt="Dhanra Logo" width={64} height={64} className="object-contain" />
              </div>
              <div>
                <h3 className="text-2xl font-bold uppercase tracking-tighter">Dhanra Dental</h3>
                <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-[#d9c7aa]">Clinical Discipline</p>
              </div>
            </div>
            
            <div className="space-y-5">
              <div className="flex items-start gap-4 text-gray-400 group">
                <MapPin size={20} className="text-[#d9c7aa] mt-1 flex-shrink-0" />
                <span className="text-sm font-medium leading-relaxed">
                  Elite Plaza, Door no.12-260/3, <br />
                  Innhotel backside, flyover down ring, <br />
                  Ramavarapadu, Vijayawada, AP 521108
                </span>
              </div>
              <a href="tel:+918121288804" className="flex items-center gap-4 text-gray-400 hover:text-white transition-all">
                <Phone size={18} className="text-[#d9c7aa]" />
                <span className="text-sm font-medium">+91 8121288804</span>
              </a>
            </div>
          </div>

          {/* Column 2: Synchronized Treatments & Navigation */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-8">
            <div>
              <h4 className="mb-8 text-[10px] font-bold uppercase tracking-[0.3em] text-gray-600">Our Expertise</h4>
              <ul className="space-y-4">
                {[
                  'Dental Implants', 
                  'Braces & Aligners', 
                  'Oral Surgeries', 
                  'Cosmetic Dentistry', 
                  'Doorstep Dentistry'
                ].map((item) => (
                  <li key={item}>
                    <Link href="/treatments" className="text-sm font-semibold text-gray-400 hover:text-[#d9c7aa] transition-colors">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="mb-8 text-[10px] font-bold uppercase tracking-[0.3em] text-gray-600">Navigate</h4>
              <ul className="space-y-4">
                {[
                  { name: 'Home', path: '/' },
                  { name: 'About Us', path: '/about' },
                  { name: 'Treatments', path: '/treatments' },
                  { name: 'Gallery', path: '/gallery' },
                  { name: 'Contact', path: '/contact' }
                ].map((link) => (
                  <li key={link.name}>
                    <Link href={link.path} className="text-sm font-semibold text-gray-400 hover:text-white transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Column 3: Social Architecture */}
          <div className="lg:col-span-3 flex flex-col items-start lg:items-end">
            <h4 className="mb-8 text-[10px] font-bold uppercase tracking-[0.3em] text-gray-600">Social Architecture</h4>
            <div className="flex gap-3">
              {socialLinks.map(({ name, href, icon: Icon }) => (
                <a
                  key={name}
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel={href.startsWith('http') ? 'noreferrer' : undefined}
                  aria-label={name}
                  className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/5 bg-white/5 hover:bg-[#d9c7aa] hover:text-[#041018] transition-all"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
            <div className="mt-12 text-left lg:text-right">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-700">Clinical Hours</p>
                <p className="text-base font-bold text-gray-400">09:00 AM — 09:00 PM</p>
            </div>
          </div>
        </div>

        {/* --- 4. SIGNATURE STRIP --- */}
        <div className="flex flex-col items-center justify-between gap-8 border-t border-white/5 py-12 md:flex-row">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-600">
            © {currentYear} Dhanra Dental Care • All Rights Reserved.
          </p>

          <div className="flex items-center gap-6">
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500">Architected By</span>
            <a 
              href="https://pandjtechnologies.com" 
              target="_blank"
              className="flex items-center gap-2 group transition-all"
            >
              <SiteImage src="/logo.webp" alt="P&J" width={18} height={18} />
              <span className="text-xs font-black italic tracking-tighter text-white group-hover:text-[#d9c7aa]">P&J TECHNOLOGIES</span>
            </a>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          width: fit-content;
          animation: marquee 40s linear infinite;
        }
      `}</style>
    </footer>
  )
}
