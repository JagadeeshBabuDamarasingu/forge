import { useNavigate } from 'react-router-dom'
import { Hammer, ChevronRight } from 'lucide-react'
import { useProject } from '@/lib/project-context'
import { getSprintStatus, getEpicIds, getEpicMeta } from '@/lib/project-loader'
import type { EpicStatus, StoryStatus, SprintStatus } from '@/types/workspace'

const epicStatusColors: Record<EpicStatus, string> = {
  backlog: 'bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400',
  'in-progress': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  done: 'bg-lime-100 text-lime-700 dark:bg-lime-900/30 dark:text-lime-400',
}

const storyStatusColors: Record<StoryStatus, string> = {
  backlog: 'bg-stone-100 text-stone-500 dark:bg-stone-800 dark:text-stone-500',
  ready: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  'in-progress': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  review: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
  done: 'bg-lime-100 text-lime-700 dark:bg-lime-900/30 dark:text-lime-400',
}

function getEpicStatus(epicId: string, sprint: SprintStatus): EpicStatus {
  return (sprint.status[epicId] as EpicStatus) || 'backlog'
}

function getEpicStories(epicId: string, sprint: SprintStatus): Array<{ id: string; status: StoryStatus }> {
  return Object.entries(sprint.status)
    .filter(([key]) => key.startsWith(`${epicId}-story-`))
    .map(([key, status]) => ({ id: key, status: status as StoryStatus }))
}

function EpicCard({
  epicId,
  title,
  status,
  stories,
  onClick,
}: {
  epicId: string
  title: string
  status: EpicStatus
  stories: Array<{ id: string; status: StoryStatus }>
  onClick: () => void
}) {
  const doneCount = stories.filter(s => s.status === 'done').length
  const progress = stories.length > 0 ? Math.round((doneCount / stories.length) * 100) : 0

  return (
    <button
      onClick={onClick}
      className="group w-full text-left border border-stone-200 dark:border-stone-800 rounded-xl p-5 bg-card hover:border-stone-400 dark:hover:border-stone-600 hover:shadow-sm transition-all duration-200"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-stone-900 dark:text-stone-100 truncate group-hover:text-stone-700 dark:group-hover:text-stone-200">
            {title}
          </h3>
          <p className="text-xs text-stone-400 dark:text-stone-500 font-mono">{epicId}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${epicStatusColors[status]}`}>
            {status}
          </span>
          <ChevronRight className="w-4 h-4 text-stone-400 shrink-0 group-hover:text-stone-600 dark:group-hover:text-stone-400 transition-colors" strokeWidth={1.5} />
        </div>
      </div>

      {stories.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-400 dark:text-stone-500">
            <span>{doneCount}/{stories.length} stories done</span>
            <span>{progress}%</span>
          </div>
          <div className="h-1.5 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-lime-500 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {stories.slice(0, 6).map(story => (
              <span key={story.id} className={`text-xs px-1.5 py-0.5 rounded font-medium ${storyStatusColors[story.status]}`}>
                {story.id.replace(`${epicId}-story-`, 'S')}
              </span>
            ))}
            {stories.length > 6 && (
              <span className="text-xs text-stone-400 dark:text-stone-500">+{stories.length - 6} more</span>
            )}
          </div>
        </div>
      )}
    </button>
  )
}

export function BuildPage() {
  const { projectId } = useProject()
  const navigate = useNavigate()

  const sprint = getSprintStatus(projectId)
  const epicIds = getEpicIds(projectId)

  if (!sprint || epicIds.length === 0) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
              <Hammer className="w-4 h-4 text-orange-600 dark:text-orange-400" strokeWidth={1.5} />
            </div>
            <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">Build</h1>
          </div>
          <p className="text-sm text-stone-500 dark:text-stone-400">
            Track implementation progress with epics and stories generated from your product roadmap.
          </p>
        </div>

        <div className="bg-stone-50 dark:bg-stone-900/50 rounded-xl p-5 border border-stone-200 dark:border-stone-800">
          <h4 className="text-xs font-semibold text-stone-700 dark:text-stone-300 mb-2">Getting started</h4>
          <p className="text-xs text-stone-500 dark:text-stone-400 mb-3">
            Generate epics and stories from your product roadmap:
          </p>
          <code className="block text-xs font-mono bg-stone-100 dark:bg-stone-800 rounded-lg px-4 py-3 text-stone-800 dark:text-stone-200 select-all">
            /create-epics
          </code>
        </div>
      </div>
    )
  }

  const totalStories = epicIds.reduce((sum, id) => sum + getEpicStories(id, sprint).length, 0)
  const doneStories = epicIds.reduce((sum, id) => sum + getEpicStories(id, sprint).filter(s => s.status === 'done').length, 0)

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
            <Hammer className="w-4 h-4 text-orange-600 dark:text-orange-400" strokeWidth={1.5} />
          </div>
          <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">Build</h1>
        </div>
        <div className="flex items-center gap-4 text-xs text-stone-500 dark:text-stone-400">
          <span>{epicIds.length} epics</span>
          <span>·</span>
          <span>{doneStories}/{totalStories} stories done</span>
        </div>
      </div>

      <div className="space-y-3">
        {epicIds.map(epicId => {
          const meta = getEpicMeta(projectId, epicId)
          const status = getEpicStatus(epicId, sprint)
          const stories = getEpicStories(epicId, sprint)
          return (
            <EpicCard
              key={epicId}
              epicId={epicId}
              title={meta?.title || epicId}
              status={status}
              stories={stories}
              onClick={() => navigate(`/${projectId}/build/${epicId}`)}
            />
          )
        })}
      </div>

      <div className="bg-stone-50 dark:bg-stone-900/50 rounded-xl p-5 border border-stone-200 dark:border-stone-800 space-y-3">
        <h4 className="text-xs font-semibold text-stone-700 dark:text-stone-300">Build commands</h4>
        <div className="space-y-2">
          {[
            { cmd: '/dev-story', label: 'Flesh out a story with implementation detail' },
            { cmd: '/sprint-status', label: 'Update story and epic statuses interactively' },
            { cmd: '/roundtable', label: 'Get multi-perspective analysis on a decision' },
          ].map(({ cmd, label }) => (
            <div key={cmd} className="flex items-center gap-3">
              <code className="text-xs font-mono bg-stone-100 dark:bg-stone-800 px-2 py-1 rounded text-stone-800 dark:text-stone-200 shrink-0 select-all">
                {cmd}
              </code>
              <span className="text-xs text-stone-400 dark:text-stone-500">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
