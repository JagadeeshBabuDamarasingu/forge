import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Hammer } from 'lucide-react'
import { useProject } from '@/lib/project-context'
import { getSprintStatus, getEpicMeta } from '@/lib/project-loader'
import { Button } from '@/components/ui/button'
import type { StoryStatus, SprintStatus } from '@/types/workspace'

const storyStatusColors: Record<StoryStatus, string> = {
  backlog: 'bg-stone-100 text-stone-500 dark:bg-stone-800 dark:text-stone-500',
  ready: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  'in-progress': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  review: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
  done: 'bg-lime-100 text-lime-700 dark:bg-lime-900/30 dark:text-lime-400',
}

const statusOrder: StoryStatus[] = ['in-progress', 'review', 'ready', 'backlog', 'done']

function getEpicStories(epicId: string, sprint: SprintStatus): Array<{ id: string; status: StoryStatus; label: string }> {
  return Object.entries(sprint.status)
    .filter(([key]) => key.startsWith(`${epicId}-story-`))
    .map(([key, status]) => ({
      id: key,
      status: status as StoryStatus,
      label: key.replace(`${epicId}-story-`, 'Story '),
    }))
    .sort((a, b) => statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status))
}

export function EpicPage() {
  const { projectId } = useProject()
  const { epicId } = useParams<{ epicId: string }>()
  const navigate = useNavigate()

  if (!epicId) return null

  const sprint = getSprintStatus(projectId)
  const meta = getEpicMeta(projectId, epicId)

  if (!sprint) {
    return (
      <div className="space-y-6 animate-fade-in">
        <Button variant="ghost" size="sm" onClick={() => navigate(`/${projectId}/build`)} className="-ml-2">
          <ArrowLeft className="w-4 h-4 mr-2" strokeWidth={1.5} />
          Build
        </Button>
        <p className="text-sm text-stone-500">No sprint data found.</p>
      </div>
    )
  }

  const stories = getEpicStories(epicId, sprint)
  const doneCount = stories.filter(s => s.status === 'done').length
  const progress = stories.length > 0 ? Math.round((doneCount / stories.length) * 100) : 0

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <Button variant="ghost" size="sm" onClick={() => navigate(`/${projectId}/build`)} className="-ml-2 mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" strokeWidth={1.5} />
          Build
        </Button>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
            <Hammer className="w-4 h-4 text-orange-600 dark:text-orange-400" strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">
              {meta?.title || epicId}
            </h1>
            <p className="text-xs font-mono text-stone-400 dark:text-stone-500">{epicId}</p>
          </div>
        </div>
        {meta?.goal && (
          <p className="text-sm text-stone-500 dark:text-stone-400">{meta.goal}</p>
        )}
      </div>

      {stories.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-400 dark:text-stone-500">
            <span>{doneCount}/{stories.length} stories done</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-lime-500 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      <div className="space-y-2">
        {stories.length === 0 ? (
          <div className="border border-dashed border-stone-300 dark:border-stone-700 rounded-xl p-8 text-center">
            <p className="text-sm text-stone-500 dark:text-stone-400 mb-3">No stories yet</p>
            <code className="text-xs font-mono bg-stone-100 dark:bg-stone-800 px-3 py-2 rounded text-stone-600 dark:text-stone-400">
              /dev-story
            </code>
          </div>
        ) : (
          stories.map(story => (
            <div
              key={story.id}
              className="flex items-center justify-between gap-3 border border-stone-200 dark:border-stone-800 rounded-lg px-4 py-3 bg-card"
            >
              <div>
                <p className="text-sm font-medium text-stone-900 dark:text-stone-100">{story.label}</p>
                <p className="text-xs font-mono text-stone-400 dark:text-stone-500">{story.id}</p>
              </div>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${storyStatusColors[story.status]}`}>
                {story.status}
              </span>
            </div>
          ))
        )}
      </div>

      <div className="bg-stone-50 dark:bg-stone-900/50 rounded-xl p-5 border border-stone-200 dark:border-stone-800">
        <h4 className="text-xs font-semibold text-stone-700 dark:text-stone-300 mb-2">Update progress</h4>
        <code className="block text-xs font-mono bg-stone-100 dark:bg-stone-800 rounded-lg px-4 py-3 text-stone-800 dark:text-stone-200 select-all">
          /sprint-status
        </code>
      </div>
    </div>
  )
}
