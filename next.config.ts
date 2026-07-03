import type { NextConfig } from "next";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH?.trim().replace(/\/+$/, "") || undefined;

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
  basePath,
  images: {
    remotePatterns: getRemoteImagePatterns(),
  },
};

export default nextConfig;
