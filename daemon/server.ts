import { WebSocketServer } from 'ws'
import * as fs from 'node:fs'
import * as path from 'node:path'
import { startWatcher } from './watcher'
import { approveHandoff } from './orchestrator'
import type { ProjectMeta, ProjectsRegistry } from '../src/types/workspace'

const PORT = parseInt(process.env.FORGE_DAEMON_PORT || '7357', 10)
const PROJECTS_DIR = path.join(process.cwd(), 'projects')
const REGISTRY_PATH = path.join(PROJECTS_DIR, 'projects.json')

type ClientMessage =
  | { action?: 'approve_handoff'; projectId?: string; from?: string; to?: string }
  | { action?: 'create_project'; project?: ProjectMeta }

function isSafeProjectId(projectId: string): boolean {
  return /^[a-z0-9][a-z0-9-]*$/.test(projectId)
}

function readRegistry(): ProjectsRegistry {
  try {
    return JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf8')) as ProjectsRegistry
  } catch {
    return { projects: [] }
  }
}

function writeJson(filePath: string, data: unknown): void {
  fs.mkdirSync(path.dirname(filePath), { recursive: true })
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`)
}

function scaffoldProjectDirectory(projectDir: string, project: ProjectMeta): void {
  fs.mkdirSync(projectDir, { recursive: true })
  for (const dir of [
    ['analyse', 'research'],
    ['plan'],
    ['product', 'data-shape'],
    ['product', 'design-system'],
    ['product', 'shell'],
    ['product', 'sections'],
    ['build', 'epics'],
    ['ship'],
    ['handoffs'],
    ['src', 'sections'],
    ['src', 'shell'],
  ]) {
    fs.mkdirSync(path.join(projectDir, ...dir), { recursive: true })
  }
  writeJson(path.join(projectDir, 'project.json'), {
    name: project.name,
    description: project.description,
    type: project.type,
    status: project.status,
    currentPhase: project.currentPhase,
    created: project.created,
    updated: project.updated,
  })
  writeJson(path.join(projectDir, 'forge.config.json'), {
    project: {
      name: project.name,
      type: project.type,
      description: project.description,
    },
  })
  writeJson(path.join(projectDir, 'memory.json'), {
    decisions: [],
    entities: [],
    vocab: [],
  })
  writeJson(path.join(projectDir, 'orchestration.json'), {
    projectId: project.id,
    currentPhase: project.currentPhase,
    activeAgents: [],
    gates: {
      analyse_complete: false,
      plan_approved: false,
      design_complete: false,
      build_complete: false,
    },
    pendingHandoffs: [],
    agentHistory: [],
    activeRoundtable: null,
  })
  fs.writeFileSync(
    path.join(projectDir, 'project-context.md'),
    `# ${project.name}\n\nPersistent AI constitution for this Forge project.\n`
  )
}

function createProject(project: ProjectMeta): { ok: true } | { ok: false; error: string } {
  if (!isSafeProjectId(project.id)) {
    return { ok: false, error: 'Project id must use lowercase letters, numbers, and hyphens.' }
  }

  const now = new Date().toISOString()
  const normalized: ProjectMeta = {
    ...project,
    status: project.status || 'active',
    currentPhase: project.currentPhase || 'analyse',
    created: project.created || now,
    updated: now,
  }

  const registry = readRegistry()
  if (registry.projects.some((item) => item.id === normalized.id)) {
    return { ok: false, error: 'A project with that id already exists.' }
  }

  const projectDir = path.join(PROJECTS_DIR, normalized.id)
  if (fs.existsSync(path.join(projectDir, 'project.json'))) {
    return { ok: false, error: 'A project folder with that id already exists.' }
  }

  registry.projects.push(normalized)
  writeJson(REGISTRY_PATH, registry)

  scaffoldProjectDirectory(projectDir, normalized)

  return { ok: true }
}

const wss = new WebSocketServer({ port: PORT })

wss.on('connection', (ws) => {
  console.log('[server] client connected')

  ws.on('message', (raw) => {
    try {
      const msg = JSON.parse(raw.toString()) as ClientMessage

      if (msg.action === 'approve_handoff' && msg.projectId && msg.from && msg.to) {
        const ok = approveHandoff(msg.projectId, msg.from, msg.to)
        ws.send(JSON.stringify({ event: 'handoff_approved', ok, projectId: msg.projectId }))
      }

      if (msg.action === 'create_project' && msg.project) {
        const result = createProject(msg.project)
        ws.send(JSON.stringify({ event: 'project_created', projectId: msg.project.id, ...result }))
      }
    } catch {
      ws.send(JSON.stringify({ event: 'error', ok: false, error: 'Malformed daemon message.' }))
    }
  })

  ws.on('close', () => {
    console.log('[server] client disconnected')
  })
})

startWatcher(wss)

console.log(`[forge-daemon] running on ws://localhost:${PORT}`)
