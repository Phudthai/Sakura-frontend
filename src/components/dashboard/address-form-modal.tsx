'use client'

import { useEffect, useState } from 'react'
import { X, Loader2 } from 'lucide-react'
import { API_ENDUSER_PREFIX } from '@/lib/api-config'
import type { ShippingAddressApi, ShippingAddressCreateBody } from '@/types/dashboard'

const emptyForm: ShippingAddressCreateBody = {
  recipientName: '',
  addressLine1: '',
  subdistrict: '',
  district: '',
  province: '',
  postalCode: '',
  label: '',
  phone: '',
  addressLine2: '',
  country: 'TH',
  isDefault: false,
}

function apiToForm(a: ShippingAddressApi): ShippingAddressCreateBody {
  return {
    recipientName: a.recipientName,
    addressLine1: a.addressLine1,
    addressLine2: a.addressLine2 ?? '',
    subdistrict: a.subdistrict,
    district: a.district,
    province: a.province,
    postalCode: a.postalCode,
    label: a.label ?? '',
    phone: a.phone ?? '',
    country: a.country ?? 'TH',
    isDefault: a.isDefault,
  }
}

export default function AddressFormModal({
  open,
  onClose,
  mode,
  editAddress,
  onSaved,
}: {
  open: boolean
  onClose: () => void
  mode: 'create' | 'edit'
  editAddress: ShippingAddressApi | null
  onSaved: () => void
}) {
  const [form, setForm] = useState<ShippingAddressCreateBody>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    setError(null)
    if (mode === 'edit' && editAddress) {
      setForm(apiToForm(editAddress))
    } else {
      setForm({ ...emptyForm })
    }
  }, [open, mode, editAddress])

  const update = (patch: Partial<ShippingAddressCreateBody>) => {
    setForm((f) => ({ ...f, ...patch }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSaving(true)
    try {
      const body: Record<string, unknown> = {
        recipientName: form.recipientName.trim(),
        addressLine1: form.addressLine1.trim(),
        subdistrict: form.subdistrict.trim(),
        district: form.district.trim(),
        province: form.province.trim(),
        postalCode: form.postalCode.trim(),
        isDefault: form.isDefault,
      }
      if (form.label?.trim()) body.label = form.label.trim()
      if (form.phone?.trim()) body.phone = form.phone.trim()
      if (form.addressLine2?.trim()) body.addressLine2 = form.addressLine2.trim()
      if (form.country?.trim()) body.country = form.country.trim()

      if (mode === 'create') {
        const res = await fetch(`${API_ENDUSER_PREFIX}/shipping-addresses`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
        const json = await res.json()
        if (!res.ok) {
          const msg = json.error?.message ?? json.message ?? 'ไม่สามารถบันทึกที่อยู่ได้'
          setError(typeof msg === 'string' ? msg : 'ไม่สามารถบันทึกที่อยู่ได้')
          return
        }
      } else if (editAddress) {
        const id = String(editAddress.id)
        const res = await fetch(`${API_ENDUSER_PREFIX}/shipping-addresses/${encodeURIComponent(id)}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
        const json = await res.json()
        if (!res.ok) {
          const msg = json.error?.message ?? json.message ?? 'ไม่สามารถแก้ไขที่อยู่ได้'
          setError(typeof msg === 'string' ? msg : 'ไม่สามารถแก้ไขที่อยู่ได้')
          return
        }
      }
      onSaved()
      onClose()
    } catch {
      setError('เชื่อมต่อไม่สำเร็จ กรุณาลองใหม่')
    } finally {
      setSaving(false)
    }
  }

  if (!open) return null

  const inputClass =
    'w-full px-4 py-2 border border-sakura-300 rounded-lg focus:ring-2 focus:ring-sakura-500 focus:border-transparent outline-none transition-all text-sm'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 my-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-sakura-900">
            {mode === 'create' ? 'เพิ่มที่อยู่จัดส่ง' : 'แก้ไขที่อยู่จัดส่ง'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-sakura-100 text-muted-dark"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">ชื่อผู้รับ *</label>
            <input
              className={inputClass}
              value={form.recipientName}
              onChange={(e) => update({ recipientName: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">ที่อยู่บรรทัด 1 *</label>
            <input
              className={inputClass}
              value={form.addressLine1}
              onChange={(e) => update({ addressLine1: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">ที่อยู่บรรทัด 2</label>
            <input
              className={inputClass}
              value={form.addressLine2 ?? ''}
              onChange={(e) => update({ addressLine2: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">แขวง/ตำบล *</label>
              <input
                className={inputClass}
                value={form.subdistrict}
                onChange={(e) => update({ subdistrict: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">เขต/อำเภอ *</label>
              <input
                className={inputClass}
                value={form.district}
                onChange={(e) => update({ district: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">จังหวัด *</label>
              <input
                className={inputClass}
                value={form.province}
                onChange={(e) => update({ province: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">รหัสไปรษณีย์ *</label>
              <input
                className={inputClass}
                value={form.postalCode}
                onChange={(e) => update({ postalCode: e.target.value })}
                required
                inputMode="numeric"
                maxLength={10}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">ป้ายชื่อ (เช่น บ้าน, ออฟฟิศ)</label>
              <input
                className={inputClass}
                value={form.label ?? ''}
                onChange={(e) => update({ label: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">โทรศัพท์</label>
              <input
                className={inputClass}
                type="tel"
                value={form.phone ?? ''}
                onChange={(e) => update({ phone: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">ประเทศ (ค่าเริ่มต้น TH)</label>
            <input
              className={inputClass}
              value={form.country ?? 'TH'}
              onChange={(e) => update({ country: e.target.value })}
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-sakura-900 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isDefault ?? false}
              onChange={(e) => update({ isDefault: e.target.checked })}
              className="rounded border-sakura-300 text-sakura-600 focus:ring-sakura-500"
            />
            ตั้งเป็นที่อยู่เริ่มต้น
          </label>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-sakura-200 text-sakura-800 font-medium hover:bg-sakura-50">
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 btn-gradient flex items-center justify-center gap-2 py-2.5"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {saving ? 'กำลังบันทึก...' : 'บันทึก'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
