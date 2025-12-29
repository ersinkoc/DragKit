import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, GripVertical, Layout, Grid3X3, Columns } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const examples = [
  {
    id: 'basic-sortable',
    title: 'Basic Sortable List',
    description:
      'A simple sortable list with vertical reordering. Perfect for todo lists and basic ordering needs.',
    icon: GripVertical,
    tags: ['sortable', 'vertical'],
  },
  {
    id: 'kanban-board',
    title: 'Kanban Board',
    description:
      'A full-featured Kanban board with multiple columns and cross-column item movement.',
    icon: Columns,
    tags: ['sortable', 'multi-container'],
  },
  {
    id: 'grid-layout',
    title: 'Grid Layout',
    description:
      'A responsive grid layout with drag and drop reordering for dashboard-style interfaces.',
    icon: Grid3X3,
    tags: ['grid', 'responsive'],
  },
  {
    id: 'nested-containers',
    title: 'Nested Containers',
    description:
      'Demonstrates nested droppable containers for complex hierarchical structures.',
    icon: Layout,
    tags: ['nested', 'advanced'],
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
}

export function Examples() {
  return (
    <div className="container py-12">
      <div className="max-w-3xl mb-12">
        <h1 className="text-4xl font-bold mb-4">Examples</h1>
        <p className="text-lg text-muted-foreground">
          Explore real-world examples built with DragKit. Each example
          demonstrates different features and patterns you can use in your own
          applications.
        </p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid gap-6 md:grid-cols-2"
      >
        {examples.map((example) => (
          <motion.div key={example.id} variants={itemVariants}>
            <Card className="h-full hover:border-primary/50 transition-colors group">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4">
                    <example.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {example.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors">
                  {example.title}
                </CardTitle>
                <CardDescription className="text-base">
                  {example.description}
                </CardDescription>
                <div className="pt-4">
                  <Button variant="ghost" size="sm" asChild className="p-0">
                    <Link to={`/examples/${example.id}`}>
                      View Example
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </div>
              </CardHeader>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <div className="mt-16 text-center">
        <p className="text-muted-foreground mb-4">
          Want to try DragKit interactively?
        </p>
        <Button size="lg" asChild>
          <Link to="/playground">
            Open Playground
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  )
}
