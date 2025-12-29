/**
 * Drag Manager Plugin
 * Manages draggable element lifecycle and state
 */

import type {
  Plugin,
  Kernel,
  DraggableOptions,
  DraggableInstance,
  DragData,
  Position,
  Transform
} from '../../types'

/**
 * Draggable Instance Implementation
 */
class DraggableInstanceImpl implements DraggableInstance {
  private transformValue: Transform | null = null
  private onDestroyCallback: (() => void) | null = null

  constructor(
    public id: string,
    public element: HTMLElement,
    public options: DraggableOptions,
    private kernel: Kernel
  ) {
    // Setup element
    element.setAttribute('data-draggable-id', id)
    element.setAttribute('draggable', 'false') // Prevent native drag

    if (options.dragClass) {
      element.classList.add(options.dragClass)
    }
  }

  getId(): string {
    return this.id
  }

  getElement(): HTMLElement {
    return this.element
  }

  get data(): DragData {
    return this.options.data ?? {}
  }

  isDragging(): boolean {
    return this.kernel.getActiveDraggable() === this
  }

  isDisabled(): boolean {
    return this.options.disabled ?? false
  }

  getPosition(): Position {
    const rect = this.element.getBoundingClientRect()
    return { x: rect.left, y: rect.top }
  }

  getTransform(): Transform | null {
    return this.transformValue
  }

  setTransform(transform: Transform): void {
    this.transformValue = transform
    this.element.style.transform = `translate3d(${transform.x}px, ${transform.y}px, 0)`
  }

  resetTransform(): void {
    this.transformValue = null
    this.element.style.transform = ''
  }

  enable(): void {
    this.options.disabled = false
  }

  disable(): void {
    this.options.disabled = true
  }

  setOnDestroy(callback: () => void): void {
    this.onDestroyCallback = callback
  }

  destroy(): void {
    this.element.removeAttribute('data-draggable-id')
    this.element.removeAttribute('draggable')
    if (this.options.dragClass) {
      this.element.classList.remove(this.options.dragClass)
    }
    this.resetTransform()

    // Call the destroy callback to unregister from manager
    if (this.onDestroyCallback) {
      this.onDestroyCallback()
      this.onDestroyCallback = null
    }
  }
}

/**
 * Drag Manager API
 */
interface DragManagerAPI {
  register(element: HTMLElement, options: DraggableOptions): DraggableInstance
  unregister(id: string): void
  get(id: string): DraggableInstance | undefined
  getAll(): Map<string, DraggableInstance>
  getByElement(element: HTMLElement): DraggableInstance | undefined
  getActive(): DraggableInstance | null
  setActive(id: string | null): void
  isDragging(): boolean
}

/**
 * Drag Manager Implementation
 */
class DragManager implements DragManagerAPI {
  private draggables = new Map<string, DraggableInstance>()
  private activeId: string | null = null

  constructor(private kernel: Kernel) {}

  register(element: HTMLElement, options: DraggableOptions): DraggableInstance {
    if (this.draggables.has(options.id)) {
      throw new Error(`Draggable with id "${options.id}" already exists`)
    }

    const instance = new DraggableInstanceImpl(options.id, element, options, this.kernel)

    // Set callback to unregister when destroy is called
    instance.setOnDestroy(() => {
      this.draggables.delete(options.id)
      if (this.activeId === options.id) {
        this.activeId = null
      }
    })

    this.draggables.set(options.id, instance)

    return instance
  }

  unregister(id: string): void {
    const instance = this.draggables.get(id)
    if (instance) {
      // destroy() will call the onDestroy callback which removes from map
      instance.destroy()
    }
  }

  get(id: string): DraggableInstance | undefined {
    return this.draggables.get(id)
  }

  getAll(): Map<string, DraggableInstance> {
    return new Map(this.draggables)
  }

  getByElement(element: HTMLElement): DraggableInstance | undefined {
    const id = element.getAttribute('data-draggable-id')
    if (!id) return undefined
    return this.draggables.get(id)
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

/**
 * Drag Manager Plugin
 */
export const dragManagerPlugin: Plugin & { api?: DragManagerAPI } = {
  name: 'drag-manager',
  version: '1.0.0',
  type: 'core',

  install(kernel: Kernel) {
    const manager = new DragManager(kernel)
    this.api = manager as any

    // Listen to drag events
    kernel.on('drag:start', event => {
      manager.setActive(event.draggable.id)
    })

    kernel.on('drag:end', () => {
      manager.setActive(null)
    })

    kernel.on('drag:cancel', () => {
      manager.setActive(null)
    })
  },

  uninstall() {
    // Cleanup if needed
  }
}
