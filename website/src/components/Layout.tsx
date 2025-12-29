import { Link, Outlet } from 'react-router-dom'

export default function Layout() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <nav className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-primary-600">DragKit</span>
              </Link>
              <div className="hidden md:flex ml-10 space-x-8">
                <Link to="/docs/getting-started" className="text-zinc-600 dark:text-zinc-400 hover:text-primary-600">
                  Docs
                </Link>
                <Link to="/docs/api" className="text-zinc-600 dark:text-zinc-400 hover:text-primary-600">
                  API
                </Link>
                <Link to="/examples" className="text-zinc-600 dark:text-zinc-400 hover:text-primary-600">
                  Examples
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <a
                href="https://github.com/oxog/dragkit"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-600 dark:text-zinc-400 hover:text-primary-600"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </nav>
      <main>
        <Outlet />
      </main>
      <footer className="border-t border-zinc-200 dark:border-zinc-800 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-zinc-500">
          <p>Built with love by Ersin KOC</p>
          <p className="mt-2">MIT License</p>
        </div>
      </footer>
    </div>
  )
}
