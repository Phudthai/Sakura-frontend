'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ImageGalleryProps {
  images: string[]
  alt: string
}

export default function ImageGallery({ images, alt }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const total = images.length

  const handlePrev = () => {
    setSelectedIndex((i) => (i - 1 + total) % total)
  }

  const handleNext = () => {
    setSelectedIndex((i) => (i + 1) % total)
  }

  // Fallback when no images
  if (total === 0) {
    return (
      <div className="w-full aspect-square bg-gradient-placeholder rounded-2xl
                      flex items-center justify-center text-6xl">
        📦
      </div>
    )
  }

  return (
    <div className="flex gap-3">
      {/* Thumbnail strip (left side) */}
      {total > 1 && (
        <div className="flex flex-col gap-2 shrink-0">
          {images.map((src, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={cn(
                'w-16 h-16 rounded-lg overflow-hidden border-2 transition-all',
                index === selectedIndex
                  ? 'border-sakura-500 shadow-card'
                  : 'border-card-border hover:border-sakura-400 opacity-70 hover:opacity-100'
              )}
            >
              <img
                src={src}
                alt={`${alt} thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Main image */}
      <div className="relative flex-1 aspect-square bg-sakura-100 rounded-2xl overflow-hidden group">
        <img
          src={images[selectedIndex]}
          alt={`${alt} - image ${selectedIndex + 1}`}
          className="w-full h-full object-cover"
        />

        {/* Navigation arrows */}
        {total > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-2 top-1/2 -translate-y-1/2
                         w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm
                         flex items-center justify-center
                         opacity-0 group-hover:opacity-100 transition-opacity
                         hover:bg-white shadow-sm"
            >
              <ChevronLeft className="w-5 h-5 text-sakura-900" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2
                         w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm
                         flex items-center justify-center
                         opacity-0 group-hover:opacity-100 transition-opacity
                         hover:bg-white shadow-sm"
            >
              <ChevronRight className="w-5 h-5 text-sakura-900" />
            </button>
          </>
        )}

        {/* Zoom icon (bottom-left) */}
        <button
          className="absolute bottom-3 left-3 w-8 h-8 rounded-full
                     bg-white/70 backdrop-blur-sm flex items-center justify-center
                     hover:bg-white transition-colors"
        >
          <ZoomIn className="w-4 h-4 text-sakura-900" />
        </button>

        {/* Image counter (bottom-right) */}
        {total > 1 && (
          <span
            className="absolute bottom-3 right-3 bg-black/50 text-white
                       text-xs px-2.5 py-1 rounded-full backdrop-blur-sm"
          >
            {selectedIndex + 1} / {total}
          </span>
        )}
      </div>
    </div>
  )
}

