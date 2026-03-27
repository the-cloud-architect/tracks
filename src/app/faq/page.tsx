import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ | Wedding Tracks",
  description:
    "Frequently asked questions about bookings, guest capacity, amenities, and policies at Wedding Tracks.",
};

const faqs = [
  {
    q: "How many guests can the venue hold?",
    a: "The gazebo ceremony setup is designed for up to 40 guests.",
  },
  {
    q: "Is overnight lodging available?",
    a: "Yes. Packages can include access to the on-site 3-bedroom, 2-bath house.",
  },
  {
    q: "What time does the event need to end?",
    a: "Curfew starts at 11:00 PM EST.",
  },
  {
    q: "Do you offer optional services?",
    a: "Yes. Catering support and wedding manager services are available as add-ons.",
  },
  {
    q: "Is there enough parking?",
    a: "Yes. The property has space for approximately 25 cars.",
  },
  {
    q: "Can we schedule a tour before booking?",
    a: "Absolutely. Use the Book a Tour page to request your preview visit.",
  },
];

export default function FaqPage() {
  return (
    <main className="px-6 py-14 sm:px-10">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4">
        <section className="soft-panel rounded-3xl p-8 sm:p-10">
          <p className="eyebrow">Planning questions</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-5xl">
            Frequently asked questions
          </h1>
          <p className="mt-4 max-w-3xl leading-8 text-zinc-700">
            Everything couples ask most often before booking Wedding Tracks, from
            guest counts and lodging to logistics and timelines.
          </p>
        </section>
        {faqs.map((item) => (
          <article key={item.q} className="soft-panel rounded-2xl p-5">
            <h2 className="text-lg font-semibold tracking-tight">{item.q}</h2>
            <p className="mt-2 leading-7 text-zinc-700">{item.a}</p>
          </article>
        ))}
      </div>
    </main>
  );
}
