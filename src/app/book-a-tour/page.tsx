"use client";

import { FormEvent, useMemo, useState } from "react";

export default function BookATourPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<string>("");
  const [error, setError] = useState<string>("");

  const minDate = useMemo(() => {
    const now = new Date();
    return now.toISOString().slice(0, 10);
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus("");
    setError("");

    const formData = new FormData(event.currentTarget);
    const payload = {
      fullName: formData.get("fullName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      preferredDate: formData.get("preferredDate"),
      message: formData.get("message"),
    };

    try {
      const response = await fetch("/api/tours", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      let data: { error?: string } | null = null;
      try {
        data = (await response.json()) as { error?: string };
      } catch {
        data = null;
      }

      if (!response.ok) {
        setError(data?.error ?? "Could not submit your request.");
        return;
      }

      event.currentTarget.reset();
      setStatus(
        "Tour request received. We will reach out shortly to confirm your preview visit.",
      );
    } catch {
      setError("Could not submit your request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-16 text-zinc-900 sm:px-12">
      <div className="mx-auto w-full max-w-3xl rounded-2xl bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold tracking-tight">Book a Tour</h1>
        <p className="mt-3 text-zinc-700">
          Preview tours begin May 1. Share your preferred date and we’ll confirm
          availability with a follow-up email.
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
            <span className="text-sm font-medium">Phone (optional)</span>
            <input
              name="phone"
              className="rounded-lg border border-zinc-300 px-3 py-2"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium">Preferred tour date</span>
            <input
              name="preferredDate"
              type="date"
              min={minDate}
              className="rounded-lg border border-zinc-300 px-3 py-2"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium">Message</span>
            <textarea
              name="message"
              rows={4}
              className="rounded-lg border border-zinc-300 px-3 py-2"
              placeholder="Anything you want us to prepare before your visit?"
            />
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 rounded-lg bg-zinc-900 px-4 py-2 font-medium text-white disabled:opacity-60"
          >
            {isSubmitting ? "Submitting..." : "Request tour"}
          </button>
        </form>

        {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
        {status ? <p className="mt-4 text-sm text-emerald-700">{status}</p> : null}
      </div>
    </main>
  );
}
