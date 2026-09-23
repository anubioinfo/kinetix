import React, { useState } from 'react';
import { useProject } from '../context/ProjectContext';
import { 
  X, 
  UserPlus, 
  Users, 
  ShieldCheck, 
  Key, 
  CheckCircle2, 
  Trash2, 
  User, 
  Mail, 
  Lock, 
  Sparkles 
} from 'lucide-react';

export default function ProjectAccessModal({ isOpen, onClose, project }) {
  const { updateProjectAccess, team } = useProject();

  const [members, setMembers] = useState(project?.members || []);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('Editor');
  const [statusMsg, setStatusMsg] = useState('');

  if (!isOpen || !project) return null;

  const handleRoleChange = (userId, newRole) => {
    const updated = members.map(m => m.userId === userId ? { ...m, role: newRole } : m);
    setMembers(updated);
    updateProjectAccess(project.id, updated);
    setStatusMsg(`Updated role for user to ${newRole}`);
  };

  const handleRemoveMember = (userId) => {
    const updated = members.filter(m => m.userId !== userId);
    setMembers(updated);
    updateProjectAccess(project.id, updated);
    setStatusMsg('User access revoked');
  };

  const handleAddMember = (e) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;

    const existingTeam = team.find(t => t.name.toLowerCase() === newMemberName.toLowerCase());
    const initials = newMemberName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'US';
    const color = existingTeam ? existingTeam.color : '#6366f1';

    const newM = {
      userId: `u-${Date.now()}`,
      name: newMemberName,
      email: newMemberEmail || `${newMemberName.toLowerCase().replace(/\s+/g, '')}@keepnote.com`,
      role: newMemberRole,
      avatar: initials,
      color
    };

    const updated = [...members, newM];
    setMembers(updated);
    updateProjectAccess(project.id, updated);

    setNewMemberName('');
    setNewMemberEmail('');
    setStatusMsg(`Granted ${newMemberRole} access to ${newMemberName}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-scale-up">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-400/30 flex items-center justify-center text-indigo-300 shadow-md">
              <ShieldCheck className="w-6 h-6 text-indigo-300" />
            </div>
            <div>
              <h2 className="text-base font-extrabold flex items-center gap-2">
                <span>Manage Project Access & Permissions</span>
                <span className="text-[10px] font-mono bg-indigo-500/30 text-indigo-300 px-2 py-0.5 rounded border border-indigo-400/30 uppercase">
                  {project.code}
                </span>
              </h2>
              <p className="text-xs text-indigo-200 font-medium">Control who can view, edit, or manage <strong>{project.name}</strong></p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 bg-slate-50/50">
          
          {/* Add New Team Member Form */}
          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-3">
            <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <UserPlus className="w-4 h-4 text-indigo-600" />
              <span>Grant New User Access</span>
            </h3>

            <form onSubmit={handleAddMember} className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
              <div>
                <input 
                  type="text" 
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  placeholder="User Name (e.g. Dinesh)"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 font-medium focus:outline-hidden focus:border-indigo-600"
                />
              </div>

              <div>
                <input 
                  type="email" 
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  placeholder="email@keepnote.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 font-medium focus:outline-hidden focus:border-indigo-600"
                />
              </div>

              <div className="flex gap-2">
                <select
                  value={newMemberRole}
                  onChange={(e) => setNewMemberRole(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-slate-800 font-bold focus:outline-hidden"
                >
                  <option value="Admin">Admin</option>
                  <option value="Editor">Editor</option>
                  <option value="Viewer">Viewer</option>
                </select>

                <button
                  type="submit"
                  disabled={!newMemberName.trim()}
                  className="flex-1 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-bold transition-colors shadow-2xs text-xs whitespace-nowrap"
                >
                  Grant Access
                </button>
              </div>
            </form>
          </div>

          {statusMsg && (
            <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{statusMsg}</span>
            </div>
          )}

          {/* Current Members List */}
          <div className="space-y-3">
            <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider flex items-center justify-between">
              <span>Project Members & Permission Matrix ({members.length})</span>
              <span className="text-[10px] text-slate-400 font-normal">Changes save automatically</span>
            </h3>

            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs divide-y divide-slate-100 text-xs">
              {members.map((m) => (
                <div key={m.userId} className="p-3.5 flex items-center justify-between gap-3 hover:bg-slate-50/80 transition-colors">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-white text-xs shadow-xs shrink-0"
                      style={{ backgroundColor: m.color || '#6366f1' }}
                    >
                      {m.avatar}
                    </div>
                    <div>
                      <div className="font-extrabold text-slate-900 flex items-center gap-1.5">
                        <span>{m.name}</span>
                        {m.role === 'Owner' && (
                          <span className="text-[9px] font-bold bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full border border-purple-200">
                            Project Owner
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-500">{m.email}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {m.role === 'Owner' ? (
                      <span className="px-3 py-1 bg-slate-100 text-slate-700 font-extrabold rounded-lg border border-slate-200 text-xs">
                        Full Owner Control
                      </span>
                    ) : (
                      <>
                        <select
                          value={m.role}
                          onChange={(e) => handleRoleChange(m.userId, e.target.value)}
                          className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-extrabold text-slate-800 text-xs focus:outline-hidden focus:border-indigo-600"
                        >
                          <option value="Admin">Admin (Full Access)</option>
                          <option value="Editor">Editor (Edit Milestones)</option>
                          <option value="Viewer">Viewer (Read-Only)</option>
                        </select>

                        <button
                          onClick={() => handleRemoveMember(m.userId)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Revoke User Access"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
