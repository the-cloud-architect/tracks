import Link from "next/link";
import { getSessionUser } from "@/lib/auth/session";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/packages", label: "Packages" },
  { href: "/gallery", label: "Gallery" },
  { href: "/things-to-do", label: "Things to Do" },
  { href: "/book-a-tour", label: "Book a Tour" },
  { href: "/reserve", label: "Reserve" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export async function SiteHeader() {
  const user = await getSessionUser();

  return (
    <header className="sticky top-0 z-40 border-b border-white/60 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-start gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10">
        <Link
          href="/"
          className="font-[family-name:var(--font-dancing)] text-3xl font-normal leading-none text-zinc-900"
        >
          Wedding Tracks
        </Link>

        <nav className="flex w-full items-center gap-2 overflow-x-auto pb-1 text-xs text-zinc-700 sm:w-auto sm:flex-wrap sm:gap-3 sm:overflow-visible sm:pb-0 sm:text-sm">
          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="shrink-0 rounded px-2 py-1 hover:bg-zinc-100"
            >
              {item.label}
            </Link>
          ))}

          {user ? (
            <>
              <Link href="/account" className="rounded px-2 py-1 font-medium hover:bg-zinc-100">
                Account
              </Link>
              {user.role === "OWNER" ? (
                <Link href="/admin" className="rounded px-2 py-1 font-medium hover:bg-zinc-100">
                  Admin dashboard
                </Link>
              ) : null}
            </>
          ) : (
            <>
              <Link href="/auth/sign-in" className="rounded px-2 py-1 hover:bg-zinc-100">
                Sign in
              </Link>
              <Link
                href="/auth/register"
                className="rounded bg-zinc-900 px-3 py-1 text-white hover:opacity-90"
              >
                Create account
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}