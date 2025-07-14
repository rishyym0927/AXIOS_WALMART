'use client';

import React, { useState } from 'react';
import { useStoreDesigner } from '@/store/useStoreDesigner';
import { Zone } from '@/types';
import { Plus, Edit, Trash2 } from 'lucide-react';
import StoreDimensions from './Sidebar/StoreDimensions';
import ZoneForm from './Sidebar/ZoneForm';
import ZoneList from './Sidebar/ZoneList';

export default function Sidebar() {
  const { addZone, isEditingZone } = useStoreDesigner();
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddZone = (zoneData: Omit<Zone, 'id'>) => {
    addZone(zoneData);
    setShowAddForm(false);
  };

  const handleCancelAdd = () => {
    setShowAddForm(false);
  };

  return (
    <div className="w-80 bg-white border-r border-gray-300 shadow-lg flex flex-col h-full">
      <div className="p-6 border-b border-gray-300 bg-gradient-to-r from-blue-50 to-purple-50">
        <h1 className="text-2xl font-bold text-gray-900">Axios Store Designer</h1>
        <p className="text-sm text-gray-700 mt-2 font-medium">Smart Layout Management</p>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
          <StoreDimensions />

          <div className="space-y-4">
            {!showAddForm && !isEditingZone && (
              <button
                onClick={() => setShowAddForm(true)}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-md hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center gap-2 font-medium transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <Plus size={18} />
                Add New Zone
              </button>
            )}

            {showAddForm && (
              <ZoneForm onSave={handleAddZone} onCancel={handleCancelAdd} />
            )}

            {!showAddForm && <ZoneList />}
          </div>
        </div>
      </div>
    </div>
  );
}

