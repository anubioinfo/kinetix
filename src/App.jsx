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
import IntegrationHubView from './views/IntegrationHubView';
import PortfolioView from './views/PortfolioView';
import ProjectsView from './views/ProjectsView';
import WhatIfSimulatorView from './views/WhatIfSimulatorView';

import GettingStartedView from './views/GettingStartedView';

import MilestoneModal from './components/MilestoneModal';
import GoalModal from './components/GoalModal';
import IdeaModal from './components/IdeaModal';
import DetailDrawer from './components/Drawer/DetailDrawer';
import OnboardingTour from './components/OnboardingTour';
import DeveloperProfileModal from './components/DeveloperProfileModal';
import AICopilotDrawer from './components/AICopilotDrawer';
import IntegrationHubModal from './components/IntegrationHubModal';
import ActivityTicker from './components/ActivityTicker';
import AIRiskWarningBanner from './components/AIRiskWarningBanner';
import NotificationDrawer from './components/NotificationDrawer';
import TimeTravelBar from './components/TimeTravelBar';
import AutoSchedulerModal from './components/AutoSchedulerModal';
import SprintRetrospectiveModal from './components/SprintRetrospectiveModal';
import ReleaseNotesModal from './components/ReleaseNotesModal';
import QuickStartWidget from './components/QuickStartWidget';
import CommandPaletteModal from './components/CommandPaletteModal';

function MainContent() {
  const { activeView } = useProject();

  return (
    <main key={activeView} className="view-enter max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {activeView === 'gantt' && <GanttView />}
      {activeView === 'projects' && <ProjectsView />}
      {activeView === 'portfolio' && <PortfolioView />}
      {activeView === 'priority' && <PriorityMatrixView />}
      {activeView === 'dependencies' && <DependencyGraphView />}
      {activeView === 'strategy' && <StrategyView />}
      {activeView === 'kanban' && <KanbanView />}
      {activeView === 'ideas' && <IdeasView />}
      {activeView === 'resource' && <ResourceView />}
      {activeView === 'analytics' && <AnalyticsView />}
      {activeView === 'integrations' && <IntegrationHubView />}
      {activeView === 'whatif' && <WhatIfSimulatorView />}
      {activeView === 'getting-started' && <GettingStartedView />}
    </main>
  );
}


function AppContent() {
  const { isAICopilotOpen, closeAICopilot, isIntegrationModalOpen, closeIntegrationHub } = useProject();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-indigo-600 selection:text-white">
      <TimeTravelBar />
      <Header />
      <ActivityTicker />
      <AIRiskWarningBanner />
      <MainContent />
      <MilestoneModal />
      <GoalModal />
      <IdeaModal />
      <DetailDrawer />
      <DeveloperProfileModal />
      <NotificationDrawer />
      <AutoSchedulerModal />
      <SprintRetrospectiveModal />
      <ReleaseNotesModal />
      <AICopilotDrawer isOpen={isAICopilotOpen} onClose={closeAICopilot} />
      <IntegrationHubModal isOpen={isIntegrationModalOpen} onClose={closeIntegrationHub} />
      <OnboardingTour />
      <QuickStartWidget />
      <CommandPaletteModal />
    </div>
  );
}

export default function App() {
  return (
    <ProjectProvider>
      <AppContent />
    </ProjectProvider>
  );
}
