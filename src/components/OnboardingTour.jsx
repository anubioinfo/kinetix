import React, { useEffect, useState, useLayoutEffect } from 'react';
import { useProject } from '../context/ProjectContext';
import { Sparkles, ChevronLeft, X, ArrowUp } from 'lucide-react';

export const tourSteps = [
  {
    step: 1,
    view: 'gantt',
    targetId: 'nav-gantt',
    tabLabel: 'Roadmap & Gantt',
    title: '1. Roadmap & Interactive Gantt Timeline',
    description: 'Click here or drag milestone bars left/right to reschedule dates. Drag the blue connector dot (🔵) to link dependencies!',
    actionLabel: 'Next: Priority Matrix →'
  },
  {
    step: 2,
    view: 'priority',
    targetId: 'nav-priority',
    tabLabel: 'Priority Matrix',
    title: '2. Priority & Value Engine (2x2 & RICE)',
    description: 'Evaluate effort vs impact in 4 quadrants or switch to the Kinetix RICE Scorecard table to rank features automatically.',
    actionLabel: 'Next: Dependency Graph →'
  },
  {
    step: 3,
    view: 'dependencies',
    targetId: 'nav-dependencies',
    tabLabel: 'Dependency Graph',
    title: '3. Dependency Graph & Conflict Inspector',
    description: 'Map predecessors & successors. If dates overlap, click "Auto-Reschedule" to fix schedule conflicts in 1 click!',
    actionLabel: 'Next: Strategy Hub →'
  },
  {
    step: 4,
    view: 'strategy',
    targetId: 'nav-strategy',
    tabLabel: 'Strategy Hub',
    title: '4. Strategic Goals & Corporate Alignment',
    description: 'Align milestones to top-level company goals and monitor enterprise goal completion progress.',
    actionLabel: 'Next: Kanban Workflow →'
  },
  {
    step: 5,
    view: 'kanban',
    targetId: 'nav-kanban',
    tabLabel: 'Kanban Workflow',
    title: '5. Agile Kanban Workflow Board',
    description: 'Drag and drop any milestone card into a new column to change status! Dropping into Completed sets progress to 100%.',
    actionLabel: 'Next: Ideas Portal →'
  },
  {
    step: 6,
    view: 'ideas',
    targetId: 'nav-ideas',
    tabLabel: 'Ideas Portal',
    title: '6. Stakeholder Ideas Portal & Upvoting',
    description: 'Gather feature suggestions, upvote popular ideas, and click "Promote to Milestone" to convert ideas into roadmap items.',
    actionLabel: 'Next: Team Capacity →'
  },
  {
    step: 7,
    view: 'resource',
    targetId: 'nav-resource',
    tabLabel: 'Team Capacity',
    title: '7. Team Workload & Capacity Planning',
    description: 'Monitor weekly assigned hours per engineer against capacity limits. Over-capacity badges highlight workloads >40 hrs/week.',
    actionLabel: 'Next: Executive Analytics →'
  },
  {
    step: 8,
    view: 'analytics',
    targetId: 'nav-analytics',
    tabLabel: 'Executive Analytics',
    title: '8. Executive Analytics & Reports Exporter',
    description: 'Review overall completion rates, health metrics, and click "Export Full Executive Report" to download CSV data anytime.',
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
    const timer = setTimeout(updateRect, 100);
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

  // Calculate Popover Position anchored to the target element
  const popoverStyle = targetRect ? {
    top: Math.min(window.innerHeight - 280, Math.max(80, targetRect.bottom + 12)) + 'px',
    left: Math.min(window.innerWidth - 440, Math.max(16, targetRect.left)) + 'px'
  } : {
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)'
  };

  return (
    <div className="fixed inset-0 z-50 pointer-events-auto select-none">
      
      {/* Spotlight Box with CSS Box-Shadow Overlay (zero blur, 100% crisp visibility inside spotlight!) */}
      {targetRect && (
        <div
          onClick={nextTourStep}
          title="Click to activate option and advance to next step!"
          style={{
            top: targetRect.top - 6 + 'px',
            left: targetRect.left - 6 + 'px',
            width: targetRect.width + 12 + 'px',
            height: targetRect.height + 12 + 'px',
            boxShadow: '0 0 0 9999px rgba(15, 23, 42, 0.45), 0 10px 25px -5px rgba(99, 102, 241, 0.4)'
          }}
          className="fixed z-50 rounded-xl border-2 border-indigo-600 bg-white cursor-pointer transition-all duration-300 flex items-center justify-center px-3 text-indigo-700 font-extrabold text-xs shadow-2xl"
        >
          {/* Re-render high-contrast label inside spotlight box so option text is 100% readable! */}
          <div className="flex items-center gap-1.5 text-indigo-900 font-extrabold text-xs">
            <span>{currentStepData.tabLabel}</span>
          </div>

          {/* Number Badge */}
          <div className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-indigo-600 text-white font-extrabold text-[11px] flex items-center justify-center shadow-lg border-2 border-white">
            {currentTourStep + 1}
          </div>
        </div>
      )}

      {/* Anchored Popover Tooltip Card pointing to the Target Element */}
      <div
        style={popoverStyle}
        className="fixed z-50 w-full max-w-md rounded-2xl border-2 border-indigo-500 shadow-2xl p-5 bg-white space-y-3 animate-slide-up"
      >
        {/* Pointing Arrow Indicator */}
        {targetRect && (
          <div className="absolute -top-3 left-6 text-indigo-600 drop-shadow-md">
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
