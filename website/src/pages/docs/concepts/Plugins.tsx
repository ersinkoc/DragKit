import { DocsLayout } from '@/components/layout/DocsLayout'
import { Link } from 'react-router-dom'
import { CodeBlock } from '@/components/ui/code-block'
import { IDEWindow } from '@/components/ui/ide-window'
import { ArrowLeft, ArrowRight } from 'lucide-react'

export default function Plugins() {
  return (
    <DocsLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-4">Plugin System</h1>
          <p className="text-xl text-muted-foreground">
            Extend DragKit's functionality with a powerful plugin system that hooks into the event lifecycle.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">What Are Plugins?</h2>
          <p className="text-muted-foreground">
            Plugins are modular extensions that add features to DragKit without bloating the core library.
            They can listen to events, modify behavior, add new APIs, or integrate with external libraries.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Using Plugins</h2>
          <IDEWindow fileName="using-plugins.ts">
            <CodeBlock language="typescript">{`import { createDragKit } from '@oxog/dragkit'
import { AutoScrollPlugin, SnapToGridPlugin } from '@oxog/dragkit/plugins'

// Option 1: Pass plugins during initialization
const kit = createDragKit({
  plugins: [
    AutoScrollPlugin({ speed: 15 }),
    SnapToGridPlugin({ gridSize: 20 }),
  ],
})

// Option 2: Add plugins after initialization
kit.use(AutoScrollPlugin())`}</CodeBlock>
          </IDEWindow>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Creating a Plugin</h2>
          <p className="text-muted-foreground">
            A plugin is an object with an install method:
          </p>
          <IDEWindow fileName="basic-plugin.ts">
            <CodeBlock language="typescript">{`import { Plugin, DragKit } from '@oxog/dragkit'

const MyPlugin: Plugin = {
  name: 'my-plugin',
  version: '1.0.0',

  install(kit: DragKit) {
    // Access the DragKit instance
    console.log('Plugin installed!')

    // Listen to events
    kit.on('drag:start', (event) => {
      console.log('Drag started:', event.draggable.id)
    })
  },

  destroy() {
    // Cleanup when plugin is removed
    console.log('Plugin destroyed')
  },
}`}</CodeBlock>
          </IDEWindow>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Plugin with Options</h2>
          <p className="text-muted-foreground">
            Use a factory function to accept configuration options:
          </p>
          <IDEWindow fileName="plugin-factory.ts">
            <CodeBlock language="typescript">{`interface LoggerOptions {
  prefix?: string
  events?: string[]
  verbose?: boolean
}

function LoggerPlugin(options: LoggerOptions = {}): Plugin {
  const {
    prefix = '[DragKit]',
    events = ['drag:start', 'drag:end', 'drop'],
    verbose = false,
  } = options

  return {
    name: 'logger',
    version: '1.0.0',

    install(kit: DragKit) {
      events.forEach(eventName => {
        kit.on(eventName, (event) => {
          if (verbose) {
            console.log(\`\${prefix} [\${eventName}]\`, event)
          } else {
            console.log(\`\${prefix} \${eventName}\`)
          }
        })
      })
    },
  }
}

// Usage
const kit = createDragKit({
  plugins: [
    LoggerPlugin({
      prefix: '[App]',
      events: ['drag:start', 'drop'],
      verbose: true,
    }),
  ],
})`}</CodeBlock>
          </IDEWindow>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Real-World Example: Auto-Scroll</h2>
          <IDEWindow fileName="autoscroll-plugin.ts">
            <CodeBlock language="typescript">{`interface AutoScrollOptions {
  threshold?: number // Distance from edge to trigger scroll
  speed?: number     // Scroll speed multiplier
}

function AutoScrollPlugin(options: AutoScrollOptions = {}): Plugin {
  const { threshold = 50, speed = 10 } = options

  let rafId: number
  let isDragging = false

  return {
    name: 'auto-scroll',
    version: '1.0.0',

    install(kit: DragKit) {
      kit.on('drag:start', () => {
        isDragging = true
        startScrollLoop()
      })

      kit.on('drag:end', () => {
        isDragging = false
        if (rafId) cancelAnimationFrame(rafId)
      })

      function startScrollLoop() {
        if (!isDragging) return

        const { clientX, clientY } = getCurrentPointer()
        const viewport = {
          width: window.innerWidth,
          height: window.innerHeight,
        }

        // Calculate scroll deltas
        let dx = 0, dy = 0

        if (clientX < threshold) {
          dx = -speed * (1 - clientX / threshold)
        } else if (clientX > viewport.width - threshold) {
          dx = speed * (1 - (viewport.width - clientX) / threshold)
        }

        if (clientY < threshold) {
          dy = -speed * (1 - clientY / threshold)
        } else if (clientY > viewport.height - threshold) {
          dy = speed * (1 - (viewport.height - clientY) / threshold)
        }

        // Apply scroll
        if (dx !== 0 || dy !== 0) {
          window.scrollBy(dx, dy)
        }

        rafId = requestAnimationFrame(startScrollLoop)
      }
    },

    destroy() {
      if (rafId) cancelAnimationFrame(rafId)
    },
  }
}`}</CodeBlock>
          </IDEWindow>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Plugin Lifecycle</h2>
          <div className="bg-muted p-6 rounded-lg font-mono text-sm">
            <pre>{`1. Plugin Created
   ↓
2. install(kit) called
   ↓
3. Plugin listens to events
   ↓
4. Plugin modifies behavior
   ↓
5. destroy() called (when kit.destroy() is called)
   ↓
6. Plugin cleanup`}</pre>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Advanced Example: Snap to Grid</h2>
          <IDEWindow fileName="snap-to-grid.ts">
            <CodeBlock language="typescript">{`interface SnapToGridOptions {
  gridSize?: number
  visualize?: boolean
}

function SnapToGridPlugin(options: SnapToGridOptions = {}): Plugin {
  const { gridSize = 20, visualize = false } = options

  return {
    name: 'snap-to-grid',
    version: '1.0.0',

    install(kit: DragKit) {
      if (visualize) {
        drawGrid(gridSize)
      }

      kit.on('drag:move', (event) => {
        const { x, y } = event.position

        // Snap to nearest grid point
        const snappedX = Math.round(x / gridSize) * gridSize
        const snappedY = Math.round(y / gridSize) * gridSize

        // Update element position
        event.draggable.element.style.transform =
          \`translate(\${snappedX}px, \${snappedY}px)\`
      })
    },
  }
}

function drawGrid(size: number) {
  const canvas = document.createElement('canvas')
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  canvas.style.position = 'fixed'
  canvas.style.top = '0'
  canvas.style.left = '0'
  canvas.style.pointerEvents = 'none'
  canvas.style.zIndex = '-1'

  const ctx = canvas.getContext('2d')!
  ctx.strokeStyle = '#e5e7eb'

  // Draw vertical lines
  for (let x = 0; x < canvas.width; x += size) {
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, canvas.height)
    ctx.stroke()
  }

  // Draw horizontal lines
  for (let y = 0; y < canvas.height; y += size) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(canvas.width, y)
    ctx.stroke()
  }

  document.body.appendChild(canvas)
}`}</CodeBlock>
          </IDEWindow>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Plugin Best Practices</h2>
          <div className="space-y-3">
            <div className="border-l-4 border-primary pl-4">
              <h3 className="font-semibold mb-1">1. Clean Up Resources</h3>
              <p className="text-sm text-muted-foreground">
                Always implement destroy() to remove event listeners, timers, and DOM elements.
              </p>
            </div>

            <div className="border-l-4 border-primary pl-4">
              <h3 className="font-semibold mb-1">2. Provide Good Defaults</h3>
              <p className="text-sm text-muted-foreground">
                Make all options optional with sensible defaults so the plugin works out of the box.
              </p>
            </div>

            <div className="border-l-4 border-primary pl-4">
              <h3 className="font-semibold mb-1">3. Document Options</h3>
              <p className="text-sm text-muted-foreground">
                Use TypeScript interfaces to document configuration options with JSDoc comments.
              </p>
            </div>

            <div className="border-l-4 border-primary pl-4">
              <h3 className="font-semibold mb-1">4. Use RequestAnimationFrame</h3>
              <p className="text-sm text-muted-foreground">
                For visual updates, use RAF to sync with the browser's render cycle.
              </p>
            </div>

            <div className="border-l-4 border-primary pl-4">
              <h3 className="font-semibold mb-1">5. Namespace Events</h3>
              <p className="text-sm text-muted-foreground">
                If emitting custom events, namespace them like 'plugin-name:event'.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Official Plugins</h2>
          <p className="text-muted-foreground mb-4">
            DragKit includes several official plugins:
          </p>

          <div className="grid gap-3">
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-1">AutoScrollPlugin</h3>
              <p className="text-sm text-muted-foreground">
                Automatically scroll the viewport when dragging near edges
              </p>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-1">AnimationPlugin</h3>
              <p className="text-sm text-muted-foreground">
                Smooth animations for draggable elements
              </p>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-1">AccessibilityPlugin</h3>
              <p className="text-sm text-muted-foreground">
                Screen reader announcements and keyboard shortcuts
              </p>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-1">DebugPlugin</h3>
              <p className="text-sm text-muted-foreground">
                Visual debugging tools for development
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t flex items-center justify-between">
          <Link to="/docs/concepts/architecture" className="text-lg font-semibold hover:underline flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Architecture
          </Link>
          <Link to="/docs/concepts/events" className="text-lg font-semibold hover:underline flex items-center gap-2">
            Event System
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </DocsLayout>
  )
}
