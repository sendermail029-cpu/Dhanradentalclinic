import type { Metadata } from 'next'
import './globals.css'
import PageTransitionShell from '@/components/PageTransitionShell'

export const metadata: Metadata = {
  title: {
    default: 'Dhanra Dental Aesthetic & Implant Care',
    template: '%s | Dhanra Dental',
  },
  description:
    'Premium dental clinic in Hyderabad offering implants, smile design, clear aligners, and doorstep dental visits (D-D-D). Book your appointment today.',
  keywords: [
    'dental clinic hyderabad',
    'dental implants',
    'smile design',
    'teeth whitening',
    'clear aligners',
    'doorstep dentistry',
    'home dental visit',
  ],
  openGraph: {
    title: 'Dhanra Dental Aesthetic & Implant Care',
    description: 'Premium dental care in Hyderabad — at the clinic or your doorstep.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <PageTransitionShell>{children}</PageTransitionShell>
      </body>
    </html>
  )
}
