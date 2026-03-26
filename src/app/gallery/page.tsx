import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Gallery | Tracks and Champagne",
  description:
    "Preview scenes from Tracks and Champagne, including ceremony areas, house interiors, and property views.",
};

const placeholders = [
  "Ceremony gazebo on the tracks",
  "Train-depot styled house exterior",
  "House interior prep suite",
  "Drone overview of the 17-acre property",
  "ATV trails and game-stop stations",
  "Evening lighting and event setup",
];

export default function GalleryPage() {
  return (
    <main className="px-6 py-14 sm:px-10">
      <div className="mx-auto w-full max-w-5xl space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Gallery Preview</h1>
        <p className="max-w-3xl leading-8 text-zinc-700">
          This gallery will feature photography and short highlight videos,
          including a drone overview of the property.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {placeholders.map((title) => (
            <div
              key={title}
              className="flex aspect-video items-center justify-center rounded-xl border border-dashed border-zinc-300 bg-white p-4 text-center text-sm text-zinc-500"
            >
              {title}
            </div>
          ))}
        </div>
        <Link
          href="/book-a-tour"
          className="inline-flex rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white"
        >
          See the venue in person
        </Link>
      </div>
    </main>
  );
}
