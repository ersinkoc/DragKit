import { Link } from 'react-router-dom'
import { Github, Package } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="container py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              <span className="font-semibold">DragKit</span>
            </Link>
            <nav className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link to="/docs" className="hover:text-foreground transition-colors">
                Docs
              </Link>
              <Link to="/examples" className="hover:text-foreground transition-colors">
                Examples
              </Link>
              <a
                href="https://github.com/ersinkoc/DragKit"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
              >
                GitHub
              </a>
            </nav>
          </div>

          {/* Right */}
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/ersinkoc/DragKit"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="h-5 w-5" />
            </a>
            <span className="text-sm text-muted-foreground">
              MIT License
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
