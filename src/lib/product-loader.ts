import type { ProductOverview, ProductRoadmap, Problem, Section, ProductData } from '@/types/product'
import { parseDataShape, hasDataShape } from './data-shape-loader'
import { loadDesignSystem, hasDesignSystem } from './design-system-loader'
import { loadShellInfo, hasShell } from './shell-loader'

// Wide glob patterns — project ID extracted from path at runtime
const productFiles = import.meta.glob('/projects/*/product/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

const exportZipFiles = import.meta.glob('/projects/*/product-plan.zip', {
  query: '?url',
  import: 'default',
  eager: true,
}) as Record<string, string>

function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/\s+&\s+/g, '-and-')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function parseProductOverview(md: string): ProductOverview | null {
  if (!md || !md.trim()) return null
  try {
    const normalizedMd = md.replace(/\r\n/g, '\n')
    const nameMatch = normalizedMd.match(/^#\s+(.+)$/m)
    const name = nameMatch?.[1]?.trim() || 'Product Overview'
    const descMatch = normalizedMd.match(/## Description\s*\n+([\s\S]*?)(?=\n## |\n#[^#]|$)/)
    const description = descMatch?.[1]?.trim() || ''
    const problemsSection = normalizedMd.match(/## Problems & Solutions\s*\n+([\s\S]*?)(?=\n## |\n#[^#]|$)/)
    const problems: Problem[] = []
    if (problemsSection?.[1]) {
      const problemMatches = [...problemsSection[1].matchAll(/### Problem \d+:\s*(.+)\n+([\s\S]*?)(?=\n### |\n## |$)/g)]
      for (const match of problemMatches) {
        problems.push({ title: match[1].trim(), solution: match[2].trim() })
      }
    }
    const featuresSection = normalizedMd.match(/## Key Features\s*\n+([\s\S]*?)(?=\n## |\n#[^#]|$)/)
    const features: string[] = []
    if (featuresSection?.[1]) {
      for (const line of featuresSection[1].split('\n')) {
        const trimmed = line.trim()
        if (trimmed.startsWith('- ')) features.push(trimmed.slice(2).trim())
      }
    }
    if (!description && problems.length === 0 && features.length === 0) return null
    return { name, description, problems, features }
  } catch {
    return null
  }
}

export function parseProductRoadmap(md: string): ProductRoadmap | null {
  if (!md || !md.trim()) return null
  try {
    const sections: Section[] = []
    const normalizedMd = md.replace(/\r\n/g, '\n')
    const sectionMatches = [...normalizedMd.matchAll(/### (\d+)\.\s*(.+)\n+([\s\S]*?)(?=\n### |\n## |\n#[^#]|$)/g)]
    for (const match of sectionMatches) {
      sections.push({
        id: slugify(match[2].trim()),
        title: match[2].trim(),
        description: match[3].trim(),
        order: parseInt(match[1], 10),
      })
    }
    sections.sort((a, b) => a.order - b.order)
    if (sections.length === 0) return null
    return { sections }
  } catch {
    return null
  }
}

export function loadProductData(projectId: string): ProductData {
  const overviewContent = productFiles[`/projects/${projectId}/product/product-overview.md`]
  const roadmapContent = productFiles[`/projects/${projectId}/product/product-roadmap.md`]
  return {
    overview: overviewContent ? parseProductOverview(overviewContent) : null,
    roadmap: roadmapContent ? parseProductRoadmap(roadmapContent) : null,
    dataShape: parseDataShape(projectId),
    designSystem: loadDesignSystem(projectId),
    shell: loadShellInfo(projectId),
  }
}

export function hasProductOverview(projectId: string): boolean {
  return `/projects/${projectId}/product/product-overview.md` in productFiles
}

export function hasProductRoadmap(projectId: string): boolean {
  return `/projects/${projectId}/product/product-roadmap.md` in productFiles
}

export function hasExportZip(projectId: string): boolean {
  return `/projects/${projectId}/product-plan.zip` in exportZipFiles
}

export function getExportZipUrl(projectId: string): string | null {
  return exportZipFiles[`/projects/${projectId}/product-plan.zip`] || null
}

export { hasDataShape, hasDesignSystem, hasShell }
