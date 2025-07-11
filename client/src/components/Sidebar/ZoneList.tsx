'use client';
import React, { useState, useCallback } from 'react';
import { useStoreDesigner } from '@/store/useStoreDesigner';
import { Zone } from '@/types';
import ZoneForm from './ZoneForm';
import ZoneItem from './ZoneItem';

export default function ZoneList() {
  const { 
    store, 
    selectedZone, 
    updateZone, 
    deleteZone, 
    selectZone, 
    setEditingZone 
  } = useStoreDesigner();
  
  const [editingZoneId, setEditingZoneId] = useState<string | null>(null);

  const handleEdit = useCallback((zone: Zone) => {
    setEditingZoneId(zone.id);
    setEditingZone(true);
  }, [setEditingZone]);

  const handleSaveEdit = useCallback((updates: Omit<Zone, 'id'>) => {
    if (editingZoneId) {
      updateZone(editingZoneId, updates);
      setEditingZoneId(null);
      setEditingZone(false);
    }
  }, [editingZoneId, updateZone, setEditingZone]);

  const handleCancelEdit = useCallback(() => {
    setEditingZoneId(null);
    setEditingZone(false);
  }, [setEditingZone]);

  const handleDelete = useCallback((zoneId: string) => {
    // Clear editing state if we're deleting the zone being edited
    if (editingZoneId === zoneId) {
      setEditingZoneId(null);
      setEditingZone(false);
    }
    deleteZone(zoneId);
  }, [editingZoneId, deleteZone, setEditingZone]);

  const handleSelect = useCallback((zone: Zone) => {
    // Don't allow selection while editing
    if (editingZoneId) return;
    selectZone(zone);
  }, [editingZoneId, selectZone]);

  const editingZone = editingZoneId ? store.zones.find(z => z.id === editingZoneId) : undefined;

  // Show edit form if editing a zone
  if (editingZone) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-lg text-gray-900">
            Edit Zone: {editingZone.name}
          </h3>
          <button
            onClick={handleCancelEdit}
            className="text-gray-500 hover:text-gray-700 text-sm"
          >
            ← Back to list
          </button>
        </div>
        <ZoneForm
          zone={editingZone}
          onSave={handleSaveEdit}
          onCancel={handleCancelEdit}
        />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="font-bold text-lg text-gray-900">
        Zones ({store.zones.length})
      </h3>
      
      {store.zones.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
          <div className="max-w-sm mx-auto">
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <p className="text-gray-700 font-medium">No zones defined</p>
            <p className="text-gray-600 text-sm mt-1">
              Add your first zone to start organizing your store layout
            </p>
          </div>
        </div>
      ) : (
      <div className="space-y-2 overflow-y-auto max-h-[75vh] pr-2">

          {store.zones.map((zone) => (
            <ZoneItem
              key={zone.id}
              zone={zone}
              isSelected={selectedZone?.id === zone.id}
              onSelect={handleSelect}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}