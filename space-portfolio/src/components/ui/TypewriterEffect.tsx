'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface TypewriterEffectProps {
  text: string
  className?: string
}

export function TypewriterEffect({ text, className = '' }: TypewriterEffectProps) {
  const [displayText, setDisplayText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex])
        setCurrentIndex(prev => prev + 1)
      }, 100)

      return () => clearTimeout(timeout)
    }
  }, [currentIndex, text])

  return (
    <motion.span
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {displayText}
      <motion.span
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 0.8, repeat: Infinity }}
        className="inline-block w-[2px] h-[1em] bg-current ml-1"
      />
    </motion.span>
  )
} 