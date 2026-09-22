export const initialGoals = [
  {
    id: 'goal-1',
    title: 'Expand Enterprise Market Share by 35%',
    category: 'Growth & Revenue',
    targetQuarter: 'Q4 2026',
    progress: 72,
    color: '#6366f1', // Indigo
    owner: 'Sarah Jenkins',
    description: 'Drive enterprise adoption through multi-region compliance, SSO/SAM2, and advanced role-based permissions.'
  },
  {
    id: 'goal-2',
    title: 'Achieve SOC2 Type II & ISO27001 Certification',
    category: 'Security & Compliance',
    targetQuarter: 'Q3 2026',
    progress: 88,
    color: '#10b981', // Emerald
    owner: 'David Chen',
    description: 'Complete third-party audit readiness, automated log audit trails, and data isolation encryption.'
  },
  {
    id: 'goal-3',
    title: 'Next-Gen Interactive Visual Roadmap Engine',
    category: 'Product Innovation',
    targetQuarter: 'Q4 2026',
    progress: 45,
    color: '#ec4899', // Pink
    owner: 'Elena Rostova',
    description: 'Deliver real-time collaborative Gantt charting, SVG dependency arrows, and automated schedule conflict resolution.'
  },
  {
    id: 'goal-4',
    title: 'Reduce Customer Onboarding Time to <15 Mins',
    category: 'Customer Success',
    targetQuarter: 'Q3 2026',
    progress: 30,
    color: '#f59e0b', // Amber
    owner: 'Marcus Vance',
    description: 'Streamline workspace initialization, automated CSV/Jira import wizards, and interactive onboarding tours.'
  }
];

export const initialTeam = [
  { id: 'team-1', name: 'Sarah Jenkins', role: 'Product Lead', avatar: 'SJ', color: '#6366f1', capacityHours: 40, assignedHours: 36 },
  { id: 'team-2', name: 'David Chen', role: 'Security Architect', avatar: 'DC', color: '#10b981', capacityHours: 40, assignedHours: 32 },
  { id: 'team-3', name: 'Elena Rostova', role: 'Principal UI/UX Tech Lead', avatar: 'ER', color: '#ec4899', capacityHours: 40, assignedHours: 42 }, // Over capacity!
  { id: 'team-4', name: 'Marcus Vance', role: 'Full Stack Engineer', avatar: 'MV', color: '#f59e0b', capacityHours: 40, assignedHours: 28 },
  { id: 'team-5', name: 'Amara Patel', role: 'Data & Analytics Lead', avatar: 'AP', color: '#8b5cf6', capacityHours: 40, assignedHours: 35 }
];

export const initialMilestones = [
  {
    id: 'ms-1',
    title: 'Enterprise SSO & SAML2 Integration',
    description: 'Implement Okta, Azure AD, and PingIdentity single sign-on with directory sync.',
    goalId: 'goal-1',
    startDate: '2026-09-01',
    dueDate: '2026-09-20',
    status: 'Completed',
    health: 'On Track',
    priority: 'P0',
    impact: 9,
    effort: 5,
    riceReach: 12000,
    riceImpact: 3,
    riceConfidence: 0.95,
    riceEffort: 3,
    owner: 'Sarah Jenkins',
    tags: ['Security', 'Enterprise', 'Auth'],
    progress: 100,
    dependencies: [], // No predecessors
    features: [
      { id: 'f-101', title: 'SAML 2.0 metadata parser & validator', completed: true, points: 5 },
      { id: 'f-102', title: 'Okta & Azure AD pre-built connectors', completed: true, points: 8 },
      { id: 'f-103', title: 'User group auto-provisioning (SCIM)', completed: true, points: 5 }
    ]
  },
  {
    id: 'ms-2',
    title: 'Automated Audit Logging & Compliance Trails',
    description: 'Capture immutable audit logs for all milestone date changes, user access, and export actions.',
    goalId: 'goal-2',
    startDate: '2026-09-15',
    dueDate: '2026-10-05',
    status: 'In Progress',
    health: 'On Track',
    priority: 'P0',
    impact: 8,
    effort: 4,
    riceReach: 8500,
    riceImpact: 2.5,
    riceConfidence: 0.9,
    riceEffort: 2,
    owner: 'David Chen',
    tags: ['Security', 'Compliance', 'Audit'],
    progress: 75,
    dependencies: ['ms-1'], // Depends on Enterprise SSO
    features: [
      { id: 'f-201', title: 'Real-time event streaming pipeline', completed: true, points: 5 },
      { id: 'f-202', title: 'SOC2 compliant log retention policy', completed: true, points: 3 },
      { id: 'f-203', title: 'Auditor export package generator', completed: false, points: 5 }
    ]
  },
  {
    id: 'ms-3',
    title: 'Interactive SVG Gantt & Dependency Engine',
    description: 'Build high-performance Gantt chart rendering with draggable timeline bars and live SVG dependency connectors.',
    goalId: 'goal-3',
    startDate: '2026-09-22',
    dueDate: '2026-10-25',
    status: 'In Progress',
    health: 'On Track',
    priority: 'P0',
    impact: 10,
    effort: 7,
    riceReach: 25000,
    riceImpact: 3,
    riceConfidence: 0.9,
    riceEffort: 4,
    owner: 'Elena Rostova',
    tags: ['Gantt', 'UI', 'Frontend', 'Roadmap'],
    progress: 55,
    dependencies: ['ms-2'], // Depends on Audit logs
    features: [
      { id: 'f-301', title: 'SVG curved arrow renderer for dependencies', completed: true, points: 8 },
      { id: 'f-302', title: 'Drag-to-resize timeline bar controls', completed: true, points: 8 },
      { id: 'f-303', title: 'Auto-cascade date shift for dependent tasks', completed: false, points: 5 },
      { id: 'f-304', title: 'Day/Week/Month/Quarter zoom scale handler', completed: false, points: 3 }
    ]
  },
  {
    id: 'ms-4',
    title: 'Effort vs Impact 2x2 Priority Matrix',
    description: 'Visual matrix to plot features into Quick Wins, Major Projects, Fill-ins, and Thankless Tasks.',
    goalId: 'goal-3',
    startDate: '2026-10-10',
    dueDate: '2026-11-05',
    status: 'Not Started',
    health: 'On Track',
    priority: 'P1',
    impact: 8,
    effort: 3,
    riceReach: 15000,
    riceImpact: 2,
    riceConfidence: 0.85,
    riceEffort: 2,
    owner: 'Elena Rostova',
    tags: ['Prioritization', 'Strategy', 'Analytics'],
    progress: 10,
    dependencies: ['ms-3'],
    features: [
      { id: 'f-401', title: 'Interactive 2x2 coordinate drag layout', completed: false, points: 5 },
      { id: 'f-402', title: 'RICE Scorecard calculator & stack rank', completed: false, points: 5 }
    ]
  },
  {
    id: 'ms-5',
    title: '1-Click Jira & CSV Import Wizard',
    description: 'Allow customers to migrate existing project backlogs into Aura format instantly.',
    goalId: 'goal-4',
    startDate: '2026-10-01',
    dueDate: '2026-10-22',
    status: 'In Progress',
    health: 'At Risk',
    priority: 'P1',
    impact: 7,
    effort: 6,
    riceReach: 18000,
    riceImpact: 2.5,
    riceConfidence: 0.8,
    riceEffort: 3,
    owner: 'Marcus Vance',
    tags: ['Onboarding', 'Integrations', 'Import'],
    progress: 35,
    dependencies: ['ms-1'],
    features: [
      { id: 'f-501', title: 'CSV column mapper interface', completed: true, points: 5 },
      { id: 'f-502', title: 'Jira Cloud REST API importer', completed: false, points: 8 },
      { id: 'f-503', title: 'Duplicate milestone collision resolver', completed: false, points: 3 }
    ]
  },
  {
    id: 'ms-6',
    title: 'Resource Capacity & Workload Heatmap',
    description: 'Visualize team allocation, detect overloaded engineers, and reassign milestones seamlessly.',
    goalId: 'goal-1',
    startDate: '2026-10-18',
    dueDate: '2026-11-12',
    status: 'Not Started',
    health: 'On Track',
    priority: 'P2',
    impact: 6,
    effort: 4,
    riceReach: 9000,
    riceImpact: 1.5,
    riceConfidence: 0.9,
    riceEffort: 2,
    owner: 'Amara Patel',
    tags: ['Resource', 'Capacity', 'Workload'],
    progress: 0,
    dependencies: ['ms-4'],
    features: [
      { id: 'f-601', title: 'Weekly hour allocation chart', completed: false, points: 5 },
      { id: 'f-602', title: 'Over-capacity alert threshold notifications', completed: false, points: 3 }
    ]
  }
];

export const initialIdeas = [
  {
    id: 'idea-1',
    title: 'AI-Powered Automatic Milestone Breakdown',
    description: 'Use generative AI to auto-generate sub-tasks, estimated story points, and dependency suggestions from a milestone title.',
    submittedBy: 'Alex Rivera (Customer Success Lead)',
    votes: 68,
    status: 'Under Review',
    category: 'AI & Automation',
    createdAt: '2026-09-10'
  },
  {
    id: 'idea-2',
    title: 'Slack / MS Teams Real-time Milestone Alerts',
    description: 'Send automated webhooks when a milestone status turns At Risk or when dependencies are delayed.',
    submittedBy: 'Jessica Taylor (Engineering Manager)',
    votes: 54,
    status: 'Planned',
    category: 'Integrations',
    createdAt: '2026-09-12'
  },
  {
    id: 'idea-3',
    title: 'Export Gantt Roadmap as Interactive HTML Presentation',
    description: 'Allow product managers to present live roadmaps to board members without giving edit permissions.',
    submittedBy: 'Michael Chang (VP of Product)',
    votes: 41,
    status: 'Under Review',
    category: 'Export & Presentation',
    createdAt: '2026-09-18'
  },
  {
    id: 'idea-4',
    title: 'Dependency Lead/Lag Time Adjuster',
    description: 'Support negative lag (lead time) and positive lag days between predecessor and successor milestones.',
    submittedBy: 'Elena Rostova (Principal UI/UX Tech Lead)',
    votes: 35,
    status: 'Planned',
    category: 'Gantt Engine',
    createdAt: '2026-09-19'
  }
];

export const initialReleases = [
  { id: 'rel-1', name: 'Enterprise Q3 Release v2.4', date: '2026-09-30', status: 'In Progress' },
  { id: 'rel-2', name: 'Autumn Platform Update v3.0', date: '2026-10-31', status: 'Planning' },
  { id: 'rel-3', name: 'Winter Roadmap Refresh v3.5', date: '2026-12-15', status: 'Planning' }
];
