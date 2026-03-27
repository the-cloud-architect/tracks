import type { Metadata } from "next";
import Link from "next/link";
import { getPrismaClient } from "@/lib/prisma";
import { tryGetR2ObjectUrl } from "@/lib/r2";

export const metadata: Metadata = {
  title: "Gallery | Wedding Tracks",
  description:
    "Preview photo moments from Wedding Tracks, including ceremony scenes, estate details, and weekend atmosphere.",
};
export default async function GalleryPage() {
  const prisma = getPrismaClient();
  const assets = await prisma.mediaAsset
    .findMany({
      where: { status: "ACTIVE", type: "PHOTO" },
      orderBy: { createdAt: "desc" },
    })
    .catch(() => []);
  return (
    <main className="px-3 py-10 sm:px-5 lg:px-6">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <section className="soft-panel rounded-3xl p-8 sm:p-10">
          <p className="eyebrow">Venue highlights</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-5xl">
            A visual preview of the atmosphere your guests will remember.
          </h1>
          <p className="mt-4 max-w-3xl leading-8 text-zinc-700">
            Explore ceremony spaces, scenic corners, interior details, and
            weekend moments captured across the Wedding Tracks estate.
          </p>
        </section>
        {assets.length === 0 ? (
          <div className="soft-panel rounded-2xl border-dashed p-6 text-sm text-zinc-500">
            Gallery photos are being prepared. Check back shortly for fresh
            imagery.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
            {assets.map((asset) => (
              <article
                key={asset.id}
                className="group relative overflow-hidden rounded-md"
              >
                {(() => {
                  const assetUrl = tryGetR2ObjectUrl(asset.objectKey);
                  if (!assetUrl) {
                    return (
                      <div className="soft-panel flex aspect-[4/5] items-center justify-center px-4 text-center text-sm text-zinc-600">
                        Photo is present but its public URL is not configured yet.
                      </div>
                    );
                  }
                  return (
                    <div className="relative aspect-[4/5] bg-zinc-100">
                      <img
                        src={assetUrl}
                        alt={asset.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-3 text-white">
                        <p className="text-base font-semibold tracking-[0.03em]">{asset.title}</p>
                        {asset.description ? (
                          <p className="line-clamp-2 text-xs leading-5 text-zinc-100/95">{asset.description}</p>
                        ) : null}
                      </div>
                    </div>
                  );
                })()}
              </article>
            ))}
          </div>
        )}
        <Link
          href="/book-a-tour"
          className="inline-flex rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:opacity-90"
        >
          See the venue in person
        </Link>
      </div>
    </main>
  );
}
