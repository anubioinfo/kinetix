import React, { useState, useRef, useEffect } from 'react';
import { useProject } from '../context/ProjectContext';
import { X, Lightbulb, Plus, User, Check, Sparkles } from 'lucide-react';

export default function IdeaModal() {
  const { isIdeaModalOpen, setIsIdeaModalOpen, addIdea, team } = useProject();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [submittedBy, setSubmittedBy] = useState('');
  const [category, setCategory] = useState('AI & Vision');
  const [customCategory, setCustomCategory] = useState('');
  const [isCustomCategoryMode, setIsCustomCategoryMode] = useState(false);

  // Autocomplete state for Name & Role
  const [showNameSuggestions, setShowNameSuggestions] = useState(false);
  const nameInputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Initial Category List
  const defaultCategories = [
    'AI & Vision',
    'AI & Voice',
    'Security & Encryption',
    'Mobile & GPS',
    'Feature',
    'Integration',
    'UI / UX Improvement',
    'Automation',
    'Cloud Infrastructure',
    'CUSTOM_OPTION'
  ];

  // Close autocomplete on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) && nameInputRef.current && !nameInputRef.current.contains(event.target)) {
        setShowNameSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isIdeaModalOpen) return null;

  // Filter team members based on input
  const matchingMembers = team.filter(m => {
    if (!submittedBy.trim()) return true;
    const q = submittedBy.toLowerCase();
    return m.name.toLowerCase().includes(q) || m.role.toLowerCase().includes(q);
  });

  const handleCategorySelect = (val) => {
    if (val === 'CUSTOM_OPTION') {
      setIsCustomCategoryMode(true);
      setCategory('Custom Category');
    } else {
      setIsCustomCategoryMode(false);
      setCategory(val);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const finalCategory = isCustomCategoryMode && customCategory.trim() ? customCategory.trim() : category;

    addIdea({
      title,
      description,
      submittedBy: submittedBy.trim() || 'Anurag (Product Lead)',
      category: finalCategory
    });

    setIsIdeaModalOpen(false);
    setTitle('');
    setDescription('');
    setSubmittedBy('');
    setCustomCategory('');
    setIsCustomCategoryMode(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 shadow-2xl p-6 space-y-4 bg-white animate-scale-up">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-md">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Submit Feature Idea / Feedback
              </h2>
              <p className="text-xs text-slate-500 font-medium">Gather stakeholder requests, vote, & convert to roadmap milestones</p>
            </div>
          </div>

          <button 
            onClick={() => setIsIdeaModalOpen(false)} 
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* Title */}
          <div>
            <label className="block text-slate-700 font-bold mb-1">Idea Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. CV Based Installation Monitoring & Camera Stream AI"
              className="w-full bg-slate-50 text-slate-900 p-3 rounded-xl border border-slate-200 focus:outline-hidden focus:border-amber-500 font-extrabold text-xs"
            />
          </div>

          {/* Category Dropdown with Custom Add Option */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-slate-700 font-bold">Category</label>
              {!isCustomCategoryMode && (
                <button
                  type="button"
                  onClick={() => setIsCustomCategoryMode(true)}
                  className="text-[11px] text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>+ Add Custom Category</span>
                </button>
              )}
            </div>

            {isCustomCategoryMode ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  required
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  placeholder="Type custom category (e.g. AI & Vision)..."
                  className="flex-1 bg-slate-50 text-slate-900 p-2.5 rounded-xl border border-amber-300 font-bold focus:outline-hidden"
                />
                <button
                  type="button"
                  onClick={() => {
                    setIsCustomCategoryMode(false);
                    setCategory('AI & Vision');
                  }}
                  className="px-3 py-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 font-bold text-xs"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <select
                value={category}
                onChange={(e) => handleCategorySelect(e.target.value)}
                className="w-full bg-slate-50 text-slate-900 p-2.5 rounded-xl border border-slate-200 font-bold text-xs focus:outline-hidden"
              >
                {defaultCategories.map((cat, idx) => (
                  <option key={idx} value={cat}>
                    {cat === 'CUSTOM_OPTION' ? '+ Add Custom Category...' : cat}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* AUTOCOMPLETE: Your Name & Role */}
          <div className="relative">
            <label className="block text-slate-700 font-bold mb-1">Your Name & Role (Team Autocomplete)</label>
            <div className="relative">
              <input
                ref={nameInputRef}
                type="text"
                value={submittedBy}
                onChange={(e) => {
                  setSubmittedBy(e.target.value);
                  setShowNameSuggestions(true);
                }}
                onFocus={() => setShowNameSuggestions(true)}
                placeholder="Type name (e.g. Anurag, Akshay, Jitendra, Ram)..."
                className="w-full bg-slate-50 text-slate-900 p-2.5 pl-9 rounded-xl border border-slate-200 font-bold text-xs focus:outline-hidden focus:border-amber-500"
              />
              <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>

            {/* Floating Autocomplete Dropdown List */}
            {showNameSuggestions && matchingMembers.length > 0 && (
              <div 
                ref={dropdownRef}
                className="absolute left-0 right-0 mt-1.5 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 max-h-48 overflow-y-auto animate-scale-up divide-y divide-slate-100 text-xs font-medium"
              >
                <div className="px-3 py-1 text-[10px] uppercase font-bold text-slate-400">Suggested Team Members:</div>
                {matchingMembers.map((member) => (
                  <button
                    key={member.id}
                    type="button"
                    onClick={() => {
                      setSubmittedBy(`${member.name} (${member.role})`);
                      setShowNameSuggestions(false);
                    }}
                    className="w-full text-left px-3.5 py-2 hover:bg-amber-50 text-slate-800 flex items-center justify-between transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-6 h-6 rounded-md flex items-center justify-center font-black text-white text-[10px]"
                        style={{ backgroundColor: member.color || '#6366f1' }}
                      >
                        {member.avatar}
                      </div>
                      <div>
                        <strong className="text-slate-900">{member.name}</strong>
                        <span className="text-slate-500 text-[11px] block">{member.role}</span>
                      </div>
                    </div>
                    <Check className="w-3.5 h-3.5 text-amber-500 opacity-0 group-hover:opacity-100" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-slate-700 font-bold mb-1">Detailed Suggestion & Scope</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain how this feature will improve customer workflow..."
              className="w-full bg-slate-50 text-slate-900 p-3 rounded-xl border border-slate-200 font-medium text-xs focus:outline-hidden"
            />
          </div>

          {/* Form Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsIdeaModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:opacity-40 text-white font-extrabold shadow-md transition-all flex items-center gap-1.5 text-xs"
            >
              <Sparkles className="w-4 h-4" />
              <span>Submit Feature Idea</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
