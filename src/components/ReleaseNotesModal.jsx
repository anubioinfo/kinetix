import React, { useState } from 'react';
import { useProject } from '../context/ProjectContext';
import { Globe, X, Sparkles, Copy, Check, Download, Layers, Tag, Rocket, Wrench, ShieldCheck, Lightbulb } from 'lucide-react';

export default function ReleaseNotesModal() {
  const {
    isChangelogModalOpen,
    closeChangelogModal,
    milestones,
    ideas,
    releases
  } = useProject();

  const [selectedVersion, setSelectedVersion] = useState('v1.1.0');
  const [copiedFormat, setCopiedFormat] = useState(null); // 'html' | 'md'

  if (!isChangelogModalOpen) return null;

  const completedMilestones = milestones.filter(m => m.status === 'Completed' || m.progress >= 50);
  const promotedIdeas = ideas.filter(i => i.status === 'Approved' || i.status === 'Promoted');

  // Categorized Items
  const newFeatures = completedMilestones.filter(m => m.priority === 'P0' || m.priority === 'P1');
  const performanceFixes = completedMilestones.filter(m => m.priority === 'P2' || m.priority === 'P3');
  const communityIdeas = promotedIdeas;

  const markdownChangelog = `# Product Release Notes & Changelog — ${selectedVersion}

**Release Date**: ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}  
**Build Status**: Production Verified  

---

## 🚀 New Features & Strategic Enhancements
${newFeatures.map(f => `- **${f.title}**: ${f.description || 'Major feature implementation.'} *(Owner: ${f.owner})*`).join('\n')}

---

## ⚡ Performance, Architecture & System Stability
${performanceFixes.map(p => `- **${p.title}**: ${p.description || 'System performance optimization.'}`).join('\n')}

---

## 💡 Community & Customer Requested Ideas
${communityIdeas.map(i => `- **${i.title}**: ${i.description || 'Feature request implemented.'} *(Upvotes: ${i.votes || 12})*`).join('\n')}
`;

  const htmlChangelog = `<div class="changelog-container">
  <h1>Release Notes ${selectedVersion}</h1>
  <p><strong>Release Date:</strong> ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
  
  <h2>🚀 New Features & Strategic Enhancements</h2>
  <ul>
    ${newFeatures.map(f => `<li><strong>${f.title}</strong>: ${f.description || 'Major feature implementation.'}</li>`).join('\n    ')}
  </ul>

  <h2>⚡ Performance & System Stability</h2>
  <ul>
    ${performanceFixes.map(p => `<li><strong>${p.title}</strong>: ${p.description || 'Performance optimization.'}</li>`).join('\n    ')}
  </ul>

  <h2>💡 Community Ideas Implemented</h2>
  <ul>
    ${communityIdeas.map(i => `<li><strong>${i.title}</strong>: ${i.description || 'Community request.'}</li>`).join('\n    ')}
  </ul>
</div>`;

  const handleCopy = (format, content) => {
    navigator.clipboard.writeText(content);
    setCopiedFormat(format);
    setTimeout(() => setCopiedFormat(null), 3000);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([markdownChangelog], { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    element.download = `kinetix_changelog_${selectedVersion}.md`;
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
            <div className="p-2 bg-emerald-500/20 rounded-xl text-emerald-300">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-tight">Public Product Changelog & Release Notes</h3>
              <p className="text-[11px] text-slate-400">Customer-facing release summaries & HTML/Markdown exporter</p>
            </div>
          </div>
          <button
            onClick={closeChangelogModal}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 text-xs">
          {/* Version Selector Bar */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="flex items-center space-x-2">
              <Tag className="w-4 h-4 text-indigo-600" />
              <span className="font-bold text-slate-800">Target Release Build:</span>
            </div>
            <div className="flex items-center space-x-1.5">
              {['v1.0.0', 'v1.1.0', 'v2.0.0'].map(v => (
                <button
                  key={v}
                  onClick={() => setSelectedVersion(v)}
                  className={`px-3 py-1 rounded-lg font-bold text-xs transition-colors ${
                    selectedVersion === v
                      ? 'bg-slate-900 text-white shadow-2xs'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          {/* Release Preview Stream */}
          <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
            {/* New Features */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2 font-bold text-indigo-900 border-b border-indigo-100 pb-1">
                <Rocket className="w-4 h-4 text-indigo-600" />
                <span>🚀 New Features & Strategic Enhancements ({newFeatures.length})</span>
              </div>
              <div className="space-y-2">
                {newFeatures.map(item => (
                  <div key={item.id} className="p-3 bg-white border border-slate-200 rounded-xl space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-900">{item.title}</h4>
                      <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-200 font-extrabold text-[10px] rounded-md">
                        {item.priority}
                      </span>
                    </div>
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      {item.description || 'Major production roadmap deliverable.'}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance Fixes */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2 font-bold text-emerald-900 border-b border-emerald-100 pb-1">
                <Wrench className="w-4 h-4 text-emerald-600" />
                <span>⚡ Performance & Architecture ({performanceFixes.length})</span>
              </div>
              <div className="space-y-2">
                {performanceFixes.map(item => (
                  <div key={item.id} className="p-3 bg-white border border-slate-200 rounded-xl space-y-1">
                    <h4 className="font-bold text-slate-900">{item.title}</h4>
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      {item.description || 'System stability & execution optimization.'}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Community Ideas */}
            {communityIdeas.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2 font-bold text-amber-900 border-b border-amber-100 pb-1">
                  <Lightbulb className="w-4 h-4 text-amber-600" />
                  <span>💡 Community Requested Ideas ({communityIdeas.length})</span>
                </div>
                <div className="space-y-2">
                  {communityIdeas.map(item => (
                    <div key={item.id} className="p-3 bg-white border border-slate-200 rounded-xl space-y-1">
                      <h4 className="font-bold text-slate-900">{item.title}</h4>
                      <p className="text-slate-600 text-[11px]">
                        {item.description || 'Idea voted by community and promoted to active delivery.'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={closeChangelogModal}
            className="px-3.5 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold text-xs rounded-lg shadow-2xs"
          >
            Close
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleCopy('html', htmlChangelog)}
              className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs rounded-lg flex items-center space-x-1.5 shadow-2xs transition-all"
            >
              {copiedFormat === 'html' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
              <span>{copiedFormat === 'html' ? 'Copied HTML!' : 'Copy HTML'}</span>
            </button>
            <button
              onClick={() => handleCopy('md', markdownChangelog)}
              className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs rounded-lg flex items-center space-x-1.5 shadow-2xs transition-all"
            >
              {copiedFormat === 'md' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
              <span>{copiedFormat === 'md' ? 'Copied MD!' : 'Copy Markdown'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg flex items-center space-x-1.5 shadow-xs transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download (.md)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
