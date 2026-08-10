"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import AnnouncementBar from "@/components/AnnouncementBar";
import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";
import "./pdp.css";

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

const KITS_LIST: KitItem[] = [
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
    hindi: "शक्ति आराधना — Goddess Devotion",
    occ: "navratri",
    deity: "devi",
    price: 2199,
    mrp: 2600,
    inStock: true,
    stockLeft: 3,
    itemsCount: "12 items",
    delivery: "🚚 Delivered before Navratri begins · Delhi-NCR by 30 Sept",
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
  },
  {
    id: "yajna",
    name: "Yajña",
    hindi: "यज्ञ — Sacred Havan Samagri",
    occ: "havan",
    deity: "all-deity",
    price: 1209,
    mrp: 1400,
    inStock: true,
    itemsCount: "8 items",
    delivery: "🚚 Year-round delivery · Shipped within 48 hours",
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
  },
  {
    id: "panch-jyoti",
    name: "Panch Jyoti Gift Tray",
    hindi: "पंच ज्योति — Auspicious Gift Tray",
    occ: "gift",
    deity: "all-deity",
    price: 659,
    mrp: 799,
    inStock: true,
    itemsCount: "5 items · Gift-ready",
    delivery: "🚚 Year-round delivery · Shipped within 48 hours",
  },
];

const IMAGES = [
  {
    bg: "linear-gradient(155deg,#3A1C08,#A06020,#2A1208)",
    icon: "📦",
    label: "Kit photography · Flat-lay hero\nAll items arranged · Tap to browse",
  },
  {
    bg: "linear-gradient(155deg,#2A1208,#7A4018,#1A0E06)",
    icon: "🪔",
    label: "All items laid out individually\nEach with ritual purpose label",
  },
  {
    bg: "linear-gradient(155deg,#1C0E06,#5A2A14,#100806)",
    icon: "🎁",
    label: "Kit packaging · Premium dark box\nWith The Tapa Co. branding",
  },
];

export default function ShubhSampadaPDP({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [currentImage, setCurrentImage] = useState(0);
  const [itemsExpanded, setItemsExpanded] = useState(false);
  const [pincode, setPincode] = useState("");
  const [pinResult, setPinResult] = useState<{
    status: "idle" | "ok" | "fail";
    message: string;
  }>({
    status: "ok",
    message: "✓ Delivered by 30 September · 110001, Delhi–NCR",
  });

  const kit = useMemo(() => {
    return KITS_LIST.find((k) => k.id === params.slug) || KITS_LIST[0];
  }, [params.slug]);

  const triggerToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % IMAGES.length);
  };

  const handleAddToCart = () => {
    triggerToast(`Added ${kit.name} to your cart!`);
  };

  const handleBuyNow = () => {
    triggerToast(`Proceeding to checkout — ${kit.name} · ₹${kit.price.toLocaleString()}`);
  };

  const checkPin = () => {
    const trimmed = pincode.trim();
    if (trimmed.length === 6) {
      setPinResult({
        status: "ok",
        message: `✓ Delivered by 30 September to ${trimmed}`,
      });
    } else {
      setPinResult({
        status: "fail",
        message: "⚠ Enter a valid 6-digit pincode",
      });
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `${kit.name} — Ritual Kit`,
          url: `https://thetapaco.com/ritual-kits/${kit.id}`,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(`https://thetapaco.com/ritual-kits/${kit.id}`);
      triggerToast("Copied sharing link to clipboard!");
    }
  };

  return (
    <div className="min-h-screen bg-[#F2EDE4] text-[#2C2010] font-sans antialiased pdp-container">
      {/* Announcement Bar */}
      <AnnouncementBar />

      {/* Top Navigation */}
      <TopNav activeTab="Ritual Kits" onTriggerToast={triggerToast} />

      {/* Breadcrumb */}
      <div className="breadcrumb-bar select-none">
        <div className="pdp-wrap">
          <a href="/" className="bc-link">
            Home
          </a>
          <span className="bc-sep">›</span>
          <a href="/ritual-kits" className="bc-link">
            Ritual Kits
          </a>
          <span className="bc-sep">›</span>
          <span className="bc-current">{kit.name}</span>
          <div className="bc-right">
            <button
              className="bc-action"
              aria-label="Save kit"
              onClick={() => triggerToast("Saved to your wishlist!")}
            >
              🔖 Save
            </button>
            <button className="bc-action" aria-label="Share kit" onClick={handleShare}>
              ↗ Share
            </button>
          </div>
        </div>
      </div>

      {/* Two-Column Hero Zone */}
      <div className="hero-zone">
        {/* Left: Image Gallery */}
        <div className="gallery-col">
          <div
            className="gallery-main"
            style={{ background: IMAGES[currentImage].bg }}
            onClick={nextImage}
            role="button"
            aria-label="Browse kit images"
          >
            <span className="gallery-ribbon">Bestseller</span>
            {kit.stockLeft && <span className="gallery-low-pill">⚡ Only {kit.stockLeft} left</span>}
            <div className="gallery-placeholder">
              <span className="gallery-placeholder-icon" aria-hidden="true">
                {IMAGES[currentImage].icon}
              </span>
              <div
                className="gallery-placeholder-lbl"
                style={{ whiteSpace: "pre-line" }}
              >
                {IMAGES[currentImage].label}
              </div>
            </div>
            <div className="gallery-dots" aria-label="Image gallery">
              {IMAGES.map((_, i) => (
                <button
                  key={i}
                  className={`gdot ${currentImage === i ? "on" : ""}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImage(i);
                  }}
                  aria-label={`Image ${i + 1}`}
                />
              ))}
            </div>
            <div className="gallery-hint" aria-hidden="true">
              Click to cycle images →
            </div>
          </div>

          {/* Thumbnails */}
          <div className="gallery-thumbs">
            <div
              className={`thumb ${currentImage === 0 ? "active" : ""}`}
              onClick={() => setCurrentImage(0)}
              style={{ background: "linear-gradient(135deg,#3A1C08,#A06020)" }}
              aria-label="Flat-lay hero image"
            >
              <span aria-hidden="true">📦</span>
              <span className="thumb-label">Flat-lay</span>
            </div>
            <div
              className={`thumb ${currentImage === 1 ? "active" : ""}`}
              onClick={() => setCurrentImage(1)}
              style={{ background: "linear-gradient(135deg,#2A1208,#7A4018)" }}
              aria-label="All items laid out"
            >
              <span aria-hidden="true">🪔</span>
              <span className="thumb-label">All items</span>
            </div>
            <div
              className={`thumb ${currentImage === 2 ? "active" : ""}`}
              onClick={() => setCurrentImage(2)}
              style={{ background: "linear-gradient(135deg,#1C0E06,#5A2A14)" }}
              aria-label="Kit packaging"
            >
              <span aria-hidden="true">🎁</span>
              <span className="thumb-label">Packaging</span>
            </div>
          </div>
        </div>

        {/* Right: Sticky Purchase Panel */}
        <div className="purchase-panel" role="complementary" aria-label="Purchase options">
          {/* Identity */}
          <div className="identity-block">
            <div className="id-occ" style={{ textTransform: "capitalize" }}>
              {kit.occ} · {kit.deity} · 2026
            </div>
            <h1 className="id-name">{kit.name}</h1>
            {kit.hindi && <div className="id-hindi">{kit.hindi}</div>}
            <div className="id-source-row">
              <div className="id-source-pill">
                <span aria-hidden="true">📜</span> Devi Bhagavatam sourced
              </div>
              <div className="id-source-pill">
                <span aria-hidden="true">🛡</span> Vidhi-verified · {kit.itemsCount}
              </div>
            </div>
          </div>

          {/* Price */}
          <div className="price-block">
            <div className="price-row">
              <span className="price-main">₹{kit.price.toLocaleString()}</span>
              {kit.mrp && <span className="price-mrp">₹{kit.mrp.toLocaleString()}</span>}
              {kit.mrp && (
                <span className="price-save">
                  Save ₹{(kit.mrp - kit.price).toLocaleString()} ·{" "}
                  {Math.round(((kit.mrp - kit.price) / kit.mrp) * 100)}% off
                </span>
              )}
            </div>
            <div className="price-note">Live price · UPI and card accepted · No COD</div>
          </div>

          {/* Low Stock Alert */}
          {kit.inStock ? (
            <>
              {kit.stockLeft && (
                <div className="low-stock-bar" role="alert">
                  <span className="ls-icon" aria-hidden="true">
                    ⚠
                  </span>
                  <span className="ls-text">Only {kit.stockLeft} left at this price</span>
                  <button className="ls-cta" onClick={handleAddToCart}>
                    Add to cart →
                  </button>
                </div>
              )}

              {/* Primary CTAs */}
              <div className="cta-row">
                <button className="cta-cart" onClick={handleAddToCart}>
                  🛒 Add to cart
                </button>
                <button className="cta-buy" onClick={handleBuyNow}>
                  ⚡ Buy now — ₹{kit.price.toLocaleString()}
                </button>
              </div>
            </>
          ) : (
            <div className="cta-row">
              <button className="cta-cart" style={{ background: "var(--sub-text)", cursor: "not-allowed" }} disabled>
                Sold out
              </button>
              <button
                className="cta-buy"
                onClick={() => triggerToast(`Alert set! We will notify you when ${kit.name} is in stock.`)}
              >
                🔔 Notify me
              </button>
            </div>
          )}

          {/* Utility Actions */}
          <div className="utility-row" role="toolbar" aria-label="Additional actions">
            <button
              className="util-btn"
              onClick={() => triggerToast(`Opening ${kit.name} ritual guide...`)}
              aria-label="Read the ritual guide"
            >
              <span className="util-icon pink" aria-hidden="true">
                📖
              </span>
              <span className="util-label">Read guide</span>
            </button>
            <button
              className="util-btn"
              onClick={() => triggerToast("Opening Tapa Circle WhatsApp reminders subscription...")}
              aria-label="Get WhatsApp reminders"
            >
              <span className="util-icon green" aria-hidden="true">
                💬
              </span>
              <span className="util-label">Reminders</span>
            </button>
            <button
              className="util-btn"
              onClick={() => triggerToast(`Downloading ${kit.name} ritual card PDF...`)}
              aria-label="Download ritual card"
            >
              <span className="util-icon neutral" aria-hidden="true">
                ⬇
              </span>
              <span className="util-label">Download</span>
            </button>
            <button className="util-btn" onClick={handleShare} aria-label="Share this kit">
              <span className="util-icon neutral" aria-hidden="true">
                ↗
              </span>
              <span className="util-label">Share</span>
            </button>
          </div>

          {/* Trust Pills */}
          <div className="trust-pills" aria-label="Trust signals">
            <div className="tpill">
              <span className="tp-icon" aria-hidden="true">
                📜
              </span>{" "}
              Shiva Purana sourced
            </div>
            <div className="tpill">
              <span className="tp-icon" aria-hidden="true">
                🛡
              </span>{" "}
              Vidhi-verified items
            </div>
            <div className="tpill">
              <span className="tp-icon" aria-hidden="true">
                🔄
              </span>{" "}
              Exchange on wrong item
            </div>
            <div className="tpill">
              <span className="tp-icon" aria-hidden="true">
                🔒
              </span>{" "}
              Secure payment
            </div>
          </div>

          {/* Pincode Check */}
          <div className="pin-card">
            <div className="pin-title">📍 Check delivery to your pincode</div>
            <div className="pin-row">
              <input
                className="pin-input"
                type="text"
                inputMode="numeric"
                placeholder="Enter pincode"
                maxLength={6}
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                onKeyDown={(e) => {
                  if (e.key === "Enter") checkPin();
                }}
                aria-label="Enter pincode"
              />
              <button className="pin-go" onClick={checkPin}>
                Check delivery
              </button>
            </div>
            {pinResult.status !== "idle" && (
              <div className={`pin-result ${pinResult.status === "ok" ? "ok" : "fail"}`}>
                <span>{pinResult.status === "ok" ? "✓" : "⚠"}</span>
                {pinResult.message}
              </div>
            )}
          </div>

          {/* Delivery Promise */}
          <div className="delivery-card">
            <span className="del-icon" aria-hidden="true">
              🚚
            </span>
            <div>
              <div className="del-title">Delivered before your festival begins</div>
              <div className="del-sub">{kit.delivery}</div>
              <div className="del-city">
                Delhi–NCR: within 48 hrs · Mumbai, Bangalore, Pune: 3-4 days · Other cities: contact us
              </div>
            </div>
          </div>

          {/* Exchange Policy */}
          <div className="exc-strip">
            <span className="exc-icon" aria-hidden="true">
              🔄
            </span>
            <span className="exc-text">
              Wrong item or damaged? We&apos;ll exchange it — raise a request within 48 hours of delivery with
              a photo.{" "}
              <span
                className="exc-link"
                role="button"
                tabIndex={0}
                onClick={() => triggerToast("Opening exchange policy...")}
              >
                Exchange policy →
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* Full-Width Content Below */}
      <div className="content-below">
        {/* Contents Header */}
        <div className="sec-head">
          <h2 className="sec-title">
            <span className="sec-plus" aria-hidden="true">
              +
            </span>{" "}
            What&apos;s in this kit
          </h2>
          <span className="sec-meta">{kit.itemsCount} · Every item has a ritual purpose</span>
        </div>

        {/* Contents Grid */}
        <div className="contents-layout">
          <div className="contents-card">
            <div className="contents-hd">
              <span className="contents-hd-l">Samagri</span>
              <span className="contents-hd-r">Every item has a ritual purpose</span>
            </div>
            <div id="itemsVisible">
              <div className="c-item">
                <div className="c-dot" aria-hidden="true" />
                <span className="c-name">Gangajal (250 ml)</span>
                <span className="c-purpose">Abhishek</span>
              </div>
              <div className="c-item">
                <div className="c-dot" aria-hidden="true" />
                <span className="c-name">Sindoor</span>
                <span className="c-purpose">Devi offering</span>
              </div>
              <div className="c-item">
                <div className="c-dot" aria-hidden="true" />
                <span className="c-name">Kalash, brass 6&quot;</span>
                <span className="c-purpose">Ghatasthapana vessel</span>
              </div>
              <div className="c-item">
                <div className="c-dot" aria-hidden="true" />
                <span className="c-name">Mango leaves (11)</span>
                <span className="c-purpose">Kalash adornment</span>
              </div>
              <div className="c-item">
                <div className="c-dot" aria-hidden="true" />
                <span className="c-name">Jau — barley seeds (100 g)</span>
                <span className="c-purpose">Navratri sowing</span>
              </div>
            </div>

            {itemsExpanded && (
              <div id="itemsHidden">
                <div className="c-item">
                  <div className="c-dot" aria-hidden="true" />
                  <span className="c-name">Coconut (1)</span>
                  <span className="c-purpose">Kalash top</span>
                </div>
                <div className="c-item">
                  <div className="c-dot" aria-hidden="true" />
                  <span className="c-name">Kumkum (30 g)</span>
                  <span className="c-purpose">Tilak and offering</span>
                </div>
                <div className="c-item">
                  <div className="c-dot" aria-hidden="true" />
                  <span className="c-name">Akshata — coloured rice</span>
                  <span className="c-purpose">Puja offerings</span>
                </div>
                <div className="c-item">
                  <div className="c-dot" aria-hidden="true" />
                  <span className="c-name">Panchamrit set</span>
                  <span className="c-purpose">Milk, curd, honey, ghee, sugar</span>
                </div>
                <div className="c-item">
                  <div className="c-dot" aria-hidden="true" />
                  <span className="c-name">Mogra incense (10 sticks)</span>
                  <span className="c-purpose">Daily puja</span>
                </div>
                <div className="c-item">
                  <div className="c-dot" aria-hidden="true" />
                  <span className="c-name">Deepak, clay — set of 9</span>
                  <span className="c-purpose">Nine nights lighting</span>
                </div>
                <div className="c-item">
                  <div className="c-dot" aria-hidden="true" />
                  <span className="c-name">Ghee (50 g)</span>
                  <span className="c-purpose">Deepak fuel</span>
                </div>
                <div className="c-item">
                  <div className="c-dot" aria-hidden="true" />
                  <span className="c-name">Red cloth (1 yard)</span>
                  <span className="c-purpose">Altar dressing</span>
                </div>
                <div className="c-item">
                  <div className="c-dot" aria-hidden="true" />
                  <span className="c-name">Red flowers, dried</span>
                  <span className="c-purpose">Devi offering</span>
                </div>
                <div className="c-item">
                  <div className="c-dot" aria-hidden="true" />
                  <span className="c-name">Durva grass</span>
                  <span className="c-purpose">Ganesh puja</span>
                </div>
                <div className="c-item">
                  <div className="c-dot" aria-hidden="true" />
                  <span className="c-name">Ritual card — Navratri Ghatasthapana</span>
                  <span className="c-purpose">Vidhi inside kit</span>
                </div>
              </div>
            )}

            <div className="show-more-row">
              <button
                className={`show-more-btn ${itemsExpanded ? "open" : ""}`}
                onClick={() => setItemsExpanded(!itemsExpanded)}
                aria-expanded={itemsExpanded}
                aria-controls="itemsHidden"
              >
                {itemsExpanded ? "Show less" : "Show all 16 items"}{" "}
                <span className="show-more-icon" aria-hidden="true">
                  ▾
                </span>
              </button>
            </div>
          </div>

          {/* Sourcing Context Panel */}
          <div className="contents-context">
            <div>
              <div className="ctx-head">Sourced for ritual integrity</div>
              <div className="ctx-sub">
                Every item in this kit was selected against the traditional vidhi. The quantities,
                materials, and specifications are not guesswork — they follow what the source text
                prescribes for the ritual to be complete.
              </div>
            </div>
            <div className="ctx-source">
              <span className="ctx-source-icon" aria-hidden="true">
                📜
              </span>
              <div>
                <div className="ctx-source-label">Devi Bhagavatam</div>
                <div className="ctx-source-sub">Navratri Ghatasthapana chapter · Confidence score 4/5</div>
              </div>
              <span
                className="ctx-source-link"
                onClick={() => triggerToast("Opening Devi Bhagavatam reference guide...")}
              >
                Read source →
              </span>
            </div>
            <div className="ctx-source">
              <span className="ctx-source-icon" aria-hidden="true">
                🗺
              </span>
              <div>
                <div className="ctx-source-label">Sourcing origins</div>
                <div className="ctx-source-sub">
                  Gangajal — Haridwar · Brass Kalash — Moradabad · Deepak — Khurja
                </div>
              </div>
            </div>
            <div className="ctx-source">
              <span className="ctx-source-icon" aria-hidden="true">
                🔄
              </span>
              <div>
                <div className="ctx-source-label">Exchange policy</div>
                <div className="ctx-source-sub">
                  Wrong item or damaged — exchange within 48 hours of delivery with a photo. No returns on
                  consumable puja items.
                </div>
              </div>
              <span className="ctx-source-link" onClick={() => triggerToast("Opening exchange policy...")}>
                Details →
              </span>
            </div>
          </div>
        </div>

        <div className="divider" />

        {/* Nudges */}
        <div className="sec-head">
          <h2 className="sec-title">
            <span className="sec-plus" aria-hidden="true">
              +
            </span>{" "}
            Before you begin
          </h2>
        </div>
        <div className="nudge-row">
          <div
            className="guide-nudge"
            onClick={() => triggerToast(`Opening complete ${kit.name} guide...`)}
            role="button"
            tabIndex={0}
            aria-label="Read the complete guide"
          >
            <div className="gn-icon-wrap" aria-hidden="true">
              📖
            </div>
            <div className="gn-body">
              <div className="gn-title">Read the complete {kit.name} guide</div>
              <div className="gn-sub">
                Step-by-step vidhi, mantras, and the significance of every item in this kit — sourced from scriptures
              </div>
            </div>
            <span className="gn-arrow" aria-hidden="true">
              ›
            </span>
          </div>
          <div
            className="wa-nudge"
            onClick={() => triggerToast("Subscribing to WhatsApp reminders...")}
            role="button"
            tabIndex={0}
            aria-label="Get WhatsApp reminders"
          >
            <div className="wan-icon-wrap" aria-hidden="true">
              💬
            </div>
            <div className="wan-body">
              <div className="wan-title">Get reminded for Navratri — and every ritual after</div>
              <div className="wan-sub">
                Weekly Panchang · Eve-of vrat alerts · Tapa Circle — ₹499/year
              </div>
            </div>
            <span className="wan-arrow" aria-hidden="true">
              ›
            </span>
          </div>
        </div>

        <div className="divider" />

        {/* Dharma Note */}
        <div className="dharma-card">
          <div>
            <div className="dharma-badge">🛡 Tapa editorial standard</div>
            <h2 className="dharma-title">Every item is included for a reason</h2>
            <p className="dharma-body">
              The sourcing list, quantities, and purposes in this kit are verified against the{" "}
              <strong>traditional vidhi</strong> from scripture. No filler. No generic
              puja items added for weight. If it&apos;s in this kit, it has a named place in the ritual.
            </p>
            <div className="dharma-source">
              <span className="dharma-source-icon" aria-hidden="true">
                📜
              </span>
              <span className="dharma-source-text">Devi Bhagavatam &amp; Related Puranic texts</span>
              <span
                className="dharma-source-link"
                role="button"
                tabIndex={0}
                onClick={() => triggerToast("Opening scripture reference guide...")}
              >
                Read source →
              </span>
            </div>
          </div>
          <div className="dharma-right">
            <div className="dharma-principles">
              <div className="dp-item">
                <div className="dp-dot" />
                <div className="dp-text">
                  <strong>Knowledge before commerce.</strong> The guide to this ritual exists whether or not
                  you buy this kit.
                </div>
              </div>
              <div className="dp-item">
                <div className="dp-dot" />
                <div className="dp-text">
                  <strong>Fear will never be our strategy.</strong> Every claim in this kit is tagged as
                  Dharma, Pratha, or Bhranti — source named, context given.
                </div>
              </div>
              <div className="dp-item">
                <div className="dp-dot" />
                <div className="dp-text">
                  <strong>Devotion is the measure, not difficulty.</strong> A sincere offering with what you
                  have is a complete act of puja.
                </div>
              </div>
              <div className="dp-item">
                <div className="dp-dot" />
                <div className="dp-text">
                  <strong>Humility is non-negotiable.</strong> No company owns Dharma. We are students
                  before we are builders.
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="divider" />

        {/* Related Kits */}
        <div className="sec-head">
          <h2 className="sec-title">
            <span className="sec-plus" aria-hidden="true">
              +
            </span>{" "}
            You may also need
          </h2>
          <button className="sec-link" onClick={() => router.push("/ritual-kits")}>
            See all kits →
          </button>
        </div>
        <div className="related-grid">
          <div className="rel-card" onClick={() => router.push("/ritual-kits/shakti-aradhana")}>
            <div className="rel-img" style={{ background: "linear-gradient(135deg,#1A2A4A,#3A5A8A)" }}>
              <span className="rel-img-icon" aria-hidden="true">
                ✨
              </span>
            </div>
            <div className="rel-body">
              <div className="rel-occ">Navratri</div>
              <div className="rel-name">Shakti Aradhana</div>
              <div className="rel-items">12 items · Low stock</div>
              <div className="rel-price-row">
                <span className="rel-price">₹2,199</span>
                <span className="rel-mrp">₹2,600</span>
              </div>
              <button
                className="rel-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  triggerToast("Added Shakti Aradhana to your cart!");
                }}
              >
                Add to cart
              </button>
            </div>
          </div>
          <div className="rel-card" onClick={() => router.push("/ritual-kits/yajna")}>
            <div className="rel-img" style={{ background: "linear-gradient(135deg,#3A2A08,#7A5A18)" }}>
              <span className="rel-img-icon" aria-hidden="true">
                🔥
              </span>
            </div>
            <div className="rel-body">
              <div className="rel-occ">Havan · Year-round</div>
              <div className="rel-name">Yajña</div>
              <div className="rel-items">8 items</div>
              <div className="rel-price-row">
                <span className="rel-price">₹1,209</span>
                <span className="rel-mrp">₹1,400</span>
              </div>
              <button
                className="rel-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  triggerToast("Added Yajña to your cart!");
                }}
              >
                Add to cart
              </button>
            </div>
          </div>
          <div className="rel-card" onClick={() => router.push("/ritual-kits/panch-jyoti")}>
            <div className="rel-img" style={{ background: "linear-gradient(135deg,#3A1A3A,#6A2A6A)" }}>
              <span className="rel-img-icon" aria-hidden="true">
                🎁
              </span>
            </div>
            <div className="rel-body">
              <div className="rel-occ">Gift · Festive</div>
              <div className="rel-name">Panch Jyoti Gift Tray</div>
              <div className="rel-items">5 items · Gift-ready</div>
              <div className="rel-price-row">
                <span className="rel-price">₹659</span>
                <span className="rel-mrp">₹799</span>
              </div>
              <button
                className="rel-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  triggerToast("Added Panch Jyoti Gift Tray to your cart!");
                }}
              >
                Add to cart
              </button>
            </div>
          </div>
        </div>

        <div className="divider" />

        {/* Guides for Occasion */}
        <div className="sec-head">
          <h2 className="sec-title">
            <span className="sec-plus" aria-hidden="true">
              +
            </span>{" "}
            Guides for this occasion
          </h2>
          <button className="sec-link" onClick={() => triggerToast("Opening all Navratri guides...")}>
            See all Navratri guides →
          </button>
        </div>
        <div className="guides-grid">
          <div
            className="guide-card"
            onClick={() => triggerToast("Opening Navratri Ghatasthapana guide...")}
          >
            <div className="guide-img" style={{ background: "linear-gradient(135deg,#2A1A08,#5A3A18)" }}>
              <span className="guide-dpb-tag d">Dharma</span>
              <span className="guide-img-icon" aria-hidden="true">
                🔥
              </span>
            </div>
            <div className="guide-body">
              <div className="guide-date">5 Oct 2026</div>
              <div className="guide-name">Navratri Ghatasthapana</div>
              <button className="guide-read-btn">📖 Read guide</button>
            </div>
          </div>
          <div className="guide-card" onClick={() => triggerToast("Opening Navratri Vrat guide...")}>
            <div className="guide-img" style={{ background: "linear-gradient(135deg,#1A0A2A,#3A1A5A)" }}>
              <span className="guide-dpb-tag d">Dharma</span>
              <span className="guide-img-icon" aria-hidden="true">
                🌙
              </span>
            </div>
            <div className="guide-body">
              <div className="guide-date">5–13 Oct 2026</div>
              <div className="guide-name">Navratri Vrat — nine nights</div>
              <button className="guide-read-btn">📖 Read guide</button>
            </div>
          </div>
          <div className="guide-card" onClick={() => triggerToast("Opening Dussehra guide...")}>
            <div className="guide-img" style={{ background: "linear-gradient(135deg,#0A1A2A,#1A3A5A)" }}>
              <span className="guide-dpb-tag p">Pratha</span>
              <span className="guide-img-icon" aria-hidden="true">
                ⚔
              </span>
            </div>
            <div className="guide-body">
              <div className="guide-date">13 Oct 2026</div>
              <div className="guide-name">Dussehra</div>
              <button className="guide-read-btn">📖 Read guide</button>
            </div>
          </div>
        </div>

        {/* Deity Cluster Divider */}
        <div className="cluster-divider">
          <div className="cluster-line" />
          <span className="cluster-pill">More from Devi · Shakti cluster</span>
          <div className="cluster-line" />
        </div>
        <div className="guides-grid">
          <div className="guide-card" onClick={() => triggerToast("Opening Hariyali Teej guide...")}>
            <div className="guide-img" style={{ background: "linear-gradient(135deg,#1A3A1A,#2A6A2A)" }}>
              <span className="guide-dpb-tag d">Dharma</span>
              <span className="guide-img-icon" aria-hidden="true">
                🌿
              </span>
            </div>
            <div className="guide-body">
              <div className="guide-date">15 Aug 2026</div>
              <div className="guide-name">Hariyali Teej</div>
              <button className="guide-read-btn">📖 Read guide</button>
            </div>
          </div>
          <div className="guide-card" onClick={() => triggerToast("Opening Kajari Teej guide...")}>
            <div className="guide-img" style={{ background: "linear-gradient(135deg,#2A1A08,#5A3A18)" }}>
              <span className="guide-dpb-tag m">Mixed</span>
              <span className="guide-img-icon" aria-hidden="true">
                ⭐
              </span>
            </div>
            <div className="guide-body">
              <div className="guide-date">23 Aug 2026</div>
              <div className="guide-name">Kajari Teej</div>
              <button className="guide-read-btn">📖 Read guide</button>
            </div>
          </div>
          <div className="guide-card">
            <div className="guide-img" style={{ background: "linear-gradient(135deg,#3A1A08,#6A3A18)" }}>
              <span className="guide-dpb-tag d">Dharma</span>
              <span className="guide-img-icon" aria-hidden="true">
                ✨
              </span>
            </div>
            <div className="guide-body">
              <div className="guide-date">Coming soon</div>
              <div className="guide-name">Durga Puja</div>
              <button className="guide-read-btn soon" disabled>
                🕐 Coming soon
              </button>
            </div>
          </div>
        </div>

        <div className="divider" />

        {/* Chat CTA */}
        <div className="chat-cta" role="complementary" aria-label="WhatsApp support">
          <div className="chat-icon-wrap" aria-hidden="true">
            💬
          </div>
          <div className="chat-body">
            <div className="chat-title">Not sure which kit is right for your puja?</div>
            <div className="chat-sub">
              Tell us the occasion, deity, or budget — we&apos;ll point you to the right kit. Usually responds
              within a few hours.
            </div>
          </div>
          <div className="chat-right">
            <button
              className="chat-btn"
              onClick={() => window.open("https://wa.me/9100000000", "_blank")}
            >
              <span aria-hidden="true">💬</span> Chat with us on WhatsApp
            </button>
            <div className="chat-note">Opens WhatsApp · Free · No commitment</div>
          </div>
        </div>
      </div>

      {/* Brand Footer */}
      <Footer onTriggerToast={triggerToast} />

      {/* Premium Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[100] bg-[#1C1712] text-white border border-white/10 px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-bounce font-sans text-xs select-none">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D4175A] animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
