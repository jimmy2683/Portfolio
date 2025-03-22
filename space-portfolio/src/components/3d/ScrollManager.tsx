'use client'

import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useScroll } from '@react-three/drei'
import * as THREE from 'three'

export function ScrollManager() {
  const { camera } = useThree()
  const scroll = useScroll()
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    const scrollOffset = scroll.offset
    const scrollRange = scroll.range(0, 1)

    if (groupRef.current) {
      // Rotate the entire scene based on scroll
      groupRef.current.rotation.y = scrollOffset * Math.PI * 2
      
      // Move camera based on scroll
      camera.position.y = scrollRange * 5
      camera.position.z = 5 + scrollRange * 3
      
      // Add some parallax effect
      groupRef.current.position.x = Math.sin(scrollOffset * Math.PI * 2) * 0.5
      groupRef.current.position.y = Math.cos(scrollOffset * Math.PI * 2) * 0.5
    }
  })

  return (
    <group ref={groupRef}>
      {/* Add floating space debris */}
      {Array.from({ length: 20 }).map((_, i) => (
        <mesh
          key={i}
          position={[
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10,
          ]}
          rotation={[Math.random() * Math.PI, Math.random() * Math.PI, 0]}
        >
          <boxGeometry args={[0.1, 0.1, 0.1]} />
          <meshStandardMaterial
            color="#ffffff"
            metalness={0.8}
            roughness={0.2}
            transparent
            opacity={0.5}
          />
        </mesh>
      ))}
    </group>
  )
} 