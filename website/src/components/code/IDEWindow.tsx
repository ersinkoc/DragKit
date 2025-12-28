import React from 'react'
import { CodeBlock } from './CodeBlock'
import { cn } from '@/lib/utils'

interface IDEWindowProps {
  code: string
  language: string
  filename: string
  showLineNumbers?: boolean
  highlightLines?: number[]
  className?: string
}

export function IDEWindow({
  code,
  language,
  filename,
  showLineNumbers = true,
  highlightLines = [],
  className,
}: IDEWindowProps) {
  return (
    <div className={cn('rounded-lg border bg-card shadow-lg overflow-hidden', className)}>
      {/* VS Code-style title bar */}
      <div className="flex items-center gap-2 px-4 py-3 bg-muted/50 border-b">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
        </div>
        <div className="ml-2 flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">{filename}</span>
        </div>
      </div>

      {/* Code content */}
      <div className="bg-[#1e1e1e]">
        <CodeBlock
          code={code}
          language={language}
          showLineNumbers={showLineNumbers}
          highlightLines={highlightLines}
          className="border-0 bg-transparent"
        />
      </div>
    </div>
  )
}
