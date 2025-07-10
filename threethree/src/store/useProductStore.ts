import { create } from 'zustand';
import { Product, ShelfSlot, ShelfLayout, ShelfAnalysis } from '@/types';

interface ProductStore {
  // State
  currentShelfAnalysis: ShelfAnalysis | null;
  selectedShelfId: string | null;
  availableProducts: Product[];
  isLoading: boolean;

  // Actions
  setSelectedShelf: (shelfId: string | null) => void;
  loadShelfAnalysis: (shelfId: string, shelfWidth: number, shelfHeight: number, zoneCategory: string) => void;
  addProductToShelf: (productId: string, slotId: string) => void;
  removeProductFromShelf: (slotId: string) => void;
  moveProduct: (fromSlotId: string, toSlotId: string) => void;
  generateShelfGrid: (width: number, height: number, slotSize: number) => ShelfSlot[];
  getProductsByCategory: (category: string) => Product[];
  clearShelfAnalysis: () => void;
}

// Mock product data
const mockProducts: Product[] = [
  // Electronics
  { id: 'p1', name: 'DSLR Camera', category: 'electronics', width: 15, height: 12, depth: 10, color: '#2563eb', price: 899 },
  { id: 'p2', name: 'Laptop', category: 'electronics', width: 35, height: 25, depth: 3, color: '#1f2937', price: 1299 },
  { id: 'p3', name: 'Smartphone', category: 'electronics', width: 8, height: 16, depth: 1, color: '#374151', price: 699 },
  { id: 'p4', name: 'Tablet', category: 'electronics', width: 25, height: 18, depth: 1, color: '#6b7280', price: 499 },
  { id: 'p5', name: 'Headphones', category: 'electronics', width: 20, height: 15, depth: 8, color: '#111827', price: 199 },
  { id: 'p6', name: 'Smart Watch', category: 'electronics', width: 12, height: 8, depth: 3, color: '#4f46e5', price: 299 },
  
  // Clothing
  { id: 'p7', name: 'T-Shirt', category: 'clothing', width: 30, height: 40, depth: 2, color: '#dc2626', price: 25 },
  { id: 'p8', name: 'Jeans', category: 'clothing', width: 35, height: 45, depth: 3, color: '#1e40af', price: 65 },
  { id: 'p9', name: 'Jacket', category: 'clothing', width: 40, height: 50, depth: 5, color: '#059669', price: 120 },
  { id: 'p10', name: 'Sneakers', category: 'clothing', width: 25, height: 15, depth: 35, color: '#7c2d12', price: 89 },
  { id: 'p11', name: 'Dress', category: 'clothing', width: 35, height: 55, depth: 3, color: '#be185d', price: 75 },
  
  // Food
  { id: 'p12', name: 'Cereal Box', category: 'food', width: 20, height: 30, depth: 8, color: '#d97706', price: 4.99 },
  { id: 'p13', name: 'Milk Carton', category: 'food', width: 10, height: 25, depth: 10, color: '#ffffff', price: 3.49 },
  { id: 'p14', name: 'Bread Loaf', category: 'food', width: 25, height: 15, depth: 12, color: '#92400e', price: 2.99 },
  { id: 'p15', name: 'Pasta Box', category: 'food', width: 18, height: 28, depth: 6, color: '#fbbf24', price: 1.99 },
  { id: 'p16', name: 'Soda Can', category: 'food', width: 6, height: 12, depth: 6, color: '#ef4444', price: 1.25 },
  
  // General products
  { id: 'p17', name: 'Notebook', category: 'general', width: 21, height: 30, depth: 2, color: '#6366f1', price: 12.99 },
  { id: 'p18', name: 'Pen Set', category: 'general', width: 15, height: 20, depth: 3, color: '#1f2937', price: 8.99 },
  { id: 'p19', name: 'Calendar', category: 'general', width: 25, height: 35, depth: 1, color: '#7c3aed', price: 15.99 },
  { id: 'p20', name: 'Desk Lamp', category: 'general', width: 20, height: 35, depth: 20, color: '#059669', price: 45.99 },
  
  // Specialty products
  { id: 'p21', name: 'Art Supplies', category: 'specialty', width: 30, height: 25, depth: 15, color: '#8b5cf6', price: 89.99 },
  { id: 'p22', name: 'Guitar Strings', category: 'specialty', width: 12, height: 15, depth: 2, color: '#dc2626', price: 24.99 },
  { id: 'p23', name: 'Yoga Mat', category: 'specialty', width: 60, height: 20, depth: 5, color: '#10b981', price: 39.99 },
  { id: 'p24', name: 'Board Game', category: 'specialty', width: 30, height: 30, depth: 8, color: '#f59e0b', price: 34.99 },
  
  // Premium products
  { id: 'p25', name: 'Luxury Watch', category: 'premium', width: 15, height: 8, depth: 5, color: '#374151', price: 2499 },
  { id: 'p26', name: 'Designer Bag', category: 'premium', width: 35, height: 25, depth: 15, color: '#7c2d12', price: 899 },
  { id: 'p27', name: 'Perfume', category: 'premium', width: 8, height: 15, depth: 5, color: '#ec4899', price: 159 },
  { id: 'p28', name: 'Silk Scarf', category: 'premium', width: 25, height: 2, depth: 25, color: '#8b5cf6', price: 129 },
  
  // Home products
  { id: 'p29', name: 'Coffee Mug', category: 'home', width: 12, height: 10, depth: 12, color: '#92400e', price: 14.99 },
  { id: 'p30', name: 'Picture Frame', category: 'home', width: 20, height: 25, depth: 3, color: '#059669', price: 19.99 },
  { id: 'p31', name: 'Candle', category: 'home', width: 8, height: 12, depth: 8, color: '#f59e0b', price: 12.99 },
  { id: 'p32', name: 'Plant Pot', category: 'home', width: 15, height: 18, depth: 15, color: '#16a34a', price: 24.99 },
];

export const useProductStore = create<ProductStore>((set, get) => ({
  currentShelfAnalysis: null,
  selectedShelfId: null,
  availableProducts: mockProducts,
  isLoading: false,

  setSelectedShelf: (shelfId) => {
    set({ selectedShelfId: shelfId });
    if (!shelfId) {
      set({ currentShelfAnalysis: null });
    }
  },

  loadShelfAnalysis: (shelfId, shelfWidth, shelfHeight, zoneCategory) => {
    set({ isLoading: true });
    
    // Simulate loading delay for realistic UX
    setTimeout(() => {
      const slotSize = 40; // 40cm slots
      const slots = get().generateShelfGrid(shelfWidth, shelfHeight, slotSize);
      
      const layout: ShelfLayout = {
        shelfId,
        rows: Math.floor(shelfHeight / slotSize),
        columns: Math.floor(shelfWidth / slotSize),
        slots,
        products: []
      };

      const analysis: ShelfAnalysis = {
        shelfId,
        layout,
        metrics: {
          totalSlots: slots.length,
          occupiedSlots: 0,
          utilization: 0,
          revenue: 0
        }
      };

      set({ 
        currentShelfAnalysis: analysis,
        selectedShelfId: shelfId,
        isLoading: false 
      });
    }, 500);
  },

  addProductToShelf: (productId, slotId) => {
    const state = get();
    if (!state.currentShelfAnalysis) return;

    const product = state.availableProducts.find(p => p.id === productId);
    if (!product) return;

    const updatedSlots = state.currentShelfAnalysis.layout.slots.map(slot => {
      if (slot.id === slotId && !slot.isOccupied) {
        return { ...slot, productId, isOccupied: true };
      }
      return slot;
    });

    const updatedProducts = [...state.currentShelfAnalysis.layout.products, product];
    const occupiedSlots = updatedSlots.filter(slot => slot.isOccupied).length;
    const totalSlots = updatedSlots.length;
    const revenue = updatedProducts.reduce((sum, p) => sum + (p.price || 0), 0);

    const updatedAnalysis: ShelfAnalysis = {
      ...state.currentShelfAnalysis,
      layout: {
        ...state.currentShelfAnalysis.layout,
        slots: updatedSlots,
        products: updatedProducts
      },
      metrics: {
        totalSlots,
        occupiedSlots,
        utilization: (occupiedSlots / totalSlots) * 100,
        revenue
      }
    };

    set({ currentShelfAnalysis: updatedAnalysis });
  },

  removeProductFromShelf: (slotId) => {
    const state = get();
    if (!state.currentShelfAnalysis) return;

    const slotToRemove = state.currentShelfAnalysis.layout.slots.find(slot => slot.id === slotId);
    if (!slotToRemove || !slotToRemove.productId) return;

    const updatedSlots = state.currentShelfAnalysis.layout.slots.map(slot => {
      if (slot.id === slotId) {
        return { ...slot, productId: undefined, isOccupied: false };
      }
      return slot;
    });

    const updatedProducts = state.currentShelfAnalysis.layout.products.filter(
      product => product.id !== slotToRemove.productId
    );

    const occupiedSlots = updatedSlots.filter(slot => slot.isOccupied).length;
    const totalSlots = updatedSlots.length;
    const revenue = updatedProducts.reduce((sum, p) => sum + (p.price || 0), 0);

    const updatedAnalysis: ShelfAnalysis = {
      ...state.currentShelfAnalysis,
      layout: {
        ...state.currentShelfAnalysis.layout,
        slots: updatedSlots,
        products: updatedProducts
      },
      metrics: {
        totalSlots,
        occupiedSlots,
        utilization: (occupiedSlots / totalSlots) * 100,
        revenue
      }
    };

    set({ currentShelfAnalysis: updatedAnalysis });
  },

  moveProduct: (fromSlotId, toSlotId) => {
    const state = get();
    if (!state.currentShelfAnalysis) return;

    const fromSlot = state.currentShelfAnalysis.layout.slots.find(slot => slot.id === fromSlotId);
    const toSlot = state.currentShelfAnalysis.layout.slots.find(slot => slot.id === toSlotId);

    if (!fromSlot || !toSlot || !fromSlot.productId || toSlot.isOccupied) return;

    const updatedSlots = state.currentShelfAnalysis.layout.slots.map(slot => {
      if (slot.id === fromSlotId) {
        return { ...slot, productId: undefined, isOccupied: false };
      }
      if (slot.id === toSlotId) {
        return { ...slot, productId: fromSlot.productId, isOccupied: true };
      }
      return slot;
    });

    const updatedAnalysis: ShelfAnalysis = {
      ...state.currentShelfAnalysis,
      layout: {
        ...state.currentShelfAnalysis.layout,
        slots: updatedSlots
      }
    };

    set({ currentShelfAnalysis: updatedAnalysis });
  },

  generateShelfGrid: (width, height, slotSize) => {
    const slots: ShelfSlot[] = [];
    const rows = Math.floor(height / slotSize);
    const columns = Math.floor(width / slotSize);

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
        slots.push({
          id: `slot-${row}-${col}`,
          x: col * slotSize,
          y: row * slotSize,
          width: slotSize,
          height: slotSize,
          isOccupied: false
        });
      }
    }

    return slots;
  },

  getProductsByCategory: (category) => {
    const state = get();
    return state.availableProducts.filter(product => 
      product.category.toLowerCase().includes(category.toLowerCase()) ||
      category.toLowerCase().includes(product.category.toLowerCase())
    );
  },

  clearShelfAnalysis: () => {
    set({ 
      currentShelfAnalysis: null, 
      selectedShelfId: null 
    });
  }
}));
