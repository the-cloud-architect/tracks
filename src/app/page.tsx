import Link from "next/link";

import { ellijayActivities } from "@/lib/ellijay";
import { getSessionUser } from "@/lib/auth/session";
import { getPrismaClient } from "@/lib/prisma";
import { tryGetR2ObjectUrl } from "@/lib/r2";
import { StickyMobileNav } from "./sticky-mobile-nav";

const venueSchema = {
  "@context": "https://schema.org",
  "@type": "EventVenue",
  name: "Wedding Tracks",
  description:
    "Private North Georgia destination wedding venue with overnight accommodations, honeymoon stays, manicured grounds, private trails, pond views, and a one-of-a-kind railroad setting near Ellijay.",
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

  // Fetch desktop and mobile hero videos separately
  const [desktopVideoAsset, mobileVideoAsset, legacyVideoAsset] = await Promise.all([
    prisma.mediaAsset.findFirst({
      where: { status: "ACTIVE", type: "VIDEO", sourceUrl: "HERO_VIDEO_DESKTOP" },
      select: { objectKey: true },
    }).catch(() => null),
    prisma.mediaAsset.findFirst({
      where: { status: "ACTIVE", type: "VIDEO", sourceUrl: "HERO_VIDEO_MOBILE" },
      select: { objectKey: true },
    }).catch(() => null),
    prisma.mediaAsset.findFirst({
      where: { status: "ACTIVE", type: "VIDEO", sourceUrl: "HERO_VIDEO" },
      select: { objectKey: true },
    }).catch(() => null),
  ]);

  // Desktop video: use desktop, fallback to legacy, fallback to default
  const desktopVideoKey = desktopVideoAsset?.objectKey ?? legacyVideoAsset?.objectKey;
  const desktopVideoUrl = desktopVideoKey
    ? tryGetR2ObjectUrl(desktopVideoKey)
    : "/videos/wedding-hero.mp4";
  const desktopPosterUrl = desktopVideoKey
    ? tryGetR2ObjectUrl(
        `video-thumbnails/${desktopVideoKey.replace(/^videos\//, "").replace(/\.[^.]+$/, "")}.jpg`,
      )
    : "/images/hero-share.jpg";

  // Mobile video: use mobile-specific, fallback to desktop
  const mobileVideoKey = mobileVideoAsset?.objectKey ?? desktopVideoKey;
  const mobileVideoUrl = mobileVideoKey
    ? tryGetR2ObjectUrl(mobileVideoKey)
    : "/videos/wedding-hero.mp4";
  const mobilePosterUrl = mobileVideoKey
    ? tryGetR2ObjectUrl(
        `video-thumbnails/${mobileVideoKey.replace(/^videos\//, "").replace(/\.[^.]+$/, "")}.jpg`,
      )
    : "/images/hero-share.jpg";

  const featuredActivities = ellijayActivities.slice(0, 4);

  return (
    <main className="text-zinc-900" data-home="true">
      <StickyMobileNav user={user} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(venueSchema) }}
      />

      <section className="relative w-full overflow-hidden bg-black sm:min-h-screen">
        {/* Mobile: square aspect ratio video with overlaid content */}
        <div className="relative aspect-square w-full sm:hidden">
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            poster={mobilePosterUrl ?? undefined}
            data-hero-video
            className="absolute inset-0 h-full w-full object-cover"
            src={mobileVideoUrl ?? undefined}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-black/15" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

          {/* Mobile overlay content */}
          <div className="absolute inset-0 flex flex-col justify-between p-3 max-[380px]:p-2.5">
            <nav className="w-full max-w-[10.5rem] rounded-2xl bg-transparent p-0.5 max-[380px]:max-w-[9.25rem]">
              <ul className="space-y-0 text-[11px] font-semibold leading-tight text-white max-[380px]:text-[10px]">
                <li>
                  <Link href="/" className="block rounded px-2 py-1 hover:bg-white/15">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/book-a-tour" className="block rounded px-2 py-1 hover:bg-white/15">
                    Tours
                  </Link>
                </li>
                <li>
                  <Link href="/things-to-do" className="block rounded px-2 py-1 hover:bg-white/15">
                    Things to Do
                  </Link>
                </li>
                <li>
                  <Link href="/packages" className="block rounded px-2 py-1 hover:bg-white/15">
                    Packages
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="block rounded px-2 py-1 hover:bg-white/15">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/gallery" className="block rounded px-2 py-1 hover:bg-white/15">
                    Gallery
                  </Link>
                </li>
                <li>
                  <Link href="/reserve" className="block rounded px-2 py-1 hover:bg-white/15">
                    Reserve
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="block rounded px-2 py-1 hover:bg-white/15">
                    FAQs
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="block rounded px-2 py-1 hover:bg-white/15">
                    Contact
                  </Link>
                </li>
                {user ? (
                  <>
                    <li>
                      <Link href="/account" className="block rounded px-2 py-1 hover:bg-white/15">
                        Account
                      </Link>
                    </li>
                    {user.role === "OWNER" ? (
                      <li>
                        <Link href="/admin" className="block rounded px-2 py-1 hover:bg-white/15">
                          Admin dashboard
                        </Link>
                      </li>
                    ) : null}
                  </>
                ) : (
                  <>
                    <li>
                      <Link
                        href="/auth/sign-in"
                        className="block rounded px-2 py-1 hover:bg-white/15"
                      >
                        Sign in
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/auth/register"
                        className="block rounded px-2 py-1 hover:bg-white/15"
                      >
                        Create account
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </nav>

            <div className="max-w-4xl space-y-3 pb-2 text-white max-[380px]:space-y-2">
              <p className="eyebrow text-white">
                Chatsworth, Georgia
                <br />
                25 minutes west of downtown Ellijay
              </p>

              <h1 className="font-[family-name:var(--font-dancing)] text-5xl font-normal leading-[1.1] max-[380px]:text-4xl">
                Wedding Tracks
              </h1>

              <div className="hero-divider" aria-hidden="true">
                <span />
                <span />
                <span />
              </div>

              <p className="max-w-3xl text-xs tracking-[0.18em] text-zinc-100/90 uppercase">
                North Georgia Destination Wedding Venue
              </p>

              <div className="flex flex-col gap-2 pt-1">
                <Link
                  href="/book-a-tour"
                  className="w-full rounded-full border border-white/70 bg-gradient-to-r from-white via-rose-50 to-amber-50 px-5 py-2.5 text-center text-xs font-semibold uppercase tracking-[0.1em] text-zinc-900 shadow-[0_8px_30px_rgba(0,0,0,0.28)] transition hover:-translate-y-0.5 hover:brightness-105 max-[380px]:px-4"
                >
                  Schedule a private tour
                </Link>
                <Link
                  href="/packages"
                  className="w-full rounded-full border border-white/75 bg-black/30 px-5 py-2.5 text-center text-xs font-semibold uppercase tracking-[0.1em] text-white shadow-[0_8px_30px_rgba(0,0,0,0.28)] transition hover:-translate-y-0.5 hover:bg-black/45 max-[380px]:px-4"
                >
                  View wedding packages
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop: full screen video */}
        <div className="absolute inset-0 hidden sm:block">
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            poster={desktopPosterUrl ?? undefined}
            data-hero-video
            className="absolute inset-0 h-full w-full object-cover"
            src={desktopVideoUrl ?? undefined}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-black/15" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        </div>

        {/* Desktop content */}
        <div className="relative hidden min-h-screen flex-col justify-between p-10 sm:flex">
          <nav className="w-full max-w-[10.5rem] rounded-2xl bg-transparent p-0.5 max-[380px]:max-w-[9.25rem] sm:w-fit sm:max-w-[14.5rem] sm:p-1">
            <ul className="space-y-0 text-[11px] font-semibold leading-tight text-white max-[380px]:text-[10px] sm:space-y-0.5 sm:text-sm">
              <li>
                <Link href="/" className="block rounded px-2 py-1 sm:py-1.5 hover:bg-white/15">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/book-a-tour"
                  className="block rounded px-2 py-1 sm:py-1.5 hover:bg-white/15"
                >
                  Tours
                </Link>
              </li>
              <li>
                <Link
                  href="/things-to-do"
                  className="block rounded px-2 py-1 sm:py-1.5 hover:bg-white/15"
                >
                  Things to Do
                </Link>
              </li>
              <li>
                <Link
                  href="/packages"
                  className="block rounded px-2 py-1 sm:py-1.5 hover:bg-white/15"
                >
                  Packages
                </Link>
              </li>
              <li>
                <Link href="/about" className="block rounded px-2 py-1 sm:py-1.5 hover:bg-white/15">
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/gallery"
                  className="block rounded px-2 py-1 sm:py-1.5 hover:bg-white/15"
                >
                  Gallery
                </Link>
              </li>
              <li>
                <Link
                  href="/reserve"
                  className="block rounded px-2 py-1 sm:py-1.5 hover:bg-white/15"
                >
                  Reserve
                </Link>
              </li>
              <li>
                <Link href="/faq" className="block rounded px-2 py-1 sm:py-1.5 hover:bg-white/15">
                  FAQs
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="block rounded px-2 py-1 sm:py-1.5 hover:bg-white/15"
                >
                  Contact
                </Link>
              </li>
              {user ? (
                <>
                  <li>
                    <Link
                      href="/account"
                      className="block rounded px-2 py-1 sm:py-1.5 hover:bg-white/15"
                    >
                      Account
                    </Link>
                  </li>
                  {user.role === "OWNER" ? (
                    <li>
                      <Link
                        href="/admin"
                        className="block rounded px-2 py-1 sm:py-1.5 hover:bg-white/15"
                      >
                        Admin dashboard
                      </Link>
                    </li>
                  ) : null}
                </>
              ) : (
                <>
                  <li>
                    <Link
                      href="/auth/sign-in"
                      className="block rounded px-2 py-1 sm:py-1.5 hover:bg-white/15"
                    >
                      Sign in
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/auth/register"
                      className="block rounded px-2 py-1 sm:py-1.5 hover:bg-white/15"
                    >
                      Create account
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>

          <div className="max-w-4xl space-y-4 pb-4 text-white max-[380px]:space-y-3 sm:space-y-6 sm:pb-8">
            <p className="eyebrow text-zinc-100">
              Chatsworth, Georgia
              <br />
              25 minutes west of downtown Ellijay
            </p>

            <h1 className="font-[family-name:var(--font-dancing)] text-6xl font-normal leading-[1.1] sm:text-8xl lg:text-9xl">
              Wedding Tracks
            </h1>

            <div className="hero-divider" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>

            <p className="max-w-3xl text-sm tracking-[0.2em] text-zinc-100/90 uppercase sm:text-lg sm:tracking-[0.34em]">
              North Georgia Destination Wedding and Honeymoon Venue
            </p>

            <p className="max-w-3xl text-lg leading-7 text-zinc-100/95 sm:text-2xl sm:leading-10">
              <span className="hero-dropcap">A</span> private wedding weekend retreat on the
              railroad tracks.
            </p>

            <p className="max-w-3xl text-base leading-7 text-zinc-100/95 max-[380px]:text-[15px] max-[380px]:leading-6 sm:text-lg sm:leading-8">
              Set in the rolling hills of North Georgia near Ellijay, Wedding Tracks offers 17
              acres of manicured grounds, a scenic pond, wooded trails, and overnight
              accommodations alongside an active commercial railroad. It is a one-of-a-kind
              Southern destination wedding venue for couples who want intimate celebrations,
              cinematic photography, and a honeymoon stay near vineyards, orchards, rafting, and
              mountain adventure.
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
                View wedding packages
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-10 sm:gap-8 sm:px-8 sm:py-14 lg:px-12">
        <section className="grid gap-5 lg:grid-cols-3">
          <article className="soft-panel rounded-2xl p-6">
            <p className="eyebrow">Ceremony</p>
            <h2 className="mt-2 text-2xl font-semibold">Intimate weddings with destination appeal</h2>
            <p className="mt-3 text-sm leading-7 text-zinc-700">
              Exchange vows in a private North Georgia setting with manicured grounds, pond views,
              and cinematic backdrops designed for meaningful gatherings, beautiful photography,
              and a relaxed wedding weekend atmosphere.
            </p>
          </article>

          <article className="soft-panel rounded-2xl p-6">
            <p className="eyebrow">Weekend stay</p>
            <h2 className="mt-2 text-2xl font-semibold">Celebrate here. Stay here. Honeymoon here.</h2>
            <p className="mt-3 text-sm leading-7 text-zinc-700">
              Turn your wedding day into a full destination-style weekend with overnight
              accommodations, private trails, and a secluded estate that invites couples to linger
              long after the ceremony ends.
            </p>
          </article>

          <article className="soft-panel rounded-2xl p-6">
            <p className="eyebrow">Planning support</p>
            <h2 className="mt-2 text-2xl font-semibold">Straightforward packages, personal guidance</h2>
            <p className="mt-3 text-sm leading-7 text-zinc-700">
              Clear pricing, simple reservation steps, and direct owner support make planning feel
              easier, so you can focus on the celebration instead of getting buried in venue
              logistics.
            </p>
          </article>
        </section>

        <section className="soft-panel rounded-3xl p-8 sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
            <div>
              <p className="eyebrow">Why couples choose us</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight">
                A private North Georgia wedding venue with room to breathe.
              </h2>
              <p className="mt-4 leading-8 text-zinc-700">
                Wedding Tracks blends intimate scale, cinematic scenery, and weekend-stay
                flexibility for couples who want a destination wedding feel without leaving North
                Georgia.
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white/80 p-6">
              <p className="text-sm font-medium uppercase tracking-[0.16em] text-zinc-500">
                Quick facts
              </p>
              <ul className="mt-4 space-y-2 text-sm text-zinc-700">
                <li>• Ceremony capacity: up to 40 guests</li>
                <li>• Parking for approximately 25 vehicles</li>
                <li>• 17 acres with manicured grounds, pond views, and private trails</li>
                <li>• Curfew at 11:00 PM EST</li>
                <li>• Private tours, package options, and date reservation flow</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="soft-panel rounded-3xl p-8 sm:p-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Things to do nearby</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight">
                Build a wedding weekend your guests will actually enjoy.
              </h2>
              <p className="mt-3 max-w-3xl leading-8 text-zinc-700">
                From Ellijay orchards and vineyard tastings to rafting, hiking, and downtown
                strolls, the area around Wedding Tracks makes it easy to turn your celebration into
                a North Georgia getaway.
              </p>
            </div>

            <Link
              href="/things-to-do"
              className="rounded-full border border-zinc-300 bg-white/80 px-5 py-2.5 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-100"
            >
              Explore the Ellijay guide
            </Link>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {featuredActivities.map((activity) => (
              <article
                key={activity.name}
                className="rounded-2xl border border-zinc-200 bg-white/80 p-5"
              >
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