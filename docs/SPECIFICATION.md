# DragKit - Package Specification

**Version:** 1.0.0
**Package Name:** `@oxog/dragkit`
**Author:** Ersin KOÇ
**License:** MIT
**Created:** 2025-12-28

---

## Executive Summary

DragKit is a zero-dependency drag and drop library built on a micro-kernel plugin architecture. It provides draggable elements, droppable zones, sortable lists and grids with support for pointer, touch, and keyboard sensors, collision detection, auto-scroll, multi-drag, nested sortables, constraints, and animations.

### Key Differentiators

- **Zero Dependencies**: No runtime dependencies
- **Tiny Bundle**: < 5KB core, < 12KB with all plugins
- **Framework Agnostic**: Vanilla JS core with React, Vue, and Svelte adapters
- **Fully Accessible**: Keyboard navigation and screen reader support
- **Type Safe**: Full TypeScript support with strict mode
- **100% Tested**: Complete test coverage with 100% success rate

---

## Core Specifications

### 1. Package Identity

```json
{
  "name": "@oxog/dragkit",
  "version": "1.0.0",
  "description": "Zero-dependency drag & drop toolkit with micro-kernel plugin architecture",
  "license": "MIT",
  "author": "Ersin KOÇ",
  "repository": {
    "type": "git",
    "url": "https://github.com/ersinkoc/dragkit"
  },
  "homepage": "https://dragkit.oxog.dev",
  "keywords": [
    "drag",
    "drop",
    "dnd",
    "sortable",
    "draggable",
    "droppable",
    "reorder",
    "zero-dependency",
    "typescript",
    "react",
    "vue",
    "svelte"
  ]
}
```

### 2. Non-Negotiable Requirements

#### 2.1 Zero Dependencies
```json
{
  "dependencies": {}  // MUST BE EMPTY
}
```

All functionality must be implemented from scratch. No runtime dependencies allowed.

#### 2.2 100% Test Coverage & Success Rate
- Every line of code must be tested
- Every branch must be covered
- All tests must pass (100% success rate)
- Use Vitest for testing
- Coverage report must show 100%

#### 2.3 TypeScript Strict Mode
```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true
  }
}
```

#### 2.4 Bundle Size Targets
- **Core package**: < 5KB minified + gzipped
- **With all plugins**: < 12KB minified + gzipped
- **Tree-shakeable**: Unused code can be eliminated
- **ESM + CJS**: Support both module formats

#### 2.5 Browser Support
- Modern browsers with PointerEvents API
- Chrome 55+
- Firefox 52+
- Safari 13+
- Edge 79+
- Mobile Safari 13+
- Chrome Android 55+

---

## Architecture Specification

### 3. Micro-Kernel Architecture

#### 3.1 Kernel Responsibilities

The kernel is the minimal core that:
1. Manages draggable instances
2. Manages droppable instances
3. Manages sortable instances
4. Coordinates sensors
5. Handles collision detection
6. Emits global events
7. Loads and coordinates plugins

#### 3.2 Kernel API

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
```

### 4. Type System Specification

#### 4.1 Draggable Types

```typescript
interface DraggableOptions {
  id: string
  data?: DragData
  handle?: string | HTMLElement
  disabled?: boolean
  axis?: 'x' | 'y' | 'both'
  bounds?: BoundsOption
  preview?: PreviewOption
  previewClass?: string
  dragClass?: string
  cursorGrabbing?: boolean
  delay?: number
  distance?: number

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

  isDragging(): boolean
  isDisabled(): boolean
  getPosition(): Position
  getTransform(): Transform

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
  | 'clone'
  | 'ghost'
  | 'none'
  | HTMLElement
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

#### 4.2 Droppable Types

```typescript
interface DroppableOptions {
  id: string
  accept?: string | string[] | AcceptFn
  disabled?: boolean
  data?: DropData
  activeClass?: string
  overClass?: string

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

  isOver(): boolean
  isDisabled(): boolean
  canAccept(draggable: DraggableInstance): boolean
  getRect(): DOMRect

  enable(): void
  disable(): void
  destroy(): void
}

interface DropData {
  [key: string]: unknown
}

type AcceptFn = (draggable: DraggableInstance) => boolean
```

#### 4.3 Sortable Types

```typescript
interface SortableOptions {
  id: string
  items: string[]
  direction?: 'vertical' | 'horizontal'
  handle?: string
  disabled?: boolean
  animation?: AnimationOptions | false
  ghostClass?: string
  dragClass?: string
  chosenClass?: string
  dropIndicator?: boolean | DropIndicatorOptions
  group?: string | SortableGroup

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

  getItems(): string[]
  getItemElements(): HTMLElement[]
  isDragging(): boolean

  setItems(items: string[]): void
  addItem(id: string, index?: number): void
  removeItem(id: string): void
  moveItem(fromIndex: number, toIndex: number): void
  enable(): void
  disable(): void
  destroy(): void
}

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

#### 4.4 Event Types

```typescript
type EventType =
  | 'drag:start'
  | 'drag:move'
  | 'drag:over'
  | 'drag:enter'
  | 'drag:leave'
  | 'drag:end'
  | 'drag:cancel'
  | 'sort:start'
  | 'sort:move'
  | 'sort:end'
  | 'sort:add'
  | 'sort:remove'

interface BaseDragEvent {
  type: EventType
  timestamp: number
  originalEvent: PointerEvent | TouchEvent | KeyboardEvent | null
}

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

interface DragEndEvent extends BaseDragEvent {
  type: 'drag:end'
  draggable: DraggableInstance
  droppable: DroppableInstance | null
  position: Position
  dropped: boolean
}

// ... (more event types)
```

---

## Plugin Specification

### 5. Core Plugins (Always Loaded)

#### 5.1 drag-manager
Manages draggable element lifecycle and state.

**API:**
```typescript
interface DragManagerAPI {
  register(element: HTMLElement, options: DraggableOptions): DraggableInstance
  unregister(id: string): void
  get(id: string): DraggableInstance | undefined
  getAll(): Map<string, DraggableInstance>
  getActive(): DraggableInstance | null
  setActive(id: string | null): void
  isDragging(): boolean
}
```

#### 5.2 drop-manager
Manages droppable zone lifecycle and accept logic.

**API:**
```typescript
interface DropManagerAPI {
  register(element: HTMLElement, options: DroppableOptions): DroppableInstance
  unregister(id: string): void
  get(id: string): DroppableInstance | undefined
  getAll(): Map<string, DroppableInstance>
  getAccepting(draggable: DraggableInstance): DroppableInstance[]
  getActive(): DroppableInstance | null
  setActive(id: string | null): void
}
```

#### 5.3 sortable-engine
Handles list and grid sorting logic.

**API:**
```typescript
interface SortableEngineAPI {
  createSortable(container: HTMLElement, options: SortableOptions): SortableInstance
  createSortableGrid(container: HTMLElement, options: SortableGridOptions): SortableGridInstance
  get(id: string): SortableInstance | undefined
  getAll(): Map<string, SortableInstance>
  moveItem(sortableId: string, fromIndex: number, toIndex: number): void
  transferItem(fromId: string, toId: string, itemId: string, toIndex: number): void
}
```

#### 5.4 pointer-sensor
Mouse and pointer event handling.

**Features:**
- PointerEvents API for unified input
- Pointer capture for reliable tracking
- Activation constraints (delay, distance)
- Delta calculation

#### 5.5 touch-sensor
Touch device support.

**Features:**
- Touch event handling
- Prevent scroll during drag
- Touch cancel handling
- Multi-touch awareness

#### 5.6 collision-detector
Hit testing and overlap detection.

**Algorithms:**
1. **Rectangle**: Any overlap between bounding boxes
2. **Center**: Draggable center inside droppable
3. **Pointer**: Pointer position inside droppable
4. **Closest**: Closest droppable to pointer

### 6. Optional Plugins

#### 6.1 keyboard-sensor
Keyboard navigation for accessibility.

**Features:**
- Arrow key movement
- Space/Enter to activate
- Escape to cancel
- Screen reader announcements

#### 6.2 auto-scroll
Automatic scrolling when near edges.

**Features:**
- Detect scrollable containers
- Speed based on distance from edge
- Acceleration curve
- Both window and element scroll

#### 6.3 multi-drag
Multiple item selection and dragging.

**Features:**
- Ctrl/Shift click selection
- Drag all selected items
- Stacked preview
- Batch updates

#### 6.4 nested-sortable
Tree and nested list support.

**Features:**
- Max depth enforcement
- Expand/collapse nodes
- Indent visualization
- Nest on hover with delay

#### 6.5 snap-grid
Snap to grid during drag.

**Features:**
- Configurable grid size
- Separate x/y grid
- Grid offset
- Visual grid overlay

#### 6.6 constraints
Axis locking and bounds.

**Features:**
- Lock to x or y axis
- Constrain to parent/window/custom bounds
- Padding support

#### 6.7 drag-devtools
Visual debugging panel.

**Features:**
- Live state inspection
- Draggable/droppable/sortable tables
- Collision rect visualization
- Event log
- Performance metrics

---

## Framework Adapter Specification

### 7. React Adapter

**Package:** `@oxog/dragkit/react`

**Exports:**
- `DragKitProvider` - Context provider
- `useDraggable` - Draggable hook
- `useDroppable` - Droppable hook
- `useSortable` - Sortable item hook
- `useDragContext` - Access drag state
- `SortableContext` - Sortable list wrapper
- `SortableGridContext` - Sortable grid wrapper
- `DragOverlay` - Portal overlay component

### 8. Vue Adapter

**Package:** `@oxog/dragkit/vue`

**Exports:**
- `createDragKit` - Plugin factory
- `useDraggable` - Composable
- `useDroppable` - Composable
- `useSortable` - Composable
- `useDragContext` - Composable
- `SortableContext` - Component
- `DragOverlay` - Component

### 9. Svelte Adapter

**Package:** `@oxog/dragkit/svelte`

**Exports:**
- `createDragKitStore` - Store factory
- `draggable` - Action
- `droppable` - Action
- `sortable` - Action
- `createSortableStore` - Sortable store factory

---

## Technical Requirements

### 10. Browser APIs Used

- `PointerEvent` - Unified pointer events
- `TouchEvent` - Touch device support
- `KeyboardEvent` - Keyboard navigation
- `MutationObserver` - DOM change detection
- `ResizeObserver` - Element resize detection
- `requestAnimationFrame` - Smooth animations
- `getBoundingClientRect` - Position calculations
- `Element.scrollIntoView` - Scroll management

### 11. Module Format

**Dual Package (ESM + CJS):**

```json
{
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "require": "./dist/index.cjs",
      "types": "./dist/index.d.ts"
    },
    "./plugins": {
      "import": "./dist/plugins/index.js",
      "require": "./dist/plugins/index.cjs",
      "types": "./dist/plugins/index.d.ts"
    },
    "./react": {
      "import": "./dist/react/index.js",
      "require": "./dist/react/index.cjs",
      "types": "./dist/react/index.d.ts"
    },
    "./vue": {
      "import": "./dist/vue/index.js",
      "require": "./dist/vue/index.cjs",
      "types": "./dist/vue/index.d.ts"
    },
    "./svelte": {
      "import": "./dist/svelte/index.js",
      "require": "./dist/svelte/index.cjs",
      "types": "./dist/svelte/index.d.ts"
    }
  }
}
```

### 12. Peer Dependencies

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

## Performance Specifications

### 13. Performance Targets

- **Initial Load**: < 10ms to initialize kernel
- **Drag Start**: < 16ms (1 frame) to start drag
- **Drag Move**: < 8ms per frame during drag
- **Sort Animation**: 60fps FLIP animation
- **Collision Detection**: < 5ms for 100 droppables
- **Memory**: < 1MB overhead for 1000 draggables

### 14. Optimization Strategies

1. **Minimize DOM Queries**: Cache element references
2. **Use CSS Transforms**: Hardware acceleration
3. **Batch Updates**: Combine DOM mutations
4. **Debounce Collision**: Don't check every frame
5. **RequestAnimationFrame**: Smooth updates
6. **Event Delegation**: Single listener per type
7. **WeakMap Cache**: Automatic cleanup

---

## Accessibility Specifications

### 15. WCAG 2.1 AA Compliance

#### 15.1 Keyboard Support

- **Tab**: Navigate to draggable elements
- **Space/Enter**: Activate drag mode
- **Arrow Keys**: Move draggable (10px default)
- **Escape**: Cancel drag
- **Tab (during drag)**: Change droppable focus

#### 15.2 ARIA Attributes

```html
<!-- Draggable -->
<div
  role="button"
  aria-label="Draggable item 1"
  aria-grabbed="false"
  aria-describedby="drag-instructions"
  tabindex="0"
>

<!-- Droppable -->
<div
  role="region"
  aria-label="Drop zone"
  aria-dropeffect="move"
>

<!-- Sortable Item -->
<div
  role="button"
  aria-label="Task 1 of 5"
  aria-grabbed="false"
  tabindex="0"
>
```

#### 15.3 Screen Reader Announcements

```typescript
announcements: {
  onDragStart: (item) => `Started dragging ${item.id}`,
  onDragOver: (zone) => zone ? `Over ${zone.id}` : 'Not over any drop zone',
  onDragEnd: (dropped) => dropped ? 'Item dropped' : 'Drag cancelled',
  onSortMove: (from, to) => `Moved item from position ${from} to ${to}`,
}
```

---

## Testing Specifications

### 16. Test Coverage Requirements

- **Unit Tests**: 100% coverage of all functions
- **Integration Tests**: All drag scenarios
- **E2E Tests**: Cross-browser testing
- **Visual Regression**: Screenshot comparisons
- **Performance Tests**: Benchmark critical paths
- **Accessibility Tests**: axe-core validation

### 17. Test Categories

#### 17.1 Unit Tests

- Kernel API
- Plugin lifecycle
- Event system
- Collision algorithms
- Transform calculations
- Utility functions

#### 17.2 Integration Tests

- Basic drag and drop
- Sortable lists (vertical/horizontal)
- Sortable grids
- Cross-list sorting (Kanban)
- Nested sortables
- Multi-drag
- Touch gestures
- Keyboard navigation

#### 17.3 Framework Tests

- React hooks
- Vue composables
- Svelte actions and stores

---

## Documentation Requirements

### 18. API Documentation

- JSDoc comments for all public APIs
- TypeScript definitions for all exports
- Usage examples for each feature
- Migration guides from other libraries

### 19. Website Content

**Required Pages:**
1. Home with interactive demos
2. Getting Started guide
3. Concepts documentation
4. API reference
5. Plugin documentation
6. Framework guides
7. Examples gallery
8. Playground

---

## Success Criteria

### 20. Package Release Checklist

- [ ] Zero runtime dependencies
- [ ] 100% test coverage
- [ ] All tests passing
- [ ] Bundle size < 5KB core
- [ ] TypeScript strict mode
- [ ] Documentation complete
- [ ] Examples working
- [ ] Website deployed
- [ ] README with badges
- [ ] CHANGELOG initialized
- [ ] MIT license
- [ ] GitHub repository
- [ ] NPM package published

---

**Date:** 2025-12-28
**Version:** 1.0.0
**Status:** Specification Complete
