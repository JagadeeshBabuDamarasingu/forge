import { Rocket, CheckSquare, Server, ExternalLink } from 'lucide-react'
import { useProject } from '@/lib/project-context'
import { hasLaunchChecklist, getLaunchChecklist, getDeployments } from '@/lib/project-loader'
import type { Deployment } from '@/types/workspace'

function ChecklistRenderer({ markdown }: { markdown: string }) {
  const lines = markdown
    .split('\n')
    .filter(line => line.trim().startsWith('- ['))

  if (lines.length === 0) {
    return (
      <pre className="text-xs font-mono text-stone-600 dark:text-stone-400 whitespace-pre-wrap leading-relaxed">
        {markdown}
      </pre>
    )
  }

  return (
    <ul className="space-y-2">
      {lines.map((line, i) => {
        const isDone = line.includes('[x]') || line.includes('[X]')
        const text = line.replace(/^-\s+\[[ xX]\]\s*/, '').trim()
        return (
          <li key={i} className="flex items-start gap-2.5">
            <div className={`w-4 h-4 rounded shrink-0 mt-0.5 flex items-center justify-center ${
              isDone
                ? 'bg-lime-500'
                : 'border border-stone-300 dark:border-stone-600'
            }`}>
              {isDone && (
                <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <span className={`text-sm leading-tight ${
              isDone
                ? 'line-through text-stone-400 dark:text-stone-500'
                : 'text-stone-700 dark:text-stone-300'
            }`}>
              {text}
            </span>
          </li>
        )
      })}
    </ul>
  )
}

function DeploymentRow({ deployment }: { deployment: Deployment }) {
  const envColors = {
    development: 'bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400',
    staging: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    production: 'bg-lime-100 text-lime-700 dark:bg-lime-900/30 dark:text-lime-400',
  }

  return (
    <div className="flex items-center justify-between gap-3 border border-stone-200 dark:border-stone-800 rounded-lg px-4 py-3 bg-card">
      <div className="flex items-center gap-3">
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${envColors[deployment.env]}`}>
          {deployment.env}
        </span>
        {deployment.version && (
          <span className="text-xs font-mono text-stone-400 dark:text-stone-500">{deployment.version}</span>
        )}
        {deployment.notes && (
          <span className="text-xs text-stone-500 dark:text-stone-400">{deployment.notes}</span>
        )}
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-stone-400 dark:text-stone-500">
          {new Date(deployment.date).toLocaleDateString()}
        </span>
        {deployment.url && (
          <a
            href={deployment.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" strokeWidth={1.5} />
          </a>
        )}
      </div>
    </div>
  )
}

export function ShipPage() {
  const { projectId } = useProject()

  const hasChecklist = hasLaunchChecklist(projectId)
  const checklist = getLaunchChecklist(projectId)
  const deployments = getDeployments(projectId) as Deployment[]

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-lg bg-lime-100 dark:bg-lime-900/30 flex items-center justify-center">
            <Rocket className="w-4 h-4 text-lime-600 dark:text-lime-400" strokeWidth={1.5} />
          </div>
          <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">Ship</h1>
        </div>
        <p className="text-sm text-stone-500 dark:text-stone-400">
          Launch checklist, deployment history, and go-live tracking.
        </p>
      </div>

      {/* Launch checklist */}
      <div className="border border-stone-200 dark:border-stone-800 rounded-xl p-5 bg-card">
        <div className="flex items-center gap-2 mb-4">
          <CheckSquare className="w-4 h-4 text-stone-600 dark:text-stone-400" strokeWidth={1.5} />
          <h3 className="text-sm font-semibold text-stone-900 dark:text-stone-100">Launch checklist</h3>
        </div>

        {hasChecklist && checklist ? (
          <ChecklistRenderer markdown={checklist} />
        ) : (
          <div className="space-y-3">
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Generate a launch checklist from your sections and epics:
            </p>
            <code className="block text-xs font-mono bg-stone-100 dark:bg-stone-800 rounded-lg px-4 py-3 text-stone-800 dark:text-stone-200 select-all">
              /launch-checklist
            </code>
          </div>
        )}
      </div>

      {/* Deployment log */}
      <div className="border border-stone-200 dark:border-stone-800 rounded-xl p-5 bg-card">
        <div className="flex items-center gap-2 mb-4">
          <Server className="w-4 h-4 text-stone-600 dark:text-stone-400" strokeWidth={1.5} />
          <h3 className="text-sm font-semibold text-stone-900 dark:text-stone-100">Deployment log</h3>
        </div>

        {deployments.length > 0 ? (
          <div className="space-y-2">
            {deployments.map((d, i) => (
              <DeploymentRow key={i} deployment={d} />
            ))}
          </div>
        ) : (
          <p className="text-xs text-stone-500 dark:text-stone-400">
            No deployments logged yet. Add entries to{' '}
            <code className="font-mono bg-stone-100 dark:bg-stone-800 px-1 rounded">
              projects/{projectId}/ship/deployments.json
            </code>
          </p>
        )}
      </div>
    </div>
  )
}
