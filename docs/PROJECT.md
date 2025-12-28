# DragKit - Zero-Dependency Drag & Drop Toolkit

## Package Identity

- **NPM Package**: `@oxog/dragkit`
- **GitHub Repository**: `https://github.com/ersinkoc/dragkit`
- **Documentation Site**: `https://dragkit.oxog.dev`
- **License**: MIT
- **Author**: Ersin KOÇ
- **Created**: 2025-12-28

**NO social media, Discord, email, or external links.**

## Package Description

Zero-dependency drag & drop toolkit with micro-kernel plugin architecture.

DragKit is a lightweight, powerful drag and drop library that handles draggable elements, droppable zones, sortable lists and grids. Built on a micro-kernel architecture with a plugin system, it supports pointer, touch, and keyboard sensors, collision detection, auto-scroll, multi-drag, nested sortables, constraints, and animations. Framework-agnostic core with dedicated adapters for React, Vue, and Svelte—all in under 5KB with zero runtime dependencies.

---

## NON-NEGOTIABLE RULES

These rules are ABSOLUTE and must be followed without exception:

### 1. ZERO DEPENDENCIES
```json
{
  "dependencies": {}  // MUST BE EMPTY - NO EXCEPTIONS
}
```
Implement EVERYTHING from scratch. No runtime dependencies allowed.

### 2. 100% TEST COVERAGE & 100% SUCCESS RATE
- Every line of code must be tested
- Every branch must be tested
- All tests must pass (100% success rate)
- Use Vitest for testing
- Coverage report must show 100%

### 3. DEVELOPMENT WORKFLOW
Create these documents FIRST, before any code:
1. **SPECIFICATION.md** - Complete package specification
2. **IMPLEMENTATION.md** - Architecture and design decisions
3. **TASKS.md** - Ordered task list with dependencies

Only after these documents are complete, implement the code following TASKS.md sequentially.

### 4. TYPESCRIPT STRICT MODE
```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true
  }
}
```

### 5. NO EXTERNAL LINKS
- ❌ No social media (Twitter, LinkedIn, etc.)
- ❌ No Discord/Slack links
- ❌ No email addresses
- ❌ No donation/sponsor links
- ✅ Only GitHub repo and documentation site allowed

### 6. BUNDLE SIZE TARGET
- Core package: < 5KB minified + gzipped
- With all plugins: < 12KB
- Tree-shakeable

---

## ARCHITECTURE: MICRO-KERNEL + PLUGIN SYSTEM

### Kernel Responsibilities

```typescript
interface Kernel {
  // Draggable management
  draggable(element: HTMLElement, options: DraggableOptions): DraggableInstance
  getDraggable(id: string): DraggableInstance | undefined
  getDraggables(): Map<string, DraggableInstance>
  
  // Droppable management
  droppable(element: HTMLElement, options: DroppableOptions): DroppableInstance
  getDroppable(id: string): DroppableInstance | undefined
  getDroppables(): Map<string, DroppableInstance>
  
  // Sortable
  sortable(container: HTMLElement, options: SortableOptions): SortableInstance
  sortableGrid(container: HTMLElement, options: SortableGridOptions): SortableGridInstance
  
  // Drag state
  getActiveDraggable(): DraggableInstance | null
  getActiveDroppable(): DroppableInstance | null
  isDragging(): boolean
  
  // Sensors
  addSensor(sensor: Sensor): void
  removeSensor(sensorType: SensorType): void
  getSensors(): Sensor[]
  
  // Collision
  setCollisionAlgorithm(algorithm: CollisionAlgorithm): void
  detectCollision(draggable: DraggableInstance): DroppableInstance | null
  
  // Plugin management
  register(plugin: Plugin): void
  unregister(pluginName: string): void
  getPlugin<P extends Plugin>(name: string): P | undefined
  listPlugins(): PluginInfo[]
  
  // Event system
  emit(event: DragEvent): void
  on<E extends EventType>(eventType: E, handler: EventHandler<E>): Unsubscribe
  off<E extends EventType>(eventType: E, handler: EventHandler<E>): void
  
  // Configuration
  configure(options: Partial<KernelOptions>): void
  getOptions(): KernelOptions
  
  // Lifecycle
  destroy(): void
}

interface KernelOptions {
  sensors?: SensorType[]
  collision?: CollisionAlgorithm | CollisionFn
  autoScroll?: boolean | AutoScrollOptions
  accessibility?: boolean
  animation?: AnimationOptions | false
  plugins?: Plugin[]
}

type SensorType = 'pointer' | 'touch' | 'keyboard'

type CollisionAlgorithm = 'rectangle' | 'center' | 'pointer' | 'closest'

type CollisionFn = (
  draggable: DraggableInstance,
  droppables: DroppableInstance[]
) => DroppableInstance | null
```

### Draggable Types

```typescript
interface DraggableOptions {
  id: string
  data?: DragData
  handle?: string | HTMLElement        // Drag handle selector/element
  disabled?: boolean
  axis?: 'x' | 'y' | 'both'
  bounds?: BoundsOption
  preview?: PreviewOption
  previewClass?: string
  dragClass?: string
  cursorGrabbing?: boolean
  delay?: number                       // Delay before drag starts (ms)
  distance?: number                    // Min distance before drag starts (px)
  
  // Callbacks
  onDragStart?: (event: DragStartEvent) => void
  onDragMove?: (event: DragMoveEvent) => void
  onDragEnd?: (event: DragEndEvent) => void
  onDragCancel?: (event: DragCancelEvent) => void
}

interface DraggableInstance {
  id: string
  element: HTMLElement
  data: DragData
  options: DraggableOptions
  
  // State
  isDragging(): boolean
  isDisabled(): boolean
  getPosition(): Position
  getTransform(): Transform
  
  // Methods
  enable(): void
  disable(): void
  destroy(): void
}

interface DragData {
  type?: string
  [key: string]: unknown
}

type BoundsOption = 
  | 'parent'
  | 'window'
  | 'body'
  | HTMLElement
  | BoundsRect

interface BoundsRect {
  top?: number
  right?: number
  bottom?: number
  left?: number
}

type PreviewOption = 
  | 'clone'                            // Clone element
  | 'ghost'                            // Semi-transparent clone
  | 'none'                             // No preview (transform original)
  | HTMLElement                        // Custom element
  | ((draggable: DraggableInstance) => HTMLElement)

interface Position {
  x: number
  y: number
}

interface Transform {
  x: number
  y: number
  scaleX?: number
  scaleY?: number
}
```

### Droppable Types

```typescript
interface DroppableOptions {
  id: string
  accept?: string | string[] | AcceptFn
  disabled?: boolean
  data?: DropData
  
  // Visual feedback
  activeClass?: string                 // Class when dragging compatible item
  overClass?: string                   // Class when item is over
  
  // Callbacks
  onDragEnter?: (event: DragEnterEvent) => void
  onDragOver?: (event: DragOverEvent) => void
  onDragLeave?: (event: DragLeaveEvent) => void
  onDrop?: (event: DropEvent) => void
}

interface DroppableInstance {
  id: string
  element: HTMLElement
  data: DropData
  options: DroppableOptions
  
  // State
  isOver(): boolean
  isDisabled(): boolean
  canAccept(draggable: DraggableInstance): boolean
  getRect(): DOMRect
  
  // Methods
  enable(): void
  disable(): void
  destroy(): void
}

interface DropData {
  [key: string]: unknown
}

type AcceptFn = (draggable: DraggableInstance) => boolean
```

### Sortable Types

```typescript
interface SortableOptions {
  id: string
  items: string[]                      // Item IDs in order
  direction?: 'vertical' | 'horizontal'
  handle?: string                      // Handle selector
  disabled?: boolean
  animation?: AnimationOptions | false
  
  // Classes
  ghostClass?: string                  // Placeholder element
  dragClass?: string                   // Dragging element
  chosenClass?: string                 // Selected element
  
  // Drop indicator
  dropIndicator?: boolean | DropIndicatorOptions
  
  // Group (for cross-list sorting)
  group?: string | SortableGroup
  
  // Callbacks
  onSortStart?: (event: SortStartEvent) => void
  onSortMove?: (event: SortMoveEvent) => void
  onSortEnd?: (event: SortEndEvent) => void
  onAdd?: (event: SortAddEvent) => void
  onRemove?: (event: SortRemoveEvent) => void
  onMove?: (event: SortMoveCheckEvent) => boolean | void
}

interface SortableInstance {
  id: string
  container: HTMLElement
  options: SortableOptions
  
  // State
  getItems(): string[]
  getItemElements(): HTMLElement[]
  isDragging(): boolean
  
  // Methods
  setItems(items: string[]): void
  addItem(id: string, index?: number): void
  removeItem(id: string): void
  moveItem(fromIndex: number, toIndex: number): void
  enable(): void
  disable(): void
  destroy(): void
}

interface SortableGroup {
  name: string
  pull?: boolean | 'clone' | ((to: SortableInstance, from: SortableInstance) => boolean)
  put?: boolean | string[] | ((to: SortableInstance) => boolean)
}

interface AnimationOptions {
  duration: number
  easing: string
}

interface DropIndicatorOptions {
  class?: string
  thickness?: number
  color?: string
}
```

### Sortable Grid Types

```typescript
interface SortableGridOptions extends Omit<SortableOptions, 'direction'> {
  columns: number
  gap?: number
  rowGap?: number
  columnGap?: number
}

interface SortableGridInstance extends SortableInstance {
  setColumns(columns: number): void
  getColumns(): number
  getItemPosition(id: string): { row: number; column: number } | null
}
```

### Event Types

```typescript
type EventType =
  // Drag events
  | 'drag:start'
  | 'drag:move'
  | 'drag:over'
  | 'drag:enter'
  | 'drag:leave'
  | 'drag:end'
  | 'drag:cancel'
  // Sort events
  | 'sort:start'
  | 'sort:move'
  | 'sort:end'
  | 'sort:add'
  | 'sort:remove'

// Base event
interface BaseDragEvent {
  type: EventType
  timestamp: number
  originalEvent: PointerEvent | TouchEvent | KeyboardEvent | null
}

// Drag events
interface DragStartEvent extends BaseDragEvent {
  type: 'drag:start'
  draggable: DraggableInstance
  position: Position
}

interface DragMoveEvent extends BaseDragEvent {
  type: 'drag:move'
  draggable: DraggableInstance
  position: Position
  delta: Position
}

interface DragOverEvent extends BaseDragEvent {
  type: 'drag:over'
  draggable: DraggableInstance
  droppable: DroppableInstance | null
  position: Position
}

interface DragEnterEvent extends BaseDragEvent {
  type: 'drag:enter'
  draggable: DraggableInstance
  droppable: DroppableInstance
}

interface DragLeaveEvent extends BaseDragEvent {
  type: 'drag:leave'
  draggable: DraggableInstance
  droppable: DroppableInstance
}

interface DragEndEvent extends BaseDragEvent {
  type: 'drag:end'
  draggable: DraggableInstance
  droppable: DroppableInstance | null
  position: Position
  dropped: boolean
}

interface DragCancelEvent extends BaseDragEvent {
  type: 'drag:cancel'
  draggable: DraggableInstance
  reason: 'escape' | 'blur' | 'programmatic'
}

interface DropEvent extends BaseDragEvent {
  type: 'drag:end'
  draggable: DraggableInstance
  droppable: DroppableInstance
  position: Position
}

// Sort events
interface SortStartEvent extends BaseDragEvent {
  type: 'sort:start'
  sortable: SortableInstance
  item: string
  index: number
}

interface SortMoveEvent extends BaseDragEvent {
  type: 'sort:move'
  sortable: SortableInstance
  item: string
  oldIndex: number
  newIndex: number
}

interface SortEndEvent extends BaseDragEvent {
  type: 'sort:end'
  sortable: SortableInstance
  item: string
  oldIndex: number
  newIndex: number
  items: string[]
}

interface SortAddEvent extends BaseDragEvent {
  type: 'sort:add'
  sortable: SortableInstance
  item: string
  index: number
  from: SortableInstance
}

interface SortRemoveEvent extends BaseDragEvent {
  type: 'sort:remove'
  sortable: SortableInstance
  item: string
  index: number
  to: SortableInstance
}

interface SortMoveCheckEvent {
  dragged: DraggableInstance
  related: HTMLElement
  sortable: SortableInstance
  willInsertAfter: boolean
}

type DragEvent =
  | DragStartEvent
  | DragMoveEvent
  | DragOverEvent
  | DragEnterEvent
  | DragLeaveEvent
  | DragEndEvent
  | DragCancelEvent
  | SortStartEvent
  | SortMoveEvent
  | SortEndEvent
  | SortAddEvent
  | SortRemoveEvent

type EventHandler<E extends EventType> = (
  event: Extract<DragEvent, { type: E }>
) => void

type Unsubscribe = () => void
```

### Sensor Interface

```typescript
interface Sensor {
  type: SensorType
  
  // Lifecycle
  attach(kernel: Kernel): void
  detach(): void
  
  // State
  isActive(): boolean
  
  // Methods
  activate(element: HTMLElement, event: Event): void
  deactivate(): void
}

interface PointerSensorOptions {
  activationConstraint?: {
    delay?: number
    distance?: number
    tolerance?: number
  }
}

interface TouchSensorOptions {
  activationConstraint?: {
    delay?: number
    distance?: number
  }
}

interface KeyboardSensorOptions {
  keyboardCodes?: {
    start?: string[]      // Default: ['Space', 'Enter']
    cancel?: string[]     // Default: ['Escape']
    up?: string[]         // Default: ['ArrowUp']
    down?: string[]       // Default: ['ArrowDown']
    left?: string[]       // Default: ['ArrowLeft']
    right?: string[]      // Default: ['ArrowRight']
  }
  moveDistance?: number   // Pixels per keypress
}
```

### Plugin Interface

```typescript
interface Plugin {
  // Identity
  name: string
  version: string
  type: 'core' | 'optional'
  
  // Lifecycle
  install(kernel: Kernel): void | Promise<void>
  uninstall(): void | Promise<void>
  
  // Hooks (all optional)
  hooks?: {
    beforeDragStart?: (draggable: DraggableInstance, event: Event) => boolean
    afterDragStart?: (event: DragStartEvent) => void
    beforeDragMove?: (event: DragMoveEvent) => DragMoveEvent
    afterDragMove?: (event: DragMoveEvent) => void
    beforeDragEnd?: (event: DragEndEvent) => boolean
    afterDragEnd?: (event: DragEndEvent) => void
    onCollisionDetect?: (draggable: DraggableInstance, droppables: DroppableInstance[]) => DroppableInstance | null
    beforeSort?: (event: SortMoveCheckEvent) => boolean
    afterSort?: (event: SortEndEvent) => void
  }
  
  // Plugin can expose its own API
  api?: Record<string, unknown>
}

interface PluginInfo {
  name: string
  version: string
  type: 'core' | 'optional'
  enabled: boolean
}
```

---

## CORE PLUGINS (6 Total - Always Loaded)

### 1. drag-manager

Draggable element management and state.

```typescript
interface DragManagerAPI {
  // Registration
  register(element: HTMLElement, options: DraggableOptions): DraggableInstance
  unregister(id: string): void
  
  // Queries
  get(id: string): DraggableInstance | undefined
  getAll(): Map<string, DraggableInstance>
  getByElement(element: HTMLElement): DraggableInstance | undefined
  
  // State
  getActive(): DraggableInstance | null
  setActive(id: string | null): void
  isDragging(): boolean
  
  // Transform
  setTransform(id: string, transform: Transform): void
  getTransform(id: string): Transform | null
  resetTransform(id: string): void
}
```

**Implementation Notes:**
- Track all registered draggables
- Manage active drag state
- Handle transform calculations
- Clean up on destroy

### 2. drop-manager

Droppable zone management.

```typescript
interface DropManagerAPI {
  // Registration
  register(element: HTMLElement, options: DroppableOptions): DroppableInstance
  unregister(id: string): void
  
  // Queries
  get(id: string): DroppableInstance | undefined
  getAll(): Map<string, DroppableInstance>
  getByElement(element: HTMLElement): DroppableInstance | undefined
  getAccepting(draggable: DraggableInstance): DroppableInstance[]
  
  // State
  getActive(): DroppableInstance | null
  setActive(id: string | null): void
  isOver(id: string): boolean
}
```

**Implementation Notes:**
- Track all registered droppables
- Filter by accept criteria
- Manage over state
- Apply visual feedback classes

### 3. sortable-engine

List and grid sorting logic.

```typescript
interface SortableEngineAPI {
  // Registration
  createSortable(container: HTMLElement, options: SortableOptions): SortableInstance
  createSortableGrid(container: HTMLElement, options: SortableGridOptions): SortableGridInstance
  
  // Queries
  get(id: string): SortableInstance | undefined
  getAll(): Map<string, SortableInstance>
  
  // Sort operations
  moveItem(sortableId: string, fromIndex: number, toIndex: number): void
  transferItem(fromSortableId: string, toSortableId: string, itemId: string, toIndex: number): void
  
  // Animation
  animateMove(element: HTMLElement, from: DOMRect, to: DOMRect): void
}
```

**Implementation Notes:**
- Calculate drop positions
- Handle cross-list transfers
- Animate element movements
- Generate placeholder elements

### 4. pointer-sensor

Mouse and pointer event handling.

```typescript
interface PointerSensorAPI {
  // State
  isActive(): boolean
  getPosition(): Position | null
  
  // Configuration
  setActivationConstraint(constraint: ActivationConstraint): void
}

interface ActivationConstraint {
  delay?: number        // ms before drag starts
  distance?: number     // px movement before drag starts
  tolerance?: number    // px tolerance for delay cancel
}
```

**Implementation Notes:**
- Use PointerEvents API
- Handle pointer capture
- Calculate delta movements
- Support activation constraints

### 5. touch-sensor

Touch event handling for mobile.

```typescript
interface TouchSensorAPI {
  // State
  isActive(): boolean
  getTouches(): Touch[]
  
  // Configuration
  setActivationConstraint(constraint: TouchActivationConstraint): void
}
```

**Implementation Notes:**
- Handle touchstart, touchmove, touchend
- Prevent scroll during drag
- Support multi-touch (for future pinch/zoom)
- Handle touch cancel

### 6. collision-detector

Hit testing and overlap detection.

```typescript
interface CollisionDetectorAPI {
  // Detection
  detect(draggable: DraggableInstance, droppables: DroppableInstance[]): DroppableInstance | null
  detectAll(draggable: DraggableInstance, droppables: DroppableInstance[]): DroppableInstance[]
  
  // Algorithms
  setAlgorithm(algorithm: CollisionAlgorithm | CollisionFn): void
  getAlgorithm(): CollisionAlgorithm | 'custom'
  
  // Built-in algorithms
  rectangleIntersection(a: DOMRect, b: DOMRect): boolean
  centerInside(draggable: DOMRect, droppable: DOMRect): boolean
  pointerInside(position: Position, rect: DOMRect): boolean
  closestDroppable(position: Position, droppables: DroppableInstance[]): DroppableInstance | null
}

// Collision algorithms
const collisionAlgorithms = {
  // Any overlap between rectangles
  rectangle: (draggable, droppables) => {
    return droppables.find(d => rectangleIntersection(draggable.getRect(), d.getRect()))
  },
  
  // Draggable center inside droppable
  center: (draggable, droppables) => {
    const center = getCenter(draggable.getRect())
    return droppables.find(d => pointInside(center, d.getRect()))
  },
  
  // Pointer position inside droppable
  pointer: (draggable, droppables, pointerPosition) => {
    return droppables.find(d => pointInside(pointerPosition, d.getRect()))
  },
  
  // Closest droppable to pointer
  closest: (draggable, droppables, pointerPosition) => {
    return droppables.reduce((closest, d) => {
      const distance = getDistance(pointerPosition, getCenter(d.getRect()))
      return distance < closest.distance ? { droppable: d, distance } : closest
    }, { droppable: null, distance: Infinity }).droppable
  },
}
```

---

## OPTIONAL PLUGINS (7 Total)

### 7. keyboard-sensor

Keyboard navigation for accessibility.

```typescript
import { keyboardSensor } from '@oxog/dragkit/plugins'

const dnd = createDragKit({
  plugins: [keyboardSensor({
    moveDistance: 10,
    keyboardCodes: {
      start: ['Space', 'Enter'],
      cancel: ['Escape'],
      up: ['ArrowUp'],
      down: ['ArrowDown'],
      left: ['ArrowLeft'],
      right: ['ArrowRight'],
    },
  })],
})

interface KeyboardSensorOptions {
  moveDistance?: number
  keyboardCodes?: KeyboardCodes
  announcements?: {
    onDragStart?: (draggable: DraggableInstance) => string
    onDragOver?: (droppable: DroppableInstance | null) => string
    onDragEnd?: (dropped: boolean) => string
  }
}

interface KeyboardSensorAPI {
  isActive(): boolean
  setMoveDistance(distance: number): void
}
```

**Implementation Notes:**
- Handle keyboard events on focused draggables
- Announce state changes for screen readers
- Move by fixed distance on arrow keys
- Confirm drop with Enter, cancel with Escape

### 8. auto-scroll

Automatic scrolling when dragging near edges.

```typescript
import { autoScroll } from '@oxog/dragkit/plugins'

const dnd = createDragKit({
  plugins: [autoScroll({
    speed: 10,
    threshold: 50,
    acceleration: 1.5,
    scrollableElements: 'auto',  // 'auto' | HTMLElement[]
  })],
})

interface AutoScrollOptions {
  speed?: number              // Base scroll speed (default: 10)
  threshold?: number          // Pixels from edge (default: 50)
  acceleration?: number       // Speed multiplier near edge (default: 1)
  maxSpeed?: number           // Maximum scroll speed (default: 50)
  scrollableElements?: 'auto' | HTMLElement[]
  scrollWindow?: boolean      // Also scroll window (default: true)
}

interface AutoScrollAPI {
  enable(): void
  disable(): void
  isEnabled(): boolean
  setSpeed(speed: number): void
  setThreshold(threshold: number): void
}
```

**Implementation Notes:**
- Detect scrollable containers
- Calculate scroll speed based on distance from edge
- Handle both horizontal and vertical scroll
- Use requestAnimationFrame for smooth scrolling

### 9. multi-drag

Multiple item selection and dragging.

```typescript
import { multiDrag } from '@oxog/dragkit/plugins'

const dnd = createDragKit({
  plugins: [multiDrag({
    selectionClass: 'selected',
    selectKey: 'ctrl',          // 'ctrl' | 'shift' | 'meta'
    dragAllSelected: true,
  })],
})

interface MultiDragOptions {
  selectionClass?: string
  selectKey?: 'ctrl' | 'shift' | 'meta'
  dragAllSelected?: boolean
  maxSelections?: number
  onSelect?: (items: string[]) => void
  onDeselect?: (items: string[]) => void
}

interface MultiDragAPI {
  select(id: string): void
  deselect(id: string): void
  toggle(id: string): void
  selectAll(): void
  clearSelection(): void
  getSelected(): string[]
  isSelected(id: string): boolean
}

// Usage
dnd.multiDrag.select('item-1')
dnd.multiDrag.select('item-2')
const selected = dnd.multiDrag.getSelected()  // ['item-1', 'item-2']
```

**Implementation Notes:**
- Track selected items
- Handle ctrl/shift click for selection
- Create stacked preview for multi-drag
- Update all selected items on drop

### 10. nested-sortable

Nested/tree sortable lists.

```typescript
import { nestedSortable } from '@oxog/dragkit/plugins'

const dnd = createDragKit({
  plugins: [nestedSortable({
    maxDepth: 3,
    collapsible: true,
    indentSize: 20,
  })],
})

// Create nested sortable
const tree = dnd.nestedSortable(container, {
  id: 'tree',
  items: [
    { id: 'node-1', children: ['node-1-1', 'node-1-2'] },
    { id: 'node-2', children: [] },
  ],
  maxDepth: 3,
  onNestChange: (event) => {
    console.log('Nest changed:', event.item, event.newParent, event.newIndex)
  },
})

interface NestedSortableOptions extends SortableOptions {
  maxDepth?: number
  collapsible?: boolean
  indentSize?: number
  childrenKey?: string         // Default: 'children'
  expandOnHover?: boolean
  expandDelay?: number
  onNestChange?: (event: NestChangeEvent) => void
  onCollapse?: (id: string) => void
  onExpand?: (id: string) => void
}

interface NestChangeEvent {
  item: string
  oldParent: string | null
  newParent: string | null
  oldIndex: number
  newIndex: number
  depth: number
}

interface NestedSortableAPI {
  collapse(id: string): void
  expand(id: string): void
  toggle(id: string): void
  isCollapsed(id: string): boolean
  getDepth(id: string): number
  getParent(id: string): string | null
  getChildren(id: string): string[]
  canNest(itemId: string, parentId: string): boolean
}
```

**Implementation Notes:**
- Track tree structure
- Enforce max depth
- Handle expand/collapse
- Visual indentation
- Nest on hover with delay

### 11. snap-grid

Snap to grid during drag.

```typescript
import { snapGrid } from '@oxog/dragkit/plugins'

const dnd = createDragKit({
  plugins: [snapGrid({
    size: 20,           // Snap to 20px grid
    // Or separate x/y
    x: 20,
    y: 20,
    offset: { x: 0, y: 0 },
  })],
})

interface SnapGridOptions {
  size?: number
  x?: number
  y?: number
  offset?: Position
  showGrid?: boolean           // Visual grid overlay
  gridColor?: string
}

interface SnapGridAPI {
  setSize(size: number | { x: number; y: number }): void
  setOffset(offset: Position): void
  enable(): void
  disable(): void
  isEnabled(): boolean
  showGrid(): void
  hideGrid(): void
}
```

**Implementation Notes:**
- Snap position to nearest grid point
- Support different x/y grid sizes
- Optional visual grid overlay
- Handle offset from origin

### 12. constraints

Axis locking and bounds constraints.

```typescript
import { constraints } from '@oxog/dragkit/plugins'

const dnd = createDragKit({
  plugins: [constraints()],
})

// Per-draggable constraints
dnd.draggable(element, {
  id: 'slider',
  constraints: {
    axis: 'x',
    bounds: { left: 0, right: 300 },
  },
})

// Or dynamic constraints
dnd.draggable(element, {
  id: 'bounded',
  constraints: {
    bounds: 'parent',
    padding: 10,
  },
})

interface ConstraintsOptions {
  axis?: 'x' | 'y' | 'both'
  bounds?: BoundsOption
  padding?: number | { top?: number; right?: number; bottom?: number; left?: number }
}

interface ConstraintsAPI {
  setAxisLock(id: string, axis: 'x' | 'y' | 'both'): void
  setBounds(id: string, bounds: BoundsOption): void
  clearConstraints(id: string): void
}
```

### 13. drag-devtools

Visual debugging panel.

```typescript
import { dragDevtools, DragDevtoolsPanel } from '@oxog/dragkit/plugins'

const dnd = createDragKit({
  plugins: [dragDevtools({
    position: 'bottom-right',
    shortcut: 'ctrl+shift+d',
  })],
})

// React component
<DragDevtoolsPanel />

interface DragDevtoolsOptions {
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  shortcut: string
  draggable: boolean
  resizable: boolean
  theme: 'dark' | 'light' | 'auto'
  defaultOpen: boolean
  showCollisionRects: boolean
  showDropIndicators: boolean
}

interface DragDevtoolsAPI {
  open(): void
  close(): void
  toggle(): void
  isOpen(): boolean
  showCollisionRects(show: boolean): void
  showDropIndicators(show: boolean): void
}
```

**DevTools Panel Layout:**
```
┌─ DragKit DevTools ──────────────── [_] [□] [×]
├─────────────────────────────────────────────────
│  Status: 🟢 Ready          Active: card-3
├─────────────────────────────────────────────────
│  📦 Draggables (5)
│  ┌──────────────────────────────────────────┐
│  │ ID       │ Type  │ Status    │ Position │
│  ├──────────┼───────┼───────────┼──────────│
│  │ card-1   │ card  │ idle      │ -        │
│  │ card-2   │ card  │ idle      │ -        │
│  │ card-3   │ card  │ dragging  │ 150, 200 │
│  │ card-4   │ card  │ idle      │ -        │
│  │ card-5   │ card  │ disabled  │ -        │
│  └──────────────────────────────────────────┘
├─────────────────────────────────────────────────
│  🎯 Droppables (2)
│  ┌──────────────────────────────────────────┐
│  │ ID       │ Accept │ Status   │ Rect     │
│  ├──────────┼────────┼──────────┼──────────│
│  │ zone-1   │ card   │ idle     │ 0,0,300  │
│  │ zone-2   │ card   │ over ✓   │ 350,0,30 │
│  └──────────────────────────────────────────┘
├─────────────────────────────────────────────────
│  📋 Sortables (1)
│  ┌──────────────────────────────────────────┐
│  │ ID       │ Items │ Direction │ Status   │
│  ├──────────┼───────┼───────────┼──────────│
│  │ list-1   │ 5     │ vertical  │ sorting  │
│  └──────────────────────────────────────────┘
├─────────────────────────────────────────────────
│  Sensors: pointer ✓ │ touch ✓ │ keyboard ✓
│  Collision: rectangle │ AutoScroll: on
├─────────────────────────────────────────────────
│  [⏸️ Pause] [🎯 Show Rects] [📋 Copy State]
└─────────────────────────────────────────────────
```

---

## FRAMEWORK ADAPTERS

### 14. React Adapter (`@oxog/dragkit/react`)

```tsx
import {
  DragKitProvider,
  useDraggable,
  useDroppable,
  useSortable,
  useDragContext,
  SortableContext,
  SortableGridContext,
  DragOverlay,
} from '@oxog/dragkit/react'

// Provider
function App() {
  return (
    <DragKitProvider
      sensors={['pointer', 'touch', 'keyboard']}
      autoScroll
      collision="rectangle"
      onDragStart={(e) => console.log('Start', e)}
      onDragEnd={(e) => console.log('End', e)}
    >
      <KanbanBoard />
      <DragOverlay />
    </DragKitProvider>
  )
}

// Draggable Hook
function DraggableCard({ id, children }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setHandleRef,
    isDragging,
    transform,
    isDisabled,
  } = useDraggable({
    id,
    data: { type: 'card' },
    disabled: false,
  })

  const style = {
    transform: transform 
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)` 
      : undefined,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <button ref={setHandleRef} {...listeners} className="handle">⠿</button>
      {children}
    </div>
  )
}

// Droppable Hook
function DropZone({ id, children }) {
  const {
    setNodeRef,
    isOver,
    active,
    canDrop,
  } = useDroppable({
    id,
    accept: ['card'],
    data: { zone: 'todo' },
  })

  return (
    <div
      ref={setNodeRef}
      className={cn('drop-zone', isOver && 'over', canDrop && 'can-drop')}
    >
      {children}
    </div>
  )
}

// Sortable Hook
function SortableItem({ id, children }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    isSorting,
    index,
  } = useSortable({ id })

  const style = {
    transform: transform 
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)` 
      : undefined,
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1 : 0,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  )
}

// Sortable List
function TodoList() {
  const [items, setItems] = useState(['task-1', 'task-2', 'task-3'])

  const handleSortEnd = useCallback((event: SortEndEvent) => {
    const { oldIndex, newIndex } = event
    setItems(prev => arrayMove(prev, oldIndex, newIndex))
  }, [])

  return (
    <SortableContext 
      items={items} 
      direction="vertical"
      onSortEnd={handleSortEnd}
    >
      {items.map((id) => (
        <SortableItem key={id} id={id}>
          <TaskCard id={id} />
        </SortableItem>
      ))}
    </SortableContext>
  )
}

// Sortable Grid
function ImageGrid() {
  const [images, setImages] = useState(['img-1', 'img-2', 'img-3', 'img-4', 'img-5', 'img-6'])

  return (
    <SortableGridContext
      items={images}
      columns={3}
      gap={16}
      onSortEnd={({ oldIndex, newIndex }) => {
        setImages(prev => arrayMove(prev, oldIndex, newIndex))
      }}
    >
      <div className="grid grid-cols-3 gap-4">
        {images.map((id) => (
          <SortableItem key={id} id={id}>
            <img src={`/images/${id}.jpg`} alt={id} />
          </SortableItem>
        ))}
      </div>
    </SortableGridContext>
  )
}

// Drag Overlay
function App() {
  const [activeId, setActiveId] = useState<string | null>(null)

  return (
    <DragKitProvider
      onDragStart={(e) => setActiveId(e.draggable.id)}
      onDragEnd={() => setActiveId(null)}
    >
      <TaskBoard />
      <DragOverlay dropAnimation={{ duration: 200, easing: 'ease-out' }}>
        {activeId ? <TaskCard id={activeId} isOverlay /> : null}
      </DragOverlay>
    </DragKitProvider>
  )
}

// Context hook
function StatusIndicator() {
  const {
    isDragging,
    activeDraggable,
    activeDroppable,
    draggables,
    droppables,
  } = useDragContext()

  return (
    <div className="status">
      {isDragging && <span>Dragging: {activeDraggable?.id}</span>}
      {activeDroppable && <span>Over: {activeDroppable.id}</span>}
    </div>
  )
}

// Cross-list sorting (Kanban)
function KanbanBoard() {
  const [columns, setColumns] = useState({
    todo: ['task-1', 'task-2'],
    doing: ['task-3'],
    done: ['task-4', 'task-5'],
  })

  const handleSortEnd = (event: SortEndEvent) => {
    const { oldIndex, newIndex, sortable } = event
    const columnId = sortable.id
    
    setColumns(prev => ({
      ...prev,
      [columnId]: arrayMove(prev[columnId], oldIndex, newIndex),
    }))
  }

  const handleTransfer = (fromColumn: string, toColumn: string, itemId: string, toIndex: number) => {
    setColumns(prev => ({
      ...prev,
      [fromColumn]: prev[fromColumn].filter(id => id !== itemId),
      [toColumn]: [...prev[toColumn].slice(0, toIndex), itemId, ...prev[toColumn].slice(toIndex)],
    }))
  }

  return (
    <div className="kanban-board">
      {Object.entries(columns).map(([columnId, items]) => (
        <div key={columnId} className="kanban-column">
          <h3>{columnId}</h3>
          <SortableContext
            id={columnId}
            items={items}
            group="kanban"
            onSortEnd={handleSortEnd}
            onAdd={(e) => handleTransfer(e.from.id, columnId, e.item, e.index)}
          >
            {items.map((id) => (
              <SortableItem key={id} id={id}>
                <TaskCard id={id} />
              </SortableItem>
            ))}
          </SortableContext>
        </div>
      ))}
    </div>
  )
}

// Types
interface DragKitProviderProps {
  children: React.ReactNode
  sensors?: SensorType[]
  collision?: CollisionAlgorithm | CollisionFn
  autoScroll?: boolean | AutoScrollOptions
  accessibility?: boolean
  animation?: AnimationOptions | false
  plugins?: Plugin[]
  onDragStart?: (event: DragStartEvent) => void
  onDragMove?: (event: DragMoveEvent) => void
  onDragOver?: (event: DragOverEvent) => void
  onDragEnd?: (event: DragEndEvent) => void
  onDragCancel?: (event: DragCancelEvent) => void
}

interface UseDraggableOptions {
  id: string
  data?: DragData
  disabled?: boolean
  handle?: boolean  // Use setHandleRef for handle
}

interface UseDraggableReturn {
  attributes: DraggableAttributes
  listeners: DraggableListeners
  setNodeRef: (element: HTMLElement | null) => void
  setHandleRef: (element: HTMLElement | null) => void
  isDragging: boolean
  isDisabled: boolean
  transform: Transform | null
  node: HTMLElement | null
}

interface UseDroppableOptions {
  id: string
  accept?: string | string[] | AcceptFn
  disabled?: boolean
  data?: DropData
}

interface UseDroppableReturn {
  setNodeRef: (element: HTMLElement | null) => void
  isOver: boolean
  canDrop: boolean
  active: DraggableInstance | null
  node: HTMLElement | null
}

interface UseSortableOptions {
  id: string
  data?: DragData
  disabled?: boolean
}

interface UseSortableReturn extends UseDraggableReturn {
  index: number
  isSorting: boolean
  transition: string | undefined
}

interface SortableContextProps {
  children: React.ReactNode
  id?: string
  items: string[]
  direction?: 'vertical' | 'horizontal'
  group?: string | SortableGroup
  animation?: AnimationOptions | false
  disabled?: boolean
  onSortStart?: (event: SortStartEvent) => void
  onSortMove?: (event: SortMoveEvent) => void
  onSortEnd?: (event: SortEndEvent) => void
  onAdd?: (event: SortAddEvent) => void
  onRemove?: (event: SortRemoveEvent) => void
}

interface DragOverlayProps {
  children?: React.ReactNode
  dropAnimation?: AnimationOptions | null
  className?: string
  style?: React.CSSProperties
}
```

### 15. Vue Adapter (`@oxog/dragkit/vue`)

```typescript
import {
  createDragKit,
  useDraggable,
  useDroppable,
  useSortable,
  useDragContext,
  provideDragKit,
  injectDragKit,
  SortableContext,
  DragOverlay,
} from '@oxog/dragkit/vue'

// Plugin installation
const app = createApp(App)
app.use(createDragKit({
  sensors: ['pointer', 'touch', 'keyboard'],
  autoScroll: true,
}))

// Composition API - Draggable
const { setNodeRef, attributes, listeners, isDragging, transform } = useDraggable({
  id: 'item-1',
  data: { type: 'card' },
})

// Droppable
const { setNodeRef: dropRef, isOver, canDrop } = useDroppable({
  id: 'zone-1',
  accept: ['card'],
})

// Sortable
const { setNodeRef, attributes, listeners, transform, transition } = useSortable({
  id: 'sort-item-1',
})

// Template
<template>
  <div
    :ref="setNodeRef"
    :style="style"
    v-bind="attributes"
    v-on="listeners"
    :class="{ dragging: isDragging }"
  >
    {{ item.title }}
  </div>
</template>

<script setup>
import { useDraggable } from '@oxog/dragkit/vue'
import { computed } from 'vue'

const props = defineProps(['id', 'item'])

const { setNodeRef, attributes, listeners, isDragging, transform } = useDraggable({
  id: props.id,
  data: { type: 'card' },
})

const style = computed(() => ({
  transform: transform.value 
    ? `translate3d(${transform.value.x}px, ${transform.value.y}px, 0)` 
    : undefined,
  opacity: isDragging.value ? 0.5 : 1,
}))
</script>

// Sortable List
<template>
  <SortableContext
    :items="items"
    direction="vertical"
    @sort-end="handleSortEnd"
  >
    <SortableItem v-for="item in items" :key="item" :id="item">
      <TaskCard :item="item" />
    </SortableItem>
  </SortableContext>
</template>

// Context
const { isDragging, activeDraggable, activeDroppable } = useDragContext()
```

### 16. Svelte Adapter (`@oxog/dragkit/svelte`)

```typescript
import {
  createDragKitStore,
  draggable,
  droppable,
  sortable,
  createSortableStore,
} from '@oxog/dragkit/svelte'

// Create store
const dnd = createDragKitStore({
  sensors: ['pointer', 'touch', 'keyboard'],
  autoScroll: true,
})

// Actions - Draggable
<div 
  use:draggable={{ 
    id: 'item-1', 
    data: { type: 'card' } 
  }}
  class:dragging={$dnd.isDragging && $dnd.activeId === 'item-1'}
>
  Drag me
</div>

// Droppable
<div 
  use:droppable={{ 
    id: 'zone-1', 
    accept: ['card'] 
  }}
  class:over={$dnd.overDroppableId === 'zone-1'}
>
  Drop here
</div>

// Sortable Store
<script>
  import { createSortableStore, sortableItem } from '@oxog/dragkit/svelte'
  
  const sortable = createSortableStore({
    items: ['task-1', 'task-2', 'task-3'],
    direction: 'vertical',
  })
  
  function handleSortEnd(event) {
    sortable.setItems(event.detail.items)
  }
</script>

<div class="list" on:sortend={handleSortEnd}>
  {#each $sortable.items as item (item)}
    <div 
      use:sortableItem={{ id: item }}
      class:dragging={$sortable.activeId === item}
    >
      {item}
    </div>
  {/each}
</div>

// Store types
interface DragKitStore extends Readable<DragKitState> {
  draggable: (element: HTMLElement, options: DraggableOptions) => ActionReturn
  droppable: (element: HTMLElement, options: DroppableOptions) => ActionReturn
}

interface DragKitState {
  isDragging: boolean
  activeId: string | null
  activeDraggable: DraggableInstance | null
  activeDroppable: DroppableInstance | null
  overDroppableId: string | null
}

interface SortableStore extends Readable<SortableState> {
  setItems: (items: string[]) => void
  item: (element: HTMLElement, options: { id: string }) => ActionReturn
}

interface SortableState {
  items: string[]
  activeId: string | null
  overIndex: number | null
}
```

---

## PUBLIC API (Vanilla JS)

```typescript
// Main exports
import {
  // Factory
  createDragKit,
  
  // Types
  type DragKit,
  type DraggableOptions,
  type DraggableInstance,
  type DroppableOptions,
  type DroppableInstance,
  type SortableOptions,
  type SortableInstance,
  type DragEvent,
  type Plugin,
} from '@oxog/dragkit'

// Create instance
const dnd = createDragKit({
  sensors: ['pointer', 'touch', 'keyboard'],
  collision: 'rectangle',
  autoScroll: {
    speed: 10,
    threshold: 50,
  },
  accessibility: true,
  animation: { duration: 200, easing: 'ease-out' },
})

// Draggable
const card = dnd.draggable(cardElement, {
  id: 'card-1',
  data: { type: 'card', index: 0 },
  handle: '.drag-handle',
  preview: 'clone',
  onDragStart: (e) => console.log('Start', e),
  onDragEnd: (e) => console.log('End', e),
})

// Droppable
const zone = dnd.droppable(zoneElement, {
  id: 'zone-1',
  accept: ['card'],
  onDragEnter: (e) => console.log('Enter', e),
  onDrop: (e) => {
    console.log('Dropped:', e.draggable.id)
  },
})

// Sortable List
const list = dnd.sortable(listElement, {
  id: 'todo-list',
  items: ['task-1', 'task-2', 'task-3'],
  direction: 'vertical',
  animation: { duration: 200 },
  ghostClass: 'ghost',
  onSortEnd: (e) => {
    console.log('Sorted:', e.oldIndex, '->', e.newIndex)
  },
})

// Sortable Grid
const grid = dnd.sortableGrid(gridElement, {
  id: 'image-grid',
  items: ['img-1', 'img-2', 'img-3'],
  columns: 3,
  gap: 16,
})

// Global events
dnd.on('drag:start', (e) => console.log('Drag started:', e.draggable.id))
dnd.on('drag:end', (e) => console.log('Drag ended, dropped:', e.dropped))
dnd.on('sort:end', (e) => console.log('Sort ended:', e.items))

// State queries
dnd.isDragging()
dnd.getActiveDraggable()
dnd.getActiveDroppable()
dnd.getDraggables()
dnd.getDroppables()

// Configuration
dnd.configure({ collision: 'pointer' })

// Cleanup
card.destroy()
zone.destroy()
list.destroy()
dnd.destroy()

// Utilities
import { arrayMove, arrayInsert, arrayRemove } from '@oxog/dragkit'

const newArray = arrayMove(['a', 'b', 'c'], 0, 2)  // ['b', 'c', 'a']
```

---

## TECHNICAL REQUIREMENTS

- **Runtime**: Browser only (DOM required)
- **Module Format**: ESM + CJS (dual package)
- **Node.js Version**: >= 18 (for build/test)
- **TypeScript Version**: >= 5.0, strict mode
- **Bundle Size**: < 5KB core, < 12KB with plugins
- **Full Generic Support**: Type-safe event handlers

### Browser APIs Used

- `PointerEvent` - Unified pointer events
- `TouchEvent` - Touch device support
- `KeyboardEvent` - Keyboard navigation
- `MutationObserver` - DOM change detection
- `ResizeObserver` - Element resize detection
- `requestAnimationFrame` - Smooth animations
- `getBoundingClientRect` - Position calculations
- `Element.scrollIntoView` - Scroll management
- `DataTransfer` - Drag data (optional HTML5 DnD)

### Package Exports

```json
{
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "require": "./dist/index.cjs"
    },
    "./plugins": {
      "import": "./dist/plugins/index.js",
      "require": "./dist/plugins/index.cjs"
    },
    "./react": {
      "import": "./dist/react/index.js",
      "require": "./dist/react/index.cjs"
    },
    "./vue": {
      "import": "./dist/vue/index.js",
      "require": "./dist/vue/index.cjs"
    },
    "./svelte": {
      "import": "./dist/svelte/index.js",
      "require": "./dist/svelte/index.cjs"
    }
  }
}
```

### Peer Dependencies

```json
{
  "peerDependencies": {
    "react": ">=17.0.0",
    "vue": ">=3.0.0",
    "svelte": ">=3.0.0"
  },
  "peerDependenciesMeta": {
    "react": { "optional": true },
    "vue": { "optional": true },
    "svelte": { "optional": true }
  }
}
```

---

## PROJECT STRUCTURE

```
dragkit/
├── src/
│   ├── index.ts                    # Main entry, exports
│   ├── types.ts                    # All type definitions
│   │
│   ├── kernel/                     # Micro-kernel core
│   │   ├── index.ts
│   │   ├── kernel.ts               # Kernel implementation
│   │   ├── event-bus.ts            # Event system
│   │   └── plugin-registry.ts      # Plugin management
│   │
│   ├── plugins/                    # All plugins
│   │   ├── index.ts                # Optional plugins export
│   │   ├── core/                   # Core plugins (bundled)
│   │   │   ├── index.ts
│   │   │   ├── drag-manager.ts
│   │   │   ├── drop-manager.ts
│   │   │   ├── sortable-engine.ts
│   │   │   ├── pointer-sensor.ts
│   │   │   ├── touch-sensor.ts
│   │   │   └── collision-detector.ts
│   │   │
│   │   └── optional/               # Optional plugins
│   │       ├── index.ts
│   │       ├── keyboard-sensor.ts
│   │       ├── auto-scroll.ts
│   │       ├── multi-drag.ts
│   │       ├── nested-sortable.ts
│   │       ├── snap-grid.ts
│   │       ├── constraints.ts
│   │       └── drag-devtools/
│   │           ├── index.ts
│   │           ├── panel.tsx
│   │           ├── components/
│   │           │   ├── draggables-table.tsx
│   │           │   ├── droppables-table.tsx
│   │           │   ├── sortables-table.tsx
│   │           │   ├── status-bar.tsx
│   │           │   └── controls.tsx
│   │           ├── styles/
│   │           │   └── panel.css
│   │           └── utils/
│   │               ├── shadow-dom.ts
│   │               ├── draggable.ts
│   │               └── collision-overlay.ts
│   │
│   ├── adapters/                   # Framework adapters
│   │   ├── react/
│   │   │   ├── index.ts
│   │   │   ├── provider.tsx
│   │   │   ├── context.ts
│   │   │   ├── use-draggable.ts
│   │   │   ├── use-droppable.ts
│   │   │   ├── use-sortable.ts
│   │   │   ├── use-drag-context.ts
│   │   │   ├── sortable-context.tsx
│   │   │   ├── sortable-grid-context.tsx
│   │   │   └── drag-overlay.tsx
│   │   │
│   │   ├── vue/
│   │   │   ├── index.ts
│   │   │   ├── plugin.ts
│   │   │   ├── use-draggable.ts
│   │   │   ├── use-droppable.ts
│   │   │   ├── use-sortable.ts
│   │   │   ├── use-drag-context.ts
│   │   │   ├── sortable-context.vue
│   │   │   └── drag-overlay.vue
│   │   │
│   │   └── svelte/
│   │       ├── index.ts
│   │       ├── store.ts
│   │       ├── draggable-action.ts
│   │       ├── droppable-action.ts
│   │       ├── sortable-store.ts
│   │       └── sortable-item-action.ts
│   │
│   └── utils/                      # Internal utilities
│       ├── index.ts
│       ├── array.ts                # arrayMove, arrayInsert, etc.
│       ├── dom.ts                  # DOM utilities
│       ├── geometry.ts             # Position, rect calculations
│       ├── animation.ts            # FLIP animations
│       ├── scroll.ts               # Scroll utilities
│       └── uid.ts                  # Unique ID generator
│
├── tests/
│   ├── unit/
│   │   ├── kernel/
│   │   ├── plugins/
│   │   │   ├── core/
│   │   │   └── optional/
│   │   ├── adapters/
│   │   │   ├── react/
│   │   │   ├── vue/
│   │   │   └── svelte/
│   │   └── utils/
│   ├── integration/
│   │   ├── drag-drop.test.ts
│   │   ├── sortable.test.ts
│   │   ├── sortable-grid.test.ts
│   │   ├── cross-list.test.ts
│   │   ├── nested-sortable.test.ts
│   │   └── multi-drag.test.ts
│   └── fixtures/
│       ├── mock-dom.ts
│       └── test-elements.ts
│
├── examples/
│   ├── vanilla/
│   │   ├── basic-drag-drop/
│   │   ├── sortable-list/
│   │   └── kanban-board/
│   ├── react/
│   │   ├── basic/
│   │   ├── sortable/
│   │   ├── sortable-grid/
│   │   ├── kanban/
│   │   ├── nested-tree/
│   │   └── multi-drag/
│   ├── vue/
│   │   ├── basic/
│   │   ├── sortable/
│   │   └── kanban/
│   └── svelte/
│       ├── basic/
│       ├── sortable/
│       └── kanban/
│
├── website/                        # React + Vite documentation site
│   └── [See WEBSITE section below]
│
├── SPECIFICATION.md
├── IMPLEMENTATION.md
├── TASKS.md
├── README.md
├── CHANGELOG.md
├── LICENSE
├── package.json
├── tsconfig.json
├── tsup.config.ts
└── vitest.config.ts
```

---

## DOCUMENTATION WEBSITE

Build a modern, responsive documentation site for `https://dragkit.oxog.dev`

### Technology Stack

| Tech | Version | Purpose |
|------|---------|---------|
| **React** | 18+ | UI framework |
| **Vite** | 5+ | Build tool |
| **TypeScript** | 5+ | Type safety |
| **Tailwind CSS** | 3+ | Styling |
| **shadcn/ui** | Latest | UI components |
| **React Router** | 6+ | Routing |
| **Prism.js** | Latest | Syntax highlighting |
| **Framer Motion** | Latest | Animations |

### GitHub Pages Deployment

```yaml
# .github/workflows/deploy-website.yml
name: Deploy Website

on:
  push:
    branches: [main]
    paths:
      - 'website/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          
      - name: Install dependencies
        run: cd website && npm ci
        
      - name: Build
        run: cd website && npm run build
        
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./website/dist
          cname: dragkit.oxog.dev
```

### Website Structure

```
website/
├── public/
│   ├── favicon.svg
│   ├── og-image.png
│   └── robots.txt
│
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── index.css
│   │
│   ├── components/
│   │   ├── ui/                     # shadcn/ui components
│   │   │   └── ...
│   │   │
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── MobileNav.tsx
│   │   │   └── Layout.tsx
│   │   │
│   │   ├── home/
│   │   │   ├── Hero.tsx
│   │   │   ├── Features.tsx
│   │   │   ├── LiveDemo.tsx        # Interactive drag demo
│   │   │   ├── Comparison.tsx
│   │   │   ├── UseCases.tsx
│   │   │   └── CTA.tsx
│   │   │
│   │   ├── docs/
│   │   │   ├── DocPage.tsx
│   │   │   ├── TableOfContents.tsx
│   │   │   ├── CodeBlock.tsx
│   │   │   ├── FrameworkTabs.tsx
│   │   │   └── ApiTable.tsx
│   │   │
│   │   ├── examples/
│   │   │   ├── ExampleCard.tsx
│   │   │   ├── ExampleViewer.tsx
│   │   │   └── InteractiveExample.tsx
│   │   │
│   │   ├── playground/
│   │   │   ├── DragPlayground.tsx
│   │   │   ├── SortablePlayground.tsx
│   │   │   ├── KanbanPlayground.tsx
│   │   │   └── ConfigPanel.tsx
│   │   │
│   │   └── shared/
│   │       ├── Logo.tsx
│   │       ├── ThemeToggle.tsx
│   │       └── ...
│   │
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── docs/
│   │   │   ├── GettingStarted.tsx
│   │   │   ├── Installation.tsx
│   │   │   ├── concepts/
│   │   │   │   ├── Draggable.tsx
│   │   │   │   ├── Droppable.tsx
│   │   │   │   ├── Sortable.tsx
│   │   │   │   ├── Sensors.tsx
│   │   │   │   ├── Collision.tsx
│   │   │   │   └── Events.tsx
│   │   │   ├── api/
│   │   │   │   ├── CreateDragKit.tsx
│   │   │   │   ├── UseDraggable.tsx
│   │   │   │   ├── UseDroppable.tsx
│   │   │   │   ├── UseSortable.tsx
│   │   │   │   └── Hooks.tsx
│   │   │   ├── plugins/
│   │   │   │   ├── CorePlugins.tsx
│   │   │   │   ├── KeyboardSensor.tsx
│   │   │   │   ├── AutoScroll.tsx
│   │   │   │   ├── MultiDrag.tsx
│   │   │   │   ├── NestedSortable.tsx
│   │   │   │   ├── SnapGrid.tsx
│   │   │   │   └── DevTools.tsx
│   │   │   ├── frameworks/
│   │   │   │   ├── React.tsx
│   │   │   │   ├── Vue.tsx
│   │   │   │   └── Svelte.tsx
│   │   │   └── guides/
│   │   │       ├── SortableList.tsx
│   │   │       ├── SortableGrid.tsx
│   │   │       ├── KanbanBoard.tsx
│   │   │       ├── NestedTree.tsx
│   │   │       └── Accessibility.tsx
│   │   ├── Examples.tsx
│   │   ├── Playground.tsx
│   │   └── NotFound.tsx
│   │
│   ├── hooks/
│   │   ├── useTheme.ts
│   │   └── useScrollSpy.ts
│   │
│   ├── lib/
│   │   ├── utils.ts
│   │   └── docs-config.ts
│   │
│   └── styles/
│       └── globals.css
│
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── components.json
```

### Design System

```css
/* Color Palette - Dark Theme */
:root {
  --background: #09090b;
  --foreground: #fafafa;
  
  --card: #18181b;
  --card-foreground: #fafafa;
  
  --primary: #8b5cf6;               /* Purple - Drag/Move theme */
  --primary-foreground: #ffffff;
  
  --secondary: #27272a;
  --secondary-foreground: #fafafa;
  
  --muted: #27272a;
  --muted-foreground: #a1a1aa;
  
  --accent: #8b5cf6;
  --accent-foreground: #ffffff;
  
  --destructive: #ef4444;
  --success: #22c55e;
  --warning: #f59e0b;
  
  --border: #27272a;
  --ring: #8b5cf6;
}

/* Drag-specific colors */
--drag-active: #8b5cf6;
--drag-over: #22c55e;
--drag-ghost: rgba(139, 92, 246, 0.3);
--drop-indicator: #8b5cf6;
```

### Hero Section

```tsx
// src/components/home/Hero.tsx
import { motion } from 'framer-motion'
import { GripVertical, Move, Layers } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-violet-500/10" />
      
      {/* Main content */}
      <div className="container relative z-10 text-center">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", duration: 1 }}
        >
          <GripVertical className="w-24 h-24 mx-auto text-purple-500" />
        </motion.div>
        
        <motion.h1 
          className="text-6xl md:text-8xl font-bold mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Drag<span className="text-purple-500">Kit</span>
        </motion.h1>
        
        <motion.p className="text-xl md:text-2xl text-muted-foreground mt-4 max-w-2xl mx-auto">
          Zero-dependency drag & drop toolkit.
          <br />
          Lightweight. Powerful. Accessible.
        </motion.p>
        
        {/* Stats badges */}
        <motion.div className="flex flex-wrap justify-center gap-4 mt-8">
          <Badge variant="secondary">&lt; 5KB</Badge>
          <Badge variant="secondary">Zero Deps</Badge>
          <Badge variant="secondary">Touch + Keyboard</Badge>
        </motion.div>
        
        {/* CTA */}
        <motion.div className="flex justify-center gap-4 mt-8">
          <Button size="lg" asChild>
            <Link to="/docs/getting-started">Get Started</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <a href="https://github.com/ersinkoc/dragkit">GitHub</a>
          </Button>
        </motion.div>
        
        {/* Install */}
        <motion.div className="mt-12">
          <CodeBlock language="bash" className="max-w-md mx-auto">
            npm install @oxog/dragkit
          </CodeBlock>
        </motion.div>
        
        {/* Interactive Demo */}
        <motion.div className="mt-16 max-w-2xl mx-auto">
          <InteractiveDragDemo />
        </motion.div>
      </div>
    </section>
  )
}

function InteractiveDragDemo() {
  // Live sortable demo
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Try it - Drag to reorder</h3>
      <SortableList />
    </Card>
  )
}
```

### Required Pages

1. **Home** (`/`)
   - Hero with interactive demo
   - Features grid
   - Use cases (Kanban, file manager, etc.)
   - Size comparison

2. **Getting Started** (`/docs/getting-started`)
   - Installation
   - Quick start
   - Basic examples

3. **Concepts** (`/docs/concepts/*`)
   - Draggable
   - Droppable
   - Sortable
   - Sensors (Pointer, Touch, Keyboard)
   - Collision Detection
   - Events

4. **API Reference** (`/docs/api/*`)
   - createDragKit
   - useDraggable
   - useDroppable
   - useSortable
   - SortableContext
   - DragOverlay

5. **Plugins** (`/docs/plugins/*`)
   - Core Plugins
   - Keyboard Sensor
   - Auto-scroll
   - Multi-drag
   - Nested Sortable
   - Snap Grid
   - DevTools

6. **Frameworks** (`/docs/frameworks/*`)
   - React
   - Vue
   - Svelte

7. **Guides** (`/docs/guides/*`)
   - Sortable List
   - Sortable Grid
   - Kanban Board
   - Nested Tree
   - Accessibility

8. **Examples** (`/examples`)
   - Basic Drag & Drop
   - Todo List
   - Image Gallery
   - Kanban Board
   - File Tree
   - Multi-select

9. **Playground** (`/playground`)
   - Interactive drag builder
   - Sortable configurator
   - Kanban builder

---

## README.md

````markdown
# DragKit

<div align="center">
  <img src="website/public/logo.svg" alt="DragKit" width="120" />
  <h3>Zero-dependency drag & drop toolkit</h3>
  <p>
    <a href="https://dragkit.oxog.dev">Documentation</a> •
    <a href="https://dragkit.oxog.dev/docs/getting-started">Getting Started</a> •
    <a href="https://dragkit.oxog.dev/examples">Examples</a> •
    <a href="https://dragkit.oxog.dev/playground">Playground</a>
  </p>
</div>

<div align="center">

[![npm version](https://img.shields.io/npm/v/@oxog/dragkit.svg)](https://www.npmjs.com/package/@oxog/dragkit)
[![npm downloads](https://img.shields.io/npm/dm/@oxog/dragkit.svg)](https://www.npmjs.com/package/@oxog/dragkit)
[![bundle size](https://img.shields.io/bundlephobia/minzip/@oxog/dragkit)](https://bundlephobia.com/package/@oxog/dragkit)
[![license](https://img.shields.io/npm/l/@oxog/dragkit.svg)](LICENSE)

</div>

---

## Features

- 🎯 **Drag & Drop** - Draggable elements and drop zones
- 📋 **Sortable** - Vertical and horizontal lists
- 🔲 **Grid** - Sortable grids with columns
- 🌳 **Nested** - Tree and nested lists
- 👆 **Touch** - Full touch device support
- ⌨️ **Keyboard** - Accessible keyboard navigation
- 🎨 **Customizable** - Animations, constraints, collision
- 🔌 **Zero Dependencies** - No runtime dependencies
- ⚡ **Tiny** - Under 5KB minified + gzipped
- ⚛️ **React/Vue/Svelte** - First-class adapters

## Installation

```bash
npm install @oxog/dragkit
```

## Quick Start

### React

```tsx
import { DragKitProvider, useSortable, SortableContext } from '@oxog/dragkit/react'

function App() {
  const [items, setItems] = useState(['A', 'B', 'C'])

  return (
    <DragKitProvider>
      <SortableContext 
        items={items} 
        onSortEnd={({ oldIndex, newIndex }) => {
          setItems(arrayMove(items, oldIndex, newIndex))
        }}
      >
        {items.map(id => (
          <SortableItem key={id} id={id}>{id}</SortableItem>
        ))}
      </SortableContext>
    </DragKitProvider>
  )
}

function SortableItem({ id, children }) {
  const { setNodeRef, attributes, listeners, transform } = useSortable({ id })
  
  return (
    <div ref={setNodeRef} style={{ transform }} {...attributes} {...listeners}>
      {children}
    </div>
  )
}
```

### Vanilla JS

```typescript
import { createDragKit } from '@oxog/dragkit'

const dnd = createDragKit()

dnd.sortable(document.querySelector('.list'), {
  items: ['item-1', 'item-2', 'item-3'],
  onSortEnd: (e) => console.log('Sorted:', e.items),
})
```

## Comparison

| Feature | DragKit | dnd-kit | react-beautiful-dnd |
|---------|---------|---------|---------------------|
| Bundle Size | **< 5KB** | ~30KB | ~40KB |
| Dependencies | **0** | 2+ | 10+ |
| Touch Support | ✅ | ✅ | ✅ |
| Keyboard | ✅ | ✅ | ✅ |
| Grid Sort | ✅ | Plugin | ❌ |
| Vue/Svelte | ✅ | ❌ | ❌ |
| Maintained | ✅ | ✅ | ❌ |

## Documentation

Visit [dragkit.oxog.dev](https://dragkit.oxog.dev) for full documentation.

## License

MIT © [Ersin KOÇ](https://github.com/ersinkoc)
````

---

## CHANGELOG.md

```markdown
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0] - 2025-12-28

### Added
- Initial release
- Core drag and drop functionality
- Draggable elements with handles
- Droppable zones with accept filtering
- Sortable lists (vertical/horizontal)
- Sortable grids with columns
- Pointer sensor for mouse/pointer events
- Touch sensor for mobile devices
- Keyboard sensor for accessibility
- Collision detection algorithms (rectangle, center, pointer, closest)
- Auto-scroll plugin
- Multi-drag plugin for multiple selection
- Nested sortable plugin for trees
- Snap grid plugin
- Constraints plugin (axis lock, bounds)
- Drag DevTools panel
- Animation system with FLIP
- React adapter (DragKitProvider, useDraggable, useDroppable, useSortable)
- Vue adapter (useDraggable, useDroppable, useSortable)
- Svelte adapter (draggable, droppable actions, stores)
- Full TypeScript support
- 100% test coverage
- Documentation website

### Security
- No external dependencies
```

---

## IMPLEMENTATION CHECKLIST

Before starting implementation:
- [ ] Create SPECIFICATION.md with complete package spec
- [ ] Create IMPLEMENTATION.md with architecture design
- [ ] Create TASKS.md with ordered task list

During implementation:
- [ ] Implement kernel first (foundation)
- [ ] Implement core plugins (6)
- [ ] Implement optional plugins (7)
- [ ] Implement framework adapters (React, Vue, Svelte)
- [ ] Build Drag DevTools panel
- [ ] Maintain 100% test coverage throughout
- [ ] Write JSDoc for all public APIs
- [ ] Build documentation website

Before completion:
- [ ] All tests passing (100% success rate)
- [ ] Coverage report shows 100%
- [ ] Bundle size < 5KB core
- [ ] README.md complete
- [ ] CHANGELOG.md initialized
- [ ] Website fully functional
- [ ] Website deploys to GitHub Pages
- [ ] Package builds without errors
- [ ] Tree-shaking works correctly
- [ ] All framework adapters tested
- [ ] Touch support tested on mobile
- [ ] Keyboard navigation tested
- [ ] Examples work correctly
- [ ] Playground functional

---

## CRITICAL IMPLEMENTATION NOTES

### Pointer Events
- Use PointerEvents API (unified mouse/touch/pen)
- Handle pointer capture for reliable drag
- Calculate delta from initial position
- Support activation constraints (delay, distance)

### Touch Support
- Prevent scroll during drag (touch-action: none)
- Handle touch cancel events
- Test on real mobile devices
- Consider long-press activation

### Keyboard Navigation
- Tab to focus draggables
- Space/Enter to start drag
- Arrow keys to move
- Escape to cancel
- ARIA attributes for screen readers

### Collision Detection
- Efficient algorithms for many elements
- Support multiple strategies
- Handle overlapping droppables
- Recalculate on scroll

### Sortable Animation
- Use FLIP technique for smooth reorder
- Handle items entering/leaving
- Animate placeholder
- Support custom easing

### Performance
- Minimize DOM queries during drag
- Use transform instead of position
- Batch DOM updates
- Debounce collision detection
- Use requestAnimationFrame

### Accessibility
- ARIA roles and attributes
- Live region announcements
- Focus management
- High contrast support

### Testing
- Mock pointer events
- Mock touch events
- Test keyboard navigation
- Test collision algorithms
- Test animations
- 100% coverage required

---

## BEGIN IMPLEMENTATION

Start by creating SPECIFICATION.md with the complete package specification. Then proceed with IMPLEMENTATION.md and TASKS.md before writing any actual code.

Remember: This package will be published to NPM. It must be production-ready, zero-dependency, fully tested, and professionally documented.

Touch support and accessibility are critical - test thoroughly on mobile devices and with screen readers.

**Date: 2025-12-28**
**Author: Ersin KOÇ**
**Repository: github.com/ersinkoc/dragkit**
**Website: dragkit.oxog.dev**