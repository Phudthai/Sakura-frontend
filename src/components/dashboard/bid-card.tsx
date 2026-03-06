'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { formatPrice } from '@/lib/utils'
import type { UserBid, BidStatus } from '@/types/dashboard'

const STATUS_CONFIG: Record<BidStatus, { label: string; color: string }> = {
  winning: { label: 'Winning', color: 'bg-green-100 text-green-700 border-green-200' },
  outbid: { label: 'Outbid', color: 'bg-orange-100 text-orange-700 border-orange-200' },
  won: { label: 'Won', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  lost: { label: 'Lost', color: 'bg-gray-100 text-gray-500 border-gray-200' },
}

function useCountdown(endTimeISO: string, ended: boolean) {
  const [remaining, setRemaining] = useState('')

  useEffect(() => {
    if (ended) {
      setRemaining('Ended')
      return
    }

    function tick() {
      const diff = new Date(endTimeISO).getTime() - Date.now()
      if (diff <= 0) {
        setRemaining('Ended')
        return
      }
      const d = Math.floor(diff / 86_400_000)
      const h = Math.floor((diff % 86_400_000) / 3_600_000)
      const m = Math.floor((diff % 3_600_000) / 60_000)
      const s = Math.floor((diff % 60_000) / 1_000)
      if (d > 0) setRemaining(`${d}d ${h}h ${m}m`)
      else if (h > 0) setRemaining(`${h}h ${m}m ${s}s`)
      else setRemaining(`${m}m ${s}s`)
    }

    tick()
    const timer = setInterval(tick, 1_000)
    return () => clearInterval(timer)
  }, [endTimeISO, ended])

  return remaining
}

export default function BidCard({ bid }: { bid: UserBid }) {
  const countdown = useCountdown(bid.endTimeISO, bid.auctionEnded)
  const cfg = STATUS_CONFIG[bid.status]
  const isActive = bid.status === 'winning' || bid.status === 'outbid'

  return (
    <Link
      href={`/product/${bid.productId}`}
      className={cn(
        'block bg-white rounded-2xl border border-card-border shadow-card overflow-hidden',
        'hover:shadow-card-hover transition-shadow'
      )}
    >
      {/* Image */}
      <div className="relative aspect-square bg-sakura-50">
        <Image
          src={bid.imageUrl}
          alt={bid.productName}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        {/* Status badge */}
        <span
          className={cn(
            'absolute top-2 left-2 px-2.5 py-0.5 text-xs font-bold rounded-full border',
            cfg.color
          )}
        >
          {cfg.label}
        </span>
        {/* Countdown badge */}
        {isActive && (
          <span className="absolute top-2 right-2 px-2 py-0.5 text-[10px] font-bold rounded-full bg-black/60 text-white">
            {countdown}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-3 space-y-2">
        <h3 className="text-sm font-medium text-sakura-900 line-clamp-2 leading-snug">
          {bid.productName}
        </h3>

        <div className="flex items-end justify-between gap-2">
          <div>
            <p className="text-[10px] text-muted uppercase tracking-wider">Your bid</p>
            <p className="text-sm font-bold text-sakura-700">{formatPrice(bid.myBid)}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-muted uppercase tracking-wider">Current</p>
            <p
              className={cn(
                'text-sm font-bold',
                bid.myBid >= bid.currentBid ? 'text-green-600' : 'text-red-500'
              )}
            >
              {formatPrice(bid.currentBid)}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] text-muted">
          <span>{bid.bidCount} bids</span>
          <span>{bid.auctionEnded ? 'Ended' : countdown}</span>
        </div>
      </div>
    </Link>
  )
}

