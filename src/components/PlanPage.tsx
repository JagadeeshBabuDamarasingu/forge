import { ClipboardList, FileText, Server, Layout, CheckCircle2, Circle } from 'lucide-react'
import { useProject } from '@/lib/project-context'
import {
  hasPrd,
  getPrd,
  hasArchitecture,
  getArchitecture,
  hasUxSpec,
  getUxSpec,
} from '@/lib/project-loader'

interface ArtifactCardProps {
  icon: typeof FileText
  title: string
  description: string
  command: string
  exists: boolean
  content?: string | null
}

function ArtifactCard({ icon: Icon, title, description, command, exists, content }: ArtifactCardProps) {
  return (
    <div className={`border rounded-xl p-5 transition-colors ${
      exists
        ? 'border-stone-200 dark:border-stone-800 bg-card'
        : 'border-dashed border-stone-300 dark:border-stone-700'
    }`}>
      <div className="flex items-start gap-4">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
          exists ? 'bg-stone-100 dark:bg-stone-800' : 'bg-stone-50 dark:bg-stone-900'
        }`}>
          <Icon className={`w-4.5 h-4.5 ${exists ? 'text-stone-700 dark:text-stone-300' : 'text-stone-400 dark:text-stone-500'}`} strokeWidth={1.5} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-sm font-semibold text-stone-900 dark:text-stone-100">{title}</h3>
            {exists
              ? <CheckCircle2 className="w-4 h-4 text-lime-500 shrink-0" strokeWidth={2} />
              : <Circle className="w-4 h-4 text-stone-300 dark:text-stone-600 shrink-0" strokeWidth={1.5} />
            }
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400 mb-3">{description}</p>
          {exists && content ? (
            <div className="bg-stone-50 dark:bg-stone-900/50 rounded-lg px-4 py-3 max-h-32 overflow-hidden relative">
              <p className="text-xs text-stone-600 dark:text-stone-400 font-mono leading-relaxed whitespace-pre-wrap line-clamp-5">
                {content.replace(/^#+\s+.+\n/m, '').trim()}
              </p>
              <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-stone-50 dark:from-stone-900/50 to-transparent rounded-b-lg" />
            </div>
          ) : (
            <code className="text-xs font-mono text-stone-500 dark:text-stone-400 bg-stone-100 dark:bg-stone-800 px-2 py-1 rounded">
              {command}
            </code>
          )}
        </div>
      </div>
    </div>
  )
}

export function PlanPage() {
  const { projectId } = useProject()

  const prdExists = hasPrd(projectId)
  const archExists = hasArchitecture(projectId)
  const uxExists = hasUxSpec(projectId)

  const completedCount = [prdExists, archExists, uxExists].filter(Boolean).length

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <ClipboardList className="w-4 h-4 text-blue-600 dark:text-blue-400" strokeWidth={1.5} />
          </div>
          <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">Plan</h1>
        </div>
        <p className="text-sm text-stone-500 dark:text-stone-400">
          Define what to build and how to build it. A weak PRD makes wrong technical bets. Solve this before design begins.
        </p>
        {completedCount > 0 && (
          <p className="text-xs text-stone-400 dark:text-stone-500 mt-2">
            {completedCount} of 3 artifacts complete
          </p>
        )}
      </div>

      <div className="space-y-3">
        <ArtifactCard
          icon={FileText}
          title="Product Requirements"
          description="Functional and non-functional requirements. Features, scope, user stories, what's explicitly out."
          command="/create-prd"
          exists={prdExists}
          content={getPrd(projectId)}
        />
        <ArtifactCard
          icon={Server}
          title="Architecture"
          description="Tech stack decisions and Architecture Decision Records. Explicit technical bets that development agents will follow."
          command="/create-architecture"
          exists={archExists}
          content={getArchitecture(projectId)}
        />
        <ArtifactCard
          icon={Layout}
          title="UX Specification"
          description="User flows, wireframe notes, interaction patterns. Optional — Design phase produces screen designs anyway."
          command="/create-ux-spec"
          exists={uxExists}
          content={getUxSpec(projectId)}
        />
      </div>

      {completedCount === 0 && (
        <div className="bg-stone-50 dark:bg-stone-900/50 rounded-xl p-5 border border-stone-200 dark:border-stone-800">
          <h4 className="text-xs font-semibold text-stone-700 dark:text-stone-300 mb-2">Getting started</h4>
          <p className="text-xs text-stone-500 dark:text-stone-400 mb-3">
            Create a full product requirements document:
          </p>
          <code className="block text-xs font-mono bg-stone-100 dark:bg-stone-800 rounded-lg px-4 py-3 text-stone-800 dark:text-stone-200 select-all">
            /create-prd
          </code>
        </div>
      )}
    </div>
  )
}
