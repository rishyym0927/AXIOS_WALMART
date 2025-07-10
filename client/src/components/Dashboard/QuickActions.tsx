'use client';

import { motion } from 'framer-motion';
import { 
  Layout, 
  Package, 
  BarChart3, 
  Users, 
  Plus, 
  Zap, 
  Target,
  Settings,
  Download,
  Upload
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function QuickActions() {
  const router = useRouter();

  const actions = [
    { 
      icon: Layout, 
      label: "New Layout", 
      description: "Create a new store layout from scratch", 
      color: "blue",
      onClick: () => router.push('/')
    },
    { 
      icon: Package, 
      label: "Add Products", 
      description: "Place new products in zones", 
      color: "green",
      onClick: () => router.push('/')
    },
    { 
      icon: BarChart3, 
      label: "Analytics Report", 
      description: "Generate detailed performance report", 
      color: "purple",
      onClick: () => alert('Analytics report feature coming soon!')
    },
    { 
      icon: Users, 
      label: "Customer Flow", 
      description: "Analyze traffic patterns", 
      color: "orange",
      onClick: () => alert('Customer flow analysis feature coming soon!')
    },
    { 
      icon: Zap, 
      label: "AI Optimize", 
      description: "Get AI layout suggestions", 
      color: "yellow",
      onClick: () => router.push('/')
    },
    { 
      icon: Target, 
      label: "Zone Analysis", 
      description: "Deep dive into zone performance", 
      color: "red",
      onClick: () => router.push('/')
    }
  ];

  const quickButtons = [
    { icon: Download, label: "Export", color: "gray" },
    { icon: Upload, label: "Import", color: "gray" },
    { icon: Settings, label: "Settings", color: "gray" }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-orange-50 via-red-50 to-pink-50 px-6 py-5 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Quick Actions</h3>
              <p className="text-sm text-gray-600">Fast access to key features</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white/80 rounded-lg border border-orange-200">
            <span className="text-sm font-medium text-gray-700">Shortcuts</span>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        {/* Main Actions Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
          {actions.map((action, index) => (
            <motion.button
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              onClick={action.onClick}
              className="relative p-5 border-2 border-gray-200 rounded-2xl hover:border-blue-300 hover:shadow-lg transition-all duration-300 text-left group overflow-hidden"
            >
              {/* Background Gradient on Hover */}
              <div className={`absolute inset-0 bg-gradient-to-br from-${action.color}-50 to-${action.color}-100 opacity-0 group-hover:opacity-100 transition-all duration-300`} />
              
              {/* Content */}
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-br from-${action.color}-500 to-${action.color}-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 group-hover:text-blue-700 transition-colors text-lg">{action.label}</h4>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Plus className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
                <p className="text-sm text-gray-600 group-hover:text-gray-700 leading-relaxed">{action.description}</p>
              </div>
              
              {/* Shine Effect */}
              <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-0 group-hover:animate-shine group-hover:opacity-20"></div>
            </motion.button>
          ))}
        </div>
        
        {/* Quick Buttons */}
        <div className="border-t border-gray-100 pt-6">
          <h4 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Quick Tools
          </h4>
          <div className="flex gap-3">
            {quickButtons.map((button, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1, duration: 0.3 }}
                className="flex-1 p-4 border-2 border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 group"
              >
                <button.icon className="w-5 h-5 text-gray-600 group-hover:text-blue-600 mx-auto mb-2 group-hover:scale-110 transition-all duration-300" />
                <span className="text-sm font-semibold text-gray-700 group-hover:text-blue-700 block transition-colors">{button.label}</span>
              </motion.button>
            ))}
          </div>
        </div>
        
        {/* Enhanced Pro Tip */}
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-2xl border-2 border-blue-100 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500 rounded-full -translate-y-10 translate-x-10"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-purple-500 rounded-full translate-y-8 -translate-x-8"></div>
          </div>
          
          <div className="relative z-10 flex items-start gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
              <span className="text-sm font-bold text-white">💡</span>
            </div>
            <div>
              <h5 className="text-sm font-bold text-blue-900 mb-2 flex items-center gap-2">
                Pro Tip
                <span className="px-2 py-0.5 bg-yellow-200 text-yellow-800 text-xs font-bold rounded-full">NEW</span>
              </h5>
              <p className="text-sm text-blue-700 leading-relaxed">
                Use <strong>AI Optimize</strong> after making layout changes to get intelligent suggestions for improvement and boost your store's performance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
