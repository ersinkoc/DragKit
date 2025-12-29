/**
 * Multi-drag Plugin
 * Multiple item selection and dragging
 */

import type { Plugin, Kernel, DraggableInstance } from '../../types'

export interface MultiDragOptions {
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

class MultiDragImpl implements MultiDragAPI {
  private selected = new Set<string>()
  private selectionClass: string
  private selectKey: 'ctrl' | 'shift' | 'meta'
  private dragAllSelected: boolean
  private maxSelections: number
  private onSelectCallback?: (items: string[]) => void
  private onDeselectCallback?: (items: string[]) => void
  private unsubscribers: (() => void)[] = []
  private originalDraggables: DraggableInstance[] = []

  constructor(
    private kernel: Kernel,
    options: MultiDragOptions = {}
  ) {
    this.selectionClass = options.selectionClass ?? 'multi-drag-selected'
    this.selectKey = options.selectKey ?? 'ctrl'
    this.dragAllSelected = options.dragAllSelected ?? true
    this.maxSelections = options.maxSelections ?? Infinity
    this.onSelectCallback = options.onSelect
    this.onDeselectCallback = options.onDeselect
  }

  attach(): void {
    document.addEventListener('click', this.handleClick)
    document.addEventListener('keydown', this.handleKeyDown)

    const unsubStart = this.kernel.on('drag:start', (event) => {
      if (this.dragAllSelected && this.selected.has(event.draggable.getId())) {
        this.originalDraggables = this.getSelectedDraggables()
      }
    })

    const unsubMove = this.kernel.on('drag:move', (event) => {
      if (this.dragAllSelected && this.originalDraggables.length > 1) {
        const activeDraggable = event.draggable
        const activeTransform = activeDraggable.getTransform()

        if (activeTransform) {
          this.originalDraggables.forEach(draggable => {
            if (draggable.getId() !== activeDraggable.getId()) {
              draggable.setTransform(activeTransform)
            }
          })
        }
      }
    })

    const unsubEnd = this.kernel.on('drag:end', () => {
      if (this.dragAllSelected) {
        this.originalDraggables.forEach(draggable => {
          draggable.resetTransform()
        })
        this.originalDraggables = []
      }
    })

    this.unsubscribers = [unsubStart, unsubMove, unsubEnd]
  }

  detach(): void {
    document.removeEventListener('click', this.handleClick)
    document.removeEventListener('keydown', this.handleKeyDown)
    this.unsubscribers.forEach(unsub => unsub())
    this.unsubscribers = []
    this.clearSelection()
  }

  select(id: string): void {
    if (this.selected.size >= this.maxSelections) return
    if (this.selected.has(id)) return

    this.selected.add(id)
    this.updateElementClass(id, true)
    this.onSelectCallback?.([...this.selected])
  }

  deselect(id: string): void {
    if (!this.selected.has(id)) return

    this.selected.delete(id)
    this.updateElementClass(id, false)
    this.onDeselectCallback?.([...this.selected])
  }

  toggle(id: string): void {
    if (this.selected.has(id)) {
      this.deselect(id)
    } else {
      this.select(id)
    }
  }

  selectAll(): void {
    const draggables = this.kernel.getDraggables()
    const ids = Array.from(draggables.keys()).slice(0, this.maxSelections)

    ids.forEach(id => {
      this.selected.add(id)
      this.updateElementClass(id, true)
    })

    this.onSelectCallback?.([...this.selected])
  }

  clearSelection(): void {
    const previousSelection = [...this.selected]

    this.selected.forEach(id => {
      this.updateElementClass(id, false)
    })
    this.selected.clear()

    if (previousSelection.length > 0) {
      this.onDeselectCallback?.(previousSelection)
    }
  }

  getSelected(): string[] {
    return [...this.selected]
  }

  isSelected(id: string): boolean {
    return this.selected.has(id)
  }

  private getSelectedDraggables(): DraggableInstance[] {
    const draggables: DraggableInstance[] = []

    this.selected.forEach(id => {
      const draggable = this.kernel.getDraggable(id)
      if (draggable) {
        draggables.push(draggable)
      }
    })

    return draggables
  }

  private updateElementClass(id: string, add: boolean): void {
    const draggable = this.kernel.getDraggable(id)
    if (!draggable) return

    const element = draggable.getElement()
    if (add) {
      element.classList.add(this.selectionClass)
    } else {
      element.classList.remove(this.selectionClass)
    }
  }

  private handleClick = (e: MouseEvent): void => {
    const target = e.target as HTMLElement
    const draggableEl = target.closest('[data-draggable-id]') as HTMLElement

    if (!draggableEl) {
      // Click outside - clear selection unless modifier key is held
      if (!this.isModifierKeyHeld(e)) {
        this.clearSelection()
      }
      return
    }

    const id = draggableEl.getAttribute('data-draggable-id')
    if (!id) return

    if (this.isModifierKeyHeld(e)) {
      this.toggle(id)
    } else {
      this.clearSelection()
      this.select(id)
    }
  }

  private handleKeyDown = (e: KeyboardEvent): void => {
    // Ctrl/Cmd + A to select all
    if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
      const target = e.target as HTMLElement
      if (target.closest('[data-draggable-id]')) {
        e.preventDefault()
        this.selectAll()
      }
    }

    // Escape to clear selection
    if (e.key === 'Escape') {
      this.clearSelection()
    }
  }

  private isModifierKeyHeld(e: MouseEvent): boolean {
    switch (this.selectKey) {
      case 'ctrl':
        return e.ctrlKey
      case 'shift':
        return e.shiftKey
      case 'meta':
        return e.metaKey
      default:
        return false
    }
  }
}

export function multiDrag(options: MultiDragOptions = {}): Plugin & { api?: MultiDragAPI } {
  let instance: MultiDragImpl | null = null

  return {
    name: 'multi-drag',
    version: '1.0.0',
    type: 'optional',

    install(kernel: Kernel) {
      instance = new MultiDragImpl(kernel, options)
      instance.attach()
      ;(this as any).api = instance
    },

    uninstall() {
      if (instance) {
        instance.detach()
        instance = null
      }
    }
  }
}

export type { MultiDragAPI }
