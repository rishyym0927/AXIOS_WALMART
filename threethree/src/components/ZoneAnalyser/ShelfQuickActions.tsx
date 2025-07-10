'use client';

import React from 'react';
import { useShelfStore } from '@/store/useShelfStore';
import { Zone } from '@/types';
import { Copy, RotateCcw, Grid, Shuffle, Target } from 'lucide-react';

interface ShelfQuickActionsProps {
  zone: Zone;
}

export default function ShelfQuickActions({ zone }: ShelfQuickActionsProps) {
  const { 
    selectedShelf, 
    shelves, 
    addShelf, 
    updateShelf, 
    selectShelf
  } = useShelfStore();

  const handleDuplicateShelf = () => {
    if (!selectedShelf) return;
    
    const newShelf = {
      ...selectedShelf,
      name: `${selectedShelf.name} (Copy)`,
      x: Math.min(selectedShelf.x + 0.5, zone.width - selectedShelf.width),
      y: Math.min(selectedShelf.y + 0.5, zone.height - selectedShelf.height),
      zoneId: zone.id
    };
    
    addShelf(newShelf);
  };

  const handleRotateShelf = () => {
    if (!selectedShelf) return;
    
    // Swap width and height to rotate 90 degrees
    const newWidth = selectedShelf.height;
    const newHeight = selectedShelf.width;
    
    // Ensure it still fits in the zone
    if (selectedShelf.x + newWidth <= zone.width && 
        selectedShelf.y + newHeight <= zone.height) {
      updateShelf(selectedShelf.id, {
        width: newWidth,
        height: newHeight
      });
    }
  };

  const handleAlignToGrid = () => {
    if (!selectedShelf) return;
    
    // Snap to 0.5m grid
    const gridSize = 0.5;
    const snappedX = Math.round(selectedShelf.x / gridSize) * gridSize;
    const snappedY = Math.round(selectedShelf.y / gridSize) * gridSize;
    
    updateShelf(selectedShelf.id, {
      x: Math.max(0, Math.min(snappedX, zone.width - selectedShelf.width)),
      y: Math.max(0, Math.min(snappedY, zone.height - selectedShelf.height))
    });
  };

  const handleRandomPosition = () => {
    if (!selectedShelf) return;
    
    const maxX = zone.width - selectedShelf.width;
    const maxY = zone.height - selectedShelf.height;
    
    const randomX = Math.random() * maxX;
    const randomY = Math.random() * maxY;
    
    updateShelf(selectedShelf.id, {
      x: Math.max(0, randomX),
      y: Math.max(0, randomY)
    });
  };

  const handleCenterShelf = () => {
    if (!selectedShelf) return;
    
    const centerX = (zone.width - selectedShelf.width) / 2;
    const centerY = (zone.height - selectedShelf.height) / 2;
    
    updateShelf(selectedShelf.id, {
      x: Math.max(0, centerX),
      y: Math.max(0, centerY)
    });
  };

  const handleSelectSimilarShelves = () => {
    if (!selectedShelf) return;
    
    // Find shelves with same category
    const similarShelves = shelves.filter(shelf => 
      shelf.category === selectedShelf.category && shelf.id !== selectedShelf.id
    );
    
    if (similarShelves.length > 0) {
      // For now, just select the first similar shelf
      selectShelf(similarShelves[0]);
    }
  };

  if (!selectedShelf) {
    return (
      <div className="bg-gray-50 rounded-lg p-3 text-center">
        <p className="text-gray-600 text-sm">Select a shelf to see quick actions</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="font-semibold text-gray-900 mb-3 text-sm">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <button
          onClick={handleDuplicateShelf}
          className="flex items-center gap-1 p-2 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors"
          title="Duplicate selected shelf"
        >
          <Copy size={12} />
          Duplicate
        </button>
        
        <button
          onClick={handleRotateShelf}
          className="flex items-center gap-1 p-2 bg-green-50 text-green-700 rounded hover:bg-green-100 transition-colors"
          title="Rotate shelf 90°"
        >
          <RotateCcw size={12} />
          Rotate
        </button>
        
        <button
          onClick={handleAlignToGrid}
          className="flex items-center gap-1 p-2 bg-purple-50 text-purple-700 rounded hover:bg-purple-100 transition-colors"
          title="Snap to grid"
        >
          <Grid size={12} />
          Snap Grid
        </button>
        
        <button
          onClick={handleRandomPosition}
          className="flex items-center gap-1 p-2 bg-orange-50 text-orange-700 rounded hover:bg-orange-100 transition-colors"
          title="Random position"
        >
          <Shuffle size={12} />
          Random
        </button>
        
        <button
          onClick={handleCenterShelf}
          className="flex items-center gap-1 p-2 bg-indigo-50 text-indigo-700 rounded hover:bg-indigo-100 transition-colors"
          title="Center in zone"
        >
          <Target size={12} />
          Center
        </button>
        
        <button
          onClick={handleSelectSimilarShelves}
          className="flex items-center gap-1 p-2 bg-gray-50 text-gray-700 rounded hover:bg-gray-100 transition-colors"
          title="Select similar shelves"
        >
          <Grid size={12} />
          Similar
        </button>
      </div>
    </div>
  );
}
