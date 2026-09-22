import React, { useState } from 'react';
import { useProject } from '../context/ProjectContext';
import { X, Lightbulb } from 'lucide-react';

export default function IdeaModal() {
  const { isIdeaModalOpen, setIsIdeaModalOpen, addIdea } = useProject();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [submittedBy, setSubmittedBy] = useState('');
  const [category, setCategory] = useState('Feature');

  if (!isIdeaModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    addIdea({
      title,
      description,
      submittedBy: submittedBy || 'Stakeholder',
      category
    });

    setIsIdeaModalOpen(false);
    setTitle('');
    setDescription('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="glass-panel w-full max-w-lg rounded-2xl border border-slate-200 shadow-2xl p-6 space-y-4 bg-white">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-500" />
            Submit Feature Idea / Feedback
          </h2>
          <button onClick={() => setIsIdeaModalOpen(false)} className="text-slate-400 hover:text-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 font-bold mb-1">Idea Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Automated Slack Digest of Milestone Progress"
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
              <option value="Feature">Feature</option>
              <option value="Integration">Integration</option>
              <option value="UI / UX Improvement">UI / UX Improvement</option>
              <option value="Automation">Automation</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">Your Name & Role</label>
            <input
              type="text"
              value={submittedBy}
              onChange={(e) => setSubmittedBy(e.target.value)}
              placeholder="e.g. Taylor Reed (Product Manager)"
              className="w-full bg-slate-50 text-slate-900 p-2.5 rounded-lg border border-slate-300 font-medium"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">Detailed Suggestion</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain why this feature will add value..."
              className="w-full bg-slate-50 text-slate-900 p-2.5 rounded-lg border border-slate-300 font-medium"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsIdeaModalOpen(false)}
              className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold"
            >
              Submit Idea
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
