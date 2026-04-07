import { randomUUID } from "crypto";
import { PutObjectCommand, DeleteObjectCommand, HeadObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

type R2Config = {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucket: string;
  publicBaseUrl: string;
};

let cachedClient: S3Client | null = null;
let cachedConfig: R2Config | null = null;

function getR2Config(): R2Config {
  if (cachedConfig) {
    return cachedConfig;
  }

  const accountId = process.env.R2_ACCOUNT_ID?.trim();
  const accessKeyId = process.env.R2_ACCESS_KEY_ID?.trim();
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY?.trim();
  const bucket = process.env.R2_BUCKET_NAME?.trim();
  const publicBaseUrl = process.env.R2_PUBLIC_BASE_URL?.trim();

  if (!accountId || !accessKeyId || !secretAccessKey || !bucket || !publicBaseUrl) {
    throw new Error("Missing required R2 environment variables.");
  }

  cachedConfig = {
    accountId,
    accessKeyId,
    secretAccessKey,
    bucket,
    publicBaseUrl: publicBaseUrl.replace(/\/$/, ""),
  };

  return cachedConfig;
}

function getR2Client(): S3Client {
  if (cachedClient) {
    return cachedClient;
  }

  const config = getR2Config();

  cachedClient = new S3Client({
    region: "auto",
    endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
  });

  return cachedClient;
}

export function getR2ObjectUrl(objectKey: string): string {
  const { publicBaseUrl } = getR2Config();
  return `${publicBaseUrl}/${objectKey}`;
}

export function tryGetR2ObjectUrl(objectKey: string): string | null {
  const sanitizedObjectKey = objectKey?.trim().replace(/\s+/g, "");

  if (!sanitizedObjectKey) {
    return null;
  }
  if (
    sanitizedObjectKey.startsWith("http://") ||
    sanitizedObjectKey.startsWith("https://")
  ) {
    return sanitizedObjectKey;
  }

  if (sanitizedObjectKey.startsWith("/")) {
    return sanitizedObjectKey;
  }

  const publicBaseUrl = process.env.R2_PUBLIC_BASE_URL?.trim().replace(/\/$/, "");
  if (!publicBaseUrl) {
    return null;
  }

  const normalizedKey = sanitizedObjectKey.replace(/^\/+/, "");
  return `${publicBaseUrl}/${normalizedKey}`;
}

function sanitizeName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9.-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function createMediaObjectKey(input: {
  fileName: string;
  folder: "photos" | "videos";
}): string {
  const ext = input.fileName.includes(".")
    ? input.fileName.slice(input.fileName.lastIndexOf(".")).toLowerCase()
    : "";
  const safeBase = sanitizeName(input.fileName.replace(/\.[^.]+$/, "")) || "asset";
  return `${input.folder}/${Date.now()}-${randomUUID()}-${safeBase}${ext}`;
}

export function getVideoThumbnailObjectKey(videoObjectKey: string): string {
  const normalizedVideoKey = videoObjectKey.trim().replace(/^\/+/, "");
  const withoutPrefix = normalizedVideoKey.startsWith("videos/")
    ? normalizedVideoKey.slice("videos/".length)
    : normalizedVideoKey;
  const withoutExtension = withoutPrefix.replace(/\.[^.]+$/, "");
  return `video-thumbnails/${withoutExtension}.jpg`;
}

export async function createPresignedR2UploadUrl(input: {
  objectKey: string;
  contentType: string;
  expiresInSeconds?: number;
}): Promise<string> {
  const client = getR2Client();
  const config = getR2Config();
  const command = new PutObjectCommand({
    Bucket: config.bucket,
    Key: input.objectKey,
    ContentType: input.contentType || "application/octet-stream",
    CacheControl: "public, max-age=31536000, immutable",
  });
  return getSignedUrl(client, command, {
    expiresIn: input.expiresInSeconds ?? 300,
  });
}

export async function uploadFileToR2(input: {
  file: File;
  folder: "photos" | "videos";
}): Promise<{ objectKey: string; url: string }> {
  const client = getR2Client();
  const config = getR2Config();
  const objectKey = createMediaObjectKey({
    fileName: input.file.name,
    folder: input.folder,
  });

  const bytes = await input.file.arrayBuffer();
  await client.send(
    new PutObjectCommand({
      Bucket: config.bucket,
      Key: objectKey,
      Body: Buffer.from(bytes),
      ContentType: input.file.type || "application/octet-stream",
      CacheControl: "public, max-age=31536000, immutable",
    }),
  );

  return {
    objectKey,
    url: getR2ObjectUrl(objectKey),
  };
}

export async function deleteFileFromR2(objectKey: string): Promise<void> {
  const client = getR2Client();
  const config = getR2Config();

  await client.send(
    new DeleteObjectCommand({
      Bucket: config.bucket,
      Key: objectKey,
    }),
  );
}

export async function r2ObjectExists(objectKey: string): Promise<boolean> {
  try {
    const client = getR2Client();
    const config = getR2Config();
    await client.send(
      new HeadObjectCommand({
        Bucket: config.bucket,
        Key: objectKey,
      }),
    );
    return true;
  } catch {
    return false;
  }
}
