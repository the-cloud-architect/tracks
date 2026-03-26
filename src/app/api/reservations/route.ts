import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";

import { parseDateInput } from "@/lib/dates";
import { getPackageByTier } from "@/lib/packages";
import { getPrismaClient } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const prisma = getPrismaClient();
  const sessionUser = await getSessionUser();
  const body = await request.json();

  const fullName = String(body.fullName ?? "").trim();
  const email = String(body.email ?? "").trim();
  const packageTier = String(body.packageTier ?? "").trim();
  const eventDateRaw = String(body.eventDate ?? "").trim();
  const expectedGuestsRaw = String(body.expectedGuests ?? "").trim();

  if (!fullName || !email || !packageTier || !eventDateRaw) {
    return NextResponse.json(
      { error: "fullName, email, packageTier, and eventDate are required." },
      { status: 400 },
    );
  }

  const pkg = getPackageByTier(packageTier);
  if (!pkg) {
    return NextResponse.json({ error: "Unknown package tier." }, { status: 400 });
  }

  const eventDate = parseDateInput(eventDateRaw);
  if (!eventDate) {
    return NextResponse.json({ error: "Invalid event date." }, { status: 400 });
  }

  const existingForDate = await prisma.reservationLead.findFirst({
    where: {
      eventDate,
      paymentStatus: {
        in: ["pending", "paid"],
      },
    },
    select: { id: true },
  });

  if (existingForDate) {
    return NextResponse.json(
      { error: "That date is no longer available." },
      { status: 409 },
    );
  }

  const expectedGuestsParsed =
    expectedGuestsRaw.length > 0 ? Number(expectedGuestsRaw) : null;
  const expectedGuests =
    expectedGuestsParsed && Number.isFinite(expectedGuestsParsed)
      ? Math.max(1, Math.min(40, Math.round(expectedGuestsParsed)))
      : null;

  const reservationLead = await prisma.reservationLead.create({
    data: {
      fullName: sessionUser?.name || fullName,
      email: sessionUser?.email || email,
      packageTier: pkg.key as never,
      eventDate,
      expectedGuests,
      depositCents: pkg.depositCents,
      guestId: sessionUser?.id,
    },
    select: {
      id: true,
      packageTier: true,
      eventDate: true,
      depositCents: true,
      paymentStatus: true,
    },
  });

  if (sessionUser) {
    await prisma.$transaction([
      prisma.invoice.create({
        data: {
          guestId: sessionUser.id,
          reservationLeadId: reservationLead.id,
          description: `${pkg.name} reservation deposit`,
          amountCents: pkg.depositCents,
          dueDate: new Date(),
          status: "DUE",
        },
      }),
      prisma.messageThread.create({
        data: {
          guestId: sessionUser.id,
          reservationLeadId: reservationLead.id,
          subject: `Reservation request: ${pkg.name}`,
        },
      }),
    ]);
  }

  return NextResponse.json({
    ok: true,
    reservationLead,
  });
}
