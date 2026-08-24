"use client";

import React from "react";
import Link from "next/link";

interface FooterProps {
  onTriggerToast: (message: string) => void;
}

export default function Footer({ onTriggerToast }: FooterProps) {
  const [features, setFeatures] = React.useState<Record<string, { launchLabel?: string | null; badgeText?: string | null; teaserTitle?: string | null; teaserBody?: string | null; isLive?: boolean }>>({});

  React.useEffect(() => {
    async function loadFeatures() {
      try {
        const res = await fetch("/api/public/upcoming-features");
        if (res.ok) {
          const data = await res.json();
          setFeatures(data);
        }
      } catch (err) {
        console.error("Failed to load upcoming features in footer:", err);
      }
    }
    loadFeatures();
  }, []);

  const triggerToast = (msg: string) => {
    onTriggerToast(msg);
  };

  return (
    <footer className="footer select-none">
      <div className="fbrand font-sans">
        <div className="flotus">
          <span className="fline"></span>
          <span className="text-pink text-[18px]">✽</span>
          <span className="fline"></span>
        </div>
        <div className="ftag font-bold text-hero-text">
          Not fear. <em className="text-pink italic font-normal">Only devotion.</em>
        </div>
        <p className="ftag-s text-sub-text leading-relaxed">
          Every ritual explained from a named source — so you know what comes from scripture, what comes from your family, and what is simply a rumour.
        </p>
        <button
          onClick={() => triggerToast("Opening TAPA editorial methodology page...")}
          className="fcta font-bold cursor-pointer hover:opacity-95 transition-opacity"
        >
          Read our editorial method ›
        </button>
      </div>

      <div className="futility">
        <div className="futility-in">
          
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const query = formData.get("q") as string;
              if (query.trim()) {
                triggerToast(`Searching for "${query}"...`);
              } else {
                triggerToast("Please enter a search term.");
              }
            }}
            className="fsearch flex-1 max-w-[440px] flex items-center gap-2 bg-white/5 border border-white/10 rounded-3xl px-[18px] py-[11px]"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#8A7A68" strokeWidth="2.2" strokeLinecap="round">
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.5-3.5" />
            </svg>
            <input
              name="q"
              type="text"
              placeholder="Search rituals, festivals, concepts…"
              className="bg-transparent border-none outline-none font-sans text-xs flex-1 text-hero-text placeholder-dim"
            />
            <button type="submit" className="fsearch-go font-sans cursor-pointer hover:opacity-95">
              Search
            </button>
          </form>

          <div className="fauth font-sans text-xs flex items-center">
            <span className="fauth-note text-dim mr-2 hidden sm:inline">Save rituals, manage reminders</span>
            <button
              onClick={() => triggerToast("Sign in portal launching soon!")}
              className="fbtn-ghost font-semibold mr-2 cursor-pointer hover:bg-white/5 transition-colors"
            >
              Sign in
            </button>
            <button
              onClick={() => triggerToast("Account creation portal launching soon!")}
              className="fbtn-solid font-bold cursor-pointer hover:opacity-95 transition-opacity"
            >
              Create account
            </button>
          </div>
        </div>
      </div>

      <div className="wrap">
        <div className="sitemap">
          <div className="sm-h font-sans font-bold text-gold tracking-wider">BROWSE BY CATEGORY</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 font-sans">
            <div>
              <div className="sm-cat-t text-hero-text font-bold">Ritual Guides</div>
              <span onClick={() => triggerToast("Opening Beginner's Guides...")} className="sm-sub lead cursor-pointer hover:underline">Beginner&apos;s Guides</span>
              <span onClick={() => triggerToast("Opening Festive Pujans...")} className="sm-sub cursor-pointer hover:text-white transition-colors">Festive Pujans</span>
              <span onClick={() => triggerToast("Opening All-Year Pujans...")} className="sm-sub cursor-pointer hover:text-white transition-colors">All-Year Pujans</span>
              <span onClick={() => triggerToast("Opening Navagraha Pujans...")} className="sm-sub cursor-pointer hover:text-white transition-colors">Navagraha Pujans</span>
              <span onClick={() => triggerToast("Opening All Ritual Guides...")} className="sm-all cursor-pointer hover:underline">All Ritual Guides ›</span>
            </div>
            <div>
              <div className="sm-cat-t text-hero-text font-bold">Panchang</div>
              <span onClick={() => triggerToast("Opening Today's Panchang...")} className="sm-sub cursor-pointer hover:text-white transition-colors">Today&apos;s Panchang</span>
              <span onClick={() => triggerToast("Opening 2026 Vrat Calendar...")} className="sm-sub cursor-pointer hover:text-white transition-colors">2026 Vrat Calendar</span>
              <span onClick={() => triggerToast("Opening Eclipse & Grahan...")} className="sm-sub cursor-pointer hover:text-white transition-colors">Eclipse &amp; Grahan</span>
              <span onClick={() => triggerToast("Opening Festival Calendar...")} className="sm-sub cursor-pointer hover:text-white transition-colors">Festival Calendar</span>
              <span onClick={() => triggerToast("Opening All Panchang...")} className="sm-all cursor-pointer hover:underline">All Panchang ›</span>
            </div>
            <div>
              <div className="sm-cat-t text-hero-text font-bold">Dharmic Concepts</div>
              <span onClick={() => triggerToast("Opening Materials...")} className="sm-sub cursor-pointer hover:text-white transition-colors">Materials</span>
              <span onClick={() => triggerToast("Opening Practices...")} className="sm-sub cursor-pointer hover:text-white transition-colors">Practices</span>
              <span onClick={() => triggerToast("Opening Ideas...")} className="sm-sub cursor-pointer hover:text-white transition-colors">Ideas</span>
              <span onClick={() => triggerToast("Opening All Concepts...")} className="sm-all cursor-pointer hover:underline">All Concepts ›</span>
            </div>
            <div></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-6 pt-6 border-t border-dashed border-white/10 font-sans">
            <div className="sm-cat locked">
              <div className="sm-cat-t font-bold text-hero-text">Ritual Kits</div>
              <span className="sm-when">
                {features.ritual_kits?.launchLabel || "Opening October 2026"}
              </span>
              <span className="sm-when-s">
                {features.ritual_kits?.teaserBody || "Samagri kits for every ritual guide, delivered before the date."}
              </span>
            </div>
            <div className="sm-cat locked">
              <div className="sm-cat-t font-bold text-hero-text">Purohit &amp; Puja</div>
              <span className="sm-when">
                {features.purohit_booking?.launchLabel || "Opening November 2026"}
              </span>
              <span className="sm-when-s">
                Book a verified purohit.{" "}
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    triggerToast("Purohit network registration starting soon!");
                  }}
                  className="text-pink font-semibold hover:underline"
                >
                  Join the network ›
                </a>
              </span>
            </div>
            <div className="sm-cat locked">
              <div className="sm-cat-t font-bold text-hero-text">Bhajan Mandali</div>
              <span className="sm-when">
                {features.bhajan_mandali?.launchLabel || "Coming soon"}
              </span>
              <span className="sm-when-s">
                {features.bhajan_mandali?.teaserBody || "Sundarkand, Mata Ki Chowki, Shyam Darbaar and more."}
              </span>
            </div>
            <div></div>
          </div>
        </div>
      </div>

      <div className="wrap">
        <div className="fnav font-sans text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <div className="fcol-label font-bold text-gold">ABOUT</div>
              <span onClick={() => triggerToast("Navigating to Why TAPA...")} className="flink cursor-pointer hover:text-white transition-colors">Why तप्</span>
              <span onClick={() => triggerToast("Navigating to Our Editorial Method...")} className="flink cursor-pointer hover:text-white transition-colors">Our Editorial Method</span>
              <span onClick={() => triggerToast("Navigating to Scripture References...")} className="flink cursor-pointer hover:text-white transition-colors">Scripture References</span>
              <span onClick={() => triggerToast("The Tapa Circle subscription opening soon!")} className="flink cursor-pointer hover:text-white transition-colors">
                The Tapa Circle <span className="tagpaid">SOON</span>
              </span>
              <span onClick={() => triggerToast("Registering Purohits...")} className="flink cursor-pointer hover:text-white transition-colors">Join Purohit Network</span>
              <span className="flink locked">For Retailers</span>
              <span className="flink locked">Bulk &amp; Corporate Orders</span>
            </div>
            <div>
              <div className="fcol-label font-bold text-gold">HELP</div>
              <span className="flink locked">Track Your Order</span>
              <span className="flink locked">Shipping &amp; Delivery</span>
              <span className="flink locked">Returns &amp; Refunds</span>
              <span className="flink locked">Cancellations</span>
              <span className="flink locked">Payment &amp; COD</span>
              <span onClick={() => triggerToast("Navigating to FAQs...")} className="flink cursor-pointer hover:text-white transition-colors">FAQs</span>
              <span onClick={() => triggerToast("Contacting Support...")} className="flink cursor-pointer hover:text-white transition-colors">Contact Support</span>
            </div>
            <div>
              <div className="fcol-label font-bold text-gold">FOR YOU</div>
              <Link href="/account" className="flink hover:text-white transition-colors">My Account</Link>
              <Link href="/account" className="flink hover:text-white transition-colors">Saved Rituals</Link>
              <span className="flink locked">Order History</span>
              <span onClick={() => triggerToast("Opening My Reminders...")} className="flink cursor-pointer hover:text-white transition-colors">My Reminders</span>
              <span onClick={() => triggerToast("Opening Notification Preferences...")} className="flink cursor-pointer hover:text-white transition-colors">Notification Preferences</span>
              <span onClick={() => triggerToast("Switching language...")} className="flink cursor-pointer hover:text-white transition-colors">English / हिंदी</span>
            </div>
            <div>
              <div className="fcol-label font-bold text-gold">CONNECT</div>
              <div className="connect-sub text-dim">GET IN TOUCH</div>
              <a
                href="https://wa.me/9100000000"
                target="_blank"
                rel="noreferrer"
                className="creach"
              >
                <span className="creach-ico wa">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#25D366">
                    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.96L2 22l5.25-1.38a9.9 9.9 0 004.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2z" />
                  </svg>
                </span>
                <span>
                  <span className="creach-t">Chat on WhatsApp</span>
                  <span className="creach-s text-dim">Support · Mon–Sat, 10am–7pm IST</span>
                </span>
              </a>
              <a href="mailto:hello@thetapaco.com" className="creach">
                <span className="creach-ico mail">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#C4A882" strokeWidth="1.8">
                    <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" />
                    <path d="M3 7l9 6 9-6" />
                  </svg>
                </span>
                <span>
                  <span className="creach-t">Email us</span>
                  <span className="creach-s text-dim">hello@thetapaco.com</span>
                </span>
              </a>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  triggerToast("Contact form popup opens soon!");
                }}
                className="creach"
              >
                <span className="creach-ico form">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#C4A882" strokeWidth="1.8" strokeLinecap="round">
                    <rect x="4" y="3" width="16" height="18" rx="2.5" />
                    <path d="M8 8h8M8 12h8M8 16h4" />
                  </svg>
                </span>
                <span>
                  <span className="creach-t">Contact form</span>
                  <span className="creach-s text-dim">Partnerships, press, everything else</span>
                </span>
              </a>
              <div className="connect-sub second text-dim">FOLLOW</div>
              <div className="socrow">
                <span
                  onClick={() => triggerToast("Opening Instagram...")}
                  className="soc cursor-pointer hover:bg-white/10 transition-colors"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C4A882" strokeWidth="1.8">
                    <rect x="2.8" y="2.8" width="18.4" height="18.4" rx="5.2" />
                    <circle cx="12" cy="12" r="4.2" />
                    <circle cx="17.4" cy="6.6" r="1.15" fill="#C4A882" stroke="none" />
                  </svg>
                </span>
                <span
                  onClick={() => triggerToast("Opening Facebook...")}
                  className="soc cursor-pointer hover:bg-white/10 transition-colors"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#C4A882">
                    <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.52 1.49-3.91 3.77-3.91 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.89h2.78l-.44 2.91h-2.34V22c4.78-.76 8.44-4.92 8.44-9.94z" />
                  </svg>
                </span>
                <span
                  onClick={() => triggerToast("Opening LinkedIn...")}
                  className="soc cursor-pointer hover:bg-white/10 transition-colors"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#C4A882">
                    <path d="M6.94 5.5a2 2 0 11-4 0 2 2 0 014 0zM3.2 8.9h3.5V21H3.2V8.9zm5.7 0h3.35v1.65h.05c.47-.85 1.6-1.75 3.3-1.75 3.53 0 4.18 2.2 4.18 5.07V21h-3.5v-5.42c0-1.29-.02-2.96-1.85-2.96-1.85 0-2.13 1.4-2.13 2.86V21H8.9V8.9z" />
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="wrap">
        <div className="flegal font-sans text-xs">
          <div className="legal-policies">
            <span onClick={() => triggerToast("Opening Terms of Use...")} className="legal-link cursor-pointer hover:text-white transition-colors">Terms of Use</span>
            <span onClick={() => triggerToast("Opening Privacy Policy...")} className="legal-link cursor-pointer hover:text-white transition-colors">Privacy Policy</span>
            <span onClick={() => triggerToast("Opening Grievance Redressal...")} className="legal-link cursor-pointer hover:text-white transition-colors">Grievance Redressal</span>
            <span onClick={() => triggerToast("Opening Sitemap...")} className="legal-link cursor-pointer hover:text-white transition-colors">Sitemap</span>
          </div>
          <div>
            <div className="legal-b text-dim font-bold mt-4">GRIEVANCE OFFICER</div>
            <p className="legal-t text-sub-text leading-relaxed mt-1">
              <b className="text-hero-text">Komal Gupta</b>, Grievance Officer
              <br />
              komal.gupta@thetapaco.com · +91 99999 99999
              <br />
              Response within 48 hours.
            </p>
          </div>
          <div className="copyline w-full">
            <div className="copy-mark">
              
              <span className="text-[20px] font-serif font-bold text-amber mr-2">तप</span>
              <span className="copy-l text-sub-text font-sans">
                © 2026 <b className="text-hero-text">Tale Scale Networks Private Limited</b>. All rights reserved.
              </span>
            </div>
            <span className="copy-r text-dimmer font-sans">
              Panchang data: Drik Panchang · Delhi-NCR · Purnimanta
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
