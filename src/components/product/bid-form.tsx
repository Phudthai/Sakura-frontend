'use client'

import { useState, useCallback } from 'react'
import { Gavel, Check, AlertCircle } from 'lucide-react'
import { formatPrice, cn } from '@/lib/utils'

interface BidFormProps {
  currentBid: number
  onPlaceBid: (amount: number) => void
  disabled?: boolean
}

const QUICK_INCREMENTS = [100, 500, 1000]

export default function BidForm({
  currentBid,
  onPlaceBid,
  disabled = false,
}: BidFormProps) {
  const minBid = currentBid + 100
  const [bidAmount, setBidAmount] = useState(minBid)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleQuickBid = useCallback(
    (increment: number) => {
      const newAmount = currentBid + increment
      setBidAmount(newAmount)
      setError(null)
    },
    [currentBid]
  )

  const handleSubmit = useCallback(() => {
    if (bidAmount <= currentBid) {
      setError(`Bid must be higher than ¥${formatPrice(currentBid)}`)
      return
    }
    setError(null)
    setSuccess(true)
    onPlaceBid(bidAmount)

    // Reset success message after 2 seconds
    setTimeout(() => setSuccess(false), 2000)
  }, [bidAmount, currentBid, onPlaceBid])

  return (
    <div className="space-y-3">
      {/* Current bid display */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-dark">Current bid</span>
        <span className="font-semibold text-sakura-900">
          ¥{formatPrice(currentBid)}
        </span>
      </div>

      {/* Bid input */}
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-dark text-sm font-medium">
          ¥
        </span>
        <input
          type="number"
          value={bidAmount}
          onChange={(e) => {
            setBidAmount(Number(e.target.value))
            setError(null)
          }}
          min={minBid}
          step={100}
          disabled={disabled}
          className={cn(
            'w-full py-3 pl-8 pr-4 rounded-xl border text-base font-semibold',
            'text-sakura-900 bg-white outline-none transition-colors',
            'focus:border-sakura-500 focus:ring-2 focus:ring-sakura-500/20',
            error
              ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20'
              : 'border-card-border',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        />
      </div>

      {/* Error message */}
      {error && (
        <div className="flex items-center gap-1.5 text-xs text-red-500">
          <AlertCircle className="w-3.5 h-3.5" />
          {error}
        </div>
      )}

      {/* Success toast */}
      {success && (
        <div className="flex items-center gap-1.5 text-xs text-green-600 bg-green-50
                        px-3 py-2 rounded-lg animate-fade-slide-in">
          <Check className="w-3.5 h-3.5" />
          Bid placed successfully!
        </div>
      )}

      {/* Quick bid buttons */}
      <div className="flex gap-2">
        {QUICK_INCREMENTS.map((inc) => (
          <button
            key={inc}
            onClick={() => handleQuickBid(inc)}
            disabled={disabled}
            className={cn(
              'flex-1 py-2 rounded-lg text-xs font-medium border transition-colors',
              'border-sakura-300 text-sakura-700 bg-white',
              'hover:bg-sakura-100 hover:border-sakura-400',
              'disabled:opacity-40 disabled:cursor-not-allowed'
            )}
          >
            +¥{formatPrice(inc)}
          </button>
        ))}
      </div>

      {/* Submit button */}
      <button
        onClick={handleSubmit}
        disabled={disabled}
        className="w-full py-3.5 rounded-lg text-base font-semibold transition-opacity
                   hover:opacity-90 flex items-center justify-center gap-2
                   bg-gradient-header text-white shadow-button
                   disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <Gavel className="w-4 h-4" />
        Place a bid
      </button>

      {/* Minimum bid hint */}
      <p className="text-[11px] text-muted text-center">
        Minimum bid: ¥{formatPrice(minBid)}
      </p>
    </div>
  )
}

