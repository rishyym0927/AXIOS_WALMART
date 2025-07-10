"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { Github, Linkedin, Mail, Award } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function TeamSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const team = [
    {
      name: "Alex Chen",
      role: "AI/ML Engineer",
      bio: "Former Google AI researcher with 8+ years in computer vision and retail analytics.",
      image: "/placeholder.svg?height=300&width=300",
      skills: ["Machine Learning", "Computer Vision", "Python", "TensorFlow"],
      social: {
        github: "#",
        linkedin: "#",
        email: "alex@storeops.ai",
      },
    },
    {
      name: "Sarah Johnson",
      role: "Full-Stack Developer",
      bio: "Senior developer with expertise in React, Node.js, and scalable cloud architectures.",
      image: "/placeholder.svg?height=300&width=300",
      skills: ["React", "Node.js", "AWS", "TypeScript"],
      social: {
        github: "#",
        linkedin: "#",
        email: "sarah@storeops.ai",
      },
    },
    {
      name: "Marcus Rodriguez",
      role: "Retail Operations Expert",
      bio: "15+ years in retail management and operations optimization at Fortune 500 companies.",
      image: "/placeholder.svg?height=300&width=300",
      skills: ["Retail Operations", "Business Strategy", "Data Analytics", "Process Optimization"],
      social: {
        github: "#",
        linkedin: "#",
        email: "marcus@storeops.ai",
      },
    },
  ]

  const achievements = [
    {
      icon: Award,
      title: "AI Innovation Award",
      description: "Winner of the 2023 Retail Tech Innovation Challenge",
      color: "from-yellow-500 to-orange-500",
    },
    {
      icon: Award,
      title: "Privacy Excellence",
      description: "Certified by Privacy Engineering Institute",
      color: "from-green-500 to-blue-500",
    },
    {
      icon: Award,
      title: "Startup of the Year",
      description: "Finalist in TechCrunch Disrupt 2023",
      color: "from-purple-500 to-pink-500",
    },
  ]

  return (
    <section id="team" className="py-20 bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Meet the Team
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            A diverse team of AI experts, developers, and retail professionals united by the vision of transforming
            retail through intelligent technology.
          </p>
        </motion.div>

        {/* Team Members */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {team.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="group"
            >
              <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 h-full hover:border-purple-500/50 transition-all duration-300 group-hover:scale-105">
                <div className="relative mb-6">
                  <img
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-purple-500/20 group-hover:border-purple-500/50 transition-colors duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                <h3 className="text-2xl font-bold text-white mb-2 text-center">{member.name}</h3>

                <p className="text-purple-400 text-lg font-semibold mb-4 text-center">{member.role}</p>

                <p className="text-gray-400 leading-relaxed mb-6 text-center">{member.bio}</p>

                {/* Skills */}
                <div className="flex flex-wrap gap-2 mb-6 justify-center">
                  {member.skills.map((skill, skillIndex) => (
                    <span key={skillIndex} className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Social Links */}
                <div className="flex justify-center space-x-4">
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                    <Github className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                    <Linkedin className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                    <Mail className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mb-16"
        >
          <h3 className="text-3xl font-bold text-white mb-8 text-center">Recognition & Achievements</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 text-center hover:border-purple-500/50 transition-all duration-300"
              >
                <div
                  className={`w-16 h-16 rounded-full bg-gradient-to-r ${achievement.color} flex items-center justify-center mb-4 mx-auto`}
                >
                  <achievement.icon className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-xl font-bold text-white mb-2">{achievement.title}</h4>
                <p className="text-gray-400">{achievement.description}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Tech Stack */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-6">Built with Cutting-Edge Technology</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {[
                "React",
                "Node.js",
                "Python",
                "TensorFlow",
                "AWS",
                "Docker",
                "PostgreSQL",
                "Redis",
                "Kubernetes",
                "GraphQL",
                "TypeScript",
                "Three.js",
              ].map((tech, index) => (
                <div
                  key={index}
                  className="bg-gray-800/50 rounded-lg p-3 text-gray-300 hover:text-white hover:bg-gray-700/50 transition-all duration-300"
                >
                  {tech}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
