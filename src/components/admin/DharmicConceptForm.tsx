"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Upload, X, Check, ArrowLeft, Bold, Italic, List, ListOrdered, Heading1, Heading2, Undo, Redo } from "lucide-react";

interface DharmicConceptFormProps {
  initialId?: string;
}

export default function DharmicConceptForm({ initialId }: DharmicConceptFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED">("DRAFT");
  const [bodyJson, setBodyJson] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");

  const [bodyLoaded, setBodyLoaded] = useState(false);

  const [loading, setLoading] = useState(initialId ? true : false);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Initialize Tiptap Editor
  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
    immediatelyRender: false,
    onUpdate({ editor }) {
      setBodyJson(JSON.stringify(editor.getJSON()));
    },
  });

  useEffect(() => {
    if (initialId) {
      fetchConcept();
    }
  }, [initialId]);

  // Load existing data in edit mode
  async function fetchConcept() {
    try {
      const res = await fetch(`/api/admin/dharmic-concepts/${initialId}`);
      if (res.ok) {
        const data = await res.json();
        setTitle(data.title);
        setSlug(data.slug);
        setStatus(data.status);
        setThumbnailUrl(data.thumbnailUrl || "");
        setBodyJson(data.body);
      }
    } catch (err) {
      console.error("Failed to load concept:", err);
      setError("Failed to load concept details");
    } finally {
      setLoading(false);
    }
  }

  // Set editor content once loaded
  useEffect(() => {
    if (editor && bodyJson && !bodyLoaded) {
      try {
        const parsed = JSON.parse(bodyJson);
        editor.commands.setContent(parsed);
      } catch {
        editor.commands.setContent(bodyJson);
      }
      setBodyLoaded(true);
    }
  }, [editor, bodyJson, bodyLoaded]);

  // Auto-generate slug from title
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!initialId) {
      const clean = val
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "") // remove special characters
        .trim()
        .replace(/\s+/g, "-") // replace spaces with dashes
        .replace(/-+/g, "-"); // remove repeat dashes
      setSlug(clean);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      setThumbnailUrl(data.url);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "File upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    if (!slug.trim()) {
      setError("Slug is required");
      return;
    }

    const currentBody = editor ? JSON.stringify(editor.getJSON()) : bodyJson;
    if (!currentBody || currentBody === '{"type":"doc","content":[{"type":"paragraph"}]}') {
      setError("Body text is required");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const url = initialId ? `/api/admin/dharmic-concepts/${initialId}` : "/api/admin/dharmic-concepts";
      const method = initialId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          slug,
          status,
          body: currentBody,
          thumbnailUrl,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");

      router.push("/admin/dharmic-concepts");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save concept");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px]">
        <div className="w-8 h-8 border-4 border-[#C82A54] border-t-transparent rounded-full animate-spin"></div>
        <span className="text-[#8A7A6E] mt-3">Loading concept details...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="flex items-center gap-4 border-b border-[#F2ECE4] pb-4">
        <button
          onClick={() => router.push("/admin/dharmic-concepts")}
          className="p-2 border border-[#EADFC9] text-[#6A5A4E] hover:bg-[#F9F5EC] rounded-xl transition-all"
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1 className="font-serif font-bold text-2xl text-[#3A332C]">
            {initialId ? "Edit Dharmic Concept" : "Create New Dharmic Concept"}
          </h1>
          <p className="text-xs text-[#8A7A6E] mt-0.5">
            Fill in the details below. Status must be PUBLISHED for it to be visible on public screens.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column (Form inputs) */}
        <div className="lg:col-span-2 space-y-6">
          {error && (
            <div className="text-xs font-semibold text-[#C82A54] bg-[#FFEAEF] p-4 rounded-2xl">
              {error}
            </div>
          )}

          <div className="bg-white border border-[#EADFC9] rounded-2xl p-6 shadow-sm space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#8A7A6E] uppercase tracking-wider">Concept Title</label>
              <input
                type="text"
                placeholder="e.g. Purushartha, Samsara, Karma"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full text-base bg-white border border-[#EADFC9] rounded-xl px-4 py-2.5 font-semibold focus:outline-none focus:ring-1 focus:ring-[#C82A54]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#8A7A6E] uppercase tracking-wider">Url Slug</label>
              <input
                type="text"
                placeholder="e.g. samsara-and-karma"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full text-sm bg-white border border-[#EADFC9] rounded-xl px-4 py-2.5 font-mono focus:outline-none focus:ring-1 focus:ring-[#C82A54]"
              />
            </div>

            {/* Tiptap rich text container */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#8A7A6E] uppercase tracking-wider">Body Text (Rich Editor)</label>
              <div className="border border-[#EADFC9] rounded-2xl overflow-hidden">
                {/* Tiptap Toolbar */}
                {editor && (
                  <div className="bg-[#FDFBF7] border-b border-[#EADFC9] p-2 flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => editor.chain().focus().toggleBold().run()}
                      className={`p-1.5 rounded-lg transition-colors ${editor.isActive("bold") ? "bg-[#FFEAEF] text-[#C82A54]" : "hover:bg-[#F9F5EC]"}`}
                    >
                      <Bold size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => editor.chain().focus().toggleItalic().run()}
                      className={`p-1.5 rounded-lg transition-colors ${editor.isActive("italic") ? "bg-[#FFEAEF] text-[#C82A54]" : "hover:bg-[#F9F5EC]"}`}
                    >
                      <Italic size={14} />
                    </button>
                    <div className="h-5 w-[1px] bg-[#EADFC9] self-center"></div>
                    <button
                      type="button"
                      onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                      className={`p-1.5 rounded-lg transition-colors ${editor.isActive("heading", { level: 1 }) ? "bg-[#FFEAEF] text-[#C82A54]" : "hover:bg-[#F9F5EC]"}`}
                    >
                      <Heading1 size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                      className={`p-1.5 rounded-lg transition-colors ${editor.isActive("heading", { level: 2 }) ? "bg-[#FFEAEF] text-[#C82A54]" : "hover:bg-[#F9F5EC]"}`}
                    >
                      <Heading2 size={14} />
                    </button>
                    <div className="h-5 w-[1px] bg-[#EADFC9] self-center"></div>
                    <button
                      type="button"
                      onClick={() => editor.chain().focus().toggleBulletList().run()}
                      className={`p-1.5 rounded-lg transition-colors ${editor.isActive("bulletList") ? "bg-[#FFEAEF] text-[#C82A54]" : "hover:bg-[#F9F5EC]"}`}
                    >
                      <List size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => editor.chain().focus().toggleOrderedList().run()}
                      className={`p-1.5 rounded-lg transition-colors ${editor.isActive("orderedList") ? "bg-[#FFEAEF] text-[#C82A54]" : "hover:bg-[#F9F5EC]"}`}
                    >
                      <ListOrdered size={14} />
                    </button>
                    <div className="h-5 w-[1px] bg-[#EADFC9] self-center"></div>
                    <button
                      type="button"
                      onClick={() => editor.chain().focus().undo().run()}
                      className="p-1.5 rounded-lg hover:bg-[#F9F5EC]"
                    >
                      <Undo size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => editor.chain().focus().redo().run()}
                      className="p-1.5 rounded-lg hover:bg-[#F9F5EC]"
                    >
                      <Redo size={14} />
                    </button>
                  </div>
                )}
                {/* Editor Content Area */}
                <EditorContent
                  editor={editor}
                  className="prose max-w-none text-sm p-4 bg-white min-h-[250px] max-h-[500px] overflow-y-auto focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right column (Metadata and actions) */}
        <div className="space-y-6">
          {/* Status & Actions Card */}
          <div className="bg-white border border-[#EADFC9] rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="font-serif font-bold text-lg border-b border-[#F2ECE4] pb-2">Publish Settings</h3>

            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#8A7A6E] uppercase tracking-wider">Status</span>
              <div className="flex border border-[#EADFC9] rounded-xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setStatus("DRAFT")}
                  className={`px-3 py-1.5 text-xs font-bold ${
                    status === "DRAFT"
                      ? "bg-[#8A7A6E] text-white"
                      : "bg-[#FDFBF7] text-[#6A5A4E] hover:bg-[#F9F5EC]"
                  }`}
                >
                  Draft
                </button>
                <button
                  type="button"
                  onClick={() => setStatus("PUBLISHED")}
                  className={`px-3 py-1.5 text-xs font-bold ${
                    status === "PUBLISHED"
                      ? "bg-[#1D8A56] text-white"
                      : "bg-[#FDFBF7] text-[#6A5A4E] hover:bg-[#F9F5EC]"
                  }`}
                >
                  Publish
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#C82A54] hover:bg-[#B02047] disabled:bg-[#C82A54]/60 text-white font-semibold text-sm py-2.5 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              {submitting ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <Check size={16} />
              )}
              <span>Save Concept</span>
            </button>
          </div>

          {/* Image Upload Card */}
          <div className="bg-white border border-[#EADFC9] rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="font-serif font-bold text-lg border-b border-[#F2ECE4] pb-2">Feature Image</h3>

            {thumbnailUrl ? (
              <div className="relative group rounded-xl overflow-hidden border border-[#EADFC9] bg-[#FDFBF7]">
                <img src={thumbnailUrl} alt="Feature preview" className="w-full h-40 object-cover" />
                <button
                  type="button"
                  onClick={() => setThumbnailUrl("")}
                  className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full transition-colors shadow-sm"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <label className="border-2 border-dashed border-[#EADFC9] hover:border-[#C82A54] rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors bg-[#FDFBF7]/40 min-h-[160px]">
                {uploading ? (
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-6 h-6 border-2 border-[#C82A54] border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-xs text-[#8A7A6E]">Uploading image...</span>
                  </div>
                ) : (
                  <>
                    <Upload className="text-[#8A7A6E] mb-2" size={24} />
                    <span className="text-xs font-semibold text-[#6A5A4E]">Upload thumbnail image</span>
                    <span className="text-[10px] text-[#8A7A6E] mt-1">PNG, JPEG or WEBP (Max 4MB)</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
