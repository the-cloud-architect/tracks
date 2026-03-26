import { NextRequest, NextResponse } from "next/server";

import { getPrismaClient } from "@/lib/prisma";
import { parseDateInput } from "@/lib/dates";

export async function POST(request: NextRequest) {
  const prisma = getPrismaClient();
  const body = await request.json();

  const fullName = String(body.fullName ?? "").trim();
  const email = String(body.email ?? "").trim();
  const phone = String(body.phone ?? "").trim();
  const preferredDateRaw = String(body.preferredDate ?? "").trim();
  const message = String(body.message ?? "").trim();

  if (!fullName || !email) {
    return NextResponse.json(
      { error: "Full name and email are required." },
      { status: 400 },
    );
  }

  const preferredDate = preferredDateRaw
    ? parseDateInput(preferredDateRaw)
    : null;

  if (preferredDateRaw && !preferredDate) {
    return NextResponse.json({ error: "Invalid preferred date." }, { status: 400 });
  }

  const created = await prisma.tourRequest.create({
    data: {
      fullName,
      email,
      phone: phone || null,
      preferredDate: preferredDate ?? null,
      message: message || null,
    },
    select: {
      id: true,
      createdAt: true,
    },
  });

  return NextResponse.json({
    ok: true,
    tourRequest: created,
  });
}
