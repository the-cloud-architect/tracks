import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Tracks and Champagne",
  description:
    "Privacy policy for Tracks and Champagne website visitors, tour requests, and reservation leads.",
};

export default function PrivacyPage() {
  return (
    <main className="px-6 py-14 sm:px-10">
      <div className="mx-auto w-full max-w-4xl rounded-2xl bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold tracking-tight">Privacy Policy</h1>
        <p className="mt-4 text-sm text-zinc-500">Last updated: March 2026</p>
        <div className="mt-6 space-y-5 text-zinc-700">
          <p>
            We collect information you submit through contact, tour, and
            reservation forms, including your name, email, phone number, preferred
            dates, and booking details.
          </p>
          <p>
            We use this information to communicate with you, manage availability,
            and process reservations. We do not sell your personal information.
          </p>
          <p>
            Payment processing is handled by third-party providers. We do not store
            full card details on this website.
          </p>
          <p>
            If you would like your submitted information corrected or removed,
            contact us using the details on the Contact page.
          </p>
        </div>
      </div>
    </main>
  );
}
