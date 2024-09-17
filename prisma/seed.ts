import { PrismaClient } from "@prisma/client";
import { hash } from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  try {
    const password = await hash("password123", 12);

    const superadmin = await prisma.user.upsert({
      where: { email: "superadmin@example.com" },
      update: {},
      create: {
        email: "superadmin@example.com",
        password,
        role: "superadmin",
      },
    });

    const restaurantAdmin = await prisma.user.upsert({
      where: { email: "restaurantadmin@example.com" },
      update: {},
      create: {
        email: "restaurantadmin@example.com",
        password,
        role: "admin",
      },
    });

    const customer = await prisma.user.upsert({
      where: { email: "customer@example.com" },
      update: {},
      create: {
        email: "customer@example.com",
        password,
        role: "customer",
      },
    });

    console.log({ superadmin, restaurantAdmin, customer });
  } catch (error) {
    console.error("An error occurred during seeding:");
    console.error(error);
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
