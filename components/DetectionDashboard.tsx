
import React, { useState } from 'react';
import { Search, Loader2, Send, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import { AnalysisResult, DetectionCategory } from '../types';

interface DetectionDashboardProps {
  onAnalyze: (text: string) => void;
  currentResult: AnalysisResult | null;
  isLoading: boolean;
  error: string | null;
}

const DetectionDashboard: React.FC<DetectionDashboardProps> = ({ onAnalyze, currentResult, isLoading, error }) => {
  const [inputText, setInputText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      onAnalyze(inputText);
    }
  };

  const getCategoryTheme = (category: DetectionCategory) => {
    switch (category) {
      case DetectionCategory.HATE_SPEECH:
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          text: 'text-red-700',
          icon: <XCircle className="w-8 h-8 text-red-500" />,
          label: 'Danger: Hate Speech'
        };
      case DetectionCategory.OFFENSIVE:
        return {
          bg: 'bg-amber-50',
          border: 'border-amber-200',
          text: 'text-amber-700',
          icon: <AlertCircle className="w-8 h-8 text-amber-500" />,
          label: 'Warning: Offensive Language'
        };
      case DetectionCategory.SAFE:
        return {
          bg: 'bg-emerald-50',
          border: 'border-emerald-200',
          text: 'text-emerald-700',
          icon: <CheckCircle2 className="w-8 h-8 text-emerald-500" />,
          label: 'Safe Content'
        };
      default:
        return {
          bg: 'bg-slate-50',
          border: 'border-slate-200',
          text: 'text-slate-700',
          icon: <AlertCircle className="w-8 h-8 text-slate-500" />,
          label: 'Neutral'
        };
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Input Section */}
      <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-2">Analysis Engine</h2>
          <p className="text-slate-500 text-sm mb-6">Enter text below to evaluate it for potential hate speech, harassment, or offensive language.</p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type or paste content here..."
                className="w-full min-h-[160px] p-4 text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none resize-none"
              />
              <div className="absolute bottom-4 right-4 text-xs text-slate-400">
                {inputText.length} characters
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setInputText('')}
                  className="px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={() => setInputText("That's really inspiring! Keep up the great work.")}
                  className="px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                >
                  Load Sample
                </button>
              </div>
              <button
                type="submit"
                disabled={isLoading || !inputText.trim()}
                className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-indigo-100 transition-all"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Analyze Text
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-100 text-red-700 p-4 rounded-xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Results Display */}
      {currentResult && !isLoading && (
        <div className={`rounded-2xl border p-6 transition-all animate-in slide-in-from-bottom-4 duration-500 ${getCategoryTheme(currentResult.category).bg} ${getCategoryTheme(currentResult.category).border}`}>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col items-center gap-2 md:w-48 flex-shrink-0">
              {getCategoryTheme(currentResult.category).icon}
              <div className={`text-xs font-bold uppercase tracking-wider ${getCategoryTheme(currentResult.category).text}`}>
                {getCategoryTheme(currentResult.category).label}
              </div>
              <div className="mt-4 flex flex-col items-center">
                <div className="text-2xl font-black text-slate-900">{(currentResult.confidence * 100).toFixed(0)}%</div>
                <div className="text-[10px] text-slate-500 uppercase font-bold">Confidence</div>
              </div>
            </div>

            <div className="flex-1 space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Analysis Findings</h3>
                <p className="text-slate-800 text-lg leading-relaxed font-medium">
                  {currentResult.explanation}
                </p>
              </div>

              {currentResult.flaggedKeywords.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Flagged Terms</h3>
                  <div className="flex flex-wrap gap-2">
                    {currentResult.flaggedKeywords.map((word, idx) => (
                      <span key={idx} className="px-3 py-1 bg-white/60 border border-slate-200 rounded-lg text-sm text-slate-700 font-medium">
                        {word}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-slate-200/50 flex items-center gap-2 text-xs text-slate-500">
                <AlertCircle className="w-3 h-3" />
                <span>Classification models can sometimes misinterpret nuance. Always verify with human context.</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetectionDashboard;
