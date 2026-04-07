import { NextRequest, NextResponse } from "next/server";

import { getSessionUser } from "@/lib/auth/session";
import { createMediaObjectKey, createPresignedR2UploadUrl } from "@/lib/r2";

const MAX_FILE_SIZE_BYTES = 512 * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== "OWNER") {
      return NextResponse.json({ error: "Owner access required." }, { status: 403 });
    }

    const body = await request.json();
    const fileName = String(body.fileName ?? "").trim();
    const fileType = String(body.fileType ?? "").trim().toLowerCase();
    const fileSize = Number(body.fileSize ?? 0);

    if (!fileName || !fileType || !Number.isFinite(fileSize)) {
      return NextResponse.json({ error: "Missing required file metadata." }, { status: 400 });
    }

    if (fileSize <= 0 || fileSize > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json({ error: "File must be between 1 byte and 512MB." }, { status: 400 });
    }

    const isPhoto = fileType.startsWith("image/");
    const isVideo = fileType.startsWith("video/");
    if (!isPhoto && !isVideo) {
      return NextResponse.json({ error: "Only image and video files are supported." }, { status: 400 });
    }

    const objectKey = createMediaObjectKey({
      fileName,
      folder: isPhoto ? "photos" : "videos",
    });
    const uploadUrl = await createPresignedR2UploadUrl({
      objectKey,
      contentType: fileType || "application/octet-stream",
      expiresInSeconds: 300,
    });

    return NextResponse.json({ uploadUrl, objectKey });
  } catch {
    return NextResponse.json({ error: "Could not initialize upload." }, { status: 500 });
  }
}
