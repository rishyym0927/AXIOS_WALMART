'use client';

import React, { useState } from 'react';
import { useStoreDesigner } from '@/store/useStoreDesigner';
import { Zone } from '@/types';
import ZoneForm from './ZoneForm';
import ZoneItem from './ZoneItem';

export default function ZoneList() {
  const { store, selectedZone, updateZone, deleteZone, selectZone, setEditingZone } = useStoreDesigner();
  const [editingZoneId, setEditingZoneId] = useState<string | null>(null);

  const handleEdit = (zone: Zone) => {
    setEditingZoneId(zone.id);
    setEditingZone(true);
  };

  const handleSaveEdit = (updates: Omit<Zone, 'id'>) => {
    if (editingZoneId) {
      updateZone(editingZoneId, updates);
      setEditingZoneId(null);
      setEditingZone(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingZoneId(null);
    setEditingZone(false);
  };

  const editingZone = editingZoneId ? store.zones.find(z => z.id === editingZoneId) : undefined;

  if (editingZone) {
    return (
      <ZoneForm
        zone={editingZone}
        onSave={handleSaveEdit}
        onCancel={handleCancelEdit}
      />
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="font-bold text-lg text-gray-900">Zones ({store.zones.length})</h3>
      
      {store.zones.length === 0 ? (
        <div className="text-center py-6 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-700 font-medium">No zones defined</p>
          <p className="text-gray-600 text-sm mt-1">Add your first zone to get started</p>
        </div>
      ) : (
        <div className="space-y-2">
          {store.zones.map((zone) => (
            <ZoneItem
              key={zone.id}
              zone={zone}
              isSelected={selectedZone?.id === zone.id}
              onSelect={selectZone}
              onEdit={handleEdit}
              onDelete={deleteZone}
            />
          ))}
        </div>
      )}
    </div>
  );
}
