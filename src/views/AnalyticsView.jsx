import React from 'react';
import { useProject } from '../context/ProjectContext';
import { BarChart3, AlertTriangle, Download, TrendingUp, ShieldCheck } from 'lucide-react';
import { exportMilestonesToCSV } from '../utils/exportUtils';

export default function AnalyticsView() {
  const { milestones, dependencyConflicts, ideas } = useProject();

  const total = milestones.length;
  const completed = milestones.filter(m => m.status === 'Completed').length;
  const onTrack = milestones.filter(m => m.health === 'On Track').length;
  const atRisk = milestones.filter(m => m.health === 'At Risk').length;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
  const healthRate = total > 0 ? Math.round((onTrack / total) * 100) : 0;

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-slate-900">Executive Portfolio Analytics & Reports</h2>
          </div>
          <p className="text-xs text-slate-500 font-medium">Comprehensive summary of milestone completion, health metrics, and risk factors</p>
        </div>

        <button
          onClick={() => exportMilestonesToCSV(milestones)}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-all"
        >
          <Download className="w-4 h-4" />
          Export Full Executive Report (CSV)
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="glass-panel p-5 rounded-xl border border-slate-200 space-y-2 bg-white shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Overall Completion Rate</span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-indigo-600 font-mono">{completionRate}%</span>
            <TrendingUp className="w-6 h-6 text-indigo-600" />
          </div>
          <p className="text-[11px] text-slate-500 font-medium">{completed} of {total} milestones completed</p>
        </div>

        <div className="glass-panel p-5 rounded-xl border border-slate-200 space-y-2 bg-white shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Roadmap Health Score</span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-emerald-600 font-mono">{healthRate}%</span>
            <ShieldCheck className="w-6 h-6 text-emerald-600" />
          </div>
          <p className="text-[11px] text-slate-500 font-medium">{onTrack} milestones on track, {atRisk} at risk</p>
        </div>

        <div className="glass-panel p-5 rounded-xl border border-slate-200 space-y-2 bg-white shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Schedule Conflicts</span>
          <div className="flex items-baseline justify-between">
            <span className={`text-3xl font-extrabold font-mono ${dependencyConflicts.length > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
              {dependencyConflicts.length}
            </span>
            <AlertTriangle className={`w-6 h-6 ${dependencyConflicts.length > 0 ? 'text-amber-600' : 'text-emerald-600'}`} />
          </div>
          <p className="text-[11px] text-slate-500 font-medium">Detected dependency date overlaps</p>
        </div>

        <div className="glass-panel p-5 rounded-xl border border-slate-200 space-y-2 bg-white shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Ideas Backlog</span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-amber-600 font-mono">{ideas.length}</span>
            <BarChart3 className="w-6 h-6 text-amber-600" />
          </div>
          <p className="text-[11px] text-slate-500 font-medium">{ideas.filter(i => i.status === 'Promoted').length} ideas promoted to roadmap</p>
        </div>

      </div>

      {/* Detailed Distribution Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Priority Breakdown */}
        <div className="glass-panel p-5 rounded-xl border border-slate-200 space-y-3 bg-white shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Milestone Priority Breakdown</h3>
          <div className="space-y-2.5">
            {['P0', 'P1', 'P2', 'P3'].map(p => {
              const count = milestones.filter(m => m.priority === p).length;
              const pct = total > 0 ? Math.round((count / total) * 100) : 0;
              return (
                <div key={p} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-700">{p} Milestones</span>
                    <span className="text-slate-500 font-mono">{count} ({pct}%)</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Health Breakdown */}
        <div className="glass-panel p-5 rounded-xl border border-slate-200 space-y-3 bg-white shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Roadmap Health Distribution</h3>
          <div className="space-y-2.5">
            {[
              { label: 'On Track', color: 'bg-emerald-500', count: onTrack },
              { label: 'At Risk', color: 'bg-amber-500', count: atRisk },
              { label: 'Off Track', color: 'bg-rose-500', count: milestones.filter(m => m.health === 'Off Track').length },
            ].map(h => {
              const pct = total > 0 ? Math.round((h.count / total) * 100) : 0;
              return (
                <div key={h.label} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-700">{h.label}</span>
                    <span className="text-slate-500 font-mono">{h.count} ({pct}%)</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full ${h.color} rounded-full`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}
