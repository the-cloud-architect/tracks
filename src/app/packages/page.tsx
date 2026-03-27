import type { Metadata } from "next";
import Link from "next/link";

import { formatUsd, getVenuePackages } from "@/lib/packages";
const packageImageByKey: Record<string, string> = {
  GAZEBO_ONLY: "/images/packages/package-1.jpg",
  GAZEBO_HOUSE_3_DAY: "/images/packages/package-2.jpg",
  GAZEBO_HOUSE_6_DAY: "/images/packages/package-3.jpg",
  GAZEBO_HOUSE_ATV: "/images/packages/package-4.jpg",
};
const packageHighlights: Record<string, string[]> = {
  GAZEBO_ONLY: [
    "Ideal for couples who want a focused ceremony-day experience",
    "Designed around intimate guest flow and elevated photography moments",
    "Simple, elegant structure with clear planning milestones",
  ],
  GAZEBO_HOUSE_3_DAY: [
    "A complete weekend rhythm: arrival, celebration, and relaxed departure",
    "House access supports bridal prep, family time, and overnight comfort",
    "Balanced for couples wanting depth without overextending timelines",
  ],
  GAZEBO_HOUSE_6_DAY: [
    "Extended destination format for multi-day hosting and memory making",
    "Ideal for guests traveling in and for events beyond ceremony day",
    "A slower, more luxurious cadence with room for meaningful moments",
  ],
  GAZEBO_HOUSE_ATV: [
    "Adds trail-based adventure for a truly signature weekend experience",
    "Perfect for couples blending refined celebration with outdoor personality",
    "Creates distinct welcome-day and recovery-day activity options",
  ],
};

export const metadata: Metadata = {
  title: "Packages | Wedding Tracks",
  description:
    "Explore signature Wedding Tracks collections designed for intimate ceremonies, weekend hosting, and elevated destination-style celebrations.",
};

export default async function PackagesPage() {
  const venuePackages = await getVenuePackages();
  return (
    <main className="px-6 py-14 sm:px-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <section className="soft-panel rounded-3xl p-8 sm:p-10">
          <p className="eyebrow">Collections and investment</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-5xl">
            Signature collections crafted for elegant weekends.
          </h1>
          <p className="mt-4 max-w-3xl leading-8 text-zinc-700">
            Wedding Tracks collections are built to be both elevated and
            practical: clear investment, thoughtful pacing, and curated space for
            intimate celebration. Every collection includes ceremony gazebo
            access, parking for approximately 25 vehicles, outside speaker system
            access, and three on-site external bathrooms. Curfew begins at 11:00
            PM EST.
          </p>
        </section>
        <section className="space-y-5">
          {venuePackages.map((pkg) => (
            <article key={pkg.key} className="soft-panel overflow-hidden rounded-3xl">
              <div className="grid gap-0 lg:grid-cols-[0.9fr_1.4fr]">
                <div className="border-b border-zinc-200/80 bg-white/80 p-6 lg:border-b-0 lg:border-r">
                  <p className="eyebrow">{pkg.duration}</p>
                  <h2 className="mt-2 text-3xl font-semibold tracking-[0.04em]">{pkg.name}</h2>
                  <p className="mt-3 text-sm leading-7 text-zinc-700">{pkg.summary}</p>
                  <div className="mt-5 space-y-2 border-t border-zinc-200 pt-4 text-sm">
                    <p>
                      Collection total:{" "}
                      <span className="font-semibold text-zinc-900">{formatUsd(pkg.priceCents)}</span>
                    </p>
                    <p>
                      Date-retainer deposit:{" "}
                      <span className="font-semibold text-zinc-900">
                        {formatUsd(pkg.depositCents)}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="p-6">
                  <div className="mb-5 overflow-hidden rounded-2xl">
                    <img
                      src={packageImageByKey[pkg.key]}
                      alt={`${pkg.name} package visual`}
                      className="h-60 w-full object-cover"
                    />
                  </div>
                  <p className="eyebrow">Why couples choose this</p>
                  <ul className="mt-3 space-y-3 text-zinc-700">
                    {(packageHighlights[pkg.key] ?? []).map((point) => (
                      <li key={point} className="flex gap-3 leading-7">
                        <span aria-hidden="true" className="mt-2 h-2 w-2 rounded-full bg-zinc-700" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6">
                    <Link
                      href={`/reserve?packageTier=${pkg.key}`}
                      className="inline-flex rounded-full border border-zinc-900 bg-zinc-900 px-6 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:opacity-90"
                    >
                      Reserve
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </section>
        <div className="soft-panel rounded-2xl p-5 text-base leading-8 text-zinc-700 sm:text-lg">
          Optional enhancements include catering support and wedding manager
          services, allowing you to tailor hospitality and flow around your exact
          guest experience vision.
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/reserve"
            className="rounded-full border border-zinc-900 bg-zinc-900 px-6 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:opacity-90"
          >
            Reserve a Date
          </Link>
          <Link
            href="/book-a-tour"
            className="rounded-full border border-zinc-300 bg-white/85 px-6 py-2.5 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-100"
          >
            Tour the Property
          </Link>
        </div>
      </div>
    </main>
  );
}
