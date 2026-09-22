import React, { useState, useRef, useEffect } from 'react';
import { useProject } from '../context/ProjectContext';
import { Sparkles, Bot, X, Send, Zap, AlertTriangle, User, Calendar, CheckCircle2, ArrowRight, Wand2 } from 'lucide-react';
import { formatPrettyDate } from '../utils/dateUtils';

// Helper to render markdown-style bold (**text**) and bullet lists nicely formatted
function renderFormattedText(text) {
  if (!text) return null;
  const lines = text.split('\n');

  return (
    <div className="space-y-1.5">
      {lines.map((line, lIdx) => {
        if (!line.trim()) return <div key={lIdx} className="h-1" />;

        const isBullet = line.trim().startsWith('•') || line.trim().startsWith('-');
        const rawContent = isBullet ? line.trim().slice(1).trim() : line;

        // Parse **bold** markers inside content
        const parts = rawContent.split(/(\*\*.*?\*\*)/g);
        const renderedContent = parts.map((part, pIdx) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return (
              <strong key={pIdx} className="font-extrabold text-indigo-950 font-semibold">
                {part.slice(2, -2)}
              </strong>
            );
          }
          return part;
        });

        if (isBullet) {
          return (
            <div key={lIdx} className="flex items-start gap-2 pl-1 my-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0 mt-1.5" />
              <div className="flex-1 leading-relaxed text-slate-800">{renderedContent}</div>
            </div>
          );
        }

        return (
          <div key={lIdx} className="leading-relaxed text-slate-800">
            {renderedContent}
          </div>
        );
      })}
    </div>
  );
}

export default function AICopilotDrawer({ isOpen, onClose }) {
  const {
    milestones,
    goals,
    team,
    ideas,
    addMilestone,
    setSelectedMilestoneId,
    openDeveloperProfile
  } = useProject();

  const [activeTab, setActiveTab] = useState('chat'); // 'chat' | 'generator'
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: "Hello! I am your Kinetix AI Copilot. Ask me anything about your project roadmap, team capacity, milestones, or RICE scores!",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');

  // Generator State
  const [promptIdea, setPromptIdea] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedMilestone, setGeneratedMilestone] = useState(null);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  // Process Natural Language Queries against live Project State
  const processQuery = (queryText) => {
    const q = queryText.toLowerCase();

    // Add user message
    const userMsg = {
      sender: 'user',
      text: queryText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');

    // Simulate AI synthesis based on live project state
    setTimeout(() => {
      let aiResponse = '';
      let actionLinks = [];

      if (q.includes('risk') || q.includes('delayed') || q.includes('behind')) {
        const atRisk = milestones.filter(m => m.health === 'At Risk' || m.health === 'Delayed' || m.status === 'In Progress');
        if (atRisk.length > 0) {
          aiResponse = `I analyzed your live roadmap: You have **${atRisk.length} milestone(s)** active or requiring monitoring:\n\n` +
            atRisk.map(m => `• **${m.title}** (Owner: **${m.owner}**, Status: **${m.status}**, Due: ${formatPrettyDate(m.dueDate)})`).join('\n');
          actionLinks = atRisk.map(m => ({ id: m.id, title: m.title }));
        } else {
          aiResponse = "Great news! All active milestones are currently marked as **On Track** with zero critical delays.";
        }
      } else if (q.includes('nitin') || q.includes('jitendra') || q.includes('anurag') || q.includes('ram') || q.includes('akshay') || q.includes('dinesh') || q.includes('shyam')) {
        const targetName = ['nitin', 'jitendra', 'anurag', 'ram', 'akshay', 'dinesh', 'shyam'].find(n => q.includes(n));
        const formattedName = targetName.charAt(0).toUpperCase() + targetName.slice(1);
        const member = team.find(t => t.name.toLowerCase() === targetName);
        const memberMilestones = milestones.filter(m => m.owner.toLowerCase() === targetName);

        if (member) {
          aiResponse = `**${member.name}** (${member.role}):\n` +
            `• Assigned Load: **${member.assignedHours} / ${member.capacityHours} hrs** (${Math.round((member.assignedHours/member.capacityHours)*100)}% capacity)\n` +
            `• Active Milestones (${memberMilestones.length}):\n` +
            memberMilestones.map(m => `• **${m.title}** (${m.status}, **${m.progress}%** completed)`).join('\n');
          actionLinks = memberMilestones.map(m => ({ id: m.id, title: m.title }));
        }
      } else if (q.includes('rice') || q.includes('highest') || q.includes('priority')) {
        const riceSorted = [...milestones].map(m => {
          const reach = m.riceReach || 5000;
          const impact = m.riceImpact || (m.impact / 3);
          const confidence = m.riceConfidence || 0.8;
          const effort = Math.max(1, m.riceEffort || (m.effort / 2));
          const score = Math.round((reach * impact * confidence) / effort);
          return { ...m, riceScore: score };
        }).sort((a, b) => b.riceScore - a.riceScore);

        const top3 = riceSorted.slice(0, 3);
        aiResponse = `Here are your **Top 3 Highest Impact RICE Scored Milestones**:\n\n` +
          top3.map((m, i) => `• #${i + 1} **${m.title}** — RICE Score: **${m.riceScore.toLocaleString()}** (Impact: **${m.impact}/10**, Owner: **${m.owner}**)`).join('\n');
        actionLinks = top3.map(m => ({ id: m.id, title: m.title }));
      } else if (q.includes('progress') || q.includes('overall') || q.includes('summary')) {
        const avgProgress = Math.round(milestones.reduce((acc, m) => acc + m.progress, 0) / (milestones.length || 1));
        const completedCount = milestones.filter(m => m.status === 'Completed').length;
        aiResponse = `**KeepNote Project Overview**:\n` +
          `• Overall Progress: **${avgProgress}%**\n` +
          `• Total Milestones: **${milestones.length}** (${completedCount} Completed, ${milestones.length - completedCount} Active)\n` +
          `• Strategic Goals: **${goals.length} active objectives**\n` +
          `• Team Allocation: **${team.length} engineers & product leads**`;
      } else {
        aiResponse = `Based on your live Kinetix roadmap:\n` +
          `• You have **${milestones.length} milestones** across **${goals.length} strategic goals**.\n` +
          `• Highest priority milestone is **${milestones[0]?.title || 'Cloud Data Sync'}**.\n` +
          `• You can ask me to check risks, evaluate team capacity, or generate new milestones automatically!`;
      }

      const aiMsg = {
        sender: 'ai',
        text: aiResponse,
        links: actionLinks,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
    }, 400);
  };

  // Generate Milestone from Prompt Idea
  const handleGenerateMilestone = (e) => {
    e.preventDefault();
    if (!promptIdea.trim()) return;

    setIsGenerating(true);

    setTimeout(() => {
      const p = promptIdea.toLowerCase();
      let selectedOwner = 'Jitendra';
      if (p.includes('mobile') || p.includes('ios') || p.includes('android') || p.includes('ui')) selectedOwner = 'Akshay';
      else if (p.includes('web') || p.includes('editor') || p.includes('frontend')) selectedOwner = 'Ram';
      else if (p.includes('alert') || p.includes('push') || p.includes('notification')) selectedOwner = 'Nitin';
      else if (p.includes('qa') || p.includes('test')) selectedOwner = 'Dinesh';
      else if (p.includes('devops') || p.includes('cloud') || p.includes('docker')) selectedOwner = 'Shyam';

      const mockAiGenerated = {
        id: 'ms-ai-' + Date.now(),
        title: promptIdea.length > 25 ? promptIdea.substring(0, 22) + '...' : promptIdea,
        description: `AI-generated feature milestone: ${promptIdea}. Includes automated integration pipelines, unit tests, and cross-platform compatibility.`,
        goalId: goals[0]?.id || 'goal-1',
        startDate: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'In Progress',
        health: 'On Track',
        priority: 'P1',
        impact: 8,
        effort: 4,
        riceReach: 15000,
        riceImpact: 2.5,
        riceConfidence: 0.85,
        riceEffort: 3,
        owner: selectedOwner,
        tags: ['AI-Generated', 'Feature'],
        progress: 20,
        dependencies: [],
        features: [
          { id: 'f-ai-1', title: `Core logic & API endpoints for ${promptIdea}`, completed: true, points: 5 },
          { id: 'f-ai-2', title: `UI components & user settings integration`, completed: false, points: 5 },
          { id: 'f-ai-3', title: `Automated unit tests & documentation`, completed: false, points: 3 }
        ]
      };

      setGeneratedMilestone(mockAiGenerated);
      setIsGenerating(false);
    }, 800);
  };

  const handleAddGeneratedToRoadmap = () => {
    if (!generatedMilestone) return;
    addMilestone(generatedMilestone);
    setSelectedMilestoneId(generatedMilestone.id);
    setGeneratedMilestone(null);
    setPromptIdea('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-lg h-full bg-white border-l border-slate-200 shadow-2xl flex flex-col justify-between overflow-hidden animate-slide-left">
        
        {/* Header Banner */}
        <div className="p-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold flex items-center gap-1.5">
                <span>Kinetix AI Copilot</span>
                <span className="text-[9px] font-mono bg-indigo-500/30 text-indigo-300 px-1.5 py-0.5 rounded border border-indigo-400/30">v2.4 LLM</span>
              </h2>
              <p className="text-[11px] text-indigo-200 font-medium">Smart Roadmap Assistant & Milestone Generator</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs">
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex-1 py-2.5 font-bold transition-colors flex items-center justify-center gap-1.5 border-b-2 ${
              activeTab === 'chat' ? 'border-indigo-600 text-indigo-700 bg-white' : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Bot className="w-4 h-4" />
            <span>AI Assistant</span>
          </button>
          <button
            onClick={() => setActiveTab('generator')}
            className={`flex-1 py-2.5 font-bold transition-colors flex items-center justify-center gap-1.5 border-b-2 ${
              activeTab === 'generator' ? 'border-indigo-600 text-indigo-700 bg-white' : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Wand2 className="w-4 h-4" />
            <span>AI Milestone Generator</span>
          </button>
        </div>

        {/* Content View */}
        {activeTab === 'chat' ? (
          <div className="flex-1 flex flex-col justify-between overflow-hidden bg-slate-50/50">
            
            {/* Quick Prompts */}
            <div className="p-3 bg-white border-b border-slate-200 space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Suggested Quick Queries</span>
              <div className="flex flex-wrap gap-1.5 text-[11px]">
                <button
                  onClick={() => processQuery("Which milestones are At Risk?")}
                  className="px-2.5 py-1 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-medium transition-colors flex items-center gap-1"
                >
                  <AlertTriangle className="w-3 h-3 text-amber-600" />
                  <span>At Risk Milestones?</span>
                </button>
                <button
                  onClick={() => processQuery("Summarize Nitin's workload")}
                  className="px-2.5 py-1 rounded-full bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 font-medium transition-colors flex items-center gap-1"
                >
                  <User className="w-3 h-3 text-indigo-600" />
                  <span>Nitin's Workload</span>
                </button>
                <button
                  onClick={() => processQuery("Highest RICE scored features")}
                  className="px-2.5 py-1 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-medium transition-colors flex items-center gap-1"
                >
                  <Zap className="w-3 h-3 text-emerald-600" />
                  <span>Top RICE Scores</span>
                </button>
              </div>
            </div>

            {/* Chat History */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.sender === 'ai' && (
                    <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-2xs">
                      <Sparkles className="w-4 h-4" />
                    </div>
                  )}

                  <div className={`max-w-[88%] rounded-2xl p-3.5 space-y-2.5 shadow-2xs ${
                    msg.sender === 'user' 
                      ? 'bg-indigo-600 text-white rounded-br-none font-medium' 
                      : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
                  }`}>
                    {msg.sender === 'user' ? (
                      <div className="font-semibold leading-relaxed">{msg.text}</div>
                    ) : (
                      renderFormattedText(msg.text)
                    )}
                    
                    {msg.links && msg.links.length > 0 && (
                      <div className="pt-2 border-t border-slate-100 space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 block">Click to View Milestone:</span>
                        {msg.links.map(link => (
                          <button
                            key={link.id}
                            onClick={() => {
                              setSelectedMilestoneId(link.id);
                              onClose();
                            }}
                            className="block w-full text-left px-2.5 py-1.5 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-[11px] truncate transition-colors border border-indigo-100"
                          >
                            → {link.title}
                          </button>
                        ))}
                      </div>
                    )}

                    <span className={`block text-[9px] font-mono text-right ${msg.sender === 'user' ? 'text-indigo-200' : 'text-slate-400'}`}>
                      {msg.time}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Box */}
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                if (inputQuery.trim()) processQuery(inputQuery);
              }}
              className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
            >
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="Ask Kinetix AI (e.g. 'Show Ram's tasks')..."
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:border-indigo-600 font-medium"
              />
              <button
                type="submit"
                disabled={!inputQuery.trim()}
                className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-40 transition-colors shadow-2xs"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

          </div>
        ) : (
          /* Generator Tab */
          <div className="flex-1 p-5 overflow-y-auto space-y-5 text-xs bg-slate-50/50">
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-3">
              <div>
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <Wand2 className="w-4 h-4 text-indigo-600" />
                  <span>Generate Milestone from Feature Idea</span>
                </h3>
                <p className="text-slate-500 text-[11px]">Type a high-level feature idea and let AI calculate RICE scores, story points, and sub-tasks automatically.</p>
              </div>

              <form onSubmit={handleGenerateMilestone} className="space-y-3">
                <input
                  type="text"
                  value={promptIdea}
                  onChange={(e) => setPromptIdea(e.target.value)}
                  placeholder="e.g. Add End-to-End Encrypted Private Vault Notes..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-hidden focus:border-indigo-600 font-medium"
                />

                <button
                  type="submit"
                  disabled={isGenerating || !promptIdea.trim()}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold transition-all shadow-xs flex items-center justify-center gap-2"
                >
                  {isGenerating ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-spin" />
                      <span>Synthesizing AI Milestone...</span>
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4" />
                      <span>Auto-Generate Milestone</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Generated Milestone Card Preview */}
            {generatedMilestone && (
              <div className="p-4 bg-white rounded-xl border-2 border-indigo-200 shadow-md space-y-3 animate-scale-up">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-[10px] font-mono font-bold uppercase text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                    ✨ AI Preview
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-600">RICE Score: {generatedMilestone.riceReach}</span>
                </div>

                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm">{generatedMilestone.title}</h4>
                  <p className="text-slate-600 text-xs mt-1 leading-relaxed">{generatedMilestone.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <div>Owner: <strong className="text-slate-900">{generatedMilestone.owner}</strong></div>
                  <div>Impact: <strong className="text-indigo-600">{generatedMilestone.impact}/10</strong></div>
                  <div>Effort: <strong className="text-slate-900">{generatedMilestone.effort} pts</strong></div>
                  <div>Priority: <strong className="text-amber-600">{generatedMilestone.priority}</strong></div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">AI-Suggested Sub-Features:</span>
                  <div className="space-y-1">
                    {generatedMilestone.features.map(f => (
                      <div key={f.id} className="p-1.5 rounded bg-slate-50 border border-slate-200 flex items-center justify-between text-[11px]">
                        <span className="font-medium text-slate-800">{f.title}</span>
                        <span className="font-mono text-indigo-600 font-bold">{f.points} pts</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleAddGeneratedToRoadmap}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 text-xs"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Insert Milestone into Kinetix Roadmap</span>
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
