'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import logoSrc from '@/public/Sakura_logo.png'
import { Bell, Globe, Menu, LogOut, User, ChevronDown, LayoutDashboard, Gavel, Truck, ClipboardList, MapPin } from 'lucide-react'
import SearchInput from '@/components/ui/search-input'
import { useAuth } from '@/context/auth-context'

interface HeaderProps {
  onSearch?: (keyword: string) => void
}

export default function Header({ onSearch }: HeaderProps) {
  const { user, isLoading, logout } = useAuth()
  const router = useRouter()
  const [showDropdown, setShowDropdown] = useState(false)

  const handleLogout = async () => {
    setShowDropdown(false)
    await logout()
    router.push('/login')
  }

  return (
    <header className="bg-gradient-header text-white shadow-header sticky top-0 z-50">
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
      {onSearch && <SearchInput onSearch={onSearch} placeholder="Search items..." />}

      {/* Right actions */}
      <div className="hidden md:flex items-center gap-3 ml-auto">
        <button className="p-2 rounded-full hover:bg-white/15 transition-colors">
          <Bell className="w-5 h-5" />
        </button>

        {/* Auth-dependent UI */}
        {isLoading ? (
          /* Skeleton while loading */
          <div className="w-24 h-9 rounded-full bg-white/20 animate-pulse" />
        ) : user ? (
          /* Logged in — user dropdown */
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 px-3 py-2 rounded-full
                         bg-white/15 hover:bg-white/25 transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-white/30 flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium max-w-[120px] truncate">
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
                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl
                               shadow-card-hover border border-card-border z-50
                               animate-fade-slide-in overflow-hidden">
                  {/* User info */}
                  <div className="px-4 py-3 border-b border-card-border bg-sakura-50/50">
                    <p className="text-sm font-semibold text-sakura-900 truncate">{user.name}</p>
                    <p className="text-xs text-muted-dark truncate">{user.email}</p>
                    {user.role !== 'CUSTOMER' && (
                      <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold
                                       rounded-full bg-sakura-200 text-sakura-800 uppercase">
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
                      Active Bids
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
                      href="/dashboard/orders"
                      onClick={() => setShowDropdown(false)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-sakura-700
                                 hover:bg-sakura-50 transition-colors"
                    >
                      <ClipboardList className="w-4 h-4" />
                      Order History
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
        ) : (
          /* Not logged in — sign in / create account buttons */
          <>
            <Link
              href="/login"
              className="px-4 py-2 bg-white text-sakura-600 rounded-full text-sm
                         font-semibold hover:opacity-90 transition-opacity shadow-sm"
            >
              Sign in
            </Link>

            <Link
              href="/register"
              className="px-4 py-2 border border-white/60 text-white rounded-full
                         text-sm font-medium hover:bg-white/15 transition-colors"
            >
              Create account
            </Link>
          </>
        )}

        <button className="flex items-center gap-1 text-sm hover:bg-white/15
                          p-2 rounded-full transition-colors">
          <Globe className="w-4 h-4" />
          <span className="hidden xl:inline">English</span>
        </button>
      </div>

      {/* Mobile menu button */}
      <button className="md:hidden p-2 rounded-full hover:bg-white/15 transition-colors ml-auto">
        <Menu className="w-5 h-5" />
      </button>
      </div>
    </header>
  )
}
