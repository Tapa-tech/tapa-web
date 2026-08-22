"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";
import "../concepts.css";

interface DpbEntry {
  id?: string;
  tag: string;
  confidenceScore: number;
  regionalVariance?: string;
  elementName: string;
  claim?: string;
  correction?: string;
  sourceOfTruth?: string;
}

interface Concept {
  id?: string;
  title: string;
  slug: string;
  status: string;
  body: string;
  thumbnailUrl?: string;
  dpbEntries?: DpbEntry[];
}

interface PageProps {
  params: {
    slug: string;
  };
}

export default function DharmicConceptDetailPage({ params }: PageProps) {
  const router = useRouter();
  const slug = params.slug;

  const [concept, setConcept] = useState<Concept | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeLang, setActiveLang] = useState<"EN" | "HI">("EN");

  const triggerToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    // Only fetch from API if not one of the pre-built fallback routes, or fallback as background
    const fetchConcept = async () => {
      try {
        const res = await fetch(`/api/public/dharmic-concepts/${slug}`);
        if (!res.ok) {
          throw new Error("Failed to load concept from database");
        }
        const data = await res.json();
        setConcept(data);
      } catch {
        console.warn("Using fallback/mock data representation for slug:", slug);
      } finally {
        setLoading(false);
      }
    };
    fetchConcept();
  }, [slug]);

  // RENDER FALLBACK 1: Why Is Bilva Dear to Mahadev?
  const renderBilvaFallback = () => {
    return (
      <div className="concepts-detail-page bilva-theme">
        {/* Breadcrumb */}
        <div className="bcrumb">
          <div className="bc-in">
            <div className="bc-l">
              Home › Dharmic Concepts › <b>Why Is Bilva Dear to Mahadev?</b>
            </div>
            <div className="bc-r">
              <button className="bcb" onClick={() => triggerToast("Saved to your favorites!")}>🔖 Save</button>
              <button className="bcb" onClick={() => triggerToast("Link copied to clipboard!")}>↗ Share</button>
            </div>
          </div>
        </div>

        {/* Hero */}
        <section className="hero">
          <div className="hero-bg bilva-bg"></div>
          <div className="hero-ov"></div>
          <button className="hero-share" onClick={() => triggerToast("Link copied to clipboard!")}>↗ Share</button>
          <div className="hero-c">
            <div className="hero-in">
              <p className="hero-ey">DHARMIC CONCEPTS · MATERIALS</p>
              <div className="hero-tag">◆ DHARMA · 4/5 · SHIVA PURANA · BILVASHTAKAM</div>
              <h1 className="hero-h1">Why Is Bilva Dear to Mahadev?</h1>
              <p className="hero-sub" style={{ color: "#C3C8A8" }}>
                The leaf, the story, and what the tradition actually says.
              </p>
              <div className="hero-btns">
                <button className="hb-p" onClick={() => {
                  const el = document.getElementById("story");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}>📖 Read the story</button>
                <button className="hb-g" onClick={() => triggerToast("Audio narration is launching soon!")}>🎧 Listen instead</button>
              </div>
            </div>
          </div>
        </section>

        {/* Chip band */}
        <div className="chips">
          <div className="chips-in">
            <span className="chip-l">JUMP TO</span>
            <a className="chip" href="#story">📖 The story</a>
            <a className="chip" href="#leaf">🌿 The leaf</a>
            <a className="chip" href="#offer">🙏 How to offer</a>
            <a className="chip" href="#connected">🔗 Connected</a>
          </div>
        </div>

        {/* Page body wrap */}
        <div className="wrap">
          <div className="layout">
            {/* Main Column */}
            <div className="main">
              {/* The Story Section */}
              <div id="story">
                <p className="story-open">There was a hunter who got lost in a forest one night.</p>
                <p className="p">
                  The Shiva Purana tells his story simply. He was out hunting and darkness fell before he could find his way back. The forest was full of wild animals. Frightened, he climbed the nearest tree — a tall one with dense leaves — and decided to wait until morning.
                </p>
                <p className="p">
                  But he couldn&apos;t sleep. The cold, the fear, the sounds of the forest kept him awake. To keep himself alert through the long night, he began doing the only thing his hands could do from that branch: he plucked leaves and dropped them, one by one, into the darkness below.
                </p>
                <p className="p">
                  He did this all night. Leaf after leaf, through four watches of the night. He didn&apos;t chant a mantra — he didn&apos;t know any. He didn&apos;t perform a puja — he didn&apos;t know how. He didn&apos;t even eat, not out of vrat, but because he had no food.
                </p>
                <p className="story-turn">
                  What he did not know — what no one could have known from that branch in the dark — was that directly below the tree, at its roots, sat a Shivalinga. And the tree he was sitting in was a Bilva tree.
                </p>
                <p className="p">
                  By dawn, without intending to, without knowing, without a single prayer, the hunter had performed a complete night-long Bilva archana. The leaves had fallen on the Shivalinga. His hunger had become an involuntary fast. His wakefulness had become a jagaran. His fear had kept him present through all four prahars of the night.
                </p>
                <p className="p">
                  <b>Shiva accepted it.</b> Not because the ritual was correct. But because the offering was real — even if the one making it didn&apos;t know he was making it.
                </p>
                <div className="story-close">
                  This is the story told on every Mahashivratri. And it tells you something about the Bilva leaf before any verse or hymn does: <b>this leaf has a relationship with Shiva that does not depend on the devotee&apos;s knowledge, intention, or skill.</b> The leaf itself carries the connection.
                </div>
                <div className="tagline-row" style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
                  <span className="pill d">DHARMA · 4/5</span>
                  <span className="pill src" style={{ background: "var(--p-bg)", color: "var(--p-tx)" }}>Shiva Purana · Kotirudra Samhita, Ch. 40</span>
                </div>
              </div>

              <div className="hr"></div>

              {/* The Leaf Section */}
              <div id="leaf">
                <div className="sh">
                  <span className="sh-p">+</span>
                  <span className="sh-t">The Leaf &amp; Its Symbolism</span>
                </div>
                <p className="p">
                  Beyond the stories, the leaf itself has a physical design that the scriptures recognize as sacred.
                </p>
                <div className="quote-box">
                  <div className="quote-in">
                    त्रिदलं त्रिगुणाकारं त्रिनेत्रं च त्रियायुधम्।<br />
                    त्रिजन्मपापसंहारं एकबिल्वं शिवार्पणम्॥
                  </div>
                  <div className="quote-a">
                    &quot;Three leaves, representing the three gunas (Sattva, Rajas, Tamas), representing the three eyes of Shiva, representing his three weapons (the Trishula). This leaf, which destroys the sins of three lifetimes, I offer to Shiva.&quot; — Bilvashtakam, Verse 1.
                  </div>
                </div>
                <p className="p">
                  The leaf is always trifoliate — three leaflets attached to a single petiole. In the dharmic way of looking at nature, this is not an accident of botany. It is a visual representation of the triad: the three eyes of Shiva, the three gunas, and the three paths of yoga (Jnana, Bhakti, Karma).
                </p>
              </div>

              <div className="hr"></div>

              {/* How to Offer Section */}
              <div id="offer">
                <div className="sh">
                  <span className="sh-p">+</span>
                  <span className="sh-t">How to Offer: Dharma vs Pratha</span>
                </div>
                <p className="p">
                  Devotees follow many rules when offering Bilva leaves. Here is the distinction between what the scriptures specify (Dharma) and what has developed as family or regional practice (Pratha).
                </p>
                
                {/* Protocol Card 1 */}
                <div className="protocol-card border-gold">
                  <div className="pro-head">
                    <span className="pro-label text-gold">DHARMA · SCRIPTURAL STANDARD</span>
                  </div>
                  <div className="pro-body">
                    <b style={{ fontSize: "14.5px", color: "var(--dark)" }}>Whole and undamaged leaves</b>
                    <p className="p" style={{ fontSize: "12.5px", color: "var(--sub-text)", marginTop: "4px" }}>
                      The Shiva Purana notes that leaves offered to Shiva should not be torn, broken, or eaten by insects. The offering of a complete leaf represents the offering of one&apos;s complete devotion.
                    </p>
                  </div>
                </div>

                {/* Protocol Card 2 */}
                <div className="protocol-card border-pink">
                  <div className="pro-head">
                    <span className="pro-label text-pink">PRATHA · CUSTOMARY PROTOCOL</span>
                  </div>
                  <div className="pro-body">
                    <b style={{ fontSize: "14.5px", color: "var(--dark)" }}>Smooth side down</b>
                    <p className="p" style={{ fontSize: "12.5px", color: "var(--sub-text)", marginTop: "4px" }}>
                      Customary practice dictates placing the smooth, shiny side of the leaf facing down against the Shivalinga, often with a drop of sandalwood paste (Chandan) on the center leaf.
                    </p>
                  </div>
                </div>

                <div className="hr"></div>

                {/* Myths and Misconceptions */}
                <div className="sh">
                  <span className="sh-p">+</span>
                  <span className="sh-t">Myths &amp; Reframes</span>
                </div>
                <div className="myth-card">
                  <div className="myth-q">
                    <span className="myth-icon">✕</span>
                    <span className="myth-text">&quot;Only Brahmins can offer Bilva to Shiva.&quot;</span>
                  </div>
                  <div className="myth-a">
                    <span className="myth-icon">✓</span>
                    <span className="myth-text">
                      No Puranic text restricts Bilva offering by varna. The founding narrative itself involves a hunter — not a Brahmin, not a priest, not someone who knew any ritual at all. Shiva accepts any sincere devotee.
                    </span>
                  </div>
                </div>

                <div className="myth-card">
                  <div className="myth-q">
                    <span className="myth-icon">✕</span>
                    <span className="myth-text">&quot;Artificial or plastic bel patra works the same as a real leaf.&quot;</span>
                  </div>
                  <div className="myth-a">
                    <span className="myth-icon">✓</span>
                    <span className="myth-text">
                      The tradition&apos;s emphasis is on the living leaf — fresh, trifoliate, whole. A plastic replica does not carry that form authentically. If fresh Bilva is unavailable, a dried natural leaf is accepted.
                    </span>
                  </div>
                </div>

                {/* Reframe Box */}
                <div className="reframe">
                  <div className="reframe-ey">THE REFRAME</div>
                  <p style={{ fontSize: "13px", lineHeight: "1.6", color: "var(--dark)" }}>
                    The next time you hold a bel patra, look at it before you place it. Three leaves, one stem. The tree did not study scripture to grow this way. It simply grew — and the tradition recognized something it already knew. <em>Dharmic knowledge does not invent sacredness. It notices it</em> in the shape of a leaf, the form of a river, the pattern of the sky.
                  </p>
                </div>
              </div>

              <div className="hr"></div>

              {/* Where This Appears */}
              <div id="connected">
                <div className="sh">
                  <span className="sh-p">+</span>
                  <span className="sh-t">Where This Appears</span>
                </div>
                <p className="p" style={{ fontSize: "13px", color: "var(--sub-text)" }}>
                  This concept sits behind every Shiva ritual that lists Bilva in its samagri.
                </p>
                <div className="rel-list" style={{ marginTop: "15px", display: "flex", flexDirection: "column", gap: "10px" }}>
                  {[
                    ["Sawan Somwar Vrat", "Bilva is central to the Jalabhishek", "LIVE"],
                    ["Hartalika Teej", "Belpatra offered to the sand Shivalinga", "LIVE"],
                    ["Rudrabhishek", "The 11-dravya sequence includes Bilva", "LIVE"],
                    ["Pradosh Vrat", "Shiva worship at twilight — Bilva offering", "LIVE"],
                    ["Mahashivratri", "The hunter's story is retold every year", "SOON"]
                  ].map(([name, desc, badge]) => (
                    <div key={name} className="rel-item" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px", border: "1.5px solid var(--border-light)", borderRadius: "8px" }}>
                      <div>
                        <b style={{ fontSize: "14px", color: "var(--dark)" }}>{name}</b>
                        <span style={{ display: "block", fontSize: "12px", color: "var(--sub-text)", marginTop: "2px" }}>{desc}</span>
                      </div>
                      <span className={`pill ${badge === "LIVE" ? "d" : "p"}`} style={{ fontSize: "9.5px", fontWeight: 700, padding: "4px 8px", borderRadius: "5px", background: badge === "LIVE" ? "var(--d-bg)" : "var(--p-bg)", color: badge === "LIVE" ? "var(--d-tx)" : "var(--p-tx)" }}>
                        {badge}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar Column */}
            <div className="side">
              <div className="cred-card">
                <div className="cred-head" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1.5px solid var(--border-light)", paddingBottom: "10px", marginBottom: "15px" }}>
                  <span className="cred-label">SOURCE OF TRUTH</span>
                  <span className="cred-read" style={{ cursor: "pointer" }} onClick={() => triggerToast("Opening primary scripture citation...")}>Read source ›</span>
                </div>
                <div className="cred-cell" style={{ marginBottom: "15px" }}>
                  <div className="cred-key">PRIMARY SOURCE</div>
                  <div className="cred-val">Shiva Purana · Bilvashtakam</div>
                  <div className="cred-sub">Kotirudra Samhita Ch. 40 for the hunter narrative. Corroborated in Skanda Purana, Atharvaveda and Shatapatha Brahmana.</div>
                </div>
                <div className="cred-cell" style={{ marginBottom: "15px" }}>
                  <div className="cred-key">CONFIDENCE</div>
                  <div className="cred-val">4 / 5 <span className="cred-stars">★★★★☆</span></div>
                  <div className="cred-sub">Named across multiple Puranic and Vedic sources. The Bilvashtakam&apos;s first verse is the strongest single anchor.</div>
                </div>
                <div className="cred-cell" style={{ marginBottom: "15px" }}>
                  <div className="cred-key">SCOPE</div>
                  <div className="cred-val">Pan-Shaiva</div>
                  <div className="cred-sub">Observed wherever Shiva is worshipped. Offering protocol varies slightly by region and family.</div>
                </div>
                <div className="cred-dharma" style={{ borderTop: "1.5px solid var(--border-light)", paddingTop: "12px", marginTop: "12px" }}>
                  <div className="cred-key" style={{ marginBottom: "9px" }}>DHARMA NOTE</div>
                  <div className="dhot-row" style={{ display: "flex", gap: "8px", alignItems: "center", fontSize: "11px", marginBottom: "6px" }}>
                    <span className="dhot" style={{ display: "inline-block", width: "10px", height: "10px", borderRadius: "50%", background: "#1A5C28" }}></span>
                    <span>Bilva is Shiva&apos;s leaf · trifoliate symbolism = <b>Dharma</b></span>
                  </div>
                  <div className="dhot-row" style={{ display: "flex", gap: "8px", alignItems: "center", fontSize: "11px", marginBottom: "6px" }}>
                    <span className="dhot" style={{ display: "inline-block", width: "10px", height: "10px", borderRadius: "50%", background: "#E8A020" }}></span>
                    <span>Smooth side down · odd numbers = <b>Pratha</b></span>
                  </div>
                  <div className="dhot-row" style={{ display: "flex", gap: "8px", alignItems: "center", fontSize: "11px" }}>
                    <span className="dhot" style={{ display: "inline-block", width: "10px", height: "10px", borderRadius: "50%", background: "#D4175A" }}></span>
                    <span>&quot;Only Brahmins may offer Bilva&quot; = <b>Bhranti</b></span>
                  </div>
                </div>
              </div>

              <div className="sb-quote" style={{ background: "var(--card)", border: "1.5px solid var(--border)", borderRadius: "12px", padding: "16px", marginTop: "20px" }}>
                <div className="sb-quote-dev" style={{ fontFamily: "Georgia, serif", fontSize: "16px", fontWeight: "bold", color: "var(--gold)", marginBottom: "8px", textAlign: "center" }}>एकबिल्वं शिवार्पणम्</div>
                <div className="sb-quote-t" style={{ fontSize: "12px", color: "var(--dark)", fontStyle: "italic", lineHeight: "1.5" }}>&quot;This one Bilva leaf I offer to Shiva.&quot; — the line that ends every verse of the Bilvashtakam, eight times over.</div>
                <div className="sb-quote-a" style={{ fontSize: "10.5px", color: "var(--sub-text)", marginTop: "8px", textAlign: "right" }}>Bilvashtakam</div>
              </div>

              <div className="sb-note" style={{ fontSize: "11.5px", color: "var(--sub-text)", lineHeight: "1.5", marginTop: "20px" }}>
                <b>Why there is no vidhi here.</b> This is a Dharmic Concept, not a Ritual Guide. It explains an object and its meaning. For the step-by-step of a specific puja, follow one of the ritual guides listed under &apos;Where This Appears&apos;.
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // RENDER FALLBACK 2: Three Stories, One Thread (Raksha Sutra)
  const renderRakshaSutraFallback = () => {
    return (
      <div className="concepts-detail-page sutra-theme">
        {/* Breadcrumb */}
        <div className="bcrumb">
          <div className="bc-in">
            <div className="bc-l">
              Home › Dharmic Concepts › Meanings &amp; Practices › <b>Three Stories, One Thread</b>
            </div>
            <div className="bc-r">
              <button className="bcb" onClick={() => triggerToast("Saved to your favorites!")}>🔖 Save</button>
              <button className="bcb" onClick={() => triggerToast("Link copied to clipboard!")}>↗ Share</button>
            </div>
          </div>
        </div>

        {/* Hero */}
        <section className="hero">
          <div className="hero-bg sutra-bg"></div>
          <div className="hero-ov"></div>
          <button className="hero-share" onClick={() => triggerToast("Link copied to clipboard!")}>↗ Share</button>
          <div className="hero-c">
            <div className="hero-in">
              <p className="hero-ey">DHARMIC CONCEPTS · MEANINGS &amp; PRACTICES</p>
              <div className="hero-tag">◆ DHARMA · 4/5 · PURANIC</div>
              <h1 className="hero-h1">Three Stories, One Thread</h1>
              <p className="hero-sub" style={{ color: "#C3C8A8" }}>
                Wife, friend, devotee — three relationships, one act of protection. Not one of them is a sister and a brother.
              </p>
              <div className="hero-btns">
                <button className="hb-p" onClick={() => {
                  const el = document.getElementById("three");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}>Read the three stories</button>
                <button className="hb-g" onClick={() => triggerToast("Audio narration is launching soon!")}>🎧 Listen instead</button>
              </div>
            </div>
          </div>
        </section>

        {/* Chip band */}
        <div className="chips">
          <div className="chips-in">
            <span className="chip-l">JUMP TO</span>
            <a className="chip" href="#three">📖 Three stories</a>
            <a className="chip" href="#sachi">Sachi &amp; Indra</a>
            <a className="chip" href="#draupadi">Draupadi &amp; Krishna</a>
            <a className="chip" href="#lakshmi">Lakshmi &amp; Bali</a>
            <a className="chip" href="#share">What they share</a>
          </div>
        </div>

        {/* Page body wrap */}
        <div className="wrap">
          <div className="layout">
            {/* Main Column */}
            <div className="main">
              {/* Sourced Statement */}
              <div className="cc" style={{ border: "1.5px solid var(--border)", borderRadius: "12px", padding: "16px", background: "var(--card)", marginBottom: "25px" }}>
                <div className="cc-h" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                  <span className="cc-hl" style={{ fontSize: "10.5px", fontWeight: "bold", color: "var(--gold)" }}>SOURCE OF TRUTH</span>
                  <span className="cc-hr" style={{ fontSize: "11px", color: "var(--sub-text)", cursor: "pointer" }} onClick={() => triggerToast("Opening primary scripture citation...")}>Read source ›</span>
                </div>
                <div className="cc-b">
                  <div className="cc-core" style={{ fontSize: "10.5px", color: "var(--sub-text)", fontWeight: "bold" }}>CORE CLAIM</div>
                  <div className="cc-claim" style={{ fontSize: "14.5px", fontWeight: "bold", color: "var(--dark)", margin: "8px 0" }}>
                    The three founding narratives of the raksha sutra involve three different relationships, none of them siblings.
                  </div>
                  <div className="cc-row" style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <span className="pill d">DHARMA · 4/5</span>
                    <span className="badge" style={{ fontSize: "9px", fontWeight: "bold", background: "var(--p-bg)", color: "var(--p-tx)", padding: "3px 6px", borderRadius: "4px" }}>PURANIC</span>
                    <span className="pill src" style={{ background: "var(--p-bg)", color: "var(--p-tx)" }}>Bhavishya Purana · Mahabharata · Bhagavata Purana</span>
                  </div>
                </div>
              </div>

              {/* Three Stories Intro */}
              <div id="three">
                <div className="sh">
                  <span className="sh-p">+</span>
                  <span className="sh-t">Three Stories</span>
                </div>
                <p className="p">
                  The tradition&apos;s founding stories tell a different tale from the one most people know — three of them, from three texts, involving three completely different relationships.
                </p>
                <p className="p">
                  <b>Not one is about a sister and a brother.</b> What they share is a thread, a mantra, and someone who needed protecting.
                </p>

                {/* Story 1: Sachi and Indra */}
                <div id="sachi" style={{ marginTop: "25px" }}>
                  <h3 style={{ fontSize: "16px", fontWeight: "bold", color: "var(--dark)", marginBottom: "8px" }}>1. Wife to Husband: Sachi &amp; Indra (Bhavishya Purana)</h3>
                  <p className="p">
                    The war between the gods and the demons had dragged on for years. Indra, the king of the gods, was losing. The demon king Vritra was pushing the gods out of their kingdom. Frightened and desperate, Indra prepared to leave for the battlefield for a final attempt.
                  </p>
                  <p className="p">
                    Sachi, could not bear the thought of his defeat. She did not study weapon craft, but she knew the power of a resolve. She took a cotton thread, purified it with mantras of protection, and tied it around Indra&apos;s right wrist before he stepped onto his chariot.
                  </p>
                  <p className="p">
                    <b>Indra won.</b> Sachi&apos;s thread, representing her devotion and her prayer for his safety, is recognized as the first Raksha Sutra.
                  </p>
                </div>

                {/* Story 2: Draupadi and Krishna */}
                <div id="draupadi" style={{ marginTop: "25px" }}>
                  <h3 style={{ fontSize: "16px", fontWeight: "bold", color: "var(--dark)", marginBottom: "8px" }}>2. Friend to Friend: Draupadi &amp; Krishna (Mahabharata)</h3>
                  <p className="p">
                    During the Rajasuya Yajna, Krishna threw his Sudarshana Chakra to punish Shishupala. As the chakra returned to his hand, it cut Krishna&apos;s finger, and blood began to flow.
                  </p>
                  <p className="p">
                    While others ran to find medicines, Draupadi, the queen of the Pandavas, acted instantly. Without hesitation, she tore a strip of silk from her costly sari and wrapped it around Krishna&apos;s bleeding finger.
                  </p>
                  <p className="p">
                    Krishna was moved by her action. He declared that she had bound him with a thread of protection, and he promised to repay it whenever she was in distress. He fulfilled this promise during the cheer-haran in the assembly hall of Hastinapur.
                  </p>
                </div>

                {/* Story 3: Lakshmi and Bali */}
                <div id="lakshmi" style={{ marginTop: "25px" }}>
                  <h3 style={{ fontSize: "16px", fontWeight: "bold", color: "var(--dark)", marginBottom: "8px" }}>3. Devotee to King: Lakshmi &amp; Bali (Bhagavata Purana)</h3>
                  <p className="p">
                    King Bali, a devotee of Vishnu, had offered everything he had to Vishnu&apos;s Vamana avatar. Vishnu, pleased by his devotion, promised to stay in Bali&apos;s kingdom as his gatekeeper. This left Vaikuntha empty, and Goddess Lakshmi was grieved by Vishnu&apos;s absence.
                  </p>
                  <p className="p">
                    She went to Bali&apos;s palace disguised as a poor woman seeking shelter. During the Shravana Purnima festival, she tied a cotton thread on Bali&apos;s wrist, declaring him as her protector and king. When Bali asked what she wanted in return, she asked him to release Vishnu from his promise.
                  </p>
                  <p className="p">
                    <b>Bali agreed.</b> He honored the thread tied on his wrist, choosing his duty to protect his guest over his own desire to have Vishnu stay in his palace.
                  </p>
                </div>
              </div>

              <div className="hr"></div>

              {/* What They Share */}
              <div id="share">
                <div className="sh">
                  <span className="sh-p">+</span>
                  <span className="sh-t">What They Share: The Core Meaning</span>
                </div>
                <p className="p">
                  While these stories represent different relationships, they share a singular, core meaning: <b>the Raksha Sutra is a thread of protection.</b> It is a physical symbol of a prayer, a promise, and a shield.
                </p>
                <p className="p">
                  When you tie a Raksha Sutra, you are invoking the same protective resolve Sachi had for Indra, the same instant friendship Draupadi had for Krishna, and the same absolute devotion Lakshmi had for Bali.
                </p>
                <div className="quote-box" style={{ background: "var(--card)", border: "1.5px solid var(--border)", borderRadius: "12px", padding: "16px", marginTop: "15px" }}>
                  <div className="quote-in" style={{ fontStyle: "italic", fontSize: "13px" }}>
                    &quot;येन बद्धो बली राजा दानवेन्द्रो महाबलः।<br />
                    तेन त्वामभिबध्नामि रक्षे मा चल मा चल॥&quot;
                  </div>
                  <div className="quote-a" style={{ fontSize: "11px", color: "var(--sub-text)", marginTop: "8px" }}>
                    &quot;I bind you with the same thread that bound the mighty King Bali. O protective thread, stay firm, do not slip.&quot; — the mantra chanted when tying the Raksha Sutra.
                  </div>
                </div>
              </div>

              <div className="hr"></div>

              {/* Myths and Misconceptions */}
              <div className="sh">
                <span className="sh-p">+</span>
                <span className="sh-t">Myths &amp; Reframes</span>
              </div>
              <div className="myth-card">
                <div className="myth-q">
                  <span className="myth-icon">✕</span>
                  <span className="myth-text">&quot;Raksha Bandhan has always been exclusively for brothers and sisters.&quot;</span>
                </div>
                <div className="myth-a">
                  <span className="myth-icon">✓</span>
                  <span className="myth-text">
                    The sibling focus is a modern cultural shift (Pratha). Historically and scripturally (Dharma), the Raksha Sutra is an act of protection tied between any two people — priests to patrons, wives to husbands, or friends.
                  </span>
                </div>
              </div>

              <div className="myth-card">
                <div className="myth-q">
                  <span className="myth-icon">✕</span>
                  <span className="myth-text">&quot;The thread must be cut off after exactly 9 days or it brings bad luck.&quot;</span>
                </div>
                <div className="myth-a">
                  <span className="myth-icon">✓</span>
                  <span className="myth-text">
                    There is no scriptural backing for any specific timeline or associated bad luck. Devotees often wear the thread until it wears off naturally or unties itself. You may remove it respectfully when needed.
                  </span>
                </div>
              </div>
            </div>

            {/* Sidebar Column */}
            <div className="side">
              <div className="cred-card">
                <div className="cred-head" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1.5px solid var(--border-light)", paddingBottom: "10px", marginBottom: "15px" }}>
                  <span className="cred-label">SOURCE OF TRUTH</span>
                  <span className="cred-read" style={{ cursor: "pointer" }} onClick={() => triggerToast("Opening primary scripture citation...")}>Read source ›</span>
                </div>
                <div className="cred-cell" style={{ marginBottom: "15px" }}>
                  <div className="cred-key">PRIMARY SCRIPTURES</div>
                  <div className="cred-val">Bhavishya Purana · Bhagavata Purana</div>
                  <div className="cred-sub">The texts containing the narratives of Sachi-Indra and Bali-Vamana respectively.</div>
                </div>
                <div className="cred-cell" style={{ marginBottom: "15px" }}>
                  <div className="cred-key">CONFIDENCE</div>
                  <div className="cred-val">5 / 5 <span className="cred-stars">★★★★★</span></div>
                  <div className="cred-sub">Fully supported by standard Puranic collections. The tying mantra itself directly references King Bali.</div>
                </div>
                <div className="cred-cell" style={{ marginBottom: "15px" }}>
                  <div className="cred-key">SCOPE</div>
                  <div className="cred-val">Universal Hindu</div>
                  <div className="cred-sub">Observed globally across all traditional branches. The ritual context and name (Mauli, Kalava, Rakhi) vary by region.</div>
                </div>
              </div>

              <div className="intel-sb" style={{ background: "var(--d-bg)", color: "var(--d-tx)", borderRadius: "12px", padding: "16px", marginTop: "20px" }}>
                <div className="intel-ey" style={{ fontSize: "9px", fontWeight: "bold", color: "var(--gold)" }}>◗ METHODOLOGY</div>
                <div className="intel-t" style={{ fontSize: "14px", fontWeight: "bold", margin: "6px 0" }}>Dharma vs Pratha Reframing</div>
                <div className="intel-s" style={{ fontSize: "12px", lineHeight: "1.5", color: "var(--sub-text)" }}>
                  By tracing back to Sachi, Draupadi, and Lakshmi, we show that the Raksha Sutra is a universal shield of protection, giving you the freedom to celebrate it across all relationships.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // RENDER FALLBACK 3: Ramcharitmanas 7 Kandas
  const renderRamcharitmanasFallback = () => {
    return (
      <div className="concepts-detail-page ramcharitmanas-theme">
        {/* Breadcrumb */}
        <div className="bcrumb">
          <div className="bc-in">
            <div className="bc-l">
              Home › Ritual Guides › Beginner&apos;s Guides › <b>The Seven Kandas</b>
            </div>
            <div className="bc-r">
              <div className="lang">
                <button className={activeLang === "EN" ? "on" : ""} onClick={() => { setActiveLang("EN"); triggerToast("Language set to English"); }}>EN</button>
                <button className={activeLang === "HI" ? "on" : ""} onClick={() => { setActiveLang("HI"); triggerToast("भाषा हिंदी चुनी गई (Hindi set)"); }}>हिं</button>
              </div>
              <button className="bcb" onClick={() => triggerToast("Saved to your favorites!")}>🔖 Save</button>
              <button className="bcb" onClick={() => triggerToast("Link copied to clipboard!")}>↗ Share</button>
            </div>
          </div>
        </div>

        {/* Hero */}
        <section className="hero">
          <div className="hero-bg ramcharitmanas"></div>
          <div className="hero-ov"></div>
          <button className="hero-share" onClick={() => triggerToast("Link copied to clipboard!")}>↗ Share</button>
          <div className="hero-c">
            <div className="hero-in">
              <p className="hero-ey">BEGINNER&apos;S GUIDES · START HERE</p>
              <div className="hero-tag">◔ A MAP BEFORE THE JOURNEY</div>
              <h1 className="hero-h1">Ramcharitmanas: The Seven Kandas Explained</h1>
              <p className="hero-sub" style={{ color: "#D8BFA0" }}>
                What each section contains, why each matters, and where Sundarkand fits.
              </p>
              <div className="hero-btns">
                <button className="hb-p" onClick={() => {
                  const el = document.getElementById("seven");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}>See the seven kandas</button>
                <button className="hb-g" onClick={() => triggerToast("Saved to your profile!")}>Save this</button>
              </div>
            </div>
          </div>
        </section>

        {/* Reassurance Band */}
        <div className="reassure" style={{ background: "var(--card)", borderBottom: "1px solid var(--border)" }}>
          <div className="wrap">
            <div style={{ padding: "13px 0", display: "flex", alignItems: "center", gap: "24px", flexWrap: "wrap", fontSize: "13px", color: "var(--mid-text)", fontWeight: 500 }}>
              <span style={{ display: "flex", alignItems: "center", gap: "8px" }}><span>📖</span>No prior reading needed</span>
              <span style={{ display: "flex", alignItems: "center", gap: "8px" }}><span>🕉</span>No Sanskrit required</span>
              <span style={{ display: "flex", alignItems: "center", gap: "8px" }}><span>⏱</span>6 minutes to read</span>
              <span style={{ display: "flex", alignItems: "center", gap: "8px" }}><span>✓</span>Start anywhere you like</span>
            </div>
          </div>
        </div>

        {/* Chip band */}
        <div className="chips">
          <div className="chips-in">
            <span className="chip-l">JUMP TO</span>
            <a className="chip" href="#seven">📚 The seven kandas</a>
            <a className="chip" href="#why">Why Sundarkand</a>
            <a className="chip" href="#start">Where to start</a>
            <a className="chip" href="#worries">💭 Common worries</a>
          </div>
        </div>

        {/* Page body wrap */}
        <div className="wrap">
          <div className="layout">
            {/* Main Column */}
            <div className="main" style={{ marginTop: "30px" }}>
              <p className="open">The map before the journey.</p>
              <p className="p">
                The Ramcharitmanas is Tulsidas&apos;s retelling of the Ramayana in Awadhi, and it is divided into seven sections called kandas. Each covers a phase of Ram&apos;s story.
              </p>
              <p className="p">
                If you are starting with Sundarkand — as most people do — this shows you where it sits and what surrounds it.
              </p>

              <figure className="art">
                <img src="/uploads/ramcharitmanas-7-kandas-explained.png" alt="Ramcharitmanas Map" />
              </figure>

              {/* The Seven Kandas Section */}
              <div id="seven">
                <div className="sh">
                  <span className="sh-p">+</span>
                  <span className="sh-t">The Seven Kandas</span>
                </div>
                <p className="p" style={{ marginBottom: "25px" }}>
                  Unlike Valmiki&apos;s Ramayana, the Ramcharitmanas is structured to be sung and recited aloud. The seven kandas are sequenced as a ladder:
                </p>

                <div className="kandas">
                  {/* Kanda 1 */}
                  <div className="kd">
                    <div className="kd-c">
                      <span className="kd-n">1</span>
                      <span className="kd-l"></span>
                    </div>
                    <div className="kd-b">
                      <div className="kd-t">
                        Balkand <span className="kd-dev">बालकाण्ड</span>
                        <span className="kd-badge">Childhood &amp; Beginnings</span>
                      </div>
                      <p className="kd-s">
                        The longest section. It covers Ram&apos;s birth in Ayodhya, his childhood, his protection of the sages&apos; yajnas, breaking Shiva&apos;s bow, and marrying Sita.
                      </p>
                    </div>
                  </div>

                  {/* Kanda 2 */}
                  <div className="kd">
                    <div className="kd-c">
                      <span className="kd-n">2</span>
                      <span className="kd-l"></span>
                    </div>
                    <div className="kd-b">
                      <div className="kd-t">
                        Ayodhyakand <span className="kd-dev">अयोध्याकाण्ड</span>
                        <span className="kd-badge">The Exile &amp; Duty</span>
                      </div>
                      <p className="kd-s">
                        The emotional core. Dasharatha&apos;s grief, Kaikeyi&apos;s demands, Ram&apos;s exile to the forest with Sita and Lakshman, Bharat&apos;s refusal of the crown, and his visit to Chitrakoot.
                      </p>
                    </div>
                  </div>

                  {/* Kanda 3 */}
                  <div className="kd">
                    <div className="kd-c">
                      <span className="kd-n">3</span>
                      <span className="kd-l"></span>
                    </div>
                    <div className="kd-b">
                      <div className="kd-t">
                        Aranyakand <span className="kd-dev">अरण्यकाण्ड</span>
                        <span className="kd-badge">Forest Years</span>
                      </div>
                      <p className="kd-s">
                        The forest years. Sages&apos; visits, the golden deer trick, Ravana abducting Sita, Ram&apos;s desolation, and his meeting with Jatayu and Shabari.
                      </p>
                    </div>
                  </div>

                  {/* Kanda 4 */}
                  <div className="kd">
                    <div className="kd-c">
                      <span className="kd-n">4</span>
                      <span className="kd-l"></span>
                    </div>
                    <div className="kd-b">
                      <div className="kd-t">
                        Kishkindhakand <span className="kd-dev">किष्किन्धाकाण्ड</span>
                        <span className="kd-badge">The Monkey Alliance</span>
                      </div>
                      <p className="kd-s">
                        Meeting Hanuman, the pact with Sugriva, slaying Bali, and sending the search parties to find Sita. Jambavan wakes Hanuman&apos;s sleeping powers at the shore.
                      </p>
                    </div>
                  </div>

                  {/* Kanda 5 */}
                  <div className="kd now">
                    <div className="kd-c">
                      <span className="kd-n">5</span>
                      <span className="kd-l"></span>
                    </div>
                    <div className="kd-b">
                      <div className="kd-t">
                        Sundarkand <span className="kd-dev">सुन्दरकाण्ड</span>
                        <span className="kd-badge" style={{ borderColor: "var(--pink)", color: "var(--pink)", background: "var(--card)" }}>Hanuman&apos;s Heroic Mission</span>
                      </div>
                      <p className="kd-s">
                        <b>The only kanda named after a person&apos;s beauty rather than a place or event.</b> Hanuman leaps the ocean, finds Sita in Lanka&apos;s Ashok Vatika, burns Ravana&apos;s capital, and brings back the news of hope.
                      </p>
                    </div>
                  </div>

                  {/* Kanda 6 */}
                  <div className="kd">
                    <div className="kd-c">
                      <span className="kd-n">6</span>
                      <span className="kd-l"></span>
                    </div>
                    <div className="kd-b">
                      <div className="kd-t">
                        Lankakand <span className="kd-dev">लंकाकाण्ड</span>
                        <span className="kd-badge">The Great War</span>
                      </div>
                      <p className="kd-s">
                        The building of the Ram Setu bridge, the battle of Lanka, Lakshman recovering with Sanjeevani, the fall of Ravana, and Sita&apos;s rescue.
                      </p>
                    </div>
                  </div>

                  {/* Kanda 7 */}
                  <div className="kd">
                    <div className="kd-c">
                      <span className="kd-n">7</span>
                      <span className="kd-l"></span>
                    </div>
                    <div className="kd-b">
                      <div className="kd-t">
                        Uttarkand <span className="kd-dev">उत्तरकाण्ड</span>
                        <span className="kd-badge">Return &amp; Reign</span>
                      </div>
                      <p className="kd-s">
                        The return to Ayodhya, Ram&apos;s coronation, the peace of Ram Rajya, Kak Bhushundi&apos;s philosophical dialogues, and the spiritual summaries of the epic.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="hr"></div>

              {/* Why Sundarkand Section */}
              <div id="why">
                <div className="sh">
                  <span className="sh-p">+</span>
                  <span className="sh-t">Why Sundarkand is Recited Separately</span>
                </div>
                <p className="p">
                  Sundarkand is the only kanda that focuses entirely on a devotee&apos;s strength and victory, rather than the lord&apos;s direct action. Tulsidas names Hanuman &apos;Sunder&apos; (beautiful), and the section shows that devotion can cross oceans and burn down kingdoms.
                </p>
                <p className="p">
                  Because it is filled with hope, progress, and victory over obstacles, it is traditionally recited on Tuesdays and Saturdays for peace, strength, and overcoming adversity.
                </p>
              </div>

              <div className="hr"></div>

              {/* Where to Start Section */}
              <div id="start">
                <div className="sh">
                  <span className="sh-p">+</span>
                  <span className="sh-t">Where to Start Reading</span>
                </div>
                <p className="p">
                  If you are new to the Ramcharitmanas, start with <b>Sundarkand</b>. It is self-contained, high-action, and emotionally complete. From there, go back to <b>Balkand</b> to read the story from the beginning.
                </p>
              </div>

              <div className="hr"></div>

              {/* Common Worries & Myths Section */}
              <div id="worries">
                <div className="sh">
                  <span className="sh-p">✕</span>
                  <span className="sh-t">Common Worries &amp; Bhranti Corrections</span>
                </div>
                <p className="p" style={{ marginBottom: "20px" }}>
                  Devotees often carry fears about reading the Ramcharitmanas. Sincere devotion requires no fear.
                </p>

                <div className="worry">
                  <div className="w-q"><span>Q.</span>Is it true that I must complete the reading in one sitting?</div>
                  <div className="w-a">
                    <span>A.</span>No. While an Akhand Path (unbroken reading) is a popular custom (Pratha), reading daily in chapters according to your own routine is fully scripturally valid (Dharma). Sincerity matters more than duration.
                  </div>
                </div>

                <div className="worry">
                  <div className="w-q"><span>Q.</span>What if I pronounce the Sanskrit/Awadhi words incorrectly?</div>
                  <div className="w-a">
                    <span>A.</span>Tulsidas wrote the Ramcharitmanas in Awadhi (the local spoken dialect) specifically so that common folks could read and understand it without needing specialized Sanskrit training. The text is an act of love; slight errors in pronunciation do not reduce its benefits.
                  </div>
                </div>

                <div className="worry">
                  <div className="w-q"><span>Q.</span>Can women read Sundarkand?</div>
                  <div className="w-a">
                    <span>A.</span>Yes, absolutely. There is no scriptural ban whatsoever. Sincere devotion is open to all, regardless of gender.
                  </div>
                </div>
              </div>

              {/* Closing advice block */}
              <div className="closing">
                <p>
                  <b>The Tapa Co. Closing Advice:</b> The Ramcharitmanas is a companion, not a test. Read it at your own pace, with quiet concentration, and keep the focus on understanding the character of Hanuman.
                </p>
                <p>
                  If you are preparing for a home recitation, check our detailed Path guide for step-by-step guidance on setting up the space.
                </p>
              </div>

              {/* Related articles grid */}
              <div className="hr"></div>
              <div className="sh">
                <span className="sh-p">🔗</span>
                <span className="sh-t">Related Guides &amp; Concepts</span>
              </div>
              <div className="ladder" style={{ marginTop: "20px" }}>
                <div className="lad" onClick={() => router.push("/ritual-guides/sundarkand-path")}>
                  <span className="lad-k rg">RITUAL GUIDE</span>
                  <span>
                    <strong className="lad-t">Sundarkand Path Vidhi</strong>
                    <span className="lad-s">Complete home recitation guide and step-by-step puja vidhi.</span>
                  </span>
                  <span className="lad-a">›</span>
                </div>
                <div className="lad" onClick={() => router.push("/dharmic-concepts/why-is-sundarkand-recited-separately")}>
                  <span className="lad-k dc">CONCEPT</span>
                  <span>
                    <strong className="lad-t">Why is Sundarkand Recited Separately?</strong>
                    <span className="lad-s">The history and context behind reciting the fifth kanda on its own.</span>
                  </span>
                  <span className="lad-a">›</span>
                </div>
              </div>

              {/* Revenue Row */}
              <div className="rev" style={{ marginTop: "30px" }}>
                <div className="rev-c live">
                  <div className="rev-i" style={{ backgroundColor: "var(--p-bg)", border: "1px solid var(--p-bd)", color: "var(--p-tx)" }}>💬</div>
                  <div className="rev-l">TAPA CIRCLE</div>
                  <div className="rev-t">Get Daily Reminders</div>
                  <p className="rev-s">Get tithi offsets and daily panchang alerts sent directly to your WhatsApp.</p>
                  <button className="rev-b wa" onClick={() => router.push("/tapa-circle")}>Subscribe — ₹499/yr</button>
                </div>
                <div className="rev-c feat">
                  <div className="rev-i" style={{ backgroundColor: "rgba(255,255,255,.14)", border: "1px solid rgba(255,255,255,.22)", color: "#fff" }}>📦</div>
                  <div className="rev-l" style={{ color: "#E3B567" }}>COMPANION KITS</div>
                  <div className="rev-t" style={{ color: "#fff" }}>Sundarkand Puja Kit</div>
                  <p className="rev-s" style={{ color: "#E0B8A4" }}>Sourced correctly, packed in eco-friendly brass boxes, and delivered to your doorstep.</p>
                  <button className="rev-b" onClick={() => router.push("/ritual-kits")}>Pre-book — ₹2,151</button>
                </div>
                <div className="rev-c soon">
                  <div className="rev-i" style={{ backgroundColor: "#E4DCCC", border: "1px solid #D4C9B4", opacity: 0.6 }}>🪔</div>
                  <div className="rev-l" style={{ color: "#9A8E7A" }}>SERVICES</div>
                  <div className="rev-t" style={{ color: "#7A705F" }}>Book a Purohit</div>
                  <p className="rev-s" style={{ color: "#948872" }}>Connect with a trained, verified purohit to conduct the path at your home.</p>
                  <button className="rev-b" style={{ backgroundColor: "transparent", border: "1.5px solid #C9BFAC", color: "#7A705F" }} disabled>Launching Soon</button>
                </div>
              </div>
              <p className="rev-note">Revenue goes directly toward verifying text citations and supporting traditional scholars.</p>
            </div>

            {/* Sidebar Column */}
            <div className="side" style={{ marginTop: "30px" }}>
              <div className="ladder-sb">
                <div className="lsb-h">THE SEVEN KANDAS CHECKLIST</div>
                <div className="lsb-r">
                  <span className="lsb-n">1</span>
                  <span>Balkand</span>
                </div>
                <div className="lsb-r">
                  <span className="lsb-n">2</span>
                  <span>Ayodhyakand</span>
                </div>
                <div className="lsb-r">
                  <span className="lsb-n">3</span>
                  <span>Aranyakand</span>
                </div>
                <div className="lsb-r">
                  <span className="lsb-n">4</span>
                  <span>Kishkindhakand</span>
                </div>
                <div className="lsb-r now">
                  <span className="lsb-n">5</span>
                  <span><b>Sundarkand (Active)</b></span>
                </div>
                <div className="lsb-r">
                  <span className="lsb-n">6</span>
                  <span>Lankakand</span>
                </div>
                <div className="lsb-r">
                  <span className="lsb-n">7</span>
                  <span>Uttarkand</span>
                </div>
              </div>

              <button className="sbcta dk" onClick={() => triggerToast("Saved to profile!")} style={{ border: "none", borderRadius: "12px", padding: "14px", display: "flex", flexDirection: "column", alignItems: "center", gap: "3px", cursor: "pointer" }}>
                <span className="sb-ct" style={{ fontSize: "13px", fontWeight: 700, color: "#fff" }}>Save this guide</span>
                <span className="sb-cs" style={{ fontSize: "10px", color: "rgba(255,255,255,.6)" }}>Come back to it before you read</span>
              </button>

              <div className="whyno" style={{ background: "var(--p-bg)", border: "1px solid var(--p-bd)", borderRadius: "14px", padding: "15px 17px" }}>
                <div className="wn-h" style={{ fontSize: "10px", fontWeight: 700, color: "var(--gold)", letterSpacing: ".6px", marginBottom: "9px" }}>WHY THERE ARE NO CITATIONS ON THIS PAGE</div>
                <p className="wn-t" style={{ fontSize: "13px", lineHeight: "1.75", color: "var(--body-text)" }}>
                  Beginner&apos;s Guides are written in plain language, with <b>no scriptural citations and no classification tags</b>. The first time you approach something, you need to know what it is — not where it is written.
                </p>
                <p className="wn-t" style={{ fontSize: "13px", lineHeight: "1.75", color: "var(--body-text)", marginTop: "9px" }}>
                  The <b>Sundarkand Path</b> ritual guide carries all of the primary citations and editorial scores.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // RENDER DYNAMIC DATABASE CONTENT (General Concept)
  const renderDynamicContent = () => {
    if (!concept) return null;

    const parsedParagraphs = (concept.body || "")
      .replace(/<[^>]*>/g, "") // strip simple html tags if any
      .split("\n\n")
      .filter((p) => p.trim().length > 0);

    return (
      <div className="concepts-detail-page dynamic-theme">
        {/* Breadcrumb */}
        <div className="bcrumb">
          <div className="bc-in">
            <div className="bc-l">
              Home › Dharmic Concepts › <b>{concept.title}</b>
            </div>
            <div className="bc-r">
              <button className="bcb" onClick={() => triggerToast("Saved to favorites!")}>🔖 Save</button>
              <button className="bcb" onClick={() => triggerToast("Link copied!")}>↗ Share</button>
            </div>
          </div>
        </div>

        {/* Hero */}
        <section className="hero">
          <div className="hero-bg general-bg" style={{ backgroundImage: concept.thumbnailUrl ? `url(${concept.thumbnailUrl})` : undefined }}></div>
          <div className="hero-ov"></div>
          <div className="hero-c">
            <div className="hero-in">
              <p className="hero-ey">DHARMIC CONCEPTS</p>
              <h1 className="hero-h1">{concept.title}</h1>
              <p className="hero-sub" style={{ color: "#C3C8A8" }}>
                {parsedParagraphs[0] || "Dharmic materials and meanings, explained from named scriptures."}
              </p>
            </div>
          </div>
        </section>

        {/* Page body wrap */}
        <div className="wrap" style={{ paddingBottom: "60px" }}>
          <div className="layout">
            {/* Main Column */}
            <div className="main" style={{ marginTop: "30px" }}>
              <div className="sh">
                <span className="sh-p">+</span>
                <span className="sh-t">The Meaning</span>
              </div>
              <div style={{ marginTop: "15px" }}>
                {parsedParagraphs.map((para, idx) => (
                  <p key={idx} className="p" style={{ fontSize: "14.5px", lineHeight: "1.7", marginBottom: "15px" }}>
                    {para}
                  </p>
                ))}
              </div>

              {concept.dpbEntries && concept.dpbEntries.length > 0 && (
                <>
                  <div className="hr"></div>
                  <div className="sh">
                    <span className="sh-p">+</span>
                    <span className="sh-t">Dharma, Pratha &amp; Bhranti</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "15px" }}>
                    {concept.dpbEntries.map((entry, idx) => (
                      <div key={idx} className="protocol-card border-gold" style={{ padding: "14px" }}>
                        <div className="pro-head" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                          <span className="pro-label text-gold" style={{ fontSize: "10.5px", fontWeight: "bold" }}>
                            {entry.tag} · CONFIDENCE: {entry.confidenceScore}/5
                          </span>
                          <span style={{ fontSize: "11px", color: "var(--sub-text)" }}>{entry.elementName}</span>
                        </div>
                        <div className="pro-body">
                          <b style={{ fontSize: "13.5px", color: "var(--dark)", display: "block" }}>{entry.claim}</b>
                          <span style={{ display: "block", fontSize: "12.5px", color: "var(--sub-text)", marginTop: "4px" }}>
                            {entry.correction} (Source: {entry.sourceOfTruth || "Tradition"})
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Sidebar Column */}
            <div className="side" style={{ marginTop: "30px" }}>
              <div className="cred-card">
                <div className="cred-head" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1.5px solid var(--border-light)", paddingBottom: "10px", marginBottom: "15px" }}>
                  <span className="cred-label">CREDIBILITY</span>
                </div>
                <div className="cred-cell" style={{ marginBottom: "15px" }}>
                  <div className="cred-key">STATUS</div>
                  <div className="cred-val" style={{ textTransform: "capitalize" }}>{concept.status}</div>
                </div>
                <div className="cred-cell">
                  <div className="cred-key">SLUG</div>
                  <div className="cred-val">{concept.slug}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render Loader
  if (loading && slug !== "why-is-bilva-dear-to-mahadev" && slug !== "three-stories-one-thread" && slug !== "ramcharitmanas-7-kandas-explained") {
    return (
      <div className="concepts-page min-h-screen">
        <TopNav />
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh", fontSize: "16px", color: "var(--sub-text)" }}>
          Loading article...
        </div>
        <Footer onTriggerToast={triggerToast} />
      </div>
    );
  }

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

      {/* Routing renderer */}
      {slug === "why-is-bilva-dear-to-mahadev"
        ? renderBilvaFallback()
        : slug === "three-stories-one-thread"
        ? renderRakshaSutraFallback()
        : slug === "ramcharitmanas-7-kandas-explained"
        ? renderRamcharitmanasFallback()
        : renderDynamicContent()}

      <Footer onTriggerToast={triggerToast} />
    </div>
  );
}
