import type { Metadata } from "next";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = {
  title: "Contact | Wedding Tracks",
  description:
    "Contact Wedding Tracks in Chatsworth, GA for wedding package questions, tours, and availability.",
};

export default function ContactPage() {
  return (
    <main className="px-6 py-14 sm:px-10">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <section className="soft-panel rounded-3xl p-8 sm:p-10">
          <p className="eyebrow">Start the conversation</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-5xl">
            Let&apos;s plan a wedding weekend that feels unmistakably yours.
          </h1>
          <p className="mt-4 max-w-3xl leading-8 text-zinc-700">
            Wedding Tracks is based in North Georgia, approximately 25
            minutes west of Ellijay. Reach out for current availability, package
            guidance, custom weekend ideas, and private tour scheduling.
          </p>
        </section>
        <div className="soft-panel rounded-2xl p-6 text-zinc-700">
          <p className="text-sm uppercase tracking-[0.16em] text-zinc-500">
            Contact details
          </p>
          <div className="mt-4 space-y-2 leading-7">
            <p>Email: hello@tracksandchampagne.com</p>
            <p>Service area: North Georgia (25 minutes west of Ellijay)</p>
          </div>
          <p className="mt-4 text-sm text-zinc-600">
            For fastest response, include your ideal date range, estimated guest
            count, and whether you are interested in a single-day or weekend
            package.
          </p>
          <ContactForm />
        </div>
      </div>
    </main>
  );
}
