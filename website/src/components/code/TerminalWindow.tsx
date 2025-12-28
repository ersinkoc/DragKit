import React from 'react'
import { Terminal } from 'lucide-react'
import { CopyButton } from './CopyButton'
import { cn } from '@/lib/utils'

interface TerminalWindowProps {
  content: string
  title?: string
  className?: string
}

export function TerminalWindow({ content, title = 'Terminal', className }: TerminalWindowProps) {
  return (
    <div className={cn('rounded-lg border bg-card shadow-lg overflow-hidden', className)}>
      {/* Terminal title bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-muted/50 border-b">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{title}</span>
        </div>
        <CopyButton text={content} />
      </div>

      {/* Terminal content */}
      <div className="bg-[#1e1e1e] p-4">
        <pre className="font-mono text-xs text-green-400 leading-relaxed overflow-x-auto">
          {content}
        </pre>
      </div>
    </div>
  )
}
