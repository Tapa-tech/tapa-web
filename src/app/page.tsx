"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import AnnouncementBar from "@/components/AnnouncementBar";
import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";
import SectionHeading from "@/components/SectionHeading";
import TrustBadgeStrip from "@/components/TrustBadgeStrip";
import PanchangCard from "@/components/PanchangCard";
import RitualCard from "@/components/RitualCard";
import CategoryGridCard from "@/components/CategoryGridCard";
import purohitDp from "@/assets/dp2.png";

import {
  FEATURED_RITUAL,
  RITUAL_KITS_SHELF,
  TODAY_RITUAL_JOURNEY,
  RITUAL_GUIDES_ARTICLES,
  PUROHIT_BOOKING,
  WHATSAPP_SUBSCRIPTION,
  CATEGORY_GRID,
} from "@/lib/mock-data";

interface DpbEntry {
  id?: string;
  tag: string;
  confidenceScore: number;
  regionalVariance?: string;
  elementName: string;
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
  title: string;
}

interface Guide {
  id?: string;
  title: string;
  slug: string;
  status: string;
  category: string;
  introText?: string;
  steps?: GuideStep[];
  dpbEntries?: DpbEntry[];
  sources?: GuideSource[];
}

interface TiptapContent {
  text?: string;
}

interface TiptapBlock {
  content?: TiptapContent[];
}

// Helper to extract text from Tiptap JSON blocks
function extractTextFromTiptap(jsonStr?: string): string {
  if (!jsonStr) return "";
  try {
    const obj = JSON.parse(jsonStr);
    if (obj.type === "doc" && Array.isArray(obj.content)) {
      return obj.content
        .map((block: TiptapBlock) => {
          if (block.content && Array.isArray(block.content)) {
            return block.content.map((inline: TiptapContent) => inline.text || "").join("");
          }
          return "";
        })
        .filter((text: string) => text.trim().length > 0)
        .join("\n");
    }
  } catch {
    return jsonStr;
  }
  return jsonStr;
}

// Helper to determine the primary tag from guide dpbEntries
const getGuideTag = (guide: Guide): "DHARMA" | "PRATHA" | "BHRANTI" => {
  if (!guide || !guide.dpbEntries || guide.dpbEntries.length === 0) return "DHARMA";
  const tags = guide.dpbEntries.map((e) => e.tag);
  if (tags.includes("BHRANTI")) return "BHRANTI";
  if (tags.includes("PRATHA")) return "PRATHA";
  return "DHARMA";
};

export default function HomePage() {
  const router = useRouter();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("Ritual Guides");

  // Dynamic CMS content state
  const [featuredGuide, setFeaturedGuide] = useState<Guide | null>(null);
  const [publishedGuides, setPublishedGuides] = useState<Guide[]>([]);

  useEffect(() => {
    async function loadHomeContent() {
      try {
        const res = await fetch("/api/public/home");
        if (res.ok) {
          const data = await res.json();
          if (data.featuredGuide) setFeaturedGuide(data.featuredGuide);
          if (data.publishedGuides) setPublishedGuides(data.publishedGuides);
        }
      } catch (err) {
        console.error("Failed to load public homepage data:", err);
      }
    }
    loadHomeContent();
  }, []);

  const triggerToast = (message: string = "Feature launching soon!") => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Emojis for stepper journey
  const stepEmojis: { [key: string]: string } = {
    "Preparation": "🚿",
    "Sankalp": "🙏",
    "Abhishek": "🫙",
    "Japa & Dhyan": "📿",
    "Vrat Katha": "📜",
    "Evening Puja": "🪔",
  };

  // Helper to parse subtitle (first clean paragraph) from introText
  const getGuideSubtitle = (guide: Guide | null) => {
    if (!guide) return FEATURED_RITUAL.subtitle;
    const text = extractTextFromTiptap(guide.introText);
    if (!text) return FEATURED_RITUAL.subtitle;
    
    const paragraphs = text.split("\n").map(p => p.trim()).filter(p => p.length > 0);
    const cleanParagraph = paragraphs.find(p => {
      const pUpper = p.toUpperCase();
      return !pUpper.includes("PART A") && !pUpper.includes("PART B") && !pUpper.includes("PART C") && !pUpper.includes("IMAGE BRIEF") && !pUpper.includes("BACKEND");
    });
    
    return cleanParagraph || paragraphs[0] || FEATURED_RITUAL.subtitle;
  };

  // Stepper steps map
  const dynamicSteps = (featuredGuide && featuredGuide.steps && featuredGuide.steps.length > 0)
    ? featuredGuide.steps.map((step: GuideStep, idx: number) => ({
        name: step.title,
        status: idx === 0 ? ("completed" as const) : idx === 1 ? ("active" as const) : ("pending" as const)
      }))
    : TODAY_RITUAL_JOURNEY.steps;

  // Credibility panel helpers
  const starsCount = featuredGuide ? (() => {
    if (!featuredGuide.dpbEntries || featuredGuide.dpbEntries.length === 0) return 4;
    const scores = featuredGuide.dpbEntries.map((e: DpbEntry) => e.confidenceScore);
    const avg = Math.round(scores.reduce((a: number, b: number) => a + b, 0) / scores.length);
    return Math.max(1, Math.min(5, avg));
  })() : 4;

  const getRegionalVariance = (guide: Guide | null) => {
    if (!guide || !guide.dpbEntries) return "North India, Maharashtra, Gujarat, Karnataka, Tamil Nadu";
    const variances = guide.dpbEntries
      .map((e: DpbEntry) => e.regionalVariance)
      .filter((v: string | undefined): v is string => typeof v === "string" && v.trim().length > 0);
    if (variances.length === 0) return "North India, Maharashtra, Gujarat, Karnataka, Tamil Nadu";
    return variances.slice(0, 2).join(", ");
  };

  const getDpbNotes = (guide: Guide | null) => {
    if (!guide || !guide.dpbEntries || guide.dpbEntries.length === 0) {
      return [
        { label: "Abhishek, Sankalp = Dharma", color: "bg-[#1A5C28]" },
        { label: "Kanwar Yatra = Pratha", color: "bg-[#E8A020]" },
        { label: "“Miss one = vrat fails” = Bhranti", color: "bg-[#D4175A]" }
      ];
    }
    const notes: { label: string; color: string }[] = [];
    const colorMap: Record<string, string> = {
      DHARMA: "bg-[#1A5C28]",
      PRATHA: "bg-[#E8A020]",
      BHRANTI: "bg-[#D4175A]"
    };
    
    ["DHARMA", "PRATHA", "BHRANTI"].forEach(t => {
      const entry = guide.dpbEntries?.find((e: DpbEntry) => e.tag === t);
      if (entry) {
        const label = entry.elementName.replace(/&quot;/g, '"').replace(/"/g, '');
        const shortLabel = label.length > 22 ? label.substring(0, 22) + "..." : label;
        notes.push({
          label: `${shortLabel} = ${t.charAt(0) + t.slice(1).toLowerCase()}`,
          color: colorMap[t]
        });
      }
    });
    
    if (notes.length === 0) {
      return [
        { label: "Abhishek, Sankalp = Dharma", color: "bg-[#1A5C28]" },
        { label: "Kanwar Yatra = Pratha", color: "bg-[#E8A020]" },
        { label: "“Miss one = vrat fails” = Bhranti", color: "bg-[#D4175A]" }
      ];
    }
    return notes;
  };

  const credibilityNotes = getDpbNotes(featuredGuide);

  // Dynamic articles shelf list
  const dynamicArticles = (publishedGuides && publishedGuides.length > 0)
    ? publishedGuides.map((guide: Guide) => {
        const desc = extractTextFromTiptap(guide.introText);
        const cleanDesc = desc ? (desc.length > 120 ? desc.substring(0, 120) + "..." : desc) : "A detailed ritual guide.";
        return {
          title: guide.title,
          tag: getGuideTag(guide),
          dateMeta: guide.category || "Festive Pujans",
          description: cleanDesc,
          slug: guide.slug,
        };
      })
    : RITUAL_GUIDES_ARTICLES.articles;

  return (
    <div className="min-h-screen bg-bg text-body-text font-sans antialiased animate-fadeIn">
      {/* 0.1 — Announcement Bar */}
      <AnnouncementBar />

      {/* 0.2 & 0.3 — Top Nav (Integrated Categories) */}
      <TopNav
        activeTab={activeTab}
        onTabChange={(tabId) => {
          if (tabId === "Ritual Kits") {
            router.push("/ritual-kits");
          } else {
            setActiveTab(tabId);
          }
        }}
        onTriggerToast={triggerToast}
      />

      {/* 0.4 — Hero Section */}
      <section className="hero">
        <div
          className="hero-img"
          role="img"
          aria-label="Sawan Somwar Vrat — Jalabhishek at a Shiva temple, monsoon morning"
        >
          <div className="hero-img-inner select-none font-sans">
            <div className="icon">🏔️</div>
            <div className="lbl">
              HERO IMAGE
              <br />
              Full-bleed photography
              <br />
              Jalabhishek · monsoon temple morning
            </div>
          </div>
        </div>
        <div className="hero-overlay"></div>

        {/* Share Button */}
        <button
          onClick={() => triggerToast("Copied sharing link to clipboard!")}
          className="hero-share font-sans select-none cursor-pointer"
        >
          <span>↗</span>
          <span>Share</span>
        </button>

        {/* Hero Content Area */}
        <div className="hero-wrap">
          <div className="hero-inner select-none">
            <div className="hero-eyebrow font-sans uppercase">
              {featuredGuide ? `TODAY'S RITUAL · ${featuredGuide.category}` : FEATURED_RITUAL.eyebrow}
            </div>
            <div className="hero-tag font-sans">
              ★ {featuredGuide ? getGuideTag(featuredGuide) : "DHARMA"}
            </div>
            <h1 className="hero-title font-serif font-bold text-hero-text leading-tight">
              {featuredGuide ? featuredGuide.title : "Sawan Somwar Vrat"}
            </h1>
            <p className="hero-sub font-sans text-hero-sub">
              {getGuideSubtitle(featuredGuide)}
            </p>

            {/* 0.5 — Trust Badge Strip */}
            <TrustBadgeStrip />

            {/* CTAs */}
            <div className="hero-btns mt-4">
              <button
                onClick={() => triggerToast(`Starting ${featuredGuide ? featuredGuide.title : "vrat"} flow...`)}
                className="hbtn-pink font-sans font-bold cursor-pointer hover:opacity-95"
              >
                ▶ Start today&apos;s vrat
              </button>
              <button
                onClick={() => triggerToast(`Opening complete ${featuredGuide ? featuredGuide.title : "vidhi"} guide...`)}
                className="hbtn-ghost font-sans cursor-pointer hover:bg-white/20"
              >
                📖 Read complete vidhi
              </button>
              <button
                onClick={() => triggerToast("Playing audio player...")}
                className="hbtn-ghost font-sans cursor-pointer hover:bg-white/20"
              >
                🎧 Listen instead
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Credibility Panel (placed right below Hero) */}
      <div className="cred-panel select-none">
        <div className="wrap grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-0">
          <div className="cred-cell font-sans">
            <div className="cred-key">PRIMARY SOURCE</div>
            <div className="cred-val">
              {featuredGuide?.sources?.[0]?.source?.name || "Shiva Purana"}
            </div>
            <div className="cred-sub">
              {featuredGuide?.sources?.[0]?.source?.reference || "Vidyeshvara Samhita & related sections"}
            </div>
          </div>
          <div className="cred-cell font-sans">
            <div className="cred-key">CONFIDENCE SCORE</div>
            <div className="cred-val">
              <span className="cred-stars">{"★".repeat(starsCount)}</span>
              <span className="text-[#EDE6D4]">{"★".repeat(5 - starsCount)}</span> {starsCount}/5
            </div>
            <div className="cred-sub">
              {featuredGuide ? "Averaged across approved claims" : "Clearly stated in a major Purana"}
            </div>
          </div>
          <div className="cred-cell font-sans">
            <div className="cred-key">REGIONAL VARIANCE</div>
            <div className="cred-val text-[13px] font-semibold">Observances differ</div>
            <div className="cred-sub">
              {getRegionalVariance(featuredGuide)}
            </div>
          </div>
          <div className="cred-cell font-sans">
            <div className="cred-key">DHARMA NOTE</div>
            <div className="flex flex-col gap-1 mt-0.5">
              {credibilityNotes.map((note, idx) => (
                <div key={idx} className="text-[11px] flex items-center">
                  <span className={`dhot ${note.color}`} />
                  {note.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 0.6 — Panchang Today Bar */}
      <PanchangCard />

      {/* Main Wrap (Journey Stepper, Kits, Articles, Booking, WA Nudge, Explore) */}
      <main className="pb-16 mt-6">

        {/* 0.8 — Today's Ritual Journey Stepper */}
        <div className="wrap">
          <SectionHeading
            rightElement={
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  triggerToast("Redirecting to all ritual steps...");
                }}
                className="sec-link font-sans font-semibold text-pink"
              >
                {TODAY_RITUAL_JOURNEY.linkText}
              </a>
            }
          >
            Today&apos;s ritual journey
          </SectionHeading>

          <div className="journey-row mt-4 overflow-x-auto scrollbar-none">
            {dynamicSteps.map((step, idx) => {
              const isDone = step.status === "completed";
              const isActive = step.status === "active";
              const isLast = idx === dynamicSteps.length - 1;

              return (
                <div key={idx} className="j-step select-none">
                  <div className="j-step-inner">
                    {/* Stepper Node Circle */}
                    <div
                      className={`j-circle font-sans ${isDone ? "done" : ""} ${isActive ? "active font-bold" : ""
                        }`}
                    >
                      {stepEmojis[step.name] || "🙏"}
                      {isDone && <span className="j-done-badge font-sans">✓</span>}
                    </div>

                    {/* Connector line (not for the last step) */}
                    {!isLast && (
                      <div className={`j-connector ${isDone ? "done" : ""}`} />
                    )}
                  </div>
                  {/* Step Label */}
                  <div className={`j-label font-sans ${isActive ? "active" : ""}`}>
                    {step.name}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 0.7 — Ritual Kits Shelf */}
        <div className="kits-band mt-12 select-none">
          <div className="wrap">
            <div className="kits-launch-inner">
              <div className="kits-launch-text">
                <div className="kits-launch-eyebrow font-sans font-bold">
                  + RITUAL KITS · LAUNCHING SEPTEMBER 24
                </div>
                <h2 className="kits-launch-title font-serif font-bold text-hero-text">
                  Complete samagri
                  <br />
                  for every puja.
                </h2>
                <p className="kits-launch-sub font-sans">
                  {RITUAL_KITS_SHELF.body}
                </p>
                <button
                  onClick={() => triggerToast("We will notify you when Ritual Kits launch on Sept 24th!")}
                  className="kits-launch-cta font-sans font-bold cursor-pointer hover:opacity-95 transition-opacity"
                >
                  {RITUAL_KITS_SHELF.ctaText} when kits launch
                </button>
              </div>

              {/* Kit Images Mock Cards */}
              <div className="kits-launch-img">
                <div className="kit-img-card font-bold">
                  KIT IMAGE
                  <br />
                  Sawan Somwar
                </div>
                <div className="kit-img-card font-bold">
                  KIT IMAGE
                  <br />
                  Hariyali Teej
                </div>
                <div className="kit-img-card font-bold">
                  KIT IMAGE
                  <br />
                  Rudrabhishek
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 0.9 — From Ritual Guides Grid */}
        <div className="wrap mt-8">
          <SectionHeading
            rightElement={
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  triggerToast("Redirecting to all guides...");
                }}
                className="sec-link font-sans font-semibold text-pink"
              >
                See all 48 guides →
              </a>
            }
          >
            From Ritual Guides
          </SectionHeading>

          <div className="articles-grid mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {dynamicArticles.map((article, idx) => (
              <RitualCard key={idx} article={article} index={idx} />
            ))}
          </div>
        </div>

        {/* 0.10 — Pujan with Purohit Strip */}
        <div className="wrap mt-10 select-none">
          <SectionHeading
            rightElement={
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  triggerToast("Redirecting to all Purohit bookings...");
                }}
                className="sec-link font-sans font-semibold text-pink"
              >
                View all 6 pujas →
              </a>
            }
          >
            Pujan with Purohit
          </SectionHeading>

          <div className="purohit-strip mt-4 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 justify-between w-full">
            {/* Circular Purohit Avatar image from assets */}
            <div className="purohit-icon overflow-hidden flex items-center justify-center rounded-xl bg-white/5 border border-white/10 select-none">
              <Image
                src={purohitDp}
                alt="Purohit Avatar"
                width={56}
                height={56}
                className="object-cover w-full h-full"
              />
            </div>

            <div className="purohit-text font-sans">
              <div className="purohit-title font-serif font-bold text-hero-text">
                {PUROHIT_BOOKING.title} for this puja?
              </div>
              <div className="purohit-sub">
                {PUROHIT_BOOKING.subtitle} · Rudrabhishek, Satyanarayan, Navratri Ghatsthapna and more
              </div>
            </div>
            <button
              onClick={() => triggerToast("Purohit booking flow opens in November!")}
              className="purohit-btn font-sans font-semibold cursor-pointer hover:opacity-95 transition-opacity"
            >
              Book a Purohit
            </button>
          </div>
        </div>

        {/* 0.11 — WhatsApp Subscription Nudge */}
        <div className="wrap mt-8 select-none">
          <div
            onClick={() => triggerToast("WhatsApp reminders sign up starting soon!")}
            className="wa-nudge hover:opacity-95 transition-all"
          >
            <span className="wa-nudge-icon">💬</span>
            <div className="font-sans">
              <div className="wa-nudge-t font-bold">{WHATSAPP_SUBSCRIPTION.title}</div>
              <div className="wa-nudge-s font-medium">
                {WHATSAPP_SUBSCRIPTION.subtitle} from The Tapa Circle — ₹499 / year
              </div>
            </div>
            <span className="wa-nudge-arrow font-sans">{WHATSAPP_SUBSCRIPTION.arrow}</span>
          </div>
        </div>

        {/* 0.12 — Explore by Category Grid */}
        <div className="wrap mt-10">
          <SectionHeading>Explore by category</SectionHeading>

          <div className="cat-grid mt-4">
            {CATEGORY_GRID.map((category, idx) => (
              <CategoryGridCard key={idx} category={category} index={idx} />
            ))}
          </div>
        </div>

      </main>

      {/* Reusable Footer Component */}
      <Footer onTriggerToast={triggerToast} />

      {/* Premium Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[100] bg-dark text-white border border-white/10 px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-bounce font-sans text-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-pink animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
