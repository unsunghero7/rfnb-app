import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const host = request.headers.get("host");
  const subdomain = host?.split(".")[0];

  if (!subdomain) {
    return NextResponse.json(
      { error: "No subdomain provided" },
      { status: 400 }
    );
  }

  const restaurant = await prisma.restaurant.findUnique({
    where: { slug: subdomain },
  });

  if (!restaurant) {
    return NextResponse.json(
      { error: "Restaurant not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(restaurant);
}
