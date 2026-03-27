import Link from "next/link";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

import { getSessionUser } from "@/lib/auth/session";
import { getVenuePackages } from "@/lib/packages";
import { getPrismaClient } from "@/lib/prisma";
import { addPointOfInterest, removePointOfInterest, updatePackagePricing } from "./actions";

export default async function AdminContentPage() {
  const prisma = getPrismaClient();
  const user = await getSessionUser();

  if (!user) {
    redirect("/auth/sign-in?next=/admin/content");
  }
  if (user.role !== "OWNER") {
    redirect("/account");
  }

  const [packages, pointsOfInterest] = await Promise.all([
    getVenuePackages(),
    prisma.pointOfInterest
      .findMany({
        orderBy: [{ createdAt: "desc" }],
      })
      .catch(() => []),
  ]);

  return (
    <main className="px-4 py-10 sm:px-8 lg:px-10">
      <div className="mx-auto w-full max-w-6xl space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Content Controls</h1>
            <p className="mt-1 text-sm text-zinc-600">
              Manage package pricing and map places shown on the Things to Do page.
            </p>
          </div>
          <Link href="/admin" className="text-sm font-medium text-zinc-600 hover:text-zinc-900">
            Back to dashboard
          </Link>
        </div>

        <section className="rounded-2xl border border-zinc-200 bg-white p-4 sm:p-6">
          <h2 className="text-lg font-semibold">Package pricing</h2>
          <p className="mt-1 text-sm text-zinc-600">
            Edit collection price and deposit amounts displayed across packages and reservation flow.
          </p>
          <div className="mt-4 grid gap-3">
            {packages.map((pkg) => (
              <form
                key={pkg.key}
                action={updatePackagePricing}
                className="grid gap-3 rounded-xl border border-zinc-200 p-4 lg:grid-cols-[1fr_auto_auto_auto] lg:items-end"
              >
                <input type="hidden" name="tier" value={pkg.key} />
                <div>
                  <p className="font-semibold">{pkg.name}</p>
                  <p className="text-sm text-zinc-600">{pkg.duration}</p>
                </div>
                <label className="grid gap-1 text-sm">
                  <span className="text-zinc-700">Price (USD)</span>
                  <input
                    name="priceUsd"
                    defaultValue={(pkg.priceCents / 100).toString()}
                    inputMode="decimal"
                    className="rounded-lg border border-zinc-300 px-3 py-2.5"
                  />
                </label>
                <label className="grid gap-1 text-sm">
                  <span className="text-zinc-700">Deposit (USD)</span>
                  <input
                    name="depositUsd"
                    defaultValue={(pkg.depositCents / 100).toString()}
                    inputMode="decimal"
                    className="rounded-lg border border-zinc-300 px-3 py-2.5"
                  />
                </label>
                <button
                  type="submit"
                  className="w-full rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 lg:w-auto lg:py-2"
                >
                  Save
                </button>
              </form>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-zinc-200 bg-white p-4 sm:p-6">
          <h2 className="text-lg font-semibold">Things-to-do map places</h2>
          <p className="mt-1 text-sm text-zinc-600">
            Add Ellijay points of interest with coordinates and an external research link.
          </p>
          <form
            action={addPointOfInterest}
            className="mt-4 grid gap-3 rounded-xl border border-zinc-200 p-4 md:grid-cols-2"
          >
            <input
              name="name"
              required
              placeholder="Place name"
              className="rounded-lg border border-zinc-300 px-3 py-2.5"
            />
            <input
              name="category"
              required
              placeholder="Category (Restaurant, Winery, Trail, etc.)"
              className="rounded-lg border border-zinc-300 px-3 py-2.5"
            />
            <input
              name="latitude"
              required
              placeholder="Latitude (e.g. 34.6949)"
              className="rounded-lg border border-zinc-300 px-3 py-2.5"
            />
            <input
              name="longitude"
              required
              placeholder="Longitude (e.g. -84.4826)"
              className="rounded-lg border border-zinc-300 px-3 py-2.5"
            />
            <input
              name="externalUrl"
              required
              placeholder="https://..."
              className="rounded-lg border border-zinc-300 px-3 py-2.5 md:col-span-2"
            />
            <textarea
              name="description"
              rows={2}
              placeholder="Short description (optional)"
              className="rounded-lg border border-zinc-300 px-3 py-2.5 md:col-span-2"
            />
            <div className="md:col-span-2">
              <button
                type="submit"
                className="w-full rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 sm:w-auto sm:py-2"
              >
                Add place
              </button>
            </div>
          </form>

          <div className="mt-4 overflow-x-auto rounded-xl border border-zinc-200">
            <table className="w-full min-w-[680px] text-left text-sm">
              <thead className="sticky top-0 z-10 bg-zinc-50 text-zinc-700">
                <tr>
                  <th className="px-3 py-2 font-medium">Name</th>
                  <th className="px-3 py-2 font-medium">Category</th>
                  <th className="px-3 py-2 font-medium">Coordinates</th>
                  <th className="px-3 py-2 font-medium">Status</th>
                  <th className="px-3 py-2 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {pointsOfInterest.length === 0 ? (
                  <tr>
                    <td className="px-3 py-3 text-zinc-600" colSpan={5}>
                      No custom places added yet. Defaults will be shown on the public page.
                    </td>
                  </tr>
                ) : (
                  pointsOfInterest.map((place) => (
                    <tr key={place.id} className="border-t border-zinc-200">
                      <td className="px-3 py-2 font-medium">{place.name}</td>
                      <td className="px-3 py-2">{place.category}</td>
                      <td className="px-3 py-2 text-zinc-600">
                        {place.latitude.toFixed(4)}, {place.longitude.toFixed(4)}
                      </td>
                      <td className="px-3 py-2">{place.isActive ? "Active" : "Inactive"}</td>
                      <td className="px-3 py-2">
                        <form action={removePointOfInterest}>
                          <input type="hidden" name="id" value={place.id} />
                          <button
                            type="submit"
                            className="rounded border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700 hover:bg-red-100"
                          >
                            Remove
                          </button>
                        </form>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
