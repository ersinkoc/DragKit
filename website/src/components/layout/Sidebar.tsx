import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { ScrollArea } from '@/components/ui/scroll-area'

interface SidebarItem {
  title: string
  href: string
}

interface SidebarSection {
  title: string
  items: SidebarItem[]
}

const sidebarNav: SidebarSection[] = [
  {
    title: 'Getting Started',
    items: [
      { title: 'Introduction', href: '/docs' },
      { title: 'Installation', href: '/docs/installation' },
      { title: 'Quick Start', href: '/docs/quick-start' },
    ],
  },
  {
    title: 'Core Concepts',
    items: [
      { title: 'Overview', href: '/docs/concepts' },
      { title: 'Hooks Reference', href: '/docs/hooks' },
    ],
  },
  {
    title: 'Frameworks',
    items: [
      { title: 'React', href: '/docs/react' },
      { title: 'Vue', href: '/docs/vue' },
      { title: 'Svelte', href: '/docs/svelte' },
    ],
  },
]

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const location = useLocation()

  return (
    <aside className={cn('w-64 shrink-0', className)}>
      <ScrollArea className="h-[calc(100vh-4rem)] py-6 pr-6">
        <nav className="space-y-6">
          {sidebarNav.map((section) => (
            <div key={section.title}>
              <h4 className="mb-2 px-2 text-sm font-semibold tracking-tight">
                {section.title}
              </h4>
              <ul className="space-y-1">
                {section.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      to={item.href}
                      className={cn(
                        'block rounded-md px-2 py-1.5 text-sm transition-colors',
                        location.pathname === item.href
                          ? 'bg-accent text-accent-foreground font-medium'
                          : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                      )}
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </ScrollArea>
    </aside>
  )
}
