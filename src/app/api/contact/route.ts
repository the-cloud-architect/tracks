import { NextRequest, NextResponse } from "next/server";

import { getPrismaClient } from "@/lib/prisma";

async function sendContactEmail(input: {
  ownerEmail: string;
  fullName: string;
  email: string;
  message: string;
}): Promise<void> {
  const resendApiKey = process.env.RESEND_API_KEY?.trim();
  const fromEmail = process.env.CONTACT_FROM_EMAIL?.trim() || "no-reply@weddingtracks.org";
  if (!resendApiKey) {
    return;
  }

  const html = `
    <h2>New contact message from Wedding Tracks</h2>
    <p><strong>Name:</strong> ${input.fullName}</p>
    <p><strong>Email:</strong> ${input.email}</p>
    <p><strong>Message:</strong></p>
    <p>${input.message.replace(/\n/g, "<br/>")}</p>
  `;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [input.ownerEmail],
      reply_to: input.email,
      subject: `Wedding Tracks contact inquiry from ${input.fullName}`,
      html,
    }),
  });

  if (!response.ok) {
    throw new Error("Unable to forward contact message email.");
  }
}

export async function POST(request: NextRequest) {
  try {
    const prisma = getPrismaClient();
    const body = await request.json();

    const fullName = String(body.fullName ?? "").trim();
    const email = String(body.email ?? "")
      .trim()
      .toLowerCase();
    const message = String(body.message ?? "").trim();

    if (!fullName || !email || !message) {
      return NextResponse.json(
        { error: "Full name, email, and message are required." },
        { status: 400 },
      );
    }

    await prisma.tourRequest.create({
      data: {
        fullName,
        email,
        phone: null,
        preferredDate: null,
        message: `[CONTACT] ${message}`,
      },
    });

    const ownerEmail = process.env.OWNER_EMAIL?.trim();
    if (ownerEmail) {
      await sendContactEmail({
        ownerEmail,
        fullName,
        email,
        message,
      }).catch(() => null);

      const ownerUser = await prisma.user.findUnique({
        where: { email: ownerEmail.toLowerCase() },
        select: { id: true },
      });

      const guestUser = await prisma.user.findUnique({
        where: { email },
        select: { id: true },
      });

      const threadUserId = guestUser?.id ?? ownerUser?.id;
      if (threadUserId) {
        const thread = await prisma.messageThread.create({
          data: {
            guestId: threadUserId,
            subject: `Contact inquiry from ${fullName}`,
          },
        });

        await prisma.message.create({
          data: {
            threadId: thread.id,
            senderId: threadUserId,
            senderRole: "GUEST",
            recipientRole: "OWNER",
            body: `From: ${fullName} <${email}>\n\n${message}`,
          },
        });
      }
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Could not send your message right now. Please try again." },
      { status: 500 },
    );
  }
}
