import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

import { getSessionUser } from "@/lib/auth/session";
import { getPrismaClient } from "@/lib/prisma";

const MAX_FILE_SIZE_BYTES = 512 * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== "OWNER") {
      return NextResponse.json({ error: "Owner access required." }, { status: 403 });
    }

    const body = await request.json();
    const title = String(body.title ?? "").trim();
    const description = String(body.description ?? "").trim();
    const objectKey = String(body.objectKey ?? "").trim();
    const mimeType = String(body.mimeType ?? "").trim().toLowerCase();
    const sizeBytes = Number(body.sizeBytes ?? 0);

    if (!title || !objectKey || !mimeType || !Number.isFinite(sizeBytes)) {
      return NextResponse.json({ error: "Missing required media data." }, { status: 400 });
    }
    if (sizeBytes <= 0 || sizeBytes > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json({ error: "File must be between 1 byte and 512MB." }, { status: 400 });
    }

    const isPhoto = mimeType.startsWith("image/");
    const isVideo = mimeType.startsWith("video/");
    if (!isPhoto && !isVideo) {
      return NextResponse.json({ error: "Only image and video files are supported." }, { status: 400 });
    }

    if (!objectKey.startsWith("photos/") && !objectKey.startsWith("videos/")) {
      return NextResponse.json({ error: "Invalid object key." }, { status: 400 });
    }

    const prisma = getPrismaClient();
    const asset = await prisma.mediaAsset.create({
      data: {
        title,
        description: description || null,
        type: isPhoto ? "PHOTO" : "VIDEO",
        objectKey,
        mimeType: mimeType || "application/octet-stream",
        sizeBytes,
      },
      select: { id: true },
    });

    revalidatePath("/gallery");
    revalidatePath("/admin/media");

    return NextResponse.json({ ok: true, id: asset.id });
  } catch {
    return NextResponse.json({ error: "Could not save uploaded media." }, { status: 500 });
  }
}
