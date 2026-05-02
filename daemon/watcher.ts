import chokidar from 'chokidar'
import * as path from 'node:path'
import { processHandoff } from './orchestrator'
import type { WebSocketServer } from 'ws'

const PROJECTS_DIR = path.join(process.cwd(), 'projects')

export function startWatcher(wss: WebSocketServer): void {
  const watcher = chokidar.watch(PROJECTS_DIR, {
    ignored: /(^|[/\\])\../, // ignore dotfiles
    persistent: true,
    ignoreInitial: true,
    depth: 6,
  })

  function broadcast(event: string, data: unknown) {
    const message = JSON.stringify({ event, data, ts: Date.now() })
    wss.clients.forEach(client => {
      if (client.readyState === 1) {
        client.send(message)
      }
    })
  }

  watcher.on('add', (filePath) => {
    const rel = path.relative(PROJECTS_DIR, filePath)
    const parts = rel.split(path.sep)
    const projectId = parts[0]

    // Detect new handoff files: projects/[id]/handoffs/[a]-to-[b].json
    if (parts[1] === 'handoffs' && filePath.endsWith('.json')) {
      const handled = processHandoff(projectId, filePath)
      if (handled) {
        broadcast('handoff_detected', { projectId, file: rel })
        broadcast('orchestration_updated', { projectId })
      }
    }

    // Broadcast any project file change for browser refresh
    broadcast('file_added', { projectId, file: rel })
  })

  watcher.on('change', (filePath) => {
    const rel = path.relative(PROJECTS_DIR, filePath)
    const projectId = rel.split(path.sep)[0]
    broadcast('file_changed', { projectId, file: rel })

    // Broadcast orchestration updates
    if (filePath.endsWith('orchestration.json')) {
      broadcast('orchestration_updated', { projectId })
    }
  })

  watcher.on('error', (err) => {
    console.error('[watcher] error:', err)
  })

  console.log(`[watcher] watching ${PROJECTS_DIR}`)
}
