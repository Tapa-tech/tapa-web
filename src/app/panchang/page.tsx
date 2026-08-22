/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AnnouncementBar from "@/components/AnnouncementBar";
import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";

const HINDU_MONTHS_MAP: Record<string, string> = {
  Jan: "Pausha into Magha",
  Feb: "Magha into Phalguna",
  Mar: "Phalguna into Chaitra",
  Apr: "Chaitra into Vaishakha",
  May: "Vaishakha into Jyeshtha",
  Jun: "Jyeshtha into Ashadha",
  Jul: "Ashadha into Shravana",
  Aug: "Shravana into Bhadrapada",
  Sep: "Bhadrapada into Ashwin",
  Oct: "Ashwin into Kartika",
  Nov: "Kartika into Margashirsha",
  Dec: "Margashirsha into Pausha",
};

export default function PanchangPage() {
  const router = useRouter();
  const [panchangTab, setPanchangTab] = useState<"pl" | "vc" | "fc">("pl");
  const [calendarSystem, setCalendarSystem] = useState<"Purnimanta" | "Amanta">("Purnimanta");
  const [vratFilter, setVratFilter] = useState("All");
  const [festFilter, setFestFilter] = useState("All festivals");
  const [selectedMonth, setSelectedMonth] = useState("Sep");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [session, setSession] = useState<any>(null);

  const [panchang, setPanchang] = useState<any>(null);
  const [nextVrat, setNextVrat] = useState<any>(null);
  const [vratEntries, setVratEntries] = useState<any[]>([]);

  const [selectedCity, setSelectedCity] = useState("Delhi-NCR");
  const [showCitySelector, setShowCitySelector] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("tapa-city") || "Delhi-NCR";
    setSelectedCity(stored);

    async function loadPanchangAndSession() {
      try {
        const res = await fetch(`/api/public/panchang?city=${encodeURIComponent(stored)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.panchang) setPanchang(data.panchang);
          if (data.nextVrat) setNextVrat(data.nextVrat);
          if (data.vratEntries) setVratEntries(data.vratEntries);
        }

        const sessionRes = await fetch("/api/auth/session");
        const sessionData = await sessionRes.json();
        if (sessionData?.session) {
          setSession(sessionData.session);
        }
      } catch (err) {
        console.error("Failed to load public panchang data:", err);
      }
    }
    loadPanchangAndSession();

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
            if (data.vratEntries) setVratEntries(data.vratEntries);
          }
        } catch (err) {
          console.error("Failed to reload public panchang data:", err);
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

  const handlePanchangDownload = (type: "calendar" | "vrat" | "festival", filter: string = "All") => {
    if (!session) {
      triggerToast("Please login to download the calendar PDF.");
      router.push(window.location.pathname + "?login=true");
      return;
    }
    triggerToast("Preparing your PDF download...");
    window.open(`/api/panchang/calendar-pdf?type=${type}&city=${encodeURIComponent(selectedCity)}&calendarSystem=${calendarSystem}&filter=${encodeURIComponent(filter)}`, "_blank");
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

  const formatVratDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-IN", {
        weekday: "short",
        day: "numeric",
        month: "short",
        timeZone: "UTC",
      });
    } catch {
      return dateStr;
    }
  };

  const calculateCountdown = (dateStr: string) => {
    try {
      const today = new Date();
      const todayUtc = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));
      const target = new Date(dateStr);
      const targetUtc = new Date(Date.UTC(target.getUTCFullYear(), target.getUTCMonth(), target.getUTCDate()));
      
      const diffTime = targetUtc.getTime() - todayUtc.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) return "TODAY";
      if (diffDays === 1) return "TOMORROW";
      if (diffDays < 0) return "PASSED";
      return `IN ${diffDays} DAYS`;
    } catch {
      return "COMING SOON";
    }
  };

  const getVratMonthAbbr = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", { month: "short", timeZone: "UTC" });
    } catch {
      return "";
    }
  };

  const getObservancesCountForMonth = (month: string) => {
    return vratEntries.filter(vrat => getVratMonthAbbr(vrat.date) === month).length;
  };

  const getFestStyle = (category: string, name: string) => {
    const n = name.toLowerCase();
    if (n.includes("shiva") || n.includes("pradosh") || n.includes("mahashivratri")) return "h-shiva";
    if (n.includes("krishna") || n.includes("janmashtami")) return "h-krishna";
    if (n.includes("ganesh") || n.includes("chaturthi")) return "h-ganesh";
    if (n.includes("devi") || n.includes("teej") || n.includes("navratri") || n.includes("durga")) return "h-devi";
    if (n.includes("vishnu") || n.includes("ekadashi")) return "h-vishnu";
    return "h-earth";
  };

  const formatTimeString = (timeStr: string) => {
    if (!timeStr) return "";
    if (timeStr.includes("AM") || timeStr.includes("PM")) return timeStr;
    const [hours, minutes] = timeStr.split(":");
    const h = parseInt(hours);
    const ampm = h >= 12 ? "PM" : "AM";
    const displayHour = h % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };


  const triggerToast = (message: string = "Feature launching soon!") => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleTabChange = (tabId: string) => {
    if (tabId === "Ritual Kits") {
      router.push("/ritual-kits");
    } else if (tabId === "Ritual Guides") {
      router.push("/ritual-guides");
    } else if (tabId === "Panchang") {
      router.push("/panchang");
    }
  };

  // Helper: Vrat Table Row
  const renderVratRow = (o: {
    d: string;
    dw: string;
    n: string;
    x?: string;
    t: string;
    cd: string;
    cd_c?: string;
    next?: boolean;
    slug?: string;
  }) => (
    <div key={o.n} className={`dt-r${o.next ? " next" : ""}`}>
      <div className="dt-d">
        {o.d}
        <div className="dt-dw">{o.dw}</div>
      </div>
      <div className="dt-n">
        {o.n}
        {o.x && <div className="dt-x">{o.x}</div>}
      </div>
      <div className="dt-t">{o.t}</div>
      <div>
        <span className={`dt-cd${o.cd_c || ""}`}>{o.cd}</span>
        {o.slug && (
          <a
            className="dt-a cursor-pointer block mt-1 hover:underline"
            onClick={() => router.push(`/ritual-guides/${o.slug}`)}
          >
            Guide ›
          </a>
        )}
      </div>
    </div>
  );

  // Helper: Festival Card
  const renderFestCard = (o: {
    h: string;
    dd: string;
    mm: string;
    dw: string;
    n: string;
    t: string;
    tags?: [string, string][];
    slug?: string;
  }) => (
    <a
      key={o.n}
      className="fc-card cursor-pointer"
      onClick={() => {
        if (o.slug) {
          router.push(`/ritual-guides/${o.slug}`);
        } else {
          triggerToast("This guide will be available soon.");
        }
      }}
    >
      <div className={`fc-l ${o.h}`}>
        <div className="fc-dd">{o.dd}</div>
        <div className="fc-mm">{o.mm}</div>
        <div className="fc-dw">{o.dw}</div>
      </div>
      <div className="fc-b">
        <div className="fc-n">{o.n}</div>
        <div className="fc-t">{o.t}</div>
        <div className="fc-m">
          {(o.tags || []).map((t, idx) => (
            <span key={idx} className={`tag ${t[0]}`}>
              {t[1]}
            </span>
          ))}
        </div>
      </div>
    </a>
  );

  return (
    <div className="ritual-guide-page min-h-screen bg-[#F2EDE4] text-[#2C2010] font-sans antialiased">
      <AnnouncementBar />
      <TopNav
        activeTab="Panchang"
        onTabChange={handleTabChange}
        onTriggerToast={triggerToast}
      />

      {/* Breadcrumbs */}
      <div className="bcrumb">
        <div className="bc-in">
          {panchangTab === "pl" && <>Home › <b>Panchang</b></>}
          {panchangTab === "vc" && <>Home › <span className="cursor-pointer hover:underline" onClick={() => setPanchangTab("pl")}>Panchang</span> › <b>2026 Vrat Calendar</b></>}
          {panchangTab === "fc" && <>Home › <span className="cursor-pointer hover:underline" onClick={() => setPanchangTab("pl")}>Panchang</span> › <b>Festival Calendar</b></>}
        </div>
      </div>

      {/* Hero Section */}
      <section className="chero pa">
        <div className="wrap">
          <div className="chero-in">
            {panchangTab === "pl" && (
              <div>
                <p className="ch-ey">PANCHANG</p>
                <h1 className="ch-h1">The calendar that follows the Moon</h1>
                <p className="ch-p">{"Today's tithi, the year's vrat dates, and how to read any of it yourself. Computed for your city — because a festival date genuinely differs between Delhi and Mumbai, and both are correct."}</p>
                <div className="ch-meta">
                  <span className="ch-m"><b>365</b> days computed</span>
                  <span className="ch-m"><b>142</b> vrat dates in 2026</span>
                  <span className="ch-m"><b>Drik Panchang</b> source</span>
                </div>
              </div>
            )}
            {panchangTab === "vc" && (
              <div>
                <p className="ch-ey">PANCHANG · CALENDAR</p>
                <h1 className="ch-h1">2026 Vrat Calendar</h1>
                <p className="ch-p">Every Ekadashi, Pradosh, Chaturthi, Purnima and Amavasya of the year — with the tithi each one follows, so you can check any of it against your own panchang.</p>
                <div className="ch-meta">
                  <span className="ch-m"><b>142</b> dates</span>
                  <span className="ch-m"><b>24</b> Ekadashis</span>
                  <span className="ch-m"><b>24</b> Pradosh vrats</span>
                </div>
              </div>
            )}
            {panchangTab === "fc" && (
              <div>
                <p className="ch-ey">PANCHANG · CALENDAR</p>
                <h1 className="ch-h1">Festival Calendar 2026</h1>
                <p className="ch-p">For anyone who plans in months rather than tithis. Gregorian dates first, with the tithi beneath — so you can book leave and still know which lunar day you are actually observing.</p>
                <div className="ch-meta">
                  <span className="ch-m"><b>48</b> festivals</span>
                  <span className="ch-m"><b>34</b> with a full guide</span>
                  <span className="ch-m"><b>14</b> guides coming</span>
                </div>
              </div>
            )}

            {/* Right side: Today's Panchang */}
            <div className="today select-none">
              <div className="td-h">
                <span className="td-l">{"☀ TODAY'S PANCHANG"}</span>
                <span className="td-live"><span className="livedot" />{panchang ? panchang.city.toUpperCase() : "DELHI-NCR"}</span>
              </div>
              <div className="td-date">
                <div className="td-day">{panchang ? `${panchang.tithi} (${panchang.tithiSub})` : "Bhadrapada Krishna Panchami"}</div>
                <div className="td-sub">{panchang ? `${formatDate(panchang.date)} · ${panchang.city}` : "Monday, 7 September 2026 · Purnimanta"}</div>
              </div>
              <div className="td-rows">
                <div className="tdr">
                  <span className="tdk">PAKSHA</span>
                  <span className="tdv">{panchang ? `${panchang.paksha} — ${panchang.pakshaSub}` : "Pending"}</span>
                </div>
                <div className="tdr">
                  <span className="tdk">NAKSHATRA</span>
                  <span className="tdv">{panchang ? `${panchang.nakshatra} ${panchang.nakshatraSub ? `(${panchang.nakshatraSub})` : ""}` : "Pending"}</span>
                </div>
                <div className="tdr">
                  <span className="tdk">SUNRISE / SUNSET</span>
                  <span className="tdv">{panchang ? `${formatTimeString(panchang.sunrise)} / ${panchang.sunset ? formatTimeString(panchang.sunset) : 'N/A'}` : "Pending"}</span>
                </div>
                <div className="tdr">
                  <span className="tdk">RAHU KAAL</span>
                  <span className="tdv">{panchang ? panchang.rahuKaal : "Pending"}</span>
                </div>
                <div className="tdr">
                  <span className="tdk">YOGA · KARANA</span>
                  <span className="tdv">{panchang ? panchang.yogaKarana : "Pending"}</span>
                </div>
              </div>
              {nextVrat ? (
                <div className="td-foot" onClick={() => nextVrat.linkedGuideId ? router.push(`/ritual-guides/${nextVrat.linkedGuideId}`) : triggerToast(`Vrat details for "${nextVrat.name}"`)} style={{ cursor: "pointer" }}>
                  <span className="tdf-t"><b>Next major date —</b> {nextVrat.name}, {formatVratDate(nextVrat.date)}</span>
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

      {/* Custom Controls for Panchang */}
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
                {["Delhi-NCR", "Mumbai", "Bengaluru", "Kolkata", "Chennai", "Pune", "Hyderabad", "Varanasi"].map(c => (
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
          <div className="sep" />
          {panchangTab === "pl" && (
            <>
              <button className={`fc ${calendarSystem === "Purnimanta" ? "on" : ""}`} onClick={() => setCalendarSystem("Purnimanta")}>Purnimanta</button>
              <button className={`fc ${calendarSystem === "Amanta" ? "on" : ""}`} onClick={() => setCalendarSystem("Amanta")}>Amanta</button>
              <button className="dl" onClick={() => handlePanchangDownload("calendar")}>↓ Download 2026 calendar</button>
            </>
          )}
          {panchangTab === "vc" && (
            <>
              {["All", "Ekadashi", "Pradosh", "Chaturthi", "Purnima", "Amavasya"].map((type) => (
                <button key={type} className={`fc ${vratFilter === type ? "on" : ""}`} onClick={() => setVratFilter(type)}>{type}</button>
              ))}
              <button className="dl" onClick={() => handlePanchangDownload("vrat", vratFilter)}>↓ Download PDF</button>
            </>
          )}
          {panchangTab === "fc" && (
            <>
              {["All festivals", "Major only", "Shiva", "Vishnu", "Devi", "Ganesha"].map((type) => (
                <button key={type} className={`fc ${festFilter === type ? "on" : ""}`} onClick={() => setFestFilter(type)}>{type}</button>
              ))}
              <button className="dl" onClick={() => handlePanchangDownload("festival", festFilter)}>↓ Download PDF</button>
            </>
          )}
        </div>
      </div>

      {/* Stage Body Content */}
      <div className="wrap">
        <div className="pagepad">
          {panchangTab === "pl" && (
            <>
              <div className="sh">
                <div>
                  <div className="sh-ey">FOUR WAYS IN</div>
                  <div className="sh-t">What you can look up</div>
                </div>
              </div>
              <div className="subs select-none">
                <a className="sub cursor-pointer" onClick={() => router.push("/panchang/today")}>
                  <div className="sub-i">☀</div>
                  <div className="sub-t">{"Today's Panchang"}</div>
                  <p className="sub-s">The full day — tithi, nakshatra, yoga, karana, sunrise, sunset and Rahu Kaal.</p>
                  <span className="sub-c">Open today ›</span>
                </a>
                <a className="sub cursor-pointer" onClick={() => setPanchangTab("vc")}>
                  <div className="sub-i">📿</div>
                  <div className="sub-t">2026 Vrat Calendar</div>
                  <p className="sub-s">Every Ekadashi, Pradosh, Chaturthi, Purnima and Amavasya for the year.</p>
                  <span className="sub-c">142 dates ›</span>
                </a>
                <a className="sub cursor-pointer" onClick={() => setPanchangTab("fc")}>
                  <div className="sub-i">🎆</div>
                  <div className="sub-t">Festival Calendar</div>
                  <p className="sub-s">Gregorian dates month by month, for anyone who thinks in months rather than tithis.</p>
                  <span className="sub-c">Browse by month ›</span>
                </a>
                <a className="sub cursor-pointer" onClick={() => router.push("/panchang/eclipse")}>
                  <div className="sub-i">🌑</div>
                  <div className="sub-t">Eclipse &amp; Grahan</div>
                  <p className="sub-s">Upcoming eclipses, visibility by city, and what actually determines Sutak Kaal.</p>
                  <span className="sub-c">2 in 2026 ›</span>
                </a>
              </div>

              <div className="sh">
                <div>
                  <div className="sh-ey">NEXT 30 DAYS</div>
                  <div className="sh-t">Coming up</div>
                  <p className="sh-s">Dates shown for {selectedCity}. Change your city above if you observe elsewhere.</p>
                </div>
                <a className="sh-a cursor-pointer" onClick={() => setPanchangTab("vc")}>Full vrat calendar ›</a>
              </div>

              <div className="dtable select-none mb-6">
                <div className="dt-head">
                  <span>DATE</span>
                  <span>OBSERVANCE</span>
                  <span>TITHI</span>
                  <span />
                </div>
                {(() => {
                  const today = new Date();
                  const todayUtc = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));
                  const upcomingVrats = vratEntries
                    .filter(vrat => new Date(vrat.date).getTime() >= todayUtc.getTime())
                    .slice(0, 6);

                  if (upcomingVrats.length === 0) {
                    return (
                      <div className="p-8 text-center text-xs text-[#8A7A6E]">No upcoming observances found in the database. Use admin panel to sync dates.</div>
                    );
                  }

                  return upcomingVrats.map(vrat => {
                    const dObj = new Date(vrat.date);
                    const day = dObj.getUTCDate();
                    const month = dObj.toLocaleDateString("en-US", { month: "short", timeZone: "UTC" });
                    const weekday = dObj.toLocaleDateString("en-US", { weekday: "long", timeZone: "UTC" });
                    
                    return renderVratRow({
                      d: `${day} ${month}`,
                      dw: weekday,
                      n: Math.abs(dObj.getTime() - todayUtc.getTime()) < 24 * 60 * 60 * 1000 ? `${vrat.name} (Today)` : vrat.name,
                      x: vrat.description || undefined,
                      t: vrat.tithiDetail || `${vrat.category} Tithi`,
                      cd: calculateCountdown(vrat.date),
                      cd_c: calculateCountdown(vrat.date) === "PASSED" ? " past" : " soon",
                      slug: vrat.linkedGuideId || undefined,
                    });
                  });
                })()}
              </div>

              <div className="learn mb-6">
                <div>
                  <div className="ln-ey">BEFORE YOU USE ANY OF THIS</div>
                  <div className="ln-t">Learn to read it once, and never ask again</div>
                  <p className="ln-p">Panch means five. Ang means limb. Five things tracked daily — and once you can read them, you will never have to ask anyone which day a festival falls on.</p>
                  <button className="ln-c hover:brightness-110" onClick={() => triggerToast("Opening Panchang guide...")}>{"How to read today's Panchang ›"}</button>
                </div>
                <div className="ln-list">
                  <div className="ln-i">
                    <span className="ln-n">1</span>
                    <div>
                      <div className="ln-it">Tithi</div>
                      <div className="ln-is">The lunar day — what fixes almost every festival</div>
                    </div>
                  </div>
                  <div className="ln-i">
                    <span className="ln-n">2</span>
                    <div>
                      <div className="ln-it">Paksha</div>
                      <div className="ln-is">Waxing or waning half of the month</div>
                    </div>
                  </div>
                  <div className="ln-i">
                    <span className="ln-n">3</span>
                    <div>
                      <div className="ln-it">Nakshatra</div>
                      <div className="ln-is">Where the Moon sits among 27 segments</div>
                    </div>
                  </div>
                  <div className="ln-i">
                    <span className="ln-n">4</span>
                    <div>
                      <div className="ln-it">Vara &amp; the rest</div>
                      <div className="ln-is">Weekday, yoga, karana — the finer grain</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="dlband select-none mb-6">
                <div className="dl-i">📅</div>
                <div>
                  <div className="dl-t">The full 2026 calendar, on one PDF</div>
                  <p className="dl-s">Every tithi, vrat and festival date for the year, computed for your city. Print it, or keep it on your phone.</p>
                </div>
                <button className="dl-c hover:brightness-110" onClick={() => handlePanchangDownload("calendar")}>Download calendar ›</button>
              </div>
            </>
          )}

          {panchangTab === "vc" && (
            <>
              <div className="mtabs select-none">
                {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((m) => {
                  const count = getObservancesCountForMonth(m);
                  return (
                    <button 
                      key={m} 
                      className={`mt ${selectedMonth === m ? "on" : ""}`} 
                      onClick={() => setSelectedMonth(m)}
                    >
                      {m}
                      <span>{count > 0 ? `${count} dates` : "—"}</span>
                    </button>
                  );
                })}
              </div>

              {(() => {
                const filteredVrats = vratEntries.filter(vrat => {
                  const vratMonth = getVratMonthAbbr(vrat.date);
                  if (vratMonth !== selectedMonth) return false;
                  
                  if (vratFilter !== "All") {
                    return (
                      vrat.category.toLowerCase().includes(vratFilter.toLowerCase()) || 
                      vrat.name.toLowerCase().includes(vratFilter.toLowerCase())
                    );
                  }
                  return true;
                });

                return (
                  <>
                    <div className="dtable select-none mb-6">
                      <div className="dt-mh">
                        <span className="dt-mt">{selectedMonth.toUpperCase()} 2026</span>
                        <span className="dt-mc">{filteredVrats.length} observances · {HINDU_MONTHS_MAP[selectedMonth]}</span>
                      </div>
                      <div className="dt-head">
                        <span>DATE</span>
                        <span>OBSERVANCE</span>
                        <span>TITHI</span>
                        <span />
                      </div>
                      {filteredVrats.length === 0 ? (
                        <div className="p-8 text-center text-xs text-[#8A7A6E]">
                          No observances found in {selectedMonth} 2026. Use admin panel to sync dates.
                        </div>
                      ) : (
                        filteredVrats.map(vrat => {
                          const dObj = new Date(vrat.date);
                          const day = dObj.getUTCDate();
                          const weekday = dObj.toLocaleDateString("en-US", { weekday: "long", timeZone: "UTC" });
                          
                          return renderVratRow({
                            d: `${day} ${selectedMonth}`,
                            dw: weekday,
                            n: vrat.name,
                            x: vrat.description || undefined,
                            t: vrat.tithiDetail || `${vrat.category} Tithi`,
                            cd: calculateCountdown(vrat.date),
                            cd_c: calculateCountdown(vrat.date) === "PASSED" ? " past" : " soon",
                            slug: vrat.linkedGuideId || undefined,
                          });
                        })
                      )}
                    </div>

                    <div className="learn mb-6">
                      <div>
                        <div className="ln-ey">WHY YOUR CITY MATTERS</div>
                        <div className="ln-t">Two apps can show different dates, and both can be right</div>
                        <p className="ln-p">A tithi begins at a fixed moment in time — but the Hindu day begins at sunrise, and sunrise is not the same everywhere. A tithi that starts before sunrise in Delhi may start after it in Mumbai, moving the date by a day.</p>
                        <button className="ln-c hover:brightness-110" onClick={() => triggerToast("Opening city documentation...")}>Read the full explanation ›</button>
                      </div>
                      <div className="ln-list">
                        <div className="ln-i">
                          <span className="ln-n">✓</span>
                          <div>
                            <div className="ln-it">Set your city once</div>
                            <div className="ln-is">Every date on the platform recomputes</div>
                          </div>
                        </div>
                        <div className="ln-i">
                          <span className="ln-n">✓</span>
                          <div>
                            <div className="ln-it">Purnimanta or Amanta</div>
                            <div className="ln-is">North India uses Purnimanta — the default here</div>
                          </div>
                        </div>
                        <div className="ln-i">
                          <span className="ln-n">✓</span>
                          <div>
                            <div className="ln-it">Verified manually</div>
                            <div className="ln-is">Entered and checked, never auto-fetched</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="dlband select-none mb-6">
                      <div className="dl-i">📿</div>
                      <div>
                        <div className="dl-t">All 142 dates, on one page</div>
                        <p className="dl-s">The complete 2026 vrat calendar as a PDF — computed for your city, ready to print or forward.</p>
                      </div>
                      <button className="dl-c hover:brightness-110" onClick={() => handlePanchangDownload("vrat", vratFilter)}>Download PDF ›</button>
                    </div>
                  </>
                );
              })()}
            </>
          )}

          {panchangTab === "fc" && (
            <>
              <div className="mtabs select-none">
                {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((m) => {
                  const filteredFests = vratEntries.filter(v => getVratMonthAbbr(v.date) === m);
                  const count = filteredFests.length;
                  return (
                    <button
                      key={m}
                      className={`mt ${selectedMonth === m ? "on" : ""}`}
                      onClick={() => setSelectedMonth(m)}
                    >
                      {m}
                      <span>{count > 0 ? `${count} festivals` : "—"}</span>
                    </button>
                  );
                })}
              </div>

              {(() => {
                const filteredFests = vratEntries.filter(vrat => {
                  const vratMonth = getVratMonthAbbr(vrat.date);
                  if (vratMonth !== selectedMonth) return false;
                  
                  if (festFilter !== "All festivals") {
                    const filter = festFilter.toLowerCase();
                    if (filter === "shiva") return vrat.name.toLowerCase().includes("shiva") || vrat.category.toLowerCase().includes("pradosh");
                    if (filter === "vishnu") return vrat.name.toLowerCase().includes("vishnu") || vrat.category.toLowerCase().includes("ekadashi");
                    if (filter === "devi") return vrat.name.toLowerCase().includes("devi") || vrat.name.toLowerCase().includes("teej") || vrat.name.toLowerCase().includes("navratri") || vrat.name.toLowerCase().includes("durga");
                    if (filter === "ganesha") return vrat.name.toLowerCase().includes("ganesh") || vrat.category.toLowerCase().includes("chaturthi");
                  }
                  return true;
                });

                return (
                  <>
                    <div className="sh" style={{ marginTop: 0 }}>
                      <div>
                        <div className="sh-ey">{selectedMonth.toUpperCase()} 2026</div>
                        <div className="sh-t">{HINDU_MONTHS_MAP[selectedMonth]}</div>
                        <p className="sh-s">Observances listed in chronological order.</p>
                      </div>
                      <a className="sh-a cursor-pointer" onClick={() => triggerToast(`Syncing ${selectedMonth} festivals to calendar...`)}>Add to your calendar ›</a>
                    </div>

                    <div className="fgrid select-none mb-6">
                      {filteredFests.length === 0 ? (
                        <div className="col-span-full bg-white border border-border rounded-2xl p-12 text-center text-sub-text">
                          No observances found in {selectedMonth} 2026. Use admin panel to sync dates.
                        </div>
                      ) : (
                        filteredFests.map(vrat => {
                          const dObj = new Date(vrat.date);
                          const day = dObj.getUTCDate().toString();
                          const month = dObj.toLocaleDateString("en-US", { month: "short", timeZone: "UTC" }).toUpperCase();
                          const weekday = dObj.toLocaleDateString("en-US", { weekday: "long", timeZone: "UTC" });
                          
                          return renderFestCard({
                            h: getFestStyle(vrat.category, vrat.name),
                            dd: day,
                            mm: month,
                            dw: weekday,
                            n: vrat.name,
                            t: vrat.tithiDetail || `${vrat.category} Tithi`,
                            tags: vrat.linkedGuideId ? [["g", "GUIDE LIVE"]] : [["n", "GUIDE COMING"]],
                            slug: vrat.linkedGuideId || undefined,
                          });
                        })
                      )}
                    </div>
                  </>
                );
              })()}

              {/* Download Band */}
              <div className="dlband select-none mb-6">
                <div className="dl-i">🎆</div>
                <div>
                  <div className="dl-t">The whole year, month by month</div>
                  <p className="dl-s">Every festival date for 2026 as a PDF — Gregorian dates with the tithi beneath each one.</p>
                </div>
                <button className="dl-c hover:brightness-110" onClick={() => handlePanchangDownload("festival", festFilter)}>Download PDF ›</button>
              </div>
            </>
          )}
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
