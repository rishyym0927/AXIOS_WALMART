'use client';

import dynamic from 'next/dynamic';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useStoreDesigner } from '@/store/useStoreDesigner';
import { useShelfStore } from '@/store/useShelfStore';
import { useProductStore } from '@/store/useProductStore';
import Navbar from '@/components/Navbar';
import ShelfMetrics from '@/components/ZoneAnalyser/ShelfMetrics';
import ShelfList from '@/components/ZoneAnalyser/ShelfList';
import ShelfQuickActions from '@/components/ZoneAnalyser/ShelfQuickActions';
import { ShelfAnalyser } from '@/components/ZoneAnalyser/ShelfAnalyser';
import DemoHelp from '@/components/DemoHelp';

// Dynamically import ShelfCanvas to avoid SSR issues with Three.js
const ShelfCanvas = dynamic(() => import('@/components/ZoneAnalyser/ShelfCanvas'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
      <div className="text-gray-500">Loading Shelf Canvas...</div>
    </div>
  ),
});

export default function ZoneAnalyserPage() {
  const { id } = useParams();
  const router = useRouter();
  const { store } = useStoreDesigner();
  const { loadShelvesForZone, calculateShelfMetrics, selectedShelf, deleteShelf, selectShelf } = useShelfStore();
  const { setSelectedShelf, clearShelfAnalysis } = useProductStore();
  
  // 3D view state management
  const [is3DView, setIs3DView] = useState(false);
  const [cameraHeight, setCameraHeight] = useState(10);
  const [showShelfAnalyser, setShowShelfAnalyser] = useState(false);
  
  const zone = store.zones.find(z => z.id === id);
  
  // Initialize camera height based on zone dimensions
  useEffect(() => {
    if (zone) {
      setCameraHeight(Math.max(zone.width, zone.height) * 2);
    }
  }, [zone]);
  
  useEffect(() => {
    if (zone) {
      loadShelvesForZone(zone.id);
      calculateShelfMetrics(zone.width, zone.height);
    }
  }, [zone?.id, zone?.width, zone?.height]); // Fixed: removed function dependencies

  const handleCloseShelfAnalyser = () => {
    setShowShelfAnalyser(false);
    selectShelf(null);
    clearShelfAnalysis();
  };

  // 3D view controls
  const toggleView = () => {
    setIs3DView(!is3DView);
  };

  const increase3DZoom = () => {
    setCameraHeight(prev => Math.max(prev * 0.8, 3));
  };

  const decrease3DZoom = () => {
    if (!zone) return;
    setCameraHeight(prev => Math.min(prev * 1.2, Math.max(zone.width, zone.height) * 4));
  };

  // Add keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Delete' && selectedShelf) {
        if (window.confirm(`Are you sure you want to delete "${selectedShelf.name}"?`)) {
          deleteShelf(selectedShelf.id);
        }
      } else if (event.key === 'Escape' && selectedShelf) {
        selectShelf(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedShelf, deleteShelf, selectShelf]);
  
  if (!zone) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-6 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Zone not found</h1>
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-900"
            >
              <ArrowLeft size={20} />
              Back to Layout
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Navbar */}
      <Navbar />
      
      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Zone Info */}
        <div className="w-80 bg-white border-r border-gray-300 shadow-lg flex flex-col h-full">
          <div className="p-6 border-b border-gray-300 bg-gray-50">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
            >
              <ArrowLeft size={20} />
              Back to Layout
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Zone Analysis</h1>
            <p className="text-sm text-gray-700 mt-2 font-medium">Optimize shelf placement within zone</p>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6">
            <ShelfList 
              zone={zone} 
              is3DView={is3DView}
              onToggleView={toggleView}
              onZoomIn={increase3DZoom}
              onZoomOut={decrease3DZoom}
            />
          </div>
        </div>
        
        {/* Main Canvas Area */}
        <div className="flex-1 p-6">
          <ShelfCanvas 
            zone={zone} 
            is3DView={is3DView}
            cameraHeight={cameraHeight}
            onToggleView={toggleView}
            onZoomIn={increase3DZoom}
            onZoomOut={decrease3DZoom}
          />
        </div>
        
        {/* Right Panel - Shelf Metrics */}
        <div className="w-80 p-6 space-y-6">
          <ShelfQuickActions zone={zone} />
          <ShelfMetrics zone={zone} />
        </div>
      </div>
      
      {/* Shelf Analyser Modal */}
      {showShelfAnalyser && selectedShelf && (
        <ShelfAnalyser
          shelfId={selectedShelf.id}
          onClose={handleCloseShelfAnalyser}
        />
      )}
      
      {/* Demo Help */}
      <DemoHelp />
    </div>
  );
}
