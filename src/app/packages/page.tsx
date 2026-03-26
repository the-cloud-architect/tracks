import type { Metadata } from "next";
import Link from "next/link";

import { formatUsd, venuePackages } from "@/lib/packages";

export const metadata: Metadata = {
  title: "Packages | Tracks and Champagne",
  description:
    "Compare Tracks and Champagne wedding packages including gazebo-only, house-stay, and ATV-enhanced experiences.",
};

export default function PackagesPage() {
  return (
    <main className="px-6 py-14 sm:px-10">
      <div className="mx-auto w-full max-w-5xl space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Wedding Packages</h1>
        <p className="max-w-3xl leading-8 text-zinc-700">
          Every package includes access to the ceremony gazebo, 25-car parking,
          outside speaker system access, and three on-site external bathrooms.
          Curfew begins at 11:00 PM EST.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          {venuePackages.map((pkg) => (
            <article key={pkg.key} className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold">{pkg.name}</h2>
              <p className="mt-1 text-sm text-zinc-500">{pkg.duration}</p>
              <p className="mt-3 text-zinc-700">{pkg.summary}</p>
              <p className="mt-4 text-sm">
                Package total:{" "}
                <span className="font-semibold">{formatUsd(pkg.priceCents)}</span>
              </p>
              <p className="text-sm">
                Deposit to reserve:{" "}
                <span className="font-semibold">{formatUsd(pkg.depositCents)}</span>
              </p>
            </article>
          ))}
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-5 text-sm text-zinc-700">
          Optional add-ons include catering support and wedding manager services.
        </div>
        <div className="flex gap-3">
          <Link
            href="/reserve"
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white"
          >
            Reserve a Date
          </Link>
          <Link
            href="/book-a-tour"
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-900"
          >
            Tour the Property
          </Link>
        </div>
      </div>
    </main>
  );
}
