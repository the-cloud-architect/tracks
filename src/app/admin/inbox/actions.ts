"use server";

import { revalidatePath } from "next/cache";

import { getSessionUser } from "@/lib/auth/session";
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
      body,
    },
  });

  revalidatePath("/admin/inbox");
  revalidatePath("/account");
}
