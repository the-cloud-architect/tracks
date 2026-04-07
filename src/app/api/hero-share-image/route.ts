import { NextRequest, NextResponse } from "next/server";

import { getPrismaClient } from "@/lib/prisma";
import { getVideoThumbnailObjectKey, r2ObjectExists, tryGetR2ObjectUrl } from "@/lib/r2";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const fallbackUrl = new URL("/images/hero-share.jpg", request.url);

  try {
    const prisma = getPrismaClient();
    // Check for desktop hero first, then legacy HERO_VIDEO
    let heroVideo = await prisma.mediaAsset.findFirst({
      where: {
        status: "ACTIVE",
        type: "VIDEO",
        sourceUrl: "HERO_VIDEO_DESKTOP",
      },
      select: { objectKey: true },
    });
    if (!heroVideo) {
      heroVideo = await prisma.mediaAsset.findFirst({
        where: {
          status: "ACTIVE",
          type: "VIDEO",
          sourceUrl: "HERO_VIDEO",
        },
        select: { objectKey: true },
      });
    }

    if (!heroVideo?.objectKey) {
      return NextResponse.redirect(fallbackUrl, 307);
    }

    const thumbnailObjectKey = getVideoThumbnailObjectKey(heroVideo.objectKey);
    const thumbnailUrl = tryGetR2ObjectUrl(thumbnailObjectKey);
    if (!thumbnailUrl) {
      return NextResponse.redirect(fallbackUrl, 307);
    }

    const thumbnailExists = await r2ObjectExists(thumbnailObjectKey);
    if (!thumbnailExists) {
      return NextResponse.redirect(fallbackUrl, 307);
    }

    return NextResponse.redirect(thumbnailUrl, 307);
  } catch {
    return NextResponse.redirect(fallbackUrl, 307);
  }
}
