import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from '@/components/layout/Sidebar'
import { ChevronRight, Home } from 'lucide-react'
import { Link } from 'react-router-dom'

const pathTitles: Record<string, string> = {
  '/docs': 'Introduction',
  '/docs/installation': 'Installation',
  '/docs/quick-start': 'Quick Start',
  '/docs/concepts': 'Core Concepts',
  '/docs/hooks': 'Hooks Reference',
  '/docs/react': 'React',
  '/docs/vue': 'Vue',
  '/docs/svelte': 'Svelte',
}

export function DocsLayout() {
  const location = useLocation()
  const currentTitle = pathTitles[location.pathname] || 'Documentation'

  return (
    <div className="container flex-1">
      <div className="flex gap-8 lg:gap-12">
        <Sidebar className="hidden md:block" />
        <main className="flex-1 py-8 min-w-0">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link to="/" className="hover:text-foreground transition-colors">
              <Home className="h-4 w-4" />
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link to="/docs" className="hover:text-foreground transition-colors">
              Docs
            </Link>
            {location.pathname !== '/docs' && (
              <>
                <ChevronRight className="h-4 w-4" />
                <span className="text-foreground font-medium">{currentTitle}</span>
              </>
            )}
          </nav>

          {/* Content */}
          <div className="max-w-3xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
