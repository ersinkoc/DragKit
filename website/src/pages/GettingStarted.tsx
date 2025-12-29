export default function GettingStarted() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold mb-8">Getting Started</h1>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Installation</h2>
        <pre className="mb-4">
          <code>npm install @oxog/dragkit</code>
        </pre>
        <p className="text-zinc-600 dark:text-zinc-400">
          Or with yarn:
        </p>
        <pre>
          <code>yarn add @oxog/dragkit</code>
        </pre>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Basic Usage (React)</h2>
        <pre>
          <code>{`import { DragProvider, useDraggable, useDroppable } from '@oxog/dragkit/react'

function DraggableItem() {
  const { setNodeRef, attributes, listeners, isDragging } = useDraggable({
    id: 'draggable-1',
    data: { type: 'item' }
  })

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      Drag me!
    </div>
  )
}

function DroppableZone() {
  const { setNodeRef, isOver } = useDroppable({
    id: 'droppable-1'
  })

  return (
    <div
      ref={setNodeRef}
      style={{ background: isOver ? '#e0e0e0' : '#f5f5f5' }}
    >
      Drop here
    </div>
  )
}

function App() {
  return (
    <DragProvider>
      <DraggableItem />
      <DroppableZone />
    </DragProvider>
  )
}`}</code>
        </pre>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Sortable List</h2>
        <pre>
          <code>{`import { DragProvider, SortableContext, useSortable } from '@oxog/dragkit/react'

function SortableItem({ id }: { id: string }) {
  const { setNodeRef, attributes, listeners, isDragging, transform } = useSortable({
    id
  })

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{
        transform: transform ? \`translate(\${transform.x}px, \${transform.y}px)\` : undefined,
        opacity: isDragging ? 0.5 : 1
      }}
    >
      {id}
    </div>
  )
}

function SortableList() {
  const [items, setItems] = useState(['Item 1', 'Item 2', 'Item 3'])

  return (
    <DragProvider>
      <SortableContext items={items}>
        {items.map(item => (
          <SortableItem key={item} id={item} />
        ))}
      </SortableContext>
    </DragProvider>
  )
}`}</code>
        </pre>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Using Plugins</h2>
        <pre>
          <code>{`import { createDragKit } from '@oxog/dragkit'
import { autoScroll, keyboardSensor } from '@oxog/dragkit/plugins'

const kernel = await createDragKit({
  plugins: [
    autoScroll({ speed: 10 }),
    keyboardSensor()
  ]
})`}</code>
        </pre>
      </section>
    </div>
  )
}
