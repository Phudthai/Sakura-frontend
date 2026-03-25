import type { ShippingAddressApi } from '@/types/dashboard'

/** Normalize list from GET `/api/enduser/shipping-addresses` */
export function parseShippingAddressList(json: unknown): ShippingAddressApi[] {
  if (Array.isArray(json)) return json as ShippingAddressApi[]
  if (json && typeof json === 'object' && 'data' in json) {
    const d = (json as { data: unknown }).data
    if (Array.isArray(d)) return d as ShippingAddressApi[]
  }
  return []
}
