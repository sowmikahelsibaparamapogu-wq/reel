export type InteractionType = 'watched' | 'liked' | 'saved' | 'shared' | 'skipped';

export interface Reel {
  id: string;
  title: string;
  creator?: string;
  caption: string;
  transcript?: string;
  thumbnailUrl?: string;
  mediaBase64?: string;
  mediaMimeType?: string;
  mediaType?: 'video' | 'image' | 'text';
  interaction: InteractionType;
  watchPercentage: number; // 0 - 100
  durationSeconds: number; // in seconds
  timestamp: string;
  categoryTag?: string;
  source?: 'youtube_shorts' | 'instagram_reels' | 'tiktok' | 'manual' | 'takeout';
  videoUrl?: string;
}

export interface StudentProfile {
  skillLevel?: 'Beginner' | 'Intermediate' | 'Advanced';
  careerGoal?: string;
  preferredAreas?: string[];
  topicsToLearn?: string[];
  currentGoals?: string;
}

export interface SingleReelUnderstanding {
  reelId: string;
  topic: string;
  secondaryTopics: string[];
  context: string;
  intent: 'Entertainment' | 'Education' | 'Career Advice' | 'Tool Review' | 'Hype / Clickbait' | 'Satire / Meme';
  technologyRelevance: number; // 0 - 100
  careerRelevance: number; // 0 - 100
  apparentInterest: 'Low' | 'Medium' | 'High' | 'Very High';
  skillLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  educationalValue: number; // 0 - 100
  qualityScore: number; // 0 - 100
  hypeRisk: number; // 0 - 100
  hypeReason?: string;
}

export interface InterestScore {
  category: string;
  percentage: number; // 0 - 100
  evidence: string;
  status?: 'emerging' | 'stable' | 'declining' | 'new';
  previousPercentage?: number;
}

export interface TechnologyDNA {
  interests: InterestScore[];
  latentInterests: string[];
  dominantArchetype: string; // e.g. "Scalable Backend Architect", "Systems & Hardware Enthusiast", "AI Systems Pioneer"
  overallSkillLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  skillLevelRationale: string;
  confidence: 'High' | 'Medium' | 'Low';
}

export interface InterestEvolutionItem {
  topic: string;
  fromPercentage: number;
  toPercentage: number;
  trend: 'emerging' | 'declining' | 'stable' | 'new';
  description: string;
}

export interface SkillGap {
  area: string;
  observation: string;
  learningGap: string;
  recommendedBridgeTopic: string;
  severity: 'Minor' | 'Moderate' | 'High Opportunity';
}

export interface CandidateRecommendation {
  id: string;
  title: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  relevanceScore: number;
  educationalValue: number;
  qualityScore: number;
  hypeRisk: number;
  predictedEngagement: number;
  whyThisCandidate: string;
  hypeExplanation?: string;
  status: 'selected' | 'alternative' | 'filtered_out';
}

export interface LearningPathStep {
  stepNumber: number;
  stageName: 'Current Level' | 'Beginner Foundation' | 'Intermediate Deep-Dive' | 'Advanced Application' | 'Practical Project' | 'Next Skill Horizon';
  topicTitle: string;
  format: 'Short Reel' | 'Concept Breakdown' | 'Architecture Walkthrough' | 'Hands-on Code' | 'Full Project Build';
  description: string;
  estimatedDuration: string;
}

export interface BestMatchComparison {
  bestMatchTitle: string;
  bestMatchScore: number;
  alternativeTitle: string;
  alternativeScore: number;
  whyBestMatchWon: string;
}

export interface RecommendationResult {
  id: string;
  recommendedTechReel: string;
  creatorOrSource: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  confidence: 'High' | 'Medium' | 'Low';
  
  // Scores
  relevanceScore: number;
  educationalValue: number;
  qualityScore: number;
  hypeRisk: number;
  predictedEngagement: number;

  // Reasoning
  interestDetected: string;
  latentInterestFound: string;
  whyRecommended: string;
  whyDoIGetThis: string;
  repetitionWarning?: string;
  
  // Alternatives & Candidates
  comparison?: BestMatchComparison;
  allCandidates?: CandidateRecommendation[];
  
  // Exploration metadata
  recommendationMode: 'exploit' | 'explore' | 'focused' | 'surprise';
  isSurprisePick?: boolean;
  surpriseConnection?: string;
  
  timestamp: string;
}

export interface TechCategory {
  id: string;
  name: string;
  shortName: string;
  description: string;
  icon: string;
  tag: string;
  sampleReels: string[];
}

export const ALL_TECH_CATEGORIES: TechCategory[] = [
  {
    id: 'all',
    name: 'All Categories (Dynamic DNA)',
    shortName: 'Dynamic DNA',
    description: 'Synthesizes your complete cross-category consumption patterns into holistic technical archetypes.',
    icon: 'Sparkles',
    tag: 'Full Spectrum',
    sampleReels: ['Distributed Systems', 'JVM Internals', 'System Architecture'],
  },
  {
    id: 'ai-ml',
    name: 'AI, Machine Learning & LLMs',
    shortName: 'AI & Machine Learning',
    description: 'Transformers, fine-tuning, RAG pipelines, neural architectures, PyTorch, and AI inference optimization.',
    icon: 'Brain',
    tag: 'AI / ML',
    sampleReels: ['Attention Mechanism Visually Explained', 'Building Local RAG with Ollama & LangChain', 'Quantization 4-bit vs 8-bit Models'],
  },
  {
    id: 'web-dev',
    name: 'Web & Full-Stack Engineering',
    shortName: 'Web & Full-Stack',
    description: 'Modern frontend, React 19, Next.js App Router, WebSockets, hydration algorithms, and server actions.',
    icon: 'Globe',
    tag: 'Web Dev',
    sampleReels: ['React 19 Server Components Deep Dive', 'Optimizing Web Vitals & Hydration Chunks', 'WebSockets vs Server-Sent Events'],
  },
  {
    id: 'backend-systems',
    name: 'Backend & Distributed Systems',
    shortName: 'Backend & Systems',
    description: 'Microservice orchestration, event queues (Kafka/RabbitMQ), caching tiers (Redis), and consensus protocols (Raft/Paxos).',
    icon: 'Server',
    tag: 'Distributed Systems',
    sampleReels: ['Designing Idempotent Kafka Consumers', 'Redis Event Loop & epoll Internals', 'Database Sharding Strategies at Scale'],
  },
  {
    id: 'cloud-devops',
    name: 'Cloud, DevOps & SRE',
    shortName: 'Cloud & DevOps',
    description: 'Kubernetes operators, Docker optimization, Terraform IaC, CI/CD pipelines, and Prometheus observability.',
    icon: 'Cloud',
    tag: 'DevOps & SRE',
    sampleReels: ['Kubernetes Pod Lifecycle & Eviction Loops', 'Multi-stage Docker Builds for 90% Smaller Images', 'Terraform State Locking with DynamoDB'],
  },
  {
    id: 'dsa-algos',
    name: 'Data Structures & Algorithms (DSA)',
    shortName: 'DSA & Algorithms',
    description: 'Graph algorithms (Dijkstra/A*), Dynamic Programming matrices, Trie structures, and high-frequency LeetCode patterns.',
    icon: 'Binary',
    tag: 'DSA',
    sampleReels: ['Graph Traversal Patterns for Hard Interviews', 'Dynamic Programming Memoization Explained with 3D Visuals', 'LRU Cache Design from Scratch in 60s'],
  },
  {
    id: 'cybersecurity',
    name: 'Cybersecurity & Application Security',
    shortName: 'Cybersecurity & AppSec',
    description: 'Zero Trust architecture, OAuth2/OIDC flows, JWT forgery prevention, cryptographic primitives, and penetration testing.',
    icon: 'Shield',
    tag: 'Cybersecurity',
    sampleReels: ['JWT vs Session Tokens: Security Tradeoffs', 'CSRF vs XSS: How Attackers Steal Cookies', 'Zero Trust Architecture in Cloud Native Apps'],
  },
  {
    id: 'mobile-dev',
    name: 'Mobile App Engineering',
    shortName: 'Mobile Dev',
    description: 'Flutter runtime engine, React Native Hermes engine, Swift Concurrency, and native Android Compose architecture.',
    icon: 'Smartphone',
    tag: 'Mobile Dev',
    sampleReels: ['Flutter Skia vs Impeller Engine Comparison', 'React Native Hermes Bytecode Optimization', 'Swift Actors & Concurrency Explained'],
  },
  {
    id: 'databases',
    name: 'Database Internals & SQL',
    shortName: 'Database Engineering',
    description: 'PostgreSQL B-Tree index structures, WAL mechanics, MVCC transaction isolation, and Vector search databases.',
    icon: 'Database',
    tag: 'Databases',
    sampleReels: ['PostgreSQL B-Tree vs BRIN Indexes', 'Understanding MVCC & VACUUM in Postgres', 'HNSW Vector Indexes for Fast Similarity Search'],
  },
  {
    id: 'low-level',
    name: 'Low-Level & Systems Programming (Rust/C++)',
    shortName: 'Systems & Low-Level',
    description: 'Rust borrow checker, memory layouts, cache lines, SIMD vectorization, Linux kernel syscalls, and WebAssembly.',
    icon: 'Cpu',
    tag: 'Low-Level',
    sampleReels: ['Rust Ownership & Borrowing Visualized', 'CPU Cache Lines & False Sharing in Multithreading', 'Writing Custom Linux Syscalls in C'],
  },
  {
    id: 'ui-ux',
    name: 'UI/UX & Design Systems Engineering',
    shortName: 'UI/UX & Design Systems',
    description: 'Design tokens, accessible WCAG component primitives, micro-animations with Motion, and Figma-to-code pipelines.',
    icon: 'Palette',
    tag: 'UI/UX Design',
    sampleReels: ['Designing Cohesive Design Token Systems', 'Micro-Interactions that Increase User Delight', 'Accessible Focus Rings & Keyboard Navigation'],
  },
  {
    id: 'career-tech',
    name: 'Developer Career & Tech Culture',
    shortName: 'Career & Culture',
    description: 'Staff+ engineering mindset, system design interview mastery, technical communication, and promotion strategy.',
    icon: 'Briefcase',
    tag: 'Career & Culture',
    sampleReels: ['System Design Interview: How Senior Engineers Lead', 'How to Write High-Impact RFCs & Tech Specs', 'Junior to Senior Engineer: The Real Mental Shift'],
  },
];

export interface WeeklyProgressSummary {
  reelsAnalyzedCount: number;
  topicsExploredCount: number;
  strongestInterest: string;
  emergingInterest: string;
  possibleGap: string;
  nextRecommendedSkill: string;
  hypeFilteredCount: number;
  learningStreakDays: number;
  scrollSkillConversionRate: number; // e.g. 78%
}

export interface FullAnalysisResponse {
  understandings: SingleReelUnderstanding[];
  technologyDNA: TechnologyDNA;
  interestEvolution: InterestEvolutionItem[];
  skillGaps: SkillGap[];
  learningPath: LearningPathStep[];
  primaryRecommendation: RecommendationResult;
  weeklyProgress: WeeklyProgressSummary;
  selectedCategory?: string;
  repetitionNote?: string;
  analysisTimestamp: string;
}

export interface FeedbackItem {
  recommendationId: string;
  feedbackType: 'relevant' | 'not_relevant' | 'saved' | 'skipped' | 'surprise';
  topic: string;
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'agent';
  content: string;
  timestamp: string;
  suggestedPrompts?: string[];
}

export interface TrapTestScenario {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  reels: Reel[];
  weakTrapAnswer: string;
  strongAgentGoal: string;
}

export interface YouTubeSyncStatus {
  connected: boolean;
  channelTitle?: string;
  userEmail?: string;
  itemCount?: number;
  lastSynced?: string;
  hasCredentials: boolean;
  hasApiKey: boolean;
}

export interface YouTubeHistoryItem {
  id: string;
  title: string;
  channelTitle?: string;
  description?: string;
  publishedAt?: string;
  durationSeconds: number;
  isShort: boolean;
  url: string;
  thumbnailUrl?: string;
  interaction: InteractionType;
  category?: string;
}
