"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Compass, CheckCircle2, AlertCircle } from "lucide-react";

interface Concept {
  id: string;
  title: string;
  slug: string;
  status: "DRAFT" | "PUBLISHED";
  thumbnailUrl?: string;
  updatedAt: string;
}

export default function DharmicConceptsList() {
  const [concepts, setConcepts] = useState<Concept[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConcepts();
  }, []);

  async function fetchConcepts() {
    try {
      const res = await fetch("/api/admin/dharmic-concepts");
      if (res.ok) {
        const data = await res.json();
        setConcepts(data);
      }
    } catch (e) {
      console.error("Failed to fetch concepts:", e);
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this concept?")) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/dharmic-concepts/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchConcepts();
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
          <h1 className="font-serif font-bold text-2xl text-[#3A332C]">Dharmic Concepts</h1>
          <p className="text-xs text-[#8A7A6E] mt-1">
            Philosophical and spiritual terms, explanations, and paragraph-led wisdom guides.
          </p>
        </div>
        <Link
          href="/admin/dharmic-concepts/new"
          className="flex items-center gap-2 bg-[#C82A54] hover:bg-[#B02047] text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-sm transition-all"
        >
          <Plus size={14} />
          <span>New Concept</span>
        </Link>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-10">
          <div className="w-6 h-6 border-2 border-[#C82A54] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : concepts.length === 0 ? (
        <div className="bg-white border border-[#EADFC9] rounded-2xl p-12 text-center text-[#8A7A6E]">
          <Compass className="mx-auto text-[#EADFC9] mb-4" size={40} />
          <p className="font-semibold text-base">No concepts found</p>
          <p className="text-xs mt-1">Create your first Dharmic Concept article to start seeding content.</p>
        </div>
      ) : (
        <div className="bg-white border border-[#EADFC9] rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FDFBF7] border-b border-[#EADFC9] text-[10px] font-bold text-[#8A7A6E] uppercase tracking-wider">
                <th className="p-4">Concept Details</th>
                <th className="p-4">Slug</th>
                <th className="p-4">Status</th>
                <th className="p-4">Last Updated</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-[#F2ECE4]">
              {concepts.map((concept) => (
                <tr key={concept.id} className="hover:bg-[#FDFBF7]/40 transition-colors">
                  <td className="p-4 flex items-center gap-3">
                    {concept.thumbnailUrl ? (
                      <img
                        src={concept.thumbnailUrl}
                        alt={concept.title}
                        className="w-10 h-10 object-cover rounded-lg border border-[#EADFC9] bg-white flex-shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-[#F9F5EC] border border-[#EADFC9] rounded-lg flex items-center justify-center text-[#8A7A6E] flex-shrink-0">
                        <Compass size={18} />
                      </div>
                    )}
                    <span className="font-serif font-bold text-[#3A332C]">
                      {concept.title}
                    </span>
                  </td>
                  <td className="p-4 font-mono text-xs text-[#6A5A4E]">
                    {concept.slug}
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        concept.status === "PUBLISHED"
                          ? "bg-[#E2F7EE] text-[#136C41]"
                          : "bg-[#F5F3F0] text-[#6A5A4E]"
                      }`}
                    >
                      {concept.status === "PUBLISHED" ? (
                        <CheckCircle2 size={10} />
                      ) : (
                        <AlertCircle size={10} />
                      )}
                      <span>{concept.status}</span>
                    </span>
                  </td>
                  <td className="p-4 text-xs text-[#8A7A6E]">
                    {new Date(concept.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-right space-x-2 whitespace-nowrap">
                    <Link
                      href={`/admin/dharmic-concepts/${concept.id}/edit`}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold border border-[#EADFC9] text-[#6A5A4E] hover:bg-[#F9F5EC] rounded-lg transition-all"
                    >
                      <Pencil size={12} />
                      <span>Edit</span>
                    </Link>
                    <button
                      onClick={() => handleDelete(concept.id)}
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
