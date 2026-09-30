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
  Wand2, 
  Download, 
  RotateCcw, 
  Sparkles,
  Layers,
  HelpCircle,
  UploadCloud,
  FolderKanban,
  ChevronDown,
  FolderPlus,
  SlidersHorizontal,
  Sliders,
  Filter,
  Check,
  X,
  Bell,
  Bot,
  Clock,
  Globe
} from 'lucide-react';
import { exportMilestonesToCSV } from '../utils/exportUtils';

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
    dependencyConflicts,
    autoFixDependencies,
    resetDemoData,
    startTour,
    openAICopilot,
    openIntegrationHub,
    projects,
    currentProjectId,
    currentProject,
    switchProject,
    aiRiskAlerts,
    // 🔔 Notifications & Webhooks
    openNotificationDrawer,
    unreadCount,
    // 🤖 AI Auto-Scheduler
    openAutoScheduler,
    // 🕒 Time Travel
    timeTravelDate,
    setTimeTravelDate,
    // 🔮 Retro & 🌐 Changelog Modals
    openRetroModal,
    openChangelogModal
  } = useProject();

  const [isCreateMenuOpen, setIsCreateMenuOpen] = useState(false);
  const [isToolsMenuOpen, setIsToolsMenuOpen] = useState(false);
  const [isMoreViewsOpen, setIsMoreViewsOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const createMenuRef = useRef(null);
  const toolsMenuRef = useRef(null);
  const moreViewsRef = useRef(null);
  const filterRef = useRef(null);

  // Close dropdowns on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (createMenuRef.current && !createMenuRef.current.contains(event.target)) {
        setIsCreateMenuOpen(false);
      }
      if (toolsMenuRef.current && !toolsMenuRef.current.contains(event.target)) {
        setIsToolsMenuOpen(false);
      }
      if (moreViewsRef.current && !moreViewsRef.current.contains(event.target)) {
        setIsMoreViewsOpen(false);
      }
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Primary 1-Click Navigation Tabs (Ordered in natural sequential workflow)
  const primaryTabs = [
    { id: 'getting-started', label: 'Get Started', icon: Sparkles, targetId: 'nav-getting-started', shortcut: 'Alt+1' },
    { id: 'projects', label: 'Workspaces', icon: FolderKanban, targetId: 'nav-projects', shortcut: 'Alt+2' },
    { id: 'ideas', label: 'Ideas Portal', icon: Lightbulb, targetId: 'nav-ideas', shortcut: 'Alt+3' },
    { id: 'gantt', label: 'Roadmap', icon: Calendar, targetId: 'nav-gantt', shortcut: 'Alt+4' },
    { id: 'kanban', label: 'Kanban', icon: Kanban, targetId: 'nav-kanban', shortcut: 'Alt+5' },
    { id: 'priority', label: 'Priority Matrix', icon: Grid, targetId: 'nav-priority', shortcut: 'Alt+6' },
    { id: 'portfolio', label: 'Release Trains', icon: Layers, targetId: 'nav-portfolio', shortcut: 'Alt+7' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, targetId: 'nav-analytics', shortcut: 'Alt+8' },
  ];

  // Secondary Views in 'More Views' Dropdown
  const secondaryTabs = [
    { id: 'integrations', label: 'Data Sync & Integrations', icon: UploadCloud, desc: 'Excel, CSV, Jira & MS Project import/export', targetId: 'nav-integrations' },
    { id: 'dependencies', label: 'Dependencies & Conflicts', icon: GitCommit, desc: 'Predecessors, successors & auto-reschedule', targetId: 'nav-dependencies' },
    { id: 'strategy', label: 'Strategic Goals & OKRs', icon: Target, desc: 'Corporate target alignment', targetId: 'nav-strategy' },
    { id: 'resource', label: 'Team Capacity & Workload', icon: Users, desc: 'Engineer load & hour allocation', targetId: 'nav-resource' },
    { id: 'whatif', label: 'What-If Schedule Simulator', icon: Sliders, desc: 'Monte Carlo stochastic forecasting', targetId: 'nav-whatif' }
  ];

  // Alt+1 .. Alt+8 Keyboard Shortcuts & Cmd+K / Ctrl+K for Kinetix IQ
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger when user is typing inside an input or textarea
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) return;
      if (e.altKey && e.key >= '1' && e.key <= '8') {
        const idx = parseInt(e.key) - 1;
        if (primaryTabs[idx]) {
          e.preventDefault();
          setActiveView(primaryTabs[idx].id);
        }
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        openAICopilot();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [primaryTabs, setActiveView, openAICopilot]);

  const activeFiltersCount = (filterGoal !== 'all' ? 1 : 0) + 
                             (filterPriority !== 'all' ? 1 : 0) + 
                             (filterHealth !== 'all' ? 1 : 0) + 
                             (filterOwner !== 'all' ? 1 : 0);

  const isSecondaryActive = secondaryTabs.some(t => t.id === activeView);

  const handleCreateMilestone = () => {
    setEditingMilestone(null);
    setIsMilestoneModalOpen(true);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs">
      
      {/* ROW 1: MASTER BRAND & ACTION BAR */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100">
        
        {/* Brand Logo & Project Switcher */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-indigo-700 flex items-center justify-center shadow-md shadow-indigo-200 shrink-0">
            <Sparkles className="w-4 h-4 text-white animate-pulse" />
          </div>

          <div className="flex items-center gap-2">
            <h1 className="text-base font-extrabold text-slate-900 tracking-tight">
              Kinetix
            </h1>

            <span className="text-slate-300 font-light">|</span>

            {/* Project Switcher Select Dropdown */}
            <select
              value={currentProjectId}
              onChange={(e) => {
                if (e.target.value === 'NAV_PROJECTS') {
                  setActiveView('projects');
                } else {
                  switchProject(e.target.value);
                }
              }}
              className="bg-indigo-50/80 hover:bg-indigo-100 text-indigo-950 font-extrabold text-xs px-2.5 py-1 rounded-lg border border-indigo-200/80 focus:outline-hidden cursor-pointer shadow-2xs transition-colors"
            >
              {projects.map(p => (
                <option key={p.id} value={p.id}>
                  [{p.code}] {p.name}
                </option>
              ))}
              <option value="NAV_PROJECTS">+ Manage / Create Workspaces...</option>
            </select>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative flex-1 max-w-sm mx-2 hidden sm:block">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search milestones, tags, owners..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-100/70 text-slate-800 text-xs pl-8 pr-4 py-1.5 rounded-xl border border-slate-200/80 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-400 font-medium"
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

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          
          {/* Conflict Reschedule Pill */}
          {dependencyConflicts.length > 0 && (
            <button
              onClick={autoFixDependencies}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-extrabold rounded-lg bg-amber-50 text-amber-800 border border-amber-300 hover:bg-amber-100 transition-all shadow-2xs animate-bounce"
              title="Automatically resolve date overlaps"
            >
              <Wand2 className="w-3.5 h-3.5 text-amber-600" />
              <span>Fix ({dependencyConflicts.length})</span>
            </button>
          )}

          {/* 🔔 Notification Bell Button */}
          <button
            onClick={openNotificationDrawer}
            className="relative p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors shadow-2xs"
            title="Notification Center & Slack/Teams Webhooks" aria-label="Notifications" data-testid="notification-button"
          >
            <Bell className="w-4 h-4 text-slate-700" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white font-black text-[9px] rounded-full flex items-center justify-center animate-pulse shadow-2xs">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Kinetix IQ AI Button */}
          <button
            id="btn-kinetix-iq"
            onClick={openAICopilot}
            className="btn-ai-glow flex items-center gap-1.5 px-3 py-1.5 text-xs font-extrabold rounded-lg bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 text-white shadow-xs active:scale-95 border border-purple-400/30"
            title="Launch Kinetix IQ Assistant & Milestone Generator" aria-label="Kinetix IQ Assistant" data-testid="ai-button"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-200 animate-pulse" />
            <span>Kinetix IQ</span>
          </button>

          {/* + CREATE DROPDOWN MENU */}
          <div className="relative" ref={createMenuRef}>
            <button onClick={() => setIsCreateMenuOpen(!isCreateMenuOpen)} aria-haspopup="true" aria-expanded={isCreateMenuOpen} data-testid="create-button" className="flex items-center gap-1 px-3 py-1.5 text-xs font-extrabold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-all active:scale-95">
              <Plus className="w-4 h-4" />
              <span>Create</span>
              <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isCreateMenuOpen ? 'rotate-180' : ''}`} />
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
                    <span>New Workspace from Scratch...</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* WORKSPACE TOOLS DROPDOWN */}
          <div className="relative" ref={toolsMenuRef}>
            <button onClick={() => setIsToolsMenuOpen(!isToolsMenuOpen)} aria-haspopup="true" aria-expanded={isToolsMenuOpen} data-testid="tools-button" className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold rounded-lg bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200 transition-all shadow-2xs" title="Tools & Integrations">
              <UploadCloud className="w-3.5 h-3.5 text-slate-600" />
              <span>Tools</span>
              <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isToolsMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {isToolsMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-scale-up font-medium text-xs divide-y divide-slate-100">
                <div className="py-1">
                  <button
                    onClick={() => { openRetroModal(); setIsToolsMenuOpen(false); }}
                    className="w-full text-left px-3.5 py-2 hover:bg-purple-50 text-purple-900 font-bold flex items-center gap-2 transition-colors"
                  >
                    <Sparkles className="w-4 h-4 text-purple-600 animate-pulse" />
                    <span>AI Sprint Retrospective</span>
                  </button>
                  <button
                    onClick={() => { openChangelogModal(); setIsToolsMenuOpen(false); }}
                    className="w-full text-left px-3.5 py-2 hover:bg-emerald-50 text-emerald-900 font-bold flex items-center gap-2 transition-colors"
                  >
                    <Globe className="w-4 h-4 text-emerald-600" />
                    <span>Product Release Notes</span>
                  </button>
                  <button
                    onClick={() => { openAutoScheduler(); setIsToolsMenuOpen(false); }}
                    className="w-full text-left px-3.5 py-2 hover:bg-indigo-50 text-slate-800 font-bold flex items-center gap-2 transition-colors text-indigo-700"
                  >
                    <Bot className="w-4 h-4 text-indigo-600" />
                    <span>AI Auto-Scheduler</span>
                  </button>
                  <button
                    onClick={() => { setTimeTravelDate('2026-09-01'); setIsToolsMenuOpen(false); }}
                    className="w-full text-left px-3.5 py-2 hover:bg-amber-50 text-amber-900 font-bold flex items-center gap-2 transition-colors"
                  >
                    <Clock className="w-4 h-4 text-amber-600" />
                    <span>Time Travel Mode</span>
                  </button>
                  <button
                    onClick={() => { openIntegrationHub(); setIsToolsMenuOpen(false); }}
                    className="w-full text-left px-3.5 py-2 hover:bg-indigo-50 text-slate-800 font-bold flex items-center gap-2 transition-colors"
                  >
                    <UploadCloud className="w-4 h-4 text-emerald-600" />
                    <span>Data Sync & Integrations</span>
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

      {/* ROW 2: UNIFIED NAVIGATION & INLINE FILTERS BAR */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5 flex items-center justify-between gap-3">
        
        {/* Sleek Segmented Navigation Pills */}
        <nav className="flex items-center gap-1 flex-wrap py-0.5 relative z-30">
          {primaryTabs.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;

            return (
              <button
                key={item.id}
                id={item.targetId || `nav-${item.id}`}
                onClick={() => setActiveView(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-indigo-600 text-white font-extrabold shadow-sm shadow-indigo-200/60'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-semibold'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-200' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}

          {/* 'More Views' Dropdown Menu */}
          <div className="relative" ref={moreViewsRef}>
            <button
              id="nav-more-views"
              onClick={() => setIsMoreViewsOpen(!isMoreViewsOpen)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg transition-all whitespace-nowrap ${
                isSecondaryActive 
                  ? 'bg-indigo-600 text-white font-extrabold shadow-sm shadow-indigo-200/60' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-semibold'
              }`}
            >
              <span>More Views</span>
              {dependencyConflicts.length > 0 && (
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
              )}
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isMoreViewsOpen ? 'rotate-180' : ''}`} />
            </button>

            {isMoreViewsOpen && (
              <div className="absolute left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-scale-up font-medium text-xs divide-y divide-slate-100">
                {secondaryTabs.map((item) => {
                  const Icon = item.icon;
                  const isSelected = activeView === item.id;

                  return (
                    <button
                      key={item.id}
                      id={item.targetId || `nav-${item.id}`}
                      onClick={() => {
                        setActiveView(item.id);
                        setIsMoreViewsOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 flex items-start gap-2.5 transition-colors ${
                        isSelected ? 'bg-indigo-50 text-indigo-900 font-extrabold' : 'hover:bg-slate-50 text-slate-800'
                      }`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="truncate">{item.label}</span>
                          {item.id === 'dependencies' && dependencyConflicts.length > 0 && (
                            <span className="px-1.5 py-0.5 text-[9px] font-extrabold rounded bg-amber-100 text-amber-800 border border-amber-300">
                              {dependencyConflicts.length} conflicts
                            </span>
                          )}
                          {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0" />}
                        </div>
                        <span className="text-[10px] text-slate-400 font-normal block truncate">{item.desc}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

        </nav>

        {/* INLINE COMPACT FILTER POPOVER TOGGLE */}
        <div className="relative" ref={filterRef}>
          <button aria-haspopup="true" aria-expanded={isFilterOpen} data-testid="filter-button"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${
              activeFiltersCount > 0 
                ? 'bg-indigo-50 text-indigo-700 border-indigo-300 font-extrabold' 
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Filter className={`w-3.5 h-3.5 ${activeFiltersCount > 0 ? 'text-indigo-600' : 'text-slate-500'}`} />
            <span>Filter</span>
            {activeFiltersCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-indigo-600 text-white text-[10px] font-extrabold flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
            <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Filter Popover Dropdown */}
          {isFilterOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50 animate-scale-up text-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="font-extrabold text-slate-900 text-xs">Filter Roadmap</span>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={() => {
                      setFilterGoal('all');
                      setFilterPriority('all');
                      setFilterHealth('all');
                      setFilterOwner('all');
                    }}
                    className="text-[11px] text-indigo-600 font-bold hover:underline"
                  >
                    Reset All
                  </button>
                )}
              </div>

              <div className="space-y-2.5">
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Strategic Goal</label>
                  <select
                    value={filterGoal}
                    onChange={(e) => setFilterGoal(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 text-xs font-medium"
                  >
                    <option value="all">All Goals</option>
                    {goals.map(g => (
                      <option key={g.id} value={g.id}>{g.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-bold mb-1">Priority Level</label>
                  <select
                    value={filterPriority}
                    onChange={(e) => setFilterPriority(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 text-xs font-medium"
                  >
                    <option value="all">All Priorities</option>
                    <option value="P0">P0 - Critical</option>
                    <option value="P1">P1 - High</option>
                    <option value="P2">P2 - Medium</option>
                    <option value="P3">P3 - Low</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-bold mb-1">Health Status</label>
                  <select
                    value={filterHealth}
                    onChange={(e) => setFilterHealth(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 text-xs font-medium"
                  >
                    <option value="all">All Health</option>
                    <option value="On Track">On Track</option>
                    <option value="At Risk">At Risk</option>
                    <option value="Delayed">Delayed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-bold mb-1">Owner Lead</label>
                  <select
                    value={filterOwner}
                    onChange={(e) => setFilterOwner(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 text-xs font-medium"
                  >
                    <option value="all">All Owners</option>
                    {team.map(t => (
                      <option key={t.id} value={t.name}>{t.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>

    </header>
  );
}
