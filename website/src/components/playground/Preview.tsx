import { cn } from '@/lib/utils'
import { GripVertical } from 'lucide-react'

interface PreviewProps {
  className?: string
}

export function Preview({ className }: PreviewProps) {
  return (
    <div className={cn('h-full flex items-center justify-center p-8', className)}>
      <div className="w-full max-w-sm space-y-3">
        {['Learn DragKit', 'Build something awesome', 'Ship to production'].map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-3 p-4 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing"
          >
            <GripVertical className="h-5 w-5 text-zinc-400" />
            <span className="font-medium text-zinc-900 dark:text-zinc-100">{item}</span>
          </div>
        ))}

        <p className="text-xs text-center text-zinc-500 dark:text-zinc-400 mt-6 pt-4 border-t border-zinc-200 dark:border-zinc-700">
          This is a static preview. Install DragKit to enable live editing.
        </p>
      </div>
    </div>
  )
}
