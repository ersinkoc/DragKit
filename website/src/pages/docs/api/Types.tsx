import { DocsLayout } from '@/components/layout/DocsLayout'
import { Link } from 'react-router-dom'
import { CodeBlock } from '@/components/ui/code-block'
import { IDEWindow } from '@/components/ui/ide-window'
import { ArrowLeft } from 'lucide-react'

export default function Types() {
  return (
    <DocsLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-4">TypeScript Types</h1>
          <p className="text-xl text-muted-foreground">
            Complete TypeScript type definitions for type-safe DragKit development.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Core Types</h2>
          <IDEWindow fileName="core.ts">
            <CodeBlock language="typescript">{`// Main DragKit instance
interface DragKit {
  draggable<T = any>(
    element: HTMLElement,
    options: DraggableOptions<T>
  ): Draggable<T>

  droppable<T = any>(
    element: HTMLElement,
    options: DroppableOptions<T>
  ): Droppable<T>

  sortable(
    container: HTMLElement,
    options: SortableOptions
  ): Sortable

  use(plugin: Plugin): void
  on(event: string, handler: Function): () => void
  off(event: string, handler?: Function): void
  once(event: string, handler: Function): void
  emit(event: string, data: any): void
  destroy(): void
}

// Configuration
interface DragKitConfig {
  sensors?: {
    mouse?: boolean
    touch?: boolean
    keyboard?: boolean
  }
  collision?: 'pointer' | 'rectangle' | 'center'
  autoScroll?: {
    enabled?: boolean
    threshold?: number
    speed?: number
  }
  animation?: {
    duration?: number
    easing?: string
  }
  accessibility?: {
    announcements?: boolean
    keyboardShortcuts?: boolean
  }
  plugins?: Plugin[]
}`}</CodeBlock>
          </IDEWindow>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Draggable Types</h2>
          <IDEWindow fileName="draggable.ts">
            <CodeBlock language="typescript">{`interface DraggableOptions<T = any> {
  id: string
  handle?: string | HTMLElement
  data?: T
  disabled?: boolean
  onDragStart?: (event: DragStartEvent<T>) => void
  onDragMove?: (event: DragMoveEvent<T>) => void
  onDragEnd?: (event: DragEndEvent<T>) => void
  onDragCancel?: (event: DragCancelEvent<T>) => void
}

interface Draggable<T = any> {
  id: string
  element: HTMLElement
  data: T
  disabled: boolean
  setDisabled(disabled: boolean): void
  setData(data: T): void
  destroy(): void
}

interface DragStartEvent<T = any> {
  draggable: Draggable<T>
  position: Position
  timestamp: number
}

interface DragMoveEvent<T = any> {
  draggable: Draggable<T>
  position: Position
  delta: Position
  timestamp: number
}

interface DragEndEvent<T = any> {
  draggable: Draggable<T>
  position: Position
  timestamp: number
  cancelled: boolean
}

interface DragCancelEvent<T = any> {
  draggable: Draggable<T>
  reason: 'escape' | 'invalid-drop' | 'manual'
  timestamp: number
}`}</CodeBlock>
          </IDEWindow>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Droppable Types</h2>
          <IDEWindow fileName="droppable.ts">
            <CodeBlock language="typescript">{`interface DroppableOptions<T = any> {
  id: string
  accept?: (draggable: Draggable) => boolean
  data?: T
  disabled?: boolean
  onDragEnter?: (event: DragEnterEvent<T>) => void
  onDragOver?: (event: DragOverEvent<T>) => void
  onDragLeave?: (event: DragLeaveEvent<T>) => void
  onDrop?: (event: DropEvent<T>) => void
}

interface Droppable<T = any> {
  id: string
  element: HTMLElement
  data: T
  disabled: boolean
  accept?: (draggable: Draggable) => boolean
  setDisabled(disabled: boolean): void
  setData(data: T): void
  destroy(): void
}

interface DragEnterEvent<T = any> {
  draggable: Draggable
  droppable: Droppable<T>
  timestamp: number
}

interface DragOverEvent<T = any> {
  draggable: Draggable
  droppable: Droppable<T>
  position: Position
  timestamp: number
}

interface DragLeaveEvent<T = any> {
  draggable: Draggable
  droppable: Droppable<T>
  timestamp: number
}

interface DropEvent<T = any> {
  draggable: Draggable
  droppable: Droppable<T>
  position: Position
  timestamp: number
}`}</CodeBlock>
          </IDEWindow>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Sortable Types</h2>
          <IDEWindow fileName="sortable.ts">
            <CodeBlock language="typescript">{`interface SortableOptions {
  itemSelector: string
  handle?: string
  direction?: 'vertical' | 'horizontal'
  layout?: 'list' | 'grid'
  animation?: number
  group?: string
  disabled?: boolean
  onSortStart?: (event: SortStartEvent) => void
  onSort?: (event: SortEvent) => void
  onSortEnd?: (event: SortEndEvent) => void
}

interface Sortable {
  element: HTMLElement
  disabled: boolean
  getOrder(): string[]
  setOrder(order: string[]): void
  setDisabled(disabled: boolean): void
  destroy(): void
}

interface SortStartEvent {
  item: HTMLElement
  container: HTMLElement
  index: number
  timestamp: number
}

interface SortEvent {
  item: HTMLElement
  from: HTMLElement
  to: HTMLElement
  oldIndex: number
  newIndex: number
  order: string[]
  timestamp: number
}

interface SortEndEvent {
  item: HTMLElement
  container: HTMLElement
  oldIndex: number
  newIndex: number
  order: string[]
  timestamp: number
}`}</CodeBlock>
          </IDEWindow>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Grid Sortable Types</h2>
          <IDEWindow fileName="grid-sortable.ts">
            <CodeBlock language="typescript">{`interface GridSortableOptions extends SortableOptions {
  layout: 'grid'
  columns: number | 'auto'
  gap?: number | 'auto'
  responsive?: ResponsiveConfig
}

interface ResponsiveConfig {
  [breakpoint: number]: {
    columns?: number
    gap?: number
  }
}

interface GridSortable extends Sortable {
  getPosition(index: number): GridPosition
  getIndex(row: number, column: number): number
  setColumns(columns: number): void
  getColumns(): number
}

interface GridPosition {
  row: number
  column: number
}`}</CodeBlock>
          </IDEWindow>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Plugin Types</h2>
          <IDEWindow fileName="plugin.ts">
            <CodeBlock language="typescript">{`interface Plugin {
  name: string
  version?: string
  install(kit: DragKit): void
  destroy?(): void
}

interface PluginFactory<T = any> {
  (options?: T): Plugin
}

// Example plugin implementation
const MyPlugin: PluginFactory<{ speed: number }> = (options = {}) => ({
  name: 'my-plugin',
  version: '1.0.0',

  install(kit: DragKit) {
    kit.on('drag:start', (event) => {
      console.log('Plugin: drag started')
    })
  },

  destroy() {
    console.log('Plugin destroyed')
  },
})`}</CodeBlock>
          </IDEWindow>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Utility Types</h2>
          <IDEWindow fileName="utility.ts">
            <CodeBlock language="typescript">{`interface Position {
  x: number
  y: number
}

interface Rect {
  top: number
  right: number
  bottom: number
  left: number
  width: number
  height: number
  x: number
  y: number
}

interface Sensor {
  name: string
  attach(element: HTMLElement): void
  detach(): void
}

type CollisionAlgorithm =
  | 'pointer'
  | 'rectangle'
  | 'center'

type SortDirection =
  | 'vertical'
  | 'horizontal'

type LayoutType =
  | 'list'
  | 'grid'`}</CodeBlock>
          </IDEWindow>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Usage Examples</h2>

          <div>
            <h3 className="text-lg font-semibold mb-3">Type-Safe Draggable</h3>
            <IDEWindow fileName="typed-draggable.ts">
              <CodeBlock language="typescript">{`interface TaskData {
  id: number
  title: string
  priority: 'low' | 'medium' | 'high'
  assignee?: string
}

const task = document.querySelector<HTMLElement>('.task')!

const draggable = kit.draggable<TaskData>(task, {
  id: 'task-1',
  data: {
    id: 123,
    title: 'Fix bug',
    priority: 'high',
  },

  onDragStart: (event) => {
    // TypeScript knows event.draggable.data is TaskData
    const { title, priority } = event.draggable.data
    console.log(\`Dragging: \${title} (\${priority})\`)
  },
})`}</CodeBlock>
            </IDEWindow>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Type-Safe Droppable</h3>
            <IDEWindow fileName="typed-droppable.ts">
              <CodeBlock language="typescript">{`interface ZoneData {
  category: string
  maxItems: number
  currentItems: number
}

const zone = document.querySelector<HTMLElement>('.zone')!

const droppable = kit.droppable<ZoneData>(zone, {
  id: 'zone-1',
  data: {
    category: 'todo',
    maxItems: 10,
    currentItems: 0,
  },

  accept: (draggable: Draggable<TaskData>) => {
    // Type-safe access to both data types
    return draggable.data.priority === 'high'
  },

  onDrop: (event) => {
    const task = event.draggable.data
    const zone = event.droppable.data

    console.log(\`Dropped \${task.title} into \${zone.category}\`)

    // Update zone data
    event.droppable.setData({
      ...zone,
      currentItems: zone.currentItems + 1,
    })
  },
})`}</CodeBlock>
            </IDEWindow>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Type-Safe Plugin</h3>
            <IDEWindow fileName="typed-plugin.ts">
              <CodeBlock language="typescript">{`interface LoggerOptions {
  prefix?: string
  verbose?: boolean
}

const LoggerPlugin: PluginFactory<LoggerOptions> = (options = {}) => {
  const { prefix = '[DragKit]', verbose = false } = options

  return {
    name: 'logger',
    version: '1.0.0',

    install(kit: DragKit) {
      kit.on('drag:start', (event: DragStartEvent) => {
        console.log(\`\${prefix} Drag started: \${event.draggable.id}\`)
      })

      if (verbose) {
        kit.on('drag:move', (event: DragMoveEvent) => {
          console.log(\`\${prefix} Position: \${event.position.x}, \${event.position.y}\`)
        })
      }
    },
  }
}

// Usage
const kit = createDragKit({
  plugins: [
    LoggerPlugin({
      prefix: '[App]',
      verbose: true,
    }),
  ],
})`}</CodeBlock>
            </IDEWindow>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Import Paths</h2>
          <IDEWindow fileName="imports.ts">
            <CodeBlock language="typescript">{`// Core types
import type {
  DragKit,
  DragKitConfig,
  Draggable,
  DraggableOptions,
  Droppable,
  DroppableOptions,
  Sortable,
  SortableOptions,
} from '@oxog/dragkit'

// Event types
import type {
  DragStartEvent,
  DragMoveEvent,
  DragEndEvent,
  DropEvent,
  SortEvent,
} from '@oxog/dragkit'

// Utility types
import type {
  Position,
  Rect,
  Plugin,
} from '@oxog/dragkit'`}</CodeBlock>
          </IDEWindow>
        </div>

        <div className="mt-12 pt-8 border-t">
          <Link to="/docs/api/events" className="text-lg font-semibold hover:underline flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Events
          </Link>
        </div>
      </div>
    </DocsLayout>
  )
}
