import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Github } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

export function Hero() {
  return (
    <section className="container py-24 md:py-32">
      <div className="mx-auto max-w-5xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm mb-6">
            Modern Drag & Drop Library
          </div>

          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl md:text-7xl mb-6">
            Build intuitive drag & drop
            <br />
            <span className="text-primary">interfaces with ease</span>
          </h1>

          <p className="mx-auto max-w-2xl text-lg text-muted-foreground mb-8">
            DragKit is a modern, type-safe drag and drop library for React.
            Built with accessibility and performance in mind, it provides a
            simple yet powerful API for creating interactive user interfaces.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/docs/getting-started">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a
                href="https://github.com/yourusername/dragkit"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="mr-2 h-4 w-4" />
                View on GitHub
              </a>
            </Button>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto"
        >
          <div>
            <div className="text-3xl font-bold">12KB</div>
            <div className="text-sm text-muted-foreground">Minified + Gzipped</div>
          </div>
          <div>
            <div className="text-3xl font-bold">100%</div>
            <div className="text-sm text-muted-foreground">TypeScript</div>
          </div>
          <div>
            <div className="text-3xl font-bold">A11y</div>
            <div className="text-sm text-muted-foreground">WCAG Compliant</div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
