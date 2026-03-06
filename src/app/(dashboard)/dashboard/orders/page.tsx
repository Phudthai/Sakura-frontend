'use client'

import { useState } from 'react'
import { ClipboardList } from 'lucide-react'
import OrderRow from '@/components/dashboard/order-row'
import { MOCK_USER_ORDERS } from '@/lib/constants'
import type { OrderStatus } from '@/types/dashboard'
import { cn } from '@/lib/utils'

type FilterValue = 'all' | 'active' | 'completed' | 'cancelled'

const TABS: { value: FilterValue; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled / Refunded' },
]

const ACTIVE_STATUSES = new Set<OrderStatus>([
  'DRAFT', 'PENDING_PAYMENT', 'PAID', 'PROCESSING', 'PURCHASED',
  'SHIPPED_TO_TH', 'ARRIVED_TH', 'READY_TO_SHIP', 'SHIPPED_TO_CUSTOMER',
])

function matchFilter(status: OrderStatus, filter: FilterValue): boolean {
  if (filter === 'all') return true
  if (filter === 'active') return ACTIVE_STATUSES.has(status)
  if (filter === 'completed') return status === 'COMPLETED'
  return status === 'CANCELLED' || status === 'REFUNDED'
}

export default function OrderHistoryPage() {
  const [filter, setFilter] = useState<FilterValue>('all')
  const orders = MOCK_USER_ORDERS.filter((o) => matchFilter(o.status, filter))

  return (
    <div className="space-y-5">
      {/* Title */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-header flex items-center justify-center shadow-button">
          <ClipboardList className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-sakura-900">Order History</h1>
          <p className="text-sm text-muted">View all your orders</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {TABS.map((tab) => {
          const count = MOCK_USER_ORDERS.filter((o) => matchFilter(o.status, tab.value)).length
          return (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={cn(
                'px-3.5 py-1.5 rounded-full text-sm font-medium border transition-all',
                filter === tab.value
                  ? 'bg-gradient-header text-white border-transparent shadow-button'
                  : 'bg-white text-sakura-700 border-card-border hover:bg-sakura-50'
              )}
            >
              {tab.label}
              <span className="ml-1.5 opacity-70">({count})</span>
            </button>
          )
        })}
      </div>

      {/* Orders list */}
      {orders.length === 0 ? (
        <div className="text-center py-16 text-muted">
          <ClipboardList className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>No orders in this category</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <OrderRow key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  )
}

