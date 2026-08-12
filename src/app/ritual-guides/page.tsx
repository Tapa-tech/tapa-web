"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AnnouncementBar from "@/components/AnnouncementBar";
import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";

// Types for views
type ViewKey = "rg" | "pa" | "dc" | "rk" | "purohit";

interface CardData {
  h?: string;      // header class (e.g. h-teej, h-ganesh)
  when?: string;   // e.g., "IN 6 DAYS", "ORDER BY 10 SEP"
  now?: boolean;   // if true, shows "now" style
  rt?: string;     // e.g. "SEPTEMBER", "12 AUGUST"
  t: string;       // title
  d?: string;      // date or subtitle
  s: string;       // description text
  pills?: [string, string][];  // list of pills e.g. [['d', 'DHARMA · 4/5']]
  read?: string;   // e.g. '9 min'
  myth?: string;   // corrections myth
}

interface ViewData {
  cls: string;
  crumb: string;
  eyebrow: string;
  title: string;
  desc: string;
  meta: string[];
  sideLabel: string;
  sideTitle: string;
  sideDesc: string;
  sideButton: string;
  filters: [string, number][];
  sort?: string;
}

function RitualGuidesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialView = (searchParams.get("view") as ViewKey) || "rg";

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("Ritual Guides");
  const [view, setView] = useState<ViewKey>(initialView);
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({
    rg: "Coming up",
    pa: "All",
    dc: "All",
    rk: "All kits",
  });

  const [panchangTab, setPanchangTab] = useState<"pl" | "vc" | "fc">("pl");
  const [city] = useState("New Delhi");
  const [calendarSystem, setCalendarSystem] = useState<"Purnimanta" | "Amanta">("Purnimanta");
  const [vratFilter, setVratFilter] = useState("All");
  const [festFilter, setFestFilter] = useState("All festivals");
  const [selectedMonth, setSelectedMonth] = useState("Sep");

  const triggerToast = (message: string = "Feature launching soon!") => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const viewParamValue = searchParams.get("view");
  // Sync state view on search parameter changes
  useEffect(() => {
    const viewParam = viewParamValue as ViewKey;
    if (viewParam && ["rg", "pa", "dc", "rk", "purohit"].includes(viewParam)) {
      setView(viewParam);
      if (viewParam === "rg") setActiveTab("Ritual Guides");
      else if (viewParam === "pa") setActiveTab("Panchang");
      else if (viewParam === "rk") setActiveTab("Ritual Kits");
      else if (viewParam === "dc") setActiveTab("Dharmic Concepts");
      else if (viewParam === "purohit") setActiveTab("Pujan with Purohit");
    } else {
      setView("rg");
      setActiveTab("Ritual Guides");
    }
  }, [searchParams, viewParamValue]);

  // Sync TopNav actions with page view state
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    if (tabId === "Ritual Guides") {
      setView("rg");
      router.push("/ritual-guides?view=rg");
    } else if (tabId === "Panchang") {
      router.push("/panchang");
    } else if (tabId === "Pujan with Purohit") {
      setView("purohit");
      router.push("/ritual-guides?view=purohit");
    } else if (tabId === "Ritual Kits") {
      router.push("/ritual-kits");
    }
  };

  // Helper to switch view from the inline `.prev` preview switcher
  const handleInlineViewSwitch = (key: ViewKey) => {
    if (key === "pa") {
      router.push("/panchang");
      return;
    }
    setView(key);
    router.push(`/ritual-guides?view=${key}`);
    if (key === "rg") {
      setActiveTab("Ritual Guides");
    } else if (key === "rk") {
      setActiveTab("Ritual Kits");
    } else if (key === "dc") {
      setActiveTab("Dharmic Concepts");
    }
  };

  // Views metadata mapping
  const viewMeta: Record<ViewKey, ViewData> = {
    rg: {
      cls: "rg",
      crumb: "Home › Ritual Guides",
      eyebrow: "RITUAL GUIDES",
      title: "Every ritual, the right way",
      desc: "The complete vidhi for festivals, vrats and life events — the steps, the story behind them, and a clear line between what scripture says and what your family does. Free, always.",
      meta: ["34 guides live", "21 more by December", "4 sub-categories"],
      sideLabel: "◔ NEW TO ALL OF THIS?",
      sideTitle: "Start with Beginner's Guides",
      sideDesc: "No tags, no citations, no Sanskrit you have to look up. Just what to do.",
      sideButton: "Start here ›",
      filters: [
        ["Coming up", 1],
        ["This month", 0],
        ["Shiva", 0],
        ["Vishnu", 0],
        ["Devi", 0],
        ["Ganesha", 0],
      ],
      sort: "Date — soonest first",
    },
    pa: {
      cls: "pa",
      crumb: "Home › Panchang",
      eyebrow: "PANCHANG",
      title: "The calendar that follows the Moon",
      desc: "Today's tithi, the year's vrat dates, and how to read any of it yourself. Computed for your city — because a festival date genuinely differs between Delhi and Mumbai, and both are correct.",
      meta: ["365 days computed", "142 vrat dates in 2026", "5 sub-categories"],
      sideLabel: "☀ COMPUTED FOR",
      sideTitle: "New Delhi · Purnimanta",
      sideDesc: "Entered and verified manually. We do not auto-fetch, because a page served from your own IP returns the wrong city.",
      sideButton: "Change city ›",
      filters: [
        ["All", 1],
        ["Ekadashi", 0],
        ["Pradosh", 0],
        ["Purnima", 0],
        ["Amavasya", 0],
      ],
      sort: "Date — soonest first",
    },
    dc: {
      cls: "dc",
      crumb: "Home › Dharmic Concepts",
      eyebrow: "DHARMIC CONCEPTS",
      title: "The object in your hand has a story",
      desc: "Why bilva and not tulsi. Why three stories and not one. These sit behind every ritual guide — when a samagri list says \"bilva leaves\", this is where the reason lives.",
      meta: ["2 live", "14 planned by March", "5 sub-categories"],
      sideLabel: "◗ LOOK UP ANY TERM",
      sideTitle: "The Glossary",
      sideDesc: "142 words defined once, in plain language, with the Devanagari and how to say it out loud.",
      sideButton: "Open the glossary ›",
      filters: [
        ["All", 1],
        ["Shiva", 0],
        ["Vishnu", 0],
        ["Devi", 0],
        ["Ganesha", 0],
      ],
      sort: "Most read",
    },
    rk: {
      cls: "rk",
      crumb: "Home › Ritual Kits",
      eyebrow: "RITUAL KITS · PRE-BOOKING OPEN",
      title: "Everything the vidhi asks for, in one box",
      desc: "Sourced, packed and delivered before the date. Nothing you could not buy yourself — we have just done the finding. Every samagri list stays free on the guide.",
      meta: ["14 kits", "4 sub-categories", "Free cancellation until dispatch"],
      sideLabel: "◷ WORTH SAYING PLAINLY",
      sideTitle: "You do not need a kit",
      sideDesc: "Every samagri list is free and complete. A kit saves you a morning in the market. It does not make the puja more valid.",
      sideButton: "Read a guide instead ›",
      filters: [
        ["All kits", 1],
        ["Pre-book", 0],
        ["In stock", 0],
        ["Under ₹1,000", 0],
        ["₹1,000–2,000", 0],
      ],
      sort: "Cut-off — soonest first",
    },
    purohit: {
      cls: "rg",
      crumb: "Home › Pujan with Purohit",
      eyebrow: "PUJAN WITH PUROHIT",
      title: "Qualified Purohits, verified vidhi",
      desc: "Connect with and book certified Purohits for complex life events, festive pujas, and personal sacraments. Available from November 2026.",
      meta: ["Launching soon", "Verified Purohits", "Seamless booking"],
      sideLabel: "◔ HAVE QUESTIONS?",
      sideTitle: "Check our criteria",
      sideDesc: "Learn how we verify scriptural expertise, punctual arrival, and devotion-focused guidance.",
      sideButton: "How it works ›",
      filters: [["All Pujas", 1]],
      sort: "",
    },
  };

  // Card renderer
  const renderCard = (o: CardData) => {
    const slug = o.t.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    return (
      <a
        key={o.t}
        className="c"
        onClick={(e) => {
          e.preventDefault();
          if (view === "rk") {
            router.push(`/ritual-kits/${slug}`);
          } else if (view === "rg") {
            router.push(`/ritual-guides/${slug}`);
          } else {
            triggerToast(`Opening details for: "${o.t}"`);
          }
        }}
      >
      <div className={`c-top ${o.h || ""}`}>
        {o.when && (
          <span className={`c-when ${o.now ? "now" : ""}`}>{o.when}</span>
        )}
        {o.rt && <span className="c-when">{o.rt}</span>}
      </div>
      <div className="c-b">
        <div className="c-t">{o.t}</div>
        {o.d && <div className="c-d">{o.d}</div>}
        <p className="c-s">{o.s}</p>
        <div className="c-f">
          {(o.pills || []).map((p, idx) => (
            <span key={idx} className={`pill ${p[0]}`}>
              {p[1]}
            </span>
          ))}
          {o.read && <span className="c-read">{o.read}</span>}
        </div>
      </div>
      {o.myth && (
        <div className="myth">
          <b>Corrects:</b> {o.myth}
        </div>
      )}
      </a>
    );
  };

  // Section Header renderer
  const renderSectionHeader = (
    ey: string,
    t: string,
    s: string | undefined,
    count: string,
    all: string
  ) => (
    <div className="sec-h">
      <div>
        <div className="sec-ey">{ey}</div>
        <div className="sec-t">{t}</div>
        {s && <p className="sec-s">{s}</p>}
      </div>
      <a
        className="sec-a"
        onClick={(e) => {
          e.preventDefault();
          triggerToast(`Viewing all from "${t}"`);
        }}
      >
        <span>{count}</span>
        {all} ›
      </a>
    </div>
  );

  // Row list item renderer
  const renderRow = (t: string, s: string) => (
    <a
      key={t}
      className="row"
      onClick={(e) => {
        e.preventDefault();
        triggerToast(`Opening details for: "${t}"`);
      }}
    >
      <span className="row-n">
        <span className="row-t">{t}</span>
        <span className="row-s">{s}</span>
      </span>
      <span className="row-a">›</span>
    </a>
  );

  const renderVratRow = (o: {
    d: string;
    dw: string;
    n: string;
    x?: string;
    t: string;
    cd: string;
    cd_c?: string;
    next?: boolean;
    slug: string;
  }) => (
    <div key={o.n} className={`dt-r${o.next ? " next" : ""}`}>
      <div>
        <div className="dt-d">{o.d}</div>
        <div className="dt-dw">{o.dw}</div>
      </div>
      <div>
        <div className="dt-n">{o.n}</div>
        {o.x && <div className="dt-x">{o.x}</div>}
      </div>
      <div className="dt-t">{o.t}</div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "12px" }}>
        <span className={`dt-cd ${o.cd_c || ""}`}>{o.cd}</span>
        <span
          className="dt-a cursor-pointer"
          onClick={() => router.push(`/ritual-guides/${o.slug}`)}
        >
          Guide ›
        </span>
      </div>
    </div>
  );

  const renderFestCard = (o: {
    h: string;
    dd: string;
    mm: string;
    dw: string;
    n: string;
    t: string;
    tags: [string, string][];
    slug: string;
  }) => (
    <a
      key={o.n}
      className="fc-card cursor-pointer"
      onClick={() => router.push(`/ritual-guides/${o.slug}`)}
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
          {o.tags.map((t, idx) => (
            <span key={idx} className={`tag ${t[0]}`}>
              {t[1]}
            </span>
          ))}
        </div>
      </div>
    </a>
  );

  // Active view metadata
  const currentMeta = viewMeta[view];

  return (
    <div className="ritual-guide-page min-h-screen bg-[#F2EDE4] text-[#2C2010] font-sans antialiased">
      {/* Existing Project Header */}
      <AnnouncementBar />
      <TopNav
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onTriggerToast={triggerToast}
      />

      {view !== "pa" ? (
        <>
          {/* BREADCRUMB */}
          <div className="bcrumb">
            <div className="bc-in">
              <span className="cursor-pointer hover:underline" onClick={() => handleInlineViewSwitch("rg")}>Home</span> › <b>{currentMeta.crumb.replace("Home › ", "")}</b>
            </div>
          </div>

          {/* HERO SECTION */}
          <section className={`chero ${currentMeta.cls}`}>
            <div className="wrap">
              <div className="chero-in">
                <div>
                  <p className="ch-ey">{currentMeta.eyebrow}</p>
                  <h1 className="ch-h1">{currentMeta.title}</h1>
                  <p className="ch-p">{currentMeta.desc}</p>
                  <div className="ch-meta">
                    {currentMeta.meta.map((m, idx) => (
                      <span key={idx} className="ch-m">
                        <b>{m.split(" ")[0]}</b> {m.substring(m.indexOf(" ") + 1)}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="ch-side">
                  <div className="chs-l">{currentMeta.sideLabel}</div>
                  <div className="chs-t">{currentMeta.sideTitle}</div>
                  <p className="chs-d">{currentMeta.sideDesc}</p>
                  <button
                    className="chs-c hover:brightness-110"
                    onClick={() => triggerToast(currentMeta.sideTitle)}
                  >
                    {currentMeta.sideButton}
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* FILTERS BAR */}
          <div className="filters">
            <div className="f-in">
              <span className="f-l">FILTER</span>
              {currentMeta.filters.map((filter, idx) => {
                const filterName = filter[0];
                const isSelected = activeFilters[view] === filterName;
                return (
                  <button
                    key={idx}
                    className={`fc ${isSelected ? "on" : ""}`}
                    onClick={() => {
                      setActiveFilters((prev) => ({ ...prev, [view]: filterName }));
                      triggerToast(`Filtering by "${filterName}"...`);
                    }}
                  >
                    {filterName}
                  </button>
                );
              })}
              {currentMeta.sort && (
                <span className="f-sort">
                  Sort — <b>{currentMeta.sort}</b> ▾
                </span>
              )}
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Custom breadcrumb for Panchang */}
          <div className="bcrumb">
            <div className="bc-in">
              {panchangTab === "pl" && <>Home › <b>Panchang</b></>}
              {panchangTab === "vc" && <>Home › <span className="cursor-pointer hover:underline" onClick={() => setPanchangTab("pl")}>Panchang</span> › <b>2026 Vrat Calendar</b></>}
              {panchangTab === "fc" && <>Home › <span className="cursor-pointer hover:underline" onClick={() => setPanchangTab("pl")}>Panchang</span> › <b>Festival Calendar</b></>}
            </div>
          </div>

          {/* Custom Hero for Panchang */}
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
                    <span className="td-live"><span className="livedot" />DELHI-NCR</span>
                  </div>
                  <div className="td-date">
                    <div className="td-day">Bhadrapada Krishna Panchami</div>
                    <div className="td-sub">Monday, 7 September 2026 · Purnimanta</div>
                  </div>
                  <div className="td-rows">
                    <div className="tdr"><span className="tdk">PAKSHA</span><span className="tdv">Krishna — waning</span></div>
                    <div className="tdr"><span className="tdk">NAKSHATRA</span><span className="tdv">Rohini (Auspicious)</span></div>
                    <div className="tdr"><span className="tdk">SUNRISE / SUNSET</span><span className="tdv">5:58 AM / 6:34 PM</span></div>
                    <div className="tdr"><span className="tdk">RAHU KAAL</span><span className="tdv">7:32 AM - 9:07 AM</span></div>
                    <div className="tdr"><span className="tdk">YOGA · KARANA</span><span className="tdv">Vriddhi · Kaulava</span></div>
                  </div>
                  <div className="td-foot" onClick={() => router.push("/ritual-guides/ganesh-chaturthi")} style={{ cursor: "pointer" }}>
                    <span className="tdf-t"><b>Next major date —</b> Ganesh Chaturthi, 14 September</span>
                    <span className="tdf-c">Open guide &rsaquo;</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Custom Controls for Panchang */}
          <div className="ctrl">
            <div className="ctrl-in">
              <div className="city cursor-pointer" onClick={() => triggerToast("City selector launch scheduled for October 2026.")}>
                <span className="city-l">COMPUTED FOR</span>
                <span className="city-v">{city}</span>
                <span className="city-c">Change &rsaquo;</span>
              </div>
              <div className="sep" />
              {panchangTab === "pl" && (
                <>
                  <button className={`fc ${calendarSystem === "Purnimanta" ? "on" : ""}`} onClick={() => setCalendarSystem("Purnimanta")}>Purnimanta</button>
                  <button className={`fc ${calendarSystem === "Amanta" ? "on" : ""}`} onClick={() => setCalendarSystem("Amanta")}>Amanta</button>
                  <button className="dl" onClick={() => triggerToast("Downloading 2026 calendar PDF...")}>↓ Download 2026 calendar</button>
                </>
              )}
              {panchangTab === "vc" && (
                <>
                  {["All", "Ekadashi", "Pradosh", "Chaturthi", "Purnima", "Amavasya"].map((type) => (
                    <button key={type} className={`fc ${vratFilter === type ? "on" : ""}`} onClick={() => setVratFilter(type)}>{type}</button>
                  ))}
                  <button className="dl" onClick={() => triggerToast("Downloading Vrat Calendar PDF...")}>↓ Download PDF</button>
                </>
              )}
              {panchangTab === "fc" && (
                <>
                  {["All festivals", "Major only", "Shiva", "Vishnu", "Devi", "Ganesha"].map((type) => (
                    <button key={type} className={`fc ${festFilter === type ? "on" : ""}`} onClick={() => setFestFilter(type)}>{type}</button>
                  ))}
                  <button className="dl" onClick={() => triggerToast("Downloading Festival Calendar PDF...")}>↓ Download PDF</button>
                </>
              )}
            </div>
          </div>
        </>
      )}

      {/* BODY CONTENT STAGE */}
      <div className="wrap">
        <div className="pagepad">
          {view === "rg" && (
            <>
              {/* Beginner's Guides */}
              <div className="sec">
                {renderSectionHeader(
                  "START HERE",
                  "Beginner's Guides",
                  "Plain language, no citations, no Sanskrit to look up. Read in order — it takes about half an hour.",
                  "5 guides",
                  "View all"
                )}
                <div className="fcard">
                  <div className="fc-l beg">
                    <span className="fc-tag">READ IN THIS ORDER</span>
                    <div className="fc-t">Nobody is born knowing the vidhi</div>
                    <p className="fc-d">
                      Five guides that assume nothing. What to buy, what to say,
                      how long it takes, and what genuinely does not matter as
                      much as you have been told.
                    </p>
                    <button
                      className="fc-c"
                      onClick={() => triggerToast("Starting Step 1...")}
                    >
                      Start at step 1 ›
                    </button>
                  </div>
                  <div className="fc-r">
                    <a
                      className="fc-i"
                      onClick={() => triggerToast("Opening: 1 · What is a vrat?")}
                    >
                      <span>
                        <span className="fc-in">1 · What is a vrat?</span>
                        <span className="fc-is">6 min read</span>
                      </span>
                      <span className="fc-ia">›</span>
                    </a>
                    <a
                      className="fc-i"
                      onClick={() =>
                        triggerToast("Opening: 2 · Your first puja at home")
                      }
                    >
                      <span>
                        <span className="fc-in">2 · Your first puja at home</span>
                        <span className="fc-is">8 min · under ₹300 to start</span>
                      </span>
                      <span className="fc-ia">›</span>
                    </a>
                    <a
                      className="fc-i"
                      onClick={() =>
                        triggerToast("Opening: 3 · Ganesh Chaturthi for beginners")
                      }
                    >
                      <span>
                        <span className="fc-in">
                          3 · Ganesh Chaturthi for beginners
                        </span>
                        <span className="fc-is">9 min · for 14 September</span>
                      </span>
                      <span className="fc-ia">›</span>
                    </a>
                    <a
                      className="fc-i"
                      onClick={() =>
                        triggerToast("Opening: 4 · Diwali for beginners")
                      }
                    >
                      <span>
                        <span className="fc-in">4 · Diwali for beginners</span>
                        <span className="fc-is">9 min · for November</span>
                      </span>
                      <span className="fc-ia">›</span>
                    </a>
                    <a
                      className="fc-i"
                      onClick={() =>
                        triggerToast("Opening: 5 · The seven kandas")
                      }
                    >
                      <span>
                        <span className="fc-in">5 · The seven kandas</span>
                        <span className="fc-is">6 min · no Sanskrit required</span>
                      </span>
                      <span className="fc-ia">›</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Fixed to a Tithi */}
              <div className="sec">
                {renderSectionHeader(
                  "FIXED TO A TITHI",
                  "Festive Pujans",
                  "The date moves each year because it follows the lunar calendar, not the Gregorian one. Every guide states both.",
                  "18 guides",
                  "View all"
                )}
                <div className="grid">
                  {renderCard({
                    h: "h-teej",
                    when: "IN 6 DAYS",
                    now: true,
                    t: "Hartalika Teej",
                    d: "13 September",
                    s: "The sand Shivalinga, the night vigil, and why this is a different vrat from Hariyali Teej.",
                    pills: [["d", "DHARMA · 4/5"]],
                    read: "9 min",
                    myth: '"Nirjala or the vrat doesn’t count."',
                  })}
                  {renderCard({
                    h: "h-ganesh",
                    when: "IN 7 DAYS",
                    now: true,
                    t: "Ganesh Chaturthi",
                    d: "14 September",
                    s: "Prana pratishtha at the Madhyahna muhurat, and what a pandit is genuinely for.",
                    pills: [["d", "DHARMA · 4/5"]],
                    read: "11 min",
                    myth: '"Only a pandit can perform this."',
                  })}
                  {renderCard({
                    h: "h-devi",
                    when: "IN 34 DAYS",
                    t: "Sharad Navratri",
                    d: "11–19 October",
                    s: "Nine nights, nine forms, one Mother. Ghatasthapana to Maha Navami, day by day.",
                    pills: [["d", "DHARMA · 4/5"]],
                    read: "18 min",
                    myth: '"If the Akhand Jyoti goes out, it is wasted."',
                  })}
                </div>
              </div>

              {/* Not Tied to One Date */}
              <div className="sec">
                {renderSectionHeader(
                  "NOT TIED TO ONE DATE",
                  "All-Year Pujans",
                  "Recurring observances and household rituals. Kept when the household needs them, not when the calendar says so.",
                  "11 guides",
                  "View all"
                )}
                <div className="grid">
                  {renderCard({
                    h: "h-shiva",
                    t: "Sawan Somwar Vrat",
                    d: "Every Monday of Shravan",
                    s: "Jalabhishek, the bilva offering, and the fasting forms that are genuinely accepted.",
                    pills: [["d", "DHARMA · 4/5"]],
                    read: "12 min",
                    myth: '"Missing one Monday invalidates all of them."',
                  })}
                  {renderCard({
                    h: "h-earth",
                    t: "Sundarkand Path",
                    d: "Most often on Tuesday",
                    s: "The fifth kanda, recited at home. What you need, how long it takes, and the parts people skip.",
                    pills: [["d", "DHARMA · 4/5"]],
                    read: "13 min",
                  })}
                  {renderCard({
                    h: "h-vishnu",
                    t: "Satyanarayan Katha",
                    d: "Purnima, or any auspicious day",
                    s: "The five-chapter katha, the prasad, and why this is the most performed household puja in North India.",
                    pills: [["d", "DHARMA · 4/5"]],
                    read: "14 min",
                  })}
                </div>
              </div>

              {/* Once in a Life */}
              <div className="sec">
                {renderSectionHeader(
                  "ONCE IN A LIFE",
                  "Sanskar & Life Events",
                  "The sixteen sacraments, from before birth to after death. Written with care, and without fear.",
                  "8 guides",
                  "View all"
                )}
                <div className="grid">
                  {renderCard({
                    h: "h-sanskar",
                    t: "Naamkaran",
                    d: "Birth & childhood",
                    s: "Naming the child. When it is done, who does it, and what the ceremony actually requires.",
                    pills: [["d", "DHARMA · 5/5"]],
                    read: "10 min",
                  })}
                  {renderCard({
                    h: "h-sanskar",
                    t: "Griha Pravesh",
                    d: "Home & space",
                    s: "Entering a new home. The kalash, the boiling of milk, and the muhurat that matters.",
                    pills: [["d", "DHARMA · 4/5"]],
                    read: "12 min",
                  })}
                  {renderCard({
                    h: "h-sanskar",
                    t: "Shraddha & Pitru Karma",
                    d: "End of life",
                    s: "Tarpan, the sixteen days of Pitru Paksha, and what is asked of the one performing it.",
                    pills: [["d", "DHARMA · 5/5"]],
                    read: "16 min",
                    myth: '"Skipping shraddha harms the departed."',
                  })}
                </div>
              </div>
            </>
          )}

          {view === "pa" && (
            <>
              {panchangTab === "pl" && (
                <>
                  <div className="sh">
                    <div>
                      <div className="sh-ey">FOUR WAYS IN</div>
                      <div className="sh-t">What you can look up</div>
                    </div>
                  </div>
                  <div className="subs select-none">
                    <a className="sub cursor-pointer" onClick={() => triggerToast("Opening today's Panchang...")}>
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
                    <a className="sub cursor-pointer" onClick={() => triggerToast("Grahan & Eclipse details launching soon!")}>
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
                      <p className="sh-s">Dates shown for {city}. Change your city above if you observe elsewhere.</p>
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
                    {renderVratRow({
                      d: "11 Sep",
                      dw: "Friday",
                      n: "Parsva Ekadashi",
                      x: "Grain avoidance · parana next morning",
                      t: "Bhadrapada Shukla Ekadashi",
                      cd: "IN 4 DAYS",
                      cd_c: " soon",
                      next: true,
                      slug: "parsva-ekadashi"
                    })}
                    {renderVratRow({
                      d: "13 Sep",
                      dw: "Sunday",
                      n: "Hartalika Teej",
                      x: "Sand Shivalinga · night vigil",
                      t: "Bhadrapada Shukla Tritiya",
                      cd: "IN 6 DAYS",
                      cd_c: " soon",
                      slug: "hartalika-teej"
                    })}
                    {renderVratRow({
                      d: "14 Sep",
                      dw: "Monday",
                      n: "Ganesh Chaturthi",
                      x: "Prana pratishtha · Madhyahna muhurat",
                      t: "Bhadrapada Shukla Chaturthi",
                      cd: "IN 7 DAYS",
                      cd_c: " soon",
                      slug: "ganesh-chaturthi"
                    })}
                    {renderVratRow({
                      d: "19 Sep",
                      dw: "Saturday",
                      n: "Radha Ashtami",
                      t: "Bhadrapada Shukla Ashtami",
                      cd: "IN 12 DAYS",
                      slug: "radha-ashtami"
                    })}
                    {renderVratRow({
                      d: "23 Sep",
                      dw: "Wednesday",
                      n: "Anant Chaturdashi",
                      x: "Ganesh Visarjan",
                      t: "Bhadrapada Shukla Chaturdashi",
                      cd: "IN 16 DAYS",
                      slug: "anant-chaturdashi"
                    })}
                    {renderVratRow({
                      d: "26 Sep",
                      dw: "Saturday",
                      n: "Pitru Paksha begins",
                      x: "Shraddha period · 16 days",
                      t: "Bhadrapada Purnima",
                      cd: "IN 19 DAYS",
                      slug: "pitru-paksha"
                    })}
                  </div>

                  {/* Learn Band */}
                  <div className="learn select-none mb-6">
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

                  {/* Download Band */}
                  <div className="dlband select-none mb-6">
                    <div className="dl-i">📅</div>
                    <div>
                      <div className="dl-t">The full 2026 calendar, on one PDF</div>
                      <p className="dl-s">Every tithi, vrat and festival date for the year, computed for your city. Print it, or keep it on your phone.</p>
                    </div>
                    <button className="dl-c hover:brightness-110" onClick={() => triggerToast("Downloading 2026 calendar...")}>Download calendar ›</button>
                  </div>
                </>
              )}

              {panchangTab === "vc" && (
                <>
                  <div className="mtabs select-none">
                    {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((m) => (
                      <button
                        key={m}
                        className={`mt ${selectedMonth === m ? "on" : ""}`}
                        onClick={() => setSelectedMonth(m)}
                      >
                        {m}
                        <span>{m === "Sep" ? "12 dates" : "—"}</span>
                      </button>
                    ))}
                  </div>

                  {selectedMonth === "Sep" ? (
                    <div className="dtable select-none mb-6">
                      <div className="dt-mh">
                        <span className="dt-mt">SEPTEMBER 2026</span>
                        <span className="dt-mc">12 observances · Bhadrapada into Ashwin</span>
                      </div>
                      <div className="dt-head">
                        <span>DATE</span>
                        <span>OBSERVANCE</span>
                        <span>TITHI</span>
                        <span />
                      </div>
                      {renderVratRow({ d: "2 Sep", dw: "Wednesday", n: "Sankashti Chaturthi", x: "Moonrise required to break the fast", t: "Bhadrapada Krishna Chaturthi", cd: "PASSED", cd_c: " past", slug: "sankashti-chaturthi" })}
                      {renderVratRow({ d: "4 Sep", dw: "Friday", n: "Krishna Janmashtami", x: "Smarta observance · Nishita Kaal", t: "Bhadrapada Krishna Ashtami", cd: "PASSED", cd_c: " past", slug: "krishna-janmashtami" })}
                      {renderVratRow({ d: "8 Sep", dw: "Tuesday", n: "Aja Ekadashi", x: "Grain avoidance · parana next morning", t: "Bhadrapada Krishna Ekadashi", cd: "TOMORROW", cd_c: " soon", next: true, slug: "aja-ekadashi" })}
                      {renderVratRow({ d: "9 Sep", dw: "Wednesday", n: "Pradosh Vrat", x: "Bhauma-adjacent · evening Shiva puja", t: "Bhadrapada Krishna Trayodashi", cd: "IN 2 DAYS", cd_c: " soon", slug: "pradosh-vrat" })}
                      {renderVratRow({ d: "11 Sep", dw: "Friday", n: "Amavasya", x: "Pithori Amavasya · Shraddha observed", t: "Bhadrapada Amavasya", cd: "IN 4 DAYS", cd_c: " soon", slug: "amavasya" })}
                      {renderVratRow({ d: "13 Sep", dw: "Sunday", n: "Hartalika Teej", x: "Sand Shivalinga · night vigil", t: "Bhadrapada Shukla Tritiya", cd: "IN 6 DAYS", cd_c: " soon", slug: "hartalika-teej" })}
                      {renderVratRow({ d: "14 Sep", dw: "Monday", n: "Ganesh Chaturthi", x: "Prana pratishtha · Madhyahna muhurat", t: "Bhadrapada Shukla Chaturthi", cd: "IN 7 DAYS", cd_c: " soon", slug: "ganesh-chaturthi" })}
                      {renderVratRow({ d: "19 Sep", dw: "Saturday", n: "Radha Ashtami", t: "Bhadrapada Shukla Ashtami", cd: "IN 12 DAYS", slug: "radha-ashtami" })}
                      {renderVratRow({ d: "22 Sep", dw: "Tuesday", n: "Parsva Ekadashi", x: "Chaturmas midpoint", t: "Bhadrapada Shukla Ekadashi", cd: "IN 15 DAYS", slug: "parsva-ekadashi" })}
                      {renderVratRow({ d: "23 Sep", dw: "Wednesday", n: "Anant Chaturdashi", x: "Ganesh Visarjan", t: "Bhadrapada Shukla Chaturdashi", cd: "IN 16 DAYS", slug: "anant-chaturdashi" })}
                      {renderVratRow({ d: "24 Sep", dw: "Thursday", n: "Pradosh Vrat", t: "Bhadrapada Shukla Trayodashi", cd: "IN 17 DAYS", slug: "pradosh-vrat" })}
                      {renderVratRow({ d: "26 Sep", dw: "Saturday", n: "Bhadrapada Purnima", x: "Pitru Paksha begins", t: "Bhadrapada Purnima", cd: "IN 19 DAYS", slug: "pitru-paksha" })}
                    </div>
                  ) : (
                    <div className="bg-white border border-border rounded-2xl p-12 text-center text-sub-text mb-6">
                      Vrat calendar observances for {selectedMonth} 2026 are loading...
                    </div>
                  )}

                  {/* Learn Band */}
                  <div className="learn select-none mb-6">
                    <div>
                      <div className="ln-ey">WHY YOUR CITY MATTERS</div>
                      <div className="ln-t">Two apps can show different dates, and both can be right</div>
                      <p className="ln-p">A tithi begins at a fixed moment in time — but the Hindu day begins at sunrise, and sunrise is not the same everywhere. A tithi that starts before sunrise in Delhi may start after it in Mumbai, moving the date by a day.</p>
                      <button className="ln-c hover:brightness-110" onClick={() => triggerToast("Opening calculation explanation...")}>Read the full explanation ›</button>
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

                  {/* Download Band */}
                  <div className="dlband select-none mb-6">
                    <div className="dl-i">📿</div>
                    <div>
                      <div className="dl-t">All 142 dates, on one page</div>
                      <p className="dl-s">The complete 2026 vrat calendar as a PDF — computed for your city, ready to print or forward.</p>
                    </div>
                    <button className="dl-c hover:brightness-110" onClick={() => triggerToast("Downloading Vrat Calendar...")}>Download PDF ›</button>
                  </div>
                </>
              )}

              {panchangTab === "fc" && (
                <>
                  <div className="mtabs select-none">
                    {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((m) => (
                      <button
                        key={m}
                        className={`mt ${selectedMonth === m ? "on" : ""}`}
                        onClick={() => setSelectedMonth(m)}
                      >
                        {m}
                        <span>{m === "Sep" ? "6 festivals" : "—"}</span>
                      </button>
                    ))}
                  </div>

                  {selectedMonth === "Sep" ? (
                    <>
                      <div className="sh" style={{ marginTop: 0 }}>
                        <div>
                          <div className="sh-ey">SEPTEMBER 2026</div>
                          <div className="sh-t">Bhadrapada, into Ashwin</div>
                          <p className="sh-s">The busiest festival month of the second half of the year.</p>
                        </div>
                        <a className="sh-a cursor-pointer" onClick={() => triggerToast("Syncing September festivals to calendar...")}>Add to your calendar ›</a>
                      </div>

                      <div className="fgrid select-none mb-6">
                        {renderFestCard({ h: "h-krishna", dd: "4", mm: "SEP", dw: "Friday", n: "Krishna Janmashtami", t: "Bhadrapada Krishna Ashtami · Smarta", tags: [["g", "GUIDE LIVE"], ["n", "Also 5 Sep — Vaishnava"]], slug: "krishna-janmashtami" })}
                        {renderFestCard({ h: "h-shiva", dd: "13", mm: "SEP", dw: "Sunday", n: "Hartalika Teej", t: "Bhadrapada Shukla Tritiya", tags: [["g", "GUIDE LIVE"]], slug: "hartalika-teej" })}
                        {renderFestCard({ h: "h-ganesh", dd: "14", mm: "SEP", dw: "Monday", n: "Ganesh Chaturthi", t: "Bhadrapada Shukla Chaturthi", tags: [["g", "GUIDE LIVE"], ["n", "Madhyahna muhurat"]], slug: "ganesh-chaturthi" })}
                        {renderFestCard({ h: "h-devi", dd: "19", mm: "SEP", dw: "Saturday", n: "Radha Ashtami", t: "Bhadrapada Shukla Ashtami", tags: [["g", "GUIDE LIVE"]], slug: "radha-ashtami" })}
                        {renderFestCard({ h: "h-ganesh", dd: "23", mm: "SEP", dw: "Wednesday", n: "Anant Chaturdashi", t: "Bhadrapada Shukla Chaturdashi", tags: [["g", "GUIDE LIVE"], ["n", "Ganesh Visarjan"]], slug: "anant-chaturdashi" })}
                        {renderFestCard({ h: "h-earth", dd: "26", mm: "SEP", dw: "Saturday", n: "Pitru Paksha begins", t: "Bhadrapada Purnima · 16 days", tags: [["n", "GUIDE COMING"]], slug: "pitru-paksha" })}
                      </div>

                      <div className="sh">
                        <div>
                          <div className="sh-ey">NEXT MONTH</div>
                          <div className="sh-t">October — Navratri and Deepavali</div>
                          <p className="sh-s">The two largest observances of the year fall within five weeks of each other.</p>
                        </div>
                        <a className="sh-a cursor-pointer" onClick={() => triggerToast("Syncing October festivals to calendar...")}>See October ›</a>
                      </div>

                      <div className="fgrid select-none mb-6">
                        {renderFestCard({ h: "h-devi", dd: "11", mm: "OCT", dw: "Sunday", n: "Sharad Navratri begins", t: "Ashwin Shukla Pratipada · Ghatsthapana", tags: [["n", "GUIDE COMING"]], slug: "sharad-navratri" })}
                        {renderFestCard({ h: "h-devi", dd: "19", mm: "OCT", dw: "Monday", n: "Durga Ashtami", t: "Ashwin Shukla Ashtami", tags: [["n", "GUIDE COMING"]], slug: "durga-ashtami" })}
                        {renderFestCard({ h: "h-vishnu", dd: "21", mm: "OCT", dw: "Wednesday", n: "Vijayadashami", t: "Ashwin Shukla Dashami", tags: [["n", "GUIDE COMING"]], slug: "vijayadashami" })}
                      </div>
                    </>
                  ) : (
                    <div className="bg-white border border-border rounded-2xl p-12 text-center text-sub-text mb-6">
                      Festival calendar for {selectedMonth} 2026 is loading...
                    </div>
                  )}

                  {/* Download Band */}
                  <div className="dlband select-none mb-6">
                    <div className="dl-i">🎆</div>
                    <div>
                      <div className="dl-t">The whole year, month by month</div>
                      <p className="dl-s">Every festival date for 2026 as a PDF — Gregorian dates with the tithi beneath each one.</p>
                    </div>
                    <button className="dl-c hover:brightness-110" onClick={() => triggerToast("Downloading Festival Calendar...")}>Download PDF ›</button>
                  </div>
                </>
              )}
            </>
          )}

          {view === "dc" && (
            <>
              {/* Materials */}
              <div className="sec">
                {renderSectionHeader(
                  "OBJECTS AND WHAT THEY MEAN",
                  "Materials",
                  "The things you hold, offer and light. Each one has a story, a source and a set of offering rules.",
                  "9 planned · 1 live",
                  "View all"
                )}
                <div className="grid">
                  {renderCard({
                    h: "h-shiva",
                    rt: "LIVE",
                    t: "Why is bilva dear to Mahadev?",
                    d: "Materials · Shiva",
                    s: "Three leaves on one stem. The tree did not study scripture to grow that way — the tradition recognised what it saw.",
                    pills: [
                      ["d", "DHARMA · 4/5"],
                      ["n", "PURANIC"],
                    ],
                    read: "12 min",
                  })}
                  {renderCard({
                    h: "h-vishnu",
                    rt: "SOON",
                    t: "Why is tulsi sacred to Vishnu?",
                    d: "Materials · Vishnu",
                    s: "Lakshmi’s form as a plant, present in every Vishnu and Krishna puja — and never offered to Shiva.",
                    pills: [["n", "COMING SOON"]],
                    read: "—",
                  })}
                  {renderCard({
                    h: "h-ganesh",
                    rt: "SOON",
                    t: "Why is durva offered to Ganesha?",
                    d: "Materials · Ganesha",
                    s: "The grass offered on his head, in bunches of twenty-one. Named in the Ganesha Purana.",
                    pills: [["n", "COMING SOON"]],
                    read: "—",
                  })}
                </div>
              </div>

              {/* Acts and Ideas */}
              <div className="sec">
                {renderSectionHeader(
                  "ACTS AND IDEAS",
                  "Meanings & Practices",
                  "What you do, and what it means. Sankalpa, abhishek, avahana — the acts every vidhi assumes you already understand.",
                  "12 planned · 1 live",
                  "View all"
                )}
                <div className="grid">
                  {renderCard({
                    h: "h-thread",
                    rt: "LIVE",
                    t: "Three Stories, One Thread",
                    d: "The raksha sutra",
                    s: "Wife, friend, devotee — three relationships, one act of protection. Not one of them is a sister and a brother.",
                    pills: [
                      ["d", "DHARMA · 4/5"],
                      ["n", "PURANIC"],
                    ],
                    read: "7 min",
                    myth: '"All three stories are about siblings."',
                  })}
                  {renderCard({
                    h: "h-earth",
                    rt: "SOON",
                    t: "Sankalp — saying it out loud",
                    d: "Meanings & Practices",
                    s: "The resolve stated at the start of a vrat. Why it is said, what it must contain, and what it does not need.",
                    pills: [["n", "COMING SOON"]],
                    read: "—",
                  })}
                  {renderCard({
                    h: "h-shiva",
                    rt: "SOON",
                    t: "Yajna, Havan or Homa?",
                    d: "Meanings & Practices",
                    s: "Three words used interchangeably, for three different things. The distinction is older than the confusion.",
                    pills: [["n", "COMING SOON"]],
                    read: "—",
                  })}
                </div>
              </div>

              {/* Every Morning */}
              <div className="sec">
                {renderSectionHeader(
                  "EVERY MORNING",
                  "Daily Puja",
                  "The practice that is not attached to a festival. Room setup, the diya, the aarti, and what a daily puja actually asks of you.",
                  "7 planned",
                  "View all"
                )}
                <div className="rows">
                  {renderRow(
                    "Puja room setup — where and how",
                    "Direction, height, what belongs on the shelf and what does not"
                  )}
                  {renderRow(
                    "Morning sandhya and panch-upachara",
                    "The five-offering form, in about ten minutes"
                  )}
                  {renderRow(
                    "Tulsi Puja — the daily practice",
                    "Watering, the evening diya, and the days it is not plucked"
                  )}
                  {renderRow(
                    "Deepa Daan — when, why and how",
                    "The lamp as offering rather than decoration"
                  )}
                </div>
              </div>

              {/* The Signature Series */}
              <div className="sec">
                {renderSectionHeader(
                  "THE SIGNATURE SERIES",
                  "Dharma vs Pratha",
                  "Twenty articles by December. Each one takes a practice everyone assumes is mandatory and shows exactly where it comes from.",
                  "20 planned",
                  "View all"
                )}
                <div className="grid">
                  {renderCard({
                    h: "h-gold",
                    rt: "SOON",
                    t: "10 things you think are mandatory",
                    d: "Dharma vs Pratha",
                    s: "And are not. Each one traced to where it actually came from — usually a region, sometimes a shop.",
                    pills: [["n", "COMING SOON"]],
                    read: "—",
                  })}
                  {renderCard({
                    h: "h-gold",
                    rt: "SOON",
                    t: "Can women do puja during menstruation?",
                    d: "Dharma vs Pratha",
                    s: "Genuinely contested. We present the range of positions with sources, and say plainly where no scriptural restriction exists.",
                    pills: [["n", "COMING SOON"]],
                    read: "—",
                  })}
                  {renderCard({
                    h: "h-gold",
                    rt: "SOON",
                    t: "Regional practice myths",
                    d: "Dharma vs Pratha",
                    s: "Your way is not wrong because it differs from theirs. An ongoing series on what varies and why.",
                    pills: [["n", "COMING SOON"]],
                    read: "—",
                  })}
                </div>
              </div>

              {/* Said Aloud */}
              <div className="sec">
                {renderSectionHeader(
                  "SAID ALOUD",
                  "Mantras",
                  "Meaning, pronunciation and use. Every one with audio, in both English transliteration and Devanagari.",
                  "4 planned",
                  "View all"
                )}
                <div className="rows">
                  {renderRow(
                    "Panchakshara — Om Namah Shivaya",
                    "The five syllables, and why the count matters"
                  )}
                  {renderRow(
                    "Mahamrityunjaya — meaning and use",
                    "What it asks for, and what it does not promise"
                  )}
                  {renderRow(
                    "Gayatri Mantra — the full guide",
                    "Who may recite it, when, and the answer to the question everyone asks"
                  )}
                  {renderRow(
                    "Mantras for daily puja",
                    "A short set, with audio, for the ten-minute morning"
                  )}
                </div>
              </div>
            </>
          )}

          {view === "rk" && (
            <>
              {/* Dated */}
              <div className="sec">
                {renderSectionHeader(
                  "DATED · CUT-OFF APPLIES",
                  "By festival",
                  "Prepaid, no COD. The cut-off is real — perishable samagri is packed to order and cannot be resold.",
                  "9 kits",
                  "View all"
                )}
                <div className="grid">
                  {renderCard({
                    h: "h-ganesh",
                    when: "ORDER BY 10 SEP",
                    now: true,
                    t: "Ganesh Sthapana Kit",
                    d: "₹1,650 · incl. delivery",
                    s: "Shadu mati idol, chowki cloth, kalash set, durva, modak mould, akshata, dhoop. 21-item samagri box with Gyan Patrika.",
                    pills: [["pr", "PRE-BOOK"]],
                  })}
                  {renderCard({
                    h: "h-devi",
                    when: "ORDER BY 8 OCT",
                    t: "Shakti Kit",
                    d: "₹1,751 · Navratri",
                    s: "Kalash set, barley and pot, chunri, akhand jyoti vessel, Saptashati, puja powders and the Kanya Pujan items.",
                    pills: [["pr", "PRE-BOOK"]],
                  })}
                  {renderCard({
                    h: "h-gold",
                    when: "ORDER BY 1 NOV",
                    t: "Shubh Akshaya",
                    d: "₹1,251 · Diwali",
                    s: "The beginner’s kit. Lakshmi and Ganesha idols, diyas and wicks, kalash, puja powders and a booklet explaining each item.",
                    pills: [["pr", "PRE-BOOK"]],
                  })}
                </div>
              </div>

              {/* All Year */}
              <div className="sec">
                {renderSectionHeader(
                  "ALL YEAR · COD AVAILABLE",
                  "By ritual",
                  "Not tied to a date. Order when the household needs it.",
                  "7 kits",
                  "View all"
                )}
                <div className="grid">
                  {renderCard({
                    h: "h-shiva",
                    t: "Rudrabhishek Kit",
                    d: "₹1,451",
                    s: "Gangajal, panchamrit items, dried bilva patra, white chandan and the vidhi card.",
                    pills: [["n", "IN STOCK"]],
                  })}
                  {renderCard({
                    h: "h-vishnu",
                    t: "Satyanarayan Kit",
                    d: "₹1,951",
                    s: "Panchamrit, panchmeva, supari, banana leaves and the five-chapter katha booklet.",
                    pills: [["n", "IN STOCK"]],
                  })}
                  {renderCard({
                    h: "h-earth",
                    t: "Sundarkand Kit",
                    d: "₹2,151",
                    s: "Gita Press edition, asan, deepak and wicks, chandan, akshat and the recitation card.",
                    pills: [["n", "IN STOCK"]],
                  })}
                </div>
              </div>

              {/* Once in a Life */}
              <div className="sec">
                {renderSectionHeader(
                  "ONCE IN A LIFE",
                  "Griha & Life Events",
                  "Higher-value kits for a house, a vehicle, a shop or a sanskar. Purohit booking available alongside from November.",
                  "10 kits",
                  "View all"
                )}
                <div className="grid">
                  {renderCard({
                    h: "h-sanskar",
                    t: "Griha Pravesh Kit",
                    d: "₹3,451",
                    s: "Kalash, navgrah samagri, havan samagri, mauli and the full vidhi booklet.",
                    pills: [["n", "IN STOCK"]],
                  })}
                  {renderCard({
                    h: "h-sanskar",
                    t: "Vahan Pujan Kit",
                    d: "₹651",
                    s: "Lemon, chilli, mauli, kumkum, diya and the vidhi card. The smallest kit we make.",
                    pills: [["n", "IN STOCK"]],
                  })}
                  {renderCard({
                    h: "h-sanskar",
                    t: "Shraddha Samagri Kit",
                    d: "₹1,851",
                    s: "Til, jau, ghee, kush and pind ingredients, with the tarpan vidhi card.",
                    pills: [["n", "IN STOCK"]],
                  })}
                </div>
              </div>

              {/* Daily Puja Essentials */}
              <div className="sec">
                {renderSectionHeader(
                  "THE THINGS THAT RUN OUT",
                  "Daily Puja Essentials",
                  "Consumables and temple essentials. Buy once, reorder when you need to — or set a monthly box from next year.",
                  "2 groups",
                  "View all"
                )}
                <div className="rows">
                  {renderRow(
                    "Consumables",
                    "Dhoop · agarbatti · camphor · kumkum · akshat · chandan · pure ghee · cotton wicks"
                  )}
                  {renderRow(
                    "Temple essentials",
                    "Diyas in brass and clay · bell · copper kalash · panchpatra · asana · rudraksha, tulsi and sphatik mala"
                  )}
                  {renderRow(
                    "Monthly Essentials Box — from 2027",
                    "Curated replenishment, delivered monthly. Not open yet."
                  )}
                </div>
              </div>
            </>
          )}

          {view === "purohit" && (
            <>
              {/* Pujan with Purohit Section */}
              <div className="sec">
                {renderSectionHeader(
                  "LAUNCHING IN NOVEMBER",
                  "Pujan with Purohit",
                  "Qualified Purohits, verified scriptural vidhi, and devotion-focused guidance.",
                  "6 pujas",
                  "View all"
                )}
                <div className="fcard">
                  <div className="fc-l beg">
                    <span className="fc-tag">COMING SOON</span>
                    <div className="fc-t">Connect with verified Purohits</div>
                    <p className="fc-d">
                      Book qualified, verified Purohits for your home or office pujas
                      directly from our platform starting this November.
                    </p>
                    <button
                      className="fc-c"
                      onClick={() =>
                        triggerToast("Purohit booking opens in November!")
                      }
                    >
                      Get Notified ›
                    </button>
                  </div>
                  <div className="fc-r">
                    <div className="fc-live">
                      <span className="fcl-d"></span>
                      <span>
                        <span className="fcl-t">RECRUITMENT · LIVE</span>
                        <span className="fcl-v">Over 50 Purohits registered</span>
                      </span>
                    </div>
                    <a
                      className="fc-i"
                      onClick={() => triggerToast("Opening: Rudrabhishek Puja details")}
                    >
                      <span>
                        <span className="fc-in">Rudrabhishek Puja</span>
                        <span className="fc-is">Available in November</span>
                      </span>
                      <span className="fc-ia">›</span>
                    </a>
                    <a
                      className="fc-i"
                      onClick={() => triggerToast("Opening: Satyanarayan Puja details")}
                    >
                      <span>
                        <span className="fc-in">Satyanarayan Puja</span>
                        <span className="fc-is">Available in November</span>
                      </span>
                      <span className="fc-ia">›</span>
                    </a>
                    <a
                      className="fc-i"
                      onClick={() => triggerToast("Opening: Navratri Ghatsthapna details")}
                    >
                      <span>
                        <span className="fc-in">Navratri Ghatsthapna</span>
                        <span className="fc-is">Available in November</span>
                      </span>
                      <span className="fc-ia">›</span>
                    </a>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* METHOD BAND ("How we decide what is true") */}
          <div className="methodband">
            <div>
              <div className="mb-ey">HOW WE DECIDE WHAT IS TRUE</div>
              <div className="mb-t">
                Every badge on this page means something specific
              </div>
              <p className="mb-p">
                Dharma, Pratha or Bhranti — with a confidence score you can check.
                If we cannot name the text a reader could open, we do not make
                the claim.
              </p>
              <button
                className="mb-c"
                onClick={() => triggerToast("Opening editorial method...")}
              >
                Read our editorial method ›
              </button>
            </div>
            <div className="mb-r">
              <div className="mbr d">
                <div className="mbr-k">DHARMA</div>
                <div className="mbr-v">
                  Named in a text you could open yourself.
                </div>
              </div>
              <div className="mbr p">
                <div className="mbr-k">PRATHA</div>
                <div className="mbr-v">
                  Regional or family custom. Real — not scripture.
                </div>
              </div>
              <div className="mbr b">
                <div className="mbr-k">BHRANTI</div>
                <div className="mbr-v">
                  A misconception. Corrected in every guide it appears in.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Existing Project Footer */}
      <Footer onTriggerToast={triggerToast} />

      {/* Premium Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[100] bg-[#1C1712] text-white border border-white/10 px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-bounce text-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FD066D] animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

export default function RitualGuidesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F2EDE4] p-8">Loading...</div>}>
      <RitualGuidesContent />
    </Suspense>
  );
}
