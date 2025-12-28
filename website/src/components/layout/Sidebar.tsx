import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { docsConfig } from '@/lib/docs-config'
import { ChevronRight } from 'lucide-react'
import { useState } from 'react'

export function Sidebar() {
  const location = useLocation()
  const [openSections, setOpenSections] = useState<string[]>(['Getting Started'])

  const toggleSection = (title: string) => {
    setOpenSections((prev) =>
      prev.includes(title)
        ? prev.filter((t) => t !== title)
        : [...prev, title]
    )
  }

  return (
    <aside className="fixed top-16 left-0 z-30 h-[calc(100vh-4rem)] w-64 overflow-y-auto border-r bg-background">
      <div className="py-6 px-4">
        <nav className="space-y-6">
          {docsConfig.sidebarNav.map((section) => (
            <div key={section.title}>
              <button
                onClick={() => toggleSection(section.title)}
                className="flex items-center justify-between w-full text-sm font-semibold mb-2 hover:text-foreground transition-colors"
              >
                {section.title}
                <ChevronRight
                  className={cn(
                    'w-4 h-4 transition-transform',
                    openSections.includes(section.title) && 'rotate-90'
                  )}
                />
              </button>
              {openSections.includes(section.title) && section.items && (
                <ul className="space-y-1">
                  {section.items.filter(item => item.href).map((item) => {
                    const isActive = location.pathname === item.href
                    return (
                      <li key={item.href}>
                        <Link
                          to={item.href!}
                          className={cn(
                            'block py-2 px-3 text-sm rounded-md transition-colors',
                            isActive
                              ? 'bg-accent text-accent-foreground font-medium'
                              : 'text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground'
                          )}
                        >
                          {item.title}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          ))}
        </nav>
      </div>
    </aside>
  )
}
