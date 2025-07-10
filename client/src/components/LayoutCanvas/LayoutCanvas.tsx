'use client';

import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrthographicCamera, PerspectiveCamera } from '@react-three/drei';
import { useStoreDesigner } from '@/store/useStoreDesigner';
import CameraController from './CameraController';
import CameraControls3D from './3DCameraControls';
import StoreFloor from './StoreFloor';
import ResizableZone from './ResizableZone';
import ZoneModel3D from './ZoneModel3D';
import { Eye, EyeOff, ZoomIn, ZoomOut, Move, AlertCircle, CheckCircle, Layers } from 'lucide-react';

export default function LayoutCanvas() {
  const { 
    store, 
    selectedZone, 
    updateZone, 
    selectZone, 
    layoutMetrics,
    calculateLayoutMetrics,
    detectOverlaps,
    optimizeLayout
  } = useStoreDesigner();
  
  const [zoomLevel, setZoomLevel] = useState(1);
  const [is3DView, setIs3DView] = useState(false);
  const [cameraHeight, setCameraHeight] = useState(Math.max(store.width, store.height) * 3);

  // Calculate metrics on mount and when store changes
  useEffect(() => {
    detectOverlaps();
    calculateLayoutMetrics();
  }, [store.width, store.height, store.zones.length]);

  const handleZoomChange = (newZoom: number) => {
    setZoomLevel(newZoom);
  };

  const toggleView = () => {
    setIs3DView(!is3DView);
  };

  const increase3DZoom = () => {
    setCameraHeight(prev => Math.max(prev * 0.8, 5));
  };

  const decrease3DZoom = () => {
    setCameraHeight(prev => Math.min(prev * 1.2, Math.max(store.width, store.height) * 5));
  };

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg shadow-lg overflow-hidden">
      <Canvas>
        {is3DView ? (
          <>
            <PerspectiveCamera 
              makeDefault 
              position={[
                store.width/2, 
                cameraHeight, 
                store.height + store.width/2
              ]} // Moved further back
              fov={50} // Smaller field of view for better perspective
            />
            <CameraControls3D storeWidth={store.width} storeHeight={store.height} />
            <ambientLight intensity={0.6} />
            <directionalLight position={[10, 10, 5]} intensity={0.8} />
            <hemisphereLight intensity={0.5} />
            <StoreFloor width={store.width} height={store.height} />
            {store.zones.map((zone) => (
              <ZoneModel3D
                key={zone.id}
                zone={zone}
                isSelected={selectedZone?.id === zone.id}
                onSelect={() => selectZone(zone)}
              />
            ))}
          </>
        ) : (
          <>
            <OrthographicCamera makeDefault />
            <CameraController storeWidth={store.width} storeHeight={store.height} onZoomChange={handleZoomChange} />
            
            <ambientLight intensity={0.6} />
            <directionalLight position={[10, 10, 5]} intensity={0.8} />
            
            
            <StoreFloor width={store.width} height={store.height} />
            
            {store.zones.map((zone) => (
              <ResizableZone
                key={zone.id}
                zone={zone}
                storeWidth={store.width}
                storeHeight={store.height}
                onUpdate={updateZone}
                onSelect={selectZone}
                isSelected={selectedZone?.id === zone.id}
              />
            ))}
          </>
        )}
      </Canvas>
      
      {/* Store info and metrics panel */}
      <div className="absolute bottom-4 left-4 bg-white p-3 rounded shadow text-sm">
        <div className="font-semibold">Store: {store.width}m × {store.height}m</div>
        
        {selectedZone && (
          <div className="mt-1 text-gray-700">
            Selected: {selectedZone.name} ({selectedZone.width.toFixed(1)}×{selectedZone.height.toFixed(1)}m)
          </div>
        )}
        
        <div className="mt-2 font-semibold text-gray-800">Layout Metrics:</div>
        
        <div className="flex items-center gap-1 mt-1">
          {layoutMetrics.overlappingZones ? 
            <AlertCircle size={14} className="text-red-500" /> : 
            <CheckCircle size={14} className="text-green-500" />}
          <span className={layoutMetrics.overlappingZones ? "text-red-500" : "text-green-500"}>
            {layoutMetrics.overlappingZones ? 'Zones overlapping' : 'No overlaps'}
          </span>
        </div>
        
        <div className="mt-1">
          Space utilization: 
          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
            <div 
              className={`h-2 rounded-full ${layoutMetrics.utilization > 95 ? 'bg-green-500' : 'bg-blue-500'}`} 
              style={{ width: `${layoutMetrics.utilization}%` }}
            ></div>
          </div>
          <span className="text-xs text-gray-500">
            {layoutMetrics.utilization.toFixed(1)}% used ({layoutMetrics.unusedSpace.toFixed(1)}m² unused)
          </span>
        </div>

        <div className="mt-2">
          Zoom Level: {is3DView ? (store.width / cameraHeight).toFixed(2) : zoomLevel.toFixed(2)}
        </div>
      </div>

      {/* Layout controls */}
      <div className="absolute top-4 left-4 flex flex-col gap-2">
        <button
          onClick={optimizeLayout}
          className="bg-purple-600 text-white px-4 py-2 rounded shadow hover:bg-purple-700 transition flex items-center gap-1"
          title="Automatically optimize layout to eliminate overlaps"
        >
          <Layers size={16} /> Optimize Layout
        </button>

        {layoutMetrics.overlappingZones && (
          <div className="bg-red-100 border border-red-500 text-red-700 px-3 py-1 rounded text-xs flex items-center gap-1">
            <AlertCircle size={14} />
            Overlapping zones detected
          </div>
        )}
      </div>

      {/* View controls */}
      <div className="absolute top-4 right-4 flex gap-2">
        {(
          <div className="flex gap-2">
            <button
              onClick={increase3DZoom}
              className="bg-blue-600 text-white px-3 py-2 rounded shadow hover:bg-blue-700 transition flex items-center"
              aria-label="Zoom In"
            >
              <ZoomIn size={16} />
            </button>
            <button
              onClick={decrease3DZoom}
              className="bg-blue-600 text-white px-3 py-2 rounded shadow hover:bg-blue-700 transition flex items-center"
              aria-label="Zoom Out"
            >
              <ZoomOut size={16} />
            </button>
            <div className="bg-white text-gray-800 px-3 py-2 rounded shadow flex items-center gap-1">
              <Move size={16} /> Use mouse to orbit
            </div>
          </div>
        ) }
        
        <button
          onClick={toggleView}
          className="bg-purple-600 text-white px-4 py-2 rounded shadow hover:bg-purple-700 transition flex items-center gap-1"
        >
          <Eye size={16} /> {is3DView ? '2D View' : '3D View'}
        </button>
      </div>
    </div>
  );
}
