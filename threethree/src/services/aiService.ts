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

      return this.parseAIResponse(text, storeWidth, storeHeight, existingZones);
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
      (zone) => `${zone.name} (${zone.width}m x ${zone.height}m at position ${zone.x}, ${zone.y})`
    ).join(', ');

    const zoneTypes = [...new Set(zones.map(zone => zone.name))];

    return `
You are a retail store layout expert. Generate 3 optimal store layout suggestions for a ${width}m x ${height}m store.

Current zones that MUST be included in ALL suggestions: ${zoneDescriptions}

Zone types to include: ${zoneTypes.join(', ')}

Please provide 3 different layout suggestions that optimize:
1. Customer flow and accessibility
2. Revenue maximization  
3. Operational efficiency

IMPORTANT: Each suggestion must include ALL the following zone types: ${zoneTypes.join(', ')}
If a zone type exists multiple times, include all instances.

For each suggestion, provide:
- A descriptive name
- Brief explanation of the layout strategy
- Optimal positioning for each zone (repositioned for better layout)
- Efficiency score (1-100)

Format your response as valid JSON with this structure:
{
  "suggestions": [
    {
      "name": "Layout Name",
      "description": "Brief description",
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
    }
  ]
}

Requirements:
- Include exactly ${zones.length} zones in each suggestion (one for each existing zone)
- Zone names must match the existing zones: ${zoneTypes.join(', ')}
- All zones must fit within the ${width}m x ${height}m space without overlapping
- Use appropriate colors for each zone type
- Optimize positions for the stated strategy (customer flow, revenue, or efficiency)
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
      
      return parsed.suggestions.map((suggestion: any, index: number) => ({
        id: `ai-${Date.now()}-${index}`,
        name: suggestion.name,
        description: suggestion.description,
        efficiency: suggestion.efficiency,
        zones: suggestion.zones.map((zone: any, zoneIndex: number) => ({
          id: `zone-${Date.now()}-${index}-${zoneIndex}`,
          name: zone.name,
          color: zone.color || this.getRandomColor(),
          x: Math.max(0, Math.min(zone.x, storeWidth - zone.width)),
          y: Math.max(0, Math.min(zone.y, storeHeight - zone.height)),
          width: Math.min(zone.width, storeWidth),
          height: Math.min(zone.height, storeHeight),
        })),
      }));
    } catch (error) {
      console.error('Error parsing AI response:', error);
      return this.getFallbackSuggestions(storeWidth, storeHeight, existingZones);
    }
  }

  private getFallbackSuggestions(
    storeWidth: number,
    storeHeight: number,
    existingZones?: Zone[]
  ): LayoutSuggestion[] {
    // If we have existing zones, use them; otherwise use default zones
    const zones = existingZones && existingZones.length > 0 ? existingZones : [
      { id: '1', name: 'Grocery', color: '#10b981', x: 0, y: 0, width: 10, height: 8 },
      { id: '2', name: 'Electronics', color: '#3b82f6', x: 0, y: 0, width: 10, height: 8 },
      { id: '3', name: 'Cash Counter', color: '#f59e0b', x: 0, y: 0, width: 6, height: 4 },
    ];

    return [
      {
        id: 'fallback-1',
        name: 'Customer Flow Optimized',
        description: 'Layout designed to guide customers through high-margin areas',
        efficiency: 82,
        zones: zones.map((zone, index) => {
          // Position zones for customer flow optimization
          const positions = this.getOptimizedPositions(zones, storeWidth, storeHeight, 'flow');
          return {
            ...zone,
            id: `zone-${Date.now()}-1-${index}`,
            x: positions[index].x,
            y: positions[index].y,
          };
        }),
      },
      {
        id: 'fallback-2',
        name: 'Revenue Maximized',
        description: 'High-margin products at eye level and strategic locations',
        efficiency: 88,
        zones: zones.map((zone, index) => {
          // Position zones for revenue maximization
          const positions = this.getOptimizedPositions(zones, storeWidth, storeHeight, 'revenue');
          return {
            ...zone,
            id: `zone-${Date.now()}-2-${index}`,
            x: positions[index].x,
            y: positions[index].y,
          };
        }),
      },
      {
        id: 'fallback-3',
        name: 'Operational Efficiency',
        description: 'Minimizes staff movement and maximizes restocking efficiency',
        efficiency: 79,
        zones: zones.map((zone, index) => {
          // Position zones for operational efficiency
          const positions = this.getOptimizedPositions(zones, storeWidth, storeHeight, 'efficiency');
          return {
            ...zone,
            id: `zone-${Date.now()}-3-${index}`,
            x: positions[index].x,
            y: positions[index].y,
          };
        }),
      },
    ];
  }

  private getOptimizedPositions(
    zones: Zone[],
    storeWidth: number,
    storeHeight: number,
    strategy: 'flow' | 'revenue' | 'efficiency'
  ): Array<{ x: number, y: number }> {
    const positions: Array<{ x: number, y: number }> = [];
    
    zones.forEach((zone, index) => {
      let x = 2;
      let y = 2;
      
      switch (strategy) {
        case 'flow':
          // Arrange zones in a flow pattern - left to right, top to bottom
          x = 2 + (index % 2) * Math.floor(storeWidth * 0.45);
          y = 2 + Math.floor(index / 2) * Math.floor(storeHeight * 0.4);
          break;
          
        case 'revenue':
          // High-value zones (Electronics) at entrance, others strategically placed
          if (zone.name.toLowerCase().includes('electronics')) {
            x = 2;
            y = 2;
          } else if (zone.name.toLowerCase().includes('cash')) {
            x = Math.floor(storeWidth * 0.7);
            y = Math.floor(storeHeight * 0.7);
          } else {
            x = Math.floor(storeWidth * 0.5);
            y = 2;
          }
          break;
          
        case 'efficiency':
          // Arrange zones for minimal staff movement - clustered layout
          x = 2 + (index % 3) * Math.floor(storeWidth * 0.3);
          y = 2 + Math.floor(index / 3) * Math.floor(storeHeight * 0.45);
          break;
      }
      
      // Ensure zone fits within store boundaries
      x = Math.max(1, Math.min(x, storeWidth - zone.width - 1));
      y = Math.max(1, Math.min(y, storeHeight - zone.height - 1));
      
      positions.push({ x, y });
    });
    
    return positions;
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
