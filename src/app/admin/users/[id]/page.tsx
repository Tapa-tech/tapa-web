"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, User, ShieldCheck, Download, ShoppingBag, BookMarked, ToggleLeft, ToggleRight } from "lucide-react";

interface SavedGuide {
  id: string;
  title: string;
  slug: string;
}

interface DownloadRecord {
  id: string;
  contentType: string;
  contentTitle: string;
  downloadedAt: string;
  ipAddress: string;
  userAgent: string;
}

interface OrderItem {
  id: string;
  productName: string;
  quantity: number;
  priceAtOrder: string;
}

interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  orderStatus: string;
  paymentMethod: string;
  paymentStatus: string;
  totalAmount: string;
  items: OrderItem[];
}

interface UserDetail {
  id: string;
  phone: string | null;
  email: string | null;
  name: string | null;
  role: string;
  createdAt: string;
  consentGiven: boolean;
  consentGivenAt: string | null;
  consentVersion: string | null;
  consentIpAddress: string | null;
  isActive: boolean;
  savedGuides: SavedGuide[];
  downloadRecords: DownloadRecord[];
  orders: Order[];
}

export default function UserDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const fetchUser = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${params.id}`);
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      } else {
        setError("Failed to retrieve user profile data.");
      }
    } catch {
      setError("Error connecting to server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [params.id]);

  const handleRoleChange = async (newRole: string) => {
    try {
      const res = await fetch(`/api/admin/users/${params.id}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      if (res.ok) {
        triggerToast(`Role updated to ${newRole} ✓`);
        setUser((prev) => (prev ? { ...prev, role: newRole } : null));
      } else {
        const err = await res.json();
        triggerToast(err.error || "Failed to update role.");
      }
    } catch {
      triggerToast("Error updating role.");
    }
  };

  const handleStatusChange = async (nextActiveState: boolean) => {
    try {
      const res = await fetch(`/api/admin/users/${params.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: nextActiveState }),
      });
      if (res.ok) {
        triggerToast(nextActiveState ? "Account activated ✓" : "Account deactivated ✓");
        setUser((prev) => (prev ? { ...prev, isActive: nextActiveState } : null));
      } else {
        const err = await res.json();
        triggerToast(err.error || "Failed to update account status.");
      }
    } catch {
      triggerToast("Error updating account status.");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 min-h-[400px]">
        <div className="w-8 h-8 border-4 border-[#C82A54] border-t-transparent rounded-full animate-spin"></div>
        <span className="mt-3 text-sm font-semibold text-[#6A5A4E]">Compiling user aggregated files...</span>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="bg-[#FFEAEF] border border-[#FAD2DA] rounded-2xl p-6 text-center max-w-lg mx-auto mt-10">
        <span className="text-3xl block mb-2">🔒</span>
        <h2 className="font-serif font-bold text-lg text-[#C82A54] mb-2">Audit restrained</h2>
        <p className="text-sm text-[#8A6D74]">{error || "User details could not be parsed."}</p>
        <Link href="/admin/users" className="mt-4 inline-block text-xs font-bold text-pink hover:underline">
          Back to Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans">
      
      <div>
        <Link
          href="/admin/users"
          className="inline-flex items-center gap-1 text-xs font-bold text-[#8A7A6E] hover:text-[#C82A54] transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to Users Directory</span>
        </Link>
      </div>

      
      <div className="bg-white border border-[#EADFC9] rounded-2xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-full bg-[#FAF6EC] border border-[#EADFC9] text-[#C82A54] flex items-center justify-center flex-shrink-0">
            <User size={28} />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="font-serif font-bold text-2xl text-dark">
                {user.name || "Anonymous Practitioner"}
              </h1>
              {!user.isActive && (
                <span className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-200 rounded px-2 py-0.5 uppercase tracking-wide">
                  Deactivated
                </span>
              )}
            </div>
            <p className="text-xs text-[#8A7A6E] mt-1.5 leading-relaxed font-mono">
              User ID: {user.id} &nbsp;·&nbsp; Joined: {new Date(user.createdAt).toLocaleDateString("en-IN")}
            </p>
            <div className="mt-3.5 flex flex-wrap gap-2 text-[10px] font-bold uppercase tracking-wider">
              <span className={`px-2.5 py-0.5 rounded-full border ${
                user.role === "SUPER_ADMIN" ? "bg-[#FFEAEF] border-[#FAD2DA] text-[#C82A54]" :
                user.role === "ADMIN" ? "bg-green-50 border-green-100 text-green-700" :
                "bg-gray-100 border-gray-200 text-gray-600"
              }`}>
                {user.role}
              </span>
              <span className={`px-2.5 py-0.5 rounded-full border ${
                user.isActive ? "bg-green-50 border-green-100 text-green-700" : "bg-red-50 border-red-100 text-red-700"
              }`}>
                {user.isActive ? "Active Account" : "Suspended"}
              </span>
            </div>
          </div>
        </div>

        
        <div className="bg-[#FAF6EC] border border-[#EADFC9] rounded-xl p-5 md:max-w-xs w-full shadow-inner space-y-4">
          <div className="font-bold text-[9px] uppercase text-[#C82A54] tracking-wider border-b border-[#EADFC9]/50 pb-1.5">
            Super Admin Controls
          </div>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center gap-4">
              <span className="font-semibold text-[#6A5A4E]">Change Role</span>
              <select
                value={user.role}
                onChange={(e) => handleRoleChange(e.target.value)}
                className="text-xs border border-gray-300 rounded-lg px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-pink text-dark"
              >
                <option value="CUSTOMER">Customer</option>
                <option value="ADMIN">Admin</option>
                <option value="SUPER_ADMIN">Super Admin</option>
              </select>
            </div>

            <div className="flex justify-between items-center gap-4 border-t border-[#EADFC9]/50 pt-3">
              <span className="font-semibold text-[#6A5A4E]">Account Status</span>
              <button
                onClick={() => handleStatusChange(!user.isActive)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border font-bold text-[11px] transition-colors ${
                  user.isActive
                    ? "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                    : "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                }`}
              >
                {user.isActive ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                <span>{user.isActive ? "Deactivate" : "Activate"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-1 space-y-8">
          
          <div className="bg-white border border-[#EADFC9] rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="font-serif font-bold text-lg text-dark flex items-center gap-1.5 border-b border-[#F2ECE4] pb-2">
              <ShieldCheck size={18} className="text-green-600" />
              <span>Consent Auditing (DPDP)</span>
            </h3>
            {user.consentGiven ? (
              <div className="space-y-3.5 text-xs">
                <div className="bg-green-50 border border-green-100 text-green-700 px-3 py-2 rounded-xl font-semibold text-center">
                  Consent Verified ✓ (Active)
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[#8A7A6E]">Version</span>
                    <span className="font-bold text-dark">{user.consentVersion || "v1.0"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8A7A6E]">Recorded IP</span>
                    <span className="font-mono text-dark font-semibold">{user.consentIpAddress || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8A7A6E]">Agreed Date</span>
                    <span className="font-mono text-dark text-[11px] font-semibold">
                      {user.consentGivenAt ? new Date(user.consentGivenAt).toLocaleString("en-IN") : "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-red-50 border border-red-100 text-red-700 px-3 py-2 rounded-xl font-semibold text-center text-xs">
                Consent Missing ✗
              </div>
            )}
          </div>

          
          <div className="bg-white border border-[#EADFC9] rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="font-serif font-bold text-lg text-dark flex items-center gap-1.5 border-b border-[#F2ECE4] pb-2">
              <BookMarked size={18} className="text-pink" />
              <span>Saved Ritual Guides ({user.savedGuides.length})</span>
            </h3>
            {user.savedGuides.length === 0 ? (
              <p className="text-xs text-[#8A7A6E] italic text-center py-4">No ritual guides saved yet.</p>
            ) : (
              <div className="divide-y divide-[#F2ECE4] text-xs">
                {user.savedGuides.map((guide) => (
                  <div key={guide.id} className="py-2.5 flex justify-between items-center gap-4">
                    <span className="font-semibold text-dark">{guide.title}</span>
                    <a
                      href={`/ritual-guides/${guide.slug}`}
                      target="_blank"
                      className="text-pink hover:underline text-[10px] font-bold uppercase tracking-wider"
                    >
                      View
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        
        <div className="lg:col-span-2 space-y-8">
          
          <div className="bg-white border border-[#EADFC9] rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="font-serif font-bold text-lg text-dark flex items-center gap-1.5 border-b border-[#F2ECE4] pb-2">
              <ShoppingBag size={18} className="text-[#C82A54]" />
              <span>E-Commerce Orders Placed ({user.orders.length})</span>
            </h3>
            {user.orders.length === 0 ? (
              <p className="text-xs text-[#8A7A6E] italic text-center py-6">No orders recorded in database.</p>
            ) : (
              <div className="space-y-4">
                {user.orders.map((order) => (
                  <div key={order.id} className="bg-[#FAF8F5] border border-[#EADFC9] rounded-xl p-4 text-xs">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-[#F2ECE4] pb-2.5 mb-2.5 font-mono">
                      <div>
                        <span className="text-[#8A7A6E]">ORDER:</span>{" "}
                        <span className="font-bold text-dark">{order.orderNumber}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[#8A7A6E]">
                          {new Date(order.createdAt).toLocaleDateString("en-IN")}
                        </span>
                        <span className="bg-blue-50 border border-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded text-[9px] uppercase">
                          {order.orderStatus}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      {order.items?.map((item) => (
                        <div key={item.id} className="flex justify-between items-center text-xs">
                          <span className="font-semibold text-dark">{item.productName} (x{item.quantity})</span>
                          <span className="text-sub-text font-mono">
                            ₹{(Number(item.priceAtOrder) * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-[#F2ECE4] pt-2.5 mt-2.5 flex justify-between items-center gap-2">
                      <div className="text-[10px]">
                        <span className="text-[#8A7A6E]">PAYMENT:</span>{" "}
                        <span className="font-bold text-dark uppercase">{order.paymentMethod}</span>{" "}
                        <span className="text-amber-700 bg-amber-50 border border-amber-100 px-1.5 py-0.5 rounded font-bold uppercase ml-1">
                          {order.paymentStatus}
                        </span>
                      </div>
                      <div className="font-bold text-dark">
                        Total: <span className="text-[#C82A54] text-sm">₹{Number(order.totalAmount).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          
          <div className="bg-white border border-[#EADFC9] rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="font-serif font-bold text-lg text-dark flex items-center gap-1.5 border-b border-[#F2ECE4] pb-2">
              <Download size={18} className="text-[#A67C52]" />
              <span>Aggregated Download Logs ({user.downloadRecords.length})</span>
            </h3>
            {user.downloadRecords.length === 0 ? (
              <p className="text-xs text-[#8A7A6E] italic text-center py-6">No download logs recorded.</p>
            ) : (
              <div className="overflow-x-auto max-h-[300px] overflow-y-auto pr-1">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 text-[#8A7A6E] uppercase font-bold text-[9px] tracking-wider">
                      <th className="py-2">Date</th>
                      <th className="py-2">Type</th>
                      <th className="py-2">Title</th>
                      <th className="py-2">IP / User Agent</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {user.downloadRecords.map((record) => (
                      <tr key={record.id} className="hover:bg-gray-50/50">
                        <td className="py-2.5 text-sub-text font-mono whitespace-nowrap">
                          {new Date(record.downloadedAt).toLocaleDateString("en-IN")}
                        </td>
                        <td className="py-2.5">
                          <span className="font-bold text-[#C82A54] text-[10px]">
                            {record.contentType.replace("_PDF", "").replace("_CHECKLIST", "")}
                          </span>
                        </td>
                        <td className="py-2.5 font-semibold text-dark truncate max-w-[120px]" title={record.contentTitle}>
                          {record.contentTitle}
                        </td>
                        <td className="py-2.5 text-sub-text text-[10px] font-mono leading-tight">
                          <div>IP: {record.ipAddress || "N/A"}</div>
                          <div className="truncate max-w-[120px] text-[8px]" title={record.userAgent}>
                            {record.userAgent}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[100] bg-dark text-white border border-white/10 px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-bounce font-sans text-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-pink animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
