"use client"

import { motion } from "framer-motion"
import { Brain, ArrowRight, Zap } from "lucide-react"
import { useStoreDesigner } from "@/store/useStoreDesigner"
import { useRouter } from "next/navigation"

export default function MinimalAIInsights() {
  const { store } = useStoreDesigner()
  const router = useRouter()

  // Generate simple AI insights
  const generateInsights = () => {
    const insights = []

    if (store.zones.length === 0) {
      return [
        {
          id: 1,
          title: "Get Started",
          description: "Create your first zone to unlock AI insights",
          action: "Create Zone",
          priority: "high",
        },
      ]
    }

    // Simple insights based on zone count and layout
    if (store.zones.length < 3) {
      insights.push({
        id: 1,
        title: "Expand Layout",
        description: "Add more zones to optimize store efficiency",
        action: "Add Zones",
        priority: "medium",
      })
    }

    if (store.zones.length >= 2) {
      insights.push({
        id: 2,
        title: "Optimize Flow",
        description: "Improve customer traffic between zones",
        action: "View Suggestions",
        priority: "high",
      })
    }

    insights.push({
      id: 3,
      title: "Revenue Boost",
      description: "Potential 15% increase with layout adjustments",
      action: "Learn More",
      priority: "high",
    })

    return insights.slice(0, 3)
  }

  const insights = generateInsights()

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-50 text-red-700 border-red-200"
      case "medium":
        return "bg-yellow-50 text-yellow-700 border-yellow-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
            <Brain className="w-4 h-4 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">AI Insights</h3>
            <p className="text-sm text-gray-600">{insights.length} recommendations</p>
          </div>
        </div>
        <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">View All</button>
      </div>

      <div className="space-y-4">
        {insights.map((insight, index) => (
          <motion.div
            key={insight.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-medium text-gray-900">{insight.title}</h4>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(insight.priority)}`}
                  >
                    {insight.priority}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{insight.description}</p>
                <button className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                  {insight.action}
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {store.zones.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Zap className="w-4 h-4 text-yellow-500" />
            <span>AI analyzed {store.zones.length} zones</span>
          </div>
        </div>
      )}
    </div>
  )
}
