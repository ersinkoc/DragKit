import React from 'react'
import { Globe } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BrowserWindowProps {
  url?: string
  children: React.ReactNode
  className?: string
}

export function BrowserWindow({ url = 'localhost:3000', children, className }: BrowserWindowProps) {
  return (
    <div className={cn('rounded-lg border bg-card shadow-lg overflow-hidden', className)}>
      {/* Browser chrome */}
      <div className="flex items-center gap-2 px-4 py-3 bg-muted/50 border-b">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
        </div>
        <div className="ml-4 flex-1 flex items-center gap-2 px-3 py-1.5 bg-background rounded-md border">
          <Globe className="h-3 w-3 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">{url}</span>
        </div>
      </div>

      {/* Browser content */}
      <div className="bg-background">
        {children}
      </div>
    </div>
  )
}
