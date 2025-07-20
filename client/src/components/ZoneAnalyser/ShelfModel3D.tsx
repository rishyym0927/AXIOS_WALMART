'use client';

import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { Shelf } from '@/types';
import type { ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import { SHELF_CATEGORIES } from './ShelfForm';

interface ShelfModel3DProps {
  shelf: Shelf;
  isSelected: boolean;
  onSelect: () => void;
}

export default function ShelfModel3D({ shelf, isSelected, onSelect }: ShelfModel3DProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [lastClickTime, setLastClickTime] = useState(0);
  
  // Shelf height
  const shelfHeight = isSelected ? 1.5 : 1.0;
  
  // Removed automatic rotation when selected
  // useFrame(() => {
  //   if (meshRef.current && isSelected) {
  //     meshRef.current.rotation.y += 0.002;
  //   }
  // });

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    
 
    const currentTime = Date.now();

    setLastClickTime(currentTime);
    
    onSelect();
  };

  const getShelfColor = () => {
    if (shelf.isOverlapping) return '#ef4444'; // Red for overlapping
    if (isSelected) return '#3b82f6'; // Blue when selected
    
    // Use SHELF_CATEGORIES to maintain consistency with the rest of the UI
    const categoryObj = SHELF_CATEGORIES.find(cat => cat.value === shelf.category);
    return categoryObj?.color || '#6b7280';
  };

  const shelfColor = getShelfColor();
  const shelfOpacity = isSelected ? 0.9 : 0.8;

  return (
    <group 
      position={[shelf.x + shelf.width / 2, 0, shelf.y + shelf.height / 2]} 
      onClick={handleClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Shelf base */}
      <mesh 
        ref={meshRef} 
        position={[0, shelfHeight / 2, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[shelf.width, shelfHeight, shelf.height]} />
        <meshStandardMaterial 
          color={shelfColor} 
          transparent 
          opacity={shelfOpacity}
          emissive={isSelected ? '#ffffff' : undefined}
          emissiveIntensity={isSelected ? 0.1 : 0}
        />
      </mesh>
      
      {/* Shelf name */}
      <Text
        position={[0, shelfHeight + 0.3, 0]}
        fontSize={Math.min(shelf.width, shelf.height) * 0.4}
        color="#000000"
        anchorX="center"
        anchorY="middle"
        maxWidth={shelf.width * 0.9}
      >
        {shelf.name}
      </Text>
      
      {/* Category badge */}
      {isSelected && (
        <>
          <Text
            position={[0, shelfHeight + 0.6, 0]}
            fontSize={Math.min(shelf.width, shelf.height) * 0.25}
            color="#666666"
            anchorX="center"
            anchorY="middle"
          >
            {shelf.category}
          </Text>
          

        </>
      )}
      
      {/* Warning for overlapping shelves in 3D view */}
      {shelf.isOverlapping && (
        <mesh position={[0, shelfHeight + 0.8, 0]}>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.5} />
        </mesh>
      )}
      
      {/* Selection highlight */}
      {isSelected && (
        <mesh position={[0, 0.1, 0]}>
          <boxGeometry args={[shelf.width + 0.1, shelfHeight + 0.2, shelf.height + 0.1]} />
          <meshStandardMaterial color="#ffffff" wireframe opacity={0.3} transparent />
        </mesh>
      )}

      {/* Hover effect */}
      {hovered && !isSelected && (
        <mesh position={[0, 0.1, 0]}>
          <boxGeometry args={[shelf.width + 0.05, shelfHeight + 0.1, shelf.height + 0.05]} />
          <meshStandardMaterial color="#ffffff" wireframe opacity={0.2} transparent />
        </mesh>
      )}
    </group>
  );
}
