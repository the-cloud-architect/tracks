"use server";

import { revalidatePath } from "next/cache";

import { getSessionUser } from "@/lib/auth/session";
import { getPrismaClient } from "@/lib/prisma";
import { deleteFileFromR2, getVideoThumbnailObjectKey } from "@/lib/r2";

export async function deleteMediaAsset(formData: FormData) {
  const prisma = getPrismaClient();
  const user = await getSessionUser();

  if (!user || user.role !== "OWNER") {
    throw new Error("Owner access required.");
  }

  const mediaId = String(formData.get("mediaId") ?? "").trim();
  if (!mediaId) {
    return;
  }

  const asset = await prisma.mediaAsset.findUnique({
    where: { id: mediaId },
    select: { id: true, objectKey: true },
  });

  if (!asset) {
    return;
  }

  await deleteFileFromR2(asset.objectKey).catch(() => {});
  if (asset.objectKey.startsWith("videos/")) {
    await deleteFileFromR2(getVideoThumbnailObjectKey(asset.objectKey)).catch(() => {});
  }
  await prisma.mediaAsset.delete({
    where: { id: asset.id },
  });

  revalidatePath("/gallery");
  revalidatePath("/admin/media");
  revalidatePath("/");
}

export async function setHeroVideoAsset(formData: FormData) {
  const prisma = getPrismaClient();
  const user = await getSessionUser();

  if (!user || user.role !== "OWNER") {
    throw new Error("Owner access required.");
  }

  const mediaId = String(formData.get("mediaId") ?? "").trim();
  const target = String(formData.get("target") ?? "desktop").trim();
  if (!mediaId) {
    return;
  }

  const asset = await prisma.mediaAsset.findUnique({
    where: { id: mediaId },
    select: { id: true, type: true, status: true },
  });

  if (!asset || asset.type !== "VIDEO" || asset.status !== "ACTIVE") {
    return;
  }

  const sourceUrlValue = target === "mobile" ? "HERO_VIDEO_MOBILE" : "HERO_VIDEO_DESKTOP";

  await prisma.$transaction([
    prisma.mediaAsset.updateMany({
      where: { type: "VIDEO", sourceUrl: sourceUrlValue },
      data: { sourceUrl: null },
    }),
    prisma.mediaAsset.update({
      where: { id: asset.id },
      data: { sourceUrl: sourceUrlValue },
    }),
  ]);

  revalidatePath("/");
  revalidatePath("/admin/media");
}
