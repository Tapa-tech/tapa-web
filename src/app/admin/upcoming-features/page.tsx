"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Check } from "lucide-react";

interface UpcomingFeature {
  id: string;
  key: string;
  launchLabel: string | null;
  badgeText: string | null;
  teaserTitle: string | null;
  teaserBody: string | null;
  isLive: boolean;
  updatedAt: string;
}

export default function AdminUpcomingFeatures() {
  const [features, setFeatures] = useState<UpcomingFeature[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingFeature, setEditingFeature] = useState<UpcomingFeature | null>(null);

  
  const [launchLabel, setLaunchLabel] = useState("");
  const [badgeText, setBadgeText] = useState("");
  const [teaserTitle, setTeaserTitle] = useState("");
  const [teaserBody, setTeaserBody] = useState("");
  const [isLive, setIsLive] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchFeatures();
  }, []);

  async function fetchFeatures() {
    try {
      const res = await fetch("/api/admin/upcoming-features");
      if (res.ok) {
        const data = await res.json();
        setFeatures(data);
      }
    } catch (e) {
      console.error("Failed to load upcoming features:", e);
    } finally {
      setLoading(false);
    }
  }

  const handleEditClick = (feature: UpcomingFeature) => {
    setEditingFeature(feature);
    setLaunchLabel(feature.launchLabel || "");
    setBadgeText(feature.badgeText || "");
    setTeaserTitle(feature.teaserTitle || "");
    setTeaserBody(feature.teaserBody || "");
    setIsLive(feature.isLive);
    setError("");
    setSuccess("");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFeature) return;

    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/admin/upcoming-features", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: editingFeature.key,
          launchLabel: launchLabel || null,
          badgeText: badgeText || null,
          teaserTitle: teaserTitle || null,
          teaserBody: teaserBody || null,
          isLive,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update feature metadata");
      }

      setSuccess("Metadata updated successfully!");
      await fetchFeatures();
      setEditingFeature(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  const getReadableKey = (key: string) => {
    switch (key) {
      case "ritual_kits":
        return "Ritual Kits (Gate 2)";
      case "purohit_booking":
        return "Pujan with Purohit (Gate 3)";
      case "bhajan_mandali":
        return "Bhajan Mandali (Gate 3 Extension)";
      default:
        return key;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-[#FFEAEF] flex items-center justify-center text-[#C82A54]">
          <Sparkles size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold font-serif text-[#3A332C]">Teaser Features & Badges</h1>
          <p className="text-sm text-[#8A7A6E]">Manage pre-launch copy, badges, and teaser dates for upcoming services.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 space-y-4">
          {loading ? (
            <div className="flex items-center justify-center p-12 bg-white rounded-2xl border border-[#EADFC9]">
              <div className="w-8 h-8 border-4 border-[#C82A54] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : features.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-[#EADFC9] text-[#8A7A6E]">
              No upcoming features found in the database.
            </div>
          ) : (
            features.map((feature) => (
              <div
                key={feature.id}
                onClick={() => handleEditClick(feature)}
                className={`p-6 bg-white rounded-2xl border transition-all cursor-pointer ${
                  editingFeature?.key === feature.key
                    ? "border-[#C82A54] ring-2 ring-[#C82A54]/10 shadow-md"
                    : "border-[#EADFC9] hover:border-[#C82A54] hover:shadow-sm"
                }`}
              >
                <div className="flex justify-between items-start gap-4 mb-3">
                  <div>
                    <span className="text-[10px] font-bold text-[#8A7A6E] uppercase tracking-wider bg-[#F2ECE4] px-2 py-0.5 rounded">
                      {feature.key}
                    </span>
                    <h3 className="text-lg font-bold text-[#3A332C] mt-1">
                      {getReadableKey(feature.key)}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    {feature.badgeText && (
                      <span className="text-[10px] font-bold bg-[#FFEAEF] text-[#C82A54] px-2 py-0.5 rounded-full border border-[#F0B8CC]">
                        {feature.badgeText}
                      </span>
                    )}
                    {feature.isLive ? (
                      <span className="text-[10px] font-bold bg-green-50 text-green-700 px-2 py-0.5 rounded-full border border-green-200">
                        Live
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full border border-amber-200">
                        Pre-Launch
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-[#F9F5EC] text-sm">
                  <div>
                    <div className="text-[11px] font-bold text-[#8A7A6E] uppercase">Launch Label</div>
                    <div className="text-[#3A332C] mt-0.5 font-medium">{feature.launchLabel || "Not Scheduled"}</div>
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-[#8A7A6E] uppercase">Teaser Headline</div>
                    <div className="text-[#3A332C] mt-0.5 font-medium">{feature.teaserTitle || "None"}</div>
                  </div>
                  <div className="md:col-span-2">
                    <div className="text-[11px] font-bold text-[#8A7A6E] uppercase">Teaser Body Copy</div>
                    <div className="text-[#3A332C] mt-0.5">{feature.teaserBody || "None"}</div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        
        <div className="bg-white p-6 rounded-2xl border border-[#EADFC9] h-fit">
          {editingFeature ? (
            <form onSubmit={handleSave} className="space-y-4">
              <h2 className="text-lg font-serif font-bold text-[#3A332C] pb-2 border-b border-[#F2ECE4]">
                Edit Teaser Copy
              </h2>

              {error && (
                <div className="text-xs font-semibold text-[#C82A54] bg-[#FFEAEF] p-3 rounded-xl">
                  {error}
                </div>
              )}
              {success && (
                <div className="text-xs font-semibold text-green-700 bg-green-50 p-3 rounded-xl">
                  {success}
                </div>
              )}

              <div className="space-y-1">
                <span className="text-xs font-bold text-[#8A7A6E] uppercase">Feature Key</span>
                <div className="text-sm font-semibold bg-[#F9F5EC] border border-[#EADFC9] rounded-xl px-3.5 py-2 text-[#6A5A4E]">
                  {editingFeature.key}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#8A7A6E] uppercase tracking-wider">Launch Date / Month Label</label>
                <input
                  type="text"
                  placeholder="e.g. LAUNCHING September 24th"
                  value={launchLabel}
                  onChange={(e) => setLaunchLabel(e.target.value)}
                  className="w-full text-sm bg-white border border-[#EADFC9] rounded-xl px-3.5 py-2 focus:outline-none focus:ring-1 focus:ring-[#C82A54]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#8A7A6E] uppercase tracking-wider">Tab Badge Text</label>
                <input
                  type="text"
                  placeholder="e.g. Launching soon, Coming soon"
                  value={badgeText}
                  onChange={(e) => setBadgeText(e.target.value)}
                  className="w-full text-sm bg-white border border-[#EADFC9] rounded-xl px-3.5 py-2 focus:outline-none focus:ring-1 focus:ring-[#C82A54]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#8A7A6E] uppercase tracking-wider">Teaser Title / Headline</label>
                <input
                  type="text"
                  placeholder="e.g. Complete Samagri for every puja."
                  value={teaserTitle}
                  onChange={(e) => setTeaserTitle(e.target.value)}
                  className="w-full text-sm bg-white border border-[#EADFC9] rounded-xl px-3.5 py-2 focus:outline-none focus:ring-1 focus:ring-[#C82A54]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#8A7A6E] uppercase tracking-wider">Teaser Body Text</label>
                <textarea
                  placeholder="Teaser narrative copy..."
                  value={teaserBody}
                  onChange={(e) => setTeaserBody(e.target.value)}
                  rows={3}
                  className="w-full text-sm bg-white border border-[#EADFC9] rounded-xl px-3.5 py-2 focus:outline-none focus:ring-1 focus:ring-[#C82A54] resize-none"
                />
              </div>

              <div className="flex items-center gap-2.5 py-1">
                <input
                  type="checkbox"
                  id="isLive"
                  checked={isLive}
                  onChange={(e) => setIsLive(e.target.checked)}
                  className="rounded border-[#EADFC9] text-[#C82A54] focus:ring-[#C82A54]"
                />
                <label htmlFor="isLive" className="text-xs font-bold text-[#3A332C] cursor-pointer">
                  Feature is fully LIVE (hides teaser/badges)
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-[#F2ECE4]">
                <button
                  type="button"
                  onClick={() => setEditingFeature(null)}
                  className="px-4 py-2 border border-[#EADFC9] text-[#6A5A4E] text-xs font-semibold rounded-xl hover:bg-[#F9F5EC] transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-[#C82A54] text-white text-xs font-semibold rounded-xl hover:bg-[#B02047] transition-all flex items-center gap-1.5"
                >
                  {submitting ? (
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    <Check size={14} />
                  )}
                  <span>Save Updates</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center py-12 text-[#8A7A6E] text-sm">
              Select an upcoming feature card from the left to edit its pre-launch teaser information.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
