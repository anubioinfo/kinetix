import React, { useState } from 'react';
import { useProject } from '../../context/ProjectContext';
import { X, Edit3, Trash2, ShieldAlert } from 'lucide-react';
import { formatPrettyDate } from '../../utils/dateUtils';

export default function DetailDrawer() {
  const {
    selectedMilestoneId,
    setSelectedMilestoneId,
    milestones,
    goals,
    updateMilestone,
    deleteMilestone,
    setEditingMilestone,
    setIsMilestoneModalOpen,
    dependencyConflicts
  } = useProject();

  const [newFeatureTitle, setNewFeatureTitle] = useState('');

  if (!selectedMilestoneId) return null;

  const milestone = milestones.find(m => m.id === selectedMilestoneId);
  if (!milestone) return null;

  const goal = goals.find(g => g.id === milestone.goalId);
  const milestoneMap = new Map(milestones.map(m => [m.id, m]));

  const predecessors = (milestone.dependencies || []).map(id => milestoneMap.get(id)).filter(Boolean);
  const successors = milestones.filter(m => (m.dependencies || []).includes(milestone.id));

  const conflicts = dependencyConflicts.filter(c => c.milestoneId === milestone.id);

  const handleToggleFeature = (featId) => {
    const updatedFeatures = (milestone.features || []).map(f => 
      f.id === featId ? { ...f, completed: !f.completed } : f
    );
    const completedCount = updatedFeatures.filter(f => f.completed).length;
    const calcProgress = updatedFeatures.length > 0 
      ? Math.round((completedCount / updatedFeatures.length) * 100) 
      : milestone.progress;

    updateMilestone({
      ...milestone,
      features: updatedFeatures,
      progress: calcProgress,
      status: calcProgress === 100 ? 'Completed' : milestone.status
    });
  };

  const handleAddFeature = (e) => {
    e.preventDefault();
    if (!newFeatureTitle.trim()) return;

    const newFeat = {
      id: 'f-' + Date.now(),
      title: newFeatureTitle,
      completed: false,
      points: 3
    };

    const updatedFeatures = [...(milestone.features || []), newFeat];
    updateMilestone({
      ...milestone,
      features: updatedFeatures
    });

    setNewFeatureTitle('');
  };

  const handleDeleteFeature = (featId) => {
    const updatedFeatures = (milestone.features || []).filter(f => f.id !== featId);
    updateMilestone({
      ...milestone,
      features: updatedFeatures
    });
  };

  const handleEditClick = () => {
    setEditingMilestone(milestone);
    setIsMilestoneModalOpen(true);
  };

  const handleDeleteClick = () => {
    if (confirm(`Are you sure you want to delete milestone "${milestone.title}"?`)) {
      deleteMilestone(milestone.id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs">
      <div className="w-full max-w-lg h-full bg-white border-l border-slate-200 shadow-2xl flex flex-col justify-between overflow-hidden animate-slide-left">
        
        {/* Top Sticky Header */}
        <div className="p-5 border-b border-slate-100 bg-slate-50/90 flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-xs font-mono font-bold rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                {milestone.priority}
              </span>
              <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${
                milestone.health === 'On Track' ? 'badge-on-track' : milestone.health === 'At Risk' ? 'badge-at-risk' : 'badge-off-track'
              }`}>
                {milestone.health}
              </span>
            </div>
            <h2 className="text-lg font-extrabold text-slate-900">{milestone.title}</h2>
          </div>

          <button
            onClick={() => setSelectedMilestoneId(null)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 space-y-5 overflow-y-auto flex-1 text-xs">
          
          {/* Conflict Alert Banner */}
          {conflicts.length > 0 && (
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <ShieldAlert className="w-4 h-4 text-amber-600" />
                <span>Schedule Conflict Detected!</span>
              </div>
              {conflicts.map((c, i) => (
                <p key={i} className="text-[11px] leading-tight font-medium">{c.message}</p>
              ))}
            </div>
          )}

          {/* Description */}
          <div className="space-y-1">
            <span className="text-slate-500 font-extrabold uppercase tracking-wider text-[10px]">Description</span>
            <p className="text-slate-700 leading-relaxed text-sm bg-slate-50 p-3 rounded-lg border border-slate-200 font-medium">
              {milestone.description || 'No description provided.'}
            </p>
          </div>

          {/* Strategic Goal Link */}
          {goal && (
            <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-indigo-700 block">Aligned Strategic Goal</span>
                <span className="font-bold text-slate-900">{goal.title}</span>
              </div>
              <span className="px-2 py-1 rounded bg-indigo-100 text-indigo-800 font-mono text-[10px] font-bold">
                {goal.targetQuarter}
              </span>
            </div>
          )}

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <span className="text-slate-500 font-bold block text-[10px]">Start Date</span>
              <span className="text-slate-900 font-mono font-bold">{formatPrettyDate(milestone.startDate)}</span>
            </div>
            <div>
              <span className="text-slate-500 font-bold block text-[10px]">Due Date</span>
              <span className="text-slate-900 font-mono font-bold">{formatPrettyDate(milestone.dueDate)}</span>
            </div>
            <div>
              <span className="text-slate-500 font-bold block text-[10px]">Assigned Lead</span>
              <span className="text-slate-900 font-bold">{milestone.owner}</span>
            </div>
            <div>
              <span className="text-slate-500 font-bold block text-[10px]">Status</span>
              <span className="text-indigo-600 font-bold">{milestone.status}</span>
            </div>
          </div>

          {/* Progress Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between font-bold text-slate-800">
              <span>Execution Progress</span>
              <span className="text-indigo-600 font-mono">{milestone.progress}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={milestone.progress}
              onChange={(e) => updateMilestone({ ...milestone, progress: Number(e.target.value) })}
              className="w-full accent-indigo-600 cursor-pointer"
            />
          </div>

          {/* Sub-features / Epics Checklist */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-extrabold uppercase tracking-wider text-[10px]">Sub-Features / Tasks ({milestone.features?.length || 0})</span>
            </div>

            <div className="space-y-1.5 max-h-44 overflow-y-auto">
              {(milestone.features || []).map(feat => (
                <div
                  key={feat.id}
                  className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between group"
                >
                  <label className="flex items-center gap-2 cursor-pointer flex-1 min-w-0">
                    <input
                      type="checkbox"
                      checked={feat.completed}
                      onChange={() => handleToggleFeature(feat.id)}
                      className="rounded accent-indigo-600"
                    />
                    <span className={`truncate text-xs font-semibold ${feat.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                      {feat.title}
                    </span>
                  </label>
                  <button
                    onClick={() => handleDeleteFeature(feat.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-600 transition-opacity"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Sub-Feature Input */}
            <form onSubmit={handleAddFeature} className="flex gap-2">
              <input
                type="text"
                placeholder="+ Add sub-task title..."
                value={newFeatureTitle}
                onChange={(e) => setNewFeatureTitle(e.target.value)}
                className="flex-1 bg-slate-50 text-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 focus:bg-white focus:outline-none focus:border-indigo-500 font-medium"
              />
              <button
                type="submit"
                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
              >
                Add
              </button>
            </form>
          </div>

          {/* Predecessor & Successor Dependencies */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <div>
              <span className="text-slate-500 font-extrabold uppercase tracking-wider text-[10px] block mb-1">Predecessors (Must finish first)</span>
              <div className="space-y-1">
                {predecessors.length > 0 ? (
                  predecessors.map(p => (
                    <div
                      key={p.id}
                      onClick={() => setSelectedMilestoneId(p.id)}
                      className="p-2 rounded bg-indigo-50 hover:bg-indigo-100 cursor-pointer border border-indigo-200 flex justify-between text-indigo-900 font-bold"
                    >
                      <span className="truncate font-semibold">{p.title}</span>
                      <span className="font-mono text-indigo-600 text-[10px]">{p.dueDate}</span>
                    </div>
                  ))
                ) : (
                  <span className="text-slate-400 italic block font-medium">No predecessor requirements.</span>
                )}
              </div>
            </div>

            <div>
              <span className="text-slate-500 font-extrabold uppercase tracking-wider text-[10px] block mb-1">Successors (Blocked until complete)</span>
              <div className="space-y-1">
                {successors.length > 0 ? (
                  successors.map(s => (
                    <div
                      key={s.id}
                      onClick={() => setSelectedMilestoneId(s.id)}
                      className="p-2 rounded bg-indigo-50 hover:bg-indigo-100 cursor-pointer border border-indigo-200 flex justify-between text-indigo-900 font-bold"
                    >
                      <span className="truncate font-semibold">{s.title}</span>
                      <span className="font-mono text-indigo-600 text-[10px]">{s.startDate}</span>
                    </div>
                  ))
                ) : (
                  <span className="text-slate-400 italic block font-medium">No dependent successor milestones.</span>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/90 flex items-center justify-between gap-3">
          <button
            onClick={handleDeleteClick}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 font-bold transition-all text-xs"
          >
            <Trash2 className="w-4 h-4 text-rose-600" />
            Delete
          </button>

          <button
            onClick={handleEditClick}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-all text-xs"
          >
            <Edit3 className="w-4 h-4" />
            Edit Milestone
          </button>
        </div>

      </div>
    </div>
  );
}
