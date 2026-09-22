import React from 'react';
import { useProject } from '../context/ProjectContext';
import { Users, AlertTriangle, CheckCircle, ExternalLink, Award } from 'lucide-react';

export default function ResourceView() {
  const { team, milestones, openDeveloperProfile } = useProject();

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-slate-900">Developer Metrics & Team Capacity Dashboard</h2>
          </div>
          <p className="text-xs text-slate-500 font-medium">Click on any team member's name or avatar to view their dedicated Developer Profile & Velocity Metrics</p>
        </div>
      </div>

      {/* Team Allocation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {team.map((member) => {
          const memberMilestones = milestones.filter(m => m.owner === member.name);
          const isOverCapacity = member.assignedHours > member.capacityHours;
          const percent = Math.min(100, Math.round((member.assignedHours / member.capacityHours) * 100));

          return (
            <div
              key={member.id}
              className={`glass-panel p-5 rounded-xl border space-y-4 shadow-xs bg-white ${
                isOverCapacity ? 'border-rose-300 bg-rose-50/40' : 'border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div 
                  onClick={() => openDeveloperProfile(member.name)}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center font-extrabold text-white shadow-xs text-sm group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: member.color }}
                  >
                    {member.avatar}
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 group-hover:text-indigo-600 group-hover:underline transition-colors flex items-center gap-1.5">
                      <span>{member.name}</span>
                      <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-indigo-600 transition-opacity" />
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">{member.role}</p>
                  </div>
                </div>

                {isOverCapacity ? (
                  <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-rose-100 text-rose-800 border border-rose-300 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                    Over Capacity (+{member.assignedHours - member.capacityHours}h)
                  </span>
                ) : (
                  <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    Optimal Load
                  </span>
                )}
              </div>

              {/* Allocation Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-600">Assigned Weekly Load</span>
                  <span className={`font-mono ${isOverCapacity ? 'text-rose-700' : 'text-indigo-700'}`}>
                    {member.assignedHours} / {member.capacityHours} hrs ({percent}%)
                  </span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isOverCapacity ? 'bg-rose-500' : 'bg-gradient-to-r from-indigo-500 to-teal-400'
                    }`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>

              {/* Assigned Milestones List */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 block">Assigned Milestones ({memberMilestones.length})</span>
                  <button
                    onClick={() => openDeveloperProfile(member.name)}
                    className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 hover:underline flex items-center gap-1"
                  >
                    <Award className="w-3.5 h-3.5" />
                    <span>View Profile & Metrics →</span>
                  </button>
                </div>
                
                <div className="space-y-1.5">
                  {memberMilestones.map(m => (
                    <div key={m.id} className="p-2 rounded bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800 truncate">{m.title}</span>
                      <span className="text-slate-500 font-mono text-[10px] font-semibold">{m.status}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
