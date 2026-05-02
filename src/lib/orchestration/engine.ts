import type { OrchestrationState, OrchestrationGates } from './types'
import type { ProjectPhase } from '@/types/workspace'

const orchestrationFiles = import.meta.glob('/projects/*/orchestration.json', {
  eager: true,
}) as Record<string, { default: OrchestrationState }>

const DEFAULT_GATES: OrchestrationGates = {
  analyse_complete: false,
  plan_approved: false,
  design_complete: false,
  build_complete: false,
}

export function loadOrchestrationState(projectId: string): OrchestrationState | null {
  const path = `/projects/${projectId}/orchestration.json`
  return orchestrationFiles[path]?.default || null
}

export function getOrchestrationGates(projectId: string): OrchestrationGates {
  return loadOrchestrationState(projectId)?.gates || DEFAULT_GATES
}

export function getActivePhase(projectId: string): ProjectPhase {
  return loadOrchestrationState(projectId)?.currentPhase || 'analyse'
}

export function hasPendingGate(projectId: string): boolean {
  const state = loadOrchestrationState(projectId)
  if (!state) return false
  return state.pendingHandoffs.some(h => h.status === 'awaiting_approval')
}
