'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, useScroll } from '@react-three/drei'
import * as THREE from 'three'

export function Astronaut() {
  const group = useRef<THREE.Group>(null)
  const scroll = useScroll()

  // Create glow effect
  const glowMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        color: { value: new THREE.Color(0x00ffff) },
        time: { value: 0 },
        scroll: { value: 0 },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vPosition;
        void main() {
          vUv = uv;
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 color;
        uniform float time;
        uniform float scroll;
        varying vec2 vUv;
        varying vec3 vPosition;
        void main() {
          float glow = sin(time * 2.0) * 0.5 + 0.5;
          float dist = length(vUv - vec2(0.5));
          float scrollEffect = sin(vPosition.y * 10.0 + time * 2.0 + scroll * 10.0) * 0.5 + 0.5;
          float alpha = smoothstep(0.5, 0.0, dist) * glow * scrollEffect * 0.5;
          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
    })
  }, [])

  useFrame((state) => {
    if (group.current) {
      const scrollOffset = scroll?.offset ?? 0
      const t = state.clock.elapsedTime

      // Floating animation with scroll influence
      group.current.position.y = Math.sin(t) * 0.1 + Math.sin(scrollOffset * Math.PI * 2) * 0.2
      group.current.rotation.y = Math.sin(t * 0.5) * 0.1 + scrollOffset * Math.PI * 2
      group.current.rotation.x = Math.sin(t * 0.3) * 0.05

      // Update glow effect
      glowMaterial.uniforms.time.value = t
      glowMaterial.uniforms.scroll.value = scrollOffset
    }
  })

  return (
    <Float
      speed={1.5}
      rotationIntensity={0.5}
      floatIntensity={0.5}
    >
      <group ref={group} dispose={null}>
        {/* Helmet */}
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshStandardMaterial
            color="#ffffff"
            metalness={0.8}
            roughness={0.2}
            envMapIntensity={1}
          />
        </mesh>

        {/* Visor */}
        <mesh position={[0, 0, 0.25]}>
          <sphereGeometry args={[0.4, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
          <meshPhysicalMaterial
            color="#4d4dff"
            metalness={0.9}
            roughness={0.1}
            transparent
            opacity={0.6}
            envMapIntensity={1}
          />
        </mesh>

        {/* Body */}
        <mesh position={[0, -0.8, 0]} castShadow receiveShadow>
          <capsuleGeometry args={[0.3, 0.5, 8, 16]} />
          <meshStandardMaterial
            color="#ffffff"
            metalness={0.8}
            roughness={0.2}
            envMapIntensity={1}
          />
        </mesh>
        
        {/* Backpack */}
        <mesh position={[0, -0.8, -0.3]} castShadow>
          <boxGeometry args={[0.4, 0.4, 0.2]} />
          <meshStandardMaterial
            color="#cccccc"
            metalness={0.8}
            roughness={0.3}
          />
        </mesh>
        
        {/* Arms */}
        {[-1, 1].map((side) => (
          <group key={side} position={[side * 0.4, -0.5, 0]}>
            <mesh castShadow>
              <capsuleGeometry args={[0.08, 0.3, 8, 16]} />
              <meshStandardMaterial
                color="#ffffff"
                metalness={0.8}
                roughness={0.2}
              />
            </mesh>
          </group>
        ))}
        
        {/* Legs */}
        {[-1, 1].map((side) => (
          <group key={side} position={[side * 0.2, -1.3, 0]}>
            <mesh castShadow>
              <capsuleGeometry args={[0.08, 0.4, 8, 16]} />
              <meshStandardMaterial
                color="#ffffff"
                metalness={0.8}
                roughness={0.2}
              />
            </mesh>
          </group>
        ))}

        {/* Glow effect */}
        <mesh position={[0, 0, 0.1]}>
          <planeGeometry args={[2, 2]} />
          <primitive object={glowMaterial} attach="material" />
        </mesh>

        {/* Ambient light */}
        <ambientLight intensity={0.5} />

        {/* Point lights */}
        <pointLight
          position={[2, 2, 2]}
          intensity={1}
          color={0x00ffff}
          distance={5}
          decay={1}
        />
        <pointLight
          position={[-2, -2, 2]}
          intensity={0.5}
          color={0xff00ff}
          distance={5}
          decay={1}
        />

        {/* Spot light */}
        <spotLight
          position={[0, 5, 0]}
          angle={0.5}
          penumbra={0.5}
          intensity={1}
          color={0xffffff}
          distance={10}
          decay={1}
        />
      </group>
    </Float>
  )
} 