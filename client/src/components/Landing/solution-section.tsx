"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { Brain, Shield, Zap, Target } from "lucide-react"

export default function SolutionSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Intelligence",
      description:
        "Advanced machine learning algorithms analyze customer behavior, inventory patterns, and operational data in real-time.",
      color: "from-purple-500 to-blue-500",
    },
    {
      icon: Shield,
      title: "Privacy-First Design",
      description:
        "Anonymous data processing ensures customer privacy while delivering powerful insights and optimizations.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Zap,
      title: "Real-Time Optimization",
      description: "Instant recommendations and automated adjustments keep your store running at peak efficiency 24/7.",
      color: "from-cyan-500 to-green-500",
    },
    {
      icon: Target,
      title: "Existing Infrastructure",
      description: "Seamlessly integrates with your current systems - no expensive hardware replacements required.",
      color: "from-green-500 to-purple-500",
    },
  ]

  return (
    <section id="solution" className="py-20 bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            The Axios Solution
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Transform your retail operations with intelligent, privacy-compliant AI that works with your existing
            infrastructure to deliver immediate results.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="group"
            >
              <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 h-full hover:border-purple-500/50 transition-all duration-300 group-hover:scale-105">
                <div
                  className={`w-16 h-16 rounded-full bg-gradient-to-r ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className="w-8 h-8 text-white" />
                </div>

                <h3 className="text-2xl font-semibold text-white mb-4">{feature.title}</h3>

                <p className="text-gray-400 leading-relaxed text-lg">{feature.description}</p>

                <div
                  className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Value Proposition */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/20 rounded-2xl p-12 max-w-5xl mx-auto">
            <h3 className="text-3xl font-bold text-white mb-6">Why StoreOps AI is Different</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
                  No Hardware
                </div>
                <div className="text-gray-300">Required</div>
              </div>
              <div>
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                  24/7
                </div>
                <div className="text-gray-300">Optimization</div>
              </div>
              <div>
                <div className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent mb-2">
                  100%
                </div>
                <div className="text-gray-300">Privacy Safe</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
