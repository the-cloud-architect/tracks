"use server";

import { revalidatePath } from "next/cache";

import { getSessionUser } from "@/lib/auth/session";
import { getPrismaClient } from "@/lib/prisma";

export async function sendGuestMessage(formData: FormData) {
  const prisma = getPrismaClient();
  const user = await getSessionUser();

  if (!user) {
    throw new Error("You must be signed in.");
  }

  const body = String(formData.get("body") ?? "").trim();
  const threadId = String(formData.get("threadId") ?? "").trim();
  const subject = String(formData.get("subject") ?? "").trim();

  if (!body) {
    return;
  }

  const thread =
    threadId.length > 0
      ? await prisma.messageThread.findFirst({
          where: { id: threadId, guestId: user.id },
          select: { id: true },
        })
      : null;

  const resolvedThreadId = thread?.id
    ? thread.id
    : (
        await prisma.messageThread.create({
          data: {
            guestId: user.id,
            subject: subject || "General reservation question",
          },
          select: { id: true },
        })
      ).id;

  await prisma.message.create({
    data: {
      threadId: resolvedThreadId,
      senderId: user.id,
      senderRole: "GUEST",
      body,
    },
  });

  revalidatePath("/account");
  revalidatePath("/admin/inbox");
}

export async function simulatePayInvoice(formData: FormData) {
  const prisma = getPrismaClient();
  const user = await getSessionUser();

  if (!user) {
    throw new Error("You must be signed in.");
  }

  const invoiceId = String(formData.get("invoiceId") ?? "").trim();
  if (!invoiceId) {
    return;
  }

  const invoice = await prisma.invoice.findFirst({
    where: {
      id: invoiceId,
      guestId: user.id,
      status: "DUE",
    },
    select: {
      id: true,
      amountCents: true,
    },
  });

  if (!invoice) {
    return;
  }

  await prisma.$transaction([
    prisma.invoice.update({
      where: { id: invoice.id },
      data: { status: "PAID" },
    }),
    prisma.payment.create({
      data: {
        invoiceId: invoice.id,
        amountCents: invoice.amountCents,
        status: "simulated_paid",
        paidAt: new Date(),
      },
    }),
  ]);

  revalidatePath("/account");
}
