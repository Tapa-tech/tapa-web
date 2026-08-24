"use client";

import React, { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Library, Check, X } from "lucide-react";

interface Source {
  id: string;
  name: string;
  reference: string;
  type: "VEDIC" | "PURANIC" | "SHASTRA" | "SCHOLARLY" | "ORAL";
  createdAt: string;
}

export default function SourcesLibrary() {
  const [sources, setSources] = useState<Source[]>([]);
  const [loading, setLoading] = useState(true);
  
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [reference, setReference] = useState("");
  const [type, setType] = useState<Source["type"]>("VEDIC");
  
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    fetchSources();
  }, []);

  async function fetchSources() {
    try {
      const res = await fetch("/api/admin/sources");
      if (res.ok) {
        const data = await res.json();
        setSources(data);
      }
    } catch (e) {
      console.error("Failed to load sources:", e);
    } finally {
      setLoading(false);
    }
  }

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setReference("");
    setType("VEDIC");
    setError("");
    setIsFormOpen(false);
  };

  const handleEdit = (source: Source) => {
    setEditingId(source.id);
    setName(source.name);
    setReference(source.reference);
    setType(source.type);
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !reference.trim()) {
      setError("All fields are required.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const url = editingId ? `/api/admin/sources/${editingId}` : "/api/admin/sources";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, reference, type }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Request failed");
      }

      await fetchSources();
      resetForm();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this source? Ritual Guides linked to this source will have it removed.")) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/sources/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchSources();
      } else {
        const data = await res.json();
        alert(data.error || "Delete failed");
      }
    } catch (e) {
      console.error("Delete source failed:", e);
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="flex items-center justify-between border-b border-[#F2ECE4] pb-4">
        <div>
          <h1 className="font-serif font-bold text-2xl text-[#3A332C]">Sources Library</h1>
          <p className="text-xs text-[#8A7A6E] mt-1">
            Manage scriptural citations, Vedas, and historical records to link inside Ritual Guides.
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setIsFormOpen(true);
          }}
          className="flex items-center gap-2 bg-[#C82A54] hover:bg-[#B02047] text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-sm transition-all"
        >
          <Plus size={14} />
          <span>Add Source</span>
        </button>
      </div>

      
      {isFormOpen && (
        <div className="bg-white border border-[#EADFC9] rounded-2xl p-6 shadow-sm animate-slideDown max-w-xl">
          <div className="flex items-center justify-between border-b border-[#F2ECE4] pb-3 mb-4">
            <h3 className="font-serif font-bold text-lg text-[#3A332C]">
              {editingId ? "Edit Citation Source" : "Create Citation Source"}
            </h3>
            <button onClick={resetForm} className="text-[#8A7A6E] hover:text-[#3A332C]">
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="text-xs font-semibold text-[#C82A54] bg-[#FFEAEF] p-3 rounded-xl">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#8A7A6E] uppercase tracking-wider">Source Name</label>
                <input
                  type="text"
                  placeholder="e.g. Shiva Purana, Rig Veda"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-sm bg-white border border-[#EADFC9] rounded-xl px-3.5 py-2 focus:outline-none focus:ring-1 focus:ring-[#C82A54]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#8A7A6E] uppercase tracking-wider">Source Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as Source["type"])}
                  className="w-full text-sm bg-white border border-[#EADFC9] rounded-xl px-3.5 py-2 focus:outline-none focus:ring-1 focus:ring-[#C82A54]"
                >
                  <option value="VEDIC">Vedic</option>
                  <option value="PURANIC">Puranic</option>
                  <option value="SHASTRA">Shastra</option>
                  <option value="SCHOLARLY">Scholarly Reference</option>
                  <option value="ORAL">Oral Tradition</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#8A7A6E] uppercase tracking-wider">Specific Reference / Chapter</label>
              <input
                type="text"
                placeholder="e.g. Rudra Samhita / Parvati Khanda, Chapter 12"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                className="w-full text-sm bg-white border border-[#EADFC9] rounded-xl px-3.5 py-2 focus:outline-none focus:ring-1 focus:ring-[#C82A54]"
              />
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
                <span>Save Citation</span>
              </button>
            </div>
          </form>
        </div>
      )}

      
      {loading ? (
        <div className="flex justify-center py-10">
          <div className="w-6 h-6 border-2 border-[#C82A54] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : sources.length === 0 ? (
        <div className="bg-white border border-[#EADFC9] rounded-2xl p-12 text-center text-[#8A7A6E]">
          <Library className="mx-auto text-[#EADFC9] mb-4" size={40} />
          <p className="font-semibold text-base">No sources found</p>
          <p className="text-xs mt-1">Create your first citation source to link inside Ritual Guides.</p>
        </div>
      ) : (
        <div className="bg-white border border-[#EADFC9] rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FDFBF7] border-b border-[#EADFC9] text-[10px] font-bold text-[#8A7A6E] uppercase tracking-wider">
                <th className="p-4">Name</th>
                <th className="p-4">Reference Location</th>
                <th className="p-4">Classification</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-[#F2ECE4]">
              {sources.map((source) => (
                <tr key={source.id} className="hover:bg-[#FDFBF7]/40 transition-colors">
                  <td className="p-4 font-serif font-bold text-[#3A332C]">
                    {source.name}
                  </td>
                  <td className="p-4 text-[#6A5A4E] italic">
                    {source.reference}
                  </td>
                  <td className="p-4">
                    <span className="text-[10px] font-bold bg-[#F9F5EC] border border-[#EADFC9] text-[#6A5A4E] px-2 py-0.5 rounded-full uppercase tracking-wide">
                      {source.type}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => handleEdit(source)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold border border-[#EADFC9] text-[#6A5A4E] hover:bg-[#F9F5EC] rounded-lg transition-all"
                    >
                      <Pencil size={12} />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(source.id)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold border border-[#FFEAEF] text-[#C82A54] hover:bg-[#FFEAEF] rounded-lg transition-all"
                    >
                      <Trash2 size={12} />
                      <span>Delete</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
