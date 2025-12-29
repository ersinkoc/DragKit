/**
 * Drop Manager Plugin
 * Manages droppable zone lifecycle and accept logic
 */

import type {
  Plugin,
  Kernel,
  DroppableOptions,
  DroppableInstance,
  DraggableInstance,
  DropData
} from '../../types'

class DroppableInstanceImpl implements DroppableInstance {
  private overState = false
  private onDestroyCallback: (() => void) | null = null

  constructor(
    public id: string,
    public element: HTMLElement,
    public options: DroppableOptions,
    _kernel: Kernel
  ) {
    element.setAttribute('data-droppable-id', id)
  }

  getId(): string {
    return this.id
  }

  getElement(): HTMLElement {
    return this.element
  }

  get data(): DropData {
    return this.options.data ?? {}
  }

  isOver(): boolean {
    return this.overState
  }

  setOver(over: boolean): void {
    this.overState = over

    if (over && this.options.overClass) {
      this.element.classList.add(this.options.overClass)
    } else if (this.options.overClass) {
      this.element.classList.remove(this.options.overClass)
    }
  }

  isDisabled(): boolean {
    return this.options.disabled ?? false
  }

  canAccept(draggable: DraggableInstance): boolean {
    if (this.isDisabled()) return false

    const { accept } = this.options
    if (!accept) return true

    if (typeof accept === 'function') {
      return accept(draggable)
    }

    const acceptTypes = Array.isArray(accept) ? accept : [accept]
    const draggableType = draggable.data.type

    return draggableType ? acceptTypes.includes(draggableType) : false
  }

  getRect(): DOMRect {
    return this.element.getBoundingClientRect()
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
    this.element.removeAttribute('data-droppable-id')
    if (this.options.overClass) {
      this.element.classList.remove(this.options.overClass)
    }
    if (this.options.activeClass) {
      this.element.classList.remove(this.options.activeClass)
    }

    // Call the destroy callback to unregister from manager
    if (this.onDestroyCallback) {
      this.onDestroyCallback()
      this.onDestroyCallback = null
    }
  }
}

interface DropManagerAPI {
  register(element: HTMLElement, options: DroppableOptions): DroppableInstance
  unregister(id: string): void
  get(id: string): DroppableInstance | undefined
  getAll(): Map<string, DroppableInstance>
  getAccepting(draggable: DraggableInstance): DroppableInstance[]
  getActive(): DroppableInstance | null
  setActive(id: string | null): void
}

class DropManager implements DropManagerAPI {
  private droppables = new Map<string, DroppableInstance>()
  private activeId: string | null = null

  constructor(private kernel: Kernel) {}

  register(element: HTMLElement, options: DroppableOptions): DroppableInstance {
    if (this.droppables.has(options.id)) {
      throw new Error(`Droppable with id "${options.id}" already exists`)
    }

    const instance = new DroppableInstanceImpl(options.id, element, options, this.kernel)

    // Set callback to unregister when destroy is called
    instance.setOnDestroy(() => {
      this.droppables.delete(options.id)
      if (this.activeId === options.id) {
        this.activeId = null
      }
    })

    this.droppables.set(options.id, instance)

    return instance
  }

  unregister(id: string): void {
    const instance = this.droppables.get(id)
    if (instance) {
      // destroy() will call the onDestroy callback which removes from map
      instance.destroy()
    }
  }

  get(id: string): DroppableInstance | undefined {
    return this.droppables.get(id)
  }

  getAll(): Map<string, DroppableInstance> {
    return new Map(this.droppables)
  }

  getAccepting(draggable: DraggableInstance): DroppableInstance[] {
    return Array.from(this.droppables.values()).filter(droppable =>
      droppable.canAccept(draggable)
    )
  }

  getActive(): DroppableInstance | null {
    return this.activeId ? this.droppables.get(this.activeId) ?? null : null
  }

  setActive(id: string | null): void {
    this.activeId = id
  }
}

export const dropManagerPlugin: Plugin & { api?: DropManagerAPI } = {
  name: 'drop-manager',
  version: '1.0.0',
  type: 'core',

  install(kernel: Kernel) {
    this.api = new DropManager(kernel) as any
  },

  uninstall() {
    // Cleanup
  }
}
