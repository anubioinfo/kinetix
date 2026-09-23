import React, { useState } from 'react';
import { useProject } from '../context/ProjectContext';
import { 
  FolderKanban, 
  Plus, 
  ShieldCheck, 
  Users, 
  CheckCircle2, 
  ArrowRight, 
  Calendar, 
  User, 
  Lock, 
  FolderPlus,
  Sparkles,
  Layers
} from 'lucide-react';
import ProjectAccessModal from '../components/ProjectAccessModal';
import CreateProjectModal from '../components/CreateProjectModal';

export default function ProjectsView() {
  const { 
    projects, 
    currentProjectId, 
    switchProject, 
    milestones, 
    openDeveloperProfile 
  } = useProject();

  const [selectedAccessProject, setSelectedAccessProject] = useState(null);
  const [isAccessModalOpen, setIsAccessModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleOpenAccess = (project) => {
    setSelectedAccessProject(project);
    setIsAccessModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white shadow-xl border border-indigo-900/50 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/30 border border-indigo-400/30 flex items-center justify-center text-indigo-300 shadow-md">
            <FolderKanban className="w-7 h-7 text-indigo-300" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold flex items-center gap-2">
              <span>Projects Directory & User Access Hub</span>
              <span className="text-xs uppercase tracking-wider bg-indigo-500/20 text-indigo-300 px-2.5 py-0.5 rounded-full border border-indigo-400/30 font-mono">
                Multi-Tenant Workspace
              </span>
            </h2>
            <p className="text-xs text-indigo-200 mt-1 font-medium">
              Initialize new projects from scratch, switch active workspace contexts, & grant granular role-based permissions per project.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>+ Create New Project from Scratch</span>
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((proj) => {
          const isActive = proj.id === currentProjectId;
          const memberList = proj.members || [];
          const ownerMember = memberList.find(m => m.role === 'Owner') || { name: proj.owner };

          return (
            <div 
              key={proj.id}
              className={`bg-white rounded-2xl border-2 shadow-sm flex flex-col justify-between p-6 transition-all relative overflow-hidden ${
                isActive 
                  ? 'border-indigo-600 ring-2 ring-indigo-500/20 shadow-md' 
                  : 'border-slate-200 hover:border-indigo-300'
              }`}
            >
              {isActive && (
                <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-extrabold uppercase px-3 py-1 rounded-bl-xl shadow-2xs flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Active Workspace</span>
                </div>
              )}

              <div className="space-y-4">
                {/* Card Title & Code */}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200">
                      {proj.code}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-slate-500 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded">
                      {proj.category}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-slate-900 text-lg leading-snug">{proj.name}</h3>
                  <p className="text-slate-500 text-xs mt-1.5 leading-relaxed">{proj.description}</p>
                </div>

                {/* Owner & Created Date */}
                <div className="flex items-center justify-between text-xs text-slate-600 border-t border-slate-100 pt-3 font-medium">
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Owner: <strong>{proj.owner}</strong></span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono">
                    <Calendar className="w-3 h-3" />
                    <span>{proj.createdAt}</span>
                  </div>
                </div>

                {/* Assigned Users Badges */}
                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider block">
                    Access Permissions ({memberList.length} members):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {memberList.map((m) => (
                      <div 
                        key={m.userId} 
                        className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-50 border border-slate-200 text-[10px] font-bold text-slate-700"
                      >
                        <span 
                          className="w-2 h-2 rounded-full inline-block"
                          style={{ backgroundColor: m.color || '#6366f1' }}
                        />
                        <span>{m.name}</span>
                        <span className="text-slate-400 font-normal">({m.role})</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Actions */}
              <div className="pt-5 border-t border-slate-100 flex items-center gap-2 mt-4">
                {isActive ? (
                  <button
                    disabled
                    className="flex-1 py-2.5 rounded-xl bg-indigo-50 text-indigo-700 font-extrabold text-xs border border-indigo-200 flex items-center justify-center gap-1.5 cursor-default"
                  >
                    <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                    <span>Active Project</span>
                  </button>
                ) : (
                  <button
                    onClick={() => switchProject(proj.id)}
                    className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs transition-colors shadow-2xs flex items-center justify-center gap-1.5"
                  >
                    <ArrowRight className="w-4 h-4 text-indigo-400" />
                    <span>Switch to Project</span>
                  </button>
                )}

                <button
                  onClick={() => handleOpenAccess(proj)}
                  className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs border border-slate-200 transition-colors flex items-center gap-1.5"
                  title="Manage User Access & Roles"
                >
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                  <span>Access Roles</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Modals */}
      <ProjectAccessModal
        isOpen={isAccessModalOpen}
        onClose={() => setIsAccessModalOpen(false)}
        project={selectedAccessProject}
      />

      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

    </div>
  );
}
