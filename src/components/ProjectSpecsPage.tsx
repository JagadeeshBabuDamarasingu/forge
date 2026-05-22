import { useState, useCallback } from 'react'
import {
  Download,
  FileText,
  Bot,
  ClipboardList,
} from 'lucide-react'
import { useProject } from '@/lib/project-context'
import { getProject } from '@/lib/project-loader'
import {
  generateDesignMd,
  generateAgentsMd,
  generateManifestMd,
  SPEC_FILE_META,
  type SpecFileType,
} from '@/lib/spec-templates'
import { Button } from '@/components/ui/button'

const specIcons: Record<SpecFileType, typeof FileText> = {
  design: FileText,
  agents: Bot,
  manifest: ClipboardList,
}

interface SpecFileCardProps {
  type: SpecFileType
  onDownload: () => void
}

function SpecFileCard({ type, onDownload }: SpecFileCardProps) {
  const meta = SPEC_FILE_META[type]
  const Icon = specIcons[type]

  return (
    <div className={`border rounded-xl p-5 transition-colors border-stone-200 dark:border-stone-800 bg-card`}>
      <div className="flex items-start gap-4">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 bg-stone-100 dark:bg-stone-800`}>
          <Icon
            className={`w-4.5 h-4.5 text-stone-700 dark:text-stone-300`}
            strokeWidth={1.5}
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-sm font-semibold text-stone-900 dark:text-stone-100 font-mono">
              {meta.label}
            </h3>
            <span className="text-xs text-stone-400 dark:text-stone-500 bg-stone-100 dark:bg-stone-800 px-1.5 py-0.5 rounded font-medium">
              {meta.badge}
            </span>
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400 mb-3 leading-relaxed">
            {meta.description}
          </p>

          <div className="flex items-center gap-2 flex-wrap">
            <Button
              size="sm"
              variant="default"
              onClick={onDownload}
            >
              <Download className="w-3.5 h-3.5 mr-1.5" strokeWidth={1.5} />
              Download
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

const SPEC_TYPES: SpecFileType[] = ['design', 'agents', 'manifest']

export function ProjectSpecsPage() {
  const { projectId } = useProject()
  const project = getProject(projectId)

  function getContent(type: SpecFileType): string {
    const name = project?.name ?? projectId
    const desc = project?.description
    switch (type) {
      case 'design': return generateDesignMd(name, desc)
      case 'agents': return generateAgentsMd(name, desc)
      case 'manifest': return generateManifestMd(name, desc)
    }
  }

  const downloadFile = useCallback((filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/markdown; charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [])

  function handleDownload(type: SpecFileType) {
    downloadFile(SPEC_FILE_META[type].filename, getContent(type))
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-stone-900 dark:text-stone-100 mb-2">
          Spec files
        </h1>
        <p className="text-stone-600 dark:text-stone-400 text-sm leading-relaxed">
          Generate specification files for this project. The daemon manages your project files in <code>projects/{projectId}</code>.
          You can also download individual spec files here.
        </p>
      </div>

      {/* Spec file cards */}
      <div className="space-y-4">
        {SPEC_TYPES.map((type) => (
          <SpecFileCard
            key={type}
            type={type}
            onDownload={() => handleDownload(type)}
          />
        ))}
      </div>

      {/* DESIGN.md format info */}
      <div className="border border-stone-200 dark:border-stone-800 rounded-xl p-5 bg-stone-50 dark:bg-stone-900/50">
        <h3 className="text-sm font-semibold text-stone-900 dark:text-stone-100 mb-2">
          About the DESIGN.md format
        </h3>
        <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed mb-3">
          DESIGN.md uses a structured markdown format where each screen is described with an H2
          heading and prose description. AI design tools (like Google Stitch) parse these descriptions
          to generate visual screen mockups. The format is intentionally simple — a title, an overview
          paragraph, and one H2 section per screen.
        </p>
        <pre className="bg-stone-100 dark:bg-stone-800 rounded-lg px-4 py-3 text-xs font-mono text-stone-700 dark:text-stone-300 overflow-x-auto whitespace-pre">{`# App Name

Brief overview of the application.

## Screen Name

Describe what this screen shows and does.
Each screen gets its own H2 section.`}</pre>
        <p className="text-xs text-stone-400 dark:text-stone-500 mt-2">
          Spec:{' '}
          <span className="font-mono">stitch.withgoogle.com/docs/design-md/format</span>
        </p>
      </div>
    </div>
  )
}