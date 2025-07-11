'use client';

import { useRef, useState } from 'react';
import { ThreeEvent } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { Shelf } from '@/types';
import * as THREE from 'three';
import { SHELF_CATEGORIES } from './ShelfForm';

interface ResizableShelfProps {
  shelf: Shelf;
  zoneWidth: number;
  zoneHeight: number;
  onUpdate: (id: string, updates: Partial<Shelf>) => void;
  onSelect: (shelf: Shelf) => void;
  isSelected: boolean;
}

export default function ResizableShelf({
  shelf,
  zoneWidth,
  zoneHeight,
  onUpdate,
  onSelect,
  isSelected
}: ResizableShelfProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [lastClickTime, setLastClickTime] = useState(0);

  const handlePointerDown = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    
    // Check for double-click to open product analysis modal
    const currentTime = Date.now();
    if (currentTime - lastClickTime < 300) {
      // Double click detected - select shelf to open product analysis
      onSelect(shelf);
      return;
    }
    setLastClickTime(currentTime);
    
    // Only start dragging, but don't immediately select the shelf
    // This prevents analysis panel from opening immediately
    setIsDragging(true);
    
    // Calculate offset from shelf center to click point
    const clickPoint = event.point;
    const shelfCenterX = shelf.x + shelf.width / 2;
    const shelfCenterZ = shelf.y + shelf.height / 2;
    setDragOffset({
      x: clickPoint.x - shelfCenterX,
      y: clickPoint.z - shelfCenterZ
    });
  };

  const handlePointerMove = (event: ThreeEvent<PointerEvent>) => {
    if (!isDragging) return;
    
    // Select shelf after dragging starts - this ensures the selection
    // only happens when user is actually moving the shelf
    if (isDragging) {
      onSelect(shelf);
    }
    
    const newCenterX = event.point.x - dragOffset.x;
    const newCenterZ = event.point.z - dragOffset.y;
    
    // Calculate new top-left position
    const newX = newCenterX - shelf.width / 2;
    const newY = newCenterZ - shelf.height / 2;
    
    // Constrain to zone boundaries
    const constrainedX = Math.max(0, Math.min(zoneWidth - shelf.width, newX));
    const constrainedY = Math.max(0, Math.min(zoneHeight - shelf.height, newY));
    
    onUpdate(shelf.id, { x: constrainedX, y: constrainedY });
  };

  const handlePointerUp = (event: ThreeEvent<PointerEvent>) => {
    // If we just clicked (without dragging), select the shelf
    if (isDragging && Math.abs(event.point.x - (shelf.x + shelf.width / 2)) < 0.1 &&
        Math.abs(event.point.z - (shelf.y + shelf.height / 2)) < 0.1) {
      onSelect(shelf);
    }
    setIsDragging(false);
  };

  const getShelfColor = () => {
    if (shelf.isOverlapping) return '#ef4444'; // Red for overlapping
    if (isSelected) return '#3b82f6'; // Blue when selected
    
    // Use SHELF_CATEGORIES to maintain consistency with the rest of the UI
    const categoryObj = SHELF_CATEGORIES.find(cat => cat.value === shelf.category);
    return categoryObj?.color || '#6b7280';
  };

  const getCursorStyle = () => {
    if (isDragging) return 'grabbing';
    if (isSelected) return 'grab';
    return 'pointer';
  };

  return (
    <group position={[shelf.x + shelf.width/2, 0.5, shelf.y + shelf.height/2]}>
      {/* Shelf base */}
      <mesh
        ref={meshRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerOut={() => {
          document.body.style.cursor = 'default';
          // If dragging and cursor leaves the shelf, end drag operation
          if (isDragging) setIsDragging(false);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = getCursorStyle();
        }}
        position={[0, 0, 0]}
      >
        <boxGeometry args={[shelf.width, 1, shelf.height]} />
        <meshLambertMaterial 
          color={getShelfColor()} 
          transparent 
          opacity={isSelected ? 0.9 : 0.7}
        />
      </mesh>
      
      {/* Selection outline */}
      {isSelected && (
        <lineSegments position={[0, 0.51, 0]}>
          <edgesGeometry args={[new THREE.BoxGeometry(shelf.width, 1, shelf.height)]} />
          <lineBasicMaterial color="#ffffff" linewidth={3} />
        </lineSegments>
      )}
      
      {/* Overlap warning outline */}
      {shelf.isOverlapping && (
        <lineSegments position={[0, 0.52, 0]}>
          <edgesGeometry args={[new THREE.BoxGeometry(shelf.width + 0.1, 1, shelf.height + 0.1)]} />
          <lineBasicMaterial color="#ef4444" linewidth={2} />
        </lineSegments>
      )}
      
      {/* Shelf label */}
      <Text
        position={[0, 1.2, 0]}
        rotation={[-Math.PI/2, 0, 0]}
        fontSize={Math.min(shelf.width, shelf.height) * 0.3}
        color={isSelected ? "#ffffff" : "#000000"}
        anchorX="center"
        anchorY="middle"
        maxWidth={shelf.width * 0.9}
        textAlign="center"
      >
        {shelf.name}
      </Text>
      
      {/* Category badge */}
      {isSelected && (
        <>
          <Text
            position={[0, 1.6, 0]}
            rotation={[-Math.PI/2, 0, 0]}
            fontSize={Math.min(shelf.width, shelf.height) * 0.2}
            color="#666666"
            anchorX="center"
            anchorY="middle"
            textAlign="center"
          >
            {shelf.category}
          </Text>
          
          {/* Double-click hint */}
          <Text
            position={[0, 2.0, 0]}
            rotation={[-Math.PI/2, 0, 0]}
            fontSize={Math.min(shelf.width, shelf.height) * 0.15}
            color="#10b981"
            anchorX="center"
            anchorY="middle"
            textAlign="center"
          >
            Double-click for products
          </Text>
        </>
      )}
      
      {/* Overlap warning icon */}
      {shelf.isOverlapping && (
        <Text
          position={[shelf.width/2 - 0.3, 1.8, shelf.height/2 - 0.3]}
          rotation={[-Math.PI/2, 0, 0]}
          fontSize={0.5}
          color="#ef4444"
          anchorX="center"
          anchorY="middle"
        >
          ⚠
        </Text>
      )}
    </group>
  );
}
