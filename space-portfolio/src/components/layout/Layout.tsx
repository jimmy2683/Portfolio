'use client'

import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Navbar } from '../ui/Navbar'
import { HeroSection } from '../ui/HeroSection'
import { ProjectsSection } from '../ui/ProjectsSection'
import { ContactSection } from '../ui/ContactSection'
import { SceneManager } from '../3d/SceneManager'
import { Loading } from '../ui/Loading'

export function Layout() {
  return (
    <div className="relative min-h-screen bg-black text-white">
      {/* 3D Scene */}
      <div className="fixed inset-0 z-0">
        <Suspense fallback={<Loading />}>
          <Canvas
            camera={{ 
              position: [0, 0, 5], 
              fov: 75,
              near: 0.1,
              far: 1000
            }}
            gl={{ 
              antialias: true,
              alpha: true,
              powerPreference: "high-performance"
            }}
          >
            <SceneManager />
          </Canvas>
        </Suspense>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <Navbar />
        <main>
          <HeroSection />
          <ProjectsSection />
          <ContactSection />
        </main>
      </div>

      {/* Background gradient overlay */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/50" />
      </div>
    </div>
  )
} 