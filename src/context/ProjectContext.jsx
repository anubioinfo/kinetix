import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialGoals, initialMilestones, initialIdeas, initialTeam, initialReleases, initialPortfolios, initialProjects } from '../data/mockData.js';
import { detectDependencyConflicts, autoRescheduleDependencies } from '../utils/dependencyUtils.js';

const ProjectContext = createContext();

const STORAGE_KEY = 'kinetix_note_app_v4';

export function ProjectProvider({ children }) {
  // Load initial state from LocalStorage if available
  const [goals, setGoals] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_goals');
    return saved ? JSON.parse(saved) : initialGoals;
  });

  const [milestones, setMilestones] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_milestones');
    return saved ? JSON.parse(saved) : initialMilestones;
  });

  const [ideas, setIdeas] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_ideas');
    return saved ? JSON.parse(saved) : initialIdeas;
  });

  const [team, setTeam] = useState(initialTeam);
  const [portfolios, setPortfolios] = useState(initialPortfolios);
  const [releases, setReleases] = useState(initialReleases);

  // Multi-Project & User Access Control State
  const [projects, setProjects] = useState(initialProjects);
  const [currentProjectId, setCurrentProjectId] = useState('proj-1');

  // UI State
  const [activeView, setActiveView] = useState('gantt'); // 'gantt' | 'priority' | 'dependencies' | 'strategy' | 'kanban' | 'ideas' | 'resource' | 'analytics'
  const [searchQuery, setSearchQuery] = useState('');
  const [filterGoal, setFilterGoal] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterHealth, setFilterHealth] = useState('all');
  const [filterOwner, setFilterOwner] = useState('all');

  const [selectedMilestoneId, setSelectedMilestoneId] = useState(null);
  const [isMilestoneModalOpen, setIsMilestoneModalOpen] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState(null);

  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);

  const [isIdeaModalOpen, setIsIdeaModalOpen] = useState(false);

  // Developer / Resource Profile Modal State
  const [selectedDeveloperName, setSelectedDeveloperName] = useState(null);
  const [isDeveloperModalOpen, setIsDeveloperModalOpen] = useState(false);

  // Integration Hub Modal State
  const [isIntegrationModalOpen, setIsIntegrationModalOpen] = useState(false);
  const openIntegrationHub = () => setIsIntegrationModalOpen(true);
  const closeIntegrationHub = () => setIsIntegrationModalOpen(false);

  // Kinetix IQ Drawer State
  const [isAICopilotOpen, setIsAICopilotOpen] = useState(false);

  const openAICopilot = () => setIsAICopilotOpen(true);
  const closeAICopilot = () => setIsAICopilotOpen(false);

  const openDeveloperProfile = (name) => {
    if (!name) return;
    setSelectedDeveloperName(name);
    setIsDeveloperModalOpen(true);
  };

  const closeDeveloperProfile = () => {
    setIsDeveloperModalOpen(false);
    setSelectedDeveloperName(null);
  };

  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_theme');
    return saved ? JSON.parse(saved) : false;
  });

  // Zoom level for Gantt chart
  const [ganttZoom, setGanttZoom] = useState('weeks'); // 'days' | 'weeks' | 'months' | 'quarters'

  // Onboarding Guided Tour State
  const [isTourActive, setIsTourActive] = useState(false);
  const [currentTourStep, setCurrentTourStep] = useState(0);

  const startTour = () => {
    setIsTourActive(true);
    setCurrentTourStep(0);
  };

  const endTour = () => {
    setIsTourActive(false);
  };

  const nextTourStep = () => {
    if (currentTourStep < 7) {
      setCurrentTourStep(prev => prev + 1);
    } else {
      endTour();
    }
  };

  const prevTourStep = () => {
    if (currentTourStep > 0) {
      setCurrentTourStep(prev => prev - 1);
    }
  };

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + '_goals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + '_milestones', JSON.stringify(milestones));
  }, [milestones]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + '_ideas', JSON.stringify(ideas));
  }, [ideas]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + '_theme', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Dependency Conflicts
  const dependencyConflicts = detectDependencyConflicts(milestones);

  const autoFixDependencies = () => {
    const fixed = autoRescheduleDependencies(milestones);
    setMilestones(fixed);
  };

  // Demo Reset
  const resetDemoData = () => {
    setGoals(initialGoals);
    setMilestones(initialMilestones);
    setIdeas(initialIdeas);
    setTeam(initialTeam);
    setReleases(initialReleases);
    localStorage.removeItem(STORAGE_KEY + '_goals');
    localStorage.removeItem(STORAGE_KEY + '_milestones');
    localStorage.removeItem(STORAGE_KEY + '_ideas');
  };

  // Filtered Milestones
  const filteredMilestones = milestones.filter(m => {
    const matchesSearch = !searchQuery || 
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.description && m.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (m.tags && m.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));

    const matchesGoal = filterGoal === 'all' || m.goalId === filterGoal;
    const matchesPriority = filterPriority === 'all' || m.priority === filterPriority;
    const matchesHealth = filterHealth === 'all' || m.health === filterHealth;
    const matchesOwner = filterOwner === 'all' || m.owner === filterOwner;

    return matchesSearch && matchesGoal && matchesPriority && matchesHealth && matchesOwner;
  });

  // Real-Time Audit Log & Activity Ticker State
  const [activityLogs, setActivityLogs] = useState(() => [
    { id: 'log-1', timestamp: 'Just now', user: 'Anurag', action: 'Reclassified Milestone', type: 'matrix', details: 'Moved "CV Installation Monitoring" to Quick Wins (Impact: 8, Effort: 3)' },
    { id: 'log-2', timestamp: '4 mins ago', user: 'Nitin', action: 'Completed Sub-Task', type: 'task', details: 'Finished "FCM Push Payload Schema" (3 pts)' },
    { id: 'log-3', timestamp: '12 mins ago', user: 'Jitendra', action: 'Updated Milestone', type: 'milestone', details: 'Set "FastAPI Backend Architecture" status to Under Review' },
    { id: 'log-4', timestamp: '25 mins ago', user: 'Akshay', action: 'Created Idea', type: 'idea', details: 'Submitted "BLE Sensor Connection" in AI & Vision' },
    { id: 'log-5', timestamp: '1 hour ago', user: 'Sarah', action: 'Rescheduled Milestone', type: 'gantt', details: 'Shifted "SOC2 Audit Compliance" target due date by +7 days' }
  ]);

  const addActivityLog = (user, action, type, details) => {
    const newLog = {
      id: 'log-' + Date.now(),
      timestamp: 'Just now',
      user: user || 'Anurag',
      action,
      type,
      details
    };
    setActivityLogs(prev => [newLog, ...prev.slice(0, 49)]);
  };

  // AI-Powered Risk & Burnout Diagnostics Engine
  const aiRiskAlerts = React.useMemo(() => {
    const alerts = [];

    // 1. Developer Burnout Analysis
    const memberLoads = {};
    milestones.forEach(m => {
      const owner = m.owner || 'Unassigned';
      memberLoads[owner] = (memberLoads[owner] || 0) + (m.progress < 100 ? 1 : 0);
    });

    Object.entries(memberLoads).forEach(([name, count]) => {
      if (count >= 3) {
        alerts.push({
          id: `risk-burnout-${name}`,
          type: 'burnout',
          severity: 'high',
          targetName: name,
          title: `🔥 Developer Capacity Burnout: ${name}`,
          message: `${name} is currently assigned ${count} active milestones simultaneously (135% workload capacity).`,
          remediationText: `Reallocate 1 milestone from ${name} to Dinesh/Shyam`,
          fixAction: 'rebalance'
        });
      }
    });

    // 2. Schedule Dependency Conflict Analysis
    if (dependencyConflicts.length > 0) {
      alerts.push({
        id: 'risk-dep-bottleneck',
        type: 'dependency',
        severity: 'critical',
        targetName: 'Dependencies',
        title: `🚨 Schedule Dependency Loop Detected`,
        message: `${dependencyConflicts.length} milestone dependency timing conflicts threaten downstream sprint deliveries.`,
        remediationText: 'Auto-reschedule dependent milestones (+14 days buffer)',
        fixAction: 'autofix'
      });
    }

    // 3. At-Risk Health Milestone Analysis
    const atRiskMs = milestones.filter(m => m.health === 'At Risk' || m.health === 'Off Track');
    if (atRiskMs.length > 0) {
      alerts.push({
        id: 'risk-at-risk-milestones',
        type: 'health',
        severity: 'medium',
        targetName: atRiskMs[0].title,
        title: `⚠️ Milestone At-Risk: "${atRiskMs[0].title}"`,
        message: `Milestone has reached ${atRiskMs[0].progress}% completion but target due date is approaching.`,
        remediationText: 'Extend due date by +14 days & set health to On Track',
        fixAction: 'extendDate',
        targetId: atRiskMs[0].id
      });
    }

    return alerts;
  }, [milestones, dependencyConflicts]);

  const applyAIRiskFix = (alertId) => {
    const alert = aiRiskAlerts.find(a => a.id === alertId);
    if (!alert) return;

    if (alert.fixAction === 'rebalance') {
      // Find milestone owned by overloaded lead and reassign to Dinesh
      const overloadedMs = milestones.find(m => m.owner === alert.targetName && m.progress < 100);
      if (overloadedMs) {
        setMilestones(prev => prev.map(m => m.id === overloadedMs.id ? { ...m, owner: 'Dinesh' } : m));
        addActivityLog('Kinetix AI', 'AI Risk Remediation', 'risk', `Reassigned "${overloadedMs.title}" from ${alert.targetName} to Dinesh`);
      }
    } else if (alert.fixAction === 'autofix') {
      autoFixDependencies();
      addActivityLog('Kinetix AI', 'AI Risk Remediation', 'risk', 'Auto-adjusted milestone schedules to resolve circular dependency loop');
    } else if (alert.fixAction === 'extendDate' && alert.targetId) {
      setMilestones(prev => prev.map(m => {
        if (m.id === alert.targetId) {
          const currentDue = new Date(m.dueDate || Date.now());
          currentDue.setDate(currentDue.getDate() + 14);
          const newDueDate = currentDue.toISOString().split('T')[0];
          return { ...m, dueDate: newDueDate, health: 'On Track' };
        }
        return m;
      }));
      addActivityLog('Kinetix AI', 'AI Risk Remediation', 'risk', `Extended due date for "${alert.targetName}" by +14 days and reset health to On Track`);
    }
  };

  const addGoal = (newGoal) => {
    setGoals(prev => [...prev, newGoal]);
    addActivityLog('Anurag', 'Created Goal', 'goal', `Added strategic goal "${newGoal.title}"`);
  };

  const updateGoal = (updated) => {
    setGoals(prev => prev.map(g => g.id === updated.id ? updated : g));
    addActivityLog('Anurag', 'Updated Goal', 'goal', `Updated strategic goal "${updated.title}"`);
  };

  const deleteGoal = (goalId) => {
    setGoals(prev => prev.filter(g => g.id !== goalId));
    addActivityLog('Anurag', 'Deleted Goal', 'goal', `Removed strategic goal #${goalId}`);
  };

  const addMilestone = (newMs) => {
    const created = {
      ...newMs,
      id: 'ms-' + Date.now(),
      progress: newMs.progress || 0,
      features: newMs.features || []
    };
    setMilestones(prev => [...prev, created]);
    addActivityLog(created.owner || 'Anurag', 'Created Milestone', 'milestone', `Created milestone "${created.title}"`);
  };

  const updateMilestone = (updated) => {
    setMilestones(prev => prev.map(m => m.id === updated.id ? updated : m));
    addActivityLog(updated.owner || 'Anurag', 'Updated Milestone', 'milestone', `Updated milestone "${updated.title}"`);
  };

  const deleteMilestone = (msId) => {
    const target = milestones.find(m => m.id === msId);
    setMilestones(prev => prev.filter(m => m.id !== msId));
    if (target) {
      addActivityLog(target.owner || 'Anurag', 'Deleted Milestone', 'milestone', `Deleted milestone "${target.title}"`);
    }
  };

  const addIdea = (newIdea) => {
    setIdeas(prev => [...prev, newIdea]);
    addActivityLog(newIdea.author || 'Anurag', 'Submitted Idea', 'idea', `Submitted idea "${newIdea.title}" under ${newIdea.category}`);
  };

  const voteIdea = (ideaId) => {
    setIdeas(prev => prev.map(i => i.id === ideaId ? { ...i, votes: i.votes + 1 } : i));
    const target = ideas.find(i => i.id === ideaId);
    if (target) {
      addActivityLog('Anurag', 'Voted Idea', 'idea', `Upvoted idea "${target.title}" (${target.votes + 1} votes)`);
    }
  };

  const promoteIdeaToMilestone = (ideaId) => {
    const idea = ideas.find(i => i.id === ideaId);
    if (!idea) return;

    const newMs = {
      id: 'ms-' + Date.now(),
      title: idea.title,
      description: idea.description,
      goalId: goals[0]?.id || 'g-1',
      startDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'Not Started',
      health: 'On Track',
      priority: 'P1',
      impact: 7,
      effort: 4,
      owner: 'Anurag',
      progress: 0,
      dependencies: [],
      features: []
    };

    setMilestones(prev => [...prev, newMs]);
    setIdeas(prev => prev.map(i => i.id === ideaId ? { ...i, status: 'Approved' } : i));
    setSelectedMilestoneId(newMs.id);
    addActivityLog('Anurag', 'Promoted Idea', 'idea', `Promoted idea "${idea.title}" to active roadmap milestone`);
  };

  // --- 🔔 Notification Drawer & Webhook Simulator State ---
  const [notifications, setNotifications] = useState([
    { id: 'notif-1', title: 'Developer Capacity Alert', message: 'Akshay is over capacity at 110% load (44/40 hrs).', type: 'risk', timestamp: '10m ago', read: false, view: 'resource' },
    { id: 'notif-2', title: 'Milestone Risk Detected', message: 'Offline Storage Persistence has tight 2-day schedule buffer.', type: 'alert', timestamp: '1h ago', read: false, view: 'gantt' },
    { id: 'notif-3', title: 'Goal Progress Achieved', message: 'Core Architecture overhaul milestone linked to Q4 Target completed.', type: 'success', timestamp: '3h ago', read: true, view: 'strategy' }
  ]);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);
  const openNotificationDrawer = () => setIsNotificationDrawerOpen(true);
  const closeNotificationDrawer = () => setIsNotificationDrawerOpen(false);

  const addNotification = (title, message, type = 'info', view = null) => {
    const newNotif = {
      id: 'notif-' + Date.now(),
      title,
      message,
      type,
      timestamp: 'Just now',
      read: false,
      view
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markNotificationRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearNotifications = () => setNotifications([]);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Webhook Simulator State
  const [webhookConfig, setWebhookConfig] = useState({
    url: 'https://example.com/api/webhooks/slack-demo',
    channel: '#kinetix-alerts',
    enabled: true,
    events: ['milestone_complete', 'capacity_alert', 'risk_alert']
  });

  const [webhookLogs, setWebhookLogs] = useState([
    {
      id: 'wh-1',
      timestamp: new Date().toLocaleTimeString(),
      event: 'capacity_alert',
      status: 200,
      payload: {
        event: 'CAPACITY_BREACH_ALERT',
        developer: 'Akshay',
        loadPercentage: 110,
        assignedHours: 44,
        capacityHours: 40,
        timestamp: new Date().toISOString()
      }
    }
  ]);

  const triggerWebhook = (event = 'milestone_update', customPayload = null) => {
    const payload = customPayload || {
      event: event.toUpperCase(),
      workspace: currentProject?.name || 'KeepNote Ecosystem',
      triggeredBy: 'Anurag',
      timestamp: new Date().toISOString(),
      data: {
        milestonesActive: milestones.length,
        teamCapacityLoad: '88%'
      }
    };

    const newLog = {
      id: 'wh-' + Date.now(),
      timestamp: new Date().toLocaleTimeString(),
      event,
      status: 200,
      payload
    };

    setWebhookLogs(prev => [newLog, ...prev.slice(0, 19)]);
    addNotification('Webhook Dispatched', `Simulated JSON payload sent to ${webhookConfig.channel}`, 'success', 'integrations');
  };

  // --- 🕒 Time Travel & Historical Replay State ---
  const [timeTravelDate, setTimeTravelDate] = useState(null);

  // --- 🤖 AI Auto-Scheduler & Velocity Rebalancer ---
  const [isAutoSchedulerOpen, setIsAutoSchedulerOpen] = useState(false);
  const openAutoScheduler = () => setIsAutoSchedulerOpen(true);
  const closeAutoScheduler = () => setIsAutoSchedulerOpen(false);

  const autoScheduleAndRebalance = () => {
    // Rebalance algorithm: distribute milestones from overloaded developers to under-capacity members
    const updatedTeam = [...team];
    const updatedMilestones = milestones.map(m => {
      const ownerObj = updatedTeam.find(t => t.name === m.owner);
      if (!ownerObj || (ownerObj.assignedHours > ownerObj.capacityHours)) {
        // Find member with lowest load ratio
        const bestCandidate = [...updatedTeam].sort((a, b) => (a.assignedHours / a.capacityHours) - (b.assignedHours / b.capacityHours))[0];
        if (bestCandidate && bestCandidate.name !== m.owner) {
          bestCandidate.assignedHours += 10;
          if (ownerObj) ownerObj.assignedHours = Math.max(0, ownerObj.assignedHours - 10);
          return { ...m, owner: bestCandidate.name };
        }
      }
      return m;
    });

    setMilestones(updatedMilestones);
    setTeam(updatedTeam);
    addActivityLog('AI Copilot', 'AI Auto-Rebalance', 'risk', 'Automatically rebalanced developer workloads across active milestones');
    addNotification('AI Auto-Scheduler Applied', 'Rebalanced developer task allocations to optimize velocity and eliminate burnout.', 'success', 'resource');
  };

  const currentProject = projects.find(p => p.id === currentProjectId) || projects[0];

  const switchProject = (projId) => {
    setCurrentProjectId(projId);
    const targetProj = projects.find(p => p.id === projId);
    if (!targetProj) return;

    addActivityLog('Anurag', 'Switched Workspace', 'project', `Switched active workspace to "${targetProj.name}"`);

    if (projId === 'proj-1') {
      setGoals(initialGoals);
      setMilestones(initialMilestones);
      setIdeas(initialIdeas);
    } else if (projId === 'proj-2') {
      setGoals([
        { id: 'g-pay-1', title: 'PCI-DSS Payment Gateway Kernel', category: 'Backend Security', targetQuarter: 'Q4 2026', progress: 40, color: '#3b82f6', owner: 'Jitendra', description: 'Bank-grade credit card tokenizer & webhook dispatch engine.' }
      ]);
      setMilestones([
        { id: 'ms-pay-1', title: 'Payment Tokenizer API', description: 'PCI-DSS compliant credit card tokenization service.', goalId: 'g-pay-1', startDate: '2026-09-10', dueDate: '2026-10-15', status: 'In Progress', health: 'On Track', priority: 'P0', impact: 9, effort: 5, owner: 'Jitendra', progress: 45, dependencies: [], features: [{ id: 'f-pay-1', title: 'AES-256 Vault Encryption', completed: true, points: 5 }] }
      ]);
      setIdeas([]);
    } else if (projId === 'proj-3') {
      setGoals([
        { id: 'g-hlth-1', title: 'BLE Sensor & Clinical Transcribe', category: 'Mobile & IoT', targetQuarter: 'Q4 2026', progress: 20, color: '#8b5cf6', owner: 'Akshay', description: 'BLE heart rate monitoring & symptom logging.' }
      ]);
      setMilestones([
        { id: 'ms-hlth-1', title: 'BLE Sensor Connection', description: 'Bluetooth Low Energy pairing with medical pulse oximeters.', goalId: 'g-hlth-1', startDate: '2026-09-15', dueDate: '2026-10-30', status: 'In Progress', health: 'On Track', priority: 'P0', impact: 8, effort: 4, owner: 'Akshay', progress: 30, dependencies: [], features: [{ id: 'f-hlth-1', title: 'BLE Device Handshake API', completed: true, points: 3 }] }
      ]);
      setIdeas([]);
    }
  };

  const addProject = (newProj, isBlank = true) => {
    setProjects(prev => [...prev, newProj]);
    setCurrentProjectId(newProj.id);
    addActivityLog('Anurag', 'Created Project', 'project', `Created new workspace "${newProj.name}"`);

    if (isBlank) {
      setGoals([]);
      setMilestones([]);
      setIdeas([]);
    }
  };

  const updateProjectAccess = (projId, updatedMembers) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projId) {
        return { ...p, members: updatedMembers };
      }
      return p;
    }));
    addActivityLog('Anurag', 'Updated Access', 'project', `Updated team permissions for project #${projId}`);
  };

  const addTeamMember = (newMember) => {
    const colors = ['#6366f1', '#ec4899', '#8b5cf6', '#10b981', '#f59e0b', '#3b82f6', '#14b8a6'];
    const created = {
      id: 'usr-' + Date.now(),
      name: newMember.name,
      role: newMember.role || 'Software Engineer',
      capacityHours: Number(newMember.capacityHours) || 40,
      assignedHours: Number(newMember.assignedHours) || 0,
      avatar: (newMember.name || 'U').substring(0, 1).toUpperCase(),
      color: newMember.color || colors[Math.floor(Math.random() * colors.length)],
      techStack: Array.isArray(newMember.techStack) ? newMember.techStack : (newMember.techStack || 'React, Node.js').split(/[,;]/).map(s => s.trim()).filter(Boolean)
    };
    setTeam(prev => [...prev, created]);
    addActivityLog('Anurag', 'Added Team Member', 'team', `Added "${created.name}" (${created.role}) to team roster`);
  };

  const bulkImportTeamMembers = (membersArray) => {
    if (!Array.isArray(membersArray) || membersArray.length === 0) return;
    setTeam(prev => [...prev, ...membersArray]);
    addActivityLog('Anurag', 'CSV Team Import', 'team', `Imported ${membersArray.length} new team members via CSV`);
  };

  return (
    <ProjectContext.Provider value={{
      goals, setGoals, addGoal, updateGoal, deleteGoal,
      milestones, setMilestones, addMilestone, updateMilestone, deleteMilestone,
      filteredMilestones,
      ideas, setIdeas, addIdea, voteIdea, promoteIdeaToMilestone,
      team, setTeam, addTeamMember, bulkImportTeamMembers,
      portfolios, setPortfolios, releases, setReleases,
      projects, currentProjectId, currentProject, switchProject, addProject, updateProjectAccess,
      activeView, setActiveView,
      searchQuery, setSearchQuery,
      filterGoal, setFilterGoal,
      filterPriority, setFilterPriority,
      filterHealth, setFilterHealth,
      filterOwner, setFilterOwner,
      selectedMilestoneId, setSelectedMilestoneId,
      isMilestoneModalOpen, setIsMilestoneModalOpen,
      editingMilestone, setEditingMilestone,
      isGoalModalOpen, setIsGoalModalOpen,
      editingGoal, setEditingGoal,
      isIdeaModalOpen, setIsIdeaModalOpen,
      selectedDeveloperName, setSelectedDeveloperName,
      isDeveloperModalOpen, setIsDeveloperModalOpen,
      openDeveloperProfile, closeDeveloperProfile,
      isAICopilotOpen, setIsAICopilotOpen,
      openAICopilot, closeAICopilot,
      isIntegrationModalOpen, setIsIntegrationModalOpen,
      openIntegrationHub, closeIntegrationHub,
      darkMode, setDarkMode,
      ganttZoom, setGanttZoom,
      isTourActive, currentTourStep, startTour, endTour, nextTourStep, prevTourStep,
      dependencyConflicts,
      autoFixDependencies,
      resetDemoData,
      activityLogs, addActivityLog,
      aiRiskAlerts, applyAIRiskFix,
      // 🔔 Notifications & Webhooks
      notifications, isNotificationDrawerOpen, openNotificationDrawer, closeNotificationDrawer,
      addNotification, markNotificationRead, markAllNotificationsRead, clearNotifications, unreadCount,
      webhookConfig, setWebhookConfig, webhookLogs, triggerWebhook,
      // 🕒 Time Travel
      timeTravelDate, setTimeTravelDate,
      // 🤖 AI Auto-Scheduler
      isAutoSchedulerOpen, openAutoScheduler, closeAutoScheduler, autoScheduleAndRebalance
    }}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const context = useContext(ProjectContext);
  if (!context) throw new Error('useProject must be used within a ProjectProvider');
  return context;
}
