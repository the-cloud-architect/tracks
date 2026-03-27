import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About | Wedding Tracks",
  description:
    "Learn about the story behind Wedding Tracks, a unique affordable wedding venue in Chatsworth, Georgia.",
};

export default function AboutPage() {
  return (
    <main className="px-6 py-14 sm:px-10">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <section className="soft-panel rounded-3xl p-8 sm:p-10">
          <p className="eyebrow">Our story</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">
            Rooted in North Georgia, designed for heartfelt wedding weekends.
          </h1>
          <p className="mt-4 max-w-3xl leading-8 text-zinc-700">
            Wedding Tracks was created by our team to give couples a
            wedding experience that feels elevated, personal, and surprisingly
            approachable. The vision was simple: pair beautiful scenery with a
            practical planning path so couples can celebrate fully without the
            stress of oversized venue logistics.
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
                Built with intention. Hosted with heart.
              </h2>
              <p className="mt-4 leading-8 text-zinc-700">
                From first inquiry to final send-off, we personally shape each
                celebration around your priorities. Our goal is simple: deliver
                a polished wedding experience that still feels warm, intimate,
                and unmistakably yours.
              </p>
            </div>
          </div>
        </section>
        <section className="grid gap-5 md:grid-cols-2">
          <article className="soft-panel rounded-2xl p-6">
            <p className="eyebrow">The estate</p>
            <h2 className="mt-2 text-2xl font-semibold">Character in every corner</h2>
            <p className="mt-3 leading-8 text-zinc-700">
              The property features a gazebo ceremony space along historic rail
              lines, a newly renovated 3-bedroom and 2-bath home inspired by
              classic depot architecture, and 17 acres of trails and gathering
              areas that turn your wedding day into a full, immersive weekend.
            </p>
          </article>
          <article className="soft-panel rounded-2xl p-6">
            <p className="eyebrow">The experience</p>
            <h2 className="mt-2 text-2xl font-semibold">Warm hospitality, refined pacing</h2>
            <p className="mt-3 leading-8 text-zinc-700">
              Couples choose Wedding Tracks for the way moments naturally
              unfold here: a relaxed arrival, intentional ceremony flow, golden
              hour portraits, and an evening that feels intimate from first look
              to final dance.
            </p>
          </article>
        </section>
        <div className="soft-panel rounded-2xl p-6">
          <p className="text-sm uppercase tracking-[0.16em] text-zinc-500">
            A message from the team
          </p>
          <p className="mt-3 leading-8 text-zinc-700">
            We believe extraordinary weddings should feel personal, not
            overwhelming. Every package is designed to help you host a meaningful
            celebration with clarity, comfort, and a beautiful setting your guests
            will talk about long after the weekend is over.
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
            Explore collections
          </Link>
        </div>
      </div>
    </main>
  );
}
