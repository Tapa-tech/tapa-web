"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Loader2, Users, Send, Sparkles } from "lucide-react";

interface Subscriber {
  id: string;
  name: string;
  phone: string;
  consentGiven: boolean;
  status: "ACTIVE" | "PENDING_PAYMENT" | "EXPIRED" | "CANCELLED";
  createdAt: string;
}

interface BroadcastLog {
  id: string;
  content: string;
  createdAt: string;
  sentBy: string;
}

export default function AdminTapaCirclePage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [broadcasts, setBroadcasts] = useState<BroadcastLog[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Broadcast form states
  const [broadcastMessage, setBroadcastMessage] = useState("");
  const [sendingBroadcast, setSendingBroadcast] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  async function loadData() {
    try {
      const res = await fetch("/api/admin/tapa-circle");
      if (res.ok) {
        const data = await res.json();
        setSubscribers(data.subscribers || []);
        setBroadcasts(data.broadcasts || []);
      } else {
        throw new Error("Failed to load subscriber list");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateStatus = async (subId: string, status: string) => {
    setUpdatingId(subId);
    try {
      const res = await fetch("/api/admin/tapa-circle", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subscriberId: subId,
          status,
        }),
      });

      if (res.ok) {
        setSubscribers((prev) =>
          prev.map((s) => (s.id === subId ? { ...s, status: status as any } : s))
        );
        triggerToast("Subscriber membership status updated!");
      } else {
        const err = await res.json();
        alert(err.error || "Failed to update subscriber");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating status.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMessage.trim()) return;

    if (!confirm("Are you sure you want to broadcast this message to ALL subscribers? This simulates a push alert to all WhatsApp numbers.")) {
      return;
    }

    setSendingBroadcast(true);

    try {
      const res = await fetch("/api/admin/tapa-circle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: broadcastMessage,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        triggerToast(`Broadcast queued successfully! Mapped to ${data.count} subscribers.`);
        setBroadcastMessage("");
        
        // Reload list to see logged message
        loadData();
      } else {
        alert(data.error || "Failed to dispatch broadcast");
      }
    } catch (err) {
      console.error(err);
      alert("Error sending broadcast.");
    } finally {
      setSendingBroadcast(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-[#C82A54] animate-spin" />
        <span className="text-[#8A7A6E] mt-3 font-semibold">Loading Tapa Circle registry...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F2ECE4] pb-4 select-none">
        <div>
          <div className="flex items-center gap-2 mb-1.5 text-[10px] text-[#8A7A6E] uppercase font-bold tracking-wider">
            <Link href="/admin" className="hover:underline">Dashboard</Link>
            <span>&gt;</span>
            <span className="text-[#6A5A4E]">Tapa Circle</span>
          </div>
          <h1 className="font-serif font-bold text-3xl text-[#3A332C]">
            The Tapa Circle Registry
          </h1>
          <p className="text-xs text-[#6A5A4E] mt-1">
            Review membership subscriptions, authorize active status, and dispatch WhatsApp alerts.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">
        
        {/* Left Column: Subscribers Directory Table */}
        <div className="space-y-4">
          <h2 className="font-serif font-bold text-lg text-dark flex items-center gap-2 select-none">
            <Users size={20} className="text-[#C82A54]" />
            <span>Active Subscribers Directory ({subscribers.length})</span>
          </h2>

          {subscribers.length === 0 ? (
            <div className="text-center p-12 bg-[#FAF6EC] border border-[#EADFC9] rounded-2xl select-none">
              <span className="text-3xl block mb-2">⭐</span>
              <h3 className="font-serif font-bold text-[#3A332C]">No subscribers yet</h3>
              <p className="text-xs text-[#8A7A6E] mt-1">
                Subscribers list will populate as customers join through the landing portal.
              </p>
            </div>
          ) : (
            <div className="bg-white border border-[#EADFC9] rounded-2xl overflow-hidden shadow-sm relative">
              {updatingId && (
                <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-10">
                  <Loader2 className="w-6 h-6 text-[#C82A54] animate-spin" />
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#FAF6EC] border-b border-[#EADFC9] text-[#6A5A4E] font-bold uppercase tracking-wider">
                      <th className="p-4">Subscriber</th>
                      <th className="p-4">WhatsApp Contact</th>
                      <th className="p-4">Opt-In Date</th>
                      <th className="p-4">Consent Status</th>
                      <th className="p-4">Membership Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F2ECE4] text-[#3A332C]">
                    {subscribers.map((sub) => (
                      <tr key={sub.id} className="hover:bg-[#FAF6EC] transition-colors">
                        <td className="p-4 font-bold text-[#3A332C]">{sub.name}</td>
                        <td className="p-4 font-mono text-[#8A7A6E]">{sub.phone}</td>
                        <td className="p-4 text-[#8A7A6E]">{new Date(sub.createdAt).toLocaleDateString("en-IN")}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${sub.consentGiven ? "bg-green-50 border border-green-100 text-green-700" : "bg-red-50 border border-red-100 text-red-700"}`}>
                            {sub.consentGiven ? "Consented ✓" : "No Consent"}
                          </span>
                        </td>
                        <td className="p-4">
                          <select
                            value={sub.status}
                            onChange={(e) => handleUpdateStatus(sub.id, e.target.value)}
                            className="px-2 py-1 rounded-lg border border-[#DED6C9] focus:outline-none focus:border-[#C82A54] text-xs font-bold text-[#3A332C] bg-white transition-colors"
                          >
                            <option value="PENDING_PAYMENT">Pending Payment</option>
                            <option value="ACTIVE">Active</option>
                            <option value="EXPIRED">Expired</option>
                            <option value="CANCELLED">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Send Broadcast alerts */}
        <div className="space-y-6">
          {/* Broadcast Composer */}
          <div className="bg-card border border-[#EADFC9] rounded-2xl p-5 md:p-6 shadow-sm space-y-4">
            <h3 className="font-serif font-bold text-base text-dark border-b border-border pb-3 flex items-center gap-2 select-none">
              <Send size={16} className="text-[#C82A54]" />
              <span>WhatsApp Alert Broadcast</span>
            </h3>

            <form onSubmit={handleSendBroadcast} className="space-y-3.5 font-sans">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-[#6A5A4E] uppercase tracking-wider">Compose Message</label>
                <textarea
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                  rows={4}
                  required
                  placeholder="e.g. Sawan Shivratri Muhurata: Pooja begins tonight at 08:34 PM. Chants details inside..."
                  className="w-full px-3 py-2 rounded-xl border border-[#DED6C9] focus:outline-none focus:border-[#C82A54] text-xs text-[#3A332C] bg-white transition-colors resize-y leading-relaxed"
                />
              </div>

              <button
                type="submit"
                disabled={sendingBroadcast || !broadcastMessage.trim() || subscribers.length === 0}
                className="w-full bg-[#C82A54] hover:bg-[#B02047] disabled:bg-gray-400 text-white border-none rounded-xl py-2.5 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer select-none"
              >
                {sendingBroadcast ? (
                  <>
                    <Loader2 className="w-4.5 h-4.5 animate-spin" />
                    <span>Sending broadcast...</span>
                  </>
                ) : (
                  <>
                    <Send size={12} />
                    <span>Send to {subscribers.length} Members</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Broadcast History logs */}
          <div className="space-y-3">
            <h3 className="font-serif font-bold text-sm text-dark select-none">Broadcast Dispatch Logs</h3>
            
            {broadcasts.length === 0 ? (
              <div className="text-[10px] text-sub-text italic select-none">
                No past broadcasts recorded.
              </div>
            ) : (
              <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                {broadcasts.map((log) => (
                  <div key={log.id} className="bg-white border border-[#EADFC9]/50 rounded-xl p-3 text-[11px] font-sans">
                    <div className="flex justify-between items-center text-[9px] text-[#8A7A6E] border-b border-[#FAF6EC] pb-1.5 mb-1.5">
                      <span>By: {log.sentBy}</span>
                      <span>{new Date(log.createdAt).toLocaleDateString("en-IN")}</span>
                    </div>
                    <p className="text-sub-text leading-relaxed whitespace-pre-line">{log.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Premium Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[100] bg-dark text-white border border-white/10 px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-bounce font-sans text-xs select-none">
          <span className="w-1.5 h-1.5 rounded-full bg-pink animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
