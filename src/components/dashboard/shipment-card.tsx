'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronDown, ChevronUp, Package, Calendar, Hash } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatPrice } from '@/lib/utils'
import TrackingTimeline from './tracking-timeline'
import type { UserOrder } from '@/types/dashboard'

/** Maps order/tracking status to a display badge */
function statusBadge(status: string) {
  const map: Record<string, { label: string; color: string }> = {
    PROCESSING: { label: 'Processing', color: 'bg-blue-100 text-blue-700' },
    PURCHASED: { label: 'Purchased', color: 'bg-indigo-100 text-indigo-700' },
    SHIPPED_TO_TH: { label: 'Shipped to TH', color: 'bg-purple-100 text-purple-700' },
    IN_TRANSIT: { label: 'In Transit', color: 'bg-cyan-100 text-cyan-700' },
    ARRIVED_TH: { label: 'Arrived TH', color: 'bg-violet-100 text-violet-700' },
    ARRIVED_WAREHOUSE: { label: 'At Warehouse', color: 'bg-violet-100 text-violet-700' },
    READY_TO_SHIP: { label: 'Ready to Ship', color: 'bg-amber-100 text-amber-700' },
    SHIPPED_TO_CUSTOMER: { label: 'Shipping', color: 'bg-sakura-100 text-sakura-700' },
    OUT_FOR_DELIVERY: { label: 'Out for Delivery', color: 'bg-green-100 text-green-700' },
    DELIVERED: { label: 'Delivered', color: 'bg-green-100 text-green-700' },
  }
  const cfg = map[status] ?? { label: status, color: 'bg-gray-100 text-gray-700' }
  return (
    <span className={cn('px-2.5 py-0.5 rounded-full text-xs font-bold', cfg.color)}>
      {cfg.label}
    </span>
  )
}

function formatDate(iso?: string) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export default function ShipmentCard({ order }: { order: UserOrder }) {
  const [expanded, setExpanded] = useState(false)
  const tracking = order.tracking

  return (
    <div className="bg-white rounded-2xl border border-card-border shadow-card overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-4 p-4 hover:bg-sakura-50/50 transition-colors text-left"
      >
        {/* First item image */}
        <div className="w-14 h-14 rounded-xl bg-sakura-50 overflow-hidden shrink-0 relative">
          {order.items[0]?.imageUrl ? (
            <Image
              src={order.items[0].imageUrl}
              alt={order.items[0].productName}
              fill
              className="object-cover"
              sizes="56px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package className="w-6 h-6 text-sakura-300" />
            </div>
          )}
          {order.items.length > 1 && (
            <span className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-sakura-600 text-white text-[10px] font-bold flex items-center justify-center">
              +{order.items.length - 1}
            </span>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-bold text-sakura-900">{order.orderNumber}</span>
            {statusBadge(tracking?.status ?? order.status)}
          </div>
          <p className="text-xs text-muted mt-1 truncate">
            {order.items.map((i) => i.productName).join(', ')}
          </p>
          <div className="flex items-center gap-4 mt-1 text-[11px] text-muted">
            {tracking?.carrier && (
              <span className="flex items-center gap-1">
                <Package className="w-3 h-3" /> {tracking.carrier}
              </span>
            )}
            {tracking?.trackingNumber && (
              <span className="flex items-center gap-1">
                <Hash className="w-3 h-3" /> {tracking.trackingNumber}
              </span>
            )}
            {tracking?.estimatedDelivery && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" /> Est. {formatDate(tracking.estimatedDelivery)}
              </span>
            )}
          </div>
        </div>

        <ChevronDown
          className={cn(
            'w-5 h-5 text-sakura-400 shrink-0 transition-transform',
            expanded && 'rotate-180'
          )}
        />
      </button>

      {/* Expanded timeline */}
      {expanded && tracking && tracking.events.length > 0 && (
        <div className="border-t border-card-border px-4 py-4 bg-sakura-50/30">
          <TrackingTimeline events={tracking.events} />
        </div>
      )}

      {/* Expanded items list */}
      {expanded && (
        <div className="border-t border-card-border px-4 py-3 space-y-2">
          <p className="text-xs font-semibold text-sakura-700 uppercase tracking-wider">
            Items ({order.items.length})
          </p>
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-sakura-50 overflow-hidden relative shrink-0">
                {item.imageUrl ? (
                  <Image src={item.imageUrl} alt={item.productName} fill className="object-cover" sizes="40px" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="w-4 h-4 text-sakura-300" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-sakura-900 truncate">{item.productName}</p>
                <p className="text-xs text-muted">
                  {formatPrice(item.priceJPY)} &times; {item.quantity}
                  {item.variant && ` — ${item.variant}`}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

