
import React from 'react';
import { AnalysisResult, DetectionCategory } from '../types';
import { Calendar, Trash2, ChevronRight, Filter } from 'lucide-react';

interface HistoryListProps {
  history: AnalysisResult[];
  onSelectItem: (item: AnalysisResult) => void;
}

const HistoryList: React.FC<HistoryListProps> = ({ history, onSelectItem }) => {
  const formatTime = (ts: number) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    }).format(ts);
  };

  const getBadgeColor = (category: DetectionCategory) => {
    switch (category) {
      case DetectionCategory.HATE_SPEECH: return 'bg-red-100 text-red-700 border-red-200';
      case DetectionCategory.OFFENSIVE: return 'bg-amber-100 text-amber-700 border-amber-200';
      case DetectionCategory.SAFE: return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in duration-500">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Analysis History</h2>
          <p className="text-slate-500 text-sm">Review previous scans from this session.</p>
        </div>
        <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
          <Filter className="w-5 h-5" />
        </button>
      </div>

      {history.length === 0 ? (
        <div className="p-12 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
            <Calendar className="w-8 h-8 text-slate-300" />
          </div>
          <h3 className="text-slate-900 font-semibold">No records found</h3>
          <p className="text-slate-500 text-sm max-w-[240px] mt-1">Your analysis history will appear here once you start scanning text.</p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {history.map((item) => (
            <div 
              key={item.id} 
              onClick={() => onSelectItem(item)}
              className="group p-4 hover:bg-slate-50 transition-all cursor-pointer flex items-center gap-4"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${getBadgeColor(item.category)}`}>
                    {item.category}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">{formatTime(item.timestamp)}</span>
                </div>
                <p className="text-slate-700 text-sm font-medium line-clamp-1 truncate">
                  {item.text}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="hidden sm:block text-right">
                  <div className="text-xs font-bold text-slate-900">{(item.confidence * 100).toFixed(0)}%</div>
                  <div className="text-[9px] text-slate-400 uppercase font-bold tracking-tight">Certainty</div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-500 transition-colors" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryList;
