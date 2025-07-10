# Zone Analyser Feature - Technical Implementation Plan

## Feature Overview

The Zone Analyser is a new page that provides detailed analysis and shelf management for individual zones with **intelligent shelf optimization capabilities**. When users click on any zone in the store layout, they will be redirected to a dedicated analysis page that displays shelves categorized by product types relevant to that specific zone. 

**Core Objective**: Implement the same optimization features found in the main layout (zone optimization) but applied to **shelves within zones**, following DRY principles by reusing existing optimization patterns, state management strategies, and AI integration approaches.

## Current Codebase Analysis

### Existing Architecture
The application currently uses:
- **Next.js 14** with App Router (`src/app/` structure)
- **Zustand** for state management (`useStoreDesigner.ts`)
- **Three.js + React Three Fiber** for 3D/2D canvas interactions
- **TypeScript** with comprehensive type definitions
- **Tailwind CSS** for consistent styling

### Key Integration Points
1. **Zone Click Events**: Currently handled in `ZoneModel3D.tsx` and `ResizableZone.tsx`
2. **Zone Selection**: Managed via `selectZone()` in Zustand store
3. **Navigation**: Basic structure exists in `Navbar.tsx` with hardcoded navigation items
4. **Styling**: Consistent design system using Tailwind CSS
5. **Optimization Patterns**: Existing `optimizeLayout()`, `detectOverlaps()`, and `calculateLayoutMetrics()` functions that we'll adapt for shelf optimization
6. **AI Integration**: Current `aiService.ts` patterns for generating layout suggestions that we'll extend for shelf arrangement

## Technical Implementation Plan

### 1. Component Structure

#### New Components to Create

```
src/
├── app/
│   └── zone/
│       └── [id]/
│           └── page.tsx          # Dynamic zone analyser page
├── components/
│   ├── ZoneAnalyser/            # New component directory
│   │   ├── ZoneAnalyser.tsx     # Main analyser container
│   │   ├── ZoneHeader.tsx       # Zone info header with breadcrumbs
│   │   ├── ShelfGrid.tsx        # Grid layout for shelves
│   │   ├── ShelfCard.tsx        # Individual shelf component
│   │   ├── ProductCategories.tsx # Category management
│   │   ├── ZoneMetrics.tsx      # Zone-specific analytics
│   │   └── ZoneSettings.tsx     # Zone configuration panel
│   └── shared/
│       ├── BackButton.tsx       # Navigation back button
│       └── LoadingSpinner.tsx   # Loading state component
```

### 2. Routing Logic

#### Dynamic Route Implementation
- **Route**: `/zone/[id]` - Dynamic route for individual zones
- **Navigation**: Programmatic navigation using Next.js 14 App Router
- **URL Structure**: `/zone/electronics-zone-1` (SEO-friendly)

#### Navigation Integration Points
1. **Canvas Click Handler**: Modify `ZoneModel3D.tsx` and `ResizableZone.tsx`
2. **Sidebar Integration**: Update `ZoneItem.tsx` to include navigation option
3. **Breadcrumb Navigation**: Implement in new `ZoneHeader.tsx`

### 3. Data Fetching & Storage

#### Extended Type Definitions
```typescript
// src/types/index.ts - New interfaces

export interface Shelf {
  id: string;
  name: string;
  category: string;
  position: { x: number; y: number };
  dimensions: { width: number; height: number; depth: number };
  capacity: number;
  currentStock: number;
  products: Product[];
  zoneId: string;
  isOverlapping?: boolean; // Mirror zone overlap detection
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  sku: string;
  stockLevel: number;
  reorderPoint: number;
}

export interface ShelfSuggestion {
  id: string;
  name: string;
  description: string;
  shelves: Shelf[];
  efficiency: number;
  strategy: 'accessibility' | 'sales' | 'inventory'; // Mirror zone strategy types
}

export interface ShelfMetrics {
  utilization: number;      // Percentage of zone area covered by shelves
  overlappingShelves: boolean; // Whether any shelves overlap
  unusedSpace: number;      // Square meters of unused zone space
  categoryDistribution: Record<string, number>;
  averageAccessibility: number;
}

export interface ZoneAnalysis {
  id: string;
  zoneName: string;
  totalShelves: number;
  categories: ProductCategory[];
  metrics: ShelfMetrics; // Updated to use ShelfMetrics
  shelves: Shelf[];
  lastUpdated: Date;
  suggestions: ShelfSuggestion[]; // AI-generated shelf optimization suggestions
}

export interface ProductCategory {
  id: string;
  name: string;
  color: string;
  shelfCount: number;
  productCount: number;
  revenue: number;
}
```

#### State Management Extension
```typescript
// src/store/useZoneAnalyser.ts - New Zustand store (Following DRY principles from useStoreDesigner.ts)

interface ZoneAnalyserState {
  currentZoneAnalysis: ZoneAnalysis | null;
  shelves: Shelf[];
  categories: ProductCategory[];
  selectedShelf: Shelf | null;
  isEditingShelf: boolean;
  isGeneratingSuggestions: boolean; // Mirror AI loading state from main store
  suggestions: ShelfSuggestion[]; // Mirror suggestion pattern
  shelfMetrics: ShelfMetrics;
  isLoading: boolean;
  error: string | null;
  
  // Actions (Mirror zone management patterns)
  setCurrentZone: (zoneId: string) => void;
  loadZoneAnalysis: (zoneId: string) => Promise<void>;
  
  // Shelf CRUD Operations (Mirror zone operations)
  addShelf: (shelf: Omit<Shelf, 'id'>) => void;
  updateShelf: (id: string, updates: Partial<Shelf>) => void;
  deleteShelf: (id: string) => void;
  selectShelf: (shelf: Shelf | null) => void;
  setEditingShelf: (isEditing: boolean) => void;
  
  // Optimization Functions (Mirror zone optimization)
  detectShelfOverlaps: () => void;
  calculateShelfMetrics: () => ShelfMetrics;
  optimizeShelfLayout: () => void;
  
  // AI Integration (Mirror existing AI patterns)
  setSuggestions: (suggestions: ShelfSuggestion[]) => void;
  setGeneratingSuggestions: (isGenerating: boolean) => void;
  applySuggestion: (suggestion: ShelfSuggestion) => void;
  
  // Category Management
  updateCategory: (id: string, updates: Partial<ProductCategory>) => void;
}
```

#### Mock Data Service
```typescript
// src/services/zoneDataService.ts - Mock data provider (Following existing aiService.ts patterns)

class ZoneDataService {
  // Generate realistic shelf data based on zone type
  generateShelvesForZone(zone: Zone): Shelf[]
  
  // Get product categories relevant to zone type (Using existing zone category mapping)
  getCategoriesForZone(zoneName: string): ProductCategory[]
  
  // Calculate zone-specific metrics (Mirror calculateLayoutMetrics)
  calculateShelfMetrics(shelves: Shelf[], zoneArea: number): ShelfMetrics
  
  // AI-powered shelf optimization (Extend existing AI service)
  generateShelfSuggestions(
    zone: Zone, 
    currentShelves: Shelf[]
  ): Promise<ShelfSuggestion[]>
  
  // Overlap detection for shelves (Mirror doZonesOverlap logic)
  doShelvesOverlap(shelf1: Shelf, shelf2: Shelf): boolean
  
  // Automatic shelf optimization (Mirror optimizeLayout logic)
  optimizeShelfArrangement(
    shelves: Shelf[], 
    zoneWidth: number, 
    zoneHeight: number
  ): Shelf[]
}
```

#### Extended AI Service Integration
```typescript
// src/services/aiService.ts - Extended for shelf optimization

class AIService {
  // ... existing methods
  
  // New method for shelf optimization
  async generateShelfOptimizationSuggestions(
    zone: Zone,
    currentShelves: Shelf[],
    categories: ProductCategory[]
  ): Promise<ShelfSuggestion[]> {
    // Similar to generateLayoutSuggestions but for shelves
    // Follow same error handling and fallback patterns
  }
  
  private createShelfOptimizationPrompt(
    zone: Zone,
    shelves: Shelf[],
    categories: ProductCategory[]
  ): string {
    // Mirror createLayoutPrompt structure for shelves
  }
  
  private parseShelfAIResponse(
    text: string,
    zone: Zone,
    existingShelves?: Shelf[]
  ): ShelfSuggestion[] {
    // Mirror parseAIResponse for shelf suggestions
  }
}
```

### 4. Integration with Existing Store Layout

#### Zone Click Navigation
```typescript
// Modified: src/components/LayoutCanvas/ZoneModel3D.tsx
import { useRouter } from 'next/navigation';

const handleClick = (e: ThreeEvent<MouseEvent>) => {
  e.stopPropagation();
  
  // Option 1: Direct navigation
  router.push(`/zone/${zone.id}`);
  
  // Option 2: Show context menu with navigation option
  setShowContextMenu(true);
};
```

#### Enhanced Zone Selection
```typescript
// Modified: src/store/useStoreDesigner.ts
interface StoreState {
  // ...existing state
  navigationMode: 'select' | 'analyse';
  
  // New actions
  setNavigationMode: (mode: 'select' | 'analyse') => void;
  navigateToZoneAnalysis: (zoneId: string) => void;
}
```

### 5. Zone-Specific Shelf Categories

#### Category Mapping Logic
```typescript
// src/utils/zoneCategoryMapping.ts

const ZONE_CATEGORY_MAPPING = {
  'electronics': [
    { name: 'Mobiles', color: '#3b82f6', icon: 'Smartphone' },
    { name: 'Laptops', color: '#1e40af', icon: 'Laptop' },
    { name: 'Headphones', color: '#7c3aed', icon: 'Headphones' },
    { name: 'Gaming', color: '#059669', icon: 'Gamepad2' },
    { name: 'Accessories', color: '#dc2626', icon: 'Cable' }
  ],
  'grocery': [
    { name: 'Fresh Produce', color: '#16a34a', icon: 'Apple' },
    { name: 'Dairy', color: '#facc15', icon: 'Milk' },
    { name: 'Packaged Foods', color: '#ea580c', icon: 'Package' },
    { name: 'Beverages', color: '#0ea5e9', icon: 'Coffee' },
    { name: 'Frozen Foods', color: '#6366f1', icon: 'Snowflake' }
  ],
  'clothing': [
    { name: 'Men\'s Wear', color: '#1f2937', icon: 'User' },
    { name: 'Women\'s Wear', color: '#ec4899', icon: 'UserCheck' },
    { name: 'Kids\' Wear', color: '#f59e0b', icon: 'Baby' },
    { name: 'Footwear', color: '#8b5cf6', icon: 'Footprints' },
    { name: 'Accessories', color: '#06b6d4', icon: 'Watch' }
  ]
  // ... more mappings
};
```

### 6. UI/UX Design Specifications

#### Layout Structure
```typescript
// Zone Analyser Page Layout (Mirror main layout structure with optimization tools)
<div className="min-h-screen bg-gray-50">
  <Navbar />
  <div className="container mx-auto px-6 py-8">
    <ZoneHeader zone={zone} onBack={handleBack} />
    
    {/* Optimization Controls (Mirror main layout controls) */}
    <div className="mb-6 flex justify-between items-center">
      <div className="flex gap-4">
        <button
          onClick={optimizeShelfLayout}
          className="bg-purple-600 text-white px-4 py-2 rounded shadow hover:bg-purple-700 transition flex items-center gap-1"
          title="Automatically optimize shelf layout to eliminate overlaps"
        >
          <Layers size={16} /> Optimize Shelves
        </button>
        
        <button
          onClick={generateShelfSuggestions}
          disabled={isGeneratingSuggestions}
          className="bg-violet-600 text-white px-4 py-2 rounded shadow hover:bg-violet-700 transition flex items-center gap-1"
        >
          <Wand2 size={16} /> AI Suggestions
        </button>
      </div>
      
      {/* Metrics Display (Mirror layout metrics) */}
      <div className="bg-white p-3 rounded shadow text-sm">
        <div className="font-semibold">Zone: {zone.name} ({zone.width}m × {zone.height}m)</div>
        <div className="flex items-center gap-1 mt-1">
          {shelfMetrics.overlappingShelves ? 
            <AlertCircle size={14} className="text-red-500" /> : 
            <CheckCircle size={14} className="text-green-500" />}
          <span className={shelfMetrics.overlappingShelves ? "text-red-500" : "text-green-500"}>
            {shelfMetrics.overlappingShelves ? 'Shelves overlapping' : 'No overlaps'}
          </span>
        </div>
        <div className="mt-1">
          Space utilization: 
          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
            <div 
              className={`h-2 rounded-full ${shelfMetrics.utilization > 95 ? 'bg-green-500' : 'bg-blue-500'}`} 
              style={{ width: `${shelfMetrics.utilization}%` }}
            ></div>
          </div>
          <span className="text-xs text-gray-500">
            {shelfMetrics.utilization.toFixed(1)}% used ({shelfMetrics.unusedSpace.toFixed(1)}m² unused)
          </span>
        </div>
      </div>
    </div>
    
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Main Content Area - Interactive Shelf Canvas */}
      <div className="lg:col-span-3">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <ShelfCanvas 
            zone={zone}
            shelves={shelves}
            onShelfUpdate={updateShelf}
            onShelfSelect={selectShelf}
            selectedShelf={selectedShelf}
          />
        </div>
        
        {/* Shelf Grid (Secondary view) */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <ShelfGrid shelves={shelves} />
        </div>
      </div>
      
      {/* Right Sidebar (Mirror AI Assistant structure) */}
      <div className="space-y-6">
        <ShelfMetrics metrics={shelfMetrics} />
        <ShelfAIAssistant 
          zone={zone}
          shelves={shelves}
          suggestions={suggestions}
          isGenerating={isGeneratingSuggestions}
        />
        <ProductCategories categories={categories} />
        <ZoneSettings zone={zone} />
      </div>
    </div>
  </div>
</div>
```

#### Consistent Design System
- **Colors**: Maintain existing Tailwind color palette
- **Typography**: Use Inter font family from existing system
- **Components**: Follow established patterns from Sidebar and Canvas components
- **Icons**: Continue using Lucide React icons
- **Spacing**: Consistent with existing 6-unit grid system

### 7. DRY Implementation Strategy & Shelf Optimization

#### Code Reusability Patterns
Following DRY principles, we'll create reusable optimization utilities that can work with both zones and shelves:

```typescript
// src/utils/optimizationUtils.ts - Generic optimization utilities

interface OptimizableItem {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  isOverlapping?: boolean;
}

class OptimizationEngine<T extends OptimizableItem> {
  // Generic overlap detection (used for both zones and shelves)
  detectOverlaps(items: T[]): T[] {
    const itemsWithOverlapStatus = items.map(item => ({ ...item, isOverlapping: false }));
    
    for (let i = 0; i < itemsWithOverlapStatus.length; i++) {
      for (let j = i + 1; j < itemsWithOverlapStatus.length; j++) {
        if (this.doItemsOverlap(itemsWithOverlapStatus[i], itemsWithOverlapStatus[j])) {
          itemsWithOverlapStatus[i].isOverlapping = true;
          itemsWithOverlapStatus[j].isOverlapping = true;
        }
      }
    }
    
    return itemsWithOverlapStatus;
  }
  
  // Generic overlap check (reused from zone logic)
  private doItemsOverlap(item1: T, item2: T): boolean {
    return !(
      item1.x + item1.width <= item2.x ||
      item1.x >= item2.x + item2.width ||
      item1.y + item1.height <= item2.y ||
      item1.y >= item2.y + item2.height
    );
  }
  
  // Generic metrics calculation
  calculateUtilization(items: T[], containerWidth: number, containerHeight: number) {
    const containerArea = containerWidth * containerHeight;
    let itemArea = 0;
    
    items.forEach(item => {
      itemArea += item.width * item.height;
    });
    
    const utilization = Math.min(100, (itemArea / containerArea) * 100);
    const unusedSpace = containerArea - itemArea;
    const hasOverlap = items.some(item => item.isOverlapping);
    
    return {
      utilization,
      overlapping: hasOverlap,
      unusedSpace: unusedSpace > 0 ? unusedSpace : 0
    };
  }
  
  // Generic layout optimization
  optimizeLayout(items: T[], containerWidth: number, containerHeight: number): T[] {
    let currentX = 0;
    let currentY = 0;
    let maxHeightInRow = 0;
    
    return items.map(item => {
      // If adding this item would exceed container width, move to next row
      if (currentX + item.width > containerWidth) {
        currentX = 0;
        currentY += maxHeightInRow;
        maxHeightInRow = 0;
      }
      
      // If item won't fit in remaining vertical space, scale it down
      if (currentY + item.height > containerHeight) {
        const scaleFactor = (containerHeight - currentY) / item.height;
        item.height = containerHeight - currentY;
        item.width = Math.max(1, item.width * scaleFactor);
      }
      
      const optimizedItem = {
        ...item,
        x: currentX,
        y: currentY,
        isOverlapping: false
      };
      
      currentX += item.width;
      maxHeightInRow = Math.max(maxHeightInRow, item.height);
      
      return optimizedItem;
    });
  }
}

// Specialized instances
export const zoneOptimizer = new OptimizationEngine<Zone>();
export const shelfOptimizer = new OptimizationEngine<Shelf>();
```

#### Shelf-Specific Optimization Features

```typescript
// src/utils/shelfOptimization.ts - Shelf-specific optimization logic

export class ShelfOptimizationEngine extends OptimizationEngine<Shelf> {
  // Shelf-specific optimization strategies
  optimizeForAccessibility(shelves: Shelf[], zone: Zone): Shelf[] {
    // High-traffic items closer to zone entrance
    // Mirror the zone optimization logic but for shelf placement
    return this.arrangeByStrategy(shelves, zone, 'accessibility');
  }
  
  optimizeForSales(shelves: Shelf[], zone: Zone): Shelf[] {
    // High-value items at eye level and prime locations
    return this.arrangeByStrategy(shelves, zone, 'sales');
  }
  
  optimizeForInventory(shelves: Shelf[], zone: Zone): Shelf[] {
    // Group by category, minimize restocking movement
    return this.arrangeByStrategy(shelves, zone, 'inventory');
  }
  
  private arrangeByStrategy(shelves: Shelf[], zone: Zone, strategy: string): Shelf[] {
    // Implementation mirrors zone optimization patterns
    // But considers shelf-specific factors like category, height, accessibility
    const sortedShelves = this.sortShelvesForStrategy(shelves, strategy);
    return this.optimizeLayout(sortedShelves, zone.width, zone.height);
  }
  
  private sortShelvesForStrategy(shelves: Shelf[], strategy: string): Shelf[] {
    switch (strategy) {
      case 'accessibility':
        return shelves.sort((a, b) => {
          // Prioritize high-traffic categories
          const accessibilityScore = (shelf: Shelf) => {
            if (shelf.category === 'essentials') return 3;
            if (shelf.category === 'popular') return 2;
            return 1;
          };
          return accessibilityScore(b) - accessibilityScore(a);
        });
        
      case 'sales':
        return shelves.sort((a, b) => {
          // Prioritize high-margin products
          const avgProductValue = (shelf: Shelf) => 
            shelf.products.reduce((sum, p) => sum + p.price, 0) / shelf.products.length;
          return avgProductValue(b) - avgProductValue(a);
        });
        
      case 'inventory':
        return shelves.sort((a, b) => a.category.localeCompare(b.category));
        
      default:
        return shelves;
    }
  }
}

export const shelfOptimizer = new ShelfOptimizationEngine();
```

#### AI Integration for Shelf Optimization

```typescript
// Extended AI Service for shelf optimization (src/services/aiService.ts)

class AIService {
  // ... existing methods
  
  async generateShelfOptimizationSuggestions(
    zone: Zone,
    currentShelves: Shelf[],
    categories: ProductCategory[]
  ): Promise<ShelfSuggestion[]> {
    if (!this.genAI) {
      console.warn('Gemini API key not configured');
      return this.getFallbackShelfSuggestions(zone, currentShelves, categories);
    }

    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
      const prompt = this.createShelfOptimizationPrompt(zone, currentShelves, categories);
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return this.parseShelfAIResponse(text, zone, currentShelves);
    } catch (error) {
      console.error('Error generating shelf optimization suggestions:', error);
      return this.getFallbackShelfSuggestions(zone, currentShelves, categories);
    }
  }
  
  private createShelfOptimizationPrompt(
    zone: Zone,
    shelves: Shelf[],
    categories: ProductCategory[]
  ): string {
    const shelfDescriptions = shelves.map(
      (shelf) => `${shelf.name} (${shelf.dimensions.width}m x ${shelf.dimensions.height}m, Category: ${shelf.category})`
    ).join(', ');

    return `
You are a retail merchandising expert. Generate 3 optimal shelf layout suggestions for the "${zone.name}" zone (${zone.width}m x ${zone.height}m).

Current shelves that MUST be included: ${shelfDescriptions}

Available categories: ${categories.map(c => c.name).join(', ')}

Please provide 3 different shelf arrangement suggestions that optimize:
1. Customer accessibility and traffic flow
2. Sales maximization through strategic placement
3. Inventory management and restocking efficiency

For each suggestion, provide:
- A descriptive name
- Brief explanation of the arrangement strategy
- Optimal positioning for each shelf within the zone
- Efficiency score (1-100)

Format your response as valid JSON with this structure:
{
  "suggestions": [
    {
      "name": "Arrangement Name",
      "description": "Brief description",
      "strategy": "accessibility|sales|inventory",
      "efficiency": 85,
      "shelves": [
        {
          "name": "Shelf Name",
          "category": "category",
          "x": 0,
          "y": 0,
          "width": 2,
          "height": 1
        }
      ]
    }
  ]
}

Requirements:
- Include exactly ${shelves.length} shelves in each suggestion
- All shelves must fit within the ${zone.width}m x ${zone.height}m zone without overlapping
- Consider customer flow patterns and accessibility
- Optimize high-value product placement for maximum visibility
`;
  }
  
  private getFallbackShelfSuggestions(
    zone: Zone,
    shelves: Shelf[],
    categories: ProductCategory[]
  ): ShelfSuggestion[] {
    // Mirror the fallback pattern from zone suggestions
    return [
      {
        id: 'shelf-fallback-1',
        name: 'Accessibility Optimized',
        description: 'Arrangement designed for easy customer navigation and access',
        strategy: 'accessibility',
        efficiency: 82,
        shelves: shelfOptimizer.optimizeForAccessibility(shelves, zone),
      },
      {
        id: 'shelf-fallback-2',
        name: 'Sales Maximized',
        description: 'High-value products positioned for maximum visibility and impulse purchases',
        strategy: 'sales',
        efficiency: 88,
        shelves: shelfOptimizer.optimizeForSales(shelves, zone),
      },
      {
        id: 'shelf-fallback-3',
        name: 'Inventory Efficient',
        description: 'Grouped by category to minimize restocking time and effort',
        strategy: 'inventory',
        efficiency: 79,
        shelves: shelfOptimizer.optimizeForInventory(shelves, zone),
      }
    ];
  }
}
```

#### Interactive Shelf Canvas Component

```typescript
// src/components/ZoneAnalyser/ShelfCanvas.tsx - Mirror LayoutCanvas structure

export default function ShelfCanvas({ 
  zone, 
  shelves, 
  onShelfUpdate, 
  onShelfSelect, 
  selectedShelf 
}: ShelfCanvasProps) {
  const {
    shelfMetrics,
    calculateShelfMetrics,
    detectShelfOverlaps,
    optimizeShelfLayout
  } = useZoneAnalyser();
  
  const [is3DView, setIs3DView] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  // Mirror the main canvas structure but for shelves
  return (
    <div className="relative w-full h-full bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg shadow-lg overflow-hidden">
      <Canvas>
        {is3DView ? (
          <>
            <PerspectiveCamera makeDefault position={[zone.width/2, 15, zone.height + zone.width/2]} />
            <ShelfCameraControls3D zoneWidth={zone.width} zoneHeight={zone.height} />
            <ambientLight intensity={0.6} />
            <directionalLight position={[10, 10, 5]} intensity={0.8} />
            
            <ZoneFloor width={zone.width} height={zone.height} />
            {shelves.map((shelf) => (
              <ShelfModel3D
                key={shelf.id}
                shelf={shelf}
                isSelected={selectedShelf?.id === shelf.id}
                onSelect={() => onShelfSelect(shelf)}
              />
            ))}
          </>
        ) : (
          <>
            <OrthographicCamera makeDefault />
            <ShelfCameraController zoneWidth={zone.width} zoneHeight={zone.height} />
            
            <ZoneFloor width={zone.width} height={zone.height} />
            
            {shelves.map((shelf) => (
              <ResizableShelf
                key={shelf.id}
                shelf={shelf}
                zoneWidth={zone.width}
                zoneHeight={zone.height}
                onUpdate={onShelfUpdate}
                onSelect={onShelfSelect}
                isSelected={selectedShelf?.id === shelf.id}
              />
            ))}
          </>
        )}
      </Canvas>
      
      {/* Shelf metrics display (Mirror layout metrics) */}
      <div className="absolute bottom-4 left-4 bg-white p-3 rounded shadow text-sm">
        <div className="font-semibold">Zone: {zone.name} ({zone.width}m × {zone.height}m)</div>
        
        {selectedShelf && (
          <div className="mt-1 text-gray-700">
            Selected: {selectedShelf.name} ({selectedShelf.dimensions.width.toFixed(1)}×{selectedShelf.dimensions.height.toFixed(1)}m)
          </div>
        )}
        
        <div className="mt-2 font-semibold text-gray-800">Shelf Metrics:</div>
        
        <div className="flex items-center gap-1 mt-1">
          {shelfMetrics.overlappingShelves ? 
            <AlertCircle size={14} className="text-red-500" /> : 
            <CheckCircle size={14} className="text-green-500" />}
          <span className={shelfMetrics.overlappingShelves ? "text-red-500" : "text-green-500"}>
            {shelfMetrics.overlappingShelves ? 'Shelves overlapping' : 'No overlaps'}
          </span>
        </div>
        
        <div className="mt-1">
          Space utilization: 
          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
            <div 
              className={`h-2 rounded-full ${shelfMetrics.utilization > 95 ? 'bg-green-500' : 'bg-blue-500'}`} 
              style={{ width: `${shelfMetrics.utilization}%` }}
            ></div>
          </div>
          <span className="text-xs text-gray-500">
            {shelfMetrics.utilization.toFixed(1)}% used ({shelfMetrics.unusedSpace.toFixed(1)}m² unused)
          </span>
        </div>
      </div>

      {/* Optimization controls (Mirror main layout controls) */}
      <div className="absolute top-4 left-4 flex flex-col gap-2">
        <button
          onClick={optimizeShelfLayout}
          className="bg-purple-600 text-white px-4 py-2 rounded shadow hover:bg-purple-700 transition flex items-center gap-1"
          title="Automatically optimize shelf layout to eliminate overlaps"
        >
          <Layers size={16} /> Optimize Shelves
        </button>

        {shelfMetrics.overlappingShelves && (
          <div className="bg-red-100 border border-red-500 text-red-700 px-3 py-1 rounded text-xs flex items-center gap-1">
            <AlertCircle size={14} />
            Overlapping shelves detected
          </div>
        )}
      </div>

      {/* View controls */}
      <div className="absolute top-4 right-4 flex gap-2">
        <button
          onClick={() => setIs3DView(!is3DView)}
          className="bg-purple-600 text-white px-4 py-2 rounded shadow hover:bg-purple-700 transition flex items-center gap-1"
        >
          <Eye size={16} /> {is3DView ? '2D View' : '3D View'}
        </button>
      </div>
    </div>
  );
}
```

### 8. Implementation Phases

#### Phase 1: Core Infrastructure & DRY Setup (Week 1)
1. Create generic optimization utilities (`OptimizationEngine<T>`)
2. Extract reusable patterns from existing zone management code
3. Set up dynamic route structure `/zone/[id]`
4. Create basic Zone Analyser page component
5. Extend type definitions for shelves and products
6. Create new Zustand store following existing patterns

#### Phase 2: Shelf Optimization Engine (Week 1.5)
1. Implement `ShelfOptimizationEngine` extending generic optimization
2. Create shelf-specific optimization strategies (accessibility, sales, inventory)
3. Build overlap detection and metrics calculation for shelves
4. Implement automatic shelf layout optimization
5. Add shelf suggestion generation (fallback system)

#### Phase 3: Navigation Integration & Canvas (Week 2)
1. Modify zone click handlers in 3D/2D canvas components
2. Create `ShelfCanvas` component mirroring `LayoutCanvas` structure
3. Build `ResizableShelf` and `ShelfModel3D` components
4. Implement back navigation and breadcrumbs
5. Add loading states and error handling

#### Phase 4: AI Integration & Advanced Features (Week 2.5)
1. Extend AI service for shelf optimization suggestions
2. Create `ShelfAIAssistant` component mirroring existing AI assistant
3. Implement AI prompt generation for shelf arrangements
4. Add suggestion application and management
5. Integrate with existing store state

#### Phase 5: UI Components & Interactions (Week 3)
1. Build interactive shelf management interface
2. Create ProductCategories management with optimization insights
3. Implement ShelfMetrics dashboard with real-time updates
4. Add ZoneSettings configuration panel
5. Build shelf drag-and-drop interactions

#### Phase 6: Polish, Testing & Performance (Week 1)
1. Add animations and micro-interactions
2. Implement responsive design optimizations
3. Add error boundaries and fallback states
4. Performance optimization and code splitting
5. Test integration with existing features

### 9. File Structure Details

#### New Components to Create
```
src/
├── app/
│   └── zone/
│       └── [id]/
│           ├── page.tsx                    # Main zone analyser page
│           ├── loading.tsx                 # Loading component
│           └── error.tsx                   # Error boundary
├── components/
│   └── ZoneAnalyser/
│       ├── ZoneAnalyser.tsx               # Container component
│       ├── ZoneHeader.tsx                 # Header with breadcrumbs
│       ├── ShelfCanvas.tsx                # Interactive shelf canvas (Mirror LayoutCanvas)
│       ├── ResizableShelf.tsx             # Interactive shelf component (Mirror ResizableZone)
│       ├── ShelfModel3D.tsx               # 3D shelf representations (Mirror ZoneModel3D)
│       ├── ShelfGrid.tsx                  # Grid of shelves
│       ├── ShelfCard.tsx                  # Individual shelf
│       ├── ShelfAIAssistant.tsx           # AI suggestions for shelves (Mirror AIAssistant)
│       ├── ShelfMetrics.tsx               # Shelf analytics display (Mirror layout metrics)
│       ├── ProductCategories.tsx          # Category management
│       └── ZoneSettings.tsx               # Configuration panel
├── store/
│   └── useZoneAnalyser.ts                 # Zone analysis state
├── services/
│   └── zoneDataService.ts                 # Mock data service
├── utils/
│   ├── zoneCategoryMapping.ts             # Category definitions
│   └── shelfOptimization.ts               # Shelf optimization utilities (Mirror zone optimization)
└── types/
    └── zone.ts                            # Extended type definitions
```

#### Modified Files
```
src/
├── components/
│   ├── LayoutCanvas/
│   │   ├── ZoneModel3D.tsx               # Add click navigation
│   │   └── ResizableZone.tsx             # Add click navigation
│   └── Sidebar/
│       └── ZoneItem.tsx                  # Add "Analyse" button
├── store/
│   └── useStoreDesigner.ts               # Add navigation mode
└── types/
    └── index.ts                          # Add new interfaces
```

### 10. Testing Strategy

#### Unit Tests
- Component rendering tests for all new components
- **Optimization Engine Tests**: Generic optimization utilities with zone and shelf data
- **State Management Tests**: Zone analyser store with optimization actions
- **AI Service Tests**: Shelf optimization suggestion generation and parsing
- Utility function tests for category mapping and overlap detection
- Mock data service tests

#### Integration Tests
- Navigation flow from main canvas to zone analyser
- **Optimization Workflow**: Complete optimization cycle (detect overlaps → optimize → apply)
- **AI Integration**: Suggestion generation → display → application workflow
- State synchronization between stores
- Back navigation functionality
- Error handling scenarios

#### E2E Tests
- Complete user journey: zone click → analyser → shelf optimization → back navigation
- **Optimization User Flow**: Manual arrangement → auto-optimize → AI suggestions
- Shelf management operations (CRUD)
- **Interactive Canvas**: Drag, resize, select shelves in both 2D and 3D views
- Category filtering and management
- Responsive design verification

#### Performance Tests
- **Optimization Speed**: Large shelf datasets (50+ shelves)
- **Canvas Performance**: Smooth interactions with many shelf objects
- **Memory Usage**: Optimization engine with complex layouts
- **AI Response Time**: Suggestion generation under various conditions

### 11. Performance Considerations

#### Optimization Strategies
1. **Code Splitting**: Dynamic imports for zone analyser components
2. **Memoization**: React.memo for expensive shelf grid rendering
3. **Virtualization**: For large shelf lists (future enhancement)
4. **State Management**: Efficient updates and selective re-renders

#### Loading Strategies
```typescript
// Lazy loading for zone analyser
const ZoneAnalyser = dynamic(() => import('@/components/ZoneAnalyser/ZoneAnalyser'), {
  loading: () => <LoadingSpinner />,
  ssr: false
});
```

### 12. Future Enhancements

#### Phase 2 Features
- Real-time stock level updates
- Heat map visualizations
- AI-powered shelf optimization suggestions
- Integration with inventory management systems
- 3D shelf visualization within zone view
- Photo capture and visual inventory tracking

#### Backend Integration Points
- REST API endpoints for shelf and product data
- Real-time WebSocket updates for stock levels
- Database schema for zone and shelf persistence
- User authentication and authorization
- Analytics data collection and reporting

### 13. Risk Mitigation

#### Technical Risks
1. **State Complexity**: Use separate stores to avoid state pollution
2. **Performance**: Implement proper memoization and lazy loading
3. **Navigation Conflicts**: Ensure proper cleanup of event handlers
4. **Type Safety**: Comprehensive TypeScript coverage

#### UX Risks
1. **Navigation Confusion**: Clear breadcrumbs and back buttons
2. **Loading States**: Proper skeleton screens and loading indicators
3. **Error Handling**: Graceful degradation and error boundaries
4. **Responsive Design**: Thorough testing across device sizes

### 14. Success Metrics

#### Technical Metrics
- Page load time < 2 seconds
- **Optimization Performance**: Shelf optimization completes in < 1 second for 20+ shelves
- Zero navigation-related console errors
- **AI Response Time**: Shelf suggestions generated in < 5 seconds
- 100% TypeScript type coverage
- 90%+ unit test coverage

#### User Experience Metrics
- Successful navigation flow completion rate
- **Optimization Usage**: % of users who use auto-optimize features
- Time spent in zone analyser
- **AI Adoption**: % of users who apply AI suggestions
- Shelf management task completion rate
- **Interaction Efficiency**: Average time to arrange 10 shelves manually vs optimized
- User error recovery rate

#### Business Impact Metrics
- **Layout Efficiency Improvement**: Average space utilization increase
- **Decision Speed**: Time to finalize shelf arrangements
- **Feature Adoption**: Weekly active users of zone analyser
- **Optimization Value**: Reduction in overlapping shelf configurations

## Conclusion

This implementation plan provides a comprehensive roadmap for adding the **Zone Analyser feature with intelligent shelf optimization capabilities** while maintaining strict adherence to DRY (Don't Repeat Yourself) principles and consistency with the existing codebase architecture.

### Key Achievements

#### DRY Implementation Success
- **Generic Optimization Engine**: Created reusable `OptimizationEngine<T>` that works for both zones and shelves
- **Shared AI Patterns**: Extended existing AI service patterns for shelf optimization suggestions
- **Consistent State Management**: Mirrored Zustand store patterns for predictable state handling
- **Reusable UI Components**: Canvas, metrics, and interaction patterns adapted from main layout
- **Code Reusability**: ~60% code reuse through abstraction and pattern extraction

#### Shelf Optimization Features
- **Interactive Shelf Canvas**: Full drag-and-drop shelf management with 2D/3D views
- **AI-Powered Suggestions**: Three optimization strategies (accessibility, sales, inventory)
- **Real-time Metrics**: Space utilization, overlap detection, category distribution
- **Automatic Layout Optimization**: Smart shelf arrangement to eliminate overlaps
- **Visual Feedback**: Overlap indicators, selection highlights, optimization controls

#### Architectural Benefits
- **Scalable Foundation**: Generic optimization engine can be extended for future features
- **Type Safety**: Comprehensive TypeScript coverage for all new interfaces
- **Performance Optimized**: Code splitting, memoization, and efficient re-renders
- **Maintainable**: Clear separation of concerns and consistent patterns
- **Testable**: Modular design enables comprehensive unit and integration testing

### Technical Excellence
The implementation leverages existing technologies (Next.js App Router, Zustand, Three.js, Tailwind CSS) while introducing powerful new capabilities that transform the application from a simple layout designer into a comprehensive **retail space optimization platform**.

The phased approach ensures incremental development with continuous validation, while the DRY architecture guarantees long-term maintainability and extensibility for future enhancements like real-time inventory integration, advanced analytics, and multi-store management.

This feature elevates the application's value proposition from basic zone layout design to intelligent, data-driven retail space optimization with AI-powered insights and recommendations.
