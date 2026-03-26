"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getSessionUser } from "@/lib/auth/session";
import { getPrismaClient } from "@/lib/prisma";
import { getAppUrl, getStripeClient } from "@/lib/stripe";

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
      recipientRole: "OWNER",
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

export async function startInvoiceCheckout(formData: FormData) {
  const prisma = getPrismaClient();
  const user = await getSessionUser();

  if (!user) {
    redirect("/auth/sign-in?next=/account");
  }

  const invoiceId = String(formData.get("invoiceId") ?? "").trim();
  if (!invoiceId) {
    redirect("/account?billingError=missing-invoice");
  }

  const invoice = await prisma.invoice.findFirst({
    where: {
      id: invoiceId,
      guestId: user.id,
      status: "DUE",
    },
    select: {
      id: true,
      description: true,
      amountCents: true,
    },
  });

  if (!invoice) {
    redirect("/account?billingError=invoice-not-found");
  }

  try {
    const stripe = getStripeClient();
    const appUrl = getAppUrl();

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            product_data: {
              name: invoice.description,
            },
            unit_amount: invoice.amountCents,
          },
        },
      ],
      success_url: `${appUrl}/reserve/confirmation?status=success&invoice=${invoice.id}`,
      cancel_url: `${appUrl}/reserve/confirmation?status=canceled&invoice=${invoice.id}`,
      metadata: {
        invoiceId: invoice.id,
        guestId: user.id,
      },
    });

    await prisma.invoice.update({
      where: { id: invoice.id },
      data: {
        stripeCheckoutId: session.id,
      },
    });

    if (!session.url) {
      redirect("/account?billingError=missing-checkout-url");
    }

    redirect(session.url);
  } catch (error) {
    console.error("Stripe checkout setup failed", error);
    redirect("/account?billingError=checkout-setup-failed");
  }
}
