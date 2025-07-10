'use client';

import React, { useState } from 'react';
import { Zone } from '@/types';
import { Save, X } from 'lucide-react';

interface ZoneFormProps {
  zone?: Zone;
  onSave: (zone: Omit<Zone, 'id'>) => void;
  onCancel: () => void;
}

const ZONE_COLORS = [
  '#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6',
  '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6366f1'
];

export default function ZoneForm({ zone, onSave, onCancel }: ZoneFormProps) {
  const [formData, setFormData] = useState({
    name: zone?.name || '',
    color: zone?.color || '#10b981',
    x: zone?.x || 0,
    y: zone?.y || 0,
    width: zone?.width || 5,
    height: zone?.height || 5,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim()) {
      onSave(formData);
    }
  };

  const updateFormData = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-gray-100 border border-gray-300 rounded-lg">
      <h3 className="font-bold text-lg text-gray-900">
        {zone ? 'Edit Zone' : 'Add New Zone'}
      </h3>
      
      <div>
        <label className="block text-sm font-semibold text-gray-800 mb-2">Zone Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => updateFormData('name', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter zone name"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-800 mb-2">Color</label>
        <div className="grid grid-cols-5 gap-2">
          {ZONE_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => updateFormData('color', color)}
              className={`w-8 h-8 rounded-full border-3 transition-all ${
                formData.color === color ? 'border-gray-900 ring-2 ring-gray-400' : 'border-gray-400 hover:border-gray-600'
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">X Position (m)</label>
          <input
            type="number"
            value={formData.x}
            onChange={(e) => updateFormData('x', Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            min="0"
            step="0.5"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">Y Position (m)</label>
          <input
            type="number"
            value={formData.y}
            onChange={(e) => updateFormData('y', Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            min="0"
            step="0.5"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">Width (m)</label>
          <input
            type="number"
            value={formData.width}
            onChange={(e) => updateFormData('width', Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            min="1"
            step="0.5"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">Height (m)</label>
          <input
            type="number"
            value={formData.height}
            onChange={(e) => updateFormData('height', Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            min="1"
            step="0.5"
          />
        </div>
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          className="flex-1 bg-blue-700 text-white py-2 px-4 rounded-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center gap-2 font-medium transition-colors"
        >
          <Save size={16} />
          Save Zone
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-700 text-white py-2 px-4 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 flex items-center justify-center gap-2 font-medium transition-colors"
        >
          <X size={16} />
          Cancel
        </button>
      </div>
    </form>
  );
}
