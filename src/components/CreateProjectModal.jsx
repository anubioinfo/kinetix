import React, { useState } from 'react';
import { useProject } from '../context/ProjectContext';
import { 
  X, 
  Plus, 
  FolderPlus, 
  Sparkles, 
  Layers, 
  CheckCircle2, 
  FileCode, 
  Check, 
  User 
} from 'lucide-react';

export default function CreateProjectModal({ isOpen, onClose }) {
  const { addProject, team, createBlankProjectData } = useProject();

  const [projectMode, setProjectMode] = useState('blank'); // 'blank' | 'template'
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [category, setCategory] = useState('Enterprise Agile');
  const [description, setDescription] = useState('');
  const [owner, setOwner] = useState('Anurag');
  const [selectedMembers, setSelectedMembers] = useState(['u1', 'u2', 'u3', 'u4', 'u5', 'u6', 'u7']);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const generatedCode = code || name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 4) || 'PROJ';

    const memberObjects = selectedMembers.map(uId => {
      const t = team.find(item => item.id === uId) || { name: 'User', role: 'Developer' };
      return {
        userId: uId,
        name: t.name,
        email: `${t.name.toLowerCase()}@keepnote.com`,
        role: t.name === owner ? 'Owner' : 'Editor',
        avatar: t.avatar || 'US',
        color: t.color || '#6366f1'
      };
    });

    const newProj = {
      id: `proj-${Date.now()}`,
      name,
      code: generatedCode,
      category,
      description: description || `Newly created ${projectMode === 'blank' ? 'blank project from scratch' : 'template project'}.`,
      owner,
      createdAt: new Date().toISOString().split('T')[0],
      members: memberObjects
    };

    addProject(newProj, projectMode === 'blank');
    
    // Reset form
    setName('');
    setCode('');
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg p-6 space-y-4 animate-scale-up">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
              <FolderPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Create New Project</h3>
              <p className="text-slate-500 text-xs">Start a blank project from scratch or load an agile template</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Project Setup Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* Mode Selector */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setProjectMode('blank')}
              className={`p-3 rounded-xl border-2 text-left transition-all space-y-1 ${
                projectMode === 'blank' 
                  ? 'border-indigo-600 bg-indigo-50/50 shadow-2xs' 
                  : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
              }`}
            >
              <span className="font-extrabold text-slate-900 block text-xs flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>Blank Project (Scratch)</span>
              </span>
              <span className="text-[11px] text-slate-500 block leading-tight">Start with zero milestones, clean roadmap, & custom goals.</span>
            </button>

            <button
              type="button"
              onClick={() => setProjectMode('template')}
              className={`p-3 rounded-xl border-2 text-left transition-all space-y-1 ${
                projectMode === 'template' 
                  ? 'border-indigo-600 bg-indigo-50/50 shadow-2xs' 
                  : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
              }`}
            >
              <span className="font-extrabold text-slate-900 block text-xs flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-indigo-600" />
                <span>Agile Scrum Template</span>
              </span>
              <span className="text-[11px] text-slate-500 block leading-tight">Pre-populated sample goals, milestones, & team capacity.</span>
            </button>
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">Project Name *</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Project Nova / Mobile App Redesign"
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-bold text-xs focus:outline-hidden focus:border-indigo-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Project Key / Code</label>
              <input 
                type="text" 
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="e.g. NOVA"
                maxLength={6}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 font-mono font-bold text-xs focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Category / Domain</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold text-xs focus:outline-hidden"
              >
                <option value="Enterprise Agile">Enterprise Agile</option>
                <option value="Product Architecture">Product Architecture</option>
                <option value="Mobile Ecosystem">Mobile Ecosystem</option>
                <option value="Financial Tech">Financial Tech</option>
                <option value="AI & Machine Learning">AI & Machine Learning</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Project Owner</label>
              <select
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold text-xs focus:outline-hidden"
              >
                {team.map(t => (
                  <option key={t.id} value={t.name}>{t.name} ({t.role.split(' ')[0]})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Initial Member Access</label>
              <div className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 text-[11px] font-semibold">
                {selectedMembers.length} team members added
              </div>
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">Project Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="High-level product vision, goals, and team deliverables..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-medium text-xs focus:outline-hidden"
            />
          </div>

          <button
            type="submit"
            disabled={!name.trim()}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-40 text-white font-extrabold text-xs transition-all shadow-md flex items-center justify-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Create {projectMode === 'blank' ? 'Blank Project from Scratch' : 'Template Project'}</span>
          </button>
        </form>

      </div>
    </div>
  );
}
