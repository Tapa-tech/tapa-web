"use client";

import React, { useState, useEffect } from "react";
import { Megaphone, Plus, Check, Pencil, Trash2, X } from "lucide-react";

interface Announcement {
  id: string;
  message: string;
  isActive: boolean;
  startDate: string | null;
  endDate: string | null;
  priority: number;
  createdAt: string;
}

export default function AdminAnnouncements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [message, setMessage] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [priority, setPriority] = useState("0");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  async function fetchAnnouncements() {
    try {
      const res = await fetch("/api/admin/announcements");
      if (res.ok) {
        const data = await res.json();
        setAnnouncements(data);
      }
    } catch (e) {
      console.error("Failed to load announcements:", e);
    } finally {
      setLoading(false);
    }
  }

  const resetForm = () => {
    setEditingId(null);
    setMessage("");
    setIsActive(false);
    setStartDate("");
    setEndDate("");
    setPriority("0");
    setError("");
    setSuccess("");
    setIsFormOpen(false);
  };

  const handleEditClick = (ann: Announcement) => {
    setEditingId(ann.id);
    setMessage(ann.message);
    setIsActive(ann.isActive);
    setStartDate(ann.startDate ? new Date(ann.startDate).toISOString().substring(0, 16) : "");
    setEndDate(ann.endDate ? new Date(ann.endDate).toISOString().substring(0, 16) : "");
    setPriority(String(ann.priority));
    setError("");
    setSuccess("");
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      setError("Message content is required.");
      return;
    }

    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const url = editingId ? `/api/admin/announcements/${editingId}` : "/api/admin/announcements";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          isActive,
          startDate: startDate || null,
          endDate: endDate || null,
          priority: parseInt(priority) || 0,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save announcement message");
      }

      setSuccess("Announcement message saved!");
      await fetchAnnouncements();
      resetForm();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this announcement message?")) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/announcements/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        await fetchAnnouncements();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete announcement message");
      }
    } catch (err) {
      console.error("Failed to delete announcement message:", err);
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "Always";
    try {
      return new Date(dateStr).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#FFEAEF] flex items-center justify-center text-[#C82A54]">
            <Megaphone size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-serif text-[#3A332C]">Announcement Bar Messages</h1>
            <p className="text-sm text-[#8A7A6E]">Manage sliding banners, scheduling, and message priority.</p>
          </div>
        </div>

        {!isFormOpen && (
          <button
            onClick={() => setIsFormOpen(true)}
            className="h-fit px-4 py-2 bg-[#C82A54] text-white text-xs font-bold rounded-xl hover:bg-[#B02047] transition-all flex items-center gap-1.5 self-start sm:self-center"
          >
            <Plus size={14} />
            <span>Create Announcement</span>
          </button>
        )}
      </div>

      {isFormOpen && (
        <div className="bg-white p-6 rounded-2xl border border-[#EADFC9] mb-8 transition-all">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-[#F2ECE4]">
              <h2 className="text-lg font-serif font-bold text-[#3A332C]">
                {editingId ? "Edit Announcement" : "New Announcement Message"}
              </h2>
              <button type="button" onClick={resetForm} className="text-[#8A7A6E] hover:text-[#3A332C]">
                <X size={18} />
              </button>
            </div>

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

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#8A7A6E] uppercase tracking-wider">Announcement Text</label>
              <input
                type="text"
                placeholder="Dharma doesn't demand fear, it demands pure devotion..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full text-sm bg-white border border-[#EADFC9] rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#C82A54]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#8A7A6E] uppercase tracking-wider">Start Date / Time (Optional)</label>
                <input
                  type="datetime-local"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full text-sm bg-white border border-[#EADFC9] rounded-xl px-3.5 py-2 focus:outline-none focus:ring-1 focus:ring-[#C82A54]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#8A7A6E] uppercase tracking-wider">End Date / Time (Optional)</label>
                <input
                  type="datetime-local"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full text-sm bg-white border border-[#EADFC9] rounded-xl px-3.5 py-2 focus:outline-none focus:ring-1 focus:ring-[#C82A54]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#8A7A6E] uppercase tracking-wider">Priority Rank</label>
                <input
                  type="number"
                  placeholder="0"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full text-sm bg-white border border-[#EADFC9] rounded-xl px-3.5 py-2 focus:outline-none focus:ring-1 focus:ring-[#C82A54]"
                />
              </div>
            </div>

            <div className="flex items-center gap-2.5 py-1">
              <input
                type="checkbox"
                id="isActive"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="rounded border-[#EADFC9] text-[#C82A54] focus:ring-[#C82A54]"
              />
              <label htmlFor="isActive" className="text-xs font-bold text-[#3A332C] cursor-pointer">
                Set as Active Message (this will temporarily override scheduling)
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#F2ECE4]">
              <button
                type="button"
                onClick={resetForm}
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
                <span>Save Announcement</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Announcements Table */}
      <div className="bg-white rounded-2xl border border-[#EADFC9] overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <div className="w-8 h-8 border-4 border-[#C82A54] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : announcements.length === 0 ? (
          <div className="p-12 text-center text-[#8A7A6E] text-sm">
            No announcement messages have been created yet. Click &quot;Create Announcement&quot; to add one.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-[#EADFC9] bg-[#F9F5EC] text-xs font-bold text-[#8A7A6E] uppercase tracking-wider select-none">
                  <th className="px-6 py-4">Announcement Message</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Scheduling (Start - End)</th>
                  <th className="px-6 py-4 text-center">Priority</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2ECE4]">
                {announcements.map((ann) => (
                  <tr key={ann.id} className="hover:bg-[#FDFBF7]/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-[#3A332C] max-w-sm break-words">
                      {ann.message}
                    </td>
                    <td className="px-6 py-4">
                      {ann.isActive ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-green-700 bg-green-50 px-2.5 py-0.5 rounded-full border border-green-200">
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-[#8A7A6E] bg-[#F2ECE4] px-2.5 py-0.5 rounded-full">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-[#6A5A4E]">
                      <div>Start: {formatDate(ann.startDate)}</div>
                      <div className="mt-0.5">End: {formatDate(ann.endDate)}</div>
                    </td>
                    <td className="px-6 py-4 text-center font-bold text-[#3A332C]">
                      {ann.priority}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={() => handleEditClick(ann)}
                          className="p-1.5 text-[#6A5A4E] hover:text-[#C82A54] hover:bg-[#FFEAEF]/30 rounded-lg transition-all"
                          title="Edit"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(ann.id)}
                          className="p-1.5 text-[#6A5A4E] hover:text-[#C82A54] hover:bg-[#FFEAEF]/30 rounded-lg transition-all"
                          title="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
