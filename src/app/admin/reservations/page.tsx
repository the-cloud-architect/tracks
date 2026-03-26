import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

import { getPrismaClient } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth/session";
import { formatUsd } from "@/lib/packages";

import { cancelReservation } from "./actions";

export const metadata: Metadata = {
  title: "Reservations | Admin",
};

const statusBadgeClass: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  paid: "bg-emerald-50 text-emerald-700 border-emerald-200",
  canceled: "bg-zinc-100 text-zinc-500 border-zinc-200",
};

export default async function AdminReservationsPage() {
  const prisma = getPrismaClient();
  const user = await getSessionUser();

  if (!user) {
    redirect("/auth/sign-in?next=/admin/reservations");
  }

  if (user.role !== "OWNER") {
    redirect("/account");
  }

  const reservations = await prisma.reservationLead.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      guest: {
        select: { email: true, name: true },
      },
    },
  });

  const active = reservations.filter((r) => r.paymentStatus !== "canceled");
  const canceled = reservations.filter((r) => r.paymentStatus === "canceled");

  return (
    <main className="px-6 py-14 sm:px-10">
      <div className="mx-auto w-full max-w-5xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reservations</h1>
          <p className="mt-1 text-sm text-zinc-600">
            {active.length} active · {canceled.length} canceled
          </p>
        </div>

        {reservations.length === 0 ? (
          <div className="rounded-xl border border-zinc-200 bg-white p-6 text-sm text-zinc-600">
            No reservations yet.
          </div>
        ) : (
          <div className="space-y-3">
            {reservations.map((reservation) => {
              const badgeClass =
                statusBadgeClass[reservation.paymentStatus] ??
                statusBadgeClass.pending;

              return (
                <article
                  key={reservation.id}
                  className="rounded-xl border border-zinc-200 bg-white p-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">{reservation.fullName}</p>
                        <span
                          className={`rounded border px-2 py-0.5 text-xs font-medium ${badgeClass}`}
                        >
                          {reservation.paymentStatus}
                        </span>
                      </div>
                      <p className="text-sm text-zinc-600">{reservation.email}</p>
                      {reservation.guest ? (
                        <p className="text-xs text-zinc-500">
                          Account: {reservation.guest.name ?? reservation.guest.email}
                        </p>
                      ) : (
                        <p className="text-xs text-zinc-500">No account linked</p>
                      )}
                    </div>
                    <div className="text-right text-sm text-zinc-500">
                      <p>
                        Event:{" "}
                        <span className="font-medium text-zinc-700">
                          {reservation.eventDate.toISOString().slice(0, 10)}
                        </span>
                      </p>
                      <p className="mt-0.5">
                        Submitted {reservation.createdAt.toISOString().slice(0, 10)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 grid gap-1 text-sm text-zinc-700 sm:grid-cols-3">
                    <p>
                      Package:{" "}
                      <span className="font-medium">{reservation.packageTier}</span>
                    </p>
                    <p>
                      Deposit:{" "}
                      <span className="font-medium">
                        {formatUsd(reservation.depositCents)}
                      </span>
                    </p>
                    {reservation.expectedGuests ? (
                      <p>
                        Guests:{" "}
                        <span className="font-medium">
                          {reservation.expectedGuests}
                        </span>
                      </p>
                    ) : null}
                  </div>

                  {reservation.notes ? (
                    <p className="mt-3 rounded-lg bg-zinc-50 p-3 text-sm text-zinc-600">
                      {reservation.notes}
                    </p>
                  ) : null}

                  {reservation.paymentStatus !== "canceled" ? (
                    <form action={cancelReservation} className="mt-4">
                      <input
                        type="hidden"
                        name="reservationId"
                        value={reservation.id}
                      />
                      <button
                        type="submit"
                        className="rounded border border-red-200 bg-red-50 px-3 py-1 text-sm text-red-700 hover:bg-red-100"
                      >
                        Cancel reservation
                      </button>
                    </form>
                  ) : null}
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
