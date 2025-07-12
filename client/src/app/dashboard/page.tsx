'use client';

import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useStoreDesigner } from '@/store/useStoreDesigner';
import { TrendingUp, Layout, Package, Users, DollarSign, MapPin, BarChart3, Activity, Calendar, Clock, Target, Zap, ArrowRight, Sparkles, Star, RefreshCw, AlertCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import StoreLoader from '@/components/StoreLoader';

// Dynamic imports for heavy components
const EnhancedZoneAnalytics = dynamic(() => import('@/components/Dashboard/EnhancedZoneAnalytics'), {
  ssr: false,
  loading: () => <div className="bg-white rounded-2xl shadow-sm p-6 animate-pulse h-64 border border-gray-100" />
});

const SmartAIInsights = dynamic(() => import('@/components/Dashboard/SmartAIInsights'), {
  ssr: false,
  loading: () => <div className="bg-white rounded-2xl shadow-sm p-6 animate-pulse h-32 border border-gray-100" />
});

const PerformanceCharts = dynamic(() => import('@/components/Dashboard/PerformanceCharts'), {
  ssr: false,
  loading: () => <div className="bg-white rounded-2xl shadow-sm p-6 animate-pulse h-64 border border-gray-100" />
});

const LiveActivityFeed = dynamic(() => import('@/components/Dashboard/LiveActivityFeed'), {
  ssr: false,
  loading: () => <div className="bg-white rounded-2xl shadow-sm p-6 animate-pulse h-64 border border-gray-100" />
});

export default function ImprovedDashboard() {
  const { store, layoutMetrics, fetchStoreFromServer, isLoading, error } = useStoreDesigner();
  const [currentTime, setCurrentTime] = useState<string>('');
  const [greeting, setGreeting] = useState<string>('');
  const [refreshing, setRefreshing] = useState(false);

  // Initialize dashboard data
  useEffect(() => {
    const now = new Date();
    const hours = now.getHours();
    
    setCurrentTime(now.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    }));
    
    if (hours < 12) setGreeting('Good Morning');
    else if (hours < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');

    // Fetch real data from backend
    fetchStoreFromServer();
  }, [fetchStoreFromServer]);

  // Auto-refresh data every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      fetchStoreFromServer();
      setCurrentTime(new Date().toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      }));
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [fetchStoreFromServer]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchStoreFromServer();
    setRefreshing(false);
  };

  // Calculate real-time metrics from backend data
  const calculateMetrics = () => {
    const totalZones = store.zones.length;
    const totalArea = store.width * store.height;
    const usedArea = store.zones.reduce((sum, zone) => sum + (zone.width * zone.height), 0);
    const utilization = totalArea > 0 ? (usedArea / totalArea) * 100 : 0;
    
    // Simulate revenue calculation based on zone efficiency
    const estimatedRevenue = store.zones.reduce((sum, zone) => {
      const zoneArea = zone.width * zone.height;
      const revenuePerSqM = zone.name.toLowerCase().includes('electronics') ? 500 : 
                           zone.name.toLowerCase().includes('grocery') ? 200 : 300;
      return sum + (zoneArea * revenuePerSqM);
    }, 0);

    return {
      totalZones,
      utilization: Math.round(utilization),
      estimatedRevenue: Math.round(estimatedRevenue),
      efficiency: Math.min(100, Math.round(utilization * 1.2)) // Efficiency factor
    };
  };

  const metrics = calculateMetrics();

  const stats = [
    { 
      icon: Layout, 
      value: metrics.totalZones.toString(), 
      label: "Active Zones", 
      trend: "+8%", 
      trendUp: true,
      color: "blue",
      bgGradient: "from-blue-500 to-blue-600"
    },
    { 
      icon: Target, 
      value: `${metrics.utilization}%`, 
      label: "Space Utilization", 
      trend: metrics.utilization > 75 ? "+12%" : "-5%", 
      trendUp: metrics.utilization > 75,
      color: metrics.utilization > 75 ? "emerald" : "amber",
      bgGradient: metrics.utilization > 75 ? "from-emerald-500 to-emerald-600" : "from-amber-500 to-orange-500"
    },
    { 
      icon: DollarSign, 
      value: `$${(metrics.estimatedRevenue / 1000).toFixed(1)}K`, 
      label: "Est. Monthly Revenue", 
      trend: "+15%", 
      trendUp: true,
      color: "green",
      bgGradient: "from-green-500 to-green-600"
    },
    { 
      icon: BarChart3, 
      value: `${metrics.efficiency}%`, 
      label: "Layout Efficiency", 
      trend: metrics.efficiency > 80 ? "+22%" : "+5%", 
      trendUp: true,
      color: "purple",
      bgGradient: "from-purple-500 to-purple-600"
    }
  ];

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-2xl shadow-xl border border-red-200 p-8 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Connection Error</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button 
              onClick={handleRefresh}
              className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
            >
              Retry Connection
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <StoreLoader>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <Navbar />
        
        {/* Enhanced Hero Stats Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800"></div>
          <div className="absolute inset-0 bg-black/10"></div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Welcome Header */}
              <div className="text-center mb-12">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1, duration: 0.6 }}
                  className="flex items-center justify-center gap-2 text-blue-200 mb-4"
                >
                  <Star className="w-5 h-5 text-yellow-300" />
                  <span className="text-lg font-medium">{greeting}! Welcome back to your store</span>
                  <Star className="w-5 h-5 text-yellow-300" />
                </motion.div>
                
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="text-4xl lg:text-5xl font-bold text-white mb-4"
                >
                  Smart Store 
                  <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                    {" "}Dashboard
                  </span>
                </motion.h1>
                
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="text-xl text-blue-100 max-w-2xl mx-auto"
                >
                  Real-time insights powered by live data and AI analytics
                </motion.p>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="mt-6 flex items-center justify-center gap-4 text-blue-200"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm">Live Data</span>
                  </div>
                  <div className="w-1 h-4 bg-blue-300/30"></div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">Updated {currentTime}</span>
                  </div>
                  <div className="w-1 h-4 bg-blue-300/30"></div>
                  <button 
                    onClick={handleRefresh}
                    disabled={refreshing}
                    className="flex items-center gap-2 text-sm hover:text-white transition-colors disabled:opacity-50"
                  >
                    <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                    <span>Refresh</span>
                  </button>
                </motion.div>
              </div>
              
              {/* Real-time Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.6 }}
                    className="group relative"
                  >
                    <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
                      <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-500`}></div>
                      
                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                          <div className={`w-12 h-12 bg-gradient-to-br ${stat.bgGradient} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                            <stat.icon className="w-6 h-6 text-white" />
                          </div>
                          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold ${
                            stat.trendUp 
                              ? 'bg-green-100 text-green-700 border border-green-200' 
                              : 'bg-red-100 text-red-700 border border-red-200'
                          } group-hover:scale-105 transition-transform duration-300`}>
                            <TrendingUp className={`w-4 h-4 ${!stat.trendUp ? 'rotate-180' : ''}`} />
                            {stat.trend}
                          </div>
                        </div>
                        
                        <div className="mb-2">
                          <div className="text-3xl lg:text-4xl font-bold text-gray-900 group-hover:text-gray-700 transition-colors">
                            {stat.value}
                          </div>
                        </div>
                        
                        <div className="text-sm font-medium text-gray-600 group-hover:text-gray-700 transition-colors">
                          {stat.label}
                        </div>
                        
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <div className="w-full bg-gray-100 rounded-full h-1.5">
                            <motion.div 
                              className={`bg-gradient-to-r ${stat.bgGradient} h-1.5 rounded-full`}
                              initial={{ width: 0 }}
                              animate={{ width: "75%" }}
                              transition={{ delay: 1 + index * 0.1, duration: 1 }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Main Dashboard Content */}
        <div className="relative -mt-8 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
            
            {/* Performance Charts - Full Width */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="mb-8"
            >
              <PerformanceCharts />
            </motion.div>

            {/* AI Insights - Full Width */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.6 }}
              className="mb-8"
            >
              <SmartAIInsights />
            </motion.div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* Left Column - Main Content */}
              <div className="xl:col-span-2 space-y-8">
                {/* Enhanced Zone Analytics */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0, duration: 0.6 }}
                >
                  <EnhancedZoneAnalytics />
                </motion.div>
              </div>
              
              {/* Right Column - Live Feed */}
              <div className="space-y-8">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.0, duration: 0.6 }}
                >
                  <LiveActivityFeed />
                </motion.div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="bg-gray-50 border-t border-gray-200 py-8"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-gray-600">
                <Activity className="w-5 h-5" />
                <span className="text-sm">Dashboard last refreshed at {currentTime}</span>
              </div>
              <div className="flex items-center gap-4">
                <button 
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                  <span className="text-sm font-medium">Refresh Data</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </StoreLoader>
  );
}
