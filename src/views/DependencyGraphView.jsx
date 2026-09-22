import React from 'react';
import { useProject } from '../context/ProjectContext';
import { GitCommit, AlertTriangle, Wand2, CheckCircle2 } from 'lucide-react';
import { formatPrettyDate } from '../utils/dateUtils';

export default function DependencyGraphView() {
  const {
    filteredMilestones,
    milestones,
    dependencyConflicts,
    autoFixDependencies,
    setSelectedMilestoneId
  } = useProject();

  const milestoneMap = new Map(milestones.map(m => [m.id, m]));

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <GitCommit className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-slate-900">Dependency Network & Schedule Conflict Inspector</h2>
          </div>
          <p className="text-xs text-slate-500 font-medium">Map predecessors and successors to prevent bottleneck delays</p>
        </div>

        {dependencyConflicts.length > 0 && (
          <button
            onClick={autoFixDependencies}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg bg-gradient-to-r from-amber-500 to-rose-600 text-white shadow-md hover:from-amber-600 hover:to-rose-700 transition-all transform active:scale-95 animate-pulse"
          >
            <Wand2 className="w-4 h-4" />
            Auto-Fix All Schedule Conflicts ({dependencyConflicts.length})
          </button>
        )}
      </div>

      {/* Conflicts Alert Box */}
      {dependencyConflicts.length > 0 ? (
        <div className="glass-panel p-5 rounded-xl border-amber-200 bg-amber-50/80 space-y-3 shadow-xs">
          <div className="flex items-center gap-2 text-amber-900 font-extrabold text-sm">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <span>Schedule Conflict Warnings Detected ({dependencyConflicts.length})</span>
          </div>

          <div className="space-y-2">
            {dependencyConflicts.map((c, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-white border border-amber-200 text-xs text-amber-900 font-medium flex items-center justify-between shadow-2xs">
                <span>{c.message}</span>
                <button
                  onClick={() => setSelectedMilestoneId(c.milestoneId)}
                  className="px-2.5 py-1 rounded bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold transition-all text-xs"
                >
                  Inspect & Adjust
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2 shadow-2xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>All dependency timelines are fully synchronized with zero schedule conflicts!</span>
        </div>
      )}

      {/* Network Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMilestones.map((ms) => {
          const predecessors = (ms.dependencies || []).map(id => milestoneMap.get(id)).filter(Boolean);
          const successors = milestones.filter(m => (m.dependencies || []).includes(ms.id));

          return (
            <div
              key={ms.id}
              onClick={() => setSelectedMilestoneId(ms.id)}
              className="glass-panel p-4 rounded-xl border border-slate-200 hover:border-indigo-300 cursor-pointer transition-all space-y-3 group shadow-xs bg-white"
            >
              {/* Card Title */}
              <div className="flex items-start justify-between border-b border-slate-100 pb-2.5 gap-2">
                <div>
                  <span className="text-[10px] font-extrabold text-indigo-600 font-mono">{ms.priority}</span>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {ms.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">Owner: {ms.owner}</p>
                </div>
                <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                  ms.health === 'On Track' ? 'badge-on-track' : ms.health === 'At Risk' ? 'badge-at-risk' : 'badge-off-track'
                }`}>
                  {ms.health}
                </span>
              </div>

              {/* Schedule Dates */}
              <div className="flex items-center justify-between text-xs font-mono text-slate-600 bg-slate-50 p-2 rounded border border-slate-100">
                <span>Start: {formatPrettyDate(ms.startDate)}</span>
                <span>Due: {formatPrettyDate(ms.dueDate)}</span>
              </div>

              {/* Predecessor Nodes */}
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-500 block">
                  Predecessors (Must finish first):
                </span>
                {predecessors.length > 0 ? (
                  predecessors.map(p => (
                    <div key={p.id} className="text-xs p-1.5 rounded bg-slate-50 border border-slate-200 flex items-center justify-between">
                      <span className="truncate text-slate-800 font-semibold">{p.title}</span>
                      <span className="text-[10px] text-slate-500 font-mono font-bold">{p.dueDate}</span>
                    </div>
                  ))
                ) : (
                  <span className="text-xs text-slate-400 italic block font-medium">None (Independent Root)</span>
                )}
              </div>

              {/* Successor Nodes */}
              <div className="space-y-1 pt-1 border-t border-slate-100">
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-500 block">
                  Successors (Blocked until complete):
                </span>
                {successors.length > 0 ? (
                  successors.map(s => (
                    <div key={s.id} className="text-xs p-1.5 rounded bg-slate-50 border border-slate-200 flex items-center justify-between">
                      <span className="truncate text-slate-800 font-semibold">{s.title}</span>
                      <span className="text-[10px] text-slate-500 font-mono font-bold">{s.startDate}</span>
                    </div>
                  ))
                ) : (
                  <span className="text-xs text-slate-400 italic block font-medium">None (End Node)</span>
                )}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
