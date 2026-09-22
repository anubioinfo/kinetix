export const initialGoals = [
  {
    id: 'goal-1',
    title: 'Core Engine & Real-Time Sync Infrastructure',
    category: 'Backend Architecture',
    targetQuarter: 'Q4 2026',
    progress: 80,
    color: '#6366f1', // Indigo
    owner: 'Anurag',
    description: 'Build robust Python FastAPI microservices, PostgreSQL database schema, Redis caching, and real-time offline sync.'
  },
  {
    id: 'goal-2',
    title: 'Cross-Platform Mobile App (iOS & Android)',
    category: 'Mobile Clients',
    targetQuarter: 'Q4 2026',
    progress: 55,
    color: '#ec4899', // Pink
    owner: 'Ram',
    description: 'Deliver native-grade React Native app for iOS & Android with offline-first auto-sync, voice notes, and widgets.'
  },
  {
    id: 'goal-3',
    title: 'Real-Time Push Notification & Reminder Engine',
    category: 'Cloud Services',
    targetQuarter: 'Q3 2026',
    progress: 100,
    color: '#10b981', // Emerald
    owner: 'Nitin',
    description: 'Implement Firebase FCM, Apple APNs, and Celery scheduled cron jobs for time-based & geo-fenced note alerts.'
  },
  {
    id: 'goal-4',
    title: 'Multi-Platform Workspace Note Sharing & Collaboration',
    category: 'Collaboration',
    targetQuarter: 'Q3 2026',
    progress: 40,
    color: '#f59e0b', // Amber
    owner: 'Jitendra',
    description: 'Enable secure link sharing, fine-grained permission control, and live multi-user co-editing via WebSockets.'
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
    title: 'FastAPI Backend Architecture & PostgreSQL Schema',
    description: 'Design multi-tenant PostgreSQL schema, FastAPI REST API foundation, and Redis caching for high-speed note CRUD ops.',
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
    tags: ['Python', 'FastAPI', 'PostgreSQL', 'Backend'],
    progress: 100,
    dependencies: [],
    features: [
      { id: 'f-101', title: 'FastAPI async REST endpoints for Notes & Labels', completed: true, points: 8 },
      { id: 'f-102', title: 'PostgreSQL schema migration scripts with Alembic', completed: true, points: 5 },
      { id: 'f-103', title: 'Redis cache layer for sub-50ms note fetching', completed: true, points: 5 }
    ]
  },
  {
    id: 'ms-2',
    title: 'Rich-Text Web Editor & Offline Sync Engine',
    description: 'Build TipTap rich text web dashboard with checklist support and IndexedDB offline storage auto-sync.',
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
    tags: ['React', 'Frontend', 'TipTap', 'Offline'],
    progress: 100,
    dependencies: [],
    features: [
      { id: 'f-201', title: 'TipTap rich text editor with checklist formatting', completed: true, points: 8 },
      { id: 'f-202', title: 'IndexedDB local storage fallback manager', completed: true, points: 5 },
      { id: 'f-203', title: 'Automatic background sync queue handler', completed: true, points: 5 }
    ]
  },
  {
    id: 'ms-3',
    title: 'Dockerized Microservices & AWS Cloud CI/CD',
    description: 'Set up multi-container Docker infrastructure, AWS ECS deployment pipeline, and GitHub Actions CI/CD.',
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
    tags: ['DevOps', 'Docker', 'AWS', 'CI/CD'],
    progress: 100,
    dependencies: [],
    features: [
      { id: 'f-301', title: 'Docker-compose multi-service container setup', completed: true, points: 5 },
      { id: 'f-302', title: 'AWS ECS Fargate cluster orchestration & ALB', completed: true, points: 8 },
      { id: 'f-303', title: 'GitHub Actions automated build & test pipeline', completed: true, points: 5 }
    ]
  },
  {
    id: 'ms-4',
    title: 'Real-Time Push Notification & Reminder Engine',
    description: 'Implement Celery task queues, Firebase FCM, Apple APNs, and scheduled cron alerts for note reminders.',
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
    tags: ['Python', 'Notifications', 'Celery', 'FCM'],
    progress: 100,
    dependencies: ['ms-1'],
    features: [
      { id: 'f-401', title: 'Celery background task queue & Redis broker', completed: true, points: 5 },
      { id: 'f-402', title: 'Firebase FCM & Apple APNs push triggers', completed: true, points: 8 },
      { id: 'f-403', title: 'Scheduled cron worker for timed note alerts', completed: true, points: 5 }
    ]
  },
  {
    id: 'ms-5',
    title: 'Cross-Platform Mobile App (React Native iOS & Android)',
    description: 'Develop Google Keep-style mobile application with offline auto-sync, grid layout, and audio note attachments.',
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
    tags: ['React Native', 'Mobile', 'iOS', 'Android'],
    progress: 60,
    dependencies: ['ms-1', 'ms-2'],
    features: [
      { id: 'f-501', title: 'React Native unified UI component kit', completed: true, points: 8 },
      { id: 'f-502', title: 'SQLite local mobile database storage', completed: true, points: 5 },
      { id: 'f-503', title: 'Voice note recording & audio player module', completed: false, points: 5 }
    ]
  },
  {
    id: 'ms-6',
    title: 'Multi-Platform Workspace Note Sharing & Collaboration',
    description: 'Build public share links, granular view/edit permission levels, and WebSocket live co-editing.',
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
    tags: ['Python', 'WebSockets', 'Sharing', 'Collaboration'],
    progress: 40,
    dependencies: ['ms-1'],
    features: [
      { id: 'f-601', title: 'Granular note permissions (Viewer, Editor, Owner)', completed: true, points: 5 },
      { id: 'f-602', title: 'Public note link generator with optional password', completed: false, points: 5 },
      { id: 'f-603', title: 'WebSockets live co-editing & cursor presences', completed: false, points: 8 }
    ]
  },
  {
    id: 'ms-7',
    title: 'Automated QA Test Suite & Performance Load Verification',
    description: 'Execute PyTest API suite, Cypress E2E web regression suite, and Locust 10k concurrent user load tests.',
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
    tags: ['QA', 'Automation', 'PyTest', 'Cypress'],
    progress: 50,
    dependencies: ['ms-5', 'ms-6'],
    features: [
      { id: 'f-701', title: 'PyTest backend API test suite (90%+ coverage)', completed: true, points: 5 },
      { id: 'f-702', title: 'Cypress web E2E automated regression suite', completed: false, points: 5 },
      { id: 'f-703', title: 'Locust load testing suite verifying 10k users', completed: false, points: 5 }
    ]
  },
  {
    id: 'ms-8',
    title: 'AI-Powered Voice Note Transcription & Semantic Search',
    description: 'Integrate OpenAI Whisper for automatic audio-to-text conversion and pgvector for semantic note search.',
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
    tags: ['AI', 'Whisper', 'Search', 'pgvector'],
    progress: 0,
    dependencies: ['ms-6'],
    features: [
      { id: 'f-801', title: 'OpenAI Whisper API voice note transcription pipeline', completed: false, points: 8 },
      { id: 'f-802', title: 'pgvector semantic vector search & note recommendations', completed: false, points: 8 }
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
  { id: 'rel-1', name: 'KeepNote v1.0 Backend & Web Launch', date: '2026-09-25', status: 'Completed' },
  { id: 'rel-2', name: 'KeepNote v1.5 Mobile App & Push Reminders', date: '2026-10-25', status: 'In Progress' },
  { id: 'rel-3', name: 'KeepNote v2.0 Workspace Sharing & AI Search', date: '2026-11-20', status: 'Planning' }
];
