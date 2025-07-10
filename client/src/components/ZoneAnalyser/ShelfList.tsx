'use client';

import React, { useState } from 'react';
import { useShelfStore } from '@/store/useShelfStore';
import { Shelf, Zone } from '@/types';
import { Plus, Layers, Zap, Filter, Trash2, Copy, Grid, RotateCcw, Eye, EyeOff, ZoomIn, ZoomOut } from 'lucide-react';
import ShelfForm from './ShelfForm';
import ShelfItem from './ShelfItem';

interface ShelfListProps {
  zone: Zone;
  is3DView?: boolean;
  onToggleView?: () => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
}

export default function ShelfList({ 
  zone, 
  is3DView = false, 
  onToggleView, 
  onZoomIn, 
  onZoomOut 
}: ShelfListProps) {
  const { 
    shelves, 
    selectedShelf, 
    addShelf, 
    updateShelf, 
    deleteShelf, 
    selectShelf,
    optimizeShelves,
    shelfMetrics
  } = useShelfStore();
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingShelfId, setEditingShelfId] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [showQuickActions, setShowQuickActions] = useState(false);

  const filteredShelves = categoryFilter 
    ? shelves.filter(shelf => shelf.category === categoryFilter)
    : shelves;

  const categories = [...new Set(shelves.map(shelf => shelf.category))];

  const handleAddShelf = (shelfData: Omit<Shelf, 'id'>) => {
    addShelf(shelfData);
    setShowAddForm(false);
  };

  const handleEditShelf = (shelf: Shelf) => {
    setEditingShelfId(shelf.id);
  };

  const handleSaveEdit = (updates: Omit<Shelf, 'id'>) => {
    if (editingShelfId) {
      updateShelf(editingShelfId, updates);
      setEditingShelfId(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingShelfId(null);
    setShowAddForm(false);
  };

  const handleOptimize = () => {
    optimizeShelves(zone.width, zone.height);
  };

  const handleClearAllShelves = () => {
    if (window.confirm(`Are you sure you want to remove all ${shelves.length} shelves? This action cannot be undone.`)) {
      shelves.forEach(shelf => deleteShelf(shelf.id));
    }
  };

  const handleDuplicateShelf = () => {
    if (selectedShelf) {
      const newShelf = {
        ...selectedShelf,
        name: `${selectedShelf.name} (Copy)`,
        x: Math.min(selectedShelf.x + 1, zone.width - selectedShelf.width),
        y: Math.min(selectedShelf.y + 1, zone.height - selectedShelf.height),
        zoneId: zone.id
      };
      addShelf(newShelf);
    }
  };

  const handleCreateUniformGrid = () => {
    if (window.confirm('This will replace all current shelves with a uniform grid. Continue?')) {
      // Clear existing shelves
      shelves.forEach(shelf => deleteShelf(shelf.id));
      
      // Create 3x2 grid of shelves
      const shelfWidth = (zone.width - 1) / 3;
      const shelfHeight = (zone.height - 1) / 2;
      
      for (let row = 0; row < 2; row++) {
        for (let col = 0; col < 3; col++) {
          addShelf({
            name: `Shelf ${row * 3 + col + 1}`,
            category: 'general',
            x: col * shelfWidth + 0.2,
            y: row * shelfHeight + 0.2,
            width: shelfWidth - 0.4,
            height: shelfHeight - 0.4,
            zoneId: zone.id
          });
        }
      }
    }
  };

  const editingShelf = editingShelfId ? shelves.find(s => s.id === editingShelfId) : undefined;

  if (editingShelf) {
    return (
      <div className="space-y-4">
        <ShelfForm
          shelf={editingShelf}
          zone={zone}
          onSave={handleSaveEdit}
          onCancel={handleCancelEdit}
        />
      </div>
    );
  }

  if (showAddForm) {
    return (
      <div className="space-y-4">
        <ShelfForm
          zone={zone}
          onSave={handleAddShelf}
          onCancel={handleCancelEdit}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Zone info header */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <div className="flex items-center gap-3 mb-3">
          <div
            className="w-6 h-6 rounded border-2 border-gray-300"
            style={{ backgroundColor: zone.color }}
          />
          <div>
            <div className="font-semibold text-gray-900">{zone.name}</div>
            <div className="text-xs text-gray-600">Zone Analysis</div>
          </div>
        </div>
        <div className="text-xs text-gray-600 space-y-1">
          <div>Dimensions: <span className="font-medium">{zone.width}m × {zone.height}m</span></div>
          <div>Area: <span className="font-medium">{(zone.width * zone.height).toFixed(1)}m²</span></div>
        </div>
      </div>

      {/* View Controls */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-3">View Controls</h3>
        <div className="space-y-2">
          <button
            onClick={onToggleView}
            className="w-full bg-purple-600 text-white py-2 px-3 rounded hover:bg-purple-700 transition flex items-center justify-center gap-2 text-sm font-medium"
          >
            <Eye size={16} />
            {is3DView ? '2D View' : '3D View'}
          </button>
          
          {is3DView && (
            <div className="flex gap-2">
              <button
                onClick={onZoomIn}
                className="flex-1 bg-blue-600 text-white py-2 px-3 rounded hover:bg-blue-700 transition flex items-center justify-center gap-1 text-sm"
              >
                <ZoomIn size={14} />
                Zoom In
              </button>
              <button
                onClick={onZoomOut}
                className="flex-1 bg-blue-600 text-white py-2 px-3 rounded hover:bg-blue-700 transition flex items-center justify-center gap-1 text-sm"
              >
                <ZoomOut size={14} />
                Zoom Out
              </button>
            </div>
          )}
          
          <div className="text-xs text-gray-600 bg-gray-50 rounded p-2">
            {is3DView ? (
              <div>
                <div className="font-medium">3D View Active</div>
                <div>• Use mouse to orbit around</div>
                <div>• Scroll to zoom</div>
                <div>• Click shelves to select</div>
              </div>
            ) : (
              <div>
                <div className="font-medium">2D View Active</div>
                <div>• Drag shelves to move</div>
                <div>• Use grid for alignment</div>
                <div>• Press Delete to remove selected</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Header with metrics */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-bold text-lg text-gray-900 mb-2">
          Shelves ({shelves.length})
        </h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="bg-white rounded p-2">
            <div className="text-xs text-gray-600">Utilization</div>
            <div className="font-semibold text-blue-600">
              {shelfMetrics.utilization.toFixed(1)}%
            </div>
          </div>
          <div className="bg-white rounded p-2">
            <div className="text-xs text-gray-600">Unused Space</div>
            <div className="font-semibold text-gray-800">
              {shelfMetrics.unusedSpace.toFixed(1)}m²
            </div>
          </div>
        </div>
        {shelfMetrics.overlappingShelves && (
          <div className="mt-2 text-xs text-red-600 font-medium bg-red-50 rounded p-2">
            ⚠ Overlapping shelves detected
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="space-y-2">
        <button
          onClick={() => setShowAddForm(true)}
          className="w-full bg-blue-700 text-white py-3 px-4 rounded-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center gap-2 font-medium transition-colors"
        >
          <Plus size={18} />
          Add New Shelf
        </button>
        
        {shelves.length > 0 && (
          <>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleOptimize}
                className="bg-purple-700 text-white py-2 px-3 rounded-md hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 flex items-center justify-center gap-2 font-medium transition-colors text-sm"
              >
                <Layers size={14} />
                Optimize
              </button>
              
              <button
                onClick={() => setShowQuickActions(!showQuickActions)}
                className="bg-gray-700 text-white py-2 px-3 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 flex items-center justify-center gap-2 font-medium transition-colors text-sm"
              >
                {showQuickActions ? <EyeOff size={14} /> : <Eye size={14} />}
                Actions
              </button>
            </div>
            
            {showQuickActions && (
              <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                <div className="text-xs font-medium text-gray-700 mb-2">Quick Actions</div>
                
                <button
                  onClick={handleCreateUniformGrid}
                  className="w-full bg-green-600 text-white py-2 px-3 rounded text-sm hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Grid size={14} />
                  Create 3×2 Grid
                </button>
                
                {selectedShelf && (
                  <button
                    onClick={handleDuplicateShelf}
                    className="w-full bg-blue-600 text-white py-2 px-3 rounded text-sm hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Copy size={14} />
                    Duplicate Selected
                  </button>
                )}
                
                <button
                  onClick={handleClearAllShelves}
                  className="w-full bg-red-600 text-white py-2 px-3 rounded text-sm hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 size={14} />
                  Clear All Shelves
                </button>
              </div>
            )}
            
            {selectedShelf && (
              <button
                onClick={() => selectShelf(null)}
                className="w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 flex items-center justify-center gap-2 font-medium transition-colors"
              >
                <Zap size={16} />
                Deselect Shelf
              </button>
            )}
          </>
        )}
      </div>

      {/* Category filter */}
      {categories.length > 1 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Filter size={14} />
            Filter by Category
          </div>
          <div className="flex flex-wrap gap-1">
            <button
              onClick={() => setCategoryFilter(null)}
              className={`px-2 py-1 text-xs rounded transition-colors ${
                !categoryFilter 
                  ? 'bg-blue-100 text-blue-700 border border-blue-300' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All ({shelves.length})
            </button>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setCategoryFilter(category)}
                className={`px-2 py-1 text-xs rounded transition-colors ${
                  categoryFilter === category 
                    ? 'bg-blue-100 text-blue-700 border border-blue-300' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {category} ({shelves.filter(s => s.category === category).length})
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Shelf list */}
      {filteredShelves.length === 0 ? (
        <div className="text-center py-6 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-700 font-medium">
            {categoryFilter ? `No ${categoryFilter} shelves` : 'No shelves defined'}
          </p>
          <p className="text-gray-600 text-sm mt-1">
            {categoryFilter ? 'Try a different category filter' : 'Add your first shelf to get started'}
          </p>
        </div>
      ) : (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {filteredShelves.map((shelf) => (
            <ShelfItem
              key={shelf.id}
              shelf={shelf}
              isSelected={selectedShelf?.id === shelf.id}
              onSelect={selectShelf}
              onEdit={handleEditShelf}
              onDelete={deleteShelf}
            />
          ))}
        </div>
      )}

      {/* Quick stats */}
      {shelves.length > 0 && (
        <div className="text-xs text-gray-600 bg-gray-50 rounded p-3">
          <div className="font-medium mb-1">Quick Stats:</div>
          <div>Average shelf size: {(shelves.reduce((acc, shelf) => acc + (shelf.width * shelf.height), 0) / shelves.length).toFixed(1)}m²</div>
          <div>Largest shelf: {Math.max(...shelves.map(s => s.width * s.height)).toFixed(1)}m²</div>
          <div>Total shelf area: {shelves.reduce((acc, shelf) => acc + (shelf.width * shelf.height), 0).toFixed(1)}m²</div>
          
          {selectedShelf && (
            <div className="mt-2 pt-2 border-t border-gray-300">
              <div className="font-medium text-blue-600">Keyboard Shortcuts Active:</div>
              <div><kbd className="bg-gray-200 px-1 rounded text-xs">Delete</kbd> - Remove shelf</div>
              <div><kbd className="bg-gray-200 px-1 rounded text-xs">Escape</kbd> - Deselect</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
