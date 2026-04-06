import type { Metadata } from 'next'
import './globals.css'
import PageTransitionShell from '@/components/PageTransitionShell'

export const metadata: Metadata = {
  title: {
    default: 'Dhanra Dental Aesthetic & Implant Care | Vijayawada Dental Hospital',
    template: '%s | Dhanra Dental',
  },
  description:
    'Dhanra Dental Aesthetic & Implant Care is a leading dental hospital in Vijayawada offering dental implants, smile design, braces, aligners, cosmetic dentistry, root canal treatment, and advanced family dental care.',
  keywords: [
    'vijayawada dental hospital',
    'vijayawada dental hospitals',
    'best dental clinic in vijayawada',
    'best dentist in vijayawada',
    'dental clinic vijayawada',
    'dentist near me vijayawada',
    'dental implants',
    'dental implants vijayawada',
    'smile design',
    'cosmetic dentistry vijayawada',
    'teeth whitening',
    'clear aligners',
    'braces treatment vijayawada',
    'root canal treatment vijayawada',
    'kids dentistry vijayawada',
    'family dental care vijayawada',
    'doorstep dentistry vijayawada',
    'home dental visit vijayawada',
    'ramavarapadu dental clinic',
    'dhanra dental',
  ],
  applicationName: 'Dhanra Dental',
  icons: {
    icon: '/logs.svg',
    shortcut: '/logs.svg',
    apple: '/logo.png',
  },
  openGraph: {
    title: 'Dhanra Dental Aesthetic & Implant Care | Vijayawada Dental Hospital',
    description: 'Advanced dental hospital in Vijayawada for implants, braces, aligners, smile design, and complete dental care.',
    type: 'website',
    siteName: 'Dhanra Dental',
    images: ['/logo.png'],
  },
  twitter: {
    card: 'summary',
    title: 'Dhanra Dental Aesthetic & Implant Care | Vijayawada Dental Hospital',
    description: 'Advanced dental care in Vijayawada for implants, braces, aligners, cosmetic dentistry, and family dental treatments.',
    images: ['/logo.png'],
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
