const { PrismaClient } = require("@prisma/client");
const db = new PrismaClient();

const SEED_KITS = [
  {
    id: "shubh-sampada",
    name: "Shubh Sampada",
    occ: "navratri",
    price: 2749,
    mrp: 3200,
    stockLeft: 4,
    description: "Premium, scripturally aligned Navratri Ghatasthapana and daily pujan kit. Sourced from organic, high-vibration farms.",
  },
  {
    id: "shakti-aradhana",
    name: "Shakti Aradhana",
    occ: "navratri",
    price: 2199,
    mrp: 2600,
    stockLeft: 3,
    description: "Essential Navratri kit containing 12 key components for Durga Puja. Sourced and packaged in compliance with Devi Bhagavatam.",
  },
  {
    id: "purna-ghatasthapana",
    name: "Purna Ghatasthapana",
    occ: "navratri",
    price: 1099,
    mrp: 1299,
    stockLeft: 0,
    description: "Dedicated set with premium copper Kalash, coconut, mango leaves, and holy thread for ritual establishment of the divine pot.",
  },
  {
    id: "shubh-akshaya-thali",
    name: "Shubh Akshaya Thali",
    occ: "diwali",
    price: 1649,
    mrp: 1950,
    stockLeft: 10,
    description: "Elegant brass puja platter with 13 key items including organic haldi, kumkum, and gangajal for Diwali Lakshmi-Ganesh Puja.",
  },
  {
    id: "shashti-deepam",
    name: "Shashti Deepam",
    occ: "diwali",
    price: 1099,
    mrp: 1299,
    stockLeft: 4,
    description: "Authentic Diwali diya kit containing 60 hand-poured clay lamps from local potters to bring warm, positive light to your home.",
  },
  {
    id: "deepa-vaibhava",
    name: "Deepa Vaibhava",
    occ: "diwali",
    price: 934,
    mrp: 1099,
    stockLeft: 15,
    description: "Premium brass deepak and ghee wicks package, handpicked to elevate your temple's festive aesthetic and energy.",
  },
  {
    id: "trimshat-deepam",
    name: "Trimshat Deepam",
    occ: "diwali",
    price: 604,
    mrp: 699,
    stockLeft: 8,
    description: "Set of 30 traditional clay lamps with pure cow ghee wicks for daily lighting during the holy month of Kartik.",
  },
  {
    id: "tulsi-kalyanam",
    name: "Tulsi Kalyanam Collection",
    occ: "satyanarayan",
    price: 1979,
    mrp: 2300,
    stockLeft: 7,
    description: "Complete Tulsi Vivah samagri including shringar items, sacred thread, and prasad, verified by Shastri scholars.",
  },
  {
    id: "satyanarayan-pujan",
    name: "Satyanarayan Pujan",
    occ: "satyanarayan",
    price: 1979,
    mrp: 2300,
    stockLeft: 10,
    description: "Authentic Sri Satyanarayan Vrat Katha kit containing banana stems, panchamrit essentials, and yellow altar cloth.",
  },
  {
    id: "sundarkand-path",
    name: "Sundarkand Path Kit Essentials",
    occ: "yearround",
    price: 2419,
    mrp: 2800,
    stockLeft: 5,
    description: "Complete Sundarkand path kit containing clean-text path books, red offerings, and standard prasad ingredients.",
  },
  {
    id: "yajna",
    name: "Yajña",
    occ: "yearround",
    price: 1209,
    mrp: 1400,
    stockLeft: 12,
    description: "Himalayan herb-infused pure havan samagri, dried mango wood, and cow dung cakes for scriptural purification yajñas.",
  },
  {
    id: "ekadash",
    name: "Ekadash",
    occ: "yearround",
    price: 879,
    mrp: 999,
    stockLeft: 20,
    description: "Set of 11 premium elements for daily temple purification, including premium dhoop, chandan, and gangajal.",
  },
  {
    id: "panch-jyoti",
    name: "Panch Jyoti Gift Tray",
    occ: "yearround",
    price: 659,
    mrp: 799,
    stockLeft: 15,
    description: "Five-wick heavy brass aarti lamp set with pure cotton wicks for a daily high-energy shringar aarti.",
  }
];

async function seed() {
  try {
    const productsCount = await db.product.count();
    if (productsCount === 0) {
      console.log("Seeding products...");
      
      const guide = await db.ritualGuide.findFirst({
        where: { slug: "rakshabandhan" },
      });

      const SEED_PRODUCTS = [
        ...SEED_KITS.map(k => ({
          name: k.name,
          slug: k.id,
          type: "PUJA_KIT",
          description: k.description || "",
          images: [`/uploads/${k.id}.png`],
          price: k.price,
          mrp: k.mrp,
          stock: k.stockLeft,
          category: k.occ,
          codAvailability: k.id === "purna-ghatasthapana" ? "NOT_AVAILABLE" : "AVAILABLE",
          linkedRitualGuideId: k.id === "shubh-sampada" && guide ? guide.id : null,
          status: "PUBLISHED",
        })),
        {
          name: "Gangajal (250ml)",
          slug: "gangajal-250ml",
          type: "SAMAGRI_ITEM",
          description: "Pure gangajal sourced directly from Haridwar for purification rituals.",
          images: ["/uploads/gangajal.png"],
          price: 99,
          mrp: 120,
          stock: 50,
          category: "samagri",
          codAvailability: "AVAILABLE",
          status: "PUBLISHED",
        },
        {
          name: "Pure Kumkum (50g)",
          slug: "pure-kumkum-50g",
          type: "SAMAGRI_ITEM",
          description: "Natural organic kumkum made from turmeric and lime, rich red color.",
          images: ["/uploads/kumkum.png"],
          price: 49,
          mrp: 60,
          stock: 100,
          category: "samagri",
          codAvailability: "AVAILABLE",
          status: "PUBLISHED",
        },
        {
          name: "Clay Diya (Pack of 10)",
          slug: "clay-diya-10",
          type: "SAMAGRI_ITEM",
          description: "Handcrafted clay diyas made by local potters, eco-friendly.",
          images: ["/uploads/diyas.png"],
          price: 59,
          mrp: 75,
          stock: 40,
          category: "samagri",
          codAvailability: "AVAILABLE",
          status: "PUBLISHED",
        },
        {
          name: "Aromatic Kapoor (Camphor) (50g)",
          slug: "camphor-50g",
          type: "SAMAGRI_ITEM",
          description: "Premium pure camphor for daily aarti and havan purification.",
          images: ["/uploads/kapoor.png"],
          price: 79,
          mrp: 99,
          stock: 60,
          category: "samagri",
          codAvailability: "AVAILABLE",
          status: "PUBLISHED",
        },
        {
          name: "Raw Rice (Akshat) (100g)",
          slug: "akshat-100g",
          type: "SAMAGRI_ITEM",
          description: "Unbroken raw rice grains selected specifically for offering in pujans.",
          images: ["/uploads/akshat.png"],
          price: 29,
          mrp: 35,
          stock: 80,
          category: "samagri",
          codAvailability: "AVAILABLE",
          status: "PUBLISHED",
        }
      ];

      for (const prod of SEED_PRODUCTS) {
        const created = await db.product.create({
          data: prod
        });

        // If it's a Puja Kit, let's seed some KitItems too
        if (prod.type === "PUJA_KIT") {
          await db.kitItem.createMany({
            data: [
              { productId: created.id, itemName: "Organic Kumkum", itemFunction: "For tilak offering" },
              { productId: created.id, itemName: "Ganga Jal", itemFunction: "For purification of deity and altar" },
              { productId: created.id, itemName: "Akshat (Rice grains)", itemFunction: "For invoking deity energy" },
            ]
          });
        }
      }

      console.log("Database seeded successfully!");
    } else {
      console.log("Database already has products, skipping seed.");
    }
  } catch (err) {
    console.error(err);
  } finally {
    await db.$disconnect();
    process.exit(0);
  }
}

seed();
