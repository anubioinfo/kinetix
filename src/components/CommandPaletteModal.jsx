import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useProject } from '../context/ProjectContext';
import { 
  Search, 
  Sparkles, 
  Calendar, 
  Grid, 
  GitCommit, 
  Target, 
  Kanban, 
  Lightbulb, 
  Users, 
  BarChart3, 
  UploadCloud, 
  Layers, 
  FolderKanban, 
  Plus, 
  Wand2, 
  Bot, 
  Clock, 
  Globe, 
  HelpCircle, 
  RotateCcw, 
  Moon, 
  Sun, 
  ArrowRight, 
  Check, 
  Command,
  X
} from 'lucide-react';

export default function CommandPaletteModal() {
  const {
    isCommandPaletteOpen,
    closeCommandPalette,
    activeView,
    setActiveView,
    projects,
    currentProjectId,
    switchProject,
    setIsMilestoneModalOpen,
    setEditingMilestone,
    setIsGoalModalOpen,
    setIsIdeaModalOpen,
    openAICopilot,
    openAutoScheduler,
    openRetroModal,
    openChangelogModal,
    openIntegrationHub,
    setTimeTravelDate,
    startTour,
    resetDemoData,
    darkMode,
    setDarkMode
  } = useProject();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  // Focus search input when modal opens
  useEffect(() => {
    if (isCommandPaletteOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isCommandPaletteOpen]);

  // List of all Command Actions
  const commands = useMemo(() => [
    // 🚀 Navigation Views
    { id: 'nav-getting-started', group: 'Navigation Views', title: 'Get Started & Onboarding Hub', icon: Sparkles, shortcut: 'Alt+1', action: () => setActiveView('getting-started') },
    { id: 'nav-projects', group: 'Navigation Views', title: 'Workspaces Directory & User Access', icon: FolderKanban, shortcut: 'Alt+2', action: () => setActiveView('projects') },
    { id: 'nav-ideas', group: 'Navigation Views', title: 'Ideas Portal (Stakeholder Feedback)', icon: Lightbulb, shortcut: 'Alt+3', action: () => setActiveView('ideas') },
    { id: 'nav-gantt', group: 'Navigation Views', title: 'Roadmap (Gantt Timeline View)', icon: Calendar, shortcut: 'Alt+4', action: () => setActiveView('gantt') },
    { id: 'nav-kanban', group: 'Navigation Views', title: 'Kanban Execution Board', icon: Kanban, shortcut: 'Alt+5', action: () => setActiveView('kanban') },
    { id: 'nav-priority', group: 'Navigation Views', title: 'Priority Matrix & RICE Scoring', icon: Grid, shortcut: 'Alt+6', action: () => setActiveView('priority') },
    { id: 'nav-portfolio', group: 'Navigation Views', title: 'Release Trains & Portfolios', icon: Layers, shortcut: 'Alt+7', action: () => setActiveView('portfolio') },
    { id: 'nav-analytics', group: 'Navigation Views', title: 'Analytics & EVM Performance Dashboard', icon: BarChart3, shortcut: 'Alt+8', action: () => setActiveView('analytics') },
    { id: 'nav-integrations', group: 'Navigation Views', title: 'Data Sync & Integrations (Jira, CSV, Excel)', icon: UploadCloud, action: () => setActiveView('integrations') },
    { id: 'nav-dependencies', group: 'Navigation Views', title: 'Dependencies & Conflict Solver', icon: GitCommit, action: () => setActiveView('dependencies') },
    { id: 'nav-strategy', group: 'Navigation Views', title: 'Strategic Goals & OKRs Alignment', icon: Target, action: () => setActiveView('strategy') },
    { id: 'nav-resource', group: 'Navigation Views', title: 'Team Capacity & Workload Roster', icon: Users, action: () => setActiveView('resource') },

    // 🏢 Workspace Context Switcher
    ...projects.map(p => ({
      id: `proj-switch-${p.id}`,
      group: 'Switch Active Workspace',
      title: `Switch to [${p.code}] ${p.name}`,
      subtitle: `${(p.members || []).length} members • ${p.category || 'Workspace'}`,
      icon: FolderKanban,
      isCurrent: p.id === currentProjectId,
      action: () => switchProject(p.id)
    })),

    // ➕ Quick Creation
    { id: 'act-new-ms', group: 'Quick Actions', title: '+ Create New Roadmap Milestone', icon: Plus, action: () => { setEditingMilestone(null); setIsMilestoneModalOpen(true); } },
    { id: 'act-new-goal', group: 'Quick Actions', title: '+ Create Strategic Goal (OKR)', icon: Target, action: () => setIsGoalModalOpen(true) },
    { id: 'act-new-idea', group: 'Quick Actions', title: '+ Submit Customer / Team Idea', icon: Lightbulb, action: () => setIsIdeaModalOpen(true) },
    { id: 'act-new-ws', group: 'Quick Actions', title: '+ Initialize New Workspace from Scratch', icon: FolderKanban, action: () => setActiveView('projects') },

    // ⚡ AI & Executive Tools
    { id: 'tool-ai-copilot', group: 'AI & Executive Tools', title: 'Launch Kinetix IQ AI Assistant & E2E Generator', icon: Sparkles, shortcut: '⌘K', action: () => openAICopilot() },
    { id: 'tool-auto-scheduler', group: 'AI & Executive Tools', title: 'Run AI Workload Auto-Scheduler', icon: Bot, action: () => openAutoScheduler() },
    { id: 'tool-retro', group: 'AI & Executive Tools', title: 'AI Sprint Retrospective & Synthesis', icon: Sparkles, action: () => openRetroModal() },
    { id: 'tool-changelog', group: 'AI & Executive Tools', title: 'Product Release Notes & Changelog', icon: Globe, action: () => openChangelogModal() },
    { id: 'tool-time-travel', group: 'AI & Executive Tools', title: 'Time Travel Historical Replay Mode', icon: Clock, action: () => setTimeTravelDate('2026-09-01') },
    { id: 'tool-tour', group: 'AI & Executive Tools', title: 'Launch Guided Onboarding Tour', icon: HelpCircle, action: () => startTour() },
    { id: 'tool-reset', group: 'AI & Executive Tools', title: 'Reset Demo Workspace Data', icon: RotateCcw, action: () => resetDemoData() },

    // 🎨 Appearance & Theme
    { id: 'theme-toggle', group: 'Appearance', title: darkMode ? 'Switch to Light Theme Mode' : 'Switch to Dark Theme Mode', icon: darkMode ? Sun : Moon, action: () => setDarkMode(!darkMode) }
  ], [projects, currentProjectId, darkMode, setActiveView, switchProject, setIsMilestoneModalOpen, setEditingMilestone, setIsGoalModalOpen, setIsIdeaModalOpen, openAICopilot, openAutoScheduler, openRetroModal, openChangelogModal, setTimeTravelDate, startTour, resetDemoData, setDarkMode]);

  // Filter commands by query
  const filteredCommands = useMemo(() => {
    if (!query.trim()) return commands;
    const q = query.toLowerCase();
    return commands.filter(c => 
      c.title.toLowerCase().includes(q) ||
      c.group.toLowerCase().includes(q) ||
      (c.subtitle && c.subtitle.toLowerCase().includes(q))
    );
  }, [commands, query]);

  // Keyboard navigation inside Command Palette
  useEffect(() => {
    if (!isCommandPaletteOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % (filteredCommands.length || 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % (filteredCommands.length || 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          filteredCommands[selectedIndex].action();
          closeCommandPalette();
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        closeCommandPalette();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen, filteredCommands, selectedIndex, closeCommandPalette]);

  if (!isCommandPaletteOpen) return null;

  return (
    <div 
      onClick={closeCommandPalette}
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-slate-900/60 backdrop-blur-md animate-fade-in"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-scale-up flex flex-col max-h-[80vh]"
      >
        
        {/* Search Header */}
        <div className="p-4 border-b border-slate-100 flex items-center gap-3 bg-slate-50/80">
          <Command className="w-5 h-5 text-indigo-600 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command, search views, switch workspaces (e.g. 'Kanban', 'Switch', 'New Milestone')..."
            className="flex-1 bg-transparent text-sm text-slate-900 placeholder-slate-400 focus:outline-none font-semibold"
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-slate-600 text-xs font-bold"
            >
              Clear
            </button>
          )}
          <button 
            onClick={closeCommandPalette}
            className="p-1 rounded-lg bg-slate-200/60 hover:bg-slate-200 text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1 text-xs">
          {filteredCommands.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-40 text-slate-400" />
              <p className="font-bold text-slate-600">No matching commands found</p>
              <p className="text-[11px] text-slate-400 mt-1">Try searching for 'Roadmap', 'Workspaces', or 'Create'</p>
            </div>
          ) : (
            filteredCommands.map((cmd, idx) => {
              const Icon = cmd.icon;
              const isSelected = idx === selectedIndex;

              return (
                <div
                  key={cmd.id}
                  onClick={() => {
                    cmd.action();
                    closeCommandPalette();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`px-3.5 py-2.5 rounded-xl flex items-center justify-between cursor-pointer transition-all ${
                    isSelected 
                      ? 'bg-indigo-600 text-white shadow-sm font-bold' 
                      : 'hover:bg-slate-100 text-slate-800 font-medium'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-indigo-50 text-indigo-600'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <div className="flex items-center gap-2">
                        <span className="truncate">{cmd.title}</span>
                        {cmd.isCurrent && (
                          <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                            isSelected ? 'bg-white/20 text-white' : 'bg-indigo-100 text-indigo-700'
                          }`}>
                            Active
                          </span>
                        )}
                      </div>
                      <span className={`text-[10px] block truncate ${isSelected ? 'text-indigo-200' : 'text-slate-400'}`}>
                        {cmd.subtitle || cmd.group}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {cmd.shortcut && (
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                        isSelected ? 'bg-white/20 text-white border-white/30' : 'bg-slate-100 text-slate-500 border-slate-200'
                      }`}>
                        {cmd.shortcut}
                      </span>
                    )}
                    {isSelected && <ArrowRight className="w-4 h-4 text-white" />}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Shortcut Hints */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <div className="flex items-center gap-3">
            <span><kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded font-bold text-slate-700">↑</kbd> <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded font-bold text-slate-700">↓</kbd> Navigate</span>
            <span><kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded font-bold text-slate-700">↵</kbd> Select</span>
            <span><kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded font-bold text-slate-700">Esc</kbd> Close</span>
          </div>
          <span className="text-indigo-600 font-bold font-sans">Kinetix Command Palette</span>
        </div>

      </div>
    </div>
  );
}
