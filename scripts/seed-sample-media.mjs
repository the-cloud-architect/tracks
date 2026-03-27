import { mkdir, rm, writeFile, readFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { spawn } from "node:child_process";
import { randomUUID } from "node:crypto";

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const samples = [
  {
    type: "PHOTO",
    title: "Gazebo ceremony setup",
    description: "Warm outdoor wedding ceremony inspiration.",
    url: "https://images.pexels.com/photos/2253842/pexels-photo-2253842.jpeg?auto=compress&cs=tinysrgb&w=1800",
    fileName: "gazebo-ceremony.jpg",
    mimeType: "image/jpeg",
  },
  {
    type: "PHOTO",
    title: "Golden-hour couple portrait",
    description: "Golden-hour portrait inspiration for the gallery.",
    url: "https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=1800",
    fileName: "golden-hour-portrait.jpg",
    mimeType: "image/jpeg",
  },
  {
    type: "VIDEO",
    title: "Wedding style highlight reel",
    description: "Starter highlight video for venue promo rotation.",
    url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    fileName: "highlight-source.mp4",
    mimeType: "video/mp4",
  },
];

function required(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function createR2Client() {
  return new S3Client({
    region: "auto",
    endpoint: `https://${required("R2_ACCOUNT_ID")}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: required("R2_ACCESS_KEY_ID"),
      secretAccessKey: required("R2_SECRET_ACCESS_KEY"),
    },
  });
}

async function downloadToFile(url, outputPath) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download ${url} (${response.status})`);
  }
  const bytes = Buffer.from(await response.arrayBuffer());
  await writeFile(outputPath, bytes);
}

async function compressVideo(inputPath, outputPath) {
  await new Promise((resolve, reject) => {
    const proc = spawn("ffmpeg", [
      "-y",
      "-i",
      inputPath,
      "-vf",
      "scale='min(1280,iw)':-2",
      "-c:v",
      "libx264",
      "-preset",
      "fast",
      "-crf",
      "30",
      "-movflags",
      "+faststart",
      "-c:a",
      "aac",
      "-b:a",
      "128k",
      outputPath,
    ]);

    proc.on("error", reject);
    proc.on("exit", (code) => {
      if (code === 0) {
        resolve();
        return;
      }
      reject(new Error(`ffmpeg exited with code ${code}`));
    });
  });
}

async function uploadToR2(client, filePath, folder, mimeType) {
  const bucket = required("R2_BUCKET_NAME");
  const objectKey = `${folder}/${Date.now()}-${randomUUID()}.${
    folder === "videos" ? "mp4" : "jpg"
  }`;
  const body = await readFile(filePath);
  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: objectKey,
      Body: body,
      ContentType: mimeType,
      CacheControl: "public, max-age=31536000, immutable",
    }),
  );
  return { objectKey, sizeBytes: body.length };
}

async function main() {
  const accelerateUrl = process.env.PRISMA_ACCELERATE_URL;
  const validAccelerateUrl =
    accelerateUrl &&
    (accelerateUrl.startsWith("prisma://") ||
      accelerateUrl.startsWith("prisma+postgres://"))
      ? accelerateUrl
      : null;
  const prisma = validAccelerateUrl
    ? new PrismaClient({ accelerateUrl: validAccelerateUrl })
    : new PrismaClient({
        adapter: new PrismaPg(
          new pg.Pool({
            connectionString: required("DATABASE_URL"),
          }),
        ),
      });
  const r2 = createR2Client();
  const workDir = join(tmpdir(), `tracks-seed-${Date.now()}`);

  await mkdir(workDir, { recursive: true });

  try {
    for (const sample of samples) {
      const sourcePath = join(workDir, sample.fileName);
      await downloadToFile(sample.url, sourcePath);

      let uploadPath = sourcePath;
      let mimeType = sample.mimeType;
      let folder = sample.type === "VIDEO" ? "videos" : "photos";

      if (sample.type === "VIDEO") {
        const compressedPath = join(workDir, "highlight-compressed.mp4");
        await compressVideo(sourcePath, compressedPath);
        uploadPath = compressedPath;
        mimeType = "video/mp4";
      }

      const uploaded = await uploadToR2(r2, uploadPath, folder, mimeType);
      await prisma.mediaAsset.create({
        data: {
          title: sample.title,
          description: sample.description,
          type: sample.type,
          objectKey: uploaded.objectKey,
          mimeType,
          sizeBytes: uploaded.sizeBytes,
          sourceUrl: sample.url,
          status: "ACTIVE",
        },
      });
    }
  } finally {
    await prisma.$disconnect();
    await rm(workDir, { recursive: true, force: true });
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
