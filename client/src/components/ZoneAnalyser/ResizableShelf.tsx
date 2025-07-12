'use client';

import React, { useRef, useMemo, useEffect, useCallback } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { Shelf } from '@/types';
import { SHELF_CATEGORIES } from './ShelfForm';

interface ResizableShelfProps {
  shelf: Shelf;
  zoneWidth: number;
  zoneHeight: number;
  onUpdate: (id: string, updates: Partial<Shelf>) => void;
  onUpdateImmediate?: (id: string, updates: Partial<Shelf>) => void;
  onSelect: (shelf: Shelf) => void;
  isSelected: boolean;
}

function ResizableShelf({ 
  shelf, 
  zoneWidth, 
  zoneHeight, 
  onUpdate, 
  onUpdateImmediate,
  onSelect, 
  isSelected 
}: ResizableShelfProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { camera, raycaster, gl } = useThree();
  
  // State for smooth interactions
  const [isDragging, setIsDragging] = React.useState(false);
  const [isResizing, setIsResizing] = React.useState(false);
  const [resizeHandle, setResizeHandle] = React.useState<'corner' | 'right' | 'bottom' | null>(null);
  const [hoverHandle, setHoverHandle] = React.useState<'corner' | 'right' | 'bottom' | null>(null);
  
  // Use refs for tracking to avoid stale closures
  const dragStateRef = useRef({
    isDragging: false,
    isResizing: false,
    resizeHandle: null as 'corner' | 'right' | 'bottom' | null,
    startMousePos: { x: 0, y: 0 },
    startShelfState: { x: 0, y: 0, width: 0, height: 0 },
    lastValidUpdate: Date.now()
  });

  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), []);
  const raycasterPoint = useMemo(() => new THREE.Vector3(), []);

  // Helper function to get mouse world position
  const getWorldPosition = useCallback((event: MouseEvent) => {
    const rect = gl.domElement.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1
    );
    
    raycaster.setFromCamera(mouse, camera);
    raycaster.ray.intersectPlane(plane, raycasterPoint);
    return { x: raycasterPoint.x, z: raycasterPoint.z };
  }, [camera, raycaster, plane, raycasterPoint, gl]);

  // Throttled update function for smoother performance during dragging
  const throttledUpdate = useCallback((updates: Partial<Shelf>) => {
    const now = Date.now();
    if (now - dragStateRef.current.lastValidUpdate > 16) { // ~60fps
      // Use immediate update during dragging for smooth interaction
      if (onUpdateImmediate && (dragStateRef.current.isDragging || dragStateRef.current.isResizing)) {
        onUpdateImmediate(shelf.id, updates);
      } else {
        // Use regular update for non-drag operations
        onUpdate(shelf.id, updates);
      }
      dragStateRef.current.lastValidUpdate = now;
    }
  }, [onUpdate, onUpdateImmediate, shelf.id]);

  const handlePointerDown = useCallback((event: any) => {
    event.stopPropagation();
    
    const intersect = event.intersections[0];
    if (!intersect) return;

    const localPoint = intersect.point;
    
    // Store initial state
    dragStateRef.current.startMousePos = { x: localPoint.x, y: localPoint.z };
    dragStateRef.current.startShelfState = { 
      x: shelf.x, 
      y: shelf.y, 
      width: shelf.width, 
      height: shelf.height 
    };
    
    // Determine interaction type with better edge detection
    const edgeThreshold = Math.min(shelf.width, shelf.height) * 0.15; // Proportional threshold
    const minThreshold = 0.2; // Minimum threshold for small shelves
    const threshold = Math.max(edgeThreshold, minThreshold);
    
    const rightEdge = shelf.x + shelf.width;
    const bottomEdge = shelf.y + shelf.height;
    
    const isNearRightEdge = Math.abs(localPoint.x - rightEdge) < threshold;
    const isNearBottomEdge = Math.abs(localPoint.z - bottomEdge) < threshold;
    
    if (isNearRightEdge && isNearBottomEdge) {
      dragStateRef.current.isResizing = true;
      dragStateRef.current.resizeHandle = 'corner';
      setIsResizing(true);
      setResizeHandle('corner');
    } else if (isNearRightEdge) {
      dragStateRef.current.isResizing = true;
      dragStateRef.current.resizeHandle = 'right';
      setIsResizing(true);
      setResizeHandle('right');
    } else if (isNearBottomEdge) {
      dragStateRef.current.isResizing = true;
      dragStateRef.current.resizeHandle = 'bottom';
      setIsResizing(true);
      setResizeHandle('bottom');
    } else {
      // Start dragging
      dragStateRef.current.isDragging = true;
      setIsDragging(true);
    }
    
    onSelect(shelf);
  }, [shelf, onSelect]);

  // Global mouse move handler for smoother tracking
  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!dragStateRef.current.isDragging && !dragStateRef.current.isResizing) return;

    const worldPos = getWorldPosition(event);
    const deltaX = worldPos.x - dragStateRef.current.startMousePos.x;
    const deltaZ = worldPos.z - dragStateRef.current.startMousePos.y;

    if (dragStateRef.current.isDragging) {
      // Dragging with bounds checking
      const newX = Math.max(0, Math.min(
        dragStateRef.current.startShelfState.x + deltaX, 
        zoneWidth - shelf.width
      ));
      const newY = Math.max(0, Math.min(
        dragStateRef.current.startShelfState.y + deltaZ, 
        zoneHeight - shelf.height
      ));
      
      throttledUpdate({ x: newX, y: newY });
    } else if (dragStateRef.current.isResizing && dragStateRef.current.resizeHandle) {
      // Resizing with constraints
      let newWidth = dragStateRef.current.startShelfState.width;
      let newHeight = dragStateRef.current.startShelfState.height;

      const minSize = 0.5; // Minimum shelf size
      const maxWidth = zoneWidth - shelf.x;
      const maxHeight = zoneHeight - shelf.y;
      
      if (dragStateRef.current.resizeHandle === 'corner' || dragStateRef.current.resizeHandle === 'right') {
        newWidth = Math.max(minSize, Math.min(
          dragStateRef.current.startShelfState.width + deltaX, 
          maxWidth
        ));
      }
      
      if (dragStateRef.current.resizeHandle === 'corner' || dragStateRef.current.resizeHandle === 'bottom') {
        newHeight = Math.max(minSize, Math.min(
          dragStateRef.current.startShelfState.height + deltaZ, 
          maxHeight
        ));
      }
      
      throttledUpdate({ width: newWidth, height: newHeight });
    }
  }, [getWorldPosition, zoneWidth, zoneHeight, shelf.width, shelf.height, shelf.x, shelf.y, throttledUpdate]);

  const handleMouseUp = useCallback(() => {
    // If we were dragging or resizing, save the final state to the server
    if (dragStateRef.current.isDragging || dragStateRef.current.isResizing) {
      // Calculate the final position/size based on current shelf state
      const finalUpdates: Partial<Shelf> = {
        x: shelf.x,
        y: shelf.y,
        width: shelf.width,
        height: shelf.height
      };
      
      // Save to server with loading indicator
      onUpdate(shelf.id, finalUpdates);
    }
    
    dragStateRef.current.isDragging = false;
    dragStateRef.current.isResizing = false;
    dragStateRef.current.resizeHandle = null;
    
    setIsDragging(false);
    setIsResizing(false);
    setResizeHandle(null);
  }, [shelf.x, shelf.y, shelf.width, shelf.height, shelf.id, onUpdate]);

  // Hover detection for cursor changes
  const handlePointerMove = useCallback((event: any) => {
    if (isDragging || isResizing || !isSelected) return;

    const intersect = event.intersections[0];
    if (!intersect) return;

    const localPoint = intersect.point;
    const edgeThreshold = Math.min(shelf.width, shelf.height) * 0.15;
    const minThreshold = 0.2;
    const threshold = Math.max(edgeThreshold, minThreshold);
    
    const rightEdge = shelf.x + shelf.width;
    const bottomEdge = shelf.y + shelf.height;
    
    const isNearRightEdge = Math.abs(localPoint.x - rightEdge) < threshold;
    const isNearBottomEdge = Math.abs(localPoint.z - bottomEdge) < threshold;
    
    if (isNearRightEdge && isNearBottomEdge) {
      setHoverHandle('corner');
    } else if (isNearRightEdge) {
      setHoverHandle('right');
    } else if (isNearBottomEdge) {
      setHoverHandle('bottom');
    } else {
      setHoverHandle(null);
    }
  }, [isDragging, isResizing, isSelected, shelf.width, shelf.height, shelf.x, shelf.y]);

  // Setup global event listeners
  useEffect(() => {
    const canvas = gl.domElement;
    
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseUp);
    
    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp, gl]);

  // Update cursor based on hover state
  useEffect(() => {
    const canvas = gl.domElement;
    if (isDragging) {
      canvas.style.cursor = 'grabbing';
    } else if (isResizing) {
      canvas.style.cursor = resizeHandle === 'corner' ? 'nw-resize' : 
                           resizeHandle === 'right' ? 'e-resize' : 'n-resize';
    } else if (isSelected) {
      canvas.style.cursor = hoverHandle === 'corner' ? 'nw-resize' : 
                           hoverHandle === 'right' ? 'e-resize' : 
                           hoverHandle === 'bottom' ? 'n-resize' : 'grab';
    } else {
      canvas.style.cursor = 'default';
    }
    
    return () => {
      canvas.style.cursor = 'default';
    };
  }, [isDragging, isResizing, isSelected, hoverHandle, resizeHandle, gl]);

  const geometry = useMemo(() => {
    return new THREE.PlaneGeometry(shelf.width, shelf.height);
  }, [shelf.width, shelf.height]);

  const material = useMemo(() => {
    const categoryObj = SHELF_CATEGORIES.find(cat => cat.value === shelf.category);
    const baseColor = shelf.isOverlapping ? '#ef4444' : (categoryObj?.color || '#6b7280');
    
    return new THREE.MeshBasicMaterial({
      color: baseColor,
      transparent: true,
      opacity: isSelected ? 0.9 : 0.7,
      side: THREE.DoubleSide,
    });
  }, [shelf.category, shelf.isOverlapping, isSelected]);

  return (
    <group position={[shelf.x + shelf.width / 2, 0.1, shelf.y + shelf.height / 2]}>
      <mesh
        ref={meshRef}
        geometry={geometry}
        material={material}
        rotation={[-Math.PI / 2, 0, 0]}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerOver={() => {
          if (meshRef.current && meshRef.current.material) {
            (meshRef.current.material as THREE.MeshBasicMaterial).opacity = 1;
          }
        }}
        onPointerOut={() => {
          if (meshRef.current && meshRef.current.material) {
            (meshRef.current.material as THREE.MeshBasicMaterial).opacity = isSelected ? 0.9 : 0.7;
          }
          setHoverHandle(null);
        }}
      />
      
      {/* Shelf border */}
      <lineSegments position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <edgesGeometry args={[geometry]} />
        <lineBasicMaterial 
          color={shelf.isOverlapping ? '#ef4444' : (isSelected ? '#ffffff' : '#000000')} 
          linewidth={2} 
        />
      </lineSegments>

      {/* Warning for overlapping shelves */}
      {shelf.isOverlapping && (
        <Text
          position={[0, 0.5, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={Math.min(shelf.width, shelf.height) * 0.15}
          color="#ef4444"
          anchorX="center"
          anchorY="middle"
        >
          !
        </Text>
      )}

      {/* Shelf label */}
      <Text
        position={[0, 0.2, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={Math.min(shelf.width, shelf.height) * 0.2}
        color="#000000"
        anchorX="center"
        anchorY="middle"
        maxWidth={shelf.width * 0.8}
      >
        {shelf.name}
      </Text>

      {/* Enhanced resize handles with hover effects */}
      {isSelected && (
        <>
          {/* Corner resize handle (bottom-right) */}
          <mesh position={[shelf.width / 2 - 0.15, 0.15, shelf.height / 2 - 0.15]}>
            <boxGeometry args={[0.3, 0.2, 0.3]} />
            <meshBasicMaterial 
              color={hoverHandle === 'corner' ? '#7c3aed' : '#9333ea'} 
              transparent
              opacity={hoverHandle === 'corner' ? 1 : 0.8}
            />
          </mesh>
          
          {/* Right edge resize handle */}
          <mesh position={[shelf.width / 2 - 0.05, 0.15, 0]}>
            <boxGeometry args={[0.1, 0.2, shelf.height * 0.8]} />
            <meshBasicMaterial 
              color={hoverHandle === 'right' ? '#059669' : '#10b981'} 
              transparent 
              opacity={hoverHandle === 'right' ? 1 : 0.8}
            />
          </mesh>
          
          {/* Bottom edge resize handle */}
          <mesh position={[0, 0.15, shelf.height / 2 - 0.05]}>
            <boxGeometry args={[shelf.width * 0.8, 0.2, 0.1]} />
            <meshBasicMaterial 
              color={hoverHandle === 'bottom' ? '#059669' : '#10b981'} 
              transparent 
              opacity={hoverHandle === 'bottom' ? 1 : 0.8}
            />
          </mesh>
        </>
      )}
    </group>
  );
}

export default ResizableShelf;
