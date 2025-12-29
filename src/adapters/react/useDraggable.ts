/**
 * useDraggable Hook
 * Makes an element draggable
 */
import { useCallback, useEffect, useRef, useState, useMemo } from 'react'
import { useDragKitContext } from './context'
import type {
  DraggableInstance,
  DraggableOptions,
  DragData,
  Position,
  Transform
} from '../../types'

export interface UseDraggableOptions {
  /** Unique identifier for this draggable */
  id: string

  /** Data to attach to this draggable */
  data?: DragData

  /** CSS selector for the drag handle */
  handle?: string

  /** Whether this draggable is disabled */
  disabled?: boolean

  /** Restrict movement to an axis */
  axis?: 'x' | 'y' | 'both'
}

export interface UseDraggableReturn {
  /** Ref to attach to the draggable element */
  setNodeRef: (node: HTMLElement | null) => void

  /** Whether this element is currently being dragged */
  isDragging: boolean

  /** Attributes to spread on the draggable element */
  attributes: {
    role: string
    tabIndex: number
    'aria-roledescription': string
    'aria-describedby': string
    'aria-disabled': boolean
    'data-draggable-id': string
  }

  /** Event listeners to spread on the draggable element */
  listeners: {
    onPointerDown: (e: React.PointerEvent) => void
    onKeyDown: (e: React.KeyboardEvent) => void
  }

  /** Current transform (position offset) */
  transform: Transform | null

  /** Current position */
  position: Position | null
}

export function useDraggable(options: UseDraggableOptions): UseDraggableReturn {
  const { id, data = {}, handle, disabled = false, axis = 'both' } = options

  const { kernel, activeDraggableId } = useDragKitContext()
  const nodeRef = useRef<HTMLElement | null>(null)
  const instanceRef = useRef<DraggableInstance | null>(null)

  const [isDragging, setIsDragging] = useState(false)
  const [transform, setTransform] = useState<Transform | null>(null)
  const [position, setPosition] = useState<Position | null>(null)

  // Track if this specific draggable is active
  const isActive = activeDraggableId === id

  useEffect(() => {
    setIsDragging(isActive)
  }, [isActive])

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
        const draggableOptions: DraggableOptions = {
          id,
          data,
          handle,
          disabled,
          axis,
          onDragStart: () => {
            setIsDragging(true)
          },
          onDragMove: (event) => {
            setPosition(event.position)
            setTransform({
              x: event.delta.x,
              y: event.delta.y
            })
          },
          onDragEnd: () => {
            setIsDragging(false)
            setTransform(null)
            setPosition(null)
          },
          onDragCancel: () => {
            setIsDragging(false)
            setTransform(null)
            setPosition(null)
          }
        }

        instanceRef.current = kernel.draggable(node, draggableOptions)
      }
    },
    [kernel, id, data, handle, disabled, axis]
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

  // Keyboard handler for accessibility
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (disabled) return

      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        // Trigger drag start via keyboard
        // The sensor will handle the actual activation
      }
    },
    [disabled]
  )

  // Pointer down handler
  const handlePointerDown = useCallback(
    (_e: React.PointerEvent) => {
      // The sensor attached to the element will handle this
    },
    []
  )

  const attributes = useMemo(
    () => ({
      role: 'button',
      tabIndex: disabled ? -1 : 0,
      'aria-roledescription': 'draggable',
      'aria-describedby': `dragkit-instructions-${id}`,
      'aria-disabled': disabled,
      'data-draggable-id': id
    }),
    [id, disabled]
  )

  const listeners = useMemo(
    () => ({
      onPointerDown: handlePointerDown,
      onKeyDown: handleKeyDown
    }),
    [handlePointerDown, handleKeyDown]
  )

  return {
    setNodeRef,
    isDragging,
    attributes,
    listeners,
    transform,
    position
  }
}
