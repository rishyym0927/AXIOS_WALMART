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
      
      // Validate and fix overlapping zones
      return suggestions.map(suggestion => ({
        ...suggestion,
        zones: this.validateAndFixLayout(suggestion.zones, storeWidth, storeHeight)
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
3. Leave minimum 1m walkways between zones where possible
4. Position zones logically based on retail best practices
5. Consider customer flow patterns (entrance typically at bottom-left or bottom-center)

Create 3 different layout strategies:

STRATEGY 1 - CUSTOMER FLOW OPTIMIZATION:
- Place high-attraction zones (Electronics, Fashion) near entrance
- Create natural walking paths through the store
- Position checkout/cash counter near exit
- Ensure smooth traffic flow without bottlenecks

STRATEGY 2 - REVENUE MAXIMIZATION:
- Position high-margin categories in prime real estate
- Use power wall concepts (right-hand traffic flow)
- Place impulse-buy items near checkout
- Create discovery zones for new products

STRATEGY 3 - OPERATIONAL EFFICIENCY:
- Group zones by supply chain logistics
- Minimize staff walking distances
- Optimize for easy restocking and inventory management
- Position storage-intensive categories efficiently

LAYOUT CALCULATION RULES:
- Start positioning from coordinates (0,0) at top-left
- X-axis goes from 0 to ${width}m (left to right)
- Y-axis goes from 0 to ${height}m (top to bottom)
- Each zone position (x,y) is its TOP-LEFT corner
- Zone must fit: x + width ≤ ${width} and y + height ≤ ${height}
- NO two zones can overlap: check that zones don't share the same space

RESPONSE FORMAT - Return valid JSON only:
{
  "suggestions": [
    {
      "name": "Customer Flow Optimized Layout",
      "description": "Detailed explanation of flow strategy and zone positioning logic",
      "efficiency": 85,
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
      "description": "Detailed explanation of revenue strategy and positioning",
      "efficiency": 88,
      "zones": [...]
    },
    {
      "name": "Operational Efficiency Layout",
      "description": "Detailed explanation of operational strategy", 
      "efficiency": 82,
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

IMPORTANT: Double-check that no zones overlap and all fit within ${width}m x ${height}m boundaries!
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
        description: suggestion.description || 'AI-generated layout',
        efficiency: Math.max(1, Math.min(100, suggestion.efficiency || 75)),
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
        description: 'Strategic positioning to guide customers through high-value areas with natural flow patterns',
        efficiency: 85,
        zones: this.validateAndFixLayout(
          this.createFlowOptimizedLayout(zones, storeWidth, storeHeight),
          storeWidth,
          storeHeight
        ),
      },
      {
        id: 'fallback-2',
        name: 'Revenue Maximized Layout',
        description: 'High-margin products in prime locations with optimized customer journey for maximum sales',
        efficiency: 90,
        zones: this.validateAndFixLayout(
          this.createRevenueOptimizedLayout(zones, storeWidth, storeHeight),
          storeWidth,
          storeHeight
        ),
      },
      {
        id: 'fallback-3',
        name: 'Operational Efficiency Layout',
        description: 'Minimized staff movement and optimized logistics flow for efficient store operations',
        efficiency: 80,
        zones: this.validateAndFixLayout(
          this.createEfficiencyOptimizedLayout(zones, storeWidth, storeHeight),
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
        // Distribute other zones
        const cols = Math.floor(storeWidth / 8);
        const rows = Math.floor(storeHeight / 6);
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
        x = Math.floor(storeWidth * 0.7); // Right wall (power wall)
        y = 1;
      } else if (zone.name.toLowerCase().includes('cash')) {
        x = Math.floor(storeWidth * 0.6);
        y = Math.floor(storeHeight * 0.8);
      } else {
        // Strategic placement for other zones
        x = 1 + (index % 2) * Math.floor(storeWidth * 0.5);
        y = 1 + Math.floor(index / 2) * Math.floor(storeHeight * 0.4);
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