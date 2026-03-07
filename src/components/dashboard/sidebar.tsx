'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Gavel,
  Truck,
  ClipboardList,
  UserCircle,
  MapPin,
  Bell,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const MENU_ITEMS = [
  { href: '/dashboard/bids', label: 'My Bids', icon: Gavel },
  { href: '/dashboard/shipments', label: 'Shipments', icon: Truck },
  { href: '/dashboard/orders', label: 'Order History', icon: ClipboardList },
  { href: '/dashboard/profile', label: 'Profile', icon: UserCircle },
  { href: '/dashboard/addresses', label: 'Addresses', icon: MapPin },
  { href: '/dashboard/notifications', label: 'Notifications', icon: Bell },
] as const

export default function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-56 shrink-0 hidden lg:block">
      <nav className="sticky top-20 space-y-1">
        {MENU_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all',
                isActive
                  ? 'bg-gradient-header text-white shadow-button'
                  : 'text-sakura-800 hover:bg-sakura-100 hover:text-sakura-900'
              )}
            >
              <Icon className="w-4.5 h-4.5 shrink-0" />
              {label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}

