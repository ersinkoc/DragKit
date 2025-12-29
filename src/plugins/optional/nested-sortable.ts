/**
 * Nested Sortable Plugin
 * Nested/tree sortable lists
 */

import type { Plugin, Kernel } from '../../types'

export interface NestedItem {
  id: string
  children: string[]
}

export interface NestChangeEvent {
  item: string
  oldParent: string | null
  newParent: string | null
  oldIndex: number
  newIndex: number
  depth: number
}

export interface NestedSortableOptions {
  id: string
  items: NestedItem[]
  maxDepth?: number
  collapsible?: boolean
  indentSize?: number
  childrenKey?: string
  expandOnHover?: boolean
  expandDelay?: number
  onNestChange?: (event: NestChangeEvent) => void
  onCollapse?: (id: string) => void
  onExpand?: (id: string) => void
}

interface NestedSortableInstance {
  id: string
  container: HTMLElement
  options: NestedSortableOptions
  collapse(id: string): void
  expand(id: string): void
  toggle(id: string): void
  isCollapsed(id: string): boolean
  getDepth(id: string): number
  getParent(id: string): string | null
  getChildren(id: string): string[]
  canNest(itemId: string, parentId: string): boolean
  destroy(): void
}

interface NestedSortableAPI {
  create(container: HTMLElement, options: NestedSortableOptions): NestedSortableInstance
  get(id: string): NestedSortableInstance | undefined
  getAll(): Map<string, NestedSortableInstance>
  collapse(id: string): void
  expand(id: string): void
  toggle(id: string): void
  isCollapsed(id: string): boolean
  getDepth(id: string): number
  getParent(id: string): string | null
  getChildren(id: string): string[]
  canNest(itemId: string, parentId: string): boolean
}

class NestedSortableInstanceImpl implements NestedSortableInstance {
  private collapsedItems = new Set<string>()
  private itemMap = new Map<string, NestedItem>()
  private parentMap = new Map<string, string | null>()
  private depthMap = new Map<string, number>()
  private hoverTimeout: number | null = null
  private unsubscribers: (() => void)[] = []

  constructor(
    public id: string,
    public container: HTMLElement,
    public options: NestedSortableOptions,
    private kernel: Kernel
  ) {
    this.buildMaps()
    this.setupListeners()
    this.applyIndentation()
  }

  private buildMaps(): void {
    const buildRecursive = (items: NestedItem[], parent: string | null, depth: number) => {
      items.forEach(item => {
        this.itemMap.set(item.id, item)
        this.parentMap.set(item.id, parent)
        this.depthMap.set(item.id, depth)

        if (item.children.length > 0) {
          const childItems = item.children.map(childId => {
            const existingItem = this.options.items.find(i => i.id === childId)
            return existingItem || { id: childId, children: [] }
          })
          buildRecursive(childItems, item.id, depth + 1)
        }
      })
    }

    buildRecursive(this.options.items, null, 0)
  }

  private setupListeners(): void {
    const unsubMove = this.kernel.on('drag:move', (event) => {
      if (this.options.expandOnHover) {
        this.handleHoverExpand(event.position)
      }
    })

    const unsubEnd = this.kernel.on('drag:end', (event) => {
      this.clearHoverTimeout()
      this.handleNestChange(event)
    })

    this.unsubscribers = [unsubMove, unsubEnd]

    // Add collapse toggle listeners
    this.container.addEventListener('click', this.handleCollapseClick)
  }

  private handleCollapseClick = (e: MouseEvent): void => {
    const target = e.target as HTMLElement
    const collapseToggle = target.closest('[data-collapse-toggle]') as HTMLElement

    if (collapseToggle) {
      const itemId = collapseToggle.getAttribute('data-collapse-toggle')
      if (itemId) {
        e.stopPropagation()
        this.toggle(itemId)
      }
    }
  }

  private handleHoverExpand(position: { x: number; y: number }): void {
    const element = document.elementFromPoint(position.x, position.y)
    const draggableEl = element?.closest('[data-draggable-id]') as HTMLElement

    if (!draggableEl) {
      this.clearHoverTimeout()
      return
    }

    const id = draggableEl.getAttribute('data-draggable-id')
    if (!id || !this.isCollapsed(id)) {
      this.clearHoverTimeout()
      return
    }

    if (this.hoverTimeout === null) {
      this.hoverTimeout = window.setTimeout(() => {
        this.expand(id)
        this.hoverTimeout = null
      }, this.options.expandDelay ?? 500)
    }
  }

  private clearHoverTimeout(): void {
    if (this.hoverTimeout !== null) {
      clearTimeout(this.hoverTimeout)
      this.hoverTimeout = null
    }
  }

  private handleNestChange(_event: any): void {
    // This would be called when an item is dropped into a new location
    // The actual implementation would need to track the new parent
    if (this.options.onNestChange) {
      // Implementation depends on how the sortable engine reports changes
    }
  }

  private applyIndentation(): void {
    const indentSize = this.options.indentSize ?? 20

    this.depthMap.forEach((depth, id) => {
      const element = this.container.querySelector(`[data-draggable-id="${id}"]`) as HTMLElement
      if (element) {
        element.style.paddingLeft = `${depth * indentSize}px`
      }
    })
  }

  collapse(id: string): void {
    if (!this.itemMap.has(id)) return

    this.collapsedItems.add(id)
    this.updateVisibility(id, false)
    this.options.onCollapse?.(id)
  }

  expand(id: string): void {
    if (!this.itemMap.has(id)) return

    this.collapsedItems.delete(id)
    this.updateVisibility(id, true)
    this.options.onExpand?.(id)
  }

  toggle(id: string): void {
    if (this.isCollapsed(id)) {
      this.expand(id)
    } else {
      this.collapse(id)
    }
  }

  isCollapsed(id: string): boolean {
    return this.collapsedItems.has(id)
  }

  getDepth(id: string): number {
    return this.depthMap.get(id) ?? 0
  }

  getParent(id: string): string | null {
    return this.parentMap.get(id) ?? null
  }

  getChildren(id: string): string[] {
    return this.itemMap.get(id)?.children ?? []
  }

  canNest(itemId: string, parentId: string): boolean {
    const maxDepth = this.options.maxDepth ?? Infinity
    const parentDepth = this.getDepth(parentId)
    const itemDepth = this.getMaxDescendantDepth(itemId)

    // Check if nesting would exceed max depth
    if (parentDepth + 1 + itemDepth > maxDepth) {
      return false
    }

    // Check for circular reference
    let currentParent: string | null = parentId
    while (currentParent) {
      if (currentParent === itemId) {
        return false
      }
      currentParent = this.getParent(currentParent)
    }

    return true
  }

  private getMaxDescendantDepth(id: string): number {
    const children = this.getChildren(id)
    if (children.length === 0) return 0

    return 1 + Math.max(...children.map(childId => this.getMaxDescendantDepth(childId)))
  }

  private updateVisibility(parentId: string, visible: boolean): void {
    const children = this.getChildren(parentId)

    children.forEach(childId => {
      const element = this.container.querySelector(`[data-draggable-id="${childId}"]`) as HTMLElement
      if (element) {
        element.style.display = visible ? '' : 'none'
      }

      // Recursively handle children
      if (visible && !this.isCollapsed(childId)) {
        this.updateVisibility(childId, true)
      } else if (!visible) {
        this.updateVisibility(childId, false)
      }
    })
  }

  destroy(): void {
    this.container.removeEventListener('click', this.handleCollapseClick)
    this.unsubscribers.forEach(unsub => unsub())
    this.unsubscribers = []
    this.clearHoverTimeout()
  }
}

class NestedSortableManager implements NestedSortableAPI {
  private instances = new Map<string, NestedSortableInstance>()

  constructor(private kernel: Kernel) {}

  create(container: HTMLElement, options: NestedSortableOptions): NestedSortableInstance {
    if (this.instances.has(options.id)) {
      throw new Error(`Nested sortable with id "${options.id}" already exists`)
    }

    const instance = new NestedSortableInstanceImpl(
      options.id,
      container,
      options,
      this.kernel
    )

    this.instances.set(options.id, instance)
    return instance
  }

  get(id: string): NestedSortableInstance | undefined {
    return this.instances.get(id)
  }

  getAll(): Map<string, NestedSortableInstance> {
    return new Map(this.instances)
  }

  collapse(id: string): void {
    this.instances.forEach(instance => {
      if (instance.getChildren(id).length > 0) {
        instance.collapse(id)
      }
    })
  }

  expand(id: string): void {
    this.instances.forEach(instance => {
      if (instance.getChildren(id).length > 0) {
        instance.expand(id)
      }
    })
  }

  toggle(id: string): void {
    this.instances.forEach(instance => {
      if (instance.getChildren(id).length > 0) {
        instance.toggle(id)
      }
    })
  }

  isCollapsed(id: string): boolean {
    for (const instance of this.instances.values()) {
      if (instance.getChildren(id).length > 0) {
        return instance.isCollapsed(id)
      }
    }
    return false
  }

  getDepth(id: string): number {
    for (const instance of this.instances.values()) {
      const depth = instance.getDepth(id)
      if (depth > 0) return depth
    }
    return 0
  }

  getParent(id: string): string | null {
    for (const instance of this.instances.values()) {
      const parent = instance.getParent(id)
      if (parent) return parent
    }
    return null
  }

  getChildren(id: string): string[] {
    for (const instance of this.instances.values()) {
      const children = instance.getChildren(id)
      if (children.length > 0) return children
    }
    return []
  }

  canNest(itemId: string, parentId: string): boolean {
    for (const instance of this.instances.values()) {
      return instance.canNest(itemId, parentId)
    }
    return true
  }

  destroy(): void {
    this.instances.forEach(instance => instance.destroy())
    this.instances.clear()
  }
}

export function nestedSortable(): Plugin & { api?: NestedSortableAPI } {
  let manager: NestedSortableManager | null = null

  return {
    name: 'nested-sortable',
    version: '1.0.0',
    type: 'optional',

    install(kernel: Kernel) {
      manager = new NestedSortableManager(kernel)
      ;(this as any).api = manager
    },

    uninstall() {
      if (manager) {
        manager.destroy()
        manager = null
      }
    }
  }
}

export type { NestedSortableAPI, NestedSortableInstance }
