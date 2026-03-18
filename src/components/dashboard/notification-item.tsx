'use client'

import {
  Package,
  CreditCard,
  Truck,
  Info,
  Tag,
  CheckCheck,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { UserNotification, NotificationType } from '@/types/dashboard'

const TYPE_CONFIG: Record<NotificationType, { icon: React.ElementType; color: string }> = {
  ORDER_UPDATE: { icon: Package, color: 'bg-blue-100 text-blue-600' },
  PAYMENT_UPDATE: { icon: CreditCard, color: 'bg-yellow-100 text-yellow-700' },
  TRACKING_UPDATE: { icon: Truck, color: 'bg-purple-100 text-purple-600' },
  SYSTEM: { icon: Info, color: 'bg-gray-100 text-gray-600' },
  PROMOTION: { icon: Tag, color: 'bg-pink-100 text-pink-600' },
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60_000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    timeZone: 'Asia/Bangkok',
  })
}

interface NotificationItemProps {
  notification: UserNotification
  onMarkRead?: (id: string) => void
}

export default function NotificationItem({ notification, onMarkRead }: NotificationItemProps) {
  const cfg = TYPE_CONFIG[notification.type]
  const Icon = cfg.icon

  return (
    <div
      className={cn(
        'flex items-start gap-3 p-4 rounded-xl border transition-colors',
        notification.isRead
          ? 'bg-white border-card-border'
          : 'bg-sakura-50/60 border-sakura-200'
      )}
    >
      {/* Icon */}
      <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center shrink-0', cfg.color)}>
        <Icon className="w-4.5 h-4.5" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className={cn('text-sm font-semibold', notification.isRead ? 'text-sakura-700' : 'text-sakura-900')}>
            {notification.title}
          </p>
          <span className="text-[11px] text-muted whitespace-nowrap shrink-0">
            {timeAgo(notification.createdAt)}
          </span>
        </div>
        <p className="text-sm text-muted mt-0.5 leading-relaxed">{notification.message}</p>
      </div>

      {/* Mark as read */}
      {!notification.isRead && onMarkRead && (
        <button
          onClick={() => onMarkRead(notification.id)}
          title="Mark as read"
          className="p-1.5 rounded-lg text-sakura-400 hover:text-sakura-600 hover:bg-sakura-100 transition-colors shrink-0"
        >
          <CheckCheck className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}

