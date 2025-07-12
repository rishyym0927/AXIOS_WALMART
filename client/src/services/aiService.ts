import { GoogleGenerativeAI } from '@google/generative-ai';
import { Zone, LayoutSuggestion, Shelf } from '@/types';

class AIService {
  private genAI: GoogleGenerativeAI | null = null;

  constructor() {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (apiKey) {
      this.genAI = new GoogleGenerativeAI(apiKey);
    }
  }

  async generateLayoutSuggestions(
    storeWidth: number,
    storeHeight: number,
    existingZones: Zone[]
  ): Promise<LayoutSuggestion[]> {
    if (!this.genAI) {
      console.warn('Gemini API key not configured');
      return this.getFallbackSuggestions(storeWidth, storeHeight, existingZones);
    }

    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });

      const prompt = this.createLayoutPrompt(storeWidth, storeHeight, existingZones);
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const suggestions = this.parseAIResponse(text, storeWidth, storeHeight, existingZones);
      
      // Validate, fix overlapping zones, and optimize space usage
      return suggestions.map(suggestion => ({
        ...suggestion,
        zones: this.optimizeSpaceUtilization(
          this.validateAndFixLayout(suggestion.zones, storeWidth, storeHeight),
          storeWidth,
          storeHeight
        )
      }));
    } catch (error) {
      console.error('Error generating AI suggestions:', error);
      return this.getFallbackSuggestions(storeWidth, storeHeight, existingZones);
    }
  }

  private createLayoutPrompt(
    width: number,
    height: number,
    zones: Zone[]
  ): string {
    const zoneDescriptions = zones.map(
      (zone) => `${zone.name}: ${zone.width}m x ${zone.height}m (${zone.width * zone.height}m²)`
    ).join(', ');

    const totalZoneArea = zones.reduce((sum, zone) => sum + (zone.width * zone.height), 0);
    const storeArea = width * height;
    const utilizationRate = Math.round((totalZoneArea / storeArea) * 100);

    return `
You are an expert retail store layout designer. Create 3 optimal store layout suggestions for a ${width}m x ${height}m store (${storeArea}m² total area).

ZONES TO ARRANGE: ${zoneDescriptions}
Total zone area: ${totalZoneArea}m² (${utilizationRate}% of store space)

CRITICAL REQUIREMENTS:
1. NO OVERLAPPING ZONES - Each zone must have its own space
2. ALL zones must fit completely within the ${width}m x ${height}m store boundaries
3. MAXIMIZE SPACE UTILIZATION - Zones should be sized to use most of the available space
4. Leave minimum 1m walkways between zones where possible
5. Position zones logically based on retail best practices
6. Consider customer flow patterns (entrance typically at bottom-left or bottom-center)
7. IMPORTANT: The zones can be resized larger than their original dimensions to fill the space efficiently

SPACE OPTIMIZATION STRATEGY:
- Calculate the total available space and distribute it among zones
- Priority zones (like Cash Counter, Electronics) should get premium space allocation
- Zones can be expanded proportionally to fill unused areas
- Maintain logical proportions (don't make tiny zones huge or huge zones tiny)
- Target 85-95% space utilization for efficient layouts

Create 3 different layout strategies:

STRATEGY 1 - CUSTOMER FLOW OPTIMIZATION:
- Place high-attraction zones (Electronics, Fashion) near entrance
- Create natural walking paths through the store
- Position checkout/cash counter near exit
- Ensure smooth traffic flow without bottlenecks
- EXPAND zones to fill available space while maintaining flow

STRATEGY 2 - REVENUE MAXIMIZATION:
- Position high-margin categories in prime real estate
- Use power wall concepts (right-hand traffic flow)
- Place impulse-buy items near checkout
- Create discovery zones for new products
- ALLOCATE MORE SPACE to high-revenue generating zones

STRATEGY 3 - OPERATIONAL EFFICIENCY:
- Group zones by supply chain logistics
- Minimize staff walking distances
- Optimize for easy restocking and inventory management
- Position storage-intensive categories efficiently
- BALANCE zone sizes for operational needs

LAYOUT CALCULATION RULES:
- Start positioning from coordinates (0,0) at top-left
- X-axis goes from 0 to ${width}m (left to right)
- Y-axis goes from 0 to ${height}m (top to bottom)
- Each zone position (x,y) is its TOP-LEFT corner
- Zone must fit: x + width ≤ ${width} and y + height ≤ ${height}
- NO two zones can overlap: check that zones don't share the same space
- RESIZE zones to maximize space usage - zones can be larger than original sizes

SPACE ALLOCATION GUIDELINES:
- Cash Counter: Can be 1.5-2x original size for queue management
- Electronics: Can be expanded significantly for display space
- Grocery/Food: Should use substantial floor space for variety
- Fashion: Benefits from larger space for browsing
- Storage: Keep efficient but don't over-expand

RESPONSE FORMAT - Return valid JSON only:
{
  "suggestions": [
    {
      "name": "Customer Flow Optimized Layout",
      "description": "Detailed explanation of flow strategy and space optimization",
      "efficiency": 85,
      "spaceUtilization": 92,
      "zones": [
        {
          "name": "Zone Name",
          "color": "#hexcolor",
          "x": 0,
          "y": 0,
          "width": 10,
          "height": 5
        }
      ]
    },
    {
      "name": "Revenue Maximized Layout", 
      "description": "Detailed explanation of revenue strategy and space allocation",
      "efficiency": 88,
      "spaceUtilization": 95,
      "zones": [...]
    },
    {
      "name": "Operational Efficiency Layout",
      "description": "Detailed explanation of operational strategy and space optimization", 
      "efficiency": 82,
      "spaceUtilization": 88,
      "zones": [...]
    }
  ]
}

ZONE COLORS BY TYPE:
- Grocery/Food: #10b981 (green)
- Electronics: #3b82f6 (blue) 
- Fashion/Clothing: #8b5cf6 (purple)
- Cash Counter/Checkout: #f59e0b (orange)
- Books/Media: #06b6d4 (cyan)
- Home/Garden: #84cc16 (lime)
- Sports: #f97316 (orange-red)
- Beauty/Health: #ec4899 (pink)
- Toys: #6366f1 (indigo)
- Storage/Warehouse: #64748b (gray)

CRITICAL: Maximize space utilization by expanding zones to fill available space while maintaining logical proportions and ensuring no overlaps!
`;
  }

  private parseAIResponse(
    text: string,
    storeWidth: number,
    storeHeight: number,
    existingZones?: Zone[]
  ): LayoutSuggestion[] {
    try {
      // Extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in AI response');
      }

      const parsed = JSON.parse(jsonMatch[0]);
      
      if (!parsed.suggestions || !Array.isArray(parsed.suggestions)) {
        throw new Error('Invalid suggestions format');
      }

      return parsed.suggestions.map((suggestion: any, index: number) => ({
        id: `ai-${Date.now()}-${index}`,
        name: suggestion.name || `Layout ${index + 1}`,
        description: suggestion.description || 'AI-generated layout with space optimization',
        efficiency: Math.max(1, Math.min(100, suggestion.efficiency || 75)),
        spaceUtilization: Math.max(1, Math.min(100, suggestion.spaceUtilization || 85)),
        zones: suggestion.zones?.map((zone: any, zoneIndex: number) => ({
          id: `zone-${Date.now()}-${index}-${zoneIndex}`,
          name: zone.name,
          color: zone.color || this.getColorForZoneType(zone.name),
          x: Math.max(0, Math.min(zone.x || 0, storeWidth - (zone.width || 1))),
          y: Math.max(0, Math.min(zone.y || 0, storeHeight - (zone.height || 1))),
          width: Math.min(zone.width || 1, storeWidth),
          height: Math.min(zone.height || 1, storeHeight),
        })) || [],
      }));
    } catch (error) {
      console.error('Error parsing AI response:', error);
      return this.getFallbackSuggestions(storeWidth, storeHeight, existingZones);
    }
  }

  private validateAndFixLayout(zones: Zone[], storeWidth: number, storeHeight: number): Zone[] {
    if (!zones || zones.length === 0) return [];

    // Sort zones by area (largest first) for better placement
    const sortedZones = [...zones].sort((a, b) => (b.width * b.height) - (a.width * a.height));
    const placedZones: Zone[] = [];

    for (const zone of sortedZones) {
      const validPosition = this.findValidPosition(zone, placedZones, storeWidth, storeHeight);
      
      placedZones.push({
        ...zone,
        x: validPosition.x,
        y: validPosition.y,
        width: Math.min(zone.width, storeWidth),
        height: Math.min(zone.height, storeHeight),
      });
    }

    return placedZones;
  }

  private optimizeSpaceUtilization(zones: Zone[], storeWidth: number, storeHeight: number): Zone[] {
    if (!zones || zones.length === 0) return [];

    // Calculate current space utilization
    const currentUsedArea = zones.reduce((sum, zone) => sum + (zone.width * zone.height), 0);
    const totalArea = storeWidth * storeHeight;
    const currentUtilization = currentUsedArea / totalArea;

    // If utilization is already high (>85%), don't modify
    if (currentUtilization > 0.85) {
      return zones;
    }

    // Calculate expansion opportunities
    const optimizedZones = [...zones];
    const targetUtilization = 0.90; // Target 90% utilization
    const expansionFactor = Math.sqrt(targetUtilization / currentUtilization);

    // Expand zones while maintaining proportions and avoiding overlaps
    for (let i = 0; i < optimizedZones.length; i++) {
      const zone = optimizedZones[i];
      const otherZones = optimizedZones.filter((_, index) => index !== i);

      // Calculate maximum possible expansion
      const maxExpansion = this.calculateMaxExpansion(zone, otherZones, storeWidth, storeHeight);
      
      // Apply expansion with priority weighting
      const priority = this.getZonePriority(zone.name);
      const finalExpansion = Math.min(expansionFactor * priority, maxExpansion);

      // Expand the zone
      const newWidth = Math.min(zone.width * finalExpansion, storeWidth - zone.x);
      const newHeight = Math.min(zone.height * finalExpansion, storeHeight - zone.y);

      optimizedZones[i] = {
        ...zone,
        width: Math.max(zone.width, newWidth),
        height: Math.max(zone.height, newHeight),
      };
    }

    // Final validation to ensure no overlaps
    return this.resolveOverlaps(optimizedZones, storeWidth, storeHeight);
  }

  private calculateMaxExpansion(
    zone: Zone,
    otherZones: Zone[],
    storeWidth: number,
    storeHeight: number
  ): number {
    let maxWidthExpansion = (storeWidth - zone.x) / zone.width;
    let maxHeightExpansion = (storeHeight - zone.y) / zone.height;

    // Check constraints from other zones
    for (const otherZone of otherZones) {
      // Right expansion limit
      if (otherZone.x > zone.x && otherZone.y < zone.y + zone.height && otherZone.y + otherZone.height > zone.y) {
        maxWidthExpansion = Math.min(maxWidthExpansion, (otherZone.x - zone.x) / zone.width);
      }

      // Bottom expansion limit
      if (otherZone.y > zone.y && otherZone.x < zone.x + zone.width && otherZone.x + otherZone.width > zone.x) {
        maxHeightExpansion = Math.min(maxHeightExpansion, (otherZone.y - zone.y) / zone.height);
      }
    }

    return Math.min(maxWidthExpansion, maxHeightExpansion);
  }

  private getZonePriority(zoneName: string): number {
    const name = zoneName.toLowerCase();
    
    // High priority zones get more expansion
    if (name.includes('grocery') || name.includes('food')) return 1.4;
    if (name.includes('electronics')) return 1.3;
    if (name.includes('fashion') || name.includes('clothing')) return 1.2;
    if (name.includes('cash') || name.includes('checkout')) return 1.1;
    if (name.includes('books') || name.includes('media')) return 1.0;
    if (name.includes('home') || name.includes('garden')) return 1.2;
    if (name.includes('sports')) return 1.1;
    if (name.includes('beauty') || name.includes('health')) return 1.1;
    if (name.includes('toys')) return 1.0;
    if (name.includes('storage') || name.includes('warehouse')) return 0.8;
    
    return 1.0; // Default priority
  }

  private resolveOverlaps(zones: Zone[], storeWidth: number, storeHeight: number): Zone[] {
    const resolvedZones: Zone[] = [];
    
    for (const zone of zones) {
      let adjustedZone = { ...zone };
      
      // Check for overlaps with already resolved zones
      for (const resolvedZone of resolvedZones) {
        if (this.zonesOverlap(adjustedZone, resolvedZone)) {
          // Shrink the current zone to avoid overlap
          adjustedZone = this.shrinkZoneToAvoidOverlap(adjustedZone, resolvedZone, storeWidth, storeHeight);
        }
      }
      
      resolvedZones.push(adjustedZone);
    }
    
    return resolvedZones;
  }

  private shrinkZoneToAvoidOverlap(
    zone: Zone,
    conflictZone: Zone,
    storeWidth: number,
    storeHeight: number
  ): Zone {
    // Try to shrink width first
    const maxWidth = conflictZone.x > zone.x ? conflictZone.x - zone.x : zone.width;
    const maxHeight = conflictZone.y > zone.y ? conflictZone.y - zone.y : zone.height;
    
    return {
      ...zone,
      width: Math.max(1, Math.min(zone.width, maxWidth)),
      height: Math.max(1, Math.min(zone.height, maxHeight)),
    };
  }

  private findValidPosition(
    zone: Zone,
    placedZones: Zone[],
    storeWidth: number,
    storeHeight: number
  ): { x: number; y: number } {
    // Try to keep original position if valid
    if (this.isValidPosition(zone, zone.x, zone.y, placedZones, storeWidth, storeHeight)) {
      return { x: zone.x, y: zone.y };
    }

    // Grid search for valid position
    const step = 1; // 1m steps
    for (let y = 0; y <= storeHeight - zone.height; y += step) {
      for (let x = 0; x <= storeWidth - zone.width; x += step) {
        if (this.isValidPosition(zone, x, y, placedZones, storeWidth, storeHeight)) {
          return { x, y };
        }
      }
    }

    // If no valid position found, place at origin and resize if needed
    console.warn(`Could not find valid position for zone ${zone.name}, placing at origin`);
    return { x: 0, y: 0 };
  }

  private isValidPosition(
    zone: Zone,
    x: number,
    y: number,
    placedZones: Zone[],
    storeWidth: number,
    storeHeight: number
  ): boolean {
    // Check if zone fits within store boundaries
    if (x < 0 || y < 0 || x + zone.width > storeWidth || y + zone.height > storeHeight) {
      return false;
    }

    // Check for overlaps with placed zones
    for (const placedZone of placedZones) {
      if (this.zonesOverlap(
        { x, y, width: zone.width, height: zone.height },
        placedZone
      )) {
        return false;
      }
    }

    return true;
  }

  private zonesOverlap(zone1: { x: number; y: number; width: number; height: number }, zone2: Zone): boolean {
    return !(
      zone1.x + zone1.width <= zone2.x ||
      zone2.x + zone2.width <= zone1.x ||
      zone1.y + zone1.height <= zone2.y ||
      zone2.y + zone2.height <= zone1.y
    );
  }

  private getFallbackSuggestions(
    storeWidth: number,
    storeHeight: number,
    existingZones?: Zone[]
  ): LayoutSuggestion[] {
    const zones = existingZones && existingZones.length > 0 ? existingZones : [
      { id: '1', name: 'Grocery', color: '#10b981', x: 0, y: 0, width: 8, height: 6 },
      { id: '2', name: 'Electronics', color: '#3b82f6', x: 0, y: 0, width: 8, height: 6 },
      { id: '3', name: 'Cash Counter', color: '#f59e0b', x: 0, y: 0, width: 4, height: 3 },
    ];

    return [
      {
        id: 'fallback-1',
        name: 'Customer Flow Optimized Layout',
        description: 'Strategic positioning with maximized space utilization for optimal customer flow',
        efficiency: 85,
        zones: this.optimizeSpaceUtilization(
          this.validateAndFixLayout(
            this.createFlowOptimizedLayout(zones, storeWidth, storeHeight),
            storeWidth,
            storeHeight
          ),
          storeWidth,
          storeHeight
        ),
      },
      {
        id: 'fallback-2',
        name: 'Revenue Maximized Layout',
        description: 'High-margin products in prime locations with optimized space allocation for maximum sales',
        efficiency: 90,
        zones: this.optimizeSpaceUtilization(
          this.validateAndFixLayout(
            this.createRevenueOptimizedLayout(zones, storeWidth, storeHeight),
            storeWidth,
            storeHeight
          ),
          storeWidth,
          storeHeight
        ),
      },
      {
        id: 'fallback-3',
        name: 'Operational Efficiency Layout',
        description: 'Minimized staff movement with balanced space utilization for efficient operations',
        efficiency: 82,
        zones: this.optimizeSpaceUtilization(
          this.validateAndFixLayout(
            this.createEfficiencyOptimizedLayout(zones, storeWidth, storeHeight),
            storeWidth,
            storeHeight
          ),
          storeWidth,
          storeHeight
        ),
      },
    ];
  }

  private createFlowOptimizedLayout(zones: Zone[], storeWidth: number, storeHeight: number): Zone[] {
    return zones.map((zone, index) => {
      let x = 1;
      let y = 1;

      // Flow pattern: entrance at bottom, checkout near exit
      if (zone.name.toLowerCase().includes('cash') || zone.name.toLowerCase().includes('checkout')) {
        x = Math.max(1, storeWidth - zone.width - 1);
        y = Math.max(1, storeHeight - zone.height - 1);
      } else if (zone.name.toLowerCase().includes('electronics')) {
        x = 1;
        y = 1; // Prime entrance location
      } else {
        // Distribute other zones efficiently
        const cols = Math.max(1, Math.floor(storeWidth / 8));
        const rows = Math.max(1, Math.floor(storeHeight / 6));
        x = 1 + (index % cols) * Math.floor(storeWidth / Math.max(cols, 1));
        y = 1 + Math.floor(index / cols) * Math.floor(storeHeight / Math.max(rows, 1));
      }

      return {
        ...zone,
        id: `flow-${Date.now()}-${index}`,
        x: Math.max(0, Math.min(x, storeWidth - zone.width)),
        y: Math.max(0, Math.min(y, storeHeight - zone.height)),
      };
    });
  }

  private createRevenueOptimizedLayout(zones: Zone[], storeWidth: number, storeHeight: number): Zone[] {
    return zones.map((zone, index) => {
      let x = 1;
      let y = 1;

      // Revenue optimization: high-margin items in power positions
      if (zone.name.toLowerCase().includes('electronics')) {
        x = Math.max(1, Math.floor(storeWidth * 0.6)); // Right side power position
        y = 1;
      } else if (zone.name.toLowerCase().includes('cash')) {
        x = Math.max(1, Math.floor(storeWidth * 0.7));
        y = Math.max(1, Math.floor(storeHeight * 0.7));
      } else {
        // Strategic placement for other zones
        x = 1 + (index % 2) * Math.floor(storeWidth * 0.4);
        y = 1 + Math.floor(index / 2) * Math.floor(storeHeight * 0.3);
      }

      return {
        ...zone,
        id: `revenue-${Date.now()}-${index}`,
        x: Math.max(0, Math.min(x, storeWidth - zone.width)),
        y: Math.max(0, Math.min(y, storeHeight - zone.height)),
      };
    });
  }

  private createEfficiencyOptimizedLayout(zones: Zone[], storeWidth: number, storeHeight: number): Zone[] {
    return zones.map((zone, index) => {
      // Clustered layout for minimal staff movement
      const cols = Math.max(1, Math.floor(Math.sqrt(zones.length)));
      const cellWidth = Math.floor(storeWidth / cols);
      const cellHeight = Math.floor(storeHeight / Math.ceil(zones.length / cols));

      const col = index % cols;
      const row = Math.floor(index / cols);

      const x = Math.max(0, Math.min(col * cellWidth, storeWidth - zone.width));
      const y = Math.max(0, Math.min(row * cellHeight, storeHeight - zone.height));

      return {
        ...zone,
        id: `efficiency-${Date.now()}-${index}`,
        x,
        y,
      };
    });
  }

  private getColorForZoneType(zoneName: string): string {
    const name = zoneName.toLowerCase();
    
    if (name.includes('grocery') || name.includes('food')) return '#10b981';
    if (name.includes('electronics')) return '#3b82f6';
    if (name.includes('fashion') || name.includes('clothing')) return '#8b5cf6';
    if (name.includes('cash') || name.includes('checkout')) return '#f59e0b';
    if (name.includes('books') || name.includes('media')) return '#06b6d4';
    if (name.includes('home') || name.includes('garden')) return '#84cc16';
    if (name.includes('sports')) return '#f97316';
    if (name.includes('beauty') || name.includes('health')) return '#ec4899';
    if (name.includes('toys')) return '#6366f1';
    if (name.includes('storage') || name.includes('warehouse')) return '#64748b';
    
    return this.getRandomColor();
  }

  private getRandomColor(): string {
    const colors = [
      '#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6',
      '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6366f1'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  async generateShelfOptimizationSuggestions(
    zone: Zone,
    existingShelves: Shelf[]
  ): Promise<{
    suggestions: Array<{
      id: string;
      name: string;
      description: string;
      shelves: Shelf[];
      metrics: {
        utilization: number;
        efficiency: number;
        accessibility: number;
      };
    }>;
  }> {
    if (!this.genAI) {
      console.warn('Gemini API key not configured');
      return {
        suggestions: this.getFallbackShelfOptimization(zone, existingShelves)
      };
    }

    // If no existing shelves, return empty suggestions
    if (!existingShelves || existingShelves.length === 0) {
      return {
        suggestions: [{
          id: 'no-shelves',
          name: 'No Shelves to Optimize',
          description: 'Add some shelves first to optimize their positioning and sizing',
          shelves: [],
          metrics: { utilization: 0, efficiency: 0, accessibility: 0 }
        }]
      };
    }

    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });

      const prompt = this.createShelfOptimizationPrompt(zone, existingShelves);
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return this.parseShelfOptimizationResponse(text, zone, existingShelves);
    } catch (error) {
      console.error('Error generating shelf optimization suggestions:', error);
      return {
        suggestions: this.getFallbackShelfOptimization(zone, existingShelves)
      };
    }
  }

  private createShelfOptimizationPrompt(zone: Zone, shelves: Shelf[]): string {
    const shelfDescriptions = shelves.map(
      (shelf) => `${shelf.name}: ${shelf.width}m x ${shelf.height}m at (${shelf.x}, ${shelf.y}) - Category: ${shelf.category}`
    ).join('\n');

    const totalShelfArea = shelves.reduce((sum, shelf) => sum + (shelf.width * shelf.height), 0);
    const zoneArea = zone.width * zone.height;
    const currentUtilization = Math.round((totalShelfArea / zoneArea) * 100);

    return `
You are a retail shelf optimization expert. Your task is to REPOSITION and RESIZE the existing shelves to maximize space utilization while leaving appropriate walkways for customers.

ZONE DETAILS:
- Name: ${zone.name}
- Dimensions: ${zone.width}m x ${zone.height}m (${zoneArea}m²)
- Current shelf utilization: ${currentUtilization}%

EXISTING SHELVES TO OPTIMIZE (DO NOT CREATE NEW ONES):
${shelfDescriptions}

OPTIMIZATION OBJECTIVES:
1. Maximize space utilization (target 75-85% of zone area)
2. Improve customer flow and accessibility 
3. Maintain minimum 0.8m walkways between shelves
4. Eliminate overlapping shelves
5. Optimize for customer shopping experience
6. Keep existing shelf categories - just reposition and resize

CONSTRAINTS:
- MUST include exactly ${shelves.length} shelves (same as existing)
- MUST use the same shelf names and categories
- CAN reposition shelves anywhere within zone boundaries
- CAN resize shelves (minimum 0.5m x 0.3m, maximum zone dimensions)
- MUST maintain minimum 0.8m gaps between shelves for customer walkways
- ALL shelves must fit completely within ${zone.width}m x ${zone.height}m zone

SPACE OPTIMIZATION STRATEGIES:

STRATEGY 1 - SPACE MAXIMIZATION:
- Arrange shelves to eliminate wasted space
- Resize shelves to fill available area efficiently
- Create systematic grid or aisle patterns
- Maintain logical customer flow paths
- Target 80-85% space utilization

STRATEGY 2 - CUSTOMER FLOW OPTIMIZATION:
- Position shelves to create natural walking paths
- Place high-traffic categories near zone entrance
- Ensure wide main aisles (1.2m+) and secondary walkways (0.8m+)
- Create intuitive navigation through the zone
- Target 75-80% space utilization with better accessibility

STRATEGY 3 - CATEGORY GROUPING:
- Group related shelf categories together
- Create logical product adjacencies
- Organize for easy restocking and inventory
- Maintain efficient staff movement patterns
- Balance space usage with operational efficiency

POSITIONING GUIDELINES:
- Coordinates (0,0) = zone top-left corner
- X-axis: 0 to ${zone.width}m (left to right)
- Y-axis: 0 to ${zone.height}m (top to bottom)
- Each shelf position (x,y) = shelf's top-left corner
- No overlaps: shelf rectangles cannot share space
- Minimum 0.8m clearance between shelf edges

RESPONSE FORMAT (JSON only):
{
  "suggestions": [
    {
      "name": "Space Maximized Layout",
      "description": "Repositioned and resized shelves for maximum space utilization",
      "utilization": 82,
      "efficiency": 85,
      "accessibility": 80,
      "shelves": [
        {
          "id": "existing-shelf-id",
          "name": "Existing Shelf Name",
          "category": "existing-category",
          "x": 0.5,
          "y": 1.0,
          "width": 1.5,
          "height": 0.6
        }
      ]
    },
    {
      "name": "Flow Optimized Layout",
      "description": "Repositioned shelves for optimal customer flow and accessibility",
      "utilization": 78,
      "efficiency": 80,
      "accessibility": 90,
      "shelves": [...]
    },
    {
      "name": "Category Grouped Layout", 
      "description": "Organized shelves by category with balanced space usage",
      "utilization": 75,
      "efficiency": 88,
      "accessibility": 85,
      "shelves": [...]
    }
  ]
}

CRITICAL: Only reposition and resize the ${shelves.length} existing shelves. Do not create new shelves or remove existing ones. Focus on maximizing space utilization while maintaining good customer walkways!
`;
  }

  private parseShelfOptimizationResponse(
    text: string,
    zone: Zone,
    existingShelves: Shelf[]
  ): {
    suggestions: Array<{
      id: string;
      name: string;
      description: string;
      shelves: Shelf[];
      metrics: {
        utilization: number;
        efficiency: number;
        accessibility: number;
      };
    }>;
  } {
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in shelf optimization response');
      }

      const parsed = JSON.parse(jsonMatch[0]);
      
      if (!parsed.suggestions || !Array.isArray(parsed.suggestions)) {
        throw new Error('Invalid shelf optimization format');
      }

      return {
        suggestions: parsed.suggestions.map((suggestion: any, index: number) => ({
          id: `shelf-opt-${Date.now()}-${index}`,
          name: suggestion.name || `Shelf Layout ${index + 1}`,
          description: suggestion.description || 'AI-optimized shelf arrangement',
          shelves: this.validateAndOptimizeShelfPositions(
            suggestion.shelves?.map((shelfData: any, shelfIndex: number) => {
              // Try to map back to existing shelf or create based on existing shelf data
              const existingShelf = existingShelves.find(s => s.id === shelfData.id) || 
                                   existingShelves[shelfIndex] || 
                                   existingShelves[0]; // fallback
              
              return {
                id: shelfData.id || existingShelf?.id || `shelf-${Date.now()}-${shelfIndex}`,
                name: shelfData.name || existingShelf?.name || 'Optimized Shelf',
                category: this.validateShelfCategory(shelfData.category || existingShelf?.category || 'general'),
                x: Math.max(0, Math.min(shelfData.x || 0, zone.width - (shelfData.width || 1))),
                y: Math.max(0, Math.min(shelfData.y || 0, zone.height - (shelfData.height || 1))),
                width: Math.min(shelfData.width || existingShelf?.width || 1.2, zone.width),
                height: Math.min(shelfData.height || existingShelf?.height || 0.5, zone.height),
                zoneId: zone.id,
                isOverlapping: false
              };
            }) || [],
            zone,
            existingShelves
          ),
          metrics: {
            utilization: Math.max(1, Math.min(100, suggestion.utilization || 75)),
            efficiency: Math.max(1, Math.min(100, suggestion.efficiency || 75)),
            accessibility: Math.max(1, Math.min(100, suggestion.accessibility || 75))
          }
        }))
      };
    } catch (error) {
      console.error('Error parsing shelf optimization response:', error);
      return {
        suggestions: this.getFallbackShelfOptimization(zone, existingShelves)
      };
    }
  }

  private validateAndOptimizeShelfPositions(
    shelves: Shelf[], 
    zone: Zone, 
    existingShelves: Shelf[]
  ): Shelf[] {
    if (!shelves || shelves.length === 0) {
      return existingShelves; // Return original shelves if no optimization provided
    }

    // Ensure we have the same number of shelves as the existing ones
    if (shelves.length !== existingShelves.length) {
      console.warn(`Shelf count mismatch: expected ${existingShelves.length}, got ${shelves.length}. Using fallback optimization.`);
      return this.createOptimizedShelfLayout(existingShelves, zone);
    }

    // Validate and fix positions
    const validatedShelves: Shelf[] = [];
    
    for (let i = 0; i < shelves.length; i++) {
      const shelf = shelves[i];
      const originalShelf = existingShelves[i];
      
      // Ensure shelf fits in zone
      let validShelf = {
        ...shelf,
        id: originalShelf.id, // Keep original ID
        zoneId: zone.id,
        x: Math.max(0, Math.min(shelf.x, zone.width - shelf.width)),
        y: Math.max(0, Math.min(shelf.y, zone.height - shelf.height)),
        width: Math.max(0.5, Math.min(shelf.width, zone.width)),
        height: Math.max(0.3, Math.min(shelf.height, zone.height)),
        isOverlapping: false
      };

      // Check for overlaps with already placed shelves
      const hasOverlap = validatedShelves.some(existing => 
        this.doShelvesOverlap(validShelf, existing, 0.8) // 0.8m minimum gap
      );
      
      if (hasOverlap) {
        // Try to find a valid position
        const validPosition = this.findValidShelfPosition(validShelf, validatedShelves, zone);
        if (validPosition) {
          validShelf.x = validPosition.x;
          validShelf.y = validPosition.y;
        } else {
          // If no valid position found, use a fallback position
          const fallbackPosition = this.findFallbackPosition(i, existingShelves.length, zone);
          validShelf.x = fallbackPosition.x;
          validShelf.y = fallbackPosition.y;
          validShelf.width = Math.min(validShelf.width, zone.width - validShelf.x);
          validShelf.height = Math.min(validShelf.height, zone.height - validShelf.y);
        }
      }
      
      validatedShelves.push(validShelf);
    }
    
    return validatedShelves;
  }

  private createOptimizedShelfLayout(existingShelves: Shelf[], zone: Zone): Shelf[] {
    // Simple grid-based optimization for existing shelves
    const optimized: Shelf[] = [];
    const shelfGap = 0.8; // Minimum gap between shelves
    const marginsX = 0.5;
    const marginsY = 0.5;
    
    const availableWidth = zone.width - (2 * marginsX);
    const availableHeight = zone.height - (2 * marginsY);
    
    // Calculate optimal grid layout
    const shelvesPerRow = Math.max(1, Math.floor(Math.sqrt(existingShelves.length)));
    const rows = Math.ceil(existingShelves.length / shelvesPerRow);
    
    const cellWidth = (availableWidth - (shelvesPerRow - 1) * shelfGap) / shelvesPerRow;
    const cellHeight = (availableHeight - (rows - 1) * shelfGap) / rows;
    
    existingShelves.forEach((shelf, index) => {
      const row = Math.floor(index / shelvesPerRow);
      const col = index % shelvesPerRow;
      
      const x = marginsX + col * (cellWidth + shelfGap);
      const y = marginsY + row * (cellHeight + shelfGap);
      
      optimized.push({
        ...shelf,
        x: Math.max(0, x),
        y: Math.max(0, y),
        width: Math.min(cellWidth * 0.9, shelf.width, zone.width - x), // 90% of cell width
        height: Math.min(cellHeight * 0.9, shelf.height, zone.height - y), // 90% of cell height
        isOverlapping: false
      });
    });
    
    return optimized;
  }

  private findFallbackPosition(index: number, totalShelves: number, zone: Zone): { x: number; y: number } {
    // Simple grid fallback
    const cols = Math.max(1, Math.floor(Math.sqrt(totalShelves)));
    const row = Math.floor(index / cols);
    const col = index % cols;
    
    const cellWidth = zone.width / cols;
    const cellHeight = zone.height / Math.ceil(totalShelves / cols);
    
    return {
      x: Math.max(0, col * cellWidth + 0.2),
      y: Math.max(0, row * cellHeight + 0.2)
    };
  }

  private validateShelfPositions(shelves: Shelf[], zone: Zone): Shelf[] {
    // Ensure no overlaps and all shelves fit within zone
    const validatedShelves: Shelf[] = [];
    
    for (const shelf of shelves) {
      // Check if shelf fits in zone
      if (shelf.x + shelf.width <= zone.width && shelf.y + shelf.height <= zone.height) {
        // Check for overlaps with already placed shelves
        const hasOverlap = validatedShelves.some(existing => 
          this.doShelvesOverlap(shelf, existing)
        );
        
        if (!hasOverlap) {
          validatedShelves.push({ ...shelf, isOverlapping: false });
        } else {
          // Try to find a valid position
          const validPosition = this.findValidShelfPosition(shelf, validatedShelves, zone);
          if (validPosition) {
            validatedShelves.push({
              ...shelf,
              x: validPosition.x,
              y: validPosition.y,
              isOverlapping: false
            });
          }
        }
      }
    }
    
    return validatedShelves;
  }

  private doShelvesOverlap(shelf1: Shelf, shelf2: Shelf, minGap: number = 0.1): boolean {
    return !(
      shelf1.x + shelf1.width + minGap <= shelf2.x ||
      shelf2.x + shelf2.width + minGap <= shelf1.x ||
      shelf1.y + shelf1.height + minGap <= shelf2.y ||
      shelf2.y + shelf2.height + minGap <= shelf1.y
    );
  }

  private findValidShelfPosition(
    shelf: Shelf,
    existingShelves: Shelf[],
    zone: Zone
  ): { x: number; y: number } | null {
    const stepSize = 0.2;
    const minGap = 0.8;
    
    for (let y = 0; y <= zone.height - shelf.height; y += stepSize) {
      for (let x = 0; x <= zone.width - shelf.width; x += stepSize) {
        const testShelf = { ...shelf, x, y };
        
        const hasOverlap = existingShelves.some(existing => 
          this.doShelvesOverlap(testShelf, existing, minGap)
        );
        
        if (!hasOverlap) {
          return { x, y };
        }
      }
    }
    
    return null;
  }

  private getFallbackShelfOptimization(
    zone: Zone,
    existingShelves: Shelf[]
  ): Array<{
    id: string;
    name: string;
    description: string;
    shelves: Shelf[];
    metrics: {
      utilization: number;
      efficiency: number;
      accessibility: number;
    };
  }> {
    // If no existing shelves, return simple message
    if (!existingShelves || existingShelves.length === 0) {
      return [{
        id: `no-shelves-${Date.now()}`,
        name: "No Shelves Available",
        description: "Add shelves to this zone first, then use AI optimization to position them optimally",
        shelves: [],
        metrics: {
          utilization: 0,
          efficiency: 0,
          accessibility: 0
        }
      }];
    }

    return [
      {
        id: `fallback-opt-${Date.now()}-1`,
        name: "Grid Layout Optimization",
        description: "Systematic grid-based arrangement of existing shelves for maximum space utilization",
        shelves: this.createOptimizedShelfLayout(existingShelves, zone),
        metrics: {
          utilization: 75,
          efficiency: 70,
          accessibility: 85
        }
      },
      {
        id: `fallback-opt-${Date.now()}-2`,
        name: "Flow Optimized Layout",
        description: "Customer flow-focused positioning with wide aisles and logical navigation paths",
        shelves: this.createFlowOptimizedShelfLayout(existingShelves, zone),
        metrics: {
          utilization: 68,
          efficiency: 75,
          accessibility: 92
        }
      },
      {
        id: `fallback-opt-${Date.now()}-3`,
        name: "Category Grouped Layout",
        description: "Organized by category with optimized spacing for operational efficiency",
        shelves: this.createCategoryOptimizedShelfLayout(existingShelves, zone),
        metrics: {
          utilization: 72,
          efficiency: 88,
          accessibility: 80
        }
      }
    ];
  }

  private createFlowOptimizedShelfLayout(existingShelves: Shelf[], zone: Zone): Shelf[] {
    // Create wider aisles and better flow
    const optimized: Shelf[] = [];
    const aisleWidth = 1.2; // Wider aisles for better flow
    const margin = 0.5;
    
    const availableWidth = zone.width - (2 * margin);
    const availableHeight = zone.height - (2 * margin);
    
    // Position shelves with emphasis on flow
    existingShelves.forEach((shelf, index) => {
      const shelvesPerRow = Math.max(1, Math.floor(availableWidth / (shelf.width + aisleWidth)));
      const row = Math.floor(index / shelvesPerRow);
      const col = index % shelvesPerRow;
      
      const x = margin + col * (shelf.width + aisleWidth);
      const y = margin + row * (shelf.height + aisleWidth);
      
      optimized.push({
        ...shelf,
        x: Math.max(0, Math.min(x, zone.width - shelf.width)),
        y: Math.max(0, Math.min(y, zone.height - shelf.height)),
        isOverlapping: false
      });
    });
    
    return optimized;
  }

  private createCategoryOptimizedShelfLayout(existingShelves: Shelf[], zone: Zone): Shelf[] {
    // Group by category and optimize within groups
    const shelfsByCategory = existingShelves.reduce((acc, shelf) => {
      if (!acc[shelf.category]) {
        acc[shelf.category] = [];
      }
      acc[shelf.category].push(shelf);
      return acc;
    }, {} as Record<string, Shelf[]>);
    
    const optimized: Shelf[] = [];
    let currentY = 0.5;
    const margin = 0.5;
    
    Object.entries(shelfsByCategory).forEach(([category, shelves]) => {
      let currentX = margin;
      let maxHeightInGroup = 0;
      
      shelves.forEach((shelf) => {
        // If shelf won't fit in current row, move to next row
        if (currentX + shelf.width > zone.width - margin) {
          currentX = margin;
          currentY += maxHeightInGroup + 0.8; // Gap between category groups
          maxHeightInGroup = 0;
        }
        
        optimized.push({
          ...shelf,
          x: currentX,
          y: Math.min(currentY, zone.height - shelf.height),
          isOverlapping: false
        });
        
        currentX += shelf.width + 0.8;
        maxHeightInGroup = Math.max(maxHeightInGroup, shelf.height);
      });
      
      currentY += maxHeightInGroup + 1.0; // Larger gap between different categories
    });
    
    return optimized;
  }

  private validateShelfCategory(category: string): string {
    const validCategories = [
      'grocery', 'electronics', 'fashion', 'beauty', 'home-garden',
      'books-media', 'toys', 'sports', 'checkout', 'pharmacy', 'automotive', 'general'
    ];
    return validCategories.includes(category) ? category : 'general';
  }
}

export const aiService = new AIService();