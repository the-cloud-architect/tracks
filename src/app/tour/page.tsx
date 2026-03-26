'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import Link from 'next/link'
import { submitTourRequest, type ActionState } from '@/app/actions'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-lg bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-zinc-700 disabled:opacity-50"
    >
      {pending ? 'Submitting…' : 'Request Tour'}
    </button>
  )
}

const initialState: ActionState = {}

export default function TourPage() {
  const [state, formAction] = useActionState(submitTourRequest, initialState)

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
            Preview Tours — Opens May 1
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            Schedule a Tour
          </h1>
          <p className="mt-2 text-zinc-600">
            Fill out the form below and we&apos;ll reach out to confirm your
            visit to Tracks and Champagne.
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
              <label
                htmlFor="phone"
                className="mb-1 block text-sm font-medium text-zinc-700"
              >
                Phone Number{' '}
                <span className="text-zinc-400">(optional)</span>
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-sm focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-200"
                placeholder="(555) 555-5555"
              />
            </div>

            <div>
              <label
                htmlFor="preferredDate"
                className="mb-1 block text-sm font-medium text-zinc-700"
              >
                Preferred Tour Date{' '}
                <span className="text-zinc-400">(optional)</span>
              </label>
              <input
                id="preferredDate"
                name="preferredDate"
                type="date"
                className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-sm focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-200"
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="mb-1 block text-sm font-medium text-zinc-700"
              >
                Message <span className="text-zinc-400">(optional)</span>
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-sm focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-200"
                placeholder="Tell us about your event or any questions you have…"
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
          </form>
        </div>
      </div>
    </main>
  )
}
