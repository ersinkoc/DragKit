import { DocsLayout } from '@/components/layout/DocsLayout'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ArrowRight, Package, Boxes, Code, Zap } from 'lucide-react'

export default function DocsHome() {
  return (
    <DocsLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-4">Documentation</h1>
          <p className="text-xl text-muted-foreground">
            Everything you need to know about DragKit. Learn the basics, explore the API, and build amazing drag & drop experiences.
          </p>
        </div>

        <div className="flex gap-4">
          <Button asChild size="lg">
            <Link to="/docs/quick-start">
              Quick Start
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/docs/api/create-dragkit">
              API Reference
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => window.location.href = '/docs/installation'}>
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-4">
                <Package className="w-6 h-6 text-white" />
              </div>
              <CardTitle>Installation</CardTitle>
              <CardDescription>
                Get started by installing DragKit with your favorite package manager
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => window.location.href = '/docs/concepts/architecture'}>
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-4">
                <Boxes className="w-6 h-6 text-white" />
              </div>
              <CardTitle>Core Concepts</CardTitle>
              <CardDescription>
                Understand the micro-kernel architecture and plugin system
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => window.location.href = '/docs/api'}>
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-4">
                <Code className="w-6 h-6 text-white" />
              </div>
              <CardTitle>API Reference</CardTitle>
              <CardDescription>
                Complete API documentation with examples and type definitions
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => window.location.href = '/examples'}>
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <CardTitle>Examples</CardTitle>
              <CardDescription>
                Live examples and demos to get you started quickly
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="mt-12 p-6 bg-secondary rounded-lg">
          <h2 className="text-2xl font-bold mb-4">What is DragKit?</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              DragKit is a zero-dependency drag & drop toolkit built with TypeScript. It uses a micro-kernel architecture with a plugin-based system, making it incredibly flexible and extensible.
            </p>
            <p>
              Unlike other drag & drop libraries, DragKit has:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Zero Dependencies</strong> - Pure TypeScript implementation with no external dependencies</li>
              <li><strong>Framework Agnostic</strong> - Works with vanilla JS, React, Vue, Svelte, and more</li>
              <li><strong>Tiny Bundle Size</strong> - Less than 5KB minified + gzipped</li>
              <li><strong>Type-Safe</strong> - Built with TypeScript strict mode, full type safety</li>
              <li><strong>Accessible</strong> - Keyboard navigation, screen readers, ARIA attributes</li>
              <li><strong>Extensible</strong> - Plugin system for custom features</li>
            </ul>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">Core Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Draggable</h3>
              <p className="text-sm text-muted-foreground">
                Make any element draggable with a simple API
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Droppable</h3>
              <p className="text-sm text-muted-foreground">
                Create drop zones that accept draggable elements
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Sortable</h3>
              <p className="text-sm text-muted-foreground">
                Build sortable lists and grids with smooth animations
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Next</p>
              <Link to="/docs/installation" className="text-lg font-semibold hover:underline flex items-center gap-2">
                Installation
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </DocsLayout>
  )
}
