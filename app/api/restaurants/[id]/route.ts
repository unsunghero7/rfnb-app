import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (
    !session ||
    (session.user.role !== "admin" && session.user.role !== "superadmin")
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, slug } = await request.json();
  const { id } = params;

  try {
    // Check if the user is a superadmin or the owner of the restaurant
    const restaurant = await prisma.restaurant.findUnique({
      where: { id },
      include: { owner: true },
    });

    if (!restaurant) {
      return NextResponse.json(
        { error: "Restaurant not found" },
        { status: 404 }
      );
    }

    if (
      session.user.role !== "superadmin" &&
      restaurant.owner.email !== session.user.email
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Check if the new slug is already in use
    const existingRestaurant = await prisma.restaurant.findUnique({
      where: { slug },
    });

    if (existingRestaurant && existingRestaurant.id !== id) {
      return NextResponse.json(
        { error: "Slug is already in use" },
        { status: 400 }
      );
    }

    const updatedRestaurant = await prisma.restaurant.update({
      where: { id },
      data: { name, slug },
    });

    return NextResponse.json(updatedRestaurant);
  } catch (error) {
    console.error("Failed to update restaurant:", error);
    return NextResponse.json(
      { error: "Failed to update restaurant" },
      { status: 500 }
    );
  }
}
