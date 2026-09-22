import React from 'react';
import { useProject } from '../context/ProjectContext';
import { Target, Plus, ChevronRight } from 'lucide-react';

export default function StrategyView() {
  const { goals, milestones, setIsGoalModalOpen, setEditingGoal, setSelectedMilestoneId } = useProject();

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-slate-900">Strategic Goals & Corporate Initiatives</h2>
          </div>
          <p className="text-xs text-slate-500 font-medium">Align engineering milestones with enterprise strategic objectives</p>
        </div>

        <button
          onClick={() => {
            setEditingGoal(null);
            setIsGoalModalOpen(true);
          }}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Strategic Goal
        </button>
      </div>

      {/* Strategic Goals Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {goals.map((goal) => {
          const linkedMilestones = milestones.filter(m => m.goalId === goal.id);
          const completedCount = linkedMilestones.filter(m => m.status === 'Completed').length;
          const avgProgress = linkedMilestones.length > 0 
            ? Math.round(linkedMilestones.reduce((acc, curr) => acc + curr.progress, 0) / linkedMilestones.length)
            : goal.progress;

          return (
            <div
              key={goal.id}
              className="glass-panel p-6 rounded-2xl border border-slate-200 space-y-4 shadow-xs bg-white hover:border-indigo-300 transition-all"
            >
              {/* Goal Title Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: goal.color }} />
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{goal.category}</span>
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900">{goal.title}</h3>
                </div>

                <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-slate-100 text-slate-700 border border-slate-200 font-mono">
                  {goal.targetQuarter}
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed font-medium">{goal.description}</p>

              {/* Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-600">Goal Alignment Progress</span>
                  <span className="text-indigo-600 font-mono">{avgProgress}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-teal-400 transition-all duration-500"
                    style={{ width: `${avgProgress}%` }}
                  />
                </div>
              </div>

              {/* Linked Milestones Section */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span>Linked Milestones ({linkedMilestones.length})</span>
                  <span className="text-slate-500">{completedCount} of {linkedMilestones.length} Completed</span>
                </div>

                <div className="space-y-2">
                  {linkedMilestones.map((ms) => (
                    <div
                      key={ms.id}
                      onClick={() => setSelectedMilestoneId(ms.id)}
                      className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 hover:border-indigo-300 cursor-pointer transition-all flex items-center justify-between text-xs group shadow-2xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-500 font-mono text-[10px]">{ms.priority}</span>
                        <span className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{ms.title}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                          ms.health === 'On Track' ? 'badge-on-track' : ms.health === 'At Risk' ? 'badge-at-risk' : 'badge-off-track'
                        }`}>
                          {ms.progress}%
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600" />
                      </div>
                    </div>
                  ))}

                  {linkedMilestones.length === 0 && (
                    <p className="text-xs text-slate-400 italic py-2 font-medium">No milestones linked to this goal yet.</p>
                  )}
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
