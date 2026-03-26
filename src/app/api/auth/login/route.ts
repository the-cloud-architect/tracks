import { NextRequest, NextResponse } from "next/server";
import { compare } from "bcryptjs";

import { getPrismaClient } from "@/lib/prisma";
import { createSession } from "@/lib/auth/session";

function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

export async function POST(request: NextRequest) {
  const prisma = getPrismaClient();
  const body = await request.json();

  const email = normalizeEmail(String(body.email ?? ""));
  const password = String(body.password ?? "");

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required." },
      { status: 400 },
    );
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      passwordHash: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
  }

  const isValid = await compare(password, user.passwordHash);
  if (!isValid) {
    return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
  }

  await createSession({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  });

  return NextResponse.json({ ok: true });
}
