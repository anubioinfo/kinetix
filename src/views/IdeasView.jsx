import React from 'react';
import { useProject } from '../context/ProjectContext';
import { Lightbulb, ThumbsUp, Plus, Sparkles, CheckCircle2 } from 'lucide-react';

export default function IdeasView() {
  const { ideas, voteIdea, promoteIdeaToMilestone, setIsIdeaModalOpen } = useProject();

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-bold text-slate-900">Customer & Stakeholder Ideas Portal</h2>
          </div>
          <p className="text-xs text-slate-500 font-medium">Capture feature feedback, crowd-vote ideas, and convert them to roadmap milestones</p>
        </div>

        <button
          onClick={() => setIsIdeaModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg bg-amber-500 hover:bg-amber-400 text-white shadow-xs transition-all"
        >
          <Plus className="w-4 h-4" />
          Submit New Idea
        </button>
      </div>

      {/* Ideas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ideas.map((idea) => {
          const isPromoted = idea.status === 'Promoted';

          return (
            <div
              key={idea.id}
              className={`glass-panel p-5 rounded-xl border transition-all space-y-3 bg-white shadow-xs ${
                isPromoted ? 'border-emerald-300 bg-emerald-50/40' : 'border-slate-200 hover:border-indigo-300'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                      {idea.category || 'Feature'}
                    </span>
                    <span className={`px-2 py-0.5 text-[10px] font-extrabold rounded-full ${
                      isPromoted ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {idea.status}
                    </span>
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900">{idea.title}</h3>
                </div>

                {/* Vote Counter Button */}
                <button
                  onClick={() => voteIdea(idea.id)}
                  className="flex flex-col items-center justify-center w-12 h-12 rounded-xl bg-amber-50/80 hover:bg-amber-100 text-amber-800 border border-amber-200 transition-all group shadow-2xs"
                  title="Upvote idea"
                >
                  <ThumbsUp className="w-4 h-4 text-amber-600 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-extrabold font-mono mt-0.5">{idea.votes}</span>
                </button>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed font-medium">{idea.description}</p>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                <span className="text-slate-500 text-[11px] font-medium">Submitted by: <strong className="text-slate-800 font-bold">{idea.submittedBy}</strong></span>

                {/* Promote Button */}
                {!isPromoted ? (
                  <button
                    onClick={() => promoteIdeaToMilestone(idea)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-bold text-xs transition-all shadow-2xs"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    Promote to Milestone
                  </button>
                ) : (
                  <span className="flex items-center gap-1 text-emerald-700 font-extrabold text-xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Promoted to Roadmap
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
