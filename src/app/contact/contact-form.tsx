"use client";

import { FormEvent, useState } from "react";

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus("");
    setError("");

    const formData = new FormData(event.currentTarget);
    const payload = {
      fullName: String(formData.get("fullName") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      message: String(formData.get("message") ?? "").trim(),
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await response.json().catch(() => null)) as { error?: string } | null;
      if (!response.ok) {
        setError(data?.error ?? "Could not send your message. Please try again.");
        return;
      }

      event.currentTarget.reset();
      setStatus("Message sent. We’ll follow up with you shortly.");
    } catch {
      setError("Could not send your message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 grid gap-3">
      <input
        name="fullName"
        required
        placeholder="Full name"
        className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm"
      />
      <input
        name="email"
        type="email"
        required
        placeholder="Email"
        className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm"
      />
      <textarea
        name="message"
        required
        rows={4}
        placeholder="Share your vision, preferred dates, and any planning questions."
        className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm"
      />
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-fit rounded-full border border-zinc-900 bg-zinc-900 px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
      >
        {isSubmitting ? "Sending..." : "Send message"}
      </button>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {status ? <p className="text-sm text-emerald-700">{status}</p> : null}
    </form>
  );
}
