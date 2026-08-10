"use client";

import React, { useState, useEffect } from "react";
import { ShieldAlert, Check, X, BookOpen, ThumbsUp } from "lucide-react";

interface DPBReviewItem {
  id: string;
  elementName: string;
  tag: string;
  confidenceScore: number;
  claim?: string;
  correction?: string;
  sourceOfTruth?: string;
  reviewStatus: string;
  ritualGuide: {
    title: string;
  };
}

export default function DPBReviewQueue() {
  const [reviews, setReviews] = useState<DPBReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actingId, setActingId] = useState<string | null>(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  async function fetchReviews() {
    try {
      const res = await fetch("/api/admin/dpb-review");
      if (res.ok) {
        const data = await res.json();
        setReviews(data);
      }
    } catch (e) {
      console.error("Failed to fetch pending reviews:", e);
    } finally {
      setLoading(false);
    }
  }

  const handleReviewAction = async (id: string, action: "APPROVE" | "REJECT") => {
    setActingId(id);
    try {
      const res = await fetch(`/api/admin/dpb-review/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });

      if (res.ok) {
        // Refresh list
        fetchReviews();
      } else {
        const data = await res.json();
        alert(data.error || "Review operation failed");
      }
    } catch (e) {
      console.error("Review operation error:", e);
    } finally {
      setActingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#F2ECE4] pb-4">
        <div>
          <h1 className="font-serif font-bold text-2xl text-[#3A332C]">Founder Review Queue</h1>
          <p className="text-xs text-[#8A7A6E] mt-1">
            Audit and moderate misconceptions/claims flagged as BHRANTI before they are certified as custom modifications.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="w-6 h-6 border-2 border-[#C82A54] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : reviews.length === 0 ? (
        <div className="bg-[#FDFBF7] border border-[#EADFC9] rounded-2xl p-12 text-center text-[#8A7A6E]">
          <ThumbsUp className="mx-auto text-[#D1F2E2] mb-4 stroke-[#1D8A56]" size={40} />
          <p className="font-serif font-bold text-lg text-[#3A332C]">Queue is clean!</p>
          <p className="text-xs mt-1">No pending BHRANTI claims need moderation at this moment.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((item) => (
            <div
              key={item.id}
              className="bg-white border-2 border-[#EADFC9] rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between gap-6"
            >
              <div className="space-y-4 flex-1">
                {/* Parent guide & Element info */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="flex items-center gap-1 text-xs font-bold text-[#C82A54] bg-[#FFEAEF] px-2 py-0.5 rounded-lg">
                    <ShieldAlert size={12} />
                    <span>BHRANTI</span>
                  </span>
                  <span className="text-xs font-bold text-[#8A7A6E] uppercase tracking-wider">
                    Confidence: {item.confidenceScore}
                  </span>
                  <div className="h-4 w-[1px] bg-[#EADFC9]"></div>
                  <span className="flex items-center gap-1 text-xs font-bold text-[#6A5A4E]">
                    <BookOpen size={12} />
                    <span>Guide: {item.ritualGuide?.title}</span>
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="font-serif font-bold text-lg text-[#3A332C]">
                    Element: {item.elementName}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    <div className="bg-[#FAF6EC] border border-[#EADFC9] rounded-xl p-4 space-y-1">
                      <span className="text-[10px] uppercase font-bold text-[#C82A54] tracking-wider">Myth / Claim</span>
                      <p className="text-sm text-[#3A332C] leading-relaxed">
                        {item.claim || <span className="text-[#8A7A6E] italic">None specified</span>}
                      </p>
                    </div>

                    <div className="bg-[#F2FAF6] border border-[#D1F2E2] rounded-xl p-4 space-y-1">
                      <span className="text-[10px] uppercase font-bold text-[#136C41] tracking-wider">Scriptural Correction</span>
                      <p className="text-sm text-[#3A332C] leading-relaxed">
                        {item.correction || <span className="text-[#8A7A6E] italic">None specified</span>}
                      </p>
                    </div>
                  </div>
                </div>

                {item.sourceOfTruth && (
                  <div className="text-xs text-[#8A7A6E]">
                    <span className="font-bold text-[#6A5A4E]">Sources:</span> {item.sourceOfTruth}
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex md:flex-col justify-end gap-2 border-t md:border-t-0 md:border-l border-[#F2ECE4] pt-4 md:pt-0 md:pl-6 flex-shrink-0 min-w-[140px]">
                <button
                  onClick={() => handleReviewAction(item.id, "APPROVE")}
                  disabled={actingId !== null}
                  className="flex-1 md:flex-none flex items-center justify-center gap-1.5 bg-[#1D8A56] hover:bg-[#136C41] disabled:bg-[#1D8A56]/60 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition-all shadow-sm"
                >
                  {actingId === item.id ? (
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    <Check size={14} />
                  )}
                  <span>Approve</span>
                </button>
                
                <button
                  onClick={() => handleReviewAction(item.id, "REJECT")}
                  disabled={actingId !== null}
                  className="flex-1 md:flex-none flex items-center justify-center gap-1.5 border border-[#C82A54] text-[#C82A54] hover:bg-[#FFEAEF] disabled:opacity-50 font-semibold text-xs px-4 py-2.5 rounded-xl transition-all"
                >
                  <X size={14} />
                  <span>Reject</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
