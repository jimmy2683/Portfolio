'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export function TypewriterEffect({ text }: { text: string }) {
  const [displayText, setDisplayText] = useState('')
  
  useEffect(() => {
    let currentIndex = 0
    const interval = setInterval(() => {
      if (currentIndex <= text.length) {
        setDisplayText(text.slice(0, currentIndex))
        currentIndex++
      } else {
        clearInterval(interval)
      }
    }, 100)
    
    return () => clearInterval(interval)
  }, [text])

  return (
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-xl text-cyan-400"
    >
      {displayText}
    </motion.p>
  )
} 