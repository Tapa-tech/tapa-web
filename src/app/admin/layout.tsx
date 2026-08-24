"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  BookOpen,
  Compass,
  Calendar,
  Layers,
  HelpCircle,
  ShieldAlert,
  LogOut,
  Menu,
  X,
  Package,
  Users,
  Sparkles,
  Megaphone,
  ShoppingCart
} from "lucide-react";

interface AdminUser {
  id: string;
  email: string;
  name?: string;
  role: string;
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [pendingReviewsCount, setPendingReviewsCount] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    async function checkAuthAndCounts() {
      try {
        const res = await fetch("/api/auth/session");
        const data = await res.json();

        if (!data?.session || (data.session.user.role !== "ADMIN" && data.session.user.role !== "SUPER_ADMIN")) {
          router.push("/?login=true");
          return;
        }

        setAdminUser(data.session.user);

        
        const revRes = await fetch("/api/admin/dpb-review");
        if (revRes.ok) {
          const revData = await revRes.json();
          setPendingReviewsCount(revData.length);
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        router.push("/?login=true");
      } finally {
        setLoading(false);
      }
    }
    checkAuthAndCounts();
  }, [router, pathname]);

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
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#C82A54] border-t-transparent rounded-full animate-spin"></div>
          <span className="text-[#3A332C] font-semibold">Authenticating Admin Session...</span>
        </div>
      </div>
    );
  }

  if (!adminUser) return null;

  const menuItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Ritual Guides", href: "/admin/ritual-guides", icon: BookOpen },
    { name: "Dharmic Concepts", href: "/admin/dharmic-concepts", icon: Compass },
    { name: "Panchang & Vrats", href: "/admin/panchang", icon: Calendar },
    { name: "Products & Kits", href: "/admin/products", icon: Package },
    { name: "Orders Management", href: "/admin/orders", icon: ShoppingCart },
    { name: "Tapa Circle", href: "/admin/tapa-circle", icon: Users },
    { name: "Upcoming Features", href: "/admin/upcoming-features", icon: Sparkles },
    { name: "Announcements", href: "/admin/announcements", icon: Megaphone },
    { name: "Homepage Banners", href: "/admin/banners", icon: LayoutDashboard },
    { name: "Sources Library", href: "/admin/sources", icon: Layers },
    { name: "FAQs Library", href: "/admin/faqs", icon: HelpCircle },
    {
      name: "Founder Review Queue",
      href: "/admin/dpb-review",
      icon: ShieldAlert,
      badge: pendingReviewsCount > 0 ? pendingReviewsCount : undefined,
    },
  ];


  if (adminUser && adminUser.role === "SUPER_ADMIN") {
    menuItems.push({
      name: "User Directory",
      href: "/admin/users",
      icon: Users,
    });
    menuItems.push({
      name: "Security Audit Logs",
      href: "/admin/audit-log",
      icon: ShieldAlert,
    });
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#3A332C] font-sans flex flex-col md:flex-row">
      
      <div className="md:hidden bg-white border-b border-[#EADFC9] p-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-[#C82A54] font-serif">तप</span>
          <span className="font-semibold text-sm tracking-wider uppercase">CMS Panel</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-[#3A332C] p-1"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      
      <aside
        className={`w-64 bg-white border-r border-[#EADFC9] flex flex-col fixed md:sticky top-0 bottom-0 left-0 z-40 transition-transform duration-300 transform md:transform-none ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-6 border-b border-[#EADFC9] hidden md:flex items-center gap-3">
          <span className="text-3xl font-serif font-bold text-[#C82A54]">तप</span>
          <div className="h-6 w-[1.5px] bg-[#EADFC9]"></div>
          <div>
            <div className="font-serif font-bold text-base leading-tight">The Tapa Co.</div>
            <div className="text-[10px] uppercase font-bold text-[#C82A54] tracking-wider">CMS Console</div>
          </div>
        </div>

        <div className="p-4 border-b border-[#EADFC9] bg-[#FDFBF7]/50">
          <div className="text-xs font-bold text-[#8A7A6E] uppercase tracking-wider mb-1">
            Logged In As
          </div>
          <div className="font-semibold text-sm truncate">{adminUser.email}</div>
          <div className="text-[10px] font-bold text-[#C82A54] bg-[#FFEAEF] px-1.5 py-0.5 rounded w-max mt-1">
            {adminUser.role}
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-all group ${
                  isActive
                    ? "bg-[#C82A54] text-white"
                    : "text-[#6A5A4E] hover:bg-[#F9F5EC] hover:text-[#C82A54]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} className={isActive ? "text-white" : "text-[#8A7A6E] group-hover:text-[#C82A54]"} />
                  <span>{item.name}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      isActive ? "bg-white text-[#C82A54]" : "bg-[#C82A54] text-white animate-pulse"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[#EADFC9] space-y-2">
          <button
            onClick={handleSignOut}
            className="flex items-center justify-center gap-2 w-full border border-[#C82A54] text-[#C82A54] hover:bg-[#FFEAEF] transition-all rounded-xl py-2 text-xs font-bold"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
          <div className="text-[10px] text-center text-[#8A7A6E]">
            Legal Entity: Tale Scale Networks
          </div>
        </div>
      </aside>

      
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-6 md:p-8 max-w-6xl mx-auto w-full">
          {children}
        </main>
      </div>

      
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/20 z-30 md:hidden"
        ></div>
      )}
    </div>
  );
}
