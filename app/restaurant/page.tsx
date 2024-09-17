import Link from "next/link";
import prisma from "@/lib/prisma";

async function getRestaurants() {
  try {
    console.log("Attempting to fetch restaurants...");
    const restaurants = await prisma.restaurant.findMany();
    console.log("Fetched restaurants:", restaurants);
    return restaurants;
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    return [];
  }
}

export default async function RestaurantPage() {
  const restaurants = await getRestaurants();

  if (restaurants.length === 0) {
    return (
      <div>No restaurants found or there was an error fetching the data.</div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold mb-8">
        Welcome to Restaurant Order App
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {restaurants.map((restaurant) => (
          <Link
            key={restaurant.id}
            href={`/restaurant/${restaurant.slug}`}
            className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <h2 className="text-2xl font-semibold mb-2">{restaurant.name}</h2>
            <p className="text-gray-600">Visit restaurant page</p>
          </Link>
        ))}
      </div>
      <div className="mt-8">
        <Link
          href="/auth/login"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Go to Login
        </Link>
      </div>
    </div>
  );
}
