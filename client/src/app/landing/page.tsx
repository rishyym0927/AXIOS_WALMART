"use client"

import { useEffect, useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import HeroSection from "@/components/Landing/hero-section"
import ProblemSection from "@/components/Landing/problem-section"
import SolutionSection from "@/components/Landing/solution-section"
import ModulesSection from "@/components/Landing/modules-section"
import HowItWorksSection from "@/components/Landing/how-it-works-section"
import PrivacySection from "@/components/Landing/privacy-section"
import ROISection from "@/components/Landing/roi-section"
import TeamSection from "@/components/Landing/team-section"
import ContactSection from "@/components/Landing/contact-section"
import Navigation from "@/components/Landing/navigation"
import { Toaster } from "@/components/ui/toaster"

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"])

  useEffect(() => {
    // Smooth scrolling
    const lenis = async () => {
      const { default: Lenis } = await import("@studio-freight/lenis")
      const lenis = new Lenis()

      function raf(time: number) {
        lenis.raf(time)
        requestAnimationFrame(raf)
      }

      requestAnimationFrame(raf)
    }

    lenis()
  }, [])

  return (
    <div ref={containerRef} className="relative bg-black text-white overflow-x-hidden">
      {/* Animated Background */}
      <motion.div className="fixed inset-0 z-0" style={{ y: backgroundY }}>
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-blue-900/10 to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-500/10 via-transparent to-transparent" />
      </motion.div>

      <Navigation />

      <main className="relative z-10">
        <HeroSection />
        <ProblemSection />
        <SolutionSection />
        <ModulesSection />
        <HowItWorksSection />
        <PrivacySection />
        <ROISection />
        <TeamSection />
        <ContactSection />
      </main>

      <Toaster />
    </div>
  )
}
