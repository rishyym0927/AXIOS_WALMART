"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useState } from "react"
import { Layout, Package, Users, Route } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ModulesSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [activeModule, setActiveModule] = useState(0)

  const modules = [
    {
      icon: Layout,
      title: "Layout Engine",
      subtitle: "Optimize Store Design",
      description:
        "AI-powered layout optimization that analyzes customer flow patterns, dwell times, and purchase behaviors to recommend optimal product placement and store configurations.",
      features: [
        "Heat map analysis of customer movement",
        "Product placement optimization",
        "Traffic flow improvements",
        "Conversion zone identification",
      ],
      color: "from-purple-500 to-blue-500",
      bgColor: "from-purple-500/10 to-blue-500/10",
    },
    {
      icon: Package,
      title: "Inventory AI",
      subtitle: "Smart Stock Management",
      description:
        "Predictive inventory management that forecasts demand, prevents stockouts, and optimizes reorder points using advanced machine learning algorithms.",
      features: [
        "Demand forecasting with 95% accuracy",
        "Automated reorder recommendations",
        "Seasonal trend analysis",
        "Supplier performance optimization",
      ],
      color: "from-blue-500 to-cyan-500",
      bgColor: "from-blue-500/10 to-cyan-500/10",
    },
    {
      icon: Users,
      title: "Staffing Intelligence",
      subtitle: "Workforce Optimization",
      description:
        "Dynamic staffing recommendations based on predicted customer traffic, seasonal patterns, and operational requirements to maximize efficiency and customer service.",
      features: [
        "Traffic-based staff scheduling",
        "Skill-based task assignment",
        "Performance analytics",
        "Cost optimization strategies",
      ],
      color: "from-cyan-500 to-green-500",
      bgColor: "from-cyan-500/10 to-green-500/10",
    },
    {
      icon: Route,
      title: "Customer Journey",
      subtitle: "Experience Optimization",
      description:
        "Analyze and optimize the complete customer journey from entry to purchase, identifying friction points and opportunities for enhanced experiences.",
      features: [
        "Journey mapping and analysis",
        "Friction point identification",
        "Personalized experience recommendations",
        "Conversion optimization",
      ],
      color: "from-green-500 to-purple-500",
      bgColor: "from-green-500/10 to-purple-500/10",
    },
  ]

  const ModuleIcon = modules[activeModule].icon

  return (
    <section id="modules" className="py-20 bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-green-400 bg-clip-text text-transparent">
            Four AI Modules
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Comprehensive retail intelligence powered by four specialized AI modules working together to transform your
            store operations.
          </p>
        </motion.div>

        {/* Module Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {modules.map((module, index) => (
            <Button
              key={index}
              variant={activeModule === index ? "default" : "outline"}
              onClick={() => setActiveModule(index)}
              className={`${
                activeModule === index
                  ? `bg-gradient-to-r ${module.color} text-white`
                  : "bg-transparent border-gray-600 text-gray-300 hover:border-purple-500"
              } px-6 py-3 text-lg font-semibold transition-all duration-300`}
            >
              <module.icon className="w-5 h-5 mr-2" />
              {module.title}
            </Button>
          ))}
        </motion.div>

        {/* Active Module Display */}
        <motion.div
          key={activeModule}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`bg-gradient-to-r ${modules[activeModule].bgColor} border border-purple-500/20 rounded-3xl p-8 md:p-12`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div
                className={`w-20 h-20 rounded-full bg-gradient-to-r ${modules[activeModule].color} flex items-center justify-center mb-6`}
              >
                <ModuleIcon className="w-10 h-10 text-white" />
              </div>

              <h3 className="text-3xl md:text-4xl font-bold text-white mb-2">{modules[activeModule].title}</h3>

              <p
                className={`text-xl bg-gradient-to-r ${modules[activeModule].color} bg-clip-text text-transparent mb-6`}
              >
                {modules[activeModule].subtitle}
              </p>

              <p className="text-gray-300 text-lg leading-relaxed mb-8">{modules[activeModule].description}</p>

              <div className="space-y-3">
                {modules[activeModule].features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center space-x-3"
                  >
                    <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${modules[activeModule].color}`} />
                    <span className="text-gray-300">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="relative">
              {/* Visualization placeholder - would be replaced with actual 3D visualization */}
              <div className="aspect-square bg-gray-800/50 rounded-2xl border border-gray-700 flex items-center justify-center">
                <div
                  className={`w-32 h-32 rounded-full bg-gradient-to-r ${modules[activeModule].color} opacity-20 animate-pulse`}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <ModuleIcon
                    className={`w-16 h-16 bg-gradient-to-r ${modules[activeModule].color} bg-clip-text text-transparent`}
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Module Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-16"
        >
          {[
            { value: "4", label: "AI Modules" },
            { value: "24/7", label: "Monitoring" },
            { value: "95%", label: "Accuracy" },
            { value: "< 1s", label: "Response Time" },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-green-400 bg-clip-text text-transparent mb-2">
                {stat.value}
              </div>
              <div className="text-gray-400 text-lg">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
