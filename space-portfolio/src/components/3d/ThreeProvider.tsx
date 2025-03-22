'use client'

import { ReactNode } from 'react'
import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'

interface ThreeProviderProps {
  children: ReactNode
}

export function ThreeProvider({ children }: ThreeProviderProps) {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 0, 5], fov: 75 }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
        stencil: false,
        depth: true,
      }}
    >
      <Suspense fallback={null}>
        {children}
      </Suspense>
    </Canvas>
  )
} 