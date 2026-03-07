'use client'

import { useState, useEffect, useCallback, type FormEvent } from 'react'
import { X, TrendingUp } from 'lucide-react'
import type { TrackedAuction } from '@/types/auction'
import { formatJPY } from '@/lib/utils'

interface Props {
  auction: TrackedAuction
  onClose: () => void
  onSubmit: (amount: number) => void
}

export default function BidModal({ auction, onClose, onSubmit }: Props) {
  const { data } = auction
  const currentPrice = data?.currentPrice ?? 0
  const [input, setInput] = useState('')
  const [error, setError] = useState('')

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() },
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

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const num = Number(input.replace(/,/g, ''))
    if (!Number.isFinite(num) || num <= 0) {
      setError('กรุณาใส่ตัวเลขเท่านั้น')
      return
    }
    if (num <= currentPrice) {
      setError(`ต้องมากกว่าราคาปัจจุบัน (${formatJPY(currentPrice)})`)
      return
    }
    onSubmit(num)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-[fadeIn_150ms_ease]"
        onClick={onClose}
      />

      <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-xl overflow-hidden animate-[slideUp_200ms_ease]">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-white/80 hover:bg-sakura-100 text-sakura-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 space-y-5">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-sakura-600" />
            <h2 className="text-lg font-bold text-sakura-900">ส่ง Bid</h2>
          </div>

          {data?.title && (
            <p className="text-sm text-muted-dark line-clamp-2 leading-snug">{data.title}</p>
          )}

          <div className="flex items-center justify-between py-3 px-4 bg-sakura-50 rounded-xl">
            <span className="text-sm text-muted-dark">ราคาปัจจุบัน</span>
            <span className="text-lg font-bold text-sakura-900">{formatJPY(currentPrice)}</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-sakura-900 mb-1.5">
                ราคา Bid ของคุณ <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted font-medium">¥</span>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={input}
                  onChange={(e) => { setInput(e.target.value.replace(/[^0-9]/g, '')); setError('') }}
                  placeholder={currentPrice > 0 ? `มากกว่า ${formatJPY(currentPrice)}` : 'กรอกราคา'}
                  className="w-full pl-8 pr-4 py-3 rounded-xl border border-card-border bg-white text-sakura-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-sakura-400 focus:border-transparent transition-all"
                  autoFocus
                />
              </div>
              {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
              <p className="mt-1.5 text-xs text-muted">* ราคา Bid ต้องสูงกว่าราคาปัจจุบันอย่างน้อย 1 ¥</p>
            </div>

            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 rounded-xl border border-card-border text-sm font-semibold text-muted hover:bg-sakura-50 transition-colors"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                className="flex-1 py-3 rounded-xl bg-sakura-900 text-white text-sm font-semibold hover:bg-sakura-800 transition-colors"
              >
                ส่ง Bid
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
