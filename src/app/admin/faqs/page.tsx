"use client";

import React, { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, HelpCircle, Check, X } from "lucide-react";

interface FAQ {
  id: string;
  question: string;
  answer: string; // rich text JSON stored as text
  createdAt: string;
}

export default function FAQsLibrary() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState(""); // We treat it as standard string input in the simple library editor
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    fetchFaqs();
  }, []);

  async function fetchFaqs() {
    try {
      const res = await fetch("/api/admin/faqs");
      if (res.ok) {
        const data = await res.json();
        setFaqs(data);
      }
    } catch (e) {
      console.error("Failed to load FAQs:", e);
    } finally {
      setLoading(false);
    }
  }

  const resetForm = () => {
    setEditingId(null);
    setQuestion("");
    setAnswer("");
    setError("");
    setIsFormOpen(false);
  };

  const handleEdit = (faq: FAQ) => {
    setEditingId(faq.id);
    setQuestion(faq.question);
    setAnswer(faq.answer);
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) {
      setError("All fields are required.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const url = editingId ? `/api/admin/faqs/${editingId}` : "/api/admin/faqs";
      const method = editingId ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, answer }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Request failed");
      }

      await fetchFaqs();
      resetForm();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this FAQ? Ritual Guides linked to this FAQ will have it removed.")) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/faqs/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchFaqs();
      } else {
        const data = await res.json();
        alert(data.error || "Delete failed");
      }
    } catch (e) {
      console.error("Delete FAQ failed:", e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#F2ECE4] pb-4">
        <div>
          <h1 className="font-serif font-bold text-2xl text-[#3A332C]">FAQs Library</h1>
          <p className="text-xs text-[#8A7A6E] mt-1">
            Create reusable Questions and Answers to attach to different Ritual Guides.
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
          <span>Add FAQ</span>
        </button>
      </div>

      {/* Form Drawer */}
      {isFormOpen && (
        <div className="bg-white border border-[#EADFC9] rounded-2xl p-6 shadow-sm animate-slideDown max-w-xl">
          <div className="flex items-center justify-between border-b border-[#F2ECE4] pb-3 mb-4">
            <h3 className="font-serif font-bold text-lg text-[#3A332C]">
              {editingId ? "Edit FAQ" : "Create FAQ"}
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

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#8A7A6E] uppercase tracking-wider">Question</label>
              <input
                type="text"
                placeholder="e.g. Can ladies perform this puja?"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="w-full text-sm bg-white border border-[#EADFC9] rounded-xl px-3.5 py-2 focus:outline-none focus:ring-1 focus:ring-[#C82A54]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#8A7A6E] uppercase tracking-wider">Answer (Rich Text / Plain Text)</label>
              <textarea
                placeholder="Write the FAQ answer..."
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                rows={4}
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
                <span>Save FAQ</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-10">
          <div className="w-6 h-6 border-2 border-[#C82A54] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : faqs.length === 0 ? (
        <div className="bg-white border border-[#EADFC9] rounded-2xl p-12 text-center text-[#8A7A6E]">
          <HelpCircle className="mx-auto text-[#EADFC9] mb-4" size={40} />
          <p className="font-semibold text-base">No FAQs found</p>
          <p className="text-xs mt-1">Create your first FAQ to link inside Ritual Guides.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {faqs.map((faq) => (
            <div
              key={faq.id}
              className="bg-white border border-[#EADFC9] rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row justify-between gap-4"
            >
              <div className="space-y-2">
                <h3 className="font-serif font-bold text-lg text-[#3A332C]">
                  Q: {faq.question}
                </h3>
                <div className="text-sm text-[#6A5A4E] whitespace-pre-line leading-relaxed">
                  A: {faq.answer}
                </div>
              </div>
              <div className="flex items-start gap-2 flex-shrink-0">
                <button
                  onClick={() => handleEdit(faq)}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold border border-[#EADFC9] text-[#6A5A4E] hover:bg-[#F9F5EC] rounded-lg transition-all"
                >
                  <Pencil size={12} />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(faq.id)}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold border border-[#FFEAEF] text-[#C82A54] hover:bg-[#FFEAEF] rounded-lg transition-all"
                >
                  <Trash2 size={12} />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
