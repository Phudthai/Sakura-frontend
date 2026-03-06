'use client'

import {
  Package,
  ShoppingCart,
  Plane,
  Truck,
  Warehouse,
  CheckCircle2,
  Clock,
  AlertCircle,
  MapPin,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { TrackingEvent, TrackingStatus } from '@/types/dashboard'

const STATUS_ICON: Record<TrackingStatus, React.ElementType> = {
  ORDER_PLACED: ShoppingCart,
  PROCESSING: Clock,
  PURCHASED: Package,
  PACKED: Package,
  SHIPPED_FROM_JP: Plane,
  IN_TRANSIT: Truck,
  CUSTOMS_CLEARANCE: AlertCircle,
  ARRIVED_WAREHOUSE: Warehouse,
  READY_FOR_DELIVERY: Package,
  OUT_FOR_DELIVERY: Truck,
  DELIVERED: CheckCircle2,
  FAILED_DELIVERY: AlertCircle,
}

function formatEventDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function TrackingTimeline({ events }: { events: TrackingEvent[] }) {
  // Show events in reverse-chronological order (newest first)
  const sorted = [...events].sort(
    (a, b) => new Date(b.eventAt).getTime() - new Date(a.eventAt).getTime()
  )

  return (
    <div className="space-y-0">
      {sorted.map((evt, idx) => {
        const Icon = STATUS_ICON[evt.status] ?? Package
        const isFirst = idx === 0
        const isLast = idx === sorted.length - 1

        return (
          <div key={evt.id} className="flex gap-3">
            {/* Vertical line & circle */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2',
                  isFirst
                    ? 'bg-gradient-header text-white border-transparent shadow-button'
                    : 'bg-white text-sakura-400 border-sakura-200'
                )}
              >
                <Icon className="w-4 h-4" />
              </div>
              {!isLast && (
                <div className="w-0.5 flex-1 min-h-[24px] bg-sakura-200" />
              )}
            </div>

            {/* Content */}
            <div className={cn('pb-5', isLast && 'pb-0')}>
              <p
                className={cn(
                  'text-sm font-medium leading-tight',
                  isFirst ? 'text-sakura-900' : 'text-sakura-600'
                )}
              >
                {evt.description}
              </p>
              <div className="flex items-center gap-3 mt-0.5 text-xs text-muted">
                <span>{formatEventDate(evt.eventAt)}</span>
                {evt.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {evt.location}
                  </span>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

