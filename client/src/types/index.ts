export interface Zone {
  id: string;
  name: string;
  color: string;
  x: number;
  y: number;
  width: number;
  height: number;
  isOverlapping?: boolean; // Flag to indicate if zone overlaps with others
}

export interface Store {
  width: number;
  height: number;
  zones: Zone[];
}

export interface LayoutSuggestion {
  id: string;
  name: string;
  description: string;
  zones: Zone[];
  efficiency: number;
}

export interface LayoutMetrics {
  utilization: number;     // Percentage of store area covered by zones
  overlappingZones: boolean; // Whether any zones are overlapping
  unusedSpace: number;     // Square meters of unused space
}

export interface Shelf {
  id: string;
  name: string;
  category: string;
  x: number; // Position within zone
  y: number;
  width: number;
  height: number;
  zoneId: string;
  isOverlapping?: boolean;
}

export interface ShelfMetrics {
  utilization: number;
  overlappingShelves: boolean;
  unusedSpace: number;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  width: number;
  height: number;
  depth: number;
  color: string;
  price?: number;
}

export interface ShelfSlot {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  productId?: string;
  isOccupied: boolean;
}

export interface ShelfLayout {
  shelfId: string;
  rows: number;
  columns: number;
  slots: ShelfSlot[];
  products: Product[];
}

export interface ShelfAnalysis {
  shelfId: string;
  layout: ShelfLayout;
  metrics: {
    totalSlots: number;
    occupiedSlots: number;
    utilization: number;
    revenue: number;
  };
}
