import React, { useMemo, useRef, useState, useEffect } from 'react';
import { useProject } from '../context/ProjectContext';
import { parseDate, formatDateStr, formatPrettyDate, getDaysDifference, addDays } from '../utils/dateUtils';
import { hasCircularDependency } from '../utils/dependencyUtils';
import { Calendar, Move, Link as LinkIcon, CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';

export default function GanttView() {
  const {
    filteredMilestones,
    milestones,
    updateMilestone,
    ganttZoom,
    setGanttZoom,
    setSelectedMilestoneId,
    dependencyConflicts
  } = useProject();

  const containerRef = useRef(null);
  const gridRef = useRef(null);

  // Dragging milestone bar state
  const [dragBarState, setDragBarState] = useState(null); // { milestoneId, startMouseX, initialStartDate, initialDueDate, currentDaysShift }

  // Dragging dependency line state
  const [linkingState, setLinkingState] = useState(null); // { predId, startX, startY, currentX, currentY, hoverTargetId }

  const [toastMsg, setToastMsg] = useState(null);

  const showToast = (msg, isError = false) => {
    setToastMsg({ msg, isError });
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Compute min & max dates for timeline range
  const { minDate, totalDays, datesHeader } = useMemo(() => {
    if (filteredMilestones.length === 0) {
      const today = new Date();
      return {
        minDate: formatDateStr(addDays(formatDateStr(today), -7)),
        maxDate: formatDateStr(addDays(formatDateStr(today), 60)),
        totalDays: 67,
        datesHeader: []
      };
    }

    let min = parseDate(filteredMilestones[0].startDate);
    let max = parseDate(filteredMilestones[0].dueDate);

    filteredMilestones.forEach(m => {
      const s = parseDate(m.startDate);
      const d = parseDate(m.dueDate);
      if (s < min) min = s;
      if (d > max) max = d;
    });

    const minBuffer = addDays(formatDateStr(min), -5);
    const maxBuffer = addDays(formatDateStr(max), 15);
    const total = Math.max(30, getDaysDifference(minBuffer, maxBuffer));

    const headers = [];
    let current = parseDate(minBuffer);
    const step = ganttZoom === 'days' ? 1 : ganttZoom === 'weeks' ? 7 : 14;

    for (let i = 0; i < total; i += step) {
      const dStr = formatDateStr(current);
      headers.push({
        dateStr: dStr,
        label: current.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        isToday: formatDateStr(new Date()) === dStr
      });
      current = parseDate(addDays(dStr, step));
    }

    return {
      minDate: minBuffer,
      totalDays: total,
      datesHeader: headers
    };
  }, [filteredMilestones, ganttZoom]);

  const dayWidth = ganttZoom === 'days' ? 28 : ganttZoom === 'weeks' ? 18 : 10;

  const getBarPosition = (startDate, dueDate, daysShift = 0) => {
    const shiftedStart = daysShift ? addDays(startDate, daysShift) : startDate;
    const shiftedDue = daysShift ? addDays(dueDate, daysShift) : dueDate;
    const startOffset = Math.max(0, getDaysDifference(minDate, shiftedStart));
    const duration = Math.max(1, getDaysDifference(shiftedStart, shiftedDue));
    const left = startOffset * dayWidth;
    const width = duration * dayWidth;
    return { left, width, shiftedStart, shiftedDue };
  };

  const conflictMilestoneIds = new Set(dependencyConflicts.map(c => c.milestoneId));
  const rowHeight = 64;
  const headerHeight = 48;

  // Live Dependency Connection Lines (recalculated smoothly on drag)
  const dependencyLines = useMemo(() => {
    const lines = [];
    const milestoneIndexMap = new Map(filteredMilestones.map((m, idx) => [m.id, idx]));

    filteredMilestones.forEach((targetMs, targetIdx) => {
      if (!targetMs.dependencies || targetMs.dependencies.length === 0) return;

      targetMs.dependencies.forEach(predId => {
        const predIdx = milestoneIndexMap.get(predId);
        if (predIdx === undefined) return;

        const predMs = filteredMilestones[predIdx];
        const predShift = (dragBarState && dragBarState.milestoneId === predMs.id) ? dragBarState.currentDaysShift : 0;
        const targetShift = (dragBarState && dragBarState.milestoneId === targetMs.id) ? dragBarState.currentDaysShift : 0;

        const predPos = getBarPosition(predMs.startDate, predMs.dueDate, predShift);
        const targetPos = getBarPosition(targetMs.startDate, targetMs.dueDate, targetShift);

        const x1 = predPos.left + predPos.width;
        const y1 = headerHeight + predIdx * rowHeight + rowHeight / 2;

        const x2 = targetPos.left;
        const y2 = headerHeight + targetIdx * rowHeight + rowHeight / 2;

        const isConflict = parseDate(targetPos.shiftedStart) < parseDate(predPos.shiftedDue);

        lines.push({
          id: `${predId}->${targetMs.id}`,
          x1, y1, x2, y2,
          isConflict,
          predTitle: predMs.title,
          targetTitle: targetMs.title
        });
      });
    });

    return lines;
  }, [filteredMilestones, minDate, dayWidth, dragBarState]);

  // Global mousemove and mouseup listeners for smooth dragging across canvas
  useEffect(() => {
    const handleMouseMove = (e) => {
      // 1. Horizontal Milestone Bar Rescheduling Drag
      if (dragBarState) {
        const deltaX = e.clientX - dragBarState.startMouseX;
        const daysShift = Math.round(deltaX / dayWidth);
        if (daysShift !== dragBarState.currentDaysShift) {
          setDragBarState(prev => ({ ...prev, currentDaysShift: daysShift }));
        }
      }

      // 2. Drag Dependency Connector Line
      if (linkingState && gridRef.current) {
        const rect = gridRef.current.getBoundingClientRect();
        const currentX = e.clientX - rect.left;
        const currentY = e.clientY - rect.top;

        // Detect hover target milestone based on Y position
        const relativeY = currentY - headerHeight;
        const targetIndex = Math.floor(relativeY / rowHeight);
        let hoverTargetId = null;
        if (targetIndex >= 0 && targetIndex < filteredMilestones.length) {
          const candidate = filteredMilestones[targetIndex];
          if (candidate.id !== linkingState.predId) {
            hoverTargetId = candidate.id;
          }
        }

        setLinkingState(prev => ({ ...prev, currentX, currentY, hoverTargetId }));
      }
    };

    const handleMouseUp = () => {
      // Finish Bar Drag
      if (dragBarState) {
        const { milestoneId, initialStartDate, initialDueDate, currentDaysShift } = dragBarState;
        if (currentDaysShift !== 0) {
          const ms = milestones.find(m => m.id === milestoneId);
          if (ms) {
            const newStart = addDays(initialStartDate, currentDaysShift);
            const newDue = addDays(initialDueDate, currentDaysShift);
            updateMilestone({
              ...ms,
              startDate: newStart,
              dueDate: newDue
            });
            showToast(`Rescheduled "${ms.title}" to ${formatPrettyDate(newStart)} - ${formatPrettyDate(newDue)}`);
          }
        }
        setDragBarState(null);
      }

      // Finish Dependency Link Drag
      if (linkingState) {
        const { predId, hoverTargetId } = linkingState;
        if (hoverTargetId && hoverTargetId !== predId) {
          const targetMs = milestones.find(m => m.id === hoverTargetId);
          const predMs = milestones.find(m => m.id === predId);

          if (targetMs && predMs) {
            // Check for circular dependency
            if (hasCircularDependency(milestones, targetMs.id, predId)) {
              showToast(`Cannot link "${predMs.title}" → "${targetMs.title}": Creates a circular loop!`, true);
            } else if ((targetMs.dependencies || []).includes(predId)) {
              showToast(`Dependency "${predMs.title}" → "${targetMs.title}" already exists!`, true);
            } else {
              // Add dependency
              const updatedDeps = [...(targetMs.dependencies || []), predId];
              updateMilestone({
                ...targetMs,
                dependencies: updatedDeps
              });
              showToast(`Attached dependency: "${predMs.title}" is now predecessor to "${targetMs.title}"!`);
            }
          }
        }
        setLinkingState(null);
      }
    };

    if (dragBarState || linkingState) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragBarState, linkingState, dayWidth, milestones, filteredMilestones]);

  // Start dragging a milestone bar
  const handleBarMouseDown = (e, ms) => {
    // Only left click
    if (e.button !== 0) return;
    e.stopPropagation();
    setDragBarState({
      milestoneId: ms.id,
      startMouseX: e.clientX,
      initialStartDate: ms.startDate,
      initialDueDate: ms.dueDate,
      currentDaysShift: 0
    });
  };

  // Start dragging dependency handle connector dot
  const handleConnectorMouseDown = (e, ms, msIdx) => {
    e.stopPropagation();
    if (!gridRef.current) return;

    const pos = getBarPosition(ms.startDate, ms.dueDate);
    const startX = pos.left + pos.width;
    const startY = headerHeight + msIdx * rowHeight + rowHeight / 2;

    setLinkingState({
      predId: ms.id,
      startX,
      startY,
      currentX: startX,
      currentY: startY,
      hoverTargetId: null
    });
  };

  return (
    <div className="space-y-4 select-none">
      
      {/* Toast Notification Banner */}
      {toastMsg && (
        <div className={`p-3.5 rounded-xl border text-xs font-bold shadow-lg flex items-center gap-2 animate-bounce ${
          toastMsg.isError ? 'bg-rose-50 border-rose-300 text-rose-900' : 'bg-emerald-50 border-emerald-300 text-emerald-900'
        }`}>
          {toastMsg.isError ? <AlertTriangle className="w-4 h-4 text-rose-600" /> : <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
          <span>{toastMsg.msg}</span>
        </div>
      )}

      {/* Zoom Controls & Help Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-indigo-600" />
          <div>
            <h2 className="text-base font-bold text-slate-900">Interactive Milestone Roadmap</h2>
            <p className="text-xs text-slate-500 font-medium">
              💡 Drag bars horizontally to reschedule • Drag connector dots (<span className="text-indigo-600 font-bold">🔵</span>) to link dependencies!
            </p>
          </div>
        </div>

        {/* Zoom Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-bold">Timeline Zoom:</span>
          <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-semibold">
            {['days', 'weeks', 'months', 'quarters'].map((z) => (
              <button
                key={z}
                onClick={() => setGanttZoom(z)}
                className={`px-3 py-1 rounded-md capitalize transition-all ${
                  ganttZoom === z ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {z}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Gantt Canvas Container */}
      <div className="glass-panel rounded-xl overflow-hidden border border-slate-200 shadow-md relative">
        <div className="flex overflow-x-auto relative" ref={containerRef}>
          
          {/* Left Sidebar: Milestone List */}
          <div className="w-80 sm:w-96 flex-shrink-0 bg-white border-r border-slate-200 z-20 sticky left-0 shadow-xs">
            
            <div className="h-12 px-4 flex items-center justify-between border-b border-slate-200 bg-slate-50 font-bold text-xs text-slate-600 uppercase tracking-wider">
              <span>Milestone Name</span>
              <span>Health State</span>
            </div>

            <div className="divide-y divide-slate-100">
              {filteredMilestones.map((ms) => {
                const isConflict = conflictMilestoneIds.has(ms.id);
                const isTargetHovered = linkingState && linkingState.hoverTargetId === ms.id;

                return (
                  <div
                    key={ms.id}
                    onClick={() => setSelectedMilestoneId(ms.id)}
                    className={`h-[64px] px-4 flex items-center justify-between cursor-pointer transition-colors group ${
                      isTargetHovered
                        ? 'bg-indigo-100 border-l-4 border-indigo-600 font-bold'
                        : isConflict
                        ? 'bg-amber-50/80 border-l-4 border-amber-500'
                        : 'hover:bg-indigo-50/40'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 pr-2">
                      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{
                        backgroundColor: ms.health === 'On Track' ? '#10b981' : ms.health === 'At Risk' ? '#f59e0b' : '#ef4444'
                      }} />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-extrabold text-slate-500 font-mono">{ms.priority}</span>
                          <h3 className="text-xs font-bold text-slate-800 truncate group-hover:text-indigo-600 transition-colors">
                            {ms.title}
                          </h3>
                        </div>
                        <p className="text-[11px] text-slate-500 truncate font-mono">
                          {formatPrettyDate(ms.startDate)} - {formatPrettyDate(ms.dueDate)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full ${
                        ms.health === 'On Track' ? 'badge-on-track' : ms.health === 'At Risk' ? 'badge-at-risk' : 'badge-off-track'
                      }`}>
                        {ms.health}
                      </span>
                    </div>
                  </div>
                );
              })}

              {filteredMilestones.length === 0 && (
                <div className="p-8 text-center text-slate-500 text-sm font-medium">
                  No milestones found matching criteria.
                </div>
              )}
            </div>
          </div>

          {/* Right Gantt Chart Timeline Grid */}
          <div className="relative min-w-max flex-1 bg-slate-50/60" ref={gridRef}>
            
            {/* Timeline Header Row */}
            <div className="h-12 border-b border-slate-200 flex items-center bg-slate-100/90 text-xs font-bold text-slate-600 relative">
              {datesHeader.map((d, i) => (
                <div
                  key={i}
                  style={{ width: (ganttZoom === 'days' ? 28 : ganttZoom === 'weeks' ? 18 * 7 : 10 * 14) + 'px' }}
                  className={`border-r border-slate-200 h-full flex items-center px-2 flex-shrink-0 ${
                    d.isToday ? 'bg-indigo-100/80 font-extrabold text-indigo-700 border-indigo-300' : ''
                  }`}
                >
                  {d.label}
                </div>
              ))}
            </div>

            {/* SVG Layer for Dependency Connectors */}
            <svg
              className="absolute inset-0 pointer-events-none z-10"
              style={{ width: totalDays * dayWidth + 'px', height: (filteredMilestones.length * rowHeight + headerHeight) + 'px' }}
            >
              <defs>
                <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#4f46e5" />
                </marker>
                <marker id="arrow-conflict" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#dc2626" />
                </marker>
              </defs>

              {/* Render Existing Dependency Lines */}
              {dependencyLines.map((line) => {
                const dx = line.x2 - line.x1;
                const controlX1 = line.x1 + Math.max(30, dx / 2);
                const controlX2 = line.x2 - Math.max(30, dx / 2);
                const pathD = `M ${line.x1} ${line.y1} C ${controlX1} ${line.y1}, ${controlX2} ${line.y2}, ${line.x2} ${line.y2}`;

                return (
                  <g key={line.id}>
                    <path
                      d={pathD}
                      fill="none"
                      stroke={line.isConflict ? '#dc2626' : '#4f46e5'}
                      strokeWidth={line.isConflict ? 2.5 : 2}
                      strokeDasharray={line.isConflict ? '4 3' : 'none'}
                      markerEnd={line.isConflict ? 'url(#arrow-conflict)' : 'url(#arrow)'}
                      className="opacity-90 transition-all hover:opacity-100"
                    />
                  </g>
                );
              })}

              {/* Render Active Drag-to-Connect Temporary Line */}
              {linkingState && (
                <path
                  d={`M ${linkingState.startX} ${linkingState.startY} Q ${(linkingState.startX + linkingState.currentX) / 2} ${(linkingState.startY + linkingState.currentY) / 2}, ${linkingState.currentX} ${linkingState.currentY}`}
                  fill="none"
                  stroke="#6366f1"
                  strokeWidth="3"
                  strokeDasharray="6 4"
                  markerEnd="url(#arrow)"
                  className="animate-pulse"
                />
              )}
            </svg>

            {/* Timeline Rows with Horizontally Draggable Bars */}
            <div className="relative">
              {filteredMilestones.map((ms, msIdx) => {
                const daysShift = (dragBarState && dragBarState.milestoneId === ms.id) ? dragBarState.currentDaysShift : 0;
                const pos = getBarPosition(ms.startDate, ms.dueDate, daysShift);
                const isConflict = conflictMilestoneIds.has(ms.id);
                const isDraggingThis = dragBarState && dragBarState.milestoneId === ms.id;
                const isTargetHovered = linkingState && linkingState.hoverTargetId === ms.id;

                return (
                  <div
                    key={ms.id}
                    className={`h-[64px] border-b border-slate-200/60 relative flex items-center px-2 group ${
                      isTargetHovered ? 'bg-indigo-100/60' : ''
                    }`}
                    style={{ width: totalDays * dayWidth + 'px' }}
                  >
                    {/* Background Grid Lines */}
                    <div className="absolute inset-0 flex pointer-events-none">
                      {datesHeader.map((d, idx) => (
                        <div
                          key={idx}
                          style={{ width: (ganttZoom === 'days' ? 28 : ganttZoom === 'weeks' ? 18 * 7 : 10 * 14) + 'px' }}
                          className={`border-r border-slate-200/40 h-full flex-shrink-0 ${d.isToday ? 'bg-indigo-50/50' : ''}`}
                        />
                      ))}
                    </div>

                    {/* Milestone Timeline Bar */}
                    <div
                      onMouseDown={(e) => handleBarMouseDown(e, ms)}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedMilestoneId(ms.id);
                      }}
                      style={{
                        left: `${pos.left}px`,
                        width: `${Math.max(48, pos.width)}px`
                      }}
                      className={`absolute h-9 rounded-lg border flex items-center px-3 cursor-grab active:cursor-grabbing shadow-xs transition-shadow duration-150 z-10 group/bar ${
                        isDraggingThis
                          ? 'ring-4 ring-indigo-500/50 scale-105 z-30 shadow-lg'
                          : isConflict
                          ? 'bg-amber-100 border-amber-400 text-amber-950 conflict-pulse font-bold'
                          : ms.status === 'Completed'
                          ? 'bg-emerald-100 border-emerald-300 text-emerald-950 font-bold'
                          : ms.status === 'In Progress'
                          ? 'bg-indigo-100 border-indigo-300 text-indigo-950 font-bold'
                          : 'bg-slate-100 border-slate-300 text-slate-800 font-semibold'
                      }`}
                    >
                      {/* Progress Overlay Fill */}
                      <div
                        className="absolute inset-y-0 left-0 bg-indigo-500/15 rounded-l-lg pointer-events-none"
                        style={{ width: `${ms.progress}%` }}
                      />

                      {/* Bar Content */}
                      <div className="relative z-10 flex items-center justify-between w-full min-w-0 text-xs gap-2 pointer-events-none">
                        <span className="font-bold truncate text-[11px] flex items-center gap-1">
                          <Move className="w-3 h-3 text-slate-400 opacity-60 group-hover/bar:opacity-100" />
                          {ms.title}
                        </span>
                        <span className="font-extrabold text-[10px] bg-white/90 px-1.5 py-0.5 rounded shadow-2xs">
                          {ms.progress}%
                        </span>
                      </div>

                      {/* Right Dependency Connector Handle Dot (Drag to Link) */}
                      <div
                        onMouseDown={(e) => handleConnectorMouseDown(e, ms, msIdx)}
                        className="absolute -right-2.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center cursor-crosshair shadow-md border-2 border-white z-20 group-hover/bar:scale-110 transition-transform"
                        title="Drag this blue dot onto another milestone bar to link a dependency!"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
