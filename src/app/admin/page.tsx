import Link from "next/link";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

import { getSessionUser } from "@/lib/auth/session";
import { getPrismaClient } from "@/lib/prisma";

export default async function AdminHomePage() {
  const prisma = getPrismaClient();
  const user = await getSessionUser();

  if (!user) {
    redirect("/auth/sign-in?next=/admin");
  }

  if (user.role !== "OWNER") {
    redirect("/account");
  }

  const [reservationCount, invoiceCount, mediaCount] = await Promise.all([
    prisma.reservationLead.count({
      where: { paymentStatus: { in: ["pending", "paid"] } },
    }),
    prisma.invoice.count({ where: { status: "DUE" } }),
    prisma.mediaAsset.count({ where: { status: "ACTIVE" } }),
  ]);

  return (
    <main className="px-6 py-14 sm:px-10">
      <div className="mx-auto w-full max-w-5xl space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-zinc-200 bg-white p-4">
            <p className="text-sm text-zinc-500">Active bookings</p>
            <p className="mt-1 text-2xl font-semibold">{reservationCount}</p>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white p-4">
            <p className="text-sm text-zinc-500">Open invoices</p>
            <p className="mt-1 text-2xl font-semibold">{invoiceCount}</p>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white p-4">
            <p className="text-sm text-zinc-500">Gallery assets</p>
            <p className="mt-1 text-2xl font-semibold">{mediaCount}</p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Link
            href="/admin/content"
            className="rounded-xl border border-zinc-200 bg-white p-4 hover:border-zinc-400"
          >
            <p className="font-semibold">Manage package prices & area map</p>
            <p className="mt-1 text-sm text-zinc-600">
              Update package pricing and control Things-to-Do map locations.
            </p>
          </Link>
          <Link
            href="/admin/media"
            className="rounded-xl border border-zinc-200 bg-white p-4 hover:border-zinc-400"
          >
            <p className="font-semibold">Manage photos & videos</p>
            <p className="mt-1 text-sm text-zinc-600">
              Upload, preview, and delete gallery media assets.
            </p>
          </Link>
          <Link
            href="/admin/reservations"
            className="rounded-xl border border-zinc-200 bg-white p-4 hover:border-zinc-400"
          >
            <p className="font-semibold">Manage bookings</p>
            <p className="mt-1 text-sm text-zinc-600">
              Review reservation leads and cancel dates when needed.
            </p>
          </Link>
          <Link
            href="/admin/inbox"
            className="rounded-xl border border-zinc-200 bg-white p-4 hover:border-zinc-400"
          >
            <p className="font-semibold">Manage invoices & inbox</p>
            <p className="mt-1 text-sm text-zinc-600">
              Create invoices and respond to guest conversations.
            </p>
          </Link>
          <Link
            href="/admin/availability"
            className="rounded-xl border border-zinc-200 bg-white p-4 hover:border-zinc-400"
          >
            <p className="font-semibold">Manage availability</p>
            <p className="mt-1 text-sm text-zinc-600">
              Block dates and review booked calendar windows.
            </p>
          </Link>
        </div>
      </div>
    </main>
  );
}
