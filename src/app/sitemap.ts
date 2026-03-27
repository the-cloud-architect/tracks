import type { MetadataRoute } from "next";

const routes = [
  "",
  "about",
  "packages",
  "gallery",
  "book-a-tour",
  "reserve",
  "faq",
  "contact",
  "privacy",
  "terms",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `https://weddingtracks.org/${route}`.replace(/\/$/, ""),
    lastModified: new Date(),
  }));
}
