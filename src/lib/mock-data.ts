export interface TaggedItem {
  tag: "DHARMA" | "PRATHA" | "BHRANTI";
  label: string;
}

export interface PanchangRow {
  label: string;
  value: string;
  sub?: string;
}

export interface RitualJourneyStep {
  name: string;
  status: "completed" | "active" | "pending";
}

export interface ArticleCard {
  title: string;
  tag: "DHARMA" | "PRATHA" | "BHRANTI";
  dateMeta: string;
  description: string;
}

export interface CategoryCard {
  title: string;
  sub: string;
  count: string;
}

// DPB Tag Color Convention helper
// Dharma = green, Pratha = amber, Bhranti = pink
export const getTagColors = (tag: "DHARMA" | "PRATHA" | "BHRANTI") => {
  switch (tag) {
    case "DHARMA":
      return {
        bg: "bg-[#EBF5EC]",
        text: "text-[#1A5C28]",
        border: "border-[#C5DFB8]",
      };
    case "PRATHA":
      return {
        bg: "bg-[#FFF8E8]",
        text: "text-[#8B6914]",
        border: "border-[#E8D8A0]",
      };
    case "BHRANTI":
      return {
        bg: "bg-[#FEF0F4]",
        text: "text-[#D4175A]",
        border: "border-[#F0B8CC]",
      };
  }
};

export const ANNOUNCEMENT_MESSAGE = "Dharma doesn't demand fear, it demands devotion.";

export const FEATURED_RITUAL = {
  eyebrow: "TODAY'S RITUAL · SAWAN 2026",
  tag: "DHARMA" as const,
  title: "Sawan Somwar Vrat",
  subtitle: "A weekly vow of devotion to Lord Shiva during the holy month of Shravan.",
  ctas: [
    { text: "▶ Start today's vrat", style: "pink" },
    { text: "📖 Read complete vidhi", style: "ghost" },
    { text: "🎧 Listen instead", style: "ghost" },
  ],
  shareText: "↗ Share",
};

export const TRUST_BADGES = [
  "Scripturally sourced",
  "Pratha-aware",
  "Fear-free",
  "Shraddha-first",
];

export const PANCHANG_TODAY = {
  sectionHeading: "Panchang today",
  date: "Wednesday, 15 July 2026",
  location: "Ashadha Shukla Paksha · Delhi–NCR",
  rows: [
    { label: "Tithi", value: "Saptami", sub: "7th day" },
    { label: "Paksha", value: "Shukla", sub: "Waxing moon" },
    { label: "Nakshatra", value: "Rohini", sub: "Auspicious" },
    { label: "Sunrise", value: "5:28", sub: "am" },
  ] as PanchangRow[],
  nextVrat: {
    label: "NEXT VRAT",
    value: "Sawan Somwar - Monday, 20 July",
  },
  countdown: "In 5 days",
  buttonText: "Full →",
};

export const RITUAL_KITS_SHELF = {
  sectionHeading: "Ritual Kits",
  eyebrow: "LAUNCHING September 24th",
  title: "Complete Samagri for every puja.",
  body: "Ritually correct. Sourced right. Delivered before your ritual.",
  ctaText: "🔔 Notify me",
};

export const TODAY_RITUAL_JOURNEY = {
  sectionHeading: "Today's ritual journey",
  steps: [
    { name: "Preparation", status: "completed" },
    { name: "Sankalp", status: "active" },
    { name: "Abhishek", status: "pending" },
    { name: "Japa & Dhyan", status: "pending" },
    { name: "Vrat Katha", status: "pending" },
    { name: "Evening Puja", status: "pending" },
  ] as RitualJourneyStep[],
  linkText: "View all →",
};

export const RITUAL_GUIDES_ARTICLES = {
  sectionHeading: "From Ritual Guides",
  linkText: "See all →",
  articles: [
    {
      title: "Hariyali Teej",
      tag: "PRATHA" as const,
      dateMeta: "15 Aug · Shravan Shukla Tritiya",
      description: "A celebration of nature, union, and marital devotion dedicated to Goddess Parvati.",
    },
    {
      title: "Nag Panchami",
      tag: "DHARMA" as const,
      dateMeta: "17 Aug · Shravan Shukla Panchami",
      description: "Honoring the serpent deities to seek protection and strength during Shravan.",
    },
    {
      title: "Kajari Teej",
      tag: "PRATHA" as const,
      dateMeta: "29 Aug · Bhadrapada Krishna Tritiya",
      description: "Observed by women fasting and singing traditional kajri songs for family well-being.",
    },
    {
      title: "Rudrabhishek",
      tag: "DHARMA" as const,
      dateMeta: "Every Monday · Shravan Special",
      description: "The powerful bathing ritual of Shiva Lingam with sacred liquids to invoke peace.",
    },
  ] as ArticleCard[],
};

export const PUROHIT_BOOKING = {
  sectionHeading: "Pujan with Purohit",
  title: "Need a Pandit?",
  subtitle: "Verified purohits · Kit included · 6 puja types",
  ctaText: "Book now",
};

export const WHATSAPP_SUBSCRIPTION = {
  title: "Never miss a vrat or ritual",
  subtitle: "Weekly WhatsApp reminders - ₹499 / year",
  badge: "[first 100 users get free subscription for a year]",
  arrow: "›",
};

export const CATEGORY_GRID = [
  {
    title: "Ritual Guides",
    sub: "Step-by-step vidhi, mantras & significance",
    count: "48 guides",
  },
  {
    title: "Ritual Kits",
    sub: "Complete Samagri delivered before the date",
    count: "Launching soon",
  },
  {
    title: "Pujan with Purohit",
    sub: "Book a verified pandit with kit included",
    count: "6 Pujans",
  },
  {
    title: "Panchang",
    sub: "Tithi, nakshatra, vrat dates & muhurat",
    count: "2026 calendar",
  },
] as CategoryCard[];
