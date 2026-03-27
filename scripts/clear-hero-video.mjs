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
  ? new PrismaClient({ accelerateUrl })
  : (() => {
      const databaseUrl = process.env.DATABASE_URL;
      if (!databaseUrl) {
        throw new Error("Missing DATABASE_URL environment variable.");
      }
      const pool = new pg.Pool({ connectionString: databaseUrl });
      return new PrismaClient({ adapter: new PrismaPg(pool) });
    })();

async function main() {
  await prisma.mediaAsset.updateMany({
    where: { sourceUrl: "HERO_VIDEO" },
    data: { sourceUrl: null },
  });
  console.log("hero_video_selection_cleared");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
