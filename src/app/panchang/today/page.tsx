"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";

interface PanchangRecord {
  id: string;
  date: string;
  city: string;
  tithi: string;
  tithiSub: string;
  paksha: string;
  pakshaSub: string;
  nakshatra: string;
  sunrise: string;
  sunset: string;
  rahuKaal: string;
  yogaKarana: string;
}

interface NextVrat {
  name: string;
  linkedGuideId?: string | null;
}

export default function TodayPanchangPage() {
  const router = useRouter();
  const [selectedCity, setSelectedCity] = useState("Delhi-NCR");
  const [showCitySelector, setShowCitySelector] = useState(false);
  const [panchang, setPanchang] = useState<PanchangRecord | null>(null);
  const [nextVrat, setNextVrat] = useState<NextVrat | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  useEffect(() => {
    const stored = localStorage.getItem("tapa-city") || "Delhi-NCR";
    setSelectedCity(stored);

    async function loadPanchang() {
      try {
        const res = await fetch(`/api/public/panchang?city=${encodeURIComponent(stored)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.panchang) setPanchang(data.panchang);
          if (data.nextVrat) setNextVrat(data.nextVrat);
        }
      } catch (err) {
        console.error("Failed to load today's panchang:", err);
      }
    }
    loadPanchang();

    const handleCityUpdated = () => {
      const updatedCity = localStorage.getItem("tapa-city") || "Delhi-NCR";
      setSelectedCity(updatedCity);

      async function reloadPanchang() {
        try {
          const res = await fetch(`/api/public/panchang?city=${encodeURIComponent(updatedCity)}`);
          if (res.ok) {
            const data = await res.json();
            if (data.panchang) setPanchang(data.panchang);
            if (data.nextVrat) setNextVrat(data.nextVrat);
          }
        } catch (err) {
          console.error("Failed to reload today's panchang:", err);
        }
      }
      reloadPanchang();
    };

    window.addEventListener("city-updated", handleCityUpdated);
    return () => {
      window.removeEventListener("city-updated", handleCityUpdated);
    };
  }, []);

  const updateSelectedCity = (cityVal: string) => {
    localStorage.setItem("tapa-city", cityVal);
    window.dispatchEvent(new Event("city-updated"));
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "UTC",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="ritual-guide-page min-h-screen bg-[#F2EDE4] text-[#2C2010] font-sans antialiased">
      <TopNav activeTab="Panchang" onTriggerToast={triggerToast} />

      {/* Breadcrumbs */}
      <div className="bcrumb">
        <div className="bc-in">
          Home › <span className="cursor-pointer hover:underline" onClick={() => router.push("/panchang")}>Panchang</span> › <b>Today&apos;s Panchang</b>
        </div>
      </div>

      {/* Hero / Header Section */}
      <section className="chero pa">
        <div className="wrap">
          <div className="chero-in">
            <div>
              <p className="ch-ey">DAILY CALCULATIONS</p>
              <h1 className="ch-h1">Today&apos;s Panchang</h1>
              <p className="ch-p">
                Five limbs of the day — computed dynamically for your exact location. Select your city to recompute astronomical times.
              </p>
            </div>

            {/* Today's Panchang Box */}
            <div className="today select-none">
              <div className="td-h">
                <span className="td-l">☀ LOCAL PANCHANG</span>
                <span className="td-live">
                  <span className="livedot" />
                  {selectedCity.toUpperCase()}
                </span>
              </div>
              <div className="td-date">
                <div className="td-day">
                  {panchang ? `${panchang.tithi} (${panchang.tithiSub})` : "Loading..."}
                </div>
                <div className="td-sub">
                  {panchang ? `${formatDate(panchang.date)} · ${panchang.city}` : "Computing..."}
                </div>
              </div>
              <div className="td-rows">
                <div className="tdr">
                  <span className="tdk">PAKSHA</span>
                  <span className="tdv">{panchang ? `${panchang.paksha} — ${panchang.pakshaSub}` : "Computing..."}</span>
                </div>
                <div className="tdr">
                  <span className="tdk">NAKSHATRA</span>
                  <span className="tdv">{panchang ? `${panchang.nakshatra}` : "Computing..."}</span>
                </div>
                <div className="tdr">
                  <span className="tdk">SUNRISE / SUNSET</span>
                  <span className="tdv">{panchang ? `${panchang.sunrise} / ${panchang.sunset}` : "Computing..."}</span>
                </div>
                <div className="tdr">
                  <span className="tdk">RAHU KAAL</span>
                  <span className="tdv">{panchang ? panchang.rahuKaal : "Computing..."}</span>
                </div>
                <div className="tdr">
                  <span className="tdk">YOGA · KARANA</span>
                  <span className="tdv">{panchang ? panchang.yogaKarana : "Computing..."}</span>
                </div>
              </div>

              {nextVrat ? (
                <div 
                  className="td-foot" 
                  onClick={() => nextVrat.linkedGuideId ? router.push(`/ritual-guides/${nextVrat.linkedGuideId}`) : triggerToast(`Vrat details for "${nextVrat.name}"`)} 
                  style={{ cursor: "pointer" }}
                >
                  <span className="tdf-t"><b>Next Vrat —</b> {nextVrat.name}</span>
                  <span className="tdf-c">Open guide &rsaquo;</span>
                </div>
              ) : (
                <div className="td-foot font-sans text-xs text-center py-4 bg-white/5 border-t border-[#EADFC9]/20" style={{ color: "#8A7A6E" }}>
                  No upcoming major vrat guides.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Control Band */}
      <div className="ctrl">
        <div className="ctrl-in">
          <div className="city cursor-pointer relative" onClick={() => setShowCitySelector(!showCitySelector)}>
            <span className="city-l">COMPUTED FOR</span>
            <span className="city-v">{selectedCity}</span>
            <span className="city-c">Change &rsaquo;</span>
            {showCitySelector && (
              <div 
                className="absolute top-full left-0 mt-1 bg-white border border-[#EADFC9] rounded-xl shadow-lg z-50 p-2 min-w-[160px] flex flex-col gap-1 text-left select-none"
                onClick={(e) => e.stopPropagation()}
              >
                {["Delhi-NCR", "Mumbai", "Bengaluru", "Kolkata", "Chennai", "Pune", "Hyderabad", "Varanasi"].map((c: string) => (
                  <button 
                    key={c} 
                    onClick={() => {
                      updateSelectedCity(c);
                      setShowCitySelector(false);
                    }} 
                    className={`px-3 py-1.5 text-xs text-left rounded-lg transition-colors ${selectedCity === c ? "bg-[#B5651D]/10 text-[#B5651D] font-bold" : "hover:bg-[#F2EDE4] text-[#2C2010]"}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer onTriggerToast={triggerToast} />

      {toastMessage && (
        <div className="toast">
          <div className="toast-in">{toastMessage}</div>
        </div>
      )}
    </div>
  );
}
