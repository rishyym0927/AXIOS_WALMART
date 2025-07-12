'use client';

import { useState, useCallback } from 'react';
import { Zone, Shelf } from '@/types';
import { shelfAIService } from '@/services/shelfAIService';
import { aiService } from '@/services/aiService';
import { useShelfStore } from '@/store/useShelfStore';

interface ShelfOptimizationSuggestion {
  id: string;
  name: string;
  description: string;
  efficiency: number;
  spaceUtilization: number;
  shelves: Omit<Shelf, 'id' | 'zoneId'>[];
}

interface UseShelfAIProps {
  zone: Zone;
}

export function useShelfAI({ zone }: UseShelfAIProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestions, setSuggestions] = useState<ShelfOptimizationSuggestion[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const { shelves, addShelf, updateShelf, deleteShelf, selectShelf } = useShelfStore();
  
  // Get current shelves for this zone
  const currentShelves = shelves.filter(shelf => shelf.zoneId === zone.id);

  const generateShelfSuggestions = useCallback(async () => {
    setIsGenerating(true);
    setError(null);
    
    try {
      console.log('Generating shelf suggestions for zone:', zone.name);
      
      // Use the new shelf AI service
      const aiSuggestions = await shelfAIService.generateShelfSuggestions(
        zone,
        currentShelves
      );
      
      setSuggestions(aiSuggestions);
      
      return aiSuggestions;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate shelf suggestions';
      setError(errorMessage);
      console.error('Error generating shelf suggestions:', err);
      return [];
    } finally {
      setIsGenerating(false);
    }
  }, [zone, currentShelves]);

  const optimizeExistingShelves = useCallback(async () => {
    if (currentShelves.length === 0) {
      setError('No shelves to optimize. Add some shelves first.');
      return [];
    }

    setIsGenerating(true);
    setError(null);
    
    try {
      console.log('Optimizing existing shelves for zone:', zone.name);
      
      // Use the enhanced AI service for optimization
      const optimizationResult = await aiService.generateShelfOptimizationSuggestions(
        zone,
        currentShelves
      );
      
      // Convert to our suggestion format
      const optimizedSuggestions: ShelfOptimizationSuggestion[] = optimizationResult.suggestions.map(suggestion => ({
        id: suggestion.id,
        name: suggestion.name,
        description: suggestion.description,
        efficiency: suggestion.metrics.efficiency,
        spaceUtilization: suggestion.metrics.utilization,
        shelves: suggestion.shelves.map(shelf => ({
          name: shelf.name,
          category: shelf.category,
          x: shelf.x,
          y: shelf.y,
          width: shelf.width,
          height: shelf.height,
        }))
      }));
      
      setSuggestions(optimizedSuggestions);
      
      return optimizedSuggestions;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to optimize shelves';
      setError(errorMessage);
      console.error('Error optimizing shelves:', err);
      return [];
    } finally {
      setIsGenerating(false);
    }
  }, [zone, currentShelves]);

  const applySuggestion = useCallback(async (suggestion: ShelfOptimizationSuggestion) => {
    try {
      console.log('Applying shelf suggestion:', suggestion.name);
      
      // Clear existing shelves in this zone
      const shelvesToDelete = currentShelves.map(shelf => shelf.id);
      await Promise.all(shelvesToDelete.map(id => deleteShelf(id)));
      
      // Add new shelves from suggestion
      const newShelves = await Promise.all(
        suggestion.shelves.map(async (shelfData) => {
          const newShelf = {
            ...shelfData,
            zoneId: zone.id,
          };
          
          return await addShelf(newShelf);
        })
      );
      
      // Select the first shelf if any were created
      if (newShelves.length > 0 && newShelves[0]) {
        selectShelf(newShelves[0]);
      }
      
      return newShelves;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to apply shelf suggestion';
      setError(errorMessage);
      console.error('Error applying shelf suggestion:', err);
      throw err;
    }
  }, [zone.id, currentShelves, addShelf, deleteShelf, selectShelf]);

  const generateShelfsByCategory = useCallback(async (targetCategory: string) => {
    setIsGenerating(true);
    setError(null);
    
    try {
      console.log('Generating shelves for category:', targetCategory);
      
      // Create a modified zone name to focus on the specific category
      const categoryFocusedZone = {
        ...zone,
        name: `${targetCategory} ${zone.name}`
      };
      
      const aiSuggestions = await shelfAIService.generateShelfSuggestions(
        categoryFocusedZone,
        currentShelves
      );
      
      // Filter suggestions to focus on the requested category
      const categorySuggestions = aiSuggestions.map(suggestion => ({
        ...suggestion,
        name: `${targetCategory} Focused - ${suggestion.name}`,
        shelves: suggestion.shelves.filter(shelf => 
          shelf.category === targetCategory || shelf.category === 'checkout'
        )
      })).filter(suggestion => suggestion.shelves.length > 0);
      
      setSuggestions(categorySuggestions);
      
      return categorySuggestions;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate category-specific shelves';
      setError(errorMessage);
      console.error('Error generating category shelves:', err);
      return [];
    } finally {
      setIsGenerating(false);
    }
  }, [zone, currentShelves]);

  const calculateShelfMetrics = useCallback((shelves: Omit<Shelf, 'id' | 'zoneId'>[]) => {
    const zoneArea = zone.width * zone.height;
    const shelfArea = shelves.reduce((total, shelf) => total + (shelf.width * shelf.height), 0);
    const utilization = zoneArea > 0 ? (shelfArea / zoneArea) * 100 : 0;
    
    // Check for overlaps
    let hasOverlaps = false;
    for (let i = 0; i < shelves.length; i++) {
      for (let j = i + 1; j < shelves.length; j++) {
        if (doShelvesOverlap(shelves[i], shelves[j])) {
          hasOverlaps = true;
          break;
        }
      }
      if (hasOverlaps) break;
    }
    
    // Calculate accessibility score based on walkway space
    const walkwaySpace = zoneArea - shelfArea;
    const accessibility = Math.min(100, (walkwaySpace / zoneArea) * 200); // 50% walkway = 100% score
    
    return {
      utilization: Math.min(100, utilization),
      hasOverlaps,
      accessibility,
      unusedSpace: Math.max(0, zoneArea - shelfArea),
      totalShelves: shelves.length
    };
  }, [zone.width, zone.height]);

  const clearSuggestions = useCallback(() => {
    setSuggestions([]);
    setError(null);
  }, []);

  return {
    // State
    isGenerating,
    suggestions,
    error,
    currentShelves,
    
    // Actions
    generateShelfSuggestions,
    optimizeExistingShelves,
    applySuggestion,
    generateShelfsByCategory,
    calculateShelfMetrics,
    clearSuggestions,
    
    // Utils
    canOptimize: currentShelves.length > 0,
    hasGeneratedSuggestions: suggestions.length > 0,
  };
}

// Helper function to check shelf overlaps
function doShelvesOverlap(
  shelf1: Omit<Shelf, 'id' | 'zoneId'>,
  shelf2: Omit<Shelf, 'id' | 'zoneId'>,
  minGap: number = 0.1
): boolean {
  return !(
    shelf1.x + shelf1.width + minGap <= shelf2.x ||
    shelf2.x + shelf2.width + minGap <= shelf1.x ||
    shelf1.y + shelf1.height + minGap <= shelf2.y ||
    shelf2.y + shelf2.height + minGap <= shelf1.y
  );
}

export default useShelfAI;
