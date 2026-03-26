"use server";

import { revalidatePath } from "next/cache";

import { getSessionUser } from "@/lib/auth/session";
import { getPackageByTier } from "@/lib/packages";
import { getPrismaClient } from "@/lib/prisma";

export async function sendOwnerReply(formData: FormData) {
  const prisma = getPrismaClient();
  const user = await getSessionUser();

  if (!user || user.role !== "OWNER") {
    throw new Error("Owner access required.");
  }

  const threadId = String(formData.get("threadId") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();

  if (!threadId || !body) {
    return;
  }

  const thread = await prisma.messageThread.findUnique({
    where: { id: threadId },
    select: { id: true },
  });

  if (!thread) {
    return;
  }

  await prisma.message.create({
    data: {
      threadId: thread.id,
      senderId: user.id,
      senderRole: "OWNER",
      recipientRole: "GUEST",
      body,
    },
  });

  revalidatePath("/admin/inbox");
  revalidatePath("/account");
}

export async function createOwnerInvoice(formData: FormData) {
  const prisma = getPrismaClient();
  const user = await getSessionUser();

  if (!user || user.role !== "OWNER") {
    throw new Error("Owner access required.");
  }

  const guestEmail = String(formData.get("guestEmail") ?? "").trim().toLowerCase();
  const amountDollarsRaw = String(formData.get("amountDollars") ?? "").trim();
  const dueDateRaw = String(formData.get("dueDate") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const packageTier = String(formData.get("packageTier") ?? "").trim();

  if (!guestEmail || !dueDateRaw || !description) {
    return;
  }

  const amountDollars = Number(amountDollarsRaw);
  const amountCents = Math.round(amountDollars * 100);
  if (!Number.isFinite(amountCents) || amountCents <= 0) {
    return;
  }

  const dueDate = new Date(`${dueDateRaw}T00:00:00.000Z`);
  if (Number.isNaN(dueDate.getTime())) {
    return;
  }

  const guest = await prisma.user.findUnique({
    where: { email: guestEmail },
    select: { id: true },
  });
  if (!guest) {
    return;
  }

  const reservation =
    packageTier.length > 0 && getPackageByTier(packageTier)
      ? await prisma.reservationLead.findFirst({
          where: {
            guestId: guest.id,
            packageTier: packageTier as never,
          },
          orderBy: { createdAt: "desc" },
          select: { id: true },
        })
      : null;

  await prisma.invoice.create({
    data: {
      guestId: guest.id,
      reservationLeadId: reservation?.id,
      description,
      amountCents,
      dueDate,
      status: "DUE",
    },
  });

  revalidatePath("/admin/inbox");
  revalidatePath("/account");
}
