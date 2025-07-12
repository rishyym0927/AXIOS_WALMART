'use client';

import React, { useState } from 'react';
import { HelpCircle, X, Package, Grid, MousePointerClick } from 'lucide-react';

export default function DemoHelp() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Help Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-40"
        title="Show demo instructions"
      >
        <HelpCircle size={24} />
      </button>

      {/* Help Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-semibold">🚀 Shelf Analyser Demo Guide</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">✨ What is the Shelf Analyser?</h3>
                <p className="text-blue-800 text-sm">
                  The Shelf Analyser allows you to design product layouts within individual shelves. 
                  You can place products, see revenue metrics, and optimize shelf utilization in real-time.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">📍 How to Access:</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <MousePointerClick className="w-5 h-5 text-green-600" />
                      <h4 className="font-medium">Method 1: Double-Click</h4>
                    </div>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>1. Go to any zone (click on a zone)</li>
                      <li>2. Click a shelf to select it</li>
                      <li>4. Shelf analyser opens in new page</li>
                    </ul>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Package className="w-5 h-5 text-green-600" />
                      <h4 className="font-medium">Method 2: Package Button</h4>
                    </div>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>1. Go to any zone (click on a zone)</li>
                      <li>2. Find a shelf in the left panel</li>
                      <li>3. Click the green package icon</li>
                      <li>4. Shelf analyser opens in new page</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">🎯 In the Shelf Analyser:</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <Grid className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span><strong>View shelf layout:</strong> See the 2D grid of available slots</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Package className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span><strong>Place products:</strong> Drag from right panel or click to select then click slot</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <MousePointerClick className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                      <span><strong>Remove products:</strong> Click the minus button on placed products</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-4 h-4 bg-yellow-500 rounded mt-0.5 flex-shrink-0" />
                      <span><strong>Track metrics:</strong> See real-time utilization and revenue calculations</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-900 mb-2">🎉 Try It Now!</h3>
                <ol className="text-green-800 text-sm space-y-1">
                  <li>1. Close this help dialog</li>
                  <li>2. Click on any zone to enter Zone Analyser</li>
                  <li>4. Start placing products and see the magic!</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
