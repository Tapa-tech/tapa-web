/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import AnnouncementBar from "@/components/AnnouncementBar";
import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";

export default function PanchangPage() {
  const router = useRouter();
  const [panchangTab, setPanchangTab] = useState<"pl" | "vc" | "fc">("pl");
  const [calendarSystem, setCalendarSystem] = useState<"Purnimanta" | "Amanta">("Purnimanta");
  const [vratFilter, setVratFilter] = useState("All");
  const [festFilter, setFestFilter] = useState("All festivals");
  const [selectedMonth, setSelectedMonth] = useState("Sep");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const city = "New Delhi";

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
          triggerToast(`Opening guide for "${o.n}"...`);
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
                  cd: "IN 12 DAYS"
                })}
                {renderVratRow({
                  d: "23 Sep",
                  dw: "Wednesday",
                  n: "Anant Chaturdashi",
                  x: "Ganesh Visarjan",
                  t: "Bhadrapada Shukla Chaturdashi",
                  cd: "IN 16 DAYS"
                })}
                {renderVratRow({
                  d: "26 Sep",
                  dw: "Saturday",
                  n: "Pitru Paksha begins",
                  x: "Shraddha period · 16 days",
                  t: "Bhadrapada Purnima",
                  cd: "IN 19 DAYS"
                })}
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
                <button className="dl-c hover:brightness-110" onClick={() => triggerToast("Downloading 2026 calendar PDF...")}>Download calendar ›</button>
              </div>
            </>
          )}

          {panchangTab === "vc" && (
            <>
              <div className="mtabs select-none">
                {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"].map((m) => (
                  <button key={m} className="mt" onClick={() => setSelectedMonth(m)}>
                    {m}
                    <span>—</span>
                  </button>
                ))}
                <button className={`mt ${selectedMonth === "Sep" ? "on" : ""}`} onClick={() => setSelectedMonth("Sep")}>
                  Sep
                  <span>12 dates</span>
                </button>
                {["Oct", "Nov", "Dec"].map((m) => (
                  <button key={m} className="mt" onClick={() => setSelectedMonth(m)}>
                    {m}
                    <span>—</span>
                  </button>
                ))}
              </div>

              {selectedMonth === "Sep" ? (
                <>
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
                    {renderVratRow({ d: "2 Sep", dw: "Wednesday", n: "Sankashti Chaturthi", x: "Moonrise required to break the fast", t: "Bhadrapada Krishna Chaturthi", cd: "PASSED", cd_c: " past" })}
                    {renderVratRow({ d: "4 Sep", dw: "Friday", n: "Krishna Janmashtami", x: "Smarta observance · Nishita Kaal", t: "Bhadrapada Krishna Ashtami", cd: "PASSED", cd_c: " past", slug: "krishna-janmashtami" })}
                    {renderVratRow({ d: "8 Sep", dw: "Tuesday", n: "Aja Ekadashi", x: "Grain avoidance · parana next morning", t: "Bhadrapada Krishna Ekadashi", cd: "TOMORROW", cd_c: " soon", next: true, slug: "aja-ekadashi" })}
                    {renderVratRow({ d: "9 Sep", dw: "Wednesday", n: "Pradosh Vrat", x: "Bhauma-adjacent · evening Shiva puja", t: "Bhadrapada Krishna Trayodashi", cd: "IN 2 DAYS", cd_c: " soon" })}
                    {renderVratRow({ d: "11 Sep", dw: "Friday", n: "Amavasya", x: "Pithori Amavasya · Shraddha observed", t: "Bhadrapada Amavasya", cd: "IN 4 DAYS", cd_c: " soon" })}
                    {renderVratRow({ d: "13 Sep", dw: "Sunday", n: "Hartalika Teej", x: "Sand Shivalinga · night vigil", t: "Bhadrapada Shukla Tritiya", cd: "IN 6 DAYS", cd_c: " soon", slug: "hartalika-teej" })}
                    {renderVratRow({ d: "14 Sep", dw: "Monday", n: "Ganesh Chaturthi", x: "Prana pratishtha · Madhyahna muhurat", t: "Bhadrapada Shukla Chaturthi", cd: "IN 7 DAYS", cd_c: " soon", slug: "ganesh-chaturthi" })}
                    {renderVratRow({ d: "19 Sep", dw: "Saturday", n: "Radha Ashtami", t: "Bhadrapada Shukla Ashtami", cd: "IN 12 DAYS", slug: "radha-ashtami" })}
                    {renderVratRow({ d: "22 Sep", dw: "Tuesday", n: "Parsva Ekadashi", x: "Chaturmas midpoint", t: "Bhadrapada Shukla Ekadashi", cd: "IN 15 DAYS", slug: "parsva-ekadashi" })}
                    {renderVratRow({ d: "23 Sep", dw: "Wednesday", n: "Anant Chaturdashi", x: "Ganesh Visarjan", t: "Bhadrapada Shukla Chaturdashi", cd: "IN 16 DAYS", slug: "anant-chaturdashi" })}
                    {renderVratRow({ d: "24 Sep", dw: "Thursday", n: "Pradosh Vrat", t: "Bhadrapada Shukla Trayodashi", cd: "IN 17 DAYS" })}
                    {renderVratRow({ d: "26 Sep", dw: "Saturday", n: "Bhadrapada Purnima", x: "Pitru Paksha begins", t: "Bhadrapada Purnima", cd: "IN 19 DAYS", slug: "pitru-paksha" })}
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
                    <button className="dl-c hover:brightness-110" onClick={() => triggerToast("Downloading Vrat Calendar...")}>Download PDF ›</button>
                  </div>
                </>
              ) : (
                <div className="bg-white border border-border rounded-2xl p-12 text-center text-sub-text mb-6">
                  Vrat calendar for {selectedMonth} 2026 is loading...
                </div>
              )}
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
