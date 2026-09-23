import React, { useState } from 'react';
import { useProject } from '../context/ProjectContext';
import { Activity, Clock, User, Filter, Search, X, ShieldCheck, History, ArrowRight } from 'lucide-react';

export default function ActivityTicker() {
  const { activityLogs } = useProject();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [userFilter, setUserFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  if (!activityLogs || activityLogs.length === 0) return null;

  const latestLog = activityLogs[0];

  const filteredLogs = activityLogs.filter(log => {
    const matchesSearch = !searchFilter || 
      log.details.toLowerCase().includes(searchFilter.toLowerCase()) ||
      log.action.toLowerCase().includes(searchFilter.toLowerCase()) ||
      log.user.toLowerCase().includes(searchFilter.toLowerCase());
    
    const matchesUser = userFilter === 'all' || log.user === userFilter;
    const matchesType = typeFilter === 'all' || log.type === typeFilter;

    return matchesSearch && matchesUser && matchesType;
  });

  const uniqueUsers = Array.from(new Set(activityLogs.map(l => l.user)));

  return (
    <>
      {/* Top Banner Activity Stream Ticker */}
      <div className="bg-slate-900 text-slate-200 border-b border-slate-800 text-xs py-1.5 px-4 flex items-center justify-between gap-4 shadow-xs relative z-20">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <div className="flex items-center gap-1.5 bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full font-mono text-[10px] font-bold border border-indigo-500/30 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span>LIVE AUDIT TICKER</span>
          </div>

          <div className="flex items-center gap-2 truncate text-slate-300 font-medium">
            <span className="font-bold text-indigo-400 shrink-0">{latestLog.user}:</span>
            <span className="font-semibold text-slate-100 shrink-0">[{latestLog.action}]</span>
            <span className="truncate text-slate-300">{latestLog.details}</span>
            <span className="text-[10px] font-mono text-slate-400 shrink-0">({latestLog.timestamp})</span>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-300 hover:text-white hover:underline shrink-0 bg-slate-800 hover:bg-slate-700 px-2.5 py-0.5 rounded border border-slate-700 transition-colors"
        >
          <History className="w-3.5 h-3.5" />
          <span>Full Audit Log ({activityLogs.length})</span>
        </button>
      </div>

      {/* Full Audit Log History Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-3xl flex flex-col max-h-[85vh] overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-xs">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-white">Enterprise Activity & Audit Trail</h3>
                  <p className="text-xs text-slate-400">Complete immutable record of milestone, priority, and team execution changes</p>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter Bar */}
            <div className="p-4 bg-slate-50 border-b border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              
              {/* Search input */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search logs..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="w-full bg-white text-slate-900 pl-9 pr-3 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:border-indigo-500 font-medium"
                />
              </div>

              {/* User filter */}
              <div>
                <select
                  value={userFilter}
                  onChange={(e) => setUserFilter(e.target.value)}
                  className="w-full bg-white text-slate-900 px-3 py-1.5 rounded-lg border border-slate-300 font-semibold"
                >
                  <option value="all">All Team Members ({uniqueUsers.length})</option>
                  {uniqueUsers.map(u => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              </div>

              {/* Type filter */}
              <div>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full bg-white text-slate-900 px-3 py-1.5 rounded-lg border border-slate-300 font-semibold"
                >
                  <option value="all">All Action Types</option>
                  <option value="milestone">Milestone Changes</option>
                  <option value="matrix">Priority Matrix Moves</option>
                  <option value="task">Sub-Task Updates</option>
                  <option value="idea">Ideas & Proposals</option>
                  <option value="risk">AI Risk Remediation</option>
                  <option value="project">Workspace Access</option>
                </select>
              </div>

            </div>

            {/* Scrollable Audit Log List */}
            <div className="p-5 overflow-y-auto space-y-3 flex-1 text-xs">
              {filteredLogs.map(log => (
                <div
                  key={log.id}
                  className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-indigo-200 hover:bg-slate-50/80 transition-all shadow-2xs flex items-start justify-between gap-3"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-slate-900 text-xs">{log.user}</span>
                      <span className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold ${
                        log.type === 'matrix' ? 'bg-amber-100 text-amber-800' :
                        log.type === 'risk' ? 'bg-rose-100 text-rose-800' :
                        log.type === 'idea' ? 'bg-purple-100 text-purple-800' :
                        'bg-indigo-100 text-indigo-800'
                      }`}>
                        {log.action}
                      </span>
                    </div>
                    <p className="text-slate-700 font-medium leading-relaxed">{log.details}</p>
                  </div>

                  <span className="text-[10px] font-mono font-bold text-slate-400 shrink-0 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {log.timestamp}
                  </span>
                </div>
              ))}

              {filteredLogs.length === 0 && (
                <div className="text-center py-10 text-slate-400 italic">
                  No activity log entries match the selected filters.
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>Showing <strong>{filteredLogs.length}</strong> of <strong>{activityLogs.length}</strong> total entries</span>
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold transition-colors"
              >
                Close Audit Trail
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
