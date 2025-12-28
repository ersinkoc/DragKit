import React from 'react'
import { Link } from 'react-router-dom'
import { CodeBlock } from '@/components/code/CodeBlock'
import { TerminalWindow } from '@/components/code/TerminalWindow'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export function GettingStarted() {
  return (
    <div className="prose prose-slate dark:prose-invert max-w-none">
      <h1>Getting Started</h1>
      <p className="lead">
        Get up and running with DragKit in just a few minutes. This guide will walk you through
        installation and your first drag and drop implementation.
      </p>

      <h2>Installation</h2>
      <p>Install DragKit using your preferred package manager:</p>

      <TerminalWindow
        content={`npm install dragkit\n# or\nyarn add dragkit\n# or\npnpm add dragkit`}
        title="Terminal"
      />

      <h2>Quick Start</h2>
      <p>
        Here's a minimal example to get you started with DragKit in React:
      </p>

      <CodeBlock
        code={`import { useDraggable, useDroppable } from 'dragkit/react'

function App() {
  const { ref: dragRef, isDragging } = useDraggable({
    id: 'item-1',
    data: { name: 'Item 1' }
  })

  const { ref: dropRef, isOver } = useDroppable({
    id: 'dropzone',
    onDrop: (data) => {
      console.log('Dropped:', data)
    }
  })

  return (
    <div>
      <div
        ref={dragRef}
        style={{ opacity: isDragging ? 0.5 : 1 }}
      >
        Drag me
      </div>

      <div
        ref={dropRef}
        style={{ background: isOver ? '#e0e0e0' : 'white' }}
      >
        Drop here
      </div>
    </div>
  )
}`}
        language="tsx"
        filename="App.tsx"
      />

      <h2>Core Concepts</h2>
      <div className="grid md:grid-cols-2 gap-4 not-prose my-8">
        <Card>
          <CardHeader>
            <CardTitle>Draggable</CardTitle>
            <CardDescription>
              Elements that can be picked up and moved
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Use the <code>useDraggable</code> hook to make elements draggable.
              Track drag state with <code>isDragging</code>.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Droppable</CardTitle>
            <CardDescription>
              Areas where draggable items can be dropped
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Use the <code>useDroppable</code> hook to create drop zones.
              Handle drops with <code>onDrop</code> callback.
            </p>
          </CardContent>
        </Card>
      </div>

      <h2>Next Steps</h2>
      <p>
        Now that you've got DragKit installed and running, explore the documentation to learn more:
      </p>

      <div className="flex flex-col sm:flex-row gap-4 not-prose">
        <Button asChild>
          <Link to="/docs/concepts/core">
            Core Concepts
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to="/docs/api">API Reference</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to="/examples">View Examples</Link>
        </Button>
      </div>
    </div>
  )
}
