import type {
  ProjectMeta,
  ProjectType,
  ProjectPhase,
  ProjectStatus,
  ProjectsRegistry,
  SprintStatus,
} from '@/types/workspace'

// Discover all projects by their project.json files
const projectMetaFiles = import.meta.glob('/projects/*/project.json', {
  eager: true,
}) as Record<string, { default: Omit<ProjectMeta, 'id'> }>

const registryFiles = import.meta.glob('/projects/projects.json', {
  eager: true,
}) as Record<string, { default: ProjectsRegistry }>

// Analyse phase artifacts
const briefFiles = import.meta.glob('/projects/*/analyse/brief.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

const prfaqFiles = import.meta.glob('/projects/*/analyse/prfaq.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

const marketResearchFiles = import.meta.glob('/projects/*/analyse/research/market.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

const techResearchFiles = import.meta.glob('/projects/*/analyse/research/technical.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

// Plan phase artifacts
const prdFiles = import.meta.glob('/projects/*/plan/prd.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

const architectureFiles = import.meta.glob('/projects/*/plan/architecture.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

const uxSpecFiles = import.meta.glob('/projects/*/plan/ux-spec.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

// Build phase artifacts
const sprintStatusFiles = import.meta.glob('/projects/*/build/sprint-status.json', {
  eager: true,
}) as Record<string, { default: SprintStatus }>

const epicFiles = import.meta.glob('/projects/*/build/epics/*/epic.json', {
  eager: true,
}) as Record<string, { default: { title: string; goal?: string } }>

// Ship phase artifacts
const launchChecklistFiles = import.meta.glob('/projects/*/ship/launch-checklist.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

const deploymentsFiles = import.meta.glob('/projects/*/ship/deployments.json', {
  eager: true,
}) as Record<string, { default: unknown[] }>

// Project context
const projectContextFiles = import.meta.glob('/projects/*/project-context.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

function extractProjectId(path: string): string | null {
  const match = path.match(/\/projects\/([^/]+)\//)
  return match?.[1] || null
}

export function listProjects(): ProjectMeta[] {
  const localProjects = Object.entries(projectMetaFiles).map(([path, module]) => {
    const id = extractProjectId(path) || 'unknown'
    const data = module.default
    return {
      id,
      name: data.name || id,
      description: data.description,
      type: (data.type || 'standard') as ProjectType,
      status: (data.status || 'active') as ProjectStatus,
      currentPhase: (data.currentPhase || 'analyse') as ProjectPhase,
      created: data.created || new Date().toISOString(),
      updated: data.updated || new Date().toISOString(),
      storage: data.storage,
    }
  })

  const byId = new Map<string, ProjectMeta>()
  for (const project of localProjects) {
    byId.set(project.id, project)
  }

  const registryProjects = registryFiles['/projects/projects.json']?.default?.projects ?? []
  for (const project of registryProjects) {
    const existing = byId.get(project.id)
    byId.set(project.id, {
      ...project,
      ...existing,
      storage: existing?.storage ?? project.storage,
    })
  }

  return Array.from(byId.values()).sort((a, b) => {
    return new Date(b.updated).getTime() - new Date(a.updated).getTime()
  })
}

export function getProject(projectId: string): ProjectMeta | null {
  const path = `/projects/${projectId}/project.json`
  const module = projectMetaFiles[path]
  if (!module?.default) return null
  return {
    id: projectId,
    ...module.default,
    type: (module.default.type || 'standard') as ProjectType,
    status: (module.default.status || 'active') as ProjectStatus,
    currentPhase: (module.default.currentPhase || 'analyse') as ProjectPhase,
  }
}

// Analyse phase
export function hasAnalyseBrief(projectId: string): boolean {
  return `/projects/${projectId}/analyse/brief.md` in briefFiles
}
export function getAnalyseBrief(projectId: string): string | null {
  return briefFiles[`/projects/${projectId}/analyse/brief.md`] || null
}
export function hasPrfaq(projectId: string): boolean {
  return `/projects/${projectId}/analyse/prfaq.md` in prfaqFiles
}
export function getPrfaq(projectId: string): string | null {
  return prfaqFiles[`/projects/${projectId}/analyse/prfaq.md`] || null
}
export function hasMarketResearch(projectId: string): boolean {
  return `/projects/${projectId}/analyse/research/market.md` in marketResearchFiles
}
export function getMarketResearch(projectId: string): string | null {
  return marketResearchFiles[`/projects/${projectId}/analyse/research/market.md`] || null
}
export function hasTechResearch(projectId: string): boolean {
  return `/projects/${projectId}/analyse/research/technical.md` in techResearchFiles
}
export function getTechResearch(projectId: string): string | null {
  return techResearchFiles[`/projects/${projectId}/analyse/research/technical.md`] || null
}

// Plan phase
export function hasPrd(projectId: string): boolean {
  return `/projects/${projectId}/plan/prd.md` in prdFiles
}
export function getPrd(projectId: string): string | null {
  return prdFiles[`/projects/${projectId}/plan/prd.md`] || null
}
export function hasArchitecture(projectId: string): boolean {
  return `/projects/${projectId}/plan/architecture.md` in architectureFiles
}
export function getArchitecture(projectId: string): string | null {
  return architectureFiles[`/projects/${projectId}/plan/architecture.md`] || null
}
export function hasUxSpec(projectId: string): boolean {
  return `/projects/${projectId}/plan/ux-spec.md` in uxSpecFiles
}
export function getUxSpec(projectId: string): string | null {
  return uxSpecFiles[`/projects/${projectId}/plan/ux-spec.md`] || null
}

// Build phase
export function getSprintStatus(projectId: string): SprintStatus | null {
  return sprintStatusFiles[`/projects/${projectId}/build/sprint-status.json`]?.default || null
}

export function getEpicIds(projectId: string): string[] {
  const prefix = `/projects/${projectId}/build/epics/`
  return Object.keys(epicFiles)
    .filter(p => p.startsWith(prefix))
    .map(p => {
      const match = p.match(/\/epics\/([^/]+)\/epic\.json$/)
      return match?.[1] || null
    })
    .filter((id): id is string => id !== null)
}

export function getEpicMeta(projectId: string, epicId: string): { title: string; goal?: string } | null {
  return epicFiles[`/projects/${projectId}/build/epics/${epicId}/epic.json`]?.default || null
}

// Ship phase
export function hasLaunchChecklist(projectId: string): boolean {
  return `/projects/${projectId}/ship/launch-checklist.md` in launchChecklistFiles
}
export function getLaunchChecklist(projectId: string): string | null {
  return launchChecklistFiles[`/projects/${projectId}/ship/launch-checklist.md`] || null
}
export function getDeployments(projectId: string): unknown[] {
  return deploymentsFiles[`/projects/${projectId}/ship/deployments.json`]?.default || []
}

// Context
export function getProjectContext(projectId: string): string | null {
  return projectContextFiles[`/projects/${projectId}/project-context.md`] || null
}
