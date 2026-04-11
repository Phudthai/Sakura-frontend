"use client";

import {
  useState,
  useEffect,
  useRef,
  useLayoutEffect,
  useCallback,
} from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import logoSrc from "@/public/Sakura_logo.png";
import {
  Bell,
  Globe,
  Menu,
  X,
  LogOut,
  User,
  ChevronDown,
  LayoutDashboard,
  Gavel,
  Truck,
  MapPin,
  Wallet,
} from "lucide-react";
import SearchInput from "@/components/ui/search-input";
import { useAuth } from "@/context/auth-context";
import FallingSakura from "./falling-sakura";
import SpaceBackground from "./space-background";

interface HeaderProps {
  onSearch?: (keyword: string) => void;
  tabs?: ReadonlyArray<{ id: string; label: string }>;
  currentTab?: string;
  /** When this value changes (e.g. after navigation), closes the auction platform dropdown */
  auctionPlatformMenuKey?: string;
}

export default function Header({
  onSearch,
  tabs,
  currentTab,
  auctionPlatformMenuKey,
}: HeaderProps) {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [portalReady, setPortalReady] = useState(false);
  const [auctionTabOpen, setAuctionTabOpen] = useState(false);
  const [auctionMenuPos, setAuctionMenuPos] = useState({
    top: 0,
    left: 0,
    width: 0,
  });
  const auctionTabBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setPortalReady(true);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    setAuctionTabOpen(false);
  }, [auctionPlatformMenuKey]);

  const updateAuctionMenuPosition = useCallback(() => {
    const el = auctionTabBtnRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const pad = 8;
    const minW = 200;
    const w = Math.max(r.width, minW);
    let left = r.left;
    if (typeof window !== "undefined") {
      left = Math.min(
        Math.max(pad, left),
        window.innerWidth - w - pad,
      );
    }
    setAuctionMenuPos({
      top: r.bottom + 8,
      left,
      width: w,
    });
  }, []);

  useLayoutEffect(() => {
    if (!auctionTabOpen) return;
    updateAuctionMenuPosition();
    const onScrollOrResize = () => updateAuctionMenuPosition();
    window.addEventListener("scroll", onScrollOrResize, true);
    window.addEventListener("resize", onScrollOrResize);
    return () => {
      window.removeEventListener("scroll", onScrollOrResize, true);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, [auctionTabOpen, updateAuctionMenuPosition]);

  useEffect(() => {
    if (!auctionTabOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAuctionTabOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [auctionTabOpen]);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileMenuOpen]);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const handleLogout = async () => {
    setShowDropdown(false);
    closeMobileMenu();
    await logout();
    router.push("/login");
  };

  return (
    <header className="shadow-header sticky top-0 z-50">
      {/* Top bar - white background */}
      <div className="bg-white text-sakura-800">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-2 flex items-center gap-3 md:gap-4">
          {/* Logo */}
          <Link href="/">
            <Image
              src={logoSrc}
              alt="Sakura"
              className="h-12 md:h-16 w-auto drop-shadow-sm select-none"
            />
          </Link>

          {/* Search */}
          {onSearch && (
            <SearchInput onSearch={onSearch} placeholder="Search items..." />
          )}

          {/* Right actions */}
          <div className="hidden md:flex items-center gap-3 ml-auto">
            <button className="p-2 rounded-full hover:bg-sakura-100 transition-colors">
              <Bell className="w-5 h-5" />
            </button>

            {/* Auth-dependent UI */}
            {isLoading ? (
              /* Skeleton while loading */
              <div className="w-24 h-9 rounded-full bg-sakura-200 animate-pulse" />
            ) : user ? (
              <>
              {user.wallet != null && (
                <Link
                  href="/dashboard/wallet"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-full
                             bg-sakura-100 hover:bg-sakura-200 transition-colors shrink-0"
                >
                  <Wallet className="w-4 h-4 text-sakura-700" />
                  <span className="text-sm font-semibold text-sakura-900">
                    {user.wallet.balance.toLocaleString()}
                  </span>
                  <span className="text-xs text-sakura-600">{user.wallet.currency}</span>
                </Link>
              )}
              {/* Logged in — user dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 px-3 py-2 rounded-full
                           bg-sakura-100 hover:bg-sakura-200 transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-sakura-200 flex items-center justify-center">
                    <User className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium max-w-[120px] truncate text-sakura-900">
                    {user.name}
                  </span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {/* Dropdown */}
                {showDropdown && (
                  <>
                    {/* Invisible overlay to close dropdown */}
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowDropdown(false)}
                    />
                    <div
                      className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl
                               shadow-card-hover border border-card-border z-50
                               animate-fade-slide-in overflow-hidden"
                    >
                      {/* User info */}
                      <div className="px-4 py-3 border-b border-card-border bg-sakura-50/50">
                        <p className="text-sm font-semibold text-sakura-900 truncate">
                          {user.name}
                        </p>
                        <p className="text-xs text-muted-dark truncate">
                          {user.email}
                        </p>
                        {user.wallet != null && (
                          <Link
                            href="/dashboard/wallet"
                            onClick={() => setShowDropdown(false)}
                            className="inline-flex items-center gap-1.5 mt-1.5 px-2.5 py-1 rounded-full
                                       bg-sakura-100 hover:bg-sakura-200 transition-colors
                                       text-xs font-semibold text-sakura-800"
                          >
                            <Wallet className="w-3 h-3" />
                            {user.wallet.balance.toLocaleString()} {user.wallet.currency}
                          </Link>
                        )}
                        {user.role !== "CUSTOMER" && (
                          <span
                            className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold
                                       rounded-full bg-sakura-200 text-sakura-800 uppercase"
                          >
                            {user.role}
                          </span>
                        )}
                      </div>

                      {/* Menu items */}
                      <div className="py-1">
                        <Link
                          href="/dashboard/bids"
                          onClick={() => setShowDropdown(false)}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-sakura-700
                                 hover:bg-sakura-50 transition-colors"
                        >
                          <Gavel className="w-4 h-4" />
                          My Bids
                        </Link>
                        <Link
                          href="/dashboard/shipments"
                          onClick={() => setShowDropdown(false)}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-sakura-700
                                 hover:bg-sakura-50 transition-colors"
                        >
                          <Truck className="w-4 h-4" />
                          Shipments
                        </Link>
                        <Link
                          href="/dashboard/profile"
                          onClick={() => setShowDropdown(false)}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-sakura-700
                                 hover:bg-sakura-50 transition-colors"
                        >
                          <User className="w-4 h-4" />
                          Profile
                        </Link>
                      </div>
                      <div className="border-t border-card-border py-1">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500
                                 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
              </>
            ) : (
              /* Not logged in — sign in / create account buttons */
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 btn-gradient rounded-full text-sm"
                >
                  Sign in
                </Link>

                <Link
                  href="/register"
                  className="px-4 py-2 border border-sakura-400 text-sakura-700 rounded-full
                         text-sm font-medium hover:bg-sakura-50 transition-colors"
                >
                  Create account
                </Link>
              </>
            )}

            <button
              className="flex items-center gap-1 text-sm hover:bg-sakura-100
                          p-2 rounded-full transition-colors"
            >
              <Globe className="w-4 h-4" />
              <span className="hidden xl:inline">English</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden p-2 rounded-full hover:bg-sakura-100 transition-colors ml-auto"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav-panel"
            onClick={() => setMobileMenuOpen((o) => !o)}
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" aria-hidden />
            ) : (
              <Menu className="w-5 h-5" aria-hidden />
            )}
          </button>
        </div>
      </div>

      {/* Mobile slide-over — portal to body so tabs/content never paint above it */}
      {portalReady &&
        mobileMenuOpen &&
        createPortal(
          <div className="md:hidden">
            <div
              className="fixed inset-0 z-[200] bg-black/50"
              aria-hidden
              onClick={closeMobileMenu}
            />
            <div
              id="mobile-nav-panel"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
              className="fixed top-0 right-0 z-[210] flex h-[100dvh] w-[min(100%,20rem)] flex-col bg-white shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex shrink-0 items-center justify-between border-b border-card-border px-4 py-3">
                <span className="text-sm font-semibold text-sakura-900">Menu</span>
                <button
                  type="button"
                  onClick={closeMobileMenu}
                  className="rounded-lg p-2 hover:bg-sakura-100 text-sakura-800"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4">
                {isLoading ? (
                  <div className="h-24 rounded-xl bg-sakura-100 animate-pulse" />
                ) : user ? (
                  <div className="space-y-4">
                    <div className="rounded-xl border border-card-border bg-sakura-50/50 p-3">
                      <p className="text-sm font-semibold text-sakura-900 truncate">{user.name}</p>
                      <p className="text-xs text-muted-dark truncate">{user.email}</p>
                      {user.wallet != null ? (
                        <Link
                          href="/dashboard/wallet"
                          onClick={closeMobileMenu}
                          className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-sakura-100 px-2.5 py-1 text-xs font-semibold text-sakura-800"
                        >
                          <Wallet className="w-3 h-3" />
                          {user.wallet.balance.toLocaleString()} {user.wallet.currency}
                        </Link>
                      ) : (
                        <Link
                          href="/dashboard/wallet"
                          onClick={closeMobileMenu}
                          className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-sakura-700 underline"
                        >
                          <Wallet className="w-3 h-3" />
                          เปิดกระเป๋าเงิน / My Wallet
                        </Link>
                      )}
                    </div>

                    <nav className="flex flex-col gap-1">
                      <Link
                        href="/dashboard"
                        onClick={closeMobileMenu}
                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-sakura-700 hover:bg-sakura-50"
                      >
                        <LayoutDashboard className="w-4 h-4 shrink-0" />
                        Dashboard
                      </Link>
                      <Link
                        href="/dashboard/wallet"
                        onClick={closeMobileMenu}
                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-sakura-700 hover:bg-sakura-50"
                      >
                        <Wallet className="w-4 h-4 shrink-0" />
                        My Wallet
                      </Link>
                      <Link
                        href="/dashboard/bids"
                        onClick={closeMobileMenu}
                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-sakura-700 hover:bg-sakura-50"
                      >
                        <Gavel className="w-4 h-4 shrink-0" />
                        My Bids
                      </Link>
                      <Link
                        href="/dashboard/shipments"
                        onClick={closeMobileMenu}
                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-sakura-700 hover:bg-sakura-50"
                      >
                        <Truck className="w-4 h-4 shrink-0" />
                        Shipments
                      </Link>
                      <Link
                        href="/dashboard/profile"
                        onClick={closeMobileMenu}
                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-sakura-700 hover:bg-sakura-50"
                      >
                        <User className="w-4 h-4 shrink-0" />
                        Profile
                      </Link>
                      <Link
                        href="/dashboard/addresses"
                        onClick={closeMobileMenu}
                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-sakura-700 hover:bg-sakura-50"
                      >
                        <MapPin className="w-4 h-4 shrink-0" />
                        Addresses
                      </Link>
                      <Link
                        href="/dashboard/notifications"
                        onClick={closeMobileMenu}
                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-sakura-700 hover:bg-sakura-50"
                      >
                        <Bell className="w-4 h-4 shrink-0" />
                        Notifications
                      </Link>
                    </nav>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-red-500 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign out
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <p className="text-xs text-muted-dark">
                      เข้าสู่ระบบเพื่อดูกระเป๋าเงินและข้อมูลบัญชี
                    </p>
                    <Link
                      href="/login"
                      onClick={closeMobileMenu}
                      className="btn-gradient rounded-xl px-4 py-2.5 text-center text-sm font-semibold"
                    >
                      Sign in
                    </Link>
                    <Link
                      href="/register"
                      onClick={closeMobileMenu}
                      className="rounded-xl border border-sakura-400 px-4 py-2.5 text-center text-sm font-medium text-sakura-700 hover:bg-sakura-50"
                    >
                      Create account
                    </Link>
                  </div>
                )}

                <div className="mt-6 flex items-center gap-2 border-t border-card-border pt-4 text-sm text-sakura-700">
                  <Globe className="w-4 h-4" />
                  <span>English</span>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* Tabs - purple space theme, unchanged */}
      {tabs && tabs.length > 0 && (
        <div className="relative overflow-hidden text-white">
          <SpaceBackground />
          <FallingSakura />
          <div className="relative z-10 min-w-0 border-t border-white/20">
            <div
              className="max-w-[1400px] mx-auto overflow-x-auto overflow-y-hidden scroll-smooth [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.35)_transparent] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/30"
            >
              <nav className="flex w-max min-w-full flex-nowrap px-4 md:px-6">
                {tabs.map((t) =>
                  t.id === "search_link" ? (
                    <div key={t.id} className="shrink-0 flex">
                      <button
                        ref={auctionTabBtnRef}
                        type="button"
                        aria-haspopup="menu"
                        aria-expanded={auctionTabOpen}
                        aria-controls="auction-platform-menu"
                        id="auction-platform-trigger"
                        onClick={() => {
                          setAuctionTabOpen((o) => {
                            const next = !o;
                            if (next) {
                              queueMicrotask(() => updateAuctionMenuPosition());
                            }
                            return next;
                          });
                        }}
                        className={`flex items-center gap-1.5 px-4 sm:px-5 py-3.5 text-sm font-medium border-b-4 transition-all whitespace-nowrap
                  ${
                    currentTab === t.id
                      ? "border-white text-white bg-white/15 font-semibold"
                      : "border-transparent text-white/70 hover:text-white hover:border-white/40 hover:bg-white/5"
                  }`}
                      >
                        {t.label}
                        <ChevronDown
                          className={`h-4 w-4 shrink-0 transition-transform ${
                            auctionTabOpen ? "rotate-180" : ""
                          }`}
                          aria-hidden
                        />
                      </button>
                    </div>
                  ) : (
                    <Link
                      key={t.id}
                      href={`/?tab=${t.id}`}
                      className={`shrink-0 px-4 sm:px-5 py-3.5 text-sm font-medium border-b-4 transition-all whitespace-nowrap
                  ${
                    currentTab === t.id
                      ? "border-white text-white bg-white/15 font-semibold"
                      : "border-transparent text-white/70 hover:text-white hover:border-white/40 hover:bg-white/5"
                  }`}
                    >
                      {t.label}
                    </Link>
                  ),
                )}
              </nav>
            </div>
          </div>
        </div>
      )}

      {portalReady &&
        auctionTabOpen &&
        createPortal(
          <>
            <div
              className="fixed inset-0 z-[45]"
              aria-hidden
              onClick={() => setAuctionTabOpen(false)}
            />
            <div
              id="auction-platform-menu"
              role="menu"
              aria-labelledby="auction-platform-trigger"
              className="fixed z-[55] overflow-hidden rounded-xl border border-white/40 bg-gradient-header py-1 shadow-header animate-fade-slide-in"
              style={{
                top: auctionMenuPos.top,
                left: auctionMenuPos.left,
                minWidth: auctionMenuPos.width || 200,
              }}
            >
              <Link
                role="menuitem"
                href="/?tab=search_link&platform=yahoo"
                onClick={() => setAuctionTabOpen(false)}
                className="block px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/20 transition-colors"
              >
                Yahoo Auctions Japan
              </Link>
              <Link
                role="menuitem"
                href="/?tab=search_link&platform=mercari"
                onClick={() => setAuctionTabOpen(false)}
                className="block px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/20 transition-colors border-t border-white/15"
              >
                Mercari
              </Link>
            </div>
          </>,
          document.body,
        )}
    </header>
  );
}
