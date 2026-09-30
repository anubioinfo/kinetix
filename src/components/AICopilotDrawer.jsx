import React, { useState, useRef, useEffect } from 'react';
import { useProject } from '../context/ProjectContext';
import { Sparkles, Bot, X, Send, Zap, AlertTriangle, User, Calendar, CheckCircle2, ArrowRight, Wand2, Layers, Cpu, ShieldCheck } from 'lucide-react';
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
    addNotification,
    setSelectedMilestoneId,
    openDeveloperProfile
  } = useProject();

  const [activeTab, setActiveTab] = useState('chat'); // 'chat' | 'generator'
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: "Hello! I am Kinetix IQ, your smart agile assistant. Ask me anything about your project roadmap, team capacity, milestones, or RICE scores!",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');

  // 3-Step Milestone Generator State
  const [promptIdea, setPromptIdea] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedBreakdown, setGeneratedBreakdown] = useState(null);
  const [phaseMode, setPhaseMode] = useState('auto'); // 'auto' | '3' | '5' | '6'

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
          `• You can ask me to check risks, evaluate team capacity, or generate 3-step milestone breakdowns automatically!`;
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

  // Generate End-to-End Phased Milestone Epic Execution Plan (3 to 6 Phases)
  const handleGenerate3StepBreakdown = (ideaText) => {
    const textToUse = ideaText || promptIdea;
    if (!textToUse.trim()) return;

    setIsGenerating(true);
    setPromptIdea(textToUse);

    setTimeout(() => {
      const p = textToUse.trim();
      const now = Date.now();

      // Determine phase count based on phaseMode or auto-complexity heuristic
      let count = 3;
      if (phaseMode === '3') count = 3;
      else if (phaseMode === '5') count = 5;
      else if (phaseMode === '6') count = 6;
      else {
        // Auto-detect based on text complexity keywords
        const len = p.length;
        if (p.toLowerCase().includes('enterprise') || p.toLowerCase().includes('security') || p.toLowerCase().includes('payment') || p.toLowerCase().includes('cloud') || len > 35) {
          count = 5;
        } else {
          count = 3;
        }
      }

      // Catalog of End-to-End Life Cycle Phases
      const phaseTemplates = [
        {
          title: `Phase 1: Architecture, Data Models & Specs`,
          description: `Technical design document, database schema definition, Redis cache setup, and threat modeling for ${p}.`,
          owner: 'Jitendra',
          priority: 'P0',
          impact: 9,
          effort: 4,
          features: [
            { id: `f-${now}-11`, title: `Technical design spec & DB schema migration for ${p}`, completed: false, points: 5 },
            { id: `f-${now}-12`, title: `API contract definition (OpenAPI / gRPC schema)`, completed: false, points: 3 },
            { id: `f-${now}-13`, title: `Threat modeling & data encryption protocol pass`, completed: false, points: 3 }
          ]
        },
        {
          title: `Phase 2: Core Microservices & Integration APIs`,
          description: `High-throughput REST/GraphQL endpoints, authentication middleware, background event brokers, and third-party integrations for ${p}.`,
          owner: 'Nitin',
          priority: 'P0',
          impact: 9,
          effort: 5,
          features: [
            { id: `f-${now}-21`, title: `Core REST/GraphQL API controllers & validation logic`, completed: false, points: 8 },
            { id: `f-${now}-22`, title: `RabbitMQ / Kafka event queue brokers`, completed: false, points: 5 },
            { id: `f-${now}-23`, title: `OAuth2 & RBAC permission checks`, completed: false, points: 5 }
          ]
        },
        {
          title: `Phase 3: Web & Mobile Client User Experience`,
          description: `Responsive Web Rich UI components, mobile touch gestures, offline IndexedDB sync, and accessibility support for ${p}.`,
          owner: 'Ram',
          priority: 'P1',
          impact: 8,
          effort: 5,
          features: [
            { id: `f-${now}-31`, title: `Web UI components, drawer modals & live state store`, completed: false, points: 8 },
            { id: `f-${now}-32`, title: `Mobile app screen layout & touch gestures`, completed: false, points: 5 },
            { id: `f-${now}-33`, title: `Offline queue fallback & IndexedDB cache`, completed: false, points: 5 }
          ]
        },
        {
          title: `Phase 4: DevOps, Infrastructure & CI/CD Pipeline`,
          description: `Kubernetes multi-region cluster deployment, automated Docker build pipelines, and cloud load balancing for ${p}.`,
          owner: 'Shyam',
          priority: 'P1',
          impact: 8,
          effort: 4,
          features: [
            { id: `f-${now}-41`, title: `Helm charts & K8s cluster manifest setup`, completed: false, points: 5 },
            { id: `f-${now}-42`, title: `Automated GitHub Actions CI/CD deployment pipeline`, completed: false, points: 5 },
            { id: `f-${now}-43`, title: `CDN edge routing & SSL TLS certificates`, completed: false, points: 3 }
          ]
        },
        {
          title: `Phase 5: Security Compliance, Pen Testing & QA Audit`,
          description: `SOC2 audit compliance, automated regression test suites, penetration vulnerability scans, and high-load performance testing for ${p}.`,
          owner: 'Dinesh',
          priority: 'P1',
          impact: 8,
          effort: 4,
          features: [
            { id: `f-${now}-51`, title: `Playwright E2E automated test suite (90%+ coverage)`, completed: false, points: 5 },
            { id: `f-${now}-52`, title: `Penetration security audit & OWASP vulnerability scan`, completed: false, points: 5 },
            { id: `f-${now}-53`, title: `Load testing under 10k concurrent virtual users`, completed: false, points: 5 }
          ]
        },
        {
          title: `Phase 6: Production Rollout, Telemetry & User Onboarding`,
          description: `Gradual Canary deployment, Datadog performance monitoring, user analytics tracking, and end-user documentation for ${p}.`,
          owner: 'Anurag',
          priority: 'P2',
          impact: 7,
          effort: 3,
          features: [
            { id: `f-${now}-61`, title: `Production Canary release flag rollout (10% -> 100%)`, completed: false, points: 3 },
            { id: `f-${now}-62`, title: `Datadog APM metrics & automated error alert triggers`, completed: false, points: 3 },
            { id: `f-${now}-63`, title: `End-user documentation & guided onboarding tour`, completed: false, points: 3 }
          ]
        }
      ];

      // Select template subset based on phase count
      let selectedPhases = [];
      if (count === 3) {
        selectedPhases = [phaseTemplates[0], phaseTemplates[2], phaseTemplates[4]];
      } else if (count === 4) {
        selectedPhases = [phaseTemplates[0], phaseTemplates[1], phaseTemplates[2], phaseTemplates[4]];
      } else if (count === 5) {
        selectedPhases = phaseTemplates.slice(0, 5);
      } else {
        selectedPhases = phaseTemplates;
      }

      // Build sequential milestones with dependency links
      const builtPhases = selectedPhases.map((tmpl, idx) => {
        const startDays = idx * 14;
        const dueDays = (idx + 1) * 14;
        const msId = `ms-ai-ep-${idx + 1}-${now}`;
        const prevMsId = idx > 0 ? `ms-ai-ep-${idx}-${now}` : null;

        return {
          id: msId,
          title: `${p}: ${tmpl.title}`,
          description: tmpl.description,
          goalId: goals[0]?.id || 'goal-1',
          startDate: new Date(now + startDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          dueDate: new Date(now + dueDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          status: idx === 0 ? 'In Progress' : 'Not Started',
          health: 'On Track',
          priority: tmpl.priority,
          impact: tmpl.impact,
          effort: tmpl.effort,
          owner: tmpl.owner,
          progress: idx === 0 ? 15 : 0,
          dependencies: prevMsId ? [prevMsId] : [],
          features: tmpl.features
        };
      });

      const totalPoints = builtPhases.flatMap(p => p.features).reduce((acc, f) => acc + f.points, 0);

      setGeneratedBreakdown({
        epicTitle: p,
        phaseCount: builtPhases.length,
        totalStoryPoints: totalPoints,
        estimatedDuration: `${builtPhases.length * 14} Days (${builtPhases.length} Sprints)`,
        phases: builtPhases
      });

      setIsGenerating(false);
    }, 700);
  };

  // Insert all generated milestones into the workspace roadmap
  const handleInsertAll3Milestones = () => {
    if (!generatedBreakdown || !generatedBreakdown.phases) return;

    generatedBreakdown.phases.forEach(ms => {
      addMilestone(ms);
    });

    if (addNotification) {
      addNotification(
        `E2E Phased Epic Created (${generatedBreakdown.phaseCount} Milestones)`,
        `Successfully created ${generatedBreakdown.phaseCount} sequential milestones (${generatedBreakdown.totalStoryPoints} story pts) covering full E2E delivery for "${generatedBreakdown.epicTitle}".`,
        'success',
        'gantt'
      );
    }

    setSelectedMilestoneId(generatedBreakdown.phases[0].id);
    setGeneratedBreakdown(null);
    setPromptIdea('');
    onClose();
  };

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs animate-fade-in"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg h-full bg-white border-l border-slate-200 shadow-2xl flex flex-col justify-between overflow-hidden animate-slide-left"
      >
        
        {/* Header Banner */}
        <div className="p-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold flex items-center gap-1.5">
                <span>Kinetix IQ</span>
                <span className="text-[9px] font-mono bg-indigo-500/30 text-indigo-300 px-1.5 py-0.5 rounded border border-indigo-400/30">v2.4 LLM</span>
              </h2>
              <p className="text-[11px] text-indigo-200 font-medium">Smart Assistant & E2E Phased Epic Generator</p>
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
            <Wand2 className="w-4 h-4 text-purple-600" />
            <span>E2E Phased Epic Generator</span>
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
                placeholder="Ask Kinetix IQ (e.g. 'Show Ram's tasks')..."
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
          /* E2E Phased Generator Tab */
          <div className="flex-1 p-5 overflow-y-auto space-y-5 text-xs bg-slate-50/50">
            
            {/* Input Box & Template Pills */}
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-3">
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                  <Wand2 className="w-4 h-4 text-purple-600" />
                  <span>Auto-Generate Full E2E Execution Plan</span>
                </h3>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  Generate complete end-to-end phased milestones covering technical specs, APIs, UI/UX, DevOps CI/CD pipelines, security audits, and telemetry rollout.
                </p>
              </div>

              {/* Execution Phase Depth Mode Selector */}
              <div className="flex items-center justify-between bg-slate-50 p-2 rounded-xl border border-slate-200">
                <span className="text-[11px] font-extrabold text-slate-700">Lifecycle Depth:</span>
                <select
                  value={phaseMode}
                  onChange={(e) => setPhaseMode(e.target.value)}
                  className="py-1 px-2.5 rounded-lg bg-white border border-slate-300 text-xs font-bold text-indigo-700 focus:outline-none"
                >
                  <option value="auto">⚡ Auto-Detect Scope (3-6 Phases)</option>
                  <option value="3">🚀 Fast-Track (3 Phases)</option>
                  <option value="5">🏢 Standard Enterprise (5 Phases)</option>
                  <option value="6">🌐 Full E2E Lifecycle (6 Phases)</option>
                </select>
              </div>

              {/* Template Idea Pills */}
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Popular Enterprise Feature Templates:</span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    "Private Vault Notes Encryption",
                    "AI Voice Transcribe & Search",
                    "PCI-DSS Payment Gateway Engine",
                    "Geo-Fenced Push Alerts"
                  ].map(tmpl => (
                    <button
                      key={tmpl}
                      type="button"
                      onClick={() => handleGenerate3StepBreakdown(tmpl)}
                      className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-bold text-[11px] transition-colors"
                    >
                      + {tmpl}
                    </button>
                  ))}
                </div>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); handleGenerate3StepBreakdown(); }} className="space-y-3 pt-1">
                <input
                  type="text"
                  value={promptIdea}
                  onChange={(e) => setPromptIdea(e.target.value)}
                  placeholder="e.g. Build Real-Time Collaborative Canvas Notes..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 font-medium"
                />

                <button
                  type="submit"
                  disabled={isGenerating || !promptIdea.trim()}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-slate-900 hover:from-purple-700 hover:to-slate-950 text-white font-extrabold transition-all shadow-md flex items-center justify-center gap-2"
                >
                  {isGenerating ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-spin text-purple-200" />
                      <span>Synthesizing Full E2E Execution Plan...</span>
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4 text-purple-300" />
                      <span>Generate Full End-to-End Phased Plan</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Generated E2E Phased Execution Plan Preview */}
            {generatedBreakdown && (
              <div className="p-4 bg-white rounded-xl border-2 border-purple-300 shadow-lg space-y-4 animate-scale-up">
                
                {/* Header Summary */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-[10px] font-mono font-extrabold uppercase text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                      ✨ Full E2E Execution Plan ({generatedBreakdown.phaseCount} Sequential Phases)
                    </span>
                    <h4 className="font-extrabold text-slate-900 text-sm mt-1">{generatedBreakdown.epicTitle}</h4>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono font-extrabold text-indigo-600 block">{generatedBreakdown.totalStoryPoints} Total Story Pts</span>
                    <span className="text-[10px] text-slate-400 font-medium">{generatedBreakdown.estimatedDuration}</span>
                  </div>
                </div>

                {/* E2E Phased Stack */}
                <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                  {generatedBreakdown.phases.map((phase, idx) => {
                    const icons = [
                      <Cpu key="1" className="w-4 h-4 text-indigo-600" />,
                      <Zap key="2" className="w-4 h-4 text-cyan-600" />,
                      <Layers key="3" className="w-4 h-4 text-purple-600" />,
                      <Cpu key="4" className="w-4 h-4 text-amber-600" />,
                      <ShieldCheck key="5" className="w-4 h-4 text-emerald-600" />,
                      <Sparkles key="6" className="w-4 h-4 text-indigo-600" />
                    ];

                    return (
                      <div key={phase.id} className="p-3 rounded-xl border bg-slate-50/70 border-slate-200 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {icons[idx % icons.length]}
                            <span className="font-extrabold text-slate-900 text-xs">
                              {phase.title}
                            </span>
                          </div>
                          <span className="text-[10px] font-mono font-bold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                            {phase.owner} • {phase.effort} pts
                          </span>
                        </div>

                        <p className="text-[11px] text-slate-600 leading-snug">{phase.description}</p>

                        <div className="space-y-1 pt-1">
                          <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Sub-Tasks ({phase.features.length}):</span>
                          <div className="space-y-1">
                            {phase.features.map(f => (
                              <div key={f.id} className="p-1.5 rounded bg-white border border-slate-200 flex items-center justify-between text-[10px]">
                                <span className="font-medium text-slate-800 truncate pr-2">• {f.title}</span>
                                <span className="font-mono text-purple-600 font-bold shrink-0">{f.points} pts</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Insertion Action Button */}
                <button
                  onClick={handleInsertAll3Milestones}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-extrabold transition-all shadow-md flex items-center justify-center gap-2 text-xs"
                >
                  <CheckCircle2 className="w-4.5 h-4.5 text-emerald-200" />
                  <span>Insert All {generatedBreakdown.phaseCount} Milestones into Kinetix Roadmap</span>
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}


