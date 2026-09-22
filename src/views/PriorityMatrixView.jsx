import React, { useState } from 'react';
import { useProject } from '../context/ProjectContext';
import { Grid, Zap, Award, Coffee, AlertCircle } from 'lucide-react';

export default function PriorityMatrixView() {
  const { filteredMilestones, setSelectedMilestoneId } = useProject();

  const [activeTab, setActiveTab] = useState('matrix');

  const quickWins = filteredMilestones.filter(m => m.impact >= 5.5 && m.effort < 5.5);
  const majorProjects = filteredMilestones.filter(m => m.impact >= 5.5 && m.effort >= 5.5);
  const fillIns = filteredMilestones.filter(m => m.impact < 5.5 && m.effort < 5.5);
  const thanklessTasks = filteredMilestones.filter(m => m.impact < 5.5 && m.effort >= 5.5);

  const riceScoredMilestones = [...filteredMilestones].map(m => {
    const reach = m.riceReach || 5000;
    const impact = m.riceImpact || (m.impact / 3);
    const confidence = m.riceConfidence || 0.8;
    const effort = Math.max(1, m.riceEffort || (m.effort / 2));
    const score = Math.round((reach * impact * confidence) / effort);
    return { ...m, riceScore: score, reach, impactVal: impact, confidence, effortVal: effort };
  }).sort((a, b) => b.riceScore - a.riceScore);

  return (
    <div className="space-y-6">
      
      {/* Header & Sub-Tab Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <Grid className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-slate-900">Milestone Prioritization & Value Engine</h2>
          </div>
          <p className="text-xs text-slate-500 font-medium">Evaluate effort vs impact quadrants and calculate Aura RICE scores</p>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
          <button
            onClick={() => setActiveTab('matrix')}
            className={`px-3.5 py-1.5 rounded-md font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'matrix' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            2x2 Effort vs Impact Matrix
          </button>
          <button
            onClick={() => setActiveTab('rice')}
            className={`px-3.5 py-1.5 rounded-md font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'rice' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            Aura RICE Scorecard
          </button>
        </div>
      </div>

      {activeTab === 'matrix' ? (
        /* 2x2 Matrix View */
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            
            {/* Quadrant 1: Quick Wins (High Impact, Low Effort) */}
            <div className="glass-panel p-5 rounded-xl border-emerald-200 bg-emerald-50/60 space-y-3 relative overflow-hidden shadow-xs">
              <div className="flex items-center justify-between border-b border-emerald-200 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-emerald-950">Quick Wins (P0 - Immediate)</h3>
                    <p className="text-[11px] text-emerald-700 font-medium">High Impact, Low Effort</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  {quickWins.length} Milestones
                </span>
              </div>

              <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                {quickWins.map(m => (
                  <div
                    key={m.id}
                    onClick={() => setSelectedMilestoneId(m.id)}
                    className="p-3 rounded-lg bg-white border border-emerald-200 hover:border-emerald-400 cursor-pointer transition-all flex items-center justify-between group shadow-2xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-emerald-700 font-mono">{m.priority}</span>
                        <h4 className="text-xs font-bold text-slate-800 group-hover:text-emerald-700 transition-colors">
                          {m.title}
                        </h4>
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium">Owner: {m.owner}</p>
                    </div>
                    <div className="text-right text-[11px]">
                      <span className="text-emerald-700 font-bold block">Impact: {m.impact}/10</span>
                      <span className="text-slate-500 block">Effort: {m.effort}/10</span>
                    </div>
                  </div>
                ))}

                {quickWins.length === 0 && (
                  <p className="text-xs text-slate-500 text-center py-6 italic font-medium">No quick wins currently mapped.</p>
                )}
              </div>
            </div>

            {/* Quadrant 2: Major Projects (High Impact, High Effort) */}
            <div className="glass-panel p-5 rounded-xl border-indigo-200 bg-indigo-50/60 space-y-3 relative overflow-hidden shadow-xs">
              <div className="flex items-center justify-between border-b border-indigo-200 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-indigo-950">Major Projects (Strategic)</h3>
                    <p className="text-[11px] text-indigo-700 font-medium">High Impact, High Effort</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-indigo-100 text-indigo-800 border border-indigo-300">
                  {majorProjects.length} Milestones
                </span>
              </div>

              <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                {majorProjects.map(m => (
                  <div
                    key={m.id}
                    onClick={() => setSelectedMilestoneId(m.id)}
                    className="p-3 rounded-lg bg-white border border-indigo-200 hover:border-indigo-400 cursor-pointer transition-all flex items-center justify-between group shadow-2xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-indigo-700 font-mono">{m.priority}</span>
                        <h4 className="text-xs font-bold text-slate-800 group-hover:text-indigo-700 transition-colors">
                          {m.title}
                        </h4>
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium">Owner: {m.owner}</p>
                    </div>
                    <div className="text-right text-[11px]">
                      <span className="text-indigo-700 font-bold block">Impact: {m.impact}/10</span>
                      <span className="text-slate-500 block">Effort: {m.effort}/10</span>
                    </div>
                  </div>
                ))}

                {majorProjects.length === 0 && (
                  <p className="text-xs text-slate-500 text-center py-6 italic font-medium">No major strategic projects mapped.</p>
                )}
              </div>
            </div>

            {/* Quadrant 3: Fill-ins (Low Impact, Low Effort) */}
            <div className="glass-panel p-5 rounded-xl border-amber-200 bg-amber-50/60 space-y-3 relative overflow-hidden shadow-xs">
              <div className="flex items-center justify-between border-b border-amber-200 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                    <Coffee className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-amber-950">Fill-ins & Maintenance</h3>
                    <p className="text-[11px] text-amber-700 font-medium">Low Impact, Low Effort</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-amber-100 text-amber-800 border border-amber-300">
                  {fillIns.length} Milestones
                </span>
              </div>

              <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                {fillIns.map(m => (
                  <div
                    key={m.id}
                    onClick={() => setSelectedMilestoneId(m.id)}
                    className="p-3 rounded-lg bg-white border border-amber-200 hover:border-amber-400 cursor-pointer transition-all flex items-center justify-between group shadow-2xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-amber-700 font-mono">{m.priority}</span>
                        <h4 className="text-xs font-bold text-slate-800 group-hover:text-amber-700 transition-colors">
                          {m.title}
                        </h4>
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium">Owner: {m.owner}</p>
                    </div>
                    <div className="text-right text-[11px]">
                      <span className="text-amber-700 font-bold block">Impact: {m.impact}/10</span>
                      <span className="text-slate-500 block">Effort: {m.effort}/10</span>
                    </div>
                  </div>
                ))}

                {fillIns.length === 0 && (
                  <p className="text-xs text-slate-500 text-center py-6 italic font-medium">No fill-in tasks mapped.</p>
                )}
              </div>
            </div>

            {/* Quadrant 4: Thankless Tasks (Low Impact, High Effort) */}
            <div className="glass-panel p-5 rounded-xl border-rose-200 bg-rose-50/60 space-y-3 relative overflow-hidden shadow-xs">
              <div className="flex items-center justify-between border-b border-rose-200 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-800 flex items-center justify-center font-bold">
                    <AlertCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-rose-950">Thankless Tasks (Reconsider)</h3>
                    <p className="text-[11px] text-rose-700 font-medium">Low Impact, High Effort</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-rose-100 text-rose-800 border border-rose-300">
                  {thanklessTasks.length} Milestones
                </span>
              </div>

              <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                {thanklessTasks.map(m => (
                  <div
                    key={m.id}
                    onClick={() => setSelectedMilestoneId(m.id)}
                    className="p-3 rounded-lg bg-white border border-rose-200 hover:border-rose-400 cursor-pointer transition-all flex items-center justify-between group shadow-2xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-rose-700 font-mono">{m.priority}</span>
                        <h4 className="text-xs font-bold text-slate-800 group-hover:text-rose-700 transition-colors">
                          {m.title}
                        </h4>
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium">Owner: {m.owner}</p>
                    </div>
                    <div className="text-right text-[11px]">
                      <span className="text-rose-700 font-bold block">Impact: {m.impact}/10</span>
                      <span className="text-slate-500 block">Effort: {m.effort}/10</span>
                    </div>
                  </div>
                ))}

                {thanklessTasks.length === 0 && (
                  <p className="text-xs text-slate-500 text-center py-6 italic font-medium">No low-impact high-effort tasks.</p>
                )}
              </div>
            </div>

          </div>
        </div>
      ) : (
        /* RICE Scorecard Table View */
        <div className="glass-panel rounded-xl overflow-hidden border border-slate-200 shadow-md bg-white">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Aura RICE Prioritization Scorecard Ranking</h3>
            <span className="text-xs text-indigo-700 font-mono font-bold">Score = (Reach × Impact × Confidence) ÷ Effort</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200 text-slate-600 uppercase tracking-wider font-mono font-bold">
                  <th className="py-3 px-4">Rank</th>
                  <th className="py-3 px-4">Milestone</th>
                  <th className="py-3 px-4">Reach</th>
                  <th className="py-3 px-4">Impact</th>
                  <th className="py-3 px-4">Confidence</th>
                  <th className="py-3 px-4">Effort</th>
                  <th className="py-3 px-4 text-right">RICE Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {riceScoredMilestones.map((m, idx) => (
                  <tr
                    key={m.id}
                    onClick={() => setSelectedMilestoneId(m.id)}
                    className="hover:bg-indigo-50/40 cursor-pointer transition-colors"
                  >
                    <td className="py-3.5 px-4 font-bold text-slate-500 font-mono">#{idx + 1}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{m.title}</div>
                      <div className="text-[11px] text-slate-500">{m.owner}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-700">{m.reach.toLocaleString()} users</td>
                    <td className="py-3.5 px-4 font-mono text-slate-700">{m.impactVal}x</td>
                    <td className="py-3.5 px-4 font-mono text-slate-700">{Math.round(m.confidence * 100)}%</td>
                    <td className="py-3.5 px-4 font-mono text-slate-700">{m.effortVal} pts</td>
                    <td className="py-3.5 px-4 text-right font-mono font-extrabold text-indigo-600 text-sm">
                      {m.riceScore.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
