"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";
import "./concepts.css";

interface CardData {
  h?: string;
  rt?: "LIVE" | "SOON";
  t: string;
  d: string;
  s: string;
  pills?: [string, string][];
  read?: string;
  slug?: string;
}

export default function DharmicConceptsPage() {
  const router = useRouter();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const renderSectionHeader = (
    title: string,
    desc: string
  ) => {
    return (
      <div className="sec-head">
        <span className="sec-plus">+</span>
        <div>
          <span className="sec-title">{title}</span>
          <span className="sec-guide">{desc}</span>
        </div>
      </div>
    );
  };

  const renderCard = (o: CardData) => {
    const slug = o.slug || o.t.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const isLive = o.rt === "LIVE";
    
    return (
      <div
        key={o.t}
        className={`c cursor-pointer ${isLive ? "hover:border-[#FD066D]" : "opacity-75"}`}
        onClick={() => {
          if (isLive) {
            router.push(`/dharmic-concepts/${slug}`);
          } else {
            triggerToast(`"${o.t}" is launching soon!`);
          }
        }}
        style={{
          background: "var(--card)",
          border: "1px solid var(--border)",
          borderRadius: "14px",
          padding: "16px 18px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: "100%",
          textAlign: "left"
        }}
      >
        <div>
          <div className="flex justify-between items-center mb-2" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "9.5px", fontWeight: 700, color: "var(--gold)", letterSpacing: ".6px" }}>
              {o.d.toUpperCase()}
            </span>
            <span 
              className={`pill ${isLive ? "d" : "p"}`} 
              style={{
                fontSize: "9px",
                fontWeight: 700,
                padding: "3px 8px",
                borderRadius: "5px",
                background: isLive ? "var(--d-bg)" : "var(--p-bg)",
                color: isLive ? "var(--d-tx)" : "var(--p-tx)"
              }}
            >
              {o.rt}
            </span>
          </div>
          <h3 style={{ fontSize: "16.5px", fontWeight: 700, color: "var(--dark)", margin: "8px 0 6px" }}>{o.t}</h3>
          <p style={{ fontSize: "12.5px", color: "var(--sub-text)", lineHeight: 1.6, marginBottom: "15px" }}>{o.s}</p>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1.5px solid var(--border-light)", paddingTop: "8px" }}>
          <div style={{ display: "flex", gap: "6px" }}>
            {(o.pills || []).map((p, idx) => (
              <span 
                key={idx} 
                className={`pill ${p[0]}`}
                style={{
                  fontSize: "9px",
                  padding: "3px 8px",
                  borderRadius: "5px",
                  background: p[0] === "d" ? "var(--d-bg)" : "var(--p-bg)",
                  color: p[0] === "d" ? "var(--d-tx)" : "var(--p-tx)"
                }}
              >
                {p[1]}
              </span>
            ))}
          </div>
          {o.read && <span style={{ fontSize: "11px", color: "var(--sub-text)" }}>{o.read}</span>}
        </div>
      </div>
    );
  };

  const renderRow = (title: string, desc: string) => {
    return (
      <div 
        key={title}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "12px 0",
          borderBottom: "1.5px solid var(--border-light)",
          textAlign: "left"
        }}
      >
        <div>
          <b style={{ fontSize: "14.5px", color: "var(--dark)" }}>{title}</b>
          <span style={{ display: "block", fontSize: "12.5px", color: "var(--sub-text)", marginTop: "2px" }}>{desc}</span>
        </div>
        <span style={{ color: "var(--pink)", fontWeight: 700, cursor: "pointer" }} onClick={() => triggerToast("Launching soon!")}>SOON ›</span>
      </div>
    );
  };

  return (
    <div className="concepts-page min-h-screen">
      <TopNav />

      {/* Toast Alert */}
      {toastMessage && (
        <div 
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            backgroundColor: "var(--dark)",
            color: "#fff",
            padding: "12px 24px",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            zIndex: 9999,
            fontSize: "13px"
          }}
        >
          {toastMessage}
        </div>
      )}

      {/* Breadcrumbs */}
      <div className="bcrumb">
        <div className="bc-in">
          <div className="bc-l">
            Home › <b>Dharmic Concepts</b>
          </div>
        </div>
      </div>

      {/* Hero */}
      <section className="hero">
        <div className="hero-bg"></div>
        <div className="hero-ov"></div>
        <div className="hero-c">
          <div className="hero-in">
            <p className="hero-ey">THE TAPA CO. · DIRECTORY</p>
            <div className="hero-tag">◆ DHARMIC CONCEPTS · MEANINGS & MATERIALS</div>
            <h1 className="hero-h1">The object in your hand has a story</h1>
            <p className="hero-sub" style={{ color: "#C3C8A8" }}>
              Why bilva and not tulsi. Why three stories and not one. These sit behind every pujan guide — when a samagri list says &quot;bilva leaves&quot;, this is where the reason lives.
            </p>
            <div className="hero-btns">
              <button className="hb-p" onClick={() => router.push("/dharmic-concepts/why-is-bilva-dear-to-mahadev")}>
                Featured Concept: Bilva leaf ›
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Page Body Wrap */}
      <div className="wrap" style={{ paddingBottom: "60px" }}>
        <div className="layout">
          
          {/* Main Column */}
          <div className="main">
            
            {/* Section 1: Materials */}
            <div style={{ marginTop: "30px" }}>
              {renderSectionHeader(
                "Materials",
                "The things you hold, offer and light. Each one has a story, a source and a set of offering rules."
              )}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px", marginTop: "20px" }}>
                {renderCard({
                  rt: "LIVE",
                  t: "Why is bilva dear to Mahadev?",
                  d: "Materials · Shiva",
                  s: "Three leaves on one stem. The tree did not study scripture to grow that way — the tradition recognised what it saw.",
                  pills: [
                    ["d", "DHARMA · 4/5"],
                    ["n", "PURANIC"]
                  ],
                  read: "12 min",
                  slug: "why-is-bilva-dear-to-mahadev"
                })}
                {renderCard({
                  rt: "SOON",
                  t: "Why is tulsi sacred to Vishnu?",
                  d: "Materials · Vishnu",
                  s: "Lakshmi’s form as a plant, present in every Vishnu and Krishna puja — and never offered to Shiva.",
                  pills: [["n", "COMING SOON"]],
                  read: "—",
                  slug: "why-is-tulsi-sacred-to-vishnu"
                })}
                {renderCard({
                  rt: "SOON",
                  t: "Why is durva offered to Ganesha?",
                  d: "Materials · Ganesha",
                  s: "The grass offered on his head, in bunches of twenty-one. Named in the Ganesha Purana.",
                  pills: [["n", "COMING SOON"]],
                  read: "—",
                  slug: "why-is-durva-offered-to-ganesha"
                })}
              </div>
            </div>

            <div className="hr"></div>

            {/* Section 2: Meanings & Practices */}
            <div>
              {renderSectionHeader(
                "Meanings & Practices",
                "What you do, and what it means. Sankalpa, abhishek, avahana — the acts every pujan assumes you already understand."
              )}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px", marginTop: "20px" }}>
                {renderCard({
                  rt: "LIVE",
                  t: "Three Stories, One Thread",
                  d: "Meanings & Practices",
                  s: "Wife, friend, devotee — three relationships, one act of protection. Not one of them is a sister and a brother.",
                  pills: [
                    ["d", "DHARMA · 4/5"],
                    ["n", "PURANIC"]
                  ],
                  read: "7 min",
                  slug: "three-stories-one-thread"
                })}
                {renderCard({
                  rt: "SOON",
                  t: "Sankalp — saying it out loud",
                  d: "Meanings & Practices",
                  s: "The resolve stated at the start of a pujan. Why it is said, what it must contain, and what it does not need.",
                  pills: [["n", "COMING SOON"]],
                  read: "—",
                  slug: "sankalp-saying-it-out-loud"
                })}
                {renderCard({
                  rt: "SOON",
                  t: "Yajna, Havan or Homa?",
                  d: "Meanings & Practices",
                  s: "Three words used interchangeably, for three different things. The distinction is older than the confusion.",
                  pills: [["n", "COMING SOON"]],
                  read: "—",
                  slug: "yajna-havan-or-homa"
                })}
              </div>
            </div>

            <div className="hr"></div>

            {/* Section 3: Every Morning */}
            <div>
              {renderSectionHeader(
                "Daily Puja",
                "The practice that is not attached to a festival. Room setup, the diya, the aarti, and what a daily puja actually asks of you."
              )}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "20px" }}>
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

          </div>

          {/* Sidebar */}
          <div className="side">
            <div className="sbn">
              <div className="sbn-h">◗ LOOK UP ANY TERM</div>
              <div className="sbn-t" style={{ fontSize: "14.5px", fontWeight: 700, color: "var(--dark)", marginBottom: "8px" }}>The Glossary</div>
              <div className="sbn-t">
                142 words defined once, in plain language, with the Devanagari and how to say it out loud.
              </div>
              <span className="sbn-c" style={{ cursor: "pointer" }} onClick={() => triggerToast("Glossary index loading...")}>Open the glossary ›</span>
            </div>
            
            <div className="sbcomp">
              <div className="sbcomp-h">
                <span className="sbcomp-l">OUR METHOD</span>
              </div>
              <p className="sbcomp-t" style={{ fontSize: "12px" }}>
                We resolve the line between **Dharma** (what the scriptures ask) and **Pratha** (what family custom dictates), giving you the freedom to choose your devotion.
              </p>
            </div>
          </div>

        </div>
      </div>

      <Footer onTriggerToast={triggerToast} />
    </div>
  );
}
