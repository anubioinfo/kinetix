import React, { useState } from 'react';
import { useProject } from '../context/ProjectContext';
import { CheckCircle2, Circle, ChevronDown, ChevronUp, X, Map } from 'lucide-react';

const STEPS = [
  { label: 'Create a Project',     view: 'projects',     checkKey: 'hasProjects',      icon: '🗂️' },
  { label: 'Set Strategic Goals',  view: 'strategy',     checkKey: 'hasGoals',         icon: '🎯' },
  { label: 'Add Milestones',       view: 'gantt',        checkKey: 'hasMilestones',    icon: '📅' },
  { label: 'Link Dependencies',    view: 'dependencies', checkKey: 'hasDependencies',  icon: '🔗' },
  { label: 'Assign Team Members',  view: 'resource',     checkKey: 'hasTeam',          icon: '👥' },
  { label: 'Plan Release Trains',  view: 'portfolio',    checkKey: 'hasReleases',      icon: '🚂' },
  { label: 'Track & Analyze',      view: 'analytics',    checkKey: 'hasAnalytics',     icon: '📊' },
];

export default function QuickStartWidget() {
  const { setActiveView, projects, goals, milestones, team, releases } = useProject();
  const [open, setOpen] = useState(true);
  const [dismissed, setDismissed] = useState(false);

  const hasDeps = milestones.some(m => m.dependencies && m.dependencies.length > 0);
  const status = {
    hasProjects: projects.length > 0,
    hasGoals: goals.length > 0,
    hasMilestones: milestones.length > 0,
    hasDependencies: hasDeps,
    hasTeam: team.length > 0,
    hasReleases: releases && releases.length > 0,
    hasAnalytics: milestones.some(m => m.progress > 0),
  };

  const doneCount = STEPS.filter(s => status[s.checkKey]).length;
  const pct = Math.round((doneCount / STEPS.length) * 100);
  const allDone = doneCount === STEPS.length;

  if (dismissed) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 w-72 shadow-2xl rounded-2xl overflow-hidden border border-slate-200"
      style={{ boxShadow: '0 8px 40px -8px rgba(99,102,241,0.3), 0 2px 16px rgba(0,0,0,0.1)' }}>

      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 cursor-pointer select-none"
        onClick={() => setOpen(o => !o)}>
        <div className="flex items-center gap-2">
          <Map className="w-4 h-4 text-white" />
          <span className="text-white text-xs font-extrabold">Setup Checklist</span>
          <span className="bg-white/20 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full">
            {doneCount}/{STEPS.length}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {open ? <ChevronDown className="w-4 h-4 text-white/80" /> : <ChevronUp className="w-4 h-4 text-white/80" />}
          <button
            onClick={e => { e.stopPropagation(); setDismissed(true); }}
            className="ml-1 p-0.5 hover:bg-white/20 rounded transition-colors">
            <X className="w-3.5 h-3.5 text-white/80" />
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-indigo-100">
        <div className="h-full bg-indigo-500 transition-all duration-500 rounded-r-full" style={{ width: `${pct}%` }} />
      </div>

      {/* Body */}
      {open && (
        <div className="bg-white">
          {allDone ? (
            <div className="p-4 text-center space-y-1">
              <div className="text-2xl">🎉</div>
              <p className="text-sm font-extrabold text-slate-900">All set up!</p>
              <p className="text-[11px] text-slate-500">Your Kinetix workspace is fully configured.</p>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {STEPS.map(step => {
                const done = status[step.checkKey];
                return (
                  <li key={step.checkKey}>
                    <button
                      onClick={() => !done && setActiveView(step.view)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                        done ? 'opacity-60 cursor-default' : 'hover:bg-indigo-50 cursor-pointer'
                      }`}>
                      <span className="text-base leading-none">{step.icon}</span>
                      <span className={`flex-1 text-xs font-semibold ${done ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                        {step.label}
                      </span>
                      {done
                        ? <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        : <Circle className="w-4 h-4 text-slate-300 shrink-0" />}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
          <div className="px-4 py-2.5 border-t border-slate-100">
            <button
              onClick={() => setActiveView('getting-started')}
              className="w-full text-center text-[11px] font-bold text-indigo-600 hover:text-indigo-800 transition-colors">
              View full guide →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
