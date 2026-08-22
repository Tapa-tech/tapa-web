"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { BookOpen, Compass, Calendar, ShieldAlert, ArrowRight, Activity, Plus, Package, ShoppingCart, Users } from "lucide-react";

interface DashboardMetrics {
  guidesDraft: number;
  guidesPublished: number;
  concepts: number;
  panchang: number;
  pendingDpb: number;
  kits: number;
  productsCount: number;
  ordersCount: number;
  ordersConfirmedCount: number;
  ordersProcessingCount: number;
  ordersShippedCount: number;
  tapaCircleCount: number;
  totalUsers?: number;
  customerCount?: number;
  adminCount?: number;
  superAdminCount?: number;
  pendingConsentCount?: number;
  recentUsers?: any[];
}

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    async function fetchMetricsAndSession() {
      try {
        const [metricsRes, sessionRes] = await Promise.all([
          fetch("/api/admin/dashboard"),
          fetch("/api/auth/session")
        ]);

        if (metricsRes.ok) {
          const data = await metricsRes.json();
          setMetrics(data);
        }
        if (sessionRes.ok) {
          const sessionData = await sessionRes.json();
          setRole(sessionData?.session?.user?.role || null);
        }
      } catch (err) {
        console.error("Failed to load metrics or session:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchMetricsAndSession();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-[#C82A54] border-t-transparent rounded-full animate-spin"></div>
        <span className="text-[#8A7A6E] mt-3 font-medium">Loading metrics...</span>
      </div>
    );
  }

  const statCards = [
    {
      title: "Ritual Guides",
      desc: "Instructional guides with steps, mantras & samagri",
      count: (metrics?.guidesPublished || 0) + (metrics?.guidesDraft || 0),
      subtext: `${metrics?.guidesPublished || 0} Published · ${metrics?.guidesDraft || 0} Drafts`,
      color: "bg-[#FDF6F7] border-[#FAD2DA] text-[#C82A54]",
      icon: BookOpen,
      link: "/admin/ritual-guides",
      createLink: "/admin/ritual-guides/new",
    },
    {
      title: "Dharmic Concepts",
      desc: "Informative content and philosophical explanations",
      count: metrics?.concepts || 0,
      subtext: "Paragraph-led formats",
      color: "bg-[#F2FAF6] border-[#D1F2E2] text-[#1D8A56]",
      icon: Compass,
      link: "/admin/dharmic-concepts",
      createLink: "/admin/dharmic-concepts/new",
    },
    {
      title: "Panchang Entries",
      desc: "Astronomical metrics & vrat details per date",
      count: metrics?.panchang || 0,
      subtext: "Synced location: Delhi-NCR",
      color: "bg-[#F5F8FE] border-[#D6E4FC] text-[#2A65C8]",
      icon: Calendar,
      link: "/admin/panchang",
    },
    {
      title: "Ritual Kits",
      desc: "Complete Samagri boxes for pujas & festivals",
      count: metrics?.kits || 0,
      subtext: "Dynamic inventory catalog",
      color: "bg-[#FAF7F2] border-[#EADFC9] text-[#A67C52]",
      icon: Package,
      link: "/admin/ritual-kits",
      createLink: "/admin/ritual-kits/new",
    },
    {
      title: "All Products",
      desc: "Individual items & Samagri components catalog",
      count: metrics?.productsCount || 0,
      subtext: "Product-level management",
      color: "bg-[#FDF9F2] border-[#F2ECE4] text-[#A67C52]",
      icon: Package,
      link: "/admin/products",
      createLink: "/admin/products/new",
    },
    {
      title: "Customer Orders",
      desc: "Manage customer order fulfillment & payment status",
      count: metrics?.ordersCount || 0,
      subtext: `${metrics?.ordersConfirmedCount || 0} Confirmed · ${metrics?.ordersProcessingCount || 0} Processing · ${metrics?.ordersShippedCount || 0} Shipped`,
      color: "bg-[#FDF6F7] border-[#FAD2DA] text-[#C82A54]",
      icon: ShoppingCart,
      link: "/admin/orders",
    },
    {
      title: "Tapa Circle Subscribers",
      desc: "Registered practitioners for weekly broadcasts",
      count: metrics?.tapaCircleCount || 0,
      subtext: "Authorized consent profiles",
      color: "bg-[#F2FAF6] border-[#D1F2E2] text-[#1D8A56]",
      icon: Users,
      link: "/admin/tapa-circle",
    },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Banner */}
      <div className="bg-[#FAF6EC] border border-[#EADFC9] rounded-2xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="font-serif font-bold text-2xl md:text-3xl text-[#3A332C] flex items-center gap-2">
            <span>Pranām, Admin</span>
            {role === "SUPER_ADMIN" && (
              <span className="text-[10px] font-bold uppercase tracking-wider text-pink bg-pink/5 border border-pink/20 px-2 py-0.5 rounded-full">
                👑 Super Admin
              </span>
            )}
          </h1>
          <p className="text-[#6A5A4E] text-sm md:text-base mt-2">
            Welcome to the content control center. Here you can compose scripture-based guides, verify facts, and update the daily calendar.
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/admin/ritual-guides/new"
            className="flex items-center gap-2 bg-[#C82A54] hover:bg-[#B02047] text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-sm transition-all"
          >
            <Plus size={14} />
            <span>New Ritual Guide</span>
          </Link>
        </div>
      </div>

      {/* Pending DPB Reviews Highlight */}
      {metrics && metrics.pendingDpb > 0 && (
        <div className="bg-red-50 border-2 border-[#ECA6B8] rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 animate-pulse">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#FEEAED] text-[#C82A54] rounded-full flex items-center justify-center flex-shrink-0">
              <ShieldAlert size={24} />
            </div>
            <div>
              <h2 className="font-bold text-[#C82A54] text-lg">Pending BHRANTI Submissions</h2>
              <p className="text-sm text-[#8E3B50] mt-0.5">
                There are <span className="font-bold">{metrics.pendingDpb}</span> new misconceptions/myths waiting for scriptural confirmation and founder review approval.
              </p>
            </div>
          </div>
          <Link
            href="/admin/dpb-review"
            className="flex items-center gap-2 bg-[#C82A54] text-white hover:bg-[#B02047] font-semibold text-xs px-4 py-2.5 rounded-xl shadow-sm whitespace-nowrap self-start md:self-auto"
          >
            <span>Review Queue</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      )}

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className={`border rounded-2xl p-6 flex flex-col justify-between min-h-[180px] bg-white shadow-sm hover:shadow-md transition-shadow relative overflow-hidden`}
            >
              <div>
                <div className="flex justify-between items-start">
                  <div className={`p-3 rounded-xl ${card.color.split(" ")[0]} border ${card.color.split(" ")[1]}`}>
                    <Icon size={20} className={card.color.split(" ")[2]} />
                  </div>
                  <span className="text-3xl font-extrabold text-[#3A332C]">{card.count}</span>
                </div>
                <h3 className="font-serif font-bold text-lg text-[#3A332C] mt-4">{card.title}</h3>
                <p className="text-xs text-[#8A7A6E] mt-1 line-clamp-2">{card.desc}</p>
              </div>

              <div className="border-t border-[#F2ECE4] mt-4 pt-4 flex items-center justify-between text-xs font-semibold">
                <span className="text-[#8A7A6E]">{card.subtext}</span>
                <div className="flex gap-2">
                  {card.createLink && (
                    <Link
                      href={card.createLink}
                      className="text-[#C82A54] hover:underline"
                    >
                      Create
                    </Link>
                  )}
                  <Link
                    href={card.link}
                    className="text-[#6A5A4E] hover:text-[#C82A54] flex items-center gap-0.5"
                  >
                    <span>Manage</span>
                    <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* System Status and Activity */}
      <div className="bg-white border border-[#EADFC9] rounded-2xl p-6 shadow-sm">
        <h3 className="font-serif font-bold text-lg text-[#3A332C] flex items-center gap-2 border-b border-[#F2ECE4] pb-3">
          <Activity size={18} className="text-[#C82A54]" />
          <span>System Environment Status</span>
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-4">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-[#8A7A6E] tracking-wider">Database Status</span>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
              <span className="text-xs font-semibold">Neon Postgre (Connected)</span>
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-[#8A7A6E] tracking-wider">File storage</span>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
              <span className="text-xs font-semibold">Local Uploads Mode (Active)</span>
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-[#8A7A6E] tracking-wider">Editor Type</span>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
              <span className="text-xs font-semibold">Tiptap JSON Structure</span>
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-[#8A7A6E] tracking-wider">Authentication Check</span>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
              <span className="text-xs font-semibold">Role-Based JWT cookies</span>
            </div>
          </div>
        </div>
      </div>

      {/* Super Admin Command Center Progressive Sections */}
      {role === "SUPER_ADMIN" && (
        <div className="space-y-8 mt-8 border-t border-[#EADFC9]/50 pt-8">
          <h2 className="font-serif font-bold text-2xl text-dark flex items-center gap-2">
            🛡️ Super Admin Command Center
          </h2>

          {/* User Metrics & Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* User Statistics Card */}
            <div className="bg-white border border-[#EADFC9] rounded-2xl p-6 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="font-serif font-bold text-lg text-dark flex items-center gap-1.5 mb-3">
                  👥 User Directory Overview
                </h3>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[#8A7A6E] block">Total Users</span>
                    <span className="text-xl font-bold text-dark font-mono">{metrics?.totalUsers || 0}</span>
                  </div>
                  <div>
                    <span className="text-[#8A7A6E] block">Customers</span>
                    <span className="text-xl font-bold text-dark font-mono">{metrics?.customerCount || 0}</span>
                  </div>
                  <div>
                    <span className="text-[#8A7A6E] block">Admins</span>
                    <span className="text-xl font-bold text-[#1D8A56] font-mono">{metrics?.adminCount || 0}</span>
                  </div>
                  <div>
                    <span className="text-[#8A7A6E] block">Super Admins</span>
                    <span className="text-xl font-bold text-pink font-mono">{metrics?.superAdminCount || 0}</span>
                  </div>
                </div>
                {metrics && metrics.pendingConsentCount !== undefined && metrics.pendingConsentCount > 0 && (
                  <div className="mt-4 text-[10px] text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl font-medium">
                    ⚠ {metrics.pendingConsentCount} user accounts lack consent records.
                  </div>
                )}
              </div>
              <div className="border-t border-[#F2ECE4] mt-5 pt-4 flex justify-between items-center text-xs">
                <Link href="/admin/users" className="text-pink hover:underline font-bold flex items-center gap-0.5">
                  <span>Manage Users Directory</span>
                  <span>→</span>
                </Link>
              </div>
            </div>

            {/* Quick Links Command Card */}
            <div className="bg-white border border-[#EADFC9] rounded-2xl p-6 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="font-serif font-bold text-lg text-dark flex items-center gap-1.5 mb-3">
                  📜 System Security &amp; FAQ
                </h3>
                <p className="text-xs text-[#8A7A6E] leading-relaxed">
                  Access immutable audit logs tracking role modifications, account deactivations, and manage other platform settings.
                </p>
                <div className="mt-4 space-y-2 text-xs">
                  <Link href="/admin/audit-log" className="flex items-center justify-between p-2 rounded-xl bg-gray-50 border border-gray-100 hover:bg-[#FAF6EC] transition-colors">
                    <span className="font-semibold text-dark">📋 View Security Audit Logs</span>
                    <span className="text-pink">→</span>
                  </Link>
                  <Link href="/admin/faqs" className="flex items-center justify-between p-2 rounded-xl bg-gray-50 border border-gray-100 hover:bg-[#FAF6EC] transition-colors">
                    <span className="font-semibold text-dark">💬 FAQ Content Editor</span>
                    <span className="text-pink">→</span>
                  </Link>
                  <Link href="/admin/sources" className="flex items-center justify-between p-2 rounded-xl bg-gray-50 border border-gray-100 hover:bg-[#FAF6EC] transition-colors">
                    <span className="font-semibold text-dark">📚 Scripture Source Manager</span>
                    <span className="text-pink">→</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Site Announcements Quick Control */}
            <div className="bg-white border border-[#EADFC9] rounded-2xl p-6 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="font-serif font-bold text-lg text-dark flex items-center gap-1.5 mb-2">
                  📢 Banner Announcement
                </h3>
                <p className="text-xs text-[#8A7A6E] mb-3 leading-relaxed">
                  Publish a new site-wide announcement banner message.
                </p>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const form = e.currentTarget;
                    const message = new FormData(form).get("message") as string;
                    if (!message) return;
                    try {
                      const res = await fetch("/api/admin/announcements", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ message, isActive: true }),
                      });
                      if (res.ok) {
                        triggerToast("Site-wide announcement updated ✓");
                        form.reset();
                      } else {
                        triggerToast("Failed to update announcement.");
                      }
                    } catch {
                      triggerToast("Error updating announcement.");
                    }
                  }}
                  className="space-y-2.5"
                >
                  <input
                    type="text"
                    name="message"
                    placeholder="Enter banner message..."
                    className="w-full text-xs border border-gray-300 rounded-xl px-3 py-2 focus:ring-pink focus:border-pink bg-gray-50 text-dark"
                    required
                  />
                  <button
                    type="submit"
                    className="w-full bg-[#C82A54] hover:bg-[#B02047] text-white text-xs font-bold py-2 rounded-xl transition-colors shadow-sm cursor-pointer"
                  >
                    Update Announcement Banner
                  </button>
                </form>
              </div>
              <div className="border-t border-[#F2ECE4] mt-4 pt-3 text-right">
                <Link href="/admin/announcements" className="text-xs text-[#8A7A6E] hover:text-[#C82A54] underline">
                  All Announcements
                </Link>
              </div>
            </div>
          </div>

          {/* Recent Signups Audit */}
          <div className="bg-white border border-[#EADFC9] rounded-2xl p-6 shadow-sm">
            <h3 className="font-serif font-bold text-lg text-dark border-b border-[#F2ECE4] pb-3 mb-4 flex items-center justify-between">
              <span>Recent Signups (Super Admin Audit)</span>
              <span className="text-xs text-[#8A7A6E] font-sans font-medium"> Delhi-NCR Location</span>
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 text-[#8A7A6E] uppercase font-bold text-[10px]">
                    <th className="py-2.5">Name</th>
                    <th className="py-2.5">Contact</th>
                    <th className="py-2.5">Role</th>
                    <th className="py-2.5">Joined Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {metrics?.recentUsers?.map((u: any) => (
                    <tr key={u.id} className="hover:bg-gray-50/50">
                      <td className="py-3 font-semibold text-dark">{u.name || "Anonymous Practitioner"}</td>
                      <td className="py-3 text-sub-text">
                        {u.email && <div className="font-mono">{u.email}</div>}
                        {u.phone && <div className="font-mono">{u.phone}</div>}
                      </td>
                      <td className="py-3">
                        <span className={`px-2.5 py-0.5 rounded font-bold text-[9px] uppercase border ${
                          u.role === "SUPER_ADMIN" ? "bg-pink/5 border-pink/15 text-pink" :
                          u.role === "ADMIN" ? "bg-green-50 border-green-100 text-green-700" :
                          "bg-gray-100 border-gray-200 text-gray-600"
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3 text-sub-text font-mono">{new Date(u.createdAt).toLocaleDateString("en-IN")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[100] bg-dark text-white border border-white/10 px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-bounce font-sans text-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-pink animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

