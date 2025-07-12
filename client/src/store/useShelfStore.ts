import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Shelf, ShelfMetrics } from '@/types';
import { 
  fetchShelvesForZone, 
  addShelf as apiAddShelf, 
  updateShelf as apiUpdateShelf, 
  deleteShelf as apiDeleteShelf 
} from '@/services/storeService';

interface ShelfState {
  shelves: Shelf[];
  selectedShelf: Shelf | null;
  shelfMetrics: ShelfMetrics;
  currentZoneId: string | null;
  zoneWidth: number;
  zoneHeight: number;
  
  // Actions
  addShelf: (shelf: Omit<Shelf, 'id'>) => void;
  updateShelf: (id: string, updates: Partial<Shelf>, showLoading?: boolean) => void;
  updateShelfImmediate: (id: string, updates: Partial<Shelf>) => void;
  deleteShelf: (id: string) => void;
  selectShelf: (shelf: Shelf | null) => void;
  loadShelvesForZone: (zoneId: string) => void;
  calculateShelfMetrics: (zoneWidth: number, zoneHeight: number) => void;
  detectShelfOverlaps: () => void;
  optimizeShelves: (zoneWidth: number, zoneHeight: number) => void;
}

const DEFAULT_METRICS: ShelfMetrics = {
  utilization: 0,
  overlappingShelves: false,
  unusedSpace: 0,
};

// Helper function to check if two shelves overlap
const doShelvesOverlap = (shelf1: Shelf, shelf2: Shelf): boolean => {
  return !(
    shelf1.x + shelf1.width <= shelf2.x ||
    shelf1.x >= shelf2.x + shelf2.width ||
    shelf1.y + shelf1.height <= shelf2.y ||
    shelf1.y >= shelf2.y + shelf2.height
  );
};

export const useShelfStore = create<ShelfState>()(
  devtools(
    (set, get) => ({
      // Initial state
      shelves: [],
      selectedShelf: null,
      shelfMetrics: DEFAULT_METRICS,
      currentZoneId: null,
      zoneWidth: 0,
      zoneHeight: 0,
      
      // Actions
      addShelf: async (shelfData) => {
        try {
          const { currentZoneId } = get();
          
          if (!currentZoneId) {
            console.error('Cannot add shelf: No zone selected');
            return;
          }
          
          // Add shelf through API
          const newShelf = await apiAddShelf(currentZoneId, shelfData);
          
          // Update local state
          set(state => ({
            shelves: [...state.shelves, newShelf]
          }));
          
          get().detectShelfOverlaps();
          
          // Trigger metrics calculation after adding shelf
          const { zoneWidth, zoneHeight } = get();
          if (zoneWidth > 0 && zoneHeight > 0) {
            get().calculateShelfMetrics(zoneWidth, zoneHeight);
          }
        } catch (error) {
          console.error('Failed to add shelf:', error);
        }
      },
      
      updateShelf: async (id, updates, showLoading: boolean = true) => {
        try {
          const { currentZoneId } = get();
          
          if (!currentZoneId) {
            console.error('Cannot update shelf: No zone selected');
            return;
          }

          if (showLoading) {
            // For final updates, call the API and wait
            await apiUpdateShelf(currentZoneId, id, updates);
            
            // Update local state
            set(state => ({
              shelves: state.shelves.map(shelf => 
                shelf.id === id ? { ...shelf, ...updates } : shelf
              ),
              selectedShelf: state.selectedShelf?.id === id 
                ? { ...state.selectedShelf, ...updates } 
                : state.selectedShelf,
            }));
            
            get().detectShelfOverlaps();
            
            // Recalculate metrics when shelves are updated
            const { zoneWidth, zoneHeight } = get();
            if (zoneWidth > 0 && zoneHeight > 0) {
              get().calculateShelfMetrics(zoneWidth, zoneHeight);
            }
          } else {
            // For drag operations, just update locally and defer API call
            set(state => ({
              shelves: state.shelves.map(shelf => 
                shelf.id === id ? { ...shelf, ...updates } : shelf
              ),
              selectedShelf: state.selectedShelf?.id === id 
                ? { ...state.selectedShelf, ...updates } 
                : state.selectedShelf,
            }));
            
            get().detectShelfOverlaps();
            get().calculateShelfMetrics(get().zoneWidth, get().zoneHeight);
          }
        } catch (error) {
          console.error('Failed to update shelf:', error);
        }
      },

      updateShelfImmediate: (id: string, updates: Partial<Shelf>) => {
        // Immediate update without server sync - for real-time drag operations
        set(state => ({
          shelves: state.shelves.map(shelf => 
            shelf.id === id ? { ...shelf, ...updates } : shelf
          ),
          selectedShelf: state.selectedShelf?.id === id 
            ? { ...state.selectedShelf, ...updates } 
            : state.selectedShelf,
        }));
        
        // Recalculate overlaps and metrics immediately
        get().detectShelfOverlaps();
        const { zoneWidth, zoneHeight } = get();
        if (zoneWidth > 0 && zoneHeight > 0) {
          get().calculateShelfMetrics(zoneWidth, zoneHeight);
        }
      },
      
      deleteShelf: async (id) => {
        try {
          const { currentZoneId } = get();
          
          if (!currentZoneId) {
            console.error('Cannot delete shelf: No zone selected');
            return;
          }
          
          // Delete shelf through API
          await apiDeleteShelf(currentZoneId, id);
          
          // Update local state
          set(state => ({
            shelves: state.shelves.filter(shelf => shelf.id !== id),
            selectedShelf: state.selectedShelf?.id === id ? null : state.selectedShelf,
          }));
          
          get().detectShelfOverlaps();
        } catch (error) {
          console.error('Failed to delete shelf:', error);
        }
      },
      
      selectShelf: (shelf) => {
        set({ selectedShelf: shelf });
      },
      
      loadShelvesForZone: async (zoneId) => {
        try {
          console.log('Loading shelves for zone:', zoneId);
          
          // Fetch shelves from API
          const shelves = await fetchShelvesForZone(zoneId);
          
          set({ 
            shelves,
            currentZoneId: zoneId 
          });
          
          get().detectShelfOverlaps();
          
          // Calculate metrics for the loaded shelves
          const { zoneWidth, zoneHeight } = get();
          if (zoneWidth > 0 && zoneHeight > 0) {
            get().calculateShelfMetrics(zoneWidth, zoneHeight);
          }
        } catch (error) {
          console.error('Failed to load shelves for zone:', error);
          // Set empty shelves but still update the current zone ID
          set({ 
            shelves: [],
            currentZoneId: zoneId 
          });
        }
      },
      
      calculateShelfMetrics: (zoneWidth, zoneHeight) => {
        set({ zoneWidth, zoneHeight });
        const { shelves } = get();
        const zoneArea = zoneWidth * zoneHeight;
        const shelfArea = shelves.reduce((total, shelf) => total + (shelf.width * shelf.height), 0);
        const utilization = zoneArea > 0 ? (shelfArea / zoneArea) * 100 : 0;
        const unusedSpace = Math.max(0, zoneArea - shelfArea);
        
        // Check for overlaps
        let hasOverlap = false;
        for (let i = 0; i < shelves.length; i++) {
          for (let j = i + 1; j < shelves.length; j++) {
            if (doShelvesOverlap(shelves[i], shelves[j])) {
              hasOverlap = true;
              break;
            }
          }
          if (hasOverlap) break;
        }
        
        const metrics: ShelfMetrics = {
          utilization: Math.min(100, utilization),
          overlappingShelves: hasOverlap,
          unusedSpace
        };
        
        set({ shelfMetrics: metrics });
      },
      
      detectShelfOverlaps: () => {
        const { shelves } = get();
        
        // Reset overlapping flags
        const shelvesWithOverlapStatus = shelves.map(shelf => ({ ...shelf, isOverlapping: false }));
        
        // Check each pair of shelves for overlap
        for (let i = 0; i < shelvesWithOverlapStatus.length; i++) {
          for (let j = i + 1; j < shelvesWithOverlapStatus.length; j++) {
            if (doShelvesOverlap(shelvesWithOverlapStatus[i], shelvesWithOverlapStatus[j])) {
              shelvesWithOverlapStatus[i].isOverlapping = true;
              shelvesWithOverlapStatus[j].isOverlapping = true;
            }
          }
        }
        
        set({ shelves: shelvesWithOverlapStatus });
      },

      optimizeShelves: (zoneWidth: number, zoneHeight: number) => {
        const { shelves } = get();
        
        // Simple optimization: arrange shelves in a grid pattern to avoid overlaps
        let currentX = 0.5;
        let currentY = 0.5;
        let maxHeightInRow = 0;
        
        const optimizedShelves = shelves.map(shelf => {
          // If adding this shelf would exceed zone width, move to next row
          if (currentX + shelf.width > zoneWidth - 0.5) {
            currentX = 0.5;
            currentY += maxHeightInRow + 0.5;
            maxHeightInRow = 0;
          }
          
          // If shelf won't fit in remaining vertical space, scale it down
          if (currentY + shelf.height > zoneHeight - 0.5) {
            const availableHeight = zoneHeight - currentY - 0.5;
            if (availableHeight > 0.5) {
              const scaleFactor = availableHeight / shelf.height;
              shelf.height = availableHeight;
              shelf.width = Math.max(0.5, shelf.width * scaleFactor);
            } else {
              // Move to next row if no space
              currentX = 0.5;
              currentY = 0.5;
              maxHeightInRow = 0;
            }
          }
          
          const optimizedShelf = {
            ...shelf,
            x: currentX,
            y: currentY,
            isOverlapping: false
          };
          
          currentX += shelf.width + 0.5;
          maxHeightInRow = Math.max(maxHeightInRow, shelf.height);
          
          return optimizedShelf;
        });
        
        set({ shelves: optimizedShelves });
        get().detectShelfOverlaps();
        get().calculateShelfMetrics(zoneWidth, zoneHeight);
      }
    }),
    {
      name: 'shelf-store',
    }
  )
);
