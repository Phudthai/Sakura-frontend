// ---------------------------------------------------------------------------
// Dashboard Types
// ---------------------------------------------------------------------------

/** Bid status from the current user's perspective */
export type BidStatus = 'winning' | 'outbid' | 'won' | 'lost'

/** A product the user is actively bidding on */
export interface UserBid {
  id: string
  productId: string
  productName: string
  imageUrl: string
  /** The user's highest bid */
  myBid: number
  /** Current highest bid overall */
  currentBid: number
  /** Total number of bids on this item */
  bidCount: number
  /** Auction end time ISO */
  endTimeISO: string
  /** Whether the auction has ended */
  auctionEnded: boolean
  /** User's bid status */
  status: BidStatus
}

// ---------------------------------------------------------------------------
// Orders
// ---------------------------------------------------------------------------

export interface OrderItem {
  id: string
  productName: string
  productUrl: string
  imageUrl?: string
  priceJPY: number
  quantity: number
  variant?: string
}

export type OrderStatus =
  | 'DRAFT'
  | 'PENDING_PAYMENT'
  | 'PAID'
  | 'PROCESSING'
  | 'PURCHASED'
  | 'SHIPPED_TO_TH'
  | 'ARRIVED_TH'
  | 'READY_TO_SHIP'
  | 'SHIPPED_TO_CUSTOMER'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'REFUNDED'

export type TrackingStatus =
  | 'ORDER_PLACED'
  | 'PROCESSING'
  | 'PURCHASED'
  | 'PACKED'
  | 'SHIPPED_FROM_JP'
  | 'IN_TRANSIT'
  | 'CUSTOMS_CLEARANCE'
  | 'ARRIVED_WAREHOUSE'
  | 'READY_FOR_DELIVERY'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'FAILED_DELIVERY'

export interface TrackingEvent {
  id: string
  status: TrackingStatus
  description: string
  location?: string
  eventAt: string
}

export interface OrderTracking {
  id: string
  status: TrackingStatus
  trackingNumber?: string
  carrier?: string
  estimatedDelivery?: string
  deliveredAt?: string
  events: TrackingEvent[]
}

export interface UserOrder {
  id: string
  orderNumber: string
  status: OrderStatus
  totalJPY: number
  totalTHB: number
  exchangeRate: number
  serviceFee: number
  shippingCost: number
  discount: number
  discountCode?: string
  items: OrderItem[]
  tracking?: OrderTracking
  paidAt?: string
  completedAt?: string
  cancelledAt?: string
  createdAt: string
}

// ---------------------------------------------------------------------------
// Addresses
// ---------------------------------------------------------------------------

/** Shape from GET/POST/PATCH `/api/enduser/shipping-addresses` */
export interface ShippingAddressApi {
  id: number | string
  recipientName: string
  addressLine1: string
  addressLine2?: string | null
  subdistrict: string
  district: string
  province: string
  postalCode: string
  label?: string | null
  phone?: string | null
  country?: string | null
  isDefault: boolean
}

export interface ShippingAddressCreateBody {
  recipientName: string
  addressLine1: string
  subdistrict: string
  district: string
  province: string
  postalCode: string
  label?: string
  phone?: string
  addressLine2?: string
  country?: string
  isDefault?: boolean
}

export type ShippingAddressPatchBody = Partial<ShippingAddressCreateBody>

export interface UserAddress {
  id: string
  label?: string
  /** ชื่อผู้รับ — จาก API */
  recipientName?: string
  fullAddress: string
  province: string
  district: string
  postalCode: string
  phone: string
  isDefault: boolean
}

export function shippingAddressToUserAddress(a: ShippingAddressApi): UserAddress {
  const line1 = [a.addressLine1, a.addressLine2].filter(Boolean).join(', ')
  const districtLine = a.subdistrict ? `${a.subdistrict}, ${a.district}` : a.district
  return {
    id: String(a.id),
    label: a.label ?? undefined,
    recipientName: a.recipientName,
    fullAddress: line1,
    province: a.province,
    district: districtLine,
    postalCode: a.postalCode,
    phone: a.phone ?? '',
    isDefault: Boolean(a.isDefault),
  }
}

/** เรียง default ก่อน แล้วตาม id */
export function sortAddressesForDisplay<T extends { isDefault?: boolean; id: string }>(
  list: T[]
): T[] {
  return [...list].sort((x, y) => {
    if (x.isDefault && !y.isDefault) return -1
    if (!x.isDefault && y.isDefault) return 1
    return x.id.localeCompare(y.id, undefined, { numeric: true })
  })
}

// ---------------------------------------------------------------------------
// Notifications
// ---------------------------------------------------------------------------

export type NotificationType =
  | 'ORDER_UPDATE'
  | 'PAYMENT_UPDATE'
  | 'TRACKING_UPDATE'
  | 'SYSTEM'
  | 'PROMOTION'

export interface UserNotification {
  id: string
  type: NotificationType
  title: string
  message: string
  resourceId?: string
  isRead: boolean
  readAt?: string
  createdAt: string
}

// ---------------------------------------------------------------------------
// Wallet
// ---------------------------------------------------------------------------

export type WalletTransactionType =
  | 'DEPOSIT'
  | 'WITHDRAWAL'
  | 'PAYMENT'
  | 'REFUND'
  | 'OVERPAYMENT_CREDIT'
  | 'TOPUP'
  | 'PAYMENT_DEBIT'

export interface WalletTransaction {
  id: number
  walletId: number
  amount: number
  balanceAfter: number
  type: WalletTransactionType
  referenceType?: string
  referenceId?: number
  idempotencyKey?: string
  createdAt: string
}

export interface WalletData {
  balance: number
  currency: string
  transactions: WalletTransaction[]
}

