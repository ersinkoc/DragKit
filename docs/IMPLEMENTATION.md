# DragKit - Implementation Guide

**Version:** 1.0.0
**Date:** 2025-12-28
**Author:** Ersin KOÇ

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Design Decisions](#design-decisions)
3. [Implementation Patterns](#implementation-patterns)
4. [File Structure](#file-structure)
5. [Core Implementation](#core-implementation)
6. [Plugin Implementation](#plugin-implementation)
7. [Framework Adapters](#framework-adapters)
8. [Testing Strategy](#testing-strategy)
9. [Build & Bundle](#build--bundle)
10. [Performance Optimization](#performance-optimization)

---

## Architecture Overview

### Micro-Kernel Pattern

DragKit uses a **micro-kernel architecture** where:

1. **Kernel** = Minimal core (event bus + plugin registry + state management)
2. **Core Plugins** = Essential functionality (drag, drop, sort, sensors, collision)
3. **Optional Plugins** = Extended features (keyboard, auto-scroll, multi-drag, etc.)
4. **Adapters** = Framework-specific bindings (React, Vue, Svelte)

```
┌─────────────────────────────────────────────────────┐
│                    KERNEL CORE                      │
│  ┌──────────────┐ ┌──────────────┐ ┌─────────────┐ │
│  │  Event Bus   │ │   Registry   │ │    State    │ │
│  └──────────────┘ └──────────────┘ └─────────────┘ │
└─────────────────────────────────────────────────────┘
                         ▲
                         │
         ┌───────────────┼───────────────┐
         │                               │
┌────────┴─────────┐           ┌────────┴────────┐
│   CORE PLUGINS   │           │ OPTIONAL PLUGINS│
│  - drag-manager  │           │ - keyboard      │
│  - drop-manager  │           │ - auto-scroll   │
│  - sortable      │           │ - multi-drag    │
│  - pointer       │           │ - nested        │
│  - touch         │           │ - snap-grid     │
│  - collision     │           │ - constraints   │
└──────────────────┘           │ - devtools      │
                               └─────────────────┘
                                       ▲
                                       │
                    ┌──────────────────┼──────────────────┐
                    │                  │                  │
            ┌───────┴────────┐ ┌──────┴──────┐ ┌────────┴────────┐
            │ React Adapter  │ │ Vue Adapter │ │ Svelte Adapter  │
            └────────────────┘ └─────────────┘ └─────────────────┘
```

### Why This Architecture?

1. **Tree-Shakeable**: Only import what you need
2. **Extensible**: Easy to add custom plugins
3. **Framework Agnostic**: Core has no framework dependencies
4. **Testable**: Each layer can be tested independently
5. **Maintainable**: Clear separation of concerns

---

## Design Decisions

### 1. Zero Dependencies

**Decision:** No runtime dependencies allowed.

**Rationale:**
- Smaller bundle size
- No breaking changes from dependencies
- Full control over code quality
- Better for security
- Faster installation

**Implementation:**
- Implement all utilities from scratch
- Use native browser APIs
- No polyfills (modern browsers only)

### 2. TypeScript Strict Mode

**Decision:** Use strictest TypeScript settings.

**Rationale:**
- Catch bugs at compile time
- Better IDE support
- Self-documenting code
- Easier refactoring
- Type-safe event system

**Configuration:**
```typescript
{
  "strict": true,
  "noUncheckedIndexedAccess": true,
  "noImplicitOverride": true
}
```

### 3. PointerEvents over Mouse/Touch

**Decision:** Use PointerEvents API as primary input.

**Rationale:**
- Unified API for mouse, touch, pen
- Better browser support than Touch Events
- Automatic pointer capture
- Cleaner code (one sensor instead of two)

**Fallback:** Separate TouchSensor for older Safari.

### 4. Event System Design

**Decision:** Custom event bus with typed events.

**Rationale:**
- Type-safe event handlers
- Decoupled plugin communication
- Easy to add new event types
- No dependency on DOM events

**Implementation:**
```typescript
type EventType = 'drag:start' | 'drag:move' | 'drag:end' | ...

on<E extends EventType>(
  eventType: E,
  handler: EventHandler<E>
): Unsubscribe
```

### 5. Transform vs Position

**Decision:** Use CSS `transform` for drag positioning.

**Rationale:**
- Hardware accelerated
- No layout recalculation
- Smooth 60fps movement
- Easy to animate

**Implementation:**
```typescript
element.style.transform = `translate3d(${x}px, ${y}px, 0)`
```

### 6. FLIP Animation

**Decision:** Use FLIP technique for sortable animations.

**Rationale:**
- Smooth reordering
- 60fps animation
- No janky layout shifts
- Industry standard (used by dnd-kit, react-beautiful-dnd)

**FLIP:**
- **F**irst: Record initial position
- **L**ast: Apply new order
- **I**nvert: Calculate delta
- **P**lay: Animate from invert to 0

### 7. Plugin Hook System

**Decision:** Lifecycle hooks for plugins to intercept events.

**Rationale:**
- Non-invasive plugin integration
- Plugins can modify behavior
- Multiple plugins can coexist
- Easy to debug (clear execution order)

**Hooks:**
```typescript
hooks: {
  beforeDragStart?: (draggable, event) => boolean,  // Can cancel
  afterDragStart?: (event) => void,
  beforeDragMove?: (event) => event,  // Can modify
  afterDragMove?: (event) => void,
  // ...
}
```

### 8. ID-based System

**Decision:** Use string IDs to identify draggables/droppables.

**Rationale:**
- Framework agnostic (works with React keys, Vue keys, etc.)
- Easy serialization
- Clear intent
- Works with virtual lists

**Alternative Rejected:** Element-based (hard to track across re-renders).

### 9. Collision Algorithm Strategy

**Decision:** Multiple algorithms, user selectable.

**Rationale:**
- Different use cases need different algorithms
- Rectangle: General purpose
- Center: Nested containers
- Pointer: Precision needed
- Closest: Visual feedback

**Implementation:**
```typescript
setCollisionAlgorithm('rectangle' | 'center' | 'pointer' | 'closest' | custom)
```

### 10. Framework Adapter Pattern

**Decision:** Separate adapters for React/Vue/Svelte.

**Rationale:**
- Each framework has different patterns (hooks vs composables vs actions)
- Idiomatic API for each framework
- Core remains framework-agnostic
- Tree-shakeable (only import adapter you need)

---

## Implementation Patterns

### 1. Singleton Kernel

```typescript
// Create kernel instance
const kernel = createKernel(options)

// Kernel manages all state
kernel.draggables = new Map()
kernel.droppables = new Map()
kernel.sortables = new Map()
kernel.sensors = []
kernel.plugins = new Map()
```

### 2. Instance Pattern

Each draggable/droppable/sortable is an instance:

```typescript
class DraggableInstance {
  constructor(
    public id: string,
    public element: HTMLElement,
    public options: DraggableOptions,
    private kernel: Kernel
  ) {}

  isDragging(): boolean {
    return this.kernel.getActiveDraggable() === this
  }

  destroy() {
    this.kernel.getDragManager().unregister(this.id)
  }
}
```

### 3. Plugin Registration

```typescript
interface Plugin {
  name: string
  version: string
  type: 'core' | 'optional'

  install(kernel: Kernel): void | Promise<void>
  uninstall(): void | Promise<void>

  hooks?: PluginHooks
  api?: Record<string, unknown>
}

// Usage
kernel.register(dragManagerPlugin)
kernel.register(pointerSensorPlugin)
```

### 4. Event Bus

```typescript
class EventBus {
  private handlers = new Map<EventType, Set<Function>>()

  on<E extends EventType>(
    type: E,
    handler: EventHandler<E>
  ): Unsubscribe {
    if (!this.handlers.has(type)) {
      this.handlers.set(type, new Set())
    }
    this.handlers.get(type)!.add(handler)

    return () => this.off(type, handler)
  }

  emit<E extends EventType>(event: Extract<DragEvent, { type: E }>) {
    const handlers = this.handlers.get(event.type)
    if (handlers) {
      handlers.forEach(handler => handler(event))
    }
  }
}
```

### 5. Sensor Pattern

```typescript
interface Sensor {
  type: SensorType

  attach(kernel: Kernel): void
  detach(): void

  isActive(): boolean

  activate(element: HTMLElement, event: Event): void
  deactivate(): void
}

class PointerSensor implements Sensor {
  type = 'pointer' as const
  private kernel?: Kernel
  private activeElement?: HTMLElement

  attach(kernel: Kernel) {
    this.kernel = kernel
    document.addEventListener('pointerdown', this.handlePointerDown)
  }

  private handlePointerDown = (e: PointerEvent) => {
    const draggable = this.findDraggable(e.target)
    if (draggable) {
      this.activate(draggable.element, e)
    }
  }

  activate(element: HTMLElement, event: Event) {
    element.setPointerCapture((event as PointerEvent).pointerId)
    this.kernel?.emit({ type: 'drag:start', ... })
  }
}
```

### 6. Collision Detection

```typescript
interface CollisionDetector {
  detect(
    draggable: DraggableInstance,
    droppables: DroppableInstance[]
  ): DroppableInstance | null
}

const rectangleCollision: CollisionDetector = {
  detect(draggable, droppables) {
    const dragRect = draggable.element.getBoundingClientRect()

    return droppables.find(droppable => {
      const dropRect = droppable.element.getBoundingClientRect()
      return rectangleIntersection(dragRect, dropRect)
    }) ?? null
  }
}

function rectangleIntersection(a: DOMRect, b: DOMRect): boolean {
  return !(
    a.right < b.left ||
    a.left > b.right ||
    a.bottom < b.top ||
    a.top > b.bottom
  )
}
```

### 7. Transform Management

```typescript
class TransformManager {
  private transforms = new WeakMap<HTMLElement, Transform>()

  set(element: HTMLElement, transform: Transform) {
    this.transforms.set(element, transform)
    element.style.transform =
      `translate3d(${transform.x}px, ${transform.y}px, 0)`
  }

  get(element: HTMLElement): Transform | null {
    return this.transforms.get(element) ?? null
  }

  reset(element: HTMLElement) {
    this.transforms.delete(element)
    element.style.transform = ''
  }
}
```

### 8. FLIP Animation

```typescript
async function animateMove(
  element: HTMLElement,
  from: DOMRect,
  to: DOMRect,
  options: AnimationOptions
) {
  // First - already have 'from'

  // Last - element is already in new position
  // (no action needed, DOM updated)

  // Invert - calculate how far we moved
  const deltaX = from.left - to.left
  const deltaY = from.top - to.top

  // Play - animate from inverted to 0
  element.animate([
    { transform: `translate(${deltaX}px, ${deltaY}px)` },
    { transform: 'translate(0, 0)' }
  ], {
    duration: options.duration,
    easing: options.easing
  })
}
```

---

## File Structure

```
src/
├── index.ts                      # Main exports
├── types.ts                      # All TypeScript types
│
├── kernel/
│   ├── index.ts
│   ├── kernel.ts                 # Kernel implementation
│   ├── event-bus.ts              # Event system
│   └── plugin-registry.ts        # Plugin management
│
├── plugins/
│   ├── index.ts                  # Optional plugins export
│   │
│   ├── core/                     # Core plugins (auto-loaded)
│   │   ├── index.ts
│   │   ├── drag-manager.ts
│   │   ├── drop-manager.ts
│   │   ├── sortable-engine.ts
│   │   ├── pointer-sensor.ts
│   │   ├── touch-sensor.ts
│   │   └── collision-detector.ts
│   │
│   └── optional/                 # Optional plugins
│       ├── index.ts
│       ├── keyboard-sensor.ts
│       ├── auto-scroll.ts
│       ├── multi-drag.ts
│       ├── nested-sortable.ts
│       ├── snap-grid.ts
│       ├── constraints.ts
│       └── drag-devtools/
│
├── adapters/
│   ├── react/
│   │   ├── index.ts
│   │   ├── provider.tsx
│   │   ├── context.ts
│   │   ├── use-draggable.ts
│   │   ├── use-droppable.ts
│   │   ├── use-sortable.ts
│   │   └── drag-overlay.tsx
│   │
│   ├── vue/
│   │   ├── index.ts
│   │   ├── plugin.ts
│   │   ├── use-draggable.ts
│   │   ├── use-droppable.ts
│   │   └── use-sortable.ts
│   │
│   └── svelte/
│       ├── index.ts
│       ├── store.ts
│       ├── draggable-action.ts
│       ├── droppable-action.ts
│       └── sortable-store.ts
│
└── utils/
    ├── index.ts
    ├── array.ts                  # arrayMove, arrayInsert
    ├── dom.ts                    # DOM utilities
    ├── geometry.ts               # Position, rect math
    ├── animation.ts              # FLIP animations
    ├── scroll.ts                 # Scroll utilities
    └── uid.ts                    # Unique ID generator
```

---

## Core Implementation

### Kernel Implementation

**File:** `src/kernel/kernel.ts`

```typescript
export class DragKitKernel {
  private eventBus = new EventBus()
  private pluginRegistry = new PluginRegistry()
  private options: KernelOptions

  private draggables = new Map<string, DraggableInstance>()
  private droppables = new Map<string, DroppableInstance>()
  private sortables = new Map<string, SortableInstance>()

  private activeDraggable: DraggableInstance | null = null
  private activeDroppable: DroppableInstance | null = null

  constructor(options: KernelOptions = {}) {
    this.options = { ...defaultOptions, ...options }
    this.initializeCorePlugins()
  }

  private initializeCorePlugins() {
    // Load core plugins
    this.register(dragManagerPlugin)
    this.register(dropManagerPlugin)
    this.register(sortableEnginePlugin)
    this.register(pointerSensorPlugin)
    this.register(touchSensorPlugin)
    this.register(collisionDetectorPlugin)
  }

  draggable(element: HTMLElement, options: DraggableOptions): DraggableInstance {
    const manager = this.getPlugin<DragManagerPlugin>('drag-manager')
    return manager.api.register(element, options)
  }

  on<E extends EventType>(
    eventType: E,
    handler: EventHandler<E>
  ): Unsubscribe {
    return this.eventBus.on(eventType, handler)
  }

  emit(event: DragEvent): void {
    // Run plugin hooks
    this.pluginRegistry.runHooks(event)

    // Emit to subscribers
    this.eventBus.emit(event)
  }

  destroy() {
    this.pluginRegistry.uninstallAll()
    this.eventBus.clear()
    this.draggables.clear()
    this.droppables.clear()
    this.sortables.clear()
  }
}

export function createDragKit(options?: KernelOptions): DragKitKernel {
  return new DragKitKernel(options)
}
```

### Event Bus Implementation

**File:** `src/kernel/event-bus.ts`

```typescript
export class EventBus {
  private handlers = new Map<string, Set<Function>>()

  on<E extends EventType>(
    eventType: E,
    handler: EventHandler<E>
  ): Unsubscribe {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, new Set())
    }

    this.handlers.get(eventType)!.add(handler)

    return () => {
      const handlers = this.handlers.get(eventType)
      if (handlers) {
        handlers.delete(handler)
        if (handlers.size === 0) {
          this.handlers.delete(eventType)
        }
      }
    }
  }

  emit<E extends EventType>(event: Extract<DragEvent, { type: E }>): void {
    const handlers = this.handlers.get(event.type)
    if (!handlers) return

    handlers.forEach(handler => {
      try {
        handler(event)
      } catch (error) {
        console.error(`Error in ${event.type} handler:`, error)
      }
    })
  }

  clear(): void {
    this.handlers.clear()
  }
}
```

### Plugin Registry Implementation

**File:** `src/kernel/plugin-registry.ts`

```typescript
export class PluginRegistry {
  private plugins = new Map<string, PluginInstance>()

  async register(plugin: Plugin, kernel: Kernel): Promise<void> {
    if (this.plugins.has(plugin.name)) {
      throw new Error(`Plugin ${plugin.name} already registered`)
    }

    await plugin.install(kernel)

    this.plugins.set(plugin.name, {
      plugin,
      enabled: true
    })
  }

  async unregister(name: string): Promise<void> {
    const instance = this.plugins.get(name)
    if (!instance) return

    await instance.plugin.uninstall()
    this.plugins.delete(name)
  }

  get<P extends Plugin>(name: string): P | undefined {
    return this.plugins.get(name)?.plugin as P | undefined
  }

  runHooks(event: DragEvent): void {
    const hookName = this.getHookName(event.type)

    this.plugins.forEach(({ plugin, enabled }) => {
      if (!enabled || !plugin.hooks) return

      const hook = plugin.hooks[hookName]
      if (hook) {
        try {
          hook(event)
        } catch (error) {
          console.error(`Error in ${plugin.name} ${hookName}:`, error)
        }
      }
    })
  }

  private getHookName(eventType: EventType): keyof PluginHooks {
    // 'drag:start' -> 'afterDragStart'
    const [category, action] = eventType.split(':')
    const hookAction = action.charAt(0).toUpperCase() + action.slice(1)
    return `after${category.charAt(0).toUpperCase() + category.slice(1)}${hookAction}` as keyof PluginHooks
  }
}
```

---

## Plugin Implementation

### Core Plugin: drag-manager

**File:** `src/plugins/core/drag-manager.ts`

```typescript
export const dragManagerPlugin: Plugin = {
  name: 'drag-manager',
  version: '1.0.0',
  type: 'core',

  install(kernel: Kernel) {
    const manager = new DragManager(kernel)
    this.api = manager

    // Listen for drag events
    kernel.on('drag:start', (e) => manager.setActive(e.draggable.id))
    kernel.on('drag:end', () => manager.setActive(null))
    kernel.on('drag:cancel', () => manager.setActive(null))
  },

  uninstall() {
    // Cleanup
  },

  api: undefined as unknown as DragManagerAPI
}

class DragManager implements DragManagerAPI {
  private draggables = new Map<string, DraggableInstance>()
  private activeId: string | null = null

  constructor(private kernel: Kernel) {}

  register(element: HTMLElement, options: DraggableOptions): DraggableInstance {
    const instance = new DraggableInstance(
      options.id,
      element,
      options,
      this.kernel
    )

    this.draggables.set(options.id, instance)

    // Setup element attributes
    element.setAttribute('data-draggable-id', options.id)
    if (options.dragClass) {
      element.classList.add(options.dragClass)
    }

    return instance
  }

  unregister(id: string): void {
    const instance = this.draggables.get(id)
    if (instance) {
      instance.element.removeAttribute('data-draggable-id')
      this.draggables.delete(id)
    }
  }

  get(id: string): DraggableInstance | undefined {
    return this.draggables.get(id)
  }

  getAll(): Map<string, DraggableInstance> {
    return new Map(this.draggables)
  }

  getActive(): DraggableInstance | null {
    return this.activeId ? this.draggables.get(this.activeId) ?? null : null
  }

  setActive(id: string | null): void {
    this.activeId = id
  }

  isDragging(): boolean {
    return this.activeId !== null
  }
}

class DraggableInstance implements DraggableInstance {
  constructor(
    public id: string,
    public element: HTMLElement,
    public options: DraggableOptions,
    private kernel: Kernel
  ) {}

  get data(): DragData {
    return this.options.data ?? {}
  }

  isDragging(): boolean {
    const manager = this.kernel.getPlugin<typeof dragManagerPlugin>('drag-manager')
    return manager?.api.getActive() === this
  }

  isDisabled(): boolean {
    return this.options.disabled ?? false
  }

  enable(): void {
    this.options.disabled = false
  }

  disable(): void {
    this.options.disabled = true
  }

  destroy(): void {
    const manager = this.kernel.getPlugin<typeof dragManagerPlugin>('drag-manager')
    manager?.api.unregister(this.id)
  }
}
```

### Core Plugin: pointer-sensor

**File:** `src/plugins/core/pointer-sensor.ts`

```typescript
export const pointerSensorPlugin: Plugin = {
  name: 'pointer-sensor',
  version: '1.0.0',
  type: 'core',

  install(kernel: Kernel) {
    const sensor = new PointerSensor(kernel)
    sensor.attach()
    this.api = sensor
  },

  uninstall() {
    (this.api as PointerSensor).detach()
  },

  api: undefined as unknown as PointerSensor
}

class PointerSensor implements Sensor {
  type = 'pointer' as const

  private isActive = false
  private startPosition: Position | null = null
  private currentDraggable: DraggableInstance | null = null
  private pointerId: number | null = null

  constructor(private kernel: Kernel) {}

  attach(): void {
    document.addEventListener('pointerdown', this.handlePointerDown)
  }

  detach(): void {
    document.removeEventListener('pointerdown', this.handlePointerDown)
    document.removeEventListener('pointermove', this.handlePointerMove)
    document.removeEventListener('pointerup', this.handlePointerUp)
    document.removeEventListener('pointercancel', this.handlePointerCancel)
  }

  private handlePointerDown = (e: PointerEvent): void => {
    // Find draggable
    const draggable = this.findDraggableFromEvent(e)
    if (!draggable || draggable.isDisabled()) return

    // Check if handle is used
    if (draggable.options.handle) {
      const handle = this.findHandle(e.target as Element, draggable.options.handle)
      if (!handle) return
    }

    // Store start position
    this.startPosition = { x: e.clientX, y: e.clientY }
    this.currentDraggable = draggable
    this.pointerId = e.pointerId

    // Setup pointer capture
    (e.target as Element).setPointerCapture(e.pointerId)

    // Add listeners
    document.addEventListener('pointermove', this.handlePointerMove)
    document.addEventListener('pointerup', this.handlePointerUp)
    document.addEventListener('pointercancel', this.handlePointerCancel)

    // Check activation constraint
    if (draggable.options.delay || draggable.options.distance) {
      // Wait for constraint
      this.checkActivationConstraint(e)
    } else {
      // Immediate activation
      this.activate(e)
    }
  }

  private activate(e: PointerEvent): void {
    if (!this.currentDraggable || this.isActive) return

    this.isActive = true

    this.kernel.emit({
      type: 'drag:start',
      draggable: this.currentDraggable,
      position: { x: e.clientX, y: e.clientY },
      timestamp: Date.now(),
      originalEvent: e
    })
  }

  private handlePointerMove = (e: PointerEvent): void => {
    if (!this.isActive || !this.currentDraggable || !this.startPosition) return

    const position = { x: e.clientX, y: e.clientY }
    const delta = {
      x: position.x - this.startPosition.x,
      y: position.y - this.startPosition.y
    }

    this.kernel.emit({
      type: 'drag:move',
      draggable: this.currentDraggable,
      position,
      delta,
      timestamp: Date.now(),
      originalEvent: e
    })
  }

  private handlePointerUp = (e: PointerEvent): void => {
    if (!this.currentDraggable) return

    if (this.isActive) {
      const droppable = this.kernel.detectCollision(this.currentDraggable)

      this.kernel.emit({
        type: 'drag:end',
        draggable: this.currentDraggable,
        droppable,
        position: { x: e.clientX, y: e.clientY },
        dropped: droppable !== null,
        timestamp: Date.now(),
        originalEvent: e
      })
    }

    this.cleanup(e)
  }

  private handlePointerCancel = (e: PointerEvent): void => {
    if (this.isActive && this.currentDraggable) {
      this.kernel.emit({
        type: 'drag:cancel',
        draggable: this.currentDraggable,
        reason: 'blur',
        timestamp: Date.now(),
        originalEvent: e
      })
    }

    this.cleanup(e)
  }

  private cleanup(e: PointerEvent): void {
    if (this.pointerId !== null) {
      (e.target as Element).releasePointerCapture(this.pointerId)
    }

    document.removeEventListener('pointermove', this.handlePointerMove)
    document.removeEventListener('pointerup', this.handlePointerUp)
    document.removeEventListener('pointercancel', this.handlePointerCancel)

    this.isActive = false
    this.currentDraggable = null
    this.startPosition = null
    this.pointerId = null
  }

  private findDraggableFromEvent(e: PointerEvent): DraggableInstance | null {
    const element = (e.target as Element).closest('[data-draggable-id]')
    if (!element) return null

    const id = element.getAttribute('data-draggable-id')
    if (!id) return null

    const manager = this.kernel.getPlugin<typeof dragManagerPlugin>('drag-manager')
    return manager?.api.get(id) ?? null
  }
}
```

---

## Framework Adapters

### React Adapter: useDraggable

**File:** `src/adapters/react/use-draggable.ts`

```typescript
import { useContext, useEffect, useRef, useState } from 'react'
import { DragKitContext } from './context'
import type { DraggableOptions, DraggableInstance, Transform } from '../../types'

export function useDraggable(options: UseDraggableOptions) {
  const kernel = useContext(DragKitContext)
  const [isDragging, setIsDragging] = useState(false)
  const [transform, setTransform] = useState<Transform | null>(null)

  const nodeRef = useRef<HTMLElement | null>(null)
  const handleRef = useRef<HTMLElement | null>(null)
  const instanceRef = useRef<DraggableInstance | null>(null)

  const setNodeRef = useCallback((element: HTMLElement | null) => {
    nodeRef.current = element
  }, [])

  const setHandleRef = useCallback((element: HTMLElement | null) => {
    handleRef.current = element
  }, [])

  useEffect(() => {
    if (!kernel || !nodeRef.current) return

    // Register draggable
    const instance = kernel.draggable(nodeRef.current, {
      ...options,
      handle: handleRef.current ?? options.handle,
      onDragStart: (e) => {
        setIsDragging(true)
        options.onDragStart?.(e)
      },
      onDragMove: (e) => {
        setTransform(e.draggable.getTransform())
        options.onDragMove?.(e)
      },
      onDragEnd: (e) => {
        setIsDragging(false)
        setTransform(null)
        options.onDragEnd?.(e)
      }
    })

    instanceRef.current = instance

    return () => {
      instance.destroy()
    }
  }, [kernel, options.id, options.disabled])

  const attributes = {
    'data-draggable-id': options.id,
    'role': 'button',
    'tabIndex': 0,
    'aria-grabbed': isDragging
  }

  const listeners = handleRef.current ? {} : {
    // Only attach to main element if no handle
    onPointerDown: (e: React.PointerEvent) => {
      // Browser handles this
    }
  }

  return {
    attributes,
    listeners,
    setNodeRef,
    setHandleRef,
    isDragging,
    transform,
    node: nodeRef.current,
    isDisabled: options.disabled ?? false
  }
}
```

### React Adapter: SortableContext

**File:** `src/adapters/react/sortable-context.tsx`

```typescript
import { createContext, useContext, useEffect, useRef } from 'react'
import { DragKitContext } from './context'
import type { SortableOptions, SortableInstance } from '../../types'

const SortableContext = createContext<SortableInstance | null>(null)

export function SortableContextProvider({
  id = 'sortable',
  items,
  children,
  ...options
}: SortableContextProps) {
  const kernel = useContext(DragKitContext)
  const containerRef = useRef<HTMLElement | null>(null)
  const instanceRef = useRef<SortableInstance | null>(null)

  useEffect(() => {
    if (!kernel || !containerRef.current) return

    const instance = kernel.sortable(containerRef.current, {
      id,
      items,
      ...options
    })

    instanceRef.current = instance

    return () => {
      instance.destroy()
    }
  }, [kernel, id])

  // Update items when they change
  useEffect(() => {
    instanceRef.current?.setItems(items)
  }, [items])

  return (
    <SortableContext.Provider value={instanceRef.current}>
      <div ref={containerRef}>
        {children}
      </div>
    </SortableContext.Provider>
  )
}
```

---

## Testing Strategy

### Unit Tests

**File:** `tests/unit/kernel/event-bus.test.ts`

```typescript
import { describe, it, expect, vi } from 'vitest'
import { EventBus } from '../../../src/kernel/event-bus'

describe('EventBus', () => {
  it('should register and call event handler', () => {
    const bus = new EventBus()
    const handler = vi.fn()

    bus.on('drag:start', handler)

    const event = {
      type: 'drag:start' as const,
      timestamp: Date.now(),
      draggable: {} as any,
      position: { x: 0, y: 0 },
      originalEvent: null
    }

    bus.emit(event)

    expect(handler).toHaveBeenCalledWith(event)
  })

  it('should unsubscribe handler', () => {
    const bus = new EventBus()
    const handler = vi.fn()

    const unsubscribe = bus.on('drag:start', handler)
    unsubscribe()

    bus.emit({ type: 'drag:start', ... })

    expect(handler).not.toHaveBeenCalled()
  })

  it('should handle multiple handlers', () => {
    const bus = new EventBus()
    const handler1 = vi.fn()
    const handler2 = vi.fn()

    bus.on('drag:start', handler1)
    bus.on('drag:start', handler2)

    bus.emit({ type: 'drag:start', ... })

    expect(handler1).toHaveBeenCalled()
    expect(handler2).toHaveBeenCalled()
  })
})
```

### Integration Tests

**File:** `tests/integration/drag-drop.test.ts`

```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { createDragKit } from '../../src'
import { firePointerEvent, createMockElement } from '../fixtures/test-elements'

describe('Drag and Drop', () => {
  let kernel: DragKit
  let dragElement: HTMLElement
  let dropElement: HTMLElement

  beforeEach(() => {
    kernel = createDragKit()
    dragElement = createMockElement()
    dropElement = createMockElement()
  })

  it('should drag and drop element', async () => {
    const dropped = vi.fn()

    const draggable = kernel.draggable(dragElement, {
      id: 'drag-1',
      data: { type: 'card' }
    })

    const droppable = kernel.droppable(dropElement, {
      id: 'drop-1',
      accept: ['card'],
      onDrop: dropped
    })

    // Simulate drag
    await firePointerEvent(dragElement, 'pointerdown', { x: 0, y: 0 })
    await firePointerEvent(document, 'pointermove', { x: 100, y: 100 })
    await firePointerEvent(document, 'pointerup', { x: 100, y: 100 })

    expect(dropped).toHaveBeenCalled()
    expect(dropped.mock.calls[0][0].draggable).toBe(draggable)
    expect(dropped.mock.calls[0][0].droppable).toBe(droppable)
  })
})
```

---

## Build & Bundle

### tsup Configuration

**File:** `tsup.config.ts`

```typescript
import { defineConfig } from 'tsup'

export default defineConfig([
  // Core package
  {
    entry: ['src/index.ts'],
    format: ['esm', 'cjs'],
    dts: true,
    clean: true,
    minify: true,
    treeshake: true,
    splitting: false,
    outDir: 'dist'
  },
  // Plugins
  {
    entry: ['src/plugins/index.ts'],
    format: ['esm', 'cjs'],
    dts: true,
    minify: true,
    outDir: 'dist/plugins'
  },
  // React adapter
  {
    entry: ['src/adapters/react/index.ts'],
    format: ['esm', 'cjs'],
    dts: true,
    minify: true,
    external: ['react', 'react-dom'],
    outDir: 'dist/react'
  },
  // Vue adapter
  {
    entry: ['src/adapters/vue/index.ts'],
    format: ['esm', 'cjs'],
    dts: true,
    minify: true,
    external: ['vue'],
    outDir: 'dist/vue'
  },
  // Svelte adapter
  {
    entry: ['src/adapters/svelte/index.ts'],
    format: ['esm', 'cjs'],
    dts: true,
    minify: true,
    external: ['svelte', 'svelte/store'],
    outDir: 'dist/svelte'
  }
])
```

### Bundle Size Monitoring

**Script:** `scripts/check-bundle-size.ts`

```typescript
import { readFileSync } from 'fs'
import { gzipSync } from 'zlib'

const files = [
  { name: 'Core', path: 'dist/index.js', limit: 5 * 1024 },
  { name: 'Plugins', path: 'dist/plugins/index.js', limit: 7 * 1024 }
]

files.forEach(({ name, path, limit }) => {
  const content = readFileSync(path)
  const gzipped = gzipSync(content)
  const size = gzipped.length
  const sizeKB = (size / 1024).toFixed(2)

  console.log(`${name}: ${sizeKB} KB`)

  if (size > limit) {
    throw new Error(`${name} exceeds ${limit / 1024}KB limit!`)
  }
})
```

---

## Performance Optimization

### 1. Minimize DOM Queries

```typescript
// ❌ Bad - query on every move
function handleMove(e: PointerEvent) {
  const element = document.querySelector('[data-draggable-id="x"]')
  element.style.transform = `translate(${e.x}px, ${e.y}px)`
}

// ✅ Good - cache element
class Draggable {
  constructor(private element: HTMLElement) {}

  move(x: number, y: number) {
    this.element.style.transform = `translate3d(${x}px, ${y}px, 0)`
  }
}
```

### 2. Use RAF for Smooth Updates

```typescript
class DragSystem {
  private rafId: number | null = null
  private pendingUpdate: Transform | null = null

  scheduleUpdate(transform: Transform) {
    this.pendingUpdate = transform

    if (this.rafId === null) {
      this.rafId = requestAnimationFrame(() => {
        this.flush()
      })
    }
  }

  private flush() {
    if (this.pendingUpdate) {
      this.applyTransform(this.pendingUpdate)
      this.pendingUpdate = null
    }
    this.rafId = null
  }
}
```

### 3. Debounce Collision Detection

```typescript
class CollisionSystem {
  private lastCheck = 0
  private checkInterval = 16 // ~60fps

  detectCollision(draggable: Draggable): Droppable | null {
    const now = Date.now()

    if (now - this.lastCheck < this.checkInterval) {
      return this.lastResult // Return cached
    }

    this.lastCheck = now
    this.lastResult = this.performDetection(draggable)
    return this.lastResult
  }
}
```

### 4. WeakMap for Auto Cleanup

```typescript
class TransformManager {
  // Automatically cleaned up when element is garbage collected
  private transforms = new WeakMap<HTMLElement, Transform>()

  set(element: HTMLElement, transform: Transform) {
    this.transforms.set(element, transform)
  }

  get(element: HTMLElement): Transform | null {
    return this.transforms.get(element) ?? null
  }
}
```

---

## Conclusion

This implementation guide provides the foundation for building DragKit. Follow the patterns and principles outlined here to ensure:

1. Zero dependencies
2. Tiny bundle size
3. Type safety
4. Testability
5. Performance
6. Accessibility
7. Framework agnosticism

**Next Steps:**
1. Create TASKS.md with ordered implementation tasks
2. Setup project structure
3. Implement kernel
4. Implement core plugins
5. Implement optional plugins
6. Implement framework adapters
7. Write comprehensive tests
8. Build documentation website

**Date:** 2025-12-28
**Status:** Implementation Guide Complete
