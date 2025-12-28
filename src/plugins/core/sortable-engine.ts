/**
 * Sortable Engine Plugin
 * List and grid sorting logic
 */

import type {
  Plugin,
  Kernel,
  SortableOptions,
  SortableInstance,
  SortableGridOptions,
  SortableGridInstance
} from '../../types'

interface SortableEngineAPI {
  createSortable(container: HTMLElement, options: SortableOptions): SortableInstance
  createSortableGrid(container: HTMLElement, options: SortableGridOptions): SortableGridInstance
  get(id: string): SortableInstance | undefined
  getAll(): Map<string, SortableInstance>
}

class SortableInstanceImpl implements SortableInstance {
  constructor(
    public id: string,
    public container: HTMLElement,
    public options: SortableOptions,
    private kernel: Kernel
  ) {
    container.setAttribute('data-sortable-id', id)
  }

  getItems(): string[] {
    return [...this.options.items]
  }

  getItemElements(): HTMLElement[] {
    return this.options.items.map(id =>
      this.container.querySelector(`[data-item-id="${id}"]`)
    ).filter((el): el is HTMLElement => el !== null)
  }

  isDragging(): boolean {
    return this.kernel.isDragging()
  }

  setItems(items: string[]): void {
    this.options.items = [...items]
  }

  addItem(id: string, index?: number): void {
    if (index !== undefined) {
      this.options.items.splice(index, 0, id)
    } else {
      this.options.items.push(id)
    }
  }

  removeItem(id: string): void {
    const index = this.options.items.indexOf(id)
    if (index !== -1) {
      this.options.items.splice(index, 1)
    }
  }

  moveItem(fromIndex: number, toIndex: number): void {
    const [item] = this.options.items.splice(fromIndex, 1)
    if (item) {
      this.options.items.splice(toIndex, 0, item)
    }
  }

  enable(): void {
    this.options.disabled = false
  }

  disable(): void {
    this.options.disabled = true
  }

  destroy(): void {
    this.container.removeAttribute('data-sortable-id')
  }
}

class SortableGridInstanceImpl extends SortableInstanceImpl implements SortableGridInstance {
  constructor(
    id: string,
    container: HTMLElement,
    public override options: SortableGridOptions,
    kernel: Kernel
  ) {
    super(id, container, options, kernel)
  }

  setColumns(columns: number): void {
    this.options.columns = columns
  }

  getColumns(): number {
    return this.options.columns
  }

  getItemPosition(id: string): { row: number; column: number } | null {
    const index = this.options.items.indexOf(id)
    if (index === -1) return null

    const columns = this.options.columns
    return {
      row: Math.floor(index / columns),
      column: index % columns
    }
  }
}

class SortableEngine implements SortableEngineAPI {
  private sortables = new Map<string, SortableInstance>()

  constructor(private kernel: Kernel) {}

  createSortable(container: HTMLElement, options: SortableOptions): SortableInstance {
    const instance = new SortableInstanceImpl(options.id, container, options, this.kernel)
    this.sortables.set(options.id, instance)
    return instance
  }

  createSortableGrid(container: HTMLElement, options: SortableGridOptions): SortableGridInstance {
    const instance = new SortableGridInstanceImpl(options.id, container, options, this.kernel)
    this.sortables.set(options.id, instance)
    return instance
  }

  get(id: string): SortableInstance | undefined {
    return this.sortables.get(id)
  }

  getAll(): Map<string, SortableInstance> {
    return new Map(this.sortables)
  }
}

export const sortableEnginePlugin: Plugin & { api?: SortableEngineAPI } = {
  name: 'sortable-engine',
  version: '1.0.0',
  type: 'core',

  install(kernel: Kernel) {
    this.api = SortableEngine(kernel) as any
  },

  uninstall() {
    // Cleanup
  }
}
