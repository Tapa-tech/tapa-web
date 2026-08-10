"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, BookOpen, CheckCircle2, AlertCircle } from "lucide-react";

interface Guide {
  id: string;
  title: string;
  slug: string;
  status: "DRAFT" | "PUBLISHED";
  category: string;
  updatedAt: string;
}

export default function RitualGuidesList() {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGuides();
  }, []);

  async function fetchGuides() {
    try {
      const res = await fetch("/api/admin/ritual-guides");
      if (res.ok) {
        const data = await res.json();
        setGuides(data);
      }
    } catch (e) {
      console.error("Failed to fetch guides:", e);
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this ritual guide? All steps, mantras, and associated items will be deleted.")) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/ritual-guides/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchGuides();
      } else {
        const data = await res.json();
        alert(data.error || "Delete failed");
      }
    } catch (e) {
      console.error("Delete failed:", e);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#F2ECE4] pb-4">
        <div>
          <h1 className="font-serif font-bold text-2xl text-[#3A332C]">Ritual Guides</h1>
          <p className="text-xs text-[#8A7A6E] mt-1">
            Compose and manage step-by-step pujans, sankalpas, mantras, and scriptural guidelines.
          </p>
        </div>
        <Link
          href="/admin/ritual-guides/new"
          className="flex items-center gap-2 bg-[#C82A54] hover:bg-[#B02047] text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-sm transition-all"
        >
          <Plus size={14} />
          <span>New Ritual Guide</span>
        </Link>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-10">
          <div className="w-6 h-6 border-2 border-[#C82A54] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : guides.length === 0 ? (
        <div className="bg-white border border-[#EADFC9] rounded-2xl p-12 text-center text-[#8A7A6E]">
          <BookOpen className="mx-auto text-[#EADFC9] mb-4" size={40} />
          <p className="font-semibold text-base">No guides found</p>
          <p className="text-xs mt-1">Create your first pujan/ritual guide to build out the library.</p>
        </div>
      ) : (
        <div className="bg-white border border-[#EADFC9] rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FDFBF7] border-b border-[#EADFC9] text-[10px] font-bold text-[#8A7A6E] uppercase tracking-wider">
                <th className="p-4">Title</th>
                <th className="p-4">Category</th>
                <th className="p-4">Status</th>
                <th className="p-4">Last Updated</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-[#F2ECE4]">
              {guides.map((guide) => (
                <tr key={guide.id} className="hover:bg-[#FDFBF7]/40 transition-colors">
                  <td className="p-4 font-serif font-bold text-[#3A332C]">
                    {guide.title}
                  </td>
                  <td className="p-4 text-[#6A5A4E]">
                    {guide.category}
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        guide.status === "PUBLISHED"
                          ? "bg-[#E2F7EE] text-[#136C41]"
                          : "bg-[#F5F3F0] text-[#6A5A4E]"
                      }`}
                    >
                      {guide.status === "PUBLISHED" ? (
                        <CheckCircle2 size={10} />
                      ) : (
                        <AlertCircle size={10} />
                      )}
                      <span>{guide.status}</span>
                    </span>
                  </td>
                  <td className="p-4 text-xs text-[#8A7A6E]">
                    {new Date(guide.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-right space-x-2 whitespace-nowrap">
                    <Link
                      href={`/admin/ritual-guides/${guide.id}/edit`}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold border border-[#EADFC9] text-[#6A5A4E] hover:bg-[#F9F5EC] rounded-lg transition-all"
                    >
                      <Pencil size={12} />
                      <span>Edit</span>
                    </Link>
                    <button
                      onClick={() => handleDelete(guide.id)}
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
