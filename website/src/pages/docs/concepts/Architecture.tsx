import { DocsLayout } from '@/components/layout/DocsLayout'
import { Link } from 'react-router-dom'
import { CodeBlock } from '@/components/ui/code-block'
import { IDEWindow } from '@/components/ui/ide-window'
import { ArrowRight } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'

export default function Architecture() {
  return (
    <DocsLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-4">Architecture</h1>
          <p className="text-xl text-muted-foreground">
            Understanding DragKit's micro-kernel architecture and plugin-based design.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Overview</h2>
          <p className="text-muted-foreground">
            DragKit uses a micro-kernel architecture where a small core provides essential drag and drop functionality,
            and everything else is implemented as plugins. This makes DragKit extremely lightweight, flexible, and extensible.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Core Components</h2>

          <Card className="mb-4">
            <CardHeader>
              <CardTitle className="text-lg">Kernel</CardTitle>
              <CardDescription>The minimal core that coordinates all functionality</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Element registration (draggables, droppables)</li>
                <li>Event bus for pub/sub communication</li>
                <li>Plugin lifecycle management</li>
                <li>Minimal state management</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-4">
            <CardHeader>
              <CardTitle className="text-lg">Sensors</CardTitle>
              <CardDescription>Input detection and handling</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Mouse sensor for desktop interactions</li>
                <li>Touch sensor for mobile devices</li>
                <li>Keyboard sensor for accessibility</li>
                <li>Custom sensor support</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-4">
            <CardHeader>
              <CardTitle className="text-lg">Collision Detection</CardTitle>
              <CardDescription>Algorithms for detecting overlaps</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Pointer collision (cursor position)</li>
                <li>Rectangle collision (bounding boxes)</li>
                <li>Center point collision</li>
                <li>Custom algorithms</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Plugins</CardTitle>
              <CardDescription>Optional features and extensions</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Auto-scroll when dragging near edges</li>
                <li>Animation and transitions</li>
                <li>Accessibility announcements</li>
                <li>Custom behavior</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Architecture Diagram</h2>
          <div className="bg-muted p-8 rounded-lg font-mono text-sm">
            <pre className="text-center">{`
┌─────────────────────────────────────────────────────────┐
│                     Application Layer                   │
│                  (Your Code Using DragKit)              │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                      Public API                         │
│         draggable() │ droppable() │ sortable()         │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                    Micro-Kernel                         │
│  ┌────────────┐  ┌────────────┐  ┌─────────────────┐  │
│  │  Registry  │  │ Event Bus  │  │ Plugin Manager  │  │
│  └────────────┘  └────────────┘  └─────────────────┘  │
└─────────────────────────────────────────────────────────┘
         │                │                │
         ▼                ▼                ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   Sensors    │  │  Collision   │  │   Plugins    │
│              │  │  Detection   │  │              │
│ • Mouse      │  │              │  │ • AutoScroll │
│ • Touch      │  │ • Pointer    │  │ • Animation  │
│ • Keyboard   │  │ • Rectangle  │  │ • Custom     │
└──────────────┘  └──────────────┘  └──────────────┘
`}</pre>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">How It Works</h2>

          <div>
            <h3 className="text-lg font-semibold mb-3">1. Initialization</h3>
            <p className="text-muted-foreground mb-3">
              When you create a DragKit instance, the kernel initializes the event bus,
              registers default sensors, and loads plugins.
            </p>
            <IDEWindow fileName="initialization.ts">
              <CodeBlock language="typescript">{`const kit = createDragKit({
  sensors: { mouse: true, touch: true, keyboard: true },
  plugins: [AutoScrollPlugin()],
})

// Internally:
// 1. Create event bus
// 2. Attach sensors
// 3. Install plugins
// 4. Ready to register elements`}</CodeBlock>
            </IDEWindow>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">2. Element Registration</h3>
            <p className="text-muted-foreground mb-3">
              When you register a draggable or droppable, it's added to the kernel's registry
              and sensors start monitoring it.
            </p>
            <IDEWindow fileName="registration.ts">
              <CodeBlock language="typescript">{`kit.draggable(element, { id: 'item-1' })

// Internally:
// 1. Create draggable instance
// 2. Add to registry
// 3. Attach sensor event listeners
// 4. Emit 'draggable:register' event`}</CodeBlock>
            </IDEWindow>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">3. Drag Lifecycle</h3>
            <p className="text-muted-foreground mb-3">
              During a drag operation, sensors emit events that flow through the event bus,
              triggering collision detection and plugin behaviors.
            </p>
            <IDEWindow fileName="lifecycle.ts">
              <CodeBlock language="typescript">{`// Drag lifecycle:

// 1. User interaction detected
MouseSensor → emits 'sensor:start' → Kernel

// 2. Drag starts
Kernel → emits 'drag:start' → Your handlers + Plugins

// 3. Drag moves
MouseSensor → emits 'sensor:move' → Kernel
           → runs collision detection
           → emits 'drag:move', 'drag:enter', 'drag:leave'

// 4. Drag ends
MouseSensor → emits 'sensor:end' → Kernel
           → emits 'drag:end' or 'drop'
           → cleanup`}</CodeBlock>
            </IDEWindow>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Event Bus</h2>
          <p className="text-muted-foreground">
            The event bus is the heart of DragKit's architecture. All components communicate through events:
          </p>
          <IDEWindow fileName="event-bus.ts">
            <CodeBlock language="typescript">{`class EventBus {
  private listeners = new Map<string, Set<Function>>()

  on(event: string, handler: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set())
    }
    this.listeners.get(event)!.add(handler)
  }

  emit(event: string, data: any) {
    const handlers = this.listeners.get(event)
    if (handlers) {
      handlers.forEach(handler => handler(data))
    }
  }
}

// This allows loose coupling between components
// Sensors don't know about collision detection
// Plugins don't know about sensors
// Everything communicates through events`}</CodeBlock>
          </IDEWindow>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Benefits</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Small Bundle Size</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                The core is minimal (2KB). Only include plugins you need, keeping your bundle lean.
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Extensible</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Add custom behavior through plugins without modifying the core library.
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Testable</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Each component can be tested in isolation. Mock sensors, collision detection, or plugins.
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Maintainable</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Clear separation of concerns. Changes to sensors don't affect collision detection.
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Performance</h2>
          <p className="text-muted-foreground">
            The micro-kernel architecture enables several performance optimizations:
          </p>

          <div className="space-y-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Lazy Event Listeners</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Sensors only attach listeners when elements are registered. No global listeners polluting the DOM.
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Efficient Collision Detection</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Only checks registered droppables, and you can choose the algorithm that fits your use case.
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">RequestAnimationFrame</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Drag updates are batched and synced with the browser's render cycle for smooth 60fps dragging.
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Feature</th>
                  <th className="text-left p-3">DragKit</th>
                  <th className="text-left p-3">Traditional Libraries</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="border-b">
                  <td className="p-3 font-semibold">Architecture</td>
                  <td className="p-3">Micro-kernel + Plugins</td>
                  <td className="p-3">Monolithic</td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 font-semibold">Core Size</td>
                  <td className="p-3">~2KB</td>
                  <td className="p-3">~15-30KB</td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 font-semibold">Extensibility</td>
                  <td className="p-3">Plugin system</td>
                  <td className="p-3">Limited or none</td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 font-semibold">Dependencies</td>
                  <td className="p-3">Zero</td>
                  <td className="p-3">Often many</td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 font-semibold">Customization</td>
                  <td className="p-3">High (sensors, collision, plugins)</td>
                  <td className="p-3">Limited</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t flex items-center justify-between">
          <div />
          <Link to="/docs/concepts/plugins" className="text-lg font-semibold hover:underline flex items-center gap-2">
            Plugins
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </DocsLayout>
  )
}
