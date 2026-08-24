"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import TopNav from "@/components/layout/TopNav";
import Footer from "@/components/layout/Footer";
import { useCartStore } from "@/lib/store/cartStore";
import { Trash2, Heart, ArrowRight, ArrowLeft, ShoppingBag, Plus, Minus } from "lucide-react";

export default function CartPage() {
  const router = useRouter();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  
  const { items, fetchCart, updateQuantity, removeFromCart, clearCart, isLoggedIn } = useCartStore();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const triggerToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const deliveryFee = subtotal === 0 ? 0 : subtotal >= 1500 ? 0 : 99;
  const totalAmount = subtotal + deliveryFee;

  const handleSaveToWishlist = async (productId: string, productName: string) => {
    if (!isLoggedIn) {
      triggerToast("Please log in to save items to your wishlist.");
      
      router.push("/cart?login=true");
      return;
    }

    try {
      const res = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });

      if (res.ok) {
        
        await removeFromCart(productId);
        triggerToast(`Moved ${productName} to your wishlist!`);
      } else {
        const err = await res.json();
        triggerToast(err.error || "Failed to save to wishlist.");
      }
    } catch (e) {
      console.error(e);
      triggerToast("Error saving to wishlist.");
    }
  };

  const handleCheckout = () => {
    if (items.length === 0) return;

    if (!isLoggedIn) {
      triggerToast("Login required to complete checkout.");
      router.push("/cart?login=true");
    } else {
      router.push("/checkout");
    }
  };

  return (
    <div className="min-h-screen bg-bg text-body-text font-sans antialiased plp-container">
      <AnnouncementBar />
      <TopNav activeTab="Ritual Kits" onTriggerToast={triggerToast} />

      
      <div className="breadcrumb-bar select-none">
        <div className="wrap">
          <a href="/" className="hover:underline">Home</a>
          <span className="bc-sep">›</span>
          <span className="bc-current">Your Cart</span>
        </div>
      </div>

      <div className="max-w-[var(--content-w)] mx-auto px-4 md:px-10 py-8 pb-20">
        <h1 className="font-serif font-bold text-3xl text-dark mb-6">Shopping Cart</h1>

        {items.length === 0 ? (
          <div className="text-center py-16 bg-card border border-border rounded-2xl p-8 max-w-lg mx-auto">
            <ShoppingBag size={48} className="mx-auto text-sub-text animate-pulse" />
            <h2 className="font-serif font-bold text-lg text-dark mt-4">Nothing here yet</h2>
            <p className="text-xs text-sub-text mt-1 max-w-xs mx-auto leading-relaxed">
              Start with a ritual guide to find the right kit.
            </p>
            <button
              onClick={() => router.push("/ritual-kits")}
              className="mt-6 bg-[#C82A54] hover:bg-[#B02047] text-white font-semibold text-xs px-6 py-3 rounded-xl transition-colors cursor-pointer select-none"
            >
              Browse Catalog
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-start">
            
            
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <span className="text-xs font-bold text-[#8A7A6E] uppercase tracking-wider">{items.length} Items</span>
                <button
                  onClick={() => clearCart()}
                  className="text-xs font-semibold text-[#C82A54] hover:underline cursor-pointer"
                >
                  Clear Cart
                </button>
              </div>

              <div className="space-y-3" role="list">
                {items.map((item) => (
                  <div
                    key={item.productId}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-card border border-border rounded-2xl gap-4"
                    role="listitem"
                  >
                    <div className="flex gap-4 items-center">
                      <div
                        className="w-14 h-14 rounded-xl shrink-0"
                        style={{
                          backgroundImage: item.image ? `url(${item.image})` : undefined,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          background: !item.image ? "linear-gradient(135deg,#1A2A4A,#3A5A8A)" : undefined,
                        }}
                      />
                      <div>
                        <h3 className="font-bold text-sm text-dark">{item.name}</h3>
                        {item.isCustomKit && (
                          <div className="text-[10px] text-[#C82A54] font-bold mt-0.5">🛠 Custom assembled kit</div>
                        )}
                        <span className="text-xs font-bold text-[#8A7A6E] block mt-1">₹{item.price.toLocaleString()}</span>
                      </div>
                    </div>

                    
                    {item.isCustomKit && item.customKitItems && (
                      <div className="w-full text-[10px] text-sub-text bg-[#FAF6EC] border border-[#EADFC9] rounded-xl p-2.5 space-y-1 mt-1 sm:mt-0 max-h-24 overflow-y-auto font-sans">
                        {item.customKitItems.map((kitem, kidx) => (
                          <div key={kidx} className="flex justify-between">
                            <span>• {kitem.itemName} (x{kitem.quantity})</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-none border-border">
                      
                      {!item.isCustomKit ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            className="w-7 h-7 rounded-lg border border-border bg-white flex items-center justify-center text-dark hover:bg-bg cursor-pointer select-none"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="font-bold text-xs w-4 text-center select-none">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            className="w-7 h-7 rounded-lg border border-border bg-white flex items-center justify-center text-dark hover:bg-bg cursor-pointer select-none"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs font-bold text-[#8A7A6E] mr-2">Qty: 1</span>
                      )}

                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleSaveToWishlist(item.productId, item.name)}
                          className="p-2 hover:bg-[#FAF6EC] rounded-xl text-[#8A7A6E] hover:text-[#C82A54] transition-colors cursor-pointer"
                          title="Save to Wishlist"
                        >
                          <Heart size={15} />
                        </button>
                        <button
                          onClick={() => removeFromCart(item.productId)}
                          className="p-2 hover:bg-red-50 rounded-xl text-red-500 hover:text-red-700 transition-colors cursor-pointer"
                          title="Remove from Cart"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => router.push("/ritual-kits")}
                className="flex items-center gap-2 text-xs font-bold text-[#C82A54] pt-4 hover:underline cursor-pointer select-none"
              >
                <ArrowLeft size={14} />
                <span>Continue Shopping</span>
              </button>
            </div>

            
            <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
              <h2 className="font-serif font-bold text-lg text-dark">Order Summary</h2>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-sub-text">Subtotal</span>
                  <span className="font-bold text-dark">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sub-text">Delivery Fee</span>
                  <span className="font-bold text-dark">
                    {deliveryFee === 0 ? <span className="text-green-600 font-bold uppercase text-[10px]">Free</span> : `₹${deliveryFee}`}
                  </span>
                </div>
                {deliveryFee > 0 && (
                  <div className="text-[10px] text-green-600 font-semibold bg-green-50 border border-green-100 rounded-lg p-2 mt-1">
                    💡 Add ₹{(1500 - subtotal).toLocaleString()} more to get FREE shipping!
                  </div>
                )}
                <div className="border-t border-border pt-3 mt-3 flex justify-between text-sm">
                  <span className="font-bold text-dark">Total</span>
                  <span className="font-bold text-xl text-[#C82A54]">₹{totalAmount.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-[#C82A54] hover:bg-[#B02047] text-white border-none rounded-xl py-3.5 font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer select-none"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={14} />
              </button>

              <div className="text-[10px] text-sub-text text-center leading-relaxed">
                Security &amp; Consent: Login is required to initiate checkout. Shipping details will be saved to your profile for next time.
              </div>
            </div>

          </div>
        )}
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
