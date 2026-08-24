import React from "react";

export default function TrustBadgeStrip() {
  const badges = [
    { text: "Scripturally sourced", emoji: "📜" },
    { text: "Region aware", emoji: "🌍" },
    { text: "Fear-free", emoji: "🕊️" },
    { text: "Shraddha-first", emoji: "🙏" },
  ];

  return (
    <div className="trust-badges select-none font-sans flex flex-wrap lg:flex-nowrap justify-between gap-3 lg:gap-0">
      {badges.map((badge, idx) => (
        <span key={idx} className="trust-badge whitespace-nowrap">
          <span className="mr-1">{badge.emoji}</span> {badge.text}
        </span>
      ))}
    </div>
  );
}
