import { CodeBlock } from '@/components/code/CodeBlock'
import { Callout } from '@/components/shared/Callout'

const useDraggableExample = `import { useDraggable } from '@oxog/dragkit/react'

function DraggableCard({ id, children }) {
  const {
    setNodeRef,    // Ref to attach to the element
    listeners,     // Event listeners for drag initiation
    attributes,    // ARIA attributes for accessibility
    isDragging,    // Whether this item is being dragged
    transform,     // Current transform (x, y)
  } = useDraggable({
    id,                    // Required: unique identifier
    data: { type: 'card' }, // Optional: custom data
    disabled: false,       // Optional: disable dragging
  })

  const style = {
    transform: transform
      ? \`translate(\${transform.x}px, \${transform.y}px)\`
      : undefined,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
    >
      {children}
    </div>
  )
}`

const useDroppableExample = `import { useDroppable } from '@oxog/dragkit/react'

function DropZone({ id, children }) {
  const {
    setNodeRef,    // Ref to attach to the element
    isOver,        // Whether a draggable is over this zone
    active,        // The currently dragged item (if over)
  } = useDroppable({
    id,                          // Required: unique identifier
    accept: ['card', 'task'],    // Optional: accepted types
    disabled: false,             // Optional: disable dropping
    data: { column: 'todo' },    // Optional: custom data
  })

  return (
    <div
      ref={setNodeRef}
      className={isOver ? 'bg-blue-100' : 'bg-gray-50'}
    >
      {children}
      {isOver && <div className="text-sm">Drop here!</div>}
    </div>
  )
}`

const useSortableExample = `import { useSortable, SortableContext } from '@oxog/dragkit/react'

function SortableItem({ id }) {
  const {
    setNodeRef,
    listeners,
    attributes,
    isDragging,
    transform,
    transition,    // CSS transition for animations
    index,         // Current index in the list
  } = useSortable({ id })

  const style = {
    transform: transform
      ? \`translate(\${transform.x}px, \${transform.y}px)\`
      : undefined,
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
    >
      Item {id}
    </div>
  )
}

function SortableList({ items }) {
  return (
    <SortableContext items={items} strategy="vertical">
      {items.map((id) => (
        <SortableItem key={id} id={id} />
      ))}
    </SortableContext>
  )
}`

const useDragContextExample = `import { useDragContext } from '@oxog/dragkit/react'

function DragStatus() {
  const {
    isDragging,        // Whether any drag is active
    activeDraggable,   // The currently dragged item
    activeDroppable,   // The droppable being hovered
    draggables,        // Map of all registered draggables
    droppables,        // Map of all registered droppables
  } = useDragContext()

  return (
    <div className="p-4 bg-gray-100 rounded">
      <p>Dragging: {isDragging ? 'Yes' : 'No'}</p>
      {activeDraggable && (
        <p>Active: {activeDraggable.id}</p>
      )}
      {activeDroppable && (
        <p>Over: {activeDroppable.id}</p>
      )}
    </div>
  )
}`

export function HooksReference() {
  return (
    <article className="prose prose-zinc dark:prose-invert max-w-none">
      <h1>Hooks Reference</h1>
      <p className="lead">
        Complete API reference for all DragKit React hooks. Each hook is
        designed to be composable and type-safe.
      </p>

      <h2 id="usedraggable">useDraggable</h2>
      <p>
        Makes an element draggable. Returns refs, listeners, and state for
        managing drag behavior.
      </p>

      <CodeBlock
        code={useDraggableExample}
        language="tsx"
        filename="DraggableCard.tsx"
        showLineNumbers
      />

      <h3>Options</h3>
      <div className="not-prose my-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Option</th>
              <th className="text-left py-2">Type</th>
              <th className="text-left py-2">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-2 font-mono text-xs">id</td>
              <td className="py-2 font-mono text-xs">string</td>
              <td className="py-2">Unique identifier (required)</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 font-mono text-xs">data</td>
              <td className="py-2 font-mono text-xs">object</td>
              <td className="py-2">Custom data to attach</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 font-mono text-xs">disabled</td>
              <td className="py-2 font-mono text-xs">boolean</td>
              <td className="py-2">Disable dragging</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 font-mono text-xs">handle</td>
              <td className="py-2 font-mono text-xs">string</td>
              <td className="py-2">CSS selector for drag handle</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="usedroppable">useDroppable</h2>
      <p>
        Designates an element as a drop zone. Tracks when draggables are
        hovering over it.
      </p>

      <CodeBlock
        code={useDroppableExample}
        language="tsx"
        filename="DropZone.tsx"
        showLineNumbers
      />

      <h3>Options</h3>
      <div className="not-prose my-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Option</th>
              <th className="text-left py-2">Type</th>
              <th className="text-left py-2">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-2 font-mono text-xs">id</td>
              <td className="py-2 font-mono text-xs">string</td>
              <td className="py-2">Unique identifier (required)</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 font-mono text-xs">accept</td>
              <td className="py-2 font-mono text-xs">string[] | function</td>
              <td className="py-2">Filter accepted draggables</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 font-mono text-xs">disabled</td>
              <td className="py-2 font-mono text-xs">boolean</td>
              <td className="py-2">Disable dropping</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 font-mono text-xs">data</td>
              <td className="py-2 font-mono text-xs">object</td>
              <td className="py-2">Custom data for the zone</td>
            </tr>
          </tbody>
        </table>
      </div>

      <Callout type="tip" title="Accept Function">
        The <code>accept</code> option can be a function for complex filtering:
        <code className="block mt-2">accept: (draggable) =&gt; draggable.data.priority === 'high'</code>
      </Callout>

      <h2 id="usesortable">useSortable</h2>
      <p>
        Combines draggable and droppable for sortable list items. Works with
        <code>SortableContext</code> for efficient reordering.
      </p>

      <CodeBlock
        code={useSortableExample}
        language="tsx"
        filename="SortableList.tsx"
        showLineNumbers
      />

      <h2 id="usedragcontext">useDragContext</h2>
      <p>
        Access the global drag state from any component. Useful for building
        custom drag indicators or overlays.
      </p>

      <CodeBlock
        code={useDragContextExample}
        language="tsx"
        filename="DragStatus.tsx"
        showLineNumbers
      />
    </article>
  )
}
