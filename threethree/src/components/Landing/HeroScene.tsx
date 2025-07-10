'use client';

import { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Box, Text, Float, Plane, Cylinder } from '@react-three/drei';
import * as THREE from 'three';

function AnimatedStoreLayout() {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
    }
  });

  return (
    <group ref={groupRef} position={[0, -1, 0]}>
      {/* Store Floor */}
      <Plane 
        rotation={[-Math.PI / 2, 0, 0]} 
        args={[12, 8]} 
        position={[0, 0, 0]}
      >
        <meshStandardMaterial 
          color="#1e293b" 
          transparent 
          opacity={0.6}
          roughness={0.3}
          metalness={0.7}
        />
      </Plane>
      
      {/* Zone Blocks with different heights and colors */}
      <Float speed={1} rotationIntensity={0.2} floatIntensity={0.5}>
        <Box position={[-3, 0.5, -1]} scale={[2.5, 1, 1.8]} args={[1, 1, 1]}>
          <meshStandardMaterial 
            color="#3b82f6" 
            transparent 
            opacity={0.8}
            roughness={0.4}
            metalness={0.6}
          />
        </Box>
      </Float>
      
      <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.3}>
        <Box position={[3, 0.8, -1]} scale={[2.5, 1.6, 1.8]} args={[1, 1, 1]}>
          <meshStandardMaterial 
            color="#10b981" 
            transparent 
            opacity={0.8}
            roughness={0.4}
            metalness={0.6}
          />
        </Box>
      </Float>
      
      <Float speed={0.8} rotationIntensity={0.1} floatIntensity={0.4}>
        <Box position={[0, 0.3, 2]} scale={[3, 0.6, 1.5]} args={[1, 1, 1]}>
          <meshStandardMaterial 
            color="#f59e0b" 
            transparent 
            opacity={0.8}
            roughness={0.4}
            metalness={0.6}
          />
        </Box>
      </Float>

      {/* Additional smaller zones */}
      <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.2}>
        <Cylinder position={[-1.5, 0.4, 0.5]} scale={[0.8, 0.8, 0.8]} args={[0.8, 0.8, 0.8, 8]}>
          <meshStandardMaterial 
            color="#8b5cf6" 
            transparent 
            opacity={0.7}
            roughness={0.3}
            metalness={0.8}
          />
        </Cylinder>
      </Float>

      <Float speed={1.1} rotationIntensity={0.2} floatIntensity={0.6}>
        <Cylinder position={[1.5, 0.4, 0.5]} scale={[0.8, 0.8, 0.8]} args={[0.8, 0.8, 0.8, 6]}>
          <meshStandardMaterial 
            color="#ec4899" 
            transparent 
            opacity={0.7}
            roughness={0.3}
            metalness={0.8}
          />
        </Cylinder>
      </Float>
    </group>
  );
}

function DataVisualizationElements() {
  const pointsRef = useRef<THREE.Points>(null);
  
  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.1;
      pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });

  const particleCount = 150;
  const positions = new Float32Array(particleCount * 3);
  
  for (let i = 0; i < particleCount; i++) {
    const radius = 8 + Math.random() * 4;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI;
    
    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.cos(phi);
    positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
  }

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial 
        color="#60a5fa" 
        size={0.05} 
        sizeAttenuation 
        transparent 
        opacity={0.6}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function FloatingIcons() {
  const icons = [
    { position: [-6, 3, -2], color: "#3b82f6", scale: 0.6 },
    { position: [6, 2, -3], color: "#10b981", scale: 0.8 },
    { position: [-4, -2, 3], color: "#f59e0b", scale: 0.7 },
    { position: [5, -1, 2], color: "#8b5cf6", scale: 0.5 },
    { position: [0, 4, -4], color: "#ec4899", scale: 0.9 },
  ];

  return (
    <>
      {icons.map((icon, index) => (
        <Float
          key={index}
          speed={1 + Math.random()}
          rotationIntensity={0.8}
          floatIntensity={0.5}
        >
          <Sphere position={icon.position as [number, number, number]} scale={icon.scale} args={[0.3, 16, 16]}>
            <meshStandardMaterial 
              color={icon.color} 
              transparent 
              opacity={0.8}
              roughness={0.2}
              metalness={0.9}
              emissive={icon.color}
              emissiveIntensity={0.2}
            />
          </Sphere>
        </Float>
      ))}
    </>
  );
}

function ConnectedLines() {
  const lineRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (lineRef.current) {
      lineRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  const connections = [
    { start: [-3, 0, -1], end: [3, 0, -1] },
    { start: [0, 0, 2], end: [-3, 0, -1] },
    { start: [0, 0, 2], end: [3, 0, -1] },
    { start: [-1.5, 0, 0.5], end: [1.5, 0, 0.5] },
  ];

  return (
    <group ref={lineRef}>
      {connections.map((connection, index) => {
        const start = new THREE.Vector3(...connection.start);
        const end = new THREE.Vector3(...connection.end);
        const points = [start, end];
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        
        return (
          <primitive 
            key={index}
            object={new THREE.Line(
              geometry, 
              new THREE.LineBasicMaterial({ 
                color: "#60a5fa", 
                opacity: 0.4, 
                transparent: true,
                linewidth: 2
              })
            )} 
          />
        );
      })}
    </group>
  );
}

export default function HeroScene() {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 8, 12], fov: 50 }}
        style={{ background: 'transparent' }}
        gl={{ antialias: true, alpha: true }}
      >
        {/* Enhanced Lighting Setup */}
        <ambientLight intensity={0.3} />
        <directionalLight 
          position={[10, 10, 5]} 
          intensity={1.2} 
          color="#ffffff"
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[-10, -10, -10]} intensity={0.6} color="#3b82f6" />
        <pointLight position={[10, 10, 10]} intensity={0.6} color="#8b5cf6" />
        <pointLight position={[0, -5, 5]} intensity={0.4} color="#10b981" />
        
        {/* Scene Elements */}
        <AnimatedStoreLayout />
        <DataVisualizationElements />
        <FloatingIcons />
        <ConnectedLines />
        
        {/* Enhanced Controls */}
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.3}
          maxPolarAngle={Math.PI / 2.2}
          minPolarAngle={Math.PI / 6}
          enableDamping
          dampingFactor={0.05}
        />
        
        {/* Fog for depth */}
        <fog attach="fog" args={['#000033', 15, 25]} />
      </Canvas>
    </div>
  );
}
