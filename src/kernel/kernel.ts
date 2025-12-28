/**
 * DragKit Kernel
 * Micro-kernel core that manages the entire drag & drop system
 */

import { EventBus } from './event-bus'
import { PluginRegistry } from './plugin-registry'
import type {
  Kernel,
  KernelOptions,
  DraggableOptions,
  DraggableInstance,
  DroppableOptions,
  DroppableInstance,
  SortableOptions,
  SortableInstance,
  SortableGridOptions,
  SortableGridInstance,
  Sensor,
  SensorType,
  CollisionAlgorithm,
  CollisionFn,
  Plugin,
  PluginInfo,
  EventType,
  EventHandler,
  Unsubscribe,
  DragEvent
} from '../types'

// Core plugins will be imported here
import { dragManagerPlugin } from '../plugins/core/drag-manager'
import { dropManagerPlugin } from '../plugins/core/drop-manager'
import { collisionDetectorPlugin } from '../plugins/core/collision-detector'
import { pointerSensorPlugin } from '../plugins/core/pointer-sensor'
import { touchSensorPlugin } from '../plugins/core/touch-sensor'
import { sortableEnginePlugin } from '../plugins/core/sortable-engine'

/**
 * Default kernel options
 */
const defaultOptions: KernelOptions = {
  sensors: ['pointer', 'touch'],
  collision: 'rectangle',
  autoScroll: false,
  accessibility: true,
  animation: { duration: 200, easing: 'ease-out' },
  plugins: []
}

/**
 * DragKit Kernel Implementation
 */
export class DragKitKernel implements Kernel {
  private eventBus: EventBus
  private pluginRegistry: PluginRegistry
  private options: KernelOptions
  private initialized = false

  constructor(options: Partial<KernelOptions> = {}) {
    this.options = { ...defaultOptions, ...options }
    this.eventBus = new EventBus()
    this.pluginRegistry = new PluginRegistry()
    this.pluginRegistry.setKernel(this)
  }

  /**
   * Initialize kernel and load core plugins
   */
  async initialize(): Promise<void> {
    if (this.initialized) return

    // Load core plugins (always loaded)
    await this.loadCorePlugins()

    // Load user plugins
    if (this.options.plugins) {
      for (const plugin of this.options.plugins) {
        await this.register(plugin)
      }
    }

    this.initialized = true
  }

  /**
   * Load core plugins
   */
  private async loadCorePlugins(): Promise<void> {
    const corePlugins = [
      dragManagerPlugin,
      dropManagerPlugin,
      collisionDetectorPlugin,
      pointerSensorPlugin,
      touchSensorPlugin,
      sortableEnginePlugin
    ]

    for (const plugin of corePlugins) {
      await this.pluginRegistry.register(plugin)
    }
  }

  /* ============================
     DRAGGABLE MANAGEMENT
     ============================ */

  draggable(element: HTMLElement, options: DraggableOptions): DraggableInstance {
    const dragManager = this.getPlugin<typeof dragManagerPlugin>('drag-manager')
    if (!dragManager?.api) {
      throw new Error('Drag manager plugin not loaded')
    }
    return dragManager.api.register(element, options)
  }

  getDraggable(id: string): DraggableInstance | undefined {
    const dragManager = this.getPlugin<typeof dragManagerPlugin>('drag-manager')
    return dragManager?.api.get(id)
  }

  getDraggables(): Map<string, DraggableInstance> {
    const dragManager = this.getPlugin<typeof dragManagerPlugin>('drag-manager')
    return dragManager?.api.getAll() ?? new Map()
  }

  /* ============================
     DROPPABLE MANAGEMENT
     ============================ */

  droppable(element: HTMLElement, options: DroppableOptions): DroppableInstance {
    const dropManager = this.getPlugin<typeof dropManagerPlugin>('drop-manager')
    if (!dropManager?.api) {
      throw new Error('Drop manager plugin not loaded')
    }
    return dropManager.api.register(element, options)
  }

  getDroppable(id: string): DroppableInstance | undefined {
    const dropManager = this.getPlugin<typeof dropManagerPlugin>('drop-manager')
    return dropManager?.api.get(id)
  }

  getDroppables(): Map<string, DroppableInstance> {
    const dropManager = this.getPlugin<typeof dropManagerPlugin>('drop-manager')
    return dropManager?.api.getAll() ?? new Map()
  }

  /* ============================
     SORTABLE MANAGEMENT
     ============================ */

  sortable(container: HTMLElement, options: SortableOptions): SortableInstance {
    const sortableEngine = this.getPlugin<typeof sortableEnginePlugin>('sortable-engine')
    if (!sortableEngine?.api) {
      throw new Error('Sortable engine plugin not loaded')
    }
    return sortableEngine.api.createSortable(container, options)
  }

  sortableGrid(container: HTMLElement, options: SortableGridOptions): SortableGridInstance {
    const sortableEngine = this.getPlugin<typeof sortableEnginePlugin>('sortable-engine')
    if (!sortableEngine?.api) {
      throw new Error('Sortable engine plugin not loaded')
    }
    return sortableEngine.api.createSortableGrid(container, options)
  }

  /* ============================
     DRAG STATE
     ============================ */

  getActiveDraggable(): DraggableInstance | null {
    const dragManager = this.getPlugin<typeof dragManagerPlugin>('drag-manager')
    return dragManager?.api.getActive() ?? null
  }

  getActiveDroppable(): DroppableInstance | null {
    const dropManager = this.getPlugin<typeof dropManagerPlugin>('drop-manager')
    return dropManager?.api.getActive() ?? null
  }

  isDragging(): boolean {
    const dragManager = this.getPlugin<typeof dragManagerPlugin>('drag-manager')
    return dragManager?.api.isDragging() ?? false
  }

  /* ============================
     SENSORS
     ============================ */

  addSensor(sensor: Sensor): void {
    sensor.attach(this)
  }

  removeSensor(sensorType: SensorType): void {
    // Sensors will handle their own cleanup
    console.log('Removing sensor:', sensorType)
  }

  getSensors(): Sensor[] {
    // Return active sensors
    return []
  }

  /* ============================
     COLLISION DETECTION
     ============================ */

  setCollisionAlgorithm(algorithm: CollisionAlgorithm | CollisionFn): void {
    const collisionDetector = this.getPlugin<typeof collisionDetectorPlugin>('collision-detector')
    if (collisionDetector?.api) {
      collisionDetector.api.setAlgorithm(algorithm)
    }
  }

  detectCollision(draggable: DraggableInstance): DroppableInstance | null {
    const collisionDetector = this.getPlugin<typeof collisionDetectorPlugin>('collision-detector')
    if (!collisionDetector?.api) return null

    const droppables = Array.from(this.getDroppables().values())
    return collisionDetector.api.detect(draggable, droppables)
  }

  /* ============================
     PLUGIN MANAGEMENT
     ============================ */

  async register(plugin: Plugin): Promise<void> {
    await this.pluginRegistry.register(plugin)
  }

  async unregister(pluginName: string): Promise<void> {
    await this.pluginRegistry.unregister(pluginName)
  }

  getPlugin<P extends Plugin>(name: string): P | undefined {
    return this.pluginRegistry.get<P>(name)
  }

  listPlugins(): PluginInfo[] {
    return this.pluginRegistry.listPlugins()
  }

  /* ============================
     EVENT SYSTEM
     ============================ */

  emit(event: DragEvent): void {
    // Run plugin hooks before emitting
    const hookName = this.getHookNameFromEvent(event.type)
    if (hookName) {
      this.pluginRegistry.runHook(hookName as keyof import('../types').PluginHooks, event)
    }

    // Emit event to subscribers
    this.eventBus.emit(event)
  }

  on<E extends EventType>(eventType: E, handler: EventHandler<E>): Unsubscribe {
    return this.eventBus.on(eventType, handler)
  }

  off<E extends EventType>(eventType: E, handler: EventHandler<E>): void {
    this.eventBus.off(eventType, handler)
  }

  /**
   * Convert event type to hook name
   */
  private getHookNameFromEvent(eventType: EventType): string | null {
    const hookMap: Record<EventType, string> = {
      'drag:start': 'afterDragStart',
      'drag:move': 'afterDragMove',
      'drag:over': 'afterDragMove',
      'drag:enter': 'afterDragMove',
      'drag:leave': 'afterDragMove',
      'drag:end': 'afterDragEnd',
      'drag:cancel': 'afterDragEnd',
      'sort:start': 'beforeSort',
      'sort:move': 'beforeSort',
      'sort:end': 'afterSort',
      'sort:add': 'afterSort',
      'sort:remove': 'afterSort'
    }

    return hookMap[eventType] ?? null
  }

  /* ============================
     CONFIGURATION
     ============================ */

  configure(options: Partial<KernelOptions>): void {
    this.options = { ...this.options, ...options }

    // Update collision algorithm if changed
    if (options.collision) {
      this.setCollisionAlgorithm(options.collision)
    }
  }

  getOptions(): KernelOptions {
    return { ...this.options }
  }

  /* ============================
     LIFECYCLE
     ============================ */

  async destroy(): Promise<void> {
    // Unregister all plugins
    await this.pluginRegistry.uninstallAll()

    // Clear event bus
    this.eventBus.clear()

    // Reset state
    this.initialized = false
  }
}

/**
 * Factory function to create DragKit instance
 */
export async function createDragKit(options?: Partial<KernelOptions>): Promise<DragKitKernel> {
  const kernel = new DragKitKernel(options)
  await kernel.initialize()
  return kernel
}
