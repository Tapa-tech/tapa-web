const { PrismaClient } = require("@prisma/client");
const db = new PrismaClient();

async function run() {
  try {
    const productsCount = await db.product.count();
    console.log(`Products Count in DB: ${productsCount}`);
    if (productsCount > 0) {
      const sample = await db.product.findFirst();
      console.log("Sample product in DB:", JSON.stringify(sample, null, 2));
    } else {
      console.log("No products found in DB. Seeding manually now...");
      // Let's run the seeder manually via ts-node or Next.js
    }
  } catch (e) {
    console.error(e);
  } finally {
    await db.$disconnect();
    process.exit(0);
  }
}

run();
