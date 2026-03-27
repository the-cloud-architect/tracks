"use server";

import { revalidatePath } from "next/cache";

import { getSessionUser } from "@/lib/auth/session";
import { DEFAULT_VENUE_PACKAGES, type PackageTier } from "@/lib/packages";
import { getPrismaClient } from "@/lib/prisma";

function toCents(value: string): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) {
    throw new Error("Amounts must be valid positive numbers.");
  }
  return Math.round(parsed * 100);
}

function isPackageTier(value: string): value is PackageTier {
  return DEFAULT_VENUE_PACKAGES.some((pkg) => pkg.key === value);
}

export async function updatePackagePricing(formData: FormData) {
  const prisma = getPrismaClient();
  const user = await getSessionUser();
  if (!user || user.role !== "OWNER") {
    throw new Error("Owner access required.");
  }

  const tier = String(formData.get("tier") ?? "").trim();
  const priceUsd = String(formData.get("priceUsd") ?? "").trim();
  const depositUsd = String(formData.get("depositUsd") ?? "").trim();

  if (!isPackageTier(tier)) {
    throw new Error("Invalid package tier.");
  }

  const priceCents = toCents(priceUsd);
  const depositCents = toCents(depositUsd);
  if (depositCents > priceCents) {
    throw new Error("Deposit cannot exceed package price.");
  }

  await prisma.packageConfig.upsert({
    where: { tier },
    update: { priceCents, depositCents },
    create: { tier, priceCents, depositCents },
  });

  revalidatePath("/packages");
  revalidatePath("/reserve");
  revalidatePath("/admin/content");
}

export async function addPointOfInterest(formData: FormData) {
  const prisma = getPrismaClient();
  const user = await getSessionUser();
  if (!user || user.role !== "OWNER") {
    throw new Error("Owner access required.");
  }

  const name = String(formData.get("name") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const latitude = Number(String(formData.get("latitude") ?? "").trim());
  const longitude = Number(String(formData.get("longitude") ?? "").trim());
  const externalUrl = String(formData.get("externalUrl") ?? "").trim();

  if (!name || !category || !externalUrl) {
    throw new Error("Name, category, and research URL are required.");
  }
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    throw new Error("Latitude and longitude must be valid numbers.");
  }
  new URL(externalUrl);

  await prisma.pointOfInterest.create({
    data: {
      name,
      category,
      description: description || null,
      latitude,
      longitude,
      externalUrl,
      isActive: true,
    },
  });

  revalidatePath("/things-to-do");
  revalidatePath("/admin/content");
}

export async function removePointOfInterest(formData: FormData) {
  const prisma = getPrismaClient();
  const user = await getSessionUser();
  if (!user || user.role !== "OWNER") {
    throw new Error("Owner access required.");
  }

  const id = String(formData.get("id") ?? "").trim();
  if (!id) {
    return;
  }

  await prisma.pointOfInterest.delete({ where: { id } }).catch(() => {});
  revalidatePath("/things-to-do");
  revalidatePath("/admin/content");
}

export async function updatePointOfInterest(formData: FormData) {
  const prisma = getPrismaClient();
  const user = await getSessionUser();
  if (!user || user.role !== "OWNER") {
    throw new Error("Owner access required.");
  }

  const id = String(formData.get("id") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const latitude = Number(String(formData.get("latitude") ?? "").trim());
  const longitude = Number(String(formData.get("longitude") ?? "").trim());
  const externalUrl = String(formData.get("externalUrl") ?? "").trim();
  const isActive = String(formData.get("isActive") ?? "") === "on";

  if (!id || !name || !category || !externalUrl) {
    throw new Error("ID, name, category, and URL are required.");
  }
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    throw new Error("Latitude and longitude must be valid numbers.");
  }
  new URL(externalUrl);

  await prisma.pointOfInterest.update({
    where: { id },
    data: {
      name,
      category,
      description: description || null,
      latitude,
      longitude,
      externalUrl,
      isActive,
    },
  });

  revalidatePath("/things-to-do");
  revalidatePath("/admin/content");
}
