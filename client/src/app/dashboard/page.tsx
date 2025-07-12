"use client"

import dynamic from "next/dynamic"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { useStoreDesigner } from "@/store/useStoreDesigner"
import { Layout, DollarSign, BarChart3, Activity, RefreshCw, Target, ArrowUpRight, ArrowDownRight } from "lucide-react"
import Navbar from "@/components/Navbar"
import StoreLoader from "@/components/StoreLoader"

// Dynamic imports
const ModernZoneAnalytics = dynamic(() => import("@/components/Dashboard/ModernZoneAnalytics"), {
  ssr: false,
  loading: () => <div className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse h-64" />,
})

const CleanPerformanceCharts = dynamic(() => import("@/components/Dashboard/CleanPerformanceCharts"), {
  ssr: false,
  loading: () => <div className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse h-64" />,
})

const MinimalAIInsights = dynamic(() => import("@/components/Dashboard/MinimalAIInsights"), {
  ssr: false,
  loading: () => <div className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse h-32" />,
})

const SimpleActivityFeed = dynamic(() => import("@/components/Dashboard/SimpleActivityFeed"), {
  ssr: false,
  loading: () => <div className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse h-64" />,
})

export default function ModernDashboard() {
  const { store, layoutMetrics, fetchStoreFromServer, isLoading, error } = useStoreDesigner()
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetchStoreFromServer()
  }, [fetchStoreFromServer])

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchStoreFromServer()
    setRefreshing(false)
  }

  // Calculate simple metrics from backend data
  const calculateMetrics = () => {
    const totalZones = store.zones.length
    const totalArea = store.width * store.height
    const usedArea = store.zones.reduce((sum, zone) => sum + zone.width * zone.height, 0)
    const utilization = totalArea > 0 ? (usedArea / totalArea) * 100 : 0

    // Simple revenue estimation
    const estimatedRevenue = store.zones.reduce((sum, zone) => {
      const zoneArea = zone.width * zone.height
      return sum + zoneArea * 150 // $150 per sq meter average
    }, 0)

    return {
      totalZones,
      utilization: Math.round(utilization),
      estimatedRevenue: Math.round(estimatedRevenue / 1000), // in K
      efficiency: Math.min(100, Math.round(utilization * 1.1)),
    }
  }

  const metrics = calculateMetrics()

  const stats = [
    {
      icon: Layout,
      value: metrics.totalZones,
      label: "Active Zones",
      change: "+2",
      changeType: "positive" as const,
    },
    {
      icon: Target,
      value: `${metrics.utilization}%`,
      label: "Space Utilization",
      change: metrics.utilization > 75 ? "+8%" : "-3%",
      changeType: metrics.utilization > 75 ? "positive" : "negative",
    },
    {
      icon: DollarSign,
      value: `$${metrics.estimatedRevenue}K`,
      label: "Monthly Revenue",
      change: "+12%",
      changeType: "positive" as const,
    },
    {
      icon: BarChart3,
      value: `${metrics.efficiency}%`,
      label: "Efficiency Score",
      change: "+5%",
      changeType: "positive" as const,
    },
  ]

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-xl border border-red-200 p-8 text-center">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Activity className="w-6 h-6 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Connection Error</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={handleRefresh}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Retry Connection
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <StoreLoader>
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        {/* Clean Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600 mt-1">Monitor your store performance and insights</p>
              </div>
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
                <span className="text-sm font-medium">Refresh</span>
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <stat.icon className="w-5 h-5 text-gray-600" />
                  </div>
                  <div
                    className={`flex items-center gap-1 text-sm font-medium ${
                      stat.changeType === "positive" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {stat.changeType === "positive" ? (
                      <ArrowUpRight className="w-4 h-4" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4" />
                    )}
                    {stat.change}
                  </div>
                </div>
                <div className="mt-4">
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Charts */}
            <div className="lg:col-span-2 space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <CleanPerformanceCharts />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <ModernZoneAnalytics />
              </motion.div>
            </div>

            {/* Right Column - Insights & Activity */}
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <MinimalAIInsights />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <SimpleActivityFeed />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </StoreLoader>
  )
}
