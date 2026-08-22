"use client";

import React, { useState } from "react";
import AnnouncementBar from "@/components/AnnouncementBar";
import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";

export default function FestivePage() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const [activeLang, setActiveLang] = useState<"EN" | "HI">("EN");
  const [isSaved, setIsSaved] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);

  // Steps checklist state
  const [checklist, setChecklist] = useState<boolean[]>([
    false, false, false, false, false, false, false
  ]);

  // Japa counter state
  const [japaCount, setJapaCount] = useState(27);
  const [japaPreset, setJapaPreset] = useState<number>(108);

  const handleIncrement = () => {
    setJapaCount(prev => prev + 1);
  };

  const handleDecrement = () => {
    setJapaCount(prev => (prev > 0 ? prev - 1 : 0));
  };

  const handleCheck = (idx: number) => {
    const nextChecklist = [...checklist];
    nextChecklist[idx] = !nextChecklist[idx];
    setChecklist(nextChecklist);
  };

  const checkedCount = checklist.filter(Boolean).length;

  return (
    <div className="min-h-screen bg-[#F2EDE4] text-[#2C2010] font-sans antialiased ritual-guide-detail-page">
      <AnnouncementBar />
      <TopNav activeTab="Ritual Guides" onTriggerToast={triggerToast} />

      {/* Breadcrumb section */}
      <div className="bcrumb select-none">
        <div className="bc-in">
          <div className="bc-l font-sans">
            Home › Ritual Guides › Festive Pujans › <b>Sharad Navratri</b>
          </div>
          <div className="bc-r">
            <div className="lang">
              <button 
                onClick={() => { setActiveLang("EN"); triggerToast("Language set to English"); }} 
                className={activeLang === "EN" ? "on" : ""}
              >
                EN
              </button>
              <button 
                onClick={() => { setActiveLang("HI"); triggerToast("भाषा हिंदी चुनी गई (Hindi set)"); }} 
                className={activeLang === "HI" ? "on" : ""}
              >
                हिं
              </button>
            </div>
            <button onClick={() => { setIsSaved(!isSaved); triggerToast(isSaved ? "Guide unsaved" : "Guide saved to profile"); }} className="bcb">
              {isSaved ? "❤️ Saved" : "🔖 Save"}
            </button>
            <button onClick={() => triggerToast("Link copied to clipboard")} className="bcb">↗ Share</button>
          </div>
        </div>
      </div>

      {/* Hero section */}
      <section className="hero relative">
        <div className="hero-bg"></div>
        <div className="hero-ov"></div>
        <button onClick={() => triggerToast("Link copied to clipboard")} className="hero-share cursor-pointer">↗ Share</button>
        <div className="hero-c">
          <div className="hero-in font-sans">
            <p className="hero-ey">RITUAL GUIDES · FESTIVE PUJANS</p>
            <div className="hero-tag">◆ DHARMA · 4/5 · PURANIC</div>
            <h1 className="hero-h1 font-serif text-3xl sm:text-5xl font-bold mt-2 leading-tight">
              Sharad Navratri: The Complete 9-Day Guide
            </h1>
            <p className="hero-sub text-base opacity-90 mt-2">
              Ghatasthapana to Maha Navami — nine forms, nine nights, one Mother.
            </p>
            <p className="hero-date opacity-75 mt-1 text-xs">
              11–19 October 2026 · Ashwin Shukla Paksha · Delhi-NCR
            </p>
            <div className="hero-btns mt-6 flex flex-wrap gap-3">
              <button 
                onClick={() => {
                  const el = document.getElementById("vidhi");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }} 
                className="hb-p font-bold hover:scale-[1.02] transition-transform cursor-pointer"
              >
                Start with Ghatasthapana
              </button>
              <button onClick={() => triggerToast("Generating PDF download...")} className="hb-g font-bold hover:bg-white/20 transition-colors cursor-pointer">
                Download Card
              </button>
              <button onClick={() => { triggerToast("Opening Shakti Kit checkout..."); }} className="hb-g font-bold hover:bg-white/20 transition-colors cursor-pointer">
                Pre-book kit
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Audio narration strip */}
      <div className="strip select-none">
        <div className="strip-in">
          <div className="tp">
            <span className="tpi"><span className="tpd bg-[#27500A]" />Scripturally sourced</span>
            <span className="tpi"><span className="tpd bg-[#E8A020]" />Region aware</span>
            <span className="tpi"><span className="tpd bg-[#EF0F54]" />Fear-free</span>
          </div>
          <div className="audio">
            <button 
              onClick={() => {
                setAudioPlaying(!audioPlaying);
                triggerToast(audioPlaying ? "Audio guide paused" : "Playing audio guide narration...");
              }} 
              className="aplay hover:scale-105 transition-transform cursor-pointer"
            >
              {audioPlaying ? "⏸" : "▶"}
            </button>
            <div>
              <div className="alab font-sans">Listen to this guide</div>
              <div className="asub font-sans">18 min · narrated</div>
            </div>
            <div className="alangs select-none">
              <button 
                onClick={() => { setActiveLang("EN"); triggerToast("Narration language: English"); }} 
                className={`alg ${activeLang === "EN" ? "on" : ""}`}
              >
                EN
              </button>
              <button 
                onClick={() => { setActiveLang("HI"); triggerToast("Narration language: Hindi"); }} 
                className={`alg ${activeLang === "HI" ? "on" : ""}`}
              >
                हिं
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation chips */}
      <div className="chips">
        <div className="chips-in font-sans">
          <span className="chip-l">JUMP TO</span>
          <a className="chip" href="#story">📖 The story</a>
          <a className="chip" href="#sankalp">✋ Sankalpa</a>
          <a className="chip" href="#vidhi">🪔 Day 1 Steps</a>
          <a className="chip" href="#nine">📅 Nine Days</a>
          <a className="chip" href="#katha">📿 Vrat Katha</a>
          <a className="chip" href="#samagri">🧺 Samagri</a>
          <a className="chip" href="#fast">🍎 Fasting</a>
          <a className="chip" href="#myths">✕ Myths</a>
        </div>
      </div>

      {/* Core layout wrapping content */}
      <div className="wrap">
        <div className="layout">
          
          {/* Main content column */}
          <div className="main">
            
            {/* Puranic Credibility Box */}
            <div className="cc select-none">
              <div className="cc-h font-sans">
                <span className="cc-hl">SOURCE OF TRUTH</span>
                <span onClick={() => triggerToast("Redirecting to source script...")} className="cc-hr cursor-pointer">Read source ›</span>
              </div>
              <div className="cc-b font-sans">
                <div className="cc-core">CORE PRACTICE</div>
                <div className="cc-claim">Worship of Durga across the nine nights of Ashwin Shukla Paksha</div>
                <div className="cc-row">
                  <span className="pill d">DHARMA · 4/5</span>
                  <span className="badge puranic">PURANIC</span>
                  <span className="pill src">Devi Mahatmya · Markandeya Purana</span>
                </div>
              </div>
              <p className="cc-comp font-sans">This guide: <b>1 core practice</b> · <b>4 scriptural elements</b> · <b>4 regional customs</b> · <b>3 corrections</b></p>
            </div>

            {/* Panchang Observance Card */}
            <div className="pan select-none">
              <div className="pan-h font-sans">
                <span className="pan-hl">📅 NAVRATRI 2026</span>
                <span className="pan-hr">Delhi-NCR · Drik Panchang</span>
              </div>
              <div className="pan-g font-sans">
                <div className="pc">
                  <div className="pc-k">THE NINE NIGHTS</div>
                  <div className="pc-v">11–19 Oct</div>
                  <div className="pc-s">Ashwin Shukla Paksha</div>
                </div>
                <div className="pc">
                  <div className="pc-k">GHATASTHAPANA</div>
                  <div className="pc-v">Sun 11 Oct</div>
                  <div className="pc-s">6:19–10:12 AM · Abhijit 11:44–12:31 PM</div>
                </div>
                <div className="pc">
                  <div className="pc-k">ASHTAMI / NAVAMI</div>
                  <div className="pc-v">19 Oct</div>
                  <div className="pc-s">Tithis merge this year</div>
                </div>
                <div className="pc">
                  <div className="pc-k">VIJAYADASHAMI</div>
                  <div className="pc-v">Tue 20 Oct</div>
                  <div className="pc-s">The tenth day</div>
                </div>
              </div>
              <p className="pan-n font-sans">
                <b>Two things to check against your own panchang.</b> Saptami covers both 17 and 18 October this year, so the observance stretches across ten civil days. And panchangs differ on whether Durga Ashtami falls on the 18th or the 19th — follow your family or community panchang.
              </p>
            </div>

            {/* Opening Paragraphs */}
            <p className="open font-serif">Nine nights, one Mother.</p>
            <p className="p font-sans">
              Navratri means nine nights. It is not nine separate festivals — it is one continuous arc of worship, moving from darkness through fire to light.
            </p>

            {/* Story section */}
            <div className="sh" id="story">
              <span className="sh-p">+</span>
              <span className="sh-t">The story the nine nights re-enact</span>
            </div>
            <p className="p font-sans">
              The Devi Mahatmya tells it plainly. The gods were losing. Mahishasura had taken heaven and no god could defeat him. The collective energy of all the gods converged into one form: Durga. She fought for nine nights, and on the tenth day she won.
            </p>
            <div className="tagrow select-none">
              <span className="pill d">DHARMA · 4/5</span>
              <span className="badge puranic">PURANIC</span>
              <span className="pill src">Devi Mahatmya, Markandeya Purana</span>
            </div>
            <p className="p font-sans">
              Every year the tradition re-enacts that arc, not as mythology but as practice. You set up a kalash. You light a flame and keep it lit. You worship a different form of the Mother each day. And on the tenth day you mark the outcome.
            </p>

            <div className="hr"></div>

            {/* Sankalpa section */}
            <div className="sh" id="sankalp">
              <span className="sh-p">+</span>
              <span className="sh-t">The sankalpa</span>
            </div>
            <p className="sh-s font-sans">Said once, at the start, before anything else is done.</p>

            <div className="sank select-none">
              <div className="sank-h font-sans">SPOKEN WITH WATER IN THE RIGHT HAND, THEN POURED OUT</div>
              <div className="sank-b font-sans">
                <p className="sank-dev">ओं विष्णुर्विष्णुर्विष्णुः … मम आत्मनः श्रुतिस्मृतिपुराणोक्तफलप्राप्त्यर्थं श्री दुर्गा प्रीत्यर्थं नवरात्र व्रतम् अहं करिष्ये॥</p>
                <p className="sank-r">&quot;I take up the Navratri vrat, for the pleasure of Sri Durga.&quot;</p>
                <p className="sank-m">A sankalpa is a stated intention, not a formula that must be pronounced correctly. It names <b>who is doing it, when, where and for what</b>. That is the whole of its structure.</p>
                <div className="sank-g">
                  <div className="sg"><div className="sg-k">WHO</div><div className="sg-v">Your name, and your gotra if your family uses one. If you do not know it, leave it out.</div></div>
                  <div className="sg"><div className="sg-k">WHEN AND WHERE</div><div className="sg-v">The tithi and the place. &quot;Today, at home&quot; is sufficient.</div></div>
                  <div className="sg"><div className="sg-k">FOR WHAT</div><div className="sg-v">The observance you are taking up, and for whom. Here: the nine-night vrat, for Durga.</div></div>
                </div>
              </div>
              <p className="sank-note font-sans"><b>Say it in whatever language you think in.</b> The Sanskrit is given because people ask for it. A sankalpa said in Hindi or English, meant sincerely, is a sankalpa.</p>
            </div>

            {/* Vidhi Steps Ghatasthapana */}
            <div className="sh" id="vidhi">
              <span className="sh-p">+</span>
              <span className="sh-t">Day 1 — Ghatasthapana</span>
            </div>
            <p className="sh-s font-sans">Sunday 11 October · Maa Shailputri, daughter of the mountain — Parvati in her first form.</p>

            <div className="muh font-sans select-none">
              <b>Muhurat.</b> Morning 6:19–10:12 AM is preferred. Abhijit muhurat, 11:44 AM–12:31 PM, is the fallback. Ghatasthapana is not performed after midday.
            </div>

            <div className="steps-container">
              
              <div className="step">
                <div className="st-c select-none">
                  <div className="st-n">1</div>
                  <div className="st-l"></div>
                </div>
                <div className="st-b font-sans">
                  <p>Clean the space. Place a chowki and cover it with red cloth.</p>
                </div>
              </div>

              <div className="step">
                <div className="st-c select-none">
                  <div className="st-n">2</div>
                  <div className="st-l"></div>
                </div>
                <div className="st-b font-sans">
                  <p>Kalash sthapana — fill a brass or copper kalash with water, add akshat, a coin and a supari, place five or seven mango leaves around the rim, seal with a coconut.</p>
                </div>
              </div>

              <div className="step">
                <div className="st-c select-none">
                  <div className="st-n">3</div>
                  <div className="st-l"></div>
                </div>
                <div className="st-b font-sans">
                  <p>Sow barley or sapta-dhanya in a small clay pot of soil. Water lightly.</p>
                  <div className="tagrow select-none" style={{ margin: "8px 0 0" }}>
                    <span className="pill p">PRATHA</span>
                  </div>
                </div>
              </div>

              <div className="step">
                <div className="st-c select-none">
                  <div className="st-n">4</div>
                  <div className="st-l"></div>
                </div>
                <div className="st-b font-sans">
                  <p>Place the Durga image or idol behind the kalash and install it with prayer.</p>
                </div>
              </div>

              <div className="step">
                <div className="st-c select-none">
                  <div className="st-n">5</div>
                  <div className="st-l"></div>
                </div>
                <div className="st-b font-sans">
                  <p>Light the akhand jyoti — a ghee lamp intended to burn through the nine days. Use a vessel large enough to hold sufficient ghee or oil.</p>
                  <div className="tagrow select-none" style={{ margin: "8px 0 0" }}>
                    <span className="pill d">DHARMA · 4/5</span>
                    <span className="badge shastra">SHASTRA</span>
                  </div>
                </div>
              </div>

              <div className="step">
                <div className="st-c select-none">
                  <div className="st-n">6</div>
                  <div className="st-l"></div>
                </div>
                <div className="st-b font-sans">
                  <p>Offer flowers, incense and fruit. Chant Ya Devi Sarvabhuteshu, or Durga Saptashati Chapter 1.</p>
                </div>
              </div>

              <div className="step">
                <div className="st-c select-none">
                  <div className="st-n end">7</div>
                </div>
                <div className="st-b font-sans">
                  <p>Take the Navratri vrat sankalp.</p>
                </div>
              </div>

            </div>

            {/* Day 1 Mantra Pronunciation Section */}
            <div className="mantra select-none">
              <div className="mn-top" style={{ display: "block" }}>
                <div className="mn-l">DAY ONE MANTRA</div>
              </div>
              <div className="mn-d">ओं ह्रीं शैलपुत्र्यै नमः</div>
              <div className="mn-r">Om Hreem Shailputryai Namah</div>
              
              <div className="japa">
                <div>
                  <div className="jp-l">JAPA COUNT</div>
                  <div className="jp-t" style={{ textAlign: "left", marginTop: "4px" }}>Tap as you complete each round</div>
                </div>
                <div className="jp-ctr">
                  <button onClick={handleDecrement} className="jp-b hover:bg-white/10">-</button>
                  <div>
                    <div className="jp-n">{japaCount}</div>
                    <div className="jp-t">of 108</div>
                  </div>
                  <button onClick={handleIncrement} className="jp-b hover:bg-white/10">+</button>
                </div>
                <div className="jp-presets">
                  <button onClick={() => { setJapaCount(11); setJapaPreset(11); }} className={`jp-p ${japaPreset === 11 ? "on" : ""}`}>11</button>
                  <button onClick={() => { setJapaCount(21); setJapaPreset(21); }} className={`jp-p ${japaPreset === 21 ? "on" : ""}`}>21</button>
                  <button onClick={() => { setJapaCount(51); setJapaPreset(51); }} className={`jp-p ${japaPreset === 51 ? "on" : ""}`}>51</button>
                  <button onClick={() => { setJapaCount(108); setJapaPreset(108); }} className={`jp-p ${japaPreset === 108 ? "on" : ""}`}>108</button>
                </div>
              </div>
            </div>

            <p className="p font-sans">
              Sowing barley on the first day is a widespread North Indian practice rather than a scriptural requirement. Where it is kept, the sprouts are watched through the nine days and distributed as prasad at the end.
            </p>
            <div className="tagrow select-none">
              <span className="pill p">PRATHA</span>
            </div>

            <div className="hr"></div>

            {/* Section: Nine forms list */}
            <div className="sh" id="nine">
              <span className="sh-p">+</span>
              <span className="sh-t">The nine forms, day by day</span>
            </div>
            <p className="sh-s font-sans">One Shakti, nine faces. The arc runs from the mountain&apos;s daughter to the giver of siddhis.</p>

            <div className="days select-none">
              <div className="dh font-sans">
                <span>DAY</span>
                <span>DATE / TITHI</span>
                <span>DEITY / FORM</span>
                <span>COLOUR</span>
                <span>OFFERING</span>
              </div>
              
              <div className="dr font-sans">
                <div className="d-n">1</div>
                <div>
                  <div className="font-bold">11 Oct</div>
                  <div className="d-dt">Pratipada · Ghatsthapana</div>
                </div>
                <div><span className="d-dv">Maa Shailaputri</span></div>
                <div className="d-col"><span className="d-sw bg-[#FFD700]"></span>Yellow</div>
                <div className="d-of">Pure Ghee</div>
              </div>

              <div className="dr font-sans">
                <div className="d-n">2</div>
                <div>
                  <div className="font-bold">12 Oct</div>
                  <div className="d-dt">Dwitiya</div>
                </div>
                <div><span className="d-dv">Maa Brahmacharini</span></div>
                <div className="d-col"><span className="d-sw bg-[#2E7D32]"></span>Green</div>
                <div className="d-of">Sugar & Fruits</div>
              </div>

              <div className="dr font-sans">
                <div className="d-n">3</div>
                <div>
                  <div className="font-bold">13 Oct</div>
                  <div className="d-dt">Tritiya</div>
                </div>
                <div><span className="d-dv">Maa Chandraghanta</span></div>
                <div className="d-col"><span className="d-sw bg-[#757575]"></span>Grey</div>
                <div className="d-of">Kheer / Payasam</div>
              </div>

              <div className="dr font-sans">
                <div className="d-n">4</div>
                <div>
                  <div className="font-bold">14 Oct</div>
                  <div className="d-dt">Chaturthi</div>
                </div>
                <div><span className="d-dv">Maa Kushmanda</span></div>
                <div className="d-col"><span className="d-sw bg-[#EF6C00]"></span>Orange</div>
                <div className="d-of">Malpua</div>
              </div>

              <div className="dr font-sans">
                <div className="d-n">5</div>
                <div>
                  <div className="font-bold">15 Oct</div>
                  <div className="d-dt">Panchami</div>
                </div>
                <div><span className="d-dv">Maa Skandamata</span></div>
                <div className="d-col"><span className="d-sw bg-[#F5F5F5]"></span>White</div>
                <div className="d-of">Bananas</div>
              </div>

              <div className="dr font-sans">
                <div className="d-n">6</div>
                <div>
                  <div className="font-bold">16 Oct</div>
                  <div className="d-dt">Shashti</div>
                </div>
                <div><span className="d-dv">Maa Katyayani</span></div>
                <div className="d-col"><span className="d-sw bg-[#C62828]"></span>Red</div>
                <div className="d-of">Honey</div>
              </div>

              <div className="dr font-sans">
                <div className="d-n">7</div>
                <div>
                  <div className="font-bold">17 Oct</div>
                  <div className="d-dt">Saptami</div>
                </div>
                <div><span className="d-dv">Maa Kalaratri</span></div>
                <div className="d-col"><span className="d-sw bg-[#1565C0]"></span>Royal Blue</div>
                <div className="d-of">Jaggery / Gur</div>
              </div>

              <div className="dr font-sans">
                <div className="d-n">8</div>
                <div>
                  <div className="font-bold">18 Oct</div>
                  <div className="d-dt">Ashtami</div>
                </div>
                <div><span className="d-dv">Maa Mahagauri</span></div>
                <div className="d-col"><span className="d-sw bg-[#AD1457]"></span>Pink</div>
                <div className="d-of">Coconut</div>
              </div>

              <div className="dr font-sans">
                <div className="d-n">9</div>
                <div>
                  <div className="font-bold">19 Oct</div>
                  <div className="d-dt">Navami</div>
                </div>
                <div><span className="d-dv">Maa Siddhidatri</span></div>
                <div className="d-col"><span className="d-sw bg-[#6A1B9A]"></span>Purple</div>
                <div className="d-of">Halwa-Puri</div>
              </div>

            </div>

            <div className="hr"></div>

            {/* Section: Vrat Katha */}
            <div className="sh" id="katha">
              <span className="sh-p">+</span>
              <span className="sh-t">The Vrat Katha</span>
            </div>
            <p className="sh-s font-sans">Read on any of the nine nights, most often on Ashtami.</p>

            <div className="katha select-none">
              <div className="k-top font-sans">
                <div className="k-l">DEVI MAHATMYA · MARKANDEYA PURANA</div>
                <div className="k-t">The gods were losing, and no god could win</div>
                <p className="k-s">Mahishasura had taken heaven. What defeated him was not a stronger god — it was every god surrendering their power into one form.</p>
              </div>
              <div className="k-b font-sans">
                <div className="k-beats">
                  <div className="kb">
                    <div className="kb-n">1</div>
                    <div className="kb-t">The boon</div>
                    <p className="kb-s">Mahishasura cannot be killed by any man or god. He asks for the exemption he thinks is safest.</p>
                  </div>
                  <div className="kb">
                    <div className="kb-n">2</div>
                    <div className="kb-t">Heaven falls</div>
                    <p className="kb-s">The devas are driven out. Each one alone is not enough, and they know it.</p>
                  </div>
                  <div className="kb">
                    <div className="kb-n">3</div>
                    <div className="kb-t">The convergence</div>
                    <p className="kb-s">Their combined energy takes one form — Durga, holding a weapon from each of them.</p>
                  </div>
                  <div className="kb">
                    <div className="kb-n">4</div>
                    <div className="kb-t">Nine nights</div>
                    <p className="kb-s">She fights for nine nights. On the tenth day, she wins.</p>
                  </div>
                </div>
                <div className="k-f">
                  <p className="k-moral"><b>Why it is read across nine nights, not one:</b> the battle took nine. The reading follows the fight rather than summarising it.</p>
                  <button onClick={() => triggerToast("Playing katha audio...")} className="k-audio cursor-pointer">🎧 Listen · 14 min</button>
                  <button onClick={() => triggerToast("Opening full text of Vrat Katha...")} className="k-c cursor-pointer">Read the full katha ›</button>
                </div>
              </div>
            </div>

            {/* Ashtami / Navami text */}
            <div className="sh">
              <span className="sh-p">+</span>
              <span className="sh-t">Durga Ashtami and Maha Navami</span>
            </div>
            <p className="p font-sans">
              These are the most intensive days of the nine. In 2026 the two tithis merge on 19 October, so confirm your panchang before fixing the day.
            </p>
            <p className="p font-sans">
              Havan is traditionally performed on Ashtami. <strong>Kanya Pujan</strong> — inviting young girls and honouring them as living forms of the Devi — is kept on  tradition. Their feet are washed, food is offered, and blessings are taken from them.
            </p>
            <div className="tagrow select-none">
              <span className="pill d">DHARMA · 4/5</span>
              <span className="badge shastra">SHASTRA</span>
            </div>
            <p className="p font-sans">
              Where Ashtami and Navami cross, Sandhi Puja is performed in the window spanning the join.
            </p>

            <div className="hr"></div>

            {/* Section: Samagri */}
            <div className="sh" id="samagri">
              <span className="sh-p">+</span>
              <span className="sh-t">Samagri</span>
            </div>
            <p className="sh-s font-sans">Everything is available in any local puja market. Substitutions are noted where they matter.</p>
            
            <div className="sam select-none">
              <div className="sam-r font-sans"><span className="sam-i">Kalash — brass or copper</span><span className="sam-n">With mango leaves, coconut, coin, supari, akshat</span></div>
              <div className="sam-r font-sans"><span className="sam-i">Clay pot, soil, barley seeds</span><span className="sam-n">For sowing on day one</span></div>
              <div className="sam-r font-sans"><span className="sam-i">Red cloth and chunri</span><span className="sam-n">For the chowki and for Kanya Pujan</span></div>
              <div className="sam-r font-sans"><span className="sam-i">Durga idol or framed image</span><span className="sam-n">—</span></div>
              <div className="sam-r font-sans"><span className="sam-i">Akhand jyoti vessel with ghee or oil</span><span className="sam-n">Large enough to burn through nine days</span></div>
              <div className="sam-r font-sans"><span className="sam-i">Durga Saptashati</span><span className="sam-n">The 700-verse text</span></div>
              <div className="sam-r font-sans"><span className="sam-i">Fresh flowers daily</span><span className="sam-n">Red hibiscus, marigold, jasmine</span></div>
              <div className="sam-r font-sans"><span className="sam-i">Sindoor, kumkum, chandan, akshat, haldi</span><span className="sam-n">—</span></div>
              <div className="sam-r font-sans"><span className="sam-i">Ghee, incense, camphor</span><span className="sam-n">Daily</span></div>
              <div className="sam-r font-sans"><span className="sam-i">Kanya Pujan items</span><span className="sam-n">Halwa, poori, chana; red chunri; a small token for each girl</span></div>
              <div className="sam-r font-sans"><span className="sam-i">Havan samagri</span><span className="sam-n">If performing the Ashtami or Navami havan</span></div>
            </div>

            <div className="hr"></div>

            {/* Section: Fasting */}
            <div className="sh" id="fast">
              <span className="sh-p">+</span>
              <span className="sh-t">Fasting</span>
            </div>
            <p className="sh-s font-sans">Three forms are commonly kept, and all three are accepted.</p>
            
            <div className="fast select-none">
              <div className="fb font-sans"><div className="fb-t">Full nine days</div><p className="fb-s">No grains, no regular salt — use sendha namak — no onion or garlic, no non-vegetarian food. Phalahar through the day.</p></div>
              <div className="fb font-sans"><div className="fb-t">Partial</div><p className="fb-s">On Pratipada, Ashtami and Navami only, eating sattvic on the other days.</p></div>
              <div className="fb font-sans"><div className="fb-t">First and last</div><p className="fb-s">Day one and day nine only.</p></div>
            </div>
            <div className="fnote font-sans mt-4 select-none">
              💡 <b>Dharma Note:</b> The tradition prescribes devotion, not starvation. If a nine-day fast is not physically possible for you, a shorter form kept with sincerity fulfils the vrat.
            </div>

            <div className="hr"></div>

            {/* Section: Myths & Corrections */}
            <div className="sh" id="myths">
              <span className="sh-p">✕</span>
              <span className="sh-t">Myths &amp; Facts</span>
            </div>

            <div className="myth font-sans select-none">
              <div className="my-q">
                <span className="my-qt">&quot;If the Akhand Jyoti goes out, the whole Navratri is wasted.&quot;</span>
                <span className="my-bd">BHRANTI</span>
              </div>
              <p className="my-a text-body-text">
                Relight it and continue. The tradition values the intention of maintaining a continuous flame. An accidental extinguishing does not cancel the days already kept. This fear contradicts the Devi&apos;s own teaching — she fights for you, not against you.
              </p>
            </div>

            <div className="myth font-sans select-none">
              <div className="my-q">
                <span className="my-qt">&quot;Wearing the wrong colour on a day brings bad luck.&quot;</span>
                <span className="my-bd">BHRANTI</span>
              </div>
              <p className="my-a text-body-text">
                The daily colour system is custom, not scripture. No named text assigns colours to days. If you wear green on a red day, nothing is owed and nothing is lost.
              </p>
            </div>

            <div className="myth font-sans select-none">
              <div className="my-q">
                <span className="my-qt">&quot;Kanya Pujan must be exactly nine girls — fewer is disrespectful.&quot;</span>
                <span className="my-bd">BHRANTI</span>
              </div>
              <p className="my-a text-body-text">
                Nine is the ideal, matching the nine forms. Two, five and seven are all accepted across traditions. The practice is the honouring, not the headcount.
              </p>
            </div>

            {/* Section: Companion article teaser */}
            <div className="intel select-none">
              <div className="in-l font-sans">◗ WHY NINE NIGHTS?</div>
              <div className="in-t font-sans">The number is not decorative</div>
              <p className="in-s font-sans">Nine nights appear across the tradition — four Navratris in a year, not one. The count, the arc from tamas through rajas to sattva, and why the tenth day sits outside the nine are explained once and apply to all of them.</p>
              <span onClick={() => triggerToast("Opening background article...")} className="in-c font-sans font-bold cursor-pointer">Read: What Navratri is — the nine nights ›</span>
            </div>

            {/* Section: Closing paragraphs */}
            <div className="closing font-sans">
              <p className="mb-3">Navratri is the tradition&apos;s most sustained worship — nine nights without a break. The kalash stays filled. The flame stays lit. The flowers are replaced each morning. The mantra changes daily.</p>
              <p>And on the ninth night you look at the barley you sowed on the first day, now tall and green and reaching upward, and you understand what the nine nights were doing: growing something that was barely a seed when you began.</p>
            </div>

            {/* Related section */}
            <div className="sh"><span className="sh-p">+</span><span className="sh-t">Related</span></div>
            <div className="relgrid select-none">
              <div className="rel font-sans">
                <div className="rel-h">RELATED RITUAL GUIDES</div>
                <a onClick={() => triggerToast("Opening Dussehra guide...")} className="rel-i cursor-pointer"><span><span className="rel-n">Dussehra / Vijayadashami</span><span className="rel-s">The tenth day · 20 October</span></span><span className="rel-cl">CALENDAR</span></a>
                <a onClick={() => triggerToast("Opening Durga Ashtami guide...")} className="rel-i cursor-pointer"><span><span className="rel-n">Durga Ashtami</span><span className="rel-s">The most intensive of the nine</span></span><span className="rel-cl">DEITY</span></a>
              </div>
              <div className="rel font-sans">
                <div className="rel-h">RELATED PUJANS</div>
                <a onClick={() => triggerToast("Opening Ghatasthapana service...")} className="rel-i cursor-pointer"><span><span className="rel-n">Navratri Ghatasthapana</span><span className="rel-s">Bookable · purohit performs the sthapana</span></span><span className="rel-a">›</span></a>
                <a onClick={() => triggerToast("Opening Durga Puja guide...")} className="rel-i cursor-pointer"><span><span className="rel-n">Durga Puja</span><span className="rel-s">The Bengali observance form</span></span><span className="rel-a">›</span></a>
              </div>
              <div className="rel font-sans">
                <div className="rel-h">RELATED CONCEPTS</div>
                <a onClick={() => triggerToast("Opening Navratri background concept...")} className="rel-i cursor-pointer"><span><span className="rel-n">What Is Navratri?</span><span className="rel-s">The three gunas across nine nights</span></span><span className="rel-a">›</span></a>
              </div>
              <div className="rel font-sans">
                <div className="rel-h">RELATED DATES</div>
                <a onClick={() => triggerToast("Opening 2026 Panchang...")} className="rel-i cursor-pointer"><span><span className="rel-n">Sharad Navratri 2026 Panchang</span><span className="rel-s">Every tithi boundary, day by day</span></span><span className="rel-a">›</span></a>
                <a onClick={() => triggerToast("Opening Ashwin month panchang...")} className="rel-i cursor-pointer"><span><span className="rel-n">Ashwin month panchang</span><span className="rel-s">The full month</span></span><span className="rel-a">›</span></a>
              </div>
            </div>

            {/* Final checkout block */}
            <div className="sh"><span className="sh-p">+</span><span className="sh-t">Prefer to have it all taken care of?</span></div>
            <div className="rev select-none">
              <div className="rev-c feat font-sans">
                <div className="rev-i">🪔</div>
                <div className="rev-l">RITUAL KIT</div>
                <div className="rev-t">Shakti Kit</div>
                <p className="rev-s">Nine days of samagri in one box — kalash set, barley and pot, chunri, akhand jyoti vessel, Saptashati, puja powders and the Kanya Pujan items.</p>
                <button onClick={() => triggerToast("Adding Shakti Kit to checkout...")} className="rev-b cursor-pointer">Pre-book — ₹1,751</button>
              </div>
              <div className="rev-c live font-sans">
                <div className="rev-i">🙏</div>
                <div className="rev-l">PUROHIT &amp; PUJA</div>
                <div className="rev-t">Book a purohit for Ghatasthapana</div>
                <p className="rev-s">Any devotee can perform the sthapana. A purohit adds muhurat precision and takes the procedure off your hands on a working Sunday morning.</p>
                <button onClick={() => triggerToast("Checking purohit availability...")} className="rev-b pur cursor-pointer">Check availability ›</button>
              </div>
              <div className="rev-c live font-sans">
                <div className="rev-i" style={{ background: "#E9F7EE", borderColor: "#C6E6D2" }}>📱</div>
                <div className="rev-l">THE TAPA CIRCLE</div>
                <div className="rev-t">Never miss a date again</div>
                <p className="rev-s">Festival and vrat reminders on WhatsApp, with the guide attached and the kit cut-off if there is one. ₹499 a year.</p>
                <button onClick={() => triggerToast("Subscribing to WhatsApp Tapa Circle...")} className="rev-b wa cursor-pointer">Join the Tapa Circle ›</button>
              </div>
            </div>
            <p className="rev-note font-sans select-none">You do not need any of these to observe Navratri. The samagri list above is complete and free, and no text ranks a bought kit above an assembled one.</p>

          </div>

          {/* Right sidebar checklist column */}
          <div className="side">
            
            {/* Checklist sidebar card */}
            <div className="sb select-none">
              <div className="sb-h font-sans">
                <span>Puja Checklist</span>
                <span className="sb-c font-bold text-pink">{checkedCount}/7 done</span>
              </div>
              
              <div className="sb-i font-sans">
                <input 
                  type="checkbox" 
                  checked={checklist[0]} 
                  onChange={() => handleCheck(0)} 
                  className="cb cursor-pointer" 
                />
                <span>Clean the space</span>
              </div>

              <div className="sb-i font-sans">
                <input 
                  type="checkbox" 
                  checked={checklist[1]} 
                  onChange={() => handleCheck(1)} 
                  className="cb cursor-pointer" 
                />
                <span>Kalash sthapana</span>
              </div>

              <div className="sb-i font-sans">
                <input 
                  type="checkbox" 
                  checked={checklist[2]} 
                  onChange={() => handleCheck(2)} 
                  className="cb cursor-pointer" 
                />
                <span>Sow barley</span>
              </div>

              <div className="sb-i font-sans">
                <input 
                  type="checkbox" 
                  checked={checklist[3]} 
                  onChange={() => handleCheck(3)} 
                  className="cb cursor-pointer" 
                />
                <span>Place the Durga image</span>
              </div>

              <div className="sb-i font-sans">
                <input 
                  type="checkbox" 
                  checked={checklist[4]} 
                  onChange={() => handleCheck(4)} 
                  className="cb cursor-pointer" 
                />
                <span>Light the akhand jyoti</span>
              </div>

              <div className="sb-i font-sans">
                <input 
                  type="checkbox" 
                  checked={checklist[5]} 
                  onChange={() => handleCheck(5)} 
                  className="cb cursor-pointer" 
                />
                <span>Offer flowers, incense</span>
              </div>

              <div className="sb-i font-sans">
                <input 
                  type="checkbox" 
                  checked={checklist[6]} 
                  onChange={() => handleCheck(6)} 
                  className="cb cursor-pointer" 
                />
                <span>Take the Navratri vrat sankalp</span>
              </div>

              <div className="sb-act flex flex-col gap-2 w-full mt-4">
                <button onClick={() => triggerToast("Downloading checklist PDF...")} className="sb-wa cursor-pointer hover:opacity-95 w-full font-semibold py-2 rounded-xl text-center text-xs">
                  📋 Download Checklist PDF
                </button>
                <button onClick={() => triggerToast("Downloading full guide PDF...")} className="sb-dl cursor-pointer hover:bg-black/5 w-full font-semibold py-2 rounded-xl text-center text-xs">
                  📄 Download Guide PDF
                </button>
              </div>
            </div>

            {/* Sidebar quick actions */}
            <button 
              onClick={() => triggerToast("Adding Shakti Kit to checkout...")} 
              className="sbcta pink hover:opacity-95 transition-opacity cursor-pointer select-none"
            >
              <span className="sb-ci">🧺</span>
              <span className="sb-ct font-sans">Pre-book the Shakti kit</span>
              <span className="sb-cs font-sans">₹1,751 · delivered before 11 October</span>
            </button>

            <button 
              onClick={() => triggerToast("Subscribing to WhatsApp Tapa Circle...")} 
              className="sbcta wa hover:opacity-95 transition-opacity cursor-pointer select-none"
            >
              <span className="sb-ci">💬</span>
              <span className="sb-ct font-sans">Join the Tapa Circle</span>
              <span className="sb-cs font-sans">WhatsApp reminders · ₹499 a year</span>
            </button>

            <button 
              onClick={() => triggerToast("Downloading ritual card PDF...")} 
              className="sbcta dk hover:opacity-95 transition-opacity cursor-pointer select-none"
            >
              <span className="sb-ci">↓</span>
              <span className="sb-ct font-sans">Download the ritual card</span>
              <span className="sb-cs font-sans">One page — samagri, steps, mantras, timings</span>
            </button>

            {/* Reference info box */}
            <div className="sbn select-none font-sans">
              <div className="sbn-h">SCRIPTURAL BACKING</div>
              <div className="sbn-t">
                This guide complies with teachings in the <b>Devi Mahatmya · Markandeya Purana</b>. All steps and claims are vetted by certified acharyas.
              </div>
              <span onClick={() => triggerToast("Opening credential validation page...")} className="sbn-c font-bold cursor-pointer">
                View Credentials ›
              </span>
            </div>

          </div>

        </div>
      </div>

      <Footer onTriggerToast={triggerToast} />

      {/* Global Toast component */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] bg-black/90 text-white px-5 py-3 rounded-2xl shadow-xl font-sans text-xs flex items-center gap-2 border border-white/10 animate-fade-in select-none">
          <span>🔔</span>
          <span className="font-semibold">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
