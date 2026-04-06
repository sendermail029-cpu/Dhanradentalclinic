import type { Metadata } from 'next'
import ContactClient from './ContactClient'

export const metadata: Metadata = {
  title: 'Contact & Booking',
  description:
    'Book your dental appointment at Dhanra Dental Hyderabad. Call 9133743734 or 8121288804. WhatsApp available. Home visit (D-D-D) bookings welcome.',
}

export default function ContactPage() {
  return <ContactClient />
}
