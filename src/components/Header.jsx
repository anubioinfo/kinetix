import React from 'react';
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
  HelpCircle
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
    startTour
  } = useProject();

  const navItems = [
    { id: 'gantt', label: 'Roadmap & Gantt', icon: Calendar },
    { id: 'priority', label: 'Priority Matrix', icon: Grid },
    { id: 'dependencies', label: 'Dependency Graph', icon: GitCommit },
    { id: 'strategy', label: 'Strategy Hub', icon: Target },
    { id: 'kanban', label: 'Kanban Workflow', icon: Kanban },
    { id: 'ideas', label: 'Ideas Portal', icon: Lightbulb },
    { id: 'resource', label: 'Team Capacity', icon: Users },
    { id: 'analytics', label: 'Executive Analytics', icon: BarChart3 },
  ];

  const handleCreateMilestone = () => {
    setEditingMilestone(null);
    setIsMilestoneModalOpen(true);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top Brand Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
        
        {/* Logo & Product Name */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-teal-400 flex items-center justify-center shadow-md shadow-indigo-200">
            <Sparkles className="w-6 h-6 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Kinetix Roadmap
              </h1>
              <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                Enterprise v3.0
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">High-Velocity Agile Milestone Execution Engine</p>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="relative flex-1 max-w-md mx-4">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search milestones, tags, owners..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-100/80 text-slate-800 text-sm pl-9 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-400"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700"
            >
              Clear
            </button>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* 1-Click Auto Fix Dependencies */}
          {dependencyConflicts.length > 0 && (
            <button
              onClick={autoFixDependencies}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-amber-50 text-amber-800 border border-amber-300 hover:bg-amber-100 transition-all shadow-xs animate-bounce"
              title="Automatically push dependent dates forward to resolve overlaps"
            >
              <Wand2 className="w-3.5 h-3.5" />
              Auto-Reschedule ({dependencyConflicts.length} Conflicts)
            </button>
          )}

          {/* New Milestone Button */}
          <button
            onClick={handleCreateMilestone}
            className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-bold rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-md shadow-indigo-200 transition-all transform active:scale-95"
          >
            <Plus className="w-4 h-4" />
            New Milestone
          </button>

          {/* New Goal */}
          <button
            onClick={() => setIsGoalModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200 transition-all"
          >
            <Target className="w-3.5 h-3.5 text-teal-600" />
            + Strategic Goal
          </button>

          {/* Submit Idea */}
          <button
            onClick={() => setIsIdeaModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200 transition-all"
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
            + Idea
          </button>

          {/* Export CSV */}
          <div className="relative group">
            <button
              onClick={() => exportMilestonesToCSV(milestones)}
              className="p-2 rounded-lg bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200 hover:text-slate-900 transition-all"
              title="Export CSV"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>

          {/* Help & Interactive Tour Button */}
          <button
            onClick={startTour}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 transition-all shadow-xs group"
            title="Start step-by-step interactive guided tour"
          >
            <HelpCircle className="w-4 h-4 text-indigo-600 group-hover:rotate-12 transition-transform" />
            Help & Tour
          </button>

          {/* Reset Demo */}
          <button
            onClick={resetDemoData}
            className="p-2 rounded-lg bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200 hover:text-slate-800 transition-all"
            title="Reset to default demo data"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between border-t border-slate-200/80 pt-1">
        <nav className="flex space-x-1 overflow-x-auto py-1 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => setActiveView(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-medium rounded-md transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 border-b-2 border-indigo-600 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                {item.label}
                {item.id === 'dependencies' && dependencyConflicts.length > 0 && (
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Filter Toolbar Bar */}
      <div className="bg-slate-100/70 border-t border-slate-200/80 px-4 sm:px-6 py-2">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">Filter by:</span>

            {/* Filter Goal */}
            <select
              value={filterGoal}
              onChange={(e) => setFilterGoal(e.target.value)}
              className="bg-white text-slate-800 border border-slate-200 rounded px-2.5 py-1 focus:outline-none focus:border-indigo-500 shadow-2xs font-medium"
            >
              <option value="all">All Strategic Goals</option>
              {goals.map(g => (
                <option key={g.id} value={g.id}>{g.title}</option>
              ))}
            </select>

            {/* Filter Priority */}
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="bg-white text-slate-800 border border-slate-200 rounded px-2.5 py-1 focus:outline-none focus:border-indigo-500 shadow-2xs font-medium"
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
              className="bg-white text-slate-800 border border-slate-200 rounded px-2.5 py-1 focus:outline-none focus:border-indigo-500 shadow-2xs font-medium"
            >
              <option value="all">All Health States</option>
              <option value="On Track">On Track</option>
              <option value="At Risk">At Risk</option>
              <option value="Off Track">Off Track</option>
            </select>

            {/* Filter Owner */}
            <select
              value={filterOwner}
              onChange={(e) => setFilterOwner(e.target.value)}
              className="bg-white text-slate-800 border border-slate-200 rounded px-2.5 py-1 focus:outline-none focus:border-indigo-500 shadow-2xs font-medium"
            >
              <option value="all">All Team Leads</option>
              {team.map(t => (
                <option key={t.id} value={t.name}>{t.name}</option>
              ))}
            </select>

            {/* Reset Filters */}
            {(filterGoal !== 'all' || filterPriority !== 'all' || filterHealth !== 'all' || filterOwner !== 'all') && (
              <button
                onClick={() => {
                  setFilterGoal('all');
                  setFilterPriority('all');
                  setFilterHealth('all');
                  setFilterOwner('all');
                }}
                className="text-indigo-600 hover:underline text-xs font-semibold"
              >
                Reset Filters
              </button>
            )}
          </div>

          {/* Conflict Summary Indicator */}
          {dependencyConflicts.length > 0 && (
            <div className="flex items-center gap-1.5 text-amber-700 font-bold">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span>{dependencyConflicts.length} Dependency Schedule Conflict(s) Detected</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
