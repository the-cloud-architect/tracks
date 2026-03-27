import type { Metadata } from "next";
import Link from "next/link";

type PageProps = {
  searchParams: Promise<{
    status?: string;
  }>;
};

export const metadata: Metadata = {
  title: "Reservation Status | Wedding Tracks",
  description:
    "View your reservation deposit status and next steps for Wedding Tracks.",
};

export default async function ReservationConfirmationPage({
  searchParams,
}: PageProps) {
  const params = await searchParams;
  const status = params.status ?? "pending";

  return (
    <main className="px-6 py-14 sm:px-10">
      <div className="mx-auto w-full max-w-3xl rounded-2xl bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold tracking-tight">Reservation Status</h1>
        <p className="mt-4 text-zinc-700">
          {status === "success"
            ? "Your deposit payment was recorded. We’ll follow up with your booking confirmation and next steps."
            : status === "canceled"
              ? "Your checkout was canceled. Your date is not held until deposit is completed."
              : "Your reservation request was received and is awaiting payment confirmation."}
        </p>
        <div className="mt-6 flex gap-3">
          <Link
            href="/reserve"
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white"
          >
            Back to Reservation
          </Link>
          <Link
            href="/contact"
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-900"
          >
            Contact Venue Team
          </Link>
        </div>
      </div>
    </main>
  );
}
