import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About | Tracks and Champagne",
  description:
    "Learn about the story behind Tracks and Champagne, a unique affordable wedding venue in Chatsworth, Georgia.",
};

export default function AboutPage() {
  return (
    <main className="px-6 py-14 sm:px-10">
      <div className="mx-auto w-full max-w-4xl rounded-2xl bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold tracking-tight">About Tracks and Champagne</h1>
        <p className="mt-4 leading-8 text-zinc-700">
          Tracks and Champagne is owned and operated by Wesley Morris, a father of
          six from North Georgia. The venue was created to deliver a wedding
          experience that feels memorable and unique while staying affordable and
          easier to plan.
        </p>
        <p className="mt-4 leading-8 text-zinc-700">
          The property features a gazebo ceremony space on historic rail lines, a
          newly renovated 3-bedroom, 2-bath house styled like a train depot, and
          17 acres of trails and activity stations for guests who want more than a
          one-day event.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/book-a-tour"
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white"
          >
            Schedule a Preview Tour
          </Link>
          <Link
            href="/packages"
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-900"
          >
            View Packages
          </Link>
        </div>
      </div>
    </main>
  );
}
