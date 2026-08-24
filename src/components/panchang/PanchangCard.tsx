import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
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

  if (!panchang) {
    return (
      <div className="panchang-band select-none w-full animate-fadeIn">
        <div className="wrap">
          
          <div className="panch-label-col">
            <div className="panch-label-eyebrow font-sans">+ PANCHANG TODAY</div>
            <div className="panch-label-date font-sans">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </div>
            <div className="panch-label-loc font-sans text-pink font-bold">
              Panchang Pending
            </div>
          </div>

          
          <div className="flex-1 flex items-center justify-center font-sans text-dim text-xs px-4 py-6 text-center italic">
            Panchang calculations for today are currently pending. Please check back in a few minutes.
          </div>

          
          <div className="panch-next-col">
            <div className="panch-next-inner font-sans">
              <div className="panch-next-label">NEXT VRAT</div>
              <div className="panch-next-val">
                {nextVrat 
                  ? `${nextVrat.name} — ${formatVratDate(nextVrat.date)}` 
                  : "None scheduled"
                }
              </div>
            </div>
            {nextVrat && (
              <button className="panch-countdown font-sans cursor-pointer hover:opacity-95 transition-opacity">
                {calculateCountdown(nextVrat.date)}
              </button>
            )}
            <button 
              onClick={() => router.push("/panchang")}
              className="panch-full font-sans cursor-pointer hover:bg-white/15 transition-all"
            >
              Full calendar →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="panchang-band select-none w-full animate-fadeIn">
      <div className="wrap">
        
        <div className="panch-label-col">
          <div className="panch-label-eyebrow font-sans">+ PANCHANG TODAY</div>
          <div className="panch-label-date font-sans">
            {formatDate(panchang.date)}
          </div>
          <div className="panch-label-loc font-sans">
            {`${panchang.paksha} Paksha · ${panchang.city}`}
          </div>
        </div>

        
        <div className="panch-data font-sans">
          <div className="panch-cell">
            <div className="panch-key">TITHI</div>
            <div className="panch-val">{panchang.tithi}</div>
            <div className="panch-sub text-gold">{panchang.tithiSub}</div>
          </div>
          <div className="panch-cell">
            <div className="panch-key">PAKSHA</div>
            <div className="panch-val">{panchang.paksha}</div>
            <div className="panch-sub text-gold">{panchang.pakshaSub}</div>
          </div>
          <div className="panch-cell">
            <div className="panch-key">NAKSHATRA</div>
            <div className="panch-val">{panchang.nakshatra}</div>
            <div className="panch-sub text-gold">
              {panchang.nakshatraSub || "Auspicious"}
            </div>
          </div>
          <div className="panch-cell">
            <div className="panch-key">SUNRISE</div>
            <div className="panch-val">{panchang.sunrise}</div>
            <div className="panch-sub text-gold">am</div>
          </div>
        </div>

        
        <div className="panch-next-col">
          <div className="panch-next-inner font-sans">
            <div className="panch-next-label">NEXT VRAT</div>
            <div className="panch-next-val">
              {nextVrat 
                ? `${nextVrat.name} — ${formatVratDate(nextVrat.date)}` 
                : "None scheduled"
              }
            </div>
          </div>
          {nextVrat && (
            <button className="panch-countdown font-sans cursor-pointer hover:opacity-95 transition-opacity">
              {calculateCountdown(nextVrat.date)}
            </button>
          )}
          <button 
            onClick={() => router.push("/panchang")}
            className="panch-full font-sans cursor-pointer hover:bg-white/15 transition-all"
          >
            Full calendar →
          </button>
        </div>
      </div>
    </div>
  );
}

