import React from "react";

export default function PanchangCard() {
  return (
    <div className="panchang-band select-none w-full">
      <div className="wrap flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 lg:gap-8">
        {/* Date & Location column */}
        <div className="panch-label-col">
          <div className="panch-label-eyebrow font-sans">+ PANCHANG TODAY</div>
          <div className="panch-label-date font-sans">{`Wednesday, 15 July 2026`}</div>
          <div className="panch-label-loc font-sans">{`Ashadha Shukla Paksha · Delhi–NCR`}</div>
        </div>

        {/* Dynamic Panchang Data */}
        <div className="panch-data font-sans grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-4 flex-1">
          <div className="panch-cell">
            <div className="panch-key">TITHI</div>
            <div className="panch-val">Saptami</div>
            <div className="panch-sub text-gold">7th day</div>
          </div>
          <div className="panch-cell">
            <div className="panch-key">PAKSHA</div>
            <div className="panch-val">Shukla</div>
            <div className="panch-sub text-gold">Waxing moon</div>
          </div>
          <div className="panch-cell">
            <div className="panch-key">NAKSHATRA</div>
            <div className="panch-val">Rohini</div>
            <div className="panch-sub text-gold">Auspicious</div>
          </div>
          <div className="panch-cell">
            <div className="panch-key">SUNRISE</div>
            <div className="panch-val">5:28</div>
            <div className="panch-sub text-gold">am</div>
          </div>
        </div>

        {/* Next Vrat and CTA column */}
        <div className="panch-next-col flex flex-row lg:flex-col items-center lg:items-stretch justify-between gap-3">
          <div className="panch-next-inner font-sans">
            <div className="panch-next-label">NEXT VRAT</div>
            <div className="panch-next-val">Sawan Somwar — Mon, 20 July</div>
          </div>
          <button className="panch-countdown font-sans cursor-pointer hover:opacity-95 transition-opacity">
            In 5 days
          </button>
          <button className="panch-full font-sans cursor-pointer hover:bg-white/15 transition-all">
            Full calendar →
          </button>
        </div>
      </div>
    </div>
  );
}
