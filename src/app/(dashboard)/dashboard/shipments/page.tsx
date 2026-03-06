'use client'

import { Truck } from 'lucide-react'
import ShipmentCard from '@/components/dashboard/shipment-card'
import { MOCK_USER_ORDERS } from '@/lib/constants'

/** Statuses that represent "in shipping pipeline" */
const SHIPPING_STATUSES = new Set([
  'PAID',
  'PROCESSING',
  'PURCHASED',
  'SHIPPED_TO_TH',
  'ARRIVED_TH',
  'READY_TO_SHIP',
  'SHIPPED_TO_CUSTOMER',
])

export default function ShipmentsPage() {
  const shipments = MOCK_USER_ORDERS.filter((o) => SHIPPING_STATUSES.has(o.status))

  return (
    <div className="space-y-5">
      {/* Title */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-header flex items-center justify-center shadow-button">
          <Truck className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-sakura-900">Shipments</h1>
          <p className="text-sm text-muted">
            Track your orders in the shipping pipeline
          </p>
        </div>
      </div>

      {/* List */}
      {shipments.length === 0 ? (
        <div className="text-center py-16 text-muted">
          <Truck className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>No active shipments right now</p>
        </div>
      ) : (
        <div className="space-y-4">
          {shipments.map((order) => (
            <ShipmentCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  )
}

