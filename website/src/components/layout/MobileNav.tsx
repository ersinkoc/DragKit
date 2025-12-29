import { Link, useLocation } from 'react-router-dom'
import { X, Package, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

interface MobileNavProps {
  isOpen: boolean
  onClose: () => void
}

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Docs', href: '/docs' },
  { name: 'Examples', href: '/examples' },
  { name: 'Playground', href: '/playground' },
]

const docsSections = [
  {
    title: 'Getting Started',
    items: [
      { title: 'Introduction', href: '/docs' },
      { title: 'Installation', href: '/docs/installation' },
      { title: 'Quick Start', href: '/docs/quick-start' },
    ],
  },
  {
    title: 'Hooks',
    items: [
      { title: 'useDraggable', href: '/docs/hooks/use-draggable' },
      { title: 'useDroppable', href: '/docs/hooks/use-droppable' },
      { title: 'useSortable', href: '/docs/hooks/use-sortable' },
    ],
  },
]

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const location = useLocation()

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm md:hidden"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 left-0 z-50 w-full max-w-xs border-r border-border bg-background md:hidden">
        <div className="flex h-16 items-center justify-between px-4 border-b border-border">
          <Link to="/" className="flex items-center gap-2" onClick={onClose}>
            <Package className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">DragKit</span>
          </Link>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
            <span className="sr-only">Close menu</span>
          </Button>
        </div>

        <ScrollArea className="h-[calc(100vh-4rem)]">
          <div className="px-4 py-6">
            {/* Main Navigation */}
            <nav className="space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={onClose}
                  className={cn(
                    'flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    location.pathname === item.href ||
                      (item.href !== '/' && location.pathname.startsWith(item.href))
                      ? 'bg-accent text-accent-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  {item.name}
                  <ChevronRight className="h-4 w-4" />
                </Link>
              ))}
            </nav>

            {/* Docs Sections */}
            <div className="mt-8 space-y-6">
              {docsSections.map((section) => (
                <div key={section.title}>
                  <h4 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {section.title}
                  </h4>
                  <nav className="space-y-1">
                    {section.items.map((item) => (
                      <Link
                        key={item.href}
                        to={item.href}
                        onClick={onClose}
                        className={cn(
                          'block rounded-md px-3 py-2 text-sm transition-colors',
                          location.pathname === item.href
                            ? 'bg-accent text-accent-foreground font-medium'
                            : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                        )}
                      >
                        {item.title}
                      </Link>
                    ))}
                  </nav>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-8 px-3">
              <Button asChild className="w-full" onClick={onClose}>
                <Link to="/docs">
                  Get Started
                </Link>
              </Button>
            </div>
          </div>
        </ScrollArea>
      </div>
    </>
  )
}
