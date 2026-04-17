import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

import { formatUsd, getVenuePackages } from "@/lib/packages";

const packageImageByKey: Record<string, string> = {
  GAZEBO_ONLY: "/images/packages/package-1.jpg",
  GAZEBO_HOUSE_3_DAY: "/images/packages/package-2.jpg",
  GAZEBO_HOUSE_ATV_3_DAY: "/images/packages/package-4.jpg",
  GAZEBO_HOUSE_6_DAY: "/images/packages/package-3.jpg",
  GAZEBO_HOUSE_ATV: "/images/packages/package-4.jpg",
};

const packageHighlights: Record<string, string[]> = {
  GAZEBO_ONLY: [
    "Ideal for couples who want a ceremony-centered wedding in a distinctive North Georgia setting",
    "Keeps the experience intimate, polished, and easy to manage",
    "A strong fit for couples who want beautiful scenery without committing to a full weekend stay",
  ],
  GAZEBO_HOUSE_3_DAY: [
    "Creates a true wedding weekend with time to arrive, celebrate, and unwind",
    "Includes house access for getting ready, hosting close family, and staying on property",
    "Balances destination-style atmosphere with a shorter, more manageable timeline",
  ],
  GAZEBO_HOUSE_ATV_3_DAY: [
    "Adds a signature trail-and-adventure element to a focused wedding weekend",
    "Ideal for couples who want the property’s outdoor character to be part of the experience",
    "Makes the stay more memorable without requiring a longer booking window",
  ],
  GAZEBO_HOUSE_6_DAY: [
    "Best for destination weddings with travel, downtime, and multiple hosted moments",
    "Gives couples room for welcome gatherings, the wedding day, and post-celebration rest",
    "Offers a slower pace that lets you actually enjoy the property instead of rushing through it",
  ],
  GAZEBO_HOUSE_ATV: [
    "The fullest destination-style experience, combining extended stay with signature trail access",
    "Designed for couples who want a wedding weekend that feels private, active, and one of a kind",
    "Provides extra room for hosted events, portraits, exploration, and post-wedding downtime",
  ],
};

export const metadata: Metadata = {
  title: "Packages | Wedding Tracks",
  description:
    "Explore Wedding Tracks packages for intimate North Georgia weddings, weekend stays, and destination-style celebrations with private property access and one-of-a-kind character.",
};

export default async function PackagesPage() {
  const venuePackages = await getVenuePackages();

  return (
    <main className="px-6 py-14 sm:px-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <section data-reveal className="soft-panel rounded-3xl p-8 sm:p-10">
          <p className="eyebrow">Packages and pricing</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-5xl">
            Wedding packages built for intimate celebrations and full weekend stays.
          </h1>
          <p className="mt-4 max-w-3xl leading-8 text-zinc-700">
            Wedding Tracks packages are designed for couples who want more than a basic venue
            rental. Whether you are planning a ceremony-focused day or a destination-style wedding
            weekend, each package is structured to keep the experience clear, beautiful, and easy
            to plan. Every package includes gazebo ceremony access, parking for approximately 25
            vehicles, use of the outside speaker system, and three on-site exterior bathrooms.
            Curfew begins at 11:00 PM EST.
          </p>
        </section>

        <section data-reveal className="space-y-5">
          {venuePackages.map((pkg) => (
            <article key={pkg.key} className="soft-panel overflow-hidden rounded-3xl">
              <div className="grid gap-0 lg:grid-cols-[0.9fr_1.4fr]">
                <div className="border-b border-zinc-200/80 bg-white/80 p-6 lg:border-b-0 lg:border-r">
                  <p className="eyebrow">{pkg.duration}</p>
                  <h2 className="mt-2 text-3xl font-semibold tracking-[0.04em]">{pkg.name}</h2>
                  <p className="mt-3 text-sm leading-7 text-zinc-700">{pkg.summary}</p>

                  <div className="mt-5 space-y-2 border-t border-zinc-200 pt-4 text-sm">
                    <p>
                      Package total:{" "}
                      <span className="font-semibold text-zinc-900">{formatUsd(pkg.priceCents)}</span>
                    </p>
                    <p>
                      Date retainer deposit:{" "}
                      <span className="font-semibold text-zinc-900">
                        {formatUsd(pkg.depositCents)}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="p-6">
                  <div className="relative mb-5 h-60 overflow-hidden rounded-2xl">
                    <Image
                      src={packageImageByKey[pkg.key]}
                      alt={`${pkg.name} package visual`}
                      fill
                      sizes="(min-width: 1024px) 45vw, 100vw"
                      className="object-cover"
                    />
                  </div>

                  <p className="eyebrow">Why couples choose this package</p>
                  <ul className="mt-3 space-y-3 text-zinc-700">
                    {(packageHighlights[pkg.key] ?? []).map((point) => (
                      <li key={point} className="flex gap-3 leading-7">
                        <span
                          aria-hidden="true"
                          className="mt-2 h-2 w-2 rounded-full bg-zinc-700"
                        />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6">
                    <Link
                      href={`/reserve?packageTier=${pkg.key}`}
                      className="inline-flex rounded-full border border-zinc-900 bg-zinc-900 px-6 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:opacity-90"
                    >
                      Reserve this package
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </section>

        <div data-reveal className="soft-panel rounded-2xl p-5 text-base leading-8 text-zinc-700 sm:text-lg">
          Optional enhancements such as catering support and wedding management services can be
          added to shape the weekend around your guest experience, event flow, and hospitality
          priorities.
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/reserve"
            className="rounded-full border border-zinc-900 bg-zinc-900 px-6 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:opacity-90"
          >
            Reserve a date
          </Link>
          <Link
            href="/book-a-tour"
            className="rounded-full border border-zinc-300 bg-white/85 px-6 py-2.5 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-100"
          >
            Tour the property
          </Link>
        </div>
      </div>
    </main>
  );
}
