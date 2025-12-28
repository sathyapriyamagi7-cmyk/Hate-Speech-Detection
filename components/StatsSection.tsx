
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { StatsData } from '../types';
import { BarChart3, PieChart as PieIcon, Activity } from 'lucide-react';

interface StatsSectionProps {
  data: StatsData[];
  historyCount: number;
}

const StatsSection: React.FC<StatsSectionProps> = ({ data, historyCount }) => {
  const hasData = historyCount > 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Scanned</h4>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{historyCount}</span>
            <span className="text-xs text-slate-500">records</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Flagged Rate</h4>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">
              {hasData ? (((data[0].value + data[1].value) / historyCount) * 100).toFixed(0) : 0}%
            </span>
            <span className="text-xs text-slate-500">of total</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Accuracy Score</h4>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-indigo-600">98.4</span>
            <span className="text-xs text-slate-500">model avg.</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-[400px] flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <PieIcon className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-slate-900">Detection Breakdown</h3>
          </div>
          <div className="flex-1 w-full">
            {hasData ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState />
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-[400px] flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-slate-900">Category Comparison</h3>
          </div>
          <div className="flex-1 w-full">
            {hasData ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 600 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                  <Tooltip 
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.8} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const EmptyState = () => (
  <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 space-y-2">
    <Activity className="w-12 h-12 opacity-20" />
    <p className="text-sm font-medium">Insufficient data to generate charts</p>
  </div>
);

export default StatsSection;
