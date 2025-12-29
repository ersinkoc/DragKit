import { CodeBlock } from '@/components/code/CodeBlock'
import { Callout } from '@/components/shared/Callout'

const basicExample = `import { DragProvider, useDraggable, useDroppable } from '@oxog/dragkit/react'

function App() {
  return (
    <DragProvider>
      <div className="flex gap-8 p-8">
        <DraggableItem />
        <DropZone />
      </div>
    </DragProvider>
  )
}

function DraggableItem() {
  const { setNodeRef, listeners, attributes, isDragging } = useDraggable({
    id: 'item-1',
    data: { type: 'card', label: 'Drag me!' }
  })

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={\`p-4 bg-blue-500 text-white rounded-lg cursor-grab
        \${isDragging ? 'opacity-50 scale-105' : ''}\`}
    >
      Drag me!
    </div>
  )
}

function DropZone() {
  const { setNodeRef, isOver } = useDroppable({
    id: 'drop-zone',
    accept: ['card']
  })

  return (
    <div
      ref={setNodeRef}
      className={\`w-48 h-48 border-2 border-dashed rounded-lg flex items-center justify-center
        \${isOver ? 'border-green-500 bg-green-50' : 'border-gray-300'}\`}
    >
      {isOver ? 'Release to drop!' : 'Drop here'}
    </div>
  )
}`

const eventsExample = `import { DragProvider } from '@oxog/dragkit/react'

function App() {
  const handleDragStart = (event) => {
    console.log('Started dragging:', event.active.id)
  }

  const handleDragEnd = (event) => {
    const { active, over } = event
    if (over) {
      console.log(\`Dropped \${active.id} on \${over.id}\`)
    }
  }

  return (
    <DragProvider
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      {/* Your draggables and droppables */}
    </DragProvider>
  )
}`

const sortableExample = `import { DragProvider, useSortable, SortableContext } from '@oxog/dragkit/react'
import { useState } from 'react'

function SortableList() {
  const [items, setItems] = useState(['Item 1', 'Item 2', 'Item 3'])

  const handleDragEnd = (event) => {
    const { active, over } = event
    if (active.id !== over?.id) {
      setItems((items) => {
        const oldIndex = items.indexOf(active.id)
        const newIndex = items.indexOf(over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  return (
    <DragProvider onDragEnd={handleDragEnd}>
      <SortableContext items={items}>
        {items.map((item) => (
          <SortableItem key={item} id={item} />
        ))}
      </SortableContext>
    </DragProvider>
  )
}

function SortableItem({ id }) {
  const { setNodeRef, listeners, attributes, isDragging } = useSortable({ id })

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={\`p-3 bg-white border rounded shadow-sm
        \${isDragging ? 'opacity-50' : ''}\`}
    >
      {id}
    </div>
  )
}`

export function QuickStart() {
  return (
    <article className="prose prose-zinc dark:prose-invert max-w-none">
      <h1>Quick Start</h1>
      <p className="lead">
        Learn the basics of DragKit in under 5 minutes. This guide covers
        creating draggable items, drop zones, and handling drag events.
      </p>

      <h2>Basic Drag and Drop</h2>
      <p>
        The simplest way to get started is with a draggable item and a drop zone.
        Wrap your app with <code>DragProvider</code>, then use the hooks.
      </p>

      <CodeBlock
        code={basicExample}
        language="tsx"
        filename="App.tsx"
        showLineNumbers
      />

      <Callout type="info" title="TypeScript Support">
        All hooks and components are fully typed. Your IDE will provide
        autocomplete and type checking out of the box.
      </Callout>

      <h2>Handling Events</h2>
      <p>
        DragKit provides several events to track the drag lifecycle:
      </p>

      <ul>
        <li><code>onDragStart</code> - When dragging begins</li>
        <li><code>onDragMove</code> - During drag movement</li>
        <li><code>onDragOver</code> - When hovering over a droppable</li>
        <li><code>onDragEnd</code> - When drag operation completes</li>
        <li><code>onDragCancel</code> - When drag is cancelled (e.g., Escape key)</li>
      </ul>

      <CodeBlock
        code={eventsExample}
        language="tsx"
        filename="App.tsx"
        showLineNumbers
      />

      <h2>Sortable Lists</h2>
      <p>
        Creating sortable lists is simple with <code>useSortable</code> and{' '}
        <code>SortableContext</code>:
      </p>

      <CodeBlock
        code={sortableExample}
        language="tsx"
        filename="SortableList.tsx"
        showLineNumbers
      />

      <Callout type="tip" title="Performance Tip">
        For large lists, consider using virtual scrolling with DragKit.
        The library is optimized to work well with windowing libraries.
      </Callout>

      <h2>What's Next?</h2>
      <p>Now that you understand the basics, explore more advanced topics:</p>

      <ul>
        <li><strong>Core Concepts</strong> - Deep dive into the architecture</li>
        <li><strong>Hooks Reference</strong> - Complete API documentation</li>
        <li><strong>Examples</strong> - Real-world implementation patterns</li>
        <li><strong>Accessibility</strong> - Building inclusive drag interfaces</li>
      </ul>
    </article>
  )
}
