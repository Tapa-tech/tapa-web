"use client";

import React, { useState, useEffect } from "react";

interface CategoryTabsProps {
  activeTab?: string;
}

interface FeatureMetadata {
  launchLabel?: string;
  badgeText?: string;
  isLive?: boolean;
}

export default function CategoryTabs({ activeTab = "Ritual Guides" }: CategoryTabsProps) {
  const [kitsMeta, setKitsMeta] = useState<FeatureMetadata>({ badgeText: "Launching soon" });
  const [purohitMeta, setPurohitMeta] = useState<FeatureMetadata>({ launchLabel: "(will be launched in November)" });

  useEffect(() => {
    async function loadTeasers() {
      try {
        const res = await fetch("/api/public/upcoming-features");
        if (res.ok) {
          const data = await res.json();
          if (data.ritual_kits) {
            setKitsMeta(data.ritual_kits);
          }
          if (data.purohit_booking) {
            setPurohitMeta(data.purohit_booking);
          }
        }
      } catch (err) {
        console.error("Failed to load upcoming features for tabs:", err);
      }
    }
    loadTeasers();
  }, []);

  const tabs = [
    {
      id: "Ritual Guides",
      label: "Ritual Guides",
    },
    {
      id: "Ritual Kits",
      label: "Ritual Kits",
      badge: kitsMeta.isLive ? undefined : (kitsMeta.badgeText || undefined),
    },
    {
      id: "Pujan with Purohit",
      label: "Pujan with Purohit",
      subLabel: purohitMeta.isLive ? undefined : (purohitMeta.launchLabel || undefined),
    },
    {
      id: "Panchang",
      label: "Panchang",
    },
  ];


  return (
    <nav className="border-b border-border bg-card w-full sticky top-[64px] z-50 shadow-sm overflow-x-auto scrollbar-none select-none">
      <div className="max-width-[1280px] mx-auto px-4 md:px-10 flex items-center justify-start md:justify-center gap-1 md:gap-8 h-[54px] min-w-max">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              className={`relative flex flex-col items-center justify-center px-4 h-full border-b-[3px] transition-all duration-200 cursor-pointer ${isActive
                ? "border-pink text-pink font-semibold"
                : "border-transparent text-body-text hover:text-pink"
                }`}
            >
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-sans whitespace-nowrap">{tab.label}</span>
                {tab.badge && (
                  <span className="bg-red-light text-pink text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-red-200">
                    {tab.badge}
                  </span>
                )}
              </div>
              {tab.subLabel && (
                <span className="text-[9px] text-sub-text whitespace-nowrap -mt-0.5 leading-none">
                  {tab.subLabel}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
