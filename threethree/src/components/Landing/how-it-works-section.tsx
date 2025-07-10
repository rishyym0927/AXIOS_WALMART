"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { Database, Brain, Zap, ArrowRight } from "lucide-react"

export default function HowItWorksSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const steps = [
    {
      icon: Database,
      title: "Data Collection",
      description:
        "Anonymously collect data from existing sensors, POS systems, and customer interactions without compromising privacy.",
      details: ["Existing camera feeds", "POS transaction data", "WiFi analytics", "Environmental sensors"],
      color: "from-blue-500 to-purple-500",
    },
    {
      icon: Brain,
      title: "AI Processing",
      description:
        "Advanced machine learning algorithms analyze patterns, predict trends, and generate actionable insights in real-time.",
      details: ["Pattern recognition", "Predictive modeling", "Anomaly detection", "Optimization algorithms"],
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: Zap,
      title: "Automated Actions",
      description:
        "Implement recommendations automatically or provide staff with clear, actionable insights to optimize operations.",
      details: ["Automated adjustments", "Staff notifications", "Inventory alerts", "Performance dashboards"],
      color: "from-pink-500 to-red-500",
    },
  ]

  return (
    <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-red-400 bg-clip-text text-transparent">
            How It Works
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Three simple steps to transform your retail operations with AI-powered intelligence.
          </p>
        </motion.div>

        <div className="relative">
          {/* Connection Lines */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-red-500 transform -translate-y-1/2 z-0" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 relative z-10">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ duration: 0.8, delay: index * 0.3 }}
                className="relative group"
              >
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-3xl p-8 h-full hover:border-purple-500/50 transition-all duration-300 group-hover:scale-105">
                  {/* Step Number */}
                  <div className="absolute -top-4 left-8 w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>

                  <div
                    className={`w-20 h-20 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 mx-auto`}
                  >
                    <step.icon className="w-10 h-10 text-white" />
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-4 text-center">{step.title}</h3>

                  <p className="text-gray-400 leading-relaxed text-center mb-6">{step.description}</p>

                  <div className="space-y-2">
                    {step.details.map((detail, detailIndex) => (
                      <motion.div
                        key={detailIndex}
                        initial={{ opacity: 0, x: -20 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.5, delay: index * 0.3 + detailIndex * 0.1 }}
                        className="flex items-center space-x-3"
                      >
                        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${step.color}`} />
                        <span className="text-gray-300 text-sm">{detail}</span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Arrow for desktop */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute -right-6 top-1/2 transform -translate-y-1/2">
                      <ArrowRight className="w-8 h-8 text-purple-400" />
                    </div>
                  )}

                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${step.color} opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity duration-300`}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Implementation Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-20 text-center"
        >
          <div className="bg-gradient-to-r from-blue-500/10 to-red-500/10 border border-purple-500/20 rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-6">Implementation Timeline</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                  Week 1
                </div>
                <div className="text-gray-300">Setup & Integration</div>
              </div>
              <div>
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                  Week 2-3
                </div>
                <div className="text-gray-300">AI Training & Calibration</div>
              </div>
              <div>
                <div className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-red-400 bg-clip-text text-transparent mb-2">
                  Week 4+
                </div>
                <div className="text-gray-300">Full Optimization</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
