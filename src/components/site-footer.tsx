import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-zinc-200 bg-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-6 py-6 text-sm text-zinc-600 sm:px-10">
        <p>© {new Date().getFullYear()} Tracks and Champagne, Chatsworth, Georgia.</p>
        <p>Owned and operated by Wesley Morris.</p>
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
