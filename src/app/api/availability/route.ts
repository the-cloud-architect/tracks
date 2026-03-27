import { NextResponse } from "next/server";

import { getPrismaClient } from "@/lib/prisma";
import { toIsoDate } from "@/lib/dates";

export async function GET() {
  try {
    const prisma = getPrismaClient();
    const [blocks, reservations] = await Promise.all([
      prisma.availabilityBlock.findMany({
        orderBy: { date: "asc" },
      }),
      prisma.reservationLead.findMany({
        where: {
          paymentStatus: {
            in: ["pending", "paid"],
          },
        },
        select: {
          eventDate: true,
        },
      }),
    ]);

    const unavailable = new Set<string>();

    for (const block of blocks) {
      unavailable.add(toIsoDate(block.date));
    }

    for (const reservation of reservations) {
      unavailable.add(toIsoDate(reservation.eventDate));
    }

    return NextResponse.json({
      unavailableDates: Array.from(unavailable).sort(),
    });
  } catch {
    return NextResponse.json({
      unavailableDates: [],
      warning: "Could not load availability right now.",
    });
  }
}
