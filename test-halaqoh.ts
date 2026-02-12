import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Checking halaqoh_categories...");
  const categories = await prisma.halaqoh_categories.findMany();
  console.log("Current Categories:", categories);

  if (categories.length === 0) {
    console.log("Attempting to create a test category...");
    try {
      const created = await prisma.halaqoh_categories.create({
        data: {
          title: "Tahsin Al-Qur'an",
          slug: "tahsin",
          description: "Belajar memperbaiki bacaan Al-Qur'an",
        },
      });
      console.log("Successfully created:", created);
    } catch (error) {
      console.error("Error creating category:", error);
    }
  }
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
