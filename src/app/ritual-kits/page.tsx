"use client";

import React, { useState, useMemo } from "react";
import AnnouncementBar from "@/components/AnnouncementBar";
import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";

interface KitItem {
  id: string;
  name: string;
  hindi?: string;
  occ: string;
  deity: string;
  price: number;
  mrp?: number;
  inStock: boolean;
  stockLeft?: number;
  itemsCount: string;
  ribbon?: string;
  delivery: string;
  isFeatured?: boolean;
}

export default function RitualKitsPLP() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filter States
  const [activeOccasionTab, setActiveOccasionTab] = useState<string>("all");
  const [selectedOccasions, setSelectedOccasions] = useState<string[]>(["navratri"]);
  const [selectedDeities, setSelectedDeities] = useState<string[]>(["devi"]);
  const [priceMin, setPriceMin] = useState<string>("604");
  const [priceMax, setPriceMax] = useState<string>("2749");
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [shipsBeforeFestival, setShipsBeforeFestival] = useState<boolean>(true);
  const [sortBy, setSortBy] = useState<string>("recommended");

  // Sections collapse toggles
  const [sectionsCollapsed, setSectionsCollapsed] = useState({
    occasion: false,
    price: false,
    availability: false,
    deity: false,
  });

  const triggerToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const toggleSection = (sec: "occasion" | "price" | "availability" | "deity") => {
    setSectionsCollapsed((prev) => ({ ...prev, [sec]: !prev[sec] }));
  };

  // Full product index of 13 kits
  const kitsList: KitItem[] = useMemo(() => [
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
    },
    {
      id: "shakti-aradhana",
      name: "Shakti Aradhana",
      occ: "navratri",
      deity: "devi",
      price: 2199,
      mrp: 2600,
      inStock: true,
      stockLeft: 3,
      itemsCount: "12 items",
      ribbon: "low",
      delivery: "🚚 Before Navratri",
    },
    {
      id: "purna-ghatasthapana",
      name: "Purna Ghatasthapana",
      hindi: "पूर्ण घटस्थापना",
      occ: "navratri",
      deity: "devi",
      price: 1099,
      inStock: false,
      itemsCount: "10 items",
      ribbon: "soldout",
      delivery: "🚚 Ships soon",
    },
    {
      id: "shubh-akshaya-thali",
      name: "Shubh Akshaya Thali",
      hindi: "शुभ अक्षय थाली",
      occ: "diwali",
      deity: "vishnu",
      price: 1649,
      mrp: 1950,
      inStock: true,
      itemsCount: "13 items",
      ribbon: "new",
      delivery: "🚚 Before Diwali",
    },
    {
      id: "shashti-deepam",
      name: "Shashti Deepam",
      hindi: "षष्टि दीपम्",
      occ: "diwali",
      deity: "devi",
      price: 1099,
      mrp: 1299,
      inStock: true,
      stockLeft: 4,
      itemsCount: "6 items",
      ribbon: "low",
      delivery: "🚚 Before Diwali",
    },
    {
      id: "deepa-vaibhava",
      name: "Deepa Vaibhava",
      hindi: "दीप वैभव",
      occ: "diwali",
      deity: "vishnu",
      price: 934,
      mrp: 1099,
      inStock: true,
      itemsCount: "8 items",
      ribbon: "new",
      delivery: "🚚 Before Diwali",
    },
    {
      id: "trimshat-deepam",
      name: "Trimshat Deepam",
      hindi: "त्रिंशत् दीपम्",
      occ: "diwali",
      deity: "vishnu",
      price: 604,
      mrp: 699,
      inStock: true,
      itemsCount: "4 items",
      ribbon: "new",
      delivery: "🚚 Before Diwali",
    },
    {
      id: "tulsi-kalyanam",
      name: "Tulsi Kalyanam Collection",
      occ: "satyanarayan",
      deity: "vishnu",
      price: 1979,
      mrp: 2300,
      inStock: true,
      itemsCount: "10 items",
      ribbon: "new",
      delivery: "🚚 Year-round",
    },
    {
      id: "satyanarayan-pujan",
      name: "Satyanarayan Pujan",
      occ: "satyanarayan",
      deity: "vishnu",
      price: 1979,
      mrp: 2300,
      inStock: true,
      itemsCount: "11 items",
      ribbon: "new",
      delivery: "🚚 Year-round",
    },
    {
      id: "sundarkand-path",
      name: "Sundarkand Path Kit Essentials",
      occ: "yearround",
      deity: "vishnu",
      price: 2419,
      mrp: 2800,
      inStock: true,
      itemsCount: "9 items",
      ribbon: "new",
      delivery: "🚚 Year-round",
    },
    {
      id: "yajna",
      name: "Yajña",
      hindi: "यज्ञ",
      occ: "havan",
      deity: "all-deity",
      price: 1209,
      mrp: 1400,
      inStock: true,
      itemsCount: "8 items",
      ribbon: "new",
      delivery: "🚚 Year-round",
    },
    {
      id: "ekadash",
      name: "Ekadash",
      hindi: "एकादश",
      occ: "yearround",
      deity: "vishnu",
      price: 879,
      mrp: 999,
      inStock: true,
      itemsCount: "7 items",
      ribbon: "new",
      delivery: "🚚 Year-round",
    },
    {
      id: "panch-jyoti",
      name: "Panch Jyoti Gift Tray",
      occ: "gift",
      deity: "all-deity",
      price: 659,
      mrp: 799,
      inStock: true,
      itemsCount: "5 items · Gift-ready",
      ribbon: "new",
      delivery: "🚚 Year-round",
    },
  ], []);

  // Occasion & Deity toggle helpers
  const handleToggleOccasion = (occ: string) => {
    setSelectedOccasions((prev) =>
      prev.includes(occ) ? prev.filter((o) => o !== occ) : [...prev, occ]
    );
  };

  const handleToggleDeity = (deity: string) => {
    setSelectedDeities((prev) =>
      prev.includes(deity) ? prev.filter((d) => d !== deity) : [...prev, deity]
    );
  };

  const handleResetFilters = () => {
    setSelectedOccasions([]);
    setSelectedDeities([]);
    setPriceMin("604");
    setPriceMax("2749");
    setInStockOnly(false);
    setShipsBeforeFestival(true);
    setActiveOccasionTab("all");
  };

  // Filtered and Sorted Kits index
  const filteredKits = useMemo(() => {
    let result = kitsList;

    // 1. Top Occasion Tab filter
    if (activeOccasionTab !== "all") {
      result = result.filter((kit) => kit.occ === activeOccasionTab);
    }

    // 2. Sidebar Occasion filter checkboxes (if any are selected)
    if (selectedOccasions.length > 0) {
      result = result.filter((kit) => selectedOccasions.includes(kit.occ));
    }

    // 3. Sidebar Deity filter checkboxes
    if (selectedDeities.length > 0) {
      result = result.filter((kit) => selectedDeities.includes(kit.deity));
    }

    // 4. In Stock check
    if (inStockOnly) {
      result = result.filter((kit) => kit.inStock);
    }

    // 5. Price boundaries
    const minVal = parseFloat(priceMin.replace(/,/g, "")) || 0;
    const maxVal = parseFloat(priceMax.replace(/,/g, "")) || 99999;
    result = result.filter((kit) => kit.price >= minVal && kit.price <= maxVal);

    // Sort algorithms
    if (sortBy === "price-low") {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      result = [...result].sort((a, b) => b.price - a.price);
    } else if (sortBy === "new") {
      result = [...result].sort((a) => (a.ribbon === "new" ? -1 : 1));
    }

    return result;
  }, [kitsList, activeOccasionTab, selectedOccasions, selectedDeities, inStockOnly, priceMin, priceMax, sortBy]);

  // Featured Kit check
  const featuredKit = useMemo(() => {
    return kitsList.find((kit) => kit.isFeatured);
  }, [kitsList]);

  // Determine if featured card matches active filters
  const showFeaturedCard = useMemo(() => {
    if (!featuredKit) return false;
    // Do not show if top occasion tab is not Navratri or all
    if (activeOccasionTab !== "all" && activeOccasionTab !== "navratri") return false;
    // Check checkboxes
    if (selectedOccasions.length > 0 && !selectedOccasions.includes("navratri")) return false;
    if (selectedDeities.length > 0 && !selectedDeities.includes("devi")) return false;
    // Check price bounds
    const minVal = parseFloat(priceMin.replace(/,/g, "")) || 0;
    const maxVal = parseFloat(priceMax.replace(/,/g, "")) || 99999;
    if (featuredKit.price < minVal || featuredKit.price > maxVal) return false;
    // Check stock
    if (inStockOnly && !featuredKit.inStock) return false;

    return true;
  }, [featuredKit, activeOccasionTab, selectedOccasions, selectedDeities, priceMin, priceMax, inStockOnly]);

  const handleAddToCart = (name: string, price: number) => {
    triggerToast(`Added ${name} (₹${price.toLocaleString()}) to your cart!`);
  };

  const handleNotifyMe = (name: string) => {
    triggerToast(`Alert set! We will notify you when ${name} is back in stock.`);
  };

  const handleWhatsAppSupport = () => {
    window.open("https://wa.me/9100000000", "_blank");
  };

  return (
    <div className="min-h-screen bg-bg text-body-text font-sans antialiased plp-container">
      {/* 1. Announcement Bar */}
      <AnnouncementBar />

      {/* 2. Top Navigation */}
      <TopNav activeTab="Ritual Kits" onTriggerToast={triggerToast} />

      {/* 3. Breadcrumb */}
      <div className="breadcrumb-bar select-none">
        <div className="wrap">
          <a href="/" className="hover:underline">Home</a>
          <span className="bc-sep">›</span>
          <span className="bc-current">Ritual Kits</span>
        </div>
      </div>

      {/* 4. Page Hero Band */}
      <div className="page-hero select-none">
        <div className="wrap">
          <div className="hero-inner">
            <div className="hero-top-row">
              <div className="hero-text">
                <div className="hero-eyebrow">+ RITUAL KITS · LIVE NOW · OCTOBER 2026</div>
                <h1 className="hero-title font-serif">Complete samagri.<br />At your door.</h1>
                <p className="hero-sub">13 ritual kits — ritually correct, sourced from verified suppliers, delivered before your festival date. Every item has a named place in the vidhi.</p>
              </div>
              <div className="hero-stats">
                <div className="hstat">
                  <div className="hstat-num">13</div>
                  <div className="hstat-label">Kits available</div>
                </div>
                <div className="hstat">
                  <div className="hstat-num">₹604</div>
                  <div className="hstat-label">Starting price</div>
                </div>
                <div className="hstat">
                  <div className="hstat-num">48 hr</div>
                  <div className="hstat-label">Delivery window</div>
                </div>
              </div>
            </div>
            <div className="hero-trust-row text-xs flex-wrap gap-2">
              <div className="htrust">
                <div className="htrust-dot" />
                <span className="htrust-text">Ritually verified items</span>
              </div>
              <div className="htrust-sep" />
              <div className="htrust">
                <div className="htrust-dot" />
                <span className="htrust-text">Shipped before your ritual date</span>
              </div>
              <div className="htrust-sep" />
              <div className="htrust">
                <div className="htrust-dot" />
                <span className="htrust-text">Exchange on wrong item — no questions</span>
              </div>
              <div className="htrust-sep" />
              <div className="htrust">
                <div className="htrust-dot" />
                <span className="htrust-text">UPI and card · No COD</span>
              </div>
              <div className="htrust-sep" />
              <div className="htrust">
                <div className="htrust-dot" />
                <span className="htrust-text">Sourced from Chandni Chowk, Haridwar &amp; Varanasi</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Subnav Tabs (Sticky Below Header) */}
      <div className="sticky top-[64px] z-40 bg-card border-b border-border w-full select-none">
        <div className="max-w-[var(--content-w)] mx-auto px-4 md:px-10 flex items-center justify-between h-12">
          <div className="flex gap-2 overflow-x-auto scrollbar-none whitespace-nowrap py-1 select-none w-full md:w-auto" role="tablist">
            {[
              { id: "all", label: "All kits" },
              { id: "navratri", label: "Navratri" },
              { id: "diwali", label: "Diwali" },
              { id: "satyanarayan", label: "Satyanarayan" },
              { id: "havan", label: "Havan & Yagna" },
              { id: "yearround", label: "Year-round" },
              { id: "gift", label: "Gift" }
            ].map((tab) => (
              <button
                key={tab.id}
                role="tab"
                onClick={() => {
                  setActiveOccasionTab(tab.id);
                  // Sync checkbox state when tab clicked to make user feedback intuitive
                  if (tab.id !== "all") {
                    setSelectedOccasions([tab.id]);
                  } else {
                    setSelectedOccasions([]);
                  }
                }}
                className={`text-[13px] font-medium px-4 py-2 h-12 flex items-center border-b-2 bg-transparent cursor-pointer transition-all whitespace-nowrap ${activeOccasionTab === tab.id ? "border-pink text-pink font-semibold" : "border-transparent text-sub-text hover:text-body-text"}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="subnav-right">
            <div className="view-toggle">
              <button className="vbtn active" aria-label="Grid view" title="Grid view">▦</button>
              <button className="vbtn" aria-label="List view" title="List view" onClick={() => triggerToast("List view coming soon!")}>☰</button>
            </div>
          </div>
        </div>
      </div>

      {/* 6. Content Sidebar + Grid */}
      <div className="max-w-[var(--content-w)] mx-auto px-4 md:px-10 py-7 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8 items-start w-full">
        
        {/* Sidebar Filters */}
        <aside className="bg-card border border-border rounded-2xl overflow-hidden lg:sticky lg:top-[112px] flex flex-col w-full select-none" aria-label="Filter kits">
          <div className="sidebar-head">
            <span className="sidebar-title">FILTERS</span>
            <button className="sidebar-reset cursor-pointer font-bold" onClick={handleResetFilters}>Clear all</button>
          </div>

          {/* Occasion Section */}
          <div className="sidebar-section">
            <div className="sidebar-sec-head" onClick={() => toggleSection("occasion")}>
              <span className="sidebar-sec-label">OCCASION</span>
              <span className={`sidebar-chevron block font-bold ${!sectionsCollapsed.occasion ? "open" : ""}`}>›</span>
            </div>
            {!sectionsCollapsed.occasion && (
              <div className="sidebar-body">
                {[
                  { id: "navratri", label: "Navratri", count: 3 },
                  { id: "diwali", label: "Diwali · Kartik", count: 4 },
                  { id: "satyanarayan", label: "Satyanarayan", count: 2 },
                  { id: "ekadashi", label: "Ekadashi", count: 1 },
                  { id: "havan", label: "Havan & Yagna", count: 1 },
                  { id: "sundarkand", label: "Sundarkand Path", count: 1 },
                  { id: "gift", label: "Gift Collections", count: 1 }
                ].map((opt) => (
                  <div key={opt.id} className="filter-opt font-sans" onClick={() => handleToggleOccasion(opt.id)}>
                    <div className={`fopt-check ${selectedOccasions.includes(opt.id) ? "checked" : ""}`}>✓</div>
                    <span className="fopt-label font-medium">{opt.label}</span>
                    <span className="fopt-count font-bold">{opt.count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Price Range Section */}
          <div className="sidebar-section">
            <div className="sidebar-sec-head" onClick={() => toggleSection("price")}>
              <span className="sidebar-sec-label">PRICE RANGE</span>
              <span className={`sidebar-chevron block font-bold ${!sectionsCollapsed.price ? "open" : ""}`}>›</span>
            </div>
            {!sectionsCollapsed.price && (
              <div className="sidebar-body font-sans">
                <div className="price-range-row">
                  <input
                    className="price-input"
                    type="text"
                    placeholder="₹ Min"
                    value={priceMin}
                    onChange={(e) => setPriceMin(e.target.value)}
                  />
                  <span className="price-sep">—</span>
                  <input
                    className="price-input"
                    type="text"
                    placeholder="₹ Max"
                    value={priceMax}
                    onChange={(e) => setPriceMax(e.target.value)}
                  />
                </div>
                <button className="price-apply cursor-pointer font-bold" onClick={() => triggerToast("Price filter applied!")}>
                  Apply range
                </button>
              </div>
            )}
          </div>

          {/* Availability Section */}
          <div className="sidebar-section">
            <div className="sidebar-sec-head" onClick={() => toggleSection("availability")}>
              <span className="sidebar-sec-label">AVAILABILITY</span>
              <span className={`sidebar-chevron block font-bold ${!sectionsCollapsed.availability ? "open" : ""}`}>›</span>
            </div>
            {!sectionsCollapsed.availability && (
              <div className="sidebar-body font-sans">
                <div className="avail-row">
                  <span className="avail-label font-medium">In stock only</span>
                  <label className="toggle">
                    <input
                      type="checkbox"
                      checked={inStockOnly}
                      onChange={(e) => setInStockOnly(e.target.checked)}
                    />
                    <span className="toggle-track" />
                  </label>
                </div>
                <div className="avail-row">
                  <span className="avail-label font-medium">Ships before festival</span>
                  <label className="toggle">
                    <input
                      type="checkbox"
                      checked={shipsBeforeFestival}
                      onChange={(e) => setShipsBeforeFestival(e.target.checked)}
                    />
                    <span className="toggle-track" />
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Deity Cluster Section */}
          <div className="sidebar-section">
            <div className="sidebar-sec-head" onClick={() => toggleSection("deity")}>
              <span className="sidebar-sec-label">DEITY CLUSTER</span>
              <span className={`sidebar-chevron block font-bold ${!sectionsCollapsed.deity ? "open" : ""}`}>›</span>
            </div>
            {!sectionsCollapsed.deity && (
              <div className="sidebar-body font-sans">
                {[
                  { id: "shiva", label: "Shiva", count: 1 },
                  { id: "devi", label: "Devi · Shakti", count: 4 },
                  { id: "vishnu", label: "Vishnu", count: 5 },
                  { id: "all-deity", label: "All deities / General", count: 3 }
                ].map((opt) => (
                  <div key={opt.id} className="filter-opt" onClick={() => handleToggleDeity(opt.id)}>
                    <div className={`fopt-check ${selectedDeities.includes(opt.id) ? "checked" : ""}`}>✓</div>
                    <span className="fopt-label font-medium">{opt.label}</span>
                    <span className="fopt-count font-bold">{opt.count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>

        {/* Product Grid Area */}
        <div className="flex flex-col gap-4">
          
          {/* Pre-book Notification banner */}
          <div className="early-bar font-sans select-none" role="note">
            <span className="early-bar-icon">🎁</span>
            <div>
              <div className="early-bar-t">Pre-bookers got the early-bird price</div>
              <div className="early-bar-s">Kits are now live at full price · Exchange on wrong item · No COD</div>
            </div>
          </div>

          {/* Results Summary and Sorting */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 w-full select-none">
            <span className="results-count font-sans font-semibold">
              {filteredKits.length} {filteredKits.length === 1 ? "kit" : "kits"} · Ships before your festival date
            </span>
            <div className="sort-inline font-sans">
              <span className="sort-label font-medium">Sort by</span>
              <select
                className="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                aria-label="Sort kits"
              >
                <option value="recommended">Recommended</option>
                <option value="price-low">Price — low to high</option>
                <option value="price-high">Price — high to low</option>
                <option value="new">New arrivals</option>
              </select>
            </div>
          </div>

          {/* ── FEATURED PRODUCT CARD ── */}
          {showFeaturedCard && featuredKit && (
            <div
              className="bg-card border border-border rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-[1fr_320px] min-h-[220px] cursor-pointer transition-all hover:border-pink hover:shadow-lg w-full font-sans"
              onClick={() => handleAddToCart(featuredKit.name, featuredKit.price)}
              role="article"
              aria-label={`${featuredKit.name} — featured kit`}
            >
              <div className="p-6 md:p-8 flex flex-col justify-center">
                <div className="featured-tag-row">
                  <span className="featured-bestseller">Bestseller</span>
                  <span className="featured-low-pill">⚡ Only 4 left</span>
                </div>
                <div className="featured-occ">{featuredKit.occ} · October 2026</div>
                <div className="featured-name font-serif">{featuredKit.name}</div>
                {featuredKit.hindi && <div className="featured-hindi font-serif">{featuredKit.hindi}</div>}
                <p className="featured-desc">Complete Ghatasthapana samagri — every item verified against the Navratri vidhi from the Devi Bhagavatam. Gangajal, Kalash, Mango leaves, Jau and 12 more items selected for ritual integrity.</p>
                <div className="featured-items-list">
                  {["Gangajal 250ml", "Brass Kalash", "Mango leaves", "Jau (barley)", "Deepak × 9", "Sindoor", "+ 10 more"].map((it, i) => (
                    <span key={i} className="fitem-pill">{it}</span>
                  ))}
                </div>
                <div className="featured-price-row flex-wrap">
                  <span className="featured-price">₹{featuredKit.price.toLocaleString()}</span>
                  {featuredKit.mrp && <span className="featured-mrp">₹{featuredKit.mrp.toLocaleString()}</span>}
                  <span className="featured-save font-bold">Save ₹451 — 14% off</span>
                </div>
                <div className="featured-ctas">
                  <button
                    className="f-cart-btn font-bold cursor-pointer hover:opacity-95"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(featuredKit.name, featuredKit.price);
                    }}
                  >
                    🛒 Add to cart
                  </button>
                  <button
                    className="f-view-btn font-semibold cursor-pointer hover:bg-bg"
                    onClick={(e) => {
                      e.stopPropagation();
                      triggerToast(`Opening ${featuredKit.name} detail card...`);
                    }}
                  >
                    View details →
                  </button>
                </div>
                <div className="featured-delivery text-xs font-semibold">{featuredKit.delivery}</div>
              </div>
              <div className="bg-gradient-to-br from-[#5C2A08] via-[#A06020] to-[#3A1208] flex items-center justify-center p-6 md:p-8 h-48 md:h-auto font-sans" aria-label="Featured kit photo flatlay">
                <div className="text-center">
                  <div className="featured-img-icon">📦</div>
                  <div className="featured-img-label">Kit photography<br />Flat-lay · 16 items arranged</div>
                </div>
              </div>
            </div>
          )}

          {/* ── 3-COLUMN PRODUCT LISTING GRID ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" role="list">
            {filteredKits.filter((k) => !k.isFeatured).map((kit) => (
              <div
                key={kit.id}
                className={`kit-card font-sans ${kit.stockLeft ? "low-stock" : ""} ${!kit.inStock ? "sold-out" : ""}`}
                role="listitem"
                onClick={() => kit.inStock && handleAddToCart(kit.name, kit.price)}
              >
                <div
                  className="kit-img select-none"
                  style={{
                    background:
                      kit.occ === "diwali"
                        ? "linear-gradient(135deg,#3A2A08,#8A5A14)"
                        : kit.occ === "satyanarayan"
                        ? "linear-gradient(135deg,#1A3A1A,#3A6A2A)"
                        : "linear-gradient(135deg,#1A2A4A,#3A5A8A)",
                  }}
                >
                  {kit.stockLeft && <span className="kit-ribbon low font-bold">⚡ {kit.stockLeft} left</span>}
                  {!kit.inStock && <span className="kit-ribbon soldout font-bold">Sold out</span>}
                  {kit.ribbon === "new" && kit.inStock && <span className="kit-ribbon new font-bold">New</span>}
                  <span className="kit-img-icon text-white/20 font-bold">📦</span>
                </div>
                <div className="kit-body">
                  <div className="kit-occ font-bold text-[10px]">{kit.occ}</div>
                  <div className="kit-name font-bold text-dark">{kit.name}</div>
                  {kit.hindi && <div className="kit-hindi text-xs">{kit.hindi}</div>}
                  <div className="kit-items font-medium text-sub-text">{kit.itemsCount}</div>

                  {kit.stockLeft && <div className="kit-low-warn text-[10px] font-bold">⚡ Only {kit.stockLeft} left</div>}
                  {kit.occ === "satyanarayan" && <div className="kit-eb-saved text-[10px] font-bold">🎁 Pre-bookers saved ₹180</div>}

                  <div className="kit-price-row">
                    <span className={`kit-price font-bold ${!kit.inStock ? "text-sub-text" : ""}`}>
                      ₹{kit.price.toLocaleString()}
                    </span>
                    {kit.mrp && <span className="kit-mrp">₹{kit.mrp.toLocaleString()}</span>}
                    {kit.mrp && <span className="kit-pct font-bold">−15%</span>}
                  </div>

                  {kit.inStock ? (
                    <button
                      className="kit-btn font-bold cursor-pointer hover:opacity-95"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(kit.name, kit.price);
                      }}
                    >
                      🛒 Add to cart
                    </button>
                  ) : (
                    <>
                      <button className="kit-btn soldout-btn font-bold" disabled>
                        Sold out
                      </button>
                      <button
                        className="kit-notify font-semibold cursor-pointer hover:bg-bg"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNotifyMe(kit.name);
                        }}
                      >
                        🔔 Notify when in stock
                      </button>
                    </>
                  )}
                  {kit.inStock && <div className="kit-delivery font-semibold">{kit.delivery}</div>}
                </div>
              </div>
            ))}

            {/* Empty state view */}
            {filteredKits.length === 0 && (
              <div className="empty-state visible font-sans select-none" role="status">
                <div className="empty-icon text-3xl">🔍</div>
                <div className="empty-title font-serif font-bold text-lg text-dark">No kits match these filters</div>
                <div className="empty-sub text-sm mt-1 text-sub-text leading-relaxed">
                  Try adjusting the occasion, deity, or price range filters. More kits are being added through 2026.
                </div>
                <button className="empty-reset cursor-pointer font-bold mt-4" onClick={handleResetFilters}>
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 7. WhatsApp Chat CTA */}
      <div className="w-full max-w-[var(--content-w)] mx-auto px-4 md:px-10 mt-10 select-none">
        <div className="bg-card border border-border rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center md:items-stretch gap-5 w-full font-sans" role="complementary">
          <div className="w-12 h-12 rounded-xl bg-[#22C35E]/10 border border-[#22C35E]/30 text-[#22C35E] flex items-center justify-center text-2xl shrink-0">💬</div>
          <div className="chat-body">
            <div className="chat-title text-dark font-bold text-base">Not finding the right kit for your puja?</div>
            <div className="chat-sub text-sub-text text-sm">Tell us your occasion, deity, or budget — we&apos;ll point you to the right kit. Usually responds within a few hours.</div>
            <div className="text-[10px] text-sub-text text-center md:text-right mt-1">Opens WhatsApp · Free · No commitment</div>
          </div>
          <button className="bg-[#22C35E] hover:bg-[#1EAE53] text-white border-none rounded-xl px-6 py-3 font-bold flex items-center gap-2 shrink-0 w-full md:w-auto justify-center cursor-pointer transition-colors" onClick={handleWhatsAppSupport}>
            <span>💬</span>
            Chat with us on WhatsApp
          </button>
        </div>
      </div>

      {/* 8. Brand Footer (identical) */}
      <Footer onTriggerToast={triggerToast} />

      {/* Premium Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[100] bg-dark text-white border border-white/10 px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-bounce font-sans text-xs select-none">
          <span className="w-1.5 h-1.5 rounded-full bg-pink animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
