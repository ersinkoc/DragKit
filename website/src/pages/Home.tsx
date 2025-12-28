import React from 'react'
import { Hero } from '@/components/home/Hero'
import { Features } from '@/components/home/Features'
import { CodePreview } from '@/components/home/CodePreview'

export function Home() {
  return (
    <div className="flex flex-col">
      <Hero />
      <Features />
      <CodePreview />
    </div>
  )
}
