import { Outlet, useParams } from 'react-router-dom'
import { ProjectProvider } from '@/lib/project-context'

export function FullscreenProjectLayout() {
  const { projectId } = useParams<{ projectId: string }>()
  if (!projectId) return null
  return (
    <ProjectProvider projectId={projectId}>
      <Outlet />
    </ProjectProvider>
  )
}
