import { DocsLayout } from '@/components/layout/DocsLayout'
import { Link } from 'react-router-dom'
import { CodeBlock } from '@/components/ui/code-block'
import { IDEWindow } from '@/components/ui/ide-window'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'

export default function Events() {
  return (
    <DocsLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-4">Events</h1>
          <p className="text-xl text-muted-foreground">
            Complete guide to DragKit's event system and all available event types.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Event System</h2>
          <p className="text-muted-foreground">
            DragKit uses a pub/sub event system that allows you to listen to drag and drop events both locally (on individual elements) and globally (on the DragKit instance).
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Local Events</h2>
          <p className="text-muted-foreground">
            Local events are registered on individual draggables and droppables:
          </p>
          <IDEWindow fileName="local-events.ts">
            <CodeBlock language="typescript">{`kit.draggable(element, {
  id: 'item-1',

  // Local event handlers
  onDragStart: (event) => {
    console.log('This item started dragging')
  },

  onDragEnd: (event) => {
    console.log('This item stopped dragging')
  },
})`}</CodeBlock>
          </IDEWindow>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Global Events</h2>
          <p className="text-muted-foreground">
            Global events listen to all drag and drop activity:
          </p>
          <IDEWindow fileName="global-events.ts">
            <CodeBlock language="typescript">{`const kit = createDragKit()

// Listen to all drag starts
kit.on('drag:start', (event) => {
  console.log('Any item started dragging:', event.draggable.id)
})

// Listen to all drops
kit.on('drop', (event) => {
  console.log('Item dropped:', event.draggable.id)
  console.log('Into zone:', event.droppable.id)
})

// Remove listener
const unsubscribe = kit.on('drag:move', handler)
unsubscribe() // Stop listening`}</CodeBlock>
          </IDEWindow>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Drag Events</h2>

          <Card className="mb-4">
            <CardHeader>
              <CardTitle className="text-lg font-mono">drag:start</CardTitle>
              <CardDescription>Fired when dragging begins</CardDescription>
            </CardHeader>
            <CardContent>
              <CodeBlock language="typescript">{`interface DragStartEvent {
  draggable: Draggable
  position: { x: number; y: number }
  timestamp: number
}`}</CodeBlock>
              <p className="text-sm text-muted-foreground mt-3">
                Use this to add visual feedback, track analytics, or prepare the UI for dragging.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-4">
            <CardHeader>
              <CardTitle className="text-lg font-mono">drag:move</CardTitle>
              <CardDescription>Fired continuously during drag movement</CardDescription>
            </CardHeader>
            <CardContent>
              <CodeBlock language="typescript">{`interface DragMoveEvent {
  draggable: Draggable
  position: { x: number; y: number }
  delta: { x: number; y: number }
  timestamp: number
}`}</CodeBlock>
              <p className="text-sm text-muted-foreground mt-3">
                Use this to update position indicators or implement custom drag behavior.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-4">
            <CardHeader>
              <CardTitle className="text-lg font-mono">drag:end</CardTitle>
              <CardDescription>Fired when dragging ends (successfully or cancelled)</CardDescription>
            </CardHeader>
            <CardContent>
              <CodeBlock language="typescript">{`interface DragEndEvent {
  draggable: Draggable
  position: { x: number; y: number }
  timestamp: number
  cancelled: boolean
}`}</CodeBlock>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-mono">drag:cancel</CardTitle>
              <CardDescription>Fired when drag is cancelled (ESC key or invalid drop)</CardDescription>
            </CardHeader>
            <CardContent>
              <CodeBlock language="typescript">{`interface DragCancelEvent {
  draggable: Draggable
  reason: 'escape' | 'invalid-drop' | 'manual'
  timestamp: number
}`}</CodeBlock>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Drop Events</h2>

          <Card className="mb-4">
            <CardHeader>
              <CardTitle className="text-lg font-mono">drag:enter</CardTitle>
              <CardDescription>Fired when draggable enters a droppable zone</CardDescription>
            </CardHeader>
            <CardContent>
              <CodeBlock language="typescript">{`interface DragEnterEvent {
  draggable: Draggable
  droppable: Droppable
  timestamp: number
}`}</CodeBlock>
            </CardContent>
          </Card>

          <Card className="mb-4">
            <CardHeader>
              <CardTitle className="text-lg font-mono">drag:over</CardTitle>
              <CardDescription>Fired continuously while over a droppable</CardDescription>
            </CardHeader>
            <CardContent>
              <CodeBlock language="typescript">{`interface DragOverEvent {
  draggable: Draggable
  droppable: Droppable
  position: { x: number; y: number }
  timestamp: number
}`}</CodeBlock>
            </CardContent>
          </Card>

          <Card className="mb-4">
            <CardHeader>
              <CardTitle className="text-lg font-mono">drag:leave</CardTitle>
              <CardDescription>Fired when draggable leaves a droppable zone</CardDescription>
            </CardHeader>
            <CardContent>
              <CodeBlock language="typescript">{`interface DragLeaveEvent {
  draggable: Draggable
  droppable: Droppable
  timestamp: number
}`}</CodeBlock>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-mono">drop</CardTitle>
              <CardDescription>Fired when draggable is successfully dropped</CardDescription>
            </CardHeader>
            <CardContent>
              <CodeBlock language="typescript">{`interface DropEvent {
  draggable: Draggable
  droppable: Droppable
  position: { x: number; y: number }
  timestamp: number
}`}</CodeBlock>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Sort Events</h2>

          <Card className="mb-4">
            <CardHeader>
              <CardTitle className="text-lg font-mono">sort:start</CardTitle>
              <CardDescription>Fired when sorting begins</CardDescription>
            </CardHeader>
            <CardContent>
              <CodeBlock language="typescript">{`interface SortStartEvent {
  item: HTMLElement
  container: HTMLElement
  index: number
  timestamp: number
}`}</CodeBlock>
            </CardContent>
          </Card>

          <Card className="mb-4">
            <CardHeader>
              <CardTitle className="text-lg font-mono">sort</CardTitle>
              <CardDescription>Fired when item order changes</CardDescription>
            </CardHeader>
            <CardContent>
              <CodeBlock language="typescript">{`interface SortEvent {
  item: HTMLElement
  from: HTMLElement
  to: HTMLElement
  oldIndex: number
  newIndex: number
  order: string[]
  timestamp: number
}`}</CodeBlock>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-mono">sort:end</CardTitle>
              <CardDescription>Fired when sorting ends</CardDescription>
            </CardHeader>
            <CardContent>
              <CodeBlock language="typescript">{`interface SortEndEvent {
  item: HTMLElement
  container: HTMLElement
  oldIndex: number
  newIndex: number
  order: string[]
  timestamp: number
}`}</CodeBlock>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Event Patterns</h2>

          <div>
            <h3 className="text-lg font-semibold mb-3">Analytics Tracking</h3>
            <IDEWindow fileName="analytics.ts">
              <CodeBlock language="typescript">{`const kit = createDragKit()

// Track all drag interactions
kit.on('drag:start', (event) => {
  analytics.track('Drag Started', {
    item: event.draggable.id,
    timestamp: event.timestamp,
  })
})

kit.on('drop', (event) => {
  analytics.track('Item Dropped', {
    item: event.draggable.id,
    zone: event.droppable.id,
    duration: event.timestamp - dragStartTime,
  })
})`}</CodeBlock>
            </IDEWindow>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Undo/Redo System</h3>
            <IDEWindow fileName="undo-redo.ts">
              <CodeBlock language="typescript">{`const history: Action[] = []
let historyIndex = -1

kit.on('sort', (event) => {
  // Save action to history
  const action = {
    type: 'sort',
    from: event.oldIndex,
    to: event.newIndex,
    item: event.item.id,
  }

  history.splice(historyIndex + 1)
  history.push(action)
  historyIndex++
})

function undo() {
  if (historyIndex < 0) return

  const action = history[historyIndex]
  // Reverse the action
  sortable.moveItem(action.to, action.from)

  historyIndex--
}

function redo() {
  if (historyIndex >= history.length - 1) return

  historyIndex++
  const action = history[historyIndex]
  // Reapply the action
  sortable.moveItem(action.from, action.to)
}`}</CodeBlock>
            </IDEWindow>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Auto-save</h3>
            <IDEWindow fileName="auto-save.ts">
              <CodeBlock language="typescript">{`let saveTimeout: number

kit.on('sort', (event) => {
  // Debounce auto-save
  clearTimeout(saveTimeout)
  saveTimeout = setTimeout(() => {
    saveOrder(event.order)
  }, 1000)
})

kit.on('drop', (event) => {
  // Immediate save on drop
  updateItemZone(event.draggable.id, event.droppable.id)
})`}</CodeBlock>
            </IDEWindow>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Global Loading State</h3>
            <IDEWindow fileName="loading-state.ts">
              <CodeBlock language="typescript">{`let isDragging = false

kit.on('drag:start', () => {
  isDragging = true
  document.body.style.cursor = 'grabbing'
  document.body.classList.add('is-dragging')
})

kit.on('drag:end', () => {
  isDragging = false
  document.body.style.cursor = ''
  document.body.classList.remove('is-dragging')
})

// Prevent other interactions while dragging
document.addEventListener('click', (e) => {
  if (isDragging) {
    e.preventDefault()
    e.stopPropagation()
  }
}, { capture: true })`}</CodeBlock>
            </IDEWindow>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Event Methods</h2>
          <div className="space-y-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-mono">kit.on(event, handler)</CardTitle>
                <CardDescription>Listen to an event</CardDescription>
              </CardHeader>
              <CardContent>
                <CodeBlock language="typescript">{`const unsubscribe = kit.on('drag:start', (event) => {
  console.log('Drag started')
})

// Returns unsubscribe function
unsubscribe()`}</CodeBlock>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base font-mono">kit.off(event, handler?)</CardTitle>
                <CardDescription>Stop listening to an event</CardDescription>
              </CardHeader>
              <CardContent>
                <CodeBlock language="typescript">{`// Remove specific handler
kit.off('drag:start', myHandler)

// Remove all handlers for an event
kit.off('drag:start')`}</CodeBlock>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base font-mono">kit.once(event, handler)</CardTitle>
                <CardDescription>Listen to an event once</CardDescription>
              </CardHeader>
              <CardContent>
                <CodeBlock language="typescript">{`// Automatically unsubscribes after first call
kit.once('drop', (event) => {
  console.log('First drop detected')
})`}</CodeBlock>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base font-mono">kit.emit(event, data)</CardTitle>
                <CardDescription>Manually emit an event</CardDescription>
              </CardHeader>
              <CardContent>
                <CodeBlock language="typescript">{`// Custom event
kit.emit('custom:event', { data: 'value' })`}</CodeBlock>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t flex items-center justify-between">
          <Link to="/docs/api/sortable-grid" className="text-lg font-semibold hover:underline flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Sortable Grid
          </Link>
          <Link to="/docs/api/types" className="text-lg font-semibold hover:underline flex items-center gap-2">
            Types
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </DocsLayout>
  )
}
