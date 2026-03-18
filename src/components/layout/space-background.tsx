'use client'

import { motion } from 'framer-motion'
import { useMemo } from 'react'

const STAR_COUNT = 40
const SEED = 12345

/** Seeded random — ให้ server และ client ได้ค่าเดียวกัน (แก้ hydration mismatch) */
function seededRandom(seed: number) {
  return () => {
    const x = Math.sin(seed++) * 10000
    return x - Math.floor(x)
  }
}

function generateStars() {
  const r = seededRandom(SEED)
  const stars = []
  for (let i = 0; i < STAR_COUNT; i++) {
    stars.push({
      id: i,
      x: r() * 100,
      y: r() * 100,
      size: 1 + r() * 2,
      opacityBase: 0.4 + r() * 0.6,
      duration: 2 + r() * 3,
      delay: r() * 2,
    })
  }
  return stars
}

export default function SpaceBackground() {
  const stars = useMemo(() => generateStars(), [])

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      aria-hidden
    >
      {/* Purple gradient base */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 70% 80%, rgba(139, 92, 246, 0.35), transparent 50%),
            radial-gradient(ellipse 60% 40% at 20% 30%, rgba(167, 139, 250, 0.25), transparent 50%),
            radial-gradient(ellipse 100% 100% at 50% 50%, rgba(124, 58, 237, 0.15), transparent 70%),
            linear-gradient(180deg, #4c1d95 0%, #5b21b6 25%, #6d28d9 50%, #7c3aed 75%, #a78bfa 100%)
          `,
        }}
      />

      {/* Twinkling stars */}
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
          }}
          animate={{
            opacity: [star.opacityBase * 0.4, star.opacityBase, star.opacityBase * 0.4],
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: star.delay,
          }}
        />
      ))}
    </div>
  )
}
