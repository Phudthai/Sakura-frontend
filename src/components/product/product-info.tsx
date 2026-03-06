'use client'

import { useState, useCallback } from 'react'
import type { ProductDetail, BidEntry } from '@/types/product'
import { formatPrice } from '@/lib/utils'
import ActionButtons from './action-buttons'
import ProductDescription from './product-description'
import ProductMeta from './product-meta'
import CountdownTimer from './countdown-timer'
import BidForm from './bid-form'
import BidHistory from './bid-history'
import { Trophy, ShoppingCart } from 'lucide-react'

interface ProductInfoProps {
  product: ProductDetail
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const isAuction = Boolean(product.isAuction)

  // Local state for bid management
  const [currentBid, setCurrentBid] = useState(product.currentBid ?? product.price)
  const [bidHistory, setBidHistory] = useState<BidEntry[]>(product.bidHistory ?? [])
  const [auctionEnded, setAuctionEnded] = useState(Boolean(product.auctionEnded))

  // For demo: item 23 = user won, item 24 = user lost
  const userWon = auctionEnded && product.id === '23'
  const userLost = auctionEnded && !userWon

  const handlePlaceBid = useCallback(
    (amount: number) => {
      const newBid: BidEntry = {
        id: `bid-new-${Date.now()}`,
        bidderName: 'You',
        amount,
        timestamp: 'Just now',
        isWinning: true,
      }

      // Mark all existing as not winning
      const updatedHistory = bidHistory.map((b) => ({
        ...b,
        isWinning: false,
      }))

      setBidHistory([newBid, ...updatedHistory])
      setCurrentBid(amount)
    },
    [bidHistory]
  )

  const handleAuctionExpired = useCallback(() => {
    setAuctionEnded(true)
  }, [])

  return (
    <div className="flex flex-col gap-5">
      {/* Auction badge */}
      {isAuction && (
        <span
          className="self-start text-xs font-semibold px-3 py-1 border
                     border-price text-price rounded"
        >
          Auction items
        </span>
      )}

      {/* Title */}
      <h1 className="text-xl md:text-2xl font-bold text-sakura-900 leading-snug">
        {product.name}
      </h1>

      {/* Price / Current bid */}
      <div className="flex items-baseline gap-2 flex-wrap">
        {isAuction ? (
          <span className="text-sm text-muted-dark">
            {auctionEnded ? 'Final bid' : 'Currently'}
          </span>
        ) : null}
        <span className="text-3xl font-bold text-sakura-900">
          <span className="text-lg font-normal mr-0.5">¥</span>
          {formatPrice(isAuction ? currentBid : product.price)}
        </span>
        <span className="text-xs text-muted-dark">
          (Tax included) Shipping included
        </span>
      </div>

      {/* Starting price for auctions */}
      {isAuction && product.startingPrice != null && (
        <p className="text-xs text-muted-dark">
          Starting price: ¥{formatPrice(product.startingPrice)}
          {bidHistory.length > 0 && (
            <span className="ml-2 text-sakura-600">
              ({bidHistory.length} bid{bidHistory.length !== 1 ? 's' : ''})
            </span>
          )}
        </p>
      )}

      {/* Countdown timer */}
      {isAuction && product.endTimeISO && (
        <CountdownTimer
          endTimeISO={product.endTimeISO}
          onExpired={handleAuctionExpired}
        />
      )}

      {/* Auction end time display */}
      {product.endTime && (
        <p className="text-sm font-semibold text-sakura-900">
          Scheduled end time :{' '}
          <span className="font-normal">{product.endTime}</span>
        </p>
      )}

      {/* Action buttons row */}
      <ActionButtons
        likeCount={product.likeCount}
        shareCount={product.shareCount}
      />

      {/* ===== Auction: Active bidding ===== */}
      {isAuction && !auctionEnded && (
        <>
          <BidForm
            currentBid={currentBid}
            onPlaceBid={handlePlaceBid}
          />
          <BidHistory bids={bidHistory} />
        </>
      )}

      {/* ===== Auction: Ended — User WON ===== */}
      {isAuction && auctionEnded && userWon && (
        <>
          {/* Winner banner */}
          <div className="flex items-center gap-3 bg-gradient-to-r from-sakura-200/60 to-pink-soft/60
                          border border-sakura-400/50 rounded-xl px-4 py-3">
            <Trophy className="w-6 h-6 text-price shrink-0" />
            <div>
              <p className="text-sm font-semibold text-sakura-900">
                You won this auction!
              </p>
              <p className="text-xs text-muted-dark">
                Complete your purchase below.
              </p>
            </div>
          </div>

          {/* Buy now button — enabled */}
          <button
            className="w-full py-3.5 rounded-lg text-base font-semibold transition-opacity
                       hover:opacity-90 flex items-center justify-center gap-2
                       bg-gradient-header text-white shadow-button"
          >
            <ShoppingCart className="w-4 h-4" />
            Buy now — ¥{formatPrice(currentBid)}
          </button>

          <BidHistory bids={bidHistory} />
        </>
      )}

      {/* ===== Auction: Ended — User LOST / not bidder ===== */}
      {isAuction && auctionEnded && userLost && (
        <>
          {/* Lost banner */}
          <div className="flex items-center gap-3 bg-sakura-100/60
                          border border-card-border rounded-xl px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-sakura-900">
                This auction has ended
              </p>
              <p className="text-xs text-muted-dark">
                The item was sold to another bidder.
              </p>
            </div>
          </div>

          {/* Buy now button — disabled */}
          <button
            disabled
            className="w-full py-3.5 rounded-lg text-base font-semibold
                       bg-sakura-300 text-white cursor-not-allowed opacity-50"
          >
            Auction ended
          </button>

          <BidHistory bids={bidHistory} />
        </>
      )}

      {/* ===== Fixed-price: Direct buy ===== */}
      {!isAuction && (
        <>
          <button
            className="w-full py-3.5 rounded-lg text-base font-semibold transition-opacity
                       hover:opacity-90 flex items-center justify-center gap-2
                       bg-gradient-header text-white shadow-button"
          >
            <ShoppingCart className="w-4 h-4" />
            Buy now
          </button>

          <button
            className="w-full py-2.5 rounded-lg text-sm font-medium transition-colors
                       border border-sakura-400 text-sakura-700 bg-white
                       hover:bg-sakura-100"
          >
            Make an offer
          </button>
        </>
      )}

      {/* Divider */}
      <hr className="border-card-border" />

      {/* Product description */}
      <ProductDescription
        description={product.description}
        postedAt={product.postedAt}
      />

      {/* Divider */}
      <hr className="border-card-border" />

      {/* Product information table */}
      <ProductMeta product={product} />
    </div>
  )
}
