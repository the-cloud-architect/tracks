import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-zinc-200/70 bg-white/90">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-8 text-sm text-zinc-600 sm:px-10">
        <p className="font-medium text-zinc-800">
          Wedding Tracks · Elegant Wedding Venue
        </p>
        <p>
          Designed for intimate celebrations with elevated weekend experiences
          near Ellijay, Georgia.
        </p>
        <p>© {new Date().getFullYear()} Wedding Tracks. All rights reserved.</p>
        <div className="flex flex-wrap gap-4">
          <Link href="/privacy" className="hover:text-zinc-900">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-zinc-900">
            Terms & Conditions
          </Link>
        </div>
      </div>
    </footer>
  );
}
