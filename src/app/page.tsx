"use client";

import React, { useState } from "react";
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

export default function HomePage() {
  const router = useRouter();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("Ritual Guides");

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

  return (
    <div className="min-h-screen bg-bg text-body-text font-sans antialiased">
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
              {FEATURED_RITUAL.eyebrow}
            </div>
            <div className="hero-tag font-sans">★ DHARMA</div>
            <h1 className="hero-title font-serif font-bold text-hero-text leading-tight">
              Sawan
              <br />
              Somwar Vrat
            </h1>
            <p className="hero-sub font-sans text-hero-sub">
              {FEATURED_RITUAL.subtitle}
            </p>

            {/* 0.5 — Trust Badge Strip */}
            <TrustBadgeStrip />

            {/* CTAs */}
            <div className="hero-btns mt-4">
              <button
                onClick={() => triggerToast("Starting Sawan Somwar Vrat flow...")}
                className="hbtn-pink font-sans font-bold cursor-pointer hover:opacity-95"
              >
                ▶ Start today&apos;s vrat
              </button>
              <button
                onClick={() => triggerToast("Opening complete vidhi guide...")}
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
            <div className="cred-val">Shiva Purana</div>
            <div className="cred-sub">Vidyeshvara Samhita &amp; related sections</div>
          </div>
          <div className="cred-cell font-sans">
            <div className="cred-key">CONFIDENCE SCORE</div>
            <div className="cred-val">
              <span className="cred-stars">★★★★</span>
              <span className="text-[#EDE6D4]">★</span> 4/5
            </div>
            <div className="cred-sub">Clearly stated in a major Purana</div>
          </div>
          <div className="cred-cell font-sans">
            <div className="cred-key">REGIONAL VARIANCE</div>
            <div className="cred-val text-[13px] font-semibold">Observances differ</div>
            <div className="cred-sub">
              North India, Maharashtra, Gujarat,
              <br />
              Karnataka, Tamil Nadu
            </div>
          </div>
          <div className="cred-cell font-sans">
            <div className="cred-key">DHARMA NOTE</div>
            <div className="flex flex-col gap-1 mt-0.5">
              <div className="text-[11px] flex items-center">
                <span className="dhot bg-[#1A5C28]" />
                Abhishek, Sankalp = Dharma
              </div>
              <div className="text-[11px] flex items-center">
                <span className="dhot bg-[#E8A020]" />
                Kanwar Yatra = Pratha
              </div>
              <div className="text-[11px] flex items-center">
                <span className="dhot bg-[#D4175A]" />
                &quot;Miss one = vrat fails&quot; = Bhranti
              </div>
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
            {TODAY_RITUAL_JOURNEY.steps.map((step, idx) => {
              const isDone = step.status === "completed";
              const isActive = step.status === "active";
              const isLast = idx === TODAY_RITUAL_JOURNEY.steps.length - 1;

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
            <div className="kits-launch-inner flex flex-col md:flex-row items-center justify-between gap-6 md:gap-10">
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
              <div className="kits-launch-img font-sans shrink-0">
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
            {RITUAL_GUIDES_ARTICLES.articles.map((article, idx) => (
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

          <div className="cat-grid mt-4 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
