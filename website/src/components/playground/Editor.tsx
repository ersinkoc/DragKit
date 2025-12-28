import React from 'react'
import { cn } from '@/lib/utils'

interface EditorProps {
  value: string
  onChange: (value: string) => void
  className?: string
}

export function Editor({ value, onChange, className }: EditorProps) {
  return (
    <div className={cn('relative h-full', className)}>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-full resize-none bg-[#1e1e1e] text-white font-mono text-sm p-4 focus:outline-none"
        spellCheck={false}
        style={{
          tabSize: 2,
          lineHeight: '1.5rem',
        }}
      />
    </div>
  )
}
