'use client'

import { useState } from 'react'
import { Gavel } from 'lucide-react'
import BidCard from '@/components/dashboard/bid-card'
import { MOCK_USER_BIDS } from '@/lib/constants'
import type { BidStatus } from '@/types/dashboard'
import { cn } from '@/lib/utils'

const TABS: { value: BidStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'winning', label: 'Winning' },
  { value: 'outbid', label: 'Outbid' },
  { value: 'won', label: 'Won' },
  { value: 'lost', label: 'Lost' },
]

export default function ActiveBidsPage() {
  const [filter, setFilter] = useState<BidStatus | 'all'>('all')

  const filteredBids =
    filter === 'all'
      ? MOCK_USER_BIDS
      : MOCK_USER_BIDS.filter((b) => b.status === filter)

  return (
    <div className="space-y-5">
      {/* Title */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-header flex items-center justify-center shadow-button">
          <Gavel className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-sakura-900">Active Bids</h1>
          <p className="text-sm text-muted">Track your auction bids in real time</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {TABS.map((tab) => {
          const count =
            tab.value === 'all'
              ? MOCK_USER_BIDS.length
              : MOCK_USER_BIDS.filter((b) => b.status === tab.value).length
          return (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={cn(
                'px-3.5 py-1.5 rounded-full text-sm font-medium border transition-all',
                filter === tab.value
                  ? 'bg-gradient-header text-white border-transparent shadow-button'
                  : 'bg-white text-sakura-700 border-card-border hover:bg-sakura-50'
              )}
            >
              {tab.label}
              <span className="ml-1.5 opacity-70">({count})</span>
            </button>
          )
        })}
      </div>

      {/* Grid */}
      {filteredBids.length === 0 ? (
        <div className="text-center py-16 text-muted">
          <Gavel className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>No bids in this category</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBids.map((bid) => (
            <BidCard key={bid.id} bid={bid} />
          ))}
        </div>
      )}
    </div>
  )
}

