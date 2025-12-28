import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Hero } from '@/components/home/Hero'
import { Features } from '@/components/home/Features'
import { InstallCommand } from '@/components/home/InstallCommand'
import { CodePreview } from '@/components/home/CodePreview'

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <div id="features">
          <Features />
        </div>
        <div id="install">
          <InstallCommand />
        </div>
        <div id="examples">
          <CodePreview />
        </div>
      </main>
      <Footer />
    </div>
  )
}
