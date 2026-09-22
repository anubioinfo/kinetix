import React from 'react';
import { ProjectProvider, useProject } from './context/ProjectContext';
import Header from './components/Header';
import GanttView from './views/GanttView';
import PriorityMatrixView from './views/PriorityMatrixView';
import DependencyGraphView from './views/DependencyGraphView';
import StrategyView from './views/StrategyView';
import KanbanView from './views/KanbanView';
import IdeasView from './views/IdeasView';
import ResourceView from './views/ResourceView';
import AnalyticsView from './views/AnalyticsView';

import MilestoneModal from './components/MilestoneModal';
import GoalModal from './components/GoalModal';
import IdeaModal from './components/IdeaModal';
import DetailDrawer from './components/Drawer/DetailDrawer';
import OnboardingTour from './components/OnboardingTour';

function MainContent() {
  const { activeView } = useProject();

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {activeView === 'gantt' && <GanttView />}
      {activeView === 'priority' && <PriorityMatrixView />}
      {activeView === 'dependencies' && <DependencyGraphView />}
      {activeView === 'strategy' && <StrategyView />}
      {activeView === 'kanban' && <KanbanView />}
      {activeView === 'ideas' && <IdeasView />}
      {activeView === 'resource' && <ResourceView />}
      {activeView === 'analytics' && <AnalyticsView />}
    </main>
  );
}

export default function App() {
  return (
    <ProjectProvider>
      <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-indigo-600 selection:text-white">
        <Header />
        <MainContent />
        <MilestoneModal />
        <GoalModal />
        <IdeaModal />
        <DetailDrawer />
        <OnboardingTour />
      </div>
    </ProjectProvider>
  );
}
