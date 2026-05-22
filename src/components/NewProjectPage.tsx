import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Anvil, ArrowLeft, CheckCircle2, Loader2 } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'
import { Button } from '@/components/ui/button'
import type { ProjectMeta, ProjectPhase, ProjectType } from '@/types/workspace'

type CreateStatus = 'idle' | 'creating' | 'success' | 'error'

interface DaemonResponse {
  event?: string
  ok?: boolean
  error?: string
  projectId?: string
}

const typeOptions: Array<{ value: ProjectType; label: string; hint: string }> = [
  { value: 'quick', label: 'Quick', hint: 'Plan + Design' },
  { value: 'standard', label: 'Standard', hint: 'Analyse through Build' },
  { value: 'full', label: 'Full', hint: 'Analyse through Ship' },
]

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function getInitialPhase(type: ProjectType): ProjectPhase {
  return type === 'quick' ? 'plan' : 'analyse'
}

function createProjectViaDaemon(project: ProjectMeta): Promise<void> {
  return new Promise((resolve, reject) => {
    const socket = new WebSocket('ws://localhost:7357')
    const timeout = window.setTimeout(() => {
      socket.close()
      reject(new Error('Forge daemon did not respond. Start it with npm run forge:daemon.'))
    }, 8000)

    socket.onopen = () => {
      socket.send(JSON.stringify({ action: 'create_project', project }))
    }
    socket.onmessage = (event) => {
      const response = JSON.parse(event.data) as DaemonResponse
      if (response.event !== 'project_created' || response.projectId !== project.id) return

      window.clearTimeout(timeout)
      socket.close()
      if (response.ok) {
        resolve()
      } else {
        reject(new Error(response.error || 'Project could not be registered.'))
      }
    }
    socket.onerror = () => {
      window.clearTimeout(timeout)
      reject(new Error('Could not connect to the Forge daemon. Start it with npm run forge:daemon.'))
    }
  })
}

export function NewProjectPage() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState<ProjectType>('standard')
  const [status, setStatus] = useState<CreateStatus>('idle')
  const [message, setMessage] = useState<string | null>(null)

  const projectId = useMemo(() => slugify(name), [name])

  async function createProject() {
    if (!projectId) return

    setStatus('creating')
    setMessage(null)

    const now = new Date().toISOString()
    const project: ProjectMeta = {
      id: projectId,
      name: name.trim(),
      description: description.trim() || undefined,
      type,
      status: 'active',
      currentPhase: getInitialPhase(type),
      created: now,
      updated: now,
    }

    try {
      await createProjectViaDaemon(project)
      setStatus('success')
      setMessage('Project created.')
      window.setTimeout(() => navigate(`/${projectId}/${project.currentPhase}`), 500)
    } catch (error) {
      setStatus('error')
      setMessage(error instanceof Error ? error.message : 'Project could not be created.')
    }
  }

  const canCreate = projectId.length > 0 && status !== 'creating'

  return (
    <div className="min-h-screen bg-background animate-fade-in flex flex-col">
      <header className="border-b border-stone-200 dark:border-stone-800 bg-card/80 backdrop-blur-sm sticky top-0 z-20">
        <div className="px-4 sm:px-6 py-3 max-w-3xl mx-auto flex items-center justify-between gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="-ml-2">
            <ArrowLeft className="w-4 h-4 mr-2" strokeWidth={1.5} />
            Dashboard
          </Button>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto px-6 py-12 w-full">
        <div className="mb-10">
          <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100 mb-2">New project</h1>
          <p className="text-sm text-stone-500 dark:text-stone-400 max-w-2xl">
            Create a Forge project. The specs and generated code will live in the <code>projects/{projectId || 'project-name'}</code> folder.
          </p>
        </div>

        <div className="border border-stone-200 dark:border-stone-800 rounded-xl p-6 space-y-6 bg-card">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-stone-100 dark:bg-stone-800 flex items-center justify-center shrink-0">
              <Anvil className="w-5 h-5 text-stone-600 dark:text-stone-400" strokeWidth={1.5} />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm font-semibold text-stone-900 dark:text-stone-100">Project details</h2>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                Forge will register this in <code className="font-mono bg-stone-100 dark:bg-stone-800 px-1 rounded">projects/projects.json</code>.
              </p>
            </div>
          </div>

          <div className="grid gap-4">
            <label className="grid gap-1.5">
              <span className="text-xs font-medium text-stone-700 dark:text-stone-300">Project name</span>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Inventory Portal"
                className="h-10 rounded-lg border border-stone-200 dark:border-stone-800 bg-background px-3 text-sm text-stone-900 dark:text-stone-100 outline-none focus:border-lime-500"
              />
              {projectId && (
                <span className="text-xs text-stone-400 dark:text-stone-500">
                  ID: <code className="font-mono">{projectId}</code>
                </span>
              )}
            </label>

            <label className="grid gap-1.5">
              <span className="text-xs font-medium text-stone-700 dark:text-stone-300">Description</span>
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                rows={3}
                placeholder="What this project is meant to deliver."
                className="resize-none rounded-lg border border-stone-200 dark:border-stone-800 bg-background px-3 py-2 text-sm text-stone-900 dark:text-stone-100 outline-none focus:border-lime-500"
              />
            </label>

            <label className="grid gap-1.5">
              <span className="text-xs font-medium text-stone-700 dark:text-stone-300">Project type</span>
              <select
                value={type}
                onChange={(event) => setType(event.target.value as ProjectType)}
                className="h-10 rounded-lg border border-stone-200 dark:border-stone-800 bg-background px-3 text-sm text-stone-900 dark:text-stone-100 outline-none focus:border-lime-500"
              >
                {typeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}, {option.hint}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {message && (
            <div className={`rounded-lg border px-3 py-2 text-xs ${
              status === 'error'
                ? 'border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-900/60 dark:bg-orange-950/30 dark:text-orange-300'
                : 'border-lime-200 bg-lime-50 text-lime-700 dark:border-lime-900/60 dark:bg-lime-950/30 dark:text-lime-300'
            }`}>
              {message}
            </div>
          )}

          <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-3 pt-5 border-t border-stone-200 dark:border-stone-800">
            <Button variant="ghost" onClick={() => navigate('/')}>
              <ArrowLeft className="w-4 h-4 mr-2" strokeWidth={1.5} />
              Back
            </Button>
            <Button onClick={createProject} disabled={!canCreate}>
              {status === 'creating' ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" strokeWidth={1.5} />
              ) : status === 'success' ? (
                <CheckCircle2 className="w-4 h-4 mr-2" strokeWidth={1.5} />
              ) : (
                <Anvil className="w-4 h-4 mr-2" strokeWidth={1.5} />
              )}
              Create project
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
