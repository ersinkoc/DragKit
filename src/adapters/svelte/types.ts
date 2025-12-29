/**
 * Svelte Adapter Types
 */

import type { Readable } from 'svelte/store'
import type {
  KernelOptions,
  DragData,
  DropData,
  DraggableInstance,
  DroppableInstance,
  Kernel
} from '../../types'

export interface DragKitStoreOptions extends Partial<KernelOptions> {}

export interface DragKitState {
  isDragging: boolean
  activeId: string | null
  activeDraggable: DraggableInstance | null
  activeDroppable: DroppableInstance | null
  overDroppableId: string | null
}

export interface DragKitStore extends Readable<DragKitState> {
  getKernel(): Kernel | null
  destroy(): void
}

export interface DraggableActionOptions {
  id: string
  data?: DragData
  disabled?: boolean
  handle?: string
}

export interface DroppableActionOptions {
  id: string
  accept?: string | string[] | ((draggable: DraggableInstance) => boolean)
  disabled?: boolean
  data?: DropData
}

export interface SortableStoreOptions {
  id?: string
  items: string[]
  direction?: 'vertical' | 'horizontal'
  group?: string
  animation?: { duration: number; easing: string }
}

export interface SortableState {
  items: string[]
  activeId: string | null
  overIndex: number | null
  isDragging: boolean
}

export interface SortableStore extends Readable<SortableState> {
  setItems(items: string[]): void
  moveItem(fromIndex: number, toIndex: number): void
  addItem(id: string, index?: number): void
  removeItem(id: string): void
  destroy(): void
}

export interface SortableItemOptions {
  id: string
  disabled?: boolean
}

export interface ActionReturn {
  update?: (options: any) => void
  destroy?: () => void
}
