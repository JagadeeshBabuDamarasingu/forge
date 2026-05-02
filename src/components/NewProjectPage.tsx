import { useNavigate } from 'react-router-dom'
import { Anvil, ArrowLeft, Layers } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'
import { Button } from '@/components/ui/button'

export function NewProjectPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-background animate-fade-in flex flex-col">
      <header className="border-b border-stone-200 dark:border-stone-800 bg-card/80 backdrop-blur-sm sticky top-0 z-20">
        <div className="px-4 sm:px-6 py-3 max-w-3xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="-ml-2">
              <ArrowLeft className="w-4 h-4 mr-2" strokeWidth={1.5} />
              Dashboard
            </Button>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto px-6 py-12 w-full">
        <div className="mb-10">
          <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100 mb-2">New project</h1>
          <p className="text-sm text-stone-500 dark:text-stone-400">
            Use the <code className="font-mono bg-stone-100 dark:bg-stone-800 px-1.5 py-0.5 rounded text-xs">/new-project</code> command in Claude Code to create a project with guided setup.
          </p>
        </div>

        <div className="space-y-4">
          <div className="border border-stone-200 dark:border-stone-800 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-stone-100 dark:bg-stone-800 flex items-center justify-center shrink-0">
                <Anvil className="w-5 h-5 text-stone-600 dark:text-stone-400" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-stone-900 dark:text-stone-100 mb-1">
                  Create with Claude Code
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 mb-3">
                  The recommended way. Run this command in Claude Code and answer a few questions about your project.
                </p>
                <code className="block bg-stone-100 dark:bg-stone-800 rounded-lg px-4 py-3 text-xs font-mono text-stone-800 dark:text-stone-200 select-all">
                  /new-project
                </code>
              </div>
            </div>
          </div>

          <div className="border border-stone-200 dark:border-stone-800 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-stone-100 dark:bg-stone-800 flex items-center justify-center shrink-0">
                <Layers className="w-5 h-5 text-stone-600 dark:text-stone-400" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-stone-900 dark:text-stone-100 mb-1">
                  Manual setup
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 mb-3">
                  Create the project directory and <code className="font-mono bg-stone-100 dark:bg-stone-800 px-1 rounded">project.json</code> manually, then refresh.
                </p>
                <pre className="bg-stone-100 dark:bg-stone-800 rounded-lg px-4 py-3 text-xs font-mono text-stone-800 dark:text-stone-200 overflow-x-auto">
{`mkdir -p projects/my-project
cat > projects/my-project/project.json << 'EOF'
{
  "name": "My Project",
  "type": "standard",
  "status": "active",
  "currentPhase": "analyse",
  "created": "${new Date().toISOString()}",
  "updated": "${new Date().toISOString()}"
}
EOF`}
                </pre>
              </div>
            </div>
          </div>

          <div className="border border-stone-200 dark:border-stone-800 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-stone-100 dark:bg-stone-800 flex items-center justify-center shrink-0">
                <ArrowLeft className="w-5 h-5 text-stone-600 dark:text-stone-400" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-stone-900 dark:text-stone-100 mb-1">
                  Migrate existing Design OS project
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 mb-3">
                  Have an existing <code className="font-mono bg-stone-100 dark:bg-stone-800 px-1 rounded">product/</code> directory? Move it into the new project structure.
                </p>
                <code className="block bg-stone-100 dark:bg-stone-800 rounded-lg px-4 py-3 text-xs font-mono text-stone-800 dark:text-stone-200 select-all">
                  /migrate-project
                </code>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-stone-200 dark:border-stone-800">
          <Button variant="ghost" onClick={() => navigate('/')}>
            <ArrowLeft className="w-4 h-4 mr-2" strokeWidth={1.5} />
            Back to dashboard
          </Button>
        </div>
      </main>
    </div>
  )
}
