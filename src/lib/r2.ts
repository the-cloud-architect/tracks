import { randomUUID } from "crypto";
import { PutObjectCommand, DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";

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

export async function uploadFileToR2(input: {
  file: File;
  folder: "photos" | "videos";
}): Promise<{ objectKey: string; url: string }> {
  const client = getR2Client();
  const config = getR2Config();
  const ext = input.file.name.includes(".")
    ? input.file.name.slice(input.file.name.lastIndexOf(".")).toLowerCase()
    : "";
  const safeBase = sanitizeName(input.file.name.replace(/\.[^.]+$/, "")) || "asset";
  const objectKey = `${input.folder}/${Date.now()}-${randomUUID()}-${safeBase}${ext}`;

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
