import { createContext, useContext } from 'react'
import type { ReactNode } from 'react'

interface ProjectContextValue {
  projectId: string
}

const ProjectContext = createContext<ProjectContextValue>({ projectId: '' })

export function ProjectProvider({
  projectId,
  children,
}: {
  projectId: string
  children: ReactNode
}) {
  return <ProjectContext.Provider value={{ projectId }}>{children}</ProjectContext.Provider>
}

export function useProject(): ProjectContextValue {
  return useContext(ProjectContext)
}
