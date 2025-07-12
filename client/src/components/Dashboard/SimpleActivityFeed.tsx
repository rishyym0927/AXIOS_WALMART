"use client"

import { motion } from "framer-motion"
import { Activity, Layout, Brain, Save, Clock, CheckCircle } from "lucide-react"
import { useStoreDesigner } from "@/store/useStoreDesigner"

export default function SimpleActivityFeed() {
  const { store } = useStoreDesigner()

  // Generate simple activities
  const generateActivities = () => {
    const activities = [
      {
        id: 1,
        action: "Data refreshed",
        time: "2 min ago",
        type: "system",
      },
      {
        id: 2,
        action: "AI analysis completed",
        time: "15 min ago",
        type: "ai",
      },
      {
        id: 3,
        action: "Layout loaded",
        time: "1 hour ago",
        type: "layout",
      },
    ]

    if (store.zones.length > 0) {
      activities.unshift({
        id: 4,
        action: `${store.zones.length} zones analyzed`,
        time: "5 min ago",
        type: "analytics",
      })
    }

    return activities.slice(0, 5)
  }

  const activities = generateActivities()

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "layout":
        return Layout
      case "ai":
        return Brain
      case "system":
        return Save
      default:
        return Activity
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
            <Activity className="w-4 h-4 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            <p className="text-sm text-gray-600">System updates</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-600">Live</span>
        </div>
      </div>

      <div className="space-y-4">
        {activities.map((activity, index) => {
          const IconComponent = getActivityIcon(activity.type)
          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="flex items-center gap-3"
            >
              <div className="w-6 h-6 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <IconComponent className="w-3 h-3 text-gray-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-900 truncate">{activity.action}</p>
                  <div className="flex items-center gap-1 text-xs text-gray-500 flex-shrink-0 ml-2">
                    <Clock className="w-3 h-3" />
                    {activity.time}
                  </div>
                </div>
              </div>
              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
            </motion.div>
          )
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100">
        <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">View All Activity</button>
      </div>
    </div>
  )
}
