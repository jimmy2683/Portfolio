'use client'

import { motion } from 'framer-motion'
import { TypewriterEffect } from '@/components/TypewriterEffect'

export function HeroText() {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-10">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-6xl font-bold text-white mb-4 glow-text"
      >
        Karan Gupta
      </motion.h1>
      
      <TypewriterEffect text="Exploring the Universe of Code 🚀" />
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="text-xl text-cyan-400 mt-4"
      >
        Innovating through AI, VR, and Web3
      </motion.p>
    </div>
  )
} 