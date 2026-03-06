'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronDown, Package } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatPrice } from '@/lib/utils'
import type { UserOrder, OrderStatus } from '@/types/dashboard'

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string }> = {
  DRAFT: { label: 'Draft', color: 'bg-gray-100 text-gray-600' },
  PENDING_PAYMENT: { label: 'Pending Payment', color: 'bg-yellow-100 text-yellow-700' },
  PAID: { label: 'Paid', color: 'bg-green-100 text-green-700' },
  PROCESSING: { label: 'Processing', color: 'bg-blue-100 text-blue-700' },
  PURCHASED: { label: 'Purchased', color: 'bg-blue-100 text-blue-700' },
  SHIPPED_TO_TH: { label: 'Shipped to TH', color: 'bg-indigo-100 text-indigo-700' },
  ARRIVED_TH: { label: 'Arrived TH', color: 'bg-purple-100 text-purple-700' },
  READY_TO_SHIP: { label: 'Ready to Ship', color: 'bg-purple-100 text-purple-700' },
  SHIPPED_TO_CUSTOMER: { label: 'Shipping', color: 'bg-cyan-100 text-cyan-700' },
  COMPLETED: { label: 'Completed', color: 'bg-green-100 text-green-700' },
  CANCELLED: { label: 'Cancelled', color: 'bg-red-100 text-red-600' },
  REFUNDED: { label: 'Refunded', color: 'bg-orange-100 text-orange-700' },
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export default function OrderRow({ order }: { order: UserOrder }) {
  const [expanded, setExpanded] = useState(false)
  const cfg = STATUS_CONFIG[order.status]

  return (
    <div className="bg-white rounded-2xl border border-card-border shadow-card overflow-hidden">
      {/* Summary row */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full grid grid-cols-[1fr_auto_auto_auto_auto] items-center gap-4 p-4 hover:bg-sakura-50/50 transition-colors text-left"
      >
        <div className="min-w-0">
          <p className="text-sm font-bold text-sakura-900">{order.orderNumber}</p>
          <p className="text-xs text-muted mt-0.5">{formatDate(order.createdAt)}</p>
        </div>
        <span className={cn('px-2.5 py-0.5 rounded-full text-xs font-bold', cfg.color)}>
          {cfg.label}
        </span>
        <div className="text-right hidden sm:block">
          <p className="text-xs text-muted">JPY</p>
          <p className="text-sm font-semibold text-sakura-800">{formatPrice(order.totalJPY)}</p>
        </div>
        <div className="text-right hidden sm:block">
          <p className="text-xs text-muted">THB</p>
          <p className="text-sm font-semibold text-sakura-800">฿{order.totalTHB.toLocaleString()}</p>
        </div>
        <ChevronDown
          className={cn(
            'w-5 h-5 text-sakura-400 shrink-0 transition-transform',
            expanded && 'rotate-180'
          )}
        />
      </button>

      {/* Expanded details */}
      {expanded && (
        <div className="border-t border-card-border">
          {/* Items */}
          <div className="px-4 py-3 space-y-2">
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

          {/* Price breakdown */}
          <div className="border-t border-card-border px-4 py-3">
            <p className="text-xs font-semibold text-sakura-700 uppercase tracking-wider mb-2">
              Price Breakdown
            </p>
            <div className="grid grid-cols-2 gap-y-1 text-sm">
              <span className="text-muted">Subtotal (JPY)</span>
              <span className="text-right text-sakura-800">{formatPrice(order.totalJPY)}</span>
              <span className="text-muted">Exchange Rate</span>
              <span className="text-right text-sakura-800">1 JPY = {order.exchangeRate} THB</span>
              <span className="text-muted">Service Fee</span>
              <span className="text-right text-sakura-800">฿{order.serviceFee.toLocaleString()}</span>
              <span className="text-muted">Shipping</span>
              <span className="text-right text-sakura-800">฿{order.shippingCost.toLocaleString()}</span>
              {order.discount > 0 && (
                <>
                  <span className="text-muted">Discount {order.discountCode && `(${order.discountCode})`}</span>
                  <span className="text-right text-green-600">-฿{order.discount.toLocaleString()}</span>
                </>
              )}
              <span className="font-bold text-sakura-900 pt-1 border-t border-card-border">Total (THB)</span>
              <span className="text-right font-bold text-sakura-900 pt-1 border-t border-card-border">
                ฿{order.totalTHB.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Tracking info */}
          {order.tracking && (
            <div className="border-t border-card-border px-4 py-3 text-sm">
              <p className="text-xs font-semibold text-sakura-700 uppercase tracking-wider mb-1">
                Tracking
              </p>
              <div className="flex flex-wrap gap-x-6 gap-y-1 text-muted">
                {order.tracking.carrier && <span>Carrier: <b className="text-sakura-800">{order.tracking.carrier}</b></span>}
                {order.tracking.trackingNumber && <span>Tracking #: <b className="text-sakura-800">{order.tracking.trackingNumber}</b></span>}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

