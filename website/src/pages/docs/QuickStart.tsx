import { DocsLayout } from '@/components/layout/DocsLayout'
import { Link } from 'react-router-dom'
import { CodeBlock } from '@/components/code/CodeBlock'
import { IDEWindow } from '@/components/code/IDEWindow'
import { ArrowRight, ArrowLeft } from 'lucide-react'

export default function QuickStart() {
  return (
    <DocsLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-4">Quick Start</h1>
          <p className="text-xl text-muted-foreground">
            Get up and running with DragKit in 5 minutes
          </p>
        </div>

        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">1. Install DragKit</h2>
            <CodeBlock
              language="bash"
              code="npm install @oxog/dragkit"
              showLineNumbers={false}
            />
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">2. Initialize DragKit</h2>
            <p className="text-muted-foreground mb-4">
              Create a new DragKit instance. This will load the core plugins and set up the event system.
            </p>
            <CodeBlock
              filename="app.js"
              language="javascript"
              code={`import { createDragKit } from '@oxog/dragkit'

// Create DragKit instance
const kit = await createDragKit()

console.log('DragKit ready!', kit.version)`}
            />
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">3. Make an Element Draggable</h2>
            <p className="text-muted-foreground mb-4">
              Select an element and make it draggable:
            </p>
            <IDEWindow
              filename="draggable.js"
              language="javascript"
              code={`import { createDragKit } from '@oxog/dragkit'

const kit = await createDragKit()

// Get element
const element = document.querySelector('.card')

// Make it draggable
const draggable = kit.draggable(element, {
  id: 'my-card',
  onDragStart: (event) => {
    console.log('Started dragging:', event.draggable.id)
  },
  onDragEnd: (event) => {
    console.log('Stopped dragging:', event.draggable.id)
  }
})`}
            />
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">4. Create a Drop Zone</h2>
            <p className="text-muted-foreground mb-4">
              Create a droppable area where users can drop draggable elements:
            </p>
            <CodeBlock
              filename="droppable.js"
              language="javascript"
              code={`// Create a drop zone
const dropzone = document.querySelector('.dropzone')

const droppable = kit.droppable(dropzone, {
  id: 'my-dropzone',
  onDrop: (event) => {
    console.log('Dropped:', event.draggable.id)
    console.log('Into:', event.droppable.id)
  }
})`}
            />
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">5. Create a Sortable List</h2>
            <p className="text-muted-foreground mb-4">
              Build a sortable list with smooth animations:
            </p>
            <CodeBlock
              filename="sortable.js"
              language="javascript"
              code={`// Get container element
const list = document.querySelector('.todo-list')

// Make it sortable
const sortable = kit.sortable(list, {
  id: 'todos',
  items: ['task-1', 'task-2', 'task-3'],
  direction: 'vertical',
  animation: {
    duration: 200,
    easing: 'ease-out'
  },
  onSortEnd: (event) => {
    console.log('New order:', event.items)
  }
})`}
            />
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">Complete Example</h2>
            <p className="text-muted-foreground mb-4">
              Here's a complete HTML + JavaScript example:
            </p>
            <IDEWindow
              filename="index.html"
              language="html"
              code={`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>DragKit Demo</title>
  <style>
    .card {
      padding: 20px;
      margin: 10px;
      background: #f0f0f0;
      border-radius: 8px;
      cursor: move;
    }
    .dropzone {
      min-height: 200px;
      padding: 20px;
      border: 2px dashed #ccc;
      border-radius: 8px;
    }
  </style>
</head>
<body>
  <div class="card">Drag me!</div>
  <div class="dropzone">Drop here</div>

  <script type="module">
    import { createDragKit } from 'https://esm.sh/@oxog/dragkit'

    const kit = await createDragKit()

    // Draggable
    kit.draggable(document.querySelector('.card'), {
      id: 'card-1',
      onDragStart: () => console.log('Drag started'),
      onDragEnd: () => console.log('Drag ended')
    })

    // Droppable
    kit.droppable(document.querySelector('.dropzone'), {
      id: 'zone-1',
      onDrop: () => console.log('Dropped!')
    })
  </script>
</body>
</html>`}
            />
          </div>

          <div className="p-6 bg-secondary rounded-lg">
            <h3 className="font-semibold mb-4">🎉 That's it!</h3>
            <p className="text-sm text-muted-foreground mb-4">
              You now have a working drag & drop implementation. Here's what to explore next:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground ml-4">
              <li>
                <Link to="/docs/api" className="text-foreground hover:underline">
                  API Reference
                </Link> - Learn about all available options
              </li>
              <li>
                <Link to="/examples" className="text-foreground hover:underline">
                  Examples
                </Link> - See more complex examples
              </li>
              <li>
                <Link to="/docs/concepts/architecture" className="text-foreground hover:underline">
                  Core Concepts
                </Link> - Understand how DragKit works
              </li>
              <li>
                <Link to="/playground" className="text-foreground hover:underline">
                  Playground
                </Link> - Try it live in the browser
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t flex items-center justify-between">
          <Link to="/docs/installation" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" />
            <div>
              <p className="text-sm">Previous</p>
              <p className="font-semibold">Installation</p>
            </div>
          </Link>
          <Link to="/docs/concepts/architecture" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <div className="text-right">
              <p className="text-sm">Next</p>
              <p className="font-semibold">Architecture</p>
            </div>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </DocsLayout>
  )
}
