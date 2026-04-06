export interface TreatmentDetailPage {
  slug: string
  navLabel: string
  title: string
  shortDescription: string
  intro: string
  details: string[]
  benefits: string[]
  process: string[]
  idealFor: string[]
  beforeImage: string
  afterImage: string
}

export const TREATMENT_DETAIL_PAGES: TreatmentDetailPage[] = [
  {
    slug: 'dental-implants',
    navLabel: 'Dental Implants',
    title: 'Dental Implants',
    shortDescription: 'Implants and replacement care',
    intro:
      'Dental implants are a long-term solution for replacing missing teeth with better support, comfort, bite strength, and a more natural smile appearance.',
    details: [
      'Implants replace missing tooth roots and support fixed restorations.',
      'Treatment is planned carefully with bone support, gum condition, and smile aesthetics in mind.',
      'The final result is designed to feel stable, natural-looking, and comfortable for daily function.',
    ],
    benefits: [
      'Restores chewing efficiency and confidence while speaking or smiling.',
      'Helps preserve jawbone support compared with leaving a gap untreated.',
      'Offers a fixed replacement option with natural-looking aesthetics.',
    ],
    process: [
      'Clinical evaluation, digital imaging, and implant planning.',
      'Implant placement with healing guidance and review visits.',
      'Final crown or restoration placement once the site is ready.',
    ],
    idealFor: [
      'Adults with one or more missing teeth.',
      'Patients looking for a fixed and durable replacement option.',
      'Cases where function, appearance, and long-term support matter.',
    ],
    beforeImage: '/implant.webp',
    afterImage: '/di.webp',
  },
  {
    slug: 'root-canal-treatment',
    navLabel: 'Root Canal Treatment',
    title: 'Root Canal Treatment',
    shortDescription: 'Pain relief and tooth preservation',
    intro:
      'Root canal treatment helps save an infected or deeply damaged tooth by cleaning the inner canals and sealing the tooth carefully for long-term comfort.',
    details: [
      'The infected tissue inside the tooth is removed with precise endodontic care.',
      'The tooth structure is preserved whenever possible to avoid unnecessary extraction.',
      'Treatment is planned for pain relief, infection control, and function.',
    ],
    benefits: [
      'Relieves pain caused by deep decay or infection.',
      'Helps preserve the natural tooth instead of removing it.',
      'Supports chewing function and long-term oral health.',
    ],
    process: [
      'Clinical diagnosis and X-ray assessment of the affected tooth.',
      'Cleaning and shaping of the infected root canals.',
      'Sealing of the canals and final restoration planning.',
    ],
    idealFor: [
      'Teeth with deep decay, infection, or pulp damage.',
      'Patients with tooth sensitivity, swelling, or persistent toothache.',
      'Cases where the tooth can still be saved with proper restoration.',
    ],
    beforeImage: '/rc.webp',
    afterImage: '/rc.webp',
  },
  {
    slug: 'crowns-and-bridges',
    navLabel: 'Crowns & Bridges',
    title: 'Crowns & Bridges',
    shortDescription: 'Restore strength and appearance',
    intro:
      'Crowns and bridges restore damaged or missing teeth by rebuilding strength, improving appearance, and helping maintain proper chewing balance.',
    details: [
      'Crowns protect weak or heavily restored teeth from further fracture.',
      'Bridges replace missing teeth by using adjacent support where appropriate.',
      'Each restoration is planned for fit, appearance, and comfort.',
    ],
    benefits: [
      'Improves chewing comfort and tooth stability.',
      'Helps restore shape, alignment, and smile balance.',
      'Provides a durable restorative option for worn or missing teeth.',
    ],
    process: [
      'Assessment of tooth condition and restorative planning.',
      'Tooth preparation and impression or digital scan.',
      'Final crown or bridge fitting and bite adjustment.',
    ],
    idealFor: [
      'Broken, weak, or heavily filled teeth.',
      'Patients missing one or more teeth in a localized area.',
      'Cases needing functional and aesthetic restoration.',
    ],
    beforeImage: '/cb.webp',
    afterImage: '/cr.webp',
  },
  {
    slug: 'braces-and-aligners',
    navLabel: 'Braces & Aligners',
    title: 'Braces & Aligners',
    shortDescription: 'Orthodontic smile correction',
    intro:
      'Braces and aligners straighten teeth, improve bite balance, and create cleaner smile alignment with a treatment plan matched to age, lifestyle, and case complexity.',
    details: [
      'Treatment may involve braces or aligners depending on the correction needed.',
      'Planning focuses on tooth movement, bite correction, and smile harmony.',
      'Progress is monitored over time for controlled, predictable results.',
    ],
    benefits: [
      'Improves smile alignment and facial aesthetics.',
      'Supports better bite balance and easier cleaning between teeth.',
      'Helps address spacing, crowding, and selected bite issues.',
    ],
    process: [
      'Orthodontic consultation and smile alignment assessment.',
      'Digital planning and appliance selection.',
      'Regular review visits with progress adjustments.',
    ],
    idealFor: [
      'Crowded, spaced, or unevenly aligned teeth.',
      'Teen and adult patients looking for orthodontic correction.',
      'Cases needing aesthetic or bite improvement.',
    ],
    beforeImage: '/b.webp',
    afterImage: '/ba.webp',
  },
  {
    slug: 'gum-treatments',
    navLabel: 'Gum Treatments',
    title: 'Gum Treatments',
    shortDescription: 'Periodontal care and gum health',
    intro:
      'Gum treatments focus on reducing bleeding, infection, swelling, and ongoing periodontal concerns to support stronger teeth and healthier oral tissues.',
    details: [
      'Care is planned according to gum inflammation, deposits, and tissue condition.',
      'Treatment can include deep cleaning, maintenance, and supportive periodontal care.',
      'Ongoing reviews help protect teeth and improve gum stability.',
    ],
    benefits: [
      'Reduces gum bleeding, swelling, and bad breath.',
      'Supports healthier gums and lowers the risk of progression.',
      'Helps maintain better long-term support around teeth.',
    ],
    process: [
      'Clinical gum evaluation and hygiene assessment.',
      'Cleaning or periodontal care based on disease severity.',
      'Maintenance plan and follow-up guidance for better stability.',
    ],
    idealFor: [
      'Bleeding gums, swelling, or gum tenderness.',
      'Patients with plaque, tartar, or periodontal concerns.',
      'Cases needing supportive gum maintenance over time.',
    ],
    beforeImage: '/gum.webp',
    afterImage: '/gum.webp',
  },
  {
    slug: 'kids-dentistry',
    navLabel: 'Kids Dentistry',
    title: 'Kids Dentistry',
    shortDescription: 'Child-friendly dental care',
    intro:
      'Kids dentistry is designed to make dental visits calmer, gentler, and easier for children while focusing on prevention, comfort, and healthy growth.',
    details: [
      'Child-friendly appointments focus on comfort and early oral habits.',
      'Treatment plans are adjusted for milk teeth, age, and developmental needs.',
      'Parents receive guidance on home care, diet, and preventive routines.',
    ],
    benefits: [
      'Encourages positive dental experiences from an early age.',
      'Supports cavity prevention and routine oral monitoring.',
      'Helps children and parents build strong oral hygiene habits.',
    ],
    process: [
      'Friendly consultation with child-focused examination.',
      'Preventive or restorative care depending on the child’s needs.',
      'Guidance for parents on brushing, diet, and follow-up visits.',
    ],
    idealFor: [
      'Children with routine dental care needs.',
      'Kids with cavities, oral hygiene concerns, or fear of treatment.',
      'Parents looking for a gentle preventive care plan.',
    ],
    beforeImage: '/kd.webp',
    afterImage: '/kd.webp',
  },
  {
    slug: 'dentures',
    navLabel: 'Dentures',
    title: 'Dentures',
    shortDescription: 'Comfortable tooth replacement options',
    intro:
      'Dentures restore missing teeth with removable replacement options designed to improve appearance, speech support, and day-to-day function.',
    details: [
      'Dentures are planned to improve fit, support, and comfort.',
      'They can replace several missing teeth or a full arch as needed.',
      'Careful design helps improve confidence and oral function.',
    ],
    benefits: [
      'Supports chewing and speaking after multiple tooth loss.',
      'Improves smile fullness and facial support.',
      'Provides a practical replacement option for broader tooth loss.',
    ],
    process: [
      'Evaluation of gums, bite, and replacement needs.',
      'Measurements, impressions, and denture design planning.',
      'Try-in, fitting, and comfort adjustments.',
    ],
    idealFor: [
      'Patients with multiple missing teeth.',
      'Cases needing removable replacement solutions.',
      'People looking for practical smile and function restoration.',
    ],
    beforeImage: '/fd.webp',
    afterImage: '/fd.webp',
  },
  {
    slug: 'cosmetic-dentistry',
    navLabel: 'Cosmetic Dentistry',
    title: 'Cosmetic Dentistry',
    shortDescription: 'Smile enhancement treatments',
    intro:
      'Cosmetic dentistry focuses on smile aesthetics by improving tooth colour, proportion, symmetry, and overall facial harmony with personalized planning.',
    details: [
      'Treatment may involve whitening, reshaping, veneers, or smile planning.',
      'Aesthetic decisions are matched to face shape, lip line, and natural look.',
      'The goal is a brighter and more refined smile without looking artificial.',
    ],
    benefits: [
      'Improves smile confidence and overall appearance.',
      'Addresses stains, shape concerns, and minor asymmetry.',
      'Creates a more polished and balanced smile presentation.',
    ],
    process: [
      'Smile assessment with aesthetic planning and discussion.',
      'Treatment selection based on goals, tooth condition, and budget.',
      'Execution of the cosmetic plan with refinement and finishing.',
    ],
    idealFor: [
      'Patients wanting a brighter or more attractive smile.',
      'Stains, uneven edges, minor gaps, or aesthetic irregularities.',
      'Cases looking for visible smile improvement with planning.',
    ],
    beforeImage: '/smile.webp',
    afterImage: '/smile.webp',
  },
  {
    slug: 'extractions',
    navLabel: 'Extractions',
    title: 'Extractions',
    shortDescription: 'Safe and careful tooth removal',
    intro:
      'Extractions are performed when a tooth cannot be saved or when removal is the safest option for pain relief, infection control, or treatment planning.',
    details: [
      'Simple and complex extractions are planned with comfort and safety in mind.',
      'The area is assessed carefully before removal and after-care instructions are provided.',
      'Where needed, replacement planning is discussed after extraction.',
    ],
    benefits: [
      'Relieves pain from severely damaged or infected teeth.',
      'Helps control infection and protect surrounding teeth.',
      'Can create space for future corrective or replacement treatment.',
    ],
    process: [
      'Clinical examination and treatment planning.',
      'Tooth removal under controlled care.',
      'Healing advice, medication guidance, and review support.',
    ],
    idealFor: [
      'Severely broken or non-restorable teeth.',
      'Painful wisdom teeth or infection-related removal needs.',
      'Cases where space creation is required before treatment.',
    ],
    beforeImage: '/exp.webp',
    afterImage: '/exp.webp',
  },
  {
    slug: 'oral-surgeries',
    navLabel: 'Oral Surgeries',
    title: 'Oral Surgeries',
    shortDescription: 'Advanced surgical dental care',
    intro:
      'Oral surgery covers complex dental procedures such as impacted tooth management, surgical extractions, and other advanced interventions planned with precision.',
    details: [
      'Treatment is based on imaging, anatomical planning, and case difficulty.',
      'The focus is on safe surgery, controlled healing, and proper review.',
      'Surgical planning also considers comfort, infection control, and recovery.',
    ],
    benefits: [
      'Addresses difficult cases that routine treatment cannot solve.',
      'Supports relief from impacted teeth, swelling, and structural issues.',
      'Improves long-term oral stability with proper surgical planning.',
    ],
    process: [
      'Consultation, imaging review, and surgical planning.',
      'Procedure performed with controlled clinical steps.',
      'Post-operative guidance, medicines, and follow-up care.',
    ],
    idealFor: [
      'Impacted teeth and complex extraction cases.',
      'Patients with jaw or surgical dental concerns.',
      'Cases needing advanced clinical planning and recovery support.',
    ],
    beforeImage: '/st.webp',
    afterImage: '/st.webp',
  },
  {
    slug: 'preventive-dentistry',
    navLabel: 'Preventive Dentistry',
    title: 'Preventive Dentistry',
    shortDescription: 'Regular maintenance and prevention',
    intro:
      'Preventive dentistry helps reduce the risk of cavities, gum problems, and larger treatment needs through regular maintenance, checks, and oral hygiene planning.',
    details: [
      'It focuses on keeping the mouth healthier before bigger issues develop.',
      'Cleaning, checkups, and routine reviews are part of long-term prevention.',
      'Preventive care also supports better gum health and fresher oral hygiene.',
    ],
    benefits: [
      'Reduces the chance of future dental problems.',
      'Helps maintain healthier gums and cleaner teeth.',
      'Supports early detection of changes before they become serious.',
    ],
    process: [
      'Routine examination and oral hygiene review.',
      'Cleaning, preventive advice, or selected protective care.',
      'Maintenance scheduling based on patient needs and risk level.',
    ],
    idealFor: [
      'Patients seeking routine dental maintenance.',
      'People with plaque, staining, or early gum concerns.',
      'Families looking for regular preventive care support.',
    ],
    beforeImage: '/dig.webp',
    afterImage: '/dig.webp',
  },
  {
    slug: 'doorstep-dentistry',
    navLabel: 'Doorstep Dentistry',
    title: 'Doorstep Dentistry',
    shortDescription: 'Dental care at your location',
    intro:
      'Doorstep dentistry brings selected professional dental care to your location, helping patients who need convenience, mobility support, or home-based clinical attention.',
    details: [
      'Suitable for selected consultations, assessments, and clinically appropriate procedures.',
      'Especially valuable for elderly patients, home-care needs, or busy families.',
      'Planning focuses on comfort, access, and safe delivery of care.',
    ],
    benefits: [
      'Makes dental care more accessible for home-bound or busy patients.',
      'Reduces the stress of travel when treatment can be planned at home.',
      'Delivers a professional and convenient care experience.',
    ],
    process: [
      'Appointment discussion and case suitability check.',
      'Home visit with examination and treatment planning.',
      'Procedure or follow-up guidance based on the care needed.',
    ],
    idealFor: [
      'Elderly patients or those with mobility concerns.',
      'Home-based consultation or selected treatment needs.',
      'Families wanting more convenient dental access.',
    ],
    beforeImage: '/door.webp',
    afterImage: '/clinicgal (2).webp',
  },
]

export function getTreatmentDetailBySlug(slug: string) {
  return TREATMENT_DETAIL_PAGES.find((item) => item.slug === slug)
}
