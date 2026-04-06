'use client'

import React from 'react'
import { motion } from 'framer-motion'
import SiteImage from '@/components/SiteImage'
import GalleryGrid from '@/app/gallery/GalleryGrid'
import { type GalleryImageItem } from '@/app/gallery/_components'

// Note: Metadata must be moved to a separate layout.tsx or parent Server Component 
// if using 'use client' in Next.js 13+. 

const treatmentGalleryItems: GalleryImageItem[] = [
  {
    title: 'Composite Filling',
    subtitle: 'Natural restoration that blends damaged enamel back into a clean and comfortable finish.',
    image: '/cb.webp',
  },
  {
    title: 'Smile Veneers',
    subtitle: 'Sharper symmetry, improved shade balance, and a more refined visible smile line.',
    image: '/smile.webp',
  },
  {
    title: 'Ceramic Crowns',
    subtitle: 'Functional rebuilding for weakened teeth with stronger structure and improved appearance.',
    image: '/cr.webp',
  },
  {
    title: 'Diastema Closure',
    subtitle: 'Front tooth gap correction designed for balanced spacing and a more confident smile.',
    image: '/di.webp',
  },
  {
    title: 'Implant Restoration',
    subtitle: 'Missing tooth replacement planned to restore bite support and visual continuity.',
    image: '/ir.webp',
  },
  {
    title: 'Whitening Care',
    subtitle: 'Visible brightness improvement with a cleaner, fresher overall shade presentation.',
    image: '/wh.webp',
  },
  {
    title: 'Partial Dentures',
    subtitle: 'Restored chewing support and smile completeness for multiple missing teeth.',
    image: '/pd.webp',
  },
  {
    title: 'Full Dentures',
    subtitle: 'Complete rehabilitation focused on fit, facial support, and day-to-day function.',
    image: '/fd.webp',
  },
]

export default function BeforeAfterGalleryPage() {
  return (
    <main className="bg-[#041018] text-white overflow-x-hidden">
      
      {/* --- 1. HERO SECTION (MATCHED TO ABOUT US) --- */}
      <section className="relative h-[300px] w-full overflow-hidden md:h-[380px]">
        {/* Fixed Container for fill property */}
        <div className="absolute inset-0">
          <SiteImage
            src="/about1.webp"
            alt="Before and after gallery hero"
            fill
            priority
            sizes="100vw"
            className="scale-105 object-cover object-[58%_20%] md:object-[56%_18%] lg:object-[54%_16%]"
          />
        </div>
        
        {/* Premium Overlays */}
        <div className="absolute inset-0 bg-[#041018]/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#041018] via-[#041018]/40 to-black/10" />

        <div className="relative z-10 flex h-full items-center">
          <div className="mx-auto w-full max-w-7xl px-6 md:px-10">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-xl pt-16 md:pt-20"
            >
              {/* Identity Line */}
              <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.28em] text-white/70">
                Dhanra Dental Hospital
              </p>

              {/* Main Heading */}
              <h1 className="text-[2.6rem] font-semibold leading-tight tracking-tight text-white md:text-[4.2rem]">
                Before / After
              </h1>

              {/* Subtext */}
              <p className="mt-3 max-w-md text-sm leading-6 text-white/75 md:text-[15px]">
                Visible smile improvements, restorative changes, and aesthetic treatment results presented with a patient-first clinical approach.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- 2. MARQUEE STRIP --- */}
      <section className="relative border-b border-white/5 bg-[#041018] py-4">
        <div className="flex w-full overflow-hidden select-none opacity-[0.25]">
          <motion.div 
            className="flex whitespace-nowrap text-[0.85rem] font-bold uppercase tracking-[0.35em] text-[#8FB3E0]"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ ease: "linear", duration: 30, repeat: Infinity }}
          >
            {[1, 2, 3, 4].map((i) => (
              <span key={i} className="flex-shrink-0 px-12">
                TRANSFORMING SMILES • CLINICAL EXCELLENCE • AESTHETIC RESULTS • DHANRA DENTAL •
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* --- 3. GALLERY GRID --- */}
      <section className="bg-white py-12 md:py-20">
         <GalleryGrid items={treatmentGalleryItems} variant="before-after" />
      </section>

    </main>
  )
}
