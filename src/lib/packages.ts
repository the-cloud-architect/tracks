import type { PackageConfig } from "@prisma/client";
import { unstable_cache } from "next/cache";

import { getPrismaClient } from "@/lib/prisma";
import {
  DEFAULT_VENUE_PACKAGES,
  formatUsd,
  type PackageTier,
  type VenuePackage,
} from "@/lib/packages-shared";

export { DEFAULT_VENUE_PACKAGES, formatUsd };
export type { PackageTier, VenuePackage };

const getCachedPackageConfigs = unstable_cache(
  async (): Promise<Array<Pick<PackageConfig, "tier" | "priceCents" | "depositCents">>> => {
    const prisma = getPrismaClient();
    return prisma.packageConfig
      .findMany({
        select: { tier: true, priceCents: true, depositCents: true },
      })
      .catch(() => []);
  },
  ["venue-packages"],
  {
    revalidate: 3600,
    tags: ["venue-packages"],
  },
);

function applyPackageConfig(
  defaults: VenuePackage[],
  configs: Array<Pick<PackageConfig, "tier" | "priceCents" | "depositCents">>,
): VenuePackage[] {
  const byTier = new Map(configs.map((config) => [config.tier, config]));
  return defaults.map((pkg) => {
    const config = byTier.get(pkg.key);
    if (!config) {
      return pkg;
    }
    return {
      ...pkg,
      priceCents: config.priceCents,
      depositCents: config.depositCents,
    };
  });
}

export async function getVenuePackages(): Promise<VenuePackage[]> {
  const configs = await getCachedPackageConfigs();
  if (configs.length === 0) {
    return DEFAULT_VENUE_PACKAGES;
  }
  return applyPackageConfig(DEFAULT_VENUE_PACKAGES, configs);
}

export async function getPackageByTier(tier: string): Promise<VenuePackage | undefined> {
  const packages = await getVenuePackages();
  return packages.find((pkg) => pkg.key === tier);
}
