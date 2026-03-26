import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";

import { getPrismaClient } from "@/lib/prisma";
import { createSession } from "@/lib/auth/session";

function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

export async function POST(request: NextRequest) {
  const prisma = getPrismaClient();
  const body = await request.json();

  const name = String(body.name ?? "").trim();
  const email = normalizeEmail(String(body.email ?? ""));
  const password = String(body.password ?? "");

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required." },
      { status: 400 },
    );
  }

  if (password.length < 8) {
    return NextResponse.json(
      { error: "Password must be at least 8 characters." },
      { status: 400 },
    );
  }

  const existing = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (existing) {
    return NextResponse.json(
      { error: "An account with this email already exists." },
      { status: 409 },
    );
  }

  const passwordHash = await hash(password, 10);
  const ownerEmail = process.env.OWNER_EMAIL?.trim().toLowerCase();
  const role = ownerEmail && ownerEmail === email ? "OWNER" : "GUEST";

  const user = await prisma.user.create({
    data: {
      name: name || null,
      email,
      passwordHash,
      role,
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
    },
  });

  await createSession({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  });

  return NextResponse.json({ ok: true });
}
