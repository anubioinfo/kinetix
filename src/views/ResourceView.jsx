import React, { useState, useRef } from 'react';
import { useProject } from '../context/ProjectContext';
import { Users, AlertTriangle, CheckCircle, ExternalLink, Award, UserPlus, Upload, Download, FileSpreadsheet, X, Check } from 'lucide-react';
import { downloadTeamSampleTemplate, parseCSVToTeamMembers, exportTeamToCSV } from '../utils/exportUtils';

export default function ResourceView() {
  const { team, milestones, openDeveloperProfile, addTeamMember, bulkImportTeamMembers, openAutoScheduler } = useProject();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [capacityHours, setCapacityHours] = useState(40);
  const [assignedHours, setAssignedHours] = useState(0);
  const [techStack, setTechStack] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const fileInputRef = useRef(null);

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    addTeamMember({
      name,
      role: role.trim() || 'Software Engineer',
      capacityHours: Number(capacityHours) || 40,
      assignedHours: Number(assignedHours) || 0,
      techStack: techStack ? techStack.split(/[,;]/).map(s => s.trim()).filter(Boolean) : ['React', 'Node.js']
    });

    setName('');
    setRole('');
    setCapacityHours(40);
    setAssignedHours(0);
    setTechStack('');
    setIsAddModalOpen(false);

    setFeedbackMsg(`Successfully added team member "${name}"`);
    setTimeout(() => setFeedbackMsg(''), 4000);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result;
      const parsedMembers = parseCSVToTeamMembers(text);
      if (parsedMembers.length > 0) {
        bulkImportTeamMembers(parsedMembers);
        setFeedbackMsg(`Successfully imported ${parsedMembers.length} team members from CSV!`);
        setTimeout(() => setFeedbackMsg(''), 4000);
      } else {
        alert('Could not parse any valid team members from the CSV file. Please make sure headers match: Name, Role, CapacityHours, AssignedHours, TechStack');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner & Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold shadow-xs">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">Developer Metrics & Team Capacity Dashboard</h2>
              <p className="text-xs text-slate-500 font-medium">Manage developer allocations, add new team members, or bulk import via CSV template</p>
            </div>
          </div>
        </div>

        {/* Action Controls - Sleek & Uniform Neutral Styling */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* AI Auto-Rebalance Button */}
          <button
            onClick={openAutoScheduler}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-xs hover:opacity-90 transition-all cursor-pointer"
            title="Launch AI Auto-Scheduler to balance workloads"
          >
            <span>⚡ AI Auto-Rebalance</span>
          </button>

          {/* Add Team Member Manual Modal Button (Primary Dark) */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg bg-slate-900 hover:bg-slate-800 text-white shadow-xs transition-all cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>+ Add Team Member</span>
          </button>

          {/* Download CSV Template Button (Secondary Outline) */}
          <button
            onClick={downloadTeamSampleTemplate}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-2xs transition-all cursor-pointer"
            title="Download CSV Team Template with sample data"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>CSV Template</span>
          </button>

          {/* Upload CSV Input Button (Secondary Outline) */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-2xs transition-all cursor-pointer"
            title="Upload CSV Team List"
          >
            <Upload className="w-3.5 h-3.5 text-slate-500" />
            <span>Upload Team CSV</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.txt"
            onChange={handleFileUpload}
            className="hidden"
          />

          {/* Export Team CSV */}
          <button
            onClick={() => exportTeamToCSV(team)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-2xs transition-all cursor-pointer"
            title="Export full team roster to CSV"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-slate-500" />
            <span>Export Roster</span>
          </button>

        </div>
      </div>

      {feedbackMsg && (
        <div className="p-3 px-4 rounded-xl bg-slate-900 text-white text-xs font-semibold flex items-center gap-2 shadow-2xs animate-fade-in">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Team Allocation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {team.map((member) => {
          const memberMilestones = milestones.filter(m => m.owner === member.name);
          const isOverCapacity = member.assignedHours > member.capacityHours;
          const percent = Math.min(100, Math.round((member.assignedHours / member.capacityHours) * 100));

          return (
            <div
              key={member.id}
              className={`p-5 rounded-2xl border space-y-3.5 shadow-2xs bg-white transition-all ${
                isOverCapacity ? 'border-rose-200 bg-rose-50/20' : 'border-slate-200/90 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div 
                  onClick={() => openDeveloperProfile(member.name)}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <div
                    className="w-9 h-9 rounded-xl bg-slate-900 text-slate-100 flex items-center justify-center font-extrabold text-xs shadow-2xs group-hover:bg-indigo-600 transition-colors"
                  >
                    {member.avatar || (member.name || 'U').substring(0, 1).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors flex items-center gap-1.5">
                      <span>{member.name}</span>
                      <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 text-indigo-600 transition-opacity" />
                    </h3>
                    <p className="text-[11px] text-slate-500 font-medium">{member.role}</p>
                  </div>
                </div>

                {isOverCapacity ? (
                  <span className="px-2.5 py-0.5 text-[11px] font-semibold rounded-md bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 text-rose-600" />
                    Over Capacity (+{member.assignedHours - member.capacityHours}h)
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 text-[11px] font-semibold rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-emerald-600" />
                    Optimal Load
                  </span>
                )}
              </div>

              {/* Slim Progress Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-semibold">
                  <span className="text-slate-500">Assigned Weekly Load</span>
                  <span className={`font-mono ${isOverCapacity ? 'text-rose-700 font-bold' : 'text-slate-700'}`}>
                    {member.assignedHours} / {member.capacityHours} hrs ({percent}%)
                  </span>
                </div>
                <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isOverCapacity ? 'bg-rose-500' : 'bg-indigo-600'
                    }`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>

              {/* Tech Stack Pills */}
              {member.techStack && member.techStack.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-0.5">
                  {member.techStack.map((tech, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-slate-50 text-slate-600 font-mono text-[10px] font-medium border border-slate-200">
                      {tech}
                    </span>
                  ))}
                </div>
              )}

              {/* Assigned Milestones List */}
              <div className="space-y-1.5 pt-2.5 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-500 block">Assigned Milestones ({memberMilestones.length})</span>
                  <button
                    onClick={() => openDeveloperProfile(member.name)}
                    className="text-[10px] font-bold text-slate-600 hover:text-indigo-600 flex items-center gap-1 transition-colors"
                  >
                    <Award className="w-3 h-3 text-slate-400" />
                    <span>View Profile →</span>
                  </button>
                </div>
                
                <div className="space-y-1">
                  {memberMilestones.map(m => (
                    <div key={m.id} className="p-1.5 px-2.5 rounded-md bg-slate-50/80 border border-slate-200/60 flex items-center justify-between text-[11px]">
                      <span className="font-medium text-slate-800 truncate">{m.title}</span>
                      <span className="text-slate-400 font-mono text-[10px]">{m.status}</span>
                    </div>
                  ))}

                  {memberMilestones.length === 0 && (
                    <span className="text-slate-400 italic text-[11px] block pt-0.5">No active milestones assigned.</span>
                  )}
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Add Team Member Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg p-6 space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-extrabold text-slate-900">Add New Team Member</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs font-medium">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Anil Kumar"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 text-slate-900 p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-indigo-500 focus:bg-white font-semibold"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Role / Job Title</label>
                <input
                  type="text"
                  placeholder="e.g. Senior AI/CV Engineer"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-slate-50 text-slate-900 p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-indigo-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Weekly Capacity (Hours)</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={capacityHours}
                    onChange={(e) => setCapacityHours(e.target.value)}
                    className="w-full bg-slate-50 text-slate-900 p-2 rounded-lg border border-slate-300 font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Assigned Hours</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={assignedHours}
                    onChange={(e) => setAssignedHours(e.target.value)}
                    className="w-full bg-slate-50 text-slate-900 p-2 rounded-lg border border-slate-300 font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Tech Stack Skills (Comma Separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Python, OpenCV, PyTorch, YOLOv8"
                  value={techStack}
                  onChange={(e) => setTechStack(e.target.value)}
                  className="w-full bg-slate-50 text-slate-900 p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-indigo-500 focus:bg-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold shadow-xs"
                >
                  Add Team Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

