import { Logo } from '@/components/shared/Logo'
import { Github } from 'lucide-react'
import { REPOSITORY_URL, AUTHOR } from '@/lib/constants'

export function Footer() {
  return (
    <footer className="border-t bg-secondary/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Logo className="mb-4" />
            <p className="text-sm text-muted-foreground max-w-md">
              Zero-dependency drag & drop toolkit with micro-kernel plugin architecture.
              Built with TypeScript and modern web standards.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  API Reference
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Examples
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Community</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a
                  href={REPOSITORY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors flex items-center gap-2"
                >
                  <Github className="w-4 h-4" />
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href={`${REPOSITORY_URL}/issues`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  Issues
                </a>
              </li>
              <li>
                <a
                  href={`${REPOSITORY_URL}/discussions`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  Discussions
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>
            Built by{' '}
            <a href={REPOSITORY_URL} className="font-medium hover:text-foreground transition-colors">
              {AUTHOR}
            </a>
          </p>
          <p>
            Released under the{' '}
            <a
              href={`${REPOSITORY_URL}/blob/main/LICENSE`}
              className="font-medium hover:text-foreground transition-colors"
            >
              MIT License
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
