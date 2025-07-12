'use client';

import React, { useState } from 'react';
import { 
  Layout, 
  BarChart3, 
  Sparkles, 
  MousePointer, 
  Move3D, 
  Zap, 
  Target, 
  Package, 
  Grid3X3, 
  ArrowLeft,
  Play,
  ChevronRight,
  ChevronDown,
  Eye,
  Settings,
  Brain,
  DollarSign,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Plus,
  Edit,
  Trash2,
  RotateCcw,
  Search,
  Palette,
  Maximize2,
  Monitor,
  Box,
  Users,
  Clock,
  Shield,
  Heart,
  HelpCircle
} from 'lucide-react';
import Link from 'next/link';

export default function HelpPage() {
  const [activeSection, setActiveSection] = useState('getting-started');
  const [expandedCards, setExpandedCards] = useState<string[]>([]);

  const toggleCard = (cardId: string) => {
    setExpandedCards(prev => 
      prev.includes(cardId) 
        ? prev.filter(id => id !== cardId)
        : [...prev, cardId]
    );
  };

  const sections = [
    { id: 'getting-started', label: 'Getting Started', icon: Play },
    { id: 'layout-designer', label: 'Layout Designer', icon: Layout },
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'zone-analysis', label: 'Zone Analysis', icon: Target },
    { id: 'ai-features', label: 'AI Features', icon: Brain },
    { id: 'tips-tricks', label: 'Tips & Tricks', icon: Sparkles },
  ];

  const features = [
    {
      id: 'drag-drop',
      title: 'Drag & Drop Zones',
      description: 'Easily move zones around your store layout',
      icon: MousePointer,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: '3d-view',
      title: '3D Visualization',
      description: 'View your store in stunning 3D perspective',
      icon: Box,
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'ai-suggestions',
      title: 'AI Optimization',
      description: 'Get smart layout suggestions powered by AI',
      icon: Brain,
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'real-time',
      title: 'Real-time Updates',
      description: 'See changes instantly across the interface',
      icon: Zap,
      color: 'from-orange-500 to-red-500'
    }
  ];

  const quickActions = [
    { label: 'Create New Zone', keys: ['Click', 'Add Zone'], color: 'bg-blue-500' },
    { label: 'Switch to 3D View', keys: ['Toggle', '3D Mode'], color: 'bg-purple-500' },
    { label: 'Generate AI Suggestions', keys: ['AI', 'Generate'], color: 'bg-green-500' },
    { label: 'Export Layout', keys: ['Menu', 'Export'], color: 'bg-orange-500' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <HelpCircle className="w-5 h-5 text-white" />
              <span className="text-white font-medium">Help Center</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Master Your Store Layout
              <span className="block text-2xl md:text-3xl font-normal text-white/80 mt-2">
                🏪 Design • Optimize • Succeed
              </span>
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Learn how to create amazing store layouts with our powerful AI-driven design tools. 
              From basic zone creation to advanced 3D visualization - we've got you covered!
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <Link href="/" className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center gap-2">
                <ArrowLeft size={18} />
                Back to Designer
              </Link>
              <button 
                onClick={() => setActiveSection('getting-started')}
                className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-lg font-medium hover:bg-white/30 transition-colors flex items-center gap-2"
              >
                <Play size={18} />
                Quick Start Guide
              </button>
            </div>
          </div>
        </div>
        
        {/* Floating Feature Cards */}
        <div className="absolute top-20 left-10 animate-bounce delay-1000">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-white">
            <Layout size={24} />
          </div>
        </div>
        <div className="absolute top-32 right-16 animate-bounce delay-2000">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-white">
            <Brain size={24} />
          </div>
        </div>
        <div className="absolute bottom-20 left-1/4 animate-bounce delay-3000">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-white">
            <Box size={24} />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Quick Features Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature) => (
            <div key={feature.id} className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r opacity-20 group-hover:opacity-30 transition-opacity rounded-2xl blur-xl" 
                   style={{ background: `linear-gradient(135deg, var(--tw-gradient-stops))` }}></div>
              <div className="relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group-hover:scale-105">
                <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Search size={18} />
                Quick Navigation
              </h3>
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center gap-3 ${
                      activeSection === section.id
                        ? 'bg-indigo-500 text-white shadow-lg'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <section.icon size={18} />
                    {section.label}
                  </button>
                ))}
              </nav>
              
              {/* Quick Actions */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">⚡ Quick Actions</h4>
                <div className="space-y-2">
                  {quickActions.map((action, index) => (
                    <div key={index} className="flex items-center gap-2 text-xs">
                      <div className={`w-2 h-2 rounded-full ${action.color}`}></div>
                      <span className="text-gray-600">{action.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="space-y-8">
              
              {/* Getting Started Section */}
              {activeSection === 'getting-started' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                        <Play className="w-5 h-5 text-white" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900">Getting Started</h2>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900">🎯 What You Can Do</h3>
                        <ul className="space-y-2 text-gray-700">
                          <li className="flex items-center gap-2">
                            <CheckCircle size={16} className="text-green-500" />
                            Design 2D/3D store layouts
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle size={16} className="text-green-500" />
                            Create and manage zones
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle size={16} className="text-green-500" />
                            Analyze zone performance
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle size={16} className="text-green-500" />
                            Get AI-powered suggestions
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle size={16} className="text-green-500" />
                            Track metrics and KPIs
                          </li>
                        </ul>
                      </div>
                      
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900">🚀 Quick Setup</h3>
                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                            <div>
                              <p className="font-medium text-gray-900">Set Store Dimensions</p>
                              <p className="text-sm text-gray-600">Configure your store's width and height</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                            <div>
                              <p className="font-medium text-gray-900">Add Zones</p>
                              <p className="text-sm text-gray-600">Create different areas like Grocery, Electronics</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                            <div>
                              <p className="font-medium text-gray-900">Optimize</p>
                              <p className="text-sm text-gray-600">Use AI suggestions to improve layout</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Layout Designer Section */}
              {activeSection === 'layout-designer' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                        <Layout className="w-5 h-5 text-white" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900">Layout Designer</h2>
                    </div>

                    {/* Interactive Cards */}
                    <div className="space-y-4">
                      {[
                        {
                          id: 'store-setup',
                          title: '🏪 Store Setup',
                          content: (
                            <div className="space-y-3">
                              <p className="text-gray-700">Configure your store's basic dimensions and properties.</p>
                              <div className="bg-gray-50 rounded-lg p-4">
                                <h4 className="font-medium text-gray-900 mb-2">Key Features:</h4>
                                <ul className="text-sm text-gray-700 space-y-1">
                                  <li>• Adjustable width and height (default: 30m × 20m)</li>
                                  <li>• Real-time area calculation</li>
                                  <li>• Grid-based positioning system</li>
                                  <li>• Zoom and pan controls</li>
                                </ul>
                              </div>
                              <div className="flex gap-2">
                                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">Width Control</span>
                                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">Height Control</span>
                              </div>
                            </div>
                          )
                        },
                        {
                          id: 'zone-management',
                          title: '🎯 Zone Management',
                          content: (
                            <div className="space-y-3">
                              <p className="text-gray-700">Create, edit, and organize different areas in your store.</p>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-green-50 rounded-lg p-4">
                                  <h4 className="font-medium text-green-900 mb-2">Zone Types:</h4>
                                  <ul className="text-sm text-green-700 space-y-1">
                                    <li>• Grocery</li>
                                    <li>• Electronics</li>
                                    <li>• Clothing</li>
                                    <li>• Cash Counter</li>
                                    <li>• Custom zones</li>
                                  </ul>
                                </div>
                                <div className="bg-blue-50 rounded-lg p-4">
                                  <h4 className="font-medium text-blue-900 mb-2">Zone Actions:</h4>
                                  <ul className="text-sm text-blue-700 space-y-1">
                                    <li>• Drag to move</li>
                                    <li>• Resize handles</li>
                                    <li>• Color customization</li>
                                    <li>• Delete/duplicate</li>
                                    <li>• Overlap detection</li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                          )
                        },
                        {
                          id: 'view-modes',
                          title: '👁️ View Modes',
                          content: (
                            <div className="space-y-3">
                              <p className="text-gray-700">Switch between different visualization modes for better design experience.</p>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-4 border border-indigo-200">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Monitor size={18} className="text-indigo-600" />
                                    <h4 className="font-medium text-indigo-900">2D Orthographic</h4>
                                  </div>
                                  <ul className="text-sm text-indigo-700 space-y-1">
                                    <li>• Top-down view</li>
                                    <li>• Precise measurements</li>
                                    <li>• Easy zone editing</li>
                                    <li>• Grid alignment</li>
                                  </ul>
                                </div>
                                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Box size={18} className="text-purple-600" />
                                    <h4 className="font-medium text-purple-900">3D Perspective</h4>
                                  </div>
                                  <ul className="text-sm text-purple-700 space-y-1">
                                    <li>• Immersive 3D view</li>
                                    <li>• Height visualization</li>
                                    <li>• Realistic perspective</li>
                                    <li>• Camera controls</li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                          )
                        }
                      ].map((card) => (
                        <div key={card.id} className="border border-gray-200 rounded-lg overflow-hidden">
                          <button
                            onClick={() => toggleCard(card.id)}
                            className="w-full px-6 py-4 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between"
                          >
                            <span className="font-medium text-gray-900">{card.title}</span>
                            {expandedCards.includes(card.id) ? 
                              <ChevronDown size={20} className="text-gray-500" /> : 
                              <ChevronRight size={20} className="text-gray-500" />
                            }
                          </button>
                          {expandedCards.includes(card.id) && (
                            <div className="px-6 py-4">
                              {card.content}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Dashboard Section */}
              {activeSection === 'dashboard' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                        <BarChart3 className="w-5 h-5 text-white" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900">Dashboard Analytics</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900">📊 Key Metrics</h3>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                              <Layout size={16} className="text-white" />
                            </div>
                            <div>
                              <p className="font-medium text-blue-900">Active Zones</p>
                              <p className="text-sm text-blue-700">Track number of zones in your layout</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                              <Target size={16} className="text-white" />
                            </div>
                            <div>
                              <p className="font-medium text-green-900">Space Utilization</p>
                              <p className="text-sm text-green-700">Percentage of store space being used</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                            <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                              <DollarSign size={16} className="text-white" />
                            </div>
                            <div>
                              <p className="font-medium text-purple-900">Revenue Estimate</p>
                              <p className="text-sm text-purple-700">Projected monthly revenue</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                              <TrendingUp size={16} className="text-white" />
                            </div>
                            <div>
                              <p className="font-medium text-orange-900">Efficiency Score</p>
                              <p className="text-sm text-orange-700">Overall layout performance rating</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900">📈 Performance Insights</h3>
                        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-4 border border-indigo-200">
                          <h4 className="font-medium text-indigo-900 mb-3">Real-time Analytics</h4>
                          <ul className="text-sm text-indigo-700 space-y-2">
                            <li className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              Live space utilization tracking
                            </li>
                            <li className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              Zone overlap detection
                            </li>
                            <li className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                              Revenue optimization insights
                            </li>
                            <li className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                              Performance trend analysis
                            </li>
                          </ul>
                        </div>
                        
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="font-medium text-gray-900 mb-2">💡 Pro Tips:</h4>
                          <ul className="text-sm text-gray-700 space-y-1">
                            <li>• Aim for 70-85% space utilization</li>
                            <li>• Monitor zone overlap warnings</li>
                            <li>• Check efficiency scores regularly</li>
                            <li>• Use AI suggestions to improve metrics</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Zone Analysis Section */}
              {activeSection === 'zone-analysis' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl flex items-center justify-center">
                        <Target className="w-5 h-5 text-white" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900">Zone Analysis</h2>
                    </div>

                    <div className="space-y-6">
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
                        <h3 className="text-lg font-semibold text-green-900 mb-3">🎯 Deep Dive Into Your Zones</h3>
                        <p className="text-green-800 mb-4">
                          Click on any zone in your layout to access detailed analysis, shelf management, 
                          and optimization tools specifically designed for that area.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-medium text-green-900 mb-2">Zone Features:</h4>
                            <ul className="text-sm text-green-700 space-y-1">
                              <li>• Individual zone metrics</li>
                              <li>• Shelf layout management</li>
                              <li>• Product category organization</li>
                              <li>• Performance analytics</li>
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-medium text-green-900 mb-2">Shelf Management:</h4>
                            <ul className="text-sm text-green-700 space-y-1">
                              <li>• Add/edit/remove shelves</li>
                              <li>• Drag & drop positioning</li>
                              <li>• Category-based organization</li>
                              <li>• Space optimization</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                          <div className="flex items-center gap-2 mb-3">
                            <Package size={18} className="text-blue-600" />
                            <h4 className="font-medium text-blue-900">Shelf Canvas</h4>
                          </div>
                          <p className="text-sm text-blue-700">Interactive 2D/3D shelf designer with real-time positioning and resizing capabilities.</p>
                        </div>
                        <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                          <div className="flex items-center gap-2 mb-3">
                            <Grid3X3 size={18} className="text-purple-600" />
                            <h4 className="font-medium text-purple-900">Grid System</h4>
                          </div>
                          <p className="text-sm text-purple-700">Automatic grid alignment and uniform shelf distribution for optimal space usage.</p>
                        </div>
                        <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                          <div className="flex items-center gap-2 mb-3">
                            <BarChart3 size={18} className="text-orange-600" />
                            <h4 className="font-medium text-orange-900">Analytics</h4>
                          </div>
                          <p className="text-sm text-orange-700">Detailed metrics including utilization, overlap detection, and efficiency scoring.</p>
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">🚀 Getting Started with Zone Analysis</h3>
                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-indigo-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                            <div>
                              <p className="font-medium text-gray-900">Select a Zone</p>
                              <p className="text-sm text-gray-600">Click on any zone in your main layout or use the "Analyse" button in the sidebar</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-indigo-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                            <div>
                              <p className="font-medium text-gray-900">Design Shelf Layout</p>
                              <p className="text-sm text-gray-600">Add shelves, position them optimally, and organize by product categories</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-indigo-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                            <div>
                              <p className="font-medium text-gray-900">Optimize & Analyze</p>
                              <p className="text-sm text-gray-600">Use metrics and AI suggestions to improve shelf placement and maximize efficiency</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* AI Features Section */}
              {activeSection === 'ai-features' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-gradient-to-r from-violet-500 to-purple-500 rounded-xl flex items-center justify-center">
                        <Brain className="w-5 h-5 text-white" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900">AI-Powered Features</h2>
                    </div>

                    <div className="space-y-6">
                      <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-lg p-6 border border-violet-200">
                        <h3 className="text-lg font-semibold text-violet-900 mb-3">🧠 Smart Layout Optimization</h3>
                        <p className="text-violet-800 mb-4">
                          Our AI assistant analyzes your store layout and provides intelligent suggestions 
                          to maximize space utilization, improve customer flow, and boost revenue potential.
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-xs font-medium">Google Gemini AI</span>
                          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">Layout Analysis</span>
                          <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">Smart Suggestions</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-gray-900">🎯 AI Capabilities</h3>
                          <div className="space-y-3">
                            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                              <div className="w-6 h-6 bg-blue-500 rounded-lg flex items-center justify-center mt-0.5">
                                <Zap size={12} className="text-white" />
                              </div>
                              <div>
                                <p className="font-medium text-blue-900">Layout Optimization</p>
                                <p className="text-sm text-blue-700">AI analyzes your current layout and suggests improvements for better space utilization</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                              <div className="w-6 h-6 bg-green-500 rounded-lg flex items-center justify-center mt-0.5">
                                <Target size={12} className="text-white" />
                              </div>
                              <div>
                                <p className="font-medium text-green-900">Zone Placement</p>
                                <p className="text-sm text-green-700">Smart recommendations for optimal zone positioning based on retail best practices</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                              <div className="w-6 h-6 bg-purple-500 rounded-lg flex items-center justify-center mt-0.5">
                                <TrendingUp size={12} className="text-white" />
                              </div>
                              <div>
                                <p className="font-medium text-purple-900">Performance Insights</p>
                                <p className="text-sm text-purple-700">AI-driven analytics to identify bottlenecks and optimization opportunities</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-gray-900">⚡ How to Use AI</h3>
                          <div className="bg-gray-50 rounded-lg p-4">
                            <div className="space-y-3">
                              <div className="flex items-center gap-3">
                                <div className="w-6 h-6 bg-indigo-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                                <span className="text-sm text-gray-700">Click the "Generate AI Suggestions" button in the right panel</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="w-6 h-6 bg-indigo-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                                <span className="text-sm text-gray-700">AI analyzes your current layout and generates optimized alternatives</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="w-6 h-6 bg-indigo-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                                <span className="text-sm text-gray-700">Review suggestions and apply the ones that work best for your store</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                            <div className="flex items-start gap-2">
                              <AlertCircle size={18} className="text-amber-600 mt-0.5" />
                              <div>
                                <h4 className="font-medium text-amber-900">Pro Tip</h4>
                                <p className="text-sm text-amber-700">
                                  AI suggestions work best when you have at least 2-3 zones in your layout. 
                                  The more complex your layout, the more valuable the AI insights become!
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tips & Tricks Section */}
              {activeSection === 'tips-tricks' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-white" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900">Tips & Tricks</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900">🏆 Best Practices</h3>
                        <div className="space-y-3">
                          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <h4 className="font-medium text-green-900 mb-2">✅ Layout Design</h4>
                            <ul className="text-sm text-green-700 space-y-1">
                              <li>• Keep pathways at least 1.5m wide</li>
                              <li>• Place high-traffic zones near entrance</li>
                              <li>• Use 3D view to check sight lines</li>
                              <li>• Maintain consistent zone spacing</li>
                            </ul>
                          </div>
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h4 className="font-medium text-blue-900 mb-2">🎯 Zone Optimization</h4>
                            <ul className="text-sm text-blue-700 space-y-1">
                              <li>• Group related categories together</li>
                              <li>• Keep cash counters accessible</li>
                              <li>• Use corner spaces efficiently</li>
                              <li>• Monitor space utilization metrics</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900">⚡ Power User Tips</h3>
                        <div className="space-y-3">
                          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                            <h4 className="font-medium text-purple-900 mb-2">🚀 Keyboard Shortcuts</h4>
                            <div className="space-y-2 text-sm text-purple-700">
                              <div className="flex justify-between">
                                <span>Switch views</span>
                                <span className="font-mono bg-purple-100 px-2 py-1 rounded">Toggle 3D</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Delete zone</span>
                                <span className="font-mono bg-purple-100 px-2 py-1 rounded">Delete key</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Duplicate zone</span>
                                <span className="font-mono bg-purple-100 px-2 py-1 rounded">Ctrl + D</span>
                              </div>
                            </div>
                          </div>
                          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                            <h4 className="font-medium text-orange-900 mb-2">🎨 Visual Tips</h4>
                            <ul className="text-sm text-orange-700 space-y-1">
                              <li>• Use distinct colors for different zone types</li>
                              <li>• Switch to 3D for presentations</li>
                              <li>• Check overlap warnings regularly</li>
                              <li>• Use grid alignment for clean layouts</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-200">
                      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6 border border-indigo-200">
                        <h3 className="text-lg font-semibold text-indigo-900 mb-4">🎯 Common Workflows</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-white rounded-lg p-4 border border-indigo-100">
                            <h4 className="font-medium text-indigo-900 mb-2">New Store Setup</h4>
                            <ol className="text-sm text-indigo-700 space-y-1">
                              <li>1. Set store dimensions</li>
                              <li>2. Add main zones</li>
                              <li>3. Position & resize</li>
                              <li>4. Get AI suggestions</li>
                              <li>5. Analyze metrics</li>
                            </ol>
                          </div>
                          <div className="bg-white rounded-lg p-4 border border-indigo-100">
                            <h4 className="font-medium text-indigo-900 mb-2">Layout Optimization</h4>
                            <ol className="text-sm text-indigo-700 space-y-1">
                              <li>1. Review current metrics</li>
                              <li>2. Generate AI suggestions</li>
                              <li>3. Test different layouts</li>
                              <li>4. Compare performance</li>
                              <li>5. Apply best solution</li>
                            </ol>
                          </div>
                          <div className="bg-white rounded-lg p-4 border border-indigo-100">
                            <h4 className="font-medium text-indigo-900 mb-2">Zone Deep Dive</h4>
                            <ol className="text-sm text-indigo-700 space-y-1">
                              <li>1. Click zone to analyze</li>
                              <li>2. Design shelf layout</li>
                              <li>3. Organize by category</li>
                              <li>4. Optimize placement</li>
                              <li>5. Track performance</li>
                            </ol>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="mt-16 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Ready to Design Your Perfect Store? 🚀
            </h2>
            <p className="text-white/90 text-lg mb-6">
              Apply what you've learned and create amazing store layouts with our powerful tools.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/" className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center gap-2">
                <Layout size={20} />
                Start Designing
              </Link>
              <Link href="/dashboard" className="bg-white/20 backdrop-blur-sm text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/30 transition-colors flex items-center gap-2">
                <BarChart3 size={20} />
                View Dashboard
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-200 text-center">
          <div className="flex items-center justify-center gap-2 text-gray-600 mb-4">
            <Heart size={16} className="text-red-500" />
            <span>Made with love for store designers everywhere</span>
          </div>
          <p className="text-sm text-gray-500">
            Store Layout Designer • Built with Next.js, Three.js & AI • © 2025
          </p>
        </div>
      </div>
    </div>
  );
}
