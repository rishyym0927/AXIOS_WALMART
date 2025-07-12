'use client';

import React, { useState } from 'react';
import { Shelf } from '@/types';
import { Save, X } from 'lucide-react';

interface ShelfFormProps {
  shelf?: Shelf;
  zone: { id: string; width: number; height: number };
  onSave: (shelf: Omit<Shelf, 'id'>) => void;
  onCancel: () => void;
}

export const SHELF_CATEGORIES = [
  { value: 'general', label: 'General', color: '#6b7280' },
  { value: 'grocery', label: 'Grocery', color: '#10b981' },
  { value: 'electronics', label: 'Electronics', color: '#3b82f6' },
  { value: 'fashion', label: 'Fashion', color: '#8b5cf6' },
  { value: 'beauty', label: 'Beauty', color: '#ec4899' },
  { value: 'home-garden', label: 'Home & Garden', color: '#84cc16' },
  { value: 'books-media', label: 'Books & Media', color: '#06b6d4' },
  { value: 'toys', label: 'Toys', color: '#6366f1' },
  { value: 'sports', label: 'Sports', color: '#f97316' },
  { value: 'checkout', label: 'Checkout', color: '#f59e0b' },
  { value: 'pharmacy', label: 'Pharmacy', color: '#ef4444' },
  { value: 'automotive', label: 'Automotive', color: '#64748b' },
];

export default function ShelfForm({ shelf, zone, onSave, onCancel }: ShelfFormProps) {
  const [formData, setFormData] = useState({
    name: shelf?.name || '',
    category: shelf?.category || 'general',
    x: shelf?.x || 1,
    y: shelf?.y || 1,
    width: shelf?.width || 2,
    height: shelf?.height || 1,
    zoneId: zone.id,
    shelfType: shelf?.name.split(' - ')[0] || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Generate name from shelfType and category if provided, otherwise use the name directly
    const finalName = formData.shelfType 
      ? `${formData.shelfType} - ${selectedCategory?.label || formData.category}`
      : formData.name.trim();
      
    if (finalName) {
      onSave({
        ...formData,
        name: finalName
      });
    }
  };

  const updateFormData = (field: string, value: string | number) => {
    // When category is updated, update the name suggestion if using shelf type
    if (field === 'category' && formData.shelfType) {
      const categoryLabel = SHELF_CATEGORIES.find(cat => cat.value === String(value))?.label || value;
      setFormData(prev => ({ 
        ...prev, 
        [field]: String(value)
      }));
    } else if (field === 'category') {
      setFormData(prev => ({ ...prev, [field]: String(value) }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const selectedCategory = SHELF_CATEGORIES.find(cat => cat.value === formData.category);

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-gray-100 border border-gray-300 rounded-lg">
      <h3 className="font-bold text-lg text-gray-900">
        {shelf ? 'Edit Shelf' : 'Add New Shelf'}
      </h3>
      
      <div>
        <label className="block text-sm font-semibold text-gray-800 mb-2">Shelf Type</label>
        <select
          value={formData.shelfType}
          onChange={(e) => updateFormData('shelfType', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select a shelf type...</option>
          <option value="Display">Display</option>
          <option value="Storage">Storage</option>
          <option value="Checkout">Checkout</option>
          <option value="Endcap">Endcap</option>
          <option value="Wall">Wall</option>
          <option value="Counter">Counter</option>
          <option value="Refrigeration">Refrigeration</option>
          <option value="Freezer">Freezer</option>
          <option value="Custom">Custom</option>
        </select>
      </div>
      
      {formData.shelfType === 'Custom' && (
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">Custom Shelf Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => updateFormData('name', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter custom shelf name"
            required
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-semibold text-gray-800 mb-2">Category</label>
        <div className="grid grid-cols-2 gap-2">
          {SHELF_CATEGORIES.map((category) => (
            <button
              key={category.value}
              type="button"
              onClick={() => updateFormData('category', category.value)}
              className={`p-2 rounded-md border text-sm font-medium transition-all flex items-center gap-2 ${
                formData.category === category.value
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: category.color }}
              />
              <span className="text-xs">{category.label}</span>
            </button>
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
            max={zone.width - formData.width}
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
            max={zone.height - formData.height}
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
            min="0.5"
            max={zone.width - formData.x}
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
            min="0.5"
            max={zone.height - formData.y}
            step="0.5"
          />
        </div>
      </div>

      <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
        <strong>Shelf Info:</strong> {formData.shelfType ? `${formData.shelfType} - ${selectedCategory?.label}` : formData.name || 'Unnamed Shelf'}
        <br />
        <strong>Category:</strong> {selectedCategory?.label}
        <br />
        <strong>Position:</strong> ({formData.x}, {formData.y}) - ({formData.x + formData.width}, {formData.y + formData.height})
        <br />
        <strong>Area:</strong> {(formData.width * formData.height).toFixed(1)}m²
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          className="flex-1 bg-blue-700 text-white py-2 px-4 rounded-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center gap-2 font-medium transition-colors"
        >
          <Save size={16} />
          Save Shelf
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
