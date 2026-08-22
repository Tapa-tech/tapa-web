const { PrismaClient } = require("@prisma/client");
const db = new PrismaClient();

async function run() {
  try {
    const users = await db.user.findMany({
      select: { id: true, email: true, phone: true, role: true }
    });
    console.log("Database Users:");
    console.log(JSON.stringify(users, null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    await db.$disconnect();
  }
}

run();
