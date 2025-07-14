'use client';

import React, { useState, useEffect } from 'react';
import { Zone, Shelf, Product } from '@/types';
import AxiosProductPlacementAI from '@/services/axiosProductPlacementAI';
import { Sparkles, TrendingUp, Target, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface ProductPlacementSuggestion {
  id: string;
  productId: string;
  productName: string;
  suggestedShelf: string;
  reason: string;
  expectedImprovement: string;
  confidence: number;
  priority: 'high' | 'medium' | 'low';
}

interface AutoPlacementResult {
  success: boolean;
  placements: ProductPlacementSuggestion[];
  analytics: {
    totalProducts: number;
    optimizedProducts: number;
    expectedRevenueIncrease: string;
    optimizationScore: number;
  };
  error?: string;
}

interface AxiosAutoPlacementProps {
  zone: Zone;
  shelves: Shelf[];
  products: Product[];
  onPlacementsGenerated?: (result: AutoPlacementResult) => void;
  autoGenerate?: boolean;
}

export default function AxiosAutoPlacement({
  zone,
  shelves,
  products,
  onPlacementsGenerated,
  autoGenerate = false
}: AxiosAutoPlacementProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<AutoPlacementResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const aiService = new AxiosProductPlacementAI();

  useEffect(() => {
    if (autoGenerate && products.length > 0 && shelves.length > 0) {
      generatePlacements();
    }
  }, [autoGenerate, products.length, shelves.length]);

  const generatePlacements = async () => {
    if (products.length === 0) {
      setError('No products available for placement optimization');
      return;
    }

    if (shelves.length === 0) {
      setError('No shelves available in this zone');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      console.log('🤖 Generating AI product placements for zone:', zone.name);
      const placementResult = await aiService.generateAutoProductPlacement(zone, shelves, products);
      
      setResult(placementResult);
      if (onPlacementsGenerated) {
        onPlacementsGenerated(placementResult);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate product placements';
      setError(errorMessage);
      console.error('Error generating placements:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 85) return 'text-green-600';
    if (confidence >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (isGenerating) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-center space-x-3">
          <Loader2 className="animate-spin text-blue-500" size={24} />
          <div>
            <h3 className="font-semibold text-gray-900">Generating AI Product Placements</h3>
            <p className="text-sm text-gray-600">Analyzing {products.length} products across {shelves.length} shelves...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertCircle className="text-red-500 mt-0.5" size={20} />
          <div>
            <h3 className="font-medium text-red-900">Error</h3>
            <p className="text-sm text-red-700">{error}</p>
            <button
              onClick={generatePlacements}
              className="mt-2 text-sm bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded-md transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
        <div className="text-center">
          <Sparkles className="mx-auto text-blue-500 mb-3" size={32} />
          <h3 className="font-semibold text-gray-900 mb-2">Axios AI Product Placement</h3>
          <p className="text-sm text-gray-600 mb-4">
            Get intelligent product placement recommendations powered by AI analytics
          </p>
          <button
            onClick={generatePlacements}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-md hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Generate AI Placements
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Analytics Overview */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Sparkles className="text-blue-500" size={24} />
            <h3 className="font-bold text-xl text-gray-900">AI Placement Analytics</h3>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <CheckCircle className="text-green-500" size={16} />
            Generated successfully
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 border border-blue-100">
            <div className="text-2xl font-bold text-blue-600">{result.analytics.totalProducts}</div>
            <div className="text-sm text-gray-600">Total Products</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-green-100">
            <div className="text-2xl font-bold text-green-600">{result.analytics.optimizedProducts}</div>
            <div className="text-sm text-gray-600">Optimized</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-purple-100">
            <div className="text-2xl font-bold text-purple-600">{result.analytics.expectedRevenueIncrease}</div>
            <div className="text-sm text-gray-600">Revenue Increase</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-orange-100">
            <div className="text-2xl font-bold text-orange-600">{result.analytics.optimizationScore}</div>
            <div className="text-sm text-gray-600">Optimization Score</div>
          </div>
        </div>
      </div>

      {/* Placement Recommendations */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg text-gray-900">AI Product Placement Recommendations</h3>
            <div className="flex items-center space-x-2">
              <TrendingUp className="text-green-500" size={16} />
              <span className="text-sm text-gray-600">{result.placements.length} recommendations</span>
            </div>
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {result.placements.map((placement, index) => (
            <div key={placement.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                      #{index + 1}
                    </div>
                    <h4 className="font-semibold text-gray-900">{placement.productName}</h4>
                    <div className={`text-xs font-medium px-2 py-1 rounded-full border ${getPriorityColor(placement.priority)}`}>
                      {placement.priority.charAt(0).toUpperCase() + placement.priority.slice(1)} Priority
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                      <div className="flex items-center space-x-1">
                        <Target size={14} />
                        <span>Suggested: {placement.suggestedShelf}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <TrendingUp size={14} />
                        <span>{placement.expectedImprovement}</span>
                      </div>
                      <div className={`font-medium ${getConfidenceColor(placement.confidence)}`}>
                        {placement.confidence}% confidence
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-gray-700 leading-relaxed">{placement.reason}</p>
                </div>

                <div className="ml-6 flex flex-col items-end space-y-2">
                  <div className="text-right">
                    <div className={`text-lg font-bold ${getConfidenceColor(placement.confidence)}`}>
                      {placement.confidence}%
                    </div>
                    <div className="text-xs text-gray-500">Confidence</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Powered by Axios AI Analytics Engine
            </div>
            <button
              onClick={generatePlacements}
              className="text-sm bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 py-1 rounded-md transition-colors"
            >
              Regenerate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
