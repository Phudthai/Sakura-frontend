'use client'

import { useCallback, useEffect, useState } from 'react'
import { Wallet, TrendingUp, TrendingDown, Upload } from 'lucide-react'
import { API_ENDUSER_PREFIX } from '@/lib/api-config'
import type { WalletData, WalletTransaction, WalletTransactionType } from '@/types/dashboard'
import { cn } from '@/lib/utils'
import { UploadSlipModal } from '@/components/check-status/upload-slip-modal'

const TYPE_LABEL: Record<WalletTransactionType, string> = {
  DEPOSIT: 'Deposit',
  WITHDRAWAL: 'Withdrawal',
  PAYMENT: 'Payment',
  REFUND: 'Refund',
  OVERPAYMENT_CREDIT: 'Overpayment Credit',
  TOPUP: 'Top-up',
  PAYMENT_DEBIT: 'Payment',
}

function txTypeLabel(type: string): string {
  return TYPE_LABEL[type as WalletTransactionType] ?? type.replace(/_/g, ' ')
}

type SlipStatus = {
  status: 'PENDING_VERIFICATION' | 'CONFIRMED' | 'REJECTED'
  slipImageUrl?: string
  rejectionReason?: string | null
}

function TransactionRow({ tx }: { tx: WalletTransaction }) {
  const isCredit = tx.amount >= 0
  return (
    <div className="flex items-center justify-between px-4 py-3.5 rounded-xl bg-white border border-card-border hover:shadow-card transition-shadow">
      <div className="flex items-center gap-3">
        <div
          className={cn(
            'w-9 h-9 rounded-full flex items-center justify-center shrink-0',
            isCredit ? 'bg-green-100' : 'bg-red-100'
          )}
        >
          {isCredit ? (
            <TrendingUp className="w-4 h-4 text-green-600" />
          ) : (
            <TrendingDown className="w-4 h-4 text-red-500" />
          )}
        </div>
        <div>
          <p className="text-sm font-medium text-sakura-900">{txTypeLabel(tx.type)}</p>
          <p className="text-xs text-muted">
            {new Date(tx.createdAt).toLocaleDateString('th-TH', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p
          className={cn(
            'text-sm font-semibold',
            isCredit ? 'text-green-600' : 'text-red-500'
          )}
        >
          {tx.amount >= 0 ? '+' : '−'}
          {Math.abs(tx.amount).toLocaleString()} THB
        </p>
        <p className="text-xs text-muted">Balance: {tx.balanceAfter.toLocaleString()} THB</p>
      </div>
    </div>
  )
}

export default function WalletPage() {
  const [wallet, setWallet] = useState<WalletData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [slipStatus, setSlipStatus] = useState<SlipStatus | null>(null)
  const [uploadModalOpen, setUploadModalOpen] = useState(false)
  const [uploadLoading, setUploadLoading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const fetchSlipStatus = useCallback(async () => {
    try {
      const res = await fetch(
        `${API_ENDUSER_PREFIX}/check-status/slip-status?purpose=wallet`
      )
      const json = await res.json()
      if (res.ok && json.success && json.data?.slipStatus) {
        setSlipStatus(json.data.slipStatus as SlipStatus)
      } else {
        setSlipStatus(null)
      }
    } catch {
      setSlipStatus(null)
    }
  }, [])

  const refreshWallet = useCallback(async () => {
    try {
      const res = await fetch(`${API_ENDUSER_PREFIX}/wallet`)
      const json = await res.json()
      if (res.ok && json.success) {
        setWallet(json.data)
      }
    } catch {
      /* keep previous wallet */
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setIsLoading(true)
      setError(null)
      try {
        const [wRes, sRes] = await Promise.all([
          fetch(`${API_ENDUSER_PREFIX}/wallet`),
          fetch(`${API_ENDUSER_PREFIX}/check-status/slip-status?purpose=wallet`),
        ])
        const wJson = await wRes.json()
        const sJson = await sRes.json()
        if (cancelled) return
        if (wRes.ok && wJson.success) {
          setWallet(wJson.data)
        } else {
          setError(wJson.error?.message ?? 'Failed to load wallet')
        }
        if (sRes.ok && sJson.success && sJson.data?.slipStatus) {
          setSlipStatus(sJson.data.slipStatus as SlipStatus)
        } else {
          setSlipStatus(null)
        }
      } catch {
        if (!cancelled) setError('Network error — please try again')
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const handleSubmitSlip = async (file: File) => {
    setUploadError(null)
    setUploadLoading(true)
    try {
      const formData = new FormData()
      formData.append('slip', file)
      const res = await fetch(
        `${API_ENDUSER_PREFIX}/check-status/submit-slip?purpose=wallet`,
        { method: 'POST', body: formData }
      )
      const json = await res.json()

      if (res.ok && json.success) {
        setSlipStatus({
          status: json.data?.status ?? 'PENDING_VERIFICATION',
          slipImageUrl: json.data?.slipImageUrl,
          rejectionReason: json.data?.rejectionReason ?? null,
        })
        setUploadModalOpen(false)
        await refreshWallet()
        await fetchSlipStatus()
      } else {
        const err = json.error
        const code = err?.code
        const msg = err?.message ?? 'ส่งสลิปไม่สำเร็จ'
        if (code === 'PENDING_EXISTS') {
          setUploadError('คุณมีสลิปเติมเงินรอตรวจสอบอยู่แล้ว')
          setSlipStatus({ status: 'PENDING_VERIFICATION' })
        } else if (res.status === 401) {
          setUploadError('กรุณาเข้าสู่ระบบ')
        } else {
          setUploadError(msg)
        }
      }
    } catch {
      setUploadError('ไม่สามารถส่งสลิปได้ กรุณาลองใหม่')
    } finally {
      setUploadLoading(false)
    }
  }

  const slipStatusLabel =
    slipStatus?.status === 'PENDING_VERIFICATION'
      ? 'รอ Staff ตรวจสอบ'
      : slipStatus?.status === 'CONFIRMED'
        ? 'อนุมัติแล้ว'
        : slipStatus?.status === 'REJECTED'
          ? `ปฏิเสธ${slipStatus.rejectionReason ? `: ${slipStatus.rejectionReason}` : ''}`
          : null

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-header flex items-center justify-center shadow-button">
          <Wallet className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-sakura-900">My Wallet</h1>
          <p className="text-sm text-muted">View your balance and transactions</p>
        </div>
      </div>

      {isLoading ? (
        <div className="h-28 rounded-2xl skeleton-shimmer" />
      ) : wallet ? (
        <div className="bg-gradient-header rounded-2xl px-6 py-5 shadow-button text-white">
          <p className="text-sm opacity-80 mb-1">Available Balance</p>
          <p className="text-4xl font-bold tracking-tight">
            {wallet.balance.toLocaleString()}
            <span className="text-xl font-medium ml-2 opacity-80">{wallet.currency}</span>
          </p>
        </div>
      ) : null}

      {!isLoading && (
        <div className="rounded-2xl border border-card-border bg-white shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="space-y-2 min-w-0 flex-1">
              <h2 className="text-sm font-semibold text-sakura-800">
                สลิปเติมเงินเข้า Wallet
              </h2>
              {slipStatusLabel ? (
                <p
                  className={cn(
                    'text-sm font-semibold',
                    slipStatus?.status === 'CONFIRMED'
                      ? 'text-emerald-600'
                      : slipStatus?.status === 'REJECTED'
                        ? 'text-red-600'
                        : 'text-amber-600'
                  )}
                >
                  สถานะ: {slipStatusLabel}
                </p>
              ) : (
                <p className="text-sm text-muted">
                  อัปโหลดสลิปโอนเงินเพื่อเติมเงิน (หนึ่งรายการรอตรวจได้ในแต่ละครั้ง)
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => {
                setUploadError(null)
                setUploadModalOpen(true)
              }}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-sakura-700 text-white font-semibold hover:bg-sakura-800 transition-colors shrink-0"
            >
              <Upload className="w-4 h-4" />
              อัปโหลดสลิป
            </button>
          </div>
        </div>
      )}

      <UploadSlipModal
        open={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onSubmit={handleSubmitSlip}
        loading={uploadLoading}
        error={uploadError}
      />

      {error && (
        <div className="text-center py-10 text-muted">
          <Wallet className="w-10 h-10 mx-auto mb-2 opacity-30" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {!isLoading && wallet && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-sakura-700 uppercase tracking-wide">
            Transaction History
          </h2>
          {wallet.transactions.length === 0 ? (
            <div className="text-center py-16 text-muted">
              <Wallet className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No transactions yet</p>
            </div>
          ) : (
            wallet.transactions.map((tx) => <TransactionRow key={tx.id} tx={tx} />)
          )}
        </div>
      )}

      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-16 rounded-xl skeleton-shimmer" />
          ))}
        </div>
      )}
    </div>
  )
}
