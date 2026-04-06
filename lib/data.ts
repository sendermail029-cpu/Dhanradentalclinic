import type {
  ServiceItem,
  Testimonial,
  FAQItem,
  GalleryItem,
  Doctor,
  ClinicValue,
} from '@/types'

export const CLINIC_INFO = {
  name: 'Dhanra Dental Aesthetic & Implant Care',
  shortName: 'Dhanra Dental',
  phone1: '9133743734',
  phone2: '8121288804',
  whatsapp: '919133743734',
  email: 'Dhanradental@gmail.com',
  instagram: '@dhanradental',
  address: 'Door no.12-260/3 Elite Plaza, Ramavarapadu, Vijayawada',
  addressFull:
    'Innhotel backside, flyover down ring, Door no.12-260/3 Elite Plaza, Ramavarapadu, Vijayawada, Andhra Pradesh 521108',
  mapUrl:
    'https://www.google.com/maps/place/Dhanra+Dental+Aesthetic+%26+Implant+care/@16.5297338,80.6766578,19.05z/data=!4m6!3m5!1s0x3a35e5d56fb3ece5:0x63c34ad97f4c45e9!8m2!3d16.5295357!4d80.6767216!16s%2Fg%2F11yhrmgzwy?entry=ttu&g_ep=EgoyMDI2MDMxOC4xIKXMDSoASAFQAw%3D%3D',
  mapEmbedUrl:
    'https://www.google.com/maps?q=16.5297338,80.6766578&z=19&output=embed',
  timings: 'Mon–Sat: 9 AM – 8 PM | Sunday: 10 AM – 4 PM',
  tagline: 'Your Smile. Perfected.',
  established: '2012',
} as const

export const SERVICES: ServiceItem[] = [
  {
    name: 'Scaling (Teeth Cleaning)',
    description: 'Professional scaling and polishing to remove plaque, tartar, and stains while supporting healthier gums.',
    details: [
      'Deep cleaning to remove plaque and tartar deposits',
      'Polishing for a fresher, brighter smile',
      'Recommended for bad breath, bleeding gums, and regular maintenance',
    ],
    icon: 'Zap',
    homeVisit: true,
    category: 'preventive',
  },
  {
    name: 'Root Canal Treatment (RCT)',
    description: 'Pain-relieving treatment to save infected or damaged teeth with modern endodontic care.',
    details: [
      'Removes infection from inside the tooth',
      'Helps preserve your natural tooth structure',
      'Performed with patient comfort and precision in mind',
    ],
    icon: 'Activity',
    homeVisit: false,
    category: 'restorative',
  },
  {
    name: 'Fillings (Cement Filling)',
    description: 'Tooth-colored fillings to restore cavities, repair minor damage, and protect teeth from further decay.',
    details: [
      'Suitable for cavities, chipped areas, and worn surfaces',
      'Blends naturally with your tooth shade',
      'Quick restorative solution for daily comfort and function',
    ],
    icon: 'Circle',
    homeVisit: true,
    category: 'restorative',
  },
  {
    name: 'Gum Treatments',
    description: 'Comprehensive gum care to manage bleeding gums, infection, swelling, and periodontal concerns.',
    details: [
      'Evaluation and treatment for gum inflammation and disease',
      'Helps reduce bleeding, sensitivity, and gum recession risk',
      'Can be combined with scaling and maintenance plans',
    ],
    icon: 'Shield',
    homeVisit: true,
    category: 'preventive',
  },
  {
    name: 'Orthodontics',
    description: 'Alignment solutions using metal clips, ceramic clips, and invisible aligners for straighter teeth.',
    details: [
      'Metal braces for reliable full-case correction',
      'Ceramic braces for a more discreet look',
      'Invisible aligner options for modern lifestyle-friendly treatment',
    ],
    icon: 'GitBranch',
    homeVisit: false,
    category: 'orthodontic',
  },
  {
    name: 'Oral & Maxillofacial Surgery',
    description: 'Advanced surgical care for extractions, impacted teeth, alveoloplasty, jaw concerns, and facial swelling.',
    details: [
      'Impacted tooth removal and complex extractions',
      'Jaw-related problem assessment and surgical support',
      'Managed with clinical planning, safety, and post-op guidance',
    ],
    icon: 'Scissors',
    homeVisit: false,
    category: 'surgical',
  },
  {
    name: 'Prosthodontics',
    description: 'Replacement and restoration of teeth using dentures, bridges, and crowns for function and appearance.',
    details: [
      'Fixed and removable options based on your needs',
      'Restores chewing comfort, speech, and smile aesthetics',
      'Includes crowns, bridges, and denture planning',
    ],
    icon: 'Crown',
    homeVisit: true,
    category: 'restorative',
  },
  {
    name: 'Pediatric Dentistry',
    description: 'Gentle dental care for children in a welcoming, calm environment focused on prevention and comfort.',
    details: [
      'Child-friendly dental checkups and preventive care',
      'Support for milk teeth, cavities, and oral hygiene habits',
      'Focused on reducing fear and creating positive dental experiences',
    ],
    icon: 'Heart',
    homeVisit: false,
    category: 'pediatric',
  },
  {
    name: 'Dental Implants',
    description: 'Permanent tooth replacement solutions that restore confidence, bite strength, and natural appearance.',
    details: [
      'Artificial replacement for missing teeth',
      'Long-term restorative option with natural-looking results',
      'Planned carefully for aesthetics, bone support, and function',
    ],
    icon: 'Anchor',
    homeVisit: false,
    category: 'surgical',
  },
  {
    name: 'Cosmetic Dentistry',
    description: 'Aesthetic dental treatments that improve smile harmony, brightness, and confidence.',
    details: [
      'Includes smile enhancement and cosmetic planning',
      'Ideal for stains, uneven shape, and aesthetic corrections',
      'Customized to suit your facial features and smile goals',
    ],
    icon: 'Smile',
    homeVisit: false,
    category: 'aesthetic',
  },
  {
    name: 'Veneers',
    description: 'Aesthetic ceramic or composite veneer solutions for refined smile correction and improved tooth appearance.',
    details: [
      'Used for shape correction, spacing, and discoloration',
      'Designed for a natural, refined smile makeover',
      'Often chosen as part of aesthetic smile correction',
    ],
    icon: 'Layers',
    homeVisit: false,
    category: 'aesthetic',
  },
  {
    name: 'Diabetic Dental Care',
    description: 'Dental care planning tailored for diabetic patients with added focus on healing, gums, and infection control.',
    details: [
      'Extra attention to gum health and oral infections',
      'Treatment planning aligned with medical history and healing concerns',
      'Helpful for patients needing safer preventive and restorative care',
    ],
    icon: 'Shield',
    homeVisit: true,
    category: 'specialty',
  },
  {
    name: 'Laser Treatments',
    description: 'Minimally invasive laser-assisted dental procedures designed for comfort and precision.',
    details: [
      'Useful for selected soft tissue and painless dentistry needs',
      'Often reduces bleeding and improves precision',
      'Supports a gentler treatment experience where indicated',
    ],
    icon: 'Sparkles',
    homeVisit: false,
    category: 'specialty',
  },
  {
    name: 'Emergency Dental Care',
    description: 'Urgent dental support for pain, swelling, broken teeth, sudden infection, and other immediate concerns.',
    details: [
      'Fast attention for severe pain and dental emergencies',
      'Assessment for swelling, trauma, and infection-related issues',
      'Focused on quick relief and stabilizing the next treatment step',
    ],
    icon: 'Activity',
    homeVisit: true,
    category: 'specialty',
  },
  {
    name: 'Doorstep Dentistry',
    description: 'Dental care and treatment delivered at your home with a professional mobile setup and experienced doctors.',
    details: [
      'Digital X-rays, examination, and customized treatment planning',
      'Convenient for elderly patients, busy families, and home care needs',
      'Immediate treatments can be performed where clinically appropriate',
    ],
    icon: 'Home',
    homeVisit: true,
    category: 'specialty',
  },
]

export const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Priya Sharma',
    location: 'Banjara Hills',
    text: 'The smile makeover completely exceeded my expectations. The team was gentle, professional, and the porcelain veneers look stunning. I finally have the smile I always wanted!',
    rating: 5,
    service: 'Smile Design',
  },
  {
    name: 'Rajesh Kumar',
    location: 'Madhapur',
    text: 'The home visit service was incredible for my elderly mother who cannot travel easily. Same clinical quality as the clinic, right at our doorstep. Highly recommend D-D-D!',
    rating: 5,
    service: 'Doorstep Dentistry',
  },
  {
    name: 'Ananya Reddy',
    location: 'Kondapur',
    text: 'My teeth whitening results were visible immediately after the first session. Very professional team, completely painless, and the results are lasting months later.',
    rating: 5,
    service: 'Teeth Whitening',
  },
  {
    name: 'Vikram Nair',
    location: 'Gachibowli',
    text: 'Got two dental implants done here and the entire process was seamless. The implants look absolutely natural and the post-care guidance was thorough.',
    rating: 5,
    service: 'Dental Implants',
  },
  {
    name: 'Sunita Patel',
    location: 'Kukatpally',
    text: 'Best pediatric dental experience for my 8-year-old son. Dr. Preethi made it so fun and completely stress-free. He actually looks forward to dental visits now!',
    rating: 5,
    service: 'Pediatric Dentistry',
  },
  {
    name: 'Mohammed Ali',
    location: 'Tolichowki',
    text: 'Clear aligners have transformed my smile in just 6 months. The digital scan, the follow-ups, everything was handled with great care and professionalism.',
    rating: 5,
    service: 'Clear Aligners',
  },
  {
    name: 'Kavya Reddy',
    location: 'Vijayawada',
    text: 'Very clean clinic, caring doctors, and clear explanation before treatment. I felt comfortable throughout the visit.',
    rating: 5,
    service: 'General Dentistry',
  },
  {
    name: 'Sandeep Varma',
    location: 'Benz Circle',
    text: 'I came in with severe tooth pain and got quick relief. The treatment was smooth, professional, and painless.',
    rating: 5,
    service: 'Root Canal Treatment',
  },
  {
    name: 'Harini Teja',
    location: 'Guntur',
    text: 'The doctor was patient, gentle, and explained every step. My smile looks much better now and the results feel natural.',
    rating: 5,
    service: 'Smile Design',
  },
  {
    name: 'Ramesh Babu',
    location: 'Tadepalli',
    text: 'Excellent support from booking to treatment. The staff was polite and the clinic atmosphere was very reassuring.',
    rating: 5,
    service: 'Dental Checkup',
  },
]

export const FAQS: FAQItem[] = [
  {
    question: 'Do you offer dental visits at home?',
    answer:
      "Yes! Our flagship D-D-D (Dhanra Doorstep Dentistry) service brings full clinical-grade dental care directly to your home. Our trained dentists arrive with a complete sterilized mobile kit. It's ideal for elderly patients, differently-abled individuals, post-surgical recovery, and busy professionals.",
  },
  {
    question: 'How do I book an appointment?',
    answer:
      'You can call us at 9133743734 or 8121288804, WhatsApp us directly, or fill out the contact form on our website. We typically respond within minutes during clinic hours.',
  },
  {
    question: 'Is teeth whitening safe for my enamel?',
    answer:
      'Absolutely. We use professional-grade, dentist-approved bleaching agents that are clinically safe for enamel when applied by our trained team. We also do a pre-whitening assessment to ensure your teeth and gums are suitable for the procedure.',
  },
  {
    question: 'Do you accept dental insurance?',
    answer:
      'We work with most major dental insurance providers and cashless networks. Contact us in advance with your insurance details and we will verify your coverage before your appointment.',
  },
  {
    question: 'How long does a dental implant procedure take?',
    answer:
      'The full implant process typically takes 3–6 months, including osseointegration (bone healing) time. The surgical placement itself is done in a single visit under comfortable local anesthesia. We place the final crown after the implant has fully integrated.',
  },
  {
    question: 'What makes Dhanra Dental different from other clinics?',
    answer:
      'We combine luxury aesthetics with rigorous clinical standards. Our unique Doorstep Dentistry (D-D-D) program, digital treatment planning, sterilization protocols, and focus on smile artistry set us apart. We treat every patient like a VIP.',
  },
  {
    question: 'Are your dental procedures painful?',
    answer:
      "We prioritize patient comfort above all. We use topical numbing gel before injections, the latest local anesthetic techniques, and offer sedation dentistry for anxious patients. Most patients are surprised at how comfortable modern dentistry can be.",
  },
]

export const GALLERY_ITEMS: GalleryItem[] = [
  { title: 'Full Smile Makeover', subtitle: '6 upper ceramic veneers', type: 'Veneers', category: 'Aesthetic' },
  { title: 'Teeth Whitening', subtitle: '8 shades brighter in 1 session', type: 'Whitening', category: 'Aesthetic' },
  { title: 'Single Implant', subtitle: 'Upper molar replacement', type: 'Implant', category: 'Surgical' },
  { title: 'Clear Aligner Result', subtitle: '7-month orthodontic case', type: 'Aligners', category: 'Orthodontic' },
  { title: 'Gum Contouring', subtitle: 'Gummy smile correction', type: 'Periodontal', category: 'Aesthetic' },
  { title: 'Full Mouth Rehab', subtitle: 'Crowns, bridges & implants', type: 'Restorative', category: 'Restorative' },
  { title: 'Composite Bonding', subtitle: 'Chipped tooth repair', type: 'Bonding', category: 'Restorative' },
  { title: 'Smile Design', subtitle: 'Digital smile preview used', type: 'Design', category: 'Aesthetic' },
]

export const DOCTORS: Doctor[] = [
  {
    name: 'Dr. Srinivasa Rao',
    qualification: 'BDS, MDS (Oral & Maxillofacial Surgery)',
    specialization: 'Dental Implants, Complex Extractions & Full Mouth Rehabilitation',
    experience: '14 years clinical experience',
    bio: 'Fellowship from AIIMS Delhi. Specialist in complex implant cases, bone grafting, and full-arch rehabilitation. Has performed over 1,200 successful implant procedures with a 99.1% success rate.',
    initials: 'SR',
  },
  {
    name: 'Dr. Preethi Sharma',
    qualification: 'BDS, MDS (Orthodontics & Dentofacial Orthopedics)',
    specialization: 'Clear Aligners, Metal Braces & Smile Design',
    experience: '9 years clinical experience',
    bio: 'Certified Invisalign provider and specialist in digital smile design. Known for achieving exceptional aesthetic outcomes in complex orthodontic cases and teenage patients.',
    initials: 'PS',
  },
  {
    name: 'Dr. Arjun Mehta',
    qualification: 'BDS, MDS (Conservative Dentistry & Endodontics)',
    specialization: 'Root Canals, Veneers & Cosmetic Restorations',
    experience: '7 years clinical experience',
    bio: 'Specialized in pain-free endodontic treatment and ceramic smile restorations. Uses the latest rotary endodontic systems and CAD/CAM technology for same-day ceramic restorations.',
    initials: 'AM',
  },
]

export const VALUES: ClinicValue[] = [
  {
    emoji: '🛡️',
    title: 'Clinical Excellence',
    description: 'Every procedure follows the highest clinical protocols with fully sterilized, hospital-grade instruments and materials.',
  },
  {
    emoji: '❤️',
    title: 'Patient-First Care',
    description: 'We listen before we treat. Your comfort, fears, and goals guide every clinical decision we make.',
  },
  {
    emoji: '🔬',
    title: 'Advanced Technology',
    description: 'Digital X-rays, intraoral scanners, CAD/CAM crowns, and latest-generation equipment for precision outcomes.',
  },
  {
    emoji: '🏠',
    title: 'Doorstep Dentistry',
    description: 'Our mobile dental unit is fully equipped for professional home visits — bringing the clinic to you.',
  },
  {
    emoji: '✨',
    title: 'Aesthetic Artistry',
    description: 'We combine dental science with a refined aesthetic sensibility to craft smiles that are beautiful and natural.',
  },
  {
    emoji: '📞',
    title: 'Always Accessible',
    description: 'Quick responses, flexible timings, WhatsApp support, and emergency dental care availability.',
  },
]
