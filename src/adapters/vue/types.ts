/**
 * Vue Adapter Types
 */

import type { Ref, ComputedRef } from 'vue'
import type {
  KernelOptions,
  DragData,
  DropData,
  Transform,
  DraggableInstance,
  DroppableInstance,
  Kernel
} from '../../types'

export interface DragKitPluginOptions extends Partial<KernelOptions> {}

export interface UseDraggableOptions {
  id: string
  data?: DragData
  disabled?: boolean
  handle?: boolean
}

export interface UseDraggableReturn {
  setNodeRef: (el: HTMLElement | null) => void
  setHandleRef: (el: HTMLElement | null) => void
  attributes: ComputedRef<Record<string, string>>
  listeners: ComputedRef<Record<string, (e: Event) => void>>
  isDragging: Ref<boolean>
  isDisabled: Ref<boolean>
  transform: Ref<Transform | null>
  node: Ref<HTMLElement | null>
}

export interface UseDroppableOptions {
  id: string
  accept?: string | string[] | ((draggable: DraggableInstance) => boolean)
  disabled?: boolean
  data?: DropData
}

export interface UseDroppableReturn {
  setNodeRef: (el: HTMLElement | null) => void
  isOver: Ref<boolean>
  canDrop: Ref<boolean>
  active: Ref<DraggableInstance | null>
  node: Ref<HTMLElement | null>
}

export interface UseSortableOptions {
  id: string
  data?: DragData
  disabled?: boolean
}

export interface UseSortableReturn extends UseDraggableReturn {
  index: Ref<number>
  isSorting: Ref<boolean>
  transition: Ref<string | undefined>
}

export interface DragContextState {
  kernel: Ref<Kernel | null>
  isDragging: Ref<boolean>
  activeDraggable: Ref<DraggableInstance | null>
  activeDroppable: Ref<DroppableInstance | null>
  draggables: Ref<Map<string, DraggableInstance>>
  droppables: Ref<Map<string, DroppableInstance>>
}

export interface SortableContextOptions {
  id?: string
  items: string[]
  direction?: 'vertical' | 'horizontal'
  group?: string
  disabled?: boolean
}
