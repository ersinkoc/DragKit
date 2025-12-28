import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/shared/Logo'
import { Github, ArrowRight } from 'lucide-react'
import { REPOSITORY_URL, DESCRIPTION } from '@/lib/constants'

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 dark:from-blue-500/5 dark:via-purple-500/5 dark:to-pink-500/5" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-8"
        >
          <Logo className="scale-150" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent"
        >
          DragKit
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto"
        >
          {DESCRIPTION}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Button size="lg" className="text-lg h-12 px-8">
            Get Started
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <Button size="lg" variant="outline" className="text-lg h-12 px-8" asChild>
            <a href={REPOSITORY_URL} target="_blank" rel="noopener noreferrer">
              <Github className="w-5 h-5 mr-2" />
              View on GitHub
            </a>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 flex flex-wrap justify-center gap-4 text-sm text-muted-foreground"
        >
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            Zero Dependencies
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            TypeScript Native
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary">
            <span className="w-2 h-2 rounded-full bg-purple-500" />
            {'< 5KB Gzipped'}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
