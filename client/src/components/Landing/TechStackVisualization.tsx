'use client';

import { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, OrbitControls, Sphere, Box } from '@react-three/drei';
import * as THREE from 'three';

function TechNode({ 
  position, 
  color, 
  label, 
  scale = 1 
}: { 
  position: [number, number, number], 
  color: string, 
  label: string,
  scale?: number 
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const textRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.1;
    }
  });

  return (
    <group position={position}>
      <Sphere ref={meshRef} scale={scale} args={[0.8, 16, 16]}>
        <meshStandardMaterial color={color} metalness={0.6} roughness={0.3} />
      </Sphere>
      <Text
        ref={textRef}
        position={[0, -1.5, 0]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
        font="/fonts/inter-bold.woff"
      >
        {label}
      </Text>
    </group>
  );
}

function ConnectionLine({ start, end }: { start: [number, number, number], end: [number, number, number] }) {
  const points = [new THREE.Vector3(...start), new THREE.Vector3(...end)];
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  
  return (
    <primitive object={new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: "#8b5cf6", opacity: 0.4, transparent: true }))} />
  );
}

function TechStackGraph() {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  const techNodes = [
    { position: [0, 0, 0] as [number, number, number], color: "#000000", label: "Next.js", scale: 1.2 },
    { position: [-3, 1, -1] as [number, number, number], color: "#049EE4", label: "Three.js", scale: 1 },
    { position: [3, 1, -1] as [number, number, number], color: "#3178C6", label: "TypeScript", scale: 1 },
    { position: [-2, -2, 1] as [number, number, number], color: "#FF6B6B", label: "Zustand", scale: 0.8 },
    { position: [2, -2, 1] as [number, number, number], color: "#06B6D4", label: "Tailwind", scale: 0.8 },
    { position: [0, 2, 2] as [number, number, number], color: "#4285F4", label: "Gemini AI", scale: 1.1 }
  ];

  return (
    <group ref={groupRef}>
      {/* Connection Lines */}
      <ConnectionLine start={[0, 0, 0]} end={[-3, 1, -1]} />
      <ConnectionLine start={[0, 0, 0]} end={[3, 1, -1]} />
      <ConnectionLine start={[0, 0, 0]} end={[-2, -2, 1]} />
      <ConnectionLine start={[0, 0, 0]} end={[2, -2, 1]} />
      <ConnectionLine start={[0, 0, 0]} end={[0, 2, 2]} />
      
      {/* Tech Nodes */}
      {techNodes.map((node, index) => (
        <TechNode
          key={index}
          position={node.position}
          color={node.color}
          label={node.label}
          scale={node.scale}
        />
      ))}
    </group>
  );
}

function FloatingParticles() {
  const particlesRef = useRef<THREE.Points>(null);
  
  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.x = state.clock.elapsedTime * 0.02;
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.03;
    }
  });

  const particleCount = 50;
  const positions = new Float32Array(particleCount * 3);
  
  for (let i = 0; i < particleCount * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 15;
  }

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial color="#ffffff" size={0.03} sizeAttenuation transparent opacity={0.3} />
    </points>
  );
}

export default function TechStackVisualization() {
  return (
    <div className="w-full h-64 rounded-xl overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        style={{ background: 'transparent' }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <pointLight position={[-5, -5, 5]} intensity={0.4} color="#8b5cf6" />
        
        {/* Tech Stack Graph */}
        <TechStackGraph />
        
        {/* Floating Particles */}
        <FloatingParticles />
        
        {/* Controls */}
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          autoRotate
          autoRotateSpeed={1}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 4}
        />
      </Canvas>
    </div>
  );
}
