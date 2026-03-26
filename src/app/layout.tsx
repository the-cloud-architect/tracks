import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://tracksandchampagne.com"),
  title: {
    default: "Tracks and Champagne — Wedding Venue in Chatsworth, GA",
    template: "%s | Tracks and Champagne",
  },
  description:
    "An intimate wedding venue on 17 acres in Chatsworth, Georgia. Railroad-themed charm, a gazebo ceremony space for up to 40 guests, ATV trails, and affordable packages.",
  keywords: [
    "wedding venue",
    "Chatsworth GA",
    "Georgia wedding",
    "intimate wedding",
    "affordable wedding venue",
    "small wedding venue Georgia",
    "Tracks and Champagne",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Tracks and Champagne — Wedding Venue in Chatsworth, GA",
    description:
      "Railroad charm meets rolling hills on 17 acres. Gazebo ceremony space, train-depot styled house, ATV trails, and parking for 25. Tours open May 1.",
    url: "/",
    siteName: "Tracks and Champagne",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tracks and Champagne — Wedding Venue in Chatsworth, GA",
    description:
      "An intimate wedding venue on 17 acres in Chatsworth, Georgia. Railroad-themed charm, gazebo ceremony space, and affordable packages.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
