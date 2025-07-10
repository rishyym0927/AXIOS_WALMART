import React, { useRef, useMemo, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { useRouter } from 'next/navigation';
import * as THREE from 'three';
import { Zone } from '@/types';

function ResizableZone({ 
  zone, 
  storeWidth, 
  storeHeight, 
  onUpdate, 
  onSelect, 
  isSelected 
}: {
  zone: Zone;
  storeWidth: number;
  storeHeight: number;
  onUpdate: (id: string, updates: Partial<Zone>) => void;
  onSelect: (zone: Zone) => void;
  isSelected: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { camera, raycaster, pointer } = useThree();
  const router = useRouter();
  const [isDragging, setIsDragging] = React.useState(false);
  const [isResizing, setIsResizing] = React.useState(false);
  const [resizeHandle, setResizeHandle] = React.useState<'corner' | 'right' | 'bottom' | null>(null);
  const [initialMousePos, setInitialMousePos] = React.useState({ x: 0, y: 0 });
  const [initialZoneState, setInitialZoneState] = React.useState({ x: 0, y: 0, width: 0, height: 0 });

  const handlePointerDown = (event: any) => {
    event.stopPropagation();
    
    // Check for double-click navigation
    if (event.detail === 2) {
      router.push(`/zone/${zone.id}`);
      return;
    }
    
    const intersect = event.intersections[0];
    if (!intersect) return;

    const localPoint = intersect.point;
    
    // Store initial mouse position in world coordinates
    setInitialMousePos({ x: localPoint.x, y: localPoint.z });
    setInitialZoneState({ 
      x: zone.x, 
      y: zone.y, 
      width: zone.width, 
      height: zone.height 
    });
    
    // Check if clicking near edges for resizing (increased threshold for better UX)
    const edgeThreshold = 1.0;
    const rightEdge = zone.x + zone.width;
    const bottomEdge = zone.y + zone.height;
    
    const isNearRightEdge = Math.abs(localPoint.x - rightEdge) < edgeThreshold;
    const isNearBottomEdge = Math.abs(localPoint.z - bottomEdge) < edgeThreshold;
    
    if (isNearRightEdge && isNearBottomEdge) {
      // Corner resize (both width and height)
      setIsResizing(true);
      setResizeHandle('corner');
    } else if (isNearRightEdge) {
      // Right edge resize (width only)
      setIsResizing(true);
      setResizeHandle('right');
    } else if (isNearBottomEdge) {
      // Bottom edge resize (height only)
      setIsResizing(true);
      setResizeHandle('bottom');
    } else {
      // Dragging
      setIsDragging(true);
    }
    
    onSelect(zone);
  };

  const handlePointerMove = (event: any) => {
    if (!isDragging && !isResizing) return;

    const intersect = event.intersections[0];
    if (!intersect) return;

    const currentPoint = intersect.point;
    const deltaX = currentPoint.x - initialMousePos.x;
    const deltaY = currentPoint.z - initialMousePos.y;

    if (isDragging) {
      // Calculate new position
      const newX = Math.max(0, Math.min(initialZoneState.x + deltaX, storeWidth - zone.width));
      const newY = Math.max(0, Math.min(initialZoneState.y + deltaY, storeHeight - zone.height));
      
      onUpdate(zone.id, { x: newX, y: newY });
    } else if (isResizing && resizeHandle) {
      let newWidth = initialZoneState.width;
      let newHeight = initialZoneState.height;

      // Calculate new dimensions based on resize handle
      if (resizeHandle === 'corner' || resizeHandle === 'right') {
        newWidth = Math.max(1, Math.min(initialZoneState.width + deltaX, storeWidth - zone.x));
      }
      
      if (resizeHandle === 'corner' || resizeHandle === 'bottom') {
        newHeight = Math.max(1, Math.min(initialZoneState.height + deltaY, storeHeight - zone.y));
      }
      
      onUpdate(zone.id, { width: newWidth, height: newHeight });
    }
  };

  const handlePointerUp = () => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeHandle(null);
  };

  useEffect(() => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      canvas.addEventListener('pointerup', handlePointerUp);
      canvas.addEventListener('pointermove', (e) => {
        // Update cursor based on position
        if (isSelected && !isDragging && !isResizing) {
          const rect = canvas.getBoundingClientRect();
          const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
          const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
          
          // This is a simplified cursor update - you might want to implement proper raycasting here
          canvas.style.cursor = 'grab';
        }
      });
      
      return () => {
        canvas.removeEventListener('pointerup', handlePointerUp);
        canvas.style.cursor = 'default';
      };
    }
  }, [isDragging, isResizing, isSelected]);

  const geometry = useMemo(() => {
    return new THREE.PlaneGeometry(zone.width, zone.height);
  }, [zone.width, zone.height]);

  const material = useMemo(() => {
    // Change the color if zone is overlapping with others
    const baseColor = zone.isOverlapping ? '#ef4444' : zone.color;
    
    return new THREE.MeshBasicMaterial({
      color: baseColor,
      transparent: true,
      opacity: isSelected ? 0.9 : 0.7, // Enhanced opacity for better visibility
      side: THREE.DoubleSide,
    });
  }, [zone.color, zone.isOverlapping, isSelected]);

  return (
    <group position={[zone.x + zone.width / 2, 0.1, zone.y + zone.height / 2]}>
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
        }} // Highlight on hover
        onPointerOut={() => {
          if (meshRef.current && meshRef.current.material) {
            (meshRef.current.material as THREE.MeshBasicMaterial).opacity = isSelected ? 0.9 : 0.7;
          }
        }}
      />
      
      {/* Zone border */}
      <lineSegments position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <edgesGeometry args={[geometry]} />
        <lineBasicMaterial 
          color={zone.isOverlapping ? '#ef4444' : (isSelected ? '#ffffff' : '#000000')} 
          linewidth={2} 
        />
      </lineSegments>

      {/* Warning for overlapping zones */}
      {zone.isOverlapping && (
        <Text
          position={[0, 0.5, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={Math.min(zone.width, zone.height) * 0.15}
          color="#ef4444"
          anchorX="center"
          anchorY="middle"
        >
          !
        </Text>
      )}

      {/* Zone label */}
      <Text
        position={[0, 0.2, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={Math.min(zone.width, zone.height) * 0.2}
        color="#000000"
        anchorX="center"
        anchorY="middle"
        maxWidth={zone.width * 0.8}
      >
        {zone.name}
      </Text>

      {/* Resize handles with improved visuals */}
      {isSelected && (
        <>
          {/* Corner resize handle (bottom-right) */}
          <mesh position={[zone.width / 2 - 0.3, 0.15, zone.height / 2 - 0.3]}>
            <boxGeometry args={[0.6, 0.2, 0.6]} />
            <meshBasicMaterial color="#9333ea" />
          </mesh>
          
          {/* Right edge resize handle */}
          <mesh position={[zone.width / 2 - 0.1, 0.15, 0]}>
            <boxGeometry args={[0.2, 0.2, zone.height * 0.8]} />
            <meshBasicMaterial color="#10b981" transparent opacity={0.8} />
          </mesh>
          
          {/* Bottom edge resize handle */}
          <mesh position={[0, 0.15, zone.height / 2 - 0.1]}>
            <boxGeometry args={[zone.width * 0.8, 0.2, 0.2]} />
            <meshBasicMaterial color="#10b981" transparent opacity={0.8} />
          </mesh>
        </>
      )}
    </group>
  );
}

export default ResizableZone;