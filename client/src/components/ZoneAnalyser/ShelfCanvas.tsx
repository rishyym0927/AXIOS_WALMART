'use client';

import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrthographicCamera, PerspectiveCamera } from '@react-three/drei';
import { useShelfStore } from '@/store/useShelfStore';
import ResizableShelf from './ResizableShelf';
import ShelfModel3D from './ShelfModel3D';
import ShelfCameraController from './ShelfCameraController';
import ShelfCameraControls3D from './ShelfCameraControls3D';
import ZoneFloor from './ZoneFloor';
import { Zone, Shelf } from '@/types';
import * as THREE from 'three';

interface ShelfCanvasProps {
  zone: Zone;
  is3DView?: boolean;
  cameraHeight?: number;
  onToggleView?: () => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
}

export default function ShelfCanvas({ 
  zone, 
  is3DView = false, 
  cameraHeight = Math.max(zone.width, zone.height) * 2,
  onToggleView,
  onZoomIn,
  onZoomOut
}: ShelfCanvasProps) {
  const { 
    shelves, 
    selectedShelf, 
    selectShelf, 
    updateShelf,
    updateShelfImmediate
  } = useShelfStore();
  
  // Track if any shelf is being dragged to inform camera controller
  const [isDraggingAnyShelf, setIsDraggingAnyShelf] = useState(false);

  // Custom update handler to track dragging state
  const handleShelfUpdate = (id: string, updates: Partial<Shelf>) => {
    // If position is being updated, we're likely dragging
    if ('x' in updates || 'y' in updates) {
      setIsDraggingAnyShelf(true);
      // Use setTimeout to reset dragging flag after a brief delay
      // This helps ensure smooth movement until the user completely stops
      setTimeout(() => setIsDraggingAnyShelf(false), 100);
    }
    // Call the actual update function with showLoading=true for final saves
    updateShelf(id, updates, true);
  };

  // Immediate update handler for smooth dragging
  const handleShelfUpdateImmediate = (id: string, updates: Partial<Shelf>) => {
    // If position is being updated, we're likely dragging
    if ('x' in updates || 'y' in updates) {
      setIsDraggingAnyShelf(true);
      // Use setTimeout to reset dragging flag after a brief delay
      setTimeout(() => setIsDraggingAnyShelf(false), 100);
    }
    // Call the immediate update function for smooth real-time updates
    updateShelfImmediate(id, updates);
  };

  const handleCanvasClick = (event: any) => {
    // Only deselect if clicking on empty space and not during a drag operation
    // Check if event and intersections exist before accessing length
    if (!isDraggingAnyShelf && (!event?.intersections || event.intersections.length === 0)) {
      selectShelf(null);
    }
  };

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg shadow-lg overflow-hidden">
      <Canvas onPointerMissed={handleCanvasClick}>
        {is3DView ? (
          <>
            <PerspectiveCamera 
              makeDefault 
              position={[
                zone.width/2, 
                cameraHeight, 
                zone.height + zone.width/2
              ]} 
              fov={50}
            />
            <ShelfCameraControls3D zoneWidth={zone.width} zoneHeight={zone.height} />
            <ambientLight intensity={0.6} />
            <directionalLight position={[10, 10, 5]} intensity={0.8} />
            <hemisphereLight intensity={0.5} />
            
            <ZoneFloor width={zone.width} height={zone.height} />
            {shelves.map(shelf => (
              <ShelfModel3D
                key={shelf.id}
                shelf={shelf}
                isSelected={selectedShelf?.id === shelf.id}
                onSelect={() => selectShelf(shelf)}
              />
            ))}
          </>
        ) : (
          <>
            <OrthographicCamera makeDefault />
            <ShelfCameraController 
              zoneWidth={zone.width} 
              zoneHeight={zone.height} 
              isDragging={isDraggingAnyShelf} 
            />
            <ambientLight intensity={0.6} />
            <directionalLight position={[10, 10, 5]} intensity={0.8} />
            
            {/* Zone floor */}
            <mesh position={[zone.width/2, -0.1, zone.height/2]} rotation={[-Math.PI/2, 0, 0]}>
              <planeGeometry args={[zone.width, zone.height]} />
              <meshStandardMaterial color="#f5f5f5" />
            </mesh>
            
            {/* Zone boundary */}
            <mesh position={[zone.width/2, 0, zone.height/2]} rotation={[-Math.PI/2, 0, 0]}>
              <planeGeometry args={[zone.width, zone.height]} />
              <meshBasicMaterial color="#f0f0f0" transparent opacity={0.3} />
            </mesh>
            
            {/* Zone border */}
            <lineSegments position={[zone.width/2, 0.01, zone.height/2]} rotation={[-Math.PI/2, 0, 0]}>
              <edgesGeometry args={[new THREE.PlaneGeometry(zone.width, zone.height)]} />
              <lineBasicMaterial color="#888" />
            </lineSegments>
            
            {/* Grid lines for better visual reference */}
            {Array.from({ length: Math.floor(zone.width) + 1 }, (_, i) => (
              <lineSegments key={`vertical-${i}`} position={[i, 0.005, zone.height/2]} rotation={[-Math.PI/2, 0, 0]}>
                <bufferGeometry>
                  <bufferAttribute 
                    attach="attributes-position" 
                    array={new Float32Array([0, 0, 0, 0, zone.height, 0])} 
                    itemSize={3} 
                    count={2} 
                  />
                </bufferGeometry>
                <lineBasicMaterial color="#ddd" opacity={0.5} transparent />
              </lineSegments>
            ))}
            
            {Array.from({ length: Math.floor(zone.height) + 1 }, (_, i) => (
              <lineSegments key={`horizontal-${i}`} position={[zone.width/2, 0.005, i]} rotation={[-Math.PI/2, 0, 0]}>
                <bufferGeometry>
                  <bufferAttribute 
                    attach="attributes-position" 
                    array={new Float32Array([0, 0, 0, zone.width, 0, 0])} 
                    itemSize={3} 
                    count={2} 
                  />
                </bufferGeometry>
                <lineBasicMaterial color="#ddd" opacity={0.5} transparent />
              </lineSegments>
            ))}
            
            {/* Render shelves */}
            {shelves.map(shelf => (
              <ResizableShelf
                key={shelf.id}
                shelf={shelf}
                zoneWidth={zone.width}
                zoneHeight={zone.height}
                onUpdate={handleShelfUpdate}
                onUpdateImmediate={handleShelfUpdateImmediate}
                onSelect={selectShelf}
                isSelected={selectedShelf?.id === shelf.id}
              />
            ))}
          </>
        )}
      </Canvas>
      
      {/* Zone info display - simplified */}
      <div className="absolute bottom-4 left-4 bg-white p-3 rounded shadow text-sm">
        <div className="font-semibold text-gray-800">Zone: {zone.name}</div>
        <div className="text-gray-600 text-xs mt-1">
          {zone.width}m × {zone.height}m ({(zone.width * zone.height).toFixed(1)}m²)
        </div>
        <div className="text-gray-600 text-xs mt-1">
          View: {is3DView ? '3D Perspective' : '2D Orthographic'}
        </div>
        {selectedShelf && (
          <div className="text-blue-600 mt-1 pt-1 border-t border-gray-200">
            <div className="font-medium text-xs">Selected: {selectedShelf.name}</div>
            <div className="text-xs text-gray-500">
              {selectedShelf.width}×{selectedShelf.height}m at ({selectedShelf.x.toFixed(1)}, {selectedShelf.y.toFixed(1)})
            </div>
          </div>
        )}
      </div>

      {/* Interaction Hints */}
      <div className="absolute top-4 right-4 bg-white p-3 rounded shadow text-xs max-w-64">
        <div className="font-semibold text-gray-800 mb-2">💡 Shelf Management:</div>
        <ul className="text-gray-600 space-y-1">
          <li>• <strong>Click</strong> to select shelf</li>
          <li>• <strong>Drag</strong> to move shelf</li>
          <li>• <strong>Drag edges/corners</strong> to resize</li>
          <li>• Use <strong>Product Analysis button</strong> in sidebar</li>
          <li>• Selected shelf shows <strong>resize handles</strong></li>
        </ul>
        {selectedShelf && (
          <div className="mt-2 pt-2 border-t border-gray-200">
            <div className="text-blue-600 font-medium text-xs">Selected: {selectedShelf.name}</div>
            <div className="text-xs text-gray-500">
              Drag anywhere to move, or drag edges to resize
            </div>
          </div>
        )}
      </div>
      
    </div>
  );
}
