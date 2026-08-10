"use client";

import React, { useState, useEffect } from "react";
import { Plus, Calendar, Upload, Trash, Edit, RefreshCw, X } from "lucide-react";

interface PanchangEntry {
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

interface VratEntry {
  id: string;
  name: string;
  date: string;
  category: string;
  description?: string;
  linkedGuideId?: string;
}

interface RitualGuideStub {
  id: string;
  title: string;
}

export default function PanchangAdmin() {
  const [activeSubTab, setActiveSubTab] = useState<"panchang" | "bulk" | "vrats">("panchang");
  
  // Lists
  const [panchangEntries, setPanchangEntries] = useState<PanchangEntry[]>([]);
  const [vratEntries, setVratEntries] = useState<VratEntry[]>([]);
  const [guides, setGuides] = useState<RitualGuideStub[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Panchang Form Modal State
  const [isPanchangOpen, setIsPanchangOpen] = useState(false);
  const [editingPanchangId, setEditingPanchangId] = useState<string | null>(null);
  const [pDate, setPDate] = useState("");
  const [pCity, setPCity] = useState("Delhi-NCR");
  const [pTithi, setPTithi] = useState("");
  const [pTithiSub, setPTithiSub] = useState("");
  const [pPaksha, setPPaksha] = useState("Shukla");
  const [pPakshaSub, setPPakshaSub] = useState("Waxing moon");
  const [pNakshatra, setPNakshatra] = useState("");
  const [pNakshatraSub, setPNakshatraSub] = useState("");
  const [pSunrise, setPSunrise] = useState("05:30");
  const [pSunset, setPSunset] = useState("19:00");

  // Vrat Form Modal State
  const [isVratOpen, setIsVratOpen] = useState(false);
  const [editingVratId, setEditingVratId] = useState<string | null>(null);
  const [vName, setVName] = useState("");
  const [vDate, setVDate] = useState("");
  const [vCategory, setVCategory] = useState("Ekadashi");
  const [vDescription, setVDescription] = useState("");
  const [vLinkedGuideId, setVLinkedGuideId] = useState("");

  // Bulk Load State
  const [csvContent, setCsvContent] = useState("");
  const [submittingBulk, setSubmittingBulk] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      const [panchangRes, vratRes, guidesRes] = await Promise.all([
        fetch("/api/admin/panchang"),
        fetch("/api/admin/panchang/vrat"),
        fetch("/api/admin/ritual-guides"),
      ]);

      if (panchangRes.ok) setPanchangEntries(await panchangRes.json());
      if (vratRes.ok) setVratEntries(await vratRes.json());
      if (guidesRes.ok) setGuides(await guidesRes.json());
    } catch (e) {
      console.error("Failed to load calendar data:", e);
    } finally {
      setLoading(false);
    }
  }

  // --- Daily Panchang Logic ---
  const resetPanchangForm = () => {
    setEditingPanchangId(null);
    setPDate("");
    setPCity("Delhi-NCR");
    setPTithi("");
    setPTithiSub("");
    setPPaksha("Shukla");
    setPPakshaSub("Waxing moon");
    setPNakshatra("");
    setPNakshatraSub("");
    setPSunrise("05:30");
    setPSunset("19:00");
    setError("");
    setIsPanchangOpen(false);
  };

  const handleEditPanchang = (entry: PanchangEntry) => {
    setEditingPanchangId(entry.id);
    setPDate(entry.date.substring(0, 10));
    setPCity(entry.city);
    setPTithi(entry.tithi);
    setPTithiSub(entry.tithiSub);
    setPPaksha(entry.paksha);
    setPPakshaSub(entry.pakshaSub);
    setPNakshatra(entry.nakshatra);
    setPNakshatraSub(entry.nakshatraSub || "");
    setPSunrise(entry.sunrise);
    setPSunset(entry.sunset || "");
    setIsPanchangOpen(true);
  };

  const handleSavePanchang = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pDate || !pTithi || !pTithiSub || !pNakshatra || !pSunrise) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      const url = editingPanchangId ? `/api/admin/panchang/${editingPanchangId}` : "/api/admin/panchang";
      const method = editingPanchangId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: pDate,
          city: pCity,
          tithi: pTithi,
          tithiSub: pTithiSub,
          paksha: pPaksha,
          pakshaSub: pPakshaSub,
          nakshatra: pNakshatra,
          nakshatraSub: pNakshatraSub || null,
          sunrise: pSunrise,
          sunset: pSunset || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");

      setSuccess("Panchang entry saved successfully.");
      resetPanchangForm();
      fetchData();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const handleDeletePanchang = async (id: string) => {
    if (!confirm("Are you sure you want to delete this Panchang entry?")) return;
    try {
      const res = await fetch(`/api/admin/panchang/${id}`, { method: "DELETE" });
      if (res.ok) fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  // --- Vrat Calendar Logic ---
  const resetVratForm = () => {
    setEditingVratId(null);
    setVName("");
    setVDate("");
    setVCategory("Ekadashi");
    setVDescription("");
    setVLinkedGuideId("");
    setError("");
    setIsVratOpen(false);
  };

  const handleEditVrat = (vrat: VratEntry) => {
    setEditingVratId(vrat.id);
    setVName(vrat.name);
    setVDate(vrat.date.substring(0, 10));
    setVCategory(vrat.category);
    setVDescription(vrat.description || "");
    setVLinkedGuideId(vrat.linkedGuideId || "");
    setIsVratOpen(true);
  };

  const handleSaveVrat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vName || !vDate || !vCategory) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      const url = editingVratId ? `/api/admin/panchang/vrat/${editingVratId}` : "/api/admin/panchang/vrat";
      const method = editingVratId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: vName,
          date: vDate,
          category: vCategory,
          description: vDescription || null,
          linkedGuideId: vLinkedGuideId || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");

      setSuccess("Vrat calendar entry saved successfully.");
      resetVratForm();
      fetchData();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const handleDeleteVrat = async (id: string) => {
    if (!confirm("Are you sure you want to delete this Vrat entry?")) return;
    try {
      const res = await fetch(`/api/admin/panchang/vrat/${id}`, { method: "DELETE" });
      if (res.ok) fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  // --- Bulk Load Parser Logic ---
  const handleBulkLoad = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!csvContent.trim()) {
      setError("Please copy-paste CSV rows to upload.");
      return;
    }

    setSubmittingBulk(true);
    setError("");
    setSuccess("");

    try {
      // Custom client-side CSV parser
      const lines = csvContent.split("\n");
      const headers = lines[0].split(",").map((h) => h.trim());
      const data: {
        date: string;
        city: string;
        tithi: string;
        tithiSub: string;
        paksha: string;
        pakshaSub: string;
        nakshatra: string;
        nakshatraSub: string | null;
        sunrise: string;
        sunset: string | null;
      }[] = [];

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const cols = line.split(",").map((c) => c.trim());
        const item: Record<string, string> = {};
        headers.forEach((header, idx) => {
          item[header] = cols[idx] || "";
        });

        // Ensure mandatory properties
        if (!item.date || !item.tithi || !item.tithiSub || !item.nakshatra) {
          throw new Error(`Row ${i + 1} is missing mandatory properties.`);
        }

        data.push({
          date: item.date,
          city: item.city || "Delhi-NCR",
          tithi: item.tithi,
          tithiSub: item.tithiSub,
          paksha: item.paksha || "Shukla",
          pakshaSub: item.pakshaSub || "Waxing moon",
          nakshatra: item.nakshatra,
          nakshatraSub: item.nakshatraSub || null,
          sunrise: item.sunrise || "05:30",
          sunset: item.sunset || null,
        });
      }

      const res = await fetch("/api/admin/panchang/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error || "Bulk upload failed");

      setSuccess(resData.message || "Bulk loading complete!");
      setCsvContent("");
      fetchData();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error parsing CSV");
    } finally {
      setSubmittingBulk(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#F2ECE4] pb-4">
        <div>
          <h1 className="font-serif font-bold text-2xl text-[#3A332C]">Panchang & Calendar</h1>
          <p className="text-xs text-[#8A7A6E] mt-1">
            Maintain daily astrological variables and vrat notifications. Supports individual inputs and bulk csv loads.
          </p>
        </div>
        <div className="flex gap-2">
          {activeSubTab === "panchang" && (
            <button
              onClick={() => {
                resetPanchangForm();
                setIsPanchangOpen(true);
              }}
              className="flex items-center gap-2 bg-[#C82A54] hover:bg-[#B02047] text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-sm transition-all"
            >
              <Plus size={14} />
              <span>Add Entry</span>
            </button>
          )}
          {activeSubTab === "vrats" && (
            <button
              onClick={() => {
                resetVratForm();
                setIsVratOpen(true);
              }}
              className="flex items-center gap-2 bg-[#C82A54] hover:bg-[#B02047] text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-sm transition-all"
            >
              <Plus size={14} />
              <span>Add Vrat Notification</span>
            </button>
          )}
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex border-b border-[#EADFC9] gap-1">
        <button
          onClick={() => setActiveSubTab("panchang")}
          className={`px-4 py-2 font-semibold text-xs border-b-2 transition-all ${
            activeSubTab === "panchang"
              ? "border-[#C82A54] text-[#C82A54]"
              : "border-transparent text-[#8A7A6E] hover:text-[#3A332C]"
          }`}
        >
          Daily Panchang Entries
        </button>
        <button
          onClick={() => setActiveSubTab("bulk")}
          className={`px-4 py-2 font-semibold text-xs border-b-2 transition-all ${
            activeSubTab === "bulk"
              ? "border-[#C82A54] text-[#C82A54]"
              : "border-transparent text-[#8A7A6E] hover:text-[#3A332C]"
          }`}
        >
          Bulk Load CSV
        </button>
        <button
          onClick={() => setActiveSubTab("vrats")}
          className={`px-4 py-2 font-semibold text-xs border-b-2 transition-all ${
            activeSubTab === "vrats"
              ? "border-[#C82A54] text-[#C82A54]"
              : "border-transparent text-[#8A7A6E] hover:text-[#3A332C]"
          }`}
        >
          Vrat Calendar
        </button>
      </div>

      {error && (
        <div className="text-xs font-semibold text-[#C82A54] bg-[#FFEAEF] p-4 rounded-2xl">
          {error}
        </div>
      )}

      {success && (
        <div className="text-xs font-semibold text-[#1D8A56] bg-[#E2F7EE] p-4 rounded-2xl">
          {success}
        </div>
      )}

      {/* --- Sub Tab 1: Daily Panchang Entries --- */}
      {activeSubTab === "panchang" && (
        <>
          {/* Panchang Entry Form Dialog */}
          {isPanchangOpen && (
            <div className="bg-white border border-[#EADFC9] rounded-2xl p-6 shadow-sm animate-slideDown max-w-2xl">
              <div className="flex items-center justify-between border-b border-[#F2ECE4] pb-3 mb-4">
                <h3 className="font-serif font-bold text-lg text-[#3A332C]">
                  {editingPanchangId ? "Edit Panchang Entry" : "Create Panchang Entry"}
                </h3>
                <button onClick={resetPanchangForm} className="text-[#8A7A6E] hover:text-[#3A332C]">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSavePanchang} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#8A7A6E] uppercase tracking-wider">Date *</label>
                  <input
                    type="date"
                    value={pDate}
                    onChange={(e) => setPDate(e.target.value)}
                    className="w-full text-sm bg-white border border-[#EADFC9] rounded-xl px-3.5 py-2 focus:outline-none focus:ring-1 focus:ring-[#C82A54]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#8A7A6E] uppercase tracking-wider">City Location *</label>
                  <input
                    type="text"
                    value={pCity}
                    onChange={(e) => setPCity(e.target.value)}
                    className="w-full text-sm bg-white border border-[#EADFC9] rounded-xl px-3.5 py-2 focus:outline-none focus:ring-1 focus:ring-[#C82A54]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#8A7A6E] uppercase tracking-wider">Tithi *</label>
                  <input
                    type="text"
                    placeholder="e.g. Saptami"
                    value={pTithi}
                    onChange={(e) => setPTithi(e.target.value)}
                    className="w-full text-sm bg-white border border-[#EADFC9] rounded-xl px-3.5 py-2 focus:outline-none focus:ring-1 focus:ring-[#C82A54]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#8A7A6E] uppercase tracking-wider">Tithi Detail *</label>
                  <input
                    type="text"
                    placeholder="e.g. 7th day of Ashadha"
                    value={pTithiSub}
                    onChange={(e) => setPTithiSub(e.target.value)}
                    className="w-full text-sm bg-white border border-[#EADFC9] rounded-xl px-3.5 py-2 focus:outline-none focus:ring-1 focus:ring-[#C82A54]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#8A7A6E] uppercase tracking-wider">Paksha *</label>
                  <select
                    value={pPaksha}
                    onChange={(e) => setPPaksha(e.target.value)}
                    className="w-full text-sm bg-white border border-[#EADFC9] rounded-xl px-3.5 py-2 focus:outline-none focus:ring-1 focus:ring-[#C82A54]"
                  >
                    <option value="Shukla">Shukla</option>
                    <option value="Krishna">Krishna</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#8A7A6E] uppercase tracking-wider">Paksha Detail *</label>
                  <input
                    type="text"
                    placeholder="e.g. Waxing Moon"
                    value={pPakshaSub}
                    onChange={(e) => setPPakshaSub(e.target.value)}
                    className="w-full text-sm bg-white border border-[#EADFC9] rounded-xl px-3.5 py-2 focus:outline-none focus:ring-1 focus:ring-[#C82A54]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#8A7A6E] uppercase tracking-wider">Nakshatra *</label>
                  <input
                    type="text"
                    placeholder="e.g. Hasta"
                    value={pNakshatra}
                    onChange={(e) => setPNakshatra(e.target.value)}
                    className="w-full text-sm bg-white border border-[#EADFC9] rounded-xl px-3.5 py-2 focus:outline-none focus:ring-1 focus:ring-[#C82A54]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#8A7A6E] uppercase tracking-wider">Nakshatra Detail</label>
                  <input
                    type="text"
                    placeholder="e.g. Auspicious (Optional)"
                    value={pNakshatraSub}
                    onChange={(e) => setPNakshatraSub(e.target.value)}
                    className="w-full text-sm bg-white border border-[#EADFC9] rounded-xl px-3.5 py-2 focus:outline-none focus:ring-1 focus:ring-[#C82A54]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#8A7A6E] uppercase tracking-wider">Sunrise *</label>
                  <input
                    type="text"
                    placeholder="e.g. 05:28"
                    value={pSunrise}
                    onChange={(e) => setPSunrise(e.target.value)}
                    className="w-full text-sm bg-white border border-[#EADFC9] rounded-xl px-3.5 py-2 focus:outline-none focus:ring-1 focus:ring-[#C82A54]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#8A7A6E] uppercase tracking-wider">Sunset</label>
                  <input
                    type="text"
                    placeholder="e.g. 19:05"
                    value={pSunset}
                    onChange={(e) => setPSunset(e.target.value)}
                    className="w-full text-sm bg-white border border-[#EADFC9] rounded-xl px-3.5 py-2 focus:outline-none focus:ring-1 focus:ring-[#C82A54]"
                  />
                </div>

                <div className="col-span-1 md:col-span-2 flex justify-end gap-2 pt-2 border-t border-[#F2ECE4]">
                  <button
                    type="button"
                    onClick={resetPanchangForm}
                    className="px-4 py-2 border border-[#EADFC9] text-[#6A5A4E] text-xs font-semibold rounded-xl hover:bg-[#F9F5EC] transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#C82A54] text-white text-xs font-semibold rounded-xl hover:bg-[#B02047] transition-all"
                  >
                    Save Entry
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Panchang list */}
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="w-6 h-6 border-2 border-[#C82A54] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : panchangEntries.length === 0 ? (
            <div className="bg-white border border-[#EADFC9] rounded-2xl p-12 text-center text-[#8A7A6E]">
              <Calendar className="mx-auto text-[#EADFC9] mb-4" size={40} />
              <p className="font-semibold text-base">No panchang entries found</p>
              <p className="text-xs mt-1">Create entries or use bulk load mode to initialize calendar days.</p>
            </div>
          ) : (
            <div className="bg-white border border-[#EADFC9] rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#FDFBF7] border-b border-[#EADFC9] text-[10px] font-bold text-[#8A7A6E] uppercase tracking-wider">
                    <th className="p-4">Date</th>
                    <th className="p-4">Tithi / Detail</th>
                    <th className="p-4">Paksha</th>
                    <th className="p-4">Nakshatra</th>
                    <th className="p-4">Timings (SR/SS)</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-[#F2ECE4]">
                  {panchangEntries.map((item) => (
                    <tr key={item.id} className="hover:bg-[#FDFBF7]/40 transition-colors">
                      <td className="p-4 font-bold text-[#3A332C]">
                        {new Date(item.date).toLocaleDateString("en-IN", { timeZone: "UTC" })}
                      </td>
                      <td className="p-4">
                        <div className="font-semibold">{item.tithi}</div>
                        <div className="text-xs text-[#8A7A6E]">{item.tithiSub}</div>
                      </td>
                      <td className="p-4">
                        <div>{item.paksha}</div>
                        <div className="text-xs text-[#8A7A6E]">{item.pakshaSub}</div>
                      </td>
                      <td className="p-4">
                        <div>{item.nakshatra}</div>
                        {item.nakshatraSub && (
                          <span className="text-[9px] font-bold bg-[#E2F7EE] text-[#136C41] border border-[#D1F2E2] px-1.5 py-0.5 rounded-full uppercase tracking-wider mt-0.5 inline-block">
                            {item.nakshatraSub}
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-xs text-[#6A5A4E]">
                        <div>🌅 {item.sunrise}</div>
                        {item.sunset && <div>🌇 {item.sunset}</div>}
                      </td>
                      <td className="p-4 text-right space-x-2 whitespace-nowrap">
                        <button
                          onClick={() => handleEditPanchang(item)}
                          className="inline-flex items-center gap-1 px-2 py-1 text-xs border border-[#EADFC9] text-[#6A5A4E] hover:bg-[#F9F5EC] rounded-lg"
                        >
                          <Edit size={12} />
                        </button>
                        <button
                          onClick={() => handleDeletePanchang(item.id)}
                          className="inline-flex items-center gap-1 px-2 py-1 text-xs border border-[#FFEAEF] text-[#C82A54] hover:bg-[#FFEAEF] rounded-lg"
                        >
                          <Trash size={12} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* --- Sub Tab 2: Bulk Importer --- */}
      {activeSubTab === "bulk" && (
        <div className="bg-white border border-[#EADFC9] rounded-2xl p-6 shadow-sm">
          <h3 className="font-serif font-bold text-lg text-[#3A332C] border-b border-[#F2ECE4] pb-2 mb-4 flex items-center gap-2">
            <Upload size={18} className="text-[#C82A54]" />
            <span>Panchang Bulk CSV Importer</span>
          </h3>

          <div className="text-xs text-[#8A7A6E] bg-[#FDFBF7] border border-[#EADFC9] p-4 rounded-xl space-y-2 mb-4 leading-relaxed">
            <p className="font-bold text-[#3A332C]">Format expectation:</p>
            <p>
              Copy-paste CSV content below. The first row must define the headers exactly as follows (including capitalization):
            </p>
            <pre className="bg-[#FAF6EC] border border-[#EADFC9] p-2 rounded-lg font-mono text-[10px] text-[#3A332C] overflow-x-auto">
              date,tithi,tithiSub,paksha,pakshaSub,nakshatra,nakshatraSub,sunrise,sunset,city
            </pre>
            <p>Example raw values:</p>
            <pre className="bg-[#FAF6EC] border border-[#EADFC9] p-2 rounded-lg font-mono text-[10px] text-[#3A332C] overflow-x-auto">
              2026-08-10,Saptami,7th day of Ashadha,Shukla,Waxing moon,Hasta,Auspicious,05:28,19:05,Delhi-NCR
            </pre>
          </div>

          <form onSubmit={handleBulkLoad} className="space-y-4">
            <textarea
              placeholder="date,tithi,tithiSub,paksha,pakshaSub,nakshatra,nakshatraSub,sunrise,sunset,city..."
              value={csvContent}
              onChange={(e) => setCsvContent(e.target.value)}
              rows={12}
              className="w-full text-xs font-mono bg-white border border-[#EADFC9] rounded-2xl p-4 focus:outline-none focus:ring-1 focus:ring-[#C82A54]"
            />

            <div className="flex justify-end pt-2 border-t border-[#F2ECE4]">
              <button
                type="submit"
                disabled={submittingBulk}
                className="px-6 py-2.5 bg-[#C82A54] hover:bg-[#B02047] disabled:bg-[#C82A54]/60 text-white text-xs font-semibold rounded-xl flex items-center gap-2"
              >
                {submittingBulk ? (
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <RefreshCw size={14} />
                )}
                <span>Import and Upsert Calendar</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* --- Sub Tab 3: Vrats Calendar --- */}
      {activeSubTab === "vrats" && (
        <>
          {/* Vrat form drawer */}
          {isVratOpen && (
            <div className="bg-white border border-[#EADFC9] rounded-2xl p-6 shadow-sm animate-slideDown max-w-xl">
              <div className="flex items-center justify-between border-b border-[#F2ECE4] pb-3 mb-4">
                <h3 className="font-serif font-bold text-lg text-[#3A332C]">
                  {editingVratId ? "Edit Vrat Notification" : "Create Vrat Notification"}
                </h3>
                <button onClick={resetVratForm} className="text-[#8A7A6E] hover:text-[#3A332C]">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveVrat} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#8A7A6E] uppercase tracking-wider">Vrat Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Yogini Ekadashi"
                    value={vName}
                    onChange={(e) => setVName(e.target.value)}
                    className="w-full text-sm bg-white border border-[#EADFC9] rounded-xl px-3.5 py-2 focus:outline-none focus:ring-1 focus:ring-[#C82A54]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#8A7A6E] uppercase tracking-wider">Date *</label>
                    <input
                      type="date"
                      value={vDate}
                      onChange={(e) => setVDate(e.target.value)}
                      className="w-full text-sm bg-white border border-[#EADFC9] rounded-xl px-3.5 py-2 focus:outline-none focus:ring-1 focus:ring-[#C82A54]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#8A7A6E] uppercase tracking-wider">Filter Category *</label>
                    <input
                      type="text"
                      placeholder="e.g. Ekadashi, Pradosh, Purnima, Sankashti"
                      value={vCategory}
                      onChange={(e) => setVCategory(e.target.value)}
                      className="w-full text-sm bg-white border border-[#EADFC9] rounded-xl px-3.5 py-2 focus:outline-none focus:ring-1 focus:ring-[#C82A54]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#8A7A6E] uppercase tracking-wider">Linked Ritual Guide (Optional)</label>
                  <select
                    value={vLinkedGuideId}
                    onChange={(e) => setVLinkedGuideId(e.target.value)}
                    className="w-full text-sm bg-white border border-[#EADFC9] rounded-xl px-3.5 py-2 focus:outline-none focus:ring-1 focus:ring-[#C82A54]"
                  >
                    <option value="">-- No Linked Guide --</option>
                    {guides.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#8A7A6E] uppercase tracking-wider">Short description</label>
                  <textarea
                    placeholder="Summary / Significance details..."
                    value={vDescription}
                    onChange={(e) => setVDescription(e.target.value)}
                    rows={3}
                    className="w-full text-sm bg-white border border-[#EADFC9] rounded-xl px-3.5 py-2 focus:outline-none focus:ring-1 focus:ring-[#C82A54]"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-[#F2ECE4]">
                  <button
                    type="button"
                    onClick={resetVratForm}
                    className="px-4 py-2 border border-[#EADFC9] text-[#6A5A4E] text-xs font-semibold rounded-xl hover:bg-[#F9F5EC] transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#C82A54] text-white text-xs font-semibold rounded-xl hover:bg-[#B02047] transition-all"
                  >
                    Save Vrat Notification
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Vrats calendar table */}
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="w-6 h-6 border-2 border-[#C82A54] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : vratEntries.length === 0 ? (
            <div className="bg-white border border-[#EADFC9] rounded-2xl p-12 text-center text-[#8A7A6E]">
              <Calendar className="mx-auto text-[#EADFC9] mb-4" size={40} />
              <p className="font-semibold text-base">No vrat calendar entries found</p>
              <p className="text-xs mt-1">Add vrat events to populate the public filterable vrat calendar page.</p>
            </div>
          ) : (
            <div className="bg-white border border-[#EADFC9] rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#FDFBF7] border-b border-[#EADFC9] text-[10px] font-bold text-[#8A7A6E] uppercase tracking-wider">
                    <th className="p-4">Date</th>
                    <th className="p-4">Name</th>
                    <th className="p-4">Filter Chip Category</th>
                    <th className="p-4">Linked Article</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-[#F2ECE4]">
                  {vratEntries.map((vrat) => {
                    const match = guides.find((g) => g.id === vrat.linkedGuideId);
                    return (
                      <tr key={vrat.id} className="hover:bg-[#FDFBF7]/40 transition-colors">
                        <td className="p-4 font-bold text-[#3A332C]">
                          {new Date(vrat.date).toLocaleDateString("en-IN", { timeZone: "UTC" })}
                        </td>
                        <td className="p-4">
                          <div className="font-serif font-bold text-[#3A332C]">{vrat.name}</div>
                          {vrat.description && (
                            <div className="text-xs text-[#8A7A6E] line-clamp-1">{vrat.description}</div>
                          )}
                        </td>
                        <td className="p-4">
                          <span className="text-[10px] font-bold bg-[#FAF6EC] border border-[#EADFC9] text-[#6A5A4E] px-2 py-0.5 rounded-full uppercase tracking-wide">
                            {vrat.category}
                          </span>
                        </td>
                        <td className="p-4 text-xs text-[#6A5A4E] font-medium">
                          {match ? match.title : <span className="text-[#8A7A6E] italic">None</span>}
                        </td>
                        <td className="p-4 text-right space-x-2 whitespace-nowrap">
                          <button
                            onClick={() => handleEditVrat(vrat)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold border border-[#EADFC9] text-[#6A5A4E] hover:bg-[#F9F5EC] rounded-lg"
                          >
                            <Edit size={12} />
                          </button>
                          <button
                            onClick={() => handleDeleteVrat(vrat.id)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold border border-[#FFEAEF] text-[#C82A54] hover:bg-[#FFEAEF] rounded-lg"
                          >
                            <Trash size={12} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
