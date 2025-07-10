'use client';

import { useState } from 'react';
import { Sparkles, Wand2, Lightbulb, ArrowRight, Loader2, CheckCircle, AlertCircle, Brain } from 'lucide-react';
import { useStoreDesigner } from '@/store/useStoreDesigner';
import { aiService } from '@/services/aiService';

export default function AIAssistant() {
  const {
    store,
    suggestions,
    isGeneratingSuggestions,
    setSuggestions,
    setGeneratingSuggestions,
    applySuggestion,
  } = useStoreDesigner();

  const [error, setError] = useState<string | null>(null);

  const generateSuggestions = async () => {
    setError(null);
    setGeneratingSuggestions(true);
    
    try {
      const newSuggestions = await aiService.generateLayoutSuggestions(
        store.width,
        store.height,
        store.zones
      );
      setSuggestions(newSuggestions);
    } catch (err) {
      setError('Failed to generate AI suggestions. Please try again.');
      console.error('AI suggestion error:', err);
    } finally {
      setGeneratingSuggestions(false);
    }
  };

  const handleApplySuggestion = (suggestionId: string) => {
    const suggestion = suggestions.find(s => s.id === suggestionId);
    if (suggestion) {
      if (confirm(`Apply "${suggestion.name}" layout? This will replace your current zones.`)) {
        applySuggestion(suggestion);
      }
    }
  };

  return (
    <div className="w-80 bg-slate-50/50 backdrop-blur-sm border-l border-slate-200/60 flex flex-col h-full">
      {/* Header */}
      <div className="p-6 bg-white/80 backdrop-blur-sm border-b border-slate-200/60">
        <div className="flex items-center gap-3 mb-3">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white"></div>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-800">AI Assistant</h2>
            <p className="text-sm text-slate-500">Smart layout optimization</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Generate Button */}
        <div className="group">
          <button
            onClick={generateSuggestions}
            disabled={isGeneratingSuggestions}
            className="w-full relative overflow-hidden bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white rounded-2xl p-6 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex items-center justify-center gap-3">
              {isGeneratingSuggestions ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="font-medium">Analyzing layout...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span className="font-medium">Generate Smart Layout</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                </>
              )}
            </div>
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50/80 backdrop-blur-sm border border-red-200/60 rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-4 h-4 text-red-600" />
              </div>
              <div>
                <h4 className="font-medium text-red-900 text-sm">Something went wrong</h4>
                <p className="text-red-700 text-xs mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-2">
              <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                <Lightbulb className="w-4 h-4 text-amber-600" />
              </div>
              <h3 className="font-semibold text-slate-800">Smart Suggestions</h3>
              <div className="px-2 py-1 bg-violet-100 text-violet-700 text-xs font-medium rounded-full">
                {suggestions.length}
              </div>
            </div>
            
            <div className="space-y-4">
              {suggestions.map((suggestion, index) => (
                <div 
                  key={index} 
                  className="group bg-white/70 backdrop-blur-sm border border-slate-200/60 rounded-2xl hover:shadow-lg transition-all duration-300 hover:bg-white/90"
                >
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <h4 className="font-semibold text-slate-800 leading-snug pr-4">
                        {suggestion.name}
                      </h4>
                      <div className="flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full whitespace-nowrap">
                        <CheckCircle className="w-3 h-3" />
                        AI
                      </div>
                    </div>
                    
                    <p className="text-slate-600 text-sm leading-relaxed mb-5">
                      {suggestion.description}
                    </p>
                    
                    {suggestion.zones && suggestion.zones.length > 0 && (
                      <div className="mb-5">
                        <h5 className="text-xs font-medium text-slate-700 mb-3 uppercase tracking-wider">
                          Zones
                        </h5>
                        <div className="grid grid-cols-2 gap-2">
                          {suggestion.zones.map((zone, zoneIndex) => (
                            <div 
                              key={zoneIndex}
                              className="bg-slate-50/80 rounded-xl p-3 border border-slate-200/40"
                            >
                              <div className="text-xs font-medium text-slate-800 mb-1">
                                {zone.name}
                              </div>
                              <div className="text-xs text-slate-500 mb-1">
                                {zone.width} × {zone.height} ft
                              </div>
                              {/* <div className="inline-block px-2 py-0.5 bg-slate-200/60 text-slate-600 text-xs rounded-md capitalize">
                                {zone.type}
                              </div> */}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <button
                      onClick={() => handleApplySuggestion(suggestion.id)}
                      className="w-full bg-slate-800 hover:bg-slate-900 text-white rounded-xl py-3 px-4 font-medium text-sm transition-all duration-200 hover:shadow-md flex items-center justify-center gap-2 group"
                    >
                      Apply Layout
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {suggestions.length === 0 && !isGeneratingSuggestions && !error && (
          <div className="text-center py-12">
            <div className="relative mx-auto w-20 h-20 mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-100 to-purple-100 rounded-2xl"></div>
              <div className="absolute inset-2 bg-white rounded-xl flex items-center justify-center">
                <Wand2 className="w-8 h-8 text-violet-600" />
              </div>
            </div>
            <h3 className="font-semibold text-slate-800 mb-2">Ready to optimize</h3>
            <p className="text-slate-500 text-sm max-w-xs mx-auto leading-relaxed">
              Generate intelligent layout suggestions based on your store setup
            </p>
          </div>
        )}

        {/* Tips Card */}
        <div className="bg-gradient-to-br from-blue-50/80 to-indigo-50/80 backdrop-blur-sm border border-blue-200/40 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <Lightbulb className="w-4 h-4 text-blue-600" />
            </div>
            <h4 className="font-semibold text-blue-900">Optimization Tips</h4>
          </div>
          <div className="space-y-3 text-sm text-blue-800">
            <div className="flex gap-3">
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
              <span>Set precise store dimensions for accurate suggestions</span>
            </div>
            <div className="flex gap-3">
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
              <span>Add existing zones to help AI understand your layout</span>
            </div>
            <div className="flex gap-3">
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
              <span>Each suggestion can be fine-tuned after applying</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
