const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding initial HomepageBanner...");
  
  // Check if we already have a banner
  const existing = await prisma.homepageBanner.findFirst();
  if (existing) {
    console.log("HomepageBanner already exists. Skipping.");
    return;
  }
  
  await prisma.homepageBanner.create({
    data: {
      isActive: true,
      imageUrl: "/images/prebook_hero.jpg",
      orderByDate: new Date("2026-09-10T18:30:00.000Z"), // Order by 10 Sep
      festivalTitle: "DELIVERED BEFORE GANESH CHATURTHI",
      mainHeading: "Complete Ganesh Chaturthi",
      highlightedText: "Puja Kit",
      description: "Packaged and sealed at the source to ensure high-vibration purity. Sourced from organic, scripturally-aligned farms.",
      price: 1499.00,
      mrp: 1999.00,
      primaryCtaText: "Pre-book Kit now ›",
      primaryCtaLink: "/cart", // Adds item to cart
      secondaryCtaText: "View Kit Details",
      secondaryCtaLink: "/ritual-kits",
      festivalDate: new Date("2026-09-14T18:30:00.000Z"), // Ganesh Chaturthi on 14 Sep
    }
  });
  
  console.log("Seeded initial active HomepageBanner successfully!");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
