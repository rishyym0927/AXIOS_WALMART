"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { Shield, Lock, Eye, UserCheck } from "lucide-react"

export default function PrivacySection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const privacyFeatures = [
    {
      icon: Shield,
      title: "Anonymous Data Processing",
      description:
        "All customer data is anonymized at the point of collection, ensuring individual privacy while maintaining analytical value.",
      color: "from-green-500 to-blue-500",
    },
    {
      icon: Lock,
      title: "End-to-End Encryption",
      description: "Data is encrypted in transit and at rest using industry-standard AES-256 encryption protocols.",
      color: "from-blue-500 to-purple-500",
    },
    {
      icon: Eye,
      title: "No Personal Identification",
      description:
        "Our system analyzes patterns and behaviors without storing or processing personally identifiable information.",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: UserCheck,
      title: "GDPR & CCPA Compliant",
      description:
        "Fully compliant with global privacy regulations including GDPR, CCPA, and other data protection laws.",
      color: "from-pink-500 to-green-500",
    },
  ]

  return (
    <section id="privacy" className="py-20 bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
            Privacy by Design
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Your customers' privacy is our priority. StoreOps AI delivers powerful insights while maintaining the
            highest standards of data protection and anonymity.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {privacyFeatures.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="group"
            >
              <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 h-full hover:border-green-500/50 transition-all duration-300 group-hover:scale-105">
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

        {/* Privacy Commitment */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-3xl p-12 max-w-5xl mx-auto">
            <h3 className="text-3xl font-bold text-white mb-6">Our Privacy Commitment</h3>
            <p className="text-gray-300 text-lg leading-relaxed mb-8">
              We believe that powerful AI insights and customer privacy are not mutually exclusive. StoreOps AI proves
              that you can have both - delivering exceptional business value while respecting and protecting customer
              privacy at every step.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent mb-2">
                  0%
                </div>
                <div className="text-gray-300">Personal Data Stored</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                  100%
                </div>
                <div className="text-gray-300">Anonymous Processing</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-green-400 bg-clip-text text-transparent mb-2">
                  24/7
                </div>
                <div className="text-gray-300">Data Protection</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Technical Details */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-16"
        >
          <div className="bg-gray-800/20 border border-gray-700 rounded-2xl p-8">
            <h4 className="text-2xl font-bold text-white mb-6 text-center">Technical Privacy Implementation</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                "Data Anonymization at Source",
                "Zero-Knowledge Architecture",
                "Differential Privacy Techniques",
                "Secure Multi-Party Computation",
              ].map((tech, index) => (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-gray-300 text-sm">{tech}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
