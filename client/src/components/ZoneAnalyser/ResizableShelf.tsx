'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { ThreeEvent, useFrame, useThree } from '@react-three/fiber';
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
  const [dragStart, setDragStart] = useState<THREE.Vector3 | null>(null);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const [lastClickTime, setLastClickTime] = useState(0);
  const { raycaster, camera, mouse } = useThree();

  // Track pointer movement even when not directly over the object
  useFrame(() => {
    if (isDragging && dragStart && meshRef.current) {
      // Cast ray from current mouse position
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects([], true);
      
      // Find ground plane intersection point
      const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
      const ray = new THREE.Ray(raycaster.ray.origin, raycaster.ray.direction);
      const target = new THREE.Vector3();
      
      if (ray.intersectPlane(groundPlane, target)) {
        // Calculate movement delta from drag start
        const dx = target.x - dragStart.x;
        const dz = target.z - dragStart.z;
        
        // Calculate new shelf position
        let newX = startPosition.x + dx;
        let newY = startPosition.y + dz;
        
        // Constrain to zone boundaries
        newX = Math.max(0, Math.min(zoneWidth - shelf.width, newX));
        newY = Math.max(0, Math.min(zoneHeight - shelf.height, newY));
        
        // Only update if position actually changed
        if (newX !== shelf.x || newY !== shelf.y) {
          onUpdate(shelf.id, { x: newX, y: newY });
        }
      }
    }
  });

  const handlePointerDown = useCallback((event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    // Use native DOM methods for pointer capture
    if (event.nativeEvent && event.nativeEvent.target) {
      (event.nativeEvent.target as HTMLElement).setPointerCapture(event.pointerId);
    }
    
    const currentTime = Date.now();
 
    setLastClickTime(currentTime);
    
    // Select shelf immediately on pointer down
    onSelect(shelf);
    
    // Start dragging and record starting positions
    setIsDragging(true);
    setDragStart(event.point.clone());
    setStartPosition({ x: shelf.x, y: shelf.y });
    
    document.body.style.cursor = 'grabbing';
  }, [shelf, onSelect, lastClickTime]);

  const handlePointerUp = useCallback((event: ThreeEvent<PointerEvent>) => {
    // Use native DOM methods for pointer release
    if (event.nativeEvent && event.nativeEvent.target) {
      (event.nativeEvent.target as HTMLElement).releasePointerCapture(event.pointerId);
    }
    
    setIsDragging(false);
    setDragStart(null);
    
    document.body.style.cursor = isSelected ? 'grab' : 'pointer';
  }, [isSelected]);

  const handlePointerOut = useCallback(() => {
    // Just change cursor, don't end drag operation when pointer leaves object
    if (!isDragging) {
      document.body.style.cursor = 'default';
    }
  }, [isDragging]);

  const handlePointerOver = useCallback((event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    document.body.style.cursor = isDragging ? 'grabbing' : isSelected ? 'grab' : 'pointer';
  }, [isDragging, isSelected]);

  // Update document cursor when component unmounts
  useEffect(() => {
    return () => {
      document.body.style.cursor = 'default';
    };
  }, []);

  const getShelfColor = () => {
    if (shelf.isOverlapping) return '#ef4444'; // Red for overlapping
    if (isSelected) return '#3b82f6'; // Blue when selected
    
    // Use SHELF_CATEGORIES to maintain consistency with the rest of the UI
    const categoryObj = SHELF_CATEGORIES.find(cat => cat.value === shelf.category);
    return categoryObj?.color || '#6b7280';
  };

  return (
    <group position={[shelf.x + shelf.width/2, 0.5, shelf.y + shelf.height/2]}>
      {/* Shelf base */}
      <mesh
        ref={meshRef}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerOut={handlePointerOut}
        onPointerOver={handlePointerOver}
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
