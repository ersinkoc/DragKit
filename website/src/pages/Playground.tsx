import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { RotateCcw, Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard'
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
} from '@codesandbox/sandpack-react'
import { playgroundExamples } from '@/lib/playground-examples'

export function Playground() {
  const [searchParams, setSearchParams] = useSearchParams()
  const exampleId = searchParams.get('example') || 'basic-sortable'
  const currentExample = playgroundExamples[exampleId] || playgroundExamples['basic-sortable']

  const [code, setCode] = useState(currentExample.code)
  const { copied, copy } = useCopyToClipboard()

  // Update code when example changes
  useEffect(() => {
    const example = playgroundExamples[exampleId] || playgroundExamples['basic-sortable']
    setCode(example.code)
  }, [exampleId])

  const handleExampleChange = (newExampleId: string) => {
    setSearchParams({ example: newExampleId })
  }

  const handleReset = () => {
    const example = playgroundExamples[exampleId] || playgroundExamples['basic-sortable']
    setCode(example.code)
  }

  const files = {
    '/App.js': code,
  }

  const customSetup = {
    dependencies: {
      '@dnd-kit/core': '^6.1.0',
      '@dnd-kit/sortable': '^8.0.0',
      '@dnd-kit/utilities': '^3.2.2',
    },
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-border bg-muted/30">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-semibold hidden sm:block">Playground</h1>
          <Select value={exampleId} onValueChange={handleExampleChange}>
            <SelectTrigger className="w-[180px] sm:w-[220px]">
              <SelectValue placeholder="Select example" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(playgroundExamples).map(([id, example]) => (
                <SelectItem key={id} value={id}>
                  {example.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-xs bg-green-500/20 text-green-600 dark:text-green-400 px-2 py-0.5 rounded-full font-medium hidden sm:inline">
            Interactive
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handleReset}>
            <RotateCcw className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Reset</span>
          </Button>
          <Button variant="ghost" size="sm" onClick={() => copy(code)}>
            {copied ? <Check className="h-4 w-4 sm:mr-2" /> : <Copy className="h-4 w-4 sm:mr-2" />}
            <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy'}</span>
          </Button>
        </div>
      </div>

      {/* Sandpack Editor */}
      <div className="flex-1 min-h-[600px]">
        <SandpackProvider
          key={exampleId}
          template="react"
          files={files}
          customSetup={customSetup}
          theme="dark"
        >
          <SandpackLayout style={{ height: '100%', minHeight: '600px' }}>
            <SandpackCodeEditor
              style={{ flex: 1, minHeight: '600px' }}
              showTabs
              showLineNumbers
              showInlineErrors
              wrapContent
            />
            <SandpackPreview
              style={{ flex: 1, minHeight: '600px' }}
              showOpenInCodeSandbox={false}
              showRefreshButton
            />
          </SandpackLayout>
        </SandpackProvider>
      </div>
    </div>
  )
}
