import { DocsLayout } from '@/components/layout/DocsLayout'
import { Link } from 'react-router-dom'
import { CodeBlock } from '@/components/ui/code-block'
import { IDEWindow } from '@/components/ui/ide-window'
import { ArrowLeft, ArrowRight } from 'lucide-react'

export default function EventSystem() {
  return (
    <DocsLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-4">Event System</h1>
          <p className="text-xl text-muted-foreground">
            DragKit uses a powerful pub/sub event system for loose coupling and extensibility.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Pub/Sub Pattern</h2>
          <p className="text-muted-foreground">
            The event system allows components to communicate without direct dependencies. Publishers emit events,
            and subscribers listen for them, enabling a highly decoupled architecture.
          </p>
          <IDEWindow fileName="pubsub.ts">
            <CodeBlock language="typescript">{`// Publisher (doesn't know who's listening)
kit.emit('drag:start', { draggable })

// Subscribers (don't know who published)
kit.on('drag:start', handler1)
kit.on('drag:start', handler2)
kit.on('drag:start', handler3)`}</CodeBlock>
          </IDEWindow>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Event Flow</h2>
          <div className="bg-muted p-6 rounded-lg font-mono text-sm">
            <pre>{`User Action (mouse/touch/keyboard)
         ↓
    Sensor detects input
         ↓
  Sensor emits event to Event Bus
         ↓
Event Bus notifies all subscribers
         ↓
┌────────────┬────────────┬────────────┐
│  Kernel    │  Plugins   │ Your Code  │
│  handlers  │  handlers  │  handlers  │
└────────────┴────────────┴────────────┘`}</pre>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Listening to Events</h2>
          <IDEWindow fileName="listening.ts">
            <CodeBlock language="typescript">{`const kit = createDragKit()

// Subscribe to an event
const unsubscribe = kit.on('drag:start', (event) => {
  console.log('Drag started', event.draggable.id)
})

// Later, unsubscribe
unsubscribe()

// Or use kit.off()
kit.off('drag:start', handler)

// Listen once
kit.once('drop', (event) => {
  console.log('First drop detected')
})`}</CodeBlock>
          </IDEWindow>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Event Priority</h2>
          <p className="text-muted-foreground">
            Events are processed in registration order. Register early to process events first:
          </p>
          <IDEWindow fileName="priority.ts">
            <CodeBlock language="typescript">{`// This runs first
kit.on('drag:start', () => {
  console.log('1st')
})

// This runs second
kit.on('drag:start', () => {
  console.log('2nd')
})

// This runs third
kit.on('drag:start', () => {
  console.log('3rd')
})`}</CodeBlock>
          </IDEWindow>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Event Namespacing</h2>
          <p className="text-muted-foreground">
            Use namespaces to organize related events and avoid conflicts:
          </p>
          <IDEWindow fileName="namespacing.ts">
            <CodeBlock language="typescript">{`// Core drag events
kit.on('drag:start', handler)
kit.on('drag:move', handler)
kit.on('drag:end', handler)

// Sort events
kit.on('sort:start', handler)
kit.on('sort', handler)
kit.on('sort:end', handler)

// Custom plugin events
kit.on('autoscroll:trigger', handler)
kit.on('animation:complete', handler)`}</CodeBlock>
          </IDEWindow>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Wildcard Listeners</h2>
          <IDEWindow fileName="wildcards.ts">
            <CodeBlock language="typescript">{`// Listen to all events (useful for debugging)
kit.on('*', (eventName, data) => {
  console.log(\`Event: \${eventName}\`, data)
})

// Listen to all drag events
kit.on('drag:*', (specificEvent, data) => {
  console.log(\`Drag event: \${specificEvent}\`, data)
})`}</CodeBlock>
          </IDEWindow>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Stopping Propagation</h2>
          <IDEWindow fileName="propagation.ts">
            <CodeBlock language="typescript">{`kit.on('drag:start', (event) => {
  if (someCondition) {
    // Stop this drag from starting
    event.preventDefault()
    return false
  }
})

// Later handlers won't run if prevented`}</CodeBlock>
          </IDEWindow>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Custom Events</h2>
          <p className="text-muted-foreground">
            Emit your own custom events for application-specific logic:
          </p>
          <IDEWindow fileName="custom-events.ts">
            <CodeBlock language="typescript">{`// Define custom events
kit.on('task:moved', (event) => {
  updateDatabase(event.taskId, event.newColumn)
  showNotification('Task moved!')
})

kit.on('board:reorder', (event) => {
  saveOrder(event.order)
})

// Emit custom events
kit.droppable(zone, {
  id: 'zone-1',
  onDrop: (event) => {
    // Emit custom event
    kit.emit('task:moved', {
      taskId: event.draggable.id,
      newColumn: event.droppable.id,
    })
  },
})`}</CodeBlock>
          </IDEWindow>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Async Event Handlers</h2>
          <IDEWindow fileName="async-handlers.ts">
            <CodeBlock language="typescript">{`kit.on('drop', async (event) => {
  // Show loading state
  event.droppable.element.classList.add('loading')

  try {
    // Async operation
    await saveToBackend({
      itemId: event.draggable.id,
      zoneId: event.droppable.id,
    })

    // Success feedback
    showToast('Saved successfully')
  } catch (error) {
    // Handle error
    console.error('Save failed:', error)

    // Revert UI
    event.draggable.element.remove()
  } finally {
    // Remove loading state
    event.droppable.element.classList.remove('loading')
  }
})`}</CodeBlock>
          </IDEWindow>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Error Handling</h2>
          <IDEWindow fileName="error-handling.ts">
            <CodeBlock language="typescript">{`// Global error handler
kit.on('error', (error) => {
  console.error('DragKit error:', error)
  // Send to error tracking service
  Sentry.captureException(error)
})

// Handle errors in event handlers
kit.on('drag:start', (event) => {
  try {
    // Your code
    riskyOperation()
  } catch (error) {
    kit.emit('error', {
      message: 'Drag start failed',
      error,
      event,
    })
  }
})`}</CodeBlock>
          </IDEWindow>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Performance Tips</h2>
          <div className="space-y-3">
            <div className="border-l-4 border-primary pl-4">
              <h3 className="font-semibold mb-1">1. Debounce Expensive Operations</h3>
              <IDEWindow fileName="debounce.ts">
                <CodeBlock language="typescript">{`let saveTimeout: number

kit.on('sort', (event) => {
  clearTimeout(saveTimeout)
  saveTimeout = setTimeout(() => {
    saveOrder(event.order)
  }, 500)
})`}</CodeBlock>
              </IDEWindow>
            </div>

            <div className="border-l-4 border-primary pl-4">
              <h3 className="font-semibold mb-1">2. Unsubscribe When Done</h3>
              <IDEWindow fileName="unsubscribe.ts">
                <CodeBlock language="typescript">{`useEffect(() => {
  const unsubscribe = kit.on('drag:start', handler)
  return () => unsubscribe()
}, [])`}</CodeBlock>
              </IDEWindow>
            </div>

            <div className="border-l-4 border-primary pl-4">
              <h3 className="font-semibold mb-1">3. Batch Updates</h3>
              <IDEWindow fileName="batch.ts">
                <CodeBlock language="typescript">{`let updates: any[] = []

kit.on('drag:move', (event) => {
  updates.push(event)
})

// Process in batches
setInterval(() => {
  if (updates.length > 0) {
    processBatch(updates)
    updates = []
  }
}, 100)`}</CodeBlock>
              </IDEWindow>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t flex items-center justify-between">
          <Link to="/docs/concepts/plugins" className="text-lg font-semibold hover:underline flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Plugins
          </Link>
          <Link to="/docs/concepts/sensors" className="text-lg font-semibold hover:underline flex items-center gap-2">
            Sensors
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </DocsLayout>
  )
}
