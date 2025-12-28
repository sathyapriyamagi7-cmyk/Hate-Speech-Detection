
import React, { useState, useCallback, useMemo } from 'react';
import { ShieldAlert, ShieldCheck, History, BarChart3, Info, Github, AlertTriangle } from 'lucide-react';
import { analyzeText } from './geminiService';
import { AnalysisResult, DetectionCategory, StatsData } from './types';
import DetectionDashboard from './components/DetectionDashboard';
import HistoryList from './components/HistoryList';
import StatsSection from './components/StatsSection';

const App: React.FC = () => {
  const [history, setHistory] = useState<AnalysisResult[]>([]);
  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'analyze' | 'history' | 'stats'>('analyze');

  const handleAnalyze = async (text: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await analyzeText(text);
      setCurrentAnalysis(result);
      setHistory(prev => [result, ...prev]);
    } catch (err: any) {
      setError(err.message || "Failed to analyze text. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const stats = useMemo<StatsData[]>(() => {
    const counts = history.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return [
      { name: DetectionCategory.HATE_SPEECH, value: counts[DetectionCategory.HATE_SPEECH] || 0, color: '#ef4444' },
      { name: DetectionCategory.OFFENSIVE, value: counts[DetectionCategory.OFFENSIVE] || 0, color: '#f59e0b' },
      { name: DetectionCategory.SAFE, value: counts[DetectionCategory.SAFE] || 0, color: '#10b981' },
    ];
  }, [history]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <ShieldAlert className="text-white w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">SentinelAI</h1>
          </div>
          
          <nav className="hidden md:flex items-center gap-6">
            <button 
              onClick={() => setActiveTab('analyze')}
              className={`text-sm font-medium transition-colors ${activeTab === 'analyze' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Scanner
            </button>
            <button 
              onClick={() => setActiveTab('history')}
              className={`text-sm font-medium transition-colors ${activeTab === 'history' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-800'}`}
            >
              History
            </button>
            <button 
              onClick={() => setActiveTab('stats')}
              className={`text-sm font-medium transition-colors ${activeTab === 'stats' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Analytics
            </button>
          </nav>

          <div className="flex items-center gap-3">
            <a href="#" className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Navigation (Mobile) / Sidebar Stats (Desktop) */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
              <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Quick Stats</h2>
              <div className="space-y-4">
                <StatCard icon={<ShieldCheck className="text-emerald-500" />} label="Clean Texts" value={stats.find(s => s.name === DetectionCategory.SAFE)?.value || 0} color="emerald" />
                <StatCard icon={<AlertTriangle className="text-amber-500" />} label="Offensive" value={stats.find(s => s.name === DetectionCategory.OFFENSIVE)?.value || 0} color="amber" />
                <StatCard icon={<ShieldAlert className="text-red-500" />} label="Hate Speech" value={stats.find(s => s.name === DetectionCategory.HATE_SPEECH)?.value || 0} color="red" />
              </div>
            </div>

            <div className="hidden lg:block bg-indigo-50 rounded-xl p-5 border border-indigo-100">
              <div className="flex items-start gap-3">
                <Info className="text-indigo-600 w-5 h-5 mt-0.5" />
                <div>
                  <h3 className="text-indigo-900 font-semibold text-sm">How it works</h3>
                  <p className="text-indigo-700 text-xs mt-1 leading-relaxed">
                    Our AI analyzes the semantic context of your text to identify hate speech and offensive patterns beyond simple keyword matching.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Middle Column: Main View Area */}
          <div className="lg:col-span-9 space-y-6">
            {activeTab === 'analyze' && (
              <DetectionDashboard 
                onAnalyze={handleAnalyze} 
                currentResult={currentAnalysis} 
                isLoading={isLoading} 
                error={error} 
              />
            )}
            {activeTab === 'history' && (
              <HistoryList history={history} onSelectItem={(item) => {
                setCurrentAnalysis(item);
                setActiveTab('analyze');
              }} />
            )}
            {activeTab === 'stats' && (
              <StatsSection data={stats} historyCount={history.length} />
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-slate-500 text-sm">
          <p>© 2024 SentinelAI Content Moderation. Powered by Gemini Pro.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-indigo-600">Privacy Policy</a>
            <a href="#" className="hover:text-indigo-600">API Documentation</a>
            <a href="#" className="hover:text-indigo-600">Ethical Guidelines</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, color }) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-3">
      {icon}
      <span className="text-sm font-medium text-slate-600">{label}</span>
    </div>
    <span className={`text-sm font-bold text-slate-900 px-2 py-0.5 rounded-full bg-slate-50 border border-slate-100`}>
      {value}
    </span>
  </div>
);

export default App;
