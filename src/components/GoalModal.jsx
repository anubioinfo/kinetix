import React, { useState, useEffect } from 'react';
import { useProject } from '../context/ProjectContext';
import { X, Target } from 'lucide-react';

export default function GoalModal() {
  const { isGoalModalOpen, setIsGoalModalOpen, editingGoal, addGoal, updateGoal } = useProject();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Growth & Revenue');
  const [targetQuarter, setTargetQuarter] = useState('Q4 2026');

  useEffect(() => {
    if (editingGoal) {
      setTitle(editingGoal.title || '');
      setDescription(editingGoal.description || '');
      setCategory(editingGoal.category || 'Growth & Revenue');
      setTargetQuarter(editingGoal.targetQuarter || 'Q4 2026');
    } else {
      setTitle('');
      setDescription('');
      setCategory('Growth & Revenue');
      setTargetQuarter('Q4 2026');
    }
  }, [editingGoal, isGoalModalOpen]);

  if (!isGoalModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const payload = {
      ...(editingGoal || {}),
      title,
      description,
      category,
      targetQuarter,
      color: editingGoal?.color || '#6366f1'
    };

    if (editingGoal) {
      updateGoal(payload);
    } else {
      addGoal(payload);
    }
    setIsGoalModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="glass-panel w-full max-w-lg rounded-2xl border border-slate-200 shadow-2xl p-6 space-y-4 bg-white">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Target className="w-5 h-5 text-indigo-600" />
            {editingGoal ? 'Edit Strategic Goal' : 'Create Strategic Goal'}
          </h2>
          <button onClick={() => setIsGoalModalOpen(false)} className="text-slate-400 hover:text-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 font-bold mb-1">Goal Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Achieve 99.99% Uptime & High Availability"
              className="w-full bg-slate-50 text-slate-900 p-2.5 rounded-lg border border-slate-300 focus:bg-white font-medium"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-50 text-slate-900 p-2.5 rounded-lg border border-slate-300 font-medium"
            >
              <option value="Growth & Revenue">Growth & Revenue</option>
              <option value="Security & Compliance">Security & Compliance</option>
              <option value="Product Innovation">Product Innovation</option>
              <option value="Customer Success">Customer Success</option>
              <option value="Infrastructure">Infrastructure</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">Target Quarter</label>
            <input
              type="text"
              value={targetQuarter}
              onChange={(e) => setTargetQuarter(e.target.value)}
              placeholder="Q4 2026"
              className="w-full bg-slate-50 text-slate-900 p-2.5 rounded-lg border border-slate-300 font-medium"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detail high level strategic impact..."
              className="w-full bg-slate-50 text-slate-900 p-2.5 rounded-lg border border-slate-300 font-medium"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsGoalModalOpen(false)}
              className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
            >
              Save Goal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
