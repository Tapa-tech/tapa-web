"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Save, ArrowLeft, Loader2, Sparkles, Plus, Trash2 } from "lucide-react";
import Link from "next/link";

interface ProductFormProps {
  initialId?: string;
}

interface KitItemInput {
  id?: string;
  itemName: string;
  itemFunction: string;
}

export default function ProductForm({ initialId }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(initialId ? true : false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  
  const [id, setId] = useState("");
  const [slug, setSlug] = useState("");
  const [name, setName] = useState("");
  const [type, setType] = useState<"PUJA_KIT" | "SAMAGRI_ITEM">("PUJA_KIT");
  const [category, setCategory] = useState("navratri");
  const [price, setPrice] = useState("");
  const [mrp, setMrp] = useState("");
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");
  const [codAvailability, setCodAvailability] = useState<"AVAILABLE" | "NOT_AVAILABLE">("AVAILABLE");
  const [images, setImages] = useState("");
  const [linkedRitualGuideId, setLinkedRitualGuideId] = useState("");
  
  
  const [kitItems, setKitItems] = useState<KitItemInput[]>([]);
  
  
  const [guides, setGuides] = useState<any[]>([]);

  
  useEffect(() => {
    async function loadGuides() {
      try {
        const res = await fetch("/api/public/ritual-guides");
        if (res.ok) {
          const data = await res.json();
          setGuides(data || []);
        }
      } catch (err) {
        console.error("Failed to load guides list:", err);
      }
    }
    loadGuides();
  }, []);

  
  useEffect(() => {
    if (initialId) {
      const fetchProduct = async () => {
        try {
          const res = await fetch(`/api/admin/products/${initialId}`);
          if (!res.ok) {
            throw new Error("Failed to load product details");
          }
          const data = await res.json();
          setId(data.id || "");
          setSlug(data.slug || "");
          setName(data.name || "");
          setType(data.type || "PUJA_KIT");
          setCategory(data.category || "navratri");
          setPrice(data.price?.toString() || "");
          setMrp(data.mrp?.toString() || "");
          setStock(data.stock?.toString() || "0");
          setDescription(data.description || "");
          setCodAvailability(data.codAvailability || "AVAILABLE");
          setImages(data.images?.join("\n") || "");
          setLinkedRitualGuideId(data.linkedRitualGuideId || "");
          
          if (data.kitItems) {
            setKitItems(data.kitItems.map((item: any) => ({
              id: item.id,
              itemName: item.itemName || "",
              itemFunction: item.itemFunction || "",
            })));
          }
        } catch (err: any) {
          console.error(err);
          setError(err.message || "Failed to load product");
        } finally {
          setLoading(false);
        }
      };
      fetchProduct();
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
      setSlug(clean);
    }
  };

  const handleAddKitItem = () => {
    setKitItems((prev) => [...prev, { itemName: "", itemFunction: "" }]);
  };

  const handleRemoveKitItem = (index: number) => {
    setKitItems((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleKitItemChange = (index: number, field: "itemName" | "itemFunction", value: string) => {
    setKitItems((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: value,
      };
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    if (!id.trim() || !name.trim()) {
      setError("Product ID and Name are required.");
      setSubmitting(false);
      return;
    }

    const payload = {
      id: initialId ? undefined : id,
      slug: slug || id,
      name,
      type,
      category,
      price: parseFloat(price) || 0,
      mrp: mrp ? parseFloat(mrp) : null,
      stock: parseInt(stock, 10) || 0,
      description,
      codAvailability,
      images: images.split("\n").map((img) => img.trim()).filter(Boolean),
      linkedRitualGuideId: linkedRitualGuideId || null,
      kitItems: type === "PUJA_KIT" ? kitItems.map((item) => ({
        itemName: item.itemName,
        itemFunction: item.itemFunction,
      })) : [],
    };

    try {
      const url = initialId ? `/api/admin/products/${initialId}` : "/api/admin/products";
      const method = initialId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.error || "Failed to save product");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/admin/products");
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
        <span className="text-[#8A7A6E] mt-3 font-semibold">Loading product details...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12 font-sans">
      
      <div className="flex items-center justify-between border-b border-[#F2ECE4] pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="p-2 hover:bg-[#FAF6EC] rounded-xl text-[#6A5A4E] transition-colors"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="font-serif font-bold text-2xl text-[#3A332C]">
              {initialId ? "Edit Product" : "Create New Product"}
            </h1>
            <p className="text-xs text-[#8A7A6E] mt-0.5">
              Manage complete product specifications, pricing, and catalog details.
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-xs font-semibold">
          ⚠️ {error}
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-2xl text-green-700 text-xs font-semibold flex items-center gap-2">
          <Sparkles size={16} className="animate-pulse" />
          <span>Success! Redirecting back to product listing...</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white border border-[#EADFC9] rounded-2xl p-6 md:p-8 space-y-6 shadow-sm">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#6A5A4E] uppercase tracking-wider">
              Product Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. Shubh Sampada Diwali Kit"
              className="w-full px-4 py-2.5 rounded-xl border border-[#DED6C9] focus:outline-none focus:border-[#C82A54] text-sm text-[#3A332C] bg-white transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#6A5A4E] uppercase tracking-wider">
              Product ID (Slug / Unique ID)
            </label>
            <input
              type="text"
              required
              disabled={!!initialId}
              value={id}
              onChange={(e) => {
                setId(e.target.value);
                setSlug(e.target.value);
              }}
              placeholder="e.g. shubh-sampada"
              className="w-full px-4 py-2.5 rounded-xl border border-[#DED6C9] disabled:bg-gray-50 focus:outline-none focus:border-[#C82A54] text-sm text-[#3A332C] transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#6A5A4E] uppercase tracking-wider">
              Product Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="w-full px-4 py-2.5 rounded-xl border border-[#DED6C9] focus:outline-none focus:border-[#C82A54] text-sm text-[#3A332C] bg-white transition-colors"
            >
              <option value="PUJA_KIT">Puja Kit</option>
              <option value="SAMAGRI_ITEM">Samagri Item (Individual)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#6A5A4E] uppercase tracking-wider">
              Category (Occasion Tag)
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-[#DED6C9] focus:outline-none focus:border-[#C82A54] text-sm text-[#3A332C] bg-white transition-colors"
            >
              <option value="navratri">Navratri</option>
              <option value="diwali">Diwali</option>
              <option value="satyanarayan">Satyanarayan</option>
              <option value="sundarkand">Sundarkand</option>
              <option value="yearround">Year-round</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#6A5A4E] uppercase tracking-wider">
              Cash on Delivery (COD)
            </label>
            <select
              value={codAvailability}
              onChange={(e) => setCodAvailability(e.target.value as any)}
              className="w-full px-4 py-2.5 rounded-xl border border-[#DED6C9] focus:outline-none focus:border-[#C82A54] text-sm text-[#3A332C] bg-white transition-colors"
            >
              <option value="AVAILABLE">Available</option>
              <option value="NOT_AVAILABLE">Restricted (Not Available)</option>
            </select>
          </div>
        </div>

        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#6A5A4E] uppercase tracking-wider">
              Price (₹ Selling Price)
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
              MRP (₹ List Price - optional)
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
              Inventory Stock Level
            </label>
            <input
              type="number"
              required
              min="0"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              placeholder="e.g. 50"
              className="w-full px-4 py-2.5 rounded-xl border border-[#DED6C9] focus:outline-none focus:border-[#C82A54] text-sm text-[#3A332C] bg-white transition-colors"
            />
          </div>
        </div>

        
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-[#6A5A4E] uppercase tracking-wider">
            Linked Companion Ritual Guide
          </label>
          <select
            value={linkedRitualGuideId}
            onChange={(e) => setLinkedRitualGuideId(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-[#DED6C9] focus:outline-none focus:border-[#C82A54] text-sm text-[#3A332C] bg-white transition-colors"
          >
            <option value="">None (Not linked to any guide)</option>
            {guides.map((g) => (
              <option key={g.id} value={g.id}>
                {g.title} ({g.category})
              </option>
            ))}
          </select>
          <p className="text-[10px] text-sub-text">
            Linking a guide allows this product to automatically activate the checkout CTA inside the guide&apos;s samagri checklist.
          </p>
        </div>

        
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-[#6A5A4E] uppercase tracking-wider">
            Image URLs (One absolute URL per line)
          </label>
          <textarea
            value={images}
            onChange={(e) => setImages(e.target.value)}
            rows={3}
            placeholder="e.g. https://example.com/images/diwali-kit-1.jpg"
            className="w-full px-4 py-2.5 rounded-xl border border-[#DED6C9] focus:outline-none focus:border-[#C82A54] text-xs text-[#3A332C] bg-white transition-colors resize-y font-mono"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-[#6A5A4E] uppercase tracking-wider">
            Detailed Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="Introduce the product, its components, shastric references, and instructions..."
            className="w-full px-4 py-3 rounded-xl border border-[#DED6C9] focus:outline-none focus:border-[#C82A54] text-sm text-[#3A332C] bg-white transition-colors resize-y"
          />
        </div>

        
        {type === "PUJA_KIT" && (
          <div className="border border-[#EADFC9] rounded-2xl p-5 md:p-6 bg-[#FAF6EC]/30 space-y-4">
            <div className="flex justify-between items-center border-b border-[#EADFC9] pb-3 select-none">
              <div>
                <h4 className="font-serif font-bold text-base text-[#3A332C]">Puja Kit Samagri Checklist</h4>
                <p className="text-[10px] text-[#8A7A6E]">Add individual samagri items contained inside this kit package.</p>
              </div>
              <button
                type="button"
                onClick={handleAddKitItem}
                className="flex items-center gap-1.5 bg-[#C82A54] hover:bg-[#B02047] text-white font-bold text-[10px] uppercase px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
              >
                <Plus size={12} />
                <span>Add Item</span>
              </button>
            </div>

            {kitItems.length === 0 ? (
              <div className="text-center py-6 text-xs text-sub-text italic select-none">
                No items added yet. Click &quot;Add Item&quot; to begin compiling checklist.
              </div>
            ) : (
              <div className="space-y-3">
                {kitItems.map((kitem, idx) => (
                  <div key={idx} className="flex gap-3 items-start bg-white border border-[#EADFC9] rounded-xl p-3">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-[#8A7A6E] uppercase">Item Name</label>
                        <input
                          type="text"
                          required
                          value={kitem.itemName}
                          onChange={(e) => handleKitItemChange(idx, "itemName", e.target.value)}
                          placeholder="e.g. Gangajal"
                          className="w-full px-3 py-1.5 rounded-lg border border-[#DED6C9] focus:outline-none focus:border-[#C82A54] text-xs text-[#3A332C]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-[#8A7A6E] uppercase">Scriptural Function</label>
                        <input
                          type="text"
                          required
                          value={kitem.itemFunction}
                          onChange={(e) => handleKitItemChange(idx, "itemFunction", e.target.value)}
                          placeholder="e.g. For purification (Pavitrikaran)"
                          className="w-full px-3 py-1.5 rounded-lg border border-[#DED6C9] focus:outline-none focus:border-[#C82A54] text-xs text-[#3A332C]"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveKitItem(idx)}
                      className="p-1.5 hover:bg-red-50 rounded-lg text-red-500 hover:text-red-700 transition-colors mt-4 shrink-0 cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        
        <div className="flex justify-end gap-3 border-t border-[#F2ECE4] pt-6 select-none">
          <Link
            href="/admin/products"
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
                <span>Save Product</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
