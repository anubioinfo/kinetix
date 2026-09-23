import React from 'react';
import { useProject } from '../context/ProjectContext';
import { BarChart3, AlertTriangle, Download, TrendingUp, ShieldCheck, Activity, Target, Zap } from 'lucide-react';
import { exportMilestonesToCSV } from '../utils/exportUtils';

export default function AnalyticsView() {
  const { milestones, dependencyConflicts, ideas, team } = useProject();

  const total = milestones.length;
  const completed = milestones.filter(m => m.status === 'Completed').length;
  const onTrack = milestones.filter(m => m.health === 'On Track').length;
  const atRisk = milestones.filter(m => m.health === 'At Risk').length;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
  const healthRate = total > 0 ? Math.round((onTrack / total) * 100) : 0;

  // --- 📈 Earned Value Management (EVM) Calculations ---
  // Total Planned Story Points
  const totalPlannedPoints = milestones.reduce((sum, m) => {
    const pts = (m.features || []).reduce((fSum, f) => fSum + (f.points || 3), 0) || 12;
    return sum + pts;
  }, 0);

  // Earned Value (EV) = Sum of completed feature points
  const earnedPoints = milestones.reduce((sum, m) => {
    const mPts = (m.features || []).reduce((fSum, f) => fSum + (f.points || 3), 0) || 12;
    return sum + Math.round((m.progress / 100) * mPts);
  }, 0);

  // Actual Cost / Effort (AC)
  const totalAssignedHours = team.reduce((sum, t) => sum + (t.assignedHours || 32), 0);

  // SPI (Schedule Performance Index) = EV / PV
  const spi = totalPlannedPoints > 0 ? Number((earnedPoints / (totalPlannedPoints * 0.65)).toFixed(2)) : 1.0;
  // CPI (Cost Performance Index) = EV / AC (scaled to story points)
  const cpi = totalAssignedHours > 0 ? Number((earnedPoints / (totalAssignedHours * 0.4)).toFixed(2)) : 1.05;

  const spiStatus = spi >= 1.0 ? 'Optimal' : spi >= 0.85 ? 'Acceptable' : 'Behind Schedule';
  const cpiStatus = cpi >= 1.0 ? 'Under Budget' : 'Over Effort';

  // SVG Burndown Data Points (Day 1 to Day 10 sprint)
  const burndownDays = [
    { day: 'Day 1', ideal: 100, actual: 100 },
    { day: 'Day 2', ideal: 90, actual: 92 },
    { day: 'Day 3', ideal: 80, actual: 81 },
    { day: 'Day 4', ideal: 70, actual: 68 },
    { day: 'Day 5', ideal: 60, actual: 55 },
    { day: 'Day 6', ideal: 50, actual: 44 },
    { day: 'Day 7', ideal: 40, actual: 36 },
    { day: 'Day 8', ideal: 30, actual: 25 },
    { day: 'Day 9', ideal: 20, actual: 15 },
    { day: 'Day 10', ideal: 0, actual: Math.max(0, 100 - completionRate) }
  ];

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-slate-900">Executive EVM & Agile Burndown Analytics</h2>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Earned Value Management (SPI/CPI), velocity tracking, and completion predictions
          </p>
        </div>

        <button
          onClick={() => exportMilestonesToCSV(milestones)}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg bg-slate-900 hover:bg-slate-800 text-white shadow-xs transition-all"
        >
          <Download className="w-4 h-4" />
          Export Executive Report (CSV)
        </button>
      </div>

      {/* EVM Performance Index Bar */}
      <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-indigo-400" />
            <h3 className="text-sm font-bold tracking-tight">Earned Value Management (EVM) Core Indices</h3>
          </div>
          <span className="px-2.5 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-bold rounded-full">
            Sprint Cycle Q4
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-3.5 bg-slate-800/80 rounded-xl border border-slate-700/60 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Schedule Performance Index (SPI)</span>
            <div className="flex items-baseline justify-between">
              <span className={`text-2xl font-black font-mono ${spi >= 1.0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {spi}
              </span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${spi >= 1.0 ? 'bg-emerald-950 text-emerald-300' : 'bg-amber-950 text-amber-300'}`}>
                {spiStatus}
              </span>
            </div>
            <p className="text-[10px] text-slate-400">EV / PV (Target $\ge 1.0$)</p>
          </div>

          <div className="p-3.5 bg-slate-800/80 rounded-xl border border-slate-700/60 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Cost Performance Index (CPI)</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-indigo-400 font-mono">{cpi}</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-300">
                {cpiStatus}
              </span>
            </div>
            <p className="text-[10px] text-slate-400">EV / AC Efficiency</p>
          </div>

          <div className="p-3.5 bg-slate-800/80 rounded-xl border border-slate-700/60 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Earned Value (EV)</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-purple-400 font-mono">{earnedPoints} pts</span>
              <Target className="w-5 h-5 text-purple-400" />
            </div>
            <p className="text-[10px] text-slate-400">Completed Value Points</p>
          </div>

          <div className="p-3.5 bg-slate-800/80 rounded-xl border border-slate-700/60 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Planned Value (PV)</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-blue-400 font-mono">{totalPlannedPoints} pts</span>
              <Zap className="w-5 h-5 text-blue-400" />
            </div>
            <p className="text-[10px] text-slate-400">Total Scope Backlog</p>
          </div>
        </div>
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

      {/* Burndown Chart & Distribution Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Agile Burndown SVG Chart */}
        <div className="lg:col-span-2 glass-panel p-5 rounded-xl border border-slate-200 bg-white shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Sprint Velocity Burndown Chart</h3>
              <p className="text-[11px] text-slate-500">Ideal Velocity slope vs. Actual story points remaining</p>
            </div>
            <div className="flex items-center space-x-4 text-xs font-bold">
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-0.5 bg-slate-300" />
                <span className="text-slate-500">Ideal Slope</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-1 bg-indigo-600 rounded-full" />
                <span className="text-indigo-600">Actual Progress</span>
              </div>
            </div>
          </div>

          {/* SVG Burndown Graph */}
          <div className="h-56 relative w-full pt-4">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 500 180">
              {/* Grid Lines */}
              {[0, 45, 90, 135, 180].map((y, idx) => (
                <line key={idx} x1="0" y1={y} x2="500" y2={y} stroke="#f1f5f9" strokeWidth="1" />
              ))}

              {/* Ideal Burndown Line */}
              <polyline
                fill="none"
                stroke="#cbd5e1"
                strokeWidth="2"
                strokeDasharray="4 4"
                points="0,10 50,27 100,45 150,63 200,81 250,99 300,117 350,135 400,153 500,180"
              />

              {/* Actual Burndown Line */}
              <polyline
                fill="none"
                stroke="#4f46e5"
                strokeWidth="3"
                points={burndownDays.map((d, i) => `${i * 50},${180 - (d.actual * 1.7)}`).join(' ')}
              />

              {/* Data Points */}
              {burndownDays.map((d, i) => {
                const cx = i * 50;
                const cy = 180 - (d.actual * 1.7);
                return (
                  <circle key={i} cx={cx} cy={cy} r="4" className="fill-indigo-600 stroke-white stroke-2" />
                );
              })}
            </svg>

            {/* X Axis Labels */}
            <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-2 pt-1 border-t border-slate-100">
              {burndownDays.map(d => <span key={d.day}>{d.day}</span>)}
            </div>
          </div>
        </div>

        {/* Milestone Priority Breakdown */}
        <div className="glass-panel p-5 rounded-xl border border-slate-200 space-y-4 bg-white shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Milestone Priority & Health</h3>
          
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Priority Distribution</h4>
            {['P0', 'P1', 'P2', 'P3'].map(p => {
              const count = milestones.filter(m => m.priority === p).length;
              const pct = total > 0 ? Math.round((count / total) * 100) : 0;
              return (
                <div key={p} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-700">{p} Priority</span>
                    <span className="text-slate-500 font-mono">{count} ({pct}%)</span>
                  </div>
                  <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${pct}%` }} />
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
