import { GoogleGenerativeAI } from '@google/generative-ai';
import { Zone, LayoutSuggestion } from '@/types';

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
}

export const aiService = new AIService();