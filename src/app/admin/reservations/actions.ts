"use server";

import { revalidatePath } from "next/cache";

import { getSessionUser } from "@/lib/auth/session";
import { getPrismaClient } from "@/lib/prisma";

export async function cancelReservation(formData: FormData) {
  const prisma = getPrismaClient();
  const user = await getSessionUser();

  if (!user || user.role !== "OWNER") {
    throw new Error("Owner access required.");
  }

  const reservationId = String(formData.get("reservationId") ?? "").trim();
  if (!reservationId) {
    return;
  }

  const reservation = await prisma.reservationLead.findUnique({
    where: { id: reservationId },
    select: { id: true, paymentStatus: true },
  });

  if (!reservation || reservation.paymentStatus === "canceled") {
    return;
  }

  await prisma.reservationLead.update({
    where: { id: reservation.id },
    data: { paymentStatus: "canceled" },
  });

  revalidatePath("/admin/reservations");
  revalidatePath("/api/availability");
}
