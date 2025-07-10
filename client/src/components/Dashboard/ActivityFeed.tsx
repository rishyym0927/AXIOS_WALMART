'use client';

import { motion } from 'framer-motion';
import { Activity, Layout, Package, Brain, Save, Users, Clock, MoreHorizontal } from 'lucide-react';
import { useState } from 'react';

export default function ActivityFeed() {
  const [showAll, setShowAll] = useState(false);

  const activities = [
    { 
      id: 1,
      time: "2 min ago", 
      action: "Zone optimized", 
      detail: "Electronics layout improved using AI suggestion", 
      type: "optimization",
      user: "AI Assistant",
      impact: "+18% traffic flow"
    },
    { 
      id: 2,
      time: "15 min ago", 
      action: "New product added", 
      detail: "Smart TV placed in Electronics zone", 
      type: "product",
      user: "John Doe",
      impact: "Inventory updated"
    },
    { 
      id: 3,
      time: "1 hour ago", 
      action: "AI suggestion applied", 
      detail: "Grocery shelves reorganized for better accessibility", 
      type: "ai",
      user: "Store Manager",
      impact: "+$890/month est."
    },
    { 
      id: 4,
      time: "3 hours ago", 
      action: "Layout saved", 
      detail: "Version 2.3 created with backup", 
      type: "save",
      user: "System",
      impact: "Auto-backup"
    },
    { 
      id: 5,
      time: "5 hours ago", 
      action: "Customer flow analyzed", 
      detail: "Peak hours traffic pattern updated", 
      type: "analytics",
      user: "Analytics Engine",
      impact: "Data refreshed"
    },
    { 
      id: 6,
      time: "1 day ago", 
      action: "Zone created", 
      detail: "New seasonal display area added", 
      type: "zone",
      user: "Store Manager",
      impact: "Layout expanded"
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'optimization': return Layout;
      case 'product': return Package;
      case 'ai': return Brain;
      case 'save': return Save;
      case 'analytics': return Activity;
      case 'zone': return Layout;
      default: return Activity;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'optimization': return 'blue';
      case 'product': return 'green';
      case 'ai': return 'purple';
      case 'save': return 'gray';
      case 'analytics': return 'orange';
      case 'zone': return 'indigo';
      default: return 'gray';
    }
  };

  const displayedActivities = showAll ? activities : activities.slice(0, 4);

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 px-6 py-5 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Recent Activity</h3>
              <p className="text-sm text-gray-600">Live updates and system events</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/80 rounded-lg border border-green-200">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-700">Live Feed</span>
            </div>
            <button className="p-2 hover:bg-white/50 rounded-lg transition-colors">
              <MoreHorizontal className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
      
      <div className="divide-y divide-gray-100">
        {displayedActivities.map((activity, index) => {
          const IconComponent = getActivityIcon(activity.type);
          const color = getActivityColor(activity.type);
          
          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="p-4 hover:bg-gray-50 transition-colors group"
            >
              <div className="flex items-start gap-3">
                {/* Activity Icon */}
                <div className={`w-8 h-8 bg-${color}-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1`}>
                  <IconComponent className={`w-4 h-4 text-${color}-600`} />
                </div>
                
                {/* Activity Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                          {activity.action}
                        </span>
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full bg-${color}-100 text-${color}-700`}>
                          {activity.type}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2 leading-relaxed">{activity.detail}</p>
                      
                      {/* User and Impact */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs">
                        <div className="flex items-center gap-1 text-gray-500">
                          <Users className="w-3 h-3" />
                          <span>{activity.user}</span>
                        </div>
                        <div className="flex items-center gap-1 font-medium text-green-600">
                          <span>{activity.impact}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Time */}
                    <div className="flex items-center gap-1 text-xs text-gray-500 flex-shrink-0 ml-3">
                      <Clock className="w-3 h-3" />
                      <span>{activity.time}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
      
      {/* Show More/Less Button */}
      {activities.length > 4 && (
        <div className="p-4 bg-gray-50 border-t border-gray-100">
          <button 
            onClick={() => setShowAll(!showAll)}
            className="w-full text-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
          >
            {showAll ? 'Show Less' : `Show All Activities (${activities.length})`}
          </button>
        </div>
      )}
      
      {/* Live Status */}
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            Live Activity Feed
          </div>
          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            View All History
          </button>
        </div>
      </div>
    </div>
  );
}
