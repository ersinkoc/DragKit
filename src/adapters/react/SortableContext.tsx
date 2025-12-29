/**
 * SortableContext Component
 * Provides context for sortable items within a container
 */
import React, { createContext, useContext, useMemo } from 'react'
import { DragKitContext } from './context'

export type SortingStrategy = 'vertical' | 'horizontal' | 'grid'

export interface SortableContextValue {
  /** IDs of items in this sortable context */
  items: string[]

  /** Container ID for this sortable context */
  containerId: string

  /** Sorting strategy */
  strategy: SortingStrategy

  /** Currently active item ID */
  activeId: string | null

  /** Currently hovered item ID */
  overId: string | null
}

const SortableContextInternal = createContext<SortableContextValue | null>(null)

export function useSortableContext(): SortableContextValue {
  const context = useContext(SortableContextInternal)
  if (!context) {
    throw new Error('useSortableContext must be used within a SortableContext')
  }
  return context
}

export interface SortableContextProps {
  /** Children to render */
  children: React.ReactNode

  /** Array of item IDs in order */
  items: string[]

  /** Unique ID for this sortable container */
  id: string

  /** Sorting strategy - affects layout calculations */
  strategy?: SortingStrategy
}

export function SortableContext({
  children,
  items,
  id,
  strategy = 'vertical'
}: SortableContextProps) {
  // Use the context directly (with default values) instead of the throwing hook
  const context = useContext(DragKitContext)
  const { activeDraggableId, activeDroppableId } = context

  // Determine if an item in this context is active
  const activeId = useMemo(() => {
    if (activeDraggableId && items.includes(activeDraggableId)) {
      return activeDraggableId
    }
    return null
  }, [activeDraggableId, items])

  // Determine if an item in this context is being hovered
  const overId = useMemo(() => {
    if (activeDroppableId && items.includes(activeDroppableId)) {
      return activeDroppableId
    }
    return null
  }, [activeDroppableId, items])

  const contextValue = useMemo<SortableContextValue>(
    () => ({
      items,
      containerId: id,
      strategy,
      activeId,
      overId
    }),
    [items, id, strategy, activeId, overId]
  )

  return (
    <SortableContextInternal.Provider value={contextValue}>
      {children}
    </SortableContextInternal.Provider>
  )
}
