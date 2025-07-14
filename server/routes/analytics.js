const express = require('express');
const router = express.Router();

// Mock analytics data - replace with real data from your database
const generateMockAnalytics = () => {
  const now = new Date();
  const dates = [];
  const performance = [];
  const zoneAnalytics = [];
  const productMovement = [];

  // Generate last 30 days of data
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    dates.push(date.toISOString().split('T')[0]);
    
    // Random performance metrics
    performance.push({
      date: date.toISOString().split('T')[0],
      sales: Math.floor(Math.random() * 50000) + 30000,
      footTraffic: Math.floor(Math.random() * 1000) + 500,
      conversionRate: (Math.random() * 30 + 60).toFixed(1), // 60-90%
      avgTransactionValue: (Math.random() * 100 + 50).toFixed(2) // $50-$150
    });
  }

  // Zone analytics
  const zoneTypes = ['Electronics', 'Clothing', 'Groceries', 'Home & Garden', 'Pharmacy'];
  zoneTypes.forEach((zone, index) => {
    zoneAnalytics.push({
      zoneId: `zone_${index + 1}`,
      name: zone,
      revenue: Math.floor(Math.random() * 100000) + 50000,
      footTraffic: Math.floor(Math.random() * 5000) + 2000,
      conversionRate: (Math.random() * 25 + 65).toFixed(1),
      topProducts: [
        { name: `${zone} Item 1`, sales: Math.floor(Math.random() * 1000) + 100 },
        { name: `${zone} Item 2`, sales: Math.floor(Math.random() * 1000) + 100 },
        { name: `${zone} Item 3`, sales: Math.floor(Math.random() * 1000) + 100 }
      ],
      efficiency: (Math.random() * 30 + 70).toFixed(1), // 70-100%
      avgDwellTime: Math.floor(Math.random() * 300) + 120 // 2-7 minutes
    });
  });

  // Product movement analytics
  const products = ['Laptop', 'Smartphone', 'Jeans', 'T-Shirt', 'Bread', 'Milk', 'Vitamins', 'Shampoo'];
  products.forEach((product, index) => {
    productMovement.push({
      productId: `prod_${index + 1}`,
      name: product,
      currentZone: zoneTypes[Math.floor(Math.random() * zoneTypes.length)],
      suggestedZone: zoneTypes[Math.floor(Math.random() * zoneTypes.length)],
      performanceScore: (Math.random() * 40 + 60).toFixed(1), // 60-100%
      reason: `Based on customer behavior analysis and sales data`,
      expectedImprovement: `${(Math.random() * 25 + 10).toFixed(1)}% increase in sales`,
      priority: ['High', 'Medium', 'Low'][Math.floor(Math.random() * 3)]
    });
  });

  return {
    performance,
    zoneAnalytics,
    productMovement,
    summary: {
      totalRevenue: performance.reduce((sum, day) => sum + day.sales, 0),
      avgFootTraffic: Math.floor(performance.reduce((sum, day) => sum + day.footTraffic, 0) / performance.length),
      avgConversionRate: (performance.reduce((sum, day) => sum + parseFloat(day.conversionRate), 0) / performance.length).toFixed(1),
      topPerformingZone: zoneAnalytics.reduce((top, zone) => zone.revenue > top.revenue ? zone : top, zoneAnalytics[0]),
      improvementOpportunities: productMovement.filter(p => p.priority === 'High').length
    }
  };
};

// GET /api/analytics/dashboard - Get dashboard analytics
router.get('/dashboard', async (req, res) => {
  try {
    console.log('📊 Fetching dashboard analytics...');
    
    const analytics = generateMockAnalytics();
    
    res.json({
      success: true,
      data: analytics,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Error fetching dashboard analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard analytics',
      error: error.message
    });
  }
});

// GET /api/analytics/zone/:zoneId - Get specific zone analytics
router.get('/zone/:zoneId', async (req, res) => {
  try {
    const { zoneId } = req.params;
    console.log(`📊 Fetching analytics for zone: ${zoneId}`);
    
    const analytics = generateMockAnalytics();
    const zoneData = analytics.zoneAnalytics.find(z => z.zoneId === zoneId);
    
    if (!zoneData) {
      return res.status(404).json({
        success: false,
        message: 'Zone not found'
      });
    }

    // Add detailed analytics for specific zone
    const detailedZoneAnalytics = {
      ...zoneData,
      hourlyTraffic: Array.from({ length: 24 }, (_, hour) => ({
        hour,
        traffic: Math.floor(Math.random() * 200) + 50,
        sales: Math.floor(Math.random() * 5000) + 1000
      })),
      weeklyTrends: Array.from({ length: 7 }, (_, day) => ({
        day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][day],
        traffic: Math.floor(Math.random() * 1000) + 500,
        sales: Math.floor(Math.random() * 15000) + 5000
      })),
      heatmapData: Array.from({ length: 10 }, (_, x) => 
        Array.from({ length: 10 }, (_, y) => ({
          x, y, intensity: Math.random()
        }))
      ).flat()
    };
    
    res.json({
      success: true,
      data: detailedZoneAnalytics,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Error fetching zone analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch zone analytics',
      error: error.message
    });
  }
});

// GET /api/analytics/performance - Get performance trends
router.get('/performance', async (req, res) => {
  try {
    const { timeRange = '30d' } = req.query;
    console.log(`📊 Fetching performance analytics for: ${timeRange}`);
    
    const analytics = generateMockAnalytics();
    
    res.json({
      success: true,
      data: {
        trends: analytics.performance,
        summary: analytics.summary,
        kpis: [
          {
            name: 'Total Revenue',
            value: `$${analytics.summary.totalRevenue.toLocaleString()}`,
            change: '+12.5%',
            trend: 'up'
          },
          {
            name: 'Avg Foot Traffic',
            value: analytics.summary.avgFootTraffic.toLocaleString(),
            change: '+8.3%',
            trend: 'up'
          },
          {
            name: 'Conversion Rate',
            value: `${analytics.summary.avgConversionRate}%`,
            change: '+2.1%',
            trend: 'up'
          },
          {
            name: 'Improvement Opportunities',
            value: analytics.summary.improvementOpportunities,
            change: '3 pending',
            trend: 'neutral'
          }
        ]
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Error fetching performance analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch performance analytics',
      error: error.message
    });
  }
});

// GET /api/analytics/recommendations - Get AI-powered recommendations
router.get('/recommendations', async (req, res) => {
  try {
    console.log('🤖 Fetching AI recommendations...');
    
    const recommendations = [
      {
        id: 'rec_1',
        type: 'product_placement',
        title: 'Move High-Value Electronics to Front Zone',
        description: 'Analytics show 23% higher conversion when premium electronics are placed in high-traffic front zones.',
        impact: 'High',
        expectedIncrease: '+15% revenue',
        effort: 'Medium',
        confidence: 87
      },
      {
        id: 'rec_2',
        type: 'zone_optimization',
        title: 'Expand Grocery Zone by 20%',
        description: 'Customer dwell time in grocery zone is 40% higher than average, indicating demand for more space.',
        impact: 'Medium',
        expectedIncrease: '+8% sales',
        effort: 'High',
        confidence: 72
      },
      {
        id: 'rec_3',
        type: 'layout_adjustment',
        title: 'Create Cross-Merchandising Display',
        description: 'Data suggests customers buying electronics often look for accessories. Create combined display.',
        impact: 'Medium',
        expectedIncrease: '+12% basket size',
        effort: 'Low',
        confidence: 94
      },
      {
        id: 'rec_4',
        type: 'traffic_flow',
        title: 'Adjust Main Aisle Width',
        description: 'Current aisle width creates bottlenecks during peak hours, reducing customer satisfaction.',
        impact: 'High',
        expectedIncrease: '+6% foot traffic',
        effort: 'High',
        confidence: 81
      }
    ];
    
    res.json({
      success: true,
      data: recommendations,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Error fetching recommendations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recommendations',
      error: error.message
    });
  }
});

module.exports = router;
