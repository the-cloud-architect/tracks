import Link from "next/link";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/packages", label: "Packages" },
  { href: "/gallery", label: "Gallery" },
  { href: "/book-a-tour", label: "Book a Tour" },
  { href: "/reserve", label: "Reserve" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-4 sm:px-10">
        <Link href="/" className="text-lg font-semibold tracking-tight text-zinc-900">
          Tracks and Champagne
        </Link>
        <nav className="flex flex-wrap items-center gap-3 text-sm text-zinc-700">
          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded px-2 py-1 hover:bg-zinc-100"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
