import type { Metadata } from 'next'
import TreatmentsClient from './TreatmentsClient'

export const metadata: Metadata = {
  title: 'Treatments',
  description:
    'Clear treatment information at Dhanra Dental including cleaning, RCT, implants, orthodontics, cosmetic dentistry, pediatric care, and doorstep dentistry.',
}

export default function TreatmentsPage() {
  return <TreatmentsClient />
}
