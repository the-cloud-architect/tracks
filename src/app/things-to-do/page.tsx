import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

import { ellijayActivities } from "@/lib/ellijay";
import { getPointsOfInterest } from "@/lib/points-of-interest";
import { ThingsToDoMapPanel } from "./map-panel";

export const metadata: Metadata = {
  title: "Things to Do | Wedding Tracks",
  description:
    "Guest-friendly Ellijay and North Georgia recommendations including orchards, wineries, downtown stops, and outdoor adventures.",
};

export default async function ThingsToDoPage() {
  const pointsOfInterest = await getPointsOfInterest();
  return (
    <main className="px-4 py-10 sm:px-8 lg:px-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <section data-reveal className="soft-panel rounded-3xl p-8 sm:p-10">
          <p className="eyebrow">Area guide</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-5xl">
            Things to do around Ellijay, Georgia
          </h1>
          <p className="mt-4 max-w-3xl leading-8 text-zinc-700">
            
            Local recommendations for food, scenery, and adventure during your stay
          </p>
        </section>

        <ThingsToDoMapPanel places={pointsOfInterest} />

        <section data-reveal className="grid gap-4 md:grid-cols-2">
          {ellijayActivities.map((activity) => (
            <article key={activity.name} className="soft-panel overflow-hidden rounded-2xl">
              <div className="relative aspect-[16/10] bg-zinc-100">
                <Image
                  src={activity.imagePath}
                  alt={activity.name}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <p className="eyebrow">{activity.category}</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight">{activity.name}</h2>
                <p className="mt-3 text-base leading-7 text-zinc-700">{activity.description}</p>
              <a
                href={activity.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex text-sm font-medium text-zinc-700 underline decoration-zinc-300 underline-offset-4 hover:text-zinc-900"
              >
                Source: {activity.sourceLabel}
              </a>
              </div>
            </article>
          ))}
        </section>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/book-a-tour"
            className="rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:opacity-90"
          >
            Schedule a private tour
          </Link>
          <Link
            href="/gallery"
            className="rounded-full border border-zinc-300 bg-white/80 px-5 py-2.5 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-100"
          >
            View gallery
          </Link>
        </div>
      </div>
    </main>
  );
}
