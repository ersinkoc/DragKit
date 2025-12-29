/**
 * useDroppable Hook
 * Makes an element a drop target
 */
import { useCallback, useEffect, useRef, useState, useMemo } from 'react'
import { useDragKitContext } from './context'
import type {
  DroppableInstance,
  DroppableOptions,
  DraggableInstance,
  DragData
} from '../../types'

export interface UseDroppableOptions {
  /** Unique identifier for this droppable */
  id: string

  /** Data to attach to this droppable */
  data?: DragData

  /** Whether this droppable is disabled */
  disabled?: boolean

  /** Types or function to determine what draggables can be dropped here */
  accept?: string | string[] | ((draggable: DraggableInstance) => boolean)
}

export interface UseDroppableReturn {
  /** Ref to attach to the droppable element */
  setNodeRef: (node: HTMLElement | null) => void

  /** Whether a draggable is currently over this droppable */
  isOver: boolean

  /** Whether this droppable is currently active (can accept the current draggable) */
  isActive: boolean

  /** Attributes to spread on the droppable element */
  attributes: {
    'data-droppable-id': string
    'data-droppable-disabled': boolean
    'aria-dropeffect': string
  }
}

export function useDroppable(options: UseDroppableOptions): UseDroppableReturn {
  const { id, data = {}, disabled = false, accept } = options

  const { kernel, activeDroppableId } = useDragKitContext()
  const nodeRef = useRef<HTMLElement | null>(null)
  const instanceRef = useRef<DroppableInstance | null>(null)

  const [isOver, setIsOver] = useState(false)
  const [isActive, setIsActive] = useState(false)

  // Track if this specific droppable is active
  const isCurrentlyOver = activeDroppableId === id

  useEffect(() => {
    setIsOver(isCurrentlyOver)
  }, [isCurrentlyOver])

  // Set node ref and register with kernel
  const setNodeRef = useCallback(
    (node: HTMLElement | null) => {
      // Cleanup previous instance
      if (instanceRef.current) {
        instanceRef.current.destroy()
        instanceRef.current = null
      }

      nodeRef.current = node

      // Register new instance
      if (node && kernel) {
        const droppableOptions: DroppableOptions = {
          id,
          data,
          disabled,
          accept,
          onDragEnter: () => {
            setIsOver(true)
            setIsActive(true)
          },
          onDragOver: () => {
            setIsOver(true)
          },
          onDragLeave: () => {
            setIsOver(false)
            setIsActive(false)
          },
          onDrop: () => {
            setIsOver(false)
            setIsActive(false)
          }
        }

        instanceRef.current = kernel.droppable(node, droppableOptions)
      }
    },
    [kernel, id, data, disabled, accept]
  )

  // Update instance when options change
  useEffect(() => {
    if (instanceRef.current) {
      if (disabled) {
        instanceRef.current.disable()
      } else {
        instanceRef.current.enable()
      }
    }
  }, [disabled])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (instanceRef.current) {
        instanceRef.current.destroy()
        instanceRef.current = null
      }
    }
  }, [])

  const attributes = useMemo(
    () => ({
      'data-droppable-id': id,
      'data-droppable-disabled': disabled,
      'aria-dropeffect': disabled ? 'none' : 'move'
    }),
    [id, disabled]
  )

  return {
    setNodeRef,
    isOver,
    isActive,
    attributes
  }
}
