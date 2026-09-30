import React, { useState, useMemo } from 'react';
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
  Layers,
  Search,
  Filter,
  Download,
  FileJson,
  FileSpreadsheet,
  AlertTriangle,
  TrendingUp,
  Activity,
  XCircle,
  RefreshCw
} from 'lucide-react';
import ProjectAccessModal from '../components/ProjectAccessModal';
import CreateProjectModal from '../components/CreateProjectModal';

export default function ProjectsView() {
  const { 
    projects, 
    currentProjectId, 
    currentProject,
    switchProject, 
    milestones, 
    aiRiskAlerts,
    addNotification,
    openDeveloperProfile 
  } = useProject();

  const [selectedAccessProject, setSelectedAccessProject] = useState(null);
  const [isAccessModalOpen, setIsAccessModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [ownerFilter, setOwnerFilter] = useState('all');

  const handleOpenAccess = (project) => {
    setSelectedAccessProject(project);
    setIsAccessModalOpen(true);
  };

  // Categories & Owners for Filter Dropdowns
  const categories = useMemo(() => {
    const set = new Set(projects.map(p => p.category).filter(Boolean));
    return ['all', ...Array.from(set)];
  }, [projects]);

  const owners = useMemo(() => {
    const set = new Set(projects.map(p => p.owner).filter(Boolean));
    return ['all', ...Array.from(set)];
  }, [projects]);

  // Filtered Projects List
  const filteredProjects = useMemo(() => {
    return projects.filter(proj => {
      const matchesSearch = !searchQuery || 
        proj.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        proj.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (proj.description && proj.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (proj.owner && proj.owner.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory = categoryFilter === 'all' || proj.category === categoryFilter;
      const matchesOwner = ownerFilter === 'all' || proj.owner === ownerFilter;

      return matchesSearch && matchesCategory && matchesOwner;
    });
  }, [projects, searchQuery, categoryFilter, ownerFilter]);

  // Quick Workspace Summary Stats
  const workspaceStats = useMemo(() => {
    const totalWorkspaces = projects.length;
    const totalMilestones = milestones.length;
    const completedMilestones = milestones.filter(m => m.status === 'Completed' || m.progress === 100).length;
    const inProgressMilestones = milestones.filter(m => m.status === 'In Progress').length;
    const riskCount = milestones.filter(m => m.health === 'At Risk' || m.health === 'Off Track').length + aiRiskAlerts.length;

    const avgVelocity = milestones.length > 0
      ? Math.round(milestones.reduce((acc, m) => acc + (m.progress || 0), 0) / milestones.length)
      : 0;

    return {
      totalWorkspaces,
      totalMilestones,
      completedMilestones,
      inProgressMilestones,
      riskCount,
      avgVelocity
    };
  }, [projects, milestones, aiRiskAlerts]);

  // Export Workspace Data Function (JSON)
  const handleExportJSON = () => {
    const exportData = {
      exportedAt: new Date().toISOString(),
      activeWorkspaceId: currentProjectId,
      workspaces: projects.map(p => ({
        id: p.id,
        name: p.name,
        code: p.code,
        category: p.category,
        owner: p.owner,
        createdAt: p.createdAt,
        description: p.description,
        memberCount: (p.members || []).length,
        members: p.members
      })),
      activeMilestones: milestones.map(m => ({
        id: m.id,
        title: m.title,
        status: m.status,
        health: m.health,
        progress: m.progress,
        owner: m.owner
      }))
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `kinetix_workspaces_export_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    if (addNotification) {
      addNotification('Workspace Data Exported', 'JSON export of all workspace metadata generated successfully.', 'success', 'projects');
    }
  };

  // Export Workspace Data Function (CSV)
  const handleExportCSV = () => {
    let csv = 'Workspace ID,Code,Name,Category,Owner,Created At,Member Count,Description\n';
    projects.forEach(p => {
      const desc = (p.description || '').replace(/"/g, '""');
      csv += `"${p.id}","${p.code}","${p.name}","${p.category || ''}","${p.owner || ''}","${p.createdAt || ''}",${(p.members || []).length},"${desc}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `kinetix_workspaces_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    if (addNotification) {
      addNotification('Workspace CSV Exported', 'CSV summary of all active workspaces downloaded successfully.', 'success', 'projects');
    }
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
              <span>Workspaces Directory & User Access Hub</span>
              <span className="text-xs uppercase tracking-wider bg-indigo-500/20 text-indigo-300 px-2.5 py-0.5 rounded-full border border-indigo-400/30 font-mono">
                Multi-Tenant Workspace
              </span>
            </h2>
            <p className="text-xs text-indigo-200 mt-1 font-medium">
              Initialize new workspaces from scratch, switch active workspace contexts, & grant granular role-based permissions per workspace.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Export Dropdown / Buttons */}
          <button
            onClick={handleExportJSON}
            className="px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-indigo-200 hover:text-white font-bold text-xs border border-indigo-500/30 transition-all flex items-center gap-1.5 shadow-sm"
            title="Export Workspaces Data as JSON"
          >
            <FileJson className="w-3.5 h-3.5 text-indigo-400" />
            <span>JSON</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-emerald-300 hover:text-white font-bold text-xs border border-emerald-500/30 transition-all flex items-center gap-1.5 shadow-sm"
            title="Export Workspaces Data as CSV"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>CSV</span>
          </button>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>+ Create New Workspace</span>
          </button>
        </div>
      </div>

      {/* Workspace Quick Summary Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Workspaces</div>
            <div className="text-xl font-extrabold text-slate-900 flex items-center gap-1.5">
              <span>{workspaceStats.totalWorkspaces}</span>
              <span className="text-[10px] font-mono text-indigo-600 font-bold bg-indigo-50 px-1.5 py-0.5 rounded">
                Active: {currentProject?.code}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Active Milestones</div>
            <div className="text-xl font-extrabold text-slate-900 flex items-center gap-1.5">
              <span>{workspaceStats.totalMilestones}</span>
              <span className="text-[10px] font-mono text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
                {workspaceStats.completedMilestones} Done
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Risk & Health Alerts</div>
            <div className="text-xl font-extrabold text-slate-900 flex items-center gap-1.5">
              <span>{workspaceStats.riskCount}</span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${workspaceStats.riskCount > 0 ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>
                {workspaceStats.riskCount > 0 ? 'Action Needed' : 'Nominal'}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Workspace Velocity</div>
            <div className="text-xl font-extrabold text-slate-900 flex items-center gap-1.5">
              <span>{workspaceStats.avgVelocity}%</span>
              <span className="text-[10px] font-mono text-purple-600 font-bold bg-purple-50 px-1.5 py-0.5 rounded">
                Avg Progress
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar Bar */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search workspaces by name, code, owner, description..."
            className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <XCircle className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
            <Filter className="w-3.5 h-3.5 text-indigo-600" />
            <span>Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="py-1.5 px-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              {categories.map(c => (
                <option key={c} value={c}>
                  {c === 'all' ? 'All Categories' : c}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
            <span>Owner:</span>
            <select
              value={ownerFilter}
              onChange={(e) => setOwnerFilter(e.target.value)}
              className="py-1.5 px-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              {owners.map(o => (
                <option key={o} value={o}>
                  {o === 'all' ? 'All Owners' : o}
                </option>
              ))}
            </select>
          </div>

          {(searchQuery || categoryFilter !== 'all' || ownerFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setCategoryFilter('all');
                setOwnerFilter('all');
              }}
              className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs transition-colors flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 p-12 text-center">
          <FolderKanban className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No matching workspaces found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search query or reset category/owner filter filters to view all workspaces.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setCategoryFilter('all');
              setOwnerFilter('all');
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-indigo-50 text-indigo-600 font-bold text-xs hover:bg-indigo-100 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((proj) => {
            const isActive = proj.id === currentProjectId;
            const memberList = proj.members || [];

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
                          key={m.userId || m.email || m.name} 
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
                      <span>Active Workspace</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => switchProject(proj.id)}
                      className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs transition-colors shadow-2xs flex items-center justify-center gap-1.5"
                    >
                      <ArrowRight className="w-4 h-4 text-indigo-400" />
                      <span>Switch to Workspace</span>
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
      )}

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

