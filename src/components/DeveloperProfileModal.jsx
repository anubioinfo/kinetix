import React from 'react';
import { useProject } from '../context/ProjectContext';
import { X, CheckCircle2, Clock, Zap, Award, Shield, User, Layers, Calendar, Cpu } from 'lucide-react';
import { formatPrettyDate } from '../utils/dateUtils';

export default function DeveloperProfileModal() {
  const {
    isDeveloperModalOpen,
    closeDeveloperProfile,
    selectedDeveloperName,
    team,
    milestones,
    setSelectedMilestoneId
  } = useProject();

  if (!isDeveloperModalOpen || !selectedDeveloperName) return null;

  // Find team member info or construct fallback
  const member = team.find(t => t.name.toLowerCase() === selectedDeveloperName.toLowerCase()) || {
    name: selectedDeveloperName,
    role: 'Software Engineer',
    avatar: selectedDeveloperName.substring(0, 2).toUpperCase(),
    color: '#6366f1',
    capacityHours: 40,
    assignedHours: 35
  };

  // Milestones assigned to this developer
  const devMilestones = milestones.filter(m => m.owner && m.owner.toLowerCase() === selectedDeveloperName.toLowerCase());

  // Calculate metrics
  const completedMilestones = devMilestones.filter(m => m.status === 'Completed').length;
  const inProgressMilestones = devMilestones.filter(m => m.status === 'In Progress').length;
  
  // Aggregate all sub-features/tasks owned by this dev across all milestones
  const allFeatures = devMilestones.flatMap(m => (m.features || []).map(f => ({ ...f, milestoneTitle: m.title })));
  const completedFeaturesCount = allFeatures.filter(f => f.completed).length;

  const capacityPct = Math.min(100, Math.round((member.assignedHours / member.capacityHours) * 100));

  // Determine tech stack tags based on role/milestones
  const techTags = devMilestones.flatMap(m => m.tags || []);
  const uniqueTechTags = Array.from(new Set([
    ...(member.role.includes('Python') ? ['Python', 'FastAPI', 'PostgreSQL', 'Redis'] : []),
    ...(member.role.includes('Frontend') ? ['React', 'TipTap', 'Tailwind', 'IndexedDB'] : []),
    ...(member.role.includes('Mobile') ? ['React Native', 'iOS', 'Android', 'SQLite'] : []),
    ...(member.role.includes('DevOps') ? ['Docker', 'AWS ECS', 'GitHub Actions', 'Terraform'] : []),
    ...(member.role.includes('QA') ? ['PyTest', 'Cypress', 'Locust', 'Automation'] : []),
    ...techTags
  ]));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-3xl overflow-hidden max-h-[90vh] flex flex-col animate-scale-up">
        
        {/* Header Profile Banner */}
        <div className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white relative flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div 
              className="w-16 h-16 rounded-2xl flex items-center justify-center font-extrabold text-2xl shadow-lg border-2 border-white/20 text-white"
              style={{ backgroundColor: member.color || '#6366f1' }}
            >
              {member.avatar || member.name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold tracking-tight">{member.name}</h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/30 text-emerald-300 border border-emerald-400/40">
                  Active Contributor
                </span>
              </div>
              <p className="text-xs text-indigo-200 font-medium mt-0.5">{member.role}</p>
              <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-300">
                <span className="flex items-center gap-1 font-mono">
                  <Clock className="w-3.5 h-3.5 text-indigo-400" />
                  Capacity: {member.assignedHours}/{member.capacityHours} hrs ({capacityPct}%)
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={closeDeveloperProfile}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          
          {/* Key Developer Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 bg-indigo-50/70 rounded-xl border border-indigo-200">
              <div className="flex items-center gap-1.5 text-indigo-700 font-bold text-[11px]">
                <Layers className="w-3.5 h-3.5" />
                <span>Milestones</span>
              </div>
              <div className="text-xl font-extrabold text-slate-900 mt-1">{devMilestones.length}</div>
              <div className="text-[10px] text-slate-500 mt-0.5 font-medium">{completedMilestones} Completed • {inProgressMilestones} Active</div>
            </div>

            <div className="p-3.5 bg-emerald-50/70 rounded-xl border border-emerald-200">
              <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Story Points</span>
              </div>
              <div className="text-xl font-extrabold text-slate-900 mt-1">{completedFeaturesCount} / {allFeatures.length}</div>
              <div className="text-[10px] text-slate-500 mt-0.5 font-medium">Sub-tasks completed</div>
            </div>

            <div className="p-3.5 bg-amber-50/70 rounded-xl border border-amber-200">
              <div className="flex items-center gap-1.5 text-amber-700 font-bold text-[11px]">
                <Zap className="w-3.5 h-3.5" />
                <span>Capacity Util</span>
              </div>
              <div className="text-xl font-extrabold text-slate-900 mt-1">{capacityPct}%</div>
              <div className="text-[10px] text-slate-500 mt-0.5 font-medium">{member.assignedHours} hrs assigned</div>
            </div>

            <div className="p-3.5 bg-purple-50/70 rounded-xl border border-purple-200">
              <div className="flex items-center gap-1.5 text-purple-700 font-bold text-[11px]">
                <Award className="w-3.5 h-3.5" />
                <span>Delivery Score</span>
              </div>
              <div className="text-xl font-extrabold text-slate-900 mt-1">96%</div>
              <div className="text-[10px] text-slate-500 mt-0.5 font-medium">On-time velocity</div>
            </div>
          </div>

          {/* Primary Tech Stack */}
          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-indigo-600" />
              <span>Tech Stack & Primary Skillset</span>
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {uniqueTechTags.map((tag, idx) => (
                <span key={idx} className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 border border-slate-200 font-mono font-bold text-[11px]">
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Assigned Milestones Section */}
          <div className="space-y-3">
            <h3 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-indigo-600" />
              <span>Assigned Milestones & Engineering Deliverables ({devMilestones.length})</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {devMilestones.map(m => (
                <div
                  key={m.id}
                  onClick={() => {
                    closeDeveloperProfile();
                    setSelectedMilestoneId(m.id);
                  }}
                  className="p-3.5 rounded-xl bg-slate-50 hover:bg-indigo-50/60 border border-slate-200 hover:border-indigo-300 transition-all cursor-pointer space-y-2 group shadow-2xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors text-xs">
                      {m.title}
                    </div>
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full whitespace-nowrap ${
                      m.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                      m.status === 'In Progress' ? 'bg-indigo-100 text-indigo-800' :
                      'bg-slate-200 text-slate-700'
                    }`}>
                      {m.status}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 line-clamp-2">{m.description}</p>

                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between text-[10px] font-medium text-slate-500">
                      <span>Progress</span>
                      <span className="font-mono font-bold text-slate-700">{m.progress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${m.progress}%` }} />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1">
                    <span>Due: {formatPrettyDate(m.dueDate)}</span>
                    <span className="font-bold text-indigo-600 group-hover:underline">View Details →</span>
                  </div>
                </div>
              ))}

              {devMilestones.length === 0 && (
                <p className="col-span-2 text-center text-slate-500 py-6 italic font-medium">No active milestones assigned to {member.name}.</p>
              )}
            </div>
          </div>

          {/* Sub-features & Tasks */}
          {allFeatures.length > 0 && (
            <div className="space-y-3 pt-2">
              <h3 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Assigned Sub-Features & Engineering Tasks ({allFeatures.length})</span>
              </h3>
              <div className="space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-200 max-h-48 overflow-y-auto">
                {allFeatures.map(f => (
                  <div key={f.id} className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-100 text-xs">
                    <div className="flex items-center gap-2">
                      <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        f.completed ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {f.completed ? '✓' : '•'}
                      </span>
                      <span className={`font-medium ${f.completed ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                        {f.title}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded">
                      {f.milestoneTitle}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-medium">Developer Profile • Kinetix Resource Engine</span>
          <button
            onClick={closeDeveloperProfile}
            className="px-4 py-1.5 rounded-lg bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors text-xs"
          >
            Close Profile
          </button>
        </div>

      </div>
    </div>
  );
}
