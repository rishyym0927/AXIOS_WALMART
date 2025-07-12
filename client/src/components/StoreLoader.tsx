"use client"

import { useEffect, type ReactNode } from "react"
import { useStoreDesigner } from "@/store/useStoreDesigner"
import { Loader2, AlertCircle, RefreshCw } from "lucide-react"

interface StoreLoaderProps {
  children: ReactNode
}

export default function StoreLoader({ children }: StoreLoaderProps) {
  const { fetchStoreFromServer, isLoading, error } = useStoreDesigner()

  useEffect(() => {
    fetchStoreFromServer()
  }, [fetchStoreFromServer])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Store Data</h2>
          <p className="text-gray-600">Connecting to your store...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Connection Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchStoreFromServer}
            className="flex items-center gap-2 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors mx-auto"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
