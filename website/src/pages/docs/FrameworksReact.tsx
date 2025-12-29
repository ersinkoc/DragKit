import { CodeBlock } from '@/components/code/CodeBlock'
import { Callout } from '@/components/shared/Callout'
import { TerminalWindow } from '@/components/code/TerminalWindow'

const installCode = 'npm install @oxog/dragkit'

const providerSetup = `import { DragProvider } from '@oxog/dragkit/react'

function App() {
  const handleDragStart = (event) => {
    console.log('Drag started:', event.active)
  }

  const handleDragEnd = (event) => {
    const { active, over } = event
    if (over) {
      console.log(\`Dropped \${active.id} onto \${over.id}\`)
      // Handle the drop - update your state here
    }
  }

  return (
    <DragProvider
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <YourApp />
    </DragProvider>
  )
}`

const draggableComponent = `import { useDraggable } from '@oxog/dragkit/react'
import { forwardRef } from 'react'

interface DraggableCardProps {
  id: string
  children: React.ReactNode
}

export const DraggableCard = forwardRef<HTMLDivElement, DraggableCardProps>(
  ({ id, children }, ref) => {
    const {
      setNodeRef,
      listeners,
      attributes,
      isDragging,
      transform,
    } = useDraggable({ id })

    // Merge refs if needed
    const mergedRef = (node: HTMLDivElement) => {
      setNodeRef(node)
      if (typeof ref === 'function') ref(node)
      else if (ref) ref.current = node
    }

    return (
      <div
        ref={mergedRef}
        {...listeners}
        {...attributes}
        className={\`card \${isDragging ? 'dragging' : ''}\`}
        style={{
          transform: transform
            ? \`translate(\${transform.x}px, \${transform.y}px)\`
            : undefined,
        }}
      >
        {children}
      </div>
    )
  }
)`

const overlayExample = `import { DragProvider, DragOverlay, useDragContext } from '@oxog/dragkit/react'

function App() {
  return (
    <DragProvider>
      <ItemList />
      <CustomDragOverlay />
    </DragProvider>
  )
}

function CustomDragOverlay() {
  const { activeDraggable } = useDragContext()

  return (
    <DragOverlay>
      {activeDraggable && (
        <div className="drag-preview">
          Dragging: {activeDraggable.id}
        </div>
      )}
    </DragOverlay>
  )
}`

const typescriptExample = `import { useDraggable, DragEndEvent } from '@oxog/dragkit/react'

interface TaskData {
  type: 'task'
  priority: 'low' | 'medium' | 'high'
  title: string
}

function TaskCard({ task }: { task: Task }) {
  const { setNodeRef, listeners, attributes } = useDraggable<TaskData>({
    id: task.id,
    data: {
      type: 'task',
      priority: task.priority,
      title: task.title,
    },
  })

  return (
    <div ref={setNodeRef} {...listeners} {...attributes}>
      {task.title}
    </div>
  )
}

// Typed event handler
function handleDragEnd(event: DragEndEvent<TaskData>) {
  const { active, over } = event
  // active.data is typed as TaskData
  console.log(active.data.priority) // TypeScript knows this exists
}`

export function FrameworksReact() {
  return (
    <article className="prose prose-zinc dark:prose-invert max-w-none">
      <h1>React Integration</h1>
      <p className="lead">
        DragKit provides first-class React support with hooks, components, and
        full TypeScript integration.
      </p>

      <h2>Installation</h2>
      <TerminalWindow command={installCode} />

      <h2>Setting Up the Provider</h2>
      <p>
        Wrap your app (or the relevant section) with <code>DragProvider</code>.
        This creates the drag context and manages state.
      </p>

      <CodeBlock
        code={providerSetup}
        language="tsx"
        filename="App.tsx"
        showLineNumbers
      />

      <Callout type="info" title="Provider Placement">
        Place the provider as high as needed in your component tree. All
        draggables and droppables must be descendants of the provider.
      </Callout>

      <h2>Creating Draggable Components</h2>
      <p>
        Use the <code>useDraggable</code> hook to make any component draggable.
        Here's a reusable pattern with <code>forwardRef</code>:
      </p>

      <CodeBlock
        code={draggableComponent}
        language="tsx"
        filename="DraggableCard.tsx"
        showLineNumbers
      />

      <h2>Drag Overlay</h2>
      <p>
        For smooth drag animations, use <code>DragOverlay</code> to render a
        custom preview that follows the cursor:
      </p>

      <CodeBlock
        code={overlayExample}
        language="tsx"
        filename="App.tsx"
        showLineNumbers
      />

      <h2>TypeScript Usage</h2>
      <p>
        DragKit is fully typed. You can specify your data types for complete
        type safety:
      </p>

      <CodeBlock
        code={typescriptExample}
        language="tsx"
        filename="TaskCard.tsx"
        showLineNumbers
      />

      <h2>Best Practices</h2>
      <ul>
        <li>
          <strong>Memoize handlers</strong> - Wrap event handlers in{' '}
          <code>useCallback</code> to prevent unnecessary rerenders
        </li>
        <li>
          <strong>Use data attribute</strong> - Pass context via <code>data</code>{' '}
          instead of closures for better performance
        </li>
        <li>
          <strong>Optimize large lists</strong> - Consider virtual scrolling for
          lists with 100+ items
        </li>
        <li>
          <strong>Test with React Testing Library</strong> - DragKit works
          seamlessly with RTL for testing
        </li>
      </ul>

      <Callout type="tip" title="SSR Support">
        DragKit is SSR-safe. Drag functionality initializes on the client after
        hydration, with no server-side errors.
      </Callout>
    </article>
  )
}
