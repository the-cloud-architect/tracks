import type { Metadata } from "next";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = {
  title: "Contact | Wedding Tracks",
  description:
    "Contact Wedding Tracks for availability, tours, package questions, and wedding weekend planning in North Georgia.",
};

export default function ContactPage() {
  return (
    <main className="px-6 py-14 sm:px-10">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <section className="soft-panel rounded-3xl p-8 sm:p-10">
          <p className="eyebrow">Start the conversation</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-5xl">
            Let&apos;s start planning your wedding weekend.
          </h1>
          <p className="mt-4 max-w-3xl leading-8 text-zinc-700">
            Wedding Tracks is a private North Georgia wedding venue located about
            25 minutes west of downtown Ellijay. Reach out for availability,
            package guidance, private tour scheduling, or help choosing the right
            wedding day or weekend stay experience.
          </p>
        </section>

        <div className="soft-panel rounded-2xl p-6 text-zinc-700">
          <p className="text-sm uppercase tracking-[0.16em] text-zinc-500">
            Contact details
          </p>

          <div className="mt-4 space-y-2 leading-7">
            <p>Email: hello@tracksandchampagne.com</p>
            <p>Location: North Georgia, 25 minutes west of downtown Ellijay</p>
          </div>

          <p className="mt-4 text-sm text-zinc-600">
            For the fastest response, include your preferred date range, estimated
            guest count, and whether you are looking for a ceremony-only package
            or a full wedding weekend stay.
          </p>

          <ContactForm />
        </div>
      </div>
    </main>
  );
}