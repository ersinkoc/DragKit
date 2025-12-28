import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

interface SidebarItem {
  title: string
  href: string
  items?: SidebarItem[]
}

const sidebarItems: SidebarItem[] = [
  {
    title: 'Getting Started',
    href: '/docs/getting-started',
  },
  {
    title: 'Concepts',
    href: '/docs/concepts',
    items: [
      { title: 'Core Concepts', href: '/docs/concepts/core' },
      { title: 'Lifecycle', href: '/docs/concepts/lifecycle' },
      { title: 'Events', href: '/docs/concepts/events' },
    ],
  },
  {
    title: 'Guides',
    href: '/docs/guides',
    items: [
      { title: 'Drag & Drop', href: '/docs/guides/drag-drop' },
      { title: 'Sortable Lists', href: '/docs/guides/sortable' },
      { title: 'Accessibility', href: '/docs/guides/accessibility' },
    ],
  },
  {
    title: 'Frameworks',
    href: '/docs/frameworks',
    items: [
      { title: 'React', href: '/docs/frameworks/react' },
      { title: 'Vue', href: '/docs/frameworks/vue' },
      { title: 'Vanilla JS', href: '/docs/frameworks/vanilla' },
    ],
  },
  {
    title: 'API Reference',
    href: '/docs/api',
    items: [
      { title: 'DragKit', href: '/docs/api/dragkit' },
      { title: 'Draggable', href: '/docs/api/draggable' },
      { title: 'Droppable', href: '/docs/api/droppable' },
      { title: 'Sortable', href: '/docs/api/sortable' },
    ],
  },
]

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const location = useLocation()

  const renderItems = (items: SidebarItem[], level = 0) => {
    return items.map((item) => {
      const isActive = location.pathname === item.href
      const hasChildren = item.items && item.items.length > 0

      return (
        <div key={item.href} className={cn(level > 0 && 'ml-4')}>
          <Link
            to={item.href}
            className={cn(
              'block py-2 px-3 rounded-md text-sm transition-colors',
              isActive
                ? 'bg-muted font-medium text-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50',
              level === 0 && 'font-semibold'
            )}
          >
            {item.title}
          </Link>
          {hasChildren && (
            <div className="mt-1">{renderItems(item.items!, level + 1)}</div>
          )}
        </div>
      )
    })
  }

  return (
    <aside className={cn('w-64 border-r', className)}>
      <ScrollArea className="h-full py-6 px-4">
        <nav className="space-y-1">{renderItems(sidebarItems)}</nav>
      </ScrollArea>
    </aside>
  )
}
