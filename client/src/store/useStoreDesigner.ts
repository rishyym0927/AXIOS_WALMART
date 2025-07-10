import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Zone, Store, LayoutSuggestion, LayoutMetrics } from '@/types';
import * as storeService from '@/services/storeService';

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
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setStoreDimensions: (width: number, height: number) => Promise<void>;
  addZone: (zone: Omit<Zone, 'id'>) => Promise<void>;
  updateZone: (id: string, updates: Partial<Zone>) => Promise<void>;
  deleteZone: (id: string) => Promise<void>;
  selectZone: (zone: Zone | null) => void;
  setEditingZone: (isEditing: boolean) => void;
  setSuggestions: (suggestions: LayoutSuggestion[]) => void;
  setGeneratingSuggestions: (isGenerating: boolean) => void;
  applySuggestion: (suggestion: LayoutSuggestion) => Promise<void>;
  resetStore: () => Promise<void>;
  toggle3DView: () => void;
  optimizeLayout: () => void;
  detectOverlaps: () => void;
  calculateLayoutMetrics: () => LayoutMetrics;
  fetchStoreFromServer: () => Promise<void>;
  setError: (error: string | null) => void;
}

// Default zones are now used as a fallback only if fetching from server fails
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
      isLoading: false,
      error: null,

      // New method to fetch store from server
      fetchStoreFromServer: async () => {
        try {
          set({ isLoading: true, error: null });
          const storeData = await storeService.fetchStoreLayout();
          set({ store: storeData });
          get().detectOverlaps();
          get().calculateLayoutMetrics();
        } catch (error) {
          console.error('Error fetching store from server:', error);
          set({ error: 'Failed to fetch store layout from server.' });
        } finally {
          set({ isLoading: false });
        }
      },

      setError: (error) => {
        set({ error });
      },

      // Actions - modified to use server API
      setStoreDimensions: async (width: number, height: number) => {
        try {
          set({ isLoading: true, error: null });
          const updatedStore = await storeService.updateStoreDimensions(width, height);
          
          set((state) => ({
            store: updatedStore
          }));
          
          get().detectOverlaps();
          get().calculateLayoutMetrics();
        } catch (error) {
          console.error('Error updating store dimensions:', error);
          set({ error: 'Failed to update store dimensions on server.' });
        } finally {
          set({ isLoading: false });
        }
      },

      addZone: async (zoneData) => {
        try {
          set({ isLoading: true, error: null });
          // Generate a temporary ID for optimistic UI updates
          const tempId = Date.now().toString();
          
          // Optimistic update
          const newZone: Zone = {
            ...zoneData,
            id: tempId,
          };
          
          set((state) => ({
            store: {
              ...state.store,
              zones: [...state.store.zones, newZone],
            },
          }));
          
          // Actual server update
          const updatedStore = await storeService.addZone(zoneData);
          
          // Update with server response
          set({ store: updatedStore });
          
          get().detectOverlaps();
          get().calculateLayoutMetrics();
        } catch (error) {
          console.error('Error adding zone:', error);
          set({ error: 'Failed to add zone on server.' });
          
          // Revert optimistic update by fetching fresh data
          get().fetchStoreFromServer();
        } finally {
          set({ isLoading: false });
        }
      },

      updateZone: async (id: string, updates: Partial<Zone>) => {
        try {
          set({ isLoading: true, error: null });
          
          // Optimistic update
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
          
          // Actual server update
          const updatedStore = await storeService.updateZone(id, updates);
          
          // Update with server response
          set({ store: updatedStore });
          
          get().detectOverlaps();
          get().calculateLayoutMetrics();
        } catch (error) {
          console.error('Error updating zone:', error);
          set({ error: 'Failed to update zone on server.' });
          
          // Revert optimistic update by fetching fresh data
          get().fetchStoreFromServer();
        } finally {
          set({ isLoading: false });
        }
      },

      deleteZone: async (id: string) => {
        try {
          set({ isLoading: true, error: null });
          
          // Store the current state for potential rollback
          const previousStore = get().store;
          const previousSelectedZone = get().selectedZone;
          
          // Optimistic update
          set((state) => ({
            store: {
              ...state.store,
              zones: state.store.zones.filter((zone) => zone.id !== id),
            },
            selectedZone: state.selectedZone?.id === id ? null : state.selectedZone,
          }));
          
          // Actual server update
          const updatedStore = await storeService.deleteZone(id);
          
          // Update with server response
          set({ store: updatedStore });
          
          get().detectOverlaps();
          get().calculateLayoutMetrics();
        } catch (error) {
          console.error('Error deleting zone:', error);
          set({ error: 'Failed to delete zone on server.' });
          
          // Revert optimistic update by fetching fresh data
          get().fetchStoreFromServer();
        } finally {
          set({ isLoading: false });
        }
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

      applySuggestion: async (suggestion: LayoutSuggestion) => {
        try {
          set({ isLoading: true, error: null });
          
          // Optimistic update
          set((state) => ({
            store: {
              ...state.store,
              zones: suggestion.zones,
            },
            selectedZone: null,
          }));

          // Send the entire store to the server with the suggested zones
          const updatedStore = await storeService.updateEntireStore({
            ...get().store,
            zones: suggestion.zones
          });
          
          // Update with server response
          set({ store: updatedStore });
          
          get().detectOverlaps();
          get().calculateLayoutMetrics();
        } catch (error) {
          console.error('Error applying suggestion:', error);
          set({ error: 'Failed to apply suggestion on server.' });
          
          // Revert optimistic update
          get().fetchStoreFromServer();
        } finally {
          set({ isLoading: false });
        }
      },

      resetStore: async () => {
        try {
          set({ isLoading: true, error: null });
          
          // Set local state to default store
          set({
            store: DEFAULT_STORE,
            selectedZone: null,
            isEditingZone: false,
            suggestions: [],
            layoutMetrics: DEFAULT_METRICS,
          });
          
          // Send default store to server
          await storeService.updateEntireStore(DEFAULT_STORE);
          
          get().detectOverlaps();
          get().calculateLayoutMetrics();
        } catch (error) {
          console.error('Error resetting store:', error);
          set({ error: 'Failed to reset store on server.' });
        } finally {
          set({ isLoading: false });
        }
      },

      toggle3DView: () => {
        set((state) => ({ is3DView: !state.is3DView }));
      },

      optimizeLayout: () => {
        // Implementation for layout optimization
        const { store } = get();
        const optimizedZones = store.zones.map((zone, index) => {
          // Simple optimization: arrange zones in a grid pattern
          const cols = Math.ceil(Math.sqrt(store.zones.length));
          const row = Math.floor(index / cols);
          const col = index % cols;
          
          return {
            ...zone,
            x: col * (zone.width + 1),
            y: row * (zone.height + 1),
          };
        });
        
        set((state) => ({
          store: {
            ...state.store,
            zones: optimizedZones,
          },
        }));
        
        get().detectOverlaps();
        get().calculateLayoutMetrics();
      },

      detectOverlaps: () => {
        const { store } = get();
        const zones = store.zones;
        let hasOverlaps = false;
        
        for (let i = 0; i < zones.length; i++) {
          for (let j = i + 1; j < zones.length; j++) {
            if (doZonesOverlap(zones[i], zones[j])) {
              hasOverlaps = true;
              break;
            }
          }
          if (hasOverlaps) break;
        }
        
        set((state) => ({
          layoutMetrics: {
            ...state.layoutMetrics,
            overlappingZones: hasOverlaps,
          },
        }));
      },

      calculateLayoutMetrics: () => {
        const { store } = get();
        const totalStoreArea = store.width * store.height;
        const usedArea = store.zones.reduce((acc, zone) => acc + (zone.width * zone.height), 0);
        const utilization = totalStoreArea > 0 ? (usedArea / totalStoreArea) * 100 : 0;
        const unusedSpace = totalStoreArea - usedArea;
        
        const metrics: LayoutMetrics = {
          utilization,
          overlappingZones: get().layoutMetrics.overlappingZones,
          unusedSpace,
        };
        
        set({ layoutMetrics: metrics });
        return metrics;
      },
    }),
    { name: 'store-designer' }
  )
);