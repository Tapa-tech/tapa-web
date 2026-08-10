import React, { useState, useEffect } from "react";

interface PanchangData {
  id: string;
  date: string;
  city: string;
  tithi: string;
  tithiSub: string;
  paksha: string;
  pakshaSub: string;
  nakshatra: string;
  nakshatraSub?: string;
  sunrise: string;
  sunset?: string;
}

interface VratData {
  id: string;
  name: string;
  date: string;
  category: string;
  description?: string;
}

export default function PanchangCard() {
  const [panchang, setPanchang] = useState<PanchangData | null>(null);
  const [nextVrat, setNextVrat] = useState<VratData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPanchang() {
      try {
        const res = await fetch("/api/public/panchang");
        if (res.ok) {
          const data = await res.json();
          if (data.panchang) setPanchang(data.panchang);
          if (data.nextVrat) setNextVrat(data.nextVrat);
        }
      } catch (err) {
        console.error("Failed to load public panchang data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadPanchang();
  }, []);

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const formatVratDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", {
        weekday: "short",
        day: "numeric",
        month: "short",
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
      
      if (diffDays === 0) return "Today";
      if (diffDays === 1) return "Tomorrow";
      if (diffDays < 0) return "Passed";
      return `In ${diffDays} days`;
    } catch {
      return "In 5 days";
    }
  };

  if (loading) {
    return (
      <div className="panchang-band select-none w-full animate-pulse opacity-60">
        <div className="wrap">
          <div className="panch-label-col">
            <div className="h-4 w-32 bg-white/10 rounded mb-2" />
            <div className="h-6 w-48 bg-white/10 rounded mb-2" />
            <div className="h-4 w-40 bg-white/10 rounded" />
          </div>
          <div className="panch-data font-sans">
            <div className="panch-cell">
              <div className="h-12 bg-white/5 rounded-md" />
            </div>
            <div className="panch-cell">
              <div className="h-12 bg-white/5 rounded-md" />
            </div>
            <div className="panch-cell">
              <div className="h-12 bg-white/5 rounded-md" />
            </div>
            <div className="panch-cell">
              <div className="h-12 bg-white/5 rounded-md" />
            </div>
          </div>
          <div className="panch-next-col">
            <div className="h-12 w-48 bg-white/5 rounded-md" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="panchang-band select-none w-full animate-fadeIn">
      <div className="wrap">
        {/* Date & Location column */}
        <div className="panch-label-col">
          <div className="panch-label-eyebrow font-sans">+ PANCHANG TODAY</div>
          <div className="panch-label-date font-sans">
            {panchang ? formatDate(panchang.date) : "Wednesday, 15 July 2026"}
          </div>
          <div className="panch-label-loc font-sans">
            {panchang 
              ? `${panchang.paksha} Paksha · ${panchang.city}` 
              : "Ashadha Shukla Paksha · Delhi–NCR"
            }
          </div>
        </div>

        {/* Dynamic Panchang Data */}
        <div className="panch-data font-sans">
          <div className="panch-cell">
            <div className="panch-key">TITHI</div>
            <div className="panch-val">{panchang ? panchang.tithi : "Saptami"}</div>
            <div className="panch-sub text-gold">{panchang ? panchang.tithiSub : "7th day"}</div>
          </div>
          <div className="panch-cell">
            <div className="panch-key">PAKSHA</div>
            <div className="panch-val">{panchang ? panchang.paksha : "Shukla"}</div>
            <div className="panch-sub text-gold">{panchang ? panchang.pakshaSub : "Waxing moon"}</div>
          </div>
          <div className="panch-cell">
            <div className="panch-key">NAKSHATRA</div>
            <div className="panch-val">{panchang ? panchang.nakshatra : "Rohini"}</div>
            <div className="panch-sub text-gold">
              {panchang ? (panchang.nakshatraSub || "Auspicious") : "Auspicious"}
            </div>
          </div>
          <div className="panch-cell">
            <div className="panch-key">SUNRISE</div>
            <div className="panch-val">{panchang ? panchang.sunrise : "5:28"}</div>
            <div className="panch-sub text-gold">am</div>
          </div>
        </div>

        {/* Next Vrat and CTA column */}
        <div className="panch-next-col">
          <div className="panch-next-inner font-sans">
            <div className="panch-next-label">NEXT VRAT</div>
            <div className="panch-next-val">
              {nextVrat 
                ? `${nextVrat.name} — ${formatVratDate(nextVrat.date)}` 
                : "Sawan Somwar — Mon, 20 July"
              }
            </div>
          </div>
          <button className="panch-countdown font-sans cursor-pointer hover:opacity-95 transition-opacity">
            {nextVrat ? calculateCountdown(nextVrat.date) : "In 5 days"}
          </button>
          <button className="panch-full font-sans cursor-pointer hover:bg-white/15 transition-all">
            Full calendar →
          </button>
        </div>
      </div>
    </div>
  );
}

