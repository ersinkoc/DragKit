/**
 * Vue Adapter for DragKit
 * Composition API hooks and components
 */

export { createDragKitPlugin, provideDragKit, injectDragKit } from './plugin'
export { useDraggable } from './useDraggable'
export { useDroppable } from './useDroppable'
export { useSortable } from './useSortable'
export { useDragContext } from './useDragContext'

export type {
  DragKitPluginOptions,
  UseDraggableOptions,
  UseDraggableReturn,
  UseDroppableOptions,
  UseDroppableReturn,
  UseSortableOptions,
  UseSortableReturn,
  DragContextState
} from './types'
