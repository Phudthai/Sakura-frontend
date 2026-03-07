export interface AuctionData {
  itemId: string
  url: string
  title: string
  currentPrice: number
  endTime: string | null
  imageUrl: string | null
  bidCount: number
  partial?: boolean
}

export interface PriceRecord {
  price: number
  recordedAt: Date
}

export type BidStatus = 'pending' | 'rejected' | 'accepted'

export const BID_STATUS: Record<BidStatus, BidStatus> = {
  pending: 'pending',
  rejected: 'rejected',
  accepted: 'accepted',
}

export interface LastBid {
  price: number
  status: BidStatus | string
  statusLabel?: string
  statusColor?: string
  recordedAt: string
}

export type BidResult = 'lost' | 'won'

export interface TrackedAuction {
  id: number
  url: string
  contactName: string
  firstBidPrice: number | null
  lastBid: LastBid | null
  bidResult?: BidResult | null
  submittedAt: Date
  data: AuctionData | null
  priceHistory: PriceRecord[]
  error: string | null
  loading: boolean
  lastPolledAt: Date | null
}
