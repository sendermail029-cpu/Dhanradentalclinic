'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Phone, MapPin, Clock, MessageCircle, 
  Send, CheckCircle, Mail, ArrowRight,
  Globe, ShieldCheck, Sparkles
} from 'lucide-react'
import { CLINIC_INFO, SERVICES } from '@/lib/data'
import { APPOINTMENT_WHATSAPP_NUMBER, buildWhatsAppUrl } from '@/lib/whatsapp'
import SiteImage from '@/components/SiteImage'

// Professional Animation Variants
const fader = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.8, ease: [0.19, 1, 0.22, 1] }
}

export default function PremiumContactPage() {
  const [form, setForm] = useState({ name: '', mobile: '', service: '', message: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)

  function validate() {
    const e: Record<string, string> = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.mobile.trim()) e.mobile = 'Mobile number is required'
    else if (!/^\d{10}$/.test(form.mobile.replace(/\s/g, ''))) e.mobile = 'Enter a valid 10-digit number'
    return e
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setErrors({})
    const url = buildWhatsAppUrl([
      'New Contact Form Submission',
      'Source: Contact Us Page',
      `Name: ${form.name.trim()}`,
      `Mobile Number: ${form.mobile.trim()}`,
      form.service ? `Treatment: ${form.service}` : undefined,
      form.message.trim() ? `Message: ${form.message.trim()}` : undefined,
    ])
    setSubmitted(true)
    setForm({ name: '', mobile: '', service: '', message: '' })
    setTimeout(() => setSubmitted(false), 5000)
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <main className="min-h-screen bg-[#FAF9F6] selection:bg-[#0D3460]/10">
      
      {/* --- 1. UNIFIED HERO SECTION (Matched to About Us) --- */}
      <section className="relative h-[300px] w-full overflow-hidden md:h-[380px]">
        <div className="absolute inset-0 scale-105">
          <SiteImage
            src="/contact.webp"
            alt="Contact Dhanra Dental"
            fill
            priority
            className="object-cover object-center"
          />
        </div>
        <div className="absolute inset-0 bg-[#041018]/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#041018] via-[#041018]/40 to-black/10" />

        <div className="relative z-10 flex h-full items-center px-4 md:px-6 xl:px-8">
          <div className="w-full">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-xl pt-16 md:pt-20"
            >
              <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.28em] text-white/70">
                Direct Inquiry
              </p>
              <h1 className="text-[2.6rem] font-semibold leading-tight tracking-tight text-white md:text-[4.2rem]">
                Contact Us
              </h1>
              <p className="mt-3 max-w-md text-sm leading-6 text-white/75 md:text-[15px]">
                Connect with our clinical coordinators for priority appointments and treatment guidance.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- 2. MARQUEE STRIP --- */}
      <section className="relative border-b border-black/5 bg-white py-4 overflow-hidden">
        <div className="flex w-full overflow-hidden select-none opacity-[0.3]">
          <motion.div 
            className="flex whitespace-nowrap text-[0.85rem] font-bold uppercase tracking-[0.35em] text-[#0D3460]"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ ease: "linear", duration: 25, repeat: Infinity }}
          >
            {[1, 2, 3, 4].map((i) => (
              <span key={i} className="flex-shrink-0 px-12 italic">
                PIONEERING CARE • ELITE PLAZA • RAMAVARAPADU • DHANRA DENTAL •
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* --- 3. INTERACTIVE INTERFACE --- */}
      <section className="relative z-20 py-20 md:py-32">
        <div className="w-full px-4 md:px-6 xl:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            
            {/* LEFT: CORPORATE INFO */}
            <div className="lg:col-span-5 space-y-10">
              <motion.div {...fader}>
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#0D3460]/60 mb-4 block">01. Direct Access</span>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-[#041018] mb-8 leading-none">
                  Global Standards, <br />
                  <span className="text-[#0D3460] italic font-serif">Local Presence.</span>
                </h2>
                
                <div className="space-y-8">
                  <div className="flex gap-6 group">
                    <div className="h-12 w-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-[#0D3460] group-hover:bg-[#0D3460] group-hover:text-white transition-all duration-500">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-2">Location</h4>
                      <p className="text-sm font-medium text-neutral-800 leading-relaxed">
                        Elite Plaza, Door no.12-260/3,<br />
                        Innhotel backside, flyover down ring,<br />
                        Ramavarapadu, Vijayawada, AP 521108
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-6 group">
                    <div className="h-12 w-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-[#0D3460] group-hover:bg-[#0D3460] group-hover:text-white transition-all duration-500">
                      <Phone size={20} />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-2">Inquiry</h4>
                      <p className="text-lg font-bold text-neutral-800 tracking-tight">+91 91337 43734</p>
                       <p className="text-lg font-bold text-neutral-800 tracking-tight">+91 81212 88804</p>
                      <p className="text-sm text-neutral-500 mt-1">dhanradental@gmail.com</p>
                    </div>
                  </div>

                  <div className="flex gap-6 group">
                    <div className="h-12 w-12 rounded-2xl bg-[#0D3460] flex items-center justify-center text-white shadow-lg">
                      <Clock size={20} />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-2">Clinical Hours</h4>
                      <p className="text-sm font-bold text-neutral-800">Monday — Sunday</p>
                      <p className="text-sm text-neutral-500">09:00 AM — 09:00 PM</p>
                    </div>
                  </div>
                </div>

                {/* Priority WhatsApp */}
                <a 
                  href={`https://wa.me/${APPOINTMENT_WHATSAPP_NUMBER}`}
                  className="mt-12 flex items-center justify-between w-full p-6 rounded-[24px] bg-[#25D366] text-white hover:shadow-2xl hover:shadow-[#25D366]/20 transition-all duration-500 group"
                >
                  <div className="flex items-center gap-4">
                    <MessageCircle size={24} fill="white" />
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">Instant Response</p>
                      <p className="font-bold text-lg leading-none mt-1">Priority WhatsApp Care</p>
                    </div>
                  </div>
                  <ArrowRight size={22} className="group-hover:translate-x-2 transition-transform" />
                </a>
              </motion.div>

              {/* Safety Badge */}
              <motion.div 
                {...fader}
                className="p-8 rounded-[32px] bg-[#0D3460] text-white relative overflow-hidden"
              >
                <ShieldCheck className="absolute -right-6 -bottom-6 text-white/10" size={120} />
                <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
                  <Sparkles size={20} className="text-[#8FB3E0]" />
                  Patient Safety First
                </h3>
                <p className="text-sm text-white/60 leading-relaxed relative z-10">
                  We maintain hospital-grade sterilization and infection control protocols to ensure a safe clinical environment for every visit.
                </p>
              </motion.div>
            </div>

            {/* RIGHT: INQUIRY FORM */}
            <div className="lg:col-span-7">
              <motion.div 
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-white p-8 md:p-16 rounded-[48px] shadow-[0_40px_100px_rgba(0,0,0,0.06)] border border-neutral-100"
              >
                <div className="mb-12">
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#0D3460]/60 mb-4 block">02. Appointment</span>
                  <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-neutral-900 leading-none">Schedule a Consultation</h2>
                    <p className="mt-4 text-neutral-500">Fill in your details and your message will open directly on WhatsApp for instant submission.</p>
                </div>

                {submitted && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mb-10 p-5 bg-emerald-50 border border-emerald-100 rounded-3xl flex items-center gap-4 text-emerald-700"
                  >
                    <CheckCircle size={24} />
                    <p className="text-sm font-bold uppercase tracking-widest">Inquiry Received Successfully.</p>
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-400 ml-1">Full Name</label>
                      <input 
                        type="text"
                        required
                        className="w-full bg-neutral-50 border-0 rounded-2xl px-6 py-5 text-neutral-900 focus:ring-2 focus:ring-[#0D3460]/10 transition-all outline-none"
                        placeholder="e.g. Rahul Sharma"
                        value={form.name}
                        onChange={e => setForm({...form, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-400 ml-1">Mobile Number</label>
                      <input 
                        type="tel"
                        required
                        className="w-full bg-neutral-50 border-0 rounded-2xl px-6 py-5 text-neutral-900 focus:ring-2 focus:ring-[#0D3460]/10 transition-all outline-none"
                        placeholder="10-digit number"
                        value={form.mobile}
                        onChange={e => setForm({...form, mobile: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-400 ml-1">Service Required</label>
                    <select 
                      className="w-full bg-neutral-50 border-0 rounded-2xl px-6 py-5 text-neutral-900 focus:ring-2 focus:ring-[#0D3460]/10 transition-all outline-none appearance-none cursor-pointer"
                      value={form.service}
                      onChange={e => setForm({...form, service: e.target.value})}
                    >
                      <option value="">Select a treatment</option>
                      {SERVICES.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
                      <option value="Doorstep Care">Doorstep Care (Home Visit)</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-400 ml-1">Additional Notes</label>
                    <textarea 
                      rows={4}
                      className="w-full bg-neutral-50 border-0 rounded-3xl px-6 py-5 text-neutral-900 focus:ring-2 focus:ring-[#0D3460]/10 transition-all outline-none resize-none"
                      placeholder="Describe your concern briefly..."
                      value={form.message}
                      onChange={e => setForm({...form, message: e.target.value})}
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-6 rounded-full bg-[#0D3460] text-white font-bold text-lg hover:shadow-2xl hover:shadow-[#0D3460]/30 transition-all duration-500 flex items-center justify-center gap-4 group"
                  >
                    Send on WhatsApp
                    <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                  </button>
                </form>
              </motion.div>
            </div>
          </div>
        </div>

        {/* --- 4. MAP SECTION (ULTRA CLEAN) --- */}
        <div className="mt-20 w-full px-4 md:px-6 xl:px-8">
          <motion.div 
            {...fader}
            className="rounded-[48px] overflow-hidden shadow-2xl border-[12px] border-white ring-1 ring-neutral-100"
          >
            <iframe
              title="Dhanra Dental Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3825.295240562637!2d80.6698183!3d16.5111957!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a35fbc08876c11b%3A0xc3c9f289d0b64d1f!2sDhanra%20Dental%20Care!5e0!3m2!1sen!2sin!4v1711200000000!5m2!1sen!2sin"
              className="h-[450px] w-full grayscale-[0.3] hover:grayscale-0 transition-all duration-1000"
              loading="lazy"
            />
          </motion.div>
        </div>
      </section>

    </main>
  )
}
