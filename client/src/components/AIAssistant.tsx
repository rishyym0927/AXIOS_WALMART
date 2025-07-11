'use client';

import { useState } from 'react';
import { Sparkles, Wand2, Lightbulb, ArrowRight, Loader2, CheckCircle, AlertCircle, Brain, Zap, Target, TrendingUp, X } from 'lucide-react';
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

  const dismissError = () => {
    setError(null);
  };

  return (
    <div className="w-80 bg-white/60 backdrop-blur-xl border-l border-white/20 flex flex-col h-full shadow-xl">
      {/* Header */}
      <div className="relative p-6 bg-gradient-to-br from-violet-500/10 to-purple-600/10 backdrop-blur-sm border-b border-white/20">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-500/5 to-purple-600/5"></div>
        <div className="relative flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-200">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full border-2 border-white shadow-sm flex items-center justify-center">
              <Zap className="w-2.5 h-2.5 text-white" />
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800 mb-1">AI Assistant</h2>
            <p className="text-sm text-slate-600 flex items-center gap-1">
              <Target className="w-3 h-3" />
              Smart layout optimization
            </p>
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
            className="w-full relative overflow-hidden bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-700 hover:via-purple-700 hover:to-indigo-700 text-white rounded-2xl p-6 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            <div className="relative flex items-center justify-center gap-3">
              {isGeneratingSuggestions ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="font-semibold">Analyzing layout...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span className="font-semibold">Generate Smart Layout</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                </>
              )}
            </div>
          </button>
          <p className="text-xs text-slate-500 mt-2 text-center">
            AI will analyze your store and suggest optimal layouts
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50/90 backdrop-blur-sm border border-red-200/60 rounded-2xl p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-4 h-4 text-red-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-red-900 text-sm">Something went wrong</h4>
                <p className="text-red-700 text-xs mt-1 leading-relaxed">{error}</p>
              </div>
              <button
                onClick={dismissError}
                className="w-6 h-6 bg-red-100 hover:bg-red-200 rounded-full flex items-center justify-center transition-colors duration-200"
              >
                <X className="w-3 h-3 text-red-600" />
              </button>
            </div>
          </div>
        )}

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-sm">
                  <Lightbulb className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-bold text-slate-800">Smart Suggestions</h3>
              </div>
              <div className="flex items-center gap-2">
                <div className="px-3 py-1 bg-gradient-to-r from-violet-100 to-purple-100 text-violet-700 text-xs font-semibold rounded-full border border-violet-200/50">
                  {suggestions.length} layouts
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              {suggestions.map((suggestion, index) => (
                <div 
                  key={index} 
                  className="group bg-white/80 backdrop-blur-sm border border-white/40 rounded-2xl hover:shadow-lg transition-all duration-300 hover:bg-white/90 hover:border-white/60 hover:scale-[1.01]"
                >
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <h4 className="font-bold text-slate-800 leading-snug pr-4 text-base">
                        {suggestion.name}
                      </h4>
                      <div className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 text-xs font-semibold rounded-full whitespace-nowrap border border-emerald-200/50">
                        <CheckCircle className="w-3 h-3" />
                        AI Generated
                      </div>
                    </div>
                    
                    <p className="text-slate-600 text-sm leading-relaxed mb-5">
                      {suggestion.description}
                    </p>
                    
                    {suggestion.zones && suggestion.zones.length > 0 && (
                      <div className="mb-5">
                        <div className="flex items-center gap-2 mb-3">
                          <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                            Layout Preview
                          </h5>
                          <div className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-full font-medium">
                            {suggestion.zones.length} zones
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          {suggestion.zones.map((zone, zoneIndex) => (
                            <div 
                              key={zoneIndex}
                              className="bg-gradient-to-br from-slate-50 to-slate-100/80 rounded-xl p-3 border border-slate-200/60 hover:border-slate-300/60 transition-colors duration-200"
                            >
                              <div className="text-xs font-bold text-slate-800 mb-1">
                                {zone.name}
                              </div>
                              <div className="text-xs text-slate-500 mb-2 flex items-center gap-1">
                                <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
                                {zone.width} × {zone.height} ft
                              </div>
                          
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <button
                      onClick={() => handleApplySuggestion(suggestion.id)}
                      className="w-full bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-900 hover:to-black text-white rounded-xl py-3 px-4 font-semibold text-sm transition-all duration-200 hover:shadow-lg flex items-center justify-center gap-2 group transform hover:scale-[1.02]"
                    >
                      Apply This Layout
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
            <div className="relative mx-auto w-24 h-24 mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-100 to-purple-100 rounded-3xl transform rotate-6"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-3xl transform -rotate-6"></div>
              <div className="absolute inset-2 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                <Wand2 className="w-10 h-10 text-violet-600" />
              </div>
            </div>
            <h3 className="font-bold text-slate-800 mb-2 text-lg">Ready to optimize</h3>
            <p className="text-slate-500 text-sm max-w-xs mx-auto leading-relaxed">
              Generate intelligent layout suggestions based on your store dimensions and current setup
            </p>
          </div>
        )}

        {/* Enhanced Tips Card */}
        <div className="bg-gradient-to-br from-blue-50/90 to-indigo-50/90 backdrop-blur-sm border border-blue-200/50 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-sm">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <h4 className="font-bold text-blue-900">Pro Tips</h4>
          </div>
          <div className="space-y-3 text-sm text-blue-800">
            <div className="flex gap-3">
              <div className="w-2 h-2 bg-blue-400 rounded-full mt-1.5 flex-shrink-0"></div>
              <span className="leading-relaxed">Set precise store dimensions for accurate suggestions</span>
            </div>
            <div className="flex gap-3">
              <div className="w-2 h-2 bg-blue-400 rounded-full mt-1.5 flex-shrink-0"></div>
              <span className="leading-relaxed">Add existing zones to help AI understand your current layout</span>
            </div>
            <div className="flex gap-3">
              <div className="w-2 h-2 bg-blue-400 rounded-full mt-1.5 flex-shrink-0"></div>
              <span className="leading-relaxed">Each suggestion can be fine-tuned after applying</span>
            </div>
            <div className="flex gap-3">
              <div className="w-2 h-2 bg-blue-400 rounded-full mt-1.5 flex-shrink-0"></div>
              <span className="leading-relaxed">Multiple layouts are generated for different optimization goals</span>
            </div>
          </div>
        </div>

        {/* Stats Card (if suggestions exist) */}
        {suggestions.length > 0 && (
          <div className="bg-gradient-to-br from-emerald-50/90 to-green-50/90 backdrop-blur-sm border border-emerald-200/50 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-6 h-6 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center">
                <CheckCircle className="w-3 h-3 text-white" />
              </div>
              <h4 className="font-bold text-emerald-900 text-sm">Analysis Complete</h4>
            </div>
            <div className="text-xs text-emerald-800 space-y-1">
              <div>✓ {suggestions.length} optimized layouts generated</div>
              <div>✓ Current store: {store.width}m × {store.height}m</div>
              <div>✓ {store.zones.length} existing zones analyzed</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}