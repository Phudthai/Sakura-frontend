'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { Product } from '@/types/product'
import { formatPrice } from '@/lib/utils'
import { EMOJI_FALLBACKS } from '@/lib/constants'
import { Clock } from 'lucide-react'

interface ProductCardProps {
  product: Product
  index?: number
}

function getEmojiForId(id: string): string {
  const charCode = id.charCodeAt(id.length - 1) || 0
  return EMOJI_FALLBACKS[charCode % EMOJI_FALLBACKS.length] ?? '📦'
}

/**
 * Compact remaining time string for listing cards, e.g. "2d 5h", "3h 20m", "15m"
 */
function useRemainingTime(endTimeISO?: string): string | null {
  const [label, setLabel] = useState<string | null>(() => {
    if (!endTimeISO) return null
    return calcLabel(endTimeISO)
  })

  useEffect(() => {
    if (!endTimeISO) return
    const timer = setInterval(() => {
      setLabel(calcLabel(endTimeISO))
    }, 60_000) // update once per minute on cards
    return () => clearInterval(timer)
  }, [endTimeISO])

  return label
}

function calcLabel(endTimeISO: string): string | null {
  const diff = new Date(endTimeISO).getTime() - Date.now()
  if (diff <= 0) return 'Ended'
  const days = Math.floor(diff / 86_400_000)
  const hours = Math.floor((diff / 3_600_000) % 24)
  const mins = Math.floor((diff / 60_000) % 60)
  if (days > 0) return `${days}d ${hours}h`
  if (hours > 0) return `${hours}h ${mins}m`
  return `${mins}m`
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const [imgError, setImgError] = useState(false)
  const emoji = getEmojiForId(product.id)
  const remaining = useRemainingTime(
    product.isAuction ? product.endTimeISO : undefined
  )

  return (
    <Link
      href={`/product/${product.id}`}
      className="group block bg-white rounded-2xl overflow-hidden border border-card-border
                 shadow-card cursor-pointer transition-all duration-150 no-underline
                 text-inherit animate-fade-slide-in
                 hover:-translate-y-[3px] hover:shadow-card-hover"
      style={{ animationDelay: `${index * 30}ms` }}
    >
      {/* Image */}
      <div className="relative w-full aspect-square bg-sakura-100 overflow-hidden">
        {product.imageUrl && !imgError ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            loading="lazy"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover block transition-transform
                       duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-placeholder flex items-center
                          justify-center text-4xl">
            {emoji}
          </div>
        )}

        {/* Price overlay on image */}
        <div
          className="absolute bottom-2 left-2 bg-black/60 text-white
                     px-2.5 py-1 rounded-lg text-sm font-bold backdrop-blur-sm"
        >
          <span className="text-xs font-normal mr-0.5">¥</span>
          {formatPrice(product.price)}
        </div>

        {/* Auction badge */}
        {product.isAuction && (
          <span
            className="absolute top-2 left-2 bg-price/90 text-white
                       text-[10px] font-semibold px-2 py-0.5 rounded-full"
          >
            Auction {product.bidCount != null && product.bidCount > 0 && `· ${product.bidCount} bids`}
          </span>
        )}

        {/* Remaining time (bottom-right) */}
        {product.isAuction && remaining && (
          <span
            className={`absolute bottom-2 right-2 flex items-center gap-1
                        text-[10px] font-medium px-2 py-0.5 rounded-full backdrop-blur-sm
                        ${remaining === 'Ended'
                          ? 'bg-red-500/80 text-white'
                          : 'bg-white/80 text-sakura-900'
                        }`}
          >
            <Clock className="w-3 h-3" />
            {remaining}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="px-3 py-2.5">
        <p
          className="text-[13px] leading-[1.4] text-sakura-900
                     line-clamp-2 mb-1"
        >
          {product.name}
        </p>
        {product.condition && (
          <p className="text-[11px] text-muted">
            {product.condition}
          </p>
        )}
      </div>
    </Link>
  )
}
