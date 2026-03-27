"use server";

import { revalidatePath } from "next/cache";

import { getSessionUser } from "@/lib/auth/session";
import { getPrismaClient } from "@/lib/prisma";
import { deleteFileFromR2, uploadFileToR2 } from "@/lib/r2";

const PHOTO_MIME_PREFIX = "image/";
const VIDEO_MIME_PREFIX = "video/";
const MAX_FILE_SIZE_BYTES = 80 * 1024 * 1024;

export async function uploadMediaAsset(formData: FormData) {
  const prisma = getPrismaClient();
  const user = await getSessionUser();

  if (!user || user.role !== "OWNER") {
    throw new Error("Owner access required.");
  }

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    throw new Error("A file is required.");
  }

  if (!title) {
    throw new Error("Title is required.");
  }

  if (file.size <= 0 || file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error("File must be between 1 byte and 80MB.");
  }

  const isPhoto = file.type.startsWith(PHOTO_MIME_PREFIX);
  const isVideo = file.type.startsWith(VIDEO_MIME_PREFIX);
  if (!isPhoto && !isVideo) {
    throw new Error("Only image and video files are supported.");
  }

  const folder = isPhoto ? "photos" : "videos";
  const type = isPhoto ? "PHOTO" : "VIDEO";
  const uploaded = await uploadFileToR2({ file, folder });

  await prisma.mediaAsset.create({
    data: {
      title,
      description: description || null,
      type,
      objectKey: uploaded.objectKey,
      mimeType: file.type || "application/octet-stream",
      sizeBytes: file.size,
    },
  });

  revalidatePath("/gallery");
  revalidatePath("/admin/media");
}

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

  await prisma.$transaction([
    prisma.mediaAsset.updateMany({
      where: { type: "VIDEO", sourceUrl: "HERO_VIDEO" },
      data: { sourceUrl: null },
    }),
    prisma.mediaAsset.update({
      where: { id: asset.id },
      data: { sourceUrl: "HERO_VIDEO" },
    }),
  ]);

  revalidatePath("/");
  revalidatePath("/admin/media");
}
