"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Upload,
  Check,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  Plus,
  Trash2,
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Info
} from "lucide-react";

interface RitualGuideFormProps {
  initialId?: string;
}

interface Step {
  title: string;
  description: string;
  note: string;
  order: number;
}

interface Mantra {
  devanagari: string;
  transliteration: string;
  meaning: string;
  audioUrl?: string;
}

interface Samagri {
  name: string;
  function: string;
  order: number;
}

interface DPB {
  elementName: string;
  tag: "DHARMA" | "PRATHA" | "BHRANTI";
  confidenceScore: number;
  claim: string;
  correction: string;
  sourceOfTruth: string;
  regionalVariance: string;
}

interface LibrarySource {
  id: string;
  name: string;
  reference: string;
  type: string;
}

interface LibraryFAQ {
  id: string;
  question: string;
  answer: string;
}

export default function RitualGuideForm({ initialId }: RitualGuideFormProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"basic" | "sankalpa" | "steps" | "mantras" | "dpb" | "relations">("basic");

  // Form Fields
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED">("DRAFT");
  const [category, setCategory] = useState("Festive Pujans");
  const [sankalpaBody, setSankalpaBody] = useState("");
  const [sankalpaQuote, setSankalpaQuote] = useState("");
  const [fastNote, setFastNote] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [kathaTitle, setKathaTitle] = useState("Vrat Katha");

  // Complex lists
  const [fastOptions, setFastOptions] = useState<{ name: string; desc: string; recommended: boolean }[]>([]);
  const [steps, setSteps] = useState<Step[]>([]);
  const [mantras, setMantras] = useState<Mantra[]>([]);
  const [samagriItems, setSamagriItems] = useState<Samagri[]>([]);
  const [dpbEntries, setDpbEntries] = useState<DPB[]>([]);
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [selectedFaqs, setSelectedFaqs] = useState<{ faqId: string; question: string; order: number }[]>([]);

  // Libraries fetched from server
  const [allSources, setAllSources] = useState<LibrarySource[]>([]);
  const [allFaqs, setAllFaqs] = useState<LibraryFAQ[]>([]);

  // Editor states (Rich Text)
  const [loading, setLoading] = useState(initialId ? true : false);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  // Tiptap instances
  const introEditor = useEditor({ extensions: [StarterKit], content: "" });
  const kathaEditor = useEditor({ extensions: [StarterKit], content: "" });
  const aartiEditor = useEditor({ extensions: [StarterKit], content: "" });

  useEffect(() => {
    // Fetch libraries on load
    async function loadLibraries() {
      try {
        const [sourcesRes, faqsRes] = await Promise.all([
          fetch("/api/admin/sources"),
          fetch("/api/admin/faqs"),
        ]);
        if (sourcesRes.ok) {
          const sData = await sourcesRes.json();
          setAllSources(sData);
        }
        if (faqsRes.ok) {
          const fData = await faqsRes.json();
          setAllFaqs(fData);
        }
      } catch (e) {
        console.error("Failed to load libraries:", e);
      }
    }
    loadLibraries();

    if (initialId) {
      fetchGuide();
    }
  }, [initialId]);

  async function fetchGuide() {
    try {
      const res = await fetch(`/api/admin/ritual-guides/${initialId}`);
      if (!res.ok) throw new Error("Failed to load guide details");

      const data = await res.json();
      setTitle(data.title);
      setSlug(data.slug);
      setStatus(data.status);
      setCategory(data.category);
      setSankalpaBody(data.sankalpaBody);
      setSankalpaQuote(data.sankalpaQuote);
      setFastNote(data.fastNote);
      setThumbnailUrl(data.thumbnailUrl || "");
      setAudioUrl(data.audioUrl || "");
      setKathaTitle(data.kathaTitle);

      setFastOptions(data.fastOptions || []);
      setSteps(data.steps || []);
      setMantras(data.mantras || []);
      setSamagriItems(data.samagriItems || []);
      setDpbEntries(data.dpbEntries || []);
      setSelectedSources(data.sources?.map((s: { sourceId: string }) => s.sourceId) || []);
      setSelectedFaqs(data.faqs?.map((f: { faqId: string; order: number; faq?: { question: string } }) => ({ faqId: f.faqId, question: f.faq?.question || "", order: f.order })) || []);

      if (introEditor) introEditor.commands.setContent(data.introText);
      if (kathaEditor) kathaEditor.commands.setContent(data.kathaBody);
      if (aartiEditor) aartiEditor.commands.setContent(data.aartiBody || "");
    } catch (err: unknown) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to load guide");
    } finally {
      setLoading(false);
    }
  }

  // Handle auto-slugification
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!initialId) {
      const clean = val
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
      setSlug(clean);
    }
  };

  // Image Upload handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setThumbnailUrl(data.url);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "File upload failed");
    } finally {
      setUploading(false);
    }
  };

  // --- repeatable list helpers ---

  // 1. Fast Options
  const addFastOption = () => {
    if (fastOptions.length >= 3) {
      alert("Typically fasting lists are limited to 3 options max per the spec.");
      return;
    }
    setFastOptions([...fastOptions, { name: "", desc: "", recommended: false }]);
  };
  const removeFastOption = (idx: number) => {
    setFastOptions(fastOptions.filter((_, i) => i !== idx));
  };
  const updateFastOption = (idx: number, fields: Partial<typeof fastOptions[0]>) => {
    const list = [...fastOptions];
    list[idx] = { ...list[idx], ...fields };
    setFastOptions(list);
  };

  // 2. Steps reordering
  const addStep = () => {
    setSteps([...steps, { title: "", description: "", note: "", order: steps.length + 1 }]);
  };
  const removeStep = (idx: number) => {
    const filtered = steps.filter((_, i) => i !== idx);
    // recalculate orders
    filtered.forEach((s, i) => (s.order = i + 1));
    setSteps(filtered);
  };
  const updateStep = (idx: number, fields: Partial<Step>) => {
    const list = [...steps];
    list[idx] = { ...list[idx], ...fields };
    setSteps(list);
  };
  const moveStep = (idx: number, dir: "up" | "down") => {
    const nextIdx = dir === "up" ? idx - 1 : idx + 1;
    if (nextIdx < 0 || nextIdx >= steps.length) return;
    const list = [...steps];
    const temp = list[idx];
    list[idx] = list[nextIdx];
    list[nextIdx] = temp;
    // reconcile orders
    list.forEach((s, i) => (s.order = i + 1));
    setSteps(list);
  };

  // 3. Mantras
  const addMantra = () => {
    setMantras([...mantras, { devanagari: "", transliteration: "", meaning: "", audioUrl: "" }]);
  };
  const removeMantra = (idx: number) => {
    setMantras(mantras.filter((_, i) => i !== idx));
  };
  const updateMantra = (idx: number, fields: Partial<Mantra>) => {
    const list = [...mantras];
    list[idx] = { ...list[idx], ...fields };
    setMantras(list);
  };

  // 4. Samagri checklist
  const addSamagri = () => {
    setSamagriItems([...samagriItems, { name: "", function: "", order: samagriItems.length + 1 }]);
  };
  const removeSamagri = (idx: number) => {
    const filtered = samagriItems.filter((_, i) => i !== idx);
    filtered.forEach((s, i) => (s.order = i + 1));
    setSamagriItems(filtered);
  };
  const updateSamagri = (idx: number, fields: Partial<Samagri>) => {
    const list = [...samagriItems];
    list[idx] = { ...list[idx], ...fields };
    setSamagriItems(list);
  };
  const moveSamagri = (idx: number, dir: "up" | "down") => {
    const nextIdx = dir === "up" ? idx - 1 : idx + 1;
    if (nextIdx < 0 || nextIdx >= samagriItems.length) return;
    const list = [...samagriItems];
    const temp = list[idx];
    list[idx] = list[nextIdx];
    list[nextIdx] = temp;
    list.forEach((s, i) => (s.order = i + 1));
    setSamagriItems(list);
  };

  // 5. DPB Entries
  const addDpb = () => {
    setDpbEntries([
      ...dpbEntries,
      { elementName: "", tag: "DHARMA", confidenceScore: 5, claim: "", correction: "", sourceOfTruth: "", regionalVariance: "" },
    ]);
  };
  const removeDpb = (idx: number) => {
    setDpbEntries(dpbEntries.filter((_, i) => i !== idx));
  };
  const updateDpb = (idx: number, fields: Partial<DPB>) => {
    const list = [...dpbEntries];
    let score = fields.confidenceScore !== undefined ? fields.confidenceScore : list[idx].confidenceScore;
    
    // Automatically enforce score constraints based on tag selection
    if (fields.tag) {
      if (fields.tag === "DHARMA") score = 5;
      else if (fields.tag === "PRATHA") score = 3;
      else if (fields.tag === "BHRANTI") score = 1;
    }

    list[idx] = { ...list[idx], ...fields, confidenceScore: score };
    setDpbEntries(list);
  };

  // 6. Citations multi-select
  const handleToggleSource = (sourceId: string) => {
    if (selectedSources.includes(sourceId)) {
      setSelectedSources(selectedSources.filter((id) => id !== sourceId));
    } else {
      setSelectedSources([...selectedSources, sourceId]);
    }
  };

  // 7. FAQs multi-select & ordering
  const handleToggleFaq = (faq: LibraryFAQ) => {
    const exists = selectedFaqs.find((f) => f.faqId === faq.id);
    if (exists) {
      const filtered = selectedFaqs.filter((f) => f.faqId !== faq.id);
      filtered.forEach((f, i) => (f.order = i + 1));
      setSelectedFaqs(filtered);
    } else {
      setSelectedFaqs([...selectedFaqs, { faqId: faq.id, question: faq.question, order: selectedFaqs.length + 1 }]);
    }
  };
  const moveFaq = (idx: number, dir: "up" | "down") => {
    const nextIdx = dir === "up" ? idx - 1 : idx + 1;
    if (nextIdx < 0 || nextIdx >= selectedFaqs.length) return;
    const list = [...selectedFaqs];
    const temp = list[idx];
    list[idx] = list[nextIdx];
    list[nextIdx] = temp;
    list.forEach((f, i) => (f.order = i + 1));
    setSelectedFaqs(list);
  };

  // --- Submit handler ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !slug.trim()) {
      setError("Title and Slug are required.");
      return;
    }

    const introText = introEditor ? JSON.stringify(introEditor.getJSON()) : "";
    const kathaBody = kathaEditor ? JSON.stringify(kathaEditor.getJSON()) : "";
    const aartiBody = aartiEditor ? JSON.stringify(aartiEditor.getJSON()) : "";

    if (!introText || introText === '{"type":"doc","content":[{"type":"paragraph"}]}') {
      setError("Introduction text is required.");
      return;
    }
    if (!kathaBody || kathaBody === '{"type":"doc","content":[{"type":"paragraph"}]}') {
      setError("Katha body text is required.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const url = initialId ? `/api/admin/ritual-guides/${initialId}` : "/api/admin/ritual-guides";
      const method = initialId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          slug,
          status,
          category,
          introText,
          sankalpaBody,
          sankalpaQuote,
          fastOptions,
          fastNote,
          kathaTitle,
          kathaBody,
          aartiBody,
          thumbnailUrl,
          audioUrl,
          steps,
          mantras,
          samagriItems,
          sources: selectedSources,
          faqs: selectedFaqs.map((f) => ({ faqId: f.faqId, order: f.order })),
          dpbEntries,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");

      router.push("/admin/ritual-guides");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save ritual guide");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px]">
        <div className="w-8 h-8 border-4 border-[#C82A54] border-t-transparent rounded-full animate-spin"></div>
        <span className="text-[#8A7A6E] mt-3">Loading guide details...</span>
      </div>
    );
  }

  const TiptapToolbar = ({ editorInstance }: { editorInstance: Editor | null }) => {
    if (!editorInstance) return null;
    return (
      <div className="bg-[#FDFBF7] border-b border-[#EADFC9] p-2 flex flex-wrap gap-1.5">
        <button
          type="button"
          onClick={() => editorInstance.chain().focus().toggleBold().run()}
          className={`p-1.5 rounded-lg transition-colors ${editorInstance.isActive("bold") ? "bg-[#FFEAEF] text-[#C82A54]" : "hover:bg-[#F9F5EC]"}`}
        >
          <Bold size={13} />
        </button>
        <button
          type="button"
          onClick={() => editorInstance.chain().focus().toggleItalic().run()}
          className={`p-1.5 rounded-lg transition-colors ${editorInstance.isActive("italic") ? "bg-[#FFEAEF] text-[#C82A54]" : "hover:bg-[#F9F5EC]"}`}
        >
          <Italic size={13} />
        </button>
        <div className="h-4 w-[1px] bg-[#EADFC9] self-center"></div>
        <button
          type="button"
          onClick={() => editorInstance.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-1.5 rounded-lg transition-colors ${editorInstance.isActive("heading", { level: 1 }) ? "bg-[#FFEAEF] text-[#C82A54]" : "hover:bg-[#F9F5EC]"}`}
        >
          <Heading1 size={13} />
        </button>
        <button
          type="button"
          onClick={() => editorInstance.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-1.5 rounded-lg transition-colors ${editorInstance.isActive("heading", { level: 2 }) ? "bg-[#FFEAEF] text-[#C82A54]" : "hover:bg-[#F9F5EC]"}`}
        >
          <Heading2 size={13} />
        </button>
        <div className="h-4 w-[1px] bg-[#EADFC9] self-center"></div>
        <button
          type="button"
          onClick={() => editorInstance.chain().focus().toggleBulletList().run()}
          className={`p-1.5 rounded-lg transition-colors ${editorInstance.isActive("bulletList") ? "bg-[#FFEAEF] text-[#C82A54]" : "hover:bg-[#F9F5EC]"}`}
        >
          <List size={13} />
        </button>
        <button
          type="button"
          onClick={() => editorInstance.chain().focus().toggleOrderedList().run()}
          className={`p-1.5 rounded-lg transition-colors ${editorInstance.isActive("orderedList") ? "bg-[#FFEAEF] text-[#C82A54]" : "hover:bg-[#F9F5EC]"}`}
        >
          <ListOrdered size={13} />
        </button>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex items-center justify-between border-b border-[#F2ECE4] pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/admin/ritual-guides")}
            className="p-2 border border-[#EADFC9] text-[#6A5A4E] hover:bg-[#F9F5EC] rounded-xl transition-all"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className="font-serif font-bold text-2xl text-[#3A332C]">
              {initialId ? "Edit Ritual Guide" : "Create New Ritual Guide"}
            </h1>
            <p className="text-xs text-[#8A7A6E] mt-0.5">Compose detail-oriented scriptures and verify content properties.</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as "DRAFT" | "PUBLISHED")}
            className="text-xs font-bold border border-[#EADFC9] rounded-xl bg-white px-3 py-2 focus:outline-none"
          >
            <option value="DRAFT">DRAFT</option>
            <option value="PUBLISHED">PUBLISHED</option>
          </select>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="bg-[#C82A54] hover:bg-[#B02047] disabled:bg-[#C82A54]/60 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-sm transition-all flex items-center gap-1.5"
          >
            {submitting ? (
              <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <Check size={14} />
            )}
            <span>Save Guide</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="text-xs font-semibold text-[#C82A54] bg-[#FFEAEF] p-4 rounded-2xl">
          {error}
        </div>
      )}

      {/* Editor Tabs Navigation */}
      <div className="flex border-b border-[#EADFC9] gap-1 overflow-x-auto select-none">
        {[
          { key: "basic", label: "1. Basic Info & Intro" },
          { key: "sankalpa", label: "2. Sankalpa & Fasting" },
          { key: "steps", label: "3. Vidhi (Steps)" },
          { key: "mantras", label: "4. Mantras & Samagri" },
          { key: "dpb", label: "5. DPB Claims Wizard" },
          { key: "relations", label: "6. Sources & FAQs" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as "basic" | "sankalpa" | "steps" | "mantras" | "dpb" | "relations")}
            className={`px-4 py-2.5 font-semibold text-xs border-b-2 transition-all whitespace-nowrap ${
              activeTab === tab.key
                ? "border-[#C82A54] text-[#C82A54]"
                : "border-transparent text-[#8A7A6E] hover:text-[#3A332C]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Form Body */}
      <div className="bg-white border border-[#EADFC9] rounded-2xl p-6 shadow-sm min-h-[400px]">
        {/* --- Tab 1: Basic & Intro --- */}
        {activeTab === "basic" && (
          <div className="space-y-6">
            <h3 className="font-serif font-bold text-lg border-b border-[#F2ECE4] pb-2 text-[#3A332C]">
              Title & Category Settings
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#8A7A6E] uppercase tracking-wider">Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Maha Rudrabhishek Puja"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full text-sm bg-white border border-[#EADFC9] rounded-xl px-3.5 py-2 focus:outline-none focus:ring-1 focus:ring-[#C82A54]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#8A7A6E] uppercase tracking-wider">Slug *</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full text-sm bg-white border border-[#EADFC9] rounded-xl px-3.5 py-2 font-mono focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#8A7A6E] uppercase tracking-wider">Category *</label>
                <input
                  type="text"
                  placeholder="e.g. Festive Pujans, Navagraha Pujans"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full text-sm bg-white border border-[#EADFC9] rounded-xl px-3.5 py-2 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#8A7A6E] uppercase tracking-wider">Thumbnail Image URL</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="URL or upload using button on right"
                    value={thumbnailUrl}
                    onChange={(e) => setThumbnailUrl(e.target.value)}
                    className="flex-1 text-sm bg-white border border-[#EADFC9] rounded-xl px-3.5 py-2 focus:outline-none"
                  />
                  <label className="cursor-pointer bg-[#FDFBF7] border border-[#EADFC9] text-[#6A5A4E] hover:bg-[#F9F5EC] px-3.5 py-2 rounded-xl flex items-center justify-center">
                    {uploading ? (
                      <span className="w-4 h-4 border-2 border-[#C82A54] border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                      <Upload size={16} />
                    )}
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#8A7A6E] uppercase tracking-wider">Introduction Text (Rich Editor) *</label>
              <div className="border border-[#EADFC9] rounded-2xl overflow-hidden">
                <TiptapToolbar editorInstance={introEditor} />
                <EditorContent editor={introEditor} className="prose max-w-none text-sm p-4 min-h-[160px] bg-white" />
              </div>
            </div>

            <div className="border-t border-[#F2ECE4] pt-6 space-y-4">
              <h4 className="font-serif font-bold text-base text-[#3A332C]">Katha and Aarti Texts</h4>
              
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#8A7A6E] uppercase tracking-wider">Katha Title *</label>
                <input
                  type="text"
                  value={kathaTitle}
                  onChange={(e) => setKathaTitle(e.target.value)}
                  className="w-full text-sm bg-white border border-[#EADFC9] rounded-xl px-3.5 py-2 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#8A7A6E] uppercase tracking-wider">Katha Body Text (Rich Editor) *</label>
                <div className="border border-[#EADFC9] rounded-2xl overflow-hidden">
                  <TiptapToolbar editorInstance={kathaEditor} />
                  <EditorContent editor={kathaEditor} className="prose max-w-none text-sm p-4 min-h-[200px]" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#8A7A6E] uppercase tracking-wider">Aarti Body Text (Optional, Rich Editor)</label>
                <div className="border border-[#EADFC9] rounded-2xl overflow-hidden">
                  <TiptapToolbar editorInstance={aartiEditor} />
                  <EditorContent editor={aartiEditor} className="prose max-w-none text-sm p-4 min-h-[120px]" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- Tab 2: Sankalpa & Fasting --- */}
        {activeTab === "sankalpa" && (
          <div className="space-y-6">
            <h3 className="font-serif font-bold text-lg border-b border-[#F2ECE4] pb-2 text-[#3A332C]">
              Sankalpa Settings
            </h3>
            
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#8A7A6E] uppercase tracking-wider">Sankalpa Body Text *</label>
                <textarea
                  placeholder="Explain the scriptural objective of this sankalpa..."
                  value={sankalpaBody}
                  onChange={(e) => setSankalpaBody(e.target.value)}
                  rows={4}
                  className="w-full text-sm bg-white border border-[#EADFC9] rounded-xl px-3.5 py-2 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#8A7A6E] uppercase tracking-wider">Sankalpa Quote / Recital Card *</label>
                <textarea
                  placeholder='e.g. "I, [Name], son/daughter of [Fathers Name]..."'
                  value={sankalpaQuote}
                  onChange={(e) => setSankalpaQuote(e.target.value)}
                  rows={3}
                  className="w-full text-sm bg-white border border-[#EADFC9] rounded-xl px-3.5 py-2 font-serif text-lg focus:outline-none"
                />
              </div>
            </div>

            <div className="border-t border-[#F2ECE4] pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-serif font-bold text-base text-[#3A332C]">Fasting Options</h4>
                  <p className="text-[10px] text-[#8A7A6E] mt-0.5">Customize up to 3 fasting variations (e.g. Nirjala, Phalahari).</p>
                </div>
                <button
                  type="button"
                  onClick={addFastOption}
                  className="flex items-center gap-1 bg-[#FDFBF7] border border-[#EADFC9] text-[#6A5A4E] hover:bg-[#F9F5EC] text-xs font-bold px-3 py-1.5 rounded-xl transition-all"
                >
                  <Plus size={12} />
                  <span>Add Option</span>
                </button>
              </div>

              {fastOptions.length === 0 ? (
                <div className="text-xs text-[#8A7A6E] p-4 border border-dashed border-[#EADFC9] rounded-xl text-center">
                  No fasting options added yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {fastOptions.map((opt, idx) => (
                    <div key={idx} className="border border-[#EADFC9] rounded-xl p-4 space-y-3 bg-[#FDFBF7]/30 relative">
                      <button
                        type="button"
                        onClick={() => removeFastOption(idx)}
                        className="absolute top-2 right-2 text-[#8A7A6E] hover:text-[#C82A54]"
                      >
                        <Trash2 size={14} />
                      </button>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-[#8A7A6E]">Option Name</label>
                          <input
                            type="text"
                            placeholder="e.g. Phalahari Vrat"
                            value={opt.name}
                            onChange={(e) => updateFastOption(idx, { name: e.target.value })}
                            className="w-full text-xs bg-white border border-[#EADFC9] rounded-lg px-2.5 py-1.5 focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1.5 flex flex-col justify-end">
                          <label className="flex items-center gap-2 text-xs font-bold text-[#6A5A4E] cursor-pointer pb-2">
                            <input
                              type="checkbox"
                              checked={opt.recommended}
                              onChange={(e) => updateFastOption(idx, { recommended: e.target.checked })}
                              className="rounded border-[#EADFC9] text-[#C82A54] focus:ring-[#C82A54] h-4 w-4"
                            />
                            <span>Recommended Option</span>
                          </label>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-[#8A7A6E]">Description / Foods Allowed</label>
                        <input
                          type="text"
                          placeholder="e.g. Fruits, milk products, and sabudana khichdi allowed once in evening."
                          value={opt.desc}
                          onChange={(e) => updateFastOption(idx, { desc: e.target.value })}
                          className="w-full text-xs bg-white border border-[#EADFC9] rounded-lg px-2.5 py-1.5 focus:outline-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-bold text-[#8A7A6E] uppercase tracking-wider flex items-center gap-1.5">
                  <Info size={14} className="text-[#C82A54]" />
                  <span>Fasting Bhranti Correction / Note</span>
                </label>
                <textarea
                  placeholder="e.g. Note that consuming tea or wheat grains breaks the traditional fast rules..."
                  value={fastNote}
                  onChange={(e) => setFastNote(e.target.value)}
                  rows={2}
                  className="w-full text-sm bg-white border border-[#EADFC9] rounded-xl px-3.5 py-2 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* --- Tab 3: Vidhi (Steps) --- */}
        {activeTab === "steps" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-[#F2ECE4] pb-2">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#3A332C]">Vidhi (Step-by-Step Guide)</h3>
                <p className="text-[10px] text-[#8A7A6E] mt-0.5">Manage ritual actions in chronological order.</p>
              </div>
              <button
                type="button"
                onClick={addStep}
                className="flex items-center gap-1 bg-[#FDFBF7] border border-[#EADFC9] text-[#6A5A4E] hover:bg-[#F9F5EC] text-xs font-bold px-3 py-1.5 rounded-xl transition-all"
              >
                <Plus size={12} />
                <span>Add Step</span>
              </button>
            </div>

            {steps.length === 0 ? (
              <div className="text-sm text-[#8A7A6E] p-12 border-2 border-dashed border-[#EADFC9] rounded-2xl text-center">
                No steps added yet. Click &quot;Add Step&quot; to begin building the Vidhi.
              </div>
            ) : (
              <div className="space-y-4">
                {steps.map((step, idx) => (
                  <div key={idx} className="bg-[#FDFBF7]/30 border border-[#EADFC9] rounded-2xl p-5 shadow-sm space-y-3 relative group">
                    {/* Controls & Delete */}
                    <div className="absolute top-4 right-4 flex items-center gap-1.5">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => moveStep(idx, "up")}
                        className="p-1 hover:bg-[#F9F5EC] text-[#8A7A6E] disabled:opacity-30 rounded"
                      >
                        <ArrowUp size={14} />
                      </button>
                      <button
                        type="button"
                        disabled={idx === steps.length - 1}
                        onClick={() => moveStep(idx, "down")}
                        className="p-1 hover:bg-[#F9F5EC] text-[#8A7A6E] disabled:opacity-30 rounded"
                      >
                        <ArrowDown size={14} />
                      </button>
                      <div className="h-4 w-[1px] bg-[#EADFC9]"></div>
                      <button
                        type="button"
                        onClick={() => removeStep(idx)}
                        className="p-1 text-[#8A7A6E] hover:text-[#C82A54] rounded"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 bg-[#C82A54] text-white font-bold text-xs rounded-full flex items-center justify-center">
                        {step.order}
                      </span>
                      <span className="text-xs font-bold text-[#8A7A6E] uppercase tracking-wider">Step Details</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5 col-span-1 md:col-span-2">
                        <label className="text-xs font-bold text-[#6A5A4E]">Title *</label>
                        <input
                          type="text"
                          placeholder="e.g. Diya Jalana"
                          value={step.title}
                          onChange={(e) => updateStep(idx, { title: e.target.value })}
                          className="w-full text-sm bg-white border border-[#EADFC9] rounded-xl px-3.5 py-1.5 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#6A5A4E]">Description *</label>
                      <textarea
                        placeholder="Detailed instructions for the user..."
                        value={step.description}
                        onChange={(e) => updateStep(idx, { description: e.target.value })}
                        rows={3}
                        className="w-full text-sm bg-white border border-[#EADFC9] rounded-xl px-3.5 py-2 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#8A7A6E] flex items-center gap-1">
                        <Info size={12} className="text-[#C82A54]" />
                        <span>Pratha Correction / Step Note</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Lighting Ghee diya is ideal, sesame oil acts as substitute (regional custom)."
                        value={step.note}
                        onChange={(e) => updateStep(idx, { note: e.target.value })}
                        className="w-full text-xs bg-white border border-[#EADFC9] rounded-xl px-3.5 py-1.5 focus:outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* --- Tab 4: Mantras & Samagri --- */}
        {activeTab === "mantras" && (
          <div className="space-y-8">
            {/* Mantras Repeatable section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#F2ECE4] pb-2">
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#3A332C]">Mantras</h3>
                  <p className="text-[10px] text-[#8A7A6E] mt-0.5">Sanskrit chant lists accompanying the rituals.</p>
                </div>
                <button
                  type="button"
                  onClick={addMantra}
                  className="flex items-center gap-1 bg-[#FDFBF7] border border-[#EADFC9] text-[#6A5A4E] hover:bg-[#F9F5EC] text-xs font-bold px-3 py-1.5 rounded-xl transition-all"
                >
                  <Plus size={12} />
                  <span>Add Mantra</span>
                </button>
              </div>

              {mantras.length === 0 ? (
                <div className="text-sm text-[#8A7A6E] p-8 border border-dashed border-[#EADFC9] rounded-xl text-center">
                  No mantras added yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {mantras.map((mantra, idx) => (
                    <div key={idx} className="border border-[#EADFC9] rounded-2xl p-4 bg-[#FDFBF7]/20 relative space-y-3">
                      <button
                        type="button"
                        onClick={() => removeMantra(idx)}
                        className="absolute top-2 right-2 text-[#8A7A6E] hover:text-[#C82A54]"
                      >
                        <Trash2 size={14} />
                      </button>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5 font-serif text-lg">
                          <label className="text-xs font-bold text-[#8A7A6E] font-sans uppercase">Devanagari Input *</label>
                          <textarea
                            placeholder="ॐ भूर् भुवः स्वः..."
                            value={mantra.devanagari}
                            onChange={(e) => updateMantra(idx, { devanagari: e.target.value })}
                            rows={2}
                            className="w-full bg-white border border-[#EADFC9] rounded-xl p-3 focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1.5 italic">
                          <label className="text-xs font-bold text-[#8A7A6E] font-sans uppercase">Transliteration *</label>
                          <textarea
                            placeholder="Om bhur bhuvah svah..."
                            value={mantra.transliteration}
                            onChange={(e) => updateMantra(idx, { transliteration: e.target.value })}
                            rows={2}
                            className="w-full bg-white border border-[#EADFC9] rounded-xl p-3 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-[#8A7A6E] uppercase">Meaning *</label>
                        <input
                          type="text"
                          placeholder="Literal meaning of this chant..."
                          value={mantra.meaning}
                          onChange={(e) => updateMantra(idx, { meaning: e.target.value })}
                          className="w-full text-sm bg-white border border-[#EADFC9] rounded-xl px-3.5 py-1.5 focus:outline-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Samagri checklist section */}
            <div className="space-y-4 border-t border-[#F2ECE4] pt-8">
              <div className="flex items-center justify-between border-b border-[#F2ECE4] pb-2">
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#3A332C]">Samagri Checklist</h3>
                  <p className="text-[10px] text-[#8A7A6E] mt-0.5">Item names and corresponding functions needed.</p>
                </div>
                <button
                  type="button"
                  onClick={addSamagri}
                  className="flex items-center gap-1 bg-[#FDFBF7] border border-[#EADFC9] text-[#6A5A4E] hover:bg-[#F9F5EC] text-xs font-bold px-3 py-1.5 rounded-xl transition-all"
                >
                  <Plus size={12} />
                  <span>Add Samagri Item</span>
                </button>
              </div>

              {samagriItems.length === 0 ? (
                <div className="text-sm text-[#8A7A6E] p-8 border border-dashed border-[#EADFC9] rounded-xl text-center">
                  No samagri items added.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {samagriItems.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 bg-[#FDFBF7]/30 border border-[#EADFC9] p-3 rounded-xl relative group">
                      <span className="text-xs font-bold text-[#8A7A6E] w-6 text-center">{item.order}</span>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1">
                        <input
                          type="text"
                          placeholder="Item Name (e.g. Sindoor)"
                          value={item.name}
                          onChange={(e) => updateSamagri(idx, { name: e.target.value })}
                          className="text-xs bg-white border border-[#EADFC9] rounded-lg px-2.5 py-1.5 focus:outline-none"
                        />
                        <input
                          type="text"
                          placeholder="Scriptural Function (e.g. Offertory for Parvati Devi)"
                          value={item.function}
                          onChange={(e) => updateSamagri(idx, { function: e.target.value })}
                          className="text-xs bg-white border border-[#EADFC9] rounded-lg px-2.5 py-1.5 focus:outline-none"
                        />
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => moveSamagri(idx, "up")}
                          className="p-1 hover:bg-[#F9F5EC] text-[#8A7A6E] disabled:opacity-30 rounded"
                        >
                          <ArrowUp size={12} />
                        </button>
                        <button
                          type="button"
                          disabled={idx === samagriItems.length - 1}
                          onClick={() => moveSamagri(idx, "down")}
                          className="p-1 hover:bg-[#F9F5EC] text-[#8A7A6E] disabled:opacity-30 rounded"
                        >
                          <ArrowDown size={12} />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeSamagri(idx)}
                          className="p-1 text-[#8A7A6E] hover:text-[#C82A54] rounded"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- Tab 5: DPB Claims Wizard --- */}
        {activeTab === "dpb" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-[#F2ECE4] pb-2">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#3A332C]">DPB Claims Wizard</h3>
                <p className="text-[10px] text-[#8A7A6E] mt-0.5">
                  Verify Dharma facts, define Pratha variances, or document Bhranti myths requiring Founder Review.
                </p>
              </div>
              <button
                type="button"
                onClick={addDpb}
                className="flex items-center gap-1 bg-[#FDFBF7] border border-[#EADFC9] text-[#6A5A4E] hover:bg-[#F9F5EC] text-xs font-bold px-3 py-1.5 rounded-xl transition-all"
              >
                <Plus size={12} />
                <span>Add DPB Element</span>
              </button>
            </div>

            {dpbEntries.length === 0 ? (
              <div className="text-sm text-[#8A7A6E] p-12 border-2 border-dashed border-[#EADFC9] rounded-2xl text-center">
                No DPB elements added. Click &quot;Add DPB Element&quot; to open the tag scorer wizard.
              </div>
            ) : (
              <div className="space-y-6">
                {dpbEntries.map((dpb, idx) => (
                  <div key={idx} className="border border-[#EADFC9] rounded-2xl p-5 bg-[#FDFBF7]/35 relative space-y-4 shadow-sm">
                    <button
                      type="button"
                      onClick={() => removeDpb(idx)}
                      className="absolute top-4 right-4 text-[#8A7A6E] hover:text-[#C82A54]"
                    >
                      <Trash2 size={16} />
                    </button>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Element Name */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-[#8A7A6E] uppercase">Element / Practice Name *</label>
                        <input
                          type="text"
                          placeholder="e.g. Coconut Placement"
                          value={dpb.elementName}
                          onChange={(e) => updateDpb(idx, { elementName: e.target.value })}
                          className="w-full text-xs bg-white border border-[#EADFC9] rounded-lg px-2.5 py-1.5 focus:outline-none"
                        />
                      </div>

                      {/* DPB Tag */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-[#8A7A6E] uppercase">Tag Classification *</label>
                        <select
                          value={dpb.tag}
                          onChange={(e) => updateDpb(idx, { tag: e.target.value as "DHARMA" | "PRATHA" | "BHRANTI" })}
                          className="w-full text-xs bg-white border border-[#EADFC9] rounded-lg px-2.5 py-1.5 focus:outline-none"
                        >
                          <option value="DHARMA">DHARMA (Truth)</option>
                          <option value="PRATHA">PRATHA (Regional Custom)</option>
                          <option value="BHRANTI">BHRANTI (Myth/Misconception)</option>
                        </select>
                      </div>

                      {/* Confidence Score */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-[#8A7A6E] uppercase">Confidence Score (1-5)</label>
                        <input
                          type="number"
                          min={1}
                          max={5}
                          value={dpb.confidenceScore}
                          onChange={(e) => updateDpb(idx, { confidenceScore: parseInt(e.target.value) || 1 })}
                          className="w-full text-xs bg-white border border-[#EADFC9] rounded-lg px-2.5 py-1.5 focus:outline-none disabled:bg-gray-100"
                          disabled={dpb.tag === "BHRANTI"} // Bhranti automatically locked to score 1
                        />
                      </div>
                    </div>

                    {/* Show myth/claim for PRATHA or BHRANTI */}
                    {(dpb.tag === "BHRANTI" || dpb.tag === "PRATHA") && (
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-[#8A7A6E] uppercase">Claim / Popular Belief *</label>
                        <textarea
                          placeholder="Describe the claim or popular belief..."
                          value={dpb.claim}
                          onChange={(e) => updateDpb(idx, { claim: e.target.value })}
                          rows={2}
                          className="w-full text-xs bg-white border border-[#EADFC9] rounded-lg p-2.5 focus:outline-none"
                        />
                      </div>
                    )}

                    {/* Correction / Fact */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#8A7A6E] uppercase">Scriptural Correction / Fact *</label>
                      <textarea
                        placeholder="State the correct scriptural fact or explanation..."
                        value={dpb.correction}
                        onChange={(e) => updateDpb(idx, { correction: e.target.value })}
                        rows={2}
                        className="w-full text-xs bg-white border border-[#EADFC9] rounded-lg p-2.5 focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Source of truth citation text */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-[#8A7A6E] uppercase">Scriptural Citation Sources</label>
                        <input
                          type="text"
                          placeholder="e.g. Shiva Purana Ch 4 Verse 9"
                          value={dpb.sourceOfTruth}
                          onChange={(e) => updateDpb(idx, { sourceOfTruth: e.target.value })}
                          className="w-full text-xs bg-white border border-[#EADFC9] rounded-lg px-2.5 py-1.5 focus:outline-none"
                        />
                      </div>

                      {/* Regional Variance */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-[#8A7A6E] uppercase">Regional Custom Variances</label>
                        <input
                          type="text"
                          placeholder="e.g. East Indian households place mango leaves differently..."
                          value={dpb.regionalVariance}
                          onChange={(e) => updateDpb(idx, { regionalVariance: e.target.value })}
                          className="w-full text-xs bg-white border border-[#EADFC9] rounded-lg px-2.5 py-1.5 focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Moderation Warning */}
                    {dpb.tag === "BHRANTI" && (
                      <div className="text-[10px] font-bold text-[#C82A54] bg-[#FFEAEF] px-3 py-2 rounded-xl flex items-center gap-2">
                        <Info size={14} />
                        <span>This BHRANTI entry will default to PENDING_FOUNDER_REVIEW and populate the dashboard review queue upon saving.</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* --- Tab 6: Sources & FAQs Linkages --- */}
        {activeTab === "relations" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Sources checklist */}
            <div className="space-y-4">
              <h3 className="font-serif font-bold text-lg border-b border-[#F2ECE4] pb-2 text-[#3A332C]">
                Link Scriptural Sources
              </h3>
              
              {allSources.length === 0 ? (
                <p className="text-xs text-[#8A7A6E] italic">No sources created in Library. Save guide and visit Sources tab first.</p>
              ) : (
                <div className="space-y-2 border border-[#EADFC9] rounded-2xl p-4 max-h-[300px] overflow-y-auto">
                  {allSources.map((source) => (
                    <label
                      key={source.id}
                      className="flex items-start gap-3 p-2 hover:bg-[#FDFBF7] rounded-xl cursor-pointer select-none"
                    >
                      <input
                        type="checkbox"
                        checked={selectedSources.includes(source.id)}
                        onChange={() => handleToggleSource(source.id)}
                        className="rounded border-[#EADFC9] text-[#C82A54] focus:ring-[#C82A54] h-4 w-4 mt-0.5"
                      />
                      <div>
                        <div className="text-xs font-bold text-[#3A332C]">{source.name}</div>
                        <div className="text-[10px] text-[#8A7A6E] italic">{source.reference}</div>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Reusable FAQs checklist & ordering */}
            <div className="space-y-4">
              <h3 className="font-serif font-bold text-lg border-b border-[#F2ECE4] pb-2 text-[#3A332C]">
                Link and Order FAQs
              </h3>

              {allFaqs.length === 0 ? (
                <p className="text-xs text-[#8A7A6E] italic">No FAQs created in Library. Visit FAQs tab first.</p>
              ) : (
                <div className="space-y-4">
                  {/* Select FAQ checklist */}
                  <div className="space-y-2 border border-[#EADFC9] rounded-2xl p-4 max-h-[200px] overflow-y-auto">
                    {allFaqs.map((faq) => {
                      const isChecked = selectedFaqs.some((f) => f.faqId === faq.id);
                      return (
                        <label
                          key={faq.id}
                          className="flex items-center gap-3 p-1.5 hover:bg-[#FDFBF7] rounded-xl cursor-pointer select-none"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleToggleFaq(faq)}
                            className="rounded border-[#EADFC9] text-[#C82A54] focus:ring-[#C82A54] h-4 w-4"
                          />
                          <span className="text-xs text-[#3A332C] truncate font-medium">{faq.question}</span>
                        </label>
                      );
                    })}
                  </div>

                  {/* Ordering lists */}
                  {selectedFaqs.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-[10px] uppercase font-bold text-[#8A7A6E] tracking-wider">Arrange Attached FAQs Order</span>
                      <div className="space-y-1.5">
                        {selectedFaqs.map((item, idx) => (
                          <div key={item.faqId} className="flex items-center justify-between bg-[#FDFBF7]/50 border border-[#EADFC9] p-2.5 rounded-xl text-xs font-semibold">
                            <span className="truncate max-w-[200px]">{item.question}</span>
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] text-[#8A7A6E]">Pos: {item.order}</span>
                              <button
                                type="button"
                                disabled={idx === 0}
                                onClick={() => moveFaq(idx, "up")}
                                className="p-1 hover:bg-white text-[#8A7A6E] disabled:opacity-30 rounded"
                              >
                                <ArrowUp size={12} />
                              </button>
                              <button
                                type="button"
                                disabled={idx === selectedFaqs.length - 1}
                                onClick={() => moveFaq(idx, "down")}
                                className="p-1 hover:bg-white text-[#8A7A6E] disabled:opacity-30 rounded"
                              >
                                <ArrowDown size={12} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
