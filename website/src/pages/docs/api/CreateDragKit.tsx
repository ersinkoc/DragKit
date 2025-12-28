import { DocsLayout } from '@/components/layout/DocsLayout'
import { Link } from 'react-router-dom'
import { CodeBlock } from '@/components/ui/code-block'
import { IDEWindow } from '@/components/ui/ide-window'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'

export default function CreateDragKit() {
  return (
    <DocsLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-4">createDragKit</h1>
          <p className="text-xl text-muted-foreground">
            Initialize a new DragKit instance with custom configuration and plugins.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Basic Usage</h2>
          <p className="text-muted-foreground">
            The simplest way to get started is to create a DragKit instance with default settings:
          </p>
          <IDEWindow fileName="app.ts">
            <CodeBlock language="typescript">{`import { createDragKit } from '@oxog/dragkit'

// Create a DragKit instance with defaults
const kit = createDragKit()

// Now you can create draggables and droppables
const element = document.querySelector('.my-element')
kit.draggable(element, { id: 'item-1' })`}</CodeBlock>
          </IDEWindow>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Configuration Options</h2>
          <p className="text-muted-foreground">
            Customize DragKit behavior with configuration options:
          </p>
          <IDEWindow fileName="config.ts">
            <CodeBlock language="typescript">{`import { createDragKit } from '@oxog/dragkit'

const kit = createDragKit({
  // Enable/disable sensors
  sensors: {
    mouse: true,      // Enable mouse dragging (default: true)
    touch: true,      // Enable touch dragging (default: true)
    keyboard: true,   // Enable keyboard navigation (default: true)
  },

  // Collision detection algorithm
  collision: 'pointer',  // 'pointer' | 'rectangle' | 'center'

  // Auto-scroll configuration
  autoScroll: {
    enabled: true,
    threshold: 50,    // Distance from edge to trigger scroll
    speed: 10,        // Scroll speed multiplier
  },

  // Animation settings
  animation: {
    duration: 200,    // Animation duration in ms
    easing: 'ease-out',
  },

  // Accessibility
  accessibility: {
    announcements: true,  // Screen reader announcements
    keyboardShortcuts: true,
  },
})`}</CodeBlock>
          </IDEWindow>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">With Plugins</h2>
          <p className="text-muted-foreground">
            Extend DragKit functionality with plugins:
          </p>
          <IDEWindow fileName="plugins.ts">
            <CodeBlock language="typescript">{`import { createDragKit } from '@oxog/dragkit'
import { AutoScrollPlugin } from '@oxog/dragkit/plugins'

const kit = createDragKit({
  plugins: [
    AutoScrollPlugin({
      threshold: 50,
      speed: 15,
    }),
  ],
})

// Or add plugins after initialization
kit.use(AutoScrollPlugin())`}</CodeBlock>
          </IDEWindow>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">API Reference</h2>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-mono">createDragKit(config?)</CardTitle>
              <CardDescription>Creates and returns a new DragKit instance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Parameters</h4>
                <div className="space-y-2">
                  <div className="border-l-2 border-primary pl-4">
                    <code className="text-sm">config</code>
                    <span className="text-muted-foreground text-sm ml-2">(optional)</span>
                    <p className="text-sm text-muted-foreground mt-1">
                      Configuration object for customizing DragKit behavior
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Returns</h4>
                <div className="border-l-2 border-primary pl-4">
                  <code className="text-sm">DragKit</code>
                  <p className="text-sm text-muted-foreground mt-1">
                    A DragKit instance with methods for creating draggables, droppables, and sortables
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Configuration Schema</h2>
          <IDEWindow fileName="types.ts">
            <CodeBlock language="typescript">{`interface DragKitConfig {
  // Sensor configuration
  sensors?: {
    mouse?: boolean
    touch?: boolean
    keyboard?: boolean
  }

  // Collision detection algorithm
  collision?: 'pointer' | 'rectangle' | 'center'

  // Auto-scroll configuration
  autoScroll?: {
    enabled?: boolean
    threshold?: number
    speed?: number
  }

  // Animation settings
  animation?: {
    duration?: number
    easing?: string
  }

  // Accessibility options
  accessibility?: {
    announcements?: boolean
    keyboardShortcuts?: boolean
  }

  // Plugins to load
  plugins?: Plugin[]
}`}</CodeBlock>
          </IDEWindow>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Instance Methods</h2>
          <div className="space-y-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-mono">kit.draggable(element, options)</CardTitle>
                <CardDescription>Make an element draggable</CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base font-mono">kit.droppable(element, options)</CardTitle>
                <CardDescription>Create a drop zone</CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base font-mono">kit.sortable(container, options)</CardTitle>
                <CardDescription>Create a sortable list or grid</CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base font-mono">kit.use(plugin)</CardTitle>
                <CardDescription>Add a plugin to the DragKit instance</CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base font-mono">kit.destroy()</CardTitle>
                <CardDescription>Clean up and remove all event listeners</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Examples</h2>

          <div>
            <h3 className="text-lg font-semibold mb-3">Multiple Instances</h3>
            <p className="text-muted-foreground mb-3">
              You can create multiple DragKit instances with different configurations:
            </p>
            <IDEWindow fileName="multi-instance.ts">
              <CodeBlock language="typescript">{`// Instance for main content
const mainKit = createDragKit({
  collision: 'rectangle',
  animation: { duration: 300 },
})

// Instance for sidebar with different settings
const sidebarKit = createDragKit({
  collision: 'pointer',
  animation: { duration: 150 },
  autoScroll: { enabled: false },
})`}</CodeBlock>
            </IDEWindow>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Cleanup</h3>
            <p className="text-muted-foreground mb-3">
              Always destroy instances when they're no longer needed:
            </p>
            <IDEWindow fileName="cleanup.ts">
              <CodeBlock language="typescript">{`const kit = createDragKit()

// Use the kit...

// Clean up when done
kit.destroy()

// Or in a React useEffect cleanup
useEffect(() => {
  const kit = createDragKit()
  // ...
  return () => kit.destroy()
}, [])`}</CodeBlock>
            </IDEWindow>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t flex items-center justify-between">
          <Link to="/docs/api" className="text-lg font-semibold hover:underline flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            API Reference
          </Link>
          <Link to="/docs/api/draggable" className="text-lg font-semibold hover:underline flex items-center gap-2">
            Draggable
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </DocsLayout>
  )
}
