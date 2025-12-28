import { DocsLayout } from '@/components/layout/DocsLayout'
import { Link } from 'react-router-dom'
import { CodeBlock } from '@/components/ui/code-block'
import { IDEWindow } from '@/components/ui/ide-window'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'

export default function Sortable() {
  return (
    <DocsLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-4">Sortable</h1>
          <p className="text-xl text-muted-foreground">
            Create sortable lists with smooth animations and support for multiple containers.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Basic Usage</h2>
          <IDEWindow fileName="basic-sortable.ts">
            <CodeBlock language="typescript">{`import { createDragKit } from '@oxog/dragkit'

const kit = createDragKit()

const list = document.querySelector('.sortable-list')
const sortable = kit.sortable(list, {
  itemSelector: '.list-item',
  onSort: (event) => {
    console.log('New order:', event.order)
  },
})`}</CodeBlock>
          </IDEWindow>

          <p className="text-muted-foreground mt-4">
            Example HTML structure:
          </p>
          <CodeBlock language="html">{`<ul class="sortable-list">
  <li class="list-item" data-id="1">Item 1</li>
  <li class="list-item" data-id="2">Item 2</li>
  <li class="list-item" data-id="3">Item 3</li>
  <li class="list-item" data-id="4">Item 4</li>
</ul>`}</CodeBlock>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Options</h2>
          <div className="space-y-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-mono">itemSelector</CardTitle>
                <CardDescription>
                  <span className="text-sm">string (required)</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  CSS selector for sortable items within the container.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base font-mono">handle</CardTitle>
                <CardDescription>
                  <span className="text-sm">string</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  CSS selector for drag handle within each item.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base font-mono">direction</CardTitle>
                <CardDescription>
                  <span className="text-sm">'vertical' | 'horizontal'</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Direction of the sortable list. Default: 'vertical'.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base font-mono">animation</CardTitle>
                <CardDescription>
                  <span className="text-sm">number</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Animation duration in milliseconds. Default: 150.
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
                  Disable sorting. Default: false.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Event Handlers</h2>
          <IDEWindow fileName="events.ts">
            <CodeBlock language="typescript">{`kit.sortable(list, {
  itemSelector: '.item',

  // Called when sorting starts
  onSortStart: (event) => {
    console.log('Started sorting:', event.item)
    event.item.classList.add('sorting')
  },

  // Called during sort (item position changed)
  onSort: (event) => {
    console.log('New order:', event.order)
    console.log('From index:', event.oldIndex)
    console.log('To index:', event.newIndex)
  },

  // Called when sorting ends
  onSortEnd: (event) => {
    console.log('Finished sorting')
    event.item.classList.remove('sorting')

    // Save new order to backend
    saveOrder(event.order)
  },
})`}</CodeBlock>
          </IDEWindow>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Horizontal List</h2>
          <p className="text-muted-foreground">
            Create a horizontal sortable list:
          </p>
          <IDEWindow fileName="horizontal.ts">
            <CodeBlock language="typescript">{`kit.sortable(container, {
  itemSelector: '.tag',
  direction: 'horizontal',
  animation: 200,
})`}</CodeBlock>
          </IDEWindow>

          <CodeBlock language="html">{`<div class="tag-container" style="display: flex; gap: 8px;">
  <span class="tag">React</span>
  <span class="tag">TypeScript</span>
  <span class="tag">Tailwind</span>
</div>`}</CodeBlock>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Drag Handle</h2>
          <p className="text-muted-foreground">
            Use a drag handle for better UX:
          </p>
          <IDEWindow fileName="handle.ts">
            <CodeBlock language="typescript">{`kit.sortable(list, {
  itemSelector: '.task-item',
  handle: '.drag-handle',
  onSort: (event) => {
    updateTaskOrder(event.order)
  },
})`}</CodeBlock>
          </IDEWindow>

          <CodeBlock language="html">{`<div class="task-item">
  <span class="drag-handle">⋮⋮</span>
  <span class="task-content">Task description</span>
  <button class="delete-btn">Delete</button>
</div>`}</CodeBlock>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Multiple Lists</h2>
          <p className="text-muted-foreground">
            Share items between multiple sortable lists:
          </p>
          <IDEWindow fileName="multiple-lists.ts">
            <CodeBlock language="typescript">{`const group = 'shared'

const todoList = kit.sortable(document.querySelector('#todo'), {
  itemSelector: '.task',
  group: group,
  onSort: (event) => {
    console.log('TODO list updated')
  },
})

const doneList = kit.sortable(document.querySelector('#done'), {
  itemSelector: '.task',
  group: group,
  onSort: (event) => {
    console.log('DONE list updated')

    // Update task status when moved to done
    if (event.from.id !== event.to.id) {
      updateTaskStatus(event.item.dataset.id, 'done')
    }
  },
})`}</CodeBlock>
          </IDEWindow>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Methods</h2>
          <div className="space-y-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-mono">sortable.getOrder()</CardTitle>
                <CardDescription>Get current order of items</CardDescription>
              </CardHeader>
              <CardContent>
                <CodeBlock language="typescript">{`const order = sortable.getOrder()
console.log('Current order:', order)
// ['item-1', 'item-3', 'item-2']`}</CodeBlock>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base font-mono">sortable.setOrder(order: string[])</CardTitle>
                <CardDescription>Programmatically reorder items</CardDescription>
              </CardHeader>
              <CardContent>
                <CodeBlock language="typescript">{`sortable.setOrder(['item-3', 'item-1', 'item-2'])`}</CodeBlock>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base font-mono">sortable.setDisabled(disabled: boolean)</CardTitle>
                <CardDescription>Enable or disable sorting</CardDescription>
              </CardHeader>
              <CardContent>
                <CodeBlock language="typescript">{`// Disable sorting
sortable.setDisabled(true)

// Re-enable
sortable.setDisabled(false)`}</CodeBlock>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base font-mono">sortable.destroy()</CardTitle>
                <CardDescription>Clean up and remove all event listeners</CardDescription>
              </CardHeader>
              <CardContent>
                <CodeBlock language="typescript">{`sortable.destroy()`}</CodeBlock>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Advanced Example</h2>
          <IDEWindow fileName="advanced.ts">
            <CodeBlock language="typescript">{`// Kanban board with multiple columns
const columns = ['todo', 'in-progress', 'review', 'done']

columns.forEach((column) => {
  const element = document.querySelector(\`#\${column}\`)

  kit.sortable(element, {
    itemSelector: '.card',
    handle: '.card-header',
    group: 'kanban',
    animation: 200,

    onSortStart: (event) => {
      // Visual feedback
      event.item.style.opacity = '0.5'

      // Track analytics
      trackEvent('card_drag_start', {
        cardId: event.item.dataset.id,
        fromColumn: column,
      })
    },

    onSort: (event) => {
      // Get column IDs
      const fromColumn = event.from.id
      const toColumn = event.to.id

      // Only update if moved between columns
      if (fromColumn !== toColumn) {
        const cardId = event.item.dataset.id

        // Update backend
        updateCardColumn(cardId, toColumn)

        // Show notification
        showToast(\`Card moved to \${toColumn}\`)

        // Track analytics
        trackEvent('card_moved', {
          cardId,
          from: fromColumn,
          to: toColumn,
        })
      }
    },

    onSortEnd: (event) => {
      // Reset visual feedback
      event.item.style.opacity = '1'

      // Save final order
      const order = sortable.getOrder()
      saveColumnOrder(column, order)
    },
  })
})

async function updateCardColumn(cardId: string, column: string) {
  await fetch(\`/api/cards/\${cardId}\`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ column }),
  })
}`}</CodeBlock>
          </IDEWindow>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">TypeScript</h2>
          <IDEWindow fileName="types.ts">
            <CodeBlock language="typescript">{`interface SortableOptions {
  itemSelector: string
  handle?: string
  direction?: 'vertical' | 'horizontal'
  animation?: number
  group?: string
  disabled?: boolean
  onSortStart?: (event: SortStartEvent) => void
  onSort?: (event: SortEvent) => void
  onSortEnd?: (event: SortEndEvent) => void
}

interface Sortable {
  element: HTMLElement
  getOrder(): string[]
  setOrder(order: string[]): void
  setDisabled(disabled: boolean): void
  destroy(): void
}

interface SortEvent {
  item: HTMLElement
  from: HTMLElement
  to: HTMLElement
  oldIndex: number
  newIndex: number
  order: string[]
}`}</CodeBlock>
          </IDEWindow>
        </div>

        <div className="mt-12 pt-8 border-t flex items-center justify-between">
          <Link to="/docs/api/droppable" className="text-lg font-semibold hover:underline flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Droppable
          </Link>
          <Link to="/docs/api/sortable-grid" className="text-lg font-semibold hover:underline flex items-center gap-2">
            Sortable Grid
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </DocsLayout>
  )
}
