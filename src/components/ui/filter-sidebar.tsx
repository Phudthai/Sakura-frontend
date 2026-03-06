'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import type { FilterGroup } from '@/types/product'
import { cn } from '@/lib/utils'

interface FilterSidebarProps {
  groups: FilterGroup[]
}

function FilterSection({ group }: { group: FilterGroup }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border-b border-controls-border">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-4 py-3
                   text-left text-sm font-medium text-sakura-900
                   hover:bg-sakura-100/50 transition-colors"
      >
        {group.label}
        <ChevronDown
          className={cn(
            'w-4 h-4 text-muted transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {isOpen && (
        <div className="px-4 pb-3 space-y-1 animate-fade-slide-in">
          {group.options.map((option) => (
            <label
              key={option.value}
              className="flex items-center gap-2 py-1 cursor-pointer text-sm
                         text-sakura-900/80 hover:text-sakura-900 transition-colors"
            >
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-sakura-400
                           text-sakura-500 accent-sakura-500
                           focus:ring-sakura-500/30"
              />
              <span className="flex-1">{option.label}</span>
              {option.count != null && (
                <span className="text-xs text-muted">{option.count}</span>
              )}
            </label>
          ))}
        </div>
      )}
    </div>
  )
}

export default function FilterSidebar({ groups }: FilterSidebarProps) {
  return (
    <aside className="w-[260px] shrink-0 hidden lg:block">
      <div className="sticky top-[72px] bg-white rounded-2xl border border-card-border
                      shadow-card overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-controls-border">
          <h2 className="text-sm font-semibold text-sakura-900">Filter</h2>
          <button className="text-xs text-sakura-600 hover:text-sakura-700 font-medium">
            Clear selection
          </button>
        </div>

        {/* Filter sections */}
        {groups.map((group) => (
          <FilterSection key={group.id} group={group} />
        ))}
      </div>
    </aside>
  )
}

