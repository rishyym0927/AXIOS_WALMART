# Zone Analyser Feature - Core Implementation Plan

## Overview
Build a Zone Analyser page that provides shelf optimization within zones, reusing existing patterns from the main layout optimization with minimal changes to current codebase.

## Phase 1: Core Setup & Navigation (Week 1)

### 1.1 Add Navigation to Zones
**Modify existing files with minimal changes:**

```typescript
// src/components/LayoutCanvas/ResizableZone.tsx
// Add navigation handler to existing onClick
const handlePointerDown = (event: any) => {
  // ...existing code...
  
  // Add double-click navigation
  if (event.detail === 2) { // Double click
    router.push(`/zone/${zone.id}`);
    return;
  }
  
  // ...rest of existing code...
};
```

```typescript
// src/components/Sidebar/ZoneItem.tsx  
// Add "Analyse" button next to existing Edit/Delete buttons
<div className="flex gap-1">
  <button
    onClick={(e) => {
      e.stopPropagation();
      router.push(`/zone/${zone.id}`);
    }}
    className="p-2 text-gray-700 hover:text-green-700 hover:bg-green-100 rounded transition-colors"
    title="Analyse zone"
  >
    <BarChart3 size={16} />
  </button>
  {/* ...existing edit/delete buttons... */}
</div>
```

### 1.2 Create Basic Zone Page Structure
```typescript
// src/app/zone/[id]/page.tsx
'use client';

import { useParams, useRouter } from 'next/navigation';
import { useStoreDesigner } from '@/store/useStoreDesigner';
import Navbar from '@/components/Navbar';

export default function ZoneAnalyserPage() {
  const { id } = useParams();
  const router = useRouter();
  const { store } = useStoreDesigner();
  
  const zone = store.zones.find(z => z.id === id);
  
  if (!zone) {
    return <div>Zone not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={20} />
            Back to Layout
          </button>
          <h1 className="text-2xl font-bold">Zone Analysis: {zone.name}</h1>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <p>Zone Details: {zone.width}m × {zone.height}m</p>
          {/* Phase 2 will add shelf canvas here */}
        </div>
      </div>
    </div>
  );
}
```

**Deliverable:** Navigation to zone analysis page working from both canvas double-click and sidebar button.

---

## Phase 2: Shelf Data Structure & Basic Canvas (Week 2)

### 2.1 Extend Types (New file - no changes to existing)
```typescript
// src/types/shelf.ts
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
```

### 2.2 Create Shelf Store (New file - independent of existing store)
```typescript
// src/store/useShelfStore.ts
import { create } from 'zustand';
import { Shelf, ShelfMetrics } from '@/types/shelf';

interface ShelfState {
  shelves: Shelf[];
  selectedShelf: Shelf | null;
  shelfMetrics: ShelfMetrics;
  
  // Actions (mirror existing zone patterns)
  addShelf: (shelf: Omit<Shelf, 'id'>) => void;
  updateShelf: (id: string, updates: Partial<Shelf>) => void;
  deleteShelf: (id: string) => void;
  selectShelf: (shelf: Shelf | null) => void;
  loadShelvesForZone: (zoneId: string) => void;
  optimizeShelves: (zoneWidth: number, zoneHeight: number) => void;
  detectShelfOverlaps: () => void;
  calculateShelfMetrics: (zoneWidth: number, zoneHeight: number) => void;
}

export const useShelfStore = create<ShelfState>((set, get) => ({
  shelves: [],
  selectedShelf: null,
  shelfMetrics: { utilization: 0, overlappingShelves: false, unusedSpace: 0 },
  
  addShelf: (shelfData) => {
    const newShelf: Shelf = {
      ...shelfData,
      id: `shelf-${Date.now()}`,
    };
    set(state => ({
      shelves: [...state.shelves, newShelf]
    }));
    get().detectShelfOverlaps();
    get().calculateShelfMetrics(zoneWidth, zoneHeight);
  },
  
  // Copy existing zone optimization logic but for shelves
  optimizeShelves: (zoneWidth, zoneHeight) => {
    // Reuse the same grid-based optimization from useStoreDesigner
    // but constrained to zone dimensions
  },
  
  // Other methods following same patterns as useStoreDesigner...
}));
```

### 2.3 Create Basic Shelf Canvas (Copy & modify ResizableZone)
```typescript
// src/components/ZoneAnalyser/ShelfCanvas.tsx
// Copy ResizableZone.tsx and modify for shelves within zone bounds
import { Canvas } from '@react-three/fiber';
import { OrthographicCamera } from '@react-three/drei';
import ResizableShelf from './ResizableShelf'; // Modified version of ResizableZone

export default function ShelfCanvas({ zone }: { zone: Zone }) {
  const { shelves, selectedShelf, updateShelf, selectShelf } = useShelfStore();
  
  return (
    <div className="relative w-full h-96 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg">
      <Canvas>
        <OrthographicCamera makeDefault />
        <ambientLight intensity={0.6} />
        
        {/* Zone boundary */}
        <mesh position={[zone.width/2, 0, zone.height/2]} rotation={[-Math.PI/2, 0, 0]}>
          <planeGeometry args={[zone.width, zone.height]} />
          <meshBasicMaterial color="#f0f0f0" transparent opacity={0.3} />
        </mesh>
        
        {/* Render shelves */}
        {shelves.map(shelf => (
          <ResizableShelf
            key={shelf.id}
            shelf={shelf}
            zoneWidth={zone.width}
            zoneHeight={zone.height}
            onUpdate={updateShelf}
            onSelect={selectShelf}
            isSelected={selectedShelf?.id === shelf.id}
          />
        ))}
      </Canvas>
      
      {/* Add shelf controls */}
      <div className="absolute top-4 left-4">
        <button
          onClick={() => addShelf({
            name: 'New Shelf',
            category: 'general',
            x: 1, y: 1, width: 2, height: 1,
            zoneId: zone.id
          })}
          className="bg-blue-600 text-white px-3 py-2 rounded"
        >
          Add Shelf
        </button>
      </div>
    </div>
  );
}
```

**Deliverable:** Basic shelf management within zone with visual canvas.

---

## Phase 3: Shelf Optimization (Week 3)

### 3.1 Create Generic Optimization Utility (New file)
```typescript
// src/utils/optimizationEngine.ts
// Extract common optimization logic from useStoreDesigner

interface OptimizableItem {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  isOverlapping?: boolean;
}

export class OptimizationEngine<T extends OptimizableItem> {
  static doItemsOverlap<T extends OptimizableItem>(item1: T, item2: T): boolean {
    return !(
      item1.x + item1.width <= item2.x ||
      item1.x >= item2.x + item2.width ||
      item1.y + item1.height <= item2.y ||
      item1.y >= item2.y + item2.height
    );
  }
  
  static detectOverlaps<T extends OptimizableItem>(items: T[]): T[] {
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
  
  static optimizeLayout<T extends OptimizableItem>(
    items: T[], 
    containerWidth: number, 
    containerHeight: number
  ): T[] {
    // Copy the grid-based optimization from useStoreDesigner.optimizeLayout
    let currentX = 0;
    let currentY = 0;
    let maxHeightInRow = 0;
    
    return items.map(item => {
      if (currentX + item.width > containerWidth) {
        currentX = 0;
        currentY += maxHeightInRow;
        maxHeightInRow = 0;
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
```

### 3.2 Add Optimization to Shelf Store
```typescript
// Update src/store/useShelfStore.ts
optimizeShelves: (zoneWidth, zoneHeight) => {
  const { shelves } = get();
  const optimizedShelves = OptimizationEngine.optimizeLayout(shelves, zoneWidth, zoneHeight);
  set({ shelves: optimizedShelves });
  get().detectShelfOverlaps();
  get().calculateShelfMetrics(zoneWidth, zoneHeight);
},

detectShelfOverlaps: () => {
  const { shelves } = get();
  const shelvesWithOverlapStatus = OptimizationEngine.detectOverlaps(shelves);
  set({ shelves: shelvesWithOverlapStatus });
},
```

### 3.3 Add Optimization Controls to Canvas
```typescript
// Update src/components/ZoneAnalyser/ShelfCanvas.tsx
<div className="absolute top-4 left-4 flex gap-2">
  <button
    onClick={() => addShelf({...})}
    className="bg-blue-600 text-white px-3 py-2 rounded"
  >
    Add Shelf
  </button>
  <button
    onClick={() => optimizeShelves(zone.width, zone.height)}
    className="bg-purple-600 text-white px-3 py-2 rounded"
  >
    Optimize Layout
  </button>
</div>

{/* Metrics display (copy from LayoutCanvas) */}
<div className="absolute bottom-4 left-4 bg-white p-3 rounded shadow text-sm">
  <div className="font-semibold">Zone: {zone.name}</div>
  <div className="flex items-center gap-1 mt-1">
    {shelfMetrics.overlappingShelves ? 
      <AlertCircle size={14} className="text-red-500" /> : 
      <CheckCircle size={14} className="text-green-500" />}
    <span>
      {shelfMetrics.overlappingShelves ? 'Shelves overlapping' : 'No overlaps'}
    </span>
  </div>
</div>
```

**Deliverable:** Full shelf optimization working with visual feedback.

---

## Phase 4: AI Integration (Week 4)

### 4.1 Extend AI Service (Minimal change to existing)
```typescript
// src/services/aiService.ts
// Add new method to existing class

async generateShelfSuggestions(
  zone: Zone,
  currentShelves: Shelf[]
): Promise<ShelfSuggestion[]> {
  if (!this.genAI) {
    return this.getFallbackShelfSuggestions(zone, currentShelves);
  }

  try {
    const prompt = this.createShelfPrompt(zone, currentShelves);
    const result = await this.genAI.getGenerativeModel({ model: 'gemini-pro' })
      .generateContent(prompt);
    
    return this.parseShelfResponse(await result.response.text(), zone);
  } catch (error) {
    return this.getFallbackShelfSuggestions(zone, currentShelves);
  }
}

private createShelfPrompt(zone: Zone, shelves: Shelf[]): string {
  return `Generate 3 shelf layout suggestions for ${zone.name} zone (${zone.width}m x ${zone.height}m).
  
Current shelves: ${shelves.map(s => `${s.name} (${s.width}x${s.height}m)`).join(', ')}

Provide 3 strategies: accessibility, sales optimization, inventory efficiency.
Format as JSON with shelf positions within zone bounds.`;
}

private getFallbackShelfSuggestions(zone: Zone, shelves: Shelf[]): ShelfSuggestion[] {
  return [
    {
      id: 'shelf-1',
      name: 'Accessibility Optimized',
      description: 'Easy customer access',
      efficiency: 85,
      shelves: OptimizationEngine.optimizeLayout(shelves, zone.width, zone.height)
    }
  ];
}
```

### 4.2 Add AI Assistant for Shelves
```typescript
// src/components/ZoneAnalyser/ShelfAIAssistant.tsx
// Copy structure from existing AIAssistant.tsx

export default function ShelfAIAssistant({ zone }: { zone: Zone }) {
  const { shelves } = useShelfStore();
  const [suggestions, setSuggestions] = useState<ShelfSuggestion[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateSuggestions = async () => {
    setIsGenerating(true);
    try {
      const newSuggestions = await aiService.generateShelfSuggestions(zone, shelves);
      setSuggestions(newSuggestions);
    } catch (error) {
      console.error('Error generating shelf suggestions:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-80 bg-white rounded-lg shadow p-4">
      <h3 className="font-semibold mb-4">Shelf AI Assistant</h3>
      
      <button
        onClick={generateSuggestions}
        disabled={isGenerating}
        className="w-full bg-violet-600 text-white py-2 px-4 rounded mb-4"
      >
        {isGenerating ? 'Generating...' : 'Generate Suggestions'}
      </button>

      {suggestions.map(suggestion => (
        <div key={suggestion.id} className="border rounded p-3 mb-2">
          <h4 className="font-medium">{suggestion.name}</h4>
          <p className="text-sm text-gray-600">{suggestion.description}</p>
          <button
            onClick={() => applySuggestion(suggestion)}
            className="mt-2 bg-gray-800 text-white px-3 py-1 rounded text-sm"
          >
            Apply Layout
          </button>
        </div>
      ))}
    </div>
  );
}
```

**Deliverable:** AI-powered shelf optimization suggestions.

---

## Phase 5: Polish & Integration (Week 5)

### 5.1 Update Zone Page with Complete Layout
```typescript
// src/app/zone/[id]/page.tsx - Final version
export default function ZoneAnalyserPage() {
  // ...existing code...

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => router.back()}>Back</button>
          <h1>Zone Analysis: {zone.name}</h1>
        </div>
        
        {/* Main layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <ShelfCanvas zone={zone} />
          </div>
          <div>
            <ShelfAIAssistant zone={zone} />
          </div>
        </div>
      </div>
    </div>
  );
}
```

### 5.2 Optional: Update Existing Store to Use Optimization Engine
```typescript
// src/store/useStoreDesigner.ts
// Replace existing optimization with generic engine (optional)
import { OptimizationEngine } from '@/utils/optimizationEngine';

// Replace existing optimizeLayout method:
optimizeLayout: () => {
  const { width, height, zones } = get().store;
  const optimizedZones = OptimizationEngine.optimizeLayout(zones, width, height);
  set(state => ({
    store: { ...state.store, zones: optimizedZones }
  }));
  get().detectOverlaps();
  get().calculateLayoutMetrics();
},
```

**Deliverable:** Complete zone analyser with shelf optimization, AI suggestions, and seamless integration.

---

## Implementation Summary

### Files Created (No changes to existing code):
- `src/types/shelf.ts`
- `src/store/useShelfStore.ts`
- `src/utils/optimizationEngine.ts`
- `src/app/zone/[id]/page.tsx`
- `src/components/ZoneAnalyser/ShelfCanvas.tsx`
- `src/components/ZoneAnalyser/ResizableShelf.tsx`
- `src/components/ZoneAnalyser/ShelfAIAssistant.tsx`

### Files Modified (Minimal changes):
- `src/components/LayoutCanvas/ResizableZone.tsx` - Add double-click navigation
- `src/components/Sidebar/ZoneItem.tsx` - Add analyse button
- `src/services/aiService.ts` - Add shelf suggestion method

### Key Benefits:
1. **Zero Breaking Changes**: All existing functionality preserved
2. **Code Reuse**: ~70% of patterns reused from existing zone management
3. **Consistent UX**: Same interaction patterns as main layout
4. **Scalable**: Generic optimization engine can be reused for future features
5. **Independent**: Shelf store completely separate from zone store

This implementation provides the full shelf optimization feature while maintaining the existing codebase integrity and following established patterns.
