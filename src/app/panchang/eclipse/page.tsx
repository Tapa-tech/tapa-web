"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";
import { Loader2 } from "lucide-react";

interface DPBEntry {
  tag: "DHARMA" | "PRATHA" | "BHRANTI";
  elementName: string;
  claim: string;
  correction: string;
  sourceOfTruth?: string | null;
}

interface DharmicConcept {
  id: string;
  title: string;
  body: string;
  thumbnailUrl?: string | null;
  dpbEntries?: DPBEntry[];
}

export default function EclipsePage() {
  const router = useRouter();
  const [concept, setConcept] = useState<DharmicConcept | null>(null);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  useEffect(() => {
    async function loadEclipseData() {
      try {
        const res = await fetch("/api/public/dharmic-concepts/eclipse-explainer");
        if (res.ok) {
          const data = await res.json();
          setConcept(data);
        }
      } catch (err) {
        console.error("Failed to load eclipse concept:", err);
      } finally {
        setLoading(false);
      }
    }
    loadEclipseData();
  }, []);

  // Parse paragraphs from Tiptap JSON or text body
  const getParsedParagraphs = () => {
    if (!concept || !concept.body) return [];
    if (concept.body.startsWith("{")) {
      try {
        const doc = JSON.parse(concept.body);
        const paragraphs: string[] = [];
        doc.content?.forEach((node: { type: string; content?: Array<{ text: string }> }) => {
          if (node.type === "paragraph" || node.type === "heading") {
            const text = node.content?.map((c) => c.text).join("") || "";
            if (text.trim() && !text.includes("What the designer builds") && !text.includes("PANCHANG FORMAT RULE")) {
              paragraphs.push(text);
            }
          }
        });
        return paragraphs;
      } catch {
        return concept.body.split("\n\n").filter((p: string) => p.trim().length > 0);
      }
    }
    return concept.body.split("\n\n").filter((p: string) => p.trim().length > 0);
  };

  const paragraphs = getParsedParagraphs();

  if (loading) {
    return (
      <div className="ritual-guide-page min-h-screen bg-[#F2EDE4] text-[#2C2010] font-sans antialiased flex flex-col justify-between">
        <div>
          <TopNav onTriggerToast={triggerToast} />
          <div className="flex items-center justify-center py-40">
            <Loader2 className="w-8 h-8 animate-spin text-[#2C2010]" />
          </div>
        </div>
        <Footer onTriggerToast={triggerToast} />
      </div>
    );
  }

  return (
    <div className="ritual-guide-page min-h-screen bg-[#F2EDE4] text-[#2C2010] font-sans antialiased">
      <TopNav activeTab="Panchang" onTriggerToast={triggerToast} />

      {/* Breadcrumbs */}
      <div className="bcrumb">
        <div className="bc-in">
          Home › <span className="cursor-pointer hover:underline" onClick={() => router.push("/panchang")}>Panchang</span> › <b>Eclipse &amp; Grahan</b>
        </div>
      </div>

      {/* Hero Header */}
      <section className="chero pa" style={{ paddingBottom: "40px" }}>
        <div className="wrap">
          <div className="chero-in">
            <div>
              <p className="ch-ey">ASTRONOMICAL EVENTS</p>
              <h1 className="ch-h1">{concept ? concept.title : "Eclipse & Grahan 2026"}</h1>
              <p className="ch-p">
                {paragraphs[0] || "Two eclipses fall in August 2026 — a solar eclipse on the 12th and a lunar eclipse on the 28th. Here is what each one actually is, and what it means for your rituals."}
              </p>
            </div>
            {concept?.thumbnailUrl && (
              <div 
                className="today select-none rounded-2xl" 
                style={{ 
                  backgroundImage: `url(${concept.thumbnailUrl})`, 
                  backgroundSize: "cover", 
                  backgroundPosition: "center",
                  minHeight: "220px"
                }}
              />
            )}
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <div className="wrap" style={{ paddingBottom: "80px" }}>
        <div className="layout" style={{ marginTop: "30px" }}>
          
          {/* Left Column: Eclipses and Flowcharts */}
          <div className="main">
            <div className="sh">
              <span className="sh-p">🌑</span>
              <span className="sh-t">Upcoming August 2026 Eclipses</span>
            </div>

            {/* Eclipses Structured List */}
            <div className="flex flex-col gap-4 mt-4 select-none">
              <div className="bg-white border border-[#EADFC9]/60 rounded-2xl p-6 font-sans">
                <div className="flex justify-between items-center border-b border-[#F2EDE4] pb-3 mb-3">
                  <span className="text-[#B5651D] text-xs font-bold uppercase tracking-wider">Surya Grahan (Solar Eclipse)</span>
                  <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-bold">NOT VISIBLE IN INDIA</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[#8A7A6E] block mb-0.5">DATE</span>
                    <b className="text-[#2C2010]">August 12, 2026</b>
                  </div>
                  <div>
                    <span className="text-[#8A7A6E] block mb-0.5">TYPE</span>
                    <b className="text-[#2C2010]">Partial Solar Eclipse</b>
                  </div>
                  <div>
                    <span className="text-[#8A7A6E] block mb-0.5">VISIBILITY</span>
                    <b className="text-[#2C2010]">Polar Regions Only (Greenland, Iceland)</b>
                  </div>
                  <div>
                    <span className="text-[#8A7A6E] block mb-0.5">SUTAK KAAL</span>
                    <b className="text-emerald-700">Not Applicable (Proceed normally)</b>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-[#EADFC9]/60 rounded-2xl p-6 font-sans">
                <div className="flex justify-between items-center border-b border-[#F2EDE4] pb-3 mb-3">
                  <span className="text-[#B5651D] text-xs font-bold uppercase tracking-wider">Chandra Grahan (Lunar Eclipse)</span>
                  <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold">PARTIALLY VISIBLE</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[#8A7A6E] block mb-0.5">DATE</span>
                    <b className="text-[#2C2010]">August 28, 2026</b>
                  </div>
                  <div>
                    <span className="text-[#8A7A6E] block mb-0.5">TYPE</span>
                    <b className="text-[#2C2010]">Partial Lunar Eclipse</b>
                  </div>
                  <div>
                    <span className="text-[#8A7A6E] block mb-0.5">TIMING (INDIA)</span>
                    <b className="text-[#2C2010]">3:42 AM - 5:12 AM</b>
                  </div>
                  <div>
                    <span className="text-[#8A7A6E] block mb-0.5">SUTAK KAAL</span>
                    <b className="text-amber-700">Applicable where visible (Check local lists)</b>
                  </div>
                </div>
              </div>
            </div>

            {/* Flowchart Rule Box */}
            <div className="sh mt-8">
              <span className="sh-p">❓</span>
              <span className="sh-t">Visibility Flowchart: Does Sutak Apply to You?</span>
            </div>
            
            <div className="bg-[#1A1208] text-white border border-[#EADFC9]/30 rounded-2xl p-6 mt-4 font-sans text-center">
              <div className="bg-white/10 rounded-xl p-4 inline-block mb-3 border border-white/15">
                <span className="text-[10px] text-[#C3C8A8] block uppercase tracking-widest font-bold">Question</span>
                <span className="text-sm font-semibold">Is the eclipse visible from your city?</span>
              </div>
              
              <div className="flex justify-center gap-6 items-stretch mt-2">
                <div className="flex-1 bg-emerald-950/60 border border-emerald-800/80 rounded-xl p-4 text-left">
                  <span className="text-emerald-400 text-xs font-bold block mb-1">↓ YES (Visible)</span>
                  <p className="text-[11px] text-emerald-200/90 leading-relaxed">
                    Sutak Kaal applies. Follow timing restrictions. Check Drik Panchang closer to the date for your city offsets.
                  </p>
                </div>
                <div className="flex-1 bg-amber-950/60 border border-amber-800/80 rounded-xl p-4 text-left">
                  <span className="text-amber-400 text-xs font-bold block mb-1">↓ NO (Not Visible)</span>
                  <p className="text-[11px] text-amber-200/90 leading-relaxed">
                    No Sutak. Proceed with all rituals and Vrats normally. Eclipses have no religious effect where they cannot be seen.
                  </p>
                </div>
              </div>
            </div>

            {/* Explanatory Content */}
            <div className="sh mt-8">
              <span className="sh-p">✍</span>
              <span className="sh-t">The Meaning &amp; Rules Explained</span>
            </div>
            <div className="mt-4 font-serif text-sm text-[#2C2010]/95 leading-relaxed space-y-4">
              {paragraphs.slice(1).map((para: string, idx: number) => (
                <p key={idx}>{para}</p>
              ))}
            </div>

            {/* DPB Protocol Cards */}
            {concept?.dpbEntries && concept.dpbEntries.length > 0 && (
              <>
                <div className="sh mt-8">
                  <span className="sh-p">⚖</span>
                  <span className="sh-t">Dharma vs Pratha vs Bhranti</span>
                </div>
                <div className="flex flex-col gap-3 mt-4">
                  {concept.dpbEntries.map((entry: DPBEntry, idx: number) => (
                    <div key={idx} className="protocol-card border-gold p-4 font-sans text-xs bg-white rounded-xl border border-[#EADFC9]/60">
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-gold font-bold tracking-wider">{entry.tag}</span>
                        <span className="text-[#8A7A6E]">{entry.elementName}</span>
                      </div>
                      <b className="text-sm block mb-1 text-[#2C2010]">{entry.claim}</b>
                      <span className="text-[#8A7A6E] leading-relaxed block">
                        {entry.correction} {entry.sourceOfTruth && `(Source: ${entry.sourceOfTruth})`}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Right Column: Sidebar links to related guides */}
          <div className="side">
            <div className="cred-card font-sans">
              <span className="cred-label">RELATED GUIDES</span>
              <p className="text-[11px] text-[#8A7A6E] mt-1 mb-4">
                Observances in the same Shravana month window that might align with these eclipse timings.
              </p>
              <div className="flex flex-col gap-2">
                <a 
                  onClick={() => router.push("/ritual-guides/rakshabandhan")} 
                  className="bg-white border border-[#EADFC9]/50 hover:bg-[#FDFBF7] p-3 rounded-xl cursor-pointer text-xs font-bold flex justify-between items-center"
                >
                  <span>Raksha Bandhan Guide</span>
                  <span className="text-pink">&rsaquo;</span>
                </a>
                <a 
                  onClick={() => router.push("/ritual-guides/sawan-somwar")} 
                  className="bg-white border border-[#EADFC9]/50 hover:bg-[#FDFBF7] p-3 rounded-xl cursor-pointer text-xs font-bold flex justify-between items-center"
                >
                  <span>Sawan Somwar Vrat</span>
                  <span className="text-pink">&rsaquo;</span>
                </a>
                <a 
                  onClick={() => router.push("/ritual-guides/hariyali-teej")} 
                  className="bg-white border border-[#EADFC9]/50 hover:bg-[#FDFBF7] p-3 rounded-xl cursor-pointer text-xs font-bold flex justify-between items-center"
                >
                  <span>Hariyali Teej Vidhi</span>
                  <span className="text-pink">&rsaquo;</span>
                </a>
              </div>
            </div>
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
