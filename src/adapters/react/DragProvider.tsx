/**
 * DragKit React Provider
 */
import React, { useEffect, useState, useMemo } from 'react'
import { DragKitContext, type DragKitContextValue } from './context'
import { DragKitKernel, createDragKit } from '../../kernel'
import type {
  KernelOptions,
  DragStartEvent,
  DragEndEvent,
  DragMoveEvent,
  DragCancelEvent,
  CollisionAlgorithm,
  CollisionFn
} from '../../types'

export interface DragProviderProps {
  children: React.ReactNode

  /** Collision detection algorithm */
  collisionDetection?: CollisionAlgorithm | CollisionFn

  /** Enable auto-scroll during drag */
  autoScroll?: boolean

  /** Enable accessibility features */
  accessibility?: boolean

  /** Animation options */
  animation?: { duration: number; easing: string } | false

  /** Callback when drag starts */
  onDragStart?: (event: DragStartEvent) => void

  /** Callback when dragging */
  onDragMove?: (event: DragMoveEvent) => void

  /** Callback when drag ends */
  onDragEnd?: (event: DragEndEvent) => void

  /** Callback when drag is cancelled */
  onDragCancel?: (event: DragCancelEvent) => void
}

export function DragProvider({
  children,
  collisionDetection = 'rectangle',
  autoScroll = false,
  accessibility = true,
  animation = { duration: 200, easing: 'ease-out' },
  onDragStart,
  onDragMove,
  onDragEnd,
  onDragCancel
}: DragProviderProps) {
  const [kernel, setKernel] = useState<DragKitKernel | null>(null)
  const [activeDraggableId, setActiveDraggableId] = useState<string | null>(null)
  const [activeDroppableId, setActiveDroppableId] = useState<string | null>(null)

  // Initialize kernel
  useEffect(() => {
    let mounted = true
    let kernelInstance: DragKitKernel | null = null

    const initKernel = async () => {
      const options: Partial<KernelOptions> = {
        collision: collisionDetection,
        autoScroll,
        accessibility,
        animation
      }

      kernelInstance = await createDragKit(options)

      if (mounted) {
        setKernel(kernelInstance)
      }
    }

    initKernel()

    return () => {
      mounted = false
      if (kernelInstance) {
        kernelInstance.destroy()
      }
    }
  }, [])

  // Subscribe to events
  useEffect(() => {
    if (!kernel) return

    const unsubscribers: (() => void)[] = []

    // Drag start
    unsubscribers.push(
      kernel.on('drag:start', (event) => {
        setActiveDraggableId(event.draggable.id)
        onDragStart?.(event)
      })
    )

    // Drag move
    unsubscribers.push(
      kernel.on('drag:move', (event) => {
        onDragMove?.(event)
      })
    )

    // Drag over
    unsubscribers.push(
      kernel.on('drag:over', (event) => {
        setActiveDroppableId(event.droppable?.id ?? null)
      })
    )

    // Drag end
    unsubscribers.push(
      kernel.on('drag:end', (event) => {
        setActiveDraggableId(null)
        setActiveDroppableId(null)
        onDragEnd?.(event)
      })
    )

    // Drag cancel
    unsubscribers.push(
      kernel.on('drag:cancel', (event) => {
        setActiveDraggableId(null)
        setActiveDroppableId(null)
        onDragCancel?.(event)
      })
    )

    return () => {
      unsubscribers.forEach((unsub) => unsub())
    }
  }, [kernel, onDragStart, onDragMove, onDragEnd, onDragCancel])

  // Update collision detection when prop changes
  useEffect(() => {
    if (kernel && collisionDetection) {
      kernel.setCollisionAlgorithm(collisionDetection)
    }
  }, [kernel, collisionDetection])

  const contextValue = useMemo<DragKitContextValue>(
    () => ({
      kernel,
      activeDraggableId,
      activeDroppableId
    }),
    [kernel, activeDraggableId, activeDroppableId]
  )

  if (!kernel) {
    return null
  }

  return (
    <DragKitContext.Provider value={contextValue}>
      {children}
    </DragKitContext.Provider>
  )
}
