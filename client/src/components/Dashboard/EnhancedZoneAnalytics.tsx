'use client';

import { motion } from 'framer-motion';
import { MapPin, TrendingUp, BarChart3, Users, DollarSign, Layout, ChevronRight, Activity, Target, Zap, Eye, Filter, Download, RefreshCw, Star, Award, Clock, TrendingDown, AlertTriangle } from 'lucide-react';
import { useStoreDesigner } from '@/store/useStoreDesigner';
import { useRouter } from 'next/navigation';

export default function EnhancedZoneAnalytics() {
  const { store } = useStoreDesigner();
  const router = useRouter();

  // Generate realistic performance data for each zone
  const getZoneMetrics = (zone: any) => {
    const area = zone.width * zone.height;
    const baseMetrics = {
      electronics: { revenuePerSqM: 500, trafficMultiplier: 1.5, conversionBase: 25 },
      grocery: { revenuePerSqM: 200, trafficMultiplier: 2.0, conversionBase: 35 },
      clothing: { revenuePerSqM: 300, trafficMultiplier: 1.2, conversionBase: 20 },
      default: { revenuePerSqM: 250, trafficMultiplier: 1.0, conversionBase: 22 }
    };

    const zoneType = zone.name.toLowerCase().includes('electronics') ? 'electronics' :
                    zone.name.toLowerCase().includes('grocery') ? 'grocery' :
                    zone.name.toLowerCase().includes('clothing') ? 'clothing' : 'default';
    
    const metrics = baseMetrics[zoneType];
    
    return {
      utilization: Math.min(100, Math.round(70 + Math.random() * 30)),
      revenue: Math.round(area * metrics.revenuePerSqM),
      traffic: Math.round(area * 10 * metrics.trafficMultiplier + Math.random() * 200),
      efficiency: Math.min(100, Math.round(75 + Math.random() * 25)),
      conversionRate: Math.round(metrics.conversionBase + Math.random() * 15),
      averageSpend: Math.round(25 + Math.random() * 50),
      dwellTime: Math.round(5 + Math.random() * 10),
      peakHours: ['10-12', '14-16', '18-20'][Math.floor(Math.random() * 3)],
      trend: Math.random() > 0.3 ? 'up' : 'down',
      trendValue: Math.round(5 + Math.random() * 15),
      alerts: Math.random() > 0.7 ? ['Low conversion rate'] : []
    };
  };

  const totalRevenue = store.zones.reduce((sum, zone) => {
    const metrics = getZoneMetrics(zone);
    return sum + metrics.revenue;
  }, 0);

  const averageUtilization = store.zones.length > 0 
    ? store.zones.reduce((sum, zone) => sum + getZoneMetrics(zone).utilization, 0) / store.zones.length 
    : 0;

  const totalTraffic = store.zones.reduce((sum, zone) => {
    const metrics = getZoneMetrics(zone);
    return sum + metrics.traffic;
  }, 0);

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      {/* Enhanced Header */}
      <div className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 px-6 py-6">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-20 translate-x-20"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                  Zone Performance Analytics
                  <div className="flex items-center gap-1">
                    <BarChart3 className="w-5 h-5 text-blue-200" />
                    <Activity className="w-4 h-4 text-green-300" />
                  </div>
                </h3>
                <p className="text-blue-100 font-medium">Real-time insights and performance metrics</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-lg border border-white/20">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-white">Live Data</span>
              </div>
              <button className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                <RefreshCw className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
          
          {/* Analytics Summary */}
          {store.zones.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-blue-200 text-sm font-medium">Total Zones</span>
                  <Layout className="w-4 h-4 text-blue-200" />
                </div>
                <div className="text-white text-2xl font-bold">{store.zones.length}</div>
                <div className="text-blue-200 text-xs mt-1">Active zones</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-blue-200 text-sm font-medium">Total Revenue</span>
                  <DollarSign className="w-4 h-4 text-green-300" />
                </div>
                <div className="text-white text-2xl font-bold">${(totalRevenue / 1000).toFixed(1)}K</div>
                <div className="text-green-300 text-xs mt-1">+15% vs last month</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-blue-200 text-sm font-medium">Avg Utilization</span>
                  <Target className="w-4 h-4 text-yellow-300" />
                </div>
                <div className="text-white text-2xl font-bold">{averageUtilization.toFixed(0)}%</div>
                <div className="text-yellow-300 text-xs mt-1">
                  {averageUtilization > 80 ? 'Excellent' : averageUtilization > 60 ? 'Good' : 'Needs improvement'}
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-blue-200 text-sm font-medium">Daily Traffic</span>
                  <Users className="w-4 h-4 text-purple-300" />
                </div>
                <div className="text-white text-2xl font-bold">{totalTraffic.toLocaleString()}</div>
                <div className="text-purple-300 text-xs mt-1">+8% vs yesterday</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Bar */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm">
              <Filter className="w-4 h-4" />
              Filter Zones
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm">
              <Eye className="w-4 h-4" />
              View Details
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm">
              <Download className="w-4 h-4" />
              Export Data
            </button>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Award className="w-4 h-4 text-yellow-500" />
            <span>Performance: {averageUtilization >= 85 ? 'Excellent' : averageUtilization >= 70 ? 'Good' : 'Needs Improvement'}</span>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        {store.zones.length === 0 ? (
          <div className="text-center py-20">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-lg">
                <MapPin className="w-12 h-12 text-blue-600" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white text-sm font-bold">!</span>
              </div>
            </div>
            <h4 className="text-2xl font-bold text-gray-900 mb-4">No Zones Configured</h4>
            <p className="text-gray-500 mb-8 max-w-lg mx-auto leading-relaxed text-lg">
              Start creating zones in the layout designer to unlock powerful analytics and performance insights for your store
            </p>
            <button 
              onClick={() => router.push('/')}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 text-lg font-semibold"
            >
              <Layout className="w-6 h-6" />
              <span>Create Your First Zone</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {store.zones.map((zone, index) => {
              const metrics = getZoneMetrics(zone);
              return (
                <motion.div
                  key={zone.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="relative group"
                >
                  <div className="bg-white border-2 border-gray-100 rounded-2xl p-6 hover:border-indigo-200 hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:scale-[1.02]"
                    onClick={() => router.push(`/zone/${zone.id}`)}
                  >
                    {/* Zone Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-5 h-5 rounded-full shadow-md border-2 border-white" 
                          style={{ backgroundColor: zone.color }}
                        />
                        <h4 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors text-lg">{zone.name}</h4>
                      </div>
                      <div className="flex items-center gap-2">
                        {metrics.alerts.length > 0 && (
                          <div className="flex items-center gap-1 text-xs font-semibold px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full border border-yellow-200">
                            <AlertTriangle className="w-3 h-3" />
                            Alert
                          </div>
                        )}
                        <div className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 bg-green-100 text-green-700 rounded-full border border-green-200">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                          Active
                        </div>
                        {metrics.trend === 'up' ? (
                          <div className="flex items-center gap-1 text-xs font-semibold px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full">
                            <TrendingUp className="w-3 h-3" />
                            +{metrics.trendValue}%
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-xs font-semibold px-2 py-1 bg-red-100 text-red-700 rounded-full">
                            <TrendingDown className="w-3 h-3" />
                            -{metrics.trendValue}%
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Key Metrics Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="text-center p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                        <div className="text-xl font-bold text-gray-900">{(zone.width * zone.height).toFixed(1)}m²</div>
                        <div className="text-sm text-gray-600 font-medium">Total Area</div>
                      </div>
                      <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                        <div className={`text-xl font-bold ${
                          metrics.utilization >= 85 ? 'text-emerald-600' : 
                          metrics.utilization >= 70 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {metrics.utilization}%
                        </div>
                        <div className="text-sm text-blue-700 font-medium">Utilization</div>
                      </div>
                    </div>
                    
                    {/* Performance Metrics */}
                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-100">
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-medium text-green-800">Revenue:</span>
                        </div>
                        <span className="font-bold text-green-600 text-lg">${metrics.revenue.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg border border-purple-100">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-purple-600" />
                          <span className="text-sm font-medium text-purple-800">Daily Traffic:</span>
                        </div>
                        <span className="font-bold text-purple-600 text-lg">{metrics.traffic.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border border-blue-100">
                        <div className="flex items-center gap-2">
                          <Target className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-medium text-blue-800">Conversion:</span>
                        </div>
                        <span className="font-bold text-blue-600 text-lg">{metrics.conversionRate}%</span>
                      </div>
                    </div>

                    {/* Additional Metrics */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                      <div className="text-center p-3 bg-orange-50 rounded-lg border border-orange-100">
                        <div className="text-lg font-bold text-orange-600">${metrics.averageSpend}</div>
                        <div className="text-xs text-orange-700 font-medium">Avg Spend</div>
                      </div>
                      <div className="text-center p-3 bg-indigo-50 rounded-lg border border-indigo-100">
                        <div className="text-lg font-bold text-indigo-600">{metrics.dwellTime}m</div>
                        <div className="text-xs text-indigo-700 font-medium">Dwell Time</div>
                      </div>
                    </div>
                    
                    {/* Efficiency Score */}
                    <div className="border-t border-gray-200 pt-4 mb-4">
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span className="text-sm font-semibold text-gray-700">Efficiency Score</span>
                        </div>
                        <span className="font-bold text-gray-900 text-lg">{metrics.efficiency}/100</span>
                      </div>
                      <div className="relative w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <motion.div 
                          className={`h-3 rounded-full ${
                            metrics.efficiency >= 90 ? 'bg-gradient-to-r from-emerald-400 to-emerald-500' :
                            metrics.efficiency >= 80 ? 'bg-gradient-to-r from-blue-400 to-blue-500' :
                            metrics.efficiency >= 70 ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' : 
                            'bg-gradient-to-r from-red-400 to-red-500'
                          }`}
                          initial={{ width: 0 }}
                          animate={{ width: `${metrics.efficiency}%` }}
                          transition={{ delay: index * 0.1 + 0.5, duration: 1 }}
                        />
                      </div>
                    </div>

                    {/* Alerts */}
                    {metrics.alerts.length > 0 && (
                      <div className="mb-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                        <div className="flex items-center gap-2 text-yellow-800">
                          <AlertTriangle className="w-4 h-4" />
                          <span className="text-sm font-medium">{metrics.alerts[0]}</span>
                        </div>
                      </div>
                    )}

                    {/* Peak Hours Info */}
                    <div className="flex items-center justify-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200 mb-4">
                      <Clock className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">Peak Hours: {metrics.peakHours}</span>
                    </div>
                    
                    {/* Action Button */}
                    <button className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white py-4 rounded-xl text-sm font-bold transition-all duration-300 group-hover:shadow-xl flex items-center justify-center gap-2 transform group-hover:scale-105">
                      <BarChart3 className="w-4 h-4" />
                      <span>Analyze Zone Details</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
