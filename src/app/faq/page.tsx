import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ | Wedding Tracks",
  description:
    "Answers to common questions about Wedding Tracks, including guest count, lodging, tours, parking, package details, and wedding weekend logistics.",
};

const faqs = [
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
    q: "Are optional services available?",
    a: "Yes. Catering support and wedding manager services are available as add-on options.",
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
    <main className="px-6 py-14 sm:px-10">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4">
        <section className="soft-panel rounded-3xl p-8 sm:p-10">
          <p className="eyebrow">Planning questions</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-5xl">
            Frequently asked questions
          </h1>
          <p className="mt-4 max-w-3xl leading-8 text-zinc-700">
            A quick guide to the questions couples ask most often about guest count,
            lodging, package options, parking, and wedding weekend planning at Wedding Tracks.
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