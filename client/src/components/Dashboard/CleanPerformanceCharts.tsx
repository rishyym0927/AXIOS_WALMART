"use client"
import { BarChart3, TrendingUp, Users } from "lucide-react"
import { useStoreDesigner } from "@/store/useStoreDesigner"
import { Bar, Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend)

export default function CleanPerformanceCharts() {
  const { store } = useStoreDesigner()

  // Generate clean data based on zones
  const generateZoneData = () => {
    return store.zones.map((zone) => {
      const area = zone.width * zone.height
      return {
        name: zone.name,
        revenue: Math.round(area * 120 + Math.random() * 200),
        traffic: Math.round(area * 15 + Math.random() * 100),
      }
    })
  }

  const zoneData = generateZoneData()

  // Revenue Chart
  const revenueData = {
    labels: zoneData.map((zone) => zone.name),
    datasets: [
      {
        label: "Revenue ($)",
        data: zoneData.map((zone) => zone.revenue),
        backgroundColor: "rgba(99, 102, 241, 0.8)",
        borderColor: "rgb(99, 102, 241)",
        borderWidth: 0,
        borderRadius: 6,
      },
    ],
  }

  // Traffic Trend
  const trafficData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Daily Visitors",
        data: [850, 920, 780, 1100, 1250, 1400, 1200],
        borderColor: "rgb(99, 102, 241)",
        backgroundColor: "rgba(99, 102, 241, 0.1)",
        tension: 0.4,
        fill: true,
        pointBackgroundColor: "rgb(99, 102, 241)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 4,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "rgba(255, 255, 255, 0.1)",
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
        ticks: {
          font: {
            size: 12,
          },
          color: "#6B7280",
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 12,
          },
          color: "#6B7280",
        },
      },
    },
  }

  if (store.zones.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <div className="text-center">
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="w-6 h-6 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Data Available</h3>
          <p className="text-gray-600">Create zones to view performance charts</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Revenue by Zone */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Revenue by Zone</h3>
            <p className="text-sm text-gray-600">Monthly performance comparison</p>
          </div>
          <div className="flex items-center gap-2 text-green-600">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-medium">+12%</span>
          </div>
        </div>
        <div className="h-64">
          <Bar data={revenueData} options={chartOptions} />
        </div>
      </div>

      {/* Traffic Trend */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Weekly Traffic</h3>
            <p className="text-sm text-gray-600">Visitor trends over the last 7 days</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">
                {Math.round(
                  trafficData.datasets[0].data.reduce((a, b) => a + b, 0) / trafficData.datasets[0].data.length,
                )}{" "}
                avg
              </span>
            </div>
            <div className="flex items-center gap-2 text-green-600">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-medium">+8%</span>
            </div>
          </div>
        </div>
        <div className="h-64">
          <Line data={trafficData} options={chartOptions} />
        </div>
      </div>
    </div>
  )
}
