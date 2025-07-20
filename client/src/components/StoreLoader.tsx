"use client"

import { useEffect, useState, type ReactNode } from "react"
import { useStoreDesigner } from "@/store/useStoreDesigner"
import { Loader2, AlertCircle, RefreshCw, Server, Database, Wifi } from "lucide-react"

interface StoreLoaderProps {
  children: ReactNode
}

export default function StoreLoader({ children }: StoreLoaderProps) {
  const { fetchStoreFromServer, isLoading, error } = useStoreDesigner()
  const [loadingStep, setLoadingStep] = useState(0)
  const [loadingMessage, setLoadingMessage] = useState("Initializing connection...")

  const loadingSteps = [
    { icon: Wifi, message: "Connecting to backend server...", duration: 2000 },
    { icon: Server, message: "Starting backend services...", duration: 3000 },
    { icon: Database, message: "Loading store data...", duration: 2000 },
    { icon: Loader2, message: "Finalizing setup...", duration: 1000 }
  ]

  useEffect(() => {
    fetchStoreFromServer()
    
    // Simulate loading steps for better UX
    const stepInterval = setInterval(() => {
      setLoadingStep(prev => {
        const nextStep = (prev + 1) % loadingSteps.length
        setLoadingMessage(loadingSteps[nextStep].message)
        return nextStep
      })
    }, 2500)

    return () => clearInterval(stepInterval)
  }, [fetchStoreFromServer])

  if (isLoading) {
    const CurrentIcon = loadingSteps[loadingStep].icon

    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md mx-auto">
          {/* Animated background circles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-100 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-blue-100 rounded-full opacity-20 animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 right-1/3 w-32 h-32 bg-purple-100 rounded-full opacity-20 animate-pulse delay-500"></div>
          </div>
          
          {/* Main loading content */}
          <div className="relative z-10">
            {/* Icon container with pulsing animation */}
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg transform transition-all duration-500 hover:scale-105">
              <CurrentIcon className={`w-8 h-8 text-white ${CurrentIcon === Loader2 ? 'animate-spin' : 'animate-bounce'}`} />
            </div>
            
            {/* Loading progress bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 mb-6 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-indigo-500 to-blue-600 h-2 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${((loadingStep + 1) / loadingSteps.length) * 100}%` }}
              ></div>
            </div>
            
            {/* Dynamic loading text */}
            <h2 className="text-2xl font-bold text-gray-900 mb-3 animate-fade-in">
              Setting Up Your Store
            </h2>
            <p className="text-gray-600 mb-4 animate-fade-in delay-200">
              {loadingMessage}
            </p>
            
            {/* Backend info */}
            <div className="bg-white/70 backdrop-blur-sm border border-indigo-100 rounded-xl p-4 mt-6 shadow-sm">
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                <Server className="w-4 h-4 text-indigo-500" />
                <span>Backend is warming up - this may take a moment on first load</span>
              </div>
              <div className="flex justify-center gap-1 mt-3">
                {Array.from({ length: 4 }, (_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      i <= loadingStep ? 'bg-indigo-500' : 'bg-gray-300'
                    }`}
                    style={{ animationDelay: `${i * 200}ms` }}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md mx-auto">
          {/* Animated error background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-red-100 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-orange-100 rounded-full opacity-20 animate-pulse delay-1000"></div>
          </div>
          
          <div className="relative z-10 bg-white/80 backdrop-blur-sm border border-red-100 rounded-2xl p-8 shadow-lg">
            {/* Error icon with shake animation */}
            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg animate-shake">
              <AlertCircle className="w-8 h-8 text-white" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Connection Error</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">{error}</p>
            
            {/* Backend troubleshooting info */}
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-left">
              <h3 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
                <Server className="w-4 h-4" />
                Troubleshooting Tips:
              </h3>
              <ul className="text-sm text-red-700 space-y-1">
                <li>• Ensure the backend server is running</li>
                <li>• Check if the server is starting up (may take 30-60 seconds)</li>
                <li>• Verify your network connection</li>
                <li>• Try refreshing the page</li>
              </ul>
            </div>
            
            <button
              onClick={fetchStoreFromServer}
              className="group flex items-center gap-3 bg-gradient-to-r from-red-600 to-orange-600 text-white px-8 py-3 rounded-xl hover:from-red-700 hover:to-orange-700 transition-all duration-300 mx-auto shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
              Retry Connection
            </button>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
