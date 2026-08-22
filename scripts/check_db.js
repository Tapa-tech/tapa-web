const { PrismaClient } = require("@prisma/client");
const db = new PrismaClient();

async function check() {
  const guide = await db.ritualGuide.findFirst({
    where: { slug: "rakshabandhan" },
    include: { mantras: true }
  });
  if (guide) {
    console.log(`Guide: ${guide.title}`);
    console.log("Mantras:", JSON.stringify(guide.mantras, null, 2));
  } else {
    console.log("Guide not found");
  }
  process.exit(0);
}

check();
