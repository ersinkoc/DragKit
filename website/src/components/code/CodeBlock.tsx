import { File } from 'lucide-react'
import { cn } from '@/lib/utils'
import { LineNumbers } from './LineNumbers'
import { SyntaxHighlighter } from './SyntaxHighlighter'
import { CopyButton } from './CopyButton'

interface CodeBlockProps {
  code: string
  language: string
  filename?: string
  showLineNumbers?: boolean
  highlightLines?: number[]
  showCopyButton?: boolean
  maxHeight?: string
  className?: string
}

export function CodeBlock({
  code,
  language,
  filename,
  showLineNumbers = true,
  highlightLines = [],
  showCopyButton = true,
  maxHeight,
  className,
}: CodeBlockProps) {
  const lines = code.trim().split('\n')
  const lineCount = lines.length

  return (
    <div className={cn(
      "code-block-wrapper rounded-lg border border-zinc-800 bg-zinc-950 overflow-hidden",
      className
    )}>
      {/* Header */}
      {(filename || showCopyButton) && (
        <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800 bg-zinc-900/50">
          {filename && (
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <File className="w-4 h-4" />
              <span>{filename}</span>
            </div>
          )}
          {!filename && <div />}
          {showCopyButton && <CopyButton text={code} />}
        </div>
      )}

      {/* Code Content */}
      <div 
        className="flex overflow-x-auto"
        style={{ maxHeight: maxHeight || 'none' }}
      >
        {showLineNumbers && (
          <LineNumbers count={lineCount} highlightLines={highlightLines} />
        )}
        <div className="flex-1 p-4 overflow-x-auto">
          <SyntaxHighlighter 
            code={code} 
            language={language}
            highlightLines={highlightLines}
          />
        </div>
      </div>
    </div>
  )
}
