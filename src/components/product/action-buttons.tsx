'use client'

import { Heart, Share2, MessageSquare, Bookmark, Flag } from 'lucide-react'

interface ActionButtonsProps {
  likeCount: number
  shareCount: number
}

function ActionBtn({
  icon: Icon,
  label,
  count,
}: {
  icon: React.ElementType
  label: string
  count?: number
}) {
  return (
    <button
      className="flex items-center gap-1.5 px-3 py-2 border border-card-border
                 rounded-lg text-sm text-sakura-900 hover:bg-sakura-100/60
                 transition-colors"
      title={label}
    >
      <Icon className="w-4 h-4" />
      {count != null && <span className="text-xs">{count}</span>}
      {count == null && (
        <span className="hidden sm:inline text-xs">{label}</span>
      )}
    </button>
  )
}

export default function ActionButtons({
  likeCount,
  shareCount,
}: ActionButtonsProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <ActionBtn icon={Heart} label="Like" count={likeCount} />
      <ActionBtn icon={Share2} label="Share" count={shareCount} />
      <ActionBtn icon={MessageSquare} label="comment" />
      <ActionBtn icon={Bookmark} label="keep" />
      <ActionBtn icon={Flag} label="Report" />
    </div>
  )
}

