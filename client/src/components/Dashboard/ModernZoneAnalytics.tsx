"use client"

import { motion } from "framer-motion"
import { MapPin, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { useStoreDesigner } from "@/store/useStoreDesigner"
import { useRouter } from "next/navigation"

export default function ModernZoneAnalytics() {
  const { store } = useStoreDesigner()
  const router = useRouter()

  // Generate simple metrics for each zone
  const getZoneMetrics = (zone: any) => {
    const area = zone.width * zone.height
    return {
      revenue: Math.round(area * 120 + Math.random() * 200),
      traffic: Math.round(area * 15 + Math.random() * 100),
      utilization: Math.round(70 + Math.random() * 30),
      trend: Math.random() > 0.4 ? "up" : "down",
      trendValue: Math.round(5 + Math.random() * 15),
    }
  }

  if (store.zones.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <div className="text-center">
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-6 h-6 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Zones Found</h3>
          <p className="text-gray-600 mb-6">Create zones to start analyzing performance</p>
          <button
            onClick={() => router.push("/")}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Create Zone
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Zone Performance</h3>
          <p className="text-sm text-gray-600">{store.zones.length} active zones</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {store.zones.map((zone, index) => {
          const metrics = getZoneMetrics(zone)
          return (
            <motion.div
              key={zone.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow cursor-pointer"
              onClick={() => router.push(`/zone/${zone.id}`)}
            >
              {/* Zone Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: zone.color }} />
                  <h4 className="font-medium text-gray-900">{zone.name}</h4>
                </div>
                <div
                  className={`flex items-center gap-1 text-sm ${
                    metrics.trend === "up" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {metrics.trend === "up" ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4" />
                  )}
                  {metrics.trendValue}%
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900">${metrics.revenue}</div>
                  <div className="text-xs text-gray-600">Revenue</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900">{metrics.traffic}</div>
                  <div className="text-xs text-gray-600">Traffic</div>
                </div>
                <div className="text-center">
                  <div
                    className={`text-lg font-semibold ${
                      metrics.utilization >= 80
                        ? "text-green-600"
                        : metrics.utilization >= 60
                          ? "text-yellow-600"
                          : "text-red-600"
                    }`}
                  >
                    {metrics.utilization}%
                  </div>
                  <div className="text-xs text-gray-600">Utilization</div>
                </div>
              </div>

              {/* Area Info */}
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="text-sm text-gray-600">
                  {(zone.width * zone.height).toFixed(1)}m² • {zone.width}×{zone.height}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
