import { WebSocketServer } from 'ws'
import { startWatcher } from './watcher'
import { approveHandoff } from './orchestrator'

const PORT = parseInt(process.env.FORGE_DAEMON_PORT || '7357', 10)

const wss = new WebSocketServer({ port: PORT })

wss.on('connection', (ws) => {
  console.log('[server] client connected')

  ws.on('message', (raw) => {
    try {
      const msg = JSON.parse(raw.toString()) as { action?: string; projectId?: string; from?: string; to?: string }

      if (msg.action === 'approve_handoff' && msg.projectId && msg.from && msg.to) {
        const ok = approveHandoff(msg.projectId, msg.from, msg.to)
        ws.send(JSON.stringify({ event: 'handoff_approved', ok, projectId: msg.projectId }))
      }
    } catch {
      // ignore malformed messages
    }
  })

  ws.on('close', () => {
    console.log('[server] client disconnected')
  })
})

startWatcher(wss)

console.log(`[forge-daemon] running on ws://localhost:${PORT}`)
