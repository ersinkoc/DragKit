import React from 'react'
import { LineNumbers } from './LineNumbers'
import { CopyButton } from './CopyButton'
import { SyntaxHighlighter } from './SyntaxHighlighter'
import { cn } from '@/lib/utils'

interface CodeBlockProps {
  code: string
  language: string
  showLineNumbers?: boolean
  highlightLines?: number[]
  filename?: string
  className?: string
}

export function CodeBlock({
  code,
  language,
  showLineNumbers = true,
  highlightLines = [],
  filename,
  className,
}: CodeBlockProps) {
  const lineCount = code.split('\n').length

  return (
    <div className={cn('rounded-lg border bg-muted/30 overflow-hidden', className)}>
      {filename && (
        <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/50">
          <span className="text-xs font-mono text-muted-foreground">{filename}</span>
          <CopyButton text={code} />
        </div>
      )}
      <div className="relative">
        {!filename && (
          <div className="absolute top-2 right-2 z-10">
            <CopyButton text={code} />
          </div>
        )}
        <div className="flex">
          {showLineNumbers && (
            <LineNumbers count={lineCount} highlightLines={highlightLines} />
          )}
          <div className="flex-1 overflow-x-auto p-4">
            <SyntaxHighlighter code={code} language={language} />
          </div>
        </div>
      </div>
    </div>
  )
}
