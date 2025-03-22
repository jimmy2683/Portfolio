'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Box, Sphere } from '@react-three/drei'
import * as THREE from 'three'

export function Astronaut() {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.005
    }
  })

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Helmet */}
      <Sphere args={[0.5, 32, 32]}>
        <meshStandardMaterial color="#ffffff" metalness={0.8} roughness={0.2} />
      </Sphere>
      
      {/* Body */}
      <Box args={[0.4, 0.6, 0.4]} position={[0, -0.8, 0]}>
        <meshStandardMaterial color="#ffffff" metalness={0.8} roughness={0.2} />
      </Box>
    </group>
  )
} 