"use client";

import React, { useState, useEffect } from "react";
import { LayoutDashboard, Plus, Check, Pencil, Trash2, X, Upload, Eye } from "lucide-react";

interface Banner {
  id: string;
  isActive: boolean;
  imageUrl: string;
  orderByDate: string | null;
  festivalTitle: string;
  mainHeading: string;
  highlightedText: string;
  description: string;
  price: number;
  mrp: number | null;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText: string | null;
  secondaryCtaLink: string | null;
  festivalDate: string | null;
  createdAt: string;
}

export default function AdminBanners() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [isActive, setIsActive] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [orderByDate, setOrderByDate] = useState("");
  const [festivalTitle, setFestivalTitle] = useState("");
  const [mainHeading, setMainHeading] = useState("");
  const [highlightedText, setHighlightedText] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [mrp, setMrp] = useState("");
  const [primaryCtaText, setPrimaryCtaText] = useState("Pre-book Kit now ›");
  const [primaryCtaLink, setPrimaryCtaLink] = useState("/cart");
  const [secondaryCtaText, setSecondaryCtaText] = useState("View Kit Details");
  const [secondaryCtaLink, setSecondaryCtaLink] = useState("/ritual-kits");
  const [festivalDate, setFestivalDate] = useState("");

  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchBanners();
  }, []);

  async function fetchBanners() {
    try {
      const res = await fetch("/api/admin/banners");
      if (res.ok) {
        const data = await res.json();
        setBanners(data);
      }
    } catch (e) {
      console.error("Failed to load banners:", e);
    } finally {
      setLoading(false);
    }
  }

  const resetForm = () => {
    setEditingId(null);
    setIsActive(false);
    setImageUrl("");
    setOrderByDate("");
    setFestivalTitle("");
    setMainHeading("");
    setHighlightedText("");
    setDescription("");
    setPrice("");
    setMrp("");
    setPrimaryCtaText("Pre-book Kit now ›");
    setPrimaryCtaLink("/cart");
    setSecondaryCtaText("View Kit Details");
    setSecondaryCtaLink("/ritual-kits");
    setFestivalDate("");
    setError("");
    setSuccess("");
    setIsFormOpen(false);
  };

  const handleEditClick = (banner: Banner) => {
    setEditingId(banner.id);
    setIsActive(banner.isActive);
    setImageUrl(banner.imageUrl);
    setOrderByDate(banner.orderByDate ? new Date(banner.orderByDate).toISOString().substring(0, 16) : "");
    setFestivalTitle(banner.festivalTitle);
    setMainHeading(banner.mainHeading);
    setHighlightedText(banner.highlightedText);
    setDescription(banner.description);
    setPrice(String(banner.price));
    setMrp(banner.mrp ? String(banner.mrp) : "");
    setPrimaryCtaText(banner.primaryCtaText);
    setPrimaryCtaLink(banner.primaryCtaLink);
    setSecondaryCtaText(banner.secondaryCtaText || "");
    setSecondaryCtaLink(banner.secondaryCtaLink || "");
    setFestivalDate(banner.festivalDate ? new Date(banner.festivalDate).toISOString().substring(0, 16) : "");
    setError("");
    setSuccess("");
    setIsFormOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

      setImageUrl(data.url);
      setSuccess("Image uploaded successfully!");
    } catch (err: any) {
      setError(err.message || "Failed to upload image.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl) {
      setError("Banner background image is required.");
      return;
    }
    if (!festivalTitle || !mainHeading || !highlightedText || !description) {
      setError("Please fill in all required content fields.");
      return;
    }
    if (!price || isNaN(Number(price))) {
      setError("A valid pre-booking price is required.");
      return;
    }

    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const url = editingId ? `/api/admin/banners/${editingId}` : "/api/admin/banners";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isActive,
          imageUrl,
          orderByDate: orderByDate || null,
          festivalTitle,
          mainHeading,
          highlightedText,
          description,
          price: parseFloat(price),
          mrp: mrp ? parseFloat(mrp) : null,
          primaryCtaText,
          primaryCtaLink,
          secondaryCtaText: secondaryCtaText || null,
          secondaryCtaLink: secondaryCtaLink || null,
          festivalDate: festivalDate || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save banner settings.");
      }

      setSuccess("Homepage banner configurations saved!");
      await fetchBanners();
      resetForm();
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this homepage banner?")) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/banners/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        await fetchBanners();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete homepage banner");
      }
    } catch (err) {
      console.error("Failed to delete banner:", err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#FFEAEF] flex items-center justify-center text-[#C82A54]">
            <LayoutDashboard size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-serif text-[#3A332C]">Homepage Hero Banners</h1>
            <p className="text-sm text-[#8A7A6E]">Manage active landing banners, image uploads, prices, and CTAs.</p>
          </div>
        </div>

        {!isFormOpen && (
          <button
            onClick={() => setIsFormOpen(true)}
            className="h-fit px-4 py-2 bg-[#C82A54] text-white text-xs font-bold rounded-xl hover:bg-[#B02047] transition-all flex items-center gap-1.5 self-start sm:self-center"
          >
            <Plus size={14} />
            <span>Create New Banner</span>
          </button>
        )}
      </div>

      {isFormOpen && (
        <div className="bg-white p-6 rounded-2xl border border-[#EADFC9] mb-8 transition-all">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-between items-center pb-2 border-b border-[#F2ECE4]">
              <h2 className="text-lg font-serif font-bold text-[#3A332C]">
                {editingId ? "Edit Homepage Banner" : "New Homepage Banner Configuration"}
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column Fields */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-4 h-4 text-[#C82A54] border-[#EADFC9] rounded focus:ring-[#C82A54]"
                  />
                  <label htmlFor="isActive" className="text-sm font-bold text-[#3A332C]">
                    Set as Active Banner (Will deactivate any other active banner)
                  </label>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#8A7A6E] uppercase tracking-wider">DELIVERED BEFORE / SUB-TITLE</label>
                  <input
                    type="text"
                    value={festivalTitle}
                    onChange={(e) => setFestivalTitle(e.target.value)}
                    placeholder="e.g. DELIVERED BEFORE GANESH CHATURTHI"
                    className="w-full px-3 py-2 border border-[#EADFC9] rounded-xl text-sm focus:outline-none focus:border-[#C82A54] bg-[#FDFBF7]"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#8A7A6E] uppercase tracking-wider">Main Heading</label>
                  <input
                    type="text"
                    value={mainHeading}
                    onChange={(e) => setMainHeading(e.target.value)}
                    placeholder="e.g. Complete Ganesh Chaturthi"
                    className="w-full px-3 py-2 border border-[#EADFC9] rounded-xl text-sm focus:outline-none focus:border-[#C82A54] bg-[#FDFBF7]"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#8A7A6E] uppercase tracking-wider">Highlighted Text (Italicized)</label>
                  <input
                    type="text"
                    value={highlightedText}
                    onChange={(e) => setHighlightedText(e.target.value)}
                    placeholder="e.g. Puja Kit"
                    className="w-full px-3 py-2 border border-[#EADFC9] rounded-xl text-sm focus:outline-none focus:border-[#C82A54] bg-[#FDFBF7]"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#8A7A6E] uppercase tracking-wider">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Sourced from the origin, complete to the last matchstick..."
                    rows={3}
                    className="w-full px-3 py-2 border border-[#EADFC9] rounded-xl text-sm focus:outline-none focus:border-[#C82A54] bg-[#FDFBF7]"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#8A7A6E] uppercase tracking-wider">Price (₹)</label>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="1499"
                      className="w-full px-3 py-2 border border-[#EADFC9] rounded-xl text-sm focus:outline-none focus:border-[#C82A54] bg-[#FDFBF7]"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#8A7A6E] uppercase tracking-wider">MRP (₹ - Struck Original)</label>
                    <input
                      type="number"
                      value={mrp}
                      onChange={(e) => setMrp(e.target.value)}
                      placeholder="1999"
                      className="w-full px-3 py-2 border border-[#EADFC9] rounded-xl text-sm focus:outline-none focus:border-[#C82A54] bg-[#FDFBF7]"
                    />
                  </div>
                </div>
              </div>

              {/* Right Column Fields */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#8A7A6E] uppercase tracking-wider block">Banner Background Image</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="URL or upload path"
                      className="flex-1 px-3 py-2 border border-[#EADFC9] rounded-xl text-sm focus:outline-none focus:border-[#C82A54] bg-[#FDFBF7]"
                      required
                    />
                    <label className="cursor-pointer flex items-center justify-center p-2.5 bg-[#FFEAEF] text-[#C82A54] rounded-xl hover:bg-[#FFD6E2] transition-colors">
                      <Upload size={18} />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                  {uploading && <p className="text-[10px] text-[#C82A54] animate-pulse">Uploading file to server...</p>}

                  {imageUrl && (
                    <div className="relative mt-2 w-full h-36 border border-[#EADFC9] rounded-xl overflow-hidden bg-[#FDFBF7] flex items-center justify-center">
                      <img src={imageUrl} alt="Banner Preview" className="max-w-full max-h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setImageUrl("")}
                        className="absolute top-2 right-2 bg-black/60 text-white p-1 rounded-full hover:bg-black"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#8A7A6E] uppercase tracking-wider">Order-By Limit Date</label>
                    <input
                      type="datetime-local"
                      value={orderByDate}
                      onChange={(e) => setOrderByDate(e.target.value)}
                      className="w-full px-3 py-2 border border-[#EADFC9] rounded-xl text-sm focus:outline-none focus:border-[#C82A54] bg-[#FDFBF7]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#8A7A6E] uppercase tracking-wider">Festival Date</label>
                    <input
                      type="datetime-local"
                      value={festivalDate}
                      onChange={(e) => setFestivalDate(e.target.value)}
                      className="w-full px-3 py-2 border border-[#EADFC9] rounded-xl text-sm focus:outline-none focus:border-[#C82A54] bg-[#FDFBF7]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#8A7A6E] uppercase tracking-wider">Primary CTA Text</label>
                    <input
                      type="text"
                      value={primaryCtaText}
                      onChange={(e) => setPrimaryCtaText(e.target.value)}
                      placeholder="Pre-book Kit now ›"
                      className="w-full px-3 py-2 border border-[#EADFC9] rounded-xl text-sm focus:outline-none focus:border-[#C82A54] bg-[#FDFBF7]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#8A7A6E] uppercase tracking-wider">Primary CTA Link</label>
                    <input
                      type="text"
                      value={primaryCtaLink}
                      onChange={(e) => setPrimaryCtaLink(e.target.value)}
                      placeholder="/cart"
                      className="w-full px-3 py-2 border border-[#EADFC9] rounded-xl text-sm focus:outline-none focus:border-[#C82A54] bg-[#FDFBF7]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#8A7A6E] uppercase tracking-wider">Secondary CTA Text</label>
                    <input
                      type="text"
                      value={secondaryCtaText}
                      onChange={(e) => setSecondaryCtaText(e.target.value)}
                      placeholder="View Kit Details"
                      className="w-full px-3 py-2 border border-[#EADFC9] rounded-xl text-sm focus:outline-none focus:border-[#C82A54] bg-[#FDFBF7]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#8A7A6E] uppercase tracking-wider">Secondary CTA Link</label>
                    <input
                      type="text"
                      value={secondaryCtaLink}
                      onChange={(e) => setSecondaryCtaLink(e.target.value)}
                      placeholder="/ritual-kits"
                      className="w-full px-3 py-2 border border-[#EADFC9] rounded-xl text-sm focus:outline-none focus:border-[#C82A54] bg-[#FDFBF7]"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-[#F2ECE4]">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 border border-[#EADFC9] text-[#6A5A4E] text-xs font-bold rounded-xl hover:bg-[#FDFBF7]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || uploading}
                className="px-5 py-2 bg-[#C82A54] text-white text-xs font-bold rounded-xl hover:bg-[#B02047] disabled:opacity-50 transition-colors"
              >
                {submitting ? "Saving changes..." : editingId ? "Update Banner" : "Save Banner"}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-[#C82A54] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {banners.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-[#EADFC9]">
              <LayoutDashboard size={48} className="mx-auto text-[#8A7A6E] mb-3 opacity-60" />
              <h3 className="text-base font-serif font-bold text-[#3A332C]">No banners configured</h3>
              <p className="text-sm text-[#8A7A6E] mt-1">Create your first homepage hero banner to get started.</p>
            </div>
          ) : (
            banners.map((b) => (
              <div
                key={b.id}
                className={`bg-white p-5 rounded-2xl border transition-all ${
                  b.isActive ? "border-[#C82A54] ring-2 ring-[#FFEAEF]" : "border-[#EADFC9]"
                } flex flex-col md:flex-row gap-6 items-start`}
              >
                {/* Image Preview */}
                <div className="w-full md:w-48 h-32 rounded-xl overflow-hidden bg-[#FDFBF7] border border-[#F2ECE4] flex-shrink-0">
                  <img src={b.imageUrl} alt={b.festivalTitle} className="w-full h-full object-cover" />
                </div>

                {/* Content details */}
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#8A7A6E]">
                      {b.festivalTitle}
                    </span>
                    {b.isActive ? (
                      <span className="text-[10px] font-bold text-[#C82A54] bg-[#FFEAEF] px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Check size={10} /> Active
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-[#6A5A4E] bg-[#F9F5EC] px-2 py-0.5 rounded-full">
                        Inactive
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-serif font-bold text-[#3A332C]">
                    {b.mainHeading} <em className="text-[#C82A54] not-italic font-sans font-bold">({b.highlightedText})</em>
                  </h3>

                  <p className="text-xs text-[#6A5A4E] line-clamp-2 leading-relaxed">
                    {b.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2 text-xs font-semibold text-[#8A7A6E]">
                    <div>
                      Prebook: <span className="text-[#3A332C] font-bold">₹{b.price}</span>
                      {b.mrp && <span className="line-through text-[#8A7A6E] ml-1.5">₹{b.mrp}</span>}
                    </div>
                    {b.orderByDate && (
                      <div>
                        Order limit: <span className="text-[#3A332C] font-bold">{new Date(b.orderByDate).toLocaleDateString()}</span>
                      </div>
                    )}
                    {b.festivalDate && (
                      <div>
                        Event: <span className="text-[#3A332C] font-bold">{new Date(b.festivalDate).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex md:flex-col gap-2 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-[#F2ECE4]">
                  <button
                    onClick={() => handleEditClick(b)}
                    className="flex-1 md:flex-none p-2 bg-[#F9F5EC] text-[#6A5A4E] hover:text-[#C82A54] rounded-lg transition-colors flex items-center justify-center gap-1 text-xs font-bold"
                  >
                    <Pencil size={14} />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(b.id)}
                    className="flex-1 md:flex-none p-2 bg-[#FFEAEF] text-[#C82A54] hover:bg-[#FFD6E2] rounded-lg transition-colors flex items-center justify-center gap-1 text-xs font-bold"
                  >
                    <Trash2 size={14} />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
