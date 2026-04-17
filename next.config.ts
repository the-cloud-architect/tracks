import type { NextConfig } from "next";

function getRemoteImagePatterns(): NonNullable<NextConfig["images"]>["remotePatterns"] {
  const baseUrl = process.env.R2_PUBLIC_BASE_URL?.trim();
  if (!baseUrl) {
    return [];
  }

  try {
    const url = new URL(baseUrl);
    const pathnameBase = url.pathname.replace(/\/$/, "");
    const pattern = new URL(`${url.origin}${pathnameBase || ""}/**`);
    return [
      pattern,
    ];
  } catch {
    return [];
  }
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: getRemoteImagePatterns(),
  },
};

export default nextConfig;
