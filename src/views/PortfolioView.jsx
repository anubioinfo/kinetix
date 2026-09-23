import React, { useState } from 'react';
import { useProject } from '../context/ProjectContext';
import { 
  Layers, 
  Sparkles, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle, 
  User, 
  TrendingUp, 
  Plus, 
  X, 
  Zap, 
  ArrowRight,
  ShieldCheck,
  Building2,
  PieChart,
  Clock,
  Play
} from 'lucide-react';
import { formatPrettyDate } from '../utils/dateUtils';

export default function PortfolioView() {
  const { 
    milestones, 
    setMilestones,
    portfolios, 
    releases, 
    setReleases, 
    team, 
    setSelectedMilestoneId,
    openDeveloperProfile 
  } = useProject();

  const [activeTab, setActiveTab] = useState('trains'); // 'trains' | 'portfolios' | 'velocity'
  const [filterPortfolioId, setFilterPortfolioId] = useState('all');
  const [isAddReleaseModalOpen, setIsAddReleaseModalOpen] = useState(false);

  // New Release Form State
  const [newReleaseName, setNewReleaseName] = useState('');
  const [newReleaseCode, setNewReleaseCode] = useState('');
  const [newReleasePortfolio, setNewReleasePortfolio] = useState('port-1');
  const [newReleaseDate, setNewReleaseDate] = useState(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  const [newReleaseLead, setNewReleaseLead] = useState('Anurag');
  const [newReleaseDesc, setNewReleaseDesc] = useState('');

  // Filtered Releases
  const filteredReleases = filterPortfolioId === 'all'
    ? releases
    : releases.filter(r => r.portfolioId === filterPortfolioId);

  // Calculate Overall Readiness
  const avgReadiness = Math.round(releases.reduce((acc, r) => acc + (r.readinessScore || 70), 0) / (releases.length || 1));

  // Handle Dispatch Release Train
  const handleDispatchTrain = (relId) => {
    setReleases(prev => prev.map(r => {
      if (r.id === relId) {
        return { ...r, status: 'Released', readinessScore: 100 };
      }
      return r;
    }));

    // Mark associated milestones as Completed
    const targetRel = releases.find(r => r.id === relId);
    if (targetRel && targetRel.milestoneIds) {
      setMilestones(prev => prev.map(m => {
        if (targetRel.milestoneIds.includes(m.id)) {
          return { ...m, status: 'Completed', progress: 100 };
        }
        return m;
      }));
    }
  };

  // Handle Assign Milestone to Release Train
  const handleAssignToTrain = (milestoneId, relId) => {
    setReleases(prev => prev.map(r => {
      // Remove from existing if present
      const currentIds = (r.milestoneIds || []).filter(id => id !== milestoneId);
      if (r.id === relId) {
        return { ...r, milestoneIds: [...currentIds, milestoneId] };
      }
      return { ...r, milestoneIds: currentIds };
    }));
  };

  const handleCreateRelease = (e) => {
    e.preventDefault();
    if (!newReleaseName.trim()) return;

    const newRel = {
      id: `rel-${Date.now()}`,
      name: newReleaseName,
      codeName: newReleaseCode || `Train-${Date.now().toString().slice(-4)}`,
      portfolioId: newReleasePortfolio,
      date: newReleaseDate,
      status: 'In Progress',
      readinessScore: 35,
      lead: newReleaseLead,
      milestoneIds: [],
      description: newReleaseDesc || 'Newly created Agile Release Train'
    };

    setReleases(prev => [...prev, newRel]);
    setIsAddReleaseModalOpen(false);
    setNewReleaseName('');
    setNewReleaseCode('');
    setNewReleaseDesc('');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Executive Portfolio Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white shadow-xl border border-indigo-900/50 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/30 border border-indigo-400/30 flex items-center justify-center text-indigo-300 shadow-md">
            <Layers className="w-7 h-7 text-indigo-300" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold flex items-center gap-2">
              <span>Multi-View Portfolio Engine & Release Trains</span>
              <span className="text-xs uppercase tracking-wider bg-purple-500/20 text-purple-300 px-2.5 py-0.5 rounded-full border border-purple-400/30 font-mono">
                SAFe Enterprise
              </span>
            </h2>
            <p className="text-xs text-indigo-200 mt-1 font-medium">
              Synchronize feature milestones across enterprise product portfolios & scheduled Program Increment (PI) Release Trains.
            </p>
          </div>
        </div>

        {/* Quick Stats Badges */}
        <div className="flex items-center gap-3 flex-wrap text-xs">
          <div className="px-3.5 py-2 rounded-xl bg-white/10 border border-white/10 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-teal-400" />
            <div>
              <span className="text-[10px] text-slate-300 uppercase block font-semibold">Portfolios</span>
              <span className="font-extrabold text-sm">{portfolios.length} Active</span>
            </div>
          </div>

          <div className="px-3.5 py-2 rounded-xl bg-white/10 border border-white/10 flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-400" />
            <div>
              <span className="text-[10px] text-slate-300 uppercase block font-semibold">Release Trains</span>
              <span className="font-extrabold text-sm">{releases.length} Trains</span>
            </div>
          </div>

          <div className="px-3.5 py-2 rounded-xl bg-white/10 border border-white/10 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <div>
              <span className="text-[10px] text-slate-300 uppercase block font-semibold">Overall Readiness</span>
              <span className="font-extrabold text-sm text-emerald-300">{avgReadiness}%</span>
            </div>
          </div>

          <button
            onClick={() => setIsAddReleaseModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Release Train</span>
          </button>
        </div>
      </div>

      {/* Tabs & Portfolio Filter Toolbar */}
      <div className="bg-white rounded-2xl p-3 shadow-xs border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('trains')}
            className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 ${
              activeTab === 'trains' 
                ? 'bg-indigo-600 text-white shadow-xs' 
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <span>🚆 Agile Release Trains (ART)</span>
          </button>

          <button
            onClick={() => setActiveTab('portfolios')}
            className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 ${
              activeTab === 'portfolios' 
                ? 'bg-indigo-600 text-white shadow-xs' 
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <span>📁 Multi-Portfolio Board</span>
          </button>

          <button
            onClick={() => setActiveTab('velocity')}
            className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 ${
              activeTab === 'velocity' 
                ? 'bg-indigo-600 text-white shadow-xs' 
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <span>📊 Program Increment Velocity</span>
          </button>
        </div>

        {/* Portfolio Stream Filter */}
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Filter Stream:</span>
          <select
            value={filterPortfolioId}
            onChange={(e) => setFilterPortfolioId(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 font-bold text-slate-800 text-xs focus:outline-hidden focus:border-indigo-600"
          >
            <option value="all">All Portfolios ({portfolios.length})</option>
            {portfolios.map(p => (
              <option key={p.id} value={p.id}>{p.name} ({p.code})</option>
            ))}
          </select>
        </div>

      </div>

      {/* TAB 1: Agile Release Train Tracks */}
      {activeTab === 'trains' && (
        <div className="space-y-6">
          {filteredReleases.map((rel) => {
            const portfolio = portfolios.find(p => p.id === rel.portfolioId) || portfolios[0];
            const trainMilestones = milestones.filter(m => (rel.milestoneIds || []).includes(m.id));
            const completedCount = trainMilestones.filter(m => m.status === 'Completed').length;
            const progressPct = trainMilestones.length > 0 
              ? Math.round(trainMilestones.reduce((acc, m) => acc + m.progress, 0) / trainMilestones.length)
              : rel.readinessScore || 50;

            return (
              <div 
                key={rel.id} 
                className="bg-white rounded-2xl border-2 border-slate-200 shadow-sm overflow-hidden hover:border-indigo-300 transition-all space-y-4 p-5"
              >
                {/* Train Track Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-white shadow-md text-sm"
                      style={{ backgroundColor: portfolio.color }}
                    >
                      ART
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-extrabold text-slate-900 text-base">{rel.name}</h3>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200">
                          {rel.codeName}
                        </span>
                        <span 
                          className="px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white shadow-2xs"
                          style={{ backgroundColor: portfolio.color }}
                        >
                          {portfolio.name}
                        </span>
                      </div>
                      <p className="text-slate-500 text-xs mt-0.5">{rel.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Launch Date */}
                    <div className="text-right text-xs">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Target Release Date</span>
                      <span className="font-extrabold text-slate-900 flex items-center gap-1 justify-end font-mono">
                        <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                        {formatPrettyDate(rel.date)}
                      </span>
                    </div>

                    {/* Lead Owner */}
                    <button
                      onClick={() => openDeveloperProfile(rel.lead)}
                      className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-800 flex items-center gap-1.5 transition-colors"
                    >
                      <User className="w-3.5 h-3.5 text-indigo-600" />
                      <span>{rel.lead}</span>
                    </button>

                    {/* Status Badge & Dispatch Button */}
                    {rel.status === 'Released' ? (
                      <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 font-extrabold text-xs flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Released</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => handleDispatchTrain(rel.id)}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs shadow-xs transition-all flex items-center gap-1.5"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Dispatch Release Train</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Train Track Visual Line */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700 flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4 text-indigo-600" />
                      <span>Release Readiness Gauge ({progressPct}%)</span>
                    </span>
                    <span className="font-mono text-slate-500 font-semibold">
                      {completedCount} of {trainMilestones.length} Milestones Completed
                    </span>
                  </div>

                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-200 flex p-0.5">
                    <div 
                      className="bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                </div>

                {/* Milestone Train Cars Grid */}
                <div className="space-y-2 pt-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                    Assigned Feature Cars ({trainMilestones.length}):
                  </span>

                  {trainMilestones.length === 0 ? (
                    <div className="p-4 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-center text-xs text-slate-500">
                      No milestones currently assigned to this Release Train track. Use the dropdown below to board milestones onto this train.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {trainMilestones.map((m) => (
                        <div 
                          key={m.id}
                          onClick={() => setSelectedMilestoneId(m.id)}
                          className="p-3.5 bg-slate-50/80 hover:bg-indigo-50/40 rounded-xl border border-slate-200 hover:border-indigo-300 transition-all cursor-pointer space-y-2 group shadow-2xs"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                              {m.priority}
                            </span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                              m.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {m.status}
                            </span>
                          </div>

                          <h4 className="font-extrabold text-slate-900 text-xs truncate group-hover:text-indigo-600 transition-colors">
                            {m.title}
                          </h4>

                          <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium border-t border-slate-100 pt-2">
                            <span>Owner: <strong className="text-slate-800">{m.owner}</strong></span>
                            <span className="font-mono text-indigo-700 font-bold">{m.progress}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            );
          })}

          {/* Board Unassigned Milestones onto Release Trains */}
          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Unassigned Milestones & Release Boarding Pass</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {milestones.map((m) => {
                const assignedRelease = releases.find(r => (r.milestoneIds || []).includes(m.id));

                return (
                  <div key={m.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-3 text-xs">
                    <div className="min-w-0 flex-1">
                      <h4 className="font-extrabold text-slate-900 truncate">{m.title}</h4>
                      <div className="text-[11px] text-slate-500">Lead: <strong>{m.owner}</strong> | Due: {formatPrettyDate(m.dueDate)}</div>
                    </div>

                    <select
                      value={assignedRelease?.id || ''}
                      onChange={(e) => handleAssignToTrain(m.id, e.target.value)}
                      className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-indigo-700 focus:outline-hidden"
                    >
                      <option value="">Unassigned Train</option>
                      {releases.map(r => (
                        <option key={r.id} value={r.id}>{r.name}</option>
                      ))}
                    </select>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Multi-Portfolio Executive Board */}
      {activeTab === 'portfolios' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {portfolios.map((port) => {
            const portReleases = releases.filter(r => r.portfolioId === port.id);
            const portMilestoneIds = portReleases.flatMap(r => r.milestoneIds || []);
            const portMilestones = milestones.filter(m => portMilestoneIds.includes(m.id));
            const completedCount = portMilestones.filter(m => m.status === 'Completed').length;
            const avgProgress = portMilestones.length > 0 
              ? Math.round(portMilestones.reduce((acc, m) => acc + m.progress, 0) / portMilestones.length)
              : 65;

            return (
              <div 
                key={port.id} 
                className="bg-white rounded-2xl border-2 border-slate-200 shadow-sm p-6 space-y-4 hover:border-indigo-400 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-white shadow-md text-sm"
                      style={{ backgroundColor: port.color }}
                    >
                      {port.code}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-base">{port.name}</h3>
                      <span className="text-slate-500 text-xs font-medium">Lead: <strong>{port.lead}</strong></span>
                    </div>
                  </div>

                  <span 
                    className="px-3 py-1 rounded-full text-xs font-bold text-white shadow-2xs"
                    style={{ backgroundColor: port.color }}
                  >
                    Budget: {port.budget}
                  </span>
                </div>

                <p className="text-slate-600 text-xs leading-relaxed">{port.description}</p>

                {/* Progress Bar */}
                <div className="space-y-1.5 pt-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <span>Portfolio Execution Progress</span>
                    <span className="font-mono text-indigo-700">{avgProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200">
                    <div 
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${avgProgress}%`, backgroundColor: port.color }}
                    />
                  </div>
                </div>

                {/* Linked Release Trains */}
                <div className="space-y-2 border-t border-slate-100 pt-3">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Linked Release Trains:</span>
                  <div className="space-y-1.5 text-xs">
                    {portReleases.map(r => (
                      <div key={r.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                        <span className="font-bold text-slate-800">{r.name}</span>
                        <span className="font-mono text-indigo-700 font-bold">{r.date}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* TAB 3: Program Increment (PI) Velocity Matrix */}
      {activeTab === 'velocity' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">Program Increment (PI) Velocity & Feature Points</h3>
            <p className="text-slate-500 text-xs">Calculates total story points completed per Release Train vs planned velocity capacity.</p>
          </div>

          <div className="space-y-4">
            {releases.map((rel) => {
              const relMilestones = milestones.filter(m => (rel.milestoneIds || []).includes(m.id));
              const totalPoints = relMilestones.reduce((acc, m) => {
                const subPts = (m.features || []).reduce((fAcc, f) => fAcc + (f.points || 5), 0);
                return acc + (subPts || m.effort * 3);
              }, 0);

              const completedPoints = relMilestones.reduce((acc, m) => {
                const subPts = (m.features || []).filter(f => f.completed).reduce((fAcc, f) => fAcc + (f.points || 5), 0);
                return acc + (m.status === 'Completed' ? (subPts || m.effort * 3) : subPts);
              }, 0);

              const pct = totalPoints > 0 ? Math.round((completedPoints / totalPoints) * 100) : rel.readinessScore || 60;

              return (
                <div key={rel.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-sm">{rel.name}</h4>
                      <span className="text-slate-500 text-[11px]">Lead: <strong>{rel.lead}</strong></span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-extrabold text-indigo-700 text-sm">{completedPoints} / {totalPoints || 30} pts</span>
                      <span className="text-[10px] text-slate-400 block font-bold">PI Story Points</span>
                    </div>
                  </div>

                  <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden border border-slate-300">
                    <div 
                      className="bg-gradient-to-r from-indigo-600 to-emerald-500 h-full rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SCHEDULE RELEASE TRAIN MODAL */}
      {isAddReleaseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg p-6 space-y-4 animate-scale-up">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-600" />
                <span>Schedule New Agile Release Train (ART)</span>
              </h3>
              <button 
                onClick={() => setIsAddReleaseModalOpen(false)}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateRelease} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Release Train Title</label>
                <input 
                  type="text" 
                  value={newReleaseName}
                  onChange={(e) => setNewReleaseName(e.target.value)}
                  placeholder="e.g. ART 2027.Q2 - AI Agent Hub"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold focus:outline-hidden focus:border-indigo-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Train Code Name</label>
                  <input 
                    type="text" 
                    value={newReleaseCode}
                    onChange={(e) => setNewReleaseCode(e.target.value)}
                    placeholder="Train-Delta (v2.5)"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono font-bold focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Portfolio Stream</label>
                  <select
                    value={newReleasePortfolio}
                    onChange={(e) => setNewReleasePortfolio(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold focus:outline-hidden"
                  >
                    {portfolios.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Target Launch Date</label>
                  <input 
                    type="date" 
                    value={newReleaseDate}
                    onChange={(e) => setNewReleaseDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Release Train Lead</label>
                  <select
                    value={newReleaseLead}
                    onChange={(e) => setNewReleaseLead(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold focus:outline-hidden"
                  >
                    {team.map(t => (
                      <option key={t.id} value={t.name}>{t.name} ({t.role.split(' ')[0]})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Description & Objective</label>
                <textarea
                  value={newReleaseDesc}
                  onChange={(e) => setNewReleaseDesc(e.target.value)}
                  rows={3}
                  placeholder="Summary of scope, dependencies, & key deliverables for this release train..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-medium focus:outline-hidden"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs transition-colors shadow-md flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Create Agile Release Train</span>
              </button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
