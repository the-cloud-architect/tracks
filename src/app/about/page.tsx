import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About | Wedding Tracks",
  description:
    "Learn the story behind Wedding Tracks, a private North Georgia wedding venue in Chatsworth with railroad character, weekend stays, and a one-of-a-kind 17-acre setting.",
};

export default function AboutPage() {
  return (
    <main className="px-6 py-14 sm:px-10">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <section className="soft-panel rounded-3xl p-8 sm:p-10">
          <p className="eyebrow">Our story</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">
            A North Georgia wedding retreat with character, privacy, and room to linger.
          </h1>
          <p className="mt-4 max-w-3xl leading-8 text-zinc-700">
            Wedding Tracks was created to offer couples something harder to find:
            a wedding venue that feels distinctive, personal, and grounded in place.
            Here, intimate celebrations unfold across a private 17-acre setting with
            manicured grounds, a scenic pond, wooded trails, and the unforgettable
            character of the railroad. The vision was never to create a venue that felt
            overbuilt or overcomplicated. It was to create a place where a wedding day
            could become a full wedding weekend.
          </p>
        </section>

        <section className="soft-panel overflow-hidden rounded-3xl">
          <div className="grid gap-0 md:grid-cols-[1fr_1.1fr]">
            <div className="aspect-[4/5] bg-zinc-100 md:aspect-auto">
              <img
                src="/images/owner/owner-feature.jpg"
                alt="Wedding Tracks owner feature portrait"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="p-8 sm:p-10">
              <p className="eyebrow">Owner-led hospitality</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight">
                Thoughtfully hosted from first tour to final send-off.
              </h2>
              <p className="mt-4 leading-8 text-zinc-700">
                Wedding Tracks is shaped by a hands-on, personal approach to hospitality.
                We work directly with couples to keep the experience clear, warm, and
                intentional from the first inquiry onward. The goal is simple: a celebration
                that feels elevated without feeling stiff, and supportive without ever
                becoming impersonal.
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-5 md:grid-cols-2">
          <article className="soft-panel rounded-2xl p-6">
            <p className="eyebrow">The estate</p>
            <h2 className="mt-2 text-2xl font-semibold">A one-of-a-kind setting with railroad character</h2>
            <p className="mt-3 leading-8 text-zinc-700">
              The property blends manicured wedding scenery with a setting that feels
              unmistakably its own. From the gazebo ceremony space near the historic
              rail line to the newly renovated 3-bedroom, 2-bath home inspired by depot
              architecture, every part of the estate adds to the experience. The result is
              a venue that feels cinematic, private, and deeply rooted in North Georgia.
            </p>
          </article>

          <article className="soft-panel rounded-2xl p-6">
            <p className="eyebrow">The experience</p>
            <h2 className="mt-2 text-2xl font-semibold">Designed for wedding weekends, not rushed timelines</h2>
            <p className="mt-3 leading-8 text-zinc-700">
              Couples choose Wedding Tracks for more than the ceremony itself. They choose
              it for the slower pace, the privacy, and the sense that the weekend can truly
              unfold here. With on-site accommodations and easy access to Ellijay vineyards,
              orchards, and outdoor adventure, the experience feels less like a venue rental
              and more like a destination-style celebration in North Georgia.
            </p>
          </article>
        </section>

        <div className="soft-panel rounded-2xl p-6">
          <p className="text-sm uppercase tracking-[0.16em] text-zinc-500">
            A message from the team
          </p>
          <p className="mt-3 leading-8 text-zinc-700">
            We believe weddings are most meaningful when they feel personal, well-paced,
            and true to the people gathering there. Everything at Wedding Tracks is meant
            to support that kind of celebration: beautiful surroundings, a distinctive
            sense of place, and a thoughtful planning experience that lets you stay present
            in the moments that matter.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/book-a-tour"
            className="rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:opacity-90"
          >
            Schedule a private tour
          </Link>
          <Link
            href="/packages"
            className="rounded-full border border-zinc-300 bg-white/80 px-5 py-2.5 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-100"
          >
            Explore packages
          </Link>
        </div>
      </div>
    </main>
  );
}