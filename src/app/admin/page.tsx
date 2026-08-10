"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { BookOpen, Compass, Calendar, ShieldAlert, ArrowRight, Activity, Plus } from "lucide-react";

interface DashboardMetrics {
  guidesDraft: number;
  guidesPublished: number;
  concepts: number;
  panchang: number;
  pendingDpb: number;
}

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMetrics() {
      try {
        const res = await fetch("/api/admin/dashboard");
        if (res.ok) {
          const data = await res.json();
          setMetrics(data);
        }
      } catch (err) {
        console.error("Failed to load metrics:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchMetrics();
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
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Banner */}
      <div className="bg-[#FAF6EC] border border-[#EADFC9] rounded-2xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="font-serif font-bold text-2xl md:text-3xl text-[#3A332C]">
            Pranām, Admin
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
    </div>
  );
}
