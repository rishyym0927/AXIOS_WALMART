'use client';

import React, { useState } from 'react';
import { useStoreDesigner } from '@/store/useStoreDesigner';

export default function StoreDimensions() {
  const { store, setStoreDimensions } = useStoreDesigner();
  const [dimensions, setDimensions] = useState({
    width: store.width,
    height: store.height,
  });

  const handleDimensionChange = () => {
    setStoreDimensions(dimensions.width, dimensions.height);
  };

  const updateDimension = (field: 'width' | 'height', value: number) => {
    setDimensions(prev => ({ ...prev, [field]: value }));
  };

  const hasChanges = dimensions.width !== store.width || dimensions.height !== store.height;

  return (
    <div className="space-y-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
      <h2 className="font-bold text-lg text-gray-900">Store Dimensions</h2>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">Width (m)</label>
          <input
            type="number"
            value={dimensions.width}
            onChange={(e) => updateDimension('width', Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            min="5"
            max="100"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">Height (m)</label>
          <input
            type="number"
            value={dimensions.height}
            onChange={(e) => updateDimension('height', Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            min="5"
            max="100"
          />
        </div>
      </div>
      {hasChanges && (
        <button
          onClick={handleDimensionChange}
          className="w-full bg-green-700 text-white py-2 px-4 rounded-md hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 font-medium transition-colors"
        >
          Update Dimensions
        </button>
      )}
    </div>
  );
}
