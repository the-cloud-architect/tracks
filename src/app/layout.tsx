import type { Metadata } from "next";
import { Playfair_Display, Montserrat } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.weddingtracks.org"),
  title: {
    default: "Wedding Tracks | Elegant Wedding Venue",
    template: "%s | Wedding Tracks",
  },
  description:
    "A romantic wedding venue for intimate celebrations, weekend stays, and unforgettable destination-style moments.",
  keywords: [
    "Chatsworth wedding venue",
    "North Georgia wedding venue",
    "intimate wedding venue",
    "gazebo wedding ceremony",
    "wedding venue with house rental",
  ],
  openGraph: {
    title: "Wedding Tracks",
    description:
      "Celebrate in North Georgia with elegant ceremony spaces, curated weekend experiences, and refined rustic charm.",
    url: "https://weddingtracks.org",
    siteName: "Wedding Tracks",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/api/hero-share-image?v=2",
        width: 1200,
        height: 630,
        alt: "Wedding Tracks hero video preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Wedding Tracks",
    description:
      "Celebrate in North Georgia with elegant ceremony spaces, curated weekend experiences, and refined rustic charm.",
    images: ["/api/hero-share-image?v=2"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    shortcut: ["/icon.svg"],
    apple: ["/icon.svg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${montserrat.variable} h-full antialiased`}
    >
      <body className="romantic-bg min-h-full flex flex-col text-zinc-900">
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
