import React from 'react'
import { Link } from 'react-router-dom'
import { Menu, Github } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/shared/ThemeToggle'
import { cn } from '@/lib/utils'

interface HeaderProps {
  onMobileMenuToggle?: () => void
}

export function Header({ onMobileMenuToggle }: HeaderProps) {
  const navigation = [
    { name: 'Documentation', href: '/docs' },
    { name: 'Examples', href: '/examples' },
    { name: 'Playground', href: '/playground' },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-lg">
              D
            </div>
            <span className="font-bold text-xl">DragKit</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="hidden sm:inline-flex"
          >
            <a
              href="https://github.com/yourusername/dragkit"
              target="_blank"
              rel="noopener noreferrer"
              title="GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
          </Button>

          <ThemeToggle />

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={onMobileMenuToggle}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}
