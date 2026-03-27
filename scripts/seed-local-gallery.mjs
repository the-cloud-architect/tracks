import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const accelerateUrlRaw = process.env.PRISMA_ACCELERATE_URL;
const accelerateUrl =
  accelerateUrlRaw &&
  (accelerateUrlRaw.startsWith("prisma://") || accelerateUrlRaw.startsWith("prisma+postgres://"))
    ? accelerateUrlRaw
    : null;

const prisma = accelerateUrl
  ? new PrismaClient({
      accelerateUrl,
    })
  : (() => {
      const databaseUrl = process.env.DATABASE_URL;
      if (!databaseUrl) {
        throw new Error("Missing DATABASE_URL environment variable.");
      }
      const pool = new pg.Pool({
        connectionString: databaseUrl,
      });
      const adapter = new PrismaPg(pool);
      return new PrismaClient({ adapter });
    })();

const localPhotos = Array.from({ length: 12 }, (_, i) => ({
  title: `Wedding Gallery Photo ${i + 1}`,
  description: "Curated wedding inspiration image for the Wedding Tracks gallery.",
  type: "PHOTO",
  objectKey: `/images/gallery/photo-${i + 1}.jpg`,
  mimeType: "image/jpeg",
  sizeBytes: 1_000_000,
  status: "ACTIVE",
}));

async function main() {
  const existing = await prisma.mediaAsset.count({
    where: { status: "ACTIVE", type: "PHOTO" },
  });

  for (const photo of localPhotos) {
    await prisma.mediaAsset.upsert({
      where: { objectKey: photo.objectKey },
      update: {
        title: photo.title,
        description: photo.description,
        mimeType: photo.mimeType,
        sizeBytes: photo.sizeBytes,
        status: "ACTIVE",
      },
      create: photo,
    });
  }

  const after = await prisma.mediaAsset.count({
    where: { status: "ACTIVE", type: "PHOTO" },
  });

  console.log(
    JSON.stringify(
      {
        existingPhotoCount: existing,
        afterPhotoCount: after,
      },
      null,
      2,
    ),
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
