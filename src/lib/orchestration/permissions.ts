import type { ForgeProjectConfig, ForgeWorkspaceSettings, OrchestrationConfig } from './types'

const DEFAULT_SETTINGS: ForgeWorkspaceSettings = {
  orchestration: {
    autonomy: 'manual',
    auto_chain: {},
    max_parallel_agents: 3,
    roundtable_quorum: 3,
  },
}

const workspaceSettingsFiles = import.meta.glob('/.forge/settings.json', {
  eager: true,
}) as Record<string, { default: ForgeWorkspaceSettings }>

const projectConfigFiles = import.meta.glob('/projects/*/forge.config.json', {
  eager: true,
}) as Record<string, { default: ForgeProjectConfig }>

export function getWorkspaceSettings(): ForgeWorkspaceSettings {
  const module = workspaceSettingsFiles['/.forge/settings.json']
  if (!module?.default) return DEFAULT_SETTINGS
  return {
    orchestration: {
      ...DEFAULT_SETTINGS.orchestration,
      ...module.default.orchestration,
      auto_chain: {
        ...DEFAULT_SETTINGS.orchestration.auto_chain,
        ...module.default.orchestration?.auto_chain,
      },
    },
  }
}

export function getProjectConfig(projectId: string): ForgeProjectConfig | null {
  const path = `/projects/${projectId}/forge.config.json`
  return projectConfigFiles[path]?.default || null
}

export function getEffectiveOrchestrationConfig(projectId: string): OrchestrationConfig {
  const workspace = getWorkspaceSettings()
  const project = getProjectConfig(projectId)

  if (!project?.orchestration) return workspace.orchestration

  return {
    ...workspace.orchestration,
    ...project.orchestration,
    auto_chain: {
      ...workspace.orchestration.auto_chain,
      ...project.orchestration.auto_chain,
    },
  }
}

export function isAutoChainAllowed(
  projectId: string,
  from: 'analyse' | 'plan' | 'design' | 'build',
  to: 'plan' | 'design' | 'build' | 'ship'
): boolean {
  const config = getEffectiveOrchestrationConfig(projectId)
  const key = `${from}_to_${to}` as keyof typeof config.auto_chain
  return config.auto_chain[key] ?? false
}
