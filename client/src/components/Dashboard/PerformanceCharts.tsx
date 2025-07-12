'use client';

import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Calendar, Filter, Download, RefreshCw, Target, DollarSign, Users, Clock } from 'lucide-react';
import { useStoreDesigner } from '@/store/useStoreDesigner';
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
  ArcElement
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function PerformanceCharts() {
  const { store } = useStoreDesigner();

  // Generate realistic data based on actual zones
  const generateZonePerformanceData = () => {
    return store.zones.map(zone => {
      const baseRevenue = zone.name.toLowerCase().includes('electronics') ? 800 : 
                         zone.name.toLowerCase().includes('grocery') ? 400 : 600;
      const area = zone.width * zone.height;
      return {
        name: zone.name,
        revenue: Math.round(baseRevenue * area / 10),
        traffic: Math.round(Math.random() * 500 + 200),
        utilization: Math.round(Math.random() * 30 + 70),
        efficiency: Math.round(Math.random() * 25 + 75)
      };
    });
  };

  const zoneData = generateZonePerformanceData();

  // Revenue by Zone Chart
  const revenueChartData = {
    labels: zoneData.map(zone => zone.name),
    datasets: [
      {
        label: 'Revenue ($)',
        data: zoneData.map(zone => zone.revenue),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(6, 182, 212, 0.8)'
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(16, 185, 129)',
          'rgb(245, 158, 11)',
          'rgb(139, 92, 246)',
          'rgb(239, 68, 68)',
          'rgb(6, 182, 212)'
        ],
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      }
    ]
  };

  // Traffic Trend Chart (last 7 days)
  const trafficTrendData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Daily Traffic',
        data: [1200, 1350, 1100, 1400, 1600, 1800, 1500],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: 'rgb(59, 130, 246)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
      }
    ]
  };

  // Utilization Distribution
  const utilizationData = {
    labels: ['High (80-100%)', 'Medium (60-79%)', 'Low (0-59%)'],
    datasets: [
      {
        data: [
          zoneData.filter(z => z.utilization >= 80).length,
          zoneData.filter(z => z.utilization >= 60 && z.utilization < 80).length,
          zoneData.filter(z => z.utilization < 60).length
        ],
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)'
        ],
        borderColor: [
          'rgb(16, 185, 129)',
          'rgb(245, 158, 11)',
          'rgb(239, 68, 68)'
        ],
        borderWidth: 2,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            weight: 500
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          font: {
            size: 11
          }
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 11
          }
        }
      }
    }
  };

  const lineChartOptions = {
    ...chartOptions,
    elements: {
      point: {
        hoverRadius: 8
      }
    }
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            weight: 500
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12
      }
    },
    cutout: '60%'
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-700 px-6 py-6">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Performance Analytics</h3>
                <p className="text-blue-100">Real-time charts and insights</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-3 py-2 bg-white/20 backdrop-blur-sm rounded-lg border border-white/20 text-white hover:bg-white/30 transition-colors">
                <Filter className="w-4 h-4" />
                <span className="text-sm">Filter</span>
              </button>
              <button className="flex items-center gap-2 px-3 py-2 bg-white/20 backdrop-blur-sm rounded-lg border border-white/20 text-white hover:bg-white/30 transition-colors">
                <Download className="w-4 h-4" />
                <span className="text-sm">Export</span>
              </button>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
              <div className="flex items-center gap-2 mb-1">
                <DollarSign className="w-4 h-4 text-green-300" />
                <span className="text-white text-sm font-medium">Total Revenue</span>
              </div>
              <div className="text-white text-xl font-bold">
                ${zoneData.reduce((sum, zone) => sum + zone.revenue, 0).toLocaleString()}
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
              <div className="flex items-center gap-2 mb-1">
                <Users className="w-4 h-4 text-blue-300" />
                <span className="text-white text-sm font-medium">Avg Traffic</span>
              </div>
              <div className="text-white text-xl font-bold">
                {Math.round(zoneData.reduce((sum, zone) => sum + zone.traffic, 0) / zoneData.length)}
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
              <div className="flex items-center gap-2 mb-1">
                <Target className="w-4 h-4 text-yellow-300" />
                <span className="text-white text-sm font-medium">Avg Utilization</span>
              </div>
              <div className="text-white text-xl font-bold">
                {Math.round(zoneData.reduce((sum, zone) => sum + zone.utilization, 0) / zoneData.length)}%
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-4 h-4 text-purple-300" />
                <span className="text-white text-sm font-medium">Peak Hours</span>
              </div>
              <div className="text-white text-xl font-bold">2-4 PM</div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Revenue by Zone */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="lg:col-span-2 xl:col-span-2"
          >
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-bold text-gray-900">Revenue by Zone</h4>
                <div className="flex items-center gap-1 text-green-600">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm font-medium">+15% vs last month</span>
                </div>
              </div>
              <div className="h-64">
                <Bar data={revenueChartData} options={chartOptions} />
              </div>
            </div>
          </motion.div>

          {/* Utilization Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-bold text-gray-900">Space Utilization</h4>
                <div className="text-sm text-gray-600">Zone Distribution</div>
              </div>
              <div className="h-64">
                <Doughnut data={utilizationData} options={doughnutOptions} />
              </div>
            </div>
          </motion.div>

          {/* Traffic Trend */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="lg:col-span-2 xl:col-span-3"
          >
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-bold text-gray-900">Weekly Traffic Trend</h4>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Last 7 days</span>
                </div>
              </div>
              <div className="h-64">
                <Line data={trafficTrendData} options={lineChartOptions} />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
