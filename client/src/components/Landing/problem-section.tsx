"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { AlertTriangle, TrendingDown, Users, Package } from "lucide-react"

export default function ProblemSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const problems = [
    {
      icon: Users,
      stat: "73%",
      title: "Customer Frustration",
      description: "of customers can't find products they're looking for",
      color: "from-red-500 to-orange-500",
    },
    {
      icon: Package,
      stat: "15%",
      title: "Stockout Rate",
      description: "average stockout rate across retail stores",
      color: "from-orange-500 to-yellow-500",
    },
    {
      icon: TrendingDown,
      stat: "$1.1T",
      title: "Lost Revenue",
      description: "annual revenue lost due to poor inventory management",
      color: "from-yellow-500 to-red-500",
    },
    {
      icon: AlertTriangle,
      stat: "40%",
      title: "Inefficient Operations",
      description: "of staff time wasted on manual inventory tasks",
      color: "from-red-500 to-pink-500",
    },
  ]

  return (
    <section id="problem" className="py-20 bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
            The Retail Crisis
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Traditional retail is broken. Stores are losing customers, revenue, and competitive edge due to outdated
            operations and lack of real-time intelligence.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {problems.map((problem, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="relative group"
            >
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 h-full hover:border-purple-500/50 transition-all duration-300 group-hover:scale-105">
                <div
                  className={`w-16 h-16 rounded-full bg-gradient-to-r ${problem.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <problem.icon className="w-8 h-8 text-white" />
                </div>

                <div
                  className={`text-5xl font-bold mb-4 bg-gradient-to-r ${problem.color} bg-clip-text text-transparent`}
                >
                  {problem.stat}
                </div>

                <h3 className="text-xl font-semibold text-white mb-3">{problem.title}</h3>

                <p className="text-gray-400 leading-relaxed">{problem.description}</p>

                {/* Animated background effect */}
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${problem.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}
                />
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1 }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">The Cost of Inaction</h3>
            <p className="text-gray-300 text-lg">
              Every day without intelligent retail optimization costs stores thousands in lost revenue, frustrated
              customers, and operational inefficiencies. The time for change is now.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
