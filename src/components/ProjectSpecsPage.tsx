import { useState, useEffect, useCallback } from 'react'
import {
  FolderOpen,
  FolderX,
  Download,
  CheckCircle2,
  Circle,
  FileText,
  Bot,
  ClipboardList,
  AlertCircle,
  RefreshCw,
} from 'lucide-react'
import { useProject } from '@/lib/project-context'
import { getProject } from '@/lib/project-loader'
import { useSpecsFolder } from '@/lib/specs-folder'
import {
  generateDesignMd,
  generateAgentsMd,
  generateManifestMd,
  SPEC_FILE_META,
  type SpecFileType,
} from '@/lib/spec-templates'
import { Button } from '@/components/ui/button'

// ─── Per-spec status tracking ───────────────────────────────────────────────

type FileStatus = 'unknown' | 'exists' | 'missing'
type WriteStatus = 'idle' | 'writing' | 'done' | 'error'

interface SpecState {
  fileStatus: FileStatus
  writeStatus: WriteStatus
}

// ─── Folder Selector ────────────────────────────────────────────────────────

interface FolderSelectorProps {
  isSupported: boolean
  isLoading: boolean
  folderName: string | null
  permissionState: PermissionState | null
  onSelect: () => void
  onClear: () => void
  onRequestPermission: () => void
}

function FolderSelector({
  isSupported,
  isLoading,
  folderName,
  permissionState,
  onSelect,
  onClear,
  onRequestPermission,
}: FolderSelectorProps) {
  if (isLoading) {
    return (
      <div className="border border-stone-200 dark:border-stone-800 rounded-xl p-5 animate-pulse">
        <div className="h-4 bg-stone-200 dark:bg-stone-700 rounded w-48" />
      </div>
    )
  }

  const needsPermission = folderName && permissionState !== 'granted'

  return (
    <div className="border border-stone-200 dark:border-stone-800 rounded-xl p-5">
      <div className="flex items-start gap-4">
        <div className="w-9 h-9 rounded-lg bg-stone-100 dark:bg-stone-800 flex items-center justify-center shrink-0">
          <FolderOpen className="w-4.5 h-4.5 text-stone-600 dark:text-stone-400" strokeWidth={1.5} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-stone-900 dark:text-stone-100 mb-1">
            Output folder
          </h3>
          {folderName ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono bg-stone-100 dark:bg-stone-800 px-2 py-1 rounded text-stone-700 dark:text-stone-300 truncate max-w-xs">
                  {folderName}
                </span>
                {permissionState === 'granted' ? (
                  <span className="text-xs text-lime-600 dark:text-lime-400 flex items-center gap-1 shrink-0">
                    <CheckCircle2 className="w-3 h-3" strokeWidth={2} />
                    Access granted
                  </span>
                ) : (
                  <span className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1 shrink-0">
                    <AlertCircle className="w-3 h-3" strokeWidth={2} />
                    Needs permission
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {needsPermission && (
                  <Button size="sm" variant="outline" onClick={onRequestPermission}>
                    <RefreshCw className="w-3.5 h-3.5 mr-1.5" strokeWidth={1.5} />
                    Re-grant access
                  </Button>
                )}
                <Button size="sm" variant="outline" onClick={onSelect}>
                  Change folder
                </Button>
                <Button size="sm" variant="ghost" onClick={onClear} className="text-stone-400 hover:text-red-500">
                  <FolderX className="w-3.5 h-3.5 mr-1.5" strokeWidth={1.5} />
                  Clear
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-xs text-stone-500 dark:text-stone-400">
                {isSupported
                  ? 'Choose a folder where DESIGN.md, AGENTS.md, and MANIFEST.md will be written. The folder is remembered per project.'
                  : 'Your browser does not support the File System Access API. Spec files will be downloaded instead.'}
              </p>
              {isSupported && (
                <Button size="sm" onClick={onSelect}>
                  <FolderOpen className="w-3.5 h-3.5 mr-1.5" strokeWidth={1.5} />
                  Browse folder
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Spec File Card ──────────────────────────────────────────────────────────

const specIcons: Record<SpecFileType, typeof FileText> = {
  design: FileText,
  agents: Bot,
  manifest: ClipboardList,
}

interface SpecFileCardProps {
  type: SpecFileType
  state: SpecState
  canWrite: boolean
  onWrite: () => void
  onDownload: () => void
}

function SpecFileCard({ type, state, canWrite, onWrite, onDownload }: SpecFileCardProps) {
  const meta = SPEC_FILE_META[type]
  const Icon = specIcons[type]
  const { fileStatus, writeStatus } = state

  const isWriting = writeStatus === 'writing'
  const justDone = writeStatus === 'done'
  const hasError = writeStatus === 'error'
  const exists = fileStatus === 'exists'

  return (
    <div className={`border rounded-xl p-5 transition-colors ${
      exists || justDone
        ? 'border-stone-200 dark:border-stone-800 bg-card'
        : 'border-dashed border-stone-300 dark:border-stone-700'
    }`}>
      <div className="flex items-start gap-4">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
          exists || justDone
            ? 'bg-stone-100 dark:bg-stone-800'
            : 'bg-stone-50 dark:bg-stone-900'
        }`}>
          <Icon
            className={`w-4.5 h-4.5 ${
              exists || justDone ? 'text-stone-700 dark:text-stone-300' : 'text-stone-400 dark:text-stone-500'
            }`}
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
            {(exists || justDone) && (
              <CheckCircle2 className="w-4 h-4 text-lime-500 shrink-0" strokeWidth={2} />
            )}
            {fileStatus === 'missing' && !justDone && (
              <Circle className="w-4 h-4 text-stone-300 dark:text-stone-600 shrink-0" strokeWidth={1.5} />
            )}
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400 mb-3 leading-relaxed">
            {meta.description}
          </p>

          {hasError && (
            <p className="text-xs text-red-500 mb-2 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" strokeWidth={2} />
              Failed to write file. Check folder permissions and try again.
            </p>
          )}

          <div className="flex items-center gap-2 flex-wrap">
            {canWrite ? (
              <Button
                size="sm"
                variant={exists || justDone ? 'outline' : 'default'}
                onClick={onWrite}
                disabled={isWriting}
              >
                {isWriting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 mr-1.5 animate-spin" strokeWidth={1.5} />
                    Writing…
                  </>
                ) : exists || justDone ? (
                  'Overwrite'
                ) : (
                  'Create file'
                )}
              </Button>
            ) : null}
            <Button
              size="sm"
              variant="ghost"
              onClick={onDownload}
              className="text-stone-500 dark:text-stone-400"
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

// ─── Main Page ───────────────────────────────────────────────────────────────

const SPEC_TYPES: SpecFileType[] = ['design', 'agents', 'manifest']

export function ProjectSpecsPage() {
  const { projectId } = useProject()
  const project = getProject(projectId)

  const folder = useSpecsFolder(projectId)

  const [specStates, setSpecStates] = useState<Record<SpecFileType, SpecState>>({
    design: { fileStatus: 'unknown', writeStatus: 'idle' },
    agents: { fileStatus: 'unknown', writeStatus: 'idle' },
    manifest: { fileStatus: 'unknown', writeStatus: 'idle' },
  })

  // Check which files already exist in the selected folder
  const checkFiles = useCallback(async () => {
    if (!folder.handle || folder.permissionState !== 'granted') return
    const updates: Partial<Record<SpecFileType, FileStatus>> = {}
    await Promise.all(
      SPEC_TYPES.map(async (type) => {
        const exists = await folder.fileExists(SPEC_FILE_META[type].filename)
        updates[type] = exists ? 'exists' : 'missing'
      })
    )
    setSpecStates((prev) => {
      const next = { ...prev }
      for (const type of SPEC_TYPES) {
        if (updates[type]) {
          next[type] = { ...next[type], fileStatus: updates[type]! }
        }
      }
      return next
    })
  }, [folder])

  // Re-check files whenever the folder handle or permission changes
  useEffect(() => {
    checkFiles()
  }, [checkFiles])

  function getContent(type: SpecFileType): string {
    const name = project?.name ?? projectId
    const desc = project?.description
    switch (type) {
      case 'design': return generateDesignMd(name, desc)
      case 'agents': return generateAgentsMd(name, desc)
      case 'manifest': return generateManifestMd(name, desc)
    }
  }

  async function handleWrite(type: SpecFileType) {
    const content = getContent(type)
    const filename = SPEC_FILE_META[type].filename

    setSpecStates((prev) => ({
      ...prev,
      [type]: { ...prev[type], writeStatus: 'writing' },
    }))

    const ok = await folder.writeFile(filename, content)

    setSpecStates((prev) => ({
      ...prev,
      [type]: {
        fileStatus: ok ? 'exists' : prev[type].fileStatus,
        writeStatus: ok ? 'done' : 'error',
      },
    }))
  }

  function handleDownload(type: SpecFileType) {
    folder.downloadFile(SPEC_FILE_META[type].filename, getContent(type))
  }

  const canWrite = !!folder.handle && folder.permissionState === 'granted'

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-stone-900 dark:text-stone-100 mb-2">
          Spec files
        </h1>
        <p className="text-stone-600 dark:text-stone-400 text-sm leading-relaxed">
          Generate specification files for this project. Select an output folder to write files
          directly to your filesystem, or download them individually.
        </p>
      </div>

      {/* Folder selector */}
      <FolderSelector
        isSupported={folder.isSupported}
        isLoading={folder.isLoading}
        folderName={folder.folderName}
        permissionState={folder.permissionState}
        onSelect={folder.selectFolder}
        onClear={folder.clearFolder}
        onRequestPermission={async () => {
          const granted = await folder.requestPermission()
          if (granted) checkFiles()
        }}
      />

      {/* Spec file cards */}
      <div className="space-y-4">
        {SPEC_TYPES.map((type) => (
          <SpecFileCard
            key={type}
            type={type}
            state={specStates[type]}
            canWrite={canWrite}
            onWrite={() => handleWrite(type)}
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
