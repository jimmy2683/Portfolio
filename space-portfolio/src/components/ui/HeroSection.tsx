'use client'

import { motion } from 'framer-motion'
import { ThreeProvider } from '../3d/ThreeProvider'
import { SceneManager } from '../3d/SceneManager'

export function HeroSection() {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* 3D Scene */}
      <div className="absolute inset-0">
        <ThreeProvider>
          <SceneManager />
        </ThreeProvider>
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-6 text-5xl font-bold text-white md:text-7xl"
        >
          Karan Gupta
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8 text-xl text-gray-300 md:text-2xl"
        >
          Full Stack Developer & UI/UX Designer
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex gap-4"
        >
          <a
            href="#projects"
            className="rounded-full bg-white px-8 py-3 text-lg font-semibold text-black transition-colors hover:bg-gray-200"
          >
            View Projects
          </a>
          <a
            href="#contact"
            className="rounded-full border-2 border-white px-8 py-3 text-lg font-semibold text-white transition-colors hover:bg-white hover:text-black"
          >
            Contact Me
          </a>
        </motion.div>
      </div>
    </section>
  )
} 