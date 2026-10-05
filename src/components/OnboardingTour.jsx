import React, { useEffect, useState, useLayoutEffect } from 'react';
import { useProject } from '../context/ProjectContext';
import { Sparkles, ChevronLeft, X, ArrowUp } from 'lucide-react';

export const tourSteps = [
  {
    step: 1,
    view: 'projects',
    targetId: 'nav-projects',
    tabLabel: 'Workspace Directory',
    title: '1. Multi-Workspace Management & Access Roles',
    description: 'Create brand new workspaces from scratch, switch active workspaces, and manage role-based user access permissions.',
    actionLabel: 'Next: Ideas Portal →'
  },
  {
    step: 2,
    view: 'ideas',
    targetId: 'nav-ideas',
    tabLabel: 'Ideas Portal',
    title: '2. Stakeholder Ideas Portal & Upvoting',
    description: 'Gather feature suggestions, upvote popular ideas, and click "Promote to Milestone" to convert ideas into roadmap items before planning.',
    actionLabel: 'Next: Product Delivery & Roadmap →'
  },
  {
    step: 3,
    view: 'gantt',
    targetId: 'nav-gantt',
    tabLabel: 'Product Delivery (Roadmap & Gantt)',
    title: '3. Product Delivery & Interactive Roadmap',
    description: 'Reschedule dates by dragging milestone bars left or right. Link predecessors & dependencies with 1-click!',
    actionLabel: 'Next: RICE Priority Matrix →'
  },
  {
    step: 4,
    view: 'priority',
    targetId: 'nav-priority',
    tabLabel: 'RICE Priority Matrix',
    title: '4. Priority & Value Scorecard (2x2 & RICE)',
    description: 'Evaluate effort vs impact in 4 quadrants or rank features automatically using Reach × Impact × Confidence ÷ Effort.',
    actionLabel: 'Next: Dependency Network →'
  },
  {
    step: 5,
    view: 'dependencies',
    targetId: 'nav-dependencies',
    tabLabel: 'Dependency Network',
    title: '5. Dependency Network & Conflict Inspector',
    description: 'Map predecessors & successors. If dates overlap, click "Auto-Reschedule" to fix schedule conflicts instantly!',
    actionLabel: 'Next: Agile Release Trains →'
  },
  {
    step: 6,
    view: 'portfolio',
    targetId: 'nav-portfolio',
    tabLabel: 'Agile Release Trains',
    title: '6. Agile Release Trains (ART) & SAFe Tracks',
    description: 'Group milestones into Program Increments (PI), track release readiness %, and dispatch release trains with 1-click!',
    actionLabel: 'Next: Executive Analytics →'
  },
  {
    step: 7,
    view: 'analytics',
    targetId: 'nav-analytics',
    tabLabel: 'Executive Analytics',
    title: '7. Executive Analytics & EVM Velocity',
    description: 'Review Earned Value Management metrics, burndown charts, and completion velocity over time.',
    actionLabel: 'Next: Data Sync & Integrations →'
  },
  {
    step: 8,
    view: 'integrations',
    targetId: 'nav-integrations',
    tabLabel: 'Data Sync & Integrations',
    title: '8. Data Sync & Enterprise Integrations',
    description: 'Import & export workspace milestones with Excel, CSV, Jira Software Cloud, and Microsoft Project XML format!',
    actionLabel: 'Finish Walkthrough 🎉'
  }
];

export default function OnboardingTour() {
  const {
    isTourActive,
    currentTourStep,
    nextTourStep,
    prevTourStep,
    endTour,
    setActiveView
  } = useProject();

  const [targetRect, setTargetRect] = useState(null);
  const currentStepData = tourSteps[currentTourStep];

  // Auto-switch view when tour step changes
  useEffect(() => {
    if (isTourActive && currentStepData) {
      setActiveView(currentStepData.view);
    }
  }, [isTourActive, currentTourStep, currentStepData, setActiveView]);

  // Measure target DOM element coordinates dynamically
  useLayoutEffect(() => {
    if (!isTourActive || !currentStepData) return;

    const updateRect = () => {
      let el = document.getElementById(currentStepData.targetId);
      if (!el && ['integrations', 'dependencies', 'resource', 'strategy', 'whatif'].includes(currentStepData.view)) {
        el = document.getElementById('nav-more-views');
      }
      if (el) {
        const rect = el.getBoundingClientRect();
        setTargetRect({
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
          bottom: rect.bottom,
          right: rect.right
        });
      } else {
        setTargetRect(null);
      }
    };

    updateRect();
    const t1 = setTimeout(updateRect, 50);
    const t2 = setTimeout(updateRect, 200);
    window.addEventListener('resize', updateRect);
    window.addEventListener('scroll', updateRect);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener('resize', updateRect);
      window.removeEventListener('scroll', updateRect);
    };
  }, [isTourActive, currentTourStep, currentStepData]);

  // Keyboard navigation shortcuts
  useEffect(() => {
    if (!isTourActive) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        endTour();
      } else if (e.key === 'ArrowRight') {
        nextTourStep();
      } else if (e.key === 'ArrowLeft') {
        prevTourStep();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTourActive, nextTourStep, prevTourStep, endTour]);

  if (!isTourActive || !currentStepData) return null;

  // Calculate Popover Position anchored directly underneath the option button
  const popoverStyle = targetRect ? {
    top: Math.min(window.innerHeight - 260, Math.max(90, targetRect.bottom + 12)) + 'px',
    left: Math.min(window.innerWidth - 460, Math.max(16, targetRect.left - 10)) + 'px'
  } : {
    top: '110px',
    left: '50%',
    transform: 'translateX(-50%)'
  };

  return (
    <div className="fixed inset-0 z-50 pointer-events-auto select-none">
      
      {/* Spotlight Glowing Frame around the option button */}
      {targetRect && (
        <div
          onClick={() => {
            setActiveView(currentStepData.view);
            nextTourStep();
          }}
          title="Click to activate option and advance to next step!"
          style={{
            top: targetRect.top - 6 + 'px',
            left: targetRect.left - 6 + 'px',
            width: targetRect.width + 12 + 'px',
            height: targetRect.height + 12 + 'px',
            boxShadow: '0 0 0 9999px rgba(15, 23, 42, 0.45), 0 0 20px 4px rgba(99, 102, 241, 0.6)'
          }}
          className="fixed z-50 rounded-xl border-2 border-indigo-500 bg-indigo-500/10 cursor-pointer transition-all duration-300 flex items-center justify-center px-3 shadow-2xl animate-pulse"
        >
          {/* Number Badge */}
          <div className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-indigo-600 text-white font-extrabold text-[11px] flex items-center justify-center shadow-lg border-2 border-white">
            {currentTourStep + 1}
          </div>
        </div>
      )}

      {/* Anchored Popover Tooltip Card pointing to the Option Button */}
      <div
        style={popoverStyle}
        className="fixed z-50 w-full max-w-md rounded-2xl border-2 border-indigo-500 shadow-2xl p-5 bg-white space-y-3 animate-slide-up"
      >
        {/* Pointing Arrow Indicator */}
        {targetRect && (
          <div 
            className="absolute -top-3 text-indigo-600 drop-shadow-md"
            style={{ left: Math.min(300, Math.max(20, targetRect.width / 2)) + 'px' }}
          >
            <ArrowUp className="w-6 h-6 fill-indigo-600 text-indigo-600" />
          </div>
        )}

        {/* 8-Segment Step Progress Bar */}
        <div className="flex items-center gap-1.5 w-full pt-1">
          {tourSteps.map((s, idx) => (
            <div
              key={idx}
              className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                idx === currentTourStep
                  ? 'bg-indigo-600 shadow-xs'
                  : idx < currentTourStep
                  ? 'bg-indigo-300'
                  : 'bg-slate-200'
              }`}
            />
          ))}
        </div>

        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                Step {currentTourStep + 1} of {tourSteps.length}
              </span>
              <h3 className="text-sm font-extrabold text-slate-900 leading-snug">
                {currentStepData.title}
              </h3>
            </div>
          </div>

          <button
            onClick={endTour}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            title="Skip Walkthrough (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Description */}
        <p className="text-xs text-slate-700 leading-relaxed font-semibold">
          {currentStepData.description}
        </p>

        {/* Interactive Step Jump Dots */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-1">
            {tourSteps.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveView(tourSteps[idx].view)}
                title={`Jump to Step ${idx + 1}`}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  idx === currentTourStep
                    ? 'bg-indigo-600 ring-2 ring-indigo-400 scale-110'
                    : 'bg-slate-300 hover:bg-slate-400'
                }`}
              />
            ))}
          </div>

          {/* Previous & Next Buttons */}
          <div className="flex items-center gap-2">
            {currentTourStep > 0 && (
              <button
                onClick={prevTourStep}
                className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold transition-all text-xs flex items-center gap-1"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                Previous
              </button>
            )}

            <button
              onClick={nextTourStep}
              className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold transition-all shadow-md text-xs flex items-center gap-1"
            >
              <span>{currentStepData.actionLabel}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
