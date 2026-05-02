import type { DataShape, Entity } from '@/types/product'

const dataShapeFiles = import.meta.glob('/projects/*/product/data-shape/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

export function parseDataShapeContent(md: string): DataShape | null {
  if (!md || !md.trim()) return null
  try {
    const entities: Entity[] = []
    const relationships: string[] = []
    const entitiesSection = md.match(/## Entities\s*\n+([\s\S]*?)(?=\n## |\n#[^#]|$)/)
    if (entitiesSection?.[1]) {
      const entityMatches = [...entitiesSection[1].matchAll(/### ([^\n]+)\n+([\s\S]*?)(?=\n### |\n## |$)/g)]
      for (const match of entityMatches) {
        entities.push({ name: match[1].trim(), description: match[2].trim() })
      }
    }
    const relationshipsSection = md.match(/## Relationships\s*\n+([\s\S]*?)(?=\n## |\n#[^#]|$)/)
    if (relationshipsSection?.[1]) {
      for (const line of relationshipsSection[1].split('\n')) {
        const trimmed = line.trim()
        if (trimmed.startsWith('- ')) relationships.push(trimmed.slice(2).trim())
      }
    }
    if (entities.length === 0 && relationships.length === 0) return null
    return { entities, relationships }
  } catch {
    return null
  }
}

export function parseDataShape(projectId: string): DataShape | null {
  const content = dataShapeFiles[`/projects/${projectId}/product/data-shape/data-shape.md`]
  return content ? parseDataShapeContent(content) : null
}

export function hasDataShape(projectId: string): boolean {
  return `/projects/${projectId}/product/data-shape/data-shape.md` in dataShapeFiles
}
