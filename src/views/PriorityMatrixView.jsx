import React, { useState } from 'react';
import { useProject } from '../context/ProjectContext';
import { Grid, Zap, Award, Coffee, AlertCircle, Info, HelpCircle } from 'lucide-react';

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
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs relative">
        <div>
          <div className="flex items-center gap-2">
            <Grid className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-slate-900">Milestone Prioritization & Value Engine</h2>
          </div>
          
          {/* Subtitle with Hover Info Popover */}
          <div className="relative group inline-flex items-center gap-1.5 mt-1">
            <p className="text-xs text-slate-500 font-medium">Evaluate effort vs impact quadrants and calculate Kinetix RICE scores</p>
            <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-bold cursor-pointer hover:bg-indigo-600 hover:text-white transition-all shadow-xs">
              ?
            </span>

            {/* Hover Tooltip Popover Card */}
            <div className="absolute left-0 top-full mt-2 hidden group-hover:block z-50 w-80 p-4 bg-slate-900 text-white text-xs rounded-xl shadow-2xl border border-slate-700 backdrop-blur-md transition-all">
              <div className="font-bold text-indigo-300 border-b border-slate-700 pb-2 mb-2 flex items-center justify-between">
                <span>💡 Prioritization Metrics Overview</span>
                <span className="text-[10px] bg-indigo-500/30 text-indigo-200 px-1.5 py-0.5 rounded">Guide</span>
              </div>
              <div className="space-y-2">
                <div>
                  <span className="font-semibold text-amber-300">📊 2x2 Matrix:</span> Plots milestones by <strong>Effort (1-10)</strong> vs <strong>Impact (1-10)</strong> to isolate high-value Quick Wins from low-priority tasks.
                </div>
                <div>
                  <span className="font-semibold text-emerald-300">🏆 RICE Scorecard:</span> Calculates an objective stack-ranking score using:
                  <div className="font-mono text-[10px] bg-slate-800 p-1.5 rounded mt-1 text-emerald-400 font-bold border border-slate-700">
                    Score = (Reach × Impact × Confidence) ÷ Effort
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Selection Buttons with Rich Hover Cards */}
        <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
          
          {/* Button 1: 2x2 Matrix */}
          <div className="relative group">
            <button
              onClick={() => setActiveTab('matrix')}
              className={`px-3.5 py-1.5 rounded-md font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'matrix' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              2x2 Effort vs Impact Matrix
            </button>

            {/* Hover Tooltip for 2x2 Button */}
            <div className="absolute right-0 top-full mt-2 hidden group-hover:block z-50 w-72 p-3.5 bg-slate-900 text-white text-xs rounded-xl shadow-xl border border-slate-700 backdrop-blur-md">
              <div className="font-bold text-amber-300 mb-1 flex items-center gap-1">
                <Grid className="w-3.5 h-3.5" />
                <span>2x2 Effort vs Impact Matrix</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Categorizes milestones into 4 actionable quadrants:
              </p>
              <ul className="mt-2 space-y-1 text-[11px]">
                <li className="text-emerald-300">⚡ <strong>Quick Wins:</strong> High Impact, Low Effort (Do First)</li>
                <li className="text-indigo-300">🎯 <strong>Major Projects:</strong> High Impact, High Effort (Plan Ahead)</li>
                <li className="text-slate-300">🌱 <strong>Fill-ins:</strong> Low Impact, Low Effort (Downtime)</li>
                <li className="text-rose-300">⚠️ <strong>Thankless Tasks:</strong> Low Impact, High Effort (Avoid)</li>
              </ul>
            </div>
          </div>

          {/* Button 2: RICE Scorecard */}
          <div className="relative group">
            <button
              onClick={() => setActiveTab('rice')}
              className={`px-3.5 py-1.5 rounded-md font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'rice' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              Kinetix RICE Scorecard
            </button>

            {/* Hover Tooltip for RICE Button */}
            <div className="absolute right-0 top-full mt-2 hidden group-hover:block z-50 w-72 p-3.5 bg-slate-900 text-white text-xs rounded-xl shadow-xl border border-slate-700 backdrop-blur-md">
              <div className="font-bold text-emerald-300 mb-1 flex items-center gap-1">
                <Award className="w-3.5 h-3.5" />
                <span>Kinetix RICE Prioritization Engine</span>
              </div>
              <p className="text-slate-300 text-[11px]">
                Objective formula for backlog prioritization:
              </p>
              <div className="font-mono text-[10px] bg-slate-800 p-1.5 rounded my-1.5 text-emerald-400 font-bold border border-slate-700">
                Score = (Reach × Impact × Confidence) ÷ Effort
              </div>
              <ul className="space-y-0.5 text-[10px] text-slate-300">
                <li>• <strong>Reach:</strong> Users impacted per quarter</li>
                <li>• <strong>Impact:</strong> Value multiplier (0.5x to 3x)</li>
                <li>• <strong>Confidence:</strong> Data certainty (50% - 100%)</li>
                <li>• <strong>Effort:</strong> Person-weeks required</li>
              </ul>
            </div>
          </div>

        </div>
      </div>

      {activeTab === 'matrix' ? (
        /* 2x2 Matrix View */
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            
            {/* Quadrant 1: Quick Wins (High Impact, Low Effort) */}
            <div className="glass-panel p-5 rounded-xl border-emerald-200 bg-emerald-50/60 space-y-3 relative overflow-hidden shadow-xs">
              <div className="flex items-center justify-between border-b border-emerald-200/80 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center font-bold shadow-xs">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-emerald-950 text-sm">Quick Wins</h3>
                    <p className="text-[11px] text-emerald-700 font-medium">High Impact (≥5.5) • Low Effort (&lt;5.5)</p>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold bg-emerald-200/80 text-emerald-800 px-2.5 py-1 rounded-full border border-emerald-300/60">
                  {quickWins.length} Tasks
                </span>
              </div>

              <div className="space-y-2.5">
                {quickWins.map(m => (
                  <div
                    key={m.id}
                    onClick={() => setSelectedMilestoneId(m.id)}
                    className="p-3 bg-white/90 hover:bg-white rounded-lg border border-emerald-200/80 shadow-2xs hover:shadow-xs transition-all cursor-pointer flex items-center justify-between gap-3 group"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">{m.title}</div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                        <span>Owner: <strong>{m.owner}</strong></span>
                        <span>•</span>
                        <span className="font-mono text-emerald-700 font-semibold">Impact: {m.impact}/10</span>
                      </div>
                    </div>
                    <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      P0 Immediate
                    </span>
                  </div>
                ))}

                {quickWins.length === 0 && (
                  <p className="text-xs text-slate-500 text-center py-6 italic font-medium">No quick wins found in current filter.</p>
                )}
              </div>
            </div>

            {/* Quadrant 2: Major Projects (High Impact, High Effort) */}
            <div className="glass-panel p-5 rounded-xl border-indigo-200 bg-indigo-50/60 space-y-3 relative overflow-hidden shadow-xs">
              <div className="flex items-center justify-between border-b border-indigo-200/80 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold shadow-xs">
                    <Grid className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-indigo-950 text-sm">Major Projects</h3>
                    <p className="text-[11px] text-indigo-700 font-medium">High Impact (≥5.5) • High Effort (≥5.5)</p>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold bg-indigo-200/80 text-indigo-800 px-2.5 py-1 rounded-full border border-indigo-300/60">
                  {majorProjects.length} Tasks
                </span>
              </div>

              <div className="space-y-2.5">
                {majorProjects.map(m => (
                  <div
                    key={m.id}
                    onClick={() => setSelectedMilestoneId(m.id)}
                    className="p-3 bg-white/90 hover:bg-white rounded-lg border border-indigo-200/80 shadow-2xs hover:shadow-xs transition-all cursor-pointer flex items-center justify-between gap-3 group"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">{m.title}</div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                        <span>Owner: <strong>{m.owner}</strong></span>
                        <span>•</span>
                        <span className="font-mono text-indigo-700 font-semibold">Impact: {m.impact}/10</span>
                      </div>
                    </div>
                    <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">
                      Strategic
                    </span>
                  </div>
                ))}

                {majorProjects.length === 0 && (
                  <p className="text-xs text-slate-500 text-center py-6 italic font-medium">No major projects found in current filter.</p>
                )}
              </div>
            </div>

            {/* Quadrant 3: Fill-ins (Low Impact, Low Effort) */}
            <div className="glass-panel p-5 rounded-xl border-slate-200 bg-slate-50/70 space-y-3 relative overflow-hidden shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-slate-500 text-white flex items-center justify-center font-bold shadow-xs">
                    <Coffee className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">Fill-ins</h3>
                    <p className="text-[11px] text-slate-500 font-medium">Low Impact (&lt;5.5) • Low Effort (&lt;5.5)</p>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold bg-slate-200 text-slate-800 px-2.5 py-1 rounded-full border border-slate-300">
                  {fillIns.length} Tasks
                </span>
              </div>

              <div className="space-y-2.5">
                {fillIns.map(m => (
                  <div
                    key={m.id}
                    onClick={() => setSelectedMilestoneId(m.id)}
                    className="p-3 bg-white/90 hover:bg-white rounded-lg border border-slate-200 shadow-2xs hover:shadow-xs transition-all cursor-pointer flex items-center justify-between gap-3 group"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-900 group-hover:text-slate-700 transition-colors">{m.title}</div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                        <span>Owner: <strong>{m.owner}</strong></span>
                        <span>•</span>
                        <span className="font-mono text-slate-600 font-semibold">Impact: {m.impact}/10</span>
                      </div>
                    </div>
                    <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      Downtime
                    </span>
                  </div>
                ))}

                {fillIns.length === 0 && (
                  <p className="text-xs text-slate-500 text-center py-6 italic font-medium">No fill-in tasks found.</p>
                )}
              </div>
            </div>

            {/* Quadrant 4: Thankless Tasks (Low Impact, High Effort) */}
            <div className="glass-panel p-5 rounded-xl border-rose-200 bg-rose-50/60 space-y-3 relative overflow-hidden shadow-xs">
              <div className="flex items-center justify-between border-b border-rose-200/80 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-rose-500 text-white flex items-center justify-center font-bold shadow-xs">
                    <AlertCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-rose-950 text-sm">Thankless Tasks</h3>
                    <p className="text-[11px] text-rose-700 font-medium">Low Impact (&lt;5.5) • High Effort (≥5.5)</p>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold bg-rose-200/80 text-rose-800 px-2.5 py-1 rounded-full border border-rose-300/60">
                  {thanklessTasks.length} Tasks
                </span>
              </div>

              <div className="space-y-2.5">
                {thanklessTasks.map(m => (
                  <div
                    key={m.id}
                    onClick={() => setSelectedMilestoneId(m.id)}
                    className="p-3 bg-white/90 hover:bg-white rounded-lg border border-rose-200/80 shadow-2xs hover:shadow-xs transition-all cursor-pointer flex items-center justify-between gap-3 group"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-900 group-hover:text-rose-700 transition-colors">{m.title}</div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                        <span>Owner: <strong>{m.owner}</strong></span>
                        <span>•</span>
                        <span className="font-mono text-rose-700 font-semibold">Impact: {m.impact}/10</span>
                      </div>
                    </div>
                    <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-rose-100 text-rose-800">
                      Deprioritize
                    </span>
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
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between flex-wrap gap-2">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Kinetix RICE Prioritization Scorecard Ranking</h3>
              <p className="text-xs text-slate-500">Hover over table headers below to understand how each metric factor is calculated</p>
            </div>
            <span className="text-xs text-indigo-700 font-mono font-bold bg-indigo-50 px-3 py-1 rounded-md border border-indigo-200">
              Score = (Reach × Impact × Confidence) ÷ Effort
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200 text-slate-600 uppercase tracking-wider font-mono font-bold">
                  <th className="py-3 px-4">Rank</th>
                  <th className="py-3 px-4">Milestone</th>

                  {/* Reach Header Tooltip */}
                  <th className="py-3 px-4 relative group cursor-help">
                    <span className="underline decoration-dotted decoration-indigo-400">Reach</span>
                    <div className="absolute left-0 top-full mt-1 hidden group-hover:block z-50 w-52 p-2.5 bg-slate-900 text-white text-[11px] rounded-lg shadow-xl font-sans normal-case">
                      <strong className="text-emerald-300">Reach:</strong> Estimated number of users or customers impacted by this milestone per quarter.
                    </div>
                  </th>

                  {/* Impact Header Tooltip */}
                  <th className="py-3 px-4 relative group cursor-help">
                    <span className="underline decoration-dotted decoration-indigo-400">Impact</span>
                    <div className="absolute left-0 top-full mt-1 hidden group-hover:block z-50 w-56 p-2.5 bg-slate-900 text-white text-[11px] rounded-lg shadow-xl font-sans normal-case">
                      <strong className="text-indigo-300">Impact Multiplier:</strong>
                      <ul className="mt-1 space-y-0.5 text-[10px]">
                        <li>3x = Massive Impact</li>
                        <li>2x = High Impact</li>
                        <li>1x = Medium Impact</li>
                        <li>0.5x = Low Impact</li>
                      </ul>
                    </div>
                  </th>

                  {/* Confidence Header Tooltip */}
                  <th className="py-3 px-4 relative group cursor-help">
                    <span className="underline decoration-dotted decoration-indigo-400">Confidence</span>
                    <div className="absolute left-0 top-full mt-1 hidden group-hover:block z-50 w-56 p-2.5 bg-slate-900 text-white text-[11px] rounded-lg shadow-xl font-sans normal-case">
                      <strong className="text-amber-300">Confidence:</strong> Percentage certainty in your estimates (100% High, 80% Medium, 50% Low data confidence).
                    </div>
                  </th>

                  {/* Effort Header Tooltip */}
                  <th className="py-3 px-4 relative group cursor-help">
                    <span className="underline decoration-dotted decoration-indigo-400">Effort</span>
                    <div className="absolute left-0 top-full mt-1 hidden group-hover:block z-50 w-52 p-2.5 bg-slate-900 text-white text-[11px] rounded-lg shadow-xl font-sans normal-case">
                      <strong className="text-rose-300">Effort:</strong> Estimated person-weeks or story points required by engineering team.
                    </div>
                  </th>

                  {/* RICE Score Header Tooltip */}
                  <th className="py-3 px-4 text-right relative group cursor-help">
                    <span className="underline decoration-dotted decoration-indigo-400">RICE Score</span>
                    <div className="absolute right-0 top-full mt-1 hidden group-hover:block z-50 w-60 p-2.5 bg-slate-900 text-white text-[11px] rounded-lg shadow-xl font-sans normal-case text-left">
                      <strong className="text-emerald-400">Final RICE Score:</strong> High scores indicate maximum user impact per unit of engineering effort.
                    </div>
                  </th>
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
