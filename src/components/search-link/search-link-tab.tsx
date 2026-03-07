'use client'

import { useState, useEffect, useRef, type FormEvent } from 'react'
import Image from 'next/image'
import {
  Link2, Send, CheckCircle2, ExternalLink,
  Timer, AlertCircle, Loader2, RefreshCw, TrendingUp,
} from 'lucide-react'
import AuctionDetailModal from './auction-detail-modal'

// ─── Types ───────────────────────────────────────────────────────────────────

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

export interface LastBid {
  price: number
  status: string
  statusLabel?: string
  statusColor?: string
  recordedAt: string
}

export interface TrackedAuction {
  id: number
  url: string
  contactName: string
  firstBidPrice: number | null
  lastBid: LastBid | null
  submittedAt: Date
  data: AuctionData | null
  priceHistory: PriceRecord[]
  error: string | null
  loading: boolean
  lastPolledAt: Date | null
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function loadPendingAuctions(): Promise<TrackedAuction[]> {
  const res = await fetch('/api/auction-requests?status=pending&limit=50')
  const json = await res.json()
  if (!res.ok || !json.success) throw new Error(json.error?.message ?? 'โหลดข้อมูลไม่สำเร็จ')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (json.data as any[]).map((d) => ({
    id: d.id,
    url: d.url,
    contactName: d.contactName ?? 'ไม่ระบุ',
    firstBidPrice: d.firstBidPrice ?? null,
    lastBid: d.lastBid ?? null,
    submittedAt: new Date(d.createdAt),
    data: {
      itemId: d.yahooItemId ?? '',
      url: d.url,
      title: d.title ?? 'ไม่ทราบชื่อสินค้า',
      currentPrice: d.currentPrice ?? 0,
      endTime: d.endTime ?? null,
      imageUrl: d.imageUrl ?? null,
      bidCount: d.bidCount ?? 0,
    },
    priceHistory: d.currentPrice
      ? [{ price: d.currentPrice, recordedAt: new Date(d.updatedAt ?? d.createdAt) }]
      : [],
    error: null,
    loading: false,
    lastPolledAt: new Date(d.updatedAt ?? d.createdAt),
  }))
}

async function submitToBackend(url: string, firstBidPrice?: number): Promise<{ id: number; data: AuctionData; lastBid?: LastBid }> {
  const res = await fetch(`/api/auction-requests`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url, firstBidPrice }),
  })
  const json = await res.json()
  if (!res.ok || !json.success) throw new Error(json.error?.message ?? 'บันทึกไม่สำเร็จ')
  const d = json.data
  return {
    id: d.id,
    data: {
      itemId: d.yahooItemId ?? '',
      url,
      title: d.title,
      currentPrice: d.currentPrice,
      endTime: d.endTime,
      imageUrl: d.imageUrl,
      bidCount: d.bidCount,
      partial: d.partial,
    },
    lastBid: d.lastBid ?? (firstBidPrice ? { price: firstBidPrice, status: 'pending', recordedAt: new Date().toISOString() } : undefined),
  }
}

async function fetchAuctionData(url: string): Promise<AuctionData> {
  const res = await fetch('/api/auction/fetch', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.error ?? 'ดึงข้อมูลไม่ได้')
  return json
}

export function formatJPY(price: number) {
  return price > 0 ? `¥${price.toLocaleString('ja-JP')}` : '—'
}

export function formatTime(date: Date) {
  return date.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
}

// ─── Countdown ───────────────────────────────────────────────────────────────

export function Countdown({ endTime }: { endTime: string }) {
  const endsAt = new Date(endTime)
  const calc = () => Math.max(0, Math.floor((endsAt.getTime() - Date.now()) / 1000))
  const [secs, setSecs] = useState(calc)

  useEffect(() => {
    const id = setInterval(() => setSecs(calc()), 1000)
    return () => clearInterval(id)
  }, [endTime]) // eslint-disable-line react-hooks/exhaustive-deps

  if (secs === 0) return <span className="text-xs text-red-500 font-medium">หมดเวลา</span>

  const h = Math.floor(secs / 3600)
  const m = Math.floor((secs % 3600) / 60)
  const s = secs % 60
  const display = h > 0
    ? `${h}ช ${String(m).padStart(2, '0')}น ${String(s).padStart(2, '0')}ว`
    : `${String(m).padStart(2, '0')}น ${String(s).padStart(2, '0')}ว`

  return (
    <div className="flex items-center gap-1 text-xs font-mono font-semibold text-sakura-800 whitespace-nowrap">
      <Timer className="w-3 h-3 shrink-0" />
      {display}
    </div>
  )
}

// ─── Auction Card ─────────────────────────────────────────────────────────────

function AuctionCard({
  auction,
  onClick,
  onBidSubmit,
}: { auction: TrackedAuction; onClick?: () => void; onBidSubmit?: (auctionId: number, amount: number) => void }) {
  const { data, loading, error, url, priceHistory, lastPolledAt, lastBid } = auction
  const currentPrice = data?.currentPrice ?? 0
  const showBidButton = !loading && currentPrice > 0 && (lastBid?.price ?? 0) < currentPrice

  const [isBidding, setIsBidding] = useState(false)
  const [bidInput, setBidInput] = useState('')
  const [bidError, setBidError] = useState('')

  const handleBidClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsBidding(true)
    setBidInput('')
    setBidError('')
  }

  const handleBidSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const num = Number(bidInput.replace(/,/g, ''))
    if (!Number.isFinite(num) || num <= 0) {
      setBidError('กรุณาใส่ตัวเลขเท่านั้น')
      return
    }
    if (num <= currentPrice) {
      setBidError(`ต้องมากกว่าราคาปัจจุบัน (${formatJPY(currentPrice)})`)
      return
    }
    setBidError('')
    onBidSubmit?.(auction.id, num)
    setIsBidding(false)
    setBidInput('')
  }

  const handleBidInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value.replace(/[^0-9]/g, '')
    setBidInput(v)
    setBidError('')
  }

  return (
    <div
      className="px-5 py-6 flex items-start gap-4 hover:bg-sakura-50/50 transition-colors cursor-pointer"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick?.() }}
    >
      {/* Image */}
      <div className="w-24 h-24 rounded-xl overflow-hidden border border-card-border shrink-0 bg-sakura-100 flex items-center justify-center">
        {loading ? (
          <Loader2 className="w-6 h-6 text-muted animate-spin" />
        ) : data?.imageUrl ? (
          <Image
            src={data.imageUrl}
            alt={data.title}
            width={96}
            height={96}
            className="w-full h-full object-cover"
            unoptimized
          />
        ) : (
          <span className="text-2xl">🛍️</span>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 space-y-1.5">
        {loading ? (
          <div className="space-y-2">
            <div className="h-4 bg-sakura-100 rounded animate-pulse w-3/4" />
            <div className="h-3 bg-sakura-100 rounded animate-pulse w-1/2" />
          </div>
        ) : error ? (
          <div className="flex items-start gap-1.5 text-sm text-red-500">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        ) : data ? (
          <>
            <p className="text-base font-semibold text-sakura-900 line-clamp-2 leading-snug">
              {data.title}
            </p>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-lg font-bold text-sakura-900">{formatJPY(data.currentPrice)}</span>
              {lastBid != null && lastBid.price > 0 && (
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-semibold ${
                    ['reject', 'rejected'].includes((lastBid.status ?? '').toLowerCase())
                      ? 'bg-red-100 text-red-700'
                      : (lastBid.status ?? '').toLowerCase() === 'pending'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-emerald-100 text-emerald-700'
                  }`}
                >
                  Your Bid {formatJPY(lastBid.price)}
                </span>
              )}
              {data.partial && (
                <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                  ข้อมูลราคาไม่ครบ
                </span>
              )}
            </div>
            {priceHistory.length > 1 && (
              <div className="text-xs text-muted-dark space-y-0.5">
                {priceHistory.slice(-3).reverse().map((r, i) => (
                  <div key={i} className="flex items-center gap-1">
                    <span className="text-muted">{formatTime(r.recordedAt)}</span>
                    <span>{formatJPY(r.price)}</span>
                    {i === 0 && <span className="text-green-600 font-medium">← ล่าสุด</span>}
                  </div>
                ))}
              </div>
            )}
          </>
        ) : null}

        <div className="flex items-center gap-3 pt-0.5 flex-wrap">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1 text-xs text-muted hover:text-sakura-700 hover:underline transition-colors"
          >
            <ExternalLink className="w-3 h-3" />
            {(() => { try { return new URL(url).hostname.replace('www.', '') } catch { return url } })()}
          </a>
        </div>

        {lastPolledAt && (
          <div className="flex items-center gap-1 text-xs text-muted">
            <RefreshCw className="w-3 h-3" />
            อัปเดตล่าสุด {formatTime(lastPolledAt)}
          </div>
        )}
      </div>

      {/* Right: countdown + Bid (ขวาบน แถวเดียวกัน) */}
      <div className="flex flex-row items-center gap-2 shrink-0 pt-1">
        {!loading && data?.endTime ? (
          <Countdown endTime={data.endTime} />
        ) : (
          <span className="text-xs text-muted">
            {new Date(auction.submittedAt).toLocaleDateString('th-TH', {
              day: '2-digit', month: '2-digit', year: 'numeric',
            })}
          </span>
        )}
        {showBidButton && !isBidding && (
          <button
            type="button"
            onClick={handleBidClick}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sakura-700 text-white text-sm font-semibold hover:bg-sakura-800 transition-colors"
          >
            <TrendingUp className="w-4 h-4" />
            Bid
          </button>
        )}
        {showBidButton && isBidding && (
          <form onSubmit={handleBidSubmit} className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-1.5">
                <span className="text-sm text-muted">¥</span>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={bidInput}
                  onChange={handleBidInputChange}
                  placeholder={`มากกว่า ${formatJPY(currentPrice)}`}
                  className="w-28 px-2.5 py-2 rounded-lg border border-card-border bg-white text-sm font-medium text-sakura-900 focus:outline-none focus:ring-2 focus:ring-sakura-400"
                  autoFocus
                />
              </div>
              {bidError && <p className="text-xs text-red-500">{bidError}</p>}
            </div>
            <button
              type="submit"
              className="px-3 py-2 rounded-lg bg-sakura-700 text-white text-sm font-semibold hover:bg-sakura-800"
            >
              ส่ง
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setIsBidding(false); setBidInput(''); setBidError('') }}
              className="px-3 py-2 rounded-lg border border-card-border text-sm text-muted hover:bg-sakura-50"
            >
              ยกเลิก
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

const POLL_INTERVAL_MS = 3 * 60 * 1000 // 3 minutes

export default function SearchLinkTab() {
  const [url, setUrl] = useState('')
  const [contactName, setContactName] = useState('')
  const [firstBidPrice, setFirstBidPrice] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMsg, setSuccessMsg] = useState(false)
  const [auctions, setAuctions] = useState<TrackedAuction[]>([])
  const [initialLoading, setInitialLoading] = useState(true)
  const [selectedAuction, setSelectedAuction] = useState<TrackedAuction | null>(null)
  const auctionsRef = useRef(auctions)
  auctionsRef.current = auctions

  // Load pending auctions from DB on mount
  useEffect(() => {
    loadPendingAuctions()
      .then(setAuctions)
      .catch(console.error)
      .finally(() => setInitialLoading(false))
  }, [])

  // Poll all tracked auctions on interval
  useEffect(() => {
    if (auctions.length === 0) return

    const poll = async () => {
      const current = auctionsRef.current
      for (const auction of current) {
        if (auction.loading) continue
        try {
          const data = await fetchAuctionData(auction.url)
          const now = new Date()
          setAuctions(prev =>
            prev.map(a => {
              if (a.id !== auction.id) return a
              const priceChanged = a.data !== null && data.currentPrice !== a.data.currentPrice
              return {
                ...a,
                data,
                error: null,
                lastPolledAt: now,
                priceHistory: priceChanged
                  ? [...a.priceHistory, { price: data.currentPrice, recordedAt: now }]
                  : a.priceHistory,
              }
            })
          )
        } catch {
          // fail silently on background poll
        }
      }
    }

    const id = setInterval(poll, POLL_INTERVAL_MS)
    return () => clearInterval(id)
  }, [auctions.length])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const newId = Date.now()
    const bidPrice = firstBidPrice ? Number(firstBidPrice) : null
    const newAuction: TrackedAuction = {
      id: newId,
      url,
      contactName: contactName || 'ไม่ระบุ',
      firstBidPrice: bidPrice,
      lastBid: bidPrice ? { price: bidPrice, status: 'pending', recordedAt: new Date().toISOString() } : null,
      submittedAt: new Date(),
      data: null,
      priceHistory: [],
      error: null,
      loading: true,
      lastPolledAt: null,
    }

    setAuctions(prev => [newAuction, ...prev])
    setUrl('')
    setContactName('')
    setFirstBidPrice('')
    setIsSubmitting(false)
    setSuccessMsg(true)
    setTimeout(() => setSuccessMsg(false), 3000)

    // Submit to backend — saves to DB and scrapes Yahoo
    try {
      const result = await submitToBackend(newAuction.url, bidPrice ?? undefined)
      const now = new Date()
      setAuctions(prev =>
        prev.map(a =>
          a.id === newId
            ? {
                ...a,
                id: result.id,
                data: result.data,
                lastBid: result.lastBid ?? a.lastBid,
                loading: false,
                lastPolledAt: now,
                priceHistory: [{ price: result.data.currentPrice, recordedAt: now }],
              }
            : a
        )
      )
    } catch (err) {
      setAuctions(prev =>
        prev.map(a =>
          a.id === newId
            ? {
                ...a,
                loading: false,
                error: err instanceof Error ? err.message : 'เกิดข้อผิดพลาด',
              }
            : a
        )
      )
    }
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-8 items-start">

        {/* ── Left: Form ── */}
        <div className="space-y-4 lg:sticky lg:top-24">
          <div>
            <h2 className="text-xl font-bold text-sakura-900">ประมูลด้วยตนเอง</h2>
            <p className="text-sm text-muted-dark mt-1">
              วางลิงค์สินค้าจาก Yahoo Auctions Japan เราจะดึงข้อมูลและติดตามราคาให้อัตโนมัติ
            </p>
          </div>

          {successMsg && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-sakura-900 text-white text-sm">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              กำลังดึงข้อมูลสินค้า...
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-white rounded-2xl border border-card-border shadow-card p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-sakura-900 mb-1.5">
                  ลิงค์สินค้า <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                  <input
                    type="url"
                    required
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://auctions.yahoo.co.jp/jp/auction/..."
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-card-border
                               bg-sakura-50/50 text-sakura-900 text-sm placeholder:text-muted
                               focus:outline-none focus:ring-2 focus:ring-sakura-400 focus:border-transparent
                               transition-all"
                  />
                </div>
                <p className="mt-1.5 text-xs text-muted">รองรับ Yahoo Auctions Japan</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-sakura-900 mb-1.5">
                  ราคา Bid ครั้งแรก
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted font-medium">¥</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={firstBidPrice}
                    onChange={(e) => setFirstBidPrice(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="เช่น 50000"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-card-border
                               bg-sakura-50/50 text-sakura-900 text-sm placeholder:text-muted
                               focus:outline-none focus:ring-2 focus:ring-sakura-400 focus:border-transparent
                               transition-all"
                  />
                </div>
                <p className="mt-1.5 text-xs text-red-500">* กรุณาใส่ราคา Bid ขั้นต่ำมากกว่า 100 ¥ ของราคาสินค้าปัจจุบัน</p>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-gradient w-full flex items-center justify-center gap-2 py-3 text-base"
            >
              {isSubmitting ? (
                <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  ส่งลิงค์สินค้า
                </>
              )}
            </button>
          </form>

          {auctions.length > 0 && (
            <p className="text-xs text-muted text-center">
              ราคาจะอัปเดตอัตโนมัติทุก 3 นาที
            </p>
          )}
        </div>

        {/* ── Right: Tracked Auctions ── */}
        <div className="bg-white rounded-2xl border border-card-border shadow-card overflow-hidden">
          <div className="px-5 py-4 border-b border-card-border flex items-center justify-between">
            <h3 className="font-semibold text-sakura-900">ประวัติการประมูลทั้งหมด</h3>
            <span className="text-xs text-muted-dark">{auctions.length} รายการ</span>
          </div>

          <div className="divide-y divide-card-border overflow-y-auto max-h-[600px]">
            {initialLoading ? (
              <div className="flex items-center justify-center py-16 gap-2 text-muted">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm">กำลังโหลดรายการ...</span>
              </div>
            ) : auctions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3 text-muted">
                <Link2 className="w-8 h-8 opacity-30" />
                <p className="text-sm">ยังไม่มีรายการ — วางลิงค์สินค้าเพื่อเริ่มติดตาม</p>
              </div>
            ) : (
              auctions.map((auction) => (
                <AuctionCard
                  key={auction.id}
                  auction={auction}
                  onClick={() => !auction.loading && setSelectedAuction(auction)}
                  onBidSubmit={async (id, amount) => {
                    try {
                      const res = await fetch(`/api/auction-requests/${id}`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ bidAmount: amount }),
                      })
                      const json = await res.json()
                      if (res.ok && json.success) {
                        loadPendingAuctions().then(setAuctions)
                      } else {
                        console.error(json.error?.message ?? 'ส่ง Bid ไม่สำเร็จ')
                      }
                    } catch (err) {
                      console.error(err)
                    }
                  }}
                />
              ))
            )}
          </div>
        </div>

      </div>

      {selectedAuction && (
        <AuctionDetailModal
          auction={selectedAuction}
          onClose={() => setSelectedAuction(null)}
        />
      )}
    </div>
  )
}
