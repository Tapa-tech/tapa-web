"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";
import { useCartStore } from "@/lib/store/cartStore";
import { trackPageView, trackAddToCart } from "@/lib/analytics";
import "./prebook.css";

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
  thumbnailUrl?: string;
  heroStoryImage?: string;
}

interface PanchangData {
  date: string;
  hinduMonth?: string;
  paksha?: string;
  pakshaSub?: string;
  tithi?: string;
  tithiSub?: string;
  nakshatra?: string;
  sunrise?: string;
  rahuKaal?: string;
  city?: string;
}

interface VratData {
  name: string;
  description?: string | null;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  type: "PUJA_KIT" | "SAMAGRI_ITEM";
  description: string;
  images: string[];
  price: number;
  mrp?: number;
  stock: number;
  category: string;
  codAvailability: "AVAILABLE" | "NOT_AVAILABLE";
}

export default function HomePage() {
  const router = useRouter();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("");

  const [panchang, setPanchang] = useState<PanchangData | null>(null);
  const [todayVrat, setTodayVrat] = useState<VratData | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [dbGuides, setDbGuides] = useState<Guide[]>([]);
  const [activeBanner, setActiveBanner] = useState<any>(null);
  const [nextVrat, setNextVrat] = useState<any>(null);

  // Zustand Cart Store
  const addToCartStore = useCartStore((state) => state.addToCart);

  // Trigger Toast Notification
  const triggerToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  useEffect(() => {
    trackPageView("/");

    async function loadHomeData() {
      try {
        const res = await fetch("/api/public/home");
        if (res.ok) {
          const data = await res.json();
          if (data.panchang) setPanchang(data.panchang);
          if (data.todayVrat) setTodayVrat(data.todayVrat);
          if (data.publishedGuides) setDbGuides(data.publishedGuides);
          if (data.activeBanner) setActiveBanner(data.activeBanner);
          if (data.nextVrat) setNextVrat(data.nextVrat);
        }
      } catch (err) {
        console.error("Failed to load public home data:", err);
      }
    }

    async function loadProducts() {
      try {
        const res = await fetch("/api/public/products");
        if (res.ok) {
          const data = await res.json();
          const mapped = data.map((p: any) => ({
            ...p,
            price: Number(p.price),
            mrp: p.mrp ? Number(p.mrp) : undefined,
          }));
          setProducts(mapped);
        }
      } catch (err) {
        console.error("Failed to load products list:", err);
      }
    }

    loadHomeData();
    loadProducts();
  }, []);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    if (tabId === "Ritual Kits") {
      router.push("/ritual-kits");
    } else if (tabId === "Ritual Guides") {
      router.push("/ritual-guides");
    } else if (tabId === "Panchang") {
      router.push("/panchang");
    } else if (tabId === "Pujan with Purohit") {
      router.push("/ritual-guides?view=purohit");
    }
  };

  const handlePrebook = (kitName: string, price: number) => {
    // Try to find if we have a seeded/published product matching this slug
    let matchingProduct = null;
    const nameLower = kitName.toLowerCase();
    if (nameLower.includes("ganesh")) {
      matchingProduct = products.find(p => p.slug === "ganesh-sthapana-kit");
    } else if (nameLower.includes("teej")) {
      matchingProduct = products.find(p => p.slug === "hartalika-teej-kit");
    } else if (nameLower.includes("shiva")) {
      matchingProduct = products.find(p => p.slug === "shiva-puja-kit");
    } else {
      // Fallback: try search by name match
      matchingProduct = products.find(p => 
        p.name.toLowerCase().includes(nameLower) || 
        nameLower.includes(p.name.toLowerCase())
      );
    }

    if (matchingProduct) {
      addToCartStore(matchingProduct.id, 1, {
        name: matchingProduct.name,
        price: matchingProduct.price,
        image: matchingProduct.images?.[0] || undefined,
        category: matchingProduct.category,
        codAvailability: matchingProduct.codAvailability,
      });
      trackAddToCart(matchingProduct.id, matchingProduct.name, matchingProduct.price, 1, matchingProduct.category);
      triggerToast(`Added ${matchingProduct.name} to your cart!`);
    } else {
      triggerToast(`${kitName} pre-booking will open shortly!`);
    }
  };

  const handleNotifyMe = (kitName: string) => {
    triggerToast(`Alert set! We will notify you when ${kitName} bookings open.`);
  };

  // Navratri Ghatsthapana Product check
  const navratriProduct = products.find((p) => p.slug === "purna-ghatasthapana");
  const navratriPrice = navratriProduct ? `₹${navratriProduct.price}` : "₹1,890";
  const navratriPriceType = navratriProduct ? "incl. delivery" : "estimated";

  return (
    <div className="min-h-screen bg-[#F2EDE4] text-[#2C2010] font-sans antialiased">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-[9999] bg-[#FD066D] text-white px-5 py-3 rounded-xl shadow-2xl font-bold font-sans animate-fade-in">
          {toastMessage}
        </div>
      )}

      <TopNav
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onTriggerToast={triggerToast}
      />

      {/* Pre-booking Bar */}
      <div className="launch">
        <p>
          <span className="lb">PRE-BOOKING OPEN</span>
          Ritual Kits are open for pre-booking. <b>Order by 10 September</b> for delivery before Ganesh Chaturthi.
        </p>
      </div>

      {/* Hero Section */}
      <section className="hero-prebook">
        <div className="hero-img">
          <img 
            src={activeBanner?.imageUrl || "/images/prebook_hero.jpg"} 
            alt={activeBanner?.festivalTitle || "Complete Ganesh Chaturthi Puja Kit"} 
          />
        </div>
        <div className="hero-scrim"></div>
        <div className="hero-wrap">
          <div className="hero-grid">
            {/* Left Column: Hero Text Content */}
            <div>
              <div className="hero-cut">PRE-BOOKING OPEN</div>
              <p className="hero-ey">{activeBanner?.festivalTitle || "DELIVERED BEFORE GANESH CHATURTHI"}</p>
              <h1 className="hero-h1">
                {activeBanner?.mainHeading || "Complete Ganesh Chaturthi"}{" "}
                <em>{activeBanner?.highlightedText || "Puja Kit"}</em>
              </h1>
              <p className="hero-price">
                Pre-booking price · <b>₹{activeBanner ? Number(activeBanner.price).toLocaleString() : "1,499"}</b>{" "}
                {(activeBanner?.mrp || !activeBanner) && (
                  <span className="line-through text-[#7A6A55] ml-2">
                    ₹{activeBanner ? Number(activeBanner.mrp).toLocaleString() : "1,999"}
                  </span>
                )}
              </p>
              <p className="text-sm text-[#D8BFA0] -mt-4 mb-6 max-w-[500px] leading-relaxed">
                {activeBanner?.description || "Packaged and sealed at the source to ensure high-vibration purity. Sourced from organic, scripturally-aligned farms."}
              </p>
              <div className="hero-btns">
                <button
                  className="hb-pink cursor-pointer hover:opacity-95 transition-opacity"
                  onClick={() => {
                    const ctaLink = activeBanner?.primaryCtaLink || "/cart";
                    if (ctaLink === "/cart" || ctaLink === "cart") {
                      handlePrebook(
                        activeBanner?.mainHeading || "Ganesh Chaturthi Puja Kit", 
                        activeBanner ? Number(activeBanner.price) : 1499
                      );
                    } else {
                      router.push(ctaLink);
                    }
                  }}
                >
                  {activeBanner?.primaryCtaText || "Pre-book Kit now ›"}
                </button>
                {(activeBanner?.secondaryCtaText || !activeBanner) && (
                  <button
                    className="hb-ghost cursor-pointer hover:bg-white/10 transition-colors"
                    onClick={() => {
                      const ctaLink = activeBanner?.secondaryCtaLink || "/ritual-kits";
                      if (ctaLink.startsWith("http") || ctaLink.startsWith("/")) {
                        router.push(ctaLink);
                      } else {
                        triggerToast(ctaLink);
                      }
                    }}
                  >
                    {activeBanner?.secondaryCtaText || "View Kit Details"}
                  </button>
                )}
              </div>
            </div>

            {/* Right Column: Dynamic Today's Panchang Panel */}
            <div className="panchang-card">
              <div className="flex justify-between items-center mb-4 pb-3 border-b border-white/10 font-sans">
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-[#E3B567] font-bold">TODAY&apos;S PANCHANG</div>
                  <div className="text-xs text-[#C4A882] mt-0.5 flex items-center gap-1">
                    <span>📍</span> {panchang?.city || "Delhi-NCR"}
                  </div>
                </div>
                <div className="text-right font-sans">
                  <div className="text-sm font-bold text-[#FFFDF5]">
                    {panchang ? new Date(panchang.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                  <div className="text-[10px] text-[#C4A882]">{panchang?.hinduMonth || "Bhadrapada"} Month</div>
                </div>
              </div>

              <div className="space-y-3 text-sm font-sans">
                <div className="flex justify-between items-center py-1">
                  <span className="text-xs text-[#C4A882]">Tithi (Date)</span>
                  <span className="font-bold text-[#FFFDF5]">{panchang?.tithi || "Chaturthi"} <span className="text-[10px] font-normal text-[#8A7A6E]">({panchang?.tithiSub || "4th day"})</span></span>
                </div>
                <div className="flex justify-between items-center py-1 border-t border-white/5">
                  <span className="text-xs text-[#C4A882]">Paksha (Phase)</span>
                  <span className="font-bold text-[#FFFDF5]">{panchang?.paksha || "Shukla"} <span className="text-[10px] font-normal text-[#8A7A6E]">({panchang?.pakshaSub || "Waxing Moon"})</span></span>
                </div>
                <div className="flex justify-between items-center py-1 border-t border-white/5">
                  <span className="text-xs text-[#C4A882]">Nakshatra</span>
                  <span className="font-bold text-[#FFFDF5]">{panchang?.nakshatra || "Chitra"}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-t border-white/5">
                  <span className="text-xs text-[#C4A882]">Sunrise</span>
                  <span className="font-bold text-[#FFFDF5]">{panchang?.sunrise || "6:04 AM"}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-t border-white/5">
                  <span className="text-xs text-[#C4A882]">Rahu Kaal</span>
                  <span className="font-bold text-[#E8A020]">{panchang?.rahuKaal || "9:12 AM - 10:47 AM"}</span>
                </div>
              </div>

              {/* Next Major Date */}
              {nextVrat && (
                <div className="mt-5 p-3 rounded-xl bg-[#E8A020]/15 border border-[#E8A020]/20 flex flex-col gap-1 font-sans">
                  <div className="text-[9px] uppercase tracking-wider text-[#E8A020] font-bold">NEXT MAJOR FESTIVAL</div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs font-bold text-[#FFFDF5]">{nextVrat.name}</span>
                    <span className="text-[10px] text-[#C4A882] font-semibold">
                      {new Date(nextVrat.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                  {nextVrat.linkedGuideId && (
                    <Link
                      href={`/ritual-guides/${nextVrat.linkedGuideId}`}
                      className="text-[10px] text-[#E3B567] hover:underline font-bold mt-1 inline-flex items-center gap-1 self-start"
                    >
                      Read ritual guide ›
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Kit Shelf Section */}
      <section className="sec">
        <div className="wrap">
          <div className="sec-head">
            <div>
              <div className="sec-ey">PRE-BOOK A KIT</div>
              <div className="sec-t">Sourced from the origin, complete to the last matchstick</div>
              <p className="sec-s">
                Packaged and sealed at the source to ensure high-vibration purity. Sourced from organic, scripturally-aligned farms.
              </p>
            </div>
            <Link href="/ritual-kits" className="sec-all">
              Shop all kits ›
            </Link>
          </div>

          <div className="kshelf">
            {/* Ganesh Sthapana Kit */}
            <div className="kcard lead">
              <div className="k-top k-ganesh">
                <span className="k-badge pre">PRE-BOOK</span>
                <span className="k-cut">ORDER BY 10 SEP</span>
              </div>
              <div className="k-b">
                <div className="k-n">Ganesh Sthapana Kit</div>
                <div className="k-for">For 14 September · Madhyahna muhurat</div>
                <p className="k-inc">
                  Shadu mati idol, chowki cloth, kalash set, durva, modak mould, akshata, dhoop, 21-item samagri box, Gyan Patrika.
                </p>
                <div className="k-row">
                  <span className="k-p">₹1,650</span>
                  <span className="k-pn">incl. delivery</span>
                </div>
                <button
                  className="k-cta cursor-pointer hover:opacity-95 transition-opacity"
                  onClick={() => handlePrebook("Ganesh Sthapana Kit", 1650)}
                >
                  Pre-book now
                </button>
                <span
                  onClick={() => router.push("/ritual-guides")}
                  className="k-guide cursor-pointer hover:underline"
                >
                  Read the guide first ›
                </span>
              </div>
            </div>

            {/* Hartalika Teej Kit */}
            <div className="kcard">
              <div className="k-top k-teej">
                <span className="k-badge pre">PRE-BOOK</span>
                <span className="k-cut">ORDER BY 9 SEP</span>
              </div>
              <div className="k-b">
                <div className="k-n">Hartalika Teej Kit</div>
                <div className="k-for">For 13 September</div>
                <p className="k-inc">
                  Sand-Shivalinga mould, bilva patra, green bangles, solah shringar set, phalahar essentials, Gyan Patrika.
                </p>
                <div className="k-row">
                  <span className="k-p">₹950</span>
                  <span className="k-pn">incl. delivery</span>
                </div>
                <button
                  className="k-cta cursor-pointer hover:opacity-95 transition-opacity"
                  onClick={() => handlePrebook("Hartalika Teej Kit", 950)}
                >
                  Pre-book now
                </button>
                <span
                  onClick={() => router.push("/ritual-guides/hartalika-teej")}
                  className="k-guide cursor-pointer hover:underline"
                >
                  Read the guide first ›
                </span>
              </div>
            </div>

            {/* Navratri Ghatsthapana Kit */}
            <div className="kcard">
              <div className="k-top k-navratri">
                <span className="k-badge">OPENS 20 SEP</span>
              </div>
              <div className="k-b">
                <div className="k-n">Navratri Ghatsthapana Kit</div>
                <div className="k-for">For Sharad Navratri, October</div>
                <p className="k-inc">
                  Kalash, jau seeds and sowing tray, chunri, akhand jyot supplies, nine-day samagri, Gyan Patrika.
                </p>
                <div className="k-row">
                  <span className="k-p">{navratriPrice}</span>
                  <span className="k-pn">{navratriPriceType}</span>
                </div>
                <button
                  className="k-cta ghost cursor-pointer hover:bg-neutral-50 transition-colors"
                  onClick={() => handleNotifyMe("Navratri Ghatsthapana Kit")}
                >
                  Notify me
                </button>
                <span
                  onClick={() => router.push("/ritual-guides/sharad-navratri")}
                  className="k-guide cursor-pointer hover:underline"
                >
                  Read the guide first ›
                </span>
              </div>
            </div>

            {/* Shiva Puja Kit */}
            <div className="kcard">
              <div className="k-top k-shiva">
                <span className="k-badge">ALL YEAR</span>
              </div>
              <div className="k-b">
                <div className="k-n">Shiva Puja Kit</div>
                <div className="k-for">Pradosh, Somwar, Shivratri</div>
                <p className="k-inc">
                  Bilva patra, gangajal, panchamrit set, chandan, rudraksha mala, dhoop, abhishek vessel, Gyan Patrika.
                </p>
                <div className="k-row">
                  <span className="k-p">₹1,180</span>
                  <span className="k-pn">incl. delivery</span>
                </div>
                <button
                  className="k-cta cursor-pointer hover:opacity-95 transition-opacity"
                  onClick={() => handlePrebook("Shiva Puja Kit", 1180)}
                >
                  Add to cart
                </button>
                <span
                  onClick={() => router.push("/ritual-guides/sawan-somwar")}
                  className="k-guide cursor-pointer hover:underline"
                >
                  Read the guide first ›
                </span>
              </div>
            </div>
          </div>

          {/* Commerce Trust Strip */}
          <div className="ctrust">
            <div className="ct">
              <div className="ct-t">Delivered before the date</div>
              <div className="ct-s">Or your money back. Cut-off dates shown on every kit.</div>
            </div>
            <div className="ct">
              <div className="ct-t">Cash on delivery</div>
              <div className="ct-s">Available on serviceable pincodes across Delhi-NCR.</div>
            </div>
            <div className="ct">
              <div className="ct-t">Sourced, not resold</div>
              <div className="ct-s">Chandni Chowk, Moradabad, Khurja, Haridwar, Varanasi.</div>
            </div>
            <div className="ct">
              <div className="ct-t">A booklet in every kit</div>
              <div className="ct-s">Gyan Patrika — the why, not just the what.</div>
            </div>
          </div>
        </div>
      </section>

      {/* Knowledge-First Band */}
      <section className="sec">
        <div className="wrap">
          <div className="kfirst">
            <div>
              <div className="kf-ey">BEFORE YOU BUY ANYTHING</div>
              <div className="kf-t">You do not need a kit to perform any of this</div>
              <p className="kf-p">
                Every ritual guide on this platform is free, complete, and will stay that way. The samagri list is
                published in full, with substitutions where an item is hard to find. A kit saves you a morning in the
                market. It does not make the puja more valid, and we will never suggest otherwise.
              </p>
              <button
                className="kf-c cursor-pointer hover:opacity-95 transition-opacity font-sans"
                onClick={() => router.push("/ritual-guides")}
              >
                Read a guide instead ›
              </button>
            </div>
            <div className="kf-list">
              <div className="kf-i">
                <span className="kf-ic">📋</span>
                <div>
                  <div className="kf-it">The full samagri list is free</div>
                  <div className="kf-is">Published on every guide, with substitutions.</div>
                </div>
              </div>
              <div className="kf-i">
                <span className="kf-ic">🪔</span>
                <div>
                  <div className="kf-it">A sincere substitute is accepted</div>
                  <div className="kf-is">If an item is unavailable where you live, the tradition allows for it.</div>
                </div>
              </div>
              <div className="kf-i">
                <span className="kf-ic">🙏</span>
                <div>
                  <div className="kf-it">No pandit required</div>
                  <div className="kf-is">Any devotee can perform household puja. That is Dharma, not our opinion.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Calendar Shelf Section */}
      <section className="sec">
        <div className="wrap">
          <div className="sec-head">
            <div>
              <div className="sec-ey">THE NEXT FOUR WEEKS</div>
              <div className="sec-t">What&apos;s coming, and when</div>
              <p className="sec-s">Every guide is complete before the date arrives. Kit optional, always.</p>
            </div>
            <Link href="/panchang" className="sec-all">
              Full 2026 calendar ›
            </Link>
          </div>

          <div className="shelf">
            {/* Hartalika Teej */}
            <div
              className="scard cursor-pointer"
              onClick={() => router.push("/ritual-guides/hartalika-teej")}
            >
              <div className="sc-top sc-hart">
                <span className="sc-when">IN 6 DAYS</span>
              </div>
              <div className="sc-b">
                <div className="sc-n">Hartalika Teej</div>
                <div className="sc-d">13 September · Bhadrapada Shukla Tritiya</div>
                <p className="sc-s">
                  The sand Shivalinga, the nirjala question, and why this is not the same vrat as Hariyali Teej.
                </p>
                <div className="sc-links">
                  <span className="sc-l1">Read guide ›</span>
                  <span className="sc-l2">· Kit ₹950</span>
                </div>
              </div>
            </div>

            {/* Ganesh Chaturthi */}
            <div
              className="scard cursor-pointer"
              onClick={() => triggerToast("Ganesh Chaturthi guide is being compiled and will be live soon!")}
            >
              <div className="sc-top sc-gan">
                <span className="sc-when">IN 7 DAYS</span>
              </div>
              <div className="sc-b">
                <div className="sc-n">Ganesh Chaturthi</div>
                <div className="sc-d">14 September · Bhadrapada Shukla Chaturthi</div>
                <p className="sc-s">Prana pratishtha at midday. The moon-sighting story is a Puranic narrative, not a warning.</p>
                <div className="sc-links">
                  <span className="sc-l1">Read guide ›</span>
                  <span className="sc-l2">· Kit ₹1,650</span>
                </div>
              </div>
            </div>

            {/* Radha Ashtami */}
            <div
              className="scard cursor-pointer"
              onClick={() => triggerToast("Radha Ashtami guide is being drafted and will be live soon!")}
            >
              <div className="sc-top sc-radha">
                <span className="sc-when">IN 12 DAYS</span>
              </div>
              <div className="sc-b">
                <div className="sc-n">Radha Ashtami</div>
                <div className="sc-d">19 September · Bhadrapada Shukla Ashtami</div>
                <p className="sc-s">Radha&apos;s appearance day. Observed most strongly in Barsana and the Braj region.</p>
                <div className="sc-links">
                  <span className="sc-l1">Read guide ›</span>
                </div>
              </div>
            </div>

            {/* Anant Chaturdashi */}
            <div
              className="scard cursor-pointer"
              onClick={() => triggerToast("Anant Chaturdashi guide will be published ahead of the date!")}
            >
              <div className="sc-top sc-anant">
                <span className="sc-when">IN 16 DAYS</span>
              </div>
              <div className="sc-b">
                <div className="sc-n">Anant Chaturdashi</div>
                <div className="sc-d">23 September · Ganesh Visarjan</div>
                <p className="sc-s">
                  The closing of the ten-day observance. Immersion, and what to do if a water body is not available.
                </p>
                <div className="sc-links">
                  <span className="sc-l1">Read guide ›</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Shelf Section */}
      <section className="sec">
        <div className="wrap">
          <div className="home-cats font-sans">
            <div
              className="home-cat cursor-pointer hover:border-[#FD066D] transition-colors"
              onClick={() => router.push("/ritual-guides")}
            >
              <div className="home-cat-i a">📚</div>
              <div className="home-cat-t">Ritual Guides</div>
              <p className="home-cat-s">
                Step-by-step pujans, with every Sanskrit mantra translated, materials substitution rules, and source verification.
              </p>
              <div className="home-cat-links">
                <span className="home-cat-chip">Festive</span>
                <span className="home-cat-chip">All-Year</span>
                <span className="home-cat-chip">Vrat Vidhi</span>
              </div>
              <span className="home-cat-c">Browse guides ›</span>
            </div>

            <div
              className="home-cat cursor-pointer hover:border-[#FD066D] transition-colors"
              onClick={() => router.push("/panchang")}
            >
              <div className="home-cat-i b">☀</div>
              <div className="home-cat-t">Panchang</div>
              <p className="home-cat-s">
                Today&apos;s tithi, paksha, nakshatra and sunrise — and the year&apos;s full vrat calendar. Learn to read it yourself.
              </p>
              <div className="home-cat-links">
                <span className="home-cat-chip">Today</span>
                <span className="home-cat-chip">2026 Vrat Calendar</span>
                <span className="home-cat-chip">Eclipses</span>
              </div>
              <span className="home-cat-c">Open Panchang ›</span>
            </div>

            <div
              className="home-cat cursor-pointer hover:border-[#FD066D] transition-colors"
              onClick={() => router.push("/dharmic-concepts")}
            >
              <div className="home-cat-i c">🌿</div>
              <div className="home-cat-t">Dharmic Concepts</div>
              <p className="home-cat-s">
                Why bilva and not tulsi. Why midnight and not dawn. The object in your hand has a story older than the ritual.
              </p>
              <div className="home-cat-links">
                <span className="home-cat-chip">Materials</span>
                <span className="home-cat-chip">Practices</span>
                <span className="home-cat-chip">Ideas</span>
              </div>
              <span className="home-cat-c">Explore concepts ›</span>
            </div>
          </div>
        </div>
      </section>

      {/* Myths Grid Section */}
      <section className="sec">
        <div className="wrap">
          <div className="myths">
            <div className="my-ey">THE PART NOBODY ELSE PUBLISHES</div>
            <div className="my-t">Corrections, not warnings</div>
            <p className="my-s">
              Every guide ends with the misconceptions attached to that ritual, and what the source text actually says.
              Selling you a kit does not change what we print here.
            </p>
            <div className="my-grid font-sans">
              <div className="mycard">
                <div className="my-q">
                  <span className="my-ic">✕</span>
                  <span className="my-tx">&quot;Only a pandit can perform Ganesh Sthapana.&quot;</span>
                </div>
                <div className="my-a">
                  <span className="my-ic">✓</span>
                  <span className="my-tx">
                    Nothing in the source tradition restricts prana pratishtha to priests. A pandit adds timing precision
                    and convenience — not validity.
                  </span>
                </div>
              </div>

              <div className="mycard">
                <div className="my-q">
                  <span className="my-ic">✕</span>
                  <span className="my-tx">&quot;Seeing the moon on Chaturthi brings misfortune.&quot;</span>
                </div>
                <div className="my-a">
                  <span className="my-ic">✓</span>
                  <span className="my-tx">
                    The Syamantaka Mani story is a Puranic narrative, not a basis for fear. The traditional response is
                    reciting a verse — nothing lasting is held to follow.
                  </span>
                </div>
              </div>

              <div className="mycard">
                <div className="my-q">
                  <span className="my-ic">✕</span>
                  <span className="my-tx">&quot;A bought kit is less sincere than one you assemble.&quot;</span>
                </div>
                <div className="my-a">
                  <span className="my-ic">✓</span>
                  <span className="my-tx">
                    No text ranks devotion by where the samagri came from. Equally, no text says you need a kit. Both are
                    conveniences. Neither is the vrat.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Editorial Method Section */}
      <section className="sec">
        <div className="wrap">
          <div className="method font-sans">
            <div>
              <div className="me-ey">HOW WE DECIDE WHAT IS TRUE</div>
              <div className="me-t">Every claim is tagged, scored, and traceable to a named text</div>
              <p className="me-p">
                If we cannot name the text a reader could check, we do not make the claim. Where something is your
                family&apos;s custom rather than scripture, we say so. Commerce does not get a vote in this.
              </p>
              <button
                className="me-c cursor-pointer hover:opacity-95 transition-opacity"
                onClick={() => triggerToast("Opening our complete Editorial Guidelines database...")}
              >
                Read our editorial method ›
              </button>
            </div>
            <div className="dpb">
              <div className="dpb-r d">
                <div className="dpb-k">DHARMA</div>
                <div className="dpb-v">Named in a text you could open yourself. Carries a confidence score out of five.</div>
              </div>
              <div className="dpb-r p">
                <div className="dpb-k">PRATHA</div>
                <div className="dpb-v">
                  Regional or family custom. Real, valid, worth keeping — but not scripture, and we will not pretend it is.
                </div>
              </div>
              <div className="dpb-r b">
                <div className="dpb-k">BHRANTI</div>
                <div className="dpb-v">A misconception, usually fear-based. Corrected in plain language, every time.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WhatsApp reminders bar */}
      <section className="sec pb-12">
        <div className="wrap">
          <div className="circ font-sans">
            <div className="circ-i">
              <img src="/images/whatsapp_badge.png" alt="WhatsApp logo" />
            </div>
            <div>
              <div className="circ-l">THE TAPA CIRCLE</div>
              <div className="circ-t">Never miss a date, or a cut-off</div>
              <p className="circ-s">
                Festival and vrat reminders on WhatsApp, with the guide attached and the kit cut-off if there is one. ₹499
                a year.
              </p>
            </div>
            <button
              className="circ-b cursor-pointer hover:opacity-95 transition-opacity"
              onClick={() => window.open("https://wa.me/9100000000", "_blank")}
            >
              Join the Tapa Circle ›
            </button>
          </div>
        </div>
      </section>

      <Footer onTriggerToast={triggerToast} />
    </div>
  );
}
