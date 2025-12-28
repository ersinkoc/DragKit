import React from 'react'
import { motion } from 'framer-motion'
import {
  Zap,
  Code,
  Shield,
  Smartphone,
  Accessibility,
  Package,
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

const features = [
  {
    icon: Zap,
    title: 'Lightning Fast',
    description:
      'Optimized for performance with minimal re-renders and efficient event handling.',
  },
  {
    icon: Code,
    title: 'Type-Safe',
    description:
      'Built with TypeScript from the ground up. Full type safety and IntelliSense support.',
  },
  {
    icon: Shield,
    title: 'Framework Agnostic',
    description:
      'Works with React, Vue, or vanilla JavaScript. Use it with your favorite framework.',
  },
  {
    icon: Smartphone,
    title: 'Touch Support',
    description:
      'First-class support for touch devices. Works seamlessly on mobile and desktop.',
  },
  {
    icon: Accessibility,
    title: 'Accessible',
    description:
      'WCAG 2.1 compliant with full keyboard navigation and screen reader support.',
  },
  {
    icon: Package,
    title: 'Zero Dependencies',
    description:
      'No external dependencies. Just 12KB minified and gzipped.',
  },
]

export function Features() {
  return (
    <section className="container py-24 md:py-32 bg-muted/30">
      <div className="mx-auto max-w-5xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Everything you need
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            DragKit provides all the features you need to build modern drag and drop interfaces.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="mb-2">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
