import type { Metadata } from 'next'
import SiteImage from '@/components/SiteImage'
import GalleryGrid from '@/app/gallery/GalleryGrid'
import AppointmentInlineForm from '@/components/AppointmentInlineForm'
import { type GalleryImageItem } from '@/app/gallery/_components'

export const metadata: Metadata = {
  title: 'Clinic Gallery',
  description: 'Browse clinic interiors, treatment spaces, and atmosphere at Dhanra Dental.',
}

const clinicGalleryItems: GalleryImageItem[] = [
  {
    title: 'Reception Experience',
    subtitle: '',
    image: '/clinicgal (6).webp',
    badge: 'Front Desk',
    heightClass: 'aspect-[4/5.3]',
  },
  {
    title: 'Specialist Consultation',
    subtitle: '',
    image: '/clinicgal (2).webp',
    badge: 'Consultation',
    heightClass: 'aspect-[4/3]',
  },
  {
    title: 'Clinical Ambience',
    subtitle: '',
    image: '/clinicgal (3).webp',
    badge: 'Clinic Interior',
    heightClass: 'aspect-[4/4.7]',
  },
  {
    title: 'Treatment Bay',
    subtitle: '',
    image: '/clinicgal (4).webp',
    badge: 'Treatment Room',
    heightClass: 'aspect-[4/5.6]',
  },
  {
    title: 'Doctor Interaction',
    subtitle: '',
    image: '/clinicgal (5).webp',
    badge: 'Patient Care',
    heightClass: 'aspect-[4/3.4]',
  },
  {
    title: 'Brand Identity',
    subtitle: '',
    image: '/clinicgal (1).webp',
    badge: 'Identity',
    heightClass: 'aspect-[4/4.1]',
  },
  {
    title: 'Waiting Lounge',
    subtitle: '',
    image: '/clinicgal (7).webp',
    badge: 'Patient Lounge',
    heightClass: 'aspect-[4/5.1]',
  },
  {
    title: 'Sterile Workflow',
    subtitle: 'Structured work areas that support hygiene, consistency, and clinical discipline.',
    image: '/ab.webp',
    badge: 'Sterilization',
    heightClass: 'aspect-[4/3.1]',
  },
  {
    title: 'Advanced Care Setup',
    subtitle: 'Dedicated treatment infrastructure built to support restorative and aesthetic dentistry.',
    image: '/exterior.webp',
    badge: 'Advanced Care',
    heightClass: 'aspect-[4/5.4]',
  },
   {
    title: 'Advanced Care Setup',
    subtitle: 'Dedicated treatment infrastructure built to support restorative and aesthetic dentistry.',
    image: '/door.webp',
    badge: 'Advanced Care',
    heightClass: 'aspect-[4/5.4]',
  },
     {
    title: 'Advanced Care Setup',
    subtitle: 'Dedicated treatment infrastructure built to support restorative and aesthetic dentistry.',
    image: '/st.webp',
    badge: 'Advanced Care',
    heightClass: 'aspect-[4/5.4]',
  },
]

export default function ClinicGalleryPage() {
  return (
    <>
      <section className="relative h-[300px] w-full overflow-hidden md:h-[380px]">
        <div className="absolute inset-0">
          <SiteImage
            src="/about3.webp"
            alt="Clinical gallery hero"
            fill
            sizes="100vw"
            className="scale-105 object-cover object-center"
          />
        </div>
        <div className="absolute inset-0 bg-[#041018]/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#041018] via-[#041018]/40 to-black/10" />

        <div className="relative z-10 flex h-full items-center">
          <div className="w-full px-4 md:px-6 xl:px-8">
            <div className="max-w-xl pt-16 md:pt-20">
              <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.28em] text-[#C62828]">
                Dhanra Dental Hospital
              </p>
              <h1 className="text-[2.6rem] font-semibold leading-tight tracking-tight text-white md:text-[4.2rem]">
                Clinical Gallery
              </h1>
              <p className="mt-3 max-w-md text-sm leading-6 text-white/75 md:text-[15px]">
                A closer look at the spaces, ambience, treatment areas, and patient environment inside Dhanra Dental Hospital.
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
                CLINICAL ENVIRONMENT / MODERN INTERIORS / PATIENT SPACES / DHANRA DENTAL HOSPITAL /
              </span>
            ))}
          </div>
        </div>
      </section>

      <GalleryGrid items={clinicGalleryItems} variant="clinic" />
      <AppointmentInlineForm source="Clinical Gallery" />
    </>
  )
}
