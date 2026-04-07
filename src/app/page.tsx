import Link from "next/link";

import { ellijayActivities } from "@/lib/ellijay";
import { getSessionUser } from "@/lib/auth/session";
import { getPrismaClient } from "@/lib/prisma";
import { tryGetR2ObjectUrl } from "@/lib/r2";
const venueSchema = {
  "@context": "https://schema.org",
  "@type": "EventVenue",
  name: "Wedding Tracks",
  description:
    "Elegant wedding venue featuring intimate ceremony spaces, overnight accommodations, and curated weekend wedding experiences.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Chatsworth",
    addressRegion: "GA",
    addressCountry: "US",
  },
  maximumAttendeeCapacity: 40,
};
export default async function Home() {
  const prisma = getPrismaClient();
  const user = await getSessionUser();
  const heroVideoAsset = await prisma.mediaAsset
    .findFirst({
      where: {
        status: "ACTIVE",
        type: "VIDEO",
        sourceUrl: "HERO_VIDEO",
      },
      orderBy: { updatedAt: "desc" },
      select: { objectKey: true },
    })
    .catch(() => null);

  const heroVideoUrl =
    (heroVideoAsset?.objectKey
      ? tryGetR2ObjectUrl(heroVideoAsset.objectKey)
      : null) ?? "/videos/wedding-hero.mp4";
  const featuredActivities = ellijayActivities.slice(0, 4);
  return (
    <main className="text-zinc-900" data-home="true">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(venueSchema) }}
      />
      <section className="relative min-h-screen w-full overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          className="absolute inset-0 h-full w-full object-cover"
          src={heroVideoUrl}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-black/15" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        <div className="relative flex min-h-screen flex-col justify-between p-4 max-[380px]:p-3 sm:p-10">
          <nav className="w-full max-w-[14.5rem] rounded-2xl bg-transparent p-1 max-[380px]:max-w-[12.75rem] sm:w-fit">
            <ul className="space-y-0.5 text-xs font-semibold text-white max-[380px]:text-[11px] sm:text-sm">
              <li>
                <Link href="/" className="block rounded px-2 py-1.5 hover:bg-white/15">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/book-a-tour" className="block rounded px-2 py-1.5 hover:bg-white/15">
                  Schedule
                </Link>
              </li>
              <li>
                <Link href="/things-to-do" className="block rounded px-2 py-1.5 hover:bg-white/15">
                  Travel
                </Link>
              </li>
              <li>
                <Link href="/packages" className="block rounded px-2 py-1.5 hover:bg-white/15">
                  Collections
                </Link>
              </li>
              <li>
                <Link href="/about" className="block rounded px-2 py-1.5 hover:bg-white/15">
                  About
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="block rounded px-2 py-1.5 hover:bg-white/15">
                  Gallery
                </Link>
              </li>
              <li>
                <Link href="/reserve" className="block rounded px-2 py-1.5 hover:bg-white/15">
                  Reserve
                </Link>
              </li>
              <li>
                <Link href="/faq" className="block rounded px-2 py-1.5 hover:bg-white/15">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="/contact" className="block rounded px-2 py-1.5 hover:bg-white/15">
                  Contact
                </Link>
              </li>
              {user ? (
                <>
                  <li>
                    <Link href="/account" className="block rounded px-2 py-1.5 hover:bg-white/15">
                      Account
                    </Link>
                  </li>
                  {user.role === "OWNER" ? (
                    <li>
                      <Link href="/admin" className="block rounded px-2 py-1.5 hover:bg-white/15">
                        Admin dashboard
                      </Link>
                    </li>
                  ) : null}
                </>
              ) : (
                <>
                  <li>
                    <Link href="/auth/sign-in" className="block rounded px-2 py-1.5 hover:bg-white/15">
                      Sign in
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/auth/register"
                      className="block rounded px-2 py-1.5 hover:bg-white/15"
                    >
                      Create account
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>

          <div className="max-w-4xl space-y-4 pb-4 text-white max-[380px]:space-y-3 sm:space-y-6 sm:pb-8">
            <p className="eyebrow text-zinc-100">Chatsworth, Georgia · 25 minutes west of downtown Ellijay</p>
            <h1 className="text-5xl font-semibold leading-[0.9] tracking-[0.07em] uppercase max-[380px]:text-4xl sm:text-7xl lg:text-8xl">
              Wedding Tracks
            </h1>
            <div className="hero-divider" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            <p className="max-w-3xl text-sm tracking-[0.2em] text-zinc-100/90 uppercase sm:text-lg sm:tracking-[0.34em]">
              Wedding Estate · Destination-Style Weekend Celebrations
            </p>
            <p className="max-w-3xl text-lg leading-7 text-zinc-100/95 sm:text-2xl sm:leading-10">
              <span className="hero-dropcap">A</span> romantic wedding estate where your weekend feels as beautiful as
              your vows.
            </p>
            <p className="max-w-3xl text-base leading-7 text-zinc-100/95 max-[380px]:text-[15px] max-[380px]:leading-6 sm:text-lg sm:leading-8">
              Wedding Tracks pairs refined rustic character with destination-style
              intimacy for couples who want elegant storytelling, meaningful
              moments, and a celebration that feels deeply personal.
            </p>
            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-3">
              <Link
                href="/book-a-tour"
                className="w-full rounded-full border border-white/70 bg-gradient-to-r from-white via-rose-50 to-amber-50 px-6 py-3 text-center text-sm font-semibold uppercase tracking-[0.1em] text-zinc-900 shadow-[0_8px_30px_rgba(0,0,0,0.28)] transition hover:-translate-y-0.5 hover:brightness-105 max-[380px]:px-4 max-[380px]:text-xs sm:w-auto sm:px-7"
              >
                Schedule a private tour
              </Link>
              <Link
                href="/packages"
                className="w-full rounded-full border border-white/75 bg-black/30 px-6 py-3 text-center text-sm font-semibold uppercase tracking-[0.1em] text-white shadow-[0_8px_30px_rgba(0,0,0,0.28)] transition hover:-translate-y-0.5 hover:bg-black/45 max-[380px]:px-4 max-[380px]:text-xs sm:w-auto sm:px-7"
              >
                Explore collections
              </Link>
            </div>
          </div>
        </div>
      </section>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-10 sm:gap-8 sm:px-8 sm:py-14 lg:px-12">
        <section className="grid gap-5 lg:grid-cols-3">
          <article className="soft-panel rounded-2xl p-6">
            <p className="eyebrow">Ceremony</p>
            <h2 className="mt-2 text-2xl font-semibold">Intimate by design</h2>
            <p className="mt-3 text-sm leading-7 text-zinc-700">
              Host up to 40 guests in a setting that feels cinematic yet warm,
              with ceremony sightlines and flow planned for elevated photography
              and effortless guest experience.
            </p>
          </article>
          <article className="soft-panel rounded-2xl p-6">
            <p className="eyebrow">Weekend experience</p>
            <h2 className="mt-2 text-2xl font-semibold">Stay, celebrate, unwind</h2>
            <p className="mt-3 text-sm leading-7 text-zinc-700">
              Extend your wedding into a full weekend with on-site home
              accommodations, curated gathering spaces, and relaxed transition
              from rehearsal to send-off.
            </p>
          </article>
          <article className="soft-panel rounded-2xl p-6">
            <p className="eyebrow">Planning support</p>
            <h2 className="mt-2 text-2xl font-semibold">Clarity from first inquiry</h2>
            <p className="mt-3 text-sm leading-7 text-zinc-700">
              Transparent package pricing, date reservation workflow, and owner
              support designed to remove friction so you can focus on moments,
              not logistics.
            </p>
          </article>
        </section>

        <section className="soft-panel rounded-3xl p-8 sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
            <div>
              <p className="eyebrow">Why couples choose us</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight">
                A modern wedding atmosphere without the inflated complexity.
              </h2>
              <p className="mt-4 leading-8 text-zinc-700">
                From your first tour through your final toast, Wedding Tracks is
                built for couples who want timeless visuals, meaningful
                hospitality, and practical collections that still feel luxurious.
              </p>
            </div>
            <div className="rounded-2xl border border-zinc-200 bg-white/80 p-6">
              <p className="text-sm font-medium uppercase tracking-[0.16em] text-zinc-500">
                Quick facts
              </p>
              <ul className="mt-4 space-y-2 text-sm text-zinc-700">
                <li>• Ceremony capacity: up to 40 guests</li>
                <li>• Parking for approximately 25 vehicles</li>
                <li>• Curfew at 11:00 PM EST</li>
                <li>• Online tour requests and date reservation flow</li>
                <li>• Optional enhancements available by package</li>
              </ul>
            </div>
          </div>
        </section>
        <section className="soft-panel rounded-3xl p-8 sm:p-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Things to do in the area</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight">
                Ellijay activities your guests will love.
              </h2>
              <p className="mt-3 max-w-3xl leading-8 text-zinc-700">
                Build your wedding weekend itinerary with orchard visits, downtown
                strolls, vineyard tastings, and mountain adventures.
              </p>
            </div>
            <Link
              href="/things-to-do"
              className="rounded-full border border-zinc-300 bg-white/80 px-5 py-2.5 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-100"
            >
              View full Ellijay guide
            </Link>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {featuredActivities.map((activity) => (
              <article key={activity.name} className="rounded-2xl border border-zinc-200 bg-white/80 p-5">
                <p className="eyebrow">{activity.category}</p>
                <h3 className="mt-2 text-xl font-semibold tracking-tight">{activity.name}</h3>
                <p className="mt-2 text-sm leading-7 text-zinc-700">{activity.description}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
