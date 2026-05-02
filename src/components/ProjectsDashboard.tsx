import { useNavigate } from 'react-router-dom'
import { Anvil, Plus, Clock, Layers } from 'lucide-react'
import { listProjects } from '@/lib/project-loader'
import { ThemeToggle } from './ThemeToggle'
import { Button } from '@/components/ui/button'
import type { ProjectMeta, ProjectPhase } from '@/types/workspace'

const phaseLabels: Record<ProjectPhase, string> = {
  analyse: 'Analyse',
  plan: 'Plan',
  design: 'Design',
  build: 'Build',
  ship: 'Ship',
}

const phaseColors: Record<ProjectPhase, string> = {
  analyse: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  plan: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  design: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
  build: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  ship: 'bg-lime-100 text-lime-700 dark:bg-lime-900/30 dark:text-lime-400',
}

const typeLabels = { quick: 'Quick', standard: 'Standard', full: 'Full' }

function formatRelativeDate(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return new Date(iso).toLocaleDateString()
}

function ProjectCard({ project }: { project: ProjectMeta }) {
  const navigate = useNavigate()

  return (
    <button
      onClick={() => navigate(`/${project.id}/${project.currentPhase}`)}
      className="group text-left border border-stone-200 dark:border-stone-800 rounded-xl p-5 bg-card hover:border-stone-400 dark:hover:border-stone-600 hover:shadow-sm transition-all duration-200"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="text-sm font-semibold text-stone-900 dark:text-stone-100 group-hover:text-stone-700 dark:group-hover:text-stone-200 transition-colors leading-tight">
          {project.name}
        </h3>
        <span className={`shrink-0 text-xs font-medium px-2 py-0.5 rounded-full ${phaseColors[project.currentPhase]}`}>
          {phaseLabels[project.currentPhase]}
        </span>
      </div>

      {project.description && (
        <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-2 mb-3">
          {project.description}
        </p>
      )}

      <div className="flex items-center justify-between">
        <span className="text-xs text-stone-400 dark:text-stone-500 font-medium">
          {typeLabels[project.type]}
        </span>
        <div className="flex items-center gap-1 text-stone-400 dark:text-stone-500">
          <Clock className="w-3 h-3" strokeWidth={1.5} />
          <span className="text-xs">{formatRelativeDate(project.updated)}</span>
        </div>
      </div>
    </button>
  )
}

function EmptyDashboard() {
  const navigate = useNavigate()
  return (
    <div className="border border-dashed border-stone-300 dark:border-stone-700 rounded-xl p-12 flex flex-col items-center gap-4 text-center">
      <div className="w-12 h-12 rounded-xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center">
        <Layers className="w-6 h-6 text-stone-400 dark:text-stone-500" strokeWidth={1.5} />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-stone-700 dark:text-stone-300 mb-1">No projects yet</h3>
        <p className="text-xs text-stone-500 dark:text-stone-400 max-w-xs">
          Run <code className="font-mono bg-stone-100 dark:bg-stone-800 px-1 rounded">/new-project</code> in Claude Code, or click the button above to get started.
        </p>
      </div>
      <Button size="sm" onClick={() => navigate('/projects/new')}>
        <Plus className="w-4 h-4 mr-1.5" strokeWidth={2} />
        New project
      </Button>
    </div>
  )
}

export function ProjectsDashboard() {
  const navigate = useNavigate()
  const projects = listProjects()

  return (
    <div className="min-h-screen bg-background animate-fade-in flex flex-col">
      {/* Header */}
      <header className="border-b border-stone-200 dark:border-stone-800 bg-card/80 backdrop-blur-sm sticky top-0 z-20">
        <div className="px-4 sm:px-6 py-3 max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-stone-800 dark:bg-stone-200 flex items-center justify-center">
              <Anvil className="w-4 h-4 text-stone-100 dark:text-stone-900" strokeWidth={1.5} />
            </div>
            <span className="text-sm font-semibold text-stone-900 dark:text-stone-100 tracking-tight">Forge</span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button size="sm" onClick={() => navigate('/projects/new')}>
              <Plus className="w-4 h-4 mr-1.5" strokeWidth={2} />
              New project
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-10 w-full">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100 mb-1">Projects</h1>
          <p className="text-sm text-stone-500 dark:text-stone-400">
            From idea to launch — manage every project in one place.
          </p>
        </div>

        {projects.length === 0 ? (
          <EmptyDashboard />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
            {/* New project card */}
            <button
              onClick={() => navigate('/projects/new')}
              className="border border-dashed border-stone-300 dark:border-stone-700 rounded-xl p-5 flex flex-col items-center justify-center gap-2 text-stone-400 dark:text-stone-500 hover:border-stone-400 dark:hover:border-stone-500 hover:text-stone-600 dark:hover:text-stone-400 transition-all duration-200 min-h-[120px]"
            >
              <Plus className="w-5 h-5" strokeWidth={1.5} />
              <span className="text-xs font-medium">New project</span>
            </button>
          </div>
        )}
      </main>

      <footer className="py-8 flex justify-center">
        <div className="flex items-center gap-2 text-stone-400 dark:text-stone-500">
          <div className="w-5 h-5 rounded bg-stone-300 dark:bg-stone-600 flex items-center justify-center">
            <Anvil className="w-3 h-3 text-stone-100 dark:text-stone-900" strokeWidth={1.5} />
          </div>
          <span className="text-xs font-medium">Forge</span>
        </div>
      </footer>
    </div>
  )
}
