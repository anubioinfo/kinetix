export const initialGoals = [
  {
    id: 'goal-1',
    title: 'Cloud Core & Data Sync Engine',
    category: 'Product Architecture',
    targetQuarter: 'Q4 2026',
    progress: 80,
    color: '#6366f1', // Indigo
    owner: 'Anurag',
    description: 'Deliver sub-50ms cloud note synchronization, offline database persistence, and robust platform security.'
  },
  {
    id: 'goal-2',
    title: 'Mobile App Experience (iOS & Android)',
    category: 'Mobile Applications',
    targetQuarter: 'Q4 2026',
    progress: 55,
    color: '#ec4899', // Pink
    owner: 'Ram',
    description: 'Build native iOS and Android apps with offline editing, voice memo recording, and home screen widgets.'
  },
  {
    id: 'goal-3',
    title: 'Smart Push Alerts & Reminders',
    category: 'Notifications',
    targetQuarter: 'Q3 2026',
    progress: 100,
    color: '#10b981', // Emerald
    owner: 'Nitin',
    description: 'Trigger instant mobile push alerts, scheduled calendar reminders, and geo-fenced location notifications.'
  },
  {
    id: 'goal-4',
    title: 'Workspace Sharing & Co-Editing',
    category: 'Collaboration',
    targetQuarter: 'Q3 2026',
    progress: 40,
    color: '#f59e0b', // Amber
    owner: 'Jitendra',
    description: 'Enable one-click link sharing, custom access permissions, and real-time live co-editing across teams.'
  }
];

export const initialTeam = [
  { id: 'team-1', name: 'Anurag', role: 'Engineering Manager & Product Lead', avatar: 'AN', color: '#6366f1', capacityHours: 40, assignedHours: 36 },
  { id: 'team-2', name: 'Jitendra', role: 'Senior Python Developer', avatar: 'JD', color: '#3b82f6', capacityHours: 40, assignedHours: 38 },
  { id: 'team-3', name: 'Nitin', role: 'Python Developer (Notifications Lead)', avatar: 'ND', color: '#06b6d4', capacityHours: 40, assignedHours: 32 },
  { id: 'team-4', name: 'Ram', role: 'Senior Frontend Developer (Web Lead)', avatar: 'RM', color: '#ec4899', capacityHours: 40, assignedHours: 35 },
  { id: 'team-5', name: 'Akshay', role: 'Frontend Developer (Mobile Lead)', avatar: 'AK', color: '#8b5cf6', capacityHours: 40, assignedHours: 40 },
  { id: 'team-6', name: 'Dinesh', role: 'Lead QA Engineer', avatar: 'DE', color: '#10b981', capacityHours: 40, assignedHours: 30 },
  { id: 'team-7', name: 'Shyam', role: 'DevOps Engineer', avatar: 'SH', color: '#f59e0b', capacityHours: 40, assignedHours: 34 }
];

export const initialMilestones = [
  {
    id: 'ms-1',
    title: 'Cloud Data Sync',
    description: 'Sub-50ms cloud data synchronization, secure user authentication, and high-speed note storage.',
    goalId: 'goal-1',
    startDate: '2026-09-01',
    dueDate: '2026-09-15',
    status: 'Completed',
    health: 'On Track',
    priority: 'P0',
    impact: 10,
    effort: 5,
    riceReach: 25000,
    riceImpact: 3,
    riceConfidence: 0.95,
    riceEffort: 3,
    owner: 'Jitendra',
    tags: ['Cloud', 'Sync', 'Security', 'Database'],
    progress: 100,
    dependencies: [],
    features: [
      { id: 'f-101', title: 'Instant REST API for Notes & Labels', completed: true, points: 8 },
      { id: 'f-102', title: 'Database schema migration and data safety', completed: true, points: 5 },
      { id: 'f-103', title: 'Sub-50ms Redis memory cache layer', completed: true, points: 5 }
    ]
  },
  {
    id: 'ms-2',
    title: 'Web Rich Editor',
    description: 'Interactive formatting toolbar, checklists, bullet lists, and automatic offline local drafts.',
    goalId: 'goal-1',
    startDate: '2026-09-05',
    dueDate: '2026-09-20',
    status: 'Completed',
    health: 'On Track',
    priority: 'P0',
    impact: 9,
    effort: 5,
    riceReach: 20000,
    riceImpact: 3,
    riceConfidence: 0.9,
    riceEffort: 3,
    owner: 'Ram',
    tags: ['Web', 'Editor', 'RichText', 'Offline'],
    progress: 100,
    dependencies: [],
    features: [
      { id: 'f-201', title: 'Rich text editor with checklist formatting', completed: true, points: 8 },
      { id: 'f-202', title: 'IndexedDB local storage fallback manager', completed: true, points: 5 },
      { id: 'f-203', title: 'Automatic background sync queue handler', completed: true, points: 5 }
    ]
  },
  {
    id: 'ms-3',
    title: 'Global Hosting Engine',
    description: 'High-availability multi-region hosting, automated deployments, and sub-second load balancing.',
    goalId: 'goal-1',
    startDate: '2026-09-08',
    dueDate: '2026-09-22',
    status: 'Completed',
    health: 'On Track',
    priority: 'P0',
    impact: 9,
    effort: 4,
    riceReach: 18000,
    riceImpact: 2.5,
    riceConfidence: 0.95,
    riceEffort: 2,
    owner: 'Shyam',
    tags: ['Cloud', 'Hosting', 'Containers', 'CI/CD'],
    progress: 100,
    dependencies: [],
    features: [
      { id: 'f-301', title: 'Multi-service container cluster setup', completed: true, points: 5 },
      { id: 'f-302', title: 'AWS Cloud cluster orchestration & load balancer', completed: true, points: 8 },
      { id: 'f-303', title: 'Automated build & release deployment pipeline', completed: true, points: 5 }
    ]
  },
  {
    id: 'ms-4',
    title: 'Smart Push Alerts',
    description: 'Time-based scheduled alerts, location triggers, and multi-device instant notifications.',
    goalId: 'goal-3',
    startDate: '2026-09-12',
    dueDate: '2026-09-26',
    status: 'Completed',
    health: 'On Track',
    priority: 'P0',
    impact: 9,
    effort: 4,
    riceReach: 22000,
    riceImpact: 3,
    riceConfidence: 0.9,
    riceEffort: 3,
    owner: 'Nitin',
    tags: ['Notifications', 'Alerts', 'Reminders', 'Push'],
    progress: 100,
    dependencies: ['ms-1'],
    features: [
      { id: 'f-401', title: 'Background task queue & notification broker', completed: true, points: 5 },
      { id: 'f-402', title: 'Firebase & Apple push notification triggers', completed: true, points: 8 },
      { id: 'f-403', title: 'Scheduled worker for timed note reminders', completed: true, points: 5 }
    ]
  },
  {
    id: 'ms-5',
    title: 'iOS & Android Apps',
    description: 'Native mobile experience with touch gestures, offline editing, home screen widgets, and voice memos.',
    goalId: 'goal-2',
    startDate: '2026-09-18',
    dueDate: '2026-10-15',
    status: 'In Progress',
    health: 'On Track',
    priority: 'P0',
    impact: 10,
    effort: 7,
    riceReach: 30000,
    riceImpact: 3,
    riceConfidence: 0.85,
    riceEffort: 4,
    owner: 'Akshay',
    tags: ['Mobile', 'iOS', 'Android', 'App'],
    progress: 60,
    dependencies: ['ms-1', 'ms-2'],
    features: [
      { id: 'f-501', title: 'Unified mobile UI component kit', completed: true, points: 8 },
      { id: 'f-502', title: 'Offline mobile database storage engine', completed: true, points: 5 },
      { id: 'f-503', title: 'Voice note recording & audio playback module', completed: false, points: 5 }
    ]
  },
  {
    id: 'ms-6',
    title: 'Workspace Sharing',
    description: 'Granular access permissions, instant share links, and real-time live co-editing.',
    goalId: 'goal-4',
    startDate: '2026-09-22',
    dueDate: '2026-10-20',
    status: 'In Progress',
    health: 'At Risk',
    priority: 'P1',
    impact: 8,
    effort: 6,
    riceReach: 15000,
    riceImpact: 2.5,
    riceConfidence: 0.8,
    riceEffort: 3,
    owner: 'Jitendra',
    tags: ['Sharing', 'Collaboration', 'Permissions', 'Co-Editing'],
    progress: 40,
    dependencies: ['ms-1'],
    features: [
      { id: 'f-601', title: 'Granular note permissions (Viewer, Editor, Owner)', completed: true, points: 5 },
      { id: 'f-602', title: 'Public note link generator with optional password', completed: false, points: 5 },
      { id: 'f-603', title: 'Live co-editing & multi-cursor presence', completed: false, points: 8 }
    ]
  },
  {
    id: 'ms-7',
    title: 'Quality & Security QA',
    description: 'Comprehensive end-to-end regression testing, security auditing, and high-concurrency load verification.',
    goalId: 'goal-1',
    startDate: '2026-09-25',
    dueDate: '2026-10-22',
    status: 'Under Review',
    health: 'On Track',
    priority: 'P1',
    impact: 8,
    effort: 5,
    riceReach: 16000,
    riceImpact: 2,
    riceConfidence: 0.9,
    riceEffort: 3,
    owner: 'Dinesh',
    tags: ['QA', 'Testing', 'Security', 'Automation'],
    progress: 50,
    dependencies: ['ms-5', 'ms-6'],
    features: [
      { id: 'f-701', title: 'Automated backend API test suite (90%+ coverage)', completed: true, points: 5 },
      { id: 'f-702', title: 'Web E2E automated regression test suite', completed: false, points: 5 },
      { id: 'f-703', title: 'High-concurrency load testing for 10k users', completed: false, points: 5 }
    ]
  },
  {
    id: 'ms-8',
    title: 'AI Voice Transcribe',
    description: 'Automatic voice-to-text audio conversion and AI-powered natural language note search.',
    goalId: 'goal-2',
    startDate: '2026-10-10',
    dueDate: '2026-11-05',
    status: 'Not Started',
    health: 'On Track',
    priority: 'P2',
    impact: 9,
    effort: 6,
    riceReach: 20000,
    riceImpact: 3,
    riceConfidence: 0.8,
    riceEffort: 4,
    owner: 'Ram',
    tags: ['AI', 'Voice', 'Transcription', 'Search'],
    progress: 0,
    dependencies: ['ms-6'],
    features: [
      { id: 'f-801', title: 'AI voice note audio transcription pipeline', completed: false, points: 8 },
      { id: 'f-802', title: 'Natural language search & note recommendations', completed: false, points: 8 }
    ]
  }
];

export const initialIdeas = [
  {
    id: 'idea-1',
    title: 'Voice Note Auto-Transcription with Whisper AI Model',
    description: 'Automatically transcribe audio note recordings into searchable text using Whisper AI with language auto-detection.',
    submittedBy: 'Anurag (Product Lead)',
    votes: 185,
    status: 'Promoted',
    category: 'AI & Voice',
    createdAt: '2026-09-10'
  },
  {
    id: 'idea-2',
    title: 'End-to-End Encrypted Private Vault Notes',
    description: 'Allow users to lock sensitive notes behind biometrics & master key with client-side AES-256 encryption.',
    submittedBy: 'Jitendra (Senior Python Developer)',
    votes: 142,
    status: 'Approved',
    category: 'Security',
    createdAt: '2026-09-12'
  },
  {
    id: 'idea-3',
    title: 'Location-Based Geo-Fenced Push Reminders',
    description: 'Trigger push notifications on mobile devices when users enter specific GPS coordinates (e.g. Grocery Store list).',
    submittedBy: 'Akshay (Mobile Lead)',
    votes: 98,
    status: 'Under Review',
    category: 'Mobile & GPS',
    createdAt: '2026-09-15'
  },
  {
    id: 'idea-4',
    title: 'Direct Note Export to Markdown, PDF & Google Docs',
    description: 'One-click export formatting for notes into structured Markdown files, PDF documents, or Google Drive.',
    submittedBy: 'Ram (Senior Frontend Developer)',
    votes: 112,
    status: 'Planned',
    category: 'Integrations',
    createdAt: '2026-09-18'
  }
];

export const initialReleases = [
  { id: 'rel-1', name: 'KeepNote v1.0 Core Engine & Web Launch', date: '2026-09-25', status: 'Completed' },
  { id: 'rel-2', name: 'KeepNote v1.5 Mobile App & Push Reminders', date: '2026-10-25', status: 'In Progress' },
  { id: 'rel-3', name: 'KeepNote v2.0 Workspace Sharing & AI Search', date: '2026-11-20', status: 'Planning' }
];
