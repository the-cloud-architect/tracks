import { getPrismaClient } from "@/lib/prisma";
import { unstable_cache } from "next/cache";

export type PointOfInterestView = {
  id: string;
  name: string;
  category: string;
  description: string;
  latitude: number;
  longitude: number;
  externalUrl: string;
};

export const DEFAULT_POINTS_OF_INTEREST: PointOfInterestView[] = [
  {
    id: "default-downtown-ellijay",
    name: "Downtown Ellijay Square",
    category: "Town & Shopping",
    description: "Historic downtown square with shops, restaurants, and local events.",
    latitude: 34.6949,
    longitude: -84.4826,
    externalUrl: "https://www.google.com/maps/search/?api=1&query=Downtown+Ellijay+Square",
  },
  {
    id: "default-cartecay-vineyards",
    name: "Cartecay Vineyards",
    category: "Wineries",
    description: "A scenic vineyard experience just outside Ellijay.",
    latitude: 34.6659,
    longitude: -84.4316,
    externalUrl: "https://www.google.com/maps/search/?api=1&query=Cartecay+Vineyards+Ellijay",
  },
  {
    id: "default-reece-cider",
    name: "Reece’s Cider Company",
    category: "Orchards",
    description: "Popular orchard and cider stop for guests during apple season.",
    latitude: 34.6606,
    longitude: -84.4269,
    externalUrl: "https://www.google.com/maps/search/?api=1&query=Reece%27s+Cider+Company+Ellijay",
  },
  {
    id: "default-cartecay-river",
    name: "Cartecay River Experience",
    category: "Outdoors",
    description: "River tubing, kayaking, and scenic picnic spots.",
    latitude: 34.6941,
    longitude: -84.4312,
    externalUrl: "https://www.google.com/maps/search/?api=1&query=Cartecay+River+Ellijay",
  },
];
async function ensureDefaultPointsOfInterest() {
  const prisma = getPrismaClient();
  await prisma.pointOfInterest
    .createMany({
      data: DEFAULT_POINTS_OF_INTEREST.map((point) => ({
        id: point.id,
        name: point.name,
        category: point.category,
        description: point.description,
        latitude: point.latitude,
        longitude: point.longitude,
        externalUrl: point.externalUrl,
        isActive: true,
      })),
      skipDuplicates: true,
    })
    .catch(() => {});
}

const getCachedPointsOfInterest = unstable_cache(
  async () => {
    const prisma = getPrismaClient();
    return prisma.pointOfInterest
      .findMany({
        where: { isActive: true },
        orderBy: [{ category: "asc" }, { name: "asc" }],
        select: {
          id: true,
          name: true,
          category: true,
          description: true,
          latitude: true,
          longitude: true,
          externalUrl: true,
        },
      })
      .catch(() => []);
  },
  ["points-of-interest"],
  {
    revalidate: 3600,
    tags: ["points-of-interest"],
  },
);

export async function getPointsOfInterest(): Promise<PointOfInterestView[]> {
  await ensureDefaultPointsOfInterest();
  const rows = await getCachedPointsOfInterest();

  if (rows.length === 0) {
    return DEFAULT_POINTS_OF_INTEREST;
  }

  return rows.map((row) => ({
    ...row,
    description: row.description ?? "",
  }));
}

export async function getPointsOfInterestForAdmin() {
  const prisma = getPrismaClient();
  await ensureDefaultPointsOfInterest();
  return prisma.pointOfInterest
    .findMany({
      orderBy: [{ category: "asc" }, { name: "asc" }],
    })
    .catch(() => []);
}
