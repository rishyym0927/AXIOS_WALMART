'use client';

import { motion } from 'framer-motion';
import { 
  Brain, 
  Lightbulb, 
  TrendingUp, 
  Users, 
  MapPin, 
  ArrowRight, 
  Sparkles, 
  Target, 
  DollarSign,
  Zap,
  BarChart3,
  Cpu,
  Eye,
  Settings,
  RefreshCw,
  Award,
  Star,
  Check,
  Clock
} from 'lucide-react';
import { useStoreDesigner } from '@/store/useStoreDesigner';
import { useRouter } from 'next/navigation';

export default function AIInsights() {
  const { store } = useStoreDesigner();
  const router = useRouter();

  const insights = [
    {
      id: 1,
      title: "Optimize Checkout Flow",
      description: "Repositioning checkout area 2m closer to entrance reduces customer wait time by 15% and improves traffic flow",
      impact: "+15% efficiency",
      confidence: 94,
      type: "layout",
      icon: MapPin,
      color: "blue",
      priority: "high",
      timeToImplement: "2 hours",
      estimatedROI: "$1.2K/month",
      action: "Apply Layout"
    },
    {
      id: 2,
      title: "Electronics Zone Expansion",
      description: "Seasonal demand analysis suggests expanding electronics section by 25% will capture peak holiday traffic",
      impact: "+$2.8K/month",
      confidence: 91,
      type: "revenue",
      icon: DollarSign,
      color: "emerald",
      priority: "high", 
      timeToImplement: "4 hours",
      estimatedROI: "$2.8K/month",
      action: "Preview Changes"
    },
    {
      id: 3,
      title: "Customer Flow Optimization",
      description: "Creating a curved pathway from entrance to high-margin products increases conversion rates",
      impact: "+32% conversion",
      confidence: 88,
      type: "optimization",
      icon: TrendingUp,
      color: "purple",
      priority: "medium",
      timeToImplement: "3 hours", 
      estimatedROI: "$1.8K/month",
      action: "Analyze Route"
    },
    {
      id: 4,
      title: "Product Placement Strategy",
      description: "Moving impulse items to eye-level positions and checkout proximity drives spontaneous purchases",
      impact: "+18% impulse sales",
      confidence: 85,
      type: "product",
      icon: Target,
      color: "orange",
      priority: "medium",
      timeToImplement: "1 hour",
      estimatedROI: "$900/month", 
      action: "View Products"
    },
    {
      id: 5,
      title: "Peak Hours Layout",
      description: "Dynamic zone sizing based on traffic patterns during peak shopping hours",
      impact: "+12% capacity",
      confidence: 82,
      type: "capacity",
      icon: Users,
      color: "cyan",
      priority: "low",
      timeToImplement: "6 hours",
      estimatedROI: "$1.1K/month",
      action: "Schedule Implementation"
    },
    {
      id: 6,
      title: "Heat Map Insights",
      description: "Customer dwell time analysis reveals underutilized premium real estate areas",
      impact: "+22% space efficiency",
      confidence: 79,
      type: "analytics",
      icon: BarChart3,
      color: "rose",
      priority: "low",
      timeToImplement: "2 hours",
      estimatedROI: "$650/month",
      action: "View Heat Map"
    }
  ];

  const quickActions = [
    { label: "Generate Layout", icon: Cpu, action: () => router.push('/') },
    { label: "Traffic Analysis", icon: Users, action: () => {} },
    { label: "Performance Report", icon: BarChart3, action: () => {} },
    { label: "Refresh Insights", icon: RefreshCw, action: () => {} },
  ];

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  // Get confidence color
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    if (confidence >= 80) return 'bg-blue-100 text-blue-700 border-blue-200';
    if (confidence >= 70) return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    return 'bg-red-100 text-red-700 border-red-200';
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      {/* Enhanced Header - Compact for Landscape */}
      <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-700 px-8 py-6">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
        
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-white flex items-center gap-3">
                  AI-Powered Store Insights
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-yellow-300" />
                    <Cpu className="w-5 h-5 text-blue-200" />
                  </div>
                </h3>
                <p className="text-blue-100 font-medium text-lg mt-1">Smart optimization recommendations for maximum performance</p>
                
                {/* Status Indicator */}
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-lg border border-white/20">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-white">AI Active</span>
                  </div>
                  <div className="text-sm text-blue-200">
                    Last updated: just now
                  </div>
                </div>
              </div>
            </div>
            
            {/* Quick Stats - Horizontal Layout */}
            <div className="grid grid-cols-3 gap-4 w-full lg:w-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 text-center">
                <div className="text-white text-2xl font-bold">{insights.length}</div>
                <div className="text-blue-200 text-xs font-medium">Active Insights</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 text-center">
                <div className="text-white text-2xl font-bold">
                  {insights.reduce((sum, insight) => sum + parseFloat(insight.estimatedROI.replace(/[^0-9.]/g, '')), 0).toFixed(1)}K
                </div>
                <div className="text-blue-200 text-xs font-medium">Total ROI/month</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 text-center">
                <div className="text-white text-2xl font-bold">
                  {Math.round(insights.reduce((sum, insight) => sum + insight.confidence, 0) / insights.length)}%
                </div>
                <div className="text-blue-200 text-xs font-medium">Avg Confidence</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Bar - Enhanced */}
      <div className="px-8 py-5 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white rounded-xl border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105"
              >
                <action.icon className="w-4 h-4" />
                {action.label}
              </button>
            ))}
            <div className="w-px h-6 bg-gray-300 mx-2"></div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Award className="w-4 h-4 text-yellow-500" />
              <span className="font-medium">AI Confidence: High</span>
            </div>
          </div>
          
          {/* Summary Stats */}
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-gray-600">
                <span className="font-bold text-red-600">{insights.filter(i => i.priority === 'high').length}</span> High Priority
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-gray-600">
                <span className="font-bold text-yellow-600">{insights.filter(i => i.priority === 'medium').length}</span> Medium
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-600">
                <span className="font-bold text-green-600">{insights.filter(i => i.priority === 'low').length}</span> Long-term
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Insights Grid - Landscape Layout */}
      <div className="p-6">
        {/* Top Row - High Priority Insights */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-gray-900">High Priority Optimizations</h4>
                <p className="text-sm text-gray-600">Immediate impact opportunities</p>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              Expected ROI: <span className="font-bold text-green-600">
                ${insights.filter(i => i.priority === 'high').reduce((sum, insight) => sum + parseFloat(insight.estimatedROI.replace(/[^0-9.]/g, '')), 0).toFixed(1)}K/month
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {insights.filter(insight => insight.priority === 'high').map((insight, index) => (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="relative group"
              >
                <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 border-2 border-red-100 hover:border-red-200 hover:shadow-xl transition-all duration-300 cursor-pointer">
                  {/* Priority Badge */}
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-200 uppercase tracking-wide">
                      {insight.priority}
                    </span>
                  </div>
                  
                  {/* Header */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`w-14 h-14 bg-gradient-to-br from-${insight.color}-400 to-${insight.color}-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <insight.icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <h5 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors text-lg mb-2">
                        {insight.title}
                      </h5>
                      <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${getConfidenceColor(insight.confidence)}`}>
                        <Star className="w-3 h-3" />
                        {insight.confidence}% confident
                      </div>
                    </div>
                  </div>
                  
                  {/* Description */}
                  <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                    {insight.description}
                  </p>
                  
                  {/* Metrics Row */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                      <div className={`text-lg font-bold text-${insight.color}-600`}>
                        {insight.impact}
                      </div>
                      <div className="text-xs text-gray-500 font-medium">Impact</div>
                    </div>
                    <div className="text-center p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-100">
                      <div className="text-lg font-bold text-green-600">
                        {insight.estimatedROI}
                      </div>
                      <div className="text-xs text-gray-500 font-medium">ROI</div>
                    </div>
                    <div className="text-center p-3 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg border border-yellow-100">
                      <div className="text-lg font-bold text-orange-600">
                        {insight.timeToImplement}
                      </div>
                      <div className="text-xs text-gray-500 font-medium">Time</div>
                    </div>
                  </div>
                  
                  {/* Action Button */}
                  <button className="w-full bg-gradient-to-r from-red-500 to-pink-600 text-white text-sm font-bold py-3 rounded-lg hover:from-red-600 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 transform group-hover:scale-105">
                    <Check className="w-4 h-4" />
                    {insight.action}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Medium & Low Priority Insights - Compact Cards */}
        <div className="space-y-8">
          {/* Medium Priority */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                <Target className="w-4 h-4 text-white" />
              </div>
              <h4 className="text-lg font-bold text-gray-900">Medium Priority</h4>
              <div className="text-sm text-gray-500">
                ROI: <span className="font-bold text-green-600">
                  ${insights.filter(i => i.priority === 'medium').reduce((sum, insight) => sum + parseFloat(insight.estimatedROI.replace(/[^0-9.]/g, '')), 0).toFixed(1)}K/month
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {insights.filter(insight => insight.priority === 'medium').map((insight, index) => (
                <motion.div
                  key={insight.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                  className="relative group"
                >
                  <div className="bg-white rounded-lg p-4 border border-yellow-100 hover:border-yellow-200 hover:shadow-lg transition-all duration-300 cursor-pointer">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-8 h-8 bg-gradient-to-br from-${insight.color}-400 to-${insight.color}-600 rounded-lg flex items-center justify-center`}>
                        <insight.icon className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <h6 className="font-semibold text-gray-900 text-sm">{insight.title}</h6>
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-600 mb-3 line-clamp-2">
                      {insight.description}
                    </div>
                    
                    <div className="flex items-center justify-between text-xs">
                      <span className={`font-bold text-${insight.color}-600`}>{insight.impact}</span>
                      <span className="font-bold text-green-600">{insight.estimatedROI}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Low Priority */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-white" />
              </div>
              <h4 className="text-lg font-bold text-gray-900">Long-term Optimizations</h4>
              <div className="text-sm text-gray-500">
                ROI: <span className="font-bold text-green-600">
                  ${insights.filter(i => i.priority === 'low').reduce((sum, insight) => sum + parseFloat(insight.estimatedROI.replace(/[^0-9.]/g, '')), 0).toFixed(1)}K/month
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {insights.filter(insight => insight.priority === 'low').map((insight, index) => (
                <motion.div
                  key={insight.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                  className="relative group"
                >
                  <div className="bg-white rounded-lg p-4 border border-green-100 hover:border-green-200 hover:shadow-lg transition-all duration-300 cursor-pointer">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-8 h-8 bg-gradient-to-br from-${insight.color}-400 to-${insight.color}-600 rounded-lg flex items-center justify-center`}>
                        <insight.icon className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <h6 className="font-semibold text-gray-900 text-sm">{insight.title}</h6>
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-600 mb-3 line-clamp-2">
                      {insight.description}
                    </div>
                    
                    <div className="flex items-center justify-between text-xs">
                      <span className={`font-bold text-${insight.color}-600`}>{insight.impact}</span>
                      <span className="font-bold text-green-600">{insight.estimatedROI}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Enhanced Bottom Action Bar - Landscape Optimized */}
        <div className="mt-10 pt-6 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-white rounded-b-2xl">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                <Lightbulb className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-lg font-bold text-gray-900">
                  AI analyzed {store.zones.length} zones and generated {insights.length} optimization opportunities
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Potential monthly revenue increase: <span className="font-bold text-green-600">
                    ${insights.reduce((sum, insight) => sum + parseFloat(insight.estimatedROI.replace(/[^0-9.]/g, '')), 0).toFixed(1)}K
                  </span> • Implementation time: <span className="font-bold text-blue-600">
                    {insights.reduce((sum, insight) => sum + parseInt(insight.timeToImplement.replace(/[^0-9]/g, '')), 0)} hours total
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 px-6 py-3 bg-white text-gray-700 font-semibold rounded-xl border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 shadow-md hover:shadow-lg">
                <Eye className="w-5 h-5" />
                View All Insights
              </button>
              <button className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                <Settings className="w-5 h-5" />
                Customize AI
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
