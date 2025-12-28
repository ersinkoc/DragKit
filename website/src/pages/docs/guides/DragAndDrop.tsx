import { DocsLayout } from '@/components/layout/DocsLayout'
import { CodeBlock } from '@/components/ui/code-block'
import { IDEWindow } from '@/components/ui/ide-window'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export default function DragAndDropGuide() {
  return (
    <DocsLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-4">Drag & Drop Guide</h1>
          <p className="text-xl text-muted-foreground">
            Learn how to implement basic drag and drop functionality from scratch.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Complete Example</h2>
          <p className="text-muted-foreground">
            This guide shows you how to build a simple drag and drop interface where you can move items between containers.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Step 1: HTML Structure</h2>
          <IDEWindow fileName="index.html">
            <CodeBlock language="html">{`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DragKit - Drag & Drop</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="container">
    <div class="source-zone">
      <h2>Available Items</h2>
      <div class="item" data-id="1">Item 1</div>
      <div class="item" data-id="2">Item 2</div>
      <div class="item" data-id="3">Item 3</div>
      <div class="item" data-id="4">Item 4</div>
    </div>

    <div class="target-zone">
      <h2>Drop Zone</h2>
      <p class="placeholder">Drop items here</p>
    </div>
  </div>

  <script type="module" src="app.js"></script>
</body>
</html>`}</CodeBlock>
          </IDEWindow>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Step 2: CSS Styling</h2>
          <IDEWindow fileName="styles.css">
            <CodeBlock language="css">{`* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: system-ui, sans-serif;
  padding: 2rem;
  background: #f5f5f5;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.source-zone,
.target-zone {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

h2 {
  margin-bottom: 1.5rem;
  color: #333;
}

.item {
  padding: 1rem 1.5rem;
  margin-bottom: 0.75rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 8px;
  cursor: move;
  user-select: none;
  transition: all 0.2s;
}

.item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.item.dragging {
  opacity: 0.5;
  transform: scale(1.05);
}

.target-zone {
  min-height: 300px;
  border: 2px dashed #ddd;
}

.target-zone.drag-over {
  border-color: #667eea;
  background: #f0f4ff;
}

.placeholder {
  color: #999;
  text-align: center;
  padding: 4rem 0;
}

.target-zone:has(.item) .placeholder {
  display: none;
}`}</CodeBlock>
          </IDEWindow>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Step 3: JavaScript Implementation</h2>
          <IDEWindow fileName="app.js">
            <CodeBlock language="javascript">{`import { createDragKit } from '@oxog/dragkit'

// Initialize DragKit
const kit = createDragKit()

// Make all items draggable
const items = document.querySelectorAll('.item')
items.forEach((item) => {
  kit.draggable(item, {
    id: item.dataset.id,

    onDragStart: (event) => {
      event.draggable.element.classList.add('dragging')
      console.log('Started dragging:', event.draggable.id)
    },

    onDragEnd: (event) => {
      event.draggable.element.classList.remove('dragging')
      console.log('Stopped dragging:', event.draggable.id)
    },
  })
})

// Make target zone droppable
const targetZone = document.querySelector('.target-zone')
kit.droppable(targetZone, {
  id: 'target',

  onDragEnter: (event) => {
    event.droppable.element.classList.add('drag-over')
  },

  onDragLeave: (event) => {
    event.droppable.element.classList.remove('drag-over')
  },

  onDrop: (event) => {
    event.droppable.element.classList.remove('drag-over')

    // Move the element to target zone
    event.droppable.element.appendChild(event.draggable.element)

    // Log the drop
    console.log(
      'Dropped',
      event.draggable.id,
      'into',
      event.droppable.id
    )

    // Optional: Save to backend
    saveItemPosition(event.draggable.id, 'target')
  },
})

// Optional: Save to backend
async function saveItemPosition(itemId, zone) {
  try {
    await fetch('/api/items/' + itemId, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ zone }),
    })
    console.log('Saved:', itemId, 'to', zone)
  } catch (error) {
    console.error('Failed to save:', error)
  }
}`}</CodeBlock>
          </IDEWindow>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Enhanced Version: Multiple Zones</h2>
          <p className="text-muted-foreground">
            Let's extend this to support dragging between multiple zones:
          </p>
          <IDEWindow fileName="multi-zone.js">
            <CodeBlock language="javascript">{`import { createDragKit } from '@oxog/dragkit'

const kit = createDragKit()

// Make items draggable
document.querySelectorAll('.item').forEach((item) => {
  kit.draggable(item, {
    id: item.dataset.id,
    data: {
      title: item.textContent,
      zone: item.closest('[data-zone]').dataset.zone,
    },

    onDragStart: (event) => {
      event.draggable.element.classList.add('dragging')
    },

    onDragEnd: (event) => {
      event.draggable.element.classList.remove('dragging')
    },
  })
})

// Make all zones droppable
document.querySelectorAll('[data-zone]').forEach((zone) => {
  kit.droppable(zone, {
    id: zone.dataset.zone,

    // Optional: Only accept certain items
    accept: (draggable) => {
      // Example: Don't allow dropping in the same zone
      return draggable.data.zone !== zone.dataset.zone
    },

    onDragEnter: (event) => {
      event.droppable.element.classList.add('drag-over')
    },

    onDragLeave: (event) => {
      event.droppable.element.classList.remove('drag-over')
    },

    onDrop: (event) => {
      event.droppable.element.classList.remove('drag-over')

      // Move element
      event.droppable.element.appendChild(event.draggable.element)

      // Update data
      event.draggable.data.zone = event.droppable.id

      // Emit custom event
      kit.emit('item:moved', {
        itemId: event.draggable.id,
        fromZone: event.draggable.data.zone,
        toZone: event.droppable.id,
      })
    },
  })
})

// Listen to custom events
kit.on('item:moved', (data) => {
  console.log('Item moved:', data)

  // Update UI
  updateZoneCounts()

  // Save to backend
  saveItemMove(data)
})

function updateZoneCounts() {
  document.querySelectorAll('[data-zone]').forEach((zone) => {
    const count = zone.querySelectorAll('.item').length
    const counter = zone.querySelector('.count')
    if (counter) {
      counter.textContent = count
    }
  })
}

async function saveItemMove(data) {
  await fetch('/api/items/move', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}`}</CodeBlock>
          </IDEWindow>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Advanced Features</h2>

          <div className="space-y-3">
            <div className="border-l-4 border-primary pl-4">
              <h3 className="font-semibold mb-1">Copy Instead of Move</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Clone elements instead of moving them:
              </p>
              <CodeBlock language="javascript">{`onDrop: (event) => {
  // Clone the element
  const clone = event.draggable.element.cloneNode(true)

  // Add to target
  event.droppable.element.appendChild(clone)

  // Make the clone draggable
  kit.draggable(clone, {
    id: generateUniqueId(),
    // ... options
  })
}`}</CodeBlock>
            </div>

            <div className="border-l-4 border-primary pl-4">
              <h3 className="font-semibold mb-1">Prevent Invalid Drops</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Use the accept filter to control what can be dropped:
              </p>
              <CodeBlock language="javascript">{`kit.droppable(zone, {
  id: 'premium-zone',
  accept: (draggable) => {
    // Only accept premium items
    return draggable.data.tier === 'premium'
  },
  // ...
})`}</CodeBlock>
            </div>

            <div className="border-l-4 border-primary pl-4">
              <h3 className="font-semibold mb-1">Undo Functionality</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Track moves for undo/redo:
              </p>
              <CodeBlock language="javascript">{`const history = []

kit.on('drop', (event) => {
  history.push({
    item: event.draggable.element,
    from: event.draggable.element.parentElement,
    to: event.droppable.element,
  })
})

function undo() {
  const last = history.pop()
  if (last) {
    last.from.appendChild(last.item)
  }
}`}</CodeBlock>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t flex items-center justify-between">
          <div />
          <Link to="/docs/guides/sortable-lists" className="text-lg font-semibold hover:underline flex items-center gap-2">
            Sortable Lists
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </DocsLayout>
  )
}
