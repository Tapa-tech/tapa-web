"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Edit2, Trash2, Loader2, ArrowRight, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface RitualKit {
  id: string;
  name: string;
  hindi?: string;
  occ: string;
  deity: string;
  price: number;
  inStock: boolean;
  stockLeft?: number;
  delivery: string;
  isFeatured: boolean;
  updatedAt: string;
}

export default function AdminKitsList() {
  const router = useRouter();
  const [kits, setKits] = useState<RitualKit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function loadKits() {
    try {
      const res = await fetch("/api/admin/ritual-kits");
      if (res.ok) {
        const data = await res.json();
        setKits(data || []);
      } else {
        throw new Error("Failed to load inventory kits list");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load kits");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadKits();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm(`Are you sure you want to delete kit: "${id}"? This cannot be undone.`)) {
      return;
    }

    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/ritual-kits/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setKits((prev) => prev.filter((k) => k.id !== id));
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete kit");
      }
    } catch (err) {
      console.error(err);
      alert("Network error. Failed to delete kit.");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-[#C82A54] animate-spin" />
        <span className="text-[#8A7A6E] mt-3 font-medium">Loading inventory catalog...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn font-sans">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#F2ECE4] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5 text-xs text-[#8A7A6E]">
            <Link href="/admin" className="hover:underline">Dashboard</Link>
            <span>&gt;</span>
            <span className="font-semibold text-[#6A5A4E]">Ritual Kits</span>
          </div>
          <h1 className="font-serif font-bold text-3xl text-[#3A332C]">
            Ritual Samagri Kits
          </h1>
          <p className="text-sm text-[#6A5A4E] mt-1">
            Configure delivery, inventory, stock counts, and featured listings.
          </p>
        </div>

        <Link
          href="/admin/ritual-kits/new"
          className="flex items-center gap-2 bg-[#C82A54] hover:bg-[#B02047] text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-sm transition-colors self-start md:self-auto"
        >
          <Plus size={14} />
          <span>New Ritual Kit</span>
        </Link>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm font-semibold">
          ⚠ {error}
        </div>
      )}

      {kits.length === 0 ? (
        <div className="text-center p-12 bg-[#FAF6EC] border border-[#EADFC9] rounded-2xl">
          <div className="text-3xl mb-2">📦</div>
          <h3 className="font-serif font-bold text-lg text-[#3A332C]">No Ritual Kits in database</h3>
          <p className="text-xs text-[#8A7A6E] mt-1">
            Click "New Ritual Kit" above to compose and add a kit to the inventory catalog.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-[#EADFC9] rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#FAF6EC] border-b border-[#EADFC9] text-[#6A5A4E] font-bold uppercase tracking-wider">
                  <th className="p-4">Name / ID</th>
                  <th className="p-4">Occasion / Deity</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Stock Status</th>
                  <th className="p-4">Featured</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2ECE4] text-[#3A332C]">
                {kits.map((kit) => (
                  <tr key={kit.id} className="hover:bg-[#FAF6EC] transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-sm text-[#3A332C]">{kit.name}</div>
                      {kit.hindi && <div className="text-[#8A7A6E] mt-0.5">{kit.hindi}</div>}
                      <div className="text-[10px] text-[#A09084] font-semibold mt-1">id: {kit.id}</div>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded bg-blue-50 border border-blue-100 text-blue-700 font-bold uppercase text-[9px] mr-1.5">
                        {kit.occ}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-amber-50 border border-amber-100 text-amber-700 font-bold uppercase text-[9px]">
                        {kit.deity}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-sm">
                      ₹{kit.price.toLocaleString()}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${kit.inStock ? "bg-green-500" : "bg-red-500"}`}></span>
                        <span className="font-semibold">{kit.inStock ? "In Stock" : "Out of Stock"}</span>
                      </div>
                      {kit.stockLeft !== null && kit.stockLeft !== undefined && (
                        <div className="text-[10px] text-red-500 font-bold mt-1">⚡ {kit.stockLeft} units left</div>
                      )}
                    </td>
                    <td className="p-4">
                      {kit.isFeatured ? (
                        <span className="px-2 py-0.5 rounded bg-[#FDF6F7] border border-[#FAD2DA] text-[#C82A54] font-bold text-[9px]">
                          ⭐ Featured
                        </span>
                      ) : (
                        <span className="text-[#A09084]">No</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/ritual-kits/${kit.id}/edit`}
                          className="p-1.5 hover:bg-[#F2ECE4] rounded-lg text-[#6A5A4E] transition-colors"
                          title="Edit Details"
                        >
                          <Edit2 size={14} />
                        </Link>
                        <button
                          disabled={deletingId === kit.id}
                          onClick={() => handleDelete(kit.id)}
                          className="p-1.5 hover:bg-red-50 rounded-lg text-[#C82A54] transition-colors cursor-pointer"
                          title="Delete Item"
                        >
                          {deletingId === kit.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Trash2 size={14} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
