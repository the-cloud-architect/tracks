import { NextResponse } from "next/server";

import { getVenuePackages } from "@/lib/packages";

export async function GET() {
  const packages = await getVenuePackages();
  return NextResponse.json({ packages });
}
