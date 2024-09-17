import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";

async function getRestaurant(slug: string) {
  try {
    return await prisma.restaurant.findUnique({
      where: { slug: slug },
    });
  } catch (error) {
    console.error("Error fetching restaurant:", error);
    return null;
  }
}

export async function generateStaticParams() {
  const restaurants = await prisma.restaurant.findMany();
  return restaurants.map((restaurant) => ({
    slug: restaurant.slug,
  }));
}

export default async function RestaurantPage({
  params,
}: {
  params: { slug: string };
}) {
  const restaurant = await getRestaurant(params.slug);

  if (!restaurant) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold mb-8">{restaurant.name}</h1>
      <p>
        This is the page for {restaurant.name} (Slug: {restaurant.slug})
      </p>
      {/* Add more restaurant details and functionality here */}
    </div>
  );
}
