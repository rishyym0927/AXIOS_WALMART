"use client"

import { motion } from "framer-motion"
import {
  Activity,
  Layout,
  Brain,
  Save,
  Users,
  Clock,
  TrendingUp,
  Target,
  AlertCircle,
  CheckCircle,
  RefreshCw,
} from "lucide-react"
import { useState, useEffect } from "react"
import { useStoreDesigner } from "@/store/useStoreDesigner"

export default function LiveActivityFeed() {
  const { store } = useStoreDesigner()
  const [showAll, setShowAll] = useState(false)
  const [currentTime, setCurrentTime] = useState<string>("")

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(
        new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
      )
    }

    updateTime()
    const interval = setInterval(updateTime, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [])

  // Generate activities based on actual store data
  const generateActivities = () => {
    const baseActivities = [
      {
        id: 1,
        time: "2 min ago",
        action: "Zone metrics updated",
        detail: `Performance data refreshed for ${store.zones.length} active zones`,
        type: "analytics",
        user: "System",
        impact: "Data synchronized",
        status: "success",
      },
      {
        id: 2,
        time: "15 min ago",
        action: "AI analysis completed",
        detail: "Layout optimization suggestions generated based on current configuration",
        type: "ai",
        user: "AI Assistant",
        impact: "3 new insights",
        status: "success",
      },
      {
        id: 3,
        time: "1 hour ago",
        action: "Store layout loaded",
        detail: `Successfully loaded store layout with ${store.zones.length} zones from backend`,
        type: "save",
        user: "System",
        impact: "Layout synchronized",
        status: "success",
      },
    ]

    // Add zone-specific activities
    if (store.zones.length > 0) {
      const recentZone = store.zones[0]
      baseActivities.unshift({
        id: 4,
        time: "5 min ago",
        action: "Zone performance analyzed",
        detail: `${recentZone.name} zone showing optimal performance metrics`,
        type: "optimization",
        user: "Analytics Engine",
        impact: "+12% efficiency",
        status: "success",
      })
    }

    // Add more activities based on zone count
    if (store.zones.length >= 2) {
      baseActivities.push({
        id: 5,
        time: "2 hours ago",
        action: "Multi-zone analysis",
        detail: `Cross-zone traffic flow analysis completed for ${store.zones.length} zones`,
        type: "analytics",
        user: "Traffic Analyzer",
        impact: "Flow optimized",
        status: "success",
      })
    }

    if (store.zones.length >= 3) {
      baseActivities.push({
        id: 6,
        time: "4 hours ago",
        action: "Layout efficiency check",
        detail: "Automated efficiency scan detected optimization opportunities",
        type: "optimization",
        user: "AI Assistant",
        impact: "2 suggestions",
        status: "warning",
      })
    }

    return baseActivities.sort((a, b) => {
      const timeA = parseTimeToMinutes(a.time)
      const timeB = parseTimeToMinutes(b.time)
      return timeA - timeB
    })
  }

  const parseTimeToMinutes = (timeStr: string): number => {
    if (timeStr.includes("min ago")) {
      return Number.parseInt(timeStr.replace(" min ago", ""))
    } else if (timeStr.includes("hour ago")) {
      return Number.parseInt(timeStr.replace(" hour ago", "")) * 60
    } else if (timeStr.includes("hours ago")) {
      return Number.parseInt(timeStr.replace(" hours ago", "")) * 60
    }
    return 0
  }

  const activities = generateActivities()

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "optimization":
        return Target
      case "analytics":
        return TrendingUp
      case "ai":
        return Brain
      case "save":
        return Save
      case "zone":
        return Layout
      default:
        return Activity
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case "optimization":
        return "blue"
      case "analytics":
        return "purple"
      case "ai":
        return "indigo"
      case "save":
        return "green"
      case "zone":
        return "orange"
      default:
        return "gray"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return CheckCircle
      case "warning":
        return AlertCircle
      case "error":
        return AlertCircle
      default:
        return CheckCircle
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "text-green-500"
      case "warning":
        return "text-yellow-500"
      case "error":
        return "text-red-500"
      default:
        return "text-green-500"
    }
  }

  const displayedActivities = showAll ? activities : activities.slice(0, 5)

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 px-6 py-5 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Live Activity Feed</h3>
              <p className="text-sm text-gray-600">Real-time system events and updates</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/80 rounded-lg border border-green-200">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-700">Live • {currentTime}</span>
            </div>
            <button className="p-2 hover:bg-white/50 rounded-lg transition-colors">
              <RefreshCw className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
        {displayedActivities.map((activity, index) => {
          const IconComponent = getActivityIcon(activity.type)
          const StatusIcon = getStatusIcon(activity.status)
          const color = getActivityColor(activity.type)
          const statusColor = getStatusColor(activity.status)

          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="p-4 hover:bg-gray-50 transition-colors group"
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-8 h-8 bg-${color}-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1 relative`}
                >
                  <IconComponent className={`w-4 h-4 text-${color}-600`} />
                  <div className="absolute -top-1 -right-1">
                    <StatusIcon className={`w-3 h-3 ${statusColor}`} />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                          {activity.action}
                        </span>
                        <span
                          className={`px-2 py-0.5 text-xs font-medium rounded-full bg-${color}-100 text-${color}-700`}
                        >
                          {activity.type}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2 leading-relaxed">{activity.detail}</p>

                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs">
                        <div className="flex items-center gap-1 text-gray-500">
                          <Users className="w-3 h-3" />
                          <span>{activity.user}</span>
                        </div>
                        <div
                          className={`flex items-center gap-1 font-medium ${
                            activity.status === "success"
                              ? "text-green-600"
                              : activity.status === "warning"
                                ? "text-yellow-600"
                                : "text-blue-600"
                          }`}
                        >
                          <span>{activity.impact}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-xs text-gray-500 flex-shrink-0 ml-3">
                      <Clock className="w-3 h-3" />
                      <span>{activity.time}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {activities.length > 5 && (
        <div className="p-4 bg-gray-50 border-t border-gray-100">
          <button
            onClick={() => setShowAll(!showAll)}
            className="w-full text-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
          >
            {showAll ? "Show Less" : `Show All Activities (${activities.length})`}
          </button>
        </div>
      )}

      <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            Connected to backend • {store.zones.length} zones monitored
          </div>
          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">View System Logs</button>
        </div>
      </div>
    </div>
  )
}
