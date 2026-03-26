"use server";

import { revalidatePath } from "next/cache";

import { getSessionUser } from "@/lib/auth/session";
import { getPrismaClient } from "@/lib/prisma";
import { parseDateInput } from "@/lib/dates";

export async function addAvailabilityBlock(formData: FormData) {
  const prisma = getPrismaClient();
  const user = await getSessionUser();

  if (!user || user.role !== "OWNER") {
    throw new Error("Owner access required.");
  }

  const dateRaw = String(formData.get("date") ?? "").trim();
  const reason = String(formData.get("reason") ?? "").trim();

  if (!dateRaw) {
    return;
  }

  const date = parseDateInput(dateRaw);
  if (!date) {
    return;
  }

  await prisma.availabilityBlock.upsert({
    where: { date },
    create: { date, reason: reason || null },
    update: { reason: reason || null },
  });

  revalidatePath("/admin/availability");
}

export async function removeAvailabilityBlock(formData: FormData) {
  const prisma = getPrismaClient();
  const user = await getSessionUser();

  if (!user || user.role !== "OWNER") {
    throw new Error("Owner access required.");
  }

  const blockId = String(formData.get("blockId") ?? "").trim();
  if (!blockId) {
    return;
  }

  await prisma.availabilityBlock.delete({
    where: { id: blockId },
  });

  revalidatePath("/admin/availability");
}
