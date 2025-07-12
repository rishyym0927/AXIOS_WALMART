import { GoogleGenerativeAI } from '@google/generative-ai';
import { Zone, Shelf } from '@/types';

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

class SimplifiedShelfAI {
  private genAI: GoogleGenerativeAI | null = null;

  constructor() {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (apiKey) {
      this.genAI = new GoogleGenerativeAI(apiKey);
    }
  }

  async optimizeExistingShelves(
    zone: Zone,
    existingShelves: Shelf[]
  ): Promise<OptimizedShelfSuggestion[]> {
    // If no shelves to optimize, return empty suggestions
    if (!existingShelves || existingShelves.length === 0) {
      return [{
        id: 'no-shelves',
        name: 'No Shelves to Optimize',
        description: 'Add some shelves to this zone first, then use AI optimization to position and resize them optimally.',
        shelves: [],
        metrics: { utilization: 0, efficiency: 0, accessibility: 0 }
      }];
    }

    if (!this.genAI) {
      console.warn('Gemini API key not configured, using fallback optimization');
      return this.getFallbackOptimizations(zone, existingShelves);
    }

    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
      const prompt = this.createOptimizationPrompt(zone, existingShelves);
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return this.parseOptimizationResponse(text, zone, existingShelves);
    } catch (error) {
      console.error('Error generating shelf optimization:', error);
      return this.getFallbackOptimizations(zone, existingShelves);
    }
  }

  private createOptimizationPrompt(zone: Zone, shelves: Shelf[]): string {
    const shelfDescriptions = shelves.map(
      (shelf) => `${shelf.name}: ${shelf.width}m x ${shelf.height}m at (${shelf.x}, ${shelf.y}) - Category: ${shelf.category}`
    ).join('\n');

    const totalShelfArea = shelves.reduce((sum, shelf) => sum + (shelf.width * shelf.height), 0);
    const zoneArea = zone.width * zone.height;
    const currentUtilization = Math.round((totalShelfArea / zoneArea) * 100);

    return `
You are a retail shelf optimization expert. Your ONLY task is to reposition and resize the existing ${shelves.length} shelves to maximize space utilization and improve customer flow.

ZONE: ${zone.name} (${zone.width}m x ${zone.height}m = ${zoneArea}m²)
CURRENT UTILIZATION: ${currentUtilization}%

EXISTING SHELVES TO OPTIMIZE:
${shelfDescriptions}

STRICT RULES:
1. MUST keep exactly ${shelves.length} shelves (no adding or removing)
2. MUST preserve shelf names and categories exactly as they are
3. CAN reposition shelves anywhere within zone boundaries (0,0 to ${zone.width},${zone.height})
4. CAN resize shelves (minimum 0.5m x 0.3m, maximum zone size)
5. MUST maintain 0.8m minimum gaps between shelves for customer walkways
6. MUST ensure no overlapping shelves
7. Target 75-85% space utilization while maintaining good accessibility

OBJECTIVES:
- Maximize space utilization by optimal positioning and sizing
- Create logical customer flow patterns
- Maintain adequate walkway space for customers
- Group related categories when possible

Generate 3 optimization strategies:

STRATEGY 1: Space Maximization
- Resize and position for maximum space usage
- Eliminate wasted areas
- Target 80-85% utilization

STRATEGY 2: Customer Flow
- Wide aisles for easy navigation  
- Logical category placement
- Target 75-80% utilization with better accessibility

STRATEGY 3: Category Grouping
- Group similar categories together
- Efficient restocking paths
- Balanced space utilization

RESPONSE FORMAT (JSON only):
{
  "suggestions": [
    {
      "name": "Space Maximized Layout",
      "description": "Optimized positioning and sizing for maximum space utilization",
      "utilization": 82,
      "efficiency": 85,
      "accessibility": 80,
      "shelves": [
        {
          "id": "${shelves[0]?.id || 'shelf-1'}",
          "name": "${shelves[0]?.name || 'Shelf 1'}",
          "category": "${shelves[0]?.category || 'general'}",
          "x": 0.5,
          "y": 1.0,
          "width": 1.5,
          "height": 0.6
        }
      ]
    },
    {
      "name": "Customer Flow Optimized",
      "description": "Wide aisles and logical positioning for excellent customer experience",
      "utilization": 78,
      "efficiency": 80,
      "accessibility": 90,
      "shelves": [...]
    },
    {
      "name": "Category Grouped Layout",
      "description": "Related categories grouped together for shopping convenience",
      "utilization": 75,
      "efficiency": 88,
      "accessibility": 85,
      "shelves": [...]
    }
  ]
}

CRITICAL: Only reposition and resize existing shelves. Do NOT create new shelves or remove any!
`;
  }

  private parseOptimizationResponse(
    text: string,
    zone: Zone,
    existingShelves: Shelf[]
  ): OptimizedShelfSuggestion[] {
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }

      const parsed = JSON.parse(jsonMatch[0]);
      
      if (!parsed.suggestions || !Array.isArray(parsed.suggestions)) {
        throw new Error('Invalid suggestions format');
      }

      return parsed.suggestions.map((suggestion: any, index: number) => ({
        id: `opt-${Date.now()}-${index}`,
        name: suggestion.name || `Optimization ${index + 1}`,
        description: suggestion.description || 'AI-optimized shelf positioning',
        shelves: this.validateOptimizedShelves(
          suggestion.shelves || [],
          zone,
          existingShelves
        ),
        metrics: {
          utilization: Math.max(1, Math.min(100, suggestion.utilization || 75)),
          efficiency: Math.max(1, Math.min(100, suggestion.efficiency || 75)),
          accessibility: Math.max(1, Math.min(100, suggestion.accessibility || 75))
        }
      }));
    } catch (error) {
      console.error('Error parsing optimization response:', error);
      return this.getFallbackOptimizations(zone, existingShelves);
    }
  }

  private validateOptimizedShelves(
    optimizedShelves: any[],
    zone: Zone,
    originalShelves: Shelf[]
  ): Shelf[] {
    // Ensure we have the same number of shelves
    if (optimizedShelves.length !== originalShelves.length) {
      console.warn(`Shelf count mismatch, using fallback optimization`);
      return this.gridLayoutOptimization(originalShelves, zone);
    }

    const validatedShelves: Shelf[] = [];

    for (let i = 0; i < optimizedShelves.length; i++) {
      const optimized = optimizedShelves[i];
      const original = originalShelves[i];

      // Create validated shelf with original data preserved
      let validShelf: Shelf = {
        id: original.id,
        name: original.name,
        category: original.category,
        zoneId: zone.id,
        isOverlapping: false,
        x: Math.max(0, Math.min(optimized.x || original.x, zone.width - (optimized.width || original.width))),
        y: Math.max(0, Math.min(optimized.y || original.y, zone.height - (optimized.height || original.height))),
        width: Math.max(0.5, Math.min(optimized.width || original.width, zone.width)),
        height: Math.max(0.3, Math.min(optimized.height || original.height, zone.height))
      };

      // Check for overlaps with previously placed shelves
      const hasOverlap = validatedShelves.some(existing => 
        this.shelvesOverlap(validShelf, existing, 0.8)
      );

      if (hasOverlap) {
        // Find valid position
        const validPosition = this.findValidPosition(validShelf, validatedShelves, zone);
        if (validPosition) {
          validShelf.x = validPosition.x;
          validShelf.y = validPosition.y;
        }
      }

      validatedShelves.push(validShelf);
    }

    return validatedShelves;
  }

  private shelvesOverlap(shelf1: Shelf, shelf2: Shelf, minGap: number = 0.8): boolean {
    return !(
      shelf1.x + shelf1.width + minGap <= shelf2.x ||
      shelf2.x + shelf2.width + minGap <= shelf1.x ||
      shelf1.y + shelf1.height + minGap <= shelf2.y ||
      shelf2.y + shelf2.height + minGap <= shelf1.y
    );
  }

  private findValidPosition(
    shelf: Shelf,
    placedShelves: Shelf[],
    zone: Zone
  ): { x: number; y: number } | null {
    const step = 0.2;
    
    for (let y = 0; y <= zone.height - shelf.height; y += step) {
      for (let x = 0; x <= zone.width - shelf.width; x += step) {
        const testShelf = { ...shelf, x, y };
        
        const hasOverlap = placedShelves.some(existing => 
          this.shelvesOverlap(testShelf, existing, 0.8)
        );
        
        if (!hasOverlap) {
          return { x, y };
        }
      }
    }
    
    return null;
  }

  private getFallbackOptimizations(zone: Zone, shelves: Shelf[]): OptimizedShelfSuggestion[] {
    return [
      {
        id: `fallback-grid-${Date.now()}`,
        name: "Grid Layout Optimization",
        description: "Systematic grid-based arrangement for maximum space utilization",
        shelves: this.gridLayoutOptimization(shelves, zone),
        metrics: { utilization: 75, efficiency: 70, accessibility: 85 }
      },
      {
        id: `fallback-flow-${Date.now()}`,
        name: "Customer Flow Layout",
        description: "Wide aisles and logical flow for excellent customer experience",
        shelves: this.flowOptimization(shelves, zone),
        metrics: { utilization: 68, efficiency: 75, accessibility: 92 }
      },
      {
        id: `fallback-category-${Date.now()}`,
        name: "Category Grouped Layout",
        description: "Related categories grouped together for operational efficiency",
        shelves: this.categoryOptimization(shelves, zone),
        metrics: { utilization: 72, efficiency: 88, accessibility: 80 }
      }
    ];
  }

  private gridLayoutOptimization(shelves: Shelf[], zone: Zone): Shelf[] {
    const gap = 0.8;
    const margin = 0.5;
    const availableWidth = zone.width - (2 * margin);
    const availableHeight = zone.height - (2 * margin);
    
    const shelvesPerRow = Math.max(1, Math.floor(Math.sqrt(shelves.length)));
    const rows = Math.ceil(shelves.length / shelvesPerRow);
    
    const cellWidth = (availableWidth - (shelvesPerRow - 1) * gap) / shelvesPerRow;
    const cellHeight = (availableHeight - (rows - 1) * gap) / rows;
    
    return shelves.map((shelf, index) => {
      const row = Math.floor(index / shelvesPerRow);
      const col = index % shelvesPerRow;
      
      const x = margin + col * (cellWidth + gap);
      const y = margin + row * (cellHeight + gap);
      
      return {
        ...shelf,
        x: Math.max(0, x),
        y: Math.max(0, y),
        width: Math.min(cellWidth * 0.9, zone.width - x),
        height: Math.min(cellHeight * 0.9, zone.height - y),
        isOverlapping: false
      };
    });
  }

  private flowOptimization(shelves: Shelf[], zone: Zone): Shelf[] {
    const aisleWidth = 1.2; // Wide aisles
    const margin = 0.5;
    
    return shelves.map((shelf, index) => {
      const shelvesPerRow = Math.max(1, Math.floor((zone.width - 2 * margin) / (shelf.width + aisleWidth)));
      const row = Math.floor(index / shelvesPerRow);
      const col = index % shelvesPerRow;
      
      const x = margin + col * (shelf.width + aisleWidth);
      const y = margin + row * (shelf.height + aisleWidth);
      
      return {
        ...shelf,
        x: Math.max(0, Math.min(x, zone.width - shelf.width)),
        y: Math.max(0, Math.min(y, zone.height - shelf.height)),
        isOverlapping: false
      };
    });
  }

  private categoryOptimization(shelves: Shelf[], zone: Zone): Shelf[] {
    // Group by category
    const categories = Array.from(new Set(shelves.map(s => s.category)));
    const shelfsByCategory = categories.map(cat => 
      shelves.filter(s => s.category === cat)
    );
    
    const optimized: Shelf[] = [];
    let currentY = 0.5;
    
    shelfsByCategory.forEach(categoryGroup => {
      let currentX = 0.5;
      let maxHeight = 0;
      
      categoryGroup.forEach(shelf => {
        if (currentX + shelf.width > zone.width - 0.5) {
          currentX = 0.5;
          currentY += maxHeight + 0.8;
          maxHeight = 0;
        }
        
        optimized.push({
          ...shelf,
          x: currentX,
          y: Math.min(currentY, zone.height - shelf.height),
          isOverlapping: false
        });
        
        currentX += shelf.width + 0.8;
        maxHeight = Math.max(maxHeight, shelf.height);
      });
      
      currentY += maxHeight + 1.0; // Gap between categories
    });
    
    return optimized;
  }
}

export const simplifiedShelfAI = new SimplifiedShelfAI();
