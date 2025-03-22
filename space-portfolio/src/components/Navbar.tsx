'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export function Navbar() {
  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 w-full z-50 px-6 py-4"
    >
      <div className="max-w-7xl mx-auto backdrop-blur-md bg-black/30 rounded-full border border-white/10">
        <div className="flex items-center justify-between px-6 py-3">
          <Link href="/" className="text-cyan-400 font-bold text-xl">
            SPACE
          </Link>
          <div className="flex gap-6">
            <NavLink href="#projects">Projects</NavLink>
            <NavLink href="#about">About</NavLink>
            <NavLink href="#contact">Contact</NavLink>
          </div>
        </div>
      </div>
    </motion.nav>
  )
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link 
      href={href}
      className="text-white/70 hover:text-cyan-400 transition-colors"
    >
      {children}
    </Link>
  )
} 