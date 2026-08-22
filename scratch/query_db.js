const { PrismaClient } = require("@prisma/client");
const db = new PrismaClient();

async function main() {
  const guide = await db.ritualGuide.findUnique({
    where: { slug: "sawan-somwar" },
    include: {
      steps: { orderBy: { order: "asc" } }
    }
  });
  if (!guide) {
    console.log("No sawan-somwar guide found");
    return;
  }
  console.log("Guide:", guide.title);
  guide.steps.forEach(s => {
    console.log(`Step ${s.order}: title="${s.title}"\n  desc="${s.description.substring(0, 80)}..."`);
  });
}

main().then(() => db.$disconnect());
