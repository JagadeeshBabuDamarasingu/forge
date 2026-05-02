import type { DesignSystem, ColorTokens, TypographyTokens } from '@/types/product'

const designSystemFiles = import.meta.glob('/projects/*/product/design-system/*.json', {
  eager: true,
}) as Record<string, { default: Record<string, string> }>

export function loadColorTokens(projectId: string): ColorTokens | null {
  const module = designSystemFiles[`/projects/${projectId}/product/design-system/colors.json`]
  if (!module?.default) return null
  const c = module.default
  if (!c.primary || !c.secondary || !c.neutral) return null
  return { primary: c.primary, secondary: c.secondary, neutral: c.neutral }
}

export function loadTypographyTokens(projectId: string): TypographyTokens | null {
  const module = designSystemFiles[`/projects/${projectId}/product/design-system/typography.json`]
  if (!module?.default) return null
  const t = module.default
  if (!t.heading || !t.body) return null
  return { heading: t.heading, body: t.body, mono: t.mono || 'IBM Plex Mono' }
}

export function loadDesignSystem(projectId: string): DesignSystem | null {
  const colors = loadColorTokens(projectId)
  const typography = loadTypographyTokens(projectId)
  if (!colors && !typography) return null
  return { colors, typography }
}

export function hasDesignSystem(projectId: string): boolean {
  return (
    `/projects/${projectId}/product/design-system/colors.json` in designSystemFiles ||
    `/projects/${projectId}/product/design-system/typography.json` in designSystemFiles
  )
}

export function hasColors(projectId: string): boolean {
  return `/projects/${projectId}/product/design-system/colors.json` in designSystemFiles
}

export function hasTypography(projectId: string): boolean {
  return `/projects/${projectId}/product/design-system/typography.json` in designSystemFiles
}
