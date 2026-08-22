/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
"use client";


import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import AnnouncementBar from "@/components/AnnouncementBar";
import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";
import ListenButton from "@/components/ListenButton";
import { useCartStore } from "@/lib/store/cartStore";
import { trackAddToCart } from "@/lib/analytics";
import { formatRichText } from "@/utils/tiptap";

// Fallback static data matching Ritual Guide-Festive.html
const FALLBACK_GUIDE = {
  title: "Sharad Navratri: The Complete 9-Day Guide",
  category: "Festive Pujans",
  introText: "Ghatasthapana to Maha Navami — nine forms, nine nights, one Mother.",
  sankalpaBody: "मम द्विकुल-सकल-शान्ति-पूर्वक-दीर्घायु-विभूति-बल-कीर्ति-प्राप्त्यर्थं, माँ दुर्गा प्रीत्यर्थं शारदीय-नवरात्रि-व्रत-पूजनं करिष्ये।",
  sankalpaQuote: "“I state my intent to keep the nine nights of Navratri with clean devotion, for the peace, health, and spiritual growth of my family.”",
  fastNote: "Fasting is a tool for self-purification, not self-punishment. If you have medical conditions, pregnant, or traveling, scriptural exemptions exist. Pratha (custom) says stay hungry; Dharma (practice) says stay pure.",
  kathaTitle: "The legend of Durga and Mahishasura",
  kathaBody: "The gods, led by Indra, were driven out of heaven by the buffalo-demon Mahishasura after a hundred-year war. Unable to defeat him individually, they approached the Trimurti: Shiva, Vishnu, and Brahma.\n\nHearing this, anger rose from the faces of Vishnu, Shiva, and Brahma, and from their bodies emerged a great light. The energies of all the gods converged into a single point, forming a resplendent female form — Durga.\n\nThe gods presented her with their most powerful weapons: Shiva gave her a trident, Vishnu a discus, Varuna a conch, Agni a spear, Yama a staff, and Vayu a bow and arrows. Mounted on a lion, Durga marched to Vindhyachal mountains.\n\nMahishasura attacked her with his armies. Durga destroyed his forces and engaged the demon in a fierce battle. Each time she struck him, he changed forms — from a buffalo to a lion, an elephant, a giant, and back to a buffalo. Finally, Durga pinned him down and pierced him with Shiva's trident, slaying him. The cosmos was restored to balance, and the gods sang her praise.",
  aartiBody: "मैया जय अम्बे गौरी, मैया जय अम्बे गौरी । तुमको निशदिन ध्यावत, हरि ब्रह्मा शिवरी ॥\nमाँग सिन्दूर बिराजत, टीको मृगमद को । उज्ज्वल से दोऊ नैना, चन्द्रबदन नीको ॥\nकनक समान कलेवर, रक्ताम्बर राजै । रक्तपुष्प गल माला, कण्ठन पर साजै ॥\nकेहरि वाहन राजत, खड्ग खप्परधारी । सुर-नर-मुनिजन सेवत, तिनके दुखहारी ॥\nकानन कुण्डल शोभित, नासाग्रे मोती । कोटिक चन्द्र दिवाकर, सम राजत ज्योती ॥\nशुम्भ-निशुम्भ बिदारे, महिषासुर घाती । धूम्र विलोचन नैना, निशदिन मदमाती ॥\nचण्ड-मुण्ड संहारे, शोणित बीज हरे । मधु-कैटभ दोऊ मारे, सुर भयहीन करे ॥\nब्रह्माणी, रुद्राणी, तुम कमला रानी  आगम निगम बखानी, तुम शिव पटराणी ॥\nचौंसठ योगिनि मङ्गल गावत, नृत्य करत भैरुँ । बाजत ताल मृदङ्गा, अरु बाजत डमरू ॥\nतुम ही जग की माता, तुम ही भरता । भक्तन की दुख हरता, सुख सम्पत्ति करता ॥\nभुजा चार अति शोभित, वरमुद्रा धारी । मनवाञ्छित फल पावत, सेवत नर-नारी ॥\nकञ्चन थाल विराजत, अगर कपूर बाती । श्रीमालकेतु में राजत, कोटि रतन ज्योती ॥\nश्री अम्बेजी की आरती, जो कोई नर गावै । कहत शिवानन्द स्वामी, सुख-सम्पत्ति पावै ॥",
  steps: [
    { order: 1, title: "Purification (Pavitrikaran)", description: "Sprinkle clean water or Gangajal on yourself and your puja space. Recite 'Om Apavitrah Pavitro Va' or simply state your intent to begin in purity.", note: "Some custom traditions require bathing only in river water; any clean water is scripturally sound." },
    { order: 2, title: "Sankalpa (Stating Intent)", description: "Hold water, a flower, and some grains of rice in your right hand. Recite the Navratri Sankalpa or declare in your own words your commitment to the nine-day vrat.", note: "Fasting rules can be customized during Sankalpa based on your health." },
    { order: 3, title: "Kalash Sthapana (Ghatasthapana)", description: "Place clean soil in an earthen shallow pot, sow barley seeds. Place the copper/clay Kalash filled with water, betel nut, coin, and durva grass. Arrange mango leaves and place a coconut wrapped in red cloth on top.", note: "Copper Kalash is preferred, but clay is perfectly scripturally valid." },
    { order: 4, title: "Akhand Jyot (Eternal Flame)", description: "Light the oil or ghee lamp. If keeping an Akhand Jyot, ensure it is protected from wind and checked regularly to add ghee or oil.", note: "If an Akhand Jyot is not possible, lighting a lamp during morning and evening pujas is scripturally approved." },
    { order: 5, title: "Daily Offerings (Shodashopachara)", description: "Offer flowers, incense, dhoop, fruits, and daily bhog/prasad to the deity. Recite the daily form's mantra 108 times.", note: "Bhog offering should be satvik, cooked without onion or garlic." }
  ],
  samagriItems: [
    { name: "Kalash (Copper or Earthen)", function: "For establishing the sacred water body (Ghatasthapana)" },
    { name: "Dry Coconut (Jata-yukta Nariyal)", function: "To place on top of the Kalash wrapped in red cloth" },
    { name: "Mango Leaves (Amra Pallav)", function: "5 or 7 leaves arranged around the neck of the Kalash" },
    { name: "Barley Seeds (Jau) and Clean Soil", function: "Sown in the mud base to represent growth and fertility" },
    { name: "Red Altar Cloth (Lal Kapda)", function: "To drape the puja platform or wrap the coconut" },
    { name: "Akshat (Whole Rice Grains)", function: "For offering and making the base under the Kalash" },
    { name: "Molly Thread (Kalava)", function: "Sacred thread to tie around the Kalash neck" },
    { name: "Roli and Kumkum", function: "For tilak and decorating the Kalash" },
    { name: "Ghee or Sesame Oil", function: "For lighting the Akhand Jyot or daily lamps" }
  ],
  mantras: [
    { devanagari: "ॐ देवी शैलपुत्र्यै नमः॥", transliteration: "Om Devi Shailaputryai Namah॥", meaning: "Salutations to Shailaputri, the daughter of the mountains, who represents strength and stability." },
    { devanagari: "ॐ देवी ब्रह्मचारिण्यै नमः॥", transliteration: "Om Devi Brahmacharinyai Namah॥", meaning: "Salutations to Brahmacharini, who observes severe penance, representing wisdom and discipline." }
  ],
  dpbEntries: [
    { elementName: "Ghatasthapana", tag: "DHARMA", confidenceScore: 5, claim: "Establishing Kalash at the beginning of Navratri", correction: "Core practice verified by Devi Bhagavatam.", sourceOfTruth: "Devi Bhagavata Purana", regionalVariance: "Sowing wheat/barley is common in the North, while Kolu display is central in South India." },
    { elementName: "Sowing Barley (Jau)", tag: "PRATHA", confidenceScore: 4, claim: "Barley growth predicts the family's fortune", correction: "Sowing grains is an auspicious agricultural custom (Pratha), but scriptural value lies in the worship of nature, not superstitious fortune telling.", sourceOfTruth: "Atharva Veda & local customs", regionalVariance: "Mainly observed in Northern and Western India." },
    { elementName: "Avoiding certain foods in vrat", tag: "BHRANTI", confidenceScore: 5, claim: "Accidentally eating grain invalidates the entire 9-day vrat", correction: "Strict fasting is recommended, but accidental consumption does not ruin devotion. Sincere apology (Prashachit) and continuing is scripturally supported.", sourceOfTruth: "Manu Smriti & scriptures on Vrats", regionalVariance: "Observed globally." }
  ],
  sources: [
    { source: { name: "Devi Bhagavata Purana", reference: "Book 3, Chapter 26 on Navratri Vidhi" } },
    { source: { name: "Markandeya Purana", reference: "Devi Mahatmya (Durga Saptashati) sections" } }
  ],
  faqs: [
    { faq: { question: "What should I do if the Akhand Jyot goes out?", answer: "Do not panic or feel fearful. Scripturally, fear has no place in devotion. Simply clean the lamp, ask for forgiveness in your heart, light it again, and offer a simple mantra." } },
    { faq: { question: "Can women perform Ghatasthapana?", answer: "Yes, absolutely. Devi Bhagavata Purana states that anyone with pure devotion (bhakti) can perform the puja, regardless of gender." } }
  ]
};

const SHARAD_NINE_DAYS = [
  { day: "1", date: "Sun 11 Oct", tithi: "Pratipada", deity: "Shailaputri (Mountain Daughter)", col: "Yellow", colHex: "#FFB801", of: "Ghee / Health" },
  { day: "2", date: "Mon 12 Oct", tithi: "Dwitiya", deity: "Brahmacharini (Pious Penance)", col: "Green", colHex: "#27500A", of: "Sugar / Longevity" },
  { day: "3", date: "Tue 13 Oct", tithi: "Tritiya", deity: "Chandraghanta (Bell-Moon Goddess)", col: "Grey", colHex: "#7A6A55", of: "Milk / Pain Relief" },
  { day: "4", date: "Wed 14 Oct", tithi: "Chaturthi", deity: "Kushmanda (Creator Cosmic Egg)", col: "Orange", colHex: "#E8A020", of: "Malpua / Intellect" },
  { day: "5", date: "Thu 15 Oct", tithi: "Panchami", deity: "Skandamata (Mother of Kartikeya)", col: "White", colHex: "#FFFFFF", of: "Banana / Salvation" },
  { day: "6", date: "Fri 16 Oct", tithi: "Shashti", deity: "Katyayani (Warrior Daughter)", col: "Red", colHex: "#EF0F54", of: "Honey / Beauty" },
  { day: "7", date: "Sat 17 Oct", tithi: "Saptami", deity: "Kalaratri (Destroyer of Darkness)", col: "Royal Blue", colHex: "#1A2A4A", of: "Jaggery / Courage" },
  { day: "8", date: "Sun 18 Oct", tithi: "Ashtami", deity: "Mahagauri (Purity & Light)", col: "Pink", colHex: "#FD066D", of: "Coconut / Offspring" },
  { day: "9", date: "Mon 19 Oct", tithi: "Navami", deity: "Siddhidhatri (Giver of Siddhis)", col: "Purple", colHex: "#4A2A7A", of: "Sesame / Protection" }
];

interface DpbEntry {
  id?: string;
  tag: string;
  confidenceScore: number;
  regionalVariance?: string;
  elementName: string;
  claim?: string;
  correction?: string;
  sourceOfTruth?: string;
}

interface SourceDetails {
  name: string;
  reference?: string;
}

interface GuideSource {
  source: SourceDetails;
}

interface GuideStep {
  id?: string;
  order: number;
  title: string;
  description: string;
  note?: string;
}

interface SamagriItem {
  id?: string;
  name: string;
  function: string;
}

interface Mantra {
  id?: string;
  devanagari: string;
  transliteration: string;
  meaning: string;
}

interface FAQ {
  question: string;
  answer: string;
}

interface GuideFAQ {
  faq: FAQ;
}

interface Guide {
  id?: string;
  title: string;
  slug: string;
  status: string;
  category: string;
  introText?: string;
  sankalpaBody?: string;
  sankalpaQuote?: string;
  fastOptions?: any;
  fastNote?: string;
  kathaTitle?: string;
  kathaBody?: string;
  aartiBody?: string;
  steps?: GuideStep[];
  samagriItems?: SamagriItem[];
  mantras?: Mantra[];
  dpbEntries?: DpbEntry[];
  sources?: GuideSource[];
  faqs?: GuideFAQ[];
  thumbnailUrl?: string;
}

interface PageProps {
  params: {
    slug: string;
  };
}



export default function RitualGuideDetailPage({ params }: PageProps) {
  const router = useRouter();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [lang, setLang] = useState<"EN" | "HI">("EN");
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [japaCount, setJapaCount] = useState(0);
  const [japaPreset, setJapaPreset] = useState<number | null>(null);
  const [showStickyBottom, setShowStickyBottom] = useState(false);

  // DB Data hooks
  const [guide, setGuide] = useState<Guide | null>(null);
  const resolvedGuide = (guide || FALLBACK_GUIDE) as any;
  
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [linkedProduct, setLinkedProduct] = useState<any>(null);

  // Zustand Cart Store
  const addToCartStore = useCartStore((state) => state.addToCart);

  useEffect(() => {
    async function checkLinkedProduct() {
      if (!resolvedGuide?.id) return;
      try {
        const res = await fetch("/api/public/products");
        if (res.ok) {
          const products = await res.json();
          const match = products.find((p: any) => p.linkedRitualGuideId === resolvedGuide.id);
          if (match) {
            setLinkedProduct(match);
          }
        }
      } catch (err) {
        console.error("Failed to check linked product:", err);
      }
    }
    checkLinkedProduct();
  }, [resolvedGuide?.id]);

  const handleBuyKit = () => {
    if (linkedProduct) {
      addToCartStore(linkedProduct.id, 1, {
        name: linkedProduct.name,
        price: Number(linkedProduct.price),
        image: linkedProduct.images?.[0] || undefined,
        category: linkedProduct.category,
        codAvailability: linkedProduct.codAvailability,
      });
      trackAddToCart(linkedProduct.id, linkedProduct.name, Number(linkedProduct.price), 1, linkedProduct.category);
      triggerToast(`Added ${linkedProduct.name} to cart! Redirecting...`);
      setTimeout(() => {
        router.push("/cart");
      }, 1000);
    } else {
      triggerToast(`We will notify you when the companion kit for ${resolvedGuide.title} launches!`);
    }
  };

  // Checkbox State
  const [checklist, setChecklist] = useState<boolean[]>([]);

  useEffect(() => {
    if (guide?.steps) {
      setChecklist(new Array(guide.steps.length).fill(false));
    } else if (!guide && FALLBACK_GUIDE.steps) {
      setChecklist(new Array(FALLBACK_GUIDE.steps.length).fill(false));
    }
  }, [guide]);

  useEffect(() => {
    async function loadGuide() {
      try {
        const res = await fetch(`/api/public/ritual-guides/${params.slug}`);
        if (res.ok) {
          const data = await res.json();
          setGuide(data);
        }
      } catch (err) {
        console.error("Failed to load guide details:", err);
      } finally {
        setLoading(false);
      }
    }
    loadGuide();
  }, [params.slug]);

  useEffect(() => {
    async function checkAuthAndSaved() {
      try {
        const sessionRes = await fetch("/api/auth/session");
        if (sessionRes.ok) {
          const sessionData = await sessionRes.json();
          if (sessionData?.session) {
            setIsLoggedIn(true);
            const savedRes = await fetch("/api/public/saved-guides");
            if (savedRes.ok) {
              const savedData = await savedRes.json();
              const savedList = savedData.savedGuides || [];
              const hasSaved = savedList.some((g: any) => g.slug === params.slug);
              setIsSaved(hasSaved);
            }
          }
        }
      } catch (err) {
        console.error("Failed to check auth and saved status:", err);
      }
    }
    checkAuthAndSaved();
  }, [params.slug, guide]);

  // Listen to scroll position for sticky bottom
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 450) {
        setShowStickyBottom(true);
      } else {
        setShowStickyBottom(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const triggerToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleSaveToggle = async () => {
    try {
      // Fetch session check again to be sure
      const sessionRes = await fetch("/api/auth/session");
      const sessionData = await sessionRes.json();
      if (!sessionData?.session) {
        const currentUrl = window.location.pathname;
        router.push(`${currentUrl}?login=true`);
        triggerToast("Please sign in to save this guide.");
        return;
      }

      if (!guide) {
        triggerToast("Guide details are still loading.");
        return;
      }

      const res = await fetch("/api/public/saved-guides", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guideId: guide.id }),
      });

      if (res.ok) {
        const data = await res.json();
        setIsSaved(data.saved);
        triggerToast(data.saved ? "Guide saved to your profile!" : "Removed guide from saved list.");
      } else {
        triggerToast("Failed to update saved status.");
      }
    } catch (err) {
      triggerToast("Error updating saved status.");
    }
  };

  const handleCheck = (index: number) => {
    const updated = [...checklist];
    updated[index] = !updated[index];
    setChecklist(updated);
  };

  const checkedCount = checklist.filter(Boolean).length;

  const handlePreset = (preset: number) => {
    setJapaPreset(preset);
    setJapaCount(preset);
    triggerToast(`Japa preset set to ${preset}!`);
  };

  const handleIncrement = () => {
    setJapaCount(prev => prev + 1);
  };

  const handleDecrement = () => {
    setJapaCount(prev => Math.max(0, prev - 1));
  };

  // Format rich text blocks if stored as JSON
  const introText = formatRichText(resolvedGuide.introText);
  const kathaBody = formatRichText(resolvedGuide.kathaBody);
  const sankalpaBody = formatRichText(resolvedGuide.sankalpaBody);
  const sankalpaQuote = formatRichText(resolvedGuide.sankalpaQuote);
  const aartiBody = formatRichText(resolvedGuide.aartiBody);

  const fullTextToRead = useMemo(() => {
    const stepsText = resolvedGuide.steps
      ? resolvedGuide.steps.map((s: any) => `Step ${s.order}: ${s.title}. ${s.description}`).join(" ")
      : "";
    const kathaText = kathaBody ? `Katha: ${resolvedGuide.kathaTitle || ""}. ${kathaBody}` : "";
    return `${resolvedGuide.title}. ${introText}. ${stepsText} ${kathaText}`;
  }, [resolvedGuide, introText, kathaBody]);

  const mantrasTextToRead = useMemo(() => {
    if (!resolvedGuide.mantras) return "";
    return resolvedGuide.mantras.map((m: any) => `Mantra: ${m.transliteration}. Meaning: ${m.meaning}`).join(" ");
  }, [resolvedGuide.mantras]);

  const currentCategory = resolvedGuide.category || "Festive Pujans";
  const primarySource = resolvedGuide.sources?.[0]?.source || { name: "Markandeya Purana", reference: "Devi Mahatmya" };
  const starsCount = resolvedGuide.dpbEntries?.length 
    ? Math.round(resolvedGuide.dpbEntries.reduce((a: number, b: any) => a + b.confidenceScore, 0) / resolvedGuide.dpbEntries.length) 
    : 4;

  const regionalVarianceStr = useMemo(() => {
    if (!resolvedGuide.dpbEntries) return "North India, Gujarat, Bengal, South India";
    const variances = resolvedGuide.dpbEntries
      .map((e: any) => e.regionalVariance)
      .filter((v: any): v is string => typeof v === "string" && v.trim().length > 0);
    return variances.length ? variances.slice(0, 3).join(", ") : "North India, Gujarat, Bengal, South India";
  }, [resolvedGuide.dpbEntries]);

  // Extract core practicing elements (DHARMA & PRATHA)
  const dCount = resolvedGuide.dpbEntries?.filter((e: any) => e.tag === "DHARMA").length || 1;
  const pCount = resolvedGuide.dpbEntries?.filter((e: any) => e.tag === "PRATHA").length || 1;
  const bCount = resolvedGuide.dpbEntries?.filter((e: any) => e.tag === "BHRANTI").length || 1;

  // Extract Bhranti (myths)
  const myths = useMemo(() => {
    if (!resolvedGuide.dpbEntries) return [];
    return resolvedGuide.dpbEntries.filter((e: any) => e.tag === "BHRANTI");
  }, [resolvedGuide.dpbEntries]);

  // Parse fast options
  const resolvedFastOptions = useMemo(() => {
    if (resolvedGuide.fastOptions) {
      if (typeof resolvedGuide.fastOptions === "string") {
        try {
          return JSON.parse(resolvedGuide.fastOptions);
        } catch {
          return [];
        }
      } else if (Array.isArray(resolvedGuide.fastOptions)) {
        return resolvedGuide.fastOptions;
      }
    }
    return [
      { name: "Nirjala (Waterless)", desc: "Strict fasting observed without water or food. Ideal for scriptural purity if health permits." },
      { name: "Phalahar (Fruit Fast)", desc: "Fasting on organic fresh fruits, dry fruits, water, and milk." },
      { name: "Ekabhukta (Single Meal)", desc: "Consuming a single clean satvik meal during the day, after sunset." }
    ];
  }, [resolvedGuide.fastOptions]);

  const resolvedNineFormsTable = useMemo(() => {
    if (resolvedGuide.nineFormsTable) {
      if (typeof resolvedGuide.nineFormsTable === "string") {
        try {
          return JSON.parse(resolvedGuide.nineFormsTable);
        } catch {
          return [];
        }
      } else if (Array.isArray(resolvedGuide.nineFormsTable)) {
        return resolvedGuide.nineFormsTable;
      }
    }
    return [];
  }, [resolvedGuide.nineFormsTable]);

  const handleAudioToggle = () => {
    setAudioPlaying(!audioPlaying);
    if (!audioPlaying) {
      triggerToast("Narrating audio guide...");
    } else {
      triggerToast("Audio guide paused.");
    }
  };

  return (
    <div className="min-h-screen bg-[#F2EDE4] text-[#2C2010] font-sans antialiased ritual-guide-detail-page">
      <AnnouncementBar />
      <TopNav
        activeTab="Ritual Guides"
        onTriggerToast={triggerToast}
      />

      {/* Breadcrumb section */}
      <div className="bcrumb select-none">
        <div className="bc-in">
          <div className="bc-l">
            Home › Ritual Guides › {currentCategory} › <b>{resolvedGuide.title}</b>
          </div>
          <div className="bc-r">
            <div className="lang">
              <button 
                onClick={() => { setLang("EN"); triggerToast("Language set to English"); }} 
                className={lang === "EN" ? "on" : ""}
              >
                EN
              </button>
              <button 
                onClick={() => { setLang("HI"); triggerToast("Hindi translation coming soon!"); }} 
                className={lang === "HI" ? "on" : ""}
              >
                हिं
              </button>
            </div>
            <button onClick={handleSaveToggle} className={`bcb hover:border-pink transition-colors ${isSaved ? "text-pink font-semibold" : ""}`}>
              🔖 {isSaved ? "Saved" : "Save"}
            </button>
            <button onClick={() => triggerToast("Copied share link to clipboard!")} className="bcb hover:border-pink transition-colors">
              ↗ Share
            </button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="hero">
        <div 
          className="hero-bg" 
          style={resolvedGuide.thumbnailUrl ? { backgroundImage: `url(${resolvedGuide.thumbnailUrl})`, backgroundSize: "cover", backgroundPosition: "center" } : {}}
        />
        <div className="hero-ov" />
        <button 
          onClick={() => triggerToast("Copied share link to clipboard!")} 
          className="hero-share font-sans select-none cursor-pointer hover:bg-white/35 transition-colors"
        >
          ↗ Share
        </button>
        <div className="hero-c">
          <div className="hero-in select-none">
            <p className="hero-ey uppercase font-sans font-semibold">
              RITUAL GUIDES · {currentCategory}
            </p>
            <div className="hero-tag font-sans font-bold">
              ◆ {resolvedGuide.dpbEntries?.[0]?.tag || "DHARMA"} · {starsCount}/5 · PURANIC
            </div>
            <h1 className="hero-h1 font-serif font-bold text-hero-text leading-tight">
              {resolvedGuide.title}
            </h1>
            <p className="hero-sub font-sans">
              {introText}
            </p>
            <p className="hero-date font-sans">
              Ashwin Shukla Paksha · Delhi-NCR
            </p>
            <div className="hero-btns">
              <button 
                onClick={() => {
                  const element = document.getElementById("vidhi");
                  element?.scrollIntoView({ behavior: "smooth" });
                }} 
                className="hb-p font-sans font-bold hover:bg-white transition-opacity"
              >
                Start Vidhi
              </button>
              <button 
                onClick={() => triggerToast("Downloading PDF ritual card...")} 
                className="hb-g font-sans font-bold hover:bg-white/20 transition-colors"
              >
                Download Card
              </button>
              <button 
                onClick={() => triggerToast("Pre-booking Sawan Puja Samagri Kit...")} 
                className="hb-g font-sans font-bold hover:bg-white/20 transition-colors"
              >
                Pre-book kit
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Audio narration strip */}
      <div className="strip select-none">
        <div className="strip-in">
          <div className="tp">
            <span className="tpi"><span className="tpd bg-[#27500A]" />Scripturally sourced</span>
            <span className="tpi"><span className="tpd bg-[#E8A020]" />Region aware</span>
            <span className="tpi"><span className="tpd bg-[#EF0F54]" />Fear-free</span>
          </div>
          <div className="audio">
            <ListenButton
              text={fullTextToRead}
              label=""
              audioUrl={resolvedGuide.audioUrl}
              iconOnly={true}
              className="aplay hover:scale-105 transition-transform"
            />
            <div>
              <div className="alab">Listen to this guide</div>
              <div className="asub">18 min · narrated</div>
            </div>
            <div className="alangs select-none">
              <button onClick={() => triggerToast("Audio loaded in English")} className="alg on">EN</button>
              <button onClick={() => triggerToast("Hindi audio coming soon!")} className="alg">हिं</button>
            </div>
          </div>
        </div>
      </div>

      {/* Jump to Chips navigation */}
      <div className="chips select-none">
        <div className="chips-in">
          <span className="chip-l">JUMP TO</span>
          <a className="chip" href="#story">📖 Story</a>
          <a className="chip" href="#sankalp">✋ Sankalpa</a>
          <a className="chip" href="#vidhi">🪔 Vidhi Steps</a>
          <a className="chip" href="#katha">📿 Vrat Katha</a>
          <a className="chip" href="#samagri">🧺 Samagri</a>
          <a className="chip" href="#fast">🍎 Fasting</a>
          {myths.length > 0 && <a className="chip" href="#myths">✕ Myths</a>}
        </div>
      </div>

      {/* Main Layout Area */}
      <div className="wrap">
        <div className="layout">
          <div className="main">

            {/* Credibility Info Box */}
            <div className="cc select-none">
              <div className="cc-h">
                <span className="cc-hl">SOURCE OF TRUTH</span>
                <span onClick={() => triggerToast(`Opening source: ${primarySource.name}`)} className="cc-hr cursor-pointer">
                  Read source ›
                </span>
              </div>
              <div className="cc-b">
                <div className="cc-core">CORE PRACTICE</div>
                <div className="cc-claim font-sans">
                  Worship of {resolvedGuide.title?.split(":")[0]} from ancient scriptures
                </div>
                <div className="cc-row">
                  <span className="pill d">DHARMA · {starsCount}/5</span>
                  <span className="badge puranic">PURANIC</span>
                  <span className="pill src">{primarySource.name} · {primarySource.reference}</span>
                </div>
              </div>
              <p className="cc-comp font-sans">
                This guide: <b>{dCount} core practices</b> · <b>{pCount} regional customs</b> · <b>{bCount} corrections</b>
              </p>
            </div>

            {/* Panchang Information Box */}
            <div className="pan select-none">
              <div className="pan-h">
                <span className="pan-hl">📅 PANCHANG METRICS</span>
                <span className="pan-hr">Delhi-NCR · Drik Panchang</span>
              </div>
              <div className="pan-g">
                <div className="pc">
                  <div className="pc-k">OBSERVANCE</div>
                  <div className="pc-v">{resolvedGuide.panchangObservance || "Festive Period"}</div>
                  <div className="pc-s">{resolvedGuide.panchangObservanceSub || "Shukla Paksha"}</div>
                </div>
                <div className="pc">
                  <div className="pc-k">MUHURTA TIME</div>
                  <div className="pc-v">{resolvedGuide.panchangMuhurta || "6:19–10:12 AM"}</div>
                  <div className="pc-s">{resolvedGuide.panchangMuhurtaSub || "Abhijit Muhurta"}</div>
                </div>
                <div className="pc">
                  <div className="pc-k">TITHI METRIC</div>
                  <div className="pc-v">{resolvedGuide.panchangTithi || "Saptami / Ashtami"}</div>
                  <div className="pc-s">{resolvedGuide.panchangTithiSub || "Auspicious merging"}</div>
                </div>
                <div className="pc">
                  <div className="pc-k">VIJAY METRIC</div>
                  <div className="pc-v">{resolvedGuide.panchangVijay || "Dussehra Day"}</div>
                  <div className="pc-s">{resolvedGuide.panchangVijaySub || "The tenth day"}</div>
                </div>
              </div>
              {resolvedGuide.panchangNote ? (
                <p className="pan-n font-sans">
                  {resolvedGuide.panchangNote}
                </p>
              ) : (
                <p className="pan-n font-sans">
                  <b>Two things to check against your own local panchang:</b> Observance timings covers civil days which may differ locally based on sunset, and panchangs differ slightly on local tithi endings. Follow your local family or community panchang.
                </p>
              )}
            </div>

            <p className="open font-serif">
              Worship of the Divine.
            </p>
            <p className="p font-sans">
              This ritual guide outlines the scriptural, step-by-step layout to conduct this worship. Our editorial method isolates the core Dharma (core practices) from historical Pratha (customs), resolving common misconceptions (Bhranti).
            </p>

            {/* Section: Story */}
            <div className="sh" id="story" style={{ alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <span className="sh-p">+</span>
                <span className="sh-t">{resolvedGuide.kathaTitle || "Scriptural Legend"}</span>
              </div>
              {kathaBody && (
                <ListenButton
                  text={kathaBody}
                  label="Listen to katha"
                  audioUrl={resolvedGuide.kathaAudioUrl}
                  className="mn-play off cursor-pointer hover:border-amber/50"
                />
              )}
            </div>
            {(() => {
              const kathaParagraphs = kathaBody ? kathaBody.split("\n\n").filter(Boolean) : [];
              return (
                <>
                  <p className="p font-sans">
                    {kathaParagraphs[0] || "Scriptural legend narrating the significance of this day."}
                  </p>
                  <div className="tagrow select-none">
                    <span className="pill d">DHARMA · {starsCount}/5</span>
                    <span className="badge puranic">PURANIC</span>
                    <span className="pill src">{primarySource.name}</span>
                  </div>
                  {kathaParagraphs.slice(1).map((para, pIdx) => (
                    <p key={pIdx} className="p font-sans">
                      {para}
                    </p>
                  ))}
                </>
              );
            })()}

            {/* Section: Sankalpa */}
            <div className="sh" id="sankalp">
              <span className="sh-p">+</span>
              <span className="sh-t">Sankalpa: stating your intent</span>
            </div>
            <p className="p font-sans">
              Sankalpa is the vow that initiates the ritual. Sit facing East, hold clean water and raw rice in your right hand, and recite the core Sanskrit claim or the English reflection below:
            </p>

            <div className="sank">
              <div className="sank-h font-sans">SANKALPA VOW</div>
              <div className="sank-b">
                <div className="sank-dev font-serif text-center">
                  {sankalpaBody}
                </div>
                <div className="sank-r font-sans text-center text-sub-text">
                  {sankalpaQuote}
                </div>
                <div className="sank-g select-none">
                  <div className="sg">
                    <div className="sg-k">PRIMARY DEITY</div>
                    <div className="sg-v font-bold">{resolvedGuide.sankalpaWho || "Maa Durga"}</div>
                  </div>
                  <div className="sg">
                    <div className="sg-k">DESIRED OUTCOME</div>
                    <div className="sg-v font-bold">{resolvedGuide.sankalpaForWhat || "Shanti & Arogya"}</div>
                  </div>
                  <div className="sg">
                    <div className="sg-k">FAST METHOD</div>
                    <div className="sg-v font-bold">{resolvedGuide.fastOptions?.[0]?.name || "Custom/Phalahar"}</div>
                  </div>
                </div>
              </div>
              <div className="sank-note font-sans">
                <b>DHARMA FOCUS:</b> State your intent from a place of pure devotion. Scriptures explicitly clarify that spelling mistakes or language choice does not invalidate your vow. Sincerity of heart is the primary metric.
              </div>
            </div>

            {/* Section: Vidhi Steps */}
            <div className="sh" id="vidhi">
              <span className="sh-p">+</span>
              <span className="sh-t">Vidhi: step-by-step puja steps</span>
            </div>
            <div className="muh font-sans select-none">
              <b>PRO TIP:</b> Perform the setup during the designated morning Abhijit Muhurta if possible, avoiding Rahukalam.
            </div>

            <div className="steps-container mt-4">
              {resolvedGuide.steps?.map((step: any, idx: number) => {
                const isLast = idx === (resolvedGuide.steps?.length ?? 0) - 1;
                return (
                  <div key={idx} className="step">
                    <div className="st-c select-none">
                      <div className={`st-n ${isLast ? "end" : ""}`}>{step.order}</div>
                      {!isLast && <div className="st-l" />}
                    </div>
                    <div className="st-b font-sans">
                      <h3 className="font-bold text-dark text-base mb-1">{step.title}</h3>
                      <p className="text-body-text">{step.description}</p>
                      {step.note && (
                        <div className="mt-2 text-xs bg-amber/5 border border-amber/20 text-[#A07800] p-2.5 rounded-lg">
                          💡 <b>Custom:</b> {step.note}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Mantras Section */}
            {resolvedGuide.mantras && resolvedGuide.mantras.length > 0 && (
              <div className="mantra">
                <div className="mn-top select-none">
                  <span className="mn-l">puja mantras to chant</span>
                  <ListenButton
                    text={mantrasTextToRead}
                    label="Listen pronunciation"
                    audioUrl={resolvedGuide.mantras?.[0]?.audioUrl}
                    className="mn-play off cursor-pointer hover:border-amber/50"
                  />
                </div>
                {resolvedGuide.mantras.map((mantra: any, idx: number) => (
                  <div key={idx} className="mb-4 last:mb-0">
                    <div className="mn-d font-serif text-center font-bold">{mantra.devanagari}</div>
                    <div className="mn-r text-center font-sans italic">{mantra.transliteration}</div>
                    <div className="text-center font-sans text-xs text-sub-text mt-1">{mantra.meaning}</div>
                  </div>
                ))}

                {/* Custom Japa counter tool */}
                <div className="japa select-none">
                  <span className="jp-l">JAPA COUNTER</span>
                  <div className="jp-ctr">
                    <button onClick={handleDecrement} className="jp-b hover:bg-white/10">-</button>
                    <span className="jp-n">{japaCount}</span>
                    <button onClick={handleIncrement} className="jp-b hover:bg-white/10">+</button>
                  </div>
                  <div className="jp-presets">
                    <button onClick={() => handlePreset(11)} className={`jp-p ${japaPreset === 11 ? "on" : ""}`}>11</button>
                    <button onClick={() => handlePreset(21)} className={`jp-p ${japaPreset === 21 ? "on" : ""}`}>21</button>
                    <button onClick={() => handlePreset(108)} className={`jp-p ${japaPreset === 108 ? "on" : ""}`}>108</button>
                    <button onClick={() => { setJapaCount(0); setJapaPreset(null); triggerToast("Counter reset!"); }} className="jp-p">Reset</button>
                  </div>
                </div>
              </div>
            )}

            {/* Nine Days Table (Specifically if present in database) */}
            {resolvedNineFormsTable && resolvedNineFormsTable.length > 0 && (
              <div className="mt-8">
                <div className="sh">
                  <span className="sh-p">+</span>
                  <span className="sh-t">{resolvedGuide.nineFormsBannerCaption || "Observing the Nine Days of Navratri"}</span>
                </div>
                <div className="days mt-4 select-none">
                  <div className="dh font-sans">
                    <span>DAY</span>
                    <span>DATE / TITHI</span>
                    <span>FORM OF MAA DURGA</span>
                    <span>COLOUR</span>
                    <span>OFFERING</span>
                  </div>
                  {resolvedNineFormsTable.map((d: any, idx: number) => (
                    <div key={idx} className="dr font-sans">
                      <div className="d-n">{d.dayNumber || d.day || (idx + 1)}</div>
                      <div>
                        <div className="font-bold">{d.date}</div>
                        <div className="d-dt">{d.tithi || ""}</div>
                      </div>
                      <div>
                        <span className="d-dv">
                          {d.formNameSanskrit ? `${d.formNameSanskrit} (${d.formNameEnglish || ""})` : (d.deity || d.formNameEnglish || "")}
                        </span>
                      </div>
                      <div className="d-col">
                        <span className="d-sw" style={{ backgroundColor: d.colourSwatch || d.colHex }} />
                        {d.colourName || d.col}
                      </div>
                      <div className="d-of">{d.offering || d.of}</div>
                    </div>
                  ))}
                </div>
                {resolvedGuide.nineFormsColourNote && (
                  <p className="font-sans text-xs text-sub-text mt-3 italic leading-relaxed">
                    * <b>Note on Colors:</b> {resolvedGuide.nineFormsColourNote}
                  </p>
                )}
                {resolvedGuide.nineFormsOfferingsNote && (
                  <p className="font-sans text-xs text-sub-text mt-1.5 italic leading-relaxed">
                    * <b>Note on Offerings:</b> {resolvedGuide.nineFormsOfferingsNote}
                  </p>
                )}
              </div>
            )}

            {/* Section: Samagri list */}
            <div className="sh" id="samagri">
              <span className="sh-p">+</span>
              <span className="sh-t">Samagri list: items you need</span>
            </div>
            <p className="p font-sans">
              Verify your setup. Below is the scripturally mapped samagri with verified functions:
            </p>

            <div className="sam mt-4 select-none">
              {resolvedGuide.samagriItems?.map((item: any, idx: number) => (
                <div key={idx} className="sam-r font-sans">
                  <span className="sam-i">{item.name}</span>
                  <span className="sam-n">{item.function}</span>
                </div>
              ))}
            </div>

            {/* Section: Fasting rules */}
            <div className="sh" id="fast">
              <span className="sh-p">+</span>
              <span className="sh-t">Fasting rules: how to keep the vrat</span>
            </div>
            <p className="p font-sans">
              Choose an options that suits your health and path:
            </p>

            <div className="fast select-none">
              {resolvedFastOptions.map((opt: any, idx: number) => (
                <div key={idx} className="fb font-sans">
                  <h4 className="fb-t">{opt.name}</h4>
                  <p className="fb-s">{opt.desc}</p>
                </div>
              ))}
            </div>

            {resolvedGuide.fastNote && (
              <div className="fnote font-sans mt-4">
                💡 <b>Dharma Note:</b> {resolvedGuide.fastNote}
              </div>
            )}

            {/* Section: Myths & corrections (Bhranti) */}
            {myths.length > 0 && (
              <div className="mt-8">
                <div className="sh" id="myths">
                  <span className="sh-p">✕</span>
                  <span className="sh-t">Myths and corrections (Bhranti)</span>
                </div>
                <div className="myths-container mt-4 select-none">
                  {myths.map((myth: any, idx: number) => (
                    <div key={idx} className="myth font-sans">
                      <div className="my-q">
                        <span className="my-qt">“{myth.claim}”</span>
                        <span className="my-bd">BHRANTI</span>
                      </div>
                      <div className="my-a text-body-text">
                        <b>Correction:</b> {myth.correction}
                        {myth.sourceOfTruth && (
                          <div className="mt-2 text-xs text-sub-text font-bold uppercase">
                            SOURCE: {myth.sourceOfTruth}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Aarti segment */}
            {aartiBody && (
              <div className="mt-8">
                <div className="sh">
                  <span className="sh-p">🪔</span>
                  <span className="sh-t">Puja Aarti</span>
                </div>
                <div className="bg-white/50 border border-border p-6 rounded-2xl font-serif text-center text-lg leading-loose mt-4 shadow-sm whitespace-pre-line">
                  {aartiBody}
                </div>
              </div>
            )}

            {/* Commerce and newsletter nudges */}
            <div className="closing font-sans">
              <p>
                May this worship bring peace, devotion, and alignment to your path.
              </p>
              <p>
                — The Tapa Company Editorial Team
              </p>
            </div>

            {/* RELATED GUIDES */}
            {resolvedGuide.resolvedRelatedGuides && resolvedGuide.resolvedRelatedGuides.length > 0 && (
              <>
                <div className="sh mt-8">
                  <span className="sh-p">🔗</span>
                  <span className="sh-t">Related Guides</span>
                </div>
                <div className="relgrid mt-4 select-none">
                  {resolvedGuide.resolvedRelatedGuides.map((rel: any, idx: number) => (
                    <div key={idx} className="rel font-sans">
                      <div className="rel-h">{rel.category?.toUpperCase() || "RELATED PUJAN"}</div>
                      <div 
                        onClick={() => router.push(`/ritual-guides/${rel.slug}`)} 
                        className="rel-i cursor-pointer hover:opacity-85"
                      >
                        <span>
                          <span className="rel-n">{rel.title?.split(":")[0]}</span>
                          <span className="rel-s">Complete Vidhi Guide</span>
                        </span>
                        <span className="rel-a">→</span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

          </div>

          {/* Right Column (Sidebar) */}
          <div className="side">

            {/* Checklist sidebar card */}
            <div className="sb select-none">
              <div className="sb-h font-sans">
                <span>Puja Checklist</span>
                <span className="sb-c font-bold text-pink">{checkedCount}/{resolvedGuide.steps?.length || 0} done</span>
              </div>
              {resolvedGuide.steps?.map((step: any, idx: number) => (
                <div key={idx} className="sb-i font-sans">
                  <input 
                    type="checkbox" 
                    checked={checklist[idx] || false} 
                    onChange={() => handleCheck(idx)} 
                    className="cb cursor-pointer" 
                  />
                  <span>{step.title}</span>
                </div>
              ))}
              <div className="sb-act">
                <button onClick={() => triggerToast("Registering for WhatsApp reminders...")} className="sb-wa cursor-pointer hover:opacity-95">
                  Get WhatsApp updates
                </button>
                <button onClick={() => triggerToast("Downloading PDF ritual guide...")} className="sb-dl cursor-pointer hover:bg-black/5">
                  Download PDF
                </button>
              </div>
            </div>

            {/* Banner cards */}
            <button 
              onClick={() => triggerToast("Opening Samagri Kit checkout...")} 
              className="sbcta pink hover:opacity-95 transition-opacity cursor-pointer select-none"
            >
              <span className="sb-ci">🧺</span>
              <span className="sb-ct font-sans">Pre-book Samagri Kit</span>
              <span className="sb-cs font-sans">Get all scripturally mapped items organically sourced</span>
            </button>

            <button 
              onClick={() => triggerToast("Opening WhatsApp registration...")} 
              className="sbcta wa hover:opacity-95 transition-opacity cursor-pointer select-none"
            >
              <span className="sb-ci">💬</span>
              <span className="sb-ct font-sans">Chant reminders on WA</span>
              <span className="sb-cs font-sans">Get daily shlokas and timings during Navratri</span>
            </button>

            {/* Reference info box */}
            <div className="sbn select-none">
              <div className="sbn-h font-sans">SCRIPTURAL BACKING</div>
              <div className="sbn-t font-sans">
                This guide complies with teachings in the <b>{primarySource.name}</b>. All steps and claims are vetted by certified acharyas.
              </div>
              <span onClick={() => triggerToast("Opening credential validation page...")} className="sbn-c font-sans font-bold cursor-pointer">
                View Credentials ›
              </span>
            </div>

            {/* Companion kit teaser */}
            {resolvedGuide.showKitCard !== false && resolvedGuide.kitName && (
              <div className="sbcomp select-none">
                <div className="sbcomp-h">
                  <div className="sbcomp-i">📦</div>
                  <div className="sbcomp-l font-sans">COMPANION RITUAL KIT</div>
                  <div className="sbcomp-d font-sans">
                    {resolvedGuide.kitPrice ? `₹${resolvedGuide.kitPrice}` : "LAUNCHING"}
                  </div>
                </div>
                <div className="sbcomp-t font-sans">
                  {resolvedGuide.kitDescription || `The ${resolvedGuide.kitName} contains all custom items mapped for this vidhi.`}
                </div>
                <button 
                  onClick={handleBuyKit} 
                  className="sbcomp-b font-sans cursor-pointer hover:bg-amber/10 transition-colors"
                >
                  {linkedProduct ? "🛒 Get Samagri Kit" : "Notify when launches"}
                </button>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Sticky Bottom Actions Bar for Desktop */}
      <div className={`dsticky select-none ${showStickyBottom ? "on" : ""}`}>
        <div className="ds-in font-sans">
          <div>
            <div className="ds-t font-bold">{resolvedGuide.title}</div>
            <div className="ds-s">{currentCategory} · step-by-step guidance</div>
          </div>
          <div className="ds-b">
            <button onClick={() => triggerToast("Downloading PDF ritual card...")} className="ds-btn card hover:bg-[#FCFAF6] cursor-pointer">
              Download Card
            </button>
            <button onClick={() => triggerToast("Opening WhatsApp notifications page...")} className="ds-btn wa hover:opacity-95 cursor-pointer">
              Get WA Reminders
            </button>
            <button onClick={handleBuyKit} className="ds-btn kit hover:opacity-95 cursor-pointer">
              Get Samagri Kit
            </button>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Bar for Mobile Layout */}
      <div className="sticky font-sans select-none">
        <button onClick={() => triggerToast("Registering for WhatsApp notifications...")} className="a cursor-pointer hover:opacity-95">
          <span>Get WA Reminders</span>
          <small>Timings & chants</small>
        </button>
        <button onClick={handleBuyKit} className="b cursor-pointer hover:opacity-95">
          <span>Get Samagri Kit</span>
          <small>{linkedProduct ? `Buy ${linkedProduct.name}` : "Pre-book Sawan kit"}</small>
        </button>
      </div>

      <Footer onTriggerToast={triggerToast} />

      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[100] bg-dark text-white border border-white/10 px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-bounce font-sans text-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-pink animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
