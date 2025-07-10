'use client';

import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import AIAssistant from '@/components/AIAssistant';
import DemoHelp from '@/components/DemoHelp';

// Dynamically import LayoutCanvas to avoid SSR issues with Three.js
const LayoutCanvas = dynamic(() => import('@/components/LayoutCanvas/LayoutCanvas'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
      <div className="text-gray-500">Loading 3D Canvas...</div>
    </div>
  ),
});

export default function Home() {
  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Navbar */}
      <Navbar />
      
      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar />
        
        {/* Main Canvas Area */}
        <div className="flex-1 p-6">
          <LayoutCanvas />
        </div>
        
        {/* Right AI Assistant Panel */}
        <div className="w-80 p-6">
          <AIAssistant />
        </div>
      </div>
      
      {/* Demo Help */}
      <DemoHelp />
    </div>
  );
}
