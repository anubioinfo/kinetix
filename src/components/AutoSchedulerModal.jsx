import React from 'react';
import { useProject } from '../context/ProjectContext';
import { Bot, Zap, X, Check, Users, AlertTriangle, ArrowRight, ShieldCheck } from 'lucide-react';

export default function AutoSchedulerModal() {
  const {
    isAutoSchedulerOpen,
    closeAutoScheduler,
    autoScheduleAndRebalance,
    team,
    milestones
  } = useProject();

  if (!isAutoSchedulerOpen) return null;

  // Compute overloaded members
  const overloadedMembers = team.filter(t => t.assignedHours > t.capacityHours);
  const underutilizedMembers = team.filter(t => t.assignedHours < t.capacityHours);

  const handleApplyRebalance = () => {
    autoScheduleAndRebalance();
    closeAutoScheduler();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-indigo-500/20 rounded-xl text-indigo-400">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-tight">AI Smart Auto-Scheduler</h3>
              <p className="text-[11px] text-slate-400">Velocity Rebalancer & Load Optimization Engine</p>
            </div>
          </div>
          <button
            onClick={closeAutoScheduler}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 text-xs">
          {/* Diagnostic Status Box */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <div className="flex items-center justify-between font-bold text-slate-800">
              <span>Workload Capacity Diagnostic</span>
              <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded-full text-[10px]">
                {milestones.length} Active Milestones
              </span>
            </div>

            {overloadedMembers.length > 0 ? (
              <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg flex items-start space-x-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-[11px]">
                    {overloadedMembers.length} Team Member(s) Exceeding 100% Capacity:
                  </p>
                  <p className="text-[10px] mt-0.5">
                    {overloadedMembers.map(m => `${m.name} (${Math.round((m.assignedHours/m.capacityHours)*100)}%)`).join(', ')}
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span className="font-bold">Team capacity is currently optimal!</span>
              </div>
            )}
          </div>

          {/* Proposed AI Rebalance Plan */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-800 flex items-center justify-between">
              <span>Proposed AI Workload Distribution</span>
              <span className="text-[10px] text-indigo-600 font-semibold">Matched by Tech Stack & Capacity</span>
            </h4>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {team.map(member => {
                const loadPct = Math.round((member.assignedHours / member.capacityHours) * 100);
                const isOver = loadPct > 100;

                return (
                  <div key={member.id} className="p-2.5 bg-white border border-slate-200 rounded-xl flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-7 h-7 bg-slate-900 text-white rounded-full flex items-center justify-center font-extrabold text-xs">
                        {member.avatar}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{member.name}</p>
                        <p className="text-[10px] text-slate-400">{member.role}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 text-right">
                      <div>
                        <p className={`font-black text-xs ${isOver ? 'text-rose-600' : 'text-slate-700'}`}>
                          {member.assignedHours} / {member.capacityHours} hrs ({loadPct}%)
                        </p>
                        {/* Micro Progress Bar */}
                        <div className="w-20 h-1 bg-slate-100 rounded-full mt-1 overflow-hidden">
                          <div
                            className={`h-full ${isOver ? 'bg-rose-500' : 'bg-indigo-600'}`}
                            style={{ width: `${Math.min(100, loadPct)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={closeAutoScheduler}
            className="px-3.5 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold text-xs rounded-lg shadow-2xs"
          >
            Cancel
          </button>
          <button
            onClick={handleApplyRebalance}
            className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg flex items-center space-x-1.5 shadow-xs transition-all"
          >
            <Zap className="w-4 h-4 text-indigo-400" />
            <span>Apply AI Auto-Rebalance</span>
          </button>
        </div>
      </div>
    </div>
  );
}
