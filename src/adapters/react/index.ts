/**
 * DragKit React Adapter
 * React bindings for DragKit
 */

// Context and Provider
export { DragKitContext, useDragKitContext, useDragKit } from './context'
export type { DragKitContextValue } from './context'

export { DragProvider } from './DragProvider'
export type { DragProviderProps } from './DragProvider'

// Hooks
export { useDraggable } from './useDraggable'
export type { UseDraggableOptions, UseDraggableReturn } from './useDraggable'

export { useDroppable } from './useDroppable'
export type { UseDroppableOptions, UseDroppableReturn } from './useDroppable'

export { useSortable } from './useSortable'
export type { UseSortableOptions, UseSortableReturn } from './useSortable'

// Components
export { SortableContext, useSortableContext } from './SortableContext'
export type { SortableContextProps, SortableContextValue, SortingStrategy } from './SortableContext'

export { DragOverlay } from './DragOverlay'
export type { DragOverlayProps } from './DragOverlay'

// Re-export common types from core
export type {
  DragData,
  Position,
  Transform,
  DragEvent,
  DropEvent,
  DraggableOptions,
  DroppableOptions,
  SortableOptions
} from '../../types'
