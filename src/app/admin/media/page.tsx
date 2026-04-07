import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

import { getSessionUser } from "@/lib/auth/session";
import { getPrismaClient } from "@/lib/prisma";
import { tryGetR2ObjectUrl } from "@/lib/r2";
import { deleteMediaAsset, setHeroVideoAsset } from "./actions";
import { AdminMediaUploadForm } from "./upload-form";

function formatSize(sizeBytes: number): string {
  if (sizeBytes < 1024 * 1024) {
    return `${Math.max(1, Math.round(sizeBytes / 1024))} KB`;
  }
  return `${(sizeBytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default async function AdminMediaPage() {
  const prisma = getPrismaClient();
  const user = await getSessionUser();

  if (!user) {
    redirect("/auth/sign-in?next=/admin/media");
  }

  if (user.role !== "OWNER") {
    redirect("/account");
  }

  const assets = await prisma.mediaAsset
    .findMany({
      where: { status: "ACTIVE" },
      orderBy: { createdAt: "desc" },
    })
    .catch(() => []);
  const heroVideo = assets.find((asset) => asset.type === "VIDEO" && asset.sourceUrl === "HERO_VIDEO");

  return (
    <main className="px-6 py-14 sm:px-10">
      <div className="mx-auto w-full max-w-6xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h1 className="text-2xl font-bold tracking-tight">Media Library</h1>
          <div className="flex items-center gap-3 text-sm">
            <a href="/admin/reservations" className="text-zinc-600 hover:text-zinc-900">
              Reservations
            </a>
            <a href="/admin/inbox" className="text-zinc-600 hover:text-zinc-900">
              Invoices & Inbox
            </a>
            <a href="/admin/availability" className="text-zinc-600 hover:text-zinc-900">
              Availability
            </a>
          </div>
        </div>

        <section className="rounded-xl border border-zinc-200 bg-white p-5">
          <h2 className="text-lg font-semibold">Upload photo or video</h2>
          <p className="mt-1 text-sm text-zinc-600">
            Add wedding photography and highlight clips for the public gallery.
          </p>
          <p className="mt-2 text-sm text-zinc-700">
            Current hero video:{" "}
            <span className="font-medium">{heroVideo ? heroVideo.title : "Using default site hero video"}</span>
          </p>
          <AdminMediaUploadForm />
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Current assets</h2>
          {assets.length === 0 ? (
            <p className="rounded-xl border border-zinc-200 bg-white p-4 text-sm text-zinc-600">
              No media assets yet. Upload your first photo or video above.
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {assets.map((asset) => (
                <article
                  key={asset.id}
                  className="overflow-hidden rounded-xl border border-zinc-200 bg-white"
                >
                  <div className="aspect-video bg-zinc-100">
                    {(() => {
                      const assetUrl = tryGetR2ObjectUrl(asset.objectKey);
                      if (!assetUrl) {
                        return (
                          <div className="flex h-full items-center justify-center px-4 text-center text-sm text-zinc-600">
                            Upload succeeded, but this file cannot be previewed until
                            a public R2 base URL is available.
                          </div>
                        );
                      }

                      if (asset.type === "PHOTO") {
                        return (
                          <img
                            src={assetUrl}
                            alt={asset.title}
                            className="h-full w-full object-cover"
                          />
                        );
                      }

                      return (
                        <video
                          src={assetUrl}
                          controls
                          className="h-full w-full object-cover"
                        />
                      );
                    })()}
                  </div>
                  <div className="space-y-2 p-3">
                    <p className="font-medium">{asset.title}</p>
                    {asset.description ? (
                      <p className="text-sm text-zinc-600">{asset.description}</p>
                    ) : null}
                    <p className="text-xs text-zinc-500">
                      {asset.type} · {formatSize(asset.sizeBytes)}
                    </p>
                    {asset.type === "VIDEO" ? (
                      <form action={setHeroVideoAsset}>
                        <input type="hidden" name="mediaId" value={asset.id} />
                        <button
                          type="submit"
                          className="rounded border border-zinc-300 bg-zinc-50 px-3 py-1 text-sm text-zinc-700 hover:bg-zinc-100"
                        >
                          {asset.sourceUrl === "HERO_VIDEO" ? "Selected for hero" : "Set as hero video"}
                        </button>
                      </form>
                    ) : null}
                    <form action={deleteMediaAsset}>
                      <input type="hidden" name="mediaId" value={asset.id} />
                      <button
                        type="submit"
                        className="rounded border border-red-200 bg-red-50 px-3 py-1 text-sm text-red-700 hover:bg-red-100"
                      >
                        Delete
                      </button>
                    </form>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
