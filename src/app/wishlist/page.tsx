"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AnnouncementBar from "@/components/AnnouncementBar";
import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";
import { useCartStore } from "@/lib/store/cartStore";
import { Loader2, Trash2, ShoppingCart, Heart, ArrowLeft } from "lucide-react";
import { trackAddToCart } from "@/lib/analytics";

interface WishlistItem {
  id: string;
  productId: string;
  product: {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: string;
    images: string[];
    category: string;
    codAvailability: "AVAILABLE" | "NOT_AVAILABLE";
  };
}

export default function WishlistPage() {
  const router = useRouter();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Zustand Store
  const { addToCart, checkAuth } = useCartStore();

  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  const triggerToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    async function loadWishlist() {
      setLoading(true);
      try {
        const isAuthed = await checkAuth();
        if (!isAuthed) {
          triggerToast("Login required to view your wishlist.");
          router.push("/?login=true");
          return;
        }

        const res = await fetch("/api/wishlist");
        if (res.ok) {
          const data = await res.json();
          setItems(data || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadWishlist();
  }, [checkAuth, router]);

  const handleRemove = async (productId: string, productName: string) => {
    try {
      const res = await fetch(`/api/wishlist?productId=${productId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setItems((prev) => prev.filter((item) => item.productId !== productId));
        triggerToast(`Removed ${productName} from your wishlist.`);
      } else {
        triggerToast("Failed to remove item.");
      }
    } catch (e) {
      console.error(e);
      triggerToast("Error removing item.");
    }
  };

  const handleMoveToCart = async (item: WishlistItem) => {
    try {
      // Add to cart store
      const priceVal = Number(item.product.price);
      addToCart(item.productId, 1, {
        name: item.product.name,
        price: priceVal,
        image: item.product.images?.[0] || undefined,
        category: item.product.category,
        codAvailability: item.product.codAvailability,
      });

      // Track analytics
      trackAddToCart(item.productId, item.product.name, priceVal, 1, item.product.category);

      // Remove from wishlist database
      await fetch(`/api/wishlist?productId=${item.productId}`, {
        method: "DELETE",
      });

      // Update state
      setItems((prev) => prev.filter((i) => i.productId !== item.productId));

      triggerToast(`Moved ${item.product.name} to your cart!`);
    } catch (e) {
      console.error(e);
      triggerToast("Failed to move item to cart.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex flex-col font-sans">
        <AnnouncementBar />
        <TopNav activeTab="Ritual Kits" onTriggerToast={triggerToast} />
        <div className="flex-1 flex flex-col items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 text-[#C82A54] animate-spin" />
          <span className="text-[#8A7A6E] mt-3 font-semibold">Loading your wishlist...</span>
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
          <span className="bc-current">Wishlist</span>
        </div>
      </div>

      <div className="max-w-[var(--content-w)] mx-auto px-4 md:px-10 py-8 pb-20">
        <h1 className="font-serif font-bold text-3xl text-dark mb-6">Saved Items</h1>

        {items.length === 0 ? (
          <div className="text-center py-16 bg-card border border-border rounded-2xl p-8 max-w-lg mx-auto select-none">
            <Heart size={48} className="mx-auto text-sub-text animate-pulse" />
            <h2 className="font-serif font-bold text-lg text-dark mt-4">Your wishlist is empty</h2>
            <p className="text-xs text-sub-text mt-1 max-w-xs mx-auto leading-relaxed">
              Click the wishlist icon on listing cards or detail pages to save items here for later.
            </p>
            <button
              onClick={() => router.push("/ritual-kits")}
              className="mt-6 bg-[#C82A54] hover:bg-[#B02047] text-white font-semibold text-xs px-6 py-3 rounded-xl transition-colors cursor-pointer"
            >
              Explore Products
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <span className="text-xs font-bold text-[#8A7A6E] uppercase tracking-wider">{items.length} Items Saved</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" role="list">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="kit-card"
                  role="listitem"
                  onClick={() => router.push(`/ritual-kits/${item.product.slug}`)}
                >
                  <div
                    className="kit-img select-none"
                    style={{
                      backgroundImage: item.product.images?.[0]
                        ? `url(${item.product.images[0]})`
                        : "linear-gradient(135deg,#1A2A4A,#3A5A8A)",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                    }}
                  />
                  <div className="kit-body">
                    <div className="kit-name font-bold text-dark">{item.product.name}</div>
                    <div className="kit-items font-medium text-sub-text line-clamp-2 mt-1 min-h-[32px] text-xs">
                      {item.product.description}
                    </div>

                    <div className="kit-price-row mt-3">
                      <span className="kit-price font-bold">₹{Number(item.product.price).toLocaleString()}</span>
                    </div>

                    <div className="flex gap-2 mt-4 pt-3 border-t border-[#F2ECE4]">
                      <button
                        className="flex-1 bg-[#C82A54] hover:bg-[#B02047] text-white border-none rounded-xl py-2.5 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMoveToCart(item);
                        }}
                      >
                        <ShoppingCart size={13} />
                        <span>Move to Cart</span>
                      </button>
                      <button
                        className="border border-border hover:bg-red-50 text-red-500 hover:text-red-700 rounded-xl px-3.5 py-2.5 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemove(item.productId, item.product.name);
                        }}
                        title="Remove"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => router.push("/ritual-kits")}
              className="flex items-center gap-2 text-xs font-bold text-[#C82A54] pt-6 hover:underline cursor-pointer select-none"
            >
              <ArrowLeft size={14} />
              <span>Back to Products</span>
            </button>
          </div>
        )}
      </div>

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
