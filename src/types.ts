/**
 * DragKit Type Definitions
 * Complete TypeScript types for the entire package
 */

/* ============================
   BASIC TYPES
   ============================ */

export interface Position {
  x: number
  y: number
}

export interface Transform {
  x: number
  y: number
  scaleX?: number
  scaleY?: number
}

export interface BoundsRect {
  top?: number
  right?: number
  bottom?: number
  left?: number
}

export type BoundsOption = 'parent' | 'window' | 'body' | HTMLElement | BoundsRect

export type PreviewOption =
  | 'clone'
  | 'ghost'
  | 'none'
  | HTMLElement
  | ((draggable: DraggableInstance) => HTMLElement)

export type SensorType = 'pointer' | 'touch' | 'keyboard'

export type CollisionAlgorithm = 'rectangle' | 'center' | 'pointer' | 'closest'

export type CollisionFn = (
  draggable: DraggableInstance,
  droppables: DroppableInstance[]
) => DroppableInstance | null

export type AcceptFn = (draggable: DraggableInstance) => boolean

export type Unsubscribe = () => void

/* ============================
   DRAG DATA
   ============================ */

export interface DragData {
  type?: string
  [key: string]: unknown
}

export interface DropData {
  [key: string]: unknown
}

/* ============================
   DRAGGABLE
   ============================ */

export interface DraggableOptions {
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

export interface DraggableInstance {
  id: string
  element: HTMLElement
  data: DragData
  options: DraggableOptions

  isDragging(): boolean
  isDisabled(): boolean
  getPosition(): Position
  getTransform(): Transform | null

  enable(): void
  disable(): void
  destroy(): void
}

/* ============================
   DROPPABLE
   ============================ */

export interface DroppableOptions {
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

export interface DroppableInstance {
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

/* ============================
   SORTABLE
   ============================ */

export interface AnimationOptions {
  duration: number
  easing: string
}

export interface DropIndicatorOptions {
  class?: string
  thickness?: number
  color?: string
}

export interface SortableGroup {
  name: string
  pull?: boolean | 'clone' | ((to: SortableInstance, from: SortableInstance) => boolean)
  put?: boolean | string[] | ((to: SortableInstance) => boolean)
}

export interface SortableOptions {
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

export interface SortableInstance {
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

export interface SortableGridOptions extends Omit<SortableOptions, 'direction'> {
  columns: number
  gap?: number
  rowGap?: number
  columnGap?: number
}

export interface SortableGridInstance extends SortableInstance {
  setColumns(columns: number): void
  getColumns(): number
  getItemPosition(id: string): { row: number; column: number } | null
}

/* ============================
   EVENTS
   ============================ */

export type EventType =
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

export interface BaseDragEvent {
  type: EventType
  timestamp: number
  originalEvent: PointerEvent | TouchEvent | KeyboardEvent | null
}

export interface DragStartEvent extends BaseDragEvent {
  type: 'drag:start'
  draggable: DraggableInstance
  position: Position
}

export interface DragMoveEvent extends BaseDragEvent {
  type: 'drag:move'
  draggable: DraggableInstance
  position: Position
  delta: Position
}

export interface DragOverEvent extends BaseDragEvent {
  type: 'drag:over'
  draggable: DraggableInstance
  droppable: DroppableInstance | null
  position: Position
}

export interface DragEnterEvent extends BaseDragEvent {
  type: 'drag:enter'
  draggable: DraggableInstance
  droppable: DroppableInstance
}

export interface DragLeaveEvent extends BaseDragEvent {
  type: 'drag:leave'
  draggable: DraggableInstance
  droppable: DroppableInstance
}

export interface DragEndEvent extends BaseDragEvent {
  type: 'drag:end'
  draggable: DraggableInstance
  droppable: DroppableInstance | null
  position: Position
  dropped: boolean
}

export interface DragCancelEvent extends BaseDragEvent {
  type: 'drag:cancel'
  draggable: DraggableInstance
  reason: 'escape' | 'blur' | 'programmatic'
}

export interface DropEvent extends BaseDragEvent {
  type: 'drag:end'
  draggable: DraggableInstance
  droppable: DroppableInstance
  position: Position
}

export interface SortStartEvent extends BaseDragEvent {
  type: 'sort:start'
  sortable: SortableInstance
  item: string
  index: number
}

export interface SortMoveEvent extends BaseDragEvent {
  type: 'sort:move'
  sortable: SortableInstance
  item: string
  oldIndex: number
  newIndex: number
}

export interface SortEndEvent extends BaseDragEvent {
  type: 'sort:end'
  sortable: SortableInstance
  item: string
  oldIndex: number
  newIndex: number
  items: string[]
}

export interface SortAddEvent extends BaseDragEvent {
  type: 'sort:add'
  sortable: SortableInstance
  item: string
  index: number
  from: SortableInstance
}

export interface SortRemoveEvent extends BaseDragEvent {
  type: 'sort:remove'
  sortable: SortableInstance
  item: string
  index: number
  to: SortableInstance
}

export interface SortMoveCheckEvent {
  dragged: DraggableInstance
  related: HTMLElement
  sortable: SortableInstance
  willInsertAfter: boolean
}

export type DragEvent =
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

export type EventHandler<E extends EventType> = (event: Extract<DragEvent, { type: E }>) => void

/* ============================
   SENSORS
   ============================ */

export interface Sensor {
  type: SensorType

  attach(kernel: Kernel): void
  detach(): void

  isActive(): boolean

  activate(element: HTMLElement, event: Event): void
  deactivate(): void
}

export interface PointerSensorOptions {
  activationConstraint?: {
    delay?: number
    distance?: number
    tolerance?: number
  }
}

export interface TouchSensorOptions {
  activationConstraint?: {
    delay?: number
    distance?: number
  }
}

export interface KeyboardSensorOptions {
  keyboardCodes?: {
    start?: string[]
    cancel?: string[]
    up?: string[]
    down?: string[]
    left?: string[]
    right?: string[]
  }
  moveDistance?: number
  announcements?: {
    onDragStart?: (draggable: DraggableInstance) => string
    onDragOver?: (droppable: DroppableInstance | null) => string
    onDragEnd?: (dropped: boolean) => string
  }
}

/* ============================
   PLUGIN SYSTEM
   ============================ */

export interface PluginHooks {
  beforeDragStart?: (draggable: DraggableInstance, event: Event) => boolean
  afterDragStart?: (event: DragStartEvent) => void
  beforeDragMove?: (event: DragMoveEvent) => DragMoveEvent
  afterDragMove?: (event: DragMoveEvent) => void
  beforeDragEnd?: (event: DragEndEvent) => boolean
  afterDragEnd?: (event: DragEndEvent) => void
  onCollisionDetect?: (
    draggable: DraggableInstance,
    droppables: DroppableInstance[]
  ) => DroppableInstance | null
  beforeSort?: (event: SortMoveCheckEvent) => boolean
  afterSort?: (event: SortEndEvent) => void
}

export interface Plugin {
  name: string
  version: string
  type: 'core' | 'optional'

  install(kernel: Kernel): void | Promise<void>
  uninstall(): void | Promise<void>

  hooks?: PluginHooks
  api?: Record<string, unknown>
}

export interface PluginInfo {
  name: string
  version: string
  type: 'core' | 'optional'
  enabled: boolean
}

/* ============================
   KERNEL
   ============================ */

export interface AutoScrollOptions {
  speed?: number
  threshold?: number
  acceleration?: number
  maxSpeed?: number
  scrollableElements?: 'auto' | HTMLElement[]
  scrollWindow?: boolean
}

export interface KernelOptions {
  sensors?: SensorType[]
  collision?: CollisionAlgorithm | CollisionFn
  autoScroll?: boolean | AutoScrollOptions
  accessibility?: boolean
  animation?: AnimationOptions | false
  plugins?: Plugin[]
}

export interface Kernel {
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
  setCollisionAlgorithm(algorithm: CollisionAlgorithm | CollisionFn): void
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

/* ============================
   UTILITY TYPES
   ============================ */

export type ArrayMoveResult<T> = T[]

export interface FlipState {
  first: DOMRect
  last: DOMRect
  invert: {
    x: number
    y: number
  }
}
