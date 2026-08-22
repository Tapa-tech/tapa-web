"use client";

import React, { useState, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AnnouncementBar from "@/components/AnnouncementBar";
import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";
import { CheckCircle2, ShoppingBag, ArrowRight } from "lucide-react";

function ConfirmationPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const orderNumber = searchParams.get("orderNumber") || "TK-2026-XXXX";
  const amount = searchParams.get("amount") || "0";

  const triggerToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Estimated delivery date (3 days from now)
  const estDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toLocaleDateString("en-IN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }, []);

  return (
    <div className="min-h-screen bg-bg text-body-text font-sans antialiased plp-container">
      <AnnouncementBar />
      <TopNav activeTab="Ritual Kits" onTriggerToast={triggerToast} />

      <div className="max-w-lg mx-auto px-4 py-16 text-center select-none font-sans">
        <div className="w-16 h-16 rounded-full bg-green-50 border border-green-200 text-green-600 flex items-center justify-center mx-auto text-4xl mb-6 animate-bounce">
          <CheckCircle2 size={36} />
        </div>

        <h1 className="font-serif font-bold text-3xl text-dark flex items-center justify-center gap-2">
          <span>Order placed</span>
          <span className="text-green-600">✓</span>
        </h1>
        <p className="text-sm text-sub-text mt-2 leading-relaxed">
          Hare Krishna! Your order has been placed successfully and is being prepared for delivery.
        </p>

        {/* Order Details box */}
        <div className="bg-card border border-border rounded-2xl p-6 my-8 text-left space-y-3.5">
          <div className="flex justify-between items-center text-xs">
            <span className="text-sub-text uppercase tracking-wider font-bold">Order Number</span>
            <span className="font-bold text-dark font-mono text-sm">{orderNumber}</span>
          </div>

          <div className="flex justify-between items-center text-xs">
            <span className="text-sub-text uppercase tracking-wider font-bold">Payment Method</span>
            <span className="font-bold text-dark">Cash on Delivery (COD)</span>
          </div>

          <div className="flex justify-between items-center text-xs">
            <span className="text-sub-text uppercase tracking-wider font-bold">Total Amount</span>
            <span className="font-bold text-[#C82A54] text-sm">₹{Number(amount).toLocaleString()}</span>
          </div>

          <div className="border-t border-[#F2ECE4] pt-3.5 space-y-1 text-xs">
            <span className="text-sub-text uppercase tracking-wider font-bold block">Estimated Delivery</span>
            <span className="font-bold text-dark block">{estDate}</span>
            <span className="text-[10px] text-green-600 font-semibold block">🚚 Delivered before your festival date</span>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => router.push("/account")}
            className="w-full bg-[#C82A54] hover:bg-[#B02047] text-white border-none rounded-xl py-3.5 font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
          >
            <span>View Order History</span>
            <ArrowRight size={14} />
          </button>

          <button
            onClick={() => router.push("/ritual-kits")}
            className="w-full border border-border hover:bg-gray-50 text-dark rounded-xl py-3.5 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <ShoppingBag size={14} />
            <span>Continue Browsing</span>
          </button>
        </div>
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

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-bg flex items-center justify-center font-sans">Loading confirmation...</div>}>
      <ConfirmationPageContent />
    </Suspense>
  );
}
