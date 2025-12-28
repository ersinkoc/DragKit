import { Link } from 'react-router-dom'
import { Logo } from '@/components/shared/Logo'
import { ThemeToggle } from '@/components/shared/ThemeToggle'
import { Button } from '@/components/ui/button'
import { Github } from 'lucide-react'
import { REPOSITORY_URL } from '@/lib/constants'

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center">
          <Logo />
        </Link>

        <nav className="flex items-center gap-6">
          <a
            href="#features"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Features
          </a>
          <a
            href="#install"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Install
          </a>
          <a
            href="#examples"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Examples
          </a>

          <div className="flex items-center gap-2 ml-4">
            <Button variant="ghost" size="icon" asChild>
              <a href={REPOSITORY_URL} target="_blank" rel="noopener noreferrer">
                <Github className="h-5 w-5" />
              </a>
            </Button>
            <ThemeToggle />
          </div>
        </nav>
      </div>
    </header>
  )
}
