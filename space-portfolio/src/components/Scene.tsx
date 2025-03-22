'use client'

import { Canvas } from '@react-three/fiber'
import { Preload, OrbitControls, ScrollControls } from '@react-three/drei'
import { SpaceEnvironment } from './3d/SpaceEnvironment'
import { Astronaut } from './3d/Astronaut'
import { Navbar } from '@/components/Navbar'
import { HeroText } from '@/components/HeroText'
import { ErrorBoundary } from './ErrorBoundary'

export default function Scene() {
  return (
    <>
      <Navbar />
      <ErrorBoundary>
        <div className="w-full h-screen">
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
            <color attach="background" args={['#000010']} />
            
            <ScrollControls pages={3} damping={0.25}>
              <SpaceEnvironment />
              <Astronaut />
            </ScrollControls>
            
            <OrbitControls 
              enableZoom={false}
              enablePan={false}
              minPolarAngle={Math.PI / 3}
              maxPolarAngle={Math.PI / 2}
              target={[0, 0, 0]}
            />
            
            <Preload all />
          </Canvas>
        </div>
      </ErrorBoundary>
      <HeroText />
    </>
  )
} 