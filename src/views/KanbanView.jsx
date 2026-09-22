import React, { useState } from 'react';
import { useProject } from '../context/ProjectContext';
import { Kanban, Move, CheckCircle2 } from 'lucide-react';
import { formatPrettyDate } from '../utils/dateUtils';

export default function KanbanView() {
  const { filteredMilestones, updateMilestone, setSelectedMilestoneId, openDeveloperProfile } = useProject();

  const [draggedMsId, setDraggedMsId] = useState(null);
  const [activeOverColumnId, setActiveOverColumnId] = useState(null);
  const [toastMsg, setToastMsg] = useState(null);

  const columns = [
    { id: 'Not Started', label: 'Not Started', color: 'border-slate-200 bg-slate-100/70 text-slate-700' },
    { id: 'In Progress', label: 'In Progress', color: 'border-indigo-200 bg-indigo-50/80 text-indigo-900' },
    { id: 'Under Review', label: 'Under Review', color: 'border-amber-200 bg-amber-50/80 text-amber-900' },
    { id: 'Completed', label: 'Completed', color: 'border-emerald-200 bg-emerald-50/80 text-emerald-900' },
    { id: 'Blocked', label: 'Blocked / Delay', color: 'border-rose-200 bg-rose-50/80 text-rose-900' },
  ];

  const handleMoveStatus = (ms, newStatus) => {
    if (ms.status === newStatus) return;
    const updated = {
      ...ms,
      status: newStatus,
      progress: newStatus === 'Completed' ? 100 : ms.progress
    };
    updateMilestone(updated);
    setToastMsg(`Moved "${ms.title}" to ${newStatus}`);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleDragStart = (e, ms) => {
    e.dataTransfer.setData('text/plain', ms.id);
    e.dataTransfer.effectAllowed = 'move';
    setDraggedMsId(ms.id);
  };

  const handleDragOver = (e, colId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (activeOverColumnId !== colId) {
      setActiveOverColumnId(colId);
    }
  };

  const handleDragLeave = (e, colId) => {
    e.preventDefault();
    if (activeOverColumnId === colId) {
      setActiveOverColumnId(null);
    }
  };

  const handleDrop = (e, colId) => {
    e.preventDefault();
    const msId = e.dataTransfer.getData('text/plain') || draggedMsId;
    const ms = filteredMilestones.find(m => m.id === msId);
    if (ms) {
      handleMoveStatus(ms, colId);
    }
    setActiveOverColumnId(null);
    setDraggedMsId(null);
  };

  return (
    <div className="space-y-6 select-none">
      
      {/* Toast Notification */}
      {toastMsg && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold shadow-md flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2">
          <Kanban className="w-5 h-5 text-indigo-600" />
          <div>
            <h2 className="text-lg font-bold text-slate-900">Agile Milestone Workflow Board</h2>
            <p className="text-xs text-slate-500 font-medium">
              💡 Drag & drop any milestone card into a column to change its status instantly!
            </p>
          </div>
        </div>
      </div>

      {/* Kanban Board Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto">
        {columns.map((col) => {
          const colMilestones = filteredMilestones.filter(m => m.status === col.id);
          const isOverThisCol = activeOverColumnId === col.id;

          return (
            <div
              key={col.id}
              onDragOver={(e) => handleDragOver(e, col.id)}
              onDragLeave={(e) => handleDragLeave(e, col.id)}
              onDrop={(e) => handleDrop(e, col.id)}
              className={`glass-panel p-3.5 rounded-xl border flex flex-col space-y-3 min-h-[520px] transition-all duration-200 ${
                isOverThisCol
                  ? 'bg-indigo-50/80 border-indigo-500 ring-2 ring-indigo-400 shadow-md scale-[1.01]'
                  : 'bg-white/80 border-slate-200'
              }`}
            >
              {/* Column Header */}
              <div className={`p-2.5 rounded-lg border font-extrabold text-xs flex items-center justify-between ${col.color}`}>
                <span>{col.label}</span>
                <span className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-[10px] font-mono shadow-2xs border border-slate-200 text-slate-800">
                  {colMilestones.length}
                </span>
              </div>

              {/* Cards Container */}
              <div className="space-y-3 flex-1 overflow-y-auto pr-0.5">
                {colMilestones.map((ms) => {
                  const isBeingDragged = draggedMsId === ms.id;

                  return (
                    <div
                      key={ms.id}
                      draggable="true"
                      onDragStart={(e) => handleDragStart(e, ms)}
                      onDragEnd={() => {
                        setDraggedMsId(null);
                        setActiveOverColumnId(null);
                      }}
                      onClick={() => setSelectedMilestoneId(ms.id)}
                      className={`p-3.5 rounded-xl bg-white border border-slate-200 hover:border-indigo-400 cursor-grab active:cursor-grabbing shadow-xs transition-all space-y-2.5 group relative ${
                        isBeingDragged ? 'opacity-40 ring-2 ring-indigo-400 scale-95' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-[10px] font-extrabold text-indigo-600 font-mono flex items-center gap-1">
                          <Move className="w-3 h-3 text-slate-400 opacity-60 group-hover:opacity-100" />
                          {ms.priority}
                        </span>
                        <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full ${
                          ms.health === 'On Track' ? 'badge-on-track' : ms.health === 'At Risk' ? 'badge-at-risk' : 'badge-off-track'
                        }`}>
                          {ms.health}
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug">
                        {ms.title}
                      </h4>

                      {/* Progress Bar */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] font-bold text-slate-500">
                          <span>Progress</span>
                          <span>{ms.progress}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-indigo-600 rounded-full"
                            style={{ width: `${ms.progress}%` }}
                          />
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-100 font-mono">
                        <span>Due: {formatPrettyDate(ms.dueDate)}</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openDeveloperProfile(ms.owner);
                          }}
                          className="font-sans font-bold text-indigo-700 hover:text-indigo-900 hover:underline cursor-pointer truncate max-w-[100px]"
                          title={`View ${ms.owner}'s Developer Profile`}
                        >
                          {ms.owner}
                        </button>
                      </div>

                      {/* Quick Move Status Controls */}
                      <div className="pt-2 flex items-center gap-1 border-t border-slate-100" onClick={(e) => e.stopPropagation()}>
                        <span className="text-[9px] text-slate-500 font-bold">Move:</span>
                        <select
                          value={ms.status}
                          onChange={(e) => handleMoveStatus(ms, e.target.value)}
                          className="w-full bg-slate-50 text-[10px] text-slate-700 border border-slate-200 rounded px-1 py-0.5 font-medium cursor-pointer"
                        >
                          {columns.map(c => (
                            <option key={c.id} value={c.id}>{c.label}</option>
                          ))}
                        </select>
                      </div>

                    </div>
                  );
                })}

                {colMilestones.length === 0 && (
                  <div className="p-8 text-center text-xs text-slate-400 italic font-medium border-2 border-dashed border-slate-200/80 rounded-xl my-2">
                    Drop milestone cards here
                  </div>
                )}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
