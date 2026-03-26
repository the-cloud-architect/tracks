import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | Tracks and Champagne",
  description:
    "Contact Tracks and Champagne in Chatsworth, GA for wedding package questions, tours, and availability.",
};

export default function ContactPage() {
  return (
    <main className="px-6 py-14 sm:px-10">
      <div className="mx-auto w-full max-w-4xl rounded-2xl bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold tracking-tight">Contact</h1>
        <p className="mt-4 leading-8 text-zinc-700">
          Tracks and Champagne is located in Chatsworth, Georgia, about 25 minutes
          from Ellijay. Reach out for package details, custom weekend options, and
          preview tour scheduling.
        </p>
        <div className="mt-6 space-y-2 text-zinc-700">
          <p>Email: hello@tracksandchampagne.com (placeholder)</p>
          <p>Phone: (000) 000-0000 (placeholder)</p>
          <p>Service area: North Georgia destination-style intimate weddings</p>
        </div>
      </div>
    </main>
  );
}
