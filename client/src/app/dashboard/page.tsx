'use client';

import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import StoreLoader from '@/components/StoreLoader';
import { 
  TrendingUp, 
  Layout, 
  Package, 
  Users, 
  DollarSign,
  MapPin,
  BarChart3,
  Activity,
  Calendar,
  Clock,
  Target,
  Zap,
  ArrowRight,
  Sparkles,
  ChevronRight,
  Star,
  MoreHorizontal
} from 'lucide-react';
import { useStoreDesigner } from '@/store/useStoreDesigner';

// Dynamic imports for components
const ZoneAnalytics = dynamic(() => import('@/components/Dashboard/ZoneAnalytics'), {
  ssr: false,
  loading: () => <div className="bg-white rounded-2xl shadow-sm p-6 animate-pulse h-64 border border-gray-100" />
});

const AIInsights = dynamic(() => import('@/components/Dashboard/AIInsights'), {
  ssr: false,
  loading: () => <div className="bg-white rounded-2xl shadow-sm p-6 animate-pulse h-32 border border-gray-100" />
});

const ActivityFeed = dynamic(() => import('@/components/Dashboard/ActivityFeed'), {
  ssr: false,
  loading: () => <div className="bg-white rounded-2xl shadow-sm p-6 animate-pulse h-64 border border-gray-100" />
});

const QuickActions = dynamic(() => import('@/components/Dashboard/QuickActions'), {
  ssr: false,
  loading: () => <div className="bg-white rounded-2xl shadow-sm p-6 animate-pulse h-64 border border-gray-100" />
});

const LayoutsGallery = dynamic(() => import('@/components/Dashboard/LayoutsGallery'), {
  ssr: false,
  loading: () => <div className="bg-white rounded-2xl shadow-sm p-6 animate-pulse h-64 border border-gray-100" />
});

export default function Dashboard() {
  const { store, layoutMetrics } = useStoreDesigner();
  const [currentTime, setCurrentTime] = useState<string>('');
  const [greeting, setGreeting] = useState<string>('');

  // Fix hydration by setting time only on client side
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
  }, []);

  const stats = [
    { 
      icon: Layout, 
      value: "12", 
      label: "Active Layouts", 
      trend: "+15%", 
      trendUp: true,
      color: "blue",
      bgGradient: "from-blue-500 to-blue-600"
    },
    { 
      icon: Package, 
      value: store.zones.length.toString(), 
      label: "Active Zones", 
      trend: "+8%", 
      trendUp: true,
      color: "emerald",
      bgGradient: "from-emerald-500 to-emerald-600"
    },
    { 
      icon: Target, 
      value: `${layoutMetrics.utilization.toFixed(0)}%`, 
      label: "Space Utilization", 
      trend: "+12%", 
      trendUp: true,
      color: "purple",
      bgGradient: "from-purple-500 to-purple-600"
    },
    { 
      icon: DollarSign, 
      value: "$45K", 
      label: "Revenue Increase", 
      trend: "+35%", 
      trendUp: true,
      color: "amber",
      bgGradient: "from-amber-500 to-orange-500"
    }
  ];

  return (
    <StoreLoader>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Navbar */}
      <Navbar />
      
      {/* Enhanced Hero Stats Section */}
      <div className="relative overflow-hidden">
        {/* Background Patterns */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800"></div>
        <div className="absolute inset-0 bg-black/10"></div>
        
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-white/5 rounded-full -translate-x-36 -translate-y-36"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-48 translate-y-48"></div>
        
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
                Store Performance 
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
                Real-time insights and AI-powered analytics for optimal retail performance
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
              </motion.div>
            </div>
            
            {/* Enhanced Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.6 }}
                  className="group relative"
                >
                  {/* Card */}
                  <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
                    {/* Gradient Background */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-500`}></div>
                    
                    <div className="relative z-10">
                      {/* Header */}
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
                      
                      {/* Value */}
                      <div className="mb-2">
                        <div className="text-3xl lg:text-4xl font-bold text-gray-900 group-hover:text-gray-700 transition-colors">
                          {stat.value}
                        </div>
                      </div>
                      
                      {/* Label */}
                      <div className="text-sm font-medium text-gray-600 group-hover:text-gray-700 transition-colors">
                        {stat.label}
                      </div>
                      
                      {/* Progress Bar */}
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
                    
                    {/* Hover Effect */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Enhanced Main Dashboard Content */}
      <div className="relative -mt-8 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          {/* Quick Navigation Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mb-8"
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
                    <Layout className="w-4 h-4" />
                    <span className="font-medium">Layout Designer</span>
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors">
                    <BarChart3 className="w-4 h-4" />
                    <span className="font-medium">Analytics</span>
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors">
                    <Sparkles className="w-4 h-4" />
                    <span className="font-medium">AI Insights</span>
                  </button>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm font-medium">Today's Overview</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* AI Insights - Full Width Landscape */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="mb-8"
          >
            <AIInsights />
          </motion.div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="xl:col-span-2 space-y-8">
              {/* Zone Analytics */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0, duration: 0.6 }}
              >
                <ZoneAnalytics />
              </motion.div>

              {/* Layouts Gallery */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1, duration: 0.6 }}
              >
                <LayoutsGallery />
              </motion.div>
            </div>
            
            {/* Right Column - Sidebar */}
            <div className="space-y-8">
              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.0, duration: 0.6 }}
              >
                <QuickActions />
              </motion.div>

              {/* Activity Feed */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.1, duration: 0.6 }}
              >
                <ActivityFeed />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer Section */}
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
              <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors">
                <span className="text-sm font-medium">View Full Analytics</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>      </div>
    </StoreLoader>
  );
}
