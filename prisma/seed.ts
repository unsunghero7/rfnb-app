import { PrismaClient } from "@prisma/client";
import { hash } from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  try {
    const password = await hash("password123", 12);

    // Upsert users
    const users = [
      { email: "superadmin@example.com", role: "superadmin" },
      { email: "restaurantadmin1@example.com", role: "admin" },
      { email: "restaurantadmin2@example.com", role: "admin" },
      { email: "customer@example.com", role: "customer" },
    ];

    for (const user of users) {
      await prisma.user.upsert({
        where: { email: user.email },
        update: {}, // Don't update anything if the user exists
        create: {
          email: user.email,
          password,
          role: user.role,
        },
      });
      console.log(`Upserted user: ${user.email}`);
    }

    // Upsert restaurants
    const restaurants = [
      {
        name: "Pizza Place",
        slug: "pizza-place",
        ownerEmail: "restaurantadmin1@example.com",
      },
      {
        name: "Burger Joint",
        slug: "burger-joint",
        ownerEmail: "restaurantadmin1@example.com",
      },
      {
        name: "Sushi Bar",
        slug: "sushi-bar",
        ownerEmail: "restaurantadmin2@example.com",
      },
    ];

    for (const restaurant of restaurants) {
      const owner = await prisma.user.findUnique({
        where: { email: restaurant.ownerEmail },
      });
      if (owner) {
        await prisma.restaurant.upsert({
          where: { slug: restaurant.slug },
          update: {
            name: restaurant.name,
            ownerId: owner.id,
          },
          create: {
            name: restaurant.name,
            slug: restaurant.slug,
            ownerId: owner.id,
          },
        });
        console.log(`Upserted restaurant: ${restaurant.name}`);
      } else {
        console.log(`Owner not found for restaurant: ${restaurant.name}`);
      }
    }

    console.log("Seed operation completed.");
  } catch (error) {
    console.error("An error occurred during seeding:");
    console.error(error);
    process.exit(1);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
