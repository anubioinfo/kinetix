import React, { useState, useEffect } from 'react';
import { useProject } from '../context/ProjectContext';
import { X } from 'lucide-react';
import { hasCircularDependency } from '../utils/dependencyUtils';

export default function MilestoneModal() {
  const {
    isMilestoneModalOpen,
    setIsMilestoneModalOpen,
    editingMilestone,
    addMilestone,
    updateMilestone,
    milestones,
    goals,
    team
  } = useProject();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [goalId, setGoalId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState('Not Started');
  const [health, setHealth] = useState('On Track');
  const [priority, setPriority] = useState('P1');
  const [impact, setImpact] = useState(7);
  const [effort, setEffort] = useState(4);
  const [owner, setOwner] = useState('');
  const [tags, setTags] = useState('');
  const [progress, setProgress] = useState(0);
  const [dependencies, setDependencies] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (editingMilestone) {
      setTitle(editingMilestone.title || '');
      setDescription(editingMilestone.description || '');
      setGoalId(editingMilestone.goalId || (goals[0]?.id || ''));
      setStartDate(editingMilestone.startDate || '');
      setDueDate(editingMilestone.dueDate || '');
      setStatus(editingMilestone.status || 'Not Started');
      setHealth(editingMilestone.health || 'On Track');
      setPriority(editingMilestone.priority || 'P1');
      setImpact(editingMilestone.impact || 7);
      setEffort(editingMilestone.effort || 4);
      setOwner(editingMilestone.owner || (team[0]?.name || ''));
      setTags((editingMilestone.tags || []).join(', '));
      setProgress(editingMilestone.progress || 0);
      setDependencies(editingMilestone.dependencies || []);
    } else {
      setTitle('');
      setDescription('');
      setGoalId(goals[0]?.id || '');
      const today = new Date().toISOString().split('T')[0];
      const thirtyDays = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      setStartDate(today);
      setDueDate(thirtyDays);
      setStatus('Not Started');
      setHealth('On Track');
      setPriority('P1');
      setImpact(7);
      setEffort(4);
      setOwner(team[0]?.name || 'Sarah Jenkins');
      setTags('Roadmap, Feature');
      setProgress(0);
      setDependencies([]);
    }
    setErrorMsg('');
  }, [editingMilestone, isMilestoneModalOpen, goals, team]);

  if (!isMilestoneModalOpen) return null;

  const handleToggleDependency = (candidateId) => {
    if (dependencies.includes(candidateId)) {
      setDependencies(prev => prev.filter(id => id !== candidateId));
      setErrorMsg('');
    } else {
      if (editingMilestone && hasCircularDependency(milestones, editingMilestone.id, candidateId)) {
        setErrorMsg('Cannot add dependency: Creates a circular dependency loop!');
        return;
      }
      setDependencies(prev => [...prev, candidateId]);
      setErrorMsg('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Milestone Title is required');
      return;
    }

    const payload = {
      ...(editingMilestone || {}),
      title,
      description,
      goalId,
      startDate,
      dueDate,
      status,
      health,
      priority,
      impact: Number(impact),
      effort: Number(effort),
      owner,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      progress: Number(progress),
      dependencies
    };

    if (editingMilestone) {
      updateMilestone(payload);
    } else {
      addMilestone(payload);
    }

    setIsMilestoneModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
      <div className="glass-panel w-full max-w-2xl rounded-2xl border border-slate-200 shadow-2xl p-6 space-y-5 my-8 bg-white">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-lg font-bold text-slate-900">
            {editingMilestone ? 'Edit Milestone Details' : 'Create New Milestone'}
          </h2>
          <button
            onClick={() => setIsMilestoneModalOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* Title */}
          <div>
            <label className="block text-slate-700 font-bold mb-1">Milestone Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. SOC2 Type II Audit & Security Compliance"
              className="w-full bg-slate-50 text-slate-900 p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-indigo-500 focus:bg-white font-medium"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-slate-700 font-bold mb-1">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide milestone background context and acceptance criteria..."
              className="w-full bg-slate-50 text-slate-900 p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-indigo-500 focus:bg-white font-medium"
            />
          </div>

          {/* Strategic Goal & Owner */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Strategic Goal Alignment</label>
              <select
                value={goalId}
                onChange={(e) => setGoalId(e.target.value)}
                className="w-full bg-slate-50 text-slate-900 p-2.5 rounded-lg border border-slate-300 focus:bg-white font-medium"
              >
                {goals.map(g => (
                  <option key={g.id} value={g.id}>{g.title}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Owner / Lead</label>
              <select
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
                className="w-full bg-slate-50 text-slate-900 p-2.5 rounded-lg border border-slate-300 focus:bg-white font-medium"
              >
                {team.map(t => (
                  <option key={t.id} value={t.name}>{t.name} ({t.role})</option>
                ))}
              </select>
            </div>
          </div>

          {/* Dates & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Start Date</label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-slate-50 text-slate-900 p-2 rounded-lg border border-slate-300 focus:bg-white font-medium"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Due Date</label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-slate-50 text-slate-900 p-2 rounded-lg border border-slate-300 focus:bg-white font-medium"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Execution Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-slate-50 text-slate-900 p-2 rounded-lg border border-slate-300 focus:bg-white font-medium"
              >
                <option value="Not Started">Not Started</option>
                <option value="In Progress">In Progress</option>
                <option value="Under Review">Under Review</option>
                <option value="Completed">Completed</option>
                <option value="Blocked">Blocked</option>
              </select>
            </div>
          </div>

          {/* Priorities & Impact/Effort */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Priority Flag</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full bg-white text-slate-900 p-2 rounded border border-slate-300 font-bold"
              >
                <option value="P0">P0 - Critical</option>
                <option value="P1">P1 - High</option>
                <option value="P2">P2 - Medium</option>
                <option value="P3">P3 - Low</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Health State</label>
              <select
                value={health}
                onChange={(e) => setHealth(e.target.value)}
                className="w-full bg-white text-slate-900 p-2 rounded border border-slate-300 font-bold"
              >
                <option value="On Track">On Track</option>
                <option value="At Risk">At Risk</option>
                <option value="Off Track">Off Track</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Impact (1-10)</label>
              <input
                type="number"
                min="1"
                max="10"
                value={impact}
                onChange={(e) => setImpact(e.target.value)}
                className="w-full bg-white text-slate-900 p-2 rounded border border-slate-300 font-bold"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Effort (1-10)</label>
              <input
                type="number"
                min="1"
                max="10"
                value={effort}
                onChange={(e) => setEffort(e.target.value)}
                className="w-full bg-white text-slate-900 p-2 rounded border border-slate-300 font-bold"
              />
            </div>
          </div>

          {/* Predecessor Dependencies Picker */}
          <div className="space-y-2">
            <label className="block text-slate-700 font-bold">Predecessor Dependencies (Must finish first)</label>
            <div className="max-h-36 overflow-y-auto p-2 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
              {milestones
                .filter(m => !editingMilestone || m.id !== editingMilestone.id)
                .map(m => {
                  const isSelected = dependencies.includes(m.id);
                  return (
                    <div
                      key={m.id}
                      onClick={() => handleToggleDependency(m.id)}
                      className={`p-2 rounded cursor-pointer transition-colors flex items-center justify-between ${
                        isSelected ? 'bg-indigo-100 border border-indigo-300 text-indigo-900 font-bold' : 'hover:bg-slate-200 text-slate-800'
                      }`}
                    >
                      <span className="font-semibold truncate">{m.title}</span>
                      <span className="text-[10px] font-mono text-slate-500 font-bold">Due: {m.dueDate}</span>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsMilestoneModalOpen(false)}
              className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold shadow-xs"
            >
              {editingMilestone ? 'Save Changes' : 'Create Milestone'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
