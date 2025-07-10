"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useState } from "react"
import { TrendingUp, DollarSign, Clock, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ROISection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const [storeSize, setStoreSize] = useState(5000)
  const [monthlyRevenue, setMonthlyRevenue] = useState(100000)
  const [staffCount, setStaffCount] = useState(15)

  // ROI Calculations
  const calculateROI = () => {
    const revenueIncrease = monthlyRevenue * 0.35 // 35% increase
    const costSavings = staffCount * 2000 * 0.4 // 40% efficiency gain
    const totalBenefit = revenueIncrease + costSavings
    const implementationCost = 5000 // Base cost
    const monthlyROI = totalBenefit - implementationCost
    const annualROI = monthlyROI * 12

    return {
      monthlyBenefit: totalBenefit,
      monthlyROI,
      annualROI,
      paybackPeriod: implementationCost / totalBenefit,
    }
  }

  const roi = calculateROI()

  const benefits = [
    {
      icon: TrendingUp,
      title: "Revenue Growth",
      value: "35%",
      description: "Average revenue increase through optimized operations",
      color: "from-green-500 to-blue-500",
    },
    {
      icon: Clock,
      title: "Efficiency Gain",
      value: "60%",
      description: "Reduction in manual operational tasks",
      color: "from-blue-500 to-purple-500",
    },
    {
      icon: Users,
      title: "Customer Satisfaction",
      value: "45%",
      description: "Improvement in customer experience scores",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: DollarSign,
      title: "Cost Reduction",
      value: "25%",
      description: "Decrease in operational costs",
      color: "from-pink-500 to-green-500",
    },
  ]

  return (
    <section id="roi" className="py-20 bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-400 to-purple-400 bg-clip-text text-transparent">
            Proven ROI
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            See the immediate impact StoreOps AI can have on your business with our interactive ROI calculator and
            proven success metrics.
          </p>
        </motion.div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="group"
            >
              <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 h-full hover:border-purple-500/50 transition-all duration-300 group-hover:scale-105 text-center">
                <div
                  className={`w-16 h-16 rounded-full bg-gradient-to-r ${benefit.color} flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300`}
                >
                  <benefit.icon className="w-8 h-8 text-white" />
                </div>

                <div
                  className={`text-4xl font-bold mb-2 bg-gradient-to-r ${benefit.color} bg-clip-text text-transparent`}
                >
                  {benefit.value}
                </div>

                <h3 className="text-lg font-semibold text-white mb-2">{benefit.title}</h3>

                <p className="text-gray-400 text-sm">{benefit.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ROI Calculator */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="bg-gradient-to-r from-purple-500/10 to-green-500/10 border border-purple-500/20 rounded-3xl p-8 md:p-12"
        >
          <h3 className="text-3xl font-bold text-white mb-8 text-center">Calculate Your ROI</h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Input Section */}
            <div className="space-y-6">
              <div>
                <Label htmlFor="storeSize" className="text-white text-lg mb-2 block">
                  Store Size (sq ft)
                </Label>
                <Input
                  id="storeSize"
                  type="number"
                  value={storeSize}
                  onChange={(e) => setStoreSize(Number(e.target.value))}
                  className="bg-gray-800 border-gray-600 text-white text-lg p-4"
                />
              </div>

              <div>
                <Label htmlFor="monthlyRevenue" className="text-white text-lg mb-2 block">
                  Monthly Revenue ($)
                </Label>
                <Input
                  id="monthlyRevenue"
                  type="number"
                  value={monthlyRevenue}
                  onChange={(e) => setMonthlyRevenue(Number(e.target.value))}
                  className="bg-gray-800 border-gray-600 text-white text-lg p-4"
                />
              </div>

              <div>
                <Label htmlFor="staffCount" className="text-white text-lg mb-2 block">
                  Number of Staff
                </Label>
                <Input
                  id="staffCount"
                  type="number"
                  value={staffCount}
                  onChange={(e) => setStaffCount(Number(e.target.value))}
                  className="bg-gray-800 border-gray-600 text-white text-lg p-4"
                />
              </div>
            </div>

            {/* Results Section */}
            <div className="bg-gray-800/50 rounded-2xl p-8">
              <h4 className="text-2xl font-bold text-white mb-6">Your Projected Results</h4>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Monthly Benefit:</span>
                  <span className="text-2xl font-bold text-green-400">${roi.monthlyBenefit.toLocaleString()}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Monthly ROI:</span>
                  <span className="text-2xl font-bold text-blue-400">${roi.monthlyROI.toLocaleString()}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Annual ROI:</span>
                  <span className="text-3xl font-bold text-purple-400">${roi.annualROI.toLocaleString()}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Payback Period:</span>
                  <span className="text-xl font-bold text-cyan-400">{roi.paybackPeriod.toFixed(1)} months</span>
                </div>
              </div>

              <Button className="w-full mt-6 bg-gradient-to-r from-purple-500 to-green-500 hover:from-purple-600 hover:to-green-600 text-white py-3 text-lg font-semibold">
                Get Detailed ROI Report
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Success Stories */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-16 text-center"
        >
          <h4 className="text-2xl font-bold text-white mb-8">Success Metrics</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="text-5xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent mb-2">
                $2.3M
              </div>
              <div className="text-gray-300">Average Annual Savings</div>
            </div>
            <div>
              <div className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                3.2x
              </div>
              <div className="text-gray-300">ROI Multiplier</div>
            </div>
            <div>
              <div className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-green-400 bg-clip-text text-transparent mb-2">
                {"< 6"}
              </div>
              <div className="text-gray-300">Months to Break Even</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
