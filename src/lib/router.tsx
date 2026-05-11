import { createBrowserRouter, Navigate } from 'react-router-dom'
import { ProjectsDashboard } from '@/components/ProjectsDashboard'
import { NewProjectPage } from '@/components/NewProjectPage'
import { ProjectLayout } from '@/components/ProjectLayout'
import { FullscreenProjectLayout } from '@/components/FullscreenProjectLayout'
import { AnalysePage } from '@/components/AnalysePage'
import { PlanPage } from '@/components/PlanPage'
import { ProductPage } from '@/components/ProductPage'
import { DataShapePage } from '@/components/DataShapePage'
import { DesignPage } from '@/components/DesignPage'
import { SectionsPage } from '@/components/SectionsPage'
import { SectionPage } from '@/components/SectionPage'
import { ScreenDesignPage, ScreenDesignFullscreen } from '@/components/ScreenDesignPage'
import { ShellDesignPage, ShellDesignFullscreen } from '@/components/ShellDesignPage'
import { ExportPage } from '@/components/ExportPage'
import { BuildPage } from '@/components/BuildPage'
import { EpicPage } from '@/components/EpicPage'
import { ShipPage } from '@/components/ShipPage'
import { ProjectSpecsPage } from '@/components/ProjectSpecsPage'

function ProjectPhaseRedirect() {
  return <Navigate to="analyse" replace />
}

export const router = createBrowserRouter([
  // Workspace dashboard
  { path: '/', element: <ProjectsDashboard /> },
  { path: '/projects/new', element: <NewProjectPage /> },

  // Fullscreen screen/shell design viewers (no ProjectLayout header)
  {
    path: '/:projectId',
    element: <FullscreenProjectLayout />,
    children: [
      {
        path: 'design/sections/:sectionId/screen-designs/:screenDesignName',
        element: <ScreenDesignPage />,
      },
      {
        path: 'design/sections/:sectionId/screen-designs/:screenDesignName/fullscreen',
        element: <ScreenDesignFullscreen />,
      },
      { path: 'design/shell', element: <ShellDesignPage /> },
      { path: 'design/shell/fullscreen', element: <ShellDesignFullscreen /> },
    ],
  },

  // Per-project workspace with ProjectLayout header
  {
    path: '/:projectId',
    element: <ProjectLayout />,
    children: [
      { index: true, element: <ProjectPhaseRedirect /> },
      { path: 'analyse', element: <AnalysePage /> },
      { path: 'plan', element: <PlanPage /> },

      // Design phase — existing Design OS pages
      { path: 'design', element: <ProductPage /> },
      { path: 'design/data-shape', element: <DataShapePage /> },
      { path: 'design/tokens', element: <DesignPage /> },
      { path: 'design/sections', element: <SectionsPage /> },
      { path: 'design/sections/:sectionId', element: <SectionPage /> },
      { path: 'design/export', element: <ExportPage /> },

      // Build phase
      { path: 'build', element: <BuildPage /> },
      { path: 'build/:epicId', element: <EpicPage /> },

      // Ship phase
      { path: 'ship', element: <ShipPage /> },

      // Spec files
      { path: 'specs', element: <ProjectSpecsPage /> },
    ],
  },
])
