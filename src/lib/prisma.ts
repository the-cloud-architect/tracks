import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
  pgPool?: pg.Pool;
};
export function getPrismaClient(): PrismaClient {
  if (globalForPrisma.prisma) {
    return globalForPrisma.prisma;
  }
  const accelerateUrlRaw = process.env.PRISMA_ACCELERATE_URL;
  const accelerateUrl =
    accelerateUrlRaw &&
    (accelerateUrlRaw.startsWith("prisma://") ||
      accelerateUrlRaw.startsWith("prisma+postgres://"))
      ? accelerateUrlRaw
      : null;
  const client = accelerateUrl
    ? new PrismaClient({
        accelerateUrl,
      })
    : (() => {
        const databaseUrl = process.env.DATABASE_URL;
        if (!databaseUrl) {
          throw new Error("Missing DATABASE_URL environment variable.");
        }

        const pool =
          globalForPrisma.pgPool ??
          new pg.Pool({
            connectionString: databaseUrl,
          });

        if (!globalForPrisma.pgPool && process.env.NODE_ENV !== "production") {
          globalForPrisma.pgPool = pool;
        }

        const adapter = new PrismaPg(pool);
        return new PrismaClient({ adapter });
      })();

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = client;
  }

  return client;
}

