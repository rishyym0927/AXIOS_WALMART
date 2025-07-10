'use client';

import { AlertCircle, CheckCircle, BarChart3, Package } from 'lucide-react';
import { useShelfStore } from '@/store/useShelfStore';
import { Zone } from '@/types';

interface ShelfMetricsProps {
  zone: Zone;
}

export default function ShelfMetrics({ zone }: ShelfMetricsProps) {
  const { shelves, selectedShelf, shelfMetrics, selectShelf } = useShelfStore();

  const handleAnalyzeProducts = () => {
    if (selectedShelf) {
      // The shelf analyzer modal is controlled by the zone page
      // through the selectedShelf state, so this will automatically 
      // trigger the modal to open
      console.log('Analyzing products for shelf:', selectedShelf.id);
      // The actual modal opening is handled in the zone page component
    }
  };

  return (
    <div className="space-y-6">
      {/* Metrics Overview */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 size={20} className="text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Shelf Metrics</h3>
        </div>
        
        <div className="space-y-4">
          {/* Space Utilization */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Space Utilization</span>
              <span className="text-sm font-bold text-gray-900">{shelfMetrics.utilization.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  shelfMetrics.utilization > 90 ? 'bg-red-500' : 
                  shelfMetrics.utilization > 70 ? 'bg-yellow-500' : 'bg-green-500'
                }`} 
                style={{ width: `${Math.min(shelfMetrics.utilization, 100)}%` }}
              ></div>
            </div>
          </div>
          
          {/* Overlap Status */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Overlap Status</span>
            <div className="flex items-center gap-1">
              {shelfMetrics.overlappingShelves ? (
                <>
                  <AlertCircle size={16} className="text-red-500" />
                  <span className="text-sm font-medium text-red-500">Overlapping</span>
                </>
              ) : (
                <>
                  <CheckCircle size={16} className="text-green-500" />
                  <span className="text-sm font-medium text-green-500">No Overlaps</span>
                </>
              )}
            </div>
          </div>
          
          {/* Shelf Count */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Total Shelves</span>
            <span className="text-sm font-bold text-gray-900">{shelves.length}</span>
          </div>
          
          {/* Unused Space */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Unused Space</span>
            <span className="text-sm font-bold text-gray-900">{shelfMetrics.unusedSpace.toFixed(1)}m²</span>
          </div>
        </div>
      </div>

      {/* Selected Shelf Info */}
      {selectedShelf && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Selected Shelf</h3>
          <div className="space-y-3">
            <div>
              <span className="text-sm font-medium text-gray-700">Name:</span>
              <div className="text-base font-semibold text-blue-600">{selectedShelf.name}</div>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700">Category:</span>
              <div className="text-sm text-gray-900 capitalize">{selectedShelf.category}</div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-sm font-medium text-gray-700">Width:</span>
                <div className="text-sm text-gray-900">{selectedShelf.width.toFixed(1)}m</div>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">Height:</span>
                <div className="text-sm text-gray-900">{selectedShelf.height.toFixed(1)}m</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-sm font-medium text-gray-700">Position X:</span>
                <div className="text-sm text-gray-900">{selectedShelf.x.toFixed(1)}m</div>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">Position Y:</span>
                <div className="text-sm text-gray-900">{selectedShelf.y.toFixed(1)}m</div>
              </div>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700">Area:</span>
              <div className="text-sm text-gray-900">{(selectedShelf.width * selectedShelf.height).toFixed(1)}m²</div>
            </div>
            {selectedShelf.isOverlapping && (
              <div className="bg-red-50 border border-red-200 rounded p-3">
                <div className="flex items-center gap-2">
                  <AlertCircle size={16} className="text-red-500" />
                  <span className="text-sm font-medium text-red-700">Overlapping Detected</span>
                </div>
                <p className="text-xs text-red-600 mt-1">This shelf overlaps with another shelf. Consider repositioning.</p>
              </div>
            )}
            
            {/* Product Analysis Button */}
            <div className="pt-3 border-t border-gray-200">
              <button
                onClick={handleAnalyzeProducts}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex items-center justify-center gap-2 font-medium transition-colors"
              >
                <Package size={18} />
                Analyze Products in Shelf
              </button>
              <p className="text-xs text-gray-500 mt-2 text-center">
                {selectedShelf ? 
                  `Click to analyze products in ${selectedShelf.name}` :
                  'Select a shelf first to analyze its products'
                }
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="space-y-2">
          <div className="text-sm text-gray-600">
            <strong>Keyboard Shortcuts:</strong>
          </div>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• <kbd className="bg-gray-100 px-1 rounded">Delete</kbd> - Remove selected shelf</li>
            <li>• <kbd className="bg-gray-100 px-1 rounded">Escape</kbd> - Deselect shelf</li>
            <li>• <kbd className="bg-gray-100 px-1 rounded">Click</kbd> - Select shelf</li>
            <li>• <kbd className="bg-gray-100 px-1 rounded">Drag</kbd> - Move shelf</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
