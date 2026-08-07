"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface LogEntry {
  timestamp: string;
  type: "INFO" | "WARN" | "SUCCESS";
  message: string;
}

interface AdminUser {
  id: string;
  email: string;
  name?: string;
  role: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"bookings" | "guides" | "panchang" | "logs">("bookings");
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  // System Logs stream simulation
  const [logs, setLogs] = useState<LogEntry[]>([
    { timestamp: "14:31:02", type: "INFO", message: "Database connection initialized successfully." },
    { timestamp: "14:31:05", type: "SUCCESS", message: "Auto-seeded Super Admin account (admin@tapa.co)." },
    { timestamp: "14:32:10", type: "SUCCESS", message: "Token rotated: access_token for user_1837 rotated." },
    { timestamp: "14:32:12", type: "INFO", message: "OTP verification success for +919876543210." },
    { timestamp: "14:33:01", type: "WARN", message: "Upstash Redis connection timeout: falling back to memory rate-limiter." },
  ]);

  // Simulated metrics
  const stats = [
    { label: "Total Bookings", value: "348", change: "+12.4%", icon: "🪔" },
    { label: "Active Sessions", value: "1,204", change: "+8.2%", icon: "👥" },
    { label: "Kits Shipped", value: "92", change: "+24.1%", icon: "🛒" },
    { label: "Panchang Lookups", value: "12.8k", change: "+18.9%", icon: "🗓️" },
  ];

  // Mock Bookings list
  const bookings = [
    { id: "B-1029", client: "Rohit Pal", phone: "+919999999999", puja: "Rudrabhishek Puja", date: "Aug 10, 2026", status: "Confirmed" },
    { id: "B-1028", client: "Amit Sharma", phone: "+919876543210", puja: "Satyanarayan Katha", date: "Aug 11, 2026", status: "Pending" },
    { id: "B-1027", client: "Priyanka Sen", phone: "+919543210987", puja: "Saraswati Puja", date: "Aug 14, 2026", status: "Completed" },
    { id: "B-1026", client: "Vikram Malhotra", phone: "+919123456789", puja: "Maha Mrityunjaya", date: "Aug 18, 2026", status: "Confirmed" },
  ];

  // Mock Guides list
  const guides = [
    { title: "Sawan Somwar Vrat Vidhi", tag: "Dharma", reads: "4.8k", status: "Published" },
    { title: "Nag Panchami Puja Vidhi", tag: "Dharma", reads: "2.1k", status: "Published" },
    { title: "Ganesha Chaturthi Rituals", tag: "Sanskriti", reads: "0", status: "Draft" },
    { title: "Shravan Somwar Vrat Aarti", tag: "Stotra", reads: "1.2k", status: "Published" },
  ];

  // Fetch session on load and confirm Admin role
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/session");
        const data = await res.json();
        
        if (!data?.session || data.session.user.role !== "ADMIN") {
          router.push("/?login=true");
        } else {
          setAdminUser(data.session.user);
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        router.push("/?login=true");
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, [router]);

  // Simulate new incoming log entries in real-time
  useEffect(() => {
    if (!adminUser) return;
    const interval = setInterval(() => {
      const eventTypes: Array<"INFO" | "WARN" | "SUCCESS"> = ["INFO", "SUCCESS", "WARN"];
      const messages = [
        "OTP request rate-limit check: success for +919876543210",
        "Token refresh rotation completed for session family_8432",
        "Purohit assignment dispatched: Puja B-1029",
        "New user registration created via Phone +919543210987",
        "Database connection pool count: 4 active connections"
      ];
      
      const newLog: LogEntry = {
        timestamp: new Date().toLocaleTimeString("en-GB", { hour12: false }),
        type: eventTypes[Math.floor(Math.random() * eventTypes.length)],
        message: messages[Math.floor(Math.random() * messages.length)],
      };
      
      setLogs((prev) => [newLog, ...prev.slice(0, 15)]);
    }, 8000);

    return () => clearInterval(interval);
  }, [adminUser]);

  const handleSignOut = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F2EDE4] flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-pink border-t-transparent rounded-full animate-spin"></div>
          <span className="text-body-text font-semibold">Authenticating Admin Session...</span>
        </div>
      </div>
    );
  }

  if (!adminUser) return null;

  return (
    <div className="min-h-screen bg-[#F2EDE4] text-body-text font-sans pb-12">
      {/* Admin Nav Bar */}
      <nav className="bg-card border-b border-border p-4 sticky top-0 z-50 shadow-sm select-none">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">तप</span>
            <div className="h-6 w-[1.5px] bg-border"></div>
            <span className="font-serif font-bold text-lg">Super Admin Portal</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm font-bold text-dark flex items-center gap-1.5 justify-end">
                <span>{adminUser.email}</span>
                <span className="role-badge">Super Admin</span>
              </div>
              <div className="text-[11px] text-sub-text">Connected to Neon DB (Pooled)</div>
            </div>
            <button
              onClick={handleSignOut}
              className="bg-transparent border border-pink text-pink rounded-xl px-4 py-2 text-xs font-semibold cursor-pointer hover:bg-[#FEF0F4] transition-all"
            >
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-[1200px] mx-auto px-4 mt-8">
        
        {/* Statistics Widgets Grid */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-6 select-none">
          {stats.map((s, idx) => (
            <div key={idx} className="bg-card border border-border rounded-2xl p-5 shadow-sm flex items-center gap-4">
              <div className="text-3xl bg-bg border border-border w-12 h-12 rounded-xl flex items-center justify-center">
                {s.icon}
              </div>
              <div>
                <div className="text-[11px] text-sub-text font-bold uppercase tracking-wider">{s.label}</div>
                <div className="text-2xl font-bold text-dark mt-1 flex items-baseline gap-2">
                  {s.value}
                  <span className="text-xs text-green-text font-semibold">{s.change}</span>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Tab Controls */}
        <section className="mt-8 flex border-b border-border gap-1 select-none">
          <button
            onClick={() => setActiveTab("bookings")}
            className={`px-6 py-3 font-semibold text-sm border-b-2 transition-all cursor-pointer ${
              activeTab === "bookings" ? "border-pink text-pink" : "border-transparent text-sub-text hover:text-dark"
            }`}
          >
            📋 Puja Bookings
          </button>
          <button
            onClick={() => setActiveTab("guides")}
            className={`px-6 py-3 font-semibold text-sm border-b-2 transition-all cursor-pointer ${
              activeTab === "guides" ? "border-pink text-pink" : "border-transparent text-sub-text hover:text-dark"
            }`}
          >
            📖 Rituals Guides
          </button>
          <button
            onClick={() => setActiveTab("panchang")}
            className={`px-6 py-3 font-semibold text-sm border-b-2 transition-all cursor-pointer ${
              activeTab === "panchang" ? "border-pink text-pink" : "border-transparent text-sub-text hover:text-dark"
            }`}
          >
            🗓️ Panchang Variables
          </button>
          <button
            onClick={() => setActiveTab("logs")}
            className={`px-6 py-3 font-semibold text-sm border-b-2 transition-all cursor-pointer ${
              activeTab === "logs" ? "border-pink text-pink" : "border-transparent text-sub-text hover:text-dark"
            }`}
          >
            📟 System logs
          </button>
        </section>

        {/* Panel Section */}
        <section className="mt-6 bg-card border border-border rounded-2xl p-6 shadow-sm min-h-[400px]">
          
          {/* 1. Bookings Log Tab */}
          {activeTab === "bookings" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-serif font-bold text-lg text-dark">Active Pujan with Purohit Requests</h3>
                <span className="text-xs text-sub-text">Updated real-time</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border text-[11px] font-bold text-sub-text uppercase tracking-wider">
                      <th className="pb-3">Booking ID</th>
                      <th className="pb-3">Client</th>
                      <th className="pb-3">Phone</th>
                      <th className="pb-3">Puja Type</th>
                      <th className="pb-3">Date</th>
                      <th className="pb-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {bookings.map((b, idx) => (
                      <tr key={idx} className="border-b border-border-light last:border-none">
                        <td className="py-4 font-mono font-bold text-dark">{b.id}</td>
                        <td className="py-4 font-semibold text-dark">{b.client}</td>
                        <td className="py-4 text-sub-text">{b.phone}</td>
                        <td className="py-4 text-dark font-medium">{b.puja}</td>
                        <td className="py-4 text-sub-text">{b.date}</td>
                        <td className="py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                              b.status === "Completed"
                                ? "bg-green-bg text-green-text"
                                : b.status === "Confirmed"
                                ? "bg-[#FFF8E8] text-amber-text border border-amber-border"
                                : "bg-red-light text-pink border border-[#F0B8CC]"
                            }`}
                          >
                            {b.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 2. Guides CMS Tab */}
          {activeTab === "guides" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-serif font-bold text-lg text-dark">Rituals Knowledgebase Editor</h3>
                <button className="bg-pink text-white rounded-xl px-4 py-2 text-xs font-bold cursor-pointer">
                  + Create New Guide
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border text-[11px] font-bold text-sub-text uppercase tracking-wider">
                      <th className="pb-3">Title</th>
                      <th className="pb-3">Category</th>
                      <th className="pb-3">Monthly Reads</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {guides.map((g, idx) => (
                      <tr key={idx} className="border-b border-border-light last:border-none">
                        <td className="py-4 font-semibold text-dark">{g.title}</td>
                        <td className="py-4">
                          <span className="bg-bg border border-border text-mid-text text-[10px] px-2 py-0.5 rounded font-bold uppercase">
                            {g.tag}
                          </span>
                        </td>
                        <td className="py-4 text-sub-text">{g.reads}</td>
                        <td className="py-4">
                          <span
                            className={`text-xs font-semibold ${
                              g.status === "Published" ? "text-green-text" : "text-sub-text"
                            }`}
                          >
                            ● {g.status}
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          <button className="bg-transparent border border-border rounded-lg px-3 py-1.5 text-xs text-dark font-medium cursor-pointer hover:bg-bg mr-2">
                            Edit
                          </button>
                          <button className="bg-transparent border border-transparent text-pink text-xs font-semibold cursor-pointer">
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 3. Panchang Variable Settings Tab */}
          {activeTab === "panchang" && (
            <div>
              <h3 className="font-serif font-bold text-lg text-dark mb-6">Panchang Parameters Override</h3>
              <form onSubmit={(e) => { e.preventDefault(); alert("Panchang variables updated!"); }} className="max-w-[500px] flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-sub-text uppercase tracking-wide">Tithi today</label>
                  <input type="text" defaultValue="Saptami (7th day)" className="modal-input" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-sub-text uppercase tracking-wide">Paksha</label>
                  <input type="text" defaultValue="Ashadha Shukla Paksha" className="modal-input" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-sub-text uppercase tracking-wide">Nakshatra</label>
                  <input type="text" defaultValue="Hasta" className="modal-input" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-sub-text uppercase tracking-wide">Location Zone</label>
                  <input type="text" defaultValue="Delhi–NCR" className="modal-input" />
                </div>
                <button type="submit" className="modal-btn-pink mt-2 w-auto self-start px-6">
                  Save overriding values
                </button>
              </form>
            </div>
          )}

          {/* 4. Real-time System logs */}
          {activeTab === "logs" && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif font-bold text-lg text-dark font-sans">Active Security & Session logs</h3>
                <span className="text-xs text-green-text flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-text animate-pulse"></span> Streaming active
                </span>
              </div>
              <div className="bg-[#1C1712] rounded-xl p-4 font-mono text-xs text-[#E8A020] h-[360px] overflow-y-auto flex flex-col gap-2 shadow-inner">
                {logs.map((log, idx) => (
                  <div key={idx} className="flex gap-4">
                    <span className="text-sub-text flex-shrink-0 select-none">[{log.timestamp}]</span>
                    <span
                      className={`flex-shrink-0 font-bold select-none ${
                        log.type === "SUCCESS" ? "text-green-text" : log.type === "WARN" ? "text-pink" : "text-[#E3B567]"
                      }`}
                    >
                      {log.type}
                    </span>
                    <span className="text-hero-text">{log.message}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </section>
      </main>
    </div>
  );
}
