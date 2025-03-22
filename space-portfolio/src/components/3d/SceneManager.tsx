'use client'

import { useRef } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { 
  OrbitControls, 
  PerspectiveCamera,
  AccumulativeShadows,
  RandomizedLight,
  Environment,
  Float,
  useScroll,
  useTexture,
  useVideoTexture,
  Effects,
  ScrollControls
} from '@react-three/drei'
import { EffectComposer, Bloom, ChromaticAberration, DepthOfField, Noise } from '@react-three/postprocessing'
import { SpaceEnvironment } from './SpaceEnvironment'
import { Astronaut } from './Astronaut'
import * as THREE from 'three'

function Scene() {
  const { camera } = useThree()
  const scroll = useScroll()
  const group = useRef<THREE.Group>(null)
  const cameraTarget = useRef(new THREE.Vector3(0, 0, 0))

  // Dynamic camera movement
  useFrame((state) => {
    const scrollOffset = scroll?.offset ?? 0
    const t = state.clock.getElapsedTime()

    // Smooth camera movement based on scroll
    const targetY = Math.sin(scrollOffset * Math.PI * 2) * 2
    const targetZ = 5 + Math.sin(scrollOffset * Math.PI) * 2
    const targetX = Math.sin(scrollOffset * Math.PI) * 1

    // Smooth camera position interpolation
    camera.position.x += (targetX - camera.position.x) * 0.05
    camera.position.y += (targetY - camera.position.y) * 0.05
    camera.position.z += (targetZ - camera.position.z) * 0.05

    // Add subtle camera shake
    camera.position.x += Math.sin(t * 10) * 0.01
    camera.position.y += Math.cos(t * 10) * 0.01
    camera.position.z += Math.sin(t * 10) * 0.01

    // Update camera target
    cameraTarget.current.x = Math.sin(t * 0.5) * 0.2
    cameraTarget.current.y = Math.cos(t * 0.5) * 0.2
    camera.lookAt(cameraTarget.current)

    if (group.current) {
      // Rotate the entire scene
      group.current.rotation.y = Math.sin(t * 0.1) * 0.1
      group.current.rotation.x = Math.cos(t * 0.1) * 0.05
    }
  })

  return (
    <group ref={group}>
      {/* Environment */}
      <SpaceEnvironment />

      {/* Astronaut */}
      <Astronaut />

      {/* Dynamic lighting */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />

      {/* Shadows */}
      <AccumulativeShadows
        temporal
        frames={100}
        alphaTest={0.85}
        opacity={0.8}
        scale={10}
        position={[0, -1, 0]}
      >
        <RandomizedLight
          amount={8}
          radius={4}
          intensity={0.5}
          ambient={0.25}
          position={[5, 5, -10]}
          bias={0.001}
        />
      </AccumulativeShadows>

      {/* Environment map */}
      <Environment preset="night" />

      {/* Camera controls */}
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 2}
        target={[0, 0, 0]}
        enableDamping
        dampingFactor={0.05}
      />

      {/* Post-processing effects */}
      <EffectComposer>
        <Bloom
          intensity={1.5}
          luminanceThreshold={0.2}
          luminanceSmoothing={0.9}
        />
        <ChromaticAberration
          offset={new THREE.Vector2(0.002, 0.002)}
          radialModulation={true}
          modulationOffset={0.5}
        />
        <DepthOfField
          focusDistance={0}
          focalLength={0.02}
          bokehScale={2}
          height={480}
        />
        <Noise opacity={0.02} />
      </EffectComposer>
    </group>
  )
}

export function SceneManager() {
  return (
    <ScrollControls pages={3} damping={0.1}>
      <Scene />
    </ScrollControls>
  )
} 