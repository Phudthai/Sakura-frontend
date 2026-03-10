'use client'

import { motion } from 'framer-motion'

const SAKURA_COLORS = [
  '#e9d5ff', // ม่วงพาสเทล (pastel purple)
  '#fbbfce', // ชมพูพาสเทล (pastel pink)
  '#fce7f3', // ชมพูอ่อน
  '#f9a8d4', // ม่วงชมพูพาสเทล (pastel purple-pink)
  '#e9d5ff',
  '#f3e8ff', // ม่วงอ่อน
]

const PETAL_PATH = 'M12,1 C16,8 16,16 12,23 C8,16 8,8 12,1'

interface FallingPetalProps {
  left: string
  delay: number
  duration: number
  color: string
  size: number
  drift: number
}

function FallingPetal({ left, delay, duration, color, size, drift }: FallingPetalProps) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        left,
        top: '-20px',
        width: size,
        height: size,
        transform: 'translateX(-50%)',
      }}
      animate={{
        y: ['0px', '120px'],
        x: [0, drift],
        rotate: [0, 180, 360],
      }}
      transition={{
        duration,
        repeat: Infinity,
        delay,
        ease: 'linear',
      }}
      aria-hidden
    >
      <svg viewBox="0 0 24 24" className="w-full h-full drop-shadow-md" fill={color} opacity={0.95}>
        <path d={PETAL_PATH} />
      </svg>
    </motion.div>
  )
}

const PETALS: Omit<FallingPetalProps, 'color'>[] = [
  { left: '5%', delay: 0, duration: 6, size: 22, drift: 15 },
  { left: '12%', delay: 1.2, duration: 7, size: 8, drift: -20 },
  { left: '22%', delay: 0.5, duration: 5.5, size: 18, drift: 10 },
  { left: '35%', delay: 2, duration: 6.5, size: 10, drift: -15 },
  { left: '42%', delay: 0.8, duration: 7.5, size: 24, drift: 25 },
  { left: '55%', delay: 1.5, duration: 5, size: 9, drift: -10 },
  { left: '62%', delay: 0.3, duration: 6, size: 20, drift: 18 },
  { left: '75%', delay: 2.2, duration: 7, size: 14, drift: -22 },
  { left: '85%', delay: 1, duration: 5.5, size: 8, drift: 12 },
  { left: '92%', delay: 1.8, duration: 6.5, size: 19, drift: -18 },
]

export default function FallingSakura() {
  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      aria-hidden
    >
      {PETALS.map((p, i) => (
        <FallingPetal
          key={i}
          {...p}
          color={SAKURA_COLORS[i % SAKURA_COLORS.length]}
        />
      ))}
    </div>
  )
}
