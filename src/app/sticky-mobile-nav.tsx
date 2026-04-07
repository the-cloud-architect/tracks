"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type User = {
  role: string;
} | null;

export function StickyMobileNav({ user }: { user: User }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    function handleScroll() {
      // Show sticky nav after scrolling past the hero section (roughly screen width for square aspect)
      const threshold = window.innerWidth;
      setIsVisible(window.scrollY > threshold * 0.8);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 border-b border-zinc-200/80 bg-white/95 px-3 py-2 backdrop-blur-md sm:hidden">
      <ul className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-800">
        <li>
          <Link href="/" className="hover:text-zinc-600">
            Home
          </Link>
        </li>
        <li>
          <Link href="/book-a-tour" className="hover:text-zinc-600">
            Schedule
          </Link>
        </li>
        <li>
          <Link href="/packages" className="hover:text-zinc-600">
            Collections
          </Link>
        </li>
        <li>
          <Link href="/gallery" className="hover:text-zinc-600">
            Gallery
          </Link>
        </li>
        <li>
          <Link href="/reserve" className="hover:text-zinc-600">
            Reserve
          </Link>
        </li>
        <li>
          <Link href="/contact" className="hover:text-zinc-600">
            Contact
          </Link>
        </li>
        {user ? (
          <>
            <li>
              <Link href="/account" className="hover:text-zinc-600">
                Account
              </Link>
            </li>
            {user.role === "OWNER" ? (
              <li>
                <Link href="/admin" className="hover:text-zinc-600">
                  Admin
                </Link>
              </li>
            ) : null}
          </>
        ) : (
          <li>
            <Link href="/auth/sign-in" className="hover:text-zinc-600">
              Sign in
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}
