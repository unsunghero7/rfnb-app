import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    let restaurants;

    if (session.user.role === "superadmin") {
      restaurants = await prisma.restaurant.findMany({
        include: {
          owner: {
            select: {
              email: true,
            },
          },
        },
      });
    } else if (session.user.role === "admin") {
      restaurants = await prisma.restaurant.findMany({
        where: {
          owner: {
            email: session.user.email,
          },
        },
        include: {
          owner: {
            select: {
              email: true,
            },
          },
        },
      });
    } else {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    return NextResponse.json(restaurants);
  } catch (error) {
    console.error("Failed to fetch restaurants:", error);
    return NextResponse.json(
      { error: "Failed to fetch restaurants" },
      { status: 500 }
    );
  }
}
