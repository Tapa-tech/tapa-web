import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

// Keep in sync with the 13 kits available on the frontend
const KITS_LIST = [
  {
    id: "shubh-sampada",
    name: "Shubh Sampada",
    hindi: "शुभ सम्पदा — Auspicious Abundance",
    occ: "navratri",
    deity: "devi",
    price: 2749,
    itemsCount: "16 items",
    delivery: "🚚 Delivered before Navratri begins",
  },
  {
    id: "shakti-aradhana",
    name: "Shakti Aradhana",
    hindi: "शक्ति आराधना — Goddess Devotion",
    occ: "navratri",
    deity: "devi",
    price: 2199,
    itemsCount: "12 items",
    delivery: "🚚 Delivered before Navratri begins",
  },
  {
    id: "purna-ghatasthapana",
    name: "Purna Ghatasthapana",
    hindi: "पूर्ण घटस्थापना — Complete Kalash Set",
    occ: "navratri",
    deity: "devi",
    price: 1099,
    itemsCount: "10 items",
    delivery: "🚚 Restocking soon · Ships in October",
  },
  {
    id: "shubh-akshaya-thali",
    name: "Shubh Akshaya Thali",
    hindi: "शुभ अक्षय थाली — Eternal Abundance Platter",
    occ: "diwali",
    deity: "vishnu",
    price: 1649,
    itemsCount: "13 items",
    delivery: "🚚 Delivered before Diwali begins",
  },
  {
    id: "shashti-deepam",
    name: "Shashti Deepam",
    hindi: "षष्टि दीपम् — Sixty Clay Lamps Set",
    occ: "diwali",
    deity: "devi",
    price: 1099,
    itemsCount: "6 items",
    delivery: "🚚 Delivered before Diwali begins",
  },
  {
    id: "deepa-vaibhava",
    name: "Deepa Vaibhava",
    hindi: "दीप वैभव — Grand Festive Lights",
    occ: "diwali",
    deity: "vishnu",
    price: 934,
    itemsCount: "8 items",
    delivery: "🚚 Shipped before Diwali",
  },
  {
    id: "trimshat-deepam",
    name: "Trimshat Deepam",
    hindi: "त्रिंशत् दीपम् — Thirty Sacred Lamps",
    occ: "diwali",
    deity: "vishnu",
    price: 604,
    itemsCount: "4 items",
    delivery: "🚚 Delivered before Diwali begins",
  },
  {
    id: "tulsi-kalyanam",
    name: "Tulsi Kalyanam Collection",
    hindi: "तुलसी कल्याणम् — Sacred Tulsi Marriage Kit",
    occ: "satyanarayan",
    deity: "vishnu",
    price: 1979,
    itemsCount: "10 items",
    delivery: "🚚 Year-round delivery",
  },
  {
    id: "satyanarayan-pujan",
    name: "Satyanarayan Pujan",
    hindi: "सत्यनारायण पूजन — Lord of Truth Ritual Samagri",
    occ: "satyanarayan",
    deity: "vishnu",
    price: 1979,
    itemsCount: "11 items",
    delivery: "🚚 Year-round delivery",
  },
  {
    id: "sundarkand-path",
    name: "Sundarkand Path Kit Essentials",
    hindi: "सुन्दरकाण्ड पाठ — Hanumant Aradhana",
    occ: "yearround",
    deity: "vishnu",
    price: 2419,
    itemsCount: "9 items",
    delivery: "🚚 Year-round delivery",
  },
  {
    id: "yajna",
    name: "Yajña",
    hindi: "यज्ञ — Sacred Havan Samagri",
    occ: "yearround",
    deity: "vishnu",
    price: 1209,
    itemsCount: "8 items",
    delivery: "🚚 Year-round delivery",
  },
  {
    id: "ekadash",
    name: "Ekadash",
    hindi: "एकादश — Eleven Sacred Senses Kit",
    occ: "yearround",
    deity: "vishnu",
    price: 879,
    itemsCount: "7 items",
    delivery: "🚚 Year-round delivery",
  },
  {
    id: "panch-jyoti",
    name: "Panch Jyoti Gift Tray",
    hindi: "पंच ज्योति — Festive Gifting Platter",
    occ: "yearround",
    deity: "devi",
    price: 659,
    itemsCount: "5 items",
    delivery: "🚚 Year-round delivery",
  },
];

export async function GET(req: NextRequest) {
  try {
    const q = req.nextUrl.searchParams.get("q") || "";
    if (!q.trim()) {
      return NextResponse.json({ guides: [], kits: [] });
    }

    // 1. Search Ritual Guides in the Database with proper matching across relevant fields
    const guides = await db.ritualGuide.findMany({
      where: {
        status: "PUBLISHED",
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { category: { contains: q, mode: "insensitive" } },
          { introText: { contains: q, mode: "insensitive" } },
          { kathaTitle: { contains: q, mode: "insensitive" } },
          { kathaBody: { contains: q, mode: "insensitive" } },
          {
            steps: {
              some: {
                OR: [
                  { title: { contains: q, mode: "insensitive" } },
                  { description: { contains: q, mode: "insensitive" } },
                ],
              },
            },
          },
          {
            mantras: {
              some: {
                OR: [
                  { devanagari: { contains: q, mode: "insensitive" } },
                  { transliteration: { contains: q, mode: "insensitive" } },
                  { meaning: { contains: q, mode: "insensitive" } },
                ],
              },
            },
          },
          {
            samagriItems: {
              some: {
                OR: [
                  { name: { contains: q, mode: "insensitive" } },
                  { function: { contains: q, mode: "insensitive" } },
                ],
              },
            },
          },
        ],
      },
      select: {
        id: true,
        title: true,
        slug: true,
        category: true,
      },
      take: 6,
    });

    // 2. Search Ritual Kits (Filter from the static list of 13 kits)
    const normalizedQuery = q.toLowerCase();
    const kits = KITS_LIST.filter(
      (k) =>
        k.name.toLowerCase().includes(normalizedQuery) ||
        k.occ.toLowerCase().includes(normalizedQuery) ||
        k.deity.toLowerCase().includes(normalizedQuery) ||
        (k.hindi && k.hindi.toLowerCase().includes(normalizedQuery))
    ).slice(0, 4);

    return NextResponse.json({ guides, kits });
  } catch (err) {
    console.error("Public search API error:", err);
    return NextResponse.json({ error: "Internal Search Error" }, { status: 500 });
  }
}
