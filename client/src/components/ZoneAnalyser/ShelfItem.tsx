'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Shelf } from '@/types';
import { Edit, Trash2, Eye, Package } from 'lucide-react';

interface ShelfItemProps {
  shelf: Shelf;
  isSelected: boolean;
  onSelect: (shelf: Shelf) => void;
  onEdit: (shelf: Shelf) => void;
  onDelete: (shelfId: string) => void;
  onAnalyze: () => void;
}

// Import SHELF_CATEGORIES from ShelfForm to maintain consistency
import { SHELF_CATEGORIES } from './ShelfForm';

const getShelfColor = (category: string) => {
  const categoryObj = SHELF_CATEGORIES.find((cat: { value: string; color: string; label: string }) => cat.value === category);
  return categoryObj?.color || '#6b7280';
};

const getCategoryLabel = (category: string) => {
  const categoryObj = SHELF_CATEGORIES.find((cat: { value: string; color: string; label: string }) => cat.value === category);
  return categoryObj?.label || 'Unknown';
};

export default function ShelfItem({ shelf, isSelected, onSelect, onEdit, onDelete, onAnalyze }: ShelfItemProps) {
  const router = useRouter();
  
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(shelf);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Are you sure you want to delete "${shelf.name}"?`)) {
      onDelete(shelf.id);
    }
  };

  const handleFocus = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(shelf);
  };

  const handleAnalyzeProducts = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAnalyze();
  };

  return (
    <div
      onClick={() => onSelect(shelf)}
      className={`p-3 border rounded-lg cursor-pointer transition-all ${
        isSelected
          ? 'border-blue-600 bg-blue-50 shadow-sm'
          : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
      } ${shelf.isOverlapping ? 'border-red-300 bg-red-50' : ''}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-4 h-4 rounded border-2 border-gray-300"
            style={{ backgroundColor: getShelfColor(shelf.category) }}
          />
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-gray-900 truncate">{shelf.name}</div>
            <div className="text-xs text-gray-600">
              {getCategoryLabel(shelf.category)}
            </div>
            <div className="text-xs text-gray-600">
              {shelf.width}×{shelf.height}m at ({shelf.x.toFixed(1)}, {shelf.y.toFixed(1)})
            </div>
            {shelf.isOverlapping && (
              <div className="text-xs text-red-600 font-medium">⚠ Overlapping</div>
            )}
            {isSelected && (
              <div className="text-xs text-blue-600 font-medium">Selected - Check the shelf analysis panel</div>
            )}
          </div>
        </div>
        
        <div className="flex gap-1">
          <button
            onClick={handleAnalyzeProducts}
            className="p-2 text-gray-700 hover:text-green-700 hover:bg-green-100 rounded transition-colors"
            title="Analyze products in this shelf"
          >
            <Package size={14} />
          </button>
          <button
            onClick={handleFocus}
            className="p-2 text-gray-700 hover:text-blue-700 hover:bg-blue-100 rounded transition-colors"
            title="Focus on shelf"
          >
            <Eye size={14} />
          </button>
          <button
            onClick={handleEdit}
            className="p-2 text-gray-700 hover:text-blue-700 hover:bg-blue-100 rounded transition-colors"
            title="Edit shelf"
          >
            <Edit size={14} />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 text-gray-700 hover:text-red-700 hover:bg-red-100 rounded transition-colors"
            title="Delete shelf"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
