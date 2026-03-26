import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ | Tracks and Champagne",
  description:
    "Frequently asked questions about bookings, guest capacity, amenities, and policies at Tracks and Champagne.",
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
      <div className="mx-auto w-full max-w-4xl space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">Frequently Asked Questions</h1>
        {faqs.map((item) => (
          <article key={item.q} className="rounded-xl bg-white p-5 shadow-sm">
            <h2 className="font-semibold">{item.q}</h2>
            <p className="mt-2 text-zinc-700">{item.a}</p>
          </article>
        ))}
      </div>
    </main>
  );
}
