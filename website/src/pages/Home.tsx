import { Hero } from '@/components/home/Hero'
import { Features } from '@/components/home/Features'
import { CodePreview } from '@/components/home/CodePreview'

export function Home() {
  return (
    <main>
      <Hero />
      <Features />
      <CodePreview />
    </main>
  )
}
