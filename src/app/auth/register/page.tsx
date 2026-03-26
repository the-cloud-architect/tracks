"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const password = String(formData.get("password") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");

    if (password !== confirmPassword) {
      setIsSubmitting(false);
      setError("Passwords do not match.");
      return;
    }

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.get("name"),
        email: formData.get("email"),
        password,
      }),
    });

    const data = await response.json();
    setIsSubmitting(false);

    if (!response.ok) {
      setError(data.error ?? "Could not create account.");
      return;
    }

    router.replace("/account");
    router.refresh();
  }

  return (
    <main className="px-6 py-14 sm:px-10">
      <div className="mx-auto w-full max-w-md rounded-2xl bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold tracking-tight">Create account</h1>
        <p className="mt-2 text-sm text-zinc-600">
          Manage your reservation bills and communication in one place.
        </p>

        <form onSubmit={onSubmit} className="mt-6 grid gap-4">
          <label className="grid gap-2">
            <span className="text-sm font-medium">Name</span>
            <input
              name="name"
              className="rounded-lg border border-zinc-300 px-3 py-2"
            />
          </label>
          <label className="grid gap-2">
            <span className="text-sm font-medium">Email</span>
            <input
              required
              name="email"
              type="email"
              className="rounded-lg border border-zinc-300 px-3 py-2"
            />
          </label>
          <label className="grid gap-2">
            <span className="text-sm font-medium">Password</span>
            <input
              required
              minLength={8}
              name="password"
              type="password"
              className="rounded-lg border border-zinc-300 px-3 py-2"
            />
          </label>
          <label className="grid gap-2">
            <span className="text-sm font-medium">Confirm password</span>
            <input
              required
              minLength={8}
              name="confirmPassword"
              type="password"
              className="rounded-lg border border-zinc-300 px-3 py-2"
            />
          </label>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-zinc-900 px-4 py-2 font-medium text-white disabled:opacity-60"
          >
            {isSubmitting ? "Creating account..." : "Create account"}
          </button>
        </form>

        {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}

        <p className="mt-5 text-sm text-zinc-600">
          Already have an account?{" "}
          <Link href="/auth/sign-in" className="font-medium text-zinc-900">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
