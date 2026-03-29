'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Gavel, Loader2, ExternalLink, Timer } from 'lucide-react'
import { cn, formatJPY, formatTime, getHostname } from '@/lib/utils'
import { API_ENDUSER_PREFIX } from '@/lib/api-config'
import type { TrackedAuction } from '@/types/auction'
import { BID_STATUS } from '@/types/auction'

const TABS = [
  { value: 'pending' as const, label: 'กำลังประมูล' },
  { value: 'completed' as const, label: 'ประมูลสิ้นสุดแล้ว' },
]

async function loadAuctions(status: 'pending' | 'completed'): Promise<TrackedAuction[]> {
  const res = await fetch(
    `${API_ENDUSER_PREFIX}/auction-requests?status=${status}&limit=50&purchase_mode=AUCTION`,
  )
  const json = await res.json()
  if (!res.ok || !json.success) return []
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (json.data as any[]).map((d) => ({
    id: d.id,
    url: d.url,
    contactName: d.contactName ?? '',
    firstBidPrice: d.firstBidPrice ?? null,
    lastBid: d.lastBid ?? null,
    bidResult: d.bidResult ?? null,
    submittedAt: new Date(d.createdAt),
    data: d.currentPrice ? {
      itemId: d.yahooItemId ?? '',
      url: d.url,
      title: d.title ?? 'ไม่ทราบชื่อสินค้า',
      currentPrice: d.currentPrice ?? 0,
      endTime: d.endTime ?? null,
      imageUrl: d.imageUrl ?? null,
      bidCount: d.bidCount ?? 0,
    } : null,
    priceHistory: [],
    error: null,
    loading: false,
    lastPolledAt: new Date(d.updatedAt ?? d.createdAt),
  }))
}

function AuctionBidCard({ auction, tab }: { auction: TrackedAuction; tab: 'pending' | 'completed' }) {
  const { data, url, lastBid, bidResult } = auction
  const currentPrice = data?.currentPrice ?? 0
  const isOutbid = lastBid != null && lastBid.price > 0 && lastBid.price < currentPrice

  const showBidResultTag = tab === 'completed' && bidResult != null

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-white rounded-2xl border border-card-border shadow-card overflow-hidden hover:shadow-card-hover transition-shadow"
    >
      {/* Image */}
      <div className="relative aspect-square bg-sakura-50">
        {data?.imageUrl ? (
          <Image src={data.imageUrl} alt={data.title} fill className="object-cover" unoptimized />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">🛍️</div>
        )}
        {/* Bid result badge - แสดงเฉพาะ tab ประมูลสิ้นสุดแล้ว */}
        {showBidResultTag && (
          <span className={cn(
            'absolute top-2 left-2 px-2.5 py-0.5 text-xs font-bold rounded-full border',
            bidResult === 'won'
              ? 'bg-green-100 text-green-700 border-green-200'
              : 'bg-red-100 text-red-700 border-red-200'
          )}>
            {bidResult === 'won' ? 'Won' : 'Lost'}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-3 space-y-2">
        <h3 className="text-sm font-medium text-sakura-900 line-clamp-2 leading-snug">
          {data?.title ?? 'ไม่ทราบชื่อสินค้า'}
        </h3>

        <div className="flex items-end justify-between gap-2">
          {lastBid != null && lastBid.price > 0 && (
            <div>
              <p className="text-[10px] text-muted uppercase tracking-wider">Your bid</p>
              <p className="text-sm font-bold text-sakura-700">{formatJPY(lastBid.price)}</p>
            </div>
          )}
          <div className={lastBid == null || lastBid.price <= 0 ? '' : 'text-right'}>
            <p className="text-[10px] text-muted uppercase tracking-wider">Current</p>
            <p className={cn(
              'text-sm font-bold',
              isOutbid ? 'text-red-500' : 'text-green-600'
            )}>
              {formatJPY(currentPrice)}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] text-muted">
          <span className="inline-flex items-center gap-1">
            <ExternalLink className="w-3 h-3" />
            {getHostname(url)}
          </span>
          {data?.endTime && (
            <span className="inline-flex items-center gap-1">
              <Timer className="w-3 h-3" />
              {new Date(data.endTime) > new Date()
                ? `สิ้นสุด ${new Date(data.endTime).toLocaleDateString('th-TH', {
                day: '2-digit',
                month: '2-digit',
                timeZone: 'Asia/Bangkok',
              })}`
                : 'สิ้นสุดแล้ว'
              }
            </span>
          )}
        </div>

        {auction.lastPolledAt && (
          <p className="text-[10px] text-muted">อัปเดตล่าสุด {formatTime(auction.lastPolledAt)}</p>
        )}
      </div>
    </a>
  )
}

export default function MyBidsPage() {
  const [tab, setTab] = useState<'pending' | 'completed'>('pending')
  const [auctions, setAuctions] = useState<TrackedAuction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    loadAuctions(tab)
      .then(setAuctions)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [tab])

  return (
    <div className="space-y-5">
      {/* Title */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-header flex items-center justify-center shadow-button">
          <Gavel className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-sakura-900">My Bids</h1>
          <p className="text-sm text-muted">ติดตามการประมูลของคุณแบบ real-time</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-sakura-50 border border-card-border rounded-xl w-fit">
        {TABS.map((t) => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={cn(
              'px-5 py-2 rounded-lg text-sm font-medium transition-all',
              tab === t.value
                ? 'bg-gradient-header text-white shadow-button'
                : 'text-sakura-700 hover:bg-white hover:shadow-sm'
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-16 gap-2 text-muted">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm">กำลังโหลด...</span>
        </div>
      ) : auctions.length === 0 ? (
        <div className="text-center py-16 text-muted">
          <Gavel className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>{tab === 'pending' ? 'ยังไม่มีการประมูลที่กำลังดำเนินอยู่' : 'ยังไม่มีการประมูลที่สิ้นสุดแล้ว'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {auctions.map((auction) => (
            <AuctionBidCard key={auction.id} auction={auction} tab={tab} />
          ))}
        </div>
      )}
    </div>
  )
}
