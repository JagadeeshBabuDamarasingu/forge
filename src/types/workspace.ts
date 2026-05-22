export type ProjectType = 'quick' | 'standard' | 'full'

export type ProjectPhase = 'analyse' | 'plan' | 'design' | 'build' | 'ship'

export type ProjectStatus = 'active' | 'paused' | 'shipped'

export interface ProjectMeta {
  id: string
  name: string
  description?: string
  type: ProjectType
  status: ProjectStatus
  currentPhase: ProjectPhase
  created: string // ISO date string
  updated: string // ISO date string
}

export interface ProjectsRegistry {
  projects: ProjectMeta[]
}

// ============================================================================
// Orchestration
// ============================================================================

export type OrchestrationAutonomy = 'manual' | 'semi' | 'full'

export type HandoffStatus = 'awaiting_approval' | 'auto_pending' | 'in_progress' | 'done'

export type AgentId = 'analyst' | 'pm' | 'architect' | 'ux' | 'dev'

export interface AgentRun {
  agent: AgentId
  started: string
  completed?: string
  artifacts: string[]
}

export interface PendingHandoff {
  from: AgentId
  to: AgentId
  artifacts: string[]
  status: HandoffStatus
  createdAt: string
}

export interface OrchestrationGates {
  analyse_complete: boolean
  plan_approved: boolean
  design_complete: boolean
  build_complete: boolean
}

export interface OrchestrationState {
  projectId: string
  currentPhase: ProjectPhase
  activeAgents: AgentId[]
  gates: OrchestrationGates
  pendingHandoffs: PendingHandoff[]
  agentHistory: AgentRun[]
  activeRoundtable: string | null
}

// ============================================================================
// Orchestration config (forge.config.json)
// ============================================================================

export interface AutoChainConfig {
  analyse_to_plan?: boolean
  plan_to_design?: boolean
  design_to_build?: boolean
  build_to_ship?: boolean
}

export interface OrchestrationConfig {
  autonomy: OrchestrationAutonomy
  auto_chain: AutoChainConfig
  max_parallel_agents: number
  roundtable_quorum: number
}

export interface ForgeProjectConfig {
  project: {
    name: string
    type: ProjectType
    description?: string
  }
  orchestration?: Partial<OrchestrationConfig>
}

export interface ForgeWorkspaceSettings {
  orchestration: OrchestrationConfig
}

// ============================================================================
// Epic / Story (Build phase)
// ============================================================================

export type EpicStatus = 'backlog' | 'in-progress' | 'done'

export type StoryStatus = 'backlog' | 'ready' | 'in-progress' | 'review' | 'done'

export interface SprintStatus {
  project: string
  status: Record<string, EpicStatus | StoryStatus>
}

export interface StoryData {
  id: string
  epicId: string
  title: string
  status: StoryStatus
  description?: string
  acceptanceCriteria?: string[]
}

export interface EpicData {
  id: string
  title: string
  status: EpicStatus
  stories: StoryData[]
  goal?: string
}

// ============================================================================
// Analyse phase artifacts
// ============================================================================

export interface ProjectBrief {
  problemStatement: string
  targetUser: string
  hypothesis: string
  raw: string
}

// ============================================================================
// Ship phase
// ============================================================================

export interface Deployment {
  env: 'development' | 'staging' | 'production'
  url?: string
  date: string
  version?: string
  notes?: string
}
