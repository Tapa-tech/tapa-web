"use client";

import React, { useState, useEffect } from "react";
import AnnouncementBar from "@/components/AnnouncementBar";
import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";
import { trackPageView } from "@/lib/analytics";
import { Loader2, CheckCircle2, ShieldCheck, Sparkles, Send } from "lucide-react";

export default function TapaCirclePage() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form Fields
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Track page view
  useEffect(() => {
    trackPageView("/tapa-circle");
  }, []);

  const triggerToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    if (!consent) {
      triggerToast("Consent is required to subscribe.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/public/tapa-circle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone: whatsapp,
          consentGiven: consent,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        triggerToast("Subscription request registered!");
      } else {
        triggerToast(data.error || "Failed to register subscription.");
      }
    } catch (e) {
      console.error(e);
      triggerToast("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg text-body-text font-sans antialiased plp-container">
      <AnnouncementBar />
      <TopNav activeTab="Ritual Kits" onTriggerToast={triggerToast} />

      {/* Page Hero */}
      <div className="page-hero select-none">
        <div className="wrap">
          <div className="hero-inner">
            <div className="hero-top-row">
              <div className="hero-text">
                <div className="hero-eyebrow">✨ THE TAPA CIRCLE · PREMIUM MEMBERSHIP</div>
                <h1 className="hero-title font-serif">Enter the Sacred<br />Inner Circle.</h1>
                <p className="hero-sub font-sans">
                  Deepen your connection with timeless Vedic wisdom. Receive high-accuracy daily tithi alerts, Muhurata timings, pure chants, and scholarly articles directly on WhatsApp.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[var(--content-w)] mx-auto px-4 md:px-10 py-12 grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-10 items-start pb-24">
        
        {/* Left Column: Benefits Detail */}
        <div className="space-y-8 font-sans">
          <div>
            <h2 className="font-serif font-bold text-2xl text-dark mb-4">Why join The Tapa Circle?</h2>
            <p className="text-xs text-sub-text leading-relaxed">
              We separate authentic dharma from superficial practices. As a member of our circle, you gain access to curated spiritual schedules verified directly by shastric scholars.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="bg-card border border-border rounded-2xl p-5 space-y-2.5">
              <span className="text-2xl">📅</span>
              <h3 className="font-serif font-bold text-sm text-dark">High-Accuracy Muhuratas</h3>
              <p className="text-[11px] text-sub-text leading-relaxed">
                Receive precise timings for Sankranti, Ekadashi, Pradosh, and festive rituals calculated according to your location.
              </p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-5 space-y-2.5">
              <span className="text-2xl">🔔</span>
              <h3 className="font-serif font-bold text-sm text-dark">WhatsApp Broadcasts</h3>
              <p className="text-[11px] text-sub-text leading-relaxed">
                No app downloads required. All alerts, mantras, and explanations are sent directly to your phone.
              </p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-5 space-y-2.5">
              <span className="text-2xl">📜</span>
              <h3 className="font-serif font-bold text-sm text-dark">Scholarly Insights</h3>
              <p className="text-[11px] text-sub-text leading-relaxed">
                Understand the &apos;why&apos; behind every ritual with authentic references from Upanishads, Puranas, and Vedas.
              </p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-5 space-y-2.5">
              <span className="text-2xl">🔥</span>
              <h3 className="font-serif font-bold text-sm text-dark">Exclusive Invites</h3>
              <p className="text-[11px] text-sub-text leading-relaxed">
                Get first-priority bookings for group Yajnas, festive pujas, and custom ritual kits before public launch.
              </p>
            </div>
          </div>

          <div className="bg-[#FAF6EC] border border-[#EADFC9] rounded-2xl p-4 flex gap-3 text-xs text-[#6A5A4E] leading-relaxed">
            <Sparkles className="text-[#C82A54] shrink-0 mt-0.5" size={16} />
            <span>
              <strong>Note on Payments</strong>: The Tapa Circle subscription fee is ₹501/year. Payments are currently deferred until our payment gateway integrations complete. By signing up now, your status will register as <strong>Pending Payment</strong>, and you will receive a payment link as soon as integrations ship!
            </span>
          </div>
        </div>

        {/* Right Column: Sign Up Form */}
        <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm">
          {success ? (
            <div className="text-center py-10 space-y-4 font-sans select-none">
              <div className="w-12 h-12 rounded-full bg-green-50 border border-green-200 text-green-600 flex items-center justify-center mx-auto text-2xl animate-pulse">
                <CheckCircle2 size={28} />
              </div>
              <h3 className="font-serif font-bold text-xl text-dark">Registration Successful!</h3>
              <p className="text-xs text-sub-text leading-relaxed max-w-xs mx-auto">
                Thank you for opting in to The Tapa Circle! Your subscription is registered as **Pending Payment**. We will notify you on WhatsApp as soon as payment links become active.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="space-y-4 font-sans">
              <h3 className="font-serif font-bold text-lg text-dark border-b border-border pb-3 mb-4">
                Subscribe to The Tapa Circle
              </h3>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-[#6A5A4E] uppercase tracking-wider">Your Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Aditi Sharma"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#DED6C9] focus:outline-none focus:border-[#C82A54] text-xs text-[#3A332C] bg-white transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-[#6A5A4E] uppercase tracking-wider">WhatsApp Number</label>
                <input
                  type="tel"
                  required
                  pattern="[0-9]{10}"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="10-digit mobile number"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#DED6C9] focus:outline-none focus:border-[#C82A54] text-xs text-[#3A332C] bg-white transition-colors"
                />
              </div>

              {/* Consent Disclosures Checkbox */}
              <div className="border border-border rounded-xl p-3 bg-gray-50 space-y-2.5">
                <div className="flex items-start gap-2 select-none">
                  <input
                    type="checkbox"
                    id="circleConsent"
                    required
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="w-4 h-4 rounded text-[#C82A54] border-[#DED6C9] focus:ring-[#C82A54] mt-0.5 cursor-pointer"
                  />
                  <label htmlFor="circleConsent" className="text-[10px] font-semibold text-[#6A5A4E] leading-relaxed cursor-pointer">
                    I explicitly consent to join The Tapa Circle and receive transaction and marketing alerts on WhatsApp.
                  </label>
                </div>
                <div className="text-[9px] text-sub-text leading-normal border-t border-border/60 pt-2 flex gap-1.5">
                  <ShieldCheck size={14} className="text-[#C82A54] shrink-0 mt-0.5" />
                  <span>
                    <strong>Consent Disclosures</strong>: By subscribing, you agree that your WhatsApp number will be stored securely in our database. We will never share your contact details. You can opt out at any time by replying &quot;STOP&quot; to our broadcasts.
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting || !consent}
                className="w-full bg-[#C82A54] hover:bg-[#B02047] disabled:bg-gray-400 text-white border-none rounded-xl py-3 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer select-none"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Registering...</span>
                  </>
                ) : (
                  <>
                    <Send size={12} />
                    <span>Join Circle (₹501 / Year)</span>
                  </>
                )}
              </button>
            </form>
          )}
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
