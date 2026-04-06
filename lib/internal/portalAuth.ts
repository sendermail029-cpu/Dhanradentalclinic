'use client'

import { deleteApp, initializeApp } from 'firebase/app'
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from 'firebase/auth'
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  serverTimestamp,
  setDoc,
  where,
} from 'firebase/firestore'
import { firebaseApp, firebaseAuth, firebaseConfig, firestore } from '@/lib/firebase'

export type PortalRole = 'admin' | 'doctor' | 'receptionist'

export type PortalCredential = {
  uid: string
  role: PortalRole
  email: string
  mobile: string
  active: boolean
}

const portalUsersCollection = collection(firestore, 'portalUsers')

function normalizeEmail(value: string) {
  return value.trim().toLowerCase()
}

function normalizeMobile(value: string) {
  return value.replace(/\s+/g, '')
}

function isEmailIdentifier(value: string) {
  return value.includes('@')
}

function getFriendlySignInErrorMessage(error: unknown) {
  const message = error instanceof Error ? error.message : ''

  if (
    message.includes('auth/invalid-credential') ||
    message.includes('auth/user-not-found') ||
    message.includes('auth/wrong-password') ||
    message.includes('auth/invalid-email')
  ) {
    return 'Please enter your proper email or password.'
  }

  if (message.includes('auth/too-many-requests')) {
    return 'Too many failed attempts. Please wait a little and try again.'
  }

  return 'Unable to sign in right now. Please try again.'
}

function mapPortalCredential(snapshotData: Record<string, unknown>, uid: string): PortalCredential {
  return {
    uid,
    role: String(snapshotData.role ?? '') as PortalRole,
    email: String(snapshotData.email ?? ''),
    mobile: String(snapshotData.mobile ?? ''),
    active: Boolean(snapshotData.active ?? true),
  }
}

async function getPortalCredentialByUid(uid: string) {
  const snapshot = await getDoc(doc(portalUsersCollection, uid))
  if (!snapshot.exists()) return null
  return mapPortalCredential(snapshot.data(), snapshot.id)
}

async function getPortalCredentialByRole(role: PortalRole) {
  const snapshot = await getDocs(query(portalUsersCollection, where('role', '==', role), limit(1)))
  const first = snapshot.docs[0]
  if (!first) return null
  return mapPortalCredential(first.data(), first.id)
}

async function getPortalCredentialByMobile(role: PortalRole, mobile: string) {
  const normalizedMobile = normalizeMobile(mobile)
  const snapshot = await getDocs(
    query(
      portalUsersCollection,
      where('role', '==', role),
      where('mobile', '==', normalizedMobile),
      limit(1),
    ),
  )
  const first = snapshot.docs[0]
  if (!first) return null
  return mapPortalCredential(first.data(), first.id)
}

async function ensureAdminProfile(user: User) {
  const existing = await getPortalCredentialByUid(user.uid)
  if (existing) return existing

  if (!user.email) {
    throw new Error('Admin login requires a Firebase email account.')
  }

  await setDoc(
    doc(portalUsersCollection, user.uid),
    {
      uid: user.uid,
      role: 'admin',
      email: normalizeEmail(user.email),
      mobile: '',
      active: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  )

  return {
    uid: user.uid,
    role: 'admin' as const,
    email: normalizeEmail(user.email),
    mobile: '',
    active: true,
  }
}

export function watchPortalSession(callback: (value: { user: User | null; profile: PortalCredential | null }) => void) {
  return onAuthStateChanged(firebaseAuth, async (user) => {
    if (!user) {
      callback({ user: null, profile: null })
      return
    }

    let profile = await getPortalCredentialByUid(user.uid)

    if (!profile && user.email) {
      try {
        profile = await ensureAdminProfile(user)
      } catch {
        profile = null
      }
    }

    callback({ user, profile })
  })
}

export async function signInToPortal(role: PortalRole, identifier: string, password: string) {
  const cleanedIdentifier = identifier.trim()
  const cleanedPassword = password.trim()

  if (!cleanedIdentifier || !cleanedPassword) {
    return { ok: false as const, message: 'Enter email/mobile number and password to continue.' }
  }

  let emailForSignIn = ''

  if (isEmailIdentifier(cleanedIdentifier)) {
    emailForSignIn = normalizeEmail(cleanedIdentifier)
  } else {
    const profile = await getPortalCredentialByMobile(role, cleanedIdentifier)
    if (!profile?.email) {
      return { ok: false as const, message: 'Mobile number is not linked to this portal account yet.' }
    }
    emailForSignIn = profile.email
  }

  try {
    const credential = await signInWithEmailAndPassword(firebaseAuth, emailForSignIn, cleanedPassword)
    let profile = await getPortalCredentialByUid(credential.user.uid)

    if (!profile && role === 'admin') {
      profile = await ensureAdminProfile(credential.user)
    }

    if (!profile || profile.role !== role || !profile.active) {
      await signOut(firebaseAuth)
      return { ok: false as const, message: 'This account is not allowed to open this portal.' }
    }

    return { ok: true as const, profile }
  } catch (error) {
    return {
      ok: false as const,
      message: getFriendlySignInErrorMessage(error),
    }
  }
}

export async function signOutPortal() {
  await signOut(firebaseAuth)
}

export async function getPortalCredential(role: PortalRole) {
  return getPortalCredentialByRole(role)
}

export async function savePortalCredential(
  role: 'doctor' | 'receptionist',
  input: { email?: string; mobile?: string; password: string },
) {
  const normalizedEmail = normalizeEmail(input.email ?? '')
  const normalizedMobile = normalizeMobile(input.mobile ?? '')
  const password = input.password.trim()

  if (!normalizedEmail) {
    throw new Error('Firebase email/password login needs an email address.')
  }

  if (!password) {
    throw new Error('Enter a password before saving this portal login.')
  }

  const existingRoleProfile = await getPortalCredentialByRole(role)

  if (existingRoleProfile) {
    if (existingRoleProfile.email !== normalizedEmail) {
      throw new Error(`A ${role} Firebase account already exists. Email change is not supported from this panel yet.`)
    }

    await setDoc(
      doc(portalUsersCollection, existingRoleProfile.uid),
      {
        mobile: normalizedMobile,
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    )

    return {
      ...existingRoleProfile,
      mobile: normalizedMobile,
    }
  }

  const secondaryAppName = `portal-access-${role}-${Date.now()}`
  const secondaryApp = initializeApp(firebaseConfig, secondaryAppName)
  const secondaryAuth = getAuth(secondaryApp)

  try {
    const created = await createUserWithEmailAndPassword(secondaryAuth, normalizedEmail, password)

    await setDoc(
      doc(portalUsersCollection, created.user.uid),
      {
        uid: created.user.uid,
        role,
        email: normalizedEmail,
        mobile: normalizedMobile,
        active: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    )

    return {
      uid: created.user.uid,
      role,
      email: normalizedEmail,
      mobile: normalizedMobile,
      active: true,
    }
  } finally {
    await signOut(secondaryAuth).catch(() => undefined)
    if (secondaryApp !== firebaseApp) {
      await deleteApp(secondaryApp).catch(() => undefined)
    }
  }
}

export async function updateAdminPortalMobile(mobile: string) {
  const user = firebaseAuth.currentUser
  if (!user?.uid || !user.email) {
    throw new Error('Admin user is not signed in.')
  }

  const normalizedMobile = normalizeMobile(mobile)
  const existing = await ensureAdminProfile(user)

  await setDoc(
    doc(portalUsersCollection, user.uid),
    {
      uid: user.uid,
      role: 'admin',
      email: normalizeEmail(user.email),
      mobile: normalizedMobile,
      active: true,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  )

  return {
    ...existing,
    email: normalizeEmail(user.email),
    mobile: normalizedMobile,
    active: true,
  }
}

export async function sendPortalPasswordReset(role: PortalRole) {
  let email = ''

  if (role === 'admin') {
    const user = firebaseAuth.currentUser
    if (!user?.email) {
      throw new Error('Admin user is not signed in with an email account.')
    }

    email = normalizeEmail(user.email)
  } else {
    const existingRoleProfile = await getPortalCredentialByRole(role)
    if (!existingRoleProfile?.email) {
      throw new Error(`No ${role} portal email is saved yet.`)
    }

    email = existingRoleProfile.email
  }

  await sendPasswordResetEmail(firebaseAuth, email)

  return { email }
}
