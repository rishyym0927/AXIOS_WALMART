'use client';

import React, { useState, useEffect } from 'react';
import { Zone, Shelf } from '@/types';
import { useShelfStore } from '@/store/useShelfStore';
import ShelfAISuggestions from './ShelfAISuggestions';
import { Bot, Sparkles, Target, Zap } from 'lucide-react';

interface ShelfAIDemoProps {
  zone: Zone;
  onClose?: () => void;
}

export default function ShelfAIDemo({ zone, onClose }: ShelfAIDemoProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const { shelves, addShelf, deleteShelf, loadShelvesForZone } = useShelfStore();

  const demoSteps = [
    {
      title: "Welcome to AI Shelf Optimizer",
      description: "Let me show you how AI can revolutionize your shelf layout optimization.",
      icon: <Bot className="w-8 h-8 text-blue-600" />,
      action: null
    },
    {
      title: "Analyzing Your Zone",
      description: `Analyzing "${zone.name}" (${zone.width}m × ${zone.height}m) for optimal shelf placement...`,
      icon: <Target className="w-8 h-8 text-purple-600" />,
      action: () => {
        // Clear existing shelves for demo
        const currentShelves = shelves.filter(s => s.zoneId === zone.id);
        currentShelves.forEach(shelf => deleteShelf(shelf.id));
      }
    },
    {
      title: "AI Generating Solutions",
      description: "Our AI is creating multiple layout strategies based on retail best practices, customer flow patterns, and space optimization algorithms.",
      icon: <Sparkles className="w-8 h-8 text-yellow-600" />,
      action: null
    },
    {
      title: "Ready for Optimization!",
      description: "AI has analyzed your zone and is ready to provide intelligent shelf layout suggestions. Click below to see the magic happen!",
      icon: <Zap className="w-8 h-8 text-green-600" />,
      action: null
    }
  ];

  const [showAISuggestions, setShowAISuggestions] = useState(false);

  useEffect(() => {
    if (isPlaying && currentStep < demoSteps.length - 1) {
      const timer = setTimeout(() => {
        const step = demoSteps[currentStep];
        if (step.action) {
          step.action();
        }
        setCurrentStep(prev => prev + 1);
      }, 2500);

      return () => clearTimeout(timer);
    } else if (isPlaying && currentStep === demoSteps.length - 1) {
      setIsPlaying(false);
    }
  }, [currentStep, isPlaying]);

  const startDemo = () => {
    setCurrentStep(0);
    setIsPlaying(true);
  };

  const skipToOptimizer = () => {
    setIsPlaying(false);
    setCurrentStep(demoSteps.length - 1);
    setShowAISuggestions(true);
  };

  if (showAISuggestions) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-auto">
          <ShelfAISuggestions
            zone={zone}
            onClose={() => {
              setShowAISuggestions(false);
              if (onClose) onClose();
            }}
          />
        </div>
      </div>
    );
  }

  const currentStepData = demoSteps[currentStep];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full p-8 text-center">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-center mb-4">
            {currentStepData.icon}
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {currentStepData.title}
          </h2>
          <p className="text-gray-600 leading-relaxed">
            {currentStepData.description}
          </p>
        </div>

        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex justify-center space-x-2 mb-3">
            {demoSteps.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-all ${
                  index <= currentStep
                    ? 'bg-blue-600'
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-gray-500">
            Step {currentStep + 1} of {demoSteps.length}
          </p>
        </div>

        {/* Loading animation when playing */}
        {isPlaying && currentStep < demoSteps.length - 1 && (
          <div className="mb-8">
            <div className="inline-flex items-center gap-3 text-blue-600">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="text-sm font-medium">Processing...</span>
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {!isPlaying && currentStep === 0 && (
            <>
              <button
                onClick={startDemo}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-medium flex items-center justify-center gap-2"
              >
                <Bot size={20} />
                Start AI Demo
              </button>
              <button
                onClick={skipToOptimizer}
                className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-all font-medium"
              >
                Skip to Optimizer
              </button>
            </>
          )}

          {!isPlaying && currentStep === demoSteps.length - 1 && (
            <button
              onClick={() => setShowAISuggestions(true)}
              className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-8 py-3 rounded-lg hover:from-green-700 hover:to-blue-700 transition-all font-medium flex items-center justify-center gap-2 text-lg"
            >
              <Sparkles size={20} />
              Launch AI Optimizer
            </button>
          )}

          {(isPlaying || currentStep > 0) && (
            <button
              onClick={() => {
                setIsPlaying(false);
                if (onClose) onClose();
              }}
              className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-all font-medium"
            >
              Close Demo
            </button>
          )}
        </div>

        {/* Zone info */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-center gap-3 text-sm text-gray-600">
            <div
              className="w-4 h-4 rounded border"
              style={{ backgroundColor: zone.color }}
            />
            <span>
              Optimizing: <strong>{zone.name}</strong> ({zone.width}m × {zone.height}m)
            </span>
          </div>
        </div>

        {/* Features preview */}
        {currentStep === demoSteps.length - 1 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">Smart Layouts</h4>
              <p className="text-sm text-blue-800">AI generates multiple layout strategies optimized for different goals</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <h4 className="font-semibold text-purple-900 mb-2">Space Optimization</h4>
              <p className="text-sm text-purple-800">Maximize space utilization while maintaining accessibility</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="font-semibold text-green-900 mb-2">Category Intelligence</h4>
              <p className="text-sm text-green-800">Intelligent shelf categorization based on zone type and retail best practices</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
