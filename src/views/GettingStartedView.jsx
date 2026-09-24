import React from 'react';
import { useProject } from '../context/ProjectContext';
import {
  FolderKanban, Target, Calendar, GitCommit, Users, BarChart3, Sparkles,
  CheckCircle2, Circle, ChevronRight, Layers, Zap, Shield, TrendingUp, Play,
  ArrowRight, Lightbulb
} from 'lucide-react';

const STEPS = [
  { id: 1, icon: FolderKanban, color: '#6366f1', bg: '#eef2ff', border: '#818cf8', title: 'Create a Project',      subtitle: 'Workspaces',               description: 'Start by creating a project workspace. Each project has its own milestones, goals, and team members.', tip: 'Use the project switcher in the top bar to switch between multiple projects.', action: 'Go to Workspaces', view: 'projects',     checkKey: 'hasProjects'    },
  { id: 2, icon: Target,       color: '#7c3aed', bg: '#f5f3ff', border: '#a78bfa', title: 'Define Goals',         subtitle: 'Strategic OKRs',            description: 'Set high-level business objectives. Every milestone should map to at least one goal for alignment.',    tip: 'Goals appear as filter options in the Roadmap to group milestones by objective.', action: 'Set Goals',      view: 'strategy',     checkKey: 'hasGoals'       },
  { id: 3, icon: Calendar,     color: '#2563eb', bg: '#eff6ff', border: '#60a5fa', title: 'Create Milestones',   subtitle: 'Roadmap (Gantt)',            description: 'Add milestones with start/due dates, owners, and priority. Link each one to a strategic goal.',        tip: 'Drag milestone bars left/right to reschedule. Click a bar to edit full details.', action: 'Open Roadmap',   view: 'gantt',        checkKey: 'hasMilestones'  },
  { id: 4, icon: GitCommit,    color: '#d97706', bg: '#fffbeb', border: '#fbbf24', title: 'Link Dependencies',   subtitle: 'Dependencies',              description: 'Connect milestones that must finish before another can start. Auto-detects date conflicts instantly.',   tip: 'In the Gantt view, drag the blue dot from a bar onto another bar to create a link.', action: 'Map Deps',      view: 'dependencies', checkKey: 'hasDependencies'},
  { id: 5, icon: Users,        color: '#0d9488', bg: '#f0fdfa', border: '#2dd4bf', title: 'Assign Your Team',    subtitle: 'Team Capacity',             description: 'Add team members, set their capacity, and assign them as owners of milestones to balance workloads.',    tip: 'The capacity view highlights over-allocated engineers so you can rebalance quickly.', action: 'Manage Team',   view: 'resource',     checkKey: 'hasTeam'        },
  { id: 6, icon: Layers,       color: '#e11d48', bg: '#fff1f2', border: '#fb7185', title: 'Plan Releases',       subtitle: 'Release Trains (ART)',      description: 'Group milestones into Program Increments (SAFe). Track release readiness and dispatch trains.',          tip: 'SAFe-compatible Agile Release Trains with one-click dispatch when milestones are ready.', action: 'Plan Releases', view: 'portfolio',    checkKey: 'hasReleases'    },
  { id: 7, icon: BarChart3,    color: '#059669', bg: '#ecfdf5', border: '#34d399', title: 'Track & Analyze',     subtitle: 'Executive Analytics',       description: 'Review Earned Value Management metrics, burndown charts, and completion velocity over time.',             tip: 'Use the AI Sprint Retrospective to get AI-powered insights on sprint performance.', action: 'View Analytics', view: 'analytics',    checkKey: 'hasAnalytics'   },
];

const TIPS = [
  { tip: 'Drag milestone bars left/right in the Roadmap to reschedule dates instantly.', where: 'Roadmap' },
  { tip: 'Drag the blue 🔵 connector dot from a milestone bar to another to create a dependency.', where: 'Roadmap' },
  { tip: 'Click the amber "Fix (N)" pill in the header to auto-resolve all date conflicts at once.', where: 'Header' },
  { tip: 'Use the Filter button to slice the roadmap by goal, health, owner, or priority level.', where: 'Header' },
  { tip: 'Click Kinetix IQ (AI) to auto-generate milestones, summaries & risk alerts instantly.', where: 'AI Copilot' },
  { tip: 'Click "Promote" on any idea to instantly convert it into a milestone on the roadmap.', where: 'Ideas Portal' },
  { tip: 'Use Time Travel (Tools menu) to view the entire roadmap as of any past date.', where: 'Tools' },
  { tip: 'Run What-If scenarios to simulate schedule risk before committing to release dates.', where: 'Simulator' },
  { tip: 'Use AI Auto-Scheduler to rebalance milestones automatically based on team capacity.', where: 'Tools' },
];

const LAYERS = [
  { title: 'Planning Layer', subtitle: "Define the 'what'", iconColor: '#6366f1', iconBg: '#eef2ff', Icon: Shield,
    items: [{ l: 'Workspaces', d: 'Create & switch projects', v: 'projects' }, { l: 'Strategic Goals', d: 'Set OKRs & objectives', v: 'strategy' }, { l: 'Ideas Portal', d: 'Capture feature requests', v: 'ideas' }] },
  { title: 'Execution Layer', subtitle: 'Run the work', iconColor: '#7c3aed', iconBg: '#f5f3ff', Icon: Zap,
    items: [{ l: 'Roadmap (Gantt)', d: 'Timeline & drag-drop dates', v: 'gantt' }, { l: 'Kanban Board', d: 'Sprint task management', v: 'kanban' }, { l: 'Dependencies', d: 'Link & auto-fix conflicts', v: 'dependencies' }, { l: 'Priority Matrix', d: 'RICE scoring & 2×2 matrix', v: 'priority' }] },
  { title: 'Insights Layer', subtitle: 'Measure success', iconColor: '#059669', iconBg: '#ecfdf5', Icon: TrendingUp,
    items: [{ l: 'Executive Analytics', d: 'EVM, burndown & SPI/CPI', v: 'analytics' }, { l: 'Team Workload', d: 'Capacity & hour allocation', v: 'resource' }, { l: 'Release Trains', d: 'SAFe PI planning', v: 'portfolio' }, { l: 'What-If Simulator', d: 'Monte Carlo forecasting', v: 'whatif' }] },
];

export default function GettingStartedView() {
  const { setActiveView, projects, goals, milestones, team, releases, startTour } = useProject();

  const hasDeps = milestones.some(m => m.dependencies && m.dependencies.length > 0);
  const status = {
    hasProjects: projects.length > 0, hasGoals: goals.length > 0, hasMilestones: milestones.length > 0,
    hasDependencies: hasDeps, hasTeam: team.length > 0,
    hasReleases: releases && releases.length > 0, hasAnalytics: milestones.some(m => m.progress > 0),
  };

  const doneCount = STEPS.filter(s => status[s.checkKey]).length;
  const pct = Math.round((doneCount / STEPS.length) * 100);
  const circ = 2 * Math.PI * 34;

  return (
    <div className="space-y-10 pb-16">

      {/* ── Hero ─── */}
      <div className="relative overflow-hidden rounded-2xl p-8 text-white shadow-xl"
        style={{ background: 'linear-gradient(135deg,#4f46e5 0%,#7c3aed 55%,#6d28d9 100%)' }}>
        <div className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle,white 1px,transparent 1px)', backgroundSize: '32px 32px' }} />
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-purple-200 animate-pulse" />
              <span className="text-purple-200 text-[11px] font-black uppercase tracking-widest">Quick Start Guide</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight mb-2">Welcome to Kinetix 🚀</h1>
            <p className="text-purple-100 text-sm leading-relaxed max-w-lg">
              Follow the 7-step workflow below to go from a blank project to a fully configured, AI-powered milestone roadmap.
            </p>
            <div className="flex flex-wrap gap-2 mt-5">
              <button onClick={startTour} className="flex items-center gap-1.5 px-4 py-2 bg-white/15 hover:bg-white/25 border border-white/30 rounded-xl text-sm font-bold transition-all">
                <Play className="w-3.5 h-3.5" /> Guided Tour
              </button>
              <button onClick={() => setActiveView('gantt')} className="flex items-center gap-1.5 px-4 py-2 bg-white/15 hover:bg-white/25 border border-white/30 rounded-xl text-sm font-bold transition-all">
                <Calendar className="w-3.5 h-3.5" /> Open Roadmap
              </button>
              <button onClick={() => setActiveView('analytics')} className="flex items-center gap-1.5 px-4 py-2 bg-white/15 hover:bg-white/25 border border-white/30 rounded-xl text-sm font-bold transition-all">
                <BarChart3 className="w-3.5 h-3.5" /> Analytics
              </button>
            </div>
          </div>
          <div className="flex flex-col items-center gap-2 shrink-0">
            <div className="relative w-24 h-24">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="7" />
                <circle cx="40" cy="40" r="34" fill="none" stroke="white" strokeWidth="7"
                  strokeDasharray={circ} strokeDashoffset={circ * (1 - pct / 100)}
                  strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.8s ease' }} />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-black">{pct}%</span>
              </div>
            </div>
            <span className="text-sm font-bold text-purple-200">{doneCount} / {STEPS.length} done</span>
          </div>
        </div>
        <div className="relative z-10 mt-6">
          <div className="flex justify-between text-[11px] text-purple-200 font-semibold mb-1.5">
            <span>Start here</span><span>Fully configured ✓</span>
          </div>
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-white rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </div>

      {/* ── 7-Step Flow ─── */}
      <section>
        <h2 className="text-xl font-black text-slate-900 mb-1">The 7-Step Setup Workflow</h2>
        <p className="text-sm text-slate-500 mb-6">Follow the arrows — each step builds on the previous one.</p>

        {/* Horizontal scroll container */}
        <div className="overflow-x-auto pb-4">
          <div className="flex items-stretch gap-0" style={{ minWidth: 'max-content' }}>
            {STEPS.map((step, idx) => {
              const Icon = step.icon;
              const done = status[step.checkKey];
              const isLast = idx === STEPS.length - 1;
              const nextStep = STEPS[idx + 1];

              return (
                <div key={step.id} className="flex items-stretch">

                  {/* ── Card ── */}
                  <button
                    onClick={() => setActiveView(step.view)}
                    className="relative flex flex-col text-left rounded-2xl border-2 overflow-hidden group transition-all duration-200 hover:-translate-y-1 focus:outline-none"
                    style={{
                      width: '200px',
                      minHeight: '320px',
                      borderColor: done ? step.border : '#e2e8f0',
                      background: done ? step.bg : '#ffffff',
                      boxShadow: `0 4px 20px -4px ${step.color}22`,
                    }}>

                    {/* Colored top bar */}
                    <div className="h-1.5 w-full" style={{ background: step.color }} />

                    {/* Done ribbon */}
                    {done && (
                      <div className="absolute top-3 right-3">
                        <CheckCircle2 className="w-5 h-5" style={{ color: step.color }} />
                      </div>
                    )}

                    <div className="flex flex-col flex-1 p-5 gap-3">
                      {/* Step number */}
                      <span className="w-7 h-7 rounded-full text-white text-xs font-black flex items-center justify-center shrink-0"
                        style={{ background: step.color }}>
                        {step.id}
                      </span>

                      {/* Icon block */}
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ background: step.bg }}>
                        <Icon className="w-6 h-6" style={{ color: step.color }} />
                      </div>

                      {/* Text */}
                      <div className="flex-1">
                        <p className="text-[10px] font-black uppercase tracking-widest mb-0.5" style={{ color: step.color }}>
                          {step.subtitle}
                        </p>
                        <h3 className="text-sm font-extrabold text-slate-900 mb-2 leading-tight">{step.title}</h3>
                        <p className="text-[11px] text-slate-500 leading-relaxed">{step.description}</p>
                      </div>

                      {/* Tip */}
                      <div className="flex items-start gap-1.5 p-2.5 rounded-xl" style={{ background: step.bg }}>
                        <Lightbulb className="w-3 h-3 mt-0.5 shrink-0" style={{ color: step.color }} />
                        <p className="text-[10px] leading-relaxed" style={{ color: step.color }}>{step.tip}</p>
                      </div>

                      {/* CTA */}
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[11px] font-extrabold group-hover:underline" style={{ color: step.color }}>
                          {step.action}
                        </span>
                        <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5"
                          style={{ color: step.color }} />
                      </div>
                    </div>
                  </button>

                  {/* ── Arrow Connector ── */}
                  {!isLast && (
                    <div className="flex items-center px-1 shrink-0 self-center">
                      {/* Arrow body + head using CSS border trick */}
                      <div className="flex items-center">
                        {/* shaft */}
                        <div className="w-6 h-1 rounded-l-full"
                          style={{ background: `linear-gradient(90deg, ${step.color}, ${nextStep.color})` }} />
                        {/* arrowhead */}
                        <div style={{
                          width: 0, height: 0,
                          borderTop: '10px solid transparent',
                          borderBottom: '10px solid transparent',
                          borderLeft: `14px solid ${nextStep.color}`,
                        }} />
                      </div>
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        </div>
        <p className="text-[11px] text-slate-400 text-center mt-2">← Scroll horizontally to see all steps →</p>
      </section>

      {/* ── Feature Map ─── */}
      <section>
        <h2 className="text-xl font-black text-slate-900 mb-1">How All Views Connect</h2>
        <p className="text-sm text-slate-500 mb-5">Three layers — Planning feeds Execution, Execution feeds Insights.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
          {LAYERS.map((layer, li) => {
            const LayerIcon = layer.Icon;
            return (
              <div key={layer.title} className={`p-6 bg-white ${li < 2 ? 'border-b md:border-b-0 md:border-r border-slate-200' : ''}`}>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: layer.iconBg }}>
                    <LayerIcon className="w-5 h-5" style={{ color: layer.iconColor }} />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900">{layer.title}</h3>
                    <p className="text-xs text-slate-400">{layer.subtitle}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {layer.items.map(item => (
                    <button key={item.v} onClick={() => setActiveView(item.v)}
                      className="w-full flex items-center justify-between px-3.5 py-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-all text-left group">
                      <div>
                        <div className="text-xs font-bold text-slate-800">{item.l}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{item.d}</div>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-500 shrink-0" />
                    </button>
                  ))}
                </div>
                {li < 2 && (
                  <div className="hidden md:flex justify-end mt-3">
                    <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                      feeds <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Tips ─── */}
      <section>
        <h2 className="text-xl font-black text-slate-900 mb-1">Power User Tips</h2>
        <p className="text-sm text-slate-500 mb-5">Get more out of Kinetix with these shortcuts and hidden features.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {TIPS.map((item, i) => (
            <div key={i} className="flex items-start gap-3 p-4 bg-white rounded-xl border border-slate-200 hover:border-indigo-200 hover:shadow-sm transition-all">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white text-xs font-black flex items-center justify-center shrink-0 mt-0.5">{i + 1}</div>
              <div>
                <p className="text-xs text-slate-600 leading-relaxed">{item.tip}</p>
                <span className="inline-block mt-1.5 text-[10px] font-bold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full uppercase tracking-wider">{item.where}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
