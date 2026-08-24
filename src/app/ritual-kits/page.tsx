"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import TopNav from "@/components/layout/TopNav";
import Footer from "@/components/layout/Footer";
import { useCartStore } from "@/lib/store/cartStore";
import { trackPageView, trackAddToCart, trackProductView } from "@/lib/analytics";
import { Loader2 } from "lucide-react";

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
  isFeatured?: boolean;
}

interface DBProduct extends Omit<Product, "price" | "mrp"> {
  price: string;
  mrp?: string | null;
}

export default function RitualKitsPLP() {
  const router = useRouter();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  
  const addToCartStore = useCartStore((state) => state.addToCart);

  
  const [activeOccasionTab, setActiveOccasionTab] = useState<string>("all");
  const [selectedOccasions, setSelectedOccasions] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>(["PUJA_KIT", "SAMAGRI_ITEM"]);
  const [priceMin, setPriceMin] = useState<string>("0");
  const [priceMax, setPriceMax] = useState<string>("5000");
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>("recommended");

  
  const [sectionsCollapsed, setSectionsCollapsed] = useState({
    type: false,
    occasion: false,
    price: false,
    availability: false,
    deity: false,
  });

  const triggerToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const toggleSection = (sec: "type" | "occasion" | "price" | "availability" | "deity") => {
    setSectionsCollapsed((prev) => ({ ...prev, [sec]: !prev[sec] }));
  };

  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    trackPageView("/ritual-kits");
  }, []);

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetch("/api/public/products");
        if (res.ok) {
          const data = await res.json();
          
          const mapped = (data as DBProduct[]).map((p) => ({
            ...p,
            price: Number(p.price),
            mrp: p.mrp ? Number(p.mrp) : undefined,
            isFeatured: p.slug === "shubh-sampada",
          }));
          setProducts(mapped);
        }
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  const handleToggleOccasion = (occ: string) => {
    setSelectedOccasions((prev) =>
      prev.includes(occ) ? prev.filter((o) => o !== occ) : [...prev, occ]
    );
  };

  const handleToggleType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleResetFilters = () => {
    setSelectedOccasions([]);
    setSelectedTypes(["PUJA_KIT", "SAMAGRI_ITEM"]);
    setPriceMin("0");
    setPriceMax("5000");
    setInStockOnly(false);
    setActiveOccasionTab("all");
  };

  
  const filteredProducts = useMemo(() => {
    let result = products;

    
    if (activeOccasionTab !== "all") {
      result = result.filter((prod) => prod.category === activeOccasionTab);
    }

    
    if (selectedOccasions.length > 0) {
      result = result.filter((prod) => selectedOccasions.includes(prod.category));
    }

    
    if (selectedTypes.length > 0) {
      result = result.filter((prod) => selectedTypes.includes(prod.type));
    }

    
    if (inStockOnly) {
      result = result.filter((prod) => prod.stock > 0);
    }

    
    const minVal = parseFloat(priceMin) || 0;
    const maxVal = parseFloat(priceMax) || 99999;
    result = result.filter((prod) => prod.price >= minVal && prod.price <= maxVal);

    
    if (sortBy === "price-low") {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      result = [...result].sort((a, b) => b.price - a.price);
    } else if (sortBy === "new") {
      result = [...result].sort((a, b) => b.id.localeCompare(a.id));
    }

    return result;
  }, [products, activeOccasionTab, selectedOccasions, selectedTypes, inStockOnly, priceMin, priceMax, sortBy]);

  
  const featuredProduct = useMemo(() => {
    return products.find((prod) => prod.isFeatured);
  }, [products]);

  
  const showFeaturedCard = useMemo(() => {
    if (!featuredProduct) return false;
    if (activeOccasionTab !== "all" && activeOccasionTab !== "navratri") return false;
    if (selectedOccasions.length > 0 && !selectedOccasions.includes("navratri")) return false;
    if (!selectedTypes.includes("PUJA_KIT")) return false;
    const minVal = parseFloat(priceMin) || 0;
    const maxVal = parseFloat(priceMax) || 99999;
    if (featuredProduct.price < minVal || featuredProduct.price > maxVal) return false;
    if (inStockOnly && featuredProduct.stock <= 0) return false;

    return true;
  }, [featuredProduct, activeOccasionTab, selectedOccasions, selectedTypes, priceMin, priceMax, inStockOnly]);

  const handleAddToCart = (e: React.MouseEvent, prod: Product) => {
    e.stopPropagation();
    addToCartStore(prod.id, 1, {
      name: prod.name,
      price: prod.price,
      image: prod.images?.[0] || undefined,
      category: prod.category,
      codAvailability: prod.codAvailability,
    });
    
    trackAddToCart(prod.id, prod.name, prod.price, 1, prod.category);
    triggerToast(`Added ${prod.name} to your cart!`);
  };

  const handleNotifyMe = (e: React.MouseEvent, name: string) => {
    e.stopPropagation();
    triggerToast(`Alert set! We will notify you when ${name} is back in stock.`);
  };

  const handleWhatsAppSupport = () => {
    window.open("https://wa.me/9100000000", "_blank");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg text-body-text font-sans antialiased plp-container flex flex-col justify-between">
        <div>
          <AnnouncementBar />
          <TopNav activeTab="Ritual Kits" onTriggerToast={triggerToast} />
          <div className="flex items-center justify-center py-40">
            <Loader2 className="w-8 h-8 animate-spin text-[#C82A54]" />
          </div>
        </div>
        <Footer onTriggerToast={triggerToast} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg text-body-text font-sans antialiased plp-container">
      
      <AnnouncementBar />

      
      <TopNav activeTab="Ritual Kits" onTriggerToast={triggerToast} />

      
      <div className="breadcrumb-bar select-none">
        <div className="wrap">
          <a href="/" className="hover:underline">Home</a>
          <span className="bc-sep">›</span>
          <span className="bc-current">Ritual Kits</span>
        </div>
      </div>

      
      <div className="page-hero select-none">
        <div className="wrap">
          <div className="hero-inner">
            <div className="hero-top-row">
              <div className="hero-text">
                <div className="hero-eyebrow">+ SAMAGRI &amp; KITS · LIVE NOW · OCTOBER 2026</div>
                <h1 className="hero-title font-serif">Complete samagri.<br />At your door.</h1>
                <p className="hero-sub">Ritually correct Puja Kits and individual Samagri items, sourced from verified suppliers and delivered before your festival date. Every item has a named place in the vidhi.</p>
              </div>
              <div className="hero-stats">
                <div className="hstat">
                  <div className="hstat-num">{products.length}</div>
                  <div className="hstat-label">Products available</div>
                </div>
                <div className="hstat">
                  <div className="hstat-num">₹29</div>
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
                <span className="htrust-text">Cash on Delivery available</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      
      <div className="sticky top-[64px] z-40 bg-card border-b border-border w-full select-none">
        <div className="max-w-[var(--content-w)] mx-auto px-4 md:px-10 flex items-center justify-between h-12">
          <div className="flex gap-2 overflow-x-auto scrollbar-none whitespace-nowrap py-1 select-none w-full md:w-auto" role="tablist">
            {[
              { id: "all", label: "All Items" },
              { id: "navratri", label: "Navratri" },
              { id: "diwali", label: "Diwali" },
              { id: "satyanarayan", label: "Satyanarayan" },
              { id: "samagri", label: "Individual Samagri" },
              { id: "yearround", label: "Year-round" }
            ].map((tab) => (
              <button
                key={tab.id}
                role="tab"
                onClick={() => {
                  setActiveOccasionTab(tab.id);
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
          <div className="subnav-right flex gap-3">
            <button
              onClick={() => router.push("/kit-builder")}
              className="text-xs font-bold text-[#C82A54] bg-[#FFEAEF] hover:bg-[#FAD2DA] px-3.5 py-1.5 rounded-full transition-colors font-sans cursor-pointer"
            >
              🛠 Build Custom Kit
            </button>
          </div>
        </div>
      </div>

      
      <div className="max-w-[var(--content-w)] mx-auto px-4 md:px-10 py-7 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8 items-start w-full">
        
        
        <aside className="bg-card border border-border rounded-2xl overflow-hidden lg:sticky lg:top-[112px] flex flex-col w-full select-none" aria-label="Filter kits">
          <div className="sidebar-head">
            <span className="sidebar-title">FILTERS</span>
            <button className="sidebar-reset cursor-pointer font-bold" onClick={handleResetFilters}>Clear all</button>
          </div>

          
          <div className="sidebar-section">
            <div className="sidebar-sec-head" onClick={() => toggleSection("type")}>
              <span className="sidebar-sec-label">PRODUCT TYPE</span>
              <span className={`sidebar-chevron block font-bold ${!sectionsCollapsed.type ? "open" : ""}`}>›</span>
            </div>
            {!sectionsCollapsed.type && (
              <div className="sidebar-body font-sans">
                <div className="filter-opt" onClick={() => handleToggleType("PUJA_KIT")}>
                  <div className={`fopt-check ${selectedTypes.includes("PUJA_KIT") ? "checked" : ""}`}>✓</div>
                  <span className="fopt-label font-medium">Puja Kits</span>
                </div>
                <div className="filter-opt" onClick={() => handleToggleType("SAMAGRI_ITEM")}>
                  <div className={`fopt-check ${selectedTypes.includes("SAMAGRI_ITEM") ? "checked" : ""}`}>✓</div>
                  <span className="fopt-label font-medium">Individual Samagri</span>
                </div>
              </div>
            )}
          </div>

          
          <div className="sidebar-section">
            <div className="sidebar-sec-head" onClick={() => toggleSection("occasion")}>
              <span className="sidebar-sec-label">OCCASION / CATEGORY</span>
              <span className={`sidebar-chevron block font-bold ${!sectionsCollapsed.occasion ? "open" : ""}`}>›</span>
            </div>
            {!sectionsCollapsed.occasion && (
              <div className="sidebar-body">
                {[
                  { id: "navratri", label: "Navratri" },
                  { id: "diwali", label: "Diwali" },
                  { id: "satyanarayan", label: "Satyanarayan" },
                  { id: "samagri", label: "Samagri Items" },
                  { id: "yearround", label: "Year-round" }
                ].map((opt) => (
                  <div key={opt.id} className="filter-opt font-sans" onClick={() => handleToggleOccasion(opt.id)}>
                    <div className={`fopt-check ${selectedOccasions.includes(opt.id) ? "checked" : ""}`}>✓</div>
                    <span className="fopt-label font-medium">{opt.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          
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
                    type="number"
                    placeholder="₹ Min"
                    value={priceMin}
                    onChange={(e) => setPriceMin(e.target.value)}
                  />
                  <span className="price-sep">—</span>
                  <input
                    className="price-input"
                    type="number"
                    placeholder="₹ Max"
                    value={priceMax}
                    onChange={(e) => setPriceMax(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

          
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
              </div>
            )}
          </div>
        </aside>

        
        <div className="flex flex-col gap-4">
          
          
          <div className="early-bar font-sans select-none" role="note">
            <span className="early-bar-icon">🎁</span>
            <div>
              <div className="early-bar-t">Free Delivery Above ₹1,500</div>
              <div className="early-bar-s">Every item is ritually verified. Cash on Delivery (COD) active for checkout.</div>
            </div>
          </div>

          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 w-full select-none">
            <span className="results-count font-sans font-semibold">
              {filteredProducts.length} {filteredProducts.length === 1 ? "item" : "items"} available · Ships within 48 hrs
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

          
          {showFeaturedCard && featuredProduct && (
            <div
              className="bg-card border border-border rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-[1fr_320px] min-h-[220px] cursor-pointer transition-all hover:border-pink hover:shadow-lg w-full font-sans"
              onClick={() => router.push(`/ritual-kits/${featuredProduct.slug}`)}
              role="article"
              aria-label={`${featuredProduct.name} — featured kit`}
            >
              <div className="p-6 md:p-8 flex flex-col justify-center">
                <div className="featured-tag-row">
                  <span className="featured-bestseller">Bestseller</span>
                  <span className="featured-low-pill">⚡ Only {featuredProduct.stock} left</span>
                </div>
                <div className="featured-occ">{featuredProduct.category} · October 2026</div>
                <div className="featured-name font-serif">{featuredProduct.name}</div>
                <p className="featured-desc">{featuredProduct.description}</p>
                <div className="featured-price-row flex-wrap">
                  <span className="featured-price">₹{featuredProduct.price.toLocaleString()}</span>
                  {featuredProduct.mrp && <span className="featured-mrp">₹{featuredProduct.mrp.toLocaleString()}</span>}
                  {featuredProduct.mrp && (
                    <span className="featured-save font-bold">
                      Save ₹{featuredProduct.mrp - featuredProduct.price}
                    </span>
                  )}
                </div>
                <div className="featured-ctas">
                  <button
                    className="f-cart-btn font-bold cursor-pointer hover:opacity-95"
                    onClick={(e) => handleAddToCart(e, featuredProduct)}
                  >
                    🛒 Add to cart
                  </button>
                  <button
                    className="f-view-btn font-semibold cursor-pointer hover:bg-bg"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/ritual-kits/${featuredProduct.slug}`);
                    }}
                  >
                    View details →
                  </button>
                </div>
                <div className="featured-delivery text-xs font-semibold">🚚 Shipped before Navratri begins · Delhi-NCR by 30 Sept</div>
              </div>
              <div
                className="flex items-center justify-center p-6 md:p-8 h-48 md:h-auto font-sans select-none"
                style={{
                  backgroundImage: "url(/uploads/shubh-sampada.png)",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  backgroundColor: "#A06020",
                }}
                aria-label="Featured kit photo flatlay"
              />
            </div>
          )}

          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" role="list">
            {filteredProducts.filter((p) => p.slug !== "shubh-sampada").map((prod) => (
              <div
                key={prod.id}
                className={`kit-card font-sans ${prod.stock > 0 && prod.stock <= 4 ? "low-stock" : ""} ${prod.stock <= 0 ? "sold-out" : ""}`}
                role="listitem"
                onClick={() => {
                  
                  trackProductView(prod.id, prod.name, prod.price, prod.category);
                  router.push(`/ritual-kits/${prod.slug}`);
                }}
              >
                <div
                  className="kit-img select-none"
                  style={{
                    backgroundImage: prod.images?.[0]
                      ? `url(${prod.images[0]})`
                      : (prod.category === "diwali"
                          ? "linear-gradient(135deg,#3A2A08,#8A5A14)"
                          : prod.category === "satyanarayan"
                          ? "linear-gradient(135deg,#1A3A1A,#3A6A2A)"
                          : "linear-gradient(135deg,#1A2A4A,#3A5A8A)"),
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                  }}
                >
                  {prod.stock > 0 && prod.stock <= 4 && <span className="kit-ribbon low font-bold">⚡ {prod.stock} left</span>}
                  {prod.stock <= 0 && <span className="kit-ribbon soldout font-bold">Sold out</span>}
                  {!prod.images?.[0] && <span className="kit-img-icon text-white/20 font-bold">📦</span>}
                </div>
                <div className="kit-body">
                  <div className="kit-occ font-bold text-[10px] uppercase text-[#C82A54]">{prod.type.replace("_", " ")}</div>
                  <div className="kit-name font-bold text-dark">{prod.name}</div>
                  <div className="kit-items font-medium text-sub-text line-clamp-2 mt-1 min-h-[32px] text-xs">
                    {prod.description}
                  </div>

                  {prod.stock > 0 && prod.stock <= 4 && <div className="kit-low-warn text-[10px] font-bold">⚡ Only {prod.stock} left</div>}

                  <div className="kit-price-row">
                    <span className={`kit-price font-bold ${prod.stock <= 0 ? "text-sub-text" : ""}`}>
                      ₹{prod.price.toLocaleString()}
                    </span>
                    {prod.mrp && <span className="kit-mrp">₹{prod.mrp.toLocaleString()}</span>}
                  </div>

                  {prod.stock > 0 ? (
                    <button
                      className="kit-btn font-bold cursor-pointer hover:opacity-95"
                      onClick={(e) => handleAddToCart(e, prod)}
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
                        onClick={(e) => handleNotifyMe(e, prod.name)}
                      >
                        🔔 Notify when in stock
                      </button>
                    </>
                  )}
                  {prod.stock > 0 && <div className="kit-delivery font-semibold">🚚 Shipped in 48 hours</div>}
                </div>
              </div>
            ))}

            
            {filteredProducts.length === 0 && (
              <div className="empty-state visible font-sans select-none" role="status">
                <div className="empty-icon text-3xl">🔍</div>
                <div className="empty-title font-serif font-bold text-lg text-dark">No items match these filters</div>
                <div className="empty-sub text-sm mt-1 text-sub-text leading-relaxed">
                  Try adjusting the category, type, or price filters. More items are being added through 2026.
                </div>
                <button className="empty-reset cursor-pointer font-bold mt-4" onClick={handleResetFilters}>
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      
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

      
      <Footer onTriggerToast={triggerToast} />

      
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[100] bg-dark text-white border border-white/10 px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-bounce font-sans text-xs select-none">
          <span className="w-1.5 h-1.5 rounded-full bg-pink animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
