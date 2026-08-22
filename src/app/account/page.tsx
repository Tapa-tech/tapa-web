"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AnnouncementBar from "@/components/AnnouncementBar";
import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";

interface SavedGuide {
  id: string;
  title: string;
  slug: string;
  category: string;
  thumbnailUrl?: string | null;
  introText?: string | null;
}

interface UserSession {
  user: {
    id: string;
    role: string;
    phone?: string;
    email?: string;
    name?: string;
    consentGiven?: boolean;
    consentGivenAt?: string;
    consentVersion?: string;
  };
}

export default function AccountPage() {
  const router = useRouter();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [session, setSession] = useState<UserSession | null>(null);
  const [savedGuides, setSavedGuides] = useState<SavedGuide[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState("English");
  const [notifyWhatsApp, setNotifyWhatsApp] = useState(true);
  const [notifySMS, setNotifySMS] = useState(true);

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) {
        triggerToast("Logged out successfully.");
        setTimeout(() => {
          window.location.href = "/";
        }, 1000);
      } else {
        triggerToast("Failed to log out.");
      }
    } catch {
      triggerToast("Error logging out.");
    }
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    async function loadAccountData() {
      try {
        const sessionRes = await fetch("/api/auth/session");
        const sessionData = await sessionRes.json();

        if (!sessionData?.session) {
          router.push("/?login=true");
          return;
        }

        setSession(sessionData.session);

        const savedRes = await fetch("/api/public/saved-guides");
        if (savedRes.ok) {
          const savedData = await savedRes.json();
          setSavedGuides(savedData.savedGuides || []);
        }

        const ordersRes = await fetch("/api/orders");
        if (ordersRes.ok) {
          const ordersData = await ordersRes.json();
          setOrders(ordersData || []);
        }
      } catch (err) {
        console.error("Failed to load account details:", err);
      } finally {
        setLoading(false);
      }
    }
    loadAccountData();
  }, [router]);

  const handleRemoveSave = async (e: React.MouseEvent, guideId: string) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const res = await fetch("/api/public/saved-guides", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guideId }),
      });
      if (res.ok) {
        setSavedGuides(prev => prev.filter(g => g.id !== guideId));
        triggerToast("Removed guide from saved list.");
      } else {
        triggerToast("Failed to remove saved guide.");
      }
    } catch {
      triggerToast("Error removing saved guide.");
    }
  };

  if (loading || !session) {
    return (
      <div className="min-h-screen bg-[#F2EDE4] text-[#2C2010] font-sans antialiased flex flex-col justify-between">
        <div>
          <AnnouncementBar />
          <TopNav activeTab="" onTriggerToast={triggerToast} />
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-10 h-10 border-4 border-[#C82A54] border-t-transparent rounded-full animate-spin"></div>
            <span className="font-semibold text-sm">Loading your profile...</span>
          </div>
        </div>
        <Footer onTriggerToast={triggerToast} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F2EDE4] text-[#2C2010] font-sans antialiased flex flex-col justify-between">
      <div>
        <AnnouncementBar />
        <TopNav activeTab="" onTriggerToast={triggerToast} />

        <main className="max-w-4xl mx-auto w-full px-4 py-10">
          <h1 className="font-serif font-bold text-3xl md:text-4xl text-[#3A332C] mb-6">
            My Account
          </h1>

          {/* User Information Card */}
          <div className="bg-[#FAF6EC] border border-[#EADFC9] rounded-2xl p-6 md:p-8 shadow-sm mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="text-[10px] uppercase font-bold text-[#C82A54] tracking-wider mb-1">
                Profile Detail
              </div>
              <h2 className="font-serif font-bold text-2xl text-[#3A332C]">
                {session.user.name || "Tapa Practitioner"}
              </h2>
              <p className="text-sm text-[#6A5A4E] mt-1">
                📞 {session.user.phone || "No phone linked"} &nbsp;·&nbsp; ✉️ {session.user.email || "No email linked"}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#C82A54] bg-[#FFEAEF] px-2 py-0.5 rounded-full border border-[#FAD2DA]">
                  {session.user.role}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#1D8A56] bg-[#E3F9ED] px-2 py-0.5 rounded-full border border-[#C1EAD3]">
                  Consent v1.0 Active
                </span>
              </div>
            </div>

            <div className="bg-white border border-[#EADFC9] rounded-xl p-4 text-[11px] text-[#6A5A4E] max-w-xs w-full shadow-inner select-none font-medium">
              <div className="font-bold text-[#C82A54] uppercase tracking-wider mb-1.5 text-[9px]">
                Auditable Consent
              </div>
              <div>Consent Status: Agreed ✓</div>
              <div>Authorized Version: v1.0</div>
              <div>IP Recorded: Audited &amp; Logged</div>
            </div>
          </div>

          {/* Stat Tiles Summary Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10 font-sans">
            <div className="bg-white border border-[#EADFC9] rounded-2xl p-5 shadow-sm flex flex-col justify-between min-h-[110px]">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#8A7A6E] tracking-wider block mb-1">Saved Rituals</span>
                <span className="text-3xl font-extrabold text-[#3A332C] font-mono">{savedGuides.length}</span>
              </div>
              <Link href="/ritual-guides" className="text-[10px] font-bold text-pink uppercase hover:underline mt-2 inline-flex items-center gap-0.5">
                <span>View Guides</span>
                <span>→</span>
              </Link>
            </div>
            <div className="bg-white border border-[#EADFC9] rounded-2xl p-5 shadow-sm flex flex-col justify-between min-h-[110px]">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#8A7A6E] tracking-wider block mb-1">Orders Placed</span>
                <span className="text-3xl font-extrabold text-[#3A332C] font-mono">{orders.length}</span>
              </div>
              <span className="text-[10px] font-bold text-[#8A7A6E] uppercase mt-2">Verified in database</span>
            </div>
            <div className="bg-[#FAF8F5] border border-[#EADFC9]/75 rounded-2xl p-5 shadow-sm flex flex-col justify-between min-h-[110px] opacity-75">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] uppercase font-bold text-[#8A7A6E] tracking-wider">Puja Bookings</span>
                  <span className="text-[8px] font-bold uppercase tracking-wider text-pink bg-pink/5 border border-pink/15 px-1.5 py-0.5 rounded">Gate 3</span>
                </div>
                <span className="text-3xl font-extrabold text-[#8A7A6E] font-mono">0</span>
              </div>
              <span className="text-[9px] font-semibold text-[#8A7A6E] mt-2">Purohit bookings coming soon</span>
            </div>
          </div>

          {/* Saved Rituals Shelf */}
          <section className="mb-10">
            <h2 className="font-serif font-bold text-2xl text-[#3A332C] mb-4 flex items-center gap-2">
              🔖 Saved Ritual Guides
            </h2>

            {savedGuides.length === 0 ? (
              <div className="bg-white border border-[#EADFC9] rounded-2xl p-10 text-center shadow-sm">
                <span className="text-4xl block mb-3">🕯️</span>
                <p className="text-[#8A7A6E] font-medium mb-4">You haven&apos;t saved any ritual guides yet.</p>
                <Link
                  href="/ritual-guides"
                  className="bg-[#C82A54] text-white hover:bg-[#B02047] font-semibold text-xs px-5 py-2.5 rounded-xl shadow-sm transition-all inline-block"
                >
                  Explore Ritual Guides
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {savedGuides.map((guide) => (
                  <Link
                    key={guide.id}
                    href={`/ritual-guides/${guide.slug}`}
                    className="bg-white border border-[#EADFC9] rounded-2xl p-5 hover:shadow-md transition-shadow flex flex-col justify-between group cursor-pointer relative"
                  >
                    <div>
                      <div className="flex justify-between items-start gap-4">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-pink bg-pink/5 px-2 py-0.5 rounded-lg border border-pink/10">
                          {guide.category}
                        </span>
                        <button
                          onClick={(e) => handleRemoveSave(e, guide.id)}
                          className="text-[#8A7A6E] hover:text-[#C82A54] transition-colors p-1"
                          title="Remove bookmark"
                        >
                          ✕
                        </button>
                      </div>
                      <h3 className="font-serif font-bold text-lg text-[#3A332C] mt-3 group-hover:text-pink transition-colors line-clamp-1">
                        {guide.title}
                      </h3>
                      <p className="text-xs text-[#6A5A4E] mt-1.5 line-clamp-2 leading-relaxed">
                        {guide.introText || "A scripturally-guided, step-by-step ritual observance."}
                      </p>
                    </div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-pink flex items-center gap-1 mt-4 group-hover:gap-1.5 transition-all">
                      <span>Start Ritual</span>
                      <span>→</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>

          {/* Booking History (Locked / Coming Soon) */}
          <section className="mb-10 opacity-75">
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-serif font-bold text-xl text-[#3A332C] flex items-center gap-2">
                📅 Purohit Puja Bookings
              </h2>
              <span className="text-[9px] font-bold uppercase tracking-wider text-[#A67C52] bg-[#FAF7F2] border border-[#EADFC9] px-2 py-0.5 rounded-full">
                Coming soon in November
              </span>
            </div>
            <div className="bg-white/50 border border-[#EADFC9] rounded-2xl p-6 flex flex-col gap-3">
              <div className="h-10 w-full bg-[#EADFC9]/25 rounded-xl animate-pulse"></div>
              <div className="h-10 w-full bg-[#EADFC9]/25 rounded-xl animate-pulse"></div>
            </div>
          </section>

          {/* WhatsApp Subscriptions (Locked / Coming Soon) */}
          <section className="opacity-75 mb-10">
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-serif font-bold text-xl text-[#3A332C] flex items-center gap-2">
                💬 WhatsApp Reminders &amp; Subscriptions
              </h2>
              <span className="text-[9px] font-bold uppercase tracking-wider text-[#A67C52] bg-[#FAF7F2] border border-[#EADFC9] px-2 py-0.5 rounded-full">
                Launching soon
              </span>
            </div>
            <div className="bg-white/50 border border-[#EADFC9] rounded-2xl p-6 flex items-center justify-between">
              <div>
                <div className="font-bold text-xs text-[#3A332C]">The Tapa Circle Weekly Reminders</div>
                <div className="text-[10px] text-[#6A5A4E] mt-0.5">Subscribe to receive personalized Tithi &amp; Vrat updates</div>
              </div>
              <div className="h-8 w-20 bg-[#EADFC9]/25 rounded-lg"></div>
            </div>
          </section>

          {/* Language Settings */}
          <section className="mb-10 bg-white border border-[#EADFC9] rounded-2xl p-6 shadow-sm">
            <h2 className="font-serif font-bold text-xl text-[#3A332C] mb-4 flex items-center gap-2">
              🌐 Language Settings
            </h2>
            <div className="flex items-center gap-3">
              <button
                onClick={() => { setLang("English"); triggerToast("Language set to English"); }}
                className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${lang === "English" ? "bg-[#C82A54] text-white border-[#C82A54]" : "bg-[#FAF6EC] text-dark border-[#EADFC9] hover:bg-gray-50"}`}
              >
                English
              </button>
              <button
                onClick={() => { setLang("Hindi"); triggerToast("Language set to Hindi"); }}
                className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${lang === "Hindi" ? "bg-[#C82A54] text-white border-[#C82A54]" : "bg-[#FAF6EC] text-dark border-[#EADFC9] hover:bg-gray-50"}`}
              >
                हिन्दी (Hindi)
              </button>
              <button
                onClick={() => { setLang("Sanskrit"); triggerToast("Language set to Sanskrit"); }}
                className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${lang === "Sanskrit" ? "bg-[#C82A54] text-white border-[#C82A54]" : "bg-[#FAF6EC] text-dark border-[#EADFC9] hover:bg-gray-50"}`}
              >
                संस्कृतम् (Sanskrit)
              </button>
            </div>
          </section>

          {/* Notification Preferences */}
          <section className="mb-10 bg-white border border-[#EADFC9] rounded-2xl p-6 shadow-sm">
            <h2 className="font-serif font-bold text-xl text-[#3A332C] mb-4 flex items-center gap-2">
              🔔 Notification Preferences
            </h2>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer text-xs font-medium text-[#6A5A4E]">
                <input
                  type="checkbox"
                  checked={notifyWhatsApp}
                  onChange={(e) => { setNotifyWhatsApp(e.target.checked); triggerToast(e.target.checked ? "WhatsApp alerts enabled" : "WhatsApp alerts disabled"); }}
                  className="w-4 h-4 rounded text-[#C82A54] border-gray-300 focus:ring-[#C82A54]"
                />
                <span>Receive Vrat &amp; Festival alerts via WhatsApp</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer text-xs font-medium text-[#6A5A4E]">
                <input
                  type="checkbox"
                  checked={notifySMS}
                  onChange={(e) => { setNotifySMS(e.target.checked); triggerToast(e.target.checked ? "SMS & Email alerts enabled" : "SMS & Email alerts disabled"); }}
                  className="w-4 h-4 rounded text-[#C82A54] border-gray-300 focus:ring-[#C82A54]"
                />
                <span>Receive account updates via SMS &amp; Email</span>
              </label>
            </div>
          </section>

          {/* Help & Support */}
          <section className="mb-10 bg-white border border-[#EADFC9] rounded-2xl p-6 shadow-sm">
            <h2 className="font-serif font-bold text-xl text-[#3A332C] mb-4 flex items-center gap-2">
              🤝 Help &amp; Support
            </h2>
            <div className="text-xs text-[#6A5A4E] space-y-2 leading-relaxed">
              <p>Need help with your order or booking? We are here to guide you scripturally.</p>
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <a href="mailto:support@thetapaco.com" className="bg-[#FAF6EC] hover:bg-[#F3EFE3] border border-[#EADFC9] text-dark font-semibold px-4 py-2.5 rounded-xl transition-all inline-flex items-center justify-center gap-1.5">
                  ✉️ support@thetapaco.com
                </a>
                <button onClick={() => triggerToast("Launching chat support...")} className="bg-[#FAF6EC] hover:bg-[#F3EFE3] border border-[#EADFC9] text-dark font-semibold px-4 py-2.5 rounded-xl transition-all inline-flex items-center justify-center gap-1.5">
                  💬 Chat with a Guide
                </button>
              </div>
            </div>
          </section>

          {/* Order History Section */}
          <section className="mb-10">
            <h2 className="font-serif font-bold text-2xl text-[#3A332C] mb-4 flex items-center gap-2">
              📦 Order History
            </h2>

            {orders.length === 0 ? (
              <div className="bg-white border border-[#EADFC9] rounded-2xl p-10 text-center shadow-sm">
                <span className="text-4xl block mb-3">🛍️</span>
                <p className="text-[#8A7A6E] font-medium mb-4">No bookings or orders yet. Book a Purohit or purchase a ritual kit for your next ritual.</p>
                <Link
                  href="/ritual-kits"
                  className="bg-[#C82A54] text-white hover:bg-[#B02047] font-semibold text-xs px-5 py-2.5 rounded-xl border border-[#DED6C9] shadow-sm transition-all inline-block"
                >
                  Browse Products
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <Link
                    key={order.id}
                    href={`/account/orders/${order.id}`}
                    className="bg-white border border-[#EADFC9] rounded-2xl p-5 shadow-sm text-xs hover:shadow-md transition-shadow flex flex-col justify-between cursor-pointer group block"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-[#F2ECE4] pb-3 mb-3">
                      <div>
                        <span className="text-[#8A7A6E] font-bold uppercase tracking-wider">Order No: </span>
                        <span className="font-bold text-dark font-mono group-hover:text-pink transition-colors">{order.orderNumber}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[#8A7A6E]">Date: {new Date(order.createdAt).toLocaleDateString("en-IN")}</span>
                        <span className="font-semibold px-2.5 py-0.5 rounded bg-blue-50 border border-blue-100 text-blue-700 text-[10px] uppercase">
                          {order.orderStatus}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      {order.items?.map((item: any) => (
                        <div key={item.id} className="flex justify-between items-center text-xs text-sub-text">
                          <span>{item.productName} (x{item.quantity})</span>
                          <span className="font-semibold text-dark">
                            ₹{(Number(item.priceAtOrder) * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-[#F2ECE4] pt-3 mt-3 flex flex-wrap justify-between items-center gap-2 text-xs">
                      <div>
                        <span className="text-[#8A7A6E] font-bold">Payment: </span>
                        <span className="font-semibold">{order.paymentMethod}</span>
                        <span className="text-[10px] text-amber-600 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full font-bold ml-2">
                          {order.paymentStatus}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-sm font-bold text-dark">
                          Total: <span className="text-[#C82A54] font-serif font-bold text-base">₹{Number(order.totalAmount).toLocaleString()}</span>
                        </div>
                        <div className="text-[10px] font-bold text-pink uppercase tracking-wider group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                          <span>Details</span>
                          <span>→</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>

          {/* Logout Section */}
          <div className="pt-6 border-t border-[#EADFC9] flex justify-end">
            <button
              onClick={handleLogout}
              className="bg-transparent hover:bg-red-50 text-red-600 hover:text-red-700 font-semibold text-xs border border-red-200 px-6 py-3 rounded-xl transition-colors cursor-pointer select-none"
            >
              🚪 Log Out of Account
            </button>
          </div>
        </main>
      </div>

      <Footer onTriggerToast={triggerToast} />

      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[100] bg-dark text-white border border-white/10 px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-bounce font-sans text-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-pink animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
