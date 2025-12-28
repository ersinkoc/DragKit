import { DocsLayout } from '@/components/layout/DocsLayout'
import { Link } from 'react-router-dom'
import { CodeBlock } from '@/components/ui/code-block'
import { IDEWindow } from '@/components/ui/ide-window'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'

export default function Draggable() {
  return (
    <DocsLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-4">Draggable</h1>
          <p className="text-xl text-muted-foreground">
            Make any HTML element draggable with mouse, touch, and keyboard support.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Basic Usage</h2>
          <IDEWindow fileName="basic-draggable.ts">
            <CodeBlock language="typescript">{`import { createDragKit } from '@oxog/dragkit'

const kit = createDragKit()

const element = document.querySelector('.my-card')
const draggable = kit.draggable(element, {
  id: 'card-1',
})

// Later, if needed, you can destroy it
draggable.destroy()`}</CodeBlock>
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
                  Unique identifier for this draggable element. Used to identify the element in events.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base font-mono">handle</CardTitle>
                <CardDescription>
                  <span className="text-sm">string | HTMLElement</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  CSS selector or element that acts as the drag handle. If not specified, the entire element is draggable.
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
                  Custom data to attach to the draggable. Accessible in all drag events.
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
                  Whether the draggable is currently disabled. Can be changed later with draggable.setDisabled().
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Event Handlers</h2>
          <IDEWindow fileName="events.ts">
            <CodeBlock language="typescript">{`kit.draggable(element, {
  id: 'my-item',

  // Called when drag starts
  onDragStart: (event) => {
    console.log('Drag started', event.draggable.id)
    event.draggable.element.classList.add('dragging')
  },

  // Called during drag movement
  onDragMove: (event) => {
    console.log('Position:', event.position)
  },

  // Called when drag ends
  onDragEnd: (event) => {
    console.log('Drag ended')
    event.draggable.element.classList.remove('dragging')
  },

  // Called when drag is cancelled (e.g., ESC key)
  onDragCancel: (event) => {
    console.log('Drag cancelled')
  },
})`}</CodeBlock>
          </IDEWindow>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Drag Handle</h2>
          <p className="text-muted-foreground">
            Restrict dragging to a specific handle element:
          </p>
          <IDEWindow fileName="handle.ts">
            <CodeBlock language="typescript">{`// Using CSS selector
kit.draggable(card, {
  id: 'card-1',
  handle: '.drag-handle',
})

// Using element reference
const handle = card.querySelector('.drag-handle')
kit.draggable(card, {
  id: 'card-1',
  handle: handle,
})`}</CodeBlock>
          </IDEWindow>

          <p className="text-muted-foreground mt-4">
            Example HTML structure:
          </p>
          <CodeBlock language="html">{`<div class="card">
  <div class="drag-handle">
    ⋮⋮ Drag here
  </div>
  <div class="card-content">
    Card content...
  </div>
</div>`}</CodeBlock>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Custom Data</h2>
          <p className="text-muted-foreground">
            Attach custom data to draggables for use in drop handlers:
          </p>
          <IDEWindow fileName="data.ts">
            <CodeBlock language="typescript">{`kit.draggable(element, {
  id: 'task-1',
  data: {
    taskId: 123,
    priority: 'high',
    assignee: 'John Doe',
  },
})

// Access in drop handler
kit.droppable(dropZone, {
  id: 'zone-1',
  onDrop: (event) => {
    const taskData = event.draggable.data
    console.log('Dropped task:', taskData.taskId)
    console.log('Priority:', taskData.priority)
  },
})`}</CodeBlock>
          </IDEWindow>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Methods</h2>
          <div className="space-y-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-mono">draggable.setDisabled(disabled: boolean)</CardTitle>
                <CardDescription>Enable or disable the draggable</CardDescription>
              </CardHeader>
              <CardContent>
                <CodeBlock language="typescript">{`const draggable = kit.draggable(element, { id: 'item-1' })

// Disable dragging
draggable.setDisabled(true)

// Re-enable
draggable.setDisabled(false)`}</CodeBlock>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base font-mono">draggable.setData(data: any)</CardTitle>
                <CardDescription>Update the custom data</CardDescription>
              </CardHeader>
              <CardContent>
                <CodeBlock language="typescript">{`draggable.setData({
  status: 'completed',
  updatedAt: new Date(),
})`}</CodeBlock>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base font-mono">draggable.destroy()</CardTitle>
                <CardDescription>Remove all event listeners and clean up</CardDescription>
              </CardHeader>
              <CardContent>
                <CodeBlock language="typescript">{`// Clean up when element is removed from DOM
draggable.destroy()`}</CodeBlock>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Advanced Example</h2>
          <IDEWindow fileName="advanced.ts">
            <CodeBlock language="typescript">{`const cards = document.querySelectorAll('.card')

cards.forEach((card, index) => {
  const draggable = kit.draggable(card, {
    id: \`card-\${index}\`,
    handle: '.drag-handle',
    data: {
      index,
      title: card.querySelector('h3')?.textContent,
    },

    onDragStart: (event) => {
      // Add visual feedback
      event.draggable.element.style.opacity = '0.5'
      event.draggable.element.style.transform = 'scale(1.05)'

      // Store original position
      const rect = event.draggable.element.getBoundingClientRect()
      event.draggable.data.originalRect = rect
    },

    onDragMove: (event) => {
      // Update position indicator
      const indicator = document.querySelector('.position-indicator')
      indicator.textContent = \`X: \${event.position.x}, Y: \${event.position.y}\`
    },

    onDragEnd: (event) => {
      // Reset visual feedback
      event.draggable.element.style.opacity = '1'
      event.draggable.element.style.transform = 'scale(1)'

      // Calculate distance moved
      const originalRect = event.draggable.data.originalRect
      const newRect = event.draggable.element.getBoundingClientRect()
      const distance = Math.sqrt(
        Math.pow(newRect.x - originalRect.x, 2) +
        Math.pow(newRect.y - originalRect.y, 2)
      )

      console.log(\`Moved \${Math.round(distance)}px\`)
    },

    onDragCancel: (event) => {
      // Reset everything
      event.draggable.element.style.opacity = '1'
      event.draggable.element.style.transform = 'scale(1)'
      console.log('Drag cancelled')
    },
  })
})`}</CodeBlock>
          </IDEWindow>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">TypeScript</h2>
          <p className="text-muted-foreground">
            Full type definitions for type-safe development:
          </p>
          <IDEWindow fileName="types.ts">
            <CodeBlock language="typescript">{`interface DraggableOptions<T = any> {
  id: string
  handle?: string | HTMLElement
  data?: T
  disabled?: boolean
  onDragStart?: (event: DragStartEvent) => void
  onDragMove?: (event: DragMoveEvent) => void
  onDragEnd?: (event: DragEndEvent) => void
  onDragCancel?: (event: DragCancelEvent) => void
}

interface Draggable<T = any> {
  id: string
  element: HTMLElement
  data: T
  setDisabled(disabled: boolean): void
  setData(data: T): void
  destroy(): void
}`}</CodeBlock>
          </IDEWindow>
        </div>

        <div className="mt-12 pt-8 border-t flex items-center justify-between">
          <Link to="/docs/api/create-dragkit" className="text-lg font-semibold hover:underline flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            createDragKit
          </Link>
          <Link to="/docs/api/droppable" className="text-lg font-semibold hover:underline flex items-center gap-2">
            Droppable
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </DocsLayout>
  )
}
