/**
 * DragKit React Context
 */
import { createContext, useContext } from 'react'
import type { Kernel } from '../../types'

export interface DragKitContextValue {
  kernel: Kernel | null
  activeDraggableId: string | null
  activeDroppableId: string | null
}

export const DragKitContext = createContext<DragKitContextValue>({
  kernel: null,
  activeDraggableId: null,
  activeDroppableId: null
})

export function useDragKitContext(): DragKitContextValue {
  const context = useContext(DragKitContext)
  if (!context.kernel) {
    throw new Error('useDragKitContext must be used within a DragProvider')
  }
  return context
}

export function useDragKit(): Kernel {
  const { kernel } = useDragKitContext()
  return kernel!
}
