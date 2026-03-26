"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nextPath, setNextPath] = useState("/account");
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setNextPath(params.get("next") || "/account");
  }, []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: formData.get("email"),
        password: formData.get("password"),
      }),
    });

    const data = await response.json();
    setIsSubmitting(false);

    if (!response.ok) {
      setError(data.error ?? "Could not sign in.");
      return;
    }

    router.replace(nextPath);
    router.refresh();
  }

  return (
    <main className="px-6 py-14 sm:px-10">
      <div className="mx-auto w-full max-w-md rounded-2xl bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold tracking-tight">Sign in</h1>
        <p className="mt-2 text-sm text-zinc-600">
          Access your account to view bills and messages.
        </p>

        <form onSubmit={onSubmit} className="mt-6 grid gap-4">
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
              name="password"
              type="password"
              className="rounded-lg border border-zinc-300 px-3 py-2"
            />
          </label>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-zinc-900 px-4 py-2 font-medium text-white disabled:opacity-60"
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </form>

        {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}

        <p className="mt-5 text-sm text-zinc-600">
          Don&apos;t have an account?{" "}
          <Link href="/auth/register" className="font-medium text-zinc-900">
            Create one
          </Link>
        </p>
      </div>
    </main>
  );
}
