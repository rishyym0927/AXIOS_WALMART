'use client';

import { motion } from 'framer-motion';
import { 
  Layout, 
  Plus, 
  MoreVertical, 
  Copy, 
  Edit, 
  Trash2, 
  Download,
  Eye,
  Calendar,
  Layers
} from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LayoutsGallery() {
  const router = useRouter();
  const [selectedLayout, setSelectedLayout] = useState<number | null>(null);

  const layouts = [
    { 
      id: 1, 
      name: "Current Store Layout", 
      status: "active", 
      lastModified: "2 hours ago", 
      zones: 8,
      efficiency: 92,
      revenue: "$45.2K",
      thumbnail: "current",
      description: "Main store layout with optimized zones"
    },
    { 
      id: 2, 
      name: "Holiday Season Layout", 
      status: "draft", 
      lastModified: "1 day ago", 
      zones: 10,
      efficiency: 87,
      revenue: "$38.7K",
      thumbnail: "holiday",
      description: "Seasonal layout for holiday shopping"
    },
    { 
      id: 3, 
      name: "Summer 2024 Layout", 
      status: "archived", 
      lastModified: "2 weeks ago", 
      zones: 6,
      efficiency: 78,
      revenue: "$32.1K",
      thumbnail: "summer",
      description: "Summer seasonal merchandise focus"
    },
    { 
      id: 4, 
      name: "AI Optimized v2.0", 
      status: "template", 
      lastModified: "3 days ago", 
      zones: 9,
      efficiency: 95,
      revenue: "$48.3K",
      thumbnail: "ai",
      description: "AI-generated optimal layout template"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'draft': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'archived': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'template': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 90) return 'text-green-600';
    if (efficiency >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleLayoutAction = (action: string, layoutId: number) => {
    switch (action) {
      case 'view':
        router.push('/');
        break;
      case 'edit':
        router.push('/');
        break;
      case 'copy':
        alert('Layout copied successfully!');
        break;
      case 'delete':
        if (confirm('Are you sure you want to delete this layout?')) {
          alert('Layout deleted!');
        }
        break;
      default:
        break;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Layers className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Store Layouts</h3>
              <p className="text-sm text-gray-600">Manage and organize your layouts</p>
            </div>
          </div>
          <button 
            onClick={() => router.push('/')}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Create New</span>
          </button>
        </div>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {layouts.map((layout, index) => (
            <motion.div
              key={layout.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg hover:border-indigo-200 transition-all duration-300 group"
            >
              {/* Thumbnail */}
              <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Layout className="w-12 h-12 text-gray-400" />
                </div>
                {/* Status Badge */}
                <div className="absolute top-3 left-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(layout.status)}`}>
                    {layout.status}
                  </span>
                </div>
                {/* Actions Menu */}
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="relative">
                    <button 
                      onClick={() => setSelectedLayout(selectedLayout === layout.id ? null : layout.id)}
                      className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-white transition-colors"
                    >
                      <MoreVertical className="w-4 h-4 text-gray-600" />
                    </button>
                    
                    {/* Dropdown Menu */}
                    {selectedLayout === layout.id && (
                      <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                        <div className="py-1">
                          <button 
                            onClick={() => handleLayoutAction('view', layout.id)}
                            className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </button>
                          <button 
                            onClick={() => handleLayoutAction('edit', layout.id)}
                            className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                          >
                            <Edit className="w-4 h-4" />
                            Edit
                          </button>
                          <button 
                            onClick={() => handleLayoutAction('copy', layout.id)}
                            className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                          >
                            <Copy className="w-4 h-4" />
                            Duplicate
                          </button>
                          <button 
                            onClick={() => alert('Export feature coming soon!')}
                            className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                          >
                            <Download className="w-4 h-4" />
                            Export
                          </button>
                          {layout.status !== 'active' && (
                            <button 
                              onClick={() => handleLayoutAction('delete', layout.id)}
                              className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Overlay Gradient */}
                <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
              
              {/* Content */}
              <div className="p-4">
                <div className="mb-3">
                  <h4 className="font-semibold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">
                    {layout.name}
                  </h4>
                  <p className="text-sm text-gray-600 leading-relaxed">{layout.description}</p>
                </div>
                
                {/* Metrics */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900">{layout.zones}</div>
                    <div className="text-xs text-gray-500">Zones</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-lg font-bold ${getEfficiencyColor(layout.efficiency)}`}>
                      {layout.efficiency}%
                    </div>
                    <div className="text-xs text-gray-500">Efficiency</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">{layout.revenue}</div>
                    <div className="text-xs text-gray-500">Revenue</div>
                  </div>
                </div>
                
                {/* Footer */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1 text-gray-500">
                    <Calendar className="w-3 h-3" />
                    <span>{layout.lastModified}</span>
                  </div>
                  <button 
                    onClick={() => handleLayoutAction('view', layout.id)}
                    className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
                  >
                    Open →
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Create New Layout Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-4"
        >
          <button 
            onClick={() => router.push('/')}
            className="w-full border-2 border-dashed border-gray-300 rounded-xl p-8 hover:border-indigo-400 hover:bg-indigo-50 transition-all group"
          >
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-100 group-hover:bg-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-3 transition-colors">
                <Plus className="w-6 h-6 text-gray-400 group-hover:text-indigo-600 transition-colors" />
              </div>
              <h4 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors mb-1">
                Create New Layout
              </h4>
              <p className="text-sm text-gray-500 group-hover:text-indigo-500 transition-colors">
                Start designing a new store layout from scratch
              </p>
            </div>
          </button>
        </motion.div>
      </div>
    </div>
  );
}
