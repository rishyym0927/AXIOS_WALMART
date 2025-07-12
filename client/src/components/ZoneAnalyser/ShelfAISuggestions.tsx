'use client';

import React, { useState, useEffect } from 'react';
import { Zone, Shelf } from '@/types';
import { useShelfStore } from '@/store/useShelfStore';
import { simplifiedShelfAI } from '@/services/simplifiedShelfAI';
import { X, Bot, Zap, Users, TrendingUp, Layers, Eye } from 'lucide-react';

interface ShelfAISuggestionsProps {
  zone: Zone;
  onClose?: () => void;
}

interface OptimizedShelfSuggestion {
  id: string;
  name: string;
  description: string;
  shelves: Shelf[];
  metrics: {
    utilization: number;
    efficiency: number;
    accessibility: number;
  };
}

export default function ShelfAISuggestions({ zone, onClose }: ShelfAISuggestionsProps) {
  const { shelves, updateShelf, shelfMetrics } = useShelfStore();
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [suggestions, setSuggestions] = useState<OptimizedShelfSuggestion[]>([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState<OptimizedShelfSuggestion | null>(null);
  const [isApplying, setIsApplying] = useState<string | null>(null);
  
  const handleOptimizeExisting = async () => {
    setIsOptimizing(true);
    setSuggestions([]);
    
    try {
      const optimizations = await simplifiedShelfAI.optimizeExistingShelves(zone, shelves);
      setSuggestions(optimizations);
    } catch (error) {
      console.error('Error optimizing shelves:', error);
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleApplySuggestion = async (suggestion: OptimizedShelfSuggestion) => {
    if (suggestion.shelves.length === 0) return;
    
    setIsApplying(suggestion.id);
    
    try {
      // Apply each shelf update
      for (const optimizedShelf of suggestion.shelves) {
        await updateShelf(optimizedShelf.id, {
          x: optimizedShelf.x,
          y: optimizedShelf.y,
          width: optimizedShelf.width,
          height: optimizedShelf.height
        });
      }
      
      // Close modal after successful application
      setTimeout(() => {
        onClose?.();
      }, 500);
    } catch (error) {
      console.error('Error applying suggestion:', error);
    } finally {
      setIsApplying(null);
    }
  };

  const getStrategyIcon = (name: string) => {
    if (name.toLowerCase().includes('space') || name.toLowerCase().includes('grid')) {
      return <Layers className="w-5 h-5 text-blue-600" />;
    }
    if (name.toLowerCase().includes('flow') || name.toLowerCase().includes('customer')) {
      return <Users className="w-5 h-5 text-green-600" />;
    }
    if (name.toLowerCase().includes('category') || name.toLowerCase().includes('group')) {
      return <TrendingUp className="w-5 h-5 text-purple-600" />;
    }
    return <Zap className="w-5 h-5 text-orange-600" />;
  };

  return (
    <div className="p-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-purple-100 p-2 rounded-lg">
            <Bot className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">AI Shelf Optimizer</h2>
            <p className="text-sm text-gray-600">Optimize existing shelf positioning and sizing</p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Zone Info */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div
            className="w-4 h-4 rounded border"
            style={{ backgroundColor: zone.color }}
          />
          <h3 className="font-semibold text-gray-900">{zone.name}</h3>
          <span className="text-sm text-gray-600">
            {zone.width}m × {zone.height}m ({(zone.width * zone.height).toFixed(1)}m²)
          </span>
        </div>
        
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-gray-600">Current Shelves</div>
            <div className="font-semibold text-gray-900">{shelves.length}</div>
          </div>
          <div>
            <div className="text-gray-600">Space Utilization</div>
            <div className="font-semibold text-blue-600">{shelfMetrics.utilization.toFixed(1)}%</div>
          </div>
          <div>
            <div className="text-gray-600">Unused Space</div>
            <div className="font-semibold text-orange-600">{shelfMetrics.unusedSpace.toFixed(1)}m²</div>
          </div>
        </div>
      </div>

      {/* Generate Button */}
      {shelves.length > 0 ? (
        <div className="mb-6">
          <button
            onClick={handleOptimizeExisting}
            disabled={isOptimizing}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-all flex items-center justify-center gap-2"
          >
            {isOptimizing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Optimizing Shelves...
              </>
            ) : (
              <>
                <Zap className="w-5 h-5" />
                Optimize Existing Shelves
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-yellow-600" />
            <p className="text-yellow-800 font-medium">No Shelves to Optimize</p>
          </div>
          <p className="text-yellow-700 text-sm mt-1">
            Add some shelves to this zone first, then return here to optimize their positioning and sizing.
          </p>
        </div>
      )}

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Optimization Suggestions ({suggestions.length})
          </h3>
          
          <div className="grid gap-4">
            {suggestions.map((suggestion) => (
              <div
                key={suggestion.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-gray-50 p-2 rounded-lg">
                      {getStrategyIcon(suggestion.name)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{suggestion.name}</h4>
                      <p className="text-sm text-gray-600">{suggestion.description}</p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleApplySuggestion(suggestion)}
                    disabled={isApplying === suggestion.id || suggestion.shelves.length === 0}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                  >
                    {isApplying === suggestion.id ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Applying...
                      </div>
                    ) : (
                      'Apply Layout'
                    )}
                  </button>
                </div>
                
                {/* Metrics */}
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="bg-green-50 p-2 rounded">
                    <div className="text-green-600 font-medium">Space Utilization</div>
                    <div className="text-green-700 font-semibold">{suggestion.metrics.utilization}%</div>
                  </div>
                  <div className="bg-blue-50 p-2 rounded">
                    <div className="text-blue-600 font-medium">Efficiency</div>
                    <div className="text-blue-700 font-semibold">{suggestion.metrics.efficiency}%</div>
                  </div>
                  <div className="bg-purple-50 p-2 rounded">
                    <div className="text-purple-600 font-medium">Accessibility</div>
                    <div className="text-purple-700 font-semibold">{suggestion.metrics.accessibility}%</div>
                  </div>
                </div>
                
                {/* Shelf Count */}
                <div className="mt-3 text-sm text-gray-600">
                  {suggestion.shelves.length === 0 ? (
                    <span className="text-yellow-600 font-medium">⚠ No shelves in this suggestion</span>
                  ) : (
                    <span>Optimizes {suggestion.shelves.length} existing shelves</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Helper Text */}
      <div className="mt-6 text-sm text-gray-600 bg-blue-50 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">How Shelf Optimization Works:</h4>
        <ul className="space-y-1 text-blue-800">
          <li>• Repositions and resizes your existing shelves for better space utilization</li>
          <li>• Maintains minimum 0.8m walkways for customer access</li>
          <li>• Preserves shelf names and categories</li>
          <li>• Provides 3 different optimization strategies to choose from</li>
        </ul>
      </div>
    </div>
  );
}
