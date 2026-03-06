'use client'

import { useState } from 'react'
import { MapPin, Plus } from 'lucide-react'
import AddressCard from '@/components/dashboard/address-card'
import { MOCK_USER_ADDRESSES } from '@/lib/constants'

export default function AddressesPage() {
  const [addresses, setAddresses] = useState(MOCK_USER_ADDRESSES)

  const handleEdit = (id: string) => {
    // TODO: open edit modal / form
    alert(`Edit address ${id} (coming soon)`)
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this address?')) {
      setAddresses((prev) => prev.filter((a) => a.id !== id))
    }
  }

  return (
    <div className="space-y-5">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-header flex items-center justify-center shadow-button">
            <MapPin className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-sakura-900">Addresses</h1>
            <p className="text-sm text-muted">Manage your shipping addresses</p>
          </div>
        </div>

        <button className="btn-gradient flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" />
          Add Address
        </button>
      </div>

      {/* Grid */}
      {addresses.length === 0 ? (
        <div className="text-center py-16 text-muted">
          <MapPin className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>No addresses saved yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <AddressCard
              key={addr.id}
              address={addr}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}

