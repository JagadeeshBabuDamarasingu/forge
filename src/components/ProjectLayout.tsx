import { Outlet, useParams, useNavigate } from 'react-router-dom'
import { Anvil, ArrowLeft } from 'lucide-react'
import { ProjectProvider } from '@/lib/project-context'
import { ProjectPhaseNav } from './ProjectPhaseNav'
import { ThemeToggle } from './ThemeToggle'
import { Button } from '@/components/ui/button'
import { getProject } from '@/lib/project-loader'

export function ProjectLayout() {
  const { projectId } = useParams<{ projectId: string }>()
  const navigate = useNavigate()

  if (!projectId) return null

  const project = getProject(projectId)

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <p className="text-stone-500 dark:text-stone-400">Project not found: {projectId}</p>
        <Button variant="ghost" onClick={() => navigate('/')}>
          <ArrowLeft className="w-4 h-4 mr-2" strokeWidth={1.5} />
          Back to dashboard
        </Button>
      </div>
    )
  }

  return (
    <ProjectProvider projectId={projectId}>
      <div className="min-h-screen bg-background animate-fade-in flex flex-col">
        {/* Header */}
        <header className="border-b border-stone-200 dark:border-stone-800 bg-card/80 backdrop-blur-sm sticky top-0 z-20">
          <div className="px-4 sm:px-6 py-3">
            <div className="flex items-center gap-4">
              {/* Back to dashboard */}
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 text-stone-400 dark:text-stone-500 hover:text-stone-700 dark:hover:text-stone-300 transition-colors group shrink-0"
              >
                <div className="w-6 h-6 rounded bg-stone-800 dark:bg-stone-200 flex items-center justify-center group-hover:bg-stone-700 dark:group-hover:bg-stone-300 transition-colors">
                  <Anvil className="w-3.5 h-3.5 text-stone-100 dark:text-stone-900" strokeWidth={1.5} />
                </div>
                <span className="text-xs font-medium hidden sm:inline">Forge</span>
              </button>

              <div className="h-4 w-px bg-stone-200 dark:bg-stone-700 shrink-0" />

              {/* Project name */}
              <span className="text-sm font-medium text-stone-700 dark:text-stone-300 truncate shrink-0 max-w-32">
                {project.name}
              </span>

              <div className="h-4 w-px bg-stone-200 dark:bg-stone-700 shrink-0" />

              {/* Phase nav — centered */}
              <div className="flex-1 flex justify-center min-w-0">
                <ProjectPhaseNav projectId={projectId} project={project} />
              </div>

              {/* Theme toggle */}
              <div className="shrink-0">
                <ThemeToggle />
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 max-w-3xl mx-auto px-6 py-12 w-full">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="py-8 flex justify-center">
          <div className="flex items-center gap-2 text-stone-400 dark:text-stone-500">
            <div className="w-5 h-5 rounded bg-stone-300 dark:bg-stone-600 flex items-center justify-center">
              <Anvil className="w-3 h-3 text-stone-100 dark:text-stone-900" strokeWidth={1.5} />
            </div>
            <span className="text-xs font-medium">Forge</span>
          </div>
        </footer>
      </div>
    </ProjectProvider>
  )
}
