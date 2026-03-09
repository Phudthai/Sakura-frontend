'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import {
  X, ExternalLink, Loader2,
  TrendingUp,
} from 'lucide-react'
import type { TrackedAuction } from '@/types/auction'
import { formatJPY, getHostname } from '@/lib/utils'
import { API_ENDUSER_PREFIX } from '@/lib/api-config'
import { Countdown } from './search-link-tab'

interface PriceLog {
  id: number
  price: number
  bidCount: number
  recordedAt: string
  status?: string
  statusLabel?: string
  statusColor?: string
}

async function fetchPriceLogs(auctionId: number): Promise<PriceLog[]> {
  try {
    const res = await fetch(`${API_ENDUSER_PREFIX}/auction-requests/${auctionId}/price-logs`)
    const json = await res.json()
    if (!res.ok) return []
    const logs = json.data?.logs ?? json.data ?? []
    return Array.isArray(logs) ? logs : []
  } catch {
    return []
  }
}

interface Props {
  auction: TrackedAuction
  onClose: () => void
}

export default function AuctionDetailModal({ auction, onClose }: Props) {
  const { data, url } = auction
  const [priceLogs, setPriceLogs] = useState<PriceLog[]>([])
  const [logsLoading, setLogsLoading] = useState(true)

  useEffect(() => {
    setLogsLoading(true)
    fetchPriceLogs(auction.id)
      .then((logs) => setPriceLogs(Array.isArray(logs) ? logs : []))
      .finally(() => setLogsLoading(false))
  }, [auction.id])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    },
    [onClose],
  )

  useEffect(() => {
    const prev = document.body.style.overflow
    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = prev
    }
  }, [handleKeyDown])

  const hostname = getHostname(url)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-[fadeIn_150ms_ease]"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative w-full max-w-lg max-h-[90vh] bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col animate-[slideUp_200ms_ease]">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-white/80 hover:bg-sakura-100 text-sakura-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="overflow-y-auto flex-1">
          {/* Image header */}
          <div className="relative w-full aspect-square max-h-72 bg-sakura-100 flex items-center justify-center">
            {data?.imageUrl ? (
              <Image
                src={data.imageUrl}
                alt={data.title}
                fill
                className="object-contain"
                unoptimized
              />
            ) : (
              <span className="text-5xl">🛍️</span>
            )}
          </div>

          {/* Content */}
          <div className="p-5 space-y-5">
            {/* Title */}
            <div>
              <h2 className="text-lg font-bold text-sakura-900 leading-snug">
                {data?.title ?? 'ไม่ทราบชื่อสินค้า'}
              </h2>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 mt-1.5 text-xs text-muted hover:text-sakura-700 hover:underline transition-colors"
              >
                <ExternalLink className="w-3 h-3" />
                {hostname}
              </a>
            </div>

            {/* Price + countdown row */}
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs text-muted-dark mb-0.5">ราคาปัจจุบัน</p>
                <p className="text-2xl font-bold text-sakura-900">
                  {formatJPY(data?.currentPrice ?? 0)}
                </p>
              </div>
              {data?.endTime && (
                <div className="text-right">
                  <p className="text-xs text-muted-dark mb-0.5">เหลือเวลา</p>
                  <Countdown endTime={data.endTime} />
                </div>
              )}
            </div>

            {/* Price history */}
            <div>
              <div className="flex items-center gap-1.5 mb-3">
                <TrendingUp className="w-4 h-4 text-sakura-600" />
                <h3 className="text-sm font-semibold text-sakura-900">ประวัติราคา</h3>
              </div>

              {logsLoading ? (
                <div className="flex items-center justify-center py-8 gap-2 text-muted">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">กำลังโหลด...</span>
                </div>
              ) : priceLogs.length === 0 ? (
                <p className="text-sm text-muted py-4 text-center">ยังไม่มีประวัติราคา</p>
              ) : (
                <div className="border border-card-border rounded-xl overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-sakura-50 text-xs text-muted-dark">
                        <th className="text-left px-4 py-2 font-medium">ครั้งที่บิด</th>
                        <th className="text-right px-4 py-2 font-medium">ราคา</th>
                        <th className="text-right px-4 py-2 font-medium">สเตตัส</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-card-border">
                      {priceLogs.map((log, i) => (
                        <tr key={log.id ?? i} className="hover:bg-sakura-50/50">
                          <td className="px-4 py-2.5 font-medium text-sakura-900">
                            {i + 1}
                          </td>
                          <td className="px-4 py-2.5 text-right font-semibold text-sakura-900">
                            {formatJPY(log.price)}
                          </td>
                          <td className="px-4 py-2.5 text-right">
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs font-medium ${!log.statusColor ? 'bg-sakura-100 text-sakura-700' : ''}`}
                              style={
                                log.statusColor
                                  ? { backgroundColor: `${log.statusColor}20`, color: log.statusColor }
                                  : undefined
                              }
                            >
                              {log.statusLabel ?? log.status ?? '—'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
