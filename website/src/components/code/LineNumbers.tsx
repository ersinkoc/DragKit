import React from 'react'
import { cn } from '@/lib/utils'

interface LineNumbersProps {
  count: number
  highlightLines?: number[]
  className?: string
}

export function LineNumbers({ count, highlightLines = [], className }: LineNumbersProps) {
  return (
    <div className={cn('select-none text-right pr-4 text-muted-foreground/60', className)}>
      {Array.from({ length: count }, (_, i) => i + 1).map((lineNumber) => (
        <div
          key={lineNumber}
          className={cn(
            'leading-[1.5rem] text-xs font-mono',
            highlightLines.includes(lineNumber) && 'text-primary font-semibold'
          )}
        >
          {lineNumber}
        </div>
      ))}
    </div>
  )
}
