import React, { useState, useRef, useEffect } from 'react';
import { useProject } from '../context/ProjectContext';
import { 
  Calendar, 
  Grid, 
  GitCommit, 
  Target, 
  Kanban, 
  Lightbulb, 
  Users, 
  BarChart3, 
  Plus, 
  Search, 
  AlertTriangle, 
  Wand2, 
  Download, 
  RotateCcw, 
  Sun, 
  Moon,
  Sparkles,
  Layers,
  HelpCircle,
  UploadCloud,
  FolderKanban,
  ChevronDown,
  FolderPlus,
  Settings,
  Menu,
  Check,
  TrendingUp,
  SlidersHorizontal
} from 'lucide-react';
import { exportMilestonesToCSV, exportToJSON } from '../utils/exportUtils';

export default function Header() {
  const {
    activeView,
    setActiveView,
    searchQuery,
    setSearchQuery,
    filterGoal,
    setFilterGoal,
    filterPriority,
    setFilterPriority,
    filterHealth,
    setFilterHealth,
    filterOwner,
    setFilterOwner,
    goals,
    team,
    milestones,
    setIsMilestoneModalOpen,
    setEditingMilestone,
    setIsGoalModalOpen,
    setIsIdeaModalOpen,
    darkMode,
    setDarkMode,
    dependencyConflicts,
    autoFixDependencies,
    resetDemoData,
    startTour,
    openAICopilot,
    openIntegrationHub,
    projects,
    currentProjectId,
    currentProject,
    switchProject
  } = useProject();

  const [isCreateMenuOpen, setIsCreateMenuOpen] = useState(false);
  const [isToolsMenuOpen, setIsToolsMenuOpen] = useState(false);
  const [openNavGroup, setOpenNavGroup] = useState(null); // 'execution' | 'portfolio' | 'insights' | null

  const createMenuRef = useRef(null);
  const toolsMenuRef = useRef(null);
  const navMenuRef = useRef(null);

  // Close dropdowns on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (createMenuRef.current && !createMenuRef.current.contains(event.target)) {
        setIsCreateMenuOpen(false);
      }
      if (toolsMenuRef.current && !toolsMenuRef.current.contains(event.target)) {
        setIsToolsMenuOpen(false);
      }
      if (navMenuRef.current && !navMenuRef.current.contains(event.target)) {
        setOpenNavGroup(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Navigation Groupings (Executive Professional Titles)
  const navGroups = [
    {
      id: 'execution',
      label: 'Product Delivery',
      icon: Calendar,
      items: [
        { id: 'gantt', label: 'Interactive Roadmap', icon: Calendar, desc: 'Timeline view & milestones' },
        { id: 'kanban', label: 'Agile Kanban Board', icon: Kanban, desc: 'Agile workflow status columns' },
        { id: 'priority', label: 'RICE Priority Matrix', icon: Grid, desc: '2x2 effort vs impact scorecard' },
        { id: 'dependencies', label: 'Dependency Network', icon: GitCommit, desc: 'Visual network blocker map' }
      ]
    },
    {
      id: 'portfolio',
      label: 'Portfolio & Strategy',
      icon: Layers,
      items: [
        { id: 'projects', label: 'Project Workspaces', icon: FolderKanban, desc: 'Multi-project workspace hub' },
        { id: 'portfolio', label: 'Agile Release Trains', icon: Layers, desc: 'SAFe Program Increments & release tracks' },
        { id: 'strategy', label: 'Strategic Objectives', icon: Target, desc: 'Quarterly goals & OKR alignment' }
      ]
    },
    {
      id: 'insights',
      label: 'Insights & Capacity',
      icon: BarChart3,
      items: [
        { id: 'ideas', label: 'Ideas Portal', icon: Lightbulb, desc: 'Community voting & feature requests' },
        { id: 'resource', label: 'Team Capacity', icon: Users, desc: 'Workload hours & capacity planning' },
        { id: 'analytics', label: 'Executive Analytics', icon: BarChart3, desc: 'Burn-up metrics & health charts' }
      ]
    }
  ];

  // Helper to find current active view metadata
  const allNavItems = navGroups.flatMap(g => g.items).concat([{ id: 'integrations', label: 'Data Sync & Integrations', icon: UploadCloud }]);
  const currentNav = allNavItems.find(i => i.id === activeView) || allNavItems[0];

  const handleCreateMilestone = () => {
    setEditingMilestone(null);
    setIsMilestoneModalOpen(true);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top Brand & Actions Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3">
        
        {/* Logo & Project Switcher */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-teal-400 flex items-center justify-center shadow-md shadow-indigo-200 shrink-0">
            <Sparkles className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-extrabold text-slate-900 tracking-tight">
                Kinetix
              </h1>
              
              {/* Project Switcher Select Dropdown */}
              <div className="relative flex items-center">
                <select
                  value={currentProjectId}
                  onChange={(e) => {
                    if (e.target.value === 'NAV_PROJECTS') {
                      setActiveView('projects');
                    } else {
                      switchProject(e.target.value);
                    }
                  }}
                  className="bg-indigo-50 text-indigo-900 font-extrabold text-xs px-2.5 py-1 rounded-lg border border-indigo-200 focus:outline-hidden cursor-pointer shadow-2xs hover:bg-indigo-100 transition-colors"
                >
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>
                      [{p.code}] {p.name}
                    </option>
                  ))}
                  <option value="NAV_PROJECTS">+ Manage / Create Projects...</option>
                </select>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 font-medium truncate">
              Active: <strong>{currentProject?.name}</strong> ({currentProject?.members?.length || 0} Members)
            </p>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="relative flex-1 max-w-sm mx-2 hidden md:block">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search milestones, tags, owners..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-100/80 text-slate-800 text-xs pl-8 pr-4 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-400 font-medium"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 hover:text-slate-700"
            >
              Clear
            </button>
          )}
        </div>

        {/* STREAMLINED ACTION BUTTONS */}
        <div className="flex items-center gap-2">
          
          {/* Conflict Reschedule Warning Pill */}
          {dependencyConflicts.length > 0 && (
            <button
              onClick={autoFixDependencies}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold rounded-lg bg-amber-50 text-amber-800 border border-amber-300 hover:bg-amber-100 transition-all shadow-2xs animate-bounce"
              title="Automatically push dependent dates forward to resolve overlaps"
            >
              <Wand2 className="w-3.5 h-3.5 text-amber-600" />
              <span>Fix ({dependencyConflicts.length})</span>
            </button>
          )}

          {/* Kinetix IQ AI Button */}
          <button
            id="btn-kinetix-iq"
            onClick={openAICopilot}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-extrabold rounded-lg bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 text-white hover:opacity-95 shadow-xs transition-all active:scale-95 border border-purple-400/30"
            title="Launch Kinetix IQ Assistant & Milestone Generator"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-200 animate-pulse" />
            <span>Kinetix IQ</span>
          </button>

          {/* GROUP 1: + CREATE NEW DROPDOWN MENU */}
          <div className="relative" ref={createMenuRef}>
            <button
              onClick={() => setIsCreateMenuOpen(!isCreateMenuOpen)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-extrabold rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-xs transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>+ Create</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isCreateMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {isCreateMenuOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-scale-up font-medium text-xs divide-y divide-slate-100">
                <div className="py-1">
                  <button
                    onClick={() => { handleCreateMilestone(); setIsCreateMenuOpen(false); }}
                    className="w-full text-left px-3.5 py-2 hover:bg-indigo-50 text-slate-800 font-extrabold flex items-center gap-2 transition-colors"
                  >
                    <Plus className="w-4 h-4 text-indigo-600" />
                    <span>New Milestone</span>
                  </button>
                  <button
                    onClick={() => { setIsGoalModalOpen(true); setIsCreateMenuOpen(false); }}
                    className="w-full text-left px-3.5 py-2 hover:bg-indigo-50 text-slate-800 font-bold flex items-center gap-2 transition-colors"
                  >
                    <Target className="w-4 h-4 text-teal-600" />
                    <span>Strategic Goal</span>
                  </button>
                  <button
                    onClick={() => { setIsIdeaModalOpen(true); setIsCreateMenuOpen(false); }}
                    className="w-full text-left px-3.5 py-2 hover:bg-indigo-50 text-slate-800 font-bold flex items-center gap-2 transition-colors"
                  >
                    <Lightbulb className="w-4 h-4 text-amber-600" />
                    <span>Submit Idea</span>
                  </button>
                </div>
                <div className="pt-1">
                  <button
                    onClick={() => { setActiveView('projects'); setIsCreateMenuOpen(false); }}
                    className="w-full text-left px-3.5 py-2 hover:bg-indigo-50 text-indigo-700 font-bold flex items-center gap-2 transition-colors"
                  >
                    <FolderPlus className="w-4 h-4 text-indigo-600" />
                    <span>New Project from Scratch...</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* GROUP 2: TOOLS & INTEGRATIONS DROPDOWN MENU */}
          <div className="relative" ref={toolsMenuRef}>
            <button
              onClick={() => setIsToolsMenuOpen(!isToolsMenuOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200 transition-all shadow-2xs"
              title="Import, Export & Project Tools"
            >
              <UploadCloud className="w-3.5 h-3.5 text-slate-600" />
              <span>Tools ▾</span>
            </button>

            {isToolsMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-scale-up font-medium text-xs divide-y divide-slate-100">
                <div className="py-1">
                  <button
                    onClick={() => { openIntegrationHub(); setIsToolsMenuOpen(false); }}
                    className="w-full text-left px-3.5 py-2 hover:bg-indigo-50 text-slate-800 font-bold flex items-center gap-2 transition-colors"
                  >
                    <UploadCloud className="w-4 h-4 text-emerald-600" />
                    <span>Integration Hub (Excel, Jira, MS Project)</span>
                  </button>
                  <button
                    onClick={() => { exportMilestonesToCSV(milestones); setIsToolsMenuOpen(false); }}
                    className="w-full text-left px-3.5 py-2 hover:bg-indigo-50 text-slate-800 font-semibold flex items-center gap-2 transition-colors"
                  >
                    <Download className="w-4 h-4 text-blue-600" />
                    <span>Quick Export CSV</span>
                  </button>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => { startTour(); setIsToolsMenuOpen(false); }}
                    className="w-full text-left px-3.5 py-2 hover:bg-indigo-50 text-slate-800 font-semibold flex items-center gap-2 transition-colors"
                  >
                    <HelpCircle className="w-4 h-4 text-indigo-600" />
                    <span>Help & Guided Tour</span>
                  </button>
                  <button
                    onClick={() => { resetDemoData(); setIsToolsMenuOpen(false); }}
                    className="w-full text-left px-3.5 py-2 hover:bg-red-50 text-red-700 font-semibold flex items-center gap-2 transition-colors"
                  >
                    <RotateCcw className="w-4 h-4 text-red-500" />
                    <span>Reset Demo Data</span>
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* ZERO HORIZONTAL SCROLL GROUPED NAVIGATION BAR */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between border-t border-slate-200/80 py-1.5">
        <div className="flex items-center gap-2 flex-wrap w-full" ref={navMenuRef}>
          
          {/* Active View Title Badge Indicator */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 bg-slate-900 text-white rounded-lg text-xs font-extrabold shadow-2xs mr-2">
            <currentNav.icon className="w-3.5 h-3.5 text-indigo-300" />
            <span>{currentNav.label}</span>
          </div>

          {/* Group 1: Execution & Roadmaps Dropdown */}
          {navGroups.map((group) => {
            const GroupIcon = group.icon;
            const hasActiveChild = group.items.some(i => i.id === activeView);
            const isOpen = openNavGroup === group.id;

            return (
              <div key={group.id} className="relative">
                <button
                  onClick={() => setOpenNavGroup(isOpen ? null : group.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all border ${
                    hasActiveChild 
                      ? 'bg-indigo-600 text-white border-indigo-700 shadow-2xs font-extrabold' 
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <GroupIcon className={`w-3.5 h-3.5 ${hasActiveChild ? 'text-white' : 'text-indigo-600'}`} />
                  <span>{group.label}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {isOpen && (
                  <div className="absolute left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-scale-up text-xs font-medium divide-y divide-slate-100">
                    {group.items.map((item) => {
                      const ItemIcon = item.icon;
                      const isItemSelected = activeView === item.id;

                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            setActiveView(item.id);
                            setOpenNavGroup(null);
                          }}
                          className={`w-full text-left px-3.5 py-2 flex items-start gap-2.5 transition-colors ${
                            isItemSelected ? 'bg-indigo-50/90 text-indigo-900 font-extrabold' : 'hover:bg-slate-50 text-slate-800'
                          }`}
                        >
                          <ItemIcon className={`w-4 h-4 shrink-0 mt-0.5 ${isItemSelected ? 'text-indigo-600' : 'text-slate-400'}`} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="truncate">{item.label}</span>
                              {isItemSelected && <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0" />}
                            </div>
                            <span className="text-[10px] text-slate-400 font-normal block truncate">{item.desc}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          {/* Standalone Button: Data Sync & Integrations */}
          <button
            onClick={() => setActiveView('integrations')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all border ${
              activeView === 'integrations'
                ? 'bg-emerald-600 text-white border-emerald-700 shadow-2xs font-extrabold'
                : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            <UploadCloud className={`w-3.5 h-3.5 ${activeView === 'integrations' ? 'text-white' : 'text-emerald-600'}`} />
            <span>Data Sync & Integrations</span>
          </button>

        </div>
      </div>

      {/* Filter Toolbar Bar */}
      <div className="bg-slate-100/70 border-t border-slate-200/80 px-4 sm:px-6 py-1.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 text-xs">
          
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">Filter by:</span>

            {/* Filter Goal */}
            <select
              value={filterGoal}
              onChange={(e) => setFilterGoal(e.target.value)}
              className="bg-white text-slate-800 border border-slate-200 rounded-md px-2 py-0.5 text-xs focus:outline-none focus:border-indigo-500 shadow-2xs font-medium"
            >
              <option value="all">All Goals</option>
              {goals.map(g => (
                <option key={g.id} value={g.id}>{g.title}</option>
              ))}
            </select>

            {/* Filter Priority */}
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="bg-white text-slate-800 border border-slate-200 rounded-md px-2 py-0.5 text-xs focus:outline-none focus:border-indigo-500 shadow-2xs font-medium"
            >
              <option value="all">All Priorities</option>
              <option value="P0">P0 - Critical</option>
              <option value="P1">P1 - High</option>
              <option value="P2">P2 - Medium</option>
              <option value="P3">P3 - Low</option>
            </select>

            {/* Filter Health */}
            <select
              value={filterHealth}
              onChange={(e) => setFilterHealth(e.target.value)}
              className="bg-white text-slate-800 border border-slate-200 rounded-md px-2 py-0.5 text-xs focus:outline-none focus:border-indigo-500 shadow-2xs font-medium"
            >
              <option value="all">All Health</option>
              <option value="On Track">On Track</option>
              <option value="At Risk">At Risk</option>
              <option value="Delayed">Delayed</option>
            </select>

            {/* Filter Owner */}
            <select
              value={filterOwner}
              onChange={(e) => setFilterOwner(e.target.value)}
              className="bg-white text-slate-800 border border-slate-200 rounded-md px-2 py-0.5 text-xs focus:outline-none focus:border-indigo-500 shadow-2xs font-medium"
            >
              <option value="all">All Owners</option>
              {team.map(t => (
                <option key={t.id} value={t.name}>{t.name}</option>
              ))}
            </select>

            {(filterGoal !== 'all' || filterPriority !== 'all' || filterHealth !== 'all' || filterOwner !== 'all') && (
              <button
                onClick={() => {
                  setFilterGoal('all');
                  setFilterPriority('all');
                  setFilterHealth('all');
                  setFilterOwner('all');
                }}
                className="text-[11px] text-indigo-600 hover:text-indigo-800 font-bold underline px-1"
              >
                Reset Filters
              </button>
            )}
          </div>

          <div className="text-[11px] text-slate-500 font-medium">
            Showing <strong className="text-slate-800">{milestones.length}</strong> milestones
          </div>

        </div>
      </div>
    </header>
  );
}
