import type { ShellSpec, ShellInfo } from '@/types/product'
import type { ComponentType, ReactNode } from 'react'

const shellSpecFiles = import.meta.glob('/projects/*/product/shell/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

// Screen designs: src/shell/[project-id]/components/*.tsx
const shellComponentModules = import.meta.glob('/src/shell/*/components/*.tsx') as Record<
  string,
  () => Promise<{ default: ComponentType }>
>

const shellPreviewModules = import.meta.glob('/src/shell/*/*.tsx') as Record<
  string,
  () => Promise<{ default: ComponentType }>
>

export function parseShellSpec(md: string): ShellSpec | null {
  if (!md || !md.trim()) return null
  try {
    const overviewMatch = md.match(/## Overview\s*\n+([\s\S]*?)(?=\n## |\n#[^#]|$)/)
    const overview = overviewMatch?.[1]?.trim() || ''
    const navSection = md.match(/## Navigation Structure\s*\n+([\s\S]*?)(?=\n## |\n#[^#]|$)/)
    const navigationItems: string[] = []
    if (navSection?.[1]) {
      for (const line of navSection[1].split('\n')) {
        const trimmed = line.trim()
        if (trimmed.startsWith('- ')) navigationItems.push(trimmed.slice(2).trim())
      }
    }
    const layoutMatch = md.match(/## Layout Pattern\s*\n+([\s\S]*?)(?=\n## |\n#[^#]|$)/)
    const layoutPattern = layoutMatch?.[1]?.trim() || ''
    if (!overview && navigationItems.length === 0 && !layoutPattern) return null
    return { raw: md, overview, navigationItems, layoutPattern }
  } catch {
    return null
  }
}

export function hasShellComponents(projectId: string): boolean {
  return `/src/shell/${projectId}/components/AppShell.tsx` in shellComponentModules
}

export function loadShellComponent(
  projectId: string,
  componentName: string
): (() => Promise<{ default: ComponentType }>) | null {
  const path = `/src/shell/${projectId}/components/${componentName}.tsx`
  return shellComponentModules[path] || null
}

export function loadAppShell(
  projectId: string
): (() => Promise<{ default: ComponentType<{ children?: ReactNode }> }>) | null {
  const wrapperPath = `/src/shell/${projectId}/components/ShellWrapper.tsx`
  if (wrapperPath in shellComponentModules) {
    return shellComponentModules[wrapperPath] as () => Promise<{ default: ComponentType<{ children?: ReactNode }> }>
  }
  const path = `/src/shell/${projectId}/components/AppShell.tsx`
  return (shellComponentModules[path] as () => Promise<{ default: ComponentType<{ children?: ReactNode }> }>) || null
}

export function loadShellPreview(
  projectId: string
): (() => Promise<{ default: ComponentType }>) | null {
  return shellPreviewModules[`/src/shell/${projectId}/ShellPreview.tsx`] || null
}

export function loadShellInfo(projectId: string): ShellInfo | null {
  const specContent = shellSpecFiles[`/projects/${projectId}/product/shell/spec.md`]
  const spec = specContent ? parseShellSpec(specContent) : null
  const hasComponents = hasShellComponents(projectId)
  if (!spec && !hasComponents) return null
  return { spec, hasComponents }
}

export function hasShell(projectId: string): boolean {
  return hasShellSpec(projectId) || hasShellComponents(projectId)
}

export function hasShellSpec(projectId: string): boolean {
  return `/projects/${projectId}/product/shell/spec.md` in shellSpecFiles
}

export function getShellComponentNames(projectId: string): string[] {
  const prefix = `/src/shell/${projectId}/components/`
  return Object.keys(shellComponentModules)
    .filter(p => p.startsWith(prefix))
    .map(p => p.replace(prefix, '').replace('.tsx', ''))
}
