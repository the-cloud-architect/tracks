import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

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
    default: "Tracks and Champagne | Wedding Venue in Chatsworth, GA",
    template: "%s | Tracks and Champagne",
  },
  description:
    "Tracks and Champagne offers gazebo ceremonies, house-stay wedding packages, and trail experiences in North Georgia.",
  keywords: [
    "Chatsworth wedding venue",
    "North Georgia wedding venue",
    "intimate wedding venue",
    "gazebo wedding ceremony",
    "wedding venue with house rental",
  ],
  openGraph: {
    title: "Tracks and Champagne",
    description:
      "A unique affordable wedding venue in Chatsworth, GA with gazebo ceremonies, house stays, and scenic trails.",
    url: "https://tracksandchampagne.com",
    siteName: "Tracks and Champagne",
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
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
      <body className="min-h-full flex flex-col bg-zinc-50 text-zinc-900">
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
