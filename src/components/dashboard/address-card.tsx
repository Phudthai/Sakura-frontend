'use client'

import { MapPin, Phone, Star, Pencil, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { UserAddress } from '@/types/dashboard'

interface AddressCardProps {
  address: UserAddress
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
}

export default function AddressCard({ address, onEdit, onDelete }: AddressCardProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-2xl border shadow-card p-4 relative',
        address.isDefault ? 'border-sakura-400' : 'border-card-border'
      )}
    >
      {/* Default badge */}
      {address.isDefault && (
        <span className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-sakura-100 text-sakura-700 border border-sakura-200">
          <Star className="w-3 h-3 fill-sakura-400 text-sakura-400" />
          Default
        </span>
      )}

      {/* Label */}
      {address.label && (
        <p className="text-sm font-bold text-sakura-900 mb-1">{address.label}</p>
      )}

      {/* Address */}
      <div className="flex items-start gap-2 text-sm text-sakura-800">
        <MapPin className="w-4 h-4 text-sakura-400 shrink-0 mt-0.5" />
        <div>
          <p>{address.fullAddress}</p>
          <p>
            {address.district}, {address.province} {address.postalCode}
          </p>
        </div>
      </div>

      {/* Phone */}
      <div className="flex items-center gap-2 text-sm text-muted mt-2">
        <Phone className="w-4 h-4 text-sakura-400" />
        {address.phone}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-card-border">
        <button
          onClick={() => onEdit?.(address.id)}
          className="flex items-center gap-1.5 text-xs font-medium text-sakura-600 hover:text-sakura-800 transition-colors"
        >
          <Pencil className="w-3.5 h-3.5" />
          Edit
        </button>
        {!address.isDefault && (
          <button
            onClick={() => onDelete?.(address.id)}
            className="flex items-center gap-1.5 text-xs font-medium text-red-400 hover:text-red-600 transition-colors ml-3"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete
          </button>
        )}
      </div>
    </div>
  )
}

