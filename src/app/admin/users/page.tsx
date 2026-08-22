"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ShieldCheck, Download, Eye, EyeOff, Search } from "lucide-react";

interface DownloadRecord {
  id: string;
  contentType: string;
  contentTitle: string;
  downloadedAt: string;
  ipAddress: string;
  userAgent: string;
}

interface User {
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
  downloadRecords: DownloadRecord[];
}

export default function SuperAdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("All");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    async function loadUsers() {
      try {
        const res = await fetch("/api/admin/users");
        if (!res.ok) {
          if (res.status === 403) {
            setError("Access Forbidden: Super Admin privileges are required to view this directory.");
          } else {
            setError("Failed to load user directory.");
          }
          return;
        }
        const data = await res.json();
        setUsers(data.users || []);
        setFilteredUsers(data.users || []);
      } catch (err) {
        console.error(err);
        setError("An error occurred while loading users.");
      } finally {
        setLoading(false);
      }
    }
    loadUsers();
  }, []);

  // Filter and search logic
  useEffect(() => {
    let result = users;

    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (u) =>
          (u.name && u.name.toLowerCase().includes(q)) ||
          (u.phone && u.phone.includes(q)) ||
          (u.email && u.email.toLowerCase().includes(q))
      );
    }

    if (filterRole !== "All") {
      result = result.filter((u) => u.role === filterRole);
    }

    setFilteredUsers(result);
  }, [searchQuery, filterRole, users]);

  const toggleExpandUser = (userId: string) => {
    setExpandedUserId(expandedUserId === userId ? null : userId);
  };

  const getFriendlyContentType = (type: string) => {
    switch (type) {
      case "RITUAL_GUIDE_PDF":
        return "📄 Ritual Guide PDF";
      case "SAMAGRI_CHECKLIST":
        return "📋 Samagri Checklist";
      case "PANCHANG_CALENDAR":
        return "📅 Panchang Calendar";
      default:
        return type;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 min-h-[400px]">
        <div className="w-8 h-8 border-4 border-[#C82A54] border-t-transparent rounded-full animate-spin"></div>
        <span className="mt-3 text-sm font-semibold text-[#6A5A4E]">Retrieving users database...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#FFEAEF] border border-[#FAD2DA] rounded-2xl p-6 text-center max-w-lg mx-auto mt-10">
        <span className="text-3xl block mb-2">🔒</span>
        <h2 className="font-serif font-bold text-lg text-[#C82A54] mb-2">Access Restrained</h2>
        <p className="text-sm text-[#8A6D74]">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#EADFC9] pb-5">
        <div>
          <div className="text-[10px] uppercase font-bold text-[#C82A54] tracking-wider mb-1">
            Super Admin Console
          </div>
          <h1 className="font-serif font-bold text-2xl md:text-3xl text-[#3A332C]">
            User &amp; Consent Directory
          </h1>
          <p className="text-xs text-[#8A7A6E] mt-1">
            Monitor registered users, digital consent versions (DPDP Act 2023 alignment), and document download records.
          </p>
        </div>
      </div>

      {/* Filters and search */}
      <div className="bg-white border border-[#EADFC9] rounded-2xl p-4 flex flex-col sm:flex-row gap-4 items-center justify-between shadow-sm">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8A7A6E]" size={16} />
          <input
            type="text"
            placeholder="Search by name, phone or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-[#EADFC9] rounded-xl text-xs bg-[#FDFBF7] focus:outline-none focus:ring-1 focus:ring-[#C82A54] font-medium"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <span className="text-xs font-semibold text-[#6A5A4E]">Filter Role:</span>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="border border-[#EADFC9] rounded-xl px-3 py-2 text-xs bg-[#FDFBF7] font-semibold focus:outline-none"
          >
            <option value="All">All Roles</option>
            <option value="CUSTOMER">Customer</option>
            <option value="ADMIN">Admin</option>
            <option value="SUPER_ADMIN">Super Admin</option>
          </select>
        </div>
      </div>

      {/* Table grid */}
      <div className="bg-white border border-[#EADFC9] rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FAF6EC] border-b border-[#EADFC9] text-[10px] font-bold text-[#8A7A6E] uppercase tracking-wider">
                <th className="py-3.5 px-4">User Details</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Joined On</th>
                <th className="py-3.5 px-4">Consent Auditing (DPDP)</th>
                <th className="py-3.5 px-4 text-center">Downloads</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EADFC9] text-xs">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-[#8A7A6E] font-medium">
                    No users found matching filters.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const isExpanded = expandedUserId === user.id;
                  return (
                    <React.Fragment key={user.id}>
                      <tr className={`hover:bg-[#FDFBF7]/60 transition-colors ${isExpanded ? "bg-[#FAF6EC]/30" : ""}`}>
                        <td className="py-4 px-4">
                          <div className="font-semibold text-sm text-[#3A332C] flex items-center">
                            <span>{user.name || "Tapa Practitioner"}</span>
                            {user.isActive === false && (
                              <span className="text-[9px] font-bold text-red-600 bg-red-50 border border-red-200 rounded px-1.5 py-0.5 ml-2">
                                Deactivated
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-[#6A5A4E] mt-0.5 space-y-0.5">
                            <div>📞 {user.phone || "—"}</div>
                            <div>✉️ {user.email || "—"}</div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                              user.role === "SUPER_ADMIN"
                                ? "bg-[#FFEAEF] border-[#FAD2DA] text-[#C82A54]"
                                : user.role === "ADMIN"
                                ? "bg-[#FAF0E6] border-[#EADFC9] text-[#A67C52]"
                                : "bg-gray-50 border-gray-200 text-gray-600"
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-[#6A5A4E] font-medium">
                          {new Date(user.createdAt).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>
                        <td className="py-4 px-4">
                          {user.consentGiven ? (
                            <div className="space-y-1">
                              <div className="flex items-center gap-1 text-[#1D8A56] font-semibold">
                                <ShieldCheck size={14} />
                                <span>Agreed ({user.consentVersion || "v1.0"})</span>
                              </div>
                              <div className="text-[10px] text-[#8A7A6E]">
                                📅 {user.consentGivenAt ? new Date(user.consentGivenAt).toLocaleString("en-IN") : "N/A"}
                              </div>
                              <div className="text-[10px] text-[#8A7A6E]">
                                🌐 IP: {user.consentIpAddress || "N/A"}
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 text-[#D32F2F] font-semibold">
                              <span className="text-base leading-none">✗</span>
                              <span>Consent Missing</span>
                            </div>
                          )}
                        </td>
                        <td className="py-4 px-4 text-center">
                          <div className="flex flex-col items-center justify-center">
                            <span className="font-bold text-sm text-[#3A332C]">
                              {user.downloadRecords.length}
                            </span>
                            <span className="text-[9px] font-bold text-[#8A7A6E] uppercase tracking-wider">
                              items
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <button
                            onClick={() => toggleExpandUser(user.id)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                              isExpanded
                                ? "bg-[#3A332C] text-white border-[#3A332C]"
                                : "bg-white border-[#EADFC9] text-[#6A5A4E] hover:bg-[#FAF6EC] hover:text-[#C82A54]"
                            }`}
                          >
                            {isExpanded ? (
                              <>
                                <EyeOff size={13} />
                                <span>Hide Details</span>
                              </>
                            ) : (
                              <>
                                <Eye size={13} />
                                <span>View History</span>
                              </>
                            )}
                          </button>
                        </td>
                      </tr>

                      {/* Expandable row showing download logs */}
                      {isExpanded && (
                        <tr>
                          <td colSpan={6} className="bg-[#FAF6EC]/20 border-b border-[#EADFC9] px-6 py-4">
                            <div className="max-w-4xl space-y-4">
                              {/* Command controls */}
                              <div className="bg-[#FAF6EC] border border-[#EADFC9] rounded-xl p-4 flex flex-col md:flex-row gap-6 md:items-center justify-between shadow-inner">
                                <div>
                                  <div className="font-bold text-xs uppercase text-[#C82A54] tracking-wider mb-1">
                                    Administrative Command Controls
                                  </div>
                                  <p className="text-[11px] text-[#6A5A4E]">
                                    Modify role permissions, audit login status, or view their aggregated profile file.
                                  </p>
                                </div>

                                <div className="flex flex-wrap gap-3 items-center">
                                  {/* Role control */}
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-semibold text-dark">Role:</span>
                                    <select
                                      value={user.role}
                                      onChange={async (e) => {
                                        const newRole = e.target.value;
                                        try {
                                          const res = await fetch(`/api/admin/users/${user.id}/role`, {
                                            method: "PATCH",
                                            headers: { "Content-Type": "application/json" },
                                            body: JSON.stringify({ role: newRole }),
                                          });
                                          if (res.ok) {
                                            triggerToast(`Role updated to ${newRole} ✓`);
                                            setUsers(prev => prev.map(u => u.id === user.id ? { ...u, role: newRole } : u));
                                          } else {
                                            const err = await res.json();
                                            triggerToast(err.error || "Failed to update role.");
                                          }
                                        } catch {
                                          triggerToast("Error updating user role.");
                                        }
                                      }}
                                      className="text-xs border border-gray-300 rounded-lg px-2.5 py-1.5 focus:ring-pink focus:border-pink bg-white text-dark font-medium"
                                    >
                                      <option value="CUSTOMER">Customer</option>
                                      <option value="ADMIN">Admin</option>
                                      <option value="SUPER_ADMIN">Super Admin</option>
                                    </select>
                                  </div>

                                  {/* Deactivation toggle */}
                                  <button
                                    onClick={async () => {
                                      const nextActiveState = !user.isActive;
                                      try {
                                        const res = await fetch(`/api/admin/users/${user.id}/status`, {
                                          method: "PATCH",
                                          headers: { "Content-Type": "application/json" },
                                          body: JSON.stringify({ isActive: nextActiveState }),
                                        });
                                        if (res.ok) {
                                          triggerToast(nextActiveState ? "Account activated ✓" : "Account deactivated ✓");
                                          setUsers(prev => prev.map(u => u.id === user.id ? { ...u, isActive: nextActiveState } : u));
                                        } else {
                                          const err = await res.json();
                                          triggerToast(err.error || "Failed to update status.");
                                        }
                                      } catch {
                                        triggerToast("Error updating status.");
                                      }
                                    }}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                                      user.isActive
                                        ? "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                                        : "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                                    }`}
                                  >
                                    {user.isActive ? "Deactivate Account" : "Activate Account"}
                                  </button>

                                  {/* Aggregate profile link */}
                                  <Link
                                    href={`/admin/users/${user.id}`}
                                    className="bg-white hover:bg-gray-50 text-[#6A5A4E] border border-[#EADFC9] rounded-lg px-3 py-1.5 text-xs font-bold shadow-sm transition-all"
                                  >
                                    📂 Detailed Profile
                                  </Link>
                                </div>
                              </div>

                              <div className="border border-[#EADFC9] rounded-xl overflow-hidden bg-white shadow-inner">
                                <div className="bg-[#FAF6EC] px-4 py-2.5 border-b border-[#EADFC9] flex items-center justify-between">
                                <span className="font-semibold text-xs text-[#3A332C] flex items-center gap-1.5">
                                  <Download size={14} className="text-[#C82A54]" />
                                  <span>Download History &amp; Audit Logs</span>
                                </span>
                                <span className="text-[10px] text-[#6A5A4E] font-medium">
                                  {user.downloadRecords.length} total downloads logged
                                </span>
                              </div>
                              {user.downloadRecords.length === 0 ? (
                                <div className="p-6 text-center text-xs text-[#8A7A6E] italic">
                                  No download records found for this user.
                                </div>
                              ) : (
                                <table className="w-full text-left text-xs border-collapse">
                                  <thead>
                                    <tr className="bg-gray-50 border-b border-[#EADFC9] text-[9px] font-bold text-[#8A7A6E] uppercase tracking-wider">
                                      <th className="py-2 px-4">Timestamp</th>
                                      <th className="py-2 px-4">Format</th>
                                      <th className="py-2 px-4">Content Target</th>
                                      <th className="py-2 px-4">IP Address</th>
                                      <th className="py-2 px-4">Browser/User Agent</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-[#EADFC9]">
                                    {user.downloadRecords.map((record) => (
                                      <tr key={record.id} className="hover:bg-gray-50/50">
                                        <td className="py-2 px-4 text-[#8A7A6E] font-medium whitespace-nowrap">
                                          {new Date(record.downloadedAt).toLocaleString("en-IN")}
                                        </td>
                                        <td className="py-2 px-4">
                                          <span className="font-semibold text-[#C82A54]">
                                            {getFriendlyContentType(record.contentType)}
                                          </span>
                                        </td>
                                        <td className="py-2 px-4 text-[#3A332C] font-semibold">
                                          {record.contentTitle}
                                        </td>
                                        <td className="py-2 px-4 text-[#6A5A4E] font-mono text-[10px]">
                                          {record.ipAddress}
                                        </td>
                                        <td className="py-2 px-4 text-[#8A7A6E] truncate max-w-xs font-mono text-[10px]" title={record.userAgent}>
                                          {record.userAgent}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
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
