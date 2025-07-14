"use client"

import { useRef, Suspense } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Box, Sphere, Environment } from "@react-three/drei"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowDown, Play, ExternalLink } from "lucide-react"
import type * as THREE from "three"

function StoreVisualization() {
  const groupRef = useRef<THREE.Group>(null)
  const spheresRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
    }
    if (spheresRef.current) {
      spheresRef.current.rotation.y = state.clock.elapsedTime * 0.2
    }
  })

  return (
    <group ref={groupRef}>
      {/* Store Layout */}
      <Box args={[8, 0.1, 6]} position={[0, -1, 0]}>
        <meshStandardMaterial color="#1a1a2e" />
      </Box>

      {/* Shelves */}
      {Array.from({ length: 6 }).map((_, i) => (
        <Box key={i} args={[1, 2, 0.2]} position={[(i % 3) * 2.5 - 2.5, 0, Math.floor(i / 3) * 2 - 1]}>
          <meshStandardMaterial color="#16213e" />
        </Box>
      ))}

      {/* AI Data Points */}
      <group ref={spheresRef}>
        {Array.from({ length: 12 }).map((_, i) => (
          <Sphere
            key={i}
            args={[0.05]}
            position={[
              Math.cos((i / 12) * Math.PI * 2) * 3,
              Math.sin((i / 12) * Math.PI * 4) * 0.5 + 1,
              Math.sin((i / 12) * Math.PI * 2) * 3,
            ]}
          >
            <meshStandardMaterial
              color={`hsl(${240 + i * 10}, 70%, 60%)`}
              emissive={`hsl(${240 + i * 10}, 70%, 30%)`}
            />
          </Sphere>
        ))}
      </group>

      {/* Central AI Core */}
      <Sphere args={[0.3]} position={[0, 1, 0]}>
        <meshStandardMaterial color="#8b5cf6" emissive="#4c1d95" emissiveIntensity={0.5} />
      </Sphere>

      <Environment preset="night" />
    </group>
  )
}

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* 3D Background */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 2, 8], fov: 60 }}>
          <Suspense fallback={null}>
            <ambientLight intensity={0.3} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <pointLight position={[-10, -10, -10]} intensity={0.5} color="#8b5cf6" />
            <StoreVisualization />
            <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
          </Suspense>
        </Canvas>
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <motion.h1
            className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            Axios
            <br />
            <span className="text-white">Smart Retail Analytics</span>
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7 }}
          >
            Axios revolutionizes retail with AI-powered analytics, smart product placement, and real-time insights 
            that transform your store into an intelligent, customer-centric experience.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.9 }}
          >
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-8 py-4 text-lg font-semibold"
            >
              <Play className="w-5 h-5 mr-2" />
              Watch Demo
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="bg-transparent border-2 border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white px-8 py-4 text-lg font-semibold"
            >
              <ExternalLink className="w-5 h-5 mr-2" />
              Try Live Demo
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.1 }}
          >
            {[
              { value: "40%", label: "Revenue Increase" },
              { value: "75%", label: "Efficiency Boost" },
              { value: "100%", label: "AI-Powered" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-400 text-lg">{stat.label}</div>
              </div>
            ))}
          </motion.div>

          <motion.div
            className="animate-bounce"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
          >
            <ArrowDown className="w-8 h-8 mx-auto text-purple-400" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
