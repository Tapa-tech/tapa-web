"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import AnnouncementBar from "@/components/AnnouncementBar";
import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";
import { useCartStore } from "@/lib/store/cartStore";
import { trackPageView, trackAddToCart } from "@/lib/analytics";
import { Loader2, Plus, Minus, Sparkles } from "lucide-react";

interface SamagriProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  codAvailability: "AVAILABLE" | "NOT_AVAILABLE";
}

interface DBSamagriProduct extends Omit<SamagriProduct, "price"> {
  price: string;
}

export default function KitBuilderPage() {
  const router = useRouter();
  const addToCartStore = useCartStore((state) => state.addToCart);

  const [products, setProducts] = useState<SamagriProduct[]>([]);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Track page view
  useEffect(() => {
    trackPageView("/kit-builder");
  }, []);

  // Fetch Samagri items
  useEffect(() => {
    async function loadSamagri() {
      try {
        const res = await fetch("/api/public/products?type=SAMAGRI_ITEM");
        if (res.ok) {
          const data = await res.json();
          const mapped = (data as DBSamagriProduct[]).map((p) => ({
            ...p,
            price: Number(p.price),
          }));
          setProducts(mapped);
          
          // Initialize quantities to 0
          const initialQuants: { [key: string]: number } = {};
          mapped.forEach((p: SamagriProduct) => {
            initialQuants[p.id] = 0;
          });
          setQuantities(initialQuants);
        }
      } catch (err) {
        console.error("Failed to load samagri items:", err);
      } finally {
        setLoading(false);
      }
    }
    loadSamagri();
  }, []);

  const triggerToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleIncrement = (productId: string) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1,
    }));
  };

  const handleDecrement = (productId: string) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(0, (prev[productId] || 0) - 1),
    }));
  };

  // Calculate totals
  const totals = useMemo(() => {
    let count = 0;
    let subtotal = 0;
    const selectedItems: Array<{ itemName: string; itemFunction: string; quantity: number }> = [];

    products.forEach((prod) => {
      const qty = quantities[prod.id] || 0;
      if (qty > 0) {
        count += qty;
        subtotal += prod.price * qty;
        selectedItems.push({
          itemName: prod.name,
          itemFunction: prod.description || "General puja offering",
          quantity: qty,
        });
      }
    });

    return { count, subtotal, selectedItems };
  }, [products, quantities]);

  const handleAddKitToCart = () => {
    if (totals.count === 0) return;

    // Create a synthetic grouped kit entry
    const customKitId = `custom-kit-${Date.now()}`;
    const customKitDetails = {
      name: "Custom Samagri Puja Kit",
      price: totals.subtotal,
      image: undefined, // uses gradient fallback in mini-cart
      category: "custom",
      codAvailability: "AVAILABLE" as const, // Custom kits default to COD eligible
      isCustomKit: true,
      customKitItems: totals.selectedItems,
    };

    addToCartStore(customKitId, 1, customKitDetails);
    
    // Track analytics event
    trackAddToCart(customKitId, "Custom Samagri Puja Kit", totals.subtotal, 1, "custom");

    triggerToast("Your custom puja kit has been assembled and added to cart!");
    
    setTimeout(() => {
      router.push("/cart");
    }, 1200);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex flex-col">
        <AnnouncementBar />
        <TopNav activeTab="Ritual Kits" onTriggerToast={triggerToast} />
        <div className="flex-1 flex flex-col items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 text-[#C82A54] animate-spin" />
          <span className="text-[#8A7A6E] mt-3 font-semibold font-sans">Loading samagri inventory...</span>
        </div>
        <Footer onTriggerToast={triggerToast} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg text-body-text font-sans antialiased plp-container">
      <AnnouncementBar />
      <TopNav activeTab="Ritual Kits" onTriggerToast={triggerToast} />

      {/* Breadcrumb */}
      <div className="breadcrumb-bar select-none">
        <div className="wrap">
          <a href="/" className="hover:underline">Home</a>
          <span className="bc-sep">›</span>
          <a href="/ritual-kits" className="hover:underline">Ritual Kits</a>
          <span className="bc-sep">›</span>
          <span className="bc-current">Custom Kit Builder</span>
        </div>
      </div>

      {/* Page Hero */}
      <div className="page-hero select-none">
        <div className="wrap">
          <div className="hero-inner">
            <div className="hero-top-row">
              <div className="hero-text">
                <div className="hero-eyebrow">+ CUSTOM KIT BUILDER · RITUALLY SELECTIVE</div>
                <h1 className="hero-title font-serif">Compose Your Own<br />Samagri Kit.</h1>
                <p className="hero-sub">Don&apos;t need a full pre-packaged kit? Browse individual items, select specific quantities, and combine them into a single custom-assembled kit delivered straight to your door.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[var(--content-w)] mx-auto px-4 md:px-10 py-8 grid grid-cols-1 gap-6 pb-32">
        <div className="flex items-center gap-2 bg-[#FAF6EC] border border-[#EADFC9] rounded-2xl p-4 text-[#6A5A4E] text-xs font-semibold select-none">
          <Sparkles size={16} className="text-[#C82A54]" />
          <span>Each item is sourced from authentic spiritual clusters in Chandni Chowk, Haridwar, and Varanasi. Mapped correctly for shastric rituals.</span>
        </div>

        {/* Samagri Item Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((prod) => {
            const qty = quantities[prod.id] || 0;
            return (
              <div
                key={prod.id}
                className={`border rounded-2xl p-5 bg-card flex flex-col justify-between transition-all ${qty > 0 ? "border-[#C82A54] shadow-md bg-[#FFEAEF]/5" : "border-border hover:border-pink"}`}
              >
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-serif font-bold text-base text-dark">{prod.name}</h3>
                    <span className="font-bold text-sm text-[#C82A54] shrink-0">₹{prod.price}</span>
                  </div>
                  <p className="text-xs text-sub-text mt-1.5 leading-relaxed min-h-[48px] line-clamp-3">
                    {prod.description}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-5 pt-3 border-t border-[#F2ECE4]">
                  <span className="text-[10px] uppercase font-bold text-[#8A7A6E]">Quantity</span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleDecrement(prod.id)}
                      disabled={qty === 0}
                      className="w-8 h-8 rounded-xl border border-border bg-white flex items-center justify-center text-dark hover:bg-bg disabled:opacity-30 cursor-pointer select-none"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="font-bold text-sm w-4 text-center select-none">{qty}</span>
                    <button
                      onClick={() => handleIncrement(prod.id)}
                      className="w-8 h-8 rounded-xl border border-border bg-white flex items-center justify-center text-dark hover:bg-bg cursor-pointer select-none"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Bottom Summary Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border shadow-2xl py-4 px-6 md:px-10 select-none">
        <div className="max-w-[var(--content-w)] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left font-sans">
            <div className="text-xs text-sub-text font-semibold">ASSEMBLING CUSTOM KIT</div>
            <div className="flex items-center justify-center sm:justify-start gap-3 mt-0.5">
              <span className="font-serif font-bold text-xl text-dark">
                ₹{totals.subtotal.toLocaleString()}
              </span>
              <span className="text-xs text-[#8A7A6E] font-bold">
                ({totals.count} items selected)
              </span>
            </div>
          </div>

          <button
            onClick={handleAddKitToCart}
            disabled={totals.count === 0}
            className="w-full sm:w-auto bg-[#C82A54] hover:bg-[#B02047] disabled:bg-gray-400 text-white border-none rounded-xl px-8 py-3.5 font-semibold text-sm transition-colors cursor-pointer select-none flex items-center justify-center gap-2"
          >
            <span>📦</span>
            <span>Add Custom Kit to Cart</span>
          </button>
        </div>
      </div>

      <Footer onTriggerToast={triggerToast} />

      {/* Premium Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-24 right-6 z-[100] bg-dark text-white border border-white/10 px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-bounce font-sans text-xs select-none">
          <span className="w-1.5 h-1.5 rounded-full bg-pink animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
