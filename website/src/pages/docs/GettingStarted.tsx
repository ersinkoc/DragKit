import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { CodeBlock } from '@/components/code/CodeBlock'
import { TerminalWindow } from '@/components/code/TerminalWindow'
import { Button } from '@/components/ui/button'

const installCode = 'npm install @oxog/dragkit'

const basicUsage = `import { DragProvider, useDraggable, useDroppable } from '@oxog/dragkit'

function App() {
  return (
    <DragProvider>
      <DraggableItem />
      <DroppableZone />
    </DragProvider>
  )
}

function DraggableItem() {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: 'draggable-1',
  })

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={isDragging ? 'opacity-50' : ''}
    >
      Drag me!
    </div>
  )
}

function DroppableZone() {
  const { setNodeRef, isOver } = useDroppable({
    id: 'droppable-1',
  })

  return (
    <div
      ref={setNodeRef}
      className={isOver ? 'bg-blue-100' : 'bg-gray-100'}
    >
      Drop here
    </div>
  )
}`

export function GettingStarted() {
  return (
    <article className="prose prose-zinc dark:prose-invert max-w-none">
      <h1>Introduction</h1>
      <p className="lead">
        DragKit is a lightweight, type-safe drag and drop library for React
        applications. Built with modern web standards and accessibility in mind.
      </p>

      <h2>Features</h2>
      <ul>
        <li>
          <strong>Zero Dependencies</strong> - No external runtime dependencies
        </li>
        <li>
          <strong>Type-Safe</strong> - Full TypeScript support with comprehensive
          type definitions
        </li>
        <li>
          <strong>Accessible</strong> - WCAG compliant with keyboard navigation
          and screen reader support
        </li>
        <li>
          <strong>Lightweight</strong> - Tree-shakeable, only bundle what you use
        </li>
        <li>
          <strong>Touch Support</strong> - First-class mobile and touch device
          support
        </li>
      </ul>

      <h2>Installation</h2>
      <p>Install DragKit using your preferred package manager:</p>

      <TerminalWindow command={installCode} title="Terminal" />

      <h2>Quick Start</h2>
      <p>
        Here's a minimal example to get you started with DragKit. This example
        shows how to create a basic draggable item and a droppable zone.
      </p>

      <CodeBlock
        code={basicUsage}
        language="tsx"
        filename="App.tsx"
        showLineNumbers
      />

      <h2>Core Concepts</h2>
      <p>DragKit is built around a few key concepts:</p>

      <h3>DragProvider</h3>
      <p>
        The <code>DragProvider</code> component wraps your drag and drop
        interface. It manages the drag state and coordinates between draggable
        and droppable elements.
      </p>

      <h3>useDraggable</h3>
      <p>
        The <code>useDraggable</code> hook makes an element draggable. It
        provides event handlers, refs, and state for handling drag operations.
      </p>

      <h3>useDroppable</h3>
      <p>
        The <code>useDroppable</code> hook designates an element as a drop
        target. It provides state for detecting when a draggable is over the
        drop zone.
      </p>

      <h2>Next Steps</h2>
      <p>Now that you have a basic understanding of DragKit, explore more:</p>

      <div className="not-prose flex flex-wrap gap-4 mt-6">
        <Button asChild>
          <Link to="/docs/installation">
            Installation Guide
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to="/examples">View Examples</Link>
        </Button>
      </div>
    </article>
  )
}
