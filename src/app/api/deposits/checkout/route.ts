import { NextRequest, NextResponse } from "next/server";
import { getPrismaClient } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const prisma = getPrismaClient();
    const body = await request.json();
    const reservationId = String(body.reservationId ?? "").trim();
    const termsAccepted = Boolean(body.termsAccepted);

    if (!reservationId) {
      return NextResponse.json(
        { error: "reservationId is required." },
        { status: 400 },
      );
    }

    if (!termsAccepted) {
      return NextResponse.json(
        { error: "Terms must be accepted before checkout." },
        { status: 400 },
      );
    }

    const reservation = await prisma.reservationLead.findUnique({
      where: { id: reservationId },
      select: {
        id: true,
        paymentStatus: true,
        depositCents: true,
        fullName: true,
        email: true,
      },
    });

    if (!reservation) {
      return NextResponse.json(
        { error: "Reservation not found." },
        { status: 404 },
      );
    }

    const placeholderSessionId = `demo_${reservation.id}`;
    const checkoutUrl = `/reserve/confirmation?status=pending&reservation=${reservation.id}`;

    await prisma.reservationLead.update({
      where: { id: reservation.id },
      data: {
        stripeCheckoutId: placeholderSessionId,
        notes:
          "Stripe checkout placeholder created. Replace this route with Stripe Checkout Session integration.",
      },
    });

    return NextResponse.json({
      ok: true,
      mode: "placeholder",
      sessionId: placeholderSessionId,
      checkoutUrl,
      depositCents: reservation.depositCents,
    });
  } catch {
    return NextResponse.json(
      { error: "Could not start checkout right now. Please try again." },
      { status: 500 },
    );
  }
}
