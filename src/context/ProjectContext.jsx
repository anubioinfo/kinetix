import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialGoals, initialMilestones, initialIdeas, initialTeam, initialReleases } from '../data/mockData.js';
import { detectDependencyConflicts, autoRescheduleDependencies } from '../utils/dependencyUtils.js';

const ProjectContext = createContext();

const STORAGE_KEY = 'kinetix_note_app_v3';

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
  const [releases, setReleases] = useState(initialReleases);

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

  return (
    <ProjectContext.Provider value={{
      goals, setGoals, addGoal, updateGoal, deleteGoal,
      milestones, setMilestones, addMilestone, updateMilestone, deleteMilestone,
      filteredMilestones,
      ideas, setIdeas, addIdea, voteIdea, promoteIdeaToMilestone,
      team, releases,
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
