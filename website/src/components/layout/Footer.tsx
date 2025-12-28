import React from 'react'
import { Link } from 'react-router-dom'
import { Github, Twitter } from 'lucide-react'

export function Footer() {
  const sections = [
    {
      title: 'Documentation',
      links: [
        { name: 'Getting Started', href: '/docs/getting-started' },
        { name: 'API Reference', href: '/docs/api' },
        { name: 'Examples', href: '/examples' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { name: 'Playground', href: '/playground' },
        { name: 'GitHub', href: 'https://github.com/yourusername/dragkit' },
      ],
    },
  ]

  return (
    <footer className="border-t bg-background">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-lg">
                D
              </div>
              <span className="font-bold text-xl">DragKit</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              A modern, type-safe drag and drop library for React.
            </p>
          </div>

          {/* Links */}
          {sections.map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    {link.href.startsWith('http') ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link.name}
                      </a>
                    ) : (
                      <Link
                        to={link.href}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Social */}
          <div>
            <h3 className="font-semibold mb-4">Community</h3>
            <div className="flex gap-2">
              <a
                href="https://github.com/yourusername/dragkit"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-md border hover:bg-muted transition-colors"
                title="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com/yourusername"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-md border hover:bg-muted transition-colors"
                title="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} DragKit. MIT Licensed.</p>
        </div>
      </div>
    </footer>
  )
}
