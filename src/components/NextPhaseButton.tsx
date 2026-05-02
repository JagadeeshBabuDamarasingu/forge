import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

interface NextPhaseButtonProps {
  nextPhase: string  // now accepts a full path, e.g. /${projectId}/design/data-shape
  label?: string
}

export function NextPhaseButton({ nextPhase, label }: NextPhaseButtonProps) {
  const navigate = useNavigate()

  // Derive label from path if not provided
  const derivedLabel = label || (() => {
    const segment = nextPhase.split('/').filter(Boolean).pop() || ''
    const labels: Record<string, string> = {
      'data-shape': 'Data Shape',
      tokens: 'Design System',
      design: 'Design',
      sections: 'Sections',
      export: 'Export',
      analyse: 'Analyse',
      plan: 'Plan',
      build: 'Build',
      ship: 'Ship',
    }
    return labels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1)
  })()

  return (
    <button
      onClick={() => navigate(nextPhase)}
      className="w-full flex items-center justify-between gap-4 px-6 py-4 bg-stone-900 dark:bg-stone-100 text-stone-100 dark:text-stone-900 rounded-lg hover:bg-stone-800 dark:hover:bg-stone-200 transition-colors group"
    >
      <span className="font-medium">Continue to {derivedLabel}</span>
      <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" strokeWidth={1.5} />
    </button>
  )
}
