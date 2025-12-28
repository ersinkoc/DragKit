import { DocsLayout } from '@/components/layout/DocsLayout'
import { Link } from 'react-router-dom'
import { CodeBlock } from '@/components/ui/code-block'
import { IDEWindow } from '@/components/ui/ide-window'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'

export default function SortableGrid() {
  return (
    <DocsLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-4">Sortable Grid</h1>
          <p className="text-xl text-muted-foreground">
            Create sortable grids with automatic layout calculation and responsive column handling.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Basic Usage</h2>
          <IDEWindow fileName="basic-grid.ts">
            <CodeBlock language="typescript">{`import { createDragKit } from '@oxog/dragkit'

const kit = createDragKit()

const grid = document.querySelector('.grid')
const sortableGrid = kit.sortable(grid, {
  itemSelector: '.grid-item',
  layout: 'grid',
  columns: 4,
  onSort: (event) => {
    console.log('Grid reordered:', event.order)
  },
})`}</CodeBlock>
          </IDEWindow>

          <p className="text-muted-foreground mt-4">
            Example HTML structure:
          </p>
          <CodeBlock language="css">{`.grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.grid-item {
  aspect-ratio: 1;
  background: #f3f4f6;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}`}</CodeBlock>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Grid Options</h2>
          <div className="space-y-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-mono">layout</CardTitle>
                <CardDescription>
                  <span className="text-sm">'grid'</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Set to 'grid' to enable grid layout mode.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base font-mono">columns</CardTitle>
                <CardDescription>
                  <span className="text-sm">number | 'auto'</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Number of columns in the grid. Use 'auto' to detect from CSS.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base font-mono">gap</CardTitle>
                <CardDescription>
                  <span className="text-sm">number</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Gap between grid items in pixels. Use 'auto' to detect from CSS.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base font-mono">responsive</CardTitle>
                <CardDescription>
                  <span className="text-sm">object</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Responsive breakpoints for different column counts.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Responsive Grid</h2>
          <p className="text-muted-foreground">
            Automatically adjust columns based on screen size:
          </p>
          <IDEWindow fileName="responsive.ts">
            <CodeBlock language="typescript">{`kit.sortable(grid, {
  itemSelector: '.card',
  layout: 'grid',
  responsive: {
    // Mobile
    0: { columns: 1 },
    // Tablet
    640: { columns: 2 },
    // Desktop
    1024: { columns: 3 },
    // Large screens
    1536: { columns: 4 },
  },
  animation: 200,
})`}</CodeBlock>
          </IDEWindow>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Auto-detect Columns</h2>
          <p className="text-muted-foreground">
            Let DragKit automatically detect grid columns from CSS:
          </p>
          <IDEWindow fileName="auto-columns.ts">
            <CodeBlock language="typescript">{`kit.sortable(grid, {
  itemSelector: '.grid-item',
  layout: 'grid',
  columns: 'auto',  // Detect from CSS grid-template-columns
  gap: 'auto',      // Detect from CSS gap
})`}</CodeBlock>
          </IDEWindow>

          <CodeBlock language="css">{`.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}`}</CodeBlock>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Fixed Column Count</h2>
          <IDEWindow fileName="fixed-columns.ts">
            <CodeBlock language="typescript">{`// 3-column grid
kit.sortable(grid, {
  itemSelector: '.product-card',
  layout: 'grid',
  columns: 3,
  gap: 16,
  animation: 250,

  onSort: (event) => {
    // Calculate row and column
    const row = Math.floor(event.newIndex / 3)
    const col = event.newIndex % 3

    console.log(\`Moved to row \${row}, column \${col}\`)

    // Save new order
    saveGridOrder(event.order)
  },
})`}</CodeBlock>
          </IDEWindow>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Event Handlers</h2>
          <IDEWindow fileName="grid-events.ts">
            <CodeBlock language="typescript">{`kit.sortable(grid, {
  itemSelector: '.item',
  layout: 'grid',
  columns: 4,

  onSortStart: (event) => {
    // Highlight drop positions
    const items = grid.querySelectorAll('.item')
    items.forEach(item => {
      if (item !== event.item) {
        item.classList.add('drop-target')
      }
    })
  },

  onSort: (event) => {
    // Visual feedback during drag
    const row = Math.floor(event.newIndex / 4)
    const col = event.newIndex % 4

    // Update position indicator
    updatePositionIndicator(row, col)
  },

  onSortEnd: (event) => {
    // Remove highlights
    grid.querySelectorAll('.drop-target')
      .forEach(item => item.classList.remove('drop-target'))

    // Save grid order
    const order = sortableGrid.getOrder()
    saveOrder(order)
  },
})`}</CodeBlock>
          </IDEWindow>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Methods</h2>
          <div className="space-y-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-mono">getPosition(index: number)</CardTitle>
                <CardDescription>Get row and column for an index</CardDescription>
              </CardHeader>
              <CardContent>
                <CodeBlock language="typescript">{`const position = sortableGrid.getPosition(5)
// { row: 1, column: 2 } (for 4-column grid)`}</CodeBlock>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base font-mono">getIndex(row: number, col: number)</CardTitle>
                <CardDescription>Get index from row and column</CardDescription>
              </CardHeader>
              <CardContent>
                <CodeBlock language="typescript">{`const index = sortableGrid.getIndex(1, 2)
// 6 (for 4-column grid)`}</CodeBlock>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base font-mono">setColumns(columns: number)</CardTitle>
                <CardDescription>Update column count</CardDescription>
              </CardHeader>
              <CardContent>
                <CodeBlock language="typescript">{`// Switch to 5 columns
sortableGrid.setColumns(5)`}</CodeBlock>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Complete Example</h2>
          <IDEWindow fileName="photo-gallery.ts">
            <CodeBlock language="typescript">{`// Photo gallery grid
const gallery = document.querySelector('#photo-gallery')

const sortableGallery = kit.sortable(gallery, {
  itemSelector: '.photo',
  layout: 'grid',
  responsive: {
    0: { columns: 2, gap: 8 },
    640: { columns: 3, gap: 12 },
    1024: { columns: 4, gap: 16 },
    1536: { columns: 5, gap: 20 },
  },
  animation: 200,
  handle: '.photo-drag-handle',

  onSortStart: (event) => {
    // Add sorting class
    event.item.classList.add('is-sorting')

    // Increase z-index
    event.item.style.zIndex = '1000'
  },

  onSort: (event) => {
    // Get current position
    const columns = getCurrentColumns()
    const row = Math.floor(event.newIndex / columns)
    const col = event.newIndex % columns

    // Update photo metadata
    updatePhotoPosition(event.item.dataset.id, {
      index: event.newIndex,
      row,
      column: col,
    })
  },

  onSortEnd: (event) => {
    // Remove sorting class
    event.item.classList.remove('is-sorting')
    event.item.style.zIndex = ''

    // Save new gallery order
    const order = sortableGallery.getOrder()
    saveGalleryOrder(order)
  },
})

// Helper to get current column count from responsive config
function getCurrentColumns() {
  const width = window.innerWidth
  if (width >= 1536) return 5
  if (width >= 1024) return 4
  if (width >= 640) return 3
  return 2
}

// Update column count on resize
let resizeTimeout
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout)
  resizeTimeout = setTimeout(() => {
    const columns = getCurrentColumns()
    sortableGallery.setColumns(columns)
  }, 150)
})`}</CodeBlock>
          </IDEWindow>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">TypeScript</h2>
          <IDEWindow fileName="types.ts">
            <CodeBlock language="typescript">{`interface GridSortableOptions extends SortableOptions {
  layout: 'grid'
  columns: number | 'auto'
  gap?: number | 'auto'
  responsive?: {
    [breakpoint: number]: {
      columns?: number
      gap?: number
    }
  }
}

interface GridSortable extends Sortable {
  getPosition(index: number): { row: number; column: number }
  getIndex(row: number, column: number): number
  setColumns(columns: number): void
  getColumns(): number
}`}</CodeBlock>
          </IDEWindow>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Styling Tips</h2>
          <p className="text-muted-foreground">
            CSS for smooth grid sorting:
          </p>
          <CodeBlock language="css">{`.grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.grid-item {
  transition: transform 0.2s, opacity 0.2s;
  cursor: grab;
}

.grid-item.is-sorting {
  opacity: 0.7;
  cursor: grabbing;
}

.grid-item.drop-target {
  opacity: 0.5;
  border: 2px dashed #3b82f6;
}

/* Responsive grid */
@media (max-width: 1024px) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 640px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }
}`}</CodeBlock>
        </div>

        <div className="mt-12 pt-8 border-t flex items-center justify-between">
          <Link to="/docs/api/sortable" className="text-lg font-semibold hover:underline flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Sortable
          </Link>
          <Link to="/docs/api/events" className="text-lg font-semibold hover:underline flex items-center gap-2">
            Events
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </DocsLayout>
  )
}
