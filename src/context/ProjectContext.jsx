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

  // CRUD Operations for Milestones
  const addMilestone = (newMs) => {
    const created = {
      ...newMs,
      id: 'ms-' + Date.now(),
      progress: newMs.progress || 0,
      dependencies: newMs.dependencies || [],
      features: newMs.features || [],
      impact: newMs.impact || 5,
      effort: newMs.effort || 5,
      riceReach: newMs.riceReach || 1000,
      riceImpact: newMs.riceImpact || 2,
      riceConfidence: newMs.riceConfidence || 0.8,
      riceEffort: newMs.riceEffort || 2,
    };
    setMilestones(prev => [created, ...prev]);
  };

  const updateMilestone = (updatedMs) => {
    setMilestones(prev => prev.map(m => m.id === updatedMs.id ? updatedMs : m));
  };

  const deleteMilestone = (id) => {
    setMilestones(prev => {
      // Remove milestone and clean dependencies from other milestones
      return prev
        .filter(m => m.id !== id)
        .map(m => ({
          ...m,
          dependencies: (m.dependencies || []).filter(depId => depId !== id)
        }));
    });
    if (selectedMilestoneId === id) setSelectedMilestoneId(null);
  };

  const autoFixDependencies = () => {
    const fixed = autoRescheduleDependencies(milestones);
    setMilestones(fixed);
  };

  // Strategic Goal CRUD
  const addGoal = (newGoal) => {
    const created = {
      ...newGoal,
      id: 'goal-' + Date.now(),
      progress: 0
    };
    setGoals(prev => [...prev, created]);
  };

  const updateGoal = (updatedGoal) => {
    setGoals(prev => prev.map(g => g.id === updatedGoal.id ? updatedGoal : g));
  };

  const deleteGoal = (id) => {
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  // Ideas CRUD & Promotion
  const addIdea = (newIdea) => {
    const created = {
      ...newIdea,
      id: 'idea-' + Date.now(),
      votes: 1,
      status: 'Under Review',
      createdAt: new Date().toISOString().split('T')[0]
    };
    setIdeas(prev => [created, ...prev]);
  };

  const voteIdea = (id) => {
    setIdeas(prev => prev.map(i => i.id === id ? { ...i, votes: i.votes + 1 } : i));
  };

  const promoteIdeaToMilestone = (idea) => {
    const newMs = {
      title: idea.title,
      description: idea.description,
      goalId: goals[0]?.id || 'goal-1',
      startDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'Not Started',
      health: 'On Track',
      priority: 'P1',
      impact: 8,
      effort: 5,
      owner: 'Sarah Jenkins',
      tags: ['Idea Promotion', idea.category || 'Feature'],
      progress: 0,
      dependencies: []
    };
    addMilestone(newMs);
    setIdeas(prev => prev.map(i => i.id === idea.id ? { ...i, status: 'Promoted' } : i));
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

  const currentProject = projects.find(p => p.id === currentProjectId) || projects[0];

  const switchProject = (projId) => {
    setCurrentProjectId(projId);
    const targetProj = projects.find(p => p.id === projId);
    if (!targetProj) return;

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
  };

  return (
    <ProjectContext.Provider value={{
      goals, setGoals, addGoal, updateGoal, deleteGoal,
      milestones, setMilestones, addMilestone, updateMilestone, deleteMilestone,
      filteredMilestones,
      ideas, setIdeas, addIdea, voteIdea, promoteIdeaToMilestone,
      team, portfolios, setPortfolios, releases, setReleases,
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
      resetDemoData
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
