"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

import { formatUsd, type PackageTier, venuePackages } from "@/lib/packages";

function getNextDates(days: number): string[] {
  const dates: string[] = [];
  const now = new Date();

  for (let i = 0; i < days; i += 1) {
    const date = new Date(now);
    date.setUTCDate(now.getUTCDate() + i);
    dates.push(date.toISOString().slice(0, 10));
  }

  return dates;
}

export default function ReservePage() {
  const [packageTier, setPackageTier] = useState<PackageTier>(venuePackages[0].key);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [unavailableDates, setUnavailableDates] = useState<string[]>([]);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const upcomingDates = useMemo(() => getNextDates(90), []);
  const selectedPackage = useMemo(
    () => venuePackages.find((pkg) => pkg.key === packageTier) ?? venuePackages[0],
    [packageTier],
  );

  useEffect(() => {
    let isMounted = true;

    async function loadAvailability() {
      const response = await fetch("/api/availability");
      const data = await response.json();
      if (isMounted) {
        setUnavailableDates(data.unavailableDates ?? []);
      }
    }

    loadAvailability().catch(() => {
      if (isMounted) {
        setError("Could not load availability right now.");
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("");
    setError("");

    if (!selectedDate) {
      setError("Please select an available event date.");
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData(event.currentTarget);

    const reservationResponse = await fetch("/api/reservations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: formData.get("fullName"),
        email: formData.get("email"),
        expectedGuests: formData.get("expectedGuests"),
        packageTier,
        eventDate: selectedDate,
      }),
    });

    const reservationData = await reservationResponse.json();
    if (!reservationResponse.ok) {
      setIsSubmitting(false);
      setError(reservationData.error ?? "Could not create reservation lead.");
      return;
    }

    const checkoutResponse = await fetch("/api/deposits/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        reservationId: reservationData.reservationLead.id,
        termsAccepted,
      }),
    });

    const checkoutData = await checkoutResponse.json();
    setIsSubmitting(false);

    if (!checkoutResponse.ok) {
      setError(checkoutData.error ?? "Could not start checkout.");
      return;
    }

    setStatus(
      `Reservation lead saved. Deposit checkout placeholder created (${formatUsd(
        checkoutData.depositCents,
      )}). Next step: wire this endpoint to Stripe Checkout.`,
    );
  }

  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-16 text-zinc-900 sm:px-12">
      <div className="mx-auto grid w-full max-w-5xl gap-6 lg:grid-cols-[1.2fr_1fr]">
        <section className="rounded-2xl bg-white p-7 shadow-sm">
          <h1 className="text-3xl font-bold tracking-tight">Reserve Your Date</h1>
          <p className="mt-3 text-zinc-700">
            Select a package, choose an available date, and submit your deposit
            request. This flow is wired for Stripe checkout integration.
          </p>

          <form className="mt-8 grid gap-4" onSubmit={handleSubmit}>
            <label className="grid gap-2">
              <span className="text-sm font-medium">Full name</span>
              <input
                name="fullName"
                required
                className="rounded-lg border border-zinc-300 px-3 py-2"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-medium">Email</span>
              <input
                name="email"
                type="email"
                required
                className="rounded-lg border border-zinc-300 px-3 py-2"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-medium">Expected guest count</span>
              <input
                name="expectedGuests"
                type="number"
                min={1}
                max={40}
                className="rounded-lg border border-zinc-300 px-3 py-2"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-medium">Package</span>
              <select
                value={packageTier}
                onChange={(e) => setPackageTier(e.target.value as PackageTier)}
                className="rounded-lg border border-zinc-300 px-3 py-2"
              >
                {venuePackages.map((pkg) => (
                  <option key={pkg.key} value={pkg.key}>
                    {pkg.name} — deposit {formatUsd(pkg.depositCents)}
                  </option>
                ))}
              </select>
            </label>

            <div className="grid gap-2">
              <span className="text-sm font-medium">
                Choose an available event date
              </span>
              <div className="grid max-h-64 grid-cols-2 gap-2 overflow-auto rounded-lg border border-zinc-300 p-3 sm:grid-cols-3">
                {upcomingDates.map((date) => {
                  const unavailable = unavailableDates.includes(date);
                  const selected = selectedDate === date;

                  return (
                    <button
                      key={date}
                      type="button"
                      disabled={unavailable}
                      onClick={() => setSelectedDate(date)}
                      className={[
                        "rounded-md border px-2 py-1 text-sm",
                        unavailable
                          ? "cursor-not-allowed border-zinc-200 bg-zinc-100 text-zinc-400"
                          : selected
                            ? "border-zinc-900 bg-zinc-900 text-white"
                            : "border-zinc-300 bg-white hover:border-zinc-500",
                      ].join(" ")}
                    >
                      {date}
                    </button>
                  );
                })}
              </div>
            </div>

            <label className="mt-1 flex items-start gap-2 text-sm text-zinc-700">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(event) => setTermsAccepted(event.target.checked)}
                className="mt-1"
              />
              <span>
                I agree to the booking terms, including the 11:00 PM curfew and
                deposit policy.
              </span>
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-zinc-900 px-4 py-2 font-medium text-white disabled:opacity-60"
            >
              {isSubmitting ? "Preparing checkout..." : "Reserve and pay deposit"}
            </button>
          </form>

          {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
          {status ? <p className="mt-4 text-sm text-emerald-700">{status}</p> : null}
        </section>

        <aside className="rounded-2xl bg-white p-7 shadow-sm">
          <h2 className="text-xl font-semibold">{selectedPackage.name}</h2>
          <p className="mt-1 text-zinc-700">{selectedPackage.summary}</p>
          <div className="mt-5 grid gap-2 text-sm">
            <p>
              <span className="font-medium">Duration:</span>{" "}
              {selectedPackage.duration}
            </p>
            <p>
              <span className="font-medium">Package total:</span>{" "}
              {formatUsd(selectedPackage.priceCents)}
            </p>
            <p>
              <span className="font-medium">Deposit due now:</span>{" "}
              {formatUsd(selectedPackage.depositCents)}
            </p>
          </div>

          <div className="mt-6 rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-700">
            Stripe integration placeholder:
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Replace `/api/deposits/checkout` with Stripe session creation.</li>
              <li>Store `checkout_session_id` and webhook updates.</li>
              <li>Mark reservation `paid` after successful payment event.</li>
            </ul>
          </div>
        </aside>
      </div>
    </main>
  );
}
