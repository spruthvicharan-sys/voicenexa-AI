import React, { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sphere, MeshDistortMaterial, Environment, Float } from '@react-three/drei'
import * as THREE from 'three'

// State-based orb configs
const orbConfigs = {
  idle:      { distort: 0.25, speed: 1.2, color: '#3b82f6', emissive: '#1d4ed8', emissiveIntensity: 0.4 },
  listening: { distort: 0.55, speed: 2.5, color: '#2563eb', emissive: '#3b82f6', emissiveIntensity: 0.8 },
  thinking:  { distort: 0.38, speed: 4.0, color: '#7c3aed', emissive: '#4f46e5', emissiveIntensity: 0.6 },
  speaking:  { distort: 0.65, speed: 3.0, color: '#0ea5e9', emissive: '#38bdf8', emissiveIntensity: 0.7 },
}

function GlassOrb({ voiceState = 'idle' }) {
  const meshRef = useRef()
  const ringRef = useRef()
  const outerRef = useRef()

  const cfg = orbConfigs[voiceState] || orbConfigs.idle

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.18
      meshRef.current.rotation.z = Math.sin(t * 0.3) * 0.05
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = t * (voiceState === 'thinking' ? 1.2 : 0.3)
      ringRef.current.rotation.x = Math.sin(t * 0.5) * 0.3
      ringRef.current.material.opacity = 0.3 + Math.sin(t * 2) * 0.15
    }
    if (outerRef.current) {
      const scale = 1.0 + Math.sin(t * (voiceState === 'speaking' ? 4 : 1.5)) * 0.04
      outerRef.current.scale.setScalar(scale)
      outerRef.current.material.opacity = 0.08 + Math.sin(t * 1.2) * 0.04
    }
  })

  return (
    <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.4}>
      {/* Outer glow shell */}
      <mesh ref={outerRef}>
        <sphereGeometry args={[1.55, 32, 32]} />
        <meshStandardMaterial
          color={cfg.color}
          transparent
          opacity={0.08}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Main orb */}
      <mesh ref={meshRef}>
        <Sphere args={[1.2, 128, 128]}>
          <MeshDistortMaterial
            color={cfg.color}
            emissive={cfg.emissive}
            emissiveIntensity={cfg.emissiveIntensity}
            metalness={0.1}
            roughness={0.05}
            distort={cfg.distort}
            speed={cfg.speed}
            transparent
            opacity={0.88}
          />
        </Sphere>
      </mesh>

      {/* Orbital ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 2.8, 0, 0]}>
        <torusGeometry args={[1.7, 0.022, 16, 100]} />
        <meshStandardMaterial
          color="#93c5fd"
          emissive="#3b82f6"
          emissiveIntensity={0.5}
          transparent
          opacity={0.35}
        />
      </mesh>

      {/* Inner glow core */}
      <mesh>
        <sphereGeometry args={[0.65, 32, 32]} />
        <meshStandardMaterial
          color={cfg.emissive}
          emissive={cfg.emissive}
          emissiveIntensity={1.2}
          transparent
          opacity={0.5}
        />
      </mesh>
    </Float>
  )
}

export default function VoiceOrb({ voiceState = 'idle', size = 420 }) {
  return (
    <div style={{ width: size, height: size }} className="relative">
      {/* Glow backdrop */}
      <div
        className="absolute inset-0 rounded-full blur-3xl opacity-30 transition-all duration-700"
        style={{
          background: voiceState === 'thinking'
            ? 'radial-gradient(circle, #7c3aed 0%, transparent 70%)'
            : voiceState === 'speaking'
            ? 'radial-gradient(circle, #0ea5e9 0%, transparent 70%)'
            : 'radial-gradient(circle, #3b82f6 0%, transparent 70%)',
          transform: 'scale(1.1)',
        }}
      />
      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 40 }}
        style={{ width: '100%', height: '100%' }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.6} />
        <pointLight position={[4, 4, 4]} intensity={1.5} color="#3b82f6" />
        <pointLight position={[-4, -2, -4]} intensity={0.8} color="#60a5fa" />
        <pointLight position={[0, 4, -2]} intensity={0.5} color="#ffffff" />
        <GlassOrb voiceState={voiceState} />
        <Environment preset="city" />
      </Canvas>
    </div>
  )
}
