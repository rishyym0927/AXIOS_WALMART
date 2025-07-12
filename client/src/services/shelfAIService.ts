'use client';

import { GoogleGenerativeAI } from '@google/generative-ai';
import { Shelf, Zone, ShelfMetrics } from '@/types';

interface ShelfSuggestion {
  id: string;
  name: string;
  description: string;
  efficiency: number;
  spaceUtilization: number;
  shelves: Omit<Shelf, 'id' | 'zoneId'>[];
}

interface ShelfLayoutStrategy {
  strategy: 'customer-flow' | 'revenue-optimization' | 'operational-efficiency';
  description: string;
  shelves: Omit<Shelf, 'id' | 'zoneId'>[];
}

class ShelfAIService {
  private genAI: GoogleGenerativeAI | null = null;

  constructor() {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (apiKey) {
      this.genAI = new GoogleGenerativeAI(apiKey);
    }
  }

  async generateShelfSuggestions(
    zone: Zone,
    existingShelves: Shelf[] = []
  ): Promise<ShelfSuggestion[]> {
    if (!this.genAI) {
      console.warn('Gemini API key not configured');
      return this.getFallbackShelfSuggestions(zone, existingShelves);
    }

    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });

      const prompt = this.createShelfLayoutPrompt(zone, existingShelves);
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const suggestions = this.parseShelfAIResponse(text, zone, existingShelves);
      
      // Validate, fix overlapping shelves, and optimize space usage
      return suggestions.map(suggestion => ({
        ...suggestion,
        shelves: this.optimizeShelfSpaceUtilization(
          this.validateAndFixShelfLayout(suggestion.shelves, zone),
          zone
        )
      }));
    } catch (error) {
      console.error('Error generating shelf AI suggestions:', error);
      return this.getFallbackShelfSuggestions(zone, existingShelves);
    }
  }

  private createShelfLayoutPrompt(zone: Zone, existingShelves: Shelf[]): string {
    const shelfDescriptions = existingShelves.map(
      (shelf) => `${shelf.name}: ${shelf.width}m x ${shelf.height}m (${shelf.category})`
    ).join(', ');

    const totalShelfArea = existingShelves.reduce((sum, shelf) => sum + (shelf.width * shelf.height), 0);
    const zoneArea = zone.width * zone.height;
    const utilizationRate = Math.round((totalShelfArea / zoneArea) * 100);

    // Determine zone category and appropriate shelf types
    const zoneCategory = this.inferZoneCategoryFromName(zone.name);
    const appropriateCategories = this.getAppropriateShelfCategories(zoneCategory);

    return `
You are an expert retail shelf layout optimizer. Create 3 optimal shelf layout suggestions for the "${zone.name}" zone (${zone.width}m x ${zone.height}m = ${zoneArea}m²).

ZONE CONTEXT: ${zone.name}
Zone Category: ${zoneCategory}
Appropriate Shelf Categories: ${appropriateCategories.join(', ')}
${existingShelves.length > 0 ? `Existing Shelves: ${shelfDescriptions}` : 'No existing shelves'}
Current utilization: ${utilizationRate}%

CRITICAL REQUIREMENTS:
1. NO OVERLAPPING SHELVES - Each shelf must have its own space
2. ALL shelves must fit completely within the ${zone.width}m x ${zone.height}m zone boundaries
3. MAXIMIZE SPACE UTILIZATION - Target 75-90% zone coverage
4. Leave minimum 0.8m walkways between shelves for customer access
5. Position shelves based on retail merchandising best practices
6. Use appropriate shelf categories for this zone type
7. Consider customer flow patterns and accessibility

SHELF SIZING GUIDELINES:
- Standard Shelf: 1.0-1.5m wide, 0.4-0.6m deep
- End Cap: 0.8-1.0m wide, 0.4-0.5m deep  
- Island Display: 2.0-3.0m wide, 1.0-1.5m deep
- Wall Unit: Full wall length, 0.3-0.5m deep
- Specialty Display: Variable based on category needs

SHELF CATEGORIES AND PLACEMENT:
- grocery: Standard aisles, high-frequency items at eye level
- electronics: Secure displays, demonstration areas, wider aisles
- fashion: Browse-friendly layouts, fitting room access
- beauty: Test stations, mirror proximity, premium positioning
- home-garden: Seasonal displays, bulk item accommodation
- books-media: Browse-friendly, quiet corners
- toys: Child-accessible heights, play-test areas
- sports: Equipment displays, seasonal flexibility
- checkout: Queue management, impulse-buy positioning

Create 3 different shelf layout strategies:

STRATEGY 1 - CUSTOMER FLOW OPTIMIZATION:
- Design natural walking paths through shelves
- Place high-attraction categories near zone entrance
- Ensure smooth traffic flow without bottlenecks
- Position promotional displays for maximum visibility
- Create discovery zones for new products

STRATEGY 2 - REVENUE MAXIMIZATION:
- Position high-margin products in premium shelf locations
- Use power wall concepts (eye-level positioning)
- Create impulse-buy opportunities
- Optimize product adjacencies for cross-selling
- Allocate more space to high-revenue categories

STRATEGY 3 - OPERATIONAL EFFICIENCY:
- Group shelves by restocking frequency
- Minimize staff walking distances
- Optimize for easy inventory management
- Position heavy/bulk items for efficient handling
- Consider seasonal flexibility needs

SHELF POSITIONING RULES:
- Coordinates (0,0) represent zone's top-left corner
- X-axis: 0 to ${zone.width}m (left to right within zone)
- Y-axis: 0 to ${zone.height}m (top to bottom within zone)
- Each shelf position (x,y) is its TOP-LEFT corner
- Shelf must fit: x + width ≤ ${zone.width} and y + height ≤ ${zone.height}
- Maintain minimum 0.8m clearance between shelves
- Ensure wheelchair accessibility (1.2m minimum aisle width)

RESPONSE FORMAT - Return valid JSON only:
{
  "suggestions": [
    {
      "name": "Customer Flow Optimized Shelves",
      "description": "Detailed explanation of flow strategy and shelf positioning",
      "efficiency": 85,
      "spaceUtilization": 82,
      "shelves": [
        {
          "name": "Shelf Name",
          "category": "grocery",
          "x": 0,
          "y": 0,
          "width": 1.2,
          "height": 0.5
        }
      ]
    },
    {
      "name": "Revenue Maximized Shelf Layout",
      "description": "Detailed explanation of revenue optimization and shelf placement",
      "efficiency": 88,
      "spaceUtilization": 85,
      "shelves": [...]
    },
    {
      "name": "Operational Efficiency Layout",
      "description": "Detailed explanation of operational strategy and shelf organization",
      "efficiency": 82,
      "spaceUtilization": 78,
      "shelves": [...]
    }
  ]
}

SHELF CATEGORY DEFINITIONS:
- grocery: Food items, beverages, daily essentials
- electronics: TVs, phones, computers, accessories
- fashion: Clothing, shoes, accessories
- beauty: Cosmetics, skincare, personal care
- home-garden: Furniture, decor, plants, tools
- books-media: Books, magazines, music, movies
- toys: Children's toys, games, educational items
- sports: Athletic equipment, outdoor gear, fitness
- checkout: Small items, impulse purchases
- pharmacy: Health products, medications
- automotive: Car accessories, maintenance items

CRITICAL: Design efficient shelf layouts that maximize both space utilization and customer experience while maintaining appropriate category placement for the ${zoneCategory} zone!
`;
  }

  private parseShelfAIResponse(
    text: string,
    zone: Zone,
    existingShelves?: Shelf[]
  ): ShelfSuggestion[] {
    try {
      // Extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in AI response');
      }

      const parsed = JSON.parse(jsonMatch[0]);
      
      if (!parsed.suggestions || !Array.isArray(parsed.suggestions)) {
        throw new Error('Invalid shelf suggestions format');
      }

      return parsed.suggestions.map((suggestion: any, index: number) => ({
        id: `shelf-ai-${Date.now()}-${index}`,
        name: suggestion.name || `Shelf Layout ${index + 1}`,
        description: suggestion.description || 'AI-generated shelf layout with space optimization',
        efficiency: Math.max(1, Math.min(100, suggestion.efficiency || 75)),
        spaceUtilization: Math.max(1, Math.min(100, suggestion.spaceUtilization || 80)),
        shelves: suggestion.shelves?.map((shelf: any, shelfIndex: number) => ({
          name: shelf.name || `Shelf ${shelfIndex + 1}`,
          category: this.validateShelfCategory(shelf.category),
          x: Math.max(0, Math.min(shelf.x || 0, zone.width - (shelf.width || 1))),
          y: Math.max(0, Math.min(shelf.y || 0, zone.height - (shelf.height || 1))),
          width: Math.min(shelf.width || 1.2, zone.width),
          height: Math.min(shelf.height || 0.5, zone.height),
        })) || [],
      }));
    } catch (error) {
      console.error('Error parsing shelf AI response:', error);
      return this.getFallbackShelfSuggestions(zone, existingShelves);
    }
  }

  private validateAndFixShelfLayout(shelves: Omit<Shelf, 'id' | 'zoneId'>[], zone: Zone): Omit<Shelf, 'id' | 'zoneId'>[] {
    if (!shelves || shelves.length === 0) return [];

    // Sort shelves by area (largest first) for better placement
    const sortedShelves = [...shelves].sort((a, b) => (b.width * b.height) - (a.width * a.height));
    const placedShelves: Omit<Shelf, 'id' | 'zoneId'>[] = [];

    for (const shelf of sortedShelves) {
      const validPosition = this.findValidShelfPosition(shelf, placedShelves, zone);
      
      placedShelves.push({
        ...shelf,
        x: validPosition.x,
        y: validPosition.y,
        width: Math.min(shelf.width, zone.width),
        height: Math.min(shelf.height, zone.height),
      });
    }

    return placedShelves;
  }

  private findValidShelfPosition(
    shelf: Omit<Shelf, 'id' | 'zoneId'>,
    placedShelves: Omit<Shelf, 'id' | 'zoneId'>[],
    zone: Zone,
    minGap: number = 0.8
  ): { x: number; y: number } {
    const stepSize = 0.2; // Grid resolution for positioning
    
    for (let y = 0; y <= zone.height - shelf.height; y += stepSize) {
      for (let x = 0; x <= zone.width - shelf.width; x += stepSize) {
        const testShelf = { ...shelf, x, y };
        
        // Check if this position overlaps with any placed shelf
        const hasOverlap = placedShelves.some(placedShelf => 
          this.doShelvesOverlap(testShelf, placedShelf, minGap)
        );
        
        if (!hasOverlap) {
          return { x, y };
        }
      }
    }
    
    // If no valid position found, place at origin (will be handled by validation)
    return { x: 0, y: 0 };
  }

  private doShelvesOverlap(
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

  private optimizeShelfSpaceUtilization(
    shelves: Omit<Shelf, 'id' | 'zoneId'>[],
    zone: Zone
  ): Omit<Shelf, 'id' | 'zoneId'>[] {
    if (!shelves || shelves.length === 0) return [];

    // Calculate current space utilization
    const currentUsedArea = shelves.reduce((sum, shelf) => sum + (shelf.width * shelf.height), 0);
    const zoneArea = zone.width * zone.height;
    const currentUtilization = currentUsedArea / zoneArea;

    // Target 80% utilization for shelves (leave space for customer movement)
    const targetUtilization = 0.80;
    
    // If utilization is already good (75-85%), don't modify
    if (currentUtilization >= 0.75 && currentUtilization <= 0.85) {
      return shelves;
    }

    // If underutilized, try to expand shelves or add more
    if (currentUtilization < 0.75) {
      return this.expandShelvesToFillSpace(shelves, zone, targetUtilization);
    }

    // If over-utilized, reduce shelf sizes
    return this.reduceShelvesSizes(shelves, zone, targetUtilization);
  }

  private expandShelvesToFillSpace(
    shelves: Omit<Shelf, 'id' | 'zoneId'>[],
    zone: Zone,
    targetUtilization: number
  ): Omit<Shelf, 'id' | 'zoneId'>[] {
    const optimizedShelves = [...shelves];
    const expansionFactor = Math.sqrt(targetUtilization / this.calculateUtilization(shelves, zone));

    // Try to expand each shelf proportionally
    for (let i = 0; i < optimizedShelves.length; i++) {
      const shelf = optimizedShelves[i];
      const otherShelves = optimizedShelves.filter((_, index) => index !== i);

      // Calculate maximum possible expansion
      const maxWidth = this.calculateMaxShelfExpansion(shelf, otherShelves, zone, 'width');
      const maxHeight = this.calculateMaxShelfExpansion(shelf, otherShelves, zone, 'height');

      // Apply proportional expansion
      const newWidth = Math.min(shelf.width * expansionFactor, maxWidth);
      const newHeight = Math.min(shelf.height * expansionFactor, maxHeight);

      optimizedShelves[i] = {
        ...shelf,
        width: Math.max(shelf.width, newWidth),
        height: Math.max(shelf.height, newHeight),
      };
    }

    return optimizedShelves;
  }

  private reduceShelvesSizes(
    shelves: Omit<Shelf, 'id' | 'zoneId'>[],
    zone: Zone,
    targetUtilization: number
  ): Omit<Shelf, 'id' | 'zoneId'>[] {
    const reductionFactor = Math.sqrt(targetUtilization / this.calculateUtilization(shelves, zone));
    
    return shelves.map(shelf => ({
      ...shelf,
      width: Math.max(0.8, shelf.width * reductionFactor), // Minimum shelf width
      height: Math.max(0.4, shelf.height * reductionFactor), // Minimum shelf depth
    }));
  }

  private calculateMaxShelfExpansion(
    shelf: Omit<Shelf, 'id' | 'zoneId'>,
    otherShelves: Omit<Shelf, 'id' | 'zoneId'>[],
    zone: Zone,
    dimension: 'width' | 'height'
  ): number {
    const minGap = 0.8; // Minimum walkway space
    
    if (dimension === 'width') {
      // Find the nearest shelf or zone boundary to the right
      let maxX = zone.width;
      
      otherShelves.forEach(otherShelf => {
        // Check if this shelf could block expansion
        if (otherShelf.y < shelf.y + shelf.height && otherShelf.y + otherShelf.height > shelf.y) {
          if (otherShelf.x > shelf.x) {
            maxX = Math.min(maxX, otherShelf.x - minGap);
          }
        }
      });
      
      return Math.max(shelf.width, maxX - shelf.x);
    } else {
      // Find the nearest shelf or zone boundary below
      let maxY = zone.height;
      
      otherShelves.forEach(otherShelf => {
        // Check if this shelf could block expansion
        if (otherShelf.x < shelf.x + shelf.width && otherShelf.x + otherShelf.width > shelf.x) {
          if (otherShelf.y > shelf.y) {
            maxY = Math.min(maxY, otherShelf.y - minGap);
          }
        }
      });
      
      return Math.max(shelf.height, maxY - shelf.y);
    }
  }

  private calculateUtilization(shelves: Omit<Shelf, 'id' | 'zoneId'>[], zone: Zone): number {
    const usedArea = shelves.reduce((sum, shelf) => sum + (shelf.width * shelf.height), 0);
    const zoneArea = zone.width * zone.height;
    return zoneArea > 0 ? usedArea / zoneArea : 0;
  }

  private inferZoneCategoryFromName(zoneName: string): string {
    const name = zoneName.toLowerCase();
    
    if (name.includes('grocery') || name.includes('food') || name.includes('produce')) return 'grocery';
    if (name.includes('electronic') || name.includes('tech') || name.includes('digital')) return 'electronics';
    if (name.includes('fashion') || name.includes('clothing') || name.includes('apparel')) return 'fashion';
    if (name.includes('beauty') || name.includes('cosmetic') || name.includes('health')) return 'beauty';
    if (name.includes('home') || name.includes('garden') || name.includes('furniture')) return 'home-garden';
    if (name.includes('book') || name.includes('media') || name.includes('entertainment')) return 'books-media';
    if (name.includes('toy') || name.includes('game') || name.includes('children')) return 'toys';
    if (name.includes('sport') || name.includes('fitness') || name.includes('outdoor')) return 'sports';
    if (name.includes('checkout') || name.includes('cash') || name.includes('register')) return 'checkout';
    if (name.includes('pharmacy') || name.includes('medicine') || name.includes('drug')) return 'pharmacy';
    
    return 'general';
  }

  private getAppropriateShelfCategories(zoneCategory: string): string[] {
    const categoryMap: Record<string, string[]> = {
      grocery: ['grocery', 'checkout'],
      electronics: ['electronics', 'checkout'],
      fashion: ['fashion', 'checkout'],
      beauty: ['beauty', 'pharmacy', 'checkout'],
      'home-garden': ['home-garden', 'checkout'],
      'books-media': ['books-media', 'checkout'],
      toys: ['toys', 'checkout'],
      sports: ['sports', 'checkout'],
      checkout: ['checkout'],
      pharmacy: ['pharmacy', 'beauty', 'checkout'],
      general: ['grocery', 'electronics', 'fashion', 'beauty', 'home-garden', 'checkout']
    };

    return categoryMap[zoneCategory] || ['general', 'checkout'];
  }

  private validateShelfCategory(category: string): string {
    const validCategories = [
      'grocery', 'electronics', 'fashion', 'beauty', 'home-garden',
      'books-media', 'toys', 'sports', 'checkout', 'pharmacy', 'automotive', 'general'
    ];

    return validCategories.includes(category) ? category : 'general';
  }

  private getFallbackShelfSuggestions(zone: Zone, existingShelves: Shelf[] = []): ShelfSuggestion[] {
    const zoneCategory = this.inferZoneCategoryFromName(zone.name);
    
    return [
      {
        id: `fallback-flow-${Date.now()}`,
        name: "Customer Flow Optimized Shelves",
        description: "Standard shelf layout optimized for customer flow and accessibility",
        efficiency: 75,
        spaceUtilization: 78,
        shelves: this.generateFallbackShelfLayout(zone, 'customer-flow', zoneCategory)
      },
      {
        id: `fallback-revenue-${Date.now()}`,
        name: "Revenue Maximized Shelf Layout",
        description: "Shelf arrangement focused on maximizing sales and product visibility",
        efficiency: 80,
        spaceUtilization: 82,
        shelves: this.generateFallbackShelfLayout(zone, 'revenue-optimization', zoneCategory)
      },
      {
        id: `fallback-operational-${Date.now()}`,
        name: "Operational Efficiency Layout",
        description: "Shelf organization optimized for restocking and inventory management",
        efficiency: 72,
        spaceUtilization: 75,
        shelves: this.generateFallbackShelfLayout(zone, 'operational-efficiency', zoneCategory)
      }
    ];
  }

  private generateFallbackShelfLayout(
    zone: Zone,
    strategy: 'customer-flow' | 'revenue-optimization' | 'operational-efficiency',
    zoneCategory: string
  ): Omit<Shelf, 'id' | 'zoneId'>[] {
    const shelves: Omit<Shelf, 'id' | 'zoneId'>[] = [];
    const appropriateCategories = this.getAppropriateShelfCategories(zoneCategory);
    
    // Calculate optimal shelf count based on zone size
    const maxShelves = Math.floor((zone.width * zone.height) / 2); // Rough estimate
    const targetShelves = Math.min(6, Math.max(2, maxShelves));
    
    const shelfWidth = Math.min(1.5, zone.width / 2);
    const shelfHeight = Math.min(0.6, zone.height / 3);
    
    for (let i = 0; i < targetShelves; i++) {
      const row = Math.floor(i / 2);
      const col = i % 2;
      
      const x = col * (shelfWidth + 1); // 1m gap between shelves
      const y = row * (shelfHeight + 1); // 1m gap between rows
      
      // Ensure shelf fits in zone
      if (x + shelfWidth <= zone.width && y + shelfHeight <= zone.height) {
        const categoryIndex = i % appropriateCategories.length;
        const category = appropriateCategories[categoryIndex];
        
        shelves.push({
          name: `${category.charAt(0).toUpperCase() + category.slice(1)} Shelf ${i + 1}`,
          category: category,
          x: x,
          y: y,
          width: shelfWidth,
          height: shelfHeight,
        });
      }
    }
    
    return shelves;
  }
}

export const shelfAIService = new ShelfAIService();
export default shelfAIService;
