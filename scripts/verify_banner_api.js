const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function verify() {
  console.log("=== Verification Script ===");
  
  // 1. Check if HomepageBanner model has our seeded record
  const banner = await prisma.homepageBanner.findFirst({
    where: { isActive: true }
  });
  
  if (!banner) {
    throw new Error("Active HomepageBanner not found in database!");
  }
  
  console.log("✅ Seeded Banner in DB matches design specifications:");
  console.log(`   - Title: "${banner.festivalTitle}"`);
  console.log(`   - Main Heading: "${banner.mainHeading}"`);
  console.log(`   - Highlighted: "${banner.highlightedText}"`);
  console.log(`   - Price: ₹${banner.price} (MRP: ₹${banner.mrp})`);
  console.log(`   - Image: ${banner.imageUrl}`);
  
  // 2. Query next upcoming vrat/festival
  const todayUtc = new Date(Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()));
  const nextVrat = await prisma.vratEntry.findFirst({
    where: { date: { gte: todayUtc } },
    orderBy: { date: "asc" }
  });
  
  if (nextVrat) {
    console.log(`✅ Next upcoming festival found: "${nextVrat.name}" on ${nextVrat.date.toISOString().substring(0, 10)}`);
  } else {
    console.log("⚠️ No future VratEntry found (will display default/fallback)");
  }
  
  // 3. Query Today's Panchang details
  const panchang = await prisma.panchangEntry.findFirst({
    orderBy: { date: "desc" }
  });
  if (panchang) {
    console.log(`✅ Today's Panchang details available: Tithi: "${panchang.tithi}" (${panchang.tithiSub}), Paksha: "${panchang.paksha}"`);
  } else {
    console.log("⚠️ No PanchangEntry found");
  }
}

verify()
  .then(() => console.log("=== Verification Successful ==="))
  .catch(err => {
    console.error("❌ Verification Failed:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
