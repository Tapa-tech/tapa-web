import { PrismaClient } from "@prisma/client";
import { createHash } from "crypto";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const db =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;


async function seedAdmin() {
  try {
    const adminExists = await db.user.findFirst({
      where: {
        role: { in: ["ADMIN", "SUPER_ADMIN"] }
      },
    });

    if (!adminExists) {
      const email = "admin@tapa.co";
      const rawPassword = "AdminSecurePassword123!";
      const passwordHash = createHash("sha256")
        .update(rawPassword)
        .digest("hex");

      await db.user.create({
        data: {
          email,
          name: "Super Admin",
          role: "SUPER_ADMIN",
          passwordHash,
          emailVerified: new Date(),
          consentGiven: true,
          consentGivenAt: new Date(),
          consentVersion: "v1.0",
        },
      });

      console.log(`\n==================================================`);
      console.log(`[DATABASE SEED] Super Admin account auto-seeded!`);
      console.log(`Email: ${email}`);
      console.log(`Password: ${rawPassword}`);
      console.log(`==================================================\n`);
    }
  } catch {
    
  }
}

const SEED_KITS = [
  {
    id: "shubh-sampada",
    name: "Shubh Sampada",
    hindi: "शुभ सम्पदा — Auspicious Abundance",
    occ: "navratri",
    deity: "devi",
    price: 2749,
    mrp: 3200,
    inStock: true,
    stockLeft: 4,
    itemsCount: "16 items",
    delivery: "🚚 Delivered before Navratri begins · Delhi-NCR by 30 Sept",
    isFeatured: true,
    description: "Premium, scripturally aligned Navratri Ghatasthapana and daily pujan kit. Sourced from organic, high-vibration farms.",
  },
  {
    id: "shakti-aradhana",
    name: "Shakti Aradhana",
    hindi: "शक्ति आराधना — Goddess Devotion",
    occ: "navratri",
    deity: "devi",
    price: 2199,
    mrp: 2600,
    inStock: true,
    stockLeft: 3,
    itemsCount: "12 items",
    delivery: "🚚 Delivered before Navratri begins · Delhi-NCR by 30 Sept",
    description: "Essential Navratri kit containing 12 key components for Durga Puja. Sourced and packaged in compliance with Devi Bhagavatam.",
  },
  {
    id: "purna-ghatasthapana",
    name: "Purna Ghatasthapana",
    hindi: "पूर्ण घटस्थापना — Complete Kalash Set",
    occ: "navratri",
    deity: "devi",
    price: 1099,
    mrp: 1299,
    inStock: false,
    itemsCount: "10 items",
    delivery: "🚚 Restocking soon · Ships in October",
    description: "Dedicated set with premium copper Kalash, coconut, mango leaves, and holy thread for ritual establishment of the divine pot.",
  },
  {
    id: "shubh-akshaya-thali",
    name: "Shubh Akshaya Thali",
    hindi: "शुभ अक्षय थाली — Eternal Abundance Platter",
    occ: "diwali",
    deity: "vishnu",
    price: 1649,
    mrp: 1950,
    inStock: true,
    itemsCount: "13 items",
    delivery: "🚚 Delivered before Diwali begins · Ships late October",
    description: "Elegant brass puja platter with 13 key items including organic haldi, kumkum, and gangajal for Diwali Lakshmi-Ganesh Puja.",
  },
  {
    id: "shashti-deepam",
    name: "Shashti Deepam",
    hindi: "षष्टि दीपम् — Sixty Clay Lamps Set",
    occ: "diwali",
    deity: "devi",
    price: 1099,
    mrp: 1299,
    inStock: true,
    stockLeft: 4,
    itemsCount: "6 items",
    delivery: "🚚 Delivered before Diwali begins · Ships late October",
    description: "Authentic Diwali diya kit containing 60 hand-poured clay lamps from local potters to bring warm, positive light to your home.",
  },
  {
    id: "deepa-vaibhava",
    name: "Deepa Vaibhava",
    hindi: "दीप वैभव — Grand Festive Lights",
    occ: "diwali",
    deity: "vishnu",
    price: 934,
    mrp: 1099,
    inStock: true,
    itemsCount: "8 items",
    delivery: "🚚 Shipped before Diwali · Express delivery option available",
    description: "Premium brass deepak and ghee wicks package, handpicked to elevate your temple's festive aesthetic and energy.",
  },
  {
    id: "trimshat-deepam",
    name: "Trimshat Deepam",
    hindi: "त्रिंशत् दीपम् — Thirty Sacred Lamps",
    occ: "diwali",
    deity: "vishnu",
    price: 604,
    mrp: 699,
    inStock: true,
    itemsCount: "4 items",
    delivery: "🚚 Delivered before Diwali begins · Ships late October",
    description: "Set of 30 traditional clay lamps with pure cow ghee wicks for daily lighting during the holy month of Kartik.",
  },
  {
    id: "tulsi-kalyanam",
    name: "Tulsi Kalyanam Collection",
    hindi: "तुलसी कल्याणम् — Sacred Tulsi Marriage Kit",
    occ: "satyanarayan",
    deity: "vishnu",
    price: 1979,
    mrp: 2300,
    inStock: true,
    itemsCount: "10 items",
    delivery: "🚚 Year-round delivery · Shipped within 48 hours",
    description: "Complete Tulsi Vivah samagri including shringar items, sacred thread, and prasad, verified by Shastri scholars.",
  },
  {
    id: "satyanarayan-pujan",
    name: "Satyanarayan Pujan",
    hindi: "सत्यनारायण पूजन — Lord of Truth Ritual Samagri",
    occ: "satyanarayan",
    deity: "vishnu",
    price: 1979,
    mrp: 2300,
    inStock: true,
    itemsCount: "11 items",
    delivery: "🚚 Year-round delivery · Shipped within 48 hours",
    description: "Authentic Sri Satyanarayan Vrat Katha kit containing banana stems, panchamrit essentials, and yellow altar cloth.",
  },
  {
    id: "sundarkand-path",
    name: "Sundarkand Path Kit Essentials",
    hindi: "सुन्दरकाण्ड पाठ — Hanumant Aradhana",
    occ: "yearround",
    deity: "vishnu",
    price: 2419,
    mrp: 2800,
    inStock: true,
    itemsCount: "9 items",
    delivery: "🚚 Year-round delivery · Shipped within 48 hours",
    description: "Complete Sundarkand path kit containing clean-text path books, red offerings, and standard prasad ingredients.",
  },
  {
    id: "yajna",
    name: "Yajña",
    hindi: "यज्ञ — Sacred Havan Samagri",
    occ: "yearround",
    deity: "vishnu",
    price: 1209,
    mrp: 1400,
    inStock: true,
    itemsCount: "8 items",
    delivery: "🚚 Year-round delivery · Shipped within 48 hours",
    description: "Himalayan herb-infused pure havan samagri, dried mango wood, and cow dung cakes for scriptural purification yajñas.",
  },
  {
    id: "ekadash",
    name: "Ekadash",
    hindi: "एकादश — Eleven Sacred Senses Kit",
    occ: "yearround",
    deity: "vishnu",
    price: 879,
    mrp: 999,
    inStock: true,
    itemsCount: "7 items",
    delivery: "🚚 Year-round delivery · Shipped within 48 hours",
    description: "Set of 11 premium elements for daily temple purification, including premium dhoop, chandan, and gangajal.",
  },
  {
    id: "panch-jyoti",
    name: "Panch Jyoti Gift Tray",
    hindi: "पंच ज्योति — Festive Gifting Platter",
    occ: "yearround",
    deity: "devi",
    price: 659,
    mrp: 799,
    inStock: true,
    itemsCount: "5 items",
    delivery: "🚚 Year-round delivery · Shipped within 48 hours",
    description: "Five-wick heavy brass aarti lamp set with pure cotton wicks for a daily high-energy shringar aarti.",
  }
];

async function seedKits() {
  try {
    const kitsCount = await db.ritualKit.count();
    if (kitsCount === 0) {
      await db.ritualKit.createMany({
        data: SEED_KITS,
      });
      console.log(`\n==================================================`);
      console.log(`[DATABASE SEED] 13 Ritual Kits seeded successfully!`);
      console.log(`==================================================\n`);
    }
  } catch (err) {
    console.error("Failed to seed ritual kits:", err);
  }
}

async function seedUpcomingFeatures() {
  try {
    const count = await db.upcomingFeature.count();
    if (count === 0) {
      await db.upcomingFeature.createMany({
        data: [
          {
            key: "ritual_kits",
            launchLabel: "LAUNCHING September 24th",
            badgeText: "Launching soon",
            teaserTitle: "Complete Samagri for every puja.",
            teaserBody: "Ritually correct. Sourced right. Delivered before your pujan.",
            isLive: false,
          },
          {
            key: "purohit_booking",
            launchLabel: "(will be launched in November)",
            badgeText: "Coming soon",
            teaserTitle: "Need a Pandit?",
            teaserBody: "Verified purohits · Kit included · 6 puja types",
            isLive: false,
          },
          {
            key: "bhajan_mandali",
            launchLabel: "(will be launched in December)",
            badgeText: "Coming soon",
            teaserTitle: "Bhajan Mandali",
            teaserBody: "Book bhajan singers and mandalis for your home celebrations.",
            isLive: false,
          },
        ],
      });
      console.log(`\n==================================================`);
      console.log(`[DATABASE SEED] Upcoming features seeded successfully!`);
      console.log(`==================================================\n`);
    }
  } catch (err) {
    console.error("Failed to seed upcoming features:", err);
  }
}

async function seedAnnouncements() {
  try {
    const count = await db.announcementMessage.count();
    if (count === 0) {
      await db.announcementMessage.create({
        data: {
          message: "Dharma doesn't demand fear — it demands pure devotion.",
          isActive: true,
          priority: 1,
        },
      });
      console.log(`\n==================================================`);
      console.log(`[DATABASE SEED] Default announcement message seeded!`);
      console.log(`==================================================\n`);
    }
  } catch (err) {
    console.error("Failed to seed announcement message:", err);
  }
}

async function seedProducts() {
  try {
    const count = await db.product.count();
    if (count === 0) {
      
      const guide = await db.ritualGuide.findFirst({
        where: { slug: "rakshabandhan" },
      });

      const SEED_PRODUCTS = [
        ...SEED_KITS.map((k: any) => ({
          name: k.name,
          slug: k.id,
          type: "PUJA_KIT" as const,
          description: k.description || "",
          images: k.imageUrl ? [k.imageUrl] : [],
          price: k.price,
          mrp: k.mrp,
          stock: k.stockLeft || 10,
          category: k.occ,
          codAvailability: k.id === "purna-ghatasthapana" ? "NOT_AVAILABLE" as const : "AVAILABLE" as const,
          linkedRitualGuideId: k.id === "shubh-sampada" && guide ? guide.id : null,
          status: "PUBLISHED" as const,
        })),
        {
          name: "Gangajal (250ml)",
          slug: "gangajal-250ml",
          type: "SAMAGRI_ITEM" as const,
          description: "Pure gangajal sourced directly from Haridwar for purification rituals.",
          images: ["/uploads/gangajal.png"],
          price: 99,
          mrp: 120,
          stock: 50,
          category: "samagri",
          codAvailability: "AVAILABLE" as const,
          status: "PUBLISHED" as const,
        },
        {
          name: "Pure Kumkum (50g)",
          slug: "pure-kumkum-50g",
          type: "SAMAGRI_ITEM" as const,
          description: "Natural organic kumkum made from turmeric and lime, rich red color.",
          images: ["/uploads/kumkum.png"],
          price: 49,
          mrp: 60,
          stock: 100,
          category: "samagri",
          codAvailability: "AVAILABLE" as const,
          status: "PUBLISHED" as const,
        },
        {
          name: "Clay Diya (Pack of 10)",
          slug: "clay-diya-10",
          type: "SAMAGRI_ITEM" as const,
          description: "Handcrafted clay diyas made by local potters, eco-friendly.",
          images: ["/uploads/diyas.png"],
          price: 59,
          mrp: 75,
          stock: 40,
          category: "samagri",
          codAvailability: "AVAILABLE" as const,
          status: "PUBLISHED" as const,
        },
        {
          name: "Aromatic Kapoor (Camphor) (50g)",
          slug: "camphor-50g",
          type: "SAMAGRI_ITEM" as const,
          description: "Premium pure camphor for daily aarti and havan purification.",
          images: ["/uploads/kapoor.png"],
          price: 79,
          mrp: 99,
          stock: 60,
          category: "samagri",
          codAvailability: "AVAILABLE" as const,
          status: "PUBLISHED" as const,
        },
        {
          name: "Raw Rice (Akshat) (100g)",
          slug: "akshat-100g",
          type: "SAMAGRI_ITEM" as const,
          description: "Unbroken raw rice grains selected specifically for offering in pujans.",
          images: ["/uploads/akshat.png"],
          price: 29,
          mrp: 35,
          stock: 80,
          category: "samagri",
          codAvailability: "AVAILABLE" as const,
          status: "PUBLISHED" as const,
        }
      ];

      for (const prod of SEED_PRODUCTS) {
        await db.product.create({
          data: prod
        });
      }

      console.log(`\n==================================================`);
      console.log(`[DATABASE SEED] E-Commerce products seeded successfully!`);
      console.log(`==================================================\n`);
    }
  } catch (err) {
    console.error("Failed to seed products:", err);
  }
}

seedAdmin();
seedKits();
seedUpcomingFeatures();
seedAnnouncements();
seedProducts();

