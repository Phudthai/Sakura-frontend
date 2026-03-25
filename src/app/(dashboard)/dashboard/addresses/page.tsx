'use client'

import { useCallback, useEffect, useState } from 'react'
import { MapPin, Plus, Loader2 } from 'lucide-react'
import AddressCard from '@/components/dashboard/address-card'
import AddressFormModal from '@/components/dashboard/address-form-modal'
import { API_ENDUSER_PREFIX } from '@/lib/api-config'
import { parseShippingAddressList } from '@/lib/shipping-address'
import {
  type ShippingAddressApi,
  shippingAddressToUserAddress,
  sortAddressesForDisplay,
} from '@/types/dashboard'

export default function AddressesPage() {
  const [list, setList] = useState<ShippingAddressApi[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
  const [editAddress, setEditAddress] = useState<ShippingAddressApi | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API_ENDUSER_PREFIX}/shipping-addresses`)
      const json = await res.json()
      if (res.status === 401) {
        setError('กรุณาเข้าสู่ระบบ')
        setList([])
        return
      }
      if (!res.ok) {
        const msg = json.error?.message ?? 'โหลดที่อยู่ไม่สำเร็จ'
        setError(typeof msg === 'string' ? msg : 'โหลดที่อยู่ไม่สำเร็จ')
        setList([])
        return
      }
      const raw = parseShippingAddressList(json)
      setList(raw)
    } catch {
      setError('เชื่อมต่อไม่สำเร็จ')
      setList([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const openCreate = () => {
    setModalMode('create')
    setEditAddress(null)
    setModalOpen(true)
  }

  const openEdit = (id: string) => {
    const a = list.find((x) => String(x.id) === id)
    if (!a) return
    setModalMode('edit')
    setEditAddress(a)
    setModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('ลบที่อยู่นี้?')) return
    try {
      const res = await fetch(`${API_ENDUSER_PREFIX}/shipping-addresses/${encodeURIComponent(id)}`, {
        method: 'DELETE',
      })
      if (!res.ok) {
        const json = await res.json().catch(() => ({}))
        const msg = json.error?.message ?? 'ลบไม่สำเร็จ'
        alert(typeof msg === 'string' ? msg : 'ลบไม่สำเร็จ')
        return
      }
      await load()
    } catch {
      alert('เชื่อมต่อไม่สำเร็จ')
    }
  }

  const handleSetDefault = async (id: string) => {
    try {
      const res = await fetch(`${API_ENDUSER_PREFIX}/shipping-addresses/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isDefault: true }),
      })
      if (!res.ok) {
        const json = await res.json().catch(() => ({}))
        const msg = json.error?.message ?? 'อัปเดตไม่สำเร็จ'
        alert(typeof msg === 'string' ? msg : 'อัปเดตไม่สำเร็จ')
        return
      }
      await load()
    } catch {
      alert('เชื่อมต่อไม่สำเร็จ')
    }
  }

  const sortedApi = sortAddressesForDisplay(
    list.map((a) => ({
      id: String(a.id),
      isDefault: a.isDefault,
      api: a,
    }))
  ).map((x) => x.api)

  const userRows = sortedApi.map((a) => shippingAddressToUserAddress(a))

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-header flex items-center justify-center shadow-button">
            <MapPin className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-sakura-900">Addresses</h1>
            <p className="text-sm text-muted">Manage your shipping addresses</p>
          </div>
        </div>

        <button type="button" onClick={openCreate} className="btn-gradient flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" />
          Add Address
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
          <button type="button" onClick={() => load()} className="ml-2 font-semibold underline">
            ลองอีกครั้ง
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20 text-sakura-700 gap-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>กำลังโหลด...</span>
        </div>
      ) : userRows.length === 0 ? (
        <div className="text-center py-16 text-muted">
          <MapPin className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>No addresses saved yet</p>
          <button type="button" onClick={openCreate} className="mt-4 btn-gradient text-sm">
            เพิ่มที่อยู่แรก
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {userRows.map((addr) => (
            <AddressCard
              key={addr.id}
              address={addr}
              onEdit={openEdit}
              onDelete={handleDelete}
              onSetDefault={handleSetDefault}
            />
          ))}
        </div>
      )}

      <AddressFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        mode={modalMode}
        editAddress={modalMode === 'edit' ? editAddress : null}
        onSaved={load}
      />
    </div>
  )
}
