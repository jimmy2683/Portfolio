'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Stars, useTexture, useVideoTexture } from '@react-three/drei'
import * as THREE from 'three'

export function SpaceEnvironment() {
  const nebulaRef = useRef<THREE.Mesh>(null)
  const starsRef = useRef<THREE.Points>(null)
  
  // Create dynamic nebula texture
  const nebulaTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 512
    const ctx = canvas.getContext('2d')!
    
    // Create gradient
    const gradient = ctx.createRadialGradient(256, 256, 0, 256, 256, 256)
    gradient.addColorStop(0, 'rgba(0, 255, 255, 0.2)')
    gradient.addColorStop(0.5, 'rgba(157, 78, 221, 0.1)')
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
    
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 512, 512)
    
    // Add noise
    const imageData = ctx.getImageData(0, 0, 512, 512)
    for (let i = 0; i < imageData.data.length; i += 4) {
      const noise = Math.random() * 0.1
      imageData.data[i] += noise * 255
      imageData.data[i + 1] += noise * 255
      imageData.data[i + 2] += noise * 255
    }
    ctx.putImageData(imageData, 0, 0)
    
    const texture = new THREE.CanvasTexture(canvas)
    texture.needsUpdate = true
    return texture
  }, [])

  // Create star field
  const starGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(10000 * 3)
    const colors = new Float32Array(10000 * 3)
    
    for (let i = 0; i < 10000; i++) {
      const i3 = i * 3
      positions[i3] = (Math.random() - 0.5) * 2000
      positions[i3 + 1] = (Math.random() - 0.5) * 2000
      positions[i3 + 2] = (Math.random() - 0.5) * 2000
      
      const color = new THREE.Color()
      color.setHSL(Math.random(), 0.2, 0.5 + Math.random() * 0.5)
      colors[i3] = color.r
      colors[i3 + 1] = color.g
      colors[i3 + 2] = color.b
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    return geometry
  }, [])

  // Create star material
  const starMaterial = useMemo(() => {
    return new THREE.PointsMaterial({
      size: 0.5,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true,
    })
  }, [])

  useFrame((state) => {
    if (nebulaRef.current) {
      nebulaRef.current.rotation.x += 0.0002
      nebulaRef.current.rotation.y += 0.0001
    }
    
    if (starsRef.current) {
      starsRef.current.rotation.x += 0.0001
      starsRef.current.rotation.y += 0.00005
    }
  })

  return (
    <>
      {/* Nebula Background */}
      <mesh ref={nebulaRef} position={[0, 0, -1000]}>
        <planeGeometry args={[2000, 2000]} />
        <meshBasicMaterial map={nebulaTexture} transparent opacity={0.5} />
      </mesh>

      {/* Star Field */}
      <points ref={starsRef} geometry={starGeometry} material={starMaterial} />

      {/* Additional Stars */}
      <Stars
        radius={1000}
        depth={50}
        count={5000}
        factor={4}
        saturation={0}
        fade
        speed={1}
      />

      {/* Ambient Fog */}
      <fog attach="fog" args={['#000000', 500, 2000]} />
    </>
  )
} 