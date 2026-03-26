'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import Link from 'next/link'
import { submitReservation, type ActionState } from '@/app/actions'

const PACKAGES = [
  {
    value: 'essential',
    label: 'Essential',
    description: 'Up to 40 guests · $500 deposit',
  },
  {
    value: 'signature',
    label: 'Signature',
    description: 'Up to 80 guests · $1,000 deposit',
  },
  {
    value: 'elite',
    label: 'Elite',
    description: 'Full venue buy-out · $2,000 deposit',
  },
]

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-lg bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-zinc-700 disabled:opacity-50"
    >
      {pending ? 'Submitting…' : 'Reserve My Date'}
    </button>
  )
}

const initialState: ActionState = {}

export default function ReservePage() {
  const [state, formAction] = useActionState(submitReservation, initialState)

  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-16 text-zinc-900 sm:px-12">
      <div className="mx-auto w-full max-w-lg">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-800"
        >
          ← Back to home
        </Link>

        <div className="rounded-2xl bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">
            Online Deposit · Chatsworth, Georgia
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            Reserve Your Date
          </h1>
          <p className="mt-2 text-zinc-600">
            Secure your wedding date at Tracks and Champagne with a refundable
            deposit. We&apos;ll follow up to finalize the details.
          </p>

          <form action={formAction} className="mt-8 flex flex-col gap-5">
            <div>
              <label
                htmlFor="fullName"
                className="mb-1 block text-sm font-medium text-zinc-700"
              >
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                required
                autoComplete="name"
                className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-sm focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-200"
                placeholder="Jane Smith"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-1 block text-sm font-medium text-zinc-700"
              >
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-sm focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-200"
                placeholder="jane@example.com"
              />
            </div>

            <div>
              <p className="mb-2 text-sm font-medium text-zinc-700">
                Package <span className="text-red-500">*</span>
              </p>
              <div className="flex flex-col gap-3">
                {PACKAGES.map((pkg) => (
                  <label
                    key={pkg.value}
                    className="flex cursor-pointer items-start gap-3 rounded-lg border border-zinc-200 p-4 hover:border-zinc-400 has-[:checked]:border-zinc-900 has-[:checked]:bg-zinc-50"
                  >
                    <input
                      type="radio"
                      name="packageTier"
                      value={pkg.value}
                      required
                      className="mt-0.5 accent-zinc-900"
                    />
                    <div>
                      <span className="text-sm font-semibold">{pkg.label}</span>
                      <p className="text-xs text-zinc-500">{pkg.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label
                htmlFor="eventDate"
                className="mb-1 block text-sm font-medium text-zinc-700"
              >
                Wedding / Event Date <span className="text-red-500">*</span>
              </label>
              <input
                id="eventDate"
                name="eventDate"
                type="date"
                required
                className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-sm focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-200"
              />
            </div>

            <div>
              <label
                htmlFor="expectedGuests"
                className="mb-1 block text-sm font-medium text-zinc-700"
              >
                Expected Guest Count{' '}
                <span className="text-zinc-400">(optional)</span>
              </label>
              <input
                id="expectedGuests"
                name="expectedGuests"
                type="number"
                min={1}
                max={500}
                className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-sm focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-200"
                placeholder="e.g. 75"
              />
            </div>

            {state.error && (
              <p
                role="alert"
                className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {state.error}
              </p>
            )}

            <SubmitButton />

            <p className="text-center text-xs text-zinc-400">
              Curfew starts at 11:00 PM EST · Chatsworth, Georgia
            </p>
          </form>
        </div>
      </div>
    </main>
  )
}
