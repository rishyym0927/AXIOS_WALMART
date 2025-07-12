"use client"

import { motion } from "framer-motion"
import {
  Brain,
  Lightbulb,
  TrendingUp,
  Users,
  MapPin,
  ArrowRight,
  Sparkles,
  DollarSign,
  BarChart3,
  Cpu,
  Eye,
  Settings,
  RefreshCw,
  Award,
  Star,
  Check,
} from "lucide-react"
import { useStoreDesigner } from "@/store/useStoreDesigner"
import { useRouter } from "next/navigation"

export default function SmartAIInsights() {
  const { store } = useStoreDesigner()
  const router = useRouter()

  // Generate AI insights based on actual store data
  const generateInsights = () => {
    const insights = []

    // Analyze zone utilization
    const lowUtilizationZones = store.zones.filter((zone) => {
      const area = zone.width * zone.height
      return area < 50 // Small zones might be underutilized
    })

    if (lowUtilizationZones.length > 0) {
      insights.push({
        id: 1,
        title: "Optimize Small Zones",
        description: `${lowUtilizationZones.length} zones are underutilized. Consider merging or expanding these areas for better space efficiency.`,
        impact: "+25% space efficiency",
        confidence: 92,
        type: "layout",
        icon: MapPin,
        color: "blue",
        priority: "high",
        timeToImplement: "2 hours",
        estimatedROI: "$1.5K/month",
        action: "Apply Layout",
        zones: lowUtilizationZones.map((z) => z.name),
      })
    }

    // Check for electronics zones
    const electronicsZones = store.zones.filter((zone) => zone.name.toLowerCase().includes("electronics"))

    if (electronicsZones.length > 0) {
      insights.push({
        id: 2,
        title: "Electronics Zone Expansion",
        description:
          "High-margin electronics zones show strong performance. Expanding by 20% could capture additional revenue during peak seasons.",
        impact: "+$3.2K/month",
        confidence: 89,
        type: "revenue",
        icon: DollarSign,
        color: "emerald",
        priority: "high",
        timeToImplement: "4 hours",
        estimatedROI: "$3.2K/month",
        action: "Preview Changes",
        zones: electronicsZones.map((z) => z.name),
      })
    }

    // General layout optimization
    if (store.zones.length >= 3) {
      insights.push({
        id: 3,
        title: "Customer Flow Optimization",
        description:
          "AI analysis suggests repositioning high-traffic zones to create a more intuitive customer journey and reduce congestion.",
        impact: "+18% customer satisfaction",
        confidence: 85,
        type: "optimization",
        icon: TrendingUp,
        color: "purple",
        priority: "medium",
        timeToImplement: "3 hours",
        estimatedROI: "$1.8K/month",
        action: "Analyze Route",
        zones: store.zones.slice(0, 3).map((z) => z.name),
      })
    }

    // Add more insights based on zone count
    if (store.zones.length > 0) {
      insights.push({
        id: 4,
        title: "Peak Hours Layout",
        description:
          "Dynamic zone sizing based on traffic patterns during peak shopping hours could improve capacity by 15%.",
        impact: "+15% capacity",
        confidence: 82,
        type: "capacity",
        icon: Users,
        color: "cyan",
        priority: "medium",
        timeToImplement: "5 hours",
        estimatedROI: "$1.1K/month",
        action: "Schedule Implementation",
        zones: store.zones.map((z) => z.name),
      })

      insights.push({
        id: 5,
        title: "Heat Map Analysis",
        description:
          "Customer dwell time data reveals opportunities to optimize product placement in high-traffic areas.",
        impact: "+22% conversion rate",
        confidence: 78,
        type: "analytics",
        icon: BarChart3,
        color: "rose",
        priority: "low",
        timeToImplement: "2 hours",
        estimatedROI: "$950/month",
        action: "View Heat Map",
        zones: store.zones.slice(0, 2).map((z) => z.name),
      })
    }

    return insights
  }

  const insights = generateInsights()

  const quickActions = [
    { label: "Generate Layout", icon: Cpu, action: () => router.push("/") },
    { label: "Traffic Analysis", icon: Users, action: () => {} },
    { label: "Performance Report", icon: BarChart3, action: () => {} },
    { label: "Refresh Insights", icon: RefreshCw, action: () => {} },
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-700 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-700 border-green-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return "bg-emerald-100 text-emerald-700 border-emerald-200"
    if (confidence >= 80) return "bg-blue-100 text-blue-700 border-blue-200"
    if (confidence >= 70) return "bg-yellow-100 text-yellow-700 border-yellow-200"
    return "bg-red-100 text-red-700 border-red-200"
  }

  if (insights.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-700 px-8 py-6">
          <div className="relative z-10">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-white flex items-center gap-3">
                  AI-Powered Store Insights
                  <Sparkles className="w-6 h-6 text-yellow-300" />
                </h3>
                <p className="text-blue-100 font-medium text-lg mt-1">Analyzing your store layout...</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-lg">
            <Brain className="w-12 h-12 text-blue-600" />
          </div>
          <h4 className="text-2xl font-bold text-gray-900 mb-4">Setting Up AI Analysis</h4>
          <p className="text-gray-500 mb-8 max-w-lg mx-auto leading-relaxed text-lg">
            Create zones in your store layout to unlock AI-powered insights and optimization recommendations
          </p>
          <button
            onClick={() => router.push("/")}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 text-lg font-semibold"
          >
            <Cpu className="w-6 h-6" />
            <span>Start Layout Design</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      {/* Enhanced Header */}
      <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-700 px-8 py-6">
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
                <p className="text-blue-100 font-medium text-lg mt-1">
                  Smart optimization recommendations based on your layout
                </p>

                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-lg border border-white/20">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-white">AI Active</span>
                  </div>
                  <div className="text-sm text-blue-200">
                    Analyzed {store.zones.length} zones • {insights.length} insights found
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 w-full lg:w-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 text-center">
                <div className="text-white text-2xl font-bold">{insights.length}</div>
                <div className="text-blue-200 text-xs font-medium">Active Insights</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 text-center">
                <div className="text-white text-2xl font-bold">
                  {insights
                    .reduce((sum, insight) => sum + Number.parseFloat(insight.estimatedROI.replace(/[^0-9.]/g, "")), 0)
                    .toFixed(1)}
                  K
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

      {/* Quick Actions Bar */}
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

          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-gray-600">
                <span className="font-bold text-red-600">{insights.filter((i) => i.priority === "high").length}</span>{" "}
                High Priority
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-gray-600">
                <span className="font-bold text-yellow-600">
                  {insights.filter((i) => i.priority === "medium").length}
                </span>{" "}
                Medium
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-600">
                <span className="font-bold text-green-600">{insights.filter((i) => i.priority === "low").length}</span>{" "}
                Long-term
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Insights Grid */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {insights.map((insight, index) => (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="relative group"
            >
              <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 border-2 border-gray-100 hover:border-indigo-200 hover:shadow-xl transition-all duration-300 cursor-pointer">
                <div className="absolute top-4 right-4">
                  <span
                    className={`px-3 py-1.5 rounded-full text-xs font-bold border uppercase tracking-wide ${getPriorityColor(insight.priority)}`}
                  >
                    {insight.priority}
                  </span>
                </div>

                <div className="flex items-start gap-4 mb-4">
                  <div
                    className={`w-14 h-14 bg-gradient-to-br from-${insight.color}-400 to-${insight.color}-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    <insight.icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h5 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors text-lg mb-2">
                      {insight.title}
                    </h5>
                    <div
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${getConfidenceColor(insight.confidence)}`}
                    >
                      <Star className="w-3 h-3" />
                      {insight.confidence}% confident
                    </div>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-6 leading-relaxed">{insight.description}</p>

                {insight.zones && (
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="text-xs font-medium text-blue-800 mb-1">Affected Zones:</div>
                    <div className="text-xs text-blue-600">{insight.zones.join(", ")}</div>
                  </div>
                )}

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                    <div className={`text-lg font-bold text-${insight.color}-600`}>{insight.impact}</div>
                    <div className="text-xs text-gray-500 font-medium">Impact</div>
                  </div>
                  <div className="text-center p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-100">
                    <div className="text-lg font-bold text-green-600">{insight.estimatedROI}</div>
                    <div className="text-xs text-gray-500 font-medium">ROI</div>
                  </div>
                  <div className="text-center p-3 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg border border-yellow-100">
                    <div className="text-lg font-bold text-orange-600">{insight.timeToImplement}</div>
                    <div className="text-xs text-gray-500 font-medium">Time</div>
                  </div>
                </div>

                <button
                  className={`w-full bg-gradient-to-r from-${insight.color}-500 to-${insight.color}-600 hover:from-${insight.color}-600 hover:to-${insight.color}-700 text-white text-sm font-bold py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 transform group-hover:scale-105`}
                >
                  <Check className="w-4 h-4" />
                  {insight.action}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-10 pt-6 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-white rounded-b-2xl"
        >
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
                  Potential monthly revenue increase:{" "}
                  <span className="font-bold text-green-600">
                    $
                    {insights
                      .reduce(
                        (sum, insight) => sum + Number.parseFloat(insight.estimatedROI.replace(/[^0-9.]/g, "")),
                        0,
                      )
                      .toFixed(1)}
                    K
                  </span>{" "}
                  • Implementation time:{" "}
                  <span className="font-bold text-blue-600">
                    {insights.reduce(
                      (sum, insight) => sum + Number.parseInt(insight.timeToImplement.replace(/[^0-9]/g, "")),
                      0,
                    )}{" "}
                    hours total
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
        </motion.div>
      </div>
    </div>
  )
}
