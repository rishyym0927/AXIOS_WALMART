const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface AnalyticsData {
  performance: {
    date: string;
    sales: number;
    footTraffic: number;
    conversionRate: string;
    avgTransactionValue: string;
  }[];
  zoneAnalytics: {
    zoneId: string;
    name: string;
    revenue: number;
    footTraffic: number;
    conversionRate: string;
    topProducts: { name: string; sales: number; }[];
    efficiency: string;
    avgDwellTime: number;
  }[];
  productMovement: {
    productId: string;
    name: string;
    currentZone: string;
    suggestedZone: string;
    performanceScore: string;
    reason: string;
    expectedImprovement: string;
    priority: string;
  }[];
  summary: {
    totalRevenue: number;
    avgFootTraffic: number;
    avgConversionRate: string;
    topPerformingZone: any;
    improvementOpportunities: number;
  };
}

export interface KPI {
  name: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
}

export interface PerformanceData {
  trends: AnalyticsData['performance'];
  summary: AnalyticsData['summary'];
  kpis: KPI[];
}

export interface Recommendation {
  id: string;
  type: string;
  title: string;
  description: string;
  impact: string;
  expectedIncrease: string;
  effort: string;
  confidence: number;
}

class AxiosAnalyticsService {
  async getDashboardAnalytics(): Promise<AnalyticsData> {
    try {
      const response = await fetch(`${BASE_URL}/api/analytics/dashboard`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error fetching dashboard analytics:', error);
      throw error;
    }
  }

  async getZoneAnalytics(zoneId: string): Promise<any> {
    try {
      const response = await fetch(`${BASE_URL}/api/analytics/zone/${zoneId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error fetching zone analytics:', error);
      throw error;
    }
  }

  async getPerformanceAnalytics(timeRange: string = '30d'): Promise<PerformanceData> {
    try {
      const response = await fetch(`${BASE_URL}/api/analytics/performance?timeRange=${timeRange}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error fetching performance analytics:', error);
      throw error;
    }
  }

  async getRecommendations(): Promise<Recommendation[]> {
    try {
      const response = await fetch(`${BASE_URL}/api/analytics/recommendations`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      throw error;
    }
  }

  // Method to get fallback analytics when backend is not available
  getFallbackAnalytics(): AnalyticsData {
    return {
      performance: [
        {
          date: '2024-01-01',
          sales: 45000,
          footTraffic: 850,
          conversionRate: '78.5',
          avgTransactionValue: '52.94'
        },
        {
          date: '2024-01-02',
          sales: 52000,
          footTraffic: 920,
          conversionRate: '81.2',
          avgTransactionValue: '56.52'
        }
      ],
      zoneAnalytics: [
        {
          zoneId: 'zone_1',
          name: 'Electronics',
          revenue: 125000,
          footTraffic: 3500,
          conversionRate: '85.2',
          topProducts: [
            { name: 'Laptop Pro', sales: 450 },
            { name: 'Wireless Headphones', sales: 380 },
            { name: 'Smart Watch', sales: 320 }
          ],
          efficiency: '88.5',
          avgDwellTime: 285
        }
      ],
      productMovement: [
        {
          productId: 'prod_1',
          name: 'Premium Laptop',
          currentZone: 'Electronics',
          suggestedZone: 'Front Display',
          performanceScore: '92.5',
          reason: 'High-value item should be in premium visibility zone',
          expectedImprovement: '+18% sales increase',
          priority: 'High'
        }
      ],
      summary: {
        totalRevenue: 850000,
        avgFootTraffic: 1250,
        avgConversionRate: '79.8',
        topPerformingZone: { name: 'Electronics', revenue: 125000 },
        improvementOpportunities: 5
      }
    };
  }
}

export default new AxiosAnalyticsService();
