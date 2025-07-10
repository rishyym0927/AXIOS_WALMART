import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Zone, Store, LayoutSuggestion, LayoutMetrics } from '@/types';

interface StoreState {
  // Store properties
  store: Store;
  
  // UI state
  selectedZone: Zone | null;
  isEditingZone: boolean;
  isGeneratingSuggestions: boolean;
  suggestions: LayoutSuggestion[];
  is3DView: boolean;
  layoutMetrics: LayoutMetrics;
  
  // Actions
  setStoreDimensions: (width: number, height: number) => void;
  addZone: (zone: Omit<Zone, 'id'>) => void;
  updateZone: (id: string, updates: Partial<Zone>) => void;
  deleteZone: (id: string) => void;
  selectZone: (zone: Zone | null) => void;
  setEditingZone: (isEditing: boolean) => void;
  setSuggestions: (suggestions: LayoutSuggestion[]) => void;
  setGeneratingSuggestions: (isGenerating: boolean) => void;
  applySuggestion: (suggestion: LayoutSuggestion) => void;
  resetStore: () => void;
  toggle3DView: () => void;
  optimizeLayout: () => void;
  detectOverlaps: () => void;
  calculateLayoutMetrics: () => LayoutMetrics;
}

const DEFAULT_ZONES: Zone[] = [
  {
    id: '1',
    name: 'Grocery',
    color: '#10b981',
    x: 2,
    y: 2,
    width: 12,
    height: 8,
  },
  {
    id: '2',
    name: 'Electronics',
    color: '#3b82f6',
    x: 16,
    y: 2,
    width: 12,
    height: 8,
  },
  {
    id: '3',
    name: 'Cash Counter',
    color: '#f59e0b',
    x: 12,
    y: 12,
    width: 6,
    height: 4,
  },
];

const DEFAULT_STORE: Store = {
  width: 30,
  height: 20,
  zones: DEFAULT_ZONES,
};

const DEFAULT_METRICS: LayoutMetrics = {
  utilization: 0,
  overlappingZones: false,
  unusedSpace: 0,
};

// Helper function to check if two zones overlap
const doZonesOverlap = (zone1: Zone, zone2: Zone): boolean => {
  return !(
    zone1.x + zone1.width <= zone2.x ||
    zone1.x >= zone2.x + zone2.width ||
    zone1.y + zone1.height <= zone2.y ||
    zone1.y >= zone2.y + zone2.height
  );
};

export const useStoreDesigner = create<StoreState>()(
  devtools(
    (set, get) => ({
      // Initial state
      store: DEFAULT_STORE,
      selectedZone: null,
      isEditingZone: false,
      isGeneratingSuggestions: false,
      suggestions: [],
      is3DView: false,
      layoutMetrics: DEFAULT_METRICS,

      // Actions
      setStoreDimensions: (width: number, height: number) => {
        set((state) => ({
          store: {
            ...state.store,
            width,
            height,
          },
        }));
        get().detectOverlaps();
        get().calculateLayoutMetrics();
      },

      addZone: (zoneData) => {
        const newZone: Zone = {
          ...zoneData,
          id: Date.now().toString(),
        };
        
        set((state) => ({
          store: {
            ...state.store,
            zones: [...state.store.zones, newZone],
          },
        }));
        get().detectOverlaps();
        get().calculateLayoutMetrics();
      },

      updateZone: (id: string, updates: Partial<Zone>) => {
        set((state) => ({
          store: {
            ...state.store,
            zones: state.store.zones.map((zone) =>
              zone.id === id ? { ...zone, ...updates } : zone
            ),
          },
          selectedZone: state.selectedZone?.id === id 
            ? { ...state.selectedZone, ...updates } 
            : state.selectedZone,
        }));
        get().detectOverlaps();
        get().calculateLayoutMetrics();
      },

      deleteZone: (id: string) => {
        set((state) => ({
          store: {
            ...state.store,
            zones: state.store.zones.filter((zone) => zone.id !== id),
          },
          selectedZone: state.selectedZone?.id === id ? null : state.selectedZone,
        }));
        get().detectOverlaps();
        get().calculateLayoutMetrics();
      },

      selectZone: (zone: Zone | null) => {
        set({ selectedZone: zone });
      },

      setEditingZone: (isEditing: boolean) => {
        set({ isEditingZone: isEditing });
      },

      setSuggestions: (suggestions: LayoutSuggestion[]) => {
        set({ suggestions });
      },

      setGeneratingSuggestions: (isGenerating: boolean) => {
        set({ isGeneratingSuggestions: isGenerating });
      },

      applySuggestion: (suggestion: LayoutSuggestion) => {
        set((state) => ({
          store: {
            ...state.store,
            zones: suggestion.zones,
          },
          selectedZone: null,
        }));
        get().detectOverlaps();
        get().calculateLayoutMetrics();
      },

      resetStore: () => {
        set({
          store: DEFAULT_STORE,
          selectedZone: null,
          isEditingZone: false,
          suggestions: [],
          layoutMetrics: DEFAULT_METRICS,
        });
        get().detectOverlaps();
        get().calculateLayoutMetrics();
      },

      toggle3DView: () => {
        set((state) => ({
          is3DView: !state.is3DView,
        }));
      },
      
      detectOverlaps: () => {
        const { zones } = get().store;
        
        // Reset overlapping flags
        const zonesWithOverlapStatus = zones.map(zone => ({ ...zone, isOverlapping: false }));
        
        // Check each pair of zones for overlap
        for (let i = 0; i < zonesWithOverlapStatus.length; i++) {
          for (let j = i + 1; j < zonesWithOverlapStatus.length; j++) {
            if (doZonesOverlap(zonesWithOverlapStatus[i], zonesWithOverlapStatus[j])) {
              zonesWithOverlapStatus[i].isOverlapping = true;
              zonesWithOverlapStatus[j].isOverlapping = true;
            }
          }
        }
        
        set(state => ({
          store: {
            ...state.store,
            zones: zonesWithOverlapStatus
          }
        }));
      },
      
      calculateLayoutMetrics: () => {
        const { width, height, zones } = get().store;
        const storeArea = width * height;
        
        // Calculate total zone area (including overlaps)
        let zoneArea = 0;
        zones.forEach(zone => {
          zoneArea += zone.width * zone.height;
        });
        
        // Check for overlaps
        let hasOverlap = false;
        for (let i = 0; i < zones.length; i++) {
          for (let j = i + 1; j < zones.length; j++) {
            if (doZonesOverlap(zones[i], zones[j])) {
              hasOverlap = true;
              break;
            }
          }
          if (hasOverlap) break;
        }
        
        const utilization = Math.min(100, (zoneArea / storeArea) * 100);
        const unusedSpace = storeArea - zoneArea;
        
        const metrics: LayoutMetrics = {
          utilization,
          overlappingZones: hasOverlap,
          unusedSpace: unusedSpace > 0 ? unusedSpace : 0
        };
        
        set({ layoutMetrics: metrics });
        return metrics;
      },
      
      optimizeLayout: () => {
        const { width, height, zones } = get().store;
        const storeArea = width * height;
        
        // Simple optimization strategy: arrange zones in a grid-like pattern
        let currentX = 0;
        let currentY = 0;
        let maxHeightInRow = 0;
        
        const optimizedZones = [...zones].map(zone => {
          // If adding this zone would exceed store width, move to next row
          if (currentX + zone.width > width) {
            currentX = 0;
            currentY += maxHeightInRow;
            maxHeightInRow = 0;
          }
          
          // If zone won't fit in remaining vertical space, we need to adjust
          if (currentY + zone.height > height) {
            // For simplicity, we'll scale down the zone to fit
            const scaleFactor = (height - currentY) / zone.height;
            zone.height = height - currentY;
            zone.width = Math.max(1, zone.width * scaleFactor);
          }
          
          // Position zone at current coordinates
          const optimizedZone = {
            ...zone,
            x: currentX,
            y: currentY,
            isOverlapping: false
          };
          
          // Update position for next zone
          currentX += zone.width;
          maxHeightInRow = Math.max(maxHeightInRow, zone.height);
          
          return optimizedZone;
        });
        
        set(state => ({
          store: {
            ...state.store,
            zones: optimizedZones
          }
        }));
        
        get().detectOverlaps();
        get().calculateLayoutMetrics();
      }
    }),
    {
      name: 'store-designer',
    }
  )
);
