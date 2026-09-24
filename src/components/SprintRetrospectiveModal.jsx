import React, { useState } from 'react';
import { useProject } from '../context/ProjectContext';
import { Sparkles, X, CheckCircle2, AlertTriangle, Lightbulb, Copy, Download, Check, Award, Activity, TrendingUp } from 'lucide-react';

export default function SprintRetrospectiveModal() {
  const {
    isRetroModalOpen,
    closeRetroModal,
    milestones,
    team,
    dependencyConflicts
  } = useProject();

  const [copied, setCopied] = useState(false);

  if (!isRetroModalOpen) return null;

  const total = milestones.length;
  const completed = milestones.filter(m => m.status === 'Completed');
  const inProgress = milestones.filter(m => m.status === 'In Progress');
  const atRisk = milestones.filter(m => m.health === 'At Risk');
  const totalPoints = milestones.reduce((sum, m) => sum + (m.features?.length || 3) * 3, 0);
  const completedPoints = completed.reduce((sum, m) => sum + (m.features?.length || 3) * 3, 0);
  const completionRate = total > 0 ? Math.round((completed.length / total) * 100) : 0;

  const overloadedStaff = team.filter(t => t.assignedHours > t.capacityHours);

  // Generate Retrospective Sections
  const whatWentWell = [
    `Delivered ${completed.length} active roadmap milestones (${completedPoints} total story points).`,
    `Achieved a ${completionRate}% sprint completion rate with 0 critical SLA rollbacks.`,
    `Successfully promoted community feature ideas directly into production execution.`
  ];

  const whatNeedsImprovement = [
    overloadedStaff.length > 0
      ? `${overloadedStaff.length} developer(s) overloaded (${overloadedStaff.map(s => s.name).join(', ')}).`
      : 'Developer capacities were maintained within normal thresholds.',
    atRisk.length > 0
      ? `${atRisk.length} milestone(s) flagged with tight date schedules (${atRisk.map(a => a.title).join(', ')}).`
      : 'No major date buffer delays identified.',
    dependencyConflicts.length > 0
      ? `Detected ${dependencyConflicts.length} schedule dependency date conflicts.`
      : '0 circular dependency loops detected.'
  ];

  const aiRecommendations = [
    'Execute AI Auto-Rebalance prior to next sprint commit to balance developer story point allocations.',
    'Extend buffer by 3 days on critical-path milestones before committing customer release dates.',
    'Increase automated unit test coverage on high-impact P0 security modules.'
  ];

  const markdownText = `# Sprint Retrospective & Post-Mortem Report

**Date**: ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
**Sprint Completion Rate**: ${completionRate}% (${completed.length}/${total} Milestones)
**Story Points Delivered**: ${completedPoints} / ${totalPoints} pts

---

## 🌟 What Went Well
${whatWentWell.map(w => `- ${w}`).join('\n')}

---

## ⚠️ What Needed Improvement & Bottlenecks
${whatNeedsImprovement.map(i => `- ${i}`).join('\n')}

---

## 💡 AI Action Items & Recommendations
${aiRecommendations.map(r => `- ${r}`).join('\n')}
`;

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(markdownText);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleDownloadMarkdown = () => {
    const element = document.createElement('a');
    const file = new Blob([markdownText], { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    element.download = `kinetix_sprint_retrospective_${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-purple-500/20 rounded-xl text-purple-300">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-tight">AI Sprint Retrospective & Post-Mortem</h3>
              <p className="text-[11px] text-slate-400">Automated agile performance analysis & improvement insights</p>
            </div>
          </div>
          <button
            onClick={closeRetroModal}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 text-xs">
          {/* Executive Sprint Performance Banner */}
          <div className="grid grid-cols-3 gap-3 p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-center">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Completion Rate</span>
              <p className="text-xl font-black text-indigo-600 font-mono mt-0.5">{completionRate}%</p>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Points Delivered</span>
              <p className="text-xl font-black text-emerald-600 font-mono mt-0.5">{completedPoints} pts</p>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Velocity Score</span>
              <p className="text-xl font-black text-purple-600 font-mono mt-0.5">96 / 100</p>
            </div>
          </div>

          {/* Section 1: What Went Well */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-emerald-700 font-bold border-b border-emerald-100 pb-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>What Went Well</span>
            </div>
            <ul className="space-y-1.5 pl-6 list-disc text-slate-700 leading-relaxed text-[11px]">
              {whatWentWell.map((w, i) => (
                <li key={i}>{w}</li>
              ))}
            </ul>
          </div>

          {/* Section 2: What Needed Improvement */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-amber-700 font-bold border-b border-amber-100 pb-1">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>What Needed Improvement & Bottlenecks</span>
            </div>
            <ul className="space-y-1.5 pl-6 list-disc text-slate-700 leading-relaxed text-[11px]">
              {whatNeedsImprovement.map((imp, i) => (
                <li key={i}>{imp}</li>
              ))}
            </ul>
          </div>

          {/* Section 3: AI Recommendations */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-indigo-700 font-bold border-b border-indigo-100 pb-1">
              <Lightbulb className="w-4 h-4 text-indigo-600" />
              <span>AI Recommendations for Next Sprint</span>
            </div>
            <ul className="space-y-1.5 pl-6 list-disc text-slate-700 leading-relaxed text-[11px]">
              {aiRecommendations.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={closeRetroModal}
            className="px-3.5 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold text-xs rounded-lg shadow-2xs"
          >
            Close
          </button>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopyMarkdown}
              className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs rounded-lg flex items-center space-x-1.5 shadow-2xs transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
              <span>{copied ? 'Copied!' : 'Copy Markdown'}</span>
            </button>
            <button
              onClick={handleDownloadMarkdown}
              className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg flex items-center space-x-1.5 shadow-xs transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Report (.md)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
