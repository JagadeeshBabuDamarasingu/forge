import * as fs from 'node:fs'
import * as path from 'node:path'
import type { OrchestrationState, PendingHandoff } from '../src/types/workspace'

const PROJECTS_DIR = path.join(process.cwd(), 'projects')

function readJson<T>(filePath: string): T | null {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as T
  } catch {
    return null
  }
}

function writeJson(filePath: string, data: unknown): void {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8')
}

export function loadOrchestrationState(projectId: string): OrchestrationState | null {
  return readJson<OrchestrationState>(
    path.join(PROJECTS_DIR, projectId, 'orchestration.json')
  )
}

export function saveOrchestrationState(projectId: string, state: OrchestrationState): void {
  writeJson(path.join(PROJECTS_DIR, projectId, 'orchestration.json'), state)
}

export function processHandoff(projectId: string, handoffPath: string): boolean {
  const handoff = readJson<PendingHandoff>(handoffPath)
  if (!handoff) return false

  const state = loadOrchestrationState(projectId)
  if (!state) return false

  // Find and update the matching pending handoff
  const existing = state.pending_handoffs.find(
    h => h.from === handoff.from && h.to === handoff.to
  )

  const configPath = path.join(PROJECTS_DIR, projectId, 'forge.config.json')
  const config = readJson<{ orchestration?: { autonomy?: string; auto_chain?: Record<string, boolean> } }>(configPath)
  const autoChainKey = `${handoff.from}_to_${handoff.to}`
  const isAutoChain = config?.orchestration?.auto_chain?.[autoChainKey] === true

  const newHandoff: PendingHandoff = {
    from: handoff.from,
    to: handoff.to,
    artifacts: handoff.artifacts || [],
    status: isAutoChain ? 'auto_pending' : 'awaiting_approval',
  }

  if (existing) {
    Object.assign(existing, newHandoff)
  } else {
    state.pending_handoffs.push(newHandoff)
  }

  saveOrchestrationState(projectId, state)
  return true
}

export function approveHandoff(projectId: string, from: string, to: string): boolean {
  const state = loadOrchestrationState(projectId)
  if (!state) return false

  const handoff = state.pending_handoffs.find(h => h.from === from && h.to === to)
  if (!handoff) return false

  handoff.status = 'in_progress'
  saveOrchestrationState(projectId, state)
  return true
}
