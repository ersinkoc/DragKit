import { DocsLayout } from '@/components/layout/DocsLayout'
import { Link } from 'react-router-dom'
import { CodeBlock } from '@/components/ui/code-block'
import { IDEWindow } from '@/components/ui/ide-window'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'

export default function Droppable() {
  return (
    <DocsLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-4">Droppable</h1>
          <p className="text-xl text-muted-foreground">
            Create drop zones that accept draggable elements with collision detection and visual feedback.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Basic Usage</h2>
          <IDEWindow fileName="basic-droppable.ts">
            <CodeBlock language="typescript">{`import { createDragKit } from '@oxog/dragkit'

const kit = createDragKit()

const dropZone = document.querySelector('.drop-zone')
const droppable = kit.droppable(dropZone, {
  id: 'zone-1',
  onDrop: (event) => {
    console.log('Dropped:', event.draggable.id)
    // Move the element to the drop zone
    event.droppable.element.appendChild(event.draggable.element)
  },
})`}</CodeBlock>
          </IDEWindow>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Options</h2>
          <div className="space-y-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-mono">id</CardTitle>
                <CardDescription>
                  <span className="text-sm">string (required)</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Unique identifier for this droppable zone.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base font-mono">accept</CardTitle>
                <CardDescription>
                  <span className="text-sm">string | string[] | (draggable) =&gt; boolean</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Filter which draggables can be dropped. Can be a type string, array of types, or a function.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base font-mono">data</CardTitle>
                <CardDescription>
                  <span className="text-sm">any</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Custom data to attach to the droppable.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base font-mono">disabled</CardTitle>
                <CardDescription>
                  <span className="text-sm">boolean</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Whether the droppable is currently disabled.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Event Handlers</h2>
          <IDEWindow fileName="events.ts">
            <CodeBlock language="typescript">{`kit.droppable(element, {
  id: 'my-zone',

  // Called when a draggable enters the zone
  onDragEnter: (event) => {
    console.log('Draggable entered:', event.draggable.id)
    event.droppable.element.classList.add('drag-over')
  },

  // Called while draggable is over the zone
  onDragOver: (event) => {
    console.log('Draggable over zone')
  },

  // Called when a draggable leaves the zone
  onDragLeave: (event) => {
    console.log('Draggable left')
    event.droppable.element.classList.remove('drag-over')
  },

  // Called when a draggable is dropped
  onDrop: (event) => {
    console.log('Dropped:', event.draggable.id)
    event.droppable.element.classList.remove('drag-over')

    // Move element to drop zone
    event.droppable.element.appendChild(event.draggable.element)
  },
})`}</CodeBlock>
          </IDEWindow>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Accept Filter</h2>
          <p className="text-muted-foreground">
            Control which draggables can be dropped using the accept option:
          </p>

          <div>
            <h3 className="text-lg font-semibold mb-3">Accept by Type</h3>
            <IDEWindow fileName="accept-type.ts">
              <CodeBlock language="typescript">{`// Create draggables with types
kit.draggable(card, {
  id: 'card-1',
  data: { type: 'card' },
})

kit.draggable(image, {
  id: 'image-1',
  data: { type: 'image' },
})

// Accept only cards
kit.droppable(cardZone, {
  id: 'card-zone',
  accept: (draggable) => draggable.data.type === 'card',
  onDrop: (event) => {
    console.log('Card dropped')
  },
})

// Accept multiple types
kit.droppable(mixedZone, {
  id: 'mixed-zone',
  accept: (draggable) => ['card', 'image'].includes(draggable.data.type),
})`}</CodeBlock>
            </IDEWindow>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Custom Accept Logic</h3>
            <IDEWindow fileName="accept-custom.ts">
              <CodeBlock language="typescript">{`kit.droppable(premiumZone, {
  id: 'premium-zone',
  accept: (draggable) => {
    // Only accept premium items
    return draggable.data.isPremium === true
  },
})

kit.droppable(limitedZone, {
  id: 'limited-zone',
  data: { maxItems: 5, currentItems: 0 },
  accept: (draggable) => {
    // Don't accept if zone is full
    const zone = document.querySelector('#limited-zone')
    return zone.children.length < 5
  },
  onDrop: (event) => {
    event.droppable.data.currentItems++
  },
})`}</CodeBlock>
            </IDEWindow>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Visual Feedback</h2>
          <p className="text-muted-foreground">
            Add visual feedback when draggables enter/leave drop zones:
          </p>
          <IDEWindow fileName="visual-feedback.ts">
            <CodeBlock language="typescript">{`kit.droppable(zone, {
  id: 'feedback-zone',

  onDragEnter: (event) => {
    const el = event.droppable.element

    // Add highlight class
    el.classList.add('drop-zone-active')

    // Change border color
    el.style.borderColor = '#3b82f6'

    // Show acceptance indicator
    const canDrop = event.droppable.accept?.(event.draggable) ?? true
    if (canDrop) {
      el.classList.add('can-drop')
    } else {
      el.classList.add('cannot-drop')
    }
  },

  onDragLeave: (event) => {
    const el = event.droppable.element

    // Remove all classes
    el.classList.remove('drop-zone-active', 'can-drop', 'cannot-drop')

    // Reset border
    el.style.borderColor = ''
  },

  onDrop: (event) => {
    const el = event.droppable.element

    // Cleanup
    el.classList.remove('drop-zone-active', 'can-drop')

    // Add success animation
    el.classList.add('drop-success')
    setTimeout(() => el.classList.remove('drop-success'), 300)
  },
})`}</CodeBlock>
          </IDEWindow>

          <p className="text-muted-foreground mt-4">
            Example CSS:
          </p>
          <CodeBlock language="css">{`.drop-zone {
  border: 2px dashed #d1d5db;
  transition: all 0.2s;
}

.drop-zone-active {
  border-style: solid;
  background: #f3f4f6;
}

.can-drop {
  border-color: #3b82f6;
  background: #dbeafe;
}

.cannot-drop {
  border-color: #ef4444;
  background: #fee2e2;
  cursor: not-allowed;
}

.drop-success {
  animation: pulse 0.3s ease-out;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
}`}</CodeBlock>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Methods</h2>
          <div className="space-y-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-mono">droppable.setDisabled(disabled: boolean)</CardTitle>
                <CardDescription>Enable or disable the droppable</CardDescription>
              </CardHeader>
              <CardContent>
                <CodeBlock language="typescript">{`const droppable = kit.droppable(element, { id: 'zone-1' })

// Disable drops
droppable.setDisabled(true)

// Re-enable
droppable.setDisabled(false)`}</CodeBlock>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base font-mono">droppable.setData(data: any)</CardTitle>
                <CardDescription>Update the custom data</CardDescription>
              </CardHeader>
              <CardContent>
                <CodeBlock language="typescript">{`droppable.setData({
  category: 'completed',
  itemCount: 5,
})`}</CodeBlock>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base font-mono">droppable.destroy()</CardTitle>
                <CardDescription>Remove all event listeners and clean up</CardDescription>
              </CardHeader>
              <CardContent>
                <CodeBlock language="typescript">{`droppable.destroy()`}</CodeBlock>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Complete Example</h2>
          <IDEWindow fileName="complete-example.ts">
            <CodeBlock language="typescript">{`const kit = createDragKit()

// Create draggable cards
const cards = document.querySelectorAll('.card')
cards.forEach((card) => {
  kit.draggable(card, {
    id: card.dataset.id,
    data: {
      type: card.dataset.type,
      priority: card.dataset.priority,
    },
  })
})

// Create drop zones with different acceptance criteria
const zones = {
  high: kit.droppable(document.querySelector('#high-priority'), {
    id: 'high-zone',
    accept: (draggable) => draggable.data.priority === 'high',

    onDragEnter: (e) => {
      e.droppable.element.classList.add('drag-over')
    },

    onDragLeave: (e) => {
      e.droppable.element.classList.remove('drag-over')
    },

    onDrop: (e) => {
      e.droppable.element.classList.remove('drag-over')
      e.droppable.element.appendChild(e.draggable.element)

      // Update backend
      updateTaskPriority(e.draggable.id, 'high')
    },
  }),

  medium: kit.droppable(document.querySelector('#medium-priority'), {
    id: 'medium-zone',
    accept: (draggable) => draggable.data.priority === 'medium',
    // ... same handlers
  }),

  low: kit.droppable(document.querySelector('#low-priority'), {
    id: 'low-zone',
    accept: (draggable) => draggable.data.priority === 'low',
    // ... same handlers
  }),
}

async function updateTaskPriority(taskId: string, priority: string) {
  await fetch('/api/tasks/' + taskId, {
    method: 'PATCH',
    body: JSON.stringify({ priority }),
  })
}`}</CodeBlock>
          </IDEWindow>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">TypeScript</h2>
          <IDEWindow fileName="types.ts">
            <CodeBlock language="typescript">{`interface DroppableOptions<T = any> {
  id: string
  accept?: (draggable: Draggable) => boolean
  data?: T
  disabled?: boolean
  onDragEnter?: (event: DragEnterEvent) => void
  onDragOver?: (event: DragOverEvent) => void
  onDragLeave?: (event: DragLeaveEvent) => void
  onDrop?: (event: DropEvent) => void
}

interface Droppable<T = any> {
  id: string
  element: HTMLElement
  data: T
  accept?: (draggable: Draggable) => boolean
  setDisabled(disabled: boolean): void
  setData(data: T): void
  destroy(): void
}`}</CodeBlock>
          </IDEWindow>
        </div>

        <div className="mt-12 pt-8 border-t flex items-center justify-between">
          <Link to="/docs/api/draggable" className="text-lg font-semibold hover:underline flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Draggable
          </Link>
          <Link to="/docs/api/sortable" className="text-lg font-semibold hover:underline flex items-center gap-2">
            Sortable
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </DocsLayout>
  )
}
