"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Save, ArrowLeft, Loader2, Sparkles } from "lucide-react";
import Link from "next/link";

interface RitualKitFormProps {
  initialId?: string;
}

export default function RitualKitForm({ initialId }: RitualKitFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(initialId ? true : false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [hindi, setHindi] = useState("");
  const [occ, setOcc] = useState("navratri");
  const [deity, setDeity] = useState("devi");
  const [price, setPrice] = useState("");
  const [mrp, setMrp] = useState("");
  const [inStock, setInStock] = useState(true);
  const [stockLeft, setStockLeft] = useState("");
  const [itemsCount, setItemsCount] = useState("");
  const [ribbon, setRibbon] = useState("");
  const [delivery, setDelivery] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    if (initialId) {
      const fetchKit = async () => {
        try {
          const res = await fetch(`/api/admin/ritual-kits/${initialId}`);
          if (!res.ok) {
            throw new Error("Failed to load ritual kit details");
          }
          const data = await res.json();
          setId(data.id || "");
          setName(data.name || "");
          setHindi(data.hindi || "");
          setOcc(data.occ || "navratri");
          setDeity(data.deity || "devi");
          setPrice(data.price?.toString() || "");
          setMrp(data.mrp?.toString() || "");
          setInStock(data.inStock ?? true);
          setStockLeft(data.stockLeft?.toString() || "");
          setItemsCount(data.itemsCount || "");
          setRibbon(data.ribbon || "");
          setDelivery(data.delivery || "");
          setIsFeatured(data.isFeatured || false);
          setDescription(data.description || "");
          setImageUrl(data.imageUrl || "");
        } catch (err: any) {
          console.error(err);
          setError(err.message || "Failed to load kit");
        } finally {
          setLoading(false);
        }
      }
      fetchKit();
    }
  }, [initialId]);

  const handleNameChange = (val: string) => {
    setName(val);
    
    if (!initialId) {
      const clean = val
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");
      setId(clean);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    if (!id.trim() || !name.trim()) {
      setError("Slug ID and Name are required.");
      setSubmitting(false);
      return;
    }

    const payload = {
      id,
      name,
      hindi: hindi || null,
      occ,
      deity,
      price: parseFloat(price) || 0,
      mrp: mrp ? parseFloat(mrp) : null,
      inStock,
      stockLeft: stockLeft ? parseInt(stockLeft, 10) : null,
      itemsCount,
      ribbon: ribbon || null,
      delivery,
      isFeatured,
      description: description || null,
      imageUrl: imageUrl || null,
    };

    try {
      const url = initialId ? `/api/admin/ritual-kits/${initialId}` : "/api/admin/ritual-kits";
      const method = initialId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.error || "Failed to save ritual kit");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/admin/ritual-kits");
      }, 1500);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred while saving");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-[#C82A54] animate-spin" />
        <span className="text-[#8A7A6E] mt-3 font-medium">Loading kit details...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12 font-sans">
      
      <div className="flex items-center justify-between border-b border-[#F2ECE4] pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/ritual-kits"
            className="p-2 hover:bg-[#FAF6EC] rounded-xl text-[#6A5A4E] transition-colors"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="font-serif font-bold text-2xl text-[#3A332C]">
              {initialId ? "Edit Ritual Kit" : "Create New Ritual Kit"}
            </h1>
            <p className="text-xs text-[#8A7A6E] mt-0.5">
              Manage complete samagri item box catalog details.
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm font-semibold">
          ⚠ {error}
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-2xl text-green-700 text-sm font-semibold flex items-center gap-2">
          <Sparkles size={16} className="animate-pulse" />
          <span>Success! Redirecting back to inventory listing...</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white border border-[#EADFC9] rounded-2xl p-6 md:p-8 space-y-6 shadow-sm">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#6A5A4E] uppercase tracking-wider">
              Kit Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. Shubh Sampada"
              className="w-full px-4 py-2.5 rounded-xl border border-[#DED6C9] focus:outline-none focus:border-[#C82A54] text-sm text-[#3A332C] bg-white transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#6A5A4E] uppercase tracking-wider">
              Slug ID (Unique key)
            </label>
            <input
              type="text"
              required
              disabled={!!initialId}
              value={id}
              onChange={(e) => setId(e.target.value)}
              placeholder="e.g. shubh-sampada"
              className="w-full px-4 py-2.5 rounded-xl border border-[#DED6C9] disabled:bg-gray-50 focus:outline-none focus:border-[#C82A54] text-sm text-[#3A332C] transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#6A5A4E] uppercase tracking-wider">
              Hindi Translation Description
            </label>
            <input
              type="text"
              value={hindi}
              onChange={(e) => setHindi(e.target.value)}
              placeholder="e.g. शुभ सम्पदा — Auspicious Abundance"
              className="w-full px-4 py-2.5 rounded-xl border border-[#DED6C9] focus:outline-none focus:border-[#C82A54] text-sm text-[#3A332C] bg-white transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#6A5A4E] uppercase tracking-wider">
                Occasion Tag
              </label>
              <select
                value={occ}
                onChange={(e) => setOcc(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#DED6C9] focus:outline-none focus:border-[#C82A54] text-sm text-[#3A332C] bg-white transition-colors"
              >
                <option value="navratri">Navratri</option>
                <option value="diwali">Diwali</option>
                <option value="satyanarayan">Satyanarayan</option>
                <option value="yearround">Year-round</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#6A5A4E] uppercase tracking-wider">
                Deity
              </label>
              <select
                value={deity}
                onChange={(e) => setDeity(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#DED6C9] focus:outline-none focus:border-[#C82A54] text-sm text-[#3A332C] bg-white transition-colors"
              >
                <option value="devi">Devi</option>
                <option value="vishnu">Vishnu</option>
                <option value="devi-vishnu">Devi &amp; Vishnu</option>
              </select>
            </div>
          </div>
        </div>

        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#6A5A4E] uppercase tracking-wider">
              Price (₹)
            </label>
            <input
              type="number"
              required
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="e.g. 2199"
              className="w-full px-4 py-2.5 rounded-xl border border-[#DED6C9] focus:outline-none focus:border-[#C82A54] text-sm text-[#3A332C] bg-white transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#6A5A4E] uppercase tracking-wider">
              MRP (₹ Standard list price)
            </label>
            <input
              type="number"
              min="0"
              value={mrp}
              onChange={(e) => setMrp(e.target.value)}
              placeholder="e.g. 2600"
              className="w-full px-4 py-2.5 rounded-xl border border-[#DED6C9] focus:outline-none focus:border-[#C82A54] text-sm text-[#3A332C] bg-white transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#6A5A4E] uppercase tracking-wider">
              Items Count
            </label>
            <input
              type="text"
              required
              value={itemsCount}
              onChange={(e) => setItemsCount(e.target.value)}
              placeholder="e.g. 12 items"
              className="w-full px-4 py-2.5 rounded-xl border border-[#DED6C9] focus:outline-none focus:border-[#C82A54] text-sm text-[#3A332C] bg-white transition-colors"
            />
          </div>
        </div>

        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#6A5A4E] uppercase tracking-wider">
              Stock Ribbon Badge
            </label>
            <select
              value={ribbon}
              onChange={(e) => setRibbon(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-[#DED6C9] focus:outline-none focus:border-[#C82A54] text-sm text-[#3A332C] bg-white transition-colors"
            >
              <option value="">None</option>
              <option value="new">New</option>
              <option value="low">Low Stock</option>
              <option value="soldout">Sold Out</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#6A5A4E] uppercase tracking-wider">
              Delivery Info String
            </label>
            <input
              type="text"
              required
              value={delivery}
              onChange={(e) => setDelivery(e.target.value)}
              placeholder="e.g. 🚚 Before Navratri"
              className="w-full px-4 py-2.5 rounded-xl border border-[#DED6C9] focus:outline-none focus:border-[#C82A54] text-sm text-[#3A332C] bg-white transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#6A5A4E] uppercase tracking-wider">
              Image URL
            </label>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="e.g. /uploads/shakti-aradhana.png"
              className="w-full px-4 py-2.5 rounded-xl border border-[#DED6C9] focus:outline-none focus:border-[#C82A54] text-sm text-[#3A332C] bg-white transition-colors"
            />
          </div>
        </div>

        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="inStock"
              checked={inStock}
              onChange={(e) => setInStock(e.target.checked)}
              className="w-4 h-4 rounded text-[#C82A54] border-[#DED6C9] focus:ring-[#C82A54]"
            />
            <label htmlFor="inStock" className="text-xs font-bold text-[#6A5A4E] uppercase tracking-wider cursor-pointer">
              Is In Stock
            </label>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isFeatured"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="w-4 h-4 rounded text-[#C82A54] border-[#DED6C9] focus:ring-[#C82A54]"
            />
            <label htmlFor="isFeatured" className="text-xs font-bold text-[#6A5A4E] uppercase tracking-wider cursor-pointer">
              Is Featured Item
            </label>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#6A5A4E] uppercase tracking-wider">
              Units Left (Alert display threshold)
            </label>
            <input
              type="number"
              min="0"
              value={stockLeft}
              onChange={(e) => setStockLeft(e.target.value)}
              placeholder="e.g. 4"
              className="w-full px-4 py-2 rounded-xl border border-[#DED6C9] focus:outline-none focus:border-[#C82A54] text-sm text-[#3A332C] bg-white transition-colors"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-[#6A5A4E] uppercase tracking-wider">
            Detailed Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="Introduce the ritual kit, its components, scriptural alignment, and origin..."
            className="w-full px-4 py-3 rounded-xl border border-[#DED6C9] focus:outline-none focus:border-[#C82A54] text-sm text-[#3A332C] bg-white transition-colors resize-y"
          />
        </div>

        
        <div className="flex justify-end gap-3 border-t border-[#F2ECE4] pt-6">
          <Link
            href="/admin/ritual-kits"
            className="px-5 py-2.5 rounded-xl border border-[#DED6C9] hover:bg-[#FAF6EC] text-sm font-semibold text-[#6A5A4E] transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-2 bg-[#C82A54] hover:bg-[#B02047] disabled:bg-gray-400 text-white font-semibold text-sm px-6 py-2.5 rounded-xl shadow-sm transition-colors cursor-pointer"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save size={16} />
                <span>Save Ritual Kit</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
