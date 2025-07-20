import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { useRouter } from 'next/navigation';
import { Zone } from '@/types';
import type { ThreeEvent } from '@react-three/fiber';


interface ZoneModel3DProps {
  zone: Zone;
  isSelected: boolean;
  onSelect: () => void;
}

export default function ZoneModel3D({ zone, isSelected, onSelect }: ZoneModel3DProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const router = useRouter();
  
  // Wall height
  const wallHeight = 2.5;
  
  // Removed automatic rotation when selected
  // useFrame(() => {
  //   if (meshRef.current && isSelected) {
  //     meshRef.current.rotation.y += 0.003;
  //   }
  // });

  // Convert color hex to Three.js color
  const color = zone.color;
  const highlightColor = hovered || isSelected ? '#ffffff' : color;


  const handleClick = (e: ThreeEvent<MouseEvent>) => {
  
  };

  // Determine zone appearance based on overlap status
  const zoneColor = zone.isOverlapping ? '#ef4444' : zone.color;
  const zoneOpacity = isSelected ? 0.9 : 0.8;
  const zoneHeight = isSelected ? 3 : 2;

  return (
    <group 
      position={[zone.x + zone.width / 2, 0, zone.y + zone.height / 2]} 
      onClick={handleClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Zone box */}
      <mesh 
        ref={meshRef} 
        position={[0, zoneHeight / 2, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[zone.width, zoneHeight, zone.height]} />
        <meshStandardMaterial 
          color={zoneColor} 
          transparent 
          opacity={zoneOpacity}
          emissive={isSelected ? '#ffffff' : undefined}
          emissiveIntensity={isSelected ? 0.2 : 0}
        />
      </mesh>
      
      {/* Zone name */}
      <Text
        position={[0, zoneHeight + 0.5, 0]}
        fontSize={0.8}
        color="#000000"
        anchorX="center"
        anchorY="middle"
        maxWidth={zone.width * 0.8}
      >
        {zone.name}
      </Text>
      
      {/* Warning for overlapping zones in 3D view */}
      {zone.isOverlapping && (
        <mesh position={[0, zoneHeight + 1.2, 0]}>
          <sphereGeometry args={[0.4, 16, 16]} />
          <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.5} />
        </mesh>
      )}
      
      {/* Selection highlight */}
      {isSelected && (
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[zone.width + 0.2, wallHeight + 0.2, zone.height + 0.2]} />
          <meshStandardMaterial color={highlightColor} wireframe opacity={0.3} transparent />
        </mesh>
      )}
    </group>
  );
}
