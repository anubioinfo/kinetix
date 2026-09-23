import React, { useEffect, useState, useLayoutEffect } from 'react';
import { useProject } from '../context/ProjectContext';
import { Sparkles, ChevronLeft, X, ArrowUp } from 'lucide-react';

export const tourSteps = [
  {
    step: 1,
    view: 'gantt',
    targetId: 'nav-group-execution',
    tabLabel: 'Product Delivery (Roadmap & Gantt)',
    title: '1. Product Delivery & Interactive Roadmap',
    description: 'Reschedule dates by dragging milestone bars left or right. Link predecessors & dependencies with 1-click!',
    actionLabel: 'Next: RICE Priority Matrix →'
  },
  {
    step: 2,
    view: 'priority',
    targetId: 'nav-group-execution',
    tabLabel: 'RICE Priority Matrix',
    title: '2. Priority & Value Scorecard (2x2 & RICE)',
    description: 'Evaluate effort vs impact in 4 quadrants or rank features automatically using Reach × Impact × Confidence ÷ Effort.',
    actionLabel: 'Next: Dependency Network →'
  },
  {
    step: 3,
    view: 'dependencies',
    targetId: 'nav-group-execution',
    tabLabel: 'Dependency Network',
    title: '3. Dependency Network & Conflict Inspector',
    description: 'Map predecessors & successors. If dates overlap, click "Auto-Reschedule" to fix schedule conflicts instantly!',
    actionLabel: 'Next: Project Workspaces →'
  },
  {
    step: 4,
    view: 'projects',
    targetId: 'nav-group-portfolio',
    tabLabel: 'Project Workspaces',
    title: '4. Multi-Project Workspaces & Access Roles',
    description: 'Create brand new projects from scratch, switch active workspaces, and manage role-based user access permissions.',
    actionLabel: 'Next: Agile Release Trains →'
  },
  {
    step: 5,
    view: 'portfolio',
    targetId: 'nav-group-portfolio',
    tabLabel: 'Agile Release Trains',
    title: '5. Agile Release Trains (ART) & SAFe Tracks',
    description: 'Group milestones into Program Increments (PI), track release readiness %, and dispatch release trains with 1-click!',
    actionLabel: 'Next: Ideas Portal →'
  },
  {
    step: 6,
    view: 'ideas',
    targetId: 'nav-group-insights',
    tabLabel: 'Ideas Portal',
    title: '6. Stakeholder Ideas Portal & Upvoting',
    description: 'Gather feature suggestions, upvote popular ideas, and click "Promote to Milestone" to convert ideas into roadmap items.',
    actionLabel: 'Next: Team Capacity →'
  },
  {
    step: 7,
    view: 'resource',
    targetId: 'nav-group-insights',
    tabLabel: 'Team Capacity',
    title: '7. Team Workload & Capacity Planning',
    description: 'Monitor weekly assigned hours per engineer against capacity limits to ensure optimal workload distribution.',
    actionLabel: 'Next: Data Sync & Integrations →'
  },
  {
    step: 8,
    view: 'integrations',
    targetId: 'nav-integrations',
    tabLabel: 'Data Sync & Integrations',
    title: '8. Data Sync & Enterprise Integrations',
    description: 'Import & export project milestones with Excel, CSV, Jira Software Cloud, and Microsoft Project XML format!',
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
      const el = document.getElementById(currentStepData.targetId);
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
    const timer = setTimeout(updateRect, 120);
    window.addEventListener('resize', updateRect);
    window.addEventListener('scroll', updateRect);

    return () => {
      clearTimeout(timer);
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
          onClick={nextTourStep}
          title="Click to activate option and advance to next step!"
          style={{
            top: targetRect.top - 6 + 'px',
            left: targetRect.left - 6 + 'px',
            width: targetRect.width + 12 + 'px',
            height: targetRect.height + 12 + 'px',
            boxShadow: '0 0 0 9999px rgba(15, 23, 42, 0.45), 0 10px 25px -5px rgba(99, 102, 241, 0.5)'
          }}
          className="fixed z-50 rounded-xl border-2 border-indigo-500 bg-white/10 cursor-pointer transition-all duration-300 flex items-center justify-center px-3 shadow-2xl"
        >
          {/* Number Badge */}
          <div className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-indigo-600 text-white font-extrabold text-[11px] flex items-center justify-center shadow-lg border-2 border-white animate-pulse">
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

        {/* Navigation Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
          {/* Skip Button */}
          <button
            onClick={endTour}
            className="text-slate-500 hover:text-slate-800 font-bold hover:underline text-xs"
          >
            Skip Tour
          </button>

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
