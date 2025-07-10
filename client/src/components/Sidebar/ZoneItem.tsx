'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Zone } from '@/types';
import { Edit, Trash2, BarChart3 } from 'lucide-react';

interface ZoneItemProps {
  zone: Zone;
  isSelected: boolean;
  onSelect: (zone: Zone) => void;
  onEdit: (zone: Zone) => void;
  onDelete: (zoneId: string) => void;
}

export default function ZoneItem({ zone, isSelected, onSelect, onEdit, onDelete }: ZoneItemProps) {
  const router = useRouter();
  
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(zone);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this zone?')) {
      onDelete(zone.id);
    }
  };

  const handleAnalyze = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/zone/${zone.id}`);
  };

  return (
    <div
      onClick={() => onSelect(zone)}
      className={`p-3 border rounded-lg cursor-pointer transition-all ${
        isSelected
          ? 'border-blue-600 bg-blue-50 shadow-sm'
          : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-5 h-5 rounded border-2 border-gray-300"
            style={{ backgroundColor: zone.color }}
          />
          <div>
            <div className="font-semibold text-gray-900">{zone.name}</div>
            <div className="text-sm text-gray-700 font-medium">
              {zone.width}m × {zone.height}m at ({zone.x}, {zone.y})
            </div>
          </div>
        </div>
        
        <div className="flex gap-1">
          <button
            onClick={handleAnalyze}
            className="p-2 text-gray-700 hover:text-green-700 hover:bg-green-100 rounded transition-colors"
            title="Analyze zone"
          >
            <BarChart3 size={16} />
          </button>
          <button
            onClick={handleEdit}
            className="p-2 text-gray-700 hover:text-blue-700 hover:bg-blue-100 rounded transition-colors"
            title="Edit zone"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 text-gray-700 hover:text-red-700 hover:bg-red-100 rounded transition-colors"
            title="Delete zone"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
