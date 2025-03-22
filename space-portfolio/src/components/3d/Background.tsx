'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Stars, useTexture, useScroll } from '@react-three/drei'
import * as THREE from 'three'

const nebulaColors = ['#1a0f2e', '#2a1b3d', '#3a2b4d']
const particlesCount = 2000

// Create initial particle data outside component
const createParticleData = () => {
  const posArray = new Float32Array(particlesCount * 3)
  const colorArray = new Float32Array(particlesCount * 3)
  const velocityArray = new Float32Array(particlesCount * 3)
  
  for(let i = 0; i < particlesCount * 3; i += 3) {
    posArray[i] = (Math.random() - 0.5) * 10
    posArray[i + 1] = (Math.random() - 0.5) * 10
    posArray[i + 2] = (Math.random() - 0.5) * 10
    
    velocityArray[i] = (Math.random() - 0.5) * 0.01
    velocityArray[i + 1] = (Math.random() - 0.5) * 0.01
    velocityArray[i + 2] = (Math.random() - 0.5) * 0.01
    
    const color = new THREE.Color(nebulaColors[Math.floor(Math.random() * nebulaColors.length)])
    colorArray[i] = color.r
    colorArray[i + 1] = color.g
    colorArray[i + 2] = color.b
  }
  
  return { posArray, colorArray, velocityArray }
}

export function Background() {
  const nebulaRef = useRef<THREE.Mesh>(null)
  const particlesRef = useRef<THREE.Points>(null)
  const scroll = useScroll()
  
  // Use useMemo for static particle data
  const particleData = useMemo(() => createParticleData(), [])
  const particlesGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(particleData.posArray, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(particleData.colorArray, 3))
    return geometry
  }, [particleData])
  
  useFrame((state) => {
    const scrollOffset = scroll.offset
    const positions = particlesGeometry.attributes.position.array as Float32Array
    
    if (nebulaRef.current) {
      nebulaRef.current.rotation.y += 0.0005
      nebulaRef.current.rotation.x += 0.0002
      nebulaRef.current.position.y = Math.sin(scrollOffset * Math.PI * 2) * 0.5
    }
    
    if (particlesRef.current) {
      // Update particle positions
      for(let i = 0; i < positions.length; i += 3) {
        positions[i] += particleData.velocityArray[i]
        positions[i + 1] += particleData.velocityArray[i + 1]
        positions[i + 2] += particleData.velocityArray[i + 2]
        
        // Wrap particles around bounds
        if (Math.abs(positions[i]) > 5) particleData.velocityArray[i] *= -1
        if (Math.abs(positions[i + 1]) > 5) particleData.velocityArray[i + 1] *= -1
        if (Math.abs(positions[i + 2]) > 5) particleData.velocityArray[i + 2] *= -1
      }
      
      particlesGeometry.attributes.position.needsUpdate = true
      particlesRef.current.rotation.y += 0.0002
      particlesRef.current.rotation.x += 0.0001
    }
  })

  return (
    <>
      {/* Nebula background */}
      <mesh ref={nebulaRef} position={[0, 0, -5]}>
        <planeGeometry args={[20, 20]} />
        <meshBasicMaterial 
          color="#1a0f2e"
          transparent
          opacity={0.8}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Additional nebula layers */}
      <mesh position={[0, 0, -4]}>
        <planeGeometry args={[15, 15]} />
        <meshBasicMaterial 
          color="#2a1b3d"
          transparent
          opacity={0.6}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh position={[0, 0, -3]}>
        <planeGeometry args={[10, 10]} />
        <meshBasicMaterial 
          color="#3a2b4d"
          transparent
          opacity={0.4}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Stars with parallax effect */}
      <Stars 
        radius={100}
        depth={50}
        count={5000}
        factor={4}
        saturation={0}
        fade
        speed={1}
      />

      {/* Floating particles */}
      <points ref={particlesRef} geometry={particlesGeometry}>
        <pointsMaterial
          size={0.02}
          vertexColors
          transparent
          opacity={0.6}
          sizeAttenuation
        />
      </points>

      {/* Ambient fog with scroll-based density */}
      <fog attach="fog" args={['#000010', 5, 20]} />

      {/* Add some distant galaxies */}
      {Array.from({ length: 3 }).map((_, i) => (
        <mesh
          key={i}
          position={[
            (Math.random() - 0.5) * 15,
            (Math.random() - 0.5) * 15,
            -10 - Math.random() * 5,
          ]}
        >
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshBasicMaterial
            color={nebulaColors[i]}
            transparent
            opacity={0.3}
          />
        </mesh>
      ))}
    </>
  )
} 