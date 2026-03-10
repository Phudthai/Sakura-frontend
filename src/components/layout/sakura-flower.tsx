'use client'

import { motion } from 'framer-motion'

interface SakuraFlowerProps {
  size?: number
  x?: string | number
  y?: string | number
  opacity?: number
  delay?: number
  color?: string
}

const PETAL_PATH =
  'M12,4 C14,8 14,12 12,15 C10,12 10,8 12,4'

export default function SakuraFlower({
  size = 20,
  x = '50%',
  y = '50%',
  opacity = 0.7,
  delay = 0,
  color = '#fbbfce',
}: SakuraFlowerProps) {
  const rotations = [0, 72, 144, 216, 288]

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        left: x,
        top: y,
        width: size,
        height: size,
        opacity,
        transform: 'translate(-50%, -50%)',
      }}
      animate={{
        rotate: [0, 5, -5, 0],
        y: [0, -2, 0],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut',
        delay,
      }}
      aria-hidden
    >
      <svg
        viewBox="0 0 24 24"
        className="w-full h-full"
        fill={color}
      >
        {rotations.map((rot, i) => (
          <motion.g
            key={i}
            transform={`rotate(${rot} 12 12)`}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: delay + i * 0.05 }}
          >
            <path d={PETAL_PATH} />
          </motion.g>
        ))}
        <circle cx="12" cy="12" r="2" fill="#fef3c7" />
      </svg>
    </motion.div>
  )
}
