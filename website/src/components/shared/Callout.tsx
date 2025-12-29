import { Info, AlertTriangle, Lightbulb, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CalloutProps {
  type?: 'info' | 'warning' | 'tip' | 'danger'
  title?: string
  children: React.ReactNode
  className?: string
}

const icons = {
  info: Info,
  warning: AlertTriangle,
  tip: Lightbulb,
  danger: AlertCircle,
}

const styles = {
  info: 'border-blue-500/50 bg-blue-500/10 text-blue-600 dark:text-blue-400',
  warning: 'border-yellow-500/50 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400',
  tip: 'border-green-500/50 bg-green-500/10 text-green-600 dark:text-green-400',
  danger: 'border-red-500/50 bg-red-500/10 text-red-600 dark:text-red-400',
}

export function Callout({ type = 'info', title, children, className }: CalloutProps) {
  const Icon = icons[type]

  return (
    <div
      className={cn(
        'my-6 flex gap-3 rounded-lg border p-4',
        styles[type],
        className
      )}
    >
      <Icon className="h-5 w-5 shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        {title && (
          <p className="font-semibold mb-1">{title}</p>
        )}
        <div className="text-sm [&>p]:m-0">{children}</div>
      </div>
    </div>
  )
}
