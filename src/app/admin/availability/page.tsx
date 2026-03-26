import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

import { getPrismaClient } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth/session";

import { addAvailabilityBlock, removeAvailabilityBlock } from "./actions";

export const metadata: Metadata = {
  title: "Availability | Admin",
};

export default async function AdminAvailabilityPage() {
  const prisma = getPrismaClient();
  const user = await getSessionUser();

  if (!user) {
    redirect("/auth/sign-in?next=/admin/availability");
  }

  if (user.role !== "OWNER") {
    redirect("/account");
  }

  const [blocks, reservations] = await Promise.all([
    prisma.availabilityBlock.findMany({
      orderBy: { date: "asc" },
    }),
    prisma.reservationLead.findMany({
      where: { paymentStatus: { in: ["pending", "paid"] } },
      select: { eventDate: true, fullName: true, packageTier: true },
      orderBy: { eventDate: "asc" },
    }),
  ]);

  const today = new Date().toISOString().slice(0, 10);

  return (
    <main className="px-6 py-14 sm:px-10">
      <div className="mx-auto w-full max-w-5xl space-y-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Availability Management
          </h1>
          <p className="mt-1 text-sm text-zinc-600">
            Block dates to mark them as unavailable in the reservation calendar.
          </p>
        </div>

        {/* Add new block */}
        <section className="rounded-2xl border border-zinc-200 bg-white p-6">
          <h2 className="text-lg font-semibold">Block a Date</h2>
          <form
            action={addAvailabilityBlock}
            className="mt-4 flex flex-wrap items-end gap-3"
          >
            <label className="grid gap-1">
              <span className="text-sm font-medium">Date</span>
              <input
                required
                name="date"
                type="date"
                min={today}
                className="rounded-lg border border-zinc-300 px-3 py-2 text-sm"
              />
            </label>
            <label className="grid flex-1 gap-1">
              <span className="text-sm font-medium">Reason (optional)</span>
              <input
                name="reason"
                placeholder="e.g. Personal event, maintenance…"
                className="rounded-lg border border-zinc-300 px-3 py-2 text-sm"
              />
            </label>
            <button
              type="submit"
              className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white"
            >
              Add block
            </button>
          </form>
        </section>

        {/* Existing blocks */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Blocked Dates</h2>
          {blocks.length === 0 ? (
            <p className="text-sm text-zinc-600">No blocked dates.</p>
          ) : (
            <div className="space-y-2">
              {blocks.map((block) => (
                <div
                  key={block.id}
                  className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white px-4 py-3"
                >
                  <div>
                    <p className="font-medium">
                      {block.date.toISOString().slice(0, 10)}
                    </p>
                    {block.reason ? (
                      <p className="text-sm text-zinc-500">{block.reason}</p>
                    ) : null}
                  </div>
                  <form action={removeAvailabilityBlock}>
                    <input type="hidden" name="blockId" value={block.id} />
                    <button
                      type="submit"
                      className="rounded border border-zinc-200 px-3 py-1 text-sm text-zinc-600 hover:border-red-200 hover:bg-red-50 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </form>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Reservations holding dates */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Dates Held by Reservations</h2>
          <p className="text-sm text-zinc-500">
            These dates are already taken by active reservation leads.
          </p>
          {reservations.length === 0 ? (
            <p className="text-sm text-zinc-600">No active reservation dates.</p>
          ) : (
            <div className="space-y-2">
              {reservations.map((r) => (
                <div
                  key={r.eventDate.toISOString()}
                  className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white px-4 py-3"
                >
                  <p className="font-medium">
                    {r.eventDate.toISOString().slice(0, 10)}
                  </p>
                  <p className="text-sm text-zinc-500">
                    {r.fullName} · {r.packageTier}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
