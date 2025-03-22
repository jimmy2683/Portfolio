'use client'

import { motion } from 'framer-motion'

export function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black">
      <div className="relative">
        {/* Orbiting rings */}
        <motion.div
          className="absolute inset-0 border-2 border-cyan-500/20 rounded-full"
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute inset-4 border-2 border-purple-500/20 rounded-full"
          animate={{
            rotate: -360,
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute inset-8 border-2 border-blue-500/20 rounded-full"
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Center dot */}
        <motion.div
          className="w-4 h-4 bg-cyan-500 rounded-full"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Loading text */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-cyan-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Loading the Universe...
      </motion.div>
    </div>
  )
} 