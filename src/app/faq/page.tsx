import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ | Wedding Tracks",
  description:
    "Answers to common questions about Wedding Tracks, including catering, site-manager support, ATV use, lodging, tours, parking, and wedding weekend logistics.",
};

const planningFaqs = [
  {
    q: "How many guests can Wedding Tracks accommodate?",
    a: "Our gazebo ceremony setup is designed for intimate weddings of up to 40 guests.",
  },
  {
    q: "Is overnight lodging available on the property?",
    a: "Yes. Select packages include access to the on-site 3-bedroom, 2-bath house for overnight stays, getting ready, and a more relaxed wedding weekend experience.",
  },
  {
    q: "Can we tour the property before booking?",
    a: "Yes. We encourage couples to schedule a private tour so you can experience the grounds, ceremony space, and overall flow before reserving a date.",
  },
  {
    q: "What is included with every package?",
    a: "Every package includes gazebo ceremony access, parking for approximately 20 vehicles, use of the outside speaker system, and access to three on-site exterior bathrooms.",
  },
  {
    q: "What time do events need to end?",
    a: "Curfew begins at 11:00 PM EST.",
  },
  {
    q: "Is parking available for guests?",
    a: "Yes. The property can accommodate approximately 25 vehicles.",
  },
  {
    q: "Do all packages include the house?",
    a: "No. Some packages are ceremony-focused, while others include the on-site house for a full wedding weekend or honeymoon-style stay.",
  },
  {
    q: "Do you offer packages for more than just the wedding day?",
    a: "Yes. Wedding Tracks offers packages built around both shorter celebrations and extended weekend stays, depending on how much time you want on the property.",
  },
  {
    q: "Is Wedding Tracks a good fit for a destination-style wedding?",
    a: "Yes. The property is designed for couples who want more than a one-day venue rental, with on-site lodging, private grounds, and a setting that works well for a full wedding weekend.",
  },
  {
    q: "What makes the property unique?",
    a: "Wedding Tracks combines intimate ceremony space with a one-of-a-kind North Georgia setting that includes manicured grounds, a scenic pond, wooded trails, and railroad character.",
  },
  {
    q: "Is the venue close to Ellijay activities?",
    a: "Yes. Wedding Tracks is about 25 minutes west of downtown Ellijay, with easy access to orchards, vineyards, rafting, and other North Georgia attractions.",
  },
];

export default function FaqPage() {
  return (
    <main className="px-4 py-10 sm:px-8 lg:px-10">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4">
        <section className="soft-panel rounded-3xl p-7 sm:p-9">
          <p className="eyebrow">Planning questions</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Frequently asked questions
          </h1>
          <p className="mt-3 max-w-3xl leading-7 text-zinc-700">
            Practical answers about meals, on-site support, ATV access, lodging, and the
            details that keep your wedding weekend moving comfortably.
          </p>
        </section>

        <section aria-labelledby="food-and-support" className="grid gap-4 lg:grid-cols-2">
          <article className="soft-panel rounded-2xl p-6">
            <p className="eyebrow">Food & dining</p>
            <h2 id="food-and-support" className="mt-2 text-2xl font-semibold tracking-tight">
              What restaurant and catering options are available?
            </h2>
            <p className="mt-3 leading-7 text-zinc-700">
              You may choose from our preferred vendors or bring your own caterer. Depending
              on the atmosphere and service level you want, the most common options are:
            </p>
            <ul className="mt-3 space-y-2 text-zinc-700">
              <li>
                <span className="font-semibold text-zinc-900">Restaurant pickup:</span> order
                favorite dishes locally and appoint someone to collect them before dinner.
              </li>
              <li>
                <span className="font-semibold text-zinc-900">Restaurant drop-off:</span> have
                prepared trays or a buffet delivered for your group to serve.
              </li>
              <li>
                <span className="font-semibold text-zinc-900">Full-service catering:</span> hire
                a team to deliver, set up, serve, and handle meal cleanup.
              </li>
            </ul>
            <p className="mt-3 border-t border-[#dbc8b5] pt-3 text-sm leading-6 text-zinc-600">
              There is no on-site kitchen, so select a menu that travels well and needs minimal
              finishing. Elegant disposable place settings or foods requiring few utensils work
              especially well. We will share the current preferred-vendor list during planning.
            </p>
          </article>

          <article className="soft-panel rounded-2xl p-6">
            <p className="eyebrow">Your on-site point person</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">
              When will the site manager arrive, and what will they help with?
            </h2>
            <p className="mt-3 leading-7 text-zinc-700">
              For celebrations that include site-manager support, the manager&apos;s exact arrival
              time is set in your final event timeline and confirmed before the wedding day. They
              arrive before guests so you have a point person in place as the celebration begins.
            </p>
            <ul className="mt-3 space-y-2 text-zinc-700">
              <li>Connect your favorite playlist to the Wi-Fi-enabled outdoor speakers.</li>
              <li>Troubleshoot venue, sound-system, and property questions as they arise.</li>
              <li>Keep shared areas tidy and help the day&apos;s on-site flow stay on track.</li>
            </ul>
            <p className="mt-3 border-t border-[#dbc8b5] pt-3 text-sm leading-6 text-zinc-600">
              The site manager supports the venue itself; your caterer, planner, DJ, and other
              vendors remain responsible for the services in their agreements.
            </p>
          </article>
        </section>

        <section aria-labelledby="atv-heading" className="soft-panel overflow-hidden rounded-2xl">
          <div className="grid lg:grid-cols-[0.86fr_1.14fr]">
            <div className="p-6 sm:p-7">
              <p className="eyebrow">ATV experience</p>
              <h2 id="atv-heading" className="mt-2 text-2xl font-semibold tracking-tight">
                How do the ATVs work?
              </h2>
              <p className="mt-3 leading-7 text-zinc-700">
                Guided ATV trail access is included only with ATV Experience packages. Before
                anyone rides, the venue team reviews the machine controls, approved trail route,
                protective gear, passenger limits, and the day&apos;s trail conditions. Riders must
                follow the on-site briefing, posted rules, and any eligibility or waiver
                requirements provided with the booking.
              </p>
              <p className="mt-3 text-sm leading-6 text-zinc-600">
                Stay on designated trails, use the required safety gear, and never operate an ATV
                after drinking. Weather or trail conditions may require access to be delayed or
                closed. The video is an overview and does not replace the venue&apos;s hands-on briefing.
              </p>
            </div>
            <div className="bg-[#2f261f] p-4 sm:p-5">
              <div className="aspect-video overflow-hidden rounded-xl bg-black">
                <iframe
                  className="size-full"
                  src="https://www.youtube-nocookie.com/embed/y2cae_BtpfE"
                  title="Five-minute ATV safety overview"
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[#fff9f2]">
                <p className="font-semibold">ATV safety overview</p>
                <span className="rounded-full border border-white/30 px-2.5 py-1 text-xs font-semibold">
                  5:36 video
                </span>
              </div>
              <p className="mt-1 text-sm leading-6 text-[#d9c2ab]">
                A short safety primer from Dirt Trax TV. Your venue briefing takes priority.
              </p>
            </div>
          </div>
        </section>

        <section aria-labelledby="more-questions" className="mt-1">
          <h2 id="more-questions" className="mb-3 text-2xl font-semibold tracking-tight">
            More planning questions
          </h2>
          <div className="space-y-3">
            {planningFaqs.map((item) => (
              <details key={item.q} className="group soft-panel rounded-2xl p-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold tracking-tight">
                  {item.q}
                  <span
                    aria-hidden="true"
                    className="text-xl font-normal text-[#76543c] transition-transform group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-3 border-t border-[#dbc8b5] pt-3 leading-7 text-zinc-700">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
