import { Header } from './Header'
import { Footer } from './Footer'
import { Sidebar } from './Sidebar'

interface DocsLayoutProps {
  children: React.ReactNode
}

export function DocsLayout({ children }: DocsLayoutProps) {
  return (
    <div className="min-h-screen">
      <Header />
      <div className="container mx-auto flex">
        <Sidebar />
        <main className="flex-1 ml-64 py-8 px-8">
          <div className="max-w-3xl">
            {children}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  )
}
