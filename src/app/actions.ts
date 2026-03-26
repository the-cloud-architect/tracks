'use server'

import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'

export type ActionState = {
  error?: string
}

export async function submitTourRequest(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const fullName = formData.get('fullName') as string
  const email = formData.get('email') as string
  const phone = formData.get('phone') as string | null
  const preferredDateRaw = formData.get('preferredDate') as string | null
  const message = formData.get('message') as string | null

  if (!fullName?.trim() || !email?.trim()) {
    return { error: 'Name and email are required.' }
  }

  try {
    await prisma.tourRequest.create({
      data: {
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone?.trim() || null,
        preferredDate: preferredDateRaw ? new Date(preferredDateRaw) : null,
        message: message?.trim() || null,
      },
    })
  } catch {
    return { error: 'Something went wrong. Please try again.' }
  }

  redirect('/tour/thank-you')
}

const DEPOSIT_BY_TIER: Record<string, number> = {
  essential: 50000,   // $500
  signature: 100000,  // $1,000
  elite: 200000,      // $2,000
}

export async function submitReservation(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const fullName = formData.get('fullName') as string
  const email = formData.get('email') as string
  const packageTier = formData.get('packageTier') as string
  const eventDateRaw = formData.get('eventDate') as string
  const expectedGuestsRaw = formData.get('expectedGuests') as string | null

  if (!fullName?.trim() || !email?.trim()) {
    return { error: 'Name and email are required.' }
  }
  if (!packageTier || !DEPOSIT_BY_TIER[packageTier]) {
    return { error: 'Please select a valid package.' }
  }
  if (!eventDateRaw) {
    return { error: 'Event date is required.' }
  }

  const eventDate = new Date(eventDateRaw)
  if (isNaN(eventDate.getTime()) || eventDate < new Date()) {
    return { error: 'Please choose a future event date.' }
  }

  const expectedGuests = expectedGuestsRaw ? parseInt(expectedGuestsRaw, 10) : null

  try {
    await prisma.reservationLead.create({
      data: {
        fullName: fullName.trim(),
        email: email.trim(),
        packageTier,
        eventDate,
        expectedGuests: expectedGuests && !isNaN(expectedGuests) ? expectedGuests : null,
        depositCents: DEPOSIT_BY_TIER[packageTier],
        paymentStatus: 'pending',
      },
    })
  } catch {
    return { error: 'Something went wrong. Please try again.' }
  }

  redirect('/reserve/thank-you')
}
