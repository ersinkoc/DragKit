import { DocsLayout } from '@/components/layout/DocsLayout'
import { Link } from 'react-router-dom'
import { CodeBlock } from '@/components/ui/code-block'
import { IDEWindow } from '@/components/ui/ide-window'
import { ArrowLeft } from 'lucide-react'

export default function Collision() {
  return (
    <DocsLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-4">Collision Detection</h1>
          <p className="text-xl text-muted-foreground">
            Algorithms for detecting when draggable elements overlap with drop zones.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Overview</h2>
          <p className="text-muted-foreground">
            Collision detection determines which droppable zones a draggable element is currently over.
            DragKit provides three built-in algorithms, each optimized for different use cases.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Algorithms</h2>

          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">Pointer (Default)</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Checks if the mouse/touch pointer is inside a droppable's bounding box.
                Fast and intuitive for most use cases.
              </p>
              <IDEWindow fileName="pointer.ts">
                <CodeBlock language="typescript">{`const kit = createDragKit({
  collision: 'pointer', // Default
})

// Best for:
// - General drag and drop
// - Card lists
// - File upload zones
// - Most standard UIs`}</CodeBlock>
              </IDEWindow>
              <div className="mt-3 bg-muted p-4 rounded font-mono text-xs">
                <pre>{`┌─────────────────┐
│   Droppable     │
│                 │
│        •← Pointer
│                 │
└─────────────────┘
Collision: true if pointer is inside box`}</pre>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">Rectangle</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Checks if the draggable's bounding box overlaps with the droppable's bounding box.
                More accurate for large draggable elements.
              </p>
              <IDEWindow fileName="rectangle.ts">
                <CodeBlock language="typescript">{`const kit = createDragKit({
  collision: 'rectangle',
})

// Best for:
// - Large draggable items
// - Image galleries
// - Dashboard widgets
// - Spatial layouts`}</CodeBlock>
              </IDEWindow>
              <div className="mt-3 bg-muted p-4 rounded font-mono text-xs">
                <pre>{`┌─────────────────┐
│   Droppable     │
│  ┌──────────┐   │
│  │Draggable │   │
│  └──────────┘   │
└─────────────────┘
Collision: true if boxes overlap`}</pre>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">Center</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Checks if the draggable's center point is inside the droppable.
                Requires more deliberate placement.
              </p>
              <IDEWindow fileName="center.ts">
                <CodeBlock language="typescript">{`const kit = createDragKit({
  collision: 'center',
})

// Best for:
// - Sortable lists
// - Kanban boards
// - Grid layouts
// - Precise positioning`}</CodeBlock>
              </IDEWindow>
              <div className="mt-3 bg-muted p-4 rounded font-mono text-xs">
                <pre>{`┌─────────────────┐
│   Droppable     │
│        ┌────────┼──┐
│        │   •    │  │← Center point
│        └────────┼──┘
└─────────────────┘
Collision: true if center is inside`}</pre>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Choosing an Algorithm</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Algorithm</th>
                  <th className="text-left p-3">Speed</th>
                  <th className="text-left p-3">Accuracy</th>
                  <th className="text-left p-3">Use When</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-3 font-semibold">Pointer</td>
                  <td className="p-3">⚡⚡⚡ Fast</td>
                  <td className="p-3">Good</td>
                  <td className="p-3">Small draggables, general UI</td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 font-semibold">Rectangle</td>
                  <td className="p-3">⚡⚡ Medium</td>
                  <td className="p-3">Best</td>
                  <td className="p-3">Large draggables, spatial layouts</td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 font-semibold">Center</td>
                  <td className="p-3">⚡⚡⚡ Fast</td>
                  <td className="p-3">Precise</td>
                  <td className="p-3">Sortable lists, deliberate drops</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">How Collision Detection Works</h2>
          <div className="bg-muted p-6 rounded-lg font-mono text-sm">
            <pre>{`1. User moves draggable
   ↓
2. Sensor emits 'sensor:move' event
   ↓
3. Kernel gets draggable position
   ↓
4. Kernel queries all droppables
   ↓
5. For each droppable:
   - Get bounding box
   - Run collision algorithm
   - Check if colliding
   ↓
6. Compare with previous state
   ↓
7. Emit enter/leave/over events
   - 'drag:enter' (newly colliding)
   - 'drag:leave' (no longer colliding)
   - 'drag:over' (still colliding)`}</pre>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Custom Collision Detection</h2>
          <p className="text-muted-foreground">
            Implement your own collision algorithm for specialized needs:
          </p>
          <IDEWindow fileName="custom-collision.ts">
            <CodeBlock language="typescript">{`import { CollisionDetector } from '@oxog/dragkit'

// Custom distance-based collision
class DistanceCollision implements CollisionDetector {
  name = 'distance'
  threshold = 50 // pixels

  detect(draggable, droppable) {
    const dragRect = draggable.element.getBoundingClientRect()
    const dropRect = droppable.element.getBoundingClientRect()

    // Calculate center points
    const dragCenter = {
      x: dragRect.left + dragRect.width / 2,
      y: dragRect.top + dragRect.height / 2,
    }

    const dropCenter = {
      x: dropRect.left + dropRect.width / 2,
      y: dropRect.top + dropRect.height / 2,
    }

    // Calculate distance
    const distance = Math.sqrt(
      Math.pow(dragCenter.x - dropCenter.x, 2) +
      Math.pow(dragCenter.y - dropCenter.y, 2)
    )

    // Collision if within threshold
    return distance < this.threshold
  }
}

// Use custom collision detector
const kit = createDragKit()
kit.use({
  name: 'distance-collision',
  install(kit) {
    kit.setCollisionDetector(new DistanceCollision())
  },
})`}</CodeBlock>
          </IDEWindow>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Performance Optimization</h2>

          <div>
            <h3 className="text-lg font-semibold mb-3">Spatial Partitioning</h3>
            <p className="text-muted-foreground mb-3">
              For scenes with many droppables, use spatial partitioning to reduce checks:
            </p>
            <IDEWindow fileName="spatial-partitioning.ts">
              <CodeBlock language="typescript">{`// Only check droppables in the same region
class GridPartitioning {
  cellSize = 200
  grid = new Map()

  addDroppable(droppable) {
    const cell = this.getCell(droppable.element)
    if (!this.grid.has(cell)) {
      this.grid.set(cell, [])
    }
    this.grid.get(cell).push(droppable)
  }

  getCell(element) {
    const rect = element.getBoundingClientRect()
    const x = Math.floor(rect.left / this.cellSize)
    const y = Math.floor(rect.top / this.cellSize)
    return \`\${x},\${y}\`
  }

  getNearbyDroppables(draggable) {
    const cell = this.getCell(draggable.element)
    return this.grid.get(cell) || []
  }
}

// This reduces O(n) checks to O(k) where k is droppables per cell`}</CodeBlock>
            </IDEWindow>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Caching Bounding Boxes</h3>
            <IDEWindow fileName="caching.ts">
              <CodeBlock language="typescript">{`// Cache droppable positions
const cache = new Map()

kit.on('drag:start', () => {
  // Cache all droppable positions at drag start
  droppables.forEach(droppable => {
    cache.set(droppable.id, {
      rect: droppable.element.getBoundingClientRect(),
    })
  })
})

kit.on('drag:move', (event) => {
  // Use cached positions (much faster)
  droppables.forEach(droppable => {
    const cached = cache.get(droppable.id)
    if (isColliding(event.position, cached.rect)) {
      // ...
    }
  })
})

kit.on('drag:end', () => {
  cache.clear()
})`}</CodeBlock>
            </IDEWindow>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Visual Debugging</h2>
          <p className="text-muted-foreground">
            Visualize collision detection for debugging:
          </p>
          <IDEWindow fileName="debug-collision.ts">
            <CodeBlock language="typescript">{`function debugCollision(kit) {
  kit.on('drag:move', (event) => {
    // Remove old debug overlays
    document.querySelectorAll('.debug-overlay').forEach(el => el.remove())

    // Get all droppables
    droppables.forEach(droppable => {
      const rect = droppable.element.getBoundingClientRect()
      const isOver = checkCollision(event.draggable, droppable)

      // Create overlay
      const overlay = document.createElement('div')
      overlay.className = 'debug-overlay'
      overlay.style.position = 'fixed'
      overlay.style.left = rect.left + 'px'
      overlay.style.top = rect.top + 'px'
      overlay.style.width = rect.width + 'px'
      overlay.style.height = rect.height + 'px'
      overlay.style.border = isOver ? '2px solid green' : '2px dashed red'
      overlay.style.pointerEvents = 'none'
      overlay.style.zIndex = '9999'

      document.body.appendChild(overlay)
    })
  })
}`}</CodeBlock>
          </IDEWindow>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Best Practices</h2>
          <div className="space-y-3">
            <div className="border-l-4 border-primary pl-4">
              <h3 className="font-semibold mb-1">Start with Pointer</h3>
              <p className="text-sm text-muted-foreground">
                Use the pointer algorithm by default. It works well for most use cases and is the fastest.
              </p>
            </div>

            <div className="border-l-4 border-primary pl-4">
              <h3 className="font-semibold mb-1">Use Rectangle for Large Elements</h3>
              <p className="text-sm text-muted-foreground">
                If your draggable elements are large ({'>'}  100px), rectangle collision feels more natural.
              </p>
            </div>

            <div className="border-l-4 border-primary pl-4">
              <h3 className="font-semibold mb-1">Use Center for Sortables</h3>
              <p className="text-sm text-muted-foreground">
                Sortable lists work best with center collision to avoid flickering between positions.
              </p>
            </div>

            <div className="border-l-4 border-primary pl-4">
              <h3 className="font-semibold mb-1">Cache When Possible</h3>
              <p className="text-sm text-muted-foreground">
                If droppables don't move during drag, cache their positions for better performance.
              </p>
            </div>

            <div className="border-l-4 border-primary pl-4">
              <h3 className="font-semibold mb-1">Optimize for Many Droppables</h3>
              <p className="text-sm text-muted-foreground">
                With 100+ droppables, use spatial partitioning or only check visible elements.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t">
          <Link to="/docs/concepts/sensors" className="text-lg font-semibold hover:underline flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Sensors
          </Link>
        </div>
      </div>
    </DocsLayout>
  )
}
