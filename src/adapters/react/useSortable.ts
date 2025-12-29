/**
 * useSortable Hook
 * Makes an element both draggable and droppable for sortable lists
 */
import { useCallback, useEffect, useRef, useState, useMemo } from 'react'
import { useDragKitContext } from './context'
import { useSortableContext } from './SortableContext'
import type {
  DraggableInstance,
  DroppableInstance,
  DraggableOptions,
  DroppableOptions,
  DragData,
  Transform
} from '../../types'

export interface UseSortableOptions {
  /** Unique identifier for this sortable item */
  id: string

  /** Data to attach to this sortable */
  data?: DragData

  /** CSS selector for the drag handle */
  handle?: string

  /** Whether this sortable is disabled */
  disabled?: boolean
}

export interface UseSortableReturn {
  /** Ref to attach to the sortable element */
  setNodeRef: (node: HTMLElement | null) => void

  /** Whether this element is currently being dragged */
  isDragging: boolean

  /** Whether a draggable is currently over this sortable */
  isOver: boolean

  /** Current index in the sortable list */
  index: number

  /** Active index (index of currently dragged item) */
  activeIndex: number

  /** Over index (index of item being hovered) */
  overIndex: number

  /** Attributes to spread on the sortable element */
  attributes: {
    role: string
    tabIndex: number
    'aria-roledescription': string
    'aria-disabled': boolean
    'data-sortable-id': string
  }

  /** Event listeners to spread on the sortable element */
  listeners: {
    onPointerDown: (e: React.PointerEvent) => void
    onKeyDown: (e: React.KeyboardEvent) => void
  }

  /** Current transform (position offset) */
  transform: Transform | null

  /** Transition style for animations */
  transition: string | undefined

  /** Whether items are currently sorting */
  isSorting: boolean
}

export function useSortable(options: UseSortableOptions): UseSortableReturn {
  const { id, data = {}, handle, disabled = false } = options

  const { kernel, activeDraggableId, activeDroppableId } = useDragKitContext()
  const { items, containerId, strategy, activeId, overId } = useSortableContext()

  const nodeRef = useRef<HTMLElement | null>(null)
  const draggableRef = useRef<DraggableInstance | null>(null)
  const droppableRef = useRef<DroppableInstance | null>(null)

  const [transform, setTransform] = useState<Transform | null>(null)
  const [transition, setTransition] = useState<string | undefined>(undefined)

  // Calculate indices
  const index = useMemo(() => items.indexOf(id), [items, id])
  const activeIndex = useMemo(
    () => (activeId ? items.indexOf(activeId) : -1),
    [items, activeId]
  )
  const overIndex = useMemo(
    () => (overId ? items.indexOf(overId) : -1),
    [items, overId]
  )

  // Track states
  const isDragging = activeDraggableId === id
  const isOver = activeDroppableId === id
  const isSorting = activeId !== null

  // Calculate transform for items during sorting
  useEffect(() => {
    if (!isSorting || isDragging) {
      setTransform(null)
      setTransition(undefined)
      return
    }

    // Apply displacement to items between active and over
    if (activeIndex !== -1 && overIndex !== -1 && activeIndex !== overIndex) {
      const isAfterActive = index > activeIndex
      const isBeforeOver = index <= overIndex
      const isBeforeActive = index < activeIndex
      const isAfterOver = index >= overIndex

      const shouldMoveUp = activeIndex < overIndex && isAfterActive && isBeforeOver
      const shouldMoveDown = activeIndex > overIndex && isAfterOver && isBeforeActive

      if (shouldMoveUp || shouldMoveDown) {
        const displacement = strategy === 'horizontal' ? 'x' : 'y'
        const amount = shouldMoveUp ? -100 : 100 // Percentage of item height/width
        setTransform({
          x: displacement === 'x' ? amount : 0,
          y: displacement === 'y' ? amount : 0
        })
        setTransition('transform 200ms ease')
      } else {
        setTransform(null)
        setTransition('transform 200ms ease')
      }
    } else {
      setTransform(null)
    }
  }, [isSorting, isDragging, activeIndex, overIndex, index, strategy])

  // Set node ref and register with kernel
  const setNodeRef = useCallback(
    (node: HTMLElement | null) => {
      // Cleanup previous instances
      if (draggableRef.current) {
        draggableRef.current.destroy()
        draggableRef.current = null
      }
      if (droppableRef.current) {
        droppableRef.current.destroy()
        droppableRef.current = null
      }

      nodeRef.current = node

      // Register as both draggable and droppable
      if (node && kernel) {
        const sortableData = { ...data, sortable: { containerId, index } }

        // Register as draggable
        const draggableOptions: DraggableOptions = {
          id,
          data: sortableData,
          handle,
          disabled,
          onDragStart: () => {
            setTransition(undefined)
          },
          onDragMove: (event) => {
            setTransform({
              x: event.delta.x,
              y: event.delta.y
            })
          },
          onDragEnd: () => {
            setTransform(null)
            setTransition('transform 200ms ease')
          },
          onDragCancel: () => {
            setTransform(null)
            setTransition('transform 200ms ease')
          }
        }

        draggableRef.current = kernel.draggable(node, draggableOptions)

        // Register as droppable
        const droppableOptions: DroppableOptions = {
          id,
          data: sortableData,
          disabled
        }

        droppableRef.current = kernel.droppable(node, droppableOptions)
      }
    },
    [kernel, id, data, handle, disabled, containerId, index]
  )

  // Update instances when disabled changes
  useEffect(() => {
    if (draggableRef.current) {
      if (disabled) {
        draggableRef.current.disable()
      } else {
        draggableRef.current.enable()
      }
    }
    if (droppableRef.current) {
      if (disabled) {
        droppableRef.current.disable()
      } else {
        droppableRef.current.enable()
      }
    }
  }, [disabled])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (draggableRef.current) {
        draggableRef.current.destroy()
        draggableRef.current = null
      }
      if (droppableRef.current) {
        droppableRef.current.destroy()
        droppableRef.current = null
      }
    }
  }, [])

  // Keyboard handler for accessibility
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (disabled) return

      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        // Toggle drag mode via keyboard
      }
    },
    [disabled]
  )

  // Pointer down handler
  const handlePointerDown = useCallback(
    (_e: React.PointerEvent) => {
      // The sensor will handle activation
    },
    []
  )

  const attributes = useMemo(
    () => ({
      role: 'listitem',
      tabIndex: disabled ? -1 : 0,
      'aria-roledescription': 'sortable',
      'aria-disabled': disabled,
      'data-sortable-id': id
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
    isOver,
    index,
    activeIndex,
    overIndex,
    attributes,
    listeners,
    transform,
    transition,
    isSorting
  }
}
