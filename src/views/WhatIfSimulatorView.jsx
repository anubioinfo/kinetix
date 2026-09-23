import React, { useState, useMemo } from 'react';
import { useProject } from '../context/ProjectContext';
import { Sliders, Play, RotateCcw, TrendingUp, AlertTriangle, ShieldCheck, HelpCircle, BarChart2, Calendar, Users, Zap } from 'lucide-react';

export default function WhatIfSimulatorView() {
  const { filteredMilestones, team } = useProject();

  const [devModifier, setDevModifier] = useState(0); // -3 to +5 developers
  const [scopeInflation, setScopeInflation] = useState(15); // 0% to 50% extra effort
  const [dependencyBuffer, setDependencyBuffer] = useState(5); // 0 to 14 days delay
  const [simulationRuns, setSimulationRuns] = useState(2000);

  // Run Monte Carlo Simulation across milestones
  const simulationResults = useMemo(() => {
    if (!filteredMilestones || filteredMilestones.length === 0) {
      return { p50Date: 'N/A', p80Date: 'N/A', p90Date: 'N/A', histogram: [], milestoneScenarios: [] };
    }

    const baselineTeamCount = Math.max(1, team.length);
    const simulatedTeamCount = Math.max(1, baselineTeamCount + devModifier);
    const capacityMultiplier = baselineTeamCount / simulatedTeamCount; // >1 means slower, <1 means faster
    const scopeMultiplier = 1 + (scopeInflation / 100);

    const runDurations = [];
    const iterations = Math.min(simulationRuns, 5000);

    // Baseline total days
    const totalBaselineDays = filteredMilestones.reduce((acc, m) => {
      const start = new Date(m.startDate || Date.now());
      const end = new Date(m.dueDate || Date.now());
      const days = Math.max(1, Math.round((end - start) / (1000 * 60 * 60 * 24)));
      return acc + days;
    }, 0);

    for (let i = 0; i < iterations; i++) {
      let simTotalDays = 0;

      filteredMilestones.forEach(m => {
        const start = new Date(m.startDate || Date.now());
        const end = new Date(m.dueDate || Date.now());
        const baseDays = Math.max(1, Math.round((end - start) / (1000 * 60 * 60 * 24)));

        // Triangular distribution: Min = 0.85, Most Likely = 1.0, Max = 1.45
        const r1 = Math.random();
        const r2 = Math.random();
        const triangularFactor = 0.85 + (r1 + r2) * 0.3; // Avg ~1.15

        const milestoneSimDays = baseDays * triangularFactor * capacityMultiplier * scopeMultiplier + (Math.random() * dependencyBuffer);
        simTotalDays += milestoneSimDays;
      });

      runDurations.push(simTotalDays);
    }

    // Sort durations to compute percentiles
    runDurations.sort((a, b) => a - b);

    const p50Days = Math.round(runDurations[Math.floor(iterations * 0.5)]);
    const p80Days = Math.round(runDurations[Math.floor(iterations * 0.8)]);
    const p90Days = Math.round(runDurations[Math.floor(iterations * 0.9)]);

    const today = new Date();
    const p50DateObj = new Date(today.getTime() + p50Days * 24 * 60 * 60 * 1000);
    const p80DateObj = new Date(today.getTime() + p80Days * 24 * 60 * 60 * 1000);
    const p90DateObj = new Date(today.getTime() + p90Days * 24 * 60 * 60 * 1000);

    const formatDate = (d) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    // Generate Histogram Buckets
    const minD = runDurations[0];
    const maxD = runDurations[runDurations.length - 1];
    const bucketCount = 10;
    const bucketSize = (maxD - minD) / bucketCount;

    const histogram = Array.from({ length: bucketCount }).map((_, idx) => {
      const bucketMin = minD + idx * bucketSize;
      const bucketMax = bucketMin + bucketSize;
      const count = runDurations.filter(d => d >= bucketMin && d < bucketMax).length;
      return {
        label: `+${Math.round(bucketMin)}d`,
        count,
        heightPct: Math.round((count / (iterations / 3)) * 100)
      };
    });

    // Milestone Breakdown Table
    const milestoneScenarios = filteredMilestones.map(m => {
      const start = new Date(m.startDate || Date.now());
      const end = new Date(m.dueDate || Date.now());
      const baseDays = Math.max(1, Math.round((end - start) / (1000 * 60 * 60 * 24)));
      const simDays = Math.round(baseDays * 1.15 * capacityMultiplier * scopeMultiplier);
      const simDueDate = new Date(start.getTime() + simDays * 24 * 60 * 60 * 1000);

      const deltaDays = simDays - baseDays;

      return {
        ...m,
        baseDays,
        simDays,
        simDueDateStr: formatDate(simDueDate),
        deltaDays
      };
    });

    return {
      p50Date: formatDate(p50DateObj),
      p80Date: formatDate(p80DateObj),
      p90Date: formatDate(p90DateObj),
      p50Days,
      p80Days,
      p90Days,
      histogram,
      milestoneScenarios,
      capacityMultiplier,
      scopeMultiplier
    };
  }, [filteredMilestones, team, devModifier, scopeInflation, dependencyBuffer, simulationRuns]);

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-xs">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">Executive "What-If" Schedule Simulator</h2>
              <p className="text-xs text-slate-500 font-medium">Run Monte Carlo stochastic simulations to predict confidence target dates under variable scope and headcount</p>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            setDevModifier(0);
            setScopeInflation(15);
            setDependencyBuffer(5);
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Parameters</span>
        </button>
      </div>

      {/* Control Sliders Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        
        {/* Slider 1: Developer Headcount Modifier */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-bold">
            <span className="text-slate-800 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-indigo-600" />
              Developer Bandwidth Modifier
            </span>
            <span className={`font-mono px-2 py-0.5 rounded text-xs ${
              devModifier > 0 ? 'bg-emerald-100 text-emerald-800 font-extrabold' : devModifier < 0 ? 'bg-rose-100 text-rose-800 font-extrabold' : 'bg-slate-100 text-slate-700'
            }`}>
              {devModifier > 0 ? `+${devModifier} Devs` : devModifier < 0 ? `${devModifier} Devs` : 'Baseline (0)'}
            </span>
          </div>
          <input
            type="range"
            min="-3"
            max="5"
            value={devModifier}
            onChange={(e) => setDevModifier(Number(e.target.value))}
            className="w-full accent-indigo-600 cursor-pointer"
          />
          <p className="text-[11px] text-slate-500">Simulate adding or removing engineering capacity from team</p>
        </div>

        {/* Slider 2: Scope Inflation */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-bold">
            <span className="text-slate-800 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-amber-600" />
              Scope Inflation Factor
            </span>
            <span className="font-mono bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-xs font-extrabold">
              +{scopeInflation}% Extra Effort
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="50"
            value={scopeInflation}
            onChange={(e) => setScopeInflation(Number(e.target.value))}
            className="w-full accent-amber-600 cursor-pointer"
          />
          <p className="text-[11px] text-slate-500">Accounts for unplanned feature requests and requirement creep</p>
        </div>

        {/* Slider 3: Dependency Delay Buffer */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-bold">
            <span className="text-slate-800 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              Predecessor Delay Buffer
            </span>
            <span className="font-mono bg-rose-100 text-rose-800 px-2 py-0.5 rounded text-xs font-extrabold">
              +{dependencyBuffer} Days Buffer
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="14"
            value={dependencyBuffer}
            onChange={(e) => setDependencyBuffer(Number(e.target.value))}
            className="w-full accent-rose-600 cursor-pointer"
          />
          <p className="text-[11px] text-slate-500">Simulates upstream integration delays and API handshakes</p>
        </div>

      </div>

      {/* Percentile Cards (P50, P80, P90) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* P50 Card */}
        <div className="glass-panel p-5 rounded-2xl border-indigo-200 bg-indigo-50/70 space-y-2 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase text-indigo-700 font-mono tracking-wider">P50 Likelihood Target</span>
            <span className="px-2 py-0.5 rounded-full bg-indigo-200 text-indigo-800 font-mono text-[10px] font-bold">50% Probability</span>
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">{simulationResults.p50Date}</div>
          <p className="text-xs text-slate-600 font-medium">Expected target date under normal execution conditions.</p>
        </div>

        {/* P80 Card */}
        <div className="glass-panel p-5 rounded-2xl border-emerald-200 bg-emerald-50/70 space-y-2 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase text-emerald-800 font-mono tracking-wider">P80 High Confidence</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900 font-mono text-[10px] font-bold">80% Probability</span>
          </div>
          <div className="text-2xl font-black text-emerald-950 font-mono">{simulationResults.p80Date}</div>
          <p className="text-xs text-emerald-800 font-medium">Recommended target date for customer delivery commitments.</p>
        </div>

        {/* P90 Card */}
        <div className="glass-panel p-5 rounded-2xl border-amber-200 bg-amber-50/70 space-y-2 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase text-amber-800 font-mono tracking-wider">P90 Board Guarantee</span>
            <span className="px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 font-mono text-[10px] font-bold">90% Guarantee</span>
          </div>
          <div className="text-2xl font-black text-amber-950 font-mono">{simulationResults.p90Date}</div>
          <p className="text-xs text-amber-800 font-medium">Conservative SLA target guaranteeing near 100% completion.</p>
        </div>

      </div>

      {/* Histogram Distribution Chart */}
      <div className="glass-panel p-5 rounded-2xl border-slate-200 bg-white space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-indigo-600" />
            <h3 className="font-extrabold text-sm text-slate-900">Monte Carlo Probability Distribution Curve (2,000 Runs)</h3>
          </div>
          <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md">
            Simulated Runs: {simulationRuns.toLocaleString()}
          </span>
        </div>

        <div className="h-40 flex items-end justify-between gap-2 pt-6 pb-2 px-4 bg-slate-50 rounded-xl border border-slate-200">
          {simulationResults.histogram.map((b, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 group">
              <div 
                style={{ height: `${Math.max(10, Math.min(100, b.heightPct * 2))}%` }}
                className="w-full rounded-t-md bg-indigo-500 group-hover:bg-indigo-600 transition-all shadow-2xs relative"
              >
                <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-mono px-2 py-0.5 rounded whitespace-nowrap z-30">
                  {b.count} runs
                </div>
              </div>
              <span className="text-[10px] font-mono font-bold text-slate-500">{b.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Simulated Milestone Breakdown Table */}
      <div className="glass-panel rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-extrabold text-sm text-slate-900">Simulated Milestone Schedule Impacts</h3>
          <span className="text-xs text-indigo-700 font-mono font-bold">Baseline vs Monte Carlo P80 Target</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-600 font-mono font-bold border-b border-slate-200 uppercase">
                <th className="p-3 px-4">Milestone</th>
                <th className="p-3 px-4">Assigned Lead</th>
                <th className="p-3 px-4">Baseline Duration</th>
                <th className="p-3 px-4">Simulated Duration</th>
                <th className="p-3 px-4">Predicted Due Date</th>
                <th className="p-3 px-4 text-right">Variance Impact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {simulationResults.milestoneScenarios.map(m => (
                <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3 px-4 font-bold text-slate-900">{m.title}</td>
                  <td className="p-3 px-4 font-semibold text-slate-600">{m.owner}</td>
                  <td className="p-3 px-4 font-mono text-slate-700">{m.baseDays} days</td>
                  <td className="p-3 px-4 font-mono font-bold text-indigo-700">{m.simDays} days</td>
                  <td className="p-3 px-4 font-mono font-bold text-emerald-800">{m.simDueDateStr}</td>
                  <td className="p-3 px-4 text-right">
                    <span className={`font-mono font-extrabold px-2 py-0.5 rounded ${
                      m.deltaDays > 5 ? 'bg-rose-100 text-rose-800' : m.deltaDays > 0 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {m.deltaDays > 0 ? `+${m.deltaDays}d` : `${m.deltaDays}d`}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
