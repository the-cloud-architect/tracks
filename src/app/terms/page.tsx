import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions | Wedding Tracks",
  description:
    "Terms and conditions for venue tours, reservations, deposits, and event policies at Wedding Tracks.",
};

export default function TermsPage() {
  return (
    <main className="px-6 py-14 sm:px-10">
      <div className="mx-auto w-full max-w-4xl rounded-2xl bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold tracking-tight">Terms & Conditions</h1>
        <p className="mt-4 text-sm text-zinc-500">Last updated: March 2026</p>
        <div className="mt-6 space-y-5 text-zinc-700">
          <p>
            Reservation dates are confirmed after receipt of deposit and written
            confirmation from Wedding Tracks.
          </p>
          <p>
            Deposits are applied toward your package total. Final payment timing
            and cancellation terms are outlined in your event agreement.
          </p>
          <p>
            Guest capacity is limited based on package and venue setup. The gazebo
            ceremony area is designed for up to 40 guests.
          </p>
          <p>
            Curfew starts at 11:00 PM EST. Event hosts are responsible for ensuring
            guests, vendors, and music conclude by curfew.
          </p>
          <p>
            ATV use and trail activities are subject to safety instructions and
            venue rules provided at booking.
          </p>
        </div>
      </div>
    </main>
  );
}
