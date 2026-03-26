import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

import { getPrismaClient } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Tour Requests | Admin",
};

export default async function AdminToursPage() {
  const prisma = getPrismaClient();
  const user = await getSessionUser();

  if (!user) {
    redirect("/auth/sign-in?next=/admin/tours");
  }

  if (user.role !== "OWNER") {
    redirect("/account");
  }

  const tours = await prisma.tourRequest.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="px-6 py-14 sm:px-10">
      <div className="mx-auto w-full max-w-5xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Tour Requests</h1>
            <p className="mt-1 text-sm text-zinc-600">
              {tours.length} request{tours.length !== 1 ? "s" : ""} total
            </p>
          </div>
        </div>

        {tours.length === 0 ? (
          <div className="rounded-xl border border-zinc-200 bg-white p-6 text-sm text-zinc-600">
            No tour requests yet.
          </div>
        ) : (
          <div className="space-y-3">
            {tours.map((tour) => (
              <article
                key={tour.id}
                className="rounded-xl border border-zinc-200 bg-white p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{tour.fullName}</p>
                    <p className="text-sm text-zinc-600">{tour.email}</p>
                    {tour.phone ? (
                      <p className="text-sm text-zinc-600">{tour.phone}</p>
                    ) : null}
                  </div>
                  <div className="text-right text-sm text-zinc-500">
                    <p>
                      Submitted{" "}
                      {tour.createdAt.toISOString().slice(0, 10)}
                    </p>
                    {tour.preferredDate ? (
                      <p className="mt-1">
                        Preferred:{" "}
                        <span className="font-medium text-zinc-700">
                          {tour.preferredDate.toISOString().slice(0, 10)}
                        </span>
                      </p>
                    ) : (
                      <p className="mt-1 italic">No preferred date given</p>
                    )}
                  </div>
                </div>
                {tour.message ? (
                  <p className="mt-3 rounded-lg bg-zinc-50 p-3 text-sm text-zinc-700">
                    {tour.message}
                  </p>
                ) : null}
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
