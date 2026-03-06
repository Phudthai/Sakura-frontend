'use client'

import { useState } from 'react'
import { ChevronDown, Trophy } from 'lucide-react'
import type { BidEntry } from '@/types/product'
import { formatPrice, cn } from '@/lib/utils'

interface BidHistoryProps {
  bids: BidEntry[]
}

export default function BidHistory({ bids }: BidHistoryProps) {
  const [isOpen, setIsOpen] = useState(false)

  if (bids.length === 0) {
    return (
      <div className="text-sm text-muted text-center py-3">
        No bids yet. Be the first to bid!
      </div>
    )
  }

  return (
    <div className="border border-card-border rounded-xl overflow-hidden">
      {/* Header toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-4 py-3
                   text-sm font-medium text-sakura-900 bg-sakura-100/40
                   hover:bg-sakura-100/70 transition-colors"
      >
        <span>
          Bid history{' '}
          <span className="text-muted-dark font-normal">
            ({bids.length} bid{bids.length !== 1 ? 's' : ''})
          </span>
        </span>
        <ChevronDown
          className={cn(
            'w-4 h-4 text-muted transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {/* Bid list */}
      {isOpen && (
        <div className="divide-y divide-card-border animate-fade-slide-in">
          {bids.map((bid) => (
            <div
              key={bid.id}
              className={cn(
                'flex items-center gap-3 px-4 py-2.5 text-sm',
                bid.isWinning && 'bg-sakura-100/30'
              )}
            >
              {/* Winning icon */}
              <div className="w-5 flex justify-center">
                {bid.isWinning && (
                  <Trophy className="w-4 h-4 text-price" />
                )}
              </div>

              {/* Bidder name */}
              <span
                className={cn(
                  'font-medium min-w-[50px]',
                  bid.isWinning ? 'text-price' : 'text-sakura-900'
                )}
              >
                {bid.bidderName}
              </span>

              {/* Amount */}
              <span
                className={cn(
                  'font-semibold tabular-nums',
                  bid.isWinning ? 'text-price' : 'text-sakura-900'
                )}
              >
                ¥{formatPrice(bid.amount)}
              </span>

              {/* Time */}
              <span className="text-xs text-muted ml-auto">
                {bid.timestamp}
              </span>

              {/* Winning label */}
              {bid.isWinning && (
                <span className="text-[10px] font-semibold text-price bg-pink-soft
                                 px-2 py-0.5 rounded-full">
                  Highest
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

