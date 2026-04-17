import { unstable_cache } from "next/cache";

import { getPrismaClient } from "@/lib/prisma";
import { getVideoThumbnailObjectKey, tryGetR2ObjectUrl } from "@/lib/r2";

type GalleryAsset = {
  id: string;
  title: string;
  description: string | null;
  objectKey: string;
};

export type HomeHeroMedia = {
  desktopVideoUrl: string;
  mobileVideoUrl: string;
  desktopPosterUrl: string;
  mobilePosterUrl: string;
  heroPosterUrl: string;
};

const DEFAULT_HERO_VIDEO_URL = "/videos/wedding-hero.mp4";
const DEFAULT_HERO_POSTER_URL = "/images/hero-share.jpg";

const getCachedGalleryAssets = unstable_cache(
  async (): Promise<GalleryAsset[]> => {
    const prisma = getPrismaClient();
    return prisma.mediaAsset
      .findMany({
        where: { status: "ACTIVE", type: "PHOTO" },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          description: true,
          objectKey: true,
        },
      })
      .catch(() => []);
  },
  ["gallery-media"],
  {
    revalidate: 3600,
    tags: ["gallery-media"],
  },
);

const getCachedHomeHeroMedia = unstable_cache(
  async (): Promise<HomeHeroMedia> => {
    const prisma = getPrismaClient();
    const assets = await prisma.mediaAsset
      .findMany({
        where: {
          status: "ACTIVE",
          type: "VIDEO",
          sourceUrl: {
            in: ["HERO_VIDEO_DESKTOP", "HERO_VIDEO_MOBILE", "HERO_VIDEO"],
          },
        },
        select: {
          objectKey: true,
          sourceUrl: true,
        },
      })
      .catch(() => []);

    const assetBySource = new Map(
      assets
        .filter((asset) => asset.sourceUrl)
        .map((asset) => [asset.sourceUrl as string, asset.objectKey]),
    );

    const desktopVideoKey =
      assetBySource.get("HERO_VIDEO_DESKTOP") ?? assetBySource.get("HERO_VIDEO") ?? null;
    const mobileVideoKey = assetBySource.get("HERO_VIDEO_MOBILE") ?? desktopVideoKey;

    const desktopVideoUrl =
      (desktopVideoKey && tryGetR2ObjectUrl(desktopVideoKey)) ?? DEFAULT_HERO_VIDEO_URL;
    const mobileVideoUrl =
      (mobileVideoKey && tryGetR2ObjectUrl(mobileVideoKey)) ?? desktopVideoUrl;

    const desktopPosterUrl =
      (desktopVideoKey && tryGetR2ObjectUrl(getVideoThumbnailObjectKey(desktopVideoKey))) ??
      DEFAULT_HERO_POSTER_URL;
    const mobilePosterUrl =
      (mobileVideoKey && tryGetR2ObjectUrl(getVideoThumbnailObjectKey(mobileVideoKey))) ??
      desktopPosterUrl;

    return {
      desktopVideoUrl,
      mobileVideoUrl,
      desktopPosterUrl,
      mobilePosterUrl,
      heroPosterUrl: mobilePosterUrl || desktopPosterUrl || DEFAULT_HERO_POSTER_URL,
    };
  },
  ["home-hero-media"],
  {
    revalidate: 3600,
    tags: ["hero-media"],
  },
);

export async function getGalleryAssets(): Promise<GalleryAsset[]> {
  return getCachedGalleryAssets();
}

export async function getHomeHeroMedia(): Promise<HomeHeroMedia> {
  return getCachedHomeHeroMedia();
}
