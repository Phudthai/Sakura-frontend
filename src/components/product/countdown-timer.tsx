'use client'

import { useState, useEffect } from 'react'
import { Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CountdownTimerProps {
  /** ISO date string for the auction end time */
  endTimeISO: string
  /** Callback when the timer reaches zero */
  onExpired?: () => void
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
  total: number
}

function calcTimeLeft(endTimeISO: string): TimeLeft {
  const total = Math.max(0, new Date(endTimeISO).getTime() - Date.now())
  return {
    days: Math.floor(total / (1000 * 60 * 60 * 24)),
    hours: Math.floor((total / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((total / (1000 * 60)) % 60),
    seconds: Math.floor((total / 1000) % 60),
    total,
  }
}

function pad(n: number): string {
  return n.toString().padStart(2, '0')
}

export default function CountdownTimer({
  endTimeISO,
  onExpired,
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() =>
    calcTimeLeft(endTimeISO)
  )

  useEffect(() => {
    const timer = setInterval(() => {
      const tl = calcTimeLeft(endTimeISO)
      setTimeLeft(tl)
      if (tl.total <= 0) {
        clearInterval(timer)
        onExpired?.()
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [endTimeISO, onExpired])

  const isExpired = timeLeft.total <= 0
  const isUrgent = !isExpired && timeLeft.total < 3600_000 // less than 1 hour

  if (isExpired) {
    return (
      <div className="flex items-center gap-2 text-sm font-semibold text-red-500">
        <Clock className="w-4 h-4" />
        Auction ended
      </div>
    )
  }

  return (
    <div
      className={cn(
        'flex items-center gap-2 text-sm font-medium',
        isUrgent ? 'text-red-500' : 'text-sakura-900'
      )}
    >
      <Clock
        className={cn(
          'w-4 h-4',
          isUrgent && 'animate-pulse'
        )}
      />
      <span className="font-semibold">Time remaining:</span>
      <div className="flex items-center gap-0.5 font-mono tabular-nums">
        {timeLeft.days > 0 && (
          <>
            <TimeUnit value={timeLeft.days} label="d" />
            <span className="text-muted mx-0.5">:</span>
          </>
        )}
        <TimeUnit value={timeLeft.hours} label="h" />
        <span className="text-muted mx-0.5">:</span>
        <TimeUnit value={timeLeft.minutes} label="m" />
        <span className="text-muted mx-0.5">:</span>
        <TimeUnit value={timeLeft.seconds} label="s" urgent={isUrgent} />
      </div>
    </div>
  )
}

function TimeUnit({
  value,
  label,
  urgent,
}: {
  value: number
  label: string
  urgent?: boolean
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-xs',
        urgent
          ? 'bg-red-50 text-red-600'
          : 'bg-sakura-100 text-sakura-800'
      )}
    >
      {pad(value)}
      <span className="text-[10px] opacity-70">{label}</span>
    </span>
  )
}

