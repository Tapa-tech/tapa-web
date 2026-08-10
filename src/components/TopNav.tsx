import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

interface TopNavProps {
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  onTriggerToast?: (message: string) => void;
}

interface SessionData {
  user: {
    id: string;
    role: string;
    phone?: string;
    email?: string;
    name?: string;
  };
}


export default function TopNav({ activeTab = "Ritual Guides", onTabChange, onTriggerToast }: TopNavProps) {
  const [isBellOpen, setIsBellOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  const router = useRouter();
  const [session, setSession] = useState<SessionData | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [authView, setAuthView] = useState<"signin" | "signup" | "admin">("signin");

  // Real-time database search results state
  const [searchResults, setSearchResults] = useState<{
    guides: { id: string; title: string; slug: string; category: string }[];
    kits: { id: string; name: string; occ: string; deity: string; price: number; itemsCount: string }[];
  }>({ guides: [], kits: [] });

  // Database-driven search fetcher with debounce
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults({ guides: [], kits: [] });
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      try {
        const res = await fetch(`/api/public/search?q=${encodeURIComponent(searchQuery)}`);
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data);
        }
      } catch (err) {
        console.error("Search fetch failed:", err);
      }
    }, 150);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // Form input variables
  const [phone, setPhone] = useState("+91");
  const [otp, setOtp] = useState("");
  const [otpRequested, setOtpRequested] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(false);

  const bellRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Fetch session on load
  useEffect(() => {
    async function fetchSession() {
      try {
        const response = await fetch("/api/auth/session");
        const data = await response.json();
        if (data?.session) {
          setSession(data.session);
        }
      } catch (err) {
        console.error("Session fetch failed:", err);
      }
    }
    fetchSession();
  }, []);

  // Close overlays on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (bellRef.current && !bellRef.current.contains(event.target as Node)) {
        setIsBellOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const triggerToast = (msg: string) => {
    if (onTriggerToast) {
      onTriggerToast(msg);
    } else {
      alert(msg);
    }
  };

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoading(true);

    const indiaPhoneRegex = /^\+91[6-9]\d{9}$/;
    if (!indiaPhoneRegex.test(phone)) {
      setLoginError("Invalid format. Must be India E.164 (+91XXXXXXXXXX).");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/otp/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await response.json();

      if (!response.ok) {
        setLoginError(data.error || "Failed to dispatch verification code.");
      } else {
        setOtpRequested(true);
        triggerToast("Verification code dispatched!");
      }
    } catch {
      setLoginError("Network connection error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoading(true);

    if (otp.length !== 6) {
      setLoginError("Verification code must be exactly 6 digits.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone,
          otp,
          ...(authView === "signup" ? { name, email } : {}),
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        setLoginError(data.error || "Verification failed.");
      } else {
        setSession({ user: data.user });
        setIsLoginModalOpen(false);
        setPhone("+91");
        setOtp("");
        setName("");
        setEmail("");
        setOtpRequested(false);
        triggerToast("Logged in successfully!");
      }
    } catch {
      setLoginError("Network connection error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoading(true);

    if (!adminEmail.includes("@")) {
      setLoginError("Invalid email format.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: adminEmail, password: adminPassword }),
      });
      const data = await response.json();

      if (!response.ok) {
        setLoginError(data.error || "Invalid email or password.");
      } else {
        setSession({ user: data.user });
        setIsLoginModalOpen(false);
        setAdminEmail("");
        setAdminPassword("");
        triggerToast("Logged in as Super Admin. Redirecting...");
        router.push("/admin");
      }
    } catch {
      setLoginError("Network connection error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });
      if (response.ok) {
        setSession(null);
        setIsProfileDropdownOpen(false);
        triggerToast("Logged out successfully.");
      }
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const handleTabClick = (tabId: string) => {
    if (onTabChange) {
      onTabChange(tabId);
    }
    if (tabId === "Ritual Kits") {
      router.push("/ritual-kits");
    } else {
      router.push("/");
    }
  };



  const tabs = [
    {
      id: "Ritual Guides",
      label: "Ritual Guides",
    },
    {
      id: "Ritual Kits",
      label: "Ritual Kits",
      badge: "Launching soon",
    },
    {
      id: "Pujan with Purohit",
      label: "Pujan with Purohit",
      subLabel: "(will be launched in November)",
    },
    {
      id: "Panchang",
      label: "Panchang",
    },
  ];

  return (
    <nav className="topnav select-none">
      <div className="wrap relative">
        {/* Logo Section */}
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            router.push("/");
          }}
          className="logo flex items-center"
        >
          <div className="logo-flame">
            <svg viewBox="0 0 28 34" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M14 2C17 8 21 13 18 20C16.5 23.5 14 25 14 25C14 25 11.5 23.5 10 20C7 13 11 8 14 2Z"
                fill="var(--pink)"
              />
              <path
                d="M14 11C15.5 15 16.5 18 15 21C14.5 22 13.5 22 13 21C11.5 18 12.5 15 14 11Z"
                fill="var(--amber)"
              />
            </svg>
          </div>
          <div>
            <div className="logo-deva">तप</div>
            <div className="logo-latin">the tapa company</div>
          </div>
        </a>

        {/* Category Tabs (Desktop) */}
        <div className="nav-cats hidden md:flex">
          {tabs.map((tab) => {
            const isActive = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`nav-cat cursor-pointer ${isActive ? "active" : ""}`}
              >
                <div className="flex flex-col items-start leading-none justify-center">
                  <div className="flex items-center gap-1">
                    <span>{tab.label}</span>
                    {/* {tab.badge && (
                      <span className="bg-red-light text-pink text-[7px] font-bold px-1.5 py-0.5 rounded border border-red-200 uppercase scale-90 origin-left">
                        {tab.badge}
                      </span>
                    )} */}
                  </div>
                  {tab.subLabel && (
                    <span className="text-[7.5px] text-sub-text font-normal mt-0.5 leading-none block">
                      {/* {tab.subLabel} */}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Side Actions */}
        <div className="nav-right">
          {/* Actionable Desktop Search Bar */}
          <div ref={searchRef} className="relative hidden lg:block">
            <div className="search-bar flex items-center">
              <span>🔍</span>
              <input
                type="text"
                placeholder="Search rituals, festivals, mantras..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
                className="bg-transparent border-none outline-none text-[11px] w-full text-body-text placeholder-sub-text ml-1"
              />
            </div>

            {/* Suggestions Dropdown overlay */}
            {isSearchOpen && searchQuery.trim() && (
              <div className="absolute right-0 top-[42px] z-[65] w-80 bg-card border border-border rounded-xl shadow-2xl p-3 select-none">
                {/* 1. Guides Section */}
                <div className="text-[10px] text-sub-text font-bold uppercase tracking-wider mb-2 font-sans">
                  Rituals &amp; Guides
                </div>
                <div className="flex flex-col gap-1.5 font-sans mb-3">
                  {searchResults.guides.length > 0 ? (
                    searchResults.guides.map((item, idx) => (
                      <div
                        key={idx}
                        onClick={() => {
                          triggerToast(`Opening guide: "${item.title}"`);
                          setIsSearchOpen(false);
                          setSearchQuery("");
                          router.push(`/ritual-kits/${item.slug}`);
                        }}
                        className="flex items-center justify-between text-xs text-body-text hover:bg-bg p-2 rounded-lg cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <span>📖</span>
                          <span className="font-semibold">{item.title}</span>
                        </div>
                        <span className="text-[9px] text-pink bg-red-light px-1.5 py-0.5 rounded border border-red-200 uppercase font-bold scale-90">
                          {item.category}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-sub-text p-2">
                      No matching guides found
                    </div>
                  )}
                </div>

                {/* 2. Kits Section */}
                <div className="text-[10px] text-sub-text font-bold uppercase tracking-wider mb-2 font-sans border-t border-border pt-2">
                  Ritual Samagri Kits
                </div>
                <div className="flex flex-col gap-1.5 font-sans">
                  {searchResults.kits.length > 0 ? (
                    searchResults.kits.map((item, idx) => (
                      <div
                        key={idx}
                        onClick={() => {
                          setIsSearchOpen(false);
                          setSearchQuery("");
                          router.push(`/ritual-kits/${item.id}`);
                        }}
                        className="flex items-center justify-between text-xs text-body-text hover:bg-bg p-2 rounded-lg cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <span>📦</span>
                          <div>
                            <div className="font-semibold leading-tight">{item.name}</div>
                            <div className="text-[9px] text-sub-text leading-none">{item.itemsCount} · {item.occ}</div>
                          </div>
                        </div>
                        <span className="text-[10px] text-amber font-bold">
                          ₹{item.price}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-sub-text p-2">
                      No matching kits found
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Mobile search button toggler */}
          <button
            onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
            className="nav-icon lg:hidden hover:opacity-85 transition-opacity"
            aria-label="Search"
          >
            🔍
          </button>

          {/* Actionable Notifications Bell */}
          <div ref={bellRef} className="relative">
            <button
              onClick={() => setIsBellOpen(!isBellOpen)}
              className="nav-icon hover:opacity-85 transition-opacity"
              aria-label="Notifications"
            >
              🔔
            </button>

            {/* Notifications Popover */}
            {isBellOpen && (
              <div className="absolute right-0 top-[42px] z-[65] w-72 bg-card border border-border rounded-xl shadow-2xl p-4 font-sans select-none">
                <div className="flex items-center justify-between border-b border-border pb-2 mb-2">
                  <span className="font-bold text-xs text-dark">Recent Alerts</span>
                  <button
                    onClick={() => {
                      setIsBellOpen(false);
                      triggerToast("Marked all notifications as read");
                    }}
                    className="text-[10px] text-pink hover:underline bg-transparent border-none cursor-pointer"
                  >
                    Clear All
                  </button>
                </div>
                <div className="flex flex-col gap-3">
                  <div
                    onClick={() => {
                      triggerToast("Opening alert details...");
                      setIsBellOpen(false);
                    }}
                    className="text-[11px] leading-relaxed border-b border-border-light pb-2 last:border-none cursor-pointer hover:opacity-90"
                  >
                    <div className="flex items-center gap-1 font-bold text-pink mb-0.5">
                      <span>🔔</span>
                      <span>Ritual Alert</span>
                    </div>
                    <p className="text-body-text font-medium">Sawan Somwar Vrat starts today (15 July 2026).</p>
                  </div>
                  <div
                    onClick={() => {
                      triggerToast("Opening Panchang calendar...");
                      setIsBellOpen(false);
                    }}
                    className="text-[11px] leading-relaxed border-b border-border-light pb-2 last:border-none cursor-pointer hover:opacity-90"
                  >
                    <div className="flex items-center gap-1 font-bold text-amber mb-0.5">
                      <span>🗓️</span>
                      <span>Panchang Verified</span>
                    </div>
                    <p className="text-body-text font-medium">Ashadha Shukla Paksha timings verified for Delhi-NCR.</p>
                  </div>
                  <div
                    onClick={() => {
                      triggerToast("Opening Ritual Kits page...");
                      setIsBellOpen(false);
                    }}
                    className="text-[11px] leading-relaxed border-b border-border-light pb-2 last:border-none cursor-pointer hover:opacity-90"
                  >
                    <div className="flex items-center gap-1 font-bold text-pink mb-0.5">
                      <span>🛒</span>
                      <span>Ritual Kits</span>
                    </div>
                    <p className="text-body-text font-medium">Sawan Somwar Kit pre-order launching Sept 24.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Profile / Login trigger controls */}
          {session ? (
            <div ref={profileRef} className="profile-container">
              <div
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="w-9 h-9 rounded-lg overflow-hidden border border-border bg-bg flex-shrink-0 cursor-pointer hover:opacity-85 transition-opacity flex items-center justify-center text-lg select-none font-sans"
              >
                👤
              </div>
              {isProfileDropdownOpen && (
                <div className="profile-dropdown font-sans">
                  <div className="dropdown-user-info">
                    <div className="dropdown-name font-bold">
                      <span>User Session</span>
                      <span className="role-badge">{session.user.role}</span>
                    </div>
                    <div className="dropdown-sub text-sub-text">
                      {session.user.phone || session.user.email}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      if (session.user.role === "ADMIN") {
                        router.push("/admin");
                      } else {
                        triggerToast("Opening settings...");
                      }
                      setIsProfileDropdownOpen(false);
                    }}
                    className="dropdown-btn"
                  >
                    ⚙️ {session.user.role === "ADMIN" ? "Admin Panel" : "Settings"}
                  </button>
                  <button
                    onClick={handleLogout}
                    className="dropdown-btn logout"
                  >
                    🚪 Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => {
                setLoginError("");
                setIsLoginModalOpen(true);
              }}
              className="nav-login cursor-pointer hover:opacity-95 transition-opacity"
            >
              LOGIN
            </button>
          )}
        </div>
      </div>

      {/* Actionable Mobile Search Row */}
      {isMobileSearchOpen && (
        <div className="lg:hidden border-t border-border bg-card w-full p-2.5 px-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              triggerToast(`Searching for "${searchQuery}"...`);
              setIsMobileSearchOpen(false);
              setSearchQuery("");
            }}
            className="flex items-center gap-2 bg-bg border border-border rounded-xl px-3 py-2 w-full"
          >
            <span className="text-xs">🔍</span>
            <input
              type="text"
              placeholder="Search rituals, festivals, concepts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-xs w-full text-body-text placeholder-sub-text"
              autoFocus
            />
            <button type="submit" className="text-pink font-semibold text-xs ml-1 bg-transparent border-none">
              Go
            </button>
          </form>

          {searchQuery.trim() && (
            <div className="mt-2 bg-card border border-border rounded-xl shadow-lg p-3 max-h-80 overflow-y-auto select-none">
              {/* Guides */}
              <div className="text-[10px] text-sub-text font-bold uppercase tracking-wider mb-2 font-sans">
                Rituals &amp; Guides
              </div>
              <div className="flex flex-col gap-1.5 font-sans mb-3">
                {searchResults.guides.length > 0 ? (
                  searchResults.guides.map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        triggerToast(`Opening guide: "${item.title}"`);
                        setIsMobileSearchOpen(false);
                        setSearchQuery("");
                        router.push(`/ritual-kits/${item.slug}`);
                      }}
                      className="flex items-center justify-between text-xs text-body-text hover:bg-bg p-2 rounded-lg cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <span>📖</span>
                        <span className="font-semibold">{item.title}</span>
                      </div>
                      <span className="text-[9px] text-pink bg-red-light px-1.5 py-0.5 rounded border border-red-200 uppercase font-bold scale-90">
                        {item.category}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-sub-text p-2">No matching guides</div>
                )}
              </div>

              {/* Kits */}
              <div className="text-[10px] text-sub-text font-bold uppercase tracking-wider mb-2 font-sans border-t border-border pt-2">
                Ritual Samagri Kits
              </div>
              <div className="flex flex-col gap-1.5 font-sans">
                {searchResults.kits.length > 0 ? (
                  searchResults.kits.map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setIsMobileSearchOpen(false);
                        setSearchQuery("");
                        router.push(`/ritual-kits/${item.id}`);
                      }}
                      className="flex items-center justify-between text-xs text-body-text hover:bg-bg p-2 rounded-lg cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <span>📦</span>
                        <div>
                          <div className="font-semibold leading-tight">{item.name}</div>
                          <div className="text-[9px] text-sub-text leading-none">{item.itemsCount}</div>
                        </div>
                      </div>
                      <span className="text-[10px] text-amber font-bold">₹{item.price}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-sub-text p-2">No matching kits</div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Mobile Category Tabs Strip (Scrollable) */}
      <div className="md:hidden border-t border-border bg-card w-full overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-2 px-4 h-[44px] min-w-max">
          {tabs.map((tab) => {
            const isActive = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`relative flex flex-col items-center justify-center px-3 h-full border-b-2 transition-all duration-200 ${isActive
                  ? "border-pink text-pink font-semibold"
                  : "border-transparent text-body-text"
                  }`}
              >
                <div className="flex items-center gap-1">
                  <span className="text-xs font-sans whitespace-nowrap">{tab.label}</span>
                  {tab.badge && (
                    <span className="bg-red-light text-pink text-[7px] font-bold px-1 rounded border border-red-200">
                      {tab.badge}
                    </span>
                  )}
                </div>
                {tab.subLabel && (
                  <span className="text-[7px] text-sub-text whitespace-nowrap leading-none">
                    {tab.subLabel}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── AUTH MODAL OVERLAY ── */}
      {isLoginModalOpen && (
        <div className="modal-overlay" onClick={() => setIsLoginModalOpen(false)}>
          <div className="modal-card font-sans" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setIsLoginModalOpen(false)}>✕</button>

            <div className="modal-header">
              <h2 className="modal-title font-serif">
                {authView === "admin"
                  ? "Super Admin Portal"
                  : authView === "signup"
                    ? "Create Account"
                    : "Welcome to The Tapa Co."}
              </h2>
              <p className="modal-sub">
                {authView === "admin"
                  ? "Access administrative parameters and configuration logs."
                  : "Dharma doesn't demand fear — it demands pure devotion."}
              </p>
            </div>

            {loginError && <div className="modal-error">{loginError}</div>}

            {/* OTP VERIFICATION VIEW */}
            {otpRequested ? (
              <form onSubmit={handleVerifyOtp} className="modal-body">
                <div className="modal-input-group">
                  <label className="modal-label">Verification Code (OTP)</label>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="Enter 6-digit code"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="modal-input"
                    disabled={loading}
                    required
                    autoFocus
                  />
                </div>

                <button type="submit" className="modal-btn-pink" disabled={loading}>
                  {loading ? "Verifying..." : "Verify & Sign In"}
                </button>

                <button
                  type="button"
                  onClick={() => setOtpRequested(false)}
                  className="modal-google-btn"
                  disabled={loading}
                >
                  ← Change Details
                </button>
              </form>
            ) : (
              /* VIEW SELECTION */
              <>
                {/* 1. SIGN IN VIEW */}
                {authView === "signin" && (
                  <form onSubmit={handleRequestOtp} className="modal-body">
                    <div className="modal-input-group">
                      <label className="modal-label">Phone Number</label>
                      <input
                        type="tel"
                        placeholder="+91XXXXXXXXXX"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="modal-input"
                        disabled={loading}
                        required
                      />
                    </div>

                    <button type="submit" className="modal-btn-pink" disabled={loading}>
                      {loading ? "Sending..." : "Request Verification Code"}
                    </button>

                    <div className="text-center text-xs mt-1">
                      <span className="text-sub-text">Don&apos;t have an account? </span>
                      <button
                        type="button"
                        onClick={() => { setAuthView("signup"); setLoginError(""); }}
                        className="text-pink font-bold hover:underline bg-transparent border-none cursor-pointer"
                      >
                        Sign Up
                      </button>
                    </div>

                    <div className="modal-divider">or</div>

                    <a
                      href="/api/auth/signin/google?callbackUrl=/"
                      className="modal-google-btn"
                      onClick={() => {
                        setLoading(true);
                        triggerToast("Redirecting to Google...");
                      }}
                    >
                      <svg className="modal-google-icon" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21.35,11.1H12v2.7h5.38C16.88,15.22,14.77,16.5,12,16.5c-3.03,0-5.61-2.08-6.53-4.88c-0.24-0.73-0.38-1.5-0.38-2.3 s0.14-1.57,0.38-2.3c0.92-2.8,3.5-4.88,6.53-4.88c1.64,0,3.12,0.6,4.28,1.71l2.02-2.02C16.51,2.02,14.41,1,12,1 C7.03,1,3,5.03,3,10s4.03,9,9,9c4.97,0,9-4.03,9-9C21,11.1,21,11.1,21.35,11.1z" fill="#EA4335" />
                      </svg>
                      <span>Continue with Google</span>
                    </a>

                    <div className="modal-divider"></div>

                    <button
                      type="button"
                      onClick={() => { setAuthView("admin"); setLoginError(""); }}
                      className="modal-google-btn bg-transparent border-border text-xs"
                    >
                      🔒 Super Admin Portal
                    </button>
                  </form>
                )}

                {/* 2. SIGN UP VIEW */}
                {authView === "signup" && (
                  <form onSubmit={handleRequestOtp} className="modal-body">
                    <div className="modal-input-group">
                      <label className="modal-label">Full Name</label>
                      <input
                        type="text"
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="modal-input"
                        disabled={loading}
                        required
                      />
                    </div>

                    <div className="modal-input-group">
                      <label className="modal-label">Phone Number</label>
                      <input
                        type="tel"
                        placeholder="+91XXXXXXXXXX"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="modal-input"
                        disabled={loading}
                        required
                      />
                    </div>

                    <div className="modal-input-group">
                      <label className="modal-label">Email Address (Optional)</label>
                      <input
                        type="email"
                        placeholder="yourname@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="modal-input"
                        disabled={loading}
                      />
                    </div>

                    <button type="submit" className="modal-btn-pink" disabled={loading}>
                      {loading ? "Sending..." : "Create Account & Verify"}
                    </button>

                    <div className="text-center text-xs mt-1">
                      <span className="text-sub-text">Already have an account? </span>
                      <button
                        type="button"
                        onClick={() => { setAuthView("signin"); setLoginError(""); }}
                        className="text-pink font-bold hover:underline bg-transparent border-none cursor-pointer"
                      >
                        Sign In
                      </button>
                    </div>

                    <div className="modal-divider">or</div>

                    <a
                      href="/api/auth/signin/google?callbackUrl=/"
                      className="modal-google-btn"
                      onClick={() => {
                        setLoading(true);
                        triggerToast("Redirecting to Google...");
                      }}
                    >
                      <svg className="modal-google-icon" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21.35,11.1H12v2.7h5.38C16.88,15.22,14.77,16.5,12,16.5c-3.03,0-5.61-2.08-6.53-4.88c-0.24-0.73-0.38-1.5-0.38-2.3 s0.14-1.57,0.38-2.3c0.92-2.8,3.5-4.88,6.53-4.88c1.64,0,3.12,0.6,4.28,1.71l2.02-2.02C16.51,2.02,14.41,1,12,1 C7.03,1,3,5.03,3,10s4.03,9,9,9c4.97,0,9-4.03,9-9C21,11.1,21,11.1,21.35,11.1z" fill="#EA4335" />
                      </svg>
                      <span>Continue with Google</span>
                    </a>
                  </form>
                )}

                {/* 3. ADMIN LOGIN VIEW */}
                {authView === "admin" && (
                  <form onSubmit={handleAdminLogin} className="modal-body">
                    <div className="modal-input-group">
                      <label className="modal-label">Email Address</label>
                      <input
                        type="email"
                        placeholder="admin@tapa.co"
                        value={adminEmail}
                        onChange={(e) => setAdminEmail(e.target.value)}
                        className="modal-input"
                        disabled={loading}
                        required
                      />
                    </div>

                    <div className="modal-input-group">
                      <label className="modal-label">Password</label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        className="modal-input"
                        disabled={loading}
                        required
                      />
                    </div>

                    <button type="submit" className="modal-btn-pink" disabled={loading}>
                      {loading ? "Authenticating..." : "Admin Access Verify"}
                    </button>

                    <button
                      type="button"
                      onClick={() => { setAuthView("signin"); setLoginError(""); }}
                      className="modal-google-btn bg-transparent border-transparent text-xs hover:underline text-pink"
                    >
                      ← Back to Customer Login
                    </button>
                  </form>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
