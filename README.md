# Dhanra Dental Aesthetic & Implant Care

A premium Next.js dental clinic website with a built-in Receptionist CRM / OP Management Portal.

---

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript** — strict, fully typed
- **Tailwind CSS** — utility styling
- **Framer Motion** — subtle animations
- **Lucide React** — icons
- **localStorage** — client-side persistence (backend-ready)

---

## Project Structure

```
dhanra-dental/
├── app/
│   ├── layout.tsx              # Root layout (Navbar + Footer)
│   ├── globals.css             # Global styles + CSS variables
│   ├── page.tsx                # Home page
│   ├── about/
│   │   └── page.tsx            # About page
│   ├── services/
│   │   └── page.tsx            # Services page
│   ├── gallery/
│   │   └── page.tsx            # Smile gallery
│   ├── contact/
│   │   ├── page.tsx            # Contact page (metadata wrapper)
│   │   └── ContactClient.tsx   # Contact form (client component)
│   └── receptionist/
│       └── page.tsx            # Receptionist CRM Portal
│
├── components/
│   ├── Navbar.tsx              # Sticky navigation
│   ├── Footer.tsx              # Site footer
│   └── ServiceCard.tsx         # Reusable service card
│
├── lib/
│   ├── data.ts                 # All static clinic data
│   └── patientUtils.ts         # Validation, filtering, export, storage
│
└── types/
    └── index.ts                # All TypeScript types
```

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 3. Build for production

```bash
npm run build
npm start
```

---

## Pages

| Route | Description |
|-------|-------------|
| `/` | Home — hero, trust strip, service toggle, testimonials, FAQ |
| `/about` | About — doctors, clinic story, values |
| `/services` | Services — all treatments + D-D-D highlight |
| `/gallery` | Gallery — before/after smile cases |
| `/contact` | Contact — form, phone, WhatsApp, map |
| `/receptionist` | **Receptionist CRM Portal** |

---

## Receptionist Portal (`/receptionist`)

A full-featured internal OP registration and patient CRM system.

### Features

- **Dashboard stats** — Today's OPs, Last 7 Days, Total Patients, COD count
- **OP Registration Form** — with validation (Name, Age, Mobile, Address required)
- **Patient records table** — all fields visible
- **Date filters** — Today / Last 7 Days / Last 10 Days / All / Custom Range
- **Search** — by name, mobile, problem, payment mode
- **Payment filter** — COD / UPI / Card
- **CSV Export** — 5 export options (Today, 7 Days, 10 Days, Current View, All)
- **LocalStorage persistence** — survives page refresh

### Data Model

```typescript
interface PatientRecord {
  id: string           // "OP0001"
  createdAt: string    // "YYYY-MM-DD"
  patientName: string
  age: string
  mobileNumber: string
  address: string
  height: string       // cm
  weight: string       // kg
  bp: string           // "120/80"
  sugar: string        // mg/dL
  patientProblem: string
  paymentMode: 'COD' | 'UPI' | 'Card'
}
```

---

## Connecting to a Backend

The receptionist page is structured for easy backend integration.

Replace the `loadPatients` / `savePatients` calls in `lib/patientUtils.ts` with:

### Supabase

```typescript
import { createClient } from '@supabase/supabase-js'
const supabase = createClient(URL, KEY)

// Load
const { data } = await supabase.from('patients').select('*').order('created_at', { ascending: false })

// Save
await supabase.from('patients').insert(newPatient)
```

### Prisma + PostgreSQL

```typescript
// lib/prisma.ts
import { PrismaClient } from '@prisma/client'
export const prisma = new PrismaClient()

// app/api/patients/route.ts
export async function POST(req: Request) {
  const body = await req.json()
  const patient = await prisma.patient.create({ data: body })
  return Response.json(patient)
}
```

### Firebase Firestore

```typescript
import { addDoc, collection, getDocs } from 'firebase/firestore'
await addDoc(collection(db, 'patients'), newPatient)
```

---

## Clinic Contact

- **Phone:** +91 9133743734 / +91 8121288804
- **Location:** Hyderabad, Telangana
- **Timings:** Mon–Sat 9 AM–8 PM | Sunday 10 AM–4 PM

---

## Customization

1. **Clinic info** — edit `lib/data.ts` → `CLINIC_INFO`
2. **Services** — edit `lib/data.ts` → `SERVICES` array
3. **Doctors** — edit `lib/data.ts` → `DOCTORS` array
4. **Colors** — edit `app/globals.css` CSS variables
5. **Fonts** — swap Google Fonts import in `globals.css`

---

## License

Built for Dhanra Dental Aesthetic & Implant Care. All rights reserved.
