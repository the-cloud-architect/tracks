import Link from 'next/link'

export default function ReserveThankYouPage() {
  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-16 text-zinc-900 sm:px-12">
      <div className="mx-auto w-full max-w-lg text-center">
        <div className="rounded-2xl bg-white p-10 shadow-sm">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl">
            ✓
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            Reservation Lead Received!
          </h1>
          <p className="mt-3 text-zinc-600">
            Thank you for choosing Tracks and Champagne. We&apos;ll contact you
            shortly with deposit instructions and next steps to lock in your
            date.
          </p>
          <p className="mt-2 text-sm text-zinc-500">
            Curfew at 11:00 PM EST · Chatsworth, Georgia
          </p>
          <Link
            href="/"
            className="mt-8 inline-block rounded-lg bg-zinc-900 px-6 py-3 text-sm font-semibold text-white hover:bg-zinc-700"
          >
            Back to home
          </Link>
        </div>
      </div>
    </main>
  )
}
