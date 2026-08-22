"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Edit2, Trash2, Loader2, Package } from "lucide-react";
import { useRouter } from "next/navigation";

interface Product {
  id: string;
  name: string;
  slug: string;
  type: "PUJA_KIT" | "SAMAGRI_ITEM";
  category: string;
  price: string;
  mrp?: string;
  stock: number;
  codAvailability: "AVAILABLE" | "NOT_AVAILABLE";
  updatedAt: string;
}

export default function AdminProductsList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function loadProducts() {
    try {
      const res = await fetch("/api/admin/products");
      if (res.ok) {
        const data = await res.json();
        setProducts(data || []);
      } else {
        throw new Error("Failed to load product catalog");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete product "${name}"? This cannot be undone.`)) {
      return;
    }

    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete product");
      }
    } catch (err) {
      console.error(err);
      alert("Network error. Failed to delete product.");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-[#C82A54] animate-spin" />
        <span className="text-[#8A7A6E] mt-3 font-semibold">Loading product catalog...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F2ECE4] pb-4 select-none">
        <div>
          <div className="flex items-center gap-2 mb-1.5 text-[10px] text-[#8A7A6E] uppercase font-bold tracking-wider">
            <Link href="/admin" className="hover:underline">Dashboard</Link>
            <span>&gt;</span>
            <span className="text-[#6A5A4E]">Products</span>
          </div>
          <h1 className="font-serif font-bold text-3xl text-[#3A332C]">
            Inventory Products &amp; Kits
          </h1>
          <p className="text-xs text-[#6A5A4E] mt-1">
            Manage Puja Kits and individual Samagri items, pricing, inventory stock status, and configurations.
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 bg-[#C82A54] hover:bg-[#B02047] text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-sm transition-colors self-start sm:self-auto"
        >
          <Plus size={14} />
          <span>New Product</span>
        </Link>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-xs font-semibold">
          ⚠️ {error}
        </div>
      )}

      {products.length === 0 ? (
        <div className="text-center p-12 bg-[#FAF6EC] border border-[#EADFC9] rounded-2xl select-none">
          <Package className="mx-auto text-sub-text animate-pulse mb-3" size={36} />
          <h3 className="font-serif font-bold text-lg text-[#3A332C]">No Products Found</h3>
          <p className="text-xs text-[#8A7A6E] mt-1">
            Create a new Puja Kit or Samagri item above to begin stocking the inventory.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-[#EADFC9] rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#FAF6EC] border-b border-[#EADFC9] text-[#6A5A4E] font-bold uppercase tracking-wider">
                  <th className="p-4">Name</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price / MRP</th>
                  <th className="p-4">Stock Status</th>
                  <th className="p-4">COD Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2ECE4] text-[#3A332C]">
                {products.map((prod) => (
                  <tr key={prod.id} className="hover:bg-[#FAF6EC] transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-sm text-[#3A332C]">{prod.name}</div>
                      <div className="text-[10px] text-[#A09084] font-semibold mt-1">ID: {prod.id} · Slug: {prod.slug}</div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${prod.type === "PUJA_KIT" ? "bg-amber-50 border border-amber-100 text-amber-700" : "bg-purple-50 border border-purple-100 text-purple-700"}`}>
                        {prod.type === "PUJA_KIT" ? "Puja Kit" : "Samagri Item"}
                      </span>
                    </td>
                    <td className="p-4 font-semibold uppercase text-[#6A5A4E]">
                      {prod.category}
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-sm">₹{Number(prod.price).toLocaleString()}</div>
                      {prod.mrp && <div className="text-[10px] text-[#A09084] line-through">₹{Number(prod.mrp).toLocaleString()}</div>}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${prod.stock > 0 ? "bg-green-500" : "bg-red-500"}`}></span>
                        <span className="font-semibold">{prod.stock > 0 ? `${prod.stock} units` : "Out of Stock"}</span>
                      </div>
                    </td>
                    <td className="p-4 font-semibold">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${prod.codAvailability === "AVAILABLE" ? "bg-green-50 border border-green-100 text-green-700" : "bg-red-50 border border-red-100 text-red-700"}`}>
                        {prod.codAvailability === "AVAILABLE" ? "COD Yes" : "COD No"}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/products/${prod.id}/edit`}
                          className="p-1.5 hover:bg-[#F2ECE4] rounded-lg text-[#6A5A4E] transition-colors"
                          title="Edit Details"
                        >
                          <Edit2 size={14} />
                        </Link>
                        <button
                          disabled={deletingId === prod.id}
                          onClick={() => handleDelete(prod.id, prod.name)}
                          className="p-1.5 hover:bg-red-50 rounded-lg text-[#C82A54] transition-colors cursor-pointer"
                          title="Delete Item"
                        >
                          {deletingId === prod.id ? (
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
