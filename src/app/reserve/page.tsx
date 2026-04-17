"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

import {
  DEFAULT_VENUE_PACKAGES,
  formatUsd,
  type PackageTier,
  type VenuePackage,
} from "@/lib/packages-shared";

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
  const [packages, setPackages] = useState<VenuePackage[]>(DEFAULT_VENUE_PACKAGES);
  const [packageTier, setPackageTier] = useState<PackageTier>(DEFAULT_VENUE_PACKAGES[0].key);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [unavailableDates, setUnavailableDates] = useState<string[]>([]);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const upcomingDates = useMemo(() => getNextDates(90), []);
  const requestedPackageTier = useMemo(
    () =>
      typeof window === "undefined"
        ? ""
        : String(new URLSearchParams(window.location.search).get("packageTier") ?? "").trim(),
    [],
  );
  const selectedPackage = useMemo(
    () => packages.find((pkg) => pkg.key === packageTier) ?? packages[0],
    [packageTier, packages],
  );

  useEffect(() => {
    let isMounted = true;

    async function loadPackages() {
      const response = await fetch("/api/packages");
      if (!response.ok) {
        throw new Error("Package request failed.");
      }
      const data = (await response.json()) as { packages?: VenuePackage[] };
      if (isMounted && data.packages && data.packages.length > 0) {
        const loadedPackages = data.packages;
        setPackages(loadedPackages);
        const preferred = loadedPackages.find((pkg) => pkg.key === requestedPackageTier);
        setPackageTier((currentPackageTier) => {
          if (preferred) {
            return preferred.key;
          }

          return loadedPackages.find((pkg) => pkg.key === currentPackageTier)
            ? currentPackageTier
            : loadedPackages[0].key;
        });
      }
    }

    async function loadAvailability() {
      const response = await fetch("/api/availability");
      if (!response.ok) {
        throw new Error("Availability request failed.");
      }
      const data = (await response.json()) as {
        unavailableDates?: string[];
      };
      if (isMounted) {
        setUnavailableDates(data.unavailableDates ?? []);
        setError("");
      }
    }

    Promise.all([loadPackages(), loadAvailability()]).catch(() => {
      if (isMounted) {
        setError("Could not load reservation settings right now.");
      }
    });

    return () => {
      isMounted = false;
    };
  }, [requestedPackageTier]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!selectedDate) {
      setError("Please select an available event date.");
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData(event.currentTarget);

    try {
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

      let reservationData:
        | { error?: string; reservationLead?: { id: string } }
        | null = null;
      try {
        reservationData = (await reservationResponse.json()) as {
          error?: string;
          reservationLead?: { id: string };
        };
      } catch {
        reservationData = null;
      }

      if (!reservationResponse.ok || !reservationData?.reservationLead?.id) {
        setError(reservationData?.error ?? "Could not create reservation lead.");
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

      let checkoutData: { error?: string; checkoutUrl?: string } | null = null;
      try {
        checkoutData = (await checkoutResponse.json()) as {
          error?: string;
          checkoutUrl?: string;
        };
      } catch {
        checkoutData = null;
      }

      if (!checkoutResponse.ok) {
        setError(checkoutData?.error ?? "Could not start checkout.");
        return;
      }

      window.location.href =
        checkoutData?.checkoutUrl ?? "/reserve/confirmation?status=pending";
    } catch {
      setError("Could not start checkout right now. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-10 text-zinc-900 sm:px-8 sm:py-14 lg:px-12">
      <div className="mx-auto grid w-full max-w-5xl gap-4 sm:gap-6 lg:grid-cols-[1.2fr_1fr]">
        <section className="rounded-2xl bg-white p-5 shadow-sm sm:p-7">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Reserve Your Date</h1>
          <p className="mt-3 text-zinc-700">
            Select a package, choose an available date, and submit your deposit
            to hold your event date.
          </p>
          <p className="mt-2 text-sm text-zinc-600">
            Create an account first if you want to track outstanding bills and
            messages in your dashboard.
          </p>

          <form className="mt-6 grid gap-4 sm:mt-8" onSubmit={handleSubmit}>
            <label className="grid gap-2">
              <span className="text-sm font-medium">Full name</span>
              <input
                name="fullName"
                required
                className="rounded-lg border border-zinc-300 px-3 py-2.5 text-base"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-medium">Email</span>
              <input
                name="email"
                type="email"
                required
                className="rounded-lg border border-zinc-300 px-3 py-2.5 text-base"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-medium">Expected guest count</span>
              <input
                name="expectedGuests"
                type="number"
                min={1}
                max={40}
                className="rounded-lg border border-zinc-300 px-3 py-2.5 text-base"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-medium">Package</span>
              <select
                value={packageTier}
                onChange={(e) => setPackageTier(e.target.value as PackageTier)}
                className="rounded-lg border border-zinc-300 px-3 py-2.5 text-base"
              >
                {packages.map((pkg) => (
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
              <div className="grid max-h-64 grid-cols-2 gap-2 overflow-auto rounded-lg border border-zinc-300 p-2.5 sm:grid-cols-3 sm:p-3">
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
                        "rounded-md border px-2 py-1.5 text-sm",
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
              className="w-full rounded-lg bg-zinc-900 px-4 py-3 font-medium text-white disabled:opacity-60 sm:w-fit sm:py-2"
            >
              {isSubmitting ? "Preparing checkout..." : "Reserve and pay deposit"}
            </button>
          </form>

          {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
        </section>

        <aside className="rounded-2xl bg-white p-5 shadow-sm sm:p-7">
          <h2 className="text-lg font-semibold sm:text-xl">{selectedPackage.name}</h2>
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
            <p className="font-medium">Secure checkout</p>
            <p className="mt-1">
              Your deposit secures the date. Final payment details and event
              agreement will follow by email after confirmation.
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}
