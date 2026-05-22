import type { SectionData, ParsedSpec, ScreenDesignInfo, ScreenshotInfo } from '@/types/section'
import type { ComponentType } from 'react'

// Section data: projects/[project-id]/sections/[section-id]/...
const specFiles = import.meta.glob('/projects/*/sections/*/spec.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

const dataFiles = import.meta.glob('/projects/*/sections/*/data.json', {
  eager: true,
}) as Record<string, { default: Record<string, unknown> }>

// Screen designs: src/sections/[project-id]/[section-id]/[Component].tsx
const screenDesignModules = import.meta.glob('/src/sections/*/*/*.tsx') as Record<
  string,
  () => Promise<{ default: ComponentType }>
>

const screenshotFiles = import.meta.glob('/projects/*/sections/*/*.png', {
  query: '?url',
  import: 'default',
  eager: true,
}) as Record<string, string>

function extractScreenDesignName(path: string): string | null {
  const match = path.match(/\/src\/sections\/[^/]+\/[^/]+\/([^/]+)\.tsx$/)
  return match?.[1] || null
}

function extractScreenshotName(path: string): string | null {
  const match = path.match(/\/projects\/[^/]+\/sections\/[^/]+\/([^/]+)\.png$/)
  return match?.[1] || null
}

export function parseSpec(md: string): ParsedSpec | null {
  if (!md || !md.trim()) return null
  try {
    const titleMatch = md.match(/^#\s+(.+)$/m)
    const title = titleMatch?.[1]?.trim() || 'Section Specification'
    const overviewMatch = md.match(/## Overview\s*\n+([\s\S]*?)(?=\n## |\n#[^#]|$)/)
    const overview = overviewMatch?.[1]?.trim() || ''
    const userFlowsSection = md.match(/## User Flows\s*\n+([\s\S]*?)(?=\n## |\n#[^#]|$)/)
    const userFlows: string[] = []
    if (userFlowsSection?.[1]) {
      for (const line of userFlowsSection[1].split('\n')) {
        const trimmed = line.trim()
        if (trimmed.startsWith('- ')) userFlows.push(trimmed.slice(2).trim())
      }
    }
    const uiReqSection = md.match(/## UI Requirements\s*\n+([\s\S]*?)(?=\n## |\n#[^#]|$)/)
    const uiRequirements: string[] = []
    if (uiReqSection?.[1]) {
      for (const line of uiReqSection[1].split('\n')) {
        const trimmed = line.trim()
        if (trimmed.startsWith('- ')) uiRequirements.push(trimmed.slice(2).trim())
      }
    }
    const shellDisabled = /(?:^|\n)\s*-?\s*shell\s*:\s*false/i.test(md)
    return { title, overview, userFlows, uiRequirements, useShell: !shellDisabled }
  } catch {
    return null
  }
}

export function getSectionScreenDesigns(projectId: string, sectionId: string): ScreenDesignInfo[] {
  const prefix = `/src/sections/${projectId}/${sectionId}/`
  return Object.keys(screenDesignModules)
    .filter(p => p.startsWith(prefix))
    .map(p => {
      const name = extractScreenDesignName(p)
      return name ? { name, path: p, componentName: name } : null
    })
    .filter((x): x is ScreenDesignInfo => x !== null)
}

export function getSectionScreenshots(projectId: string, sectionId: string): ScreenshotInfo[] {
  const prefix = `/projects/${projectId}/sections/${sectionId}/`
  return Object.entries(screenshotFiles)
    .filter(([p]) => p.startsWith(prefix))
    .map(([p, url]) => {
      const name = extractScreenshotName(p)
      return name ? { name, path: p, url } : null
    })
    .filter((x): x is ScreenshotInfo => x !== null)
}

export function loadScreenDesignComponent(
  projectId: string,
  sectionId: string,
  screenDesignName: string
): (() => Promise<{ default: ComponentType }>) | null {
  const path = `/src/sections/${projectId}/${sectionId}/${screenDesignName}.tsx`
  return screenDesignModules[path] || null
}

export function loadSectionData(projectId: string, sectionId: string): SectionData {
  const specPath = `/projects/${projectId}/sections/${sectionId}/spec.md`
  const dataPath = `/projects/${projectId}/sections/${sectionId}/data.json`
  const specContent = specFiles[specPath] || null
  const dataModule = dataFiles[dataPath]
  return {
    sectionId,
    spec: specContent,
    specParsed: specContent ? parseSpec(specContent) : null,
    data: dataModule?.default || null,
    screenDesigns: getSectionScreenDesigns(projectId, sectionId),
    screenshots: getSectionScreenshots(projectId, sectionId),
  }
}

export function hasSectionSpec(projectId: string, sectionId: string): boolean {
  return `/projects/${projectId}/sections/${sectionId}/spec.md` in specFiles
}

export function sectionUsesShell(projectId: string, sectionId: string): boolean {
  const specPath = `/projects/${projectId}/sections/${sectionId}/spec.md`
  const specContent = specFiles[specPath]
  if (!specContent) return true
  return parseSpec(specContent)?.useShell ?? true
}

export function hasSectionData(projectId: string, sectionId: string): boolean {
  return `/projects/${projectId}/sections/${sectionId}/data.json` in dataFiles
}

export function getAllSectionIds(projectId: string): string[] {
  const ids = new Set<string>()
  for (const path of Object.keys(specFiles)) {
    const match = path.match(`/projects/${projectId}/sections/([^/]+)/`)
    if (match) ids.add(match[1])
  }
  for (const path of Object.keys(dataFiles)) {
    const match = path.match(`/projects/${projectId}/sections/([^/]+)/`)
    if (match) ids.add(match[1])
  }
  for (const path of Object.keys(screenDesignModules)) {
    const match = path.match(`/src/sections/${projectId}/([^/]+)/`)
    if (match) ids.add(match[1])
  }
  return Array.from(ids)
}
