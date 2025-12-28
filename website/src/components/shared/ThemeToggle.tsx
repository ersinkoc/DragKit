import React from 'react'
import { Moon, Sun, Monitor } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useThemeContext } from './ThemeProvider'
import { cn } from '@/lib/utils'

export function ThemeToggle() {
  const { theme, setTheme } = useThemeContext()

  const themes = [
    { value: 'light' as const, icon: Sun, label: 'Light' },
    { value: 'dark' as const, icon: Moon, label: 'Dark' },
    { value: 'system' as const, icon: Monitor, label: 'System' },
  ]

  return (
    <div className="flex items-center gap-1 rounded-md border p-1">
      {themes.map(({ value, icon: Icon, label }) => (
        <Button
          key={value}
          variant="ghost"
          size="icon"
          onClick={() => setTheme(value)}
          className={cn(
            'h-8 w-8',
            theme === value && 'bg-muted'
          )}
          title={label}
        >
          <Icon className="h-4 w-4" />
        </Button>
      ))}
    </div>
  )
}
