import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

import { getPrismaClient } from "@/lib/prisma";
import { getStripeClient } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  const prisma = getPrismaClient();

  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json(
      { error: "Missing stripe signature or STRIPE_WEBHOOK_SECRET." },
      { status: 400 },
    );
  }

  const rawBody = await request.text();
  const stripe = getStripeClient();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Invalid webhook signature." }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const invoiceId = session.metadata?.invoiceId;

    if (invoiceId) {
      const existingPayment = await prisma.payment.findFirst({
        where: { externalRef: session.id },
        select: { id: true },
      });

      if (!existingPayment) {
        await prisma.$transaction([
          prisma.invoice.update({
            where: { id: invoiceId },
            data: { status: "PAID" },
          }),
          prisma.payment.create({
            data: {
              invoiceId,
              amountCents: session.amount_total ?? 0,
              status: "paid",
              paidAt: new Date(),
              externalRef: session.id,
            },
          }),
        ]);
      }
    }
  }

  return NextResponse.json({ received: true });
}
