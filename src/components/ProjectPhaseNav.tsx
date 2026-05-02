import { useNavigate, useLocation } from 'react-router-dom'
import {
  Microscope,
  ClipboardList,
  Paintbrush,
  Hammer,
  Rocket,
} from 'lucide-react'
import type { ProjectPhase } from '@/types/workspace'
import type { ProjectMeta } from '@/types/workspace'

interface PhaseConfig {
  id: ProjectPhase
  label: string
  icon: typeof Microscope
  path: string
}

const phases: PhaseConfig[] = [
  { id: 'analyse', label: 'Analyse', icon: Microscope, path: 'analyse' },
  { id: 'plan', label: 'Plan', icon: ClipboardList, path: 'plan' },
  { id: 'design', label: 'Design', icon: Paintbrush, path: 'design' },
  { id: 'build', label: 'Build', icon: Hammer, path: 'build' },
  { id: 'ship', label: 'Ship', icon: Rocket, path: 'ship' },
]

function getPhaseFromPath(pathname: string, projectId: string): ProjectPhase {
  const base = `/${projectId}/`
  if (!pathname.startsWith(base)) return 'analyse'
  const sub = pathname.slice(base.length).split('/')[0]
  if (sub === 'analyse') return 'analyse'
  if (sub === 'plan') return 'plan'
  if (sub === 'design') return 'design'
  if (sub === 'build') return 'build'
  if (sub === 'ship') return 'ship'
  return 'analyse'
}

function phaseIndex(phase: ProjectPhase): number {
  return phases.findIndex(p => p.id === phase)
}

interface ProjectPhaseNavProps {
  projectId: string
  project: ProjectMeta
}

export function ProjectPhaseNav({ projectId, project }: ProjectPhaseNavProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const currentPhase = getPhaseFromPath(location.pathname, projectId)
  const currentIndex = phaseIndex(currentPhase)
  const activeIndex = phaseIndex(project.currentPhase)

  return (
    <nav className="flex items-center justify-center">
      {phases.map(({ id, label, icon: Icon, path }, index) => {
        const isCurrent = id === currentPhase
        const isComplete = index < activeIndex
        const isFirst = index === 0

        // Hide phases beyond the project type's scope
        if (project.type === 'quick' && (id === 'analyse' || id === 'build' || id === 'ship')) {
          return null
        }
        if (project.type === 'standard' && id === 'ship') {
          return null
        }

        return (
          <div key={id} className="flex items-center">
            {!isFirst && (
              <div
                className={`w-4 sm:w-8 lg:w-12 h-px transition-colors duration-200 ${
                  index <= currentIndex
                    ? 'bg-stone-400 dark:bg-stone-500'
                    : 'bg-stone-200 dark:bg-stone-700'
                }`}
              />
            )}
            <button
              onClick={() => navigate(`/${projectId}/${path}`)}
              className={`
                group relative flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2
                rounded-lg transition-all duration-200 whitespace-nowrap
                ${isCurrent
                  ? 'bg-stone-900 dark:bg-stone-100 text-stone-100 dark:text-stone-900 shadow-sm'
                  : isComplete
                    ? 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
                    : 'text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800/50'
                }
              `}
            >
              <Icon
                className={`w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                  !isCurrent && !isComplete ? 'opacity-60' : ''
                }`}
                strokeWidth={1.5}
              />
              <span className={`text-sm font-medium hidden sm:inline ${!isCurrent && !isComplete ? 'opacity-60' : ''}`}>
                {label}
              </span>
              {isComplete && (
                <span className="absolute -top-1 -left-1 w-4 h-4 rounded-full bg-lime-500 flex items-center justify-center shadow-sm">
                  <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
              )}
            </button>
          </div>
        )
      })}
    </nav>
  )
}
