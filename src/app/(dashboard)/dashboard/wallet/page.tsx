'use client'

import { useEffect, useState } from 'react'
import { Wallet, TrendingUp, TrendingDown, Loader2 } from 'lucide-react'
import { API_ENDUSER_PREFIX } from '@/lib/api-config'
import type { WalletData, WalletTransaction, WalletTransactionType } from '@/types/dashboard'
import { cn } from '@/lib/utils'

const CREDIT_TYPES = new Set<WalletTransactionType>(['DEPOSIT', 'REFUND', 'OVERPAYMENT_CREDIT'])

const TYPE_LABEL: Record<WalletTransactionType, string> = {
  DEPOSIT: 'Deposit',
  WITHDRAWAL: 'Withdrawal',
  PAYMENT: 'Payment',
  REFUND: 'Refund',
  OVERPAYMENT_CREDIT: 'Overpayment Credit',
}

function TransactionRow({ tx }: { tx: WalletTransaction }) {
  const isCredit = CREDIT_TYPES.has(tx.type)
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
          <p className="text-sm font-medium text-sakura-900">{TYPE_LABEL[tx.type]}</p>
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
          {isCredit ? '+' : '-'}
          {tx.amount.toLocaleString()} THB
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

  useEffect(() => {
    fetch(`${API_ENDUSER_PREFIX}/wallet`)
      .then(async (res) => {
        const json = await res.json()
        if (res.ok && json.success) {
          setWallet(json.data)
        } else {
          setError(json.error?.message ?? 'Failed to load wallet')
        }
      })
      .catch(() => setError('Network error — please try again'))
      .finally(() => setIsLoading(false))
  }, [])

  return (
    <div className="space-y-5">
      {/* Title */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-header flex items-center justify-center shadow-button">
          <Wallet className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-sakura-900">My Wallet</h1>
          <p className="text-sm text-muted">View your balance and transactions</p>
        </div>
      </div>

      {/* Balance card */}
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

      {/* Error */}
      {error && (
        <div className="text-center py-10 text-muted">
          <Wallet className="w-10 h-10 mx-auto mb-2 opacity-30" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Transactions */}
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

      {/* Loading skeleton rows */}
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
