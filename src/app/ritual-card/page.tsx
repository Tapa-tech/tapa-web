"use client";

import React, { useState } from "react";
import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";
import "./card.css";

const LOGO = `data:image/png;base64,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`;

  const navNotes = (
    <>
      <div className="n-ey">RITUAL GUIDE CARD</div>
      <div className="n-t">Sharad Navratri</div>
      <p className="n-p">
        A4 portrait, one sheet, seven blocks in a fixed order: <b>masthead · when · what you need · what to do · what to say · fasting · source and footer</b>.
      </p>
      <div className="n-rule">
        <div className="n-rl">THE CONSTRAINT THAT SHAPED IT</div>
        <p className="n-rt">
          This is read <b>during</b> the ritual, often with wet hands, propped against something. Nothing is tappable, nothing scrolls, and nothing is below a fold — because there is no fold.
        </p>
      </div>
      <div className="n-box">
        <div className="n-bh">DECISIONS</div>
        <div className="n-r">
          <span>·</span>
          <span><b>Checkboxes are printable squares</b>, not app checkboxes. Ticked with a pen at the market.</span>
        </div>
        <div className="n-r">
          <span>·</span>
          <span><b>Timings are the largest type on the page</b> after the title. They are what someone glances down for.</span>
        </div>
        <div className="n-r">
          <span>·</span>
          <span><b>The mantra block is inverted</b> — dark on light — so it is findable without reading.</span>
        </div>
        <div className="n-r">
          <span>·</span>
          <span><b>Nine boxes for japa rounds.</b> A paper counter, because a phone is put away during the puja.</span>
        </div>
      </div>
      <div className="n-warn">
        <b>No commerce anywhere on the card.</b> No kit, no Circle, no QR to a product. The QR goes to the guide. A card that sells is a card nobody keeps beside a diya.
      </div>
    </>
  );

  const ekadNotes = (
    <>
      <div className="n-ey">VRAT CARD</div>
      <div className="n-t">Aja Ekadashi</div>
      <p className="n-p">
        Same seven blocks, different weight. For a vrat the <b>parana window</b> is the whole point, so block 1 gives it equal billing with the start and the warning sits directly beneath.
      </p>
      <div className="n-box">
        <div className="n-bh">WHAT CHANGES BY RITUAL TYPE</div>
        <div className="n-r">
          <span>·</span>
          <span><b>Block 5 flexes.</b> Fasting forms on a festival card; what counts as a grain on an Ekadashi card.</span>
        </div>
        <div className="n-r">
          <span>·</span>
          <span><b>Samagri shortens.</b> Six items, and the card says why — &quot;Ekadashi asks for restraint rather than arrangement.&quot;</span>
        </div>
        <div className="n-r">
          <span>·</span>
          <span><b>The correction travels.</b> &quot;Nirjala is one form some choose — it is not what the vrat asks for&quot; sits inside step 2, where the decision is made.</span>
        </div>
      </div>
      <div className="n-rule">
        <div className="n-rl">REGENERATION</div>
        <p className="n-rt">
          Every dated field — the date, the tithi, both timings, the city — is a <b>variable, not typed copy</b>. When the Panchang record changes, the card regenerates. Nobody edits a PDF.
        </p>
      </div>
    </>
  );

  const specNotes = (
    <>
      <div className="n-ey">SPECIFICATION</div>
      <div className="n-t">Seven blocks, fixed order</div>
      <div className="n-box">
        <div className="n-bh">BLOCKS</div>
        <div className="n-r">
          <span>1</span>
          <span><b>Masthead</b> — mark, category, ritual name, one-line description, then date, tithi and city.</span>
        </div>
        <div className="n-r">
          <span>2</span>
          <span><b>When</b> — two timing panels and the one caveat that matters. Largest numerals on the page.</span>
        </div>
        <div className="n-r">
          <span>3</span>
          <span><b>What you need</b> — two columns, printable checkboxes, substitution note.</span>
        </div>
        <div className="n-r">
          <span>4</span>
          <span><b>What to do</b> — numbered steps, condensed. Pratha marked inline in grey.</span>
        </div>
        <div className="n-r">
          <span>5</span>
          <span><b>What to say</b> — Devanagari, transliteration, one line of context, japa boxes. Inverted.</span>
        </div>
        <div className="n-r">
          <span>6</span>
          <span><b>Fasting or the category rule</b> — three panels plus the reassurance line.</span>
        </div>
        <div className="n-r">
          <span>7</span>
          <span><b>Source and footer</b> — text and score, Pratha called out, panchang source, tagline, URL, QR.</span>
        </div>
      </div>
      <div className="n-box">
        <div className="n-bh">FORMAT</div>
        <div className="n-r">
          <span>·</span>
          <span>A4 portrait, 210 × 297 mm, two columns. One sheet, the paper every home printer holds.</span>
        </div>
        <div className="n-r">
          <span>·</span>
          <span>Single page. If content will not fit, cut steps — never spill to page two.</span>
        </div>
        <div className="n-r">
          <span>·</span>
          <span>Minimum type 10.5px. Nothing smaller, at any zoom.</span>
        </div>
        <div className="n-r">
          <span>·</span>
          <span>Greyscale-safe. Colour is decoration, never information.</span>
        </div>
      </div>
      <div className="n-rule">
        <div className="n-rl">BY CATEGORY</div>
        <p className="n-rt">
          Ritual Guides get the full card. <b>Panchang gets a calendar download instead.</b> Dharmic Concepts get a download or nothing. Beginner&apos;s Guides get a shopping checklist, not this.
        </p>
      </div>
    </>
  );

export default function Page() {
  const [activeTab, setActiveTab] = useState<"nav" | "ekad" | "spec">("nav");
  const [layoutMode, setLayoutMode] = useState<"a5-page" | "a4-cols" | "a4-fit">("a5-page");
  const [greyscale, setGreyscale] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="ritual-card-page">
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
            fontSize: "13px",
          }}
        >
          {toastMessage}
        </div>
      )}

      {/* Control bar */}
      <div className="ctrl-bar">
        <span className="ctrl-title">RITUAL CARD:</span>
        <button
          className={`ctrl-btn ${activeTab === "nav" ? "on" : ""}`}
          onClick={() => {
            setActiveTab("nav");
            triggerToast("Switched to Sharad Navratri Ghatasthapana Card");
          }}
        >
          Navratri
        </button>
        <button
          className={`ctrl-btn ${activeTab === "ekad" ? "on" : ""}`}
          onClick={() => {
            setActiveTab("ekad");
            triggerToast("Switched to Aja Ekadashi Vrat Card");
          }}
        >
          Aja Ekadashi
        </button>
        <button
          className={`ctrl-btn ${activeTab === "spec" ? "on" : ""}`}
          onClick={() => {
            setActiveTab("spec");
            triggerToast("Viewing Specifications");
          }}
        >
          Spec
        </button>

        <span className="ctrl-divider"></span>

        <span className="ctrl-title">LAYOUT:</span>
        <button
          className={`ctrl-btn ${layoutMode === "a5-page" ? "on" : ""}`}
          onClick={() => {
            setLayoutMode("a5-page");
            triggerToast("Switched to A5 Portrait layout");
          }}
        >
          A5 Portrait
        </button>
        <button
          className={`ctrl-btn ${layoutMode === "a4-cols" ? "on" : ""}`}
          onClick={() => {
            setLayoutMode("a4-cols");
            triggerToast("Switched to A4 Two-Column layout");
          }}
        >
          A4 Columns
        </button>
        <button
          className={`ctrl-btn ${layoutMode === "a4-fit" ? "on" : ""}`}
          onClick={() => {
            setLayoutMode("a4-fit");
            triggerToast("Switched to A4 Fit (Compact) layout");
          }}
        >
          A4 Fit
        </button>

        <span className="ctrl-divider"></span>

        <button
          className={`ctrl-btn ${greyscale ? "on" : ""}`}
          onClick={() => {
            setGreyscale(!greyscale);
            triggerToast(greyscale ? "Greyscale Proof disabled" : "Greyscale Proof enabled");
          }}
        >
          Greyscale Proof
        </button>

        <span className="ctrl-n">A4 portrait · one sheet · nothing tappable</span>
      </div>

      {/* Main Workspace Stage */}
      <div className="stage">
        {/* Render Card preview */}
        <div
          className={`sheet ${greyscale ? "grey" : ""} ${
            layoutMode === "a4-cols"
              ? "layout-a4-cols"
              : layoutMode === "a4-fit"
              ? "layout-a4-fit"
              : ""
          }`}
          id="sheet"
        >
          {activeTab === "nav" || activeTab === "spec" ? (
            <div className="c">
              <div className="c1">
                <div className="c1-top">
                  <div className="c1-mark">
                    <img src={LOGO} alt="तप्" />
                    <span className="c1-wm">the tapa company</span>
                  </div>
                  <div className="c1-cat">
                    RITUAL CARD
                    <br />
                    FESTIVE PUJANS
                  </div>
                </div>
                <div className="c1-t">
                  Sharad Navratri
                  <br />
                  Ghatasthapana
                </div>
                <p className="c1-s">Day 1 of nine · installation of the kalash and the akhand jyoti</p>
                <div className="c1-meta">
                  <span className="c1-m">
                    DATE<b>Sun 11 Oct 2026</b>
                  </span>
                  <span className="c1-m">
                    TITHI<b>Ashwin Shukla Pratipada</b>
                  </span>
                  <span className="c1-m">
                    COMPUTED FOR<b>New Delhi</b>
                  </span>
                </div>
              </div>
              <div className="cols">
                <div className={layoutMode === "a4-cols" ? "" : "full"}>
                  <div className="c2">
                    <div className="blk-l">1 · WHEN</div>
                    <div className="c2-g">
                      <div className="c2-i">
                        <div className="c2-k">MORNING — PREFERRED</div>
                        <div className="c2-v">6:19 – 10:12 AM</div>
                        <div className="c2-n">While Pratipada prevails</div>
                      </div>
                      <div className="c2-i">
                        <div className="c2-k">ABHIJIT — FALLBACK</div>
                        <div className="c2-v">11:44 – 12:31 PM</div>
                        <div className="c2-n">If the morning is missed</div>
                      </div>
                    </div>
                    <p className="c2-warn">
                      <b>Not performed after Hindu midday.</b> If both windows pass, begin the vrat the next morning — nothing is void.
                    </p>
                  </div>
                  <div className="c3">
                    <div className="blk-l">2 · WHAT YOU NEED</div>
                    <div className="c3-g">
                      <span className="c3-i">
                        <i className="c3-b"></i>
                        <span>
                          Kalash — brass or copper
                          <span className="c3-n">with mango leaves, coconut, coin, supari</span>
                        </span>
                      </span>
                      <span className="c3-i">
                        <i className="c3-b"></i>
                        <span>Clay pot, soil, barley seeds</span>
                      </span>
                      <span className="c3-i">
                        <i className="c3-b"></i>
                        <span>Red cloth and chunri</span>
                      </span>
                      <span className="c3-i">
                        <i className="c3-b"></i>
                        <span>Durga idol or framed image</span>
                      </span>
                      <span className="c3-i">
                        <i className="c3-b"></i>
                        <span>
                          Akhand jyoti vessel
                          <span className="c3-n">large enough for nine days of ghee</span>
                        </span>
                      </span>
                      <span className="c3-i">
                        <i className="c3-b"></i>
                        <span>Durga Saptashati</span>
                      </span>
                      <span className="c3-i">
                        <i className="c3-b"></i>
                        <span>Fresh flowers — daily</span>
                      </span>
                      <span className="c3-i">
                        <i className="c3-b"></i>
                        <span>Sindoor, kumkum, chandan, akshat, haldi</span>
                      </span>
                      <span className="c3-i">
                        <i className="c3-b"></i>
                        <span>Ghee, incense, camphor</span>
                      </span>
                      <span className="c3-i">
                        <i className="c3-b"></i>
                        <span>
                          Havan samagri
                          <span className="c3-n">optional — Ashtami or Navami</span>
                        </span>
                      </span>
                    </div>
                    <p className="c3-note">
                      <b>Substitutions are fine.</b> Where an item is unavailable where you live, the tradition allows for it. Nothing on this list is a condition of the vrat.
                    </p>
                  </div>
                </div>
                <div className={layoutMode === "a4-cols" ? "" : "full"}>
                  <div className="c4">
                    <div className="blk-l">3 · WHAT TO DO</div>
                    <div className="c4-i">
                      <span className="c4-n">1</span>
                      <span className="c4-t">Clean the space. Place a chowki and cover it with red cloth.</span>
                    </div>
                    <div className="c4-i">
                      <span className="c4-n">2</span>
                      <span className="c4-t">
                        <b>Kalash sthapana.</b> Fill with water, add akshat, a coin and a supari. Five or seven mango leaves at the rim, sealed with a coconut.
                      </span>
                    </div>
                    <div className="c4-i">
                      <span className="c4-n">3</span>
                      <span className="c4-t">
                        Sow barley in a clay pot of soil. Water lightly.
                        <i>Widely kept in North India — custom, not scripture</i>
                      </span>
                    </div>
                    <div className="c4-i">
                      <span className="c4-n">4</span>
                      <span className="c4-t">Place the Durga image behind the kalash and install it with prayer.</span>
                    </div>
                    <div className="c4-i">
                      <span className="c4-n">5</span>
                      <span className="c4-t">
                        <b>Light the akhand jyoti.</b> Intended to burn through the nine days. If it goes out, relight it.
                      </span>
                    </div>
                    <div className="c4-i">
                      <span className="c4-n">6</span>
                      <span className="c4-t">Offer flowers, incense and fruit. Chant Ya Devi Sarvabhuteshu, or Saptashati Chapter 1.</span>
                    </div>
                    <div className="c4-i">
                      <span className="c4-n">7</span>
                      <span className="c4-t">
                        <b>Take the sankalpa.</b> Say it in whatever language you think in.
                      </span>
                    </div>
                  </div>
                  <div className="c6">
                    <div className="blk-l">5 · FASTING — ALL THREE ARE ACCEPTED</div>
                    <div className="c6-g">
                      <div className="c6-i">
                        <div className="c6-t">All nine days</div>
                        <p className="c6-s">No grains, sendha namak only, no onion or garlic. Phalahar through the day.</p>
                      </div>
                      <div className="c6-i">
                        <div className="c6-t">Partial</div>
                        <p className="c6-s">Pratipada, Ashtami and Navami. Sattvic on the other days.</p>
                      </div>
                      <div className="c6-i">
                        <div className="c6-t">First and last</div>
                        <p className="c6-s">Day one and day nine only.</p>
                      </div>
                    </div>
                    <p className="c6-note">
                      <b>The tradition prescribes devotion, not starvation.</b> A shorter form kept sincerely fulfils the vrat.
                    </p>
                  </div>
                </div>
              </div>
              <div className="c5">
                <div className="blk-l">4 · WHAT TO SAY</div>
                <div className="c5-d">ओं ह्रीं शैलपुत्र्यै नमः</div>
                <div className="c5-r">Om Hreem Shailputryai Namah</div>
                <p className="c5-m">
                  Day one — Shailputri, daughter of the mountain. The mantra changes with the form each day; the nine are listed on the guide.
                </p>
                <div className="c5-cnt">
                  <span className="c5-ck">Mark a box for each round of 12</span>
                  <span className="c5-boxes">
                    <i></i>
                    <i></i>
                    <i></i>
                    <i></i>
                    <i></i>
                    <i></i>
                    <i></i>
                    <i></i>
                    <i></i>
                  </span>
                </div>
              </div>
              <div className="c7">
                <div className="c7-src">
                  <b>Source —</b> Devi Mahatmya, Markandeya Purana · Dharma 4/5, Puranic. Barley sowing, daily colours and day-specific offerings are Pratha — regional custom, not scriptural requirement.
                  <br />
                  <b>Timings —</b> Drik Panchang, computed for New Delhi, Purnimanta convention.
                </div>
                <div className="c7-b">
                  <div>
                    <div className="c7-tag">
                      Not fear. <em>Only devotion.</em>
                    </div>
                    <div className="c7-u">
                      Full guide, myths and corrections at
                      <br />
                      thetapaco.com/ritual-guides/sharad-navratri
                    </div>
                  </div>
                  <div className="c7-qr">
                    QR
                    <br />
                    to guide
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="c">
              <div className="c1">
                <div className="c1-top">
                  <div className="c1-mark">
                    <img src={LOGO} alt="तप्" />
                    <span className="c1-wm">the tapa company</span>
                  </div>
                  <div className="c1-cat">
                    RITUAL CARD
                    <br />
                    ALL-YEAR PUJANS
                  </div>
                </div>
                <div className="c1-t">Aja Ekadashi</div>
                <p className="c1-s">A one-day vrat · grain avoidance from sunrise to parana</p>
                <div className="c1-meta">
                  <span className="c1-m">
                    DATE<b>Tue 8 Sep 2026</b>
                  </span>
                  <span className="c1-m">
                    TITHI<b>Bhadrapada Krishna Ekadashi</b>
                  </span>
                  <span className="c1-m">
                    COMPUTED FOR<b>New Delhi</b>
                  </span>
                </div>
              </div>
              <div className="cols">
                <div className={layoutMode === "a4-cols" ? "" : "full"}>
                  <div className="c2">
                    <div className="blk-l">1 · WHEN</div>
                    <div className="c2-g">
                      <div className="c2-i">
                        <div className="c2-k">FAST BEGINS</div>
                        <div className="c2-v">Sunrise, 8 Sep</div>
                        <div className="c2-n">After the sankalpa</div>
                      </div>
                      <div className="c2-i">
                        <div className="c2-k">PARANA — 9 SEPTEMBER</div>
                        <div className="c2-v">6:02 – 8:17 AM</div>
                        <div className="c2-n">Approximately 2h 15m</div>
                      </div>
                    </div>
                    <p className="c2-warn">
                      <b>The window is the thing to set an alarm for.</b> Parana must fall after sunrise and before Dwadashi ends. Miss it and break the fast anyway — a late parana is imperfect, not void, and no penance is attached.
                    </p>
                  </div>
                  <div className="c3">
                    <div className="blk-l">2 · WHAT YOU NEED</div>
                    <div className="c3-g">
                      <span className="c3-i">
                        <i className="c3-b"></i>
                        <span>Vishnu or Krishna image</span>
                      </span>
                      <span className="c3-i">
                        <i className="c3-b"></i>
                        <span>
                          Tulsi leaves
                          <span className="c3-n">not plucked on Ekadashi itself</span>
                        </span>
                      </span>
                      <span className="c3-i">
                        <i className="c3-b"></i>
                        <span>Ghee diya and wicks</span>
                      </span>
                      <span className="c3-i">
                        <i className="c3-b"></i>
                        <span>Chandan, akshat, kumkum</span>
                      </span>
                      <span className="c3-i">
                        <i className="c3-b"></i>
                        <span>Fruit and milk for phalahar</span>
                      </span>
                      <span className="c3-i">
                        <i className="c3-b"></i>
                        <span>
                          Sendha namak
                          <span className="c3-n">if cooking during the fast</span>
                        </span>
                      </span>
                    </div>
                    <p className="c3-note">
                      <b>A short list, deliberately.</b> Ekadashi asks for restraint rather than arrangement.
                    </p>
                  </div>
                </div>
                <div className={layoutMode === "a4-cols" ? "" : "full"}>
                  <div className="c4">
                    <div className="blk-l">3 · WHAT TO DO</div>
                    <div className="c4-i">
                      <span className="c4-n">1</span>
                      <span className="c4-t">Bathe before sunrise. Take the sankalpa naming the vrat.</span>
                    </div>
                    <div className="c4-i">
                      <span className="c4-n">2</span>
                      <span className="c4-t">
                        <b>Avoid grains and pulses</b> for the whole day. Fruit, milk and water are permitted.
                        <i>Nirjala is one form some choose — it is not what the vrat asks for</i>
                      </span>
                    </div>
                    <div className="c4-i">
                      <span className="c4-n">3</span>
                      <span className="c4-t">Light a diya before Vishnu. Offer tulsi kept from the previous day.</span>
                    </div>
                    <div className="c4-i">
                      <span className="c4-n">4</span>
                      <span className="c4-t">Chant, read, or simply keep the day quieter than usual.</span>
                    </div>
                    <div className="c4-i">
                      <span className="c4-n">5</span>
                      <span className="c4-t">Stay awake into the evening if you keep that form. Many do not.</span>
                    </div>
                    <div className="c4-i">
                      <span className="c4-n">6</span>
                      <span className="c4-t">
                        <b>Break the fast inside the parana window</b> the next morning. Water first, then fruit, then a full meal.
                      </span>
                    </div>
                  </div>
                  <div className="c6">
                    <div className="blk-l">5 · WHAT COUNTS AS A GRAIN</div>
                    <div className="c6-g">
                      <div className="c6-i">
                        <div className="c6-t">Avoided</div>
                        <p className="c6-s">Rice, wheat, all pulses and lentils, semolina, besan.</p>
                      </div>
                      <div className="c6-i">
                        <div className="c6-t">Permitted</div>
                        <p className="c6-s">Kuttu, singhara, sabudana, samak. Botanically not grains.</p>
                      </div>
                      <div className="c6-i">
                        <div className="c6-t">Also permitted</div>
                        <p className="c6-s">Fruit, milk, curd, potato, sendha namak.</p>
                      </div>
                    </div>
                    <p className="c6-note">
                      <b>The rule applies to all twenty-four Ekadashis.</b> Learn it once and it holds for the year.
                    </p>
                  </div>
                </div>
              </div>
              <div className="c5">
                <div className="blk-l">4 · WHAT TO SAY</div>
                <div className="c5-d">ओं नमो भगवते वासुदेवाय</div>
                <div className="c5-r">Om Namo Bhagavate Vasudevaya</div>
                <p className="c5-m">
                  The twelve-syllable mantra. Said through the day as often as you wish — there is no required count for this vrat.
                </p>
                <div className="c5-cnt">
                  <span className="c5-ck">Mark a box for each round of 12</span>
                  <span className="c5-boxes">
                    <i></i>
                    <i></i>
                    <i></i>
                    <i></i>
                    <i></i>
                    <i></i>
                    <i></i>
                    <i></i>
                    <i></i>
                  </span>
                </div>
              </div>
              <div className="c7">
                <div className="c7-src">
                  <b>Source —</b> Padma Purana, Uttara Khanda · Dharma 4/5, Puranic. Regional variations in the permitted list are Pratha and differ between households.
                  <br />
                  <b>Timings —</b> Drik Panchang, computed for New Delhi, Purnimanta convention.
                </div>
                <div className="c7-b">
                  <div>
                    <div className="c7-tag">
                      Not fear. <em>Only devotion.</em>
                    </div>
                    <div className="c7-u">
                      Full guide, myths and corrections at
                      <br />
                      thetapaco.com/panchang/vrat/aja-ekadashi-2026
                    </div>
                  </div>
                  <div className="c7-qr">
                    QR
                    <br />
                    to guide
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Notes rendering */}
        <div className="notes" id="notes">
          {activeTab === "nav" ? navNotes : activeTab === "ekad" ? ekadNotes : specNotes}
        </div>
      </div>

      <Footer onTriggerToast={triggerToast} />
    </div>
  );
}
