/**
 * DragOverlay Component
 * Renders a visual overlay during drag operations
 */
import React, { useEffect, useState, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useDragKitContext } from './context'
import type { Position, Transform } from '../../types'

export interface DragOverlayProps {
  /** Content to render in the overlay */
  children?: React.ReactNode

  /** Class name to apply to the overlay container */
  className?: string

  /** Style to apply to the overlay container */
  style?: React.CSSProperties

  /** Whether to show a drop animation */
  dropAnimation?: {
    duration?: number
    easing?: string
  } | null

  /** Z-index for the overlay */
  zIndex?: number

  /** Adjust position of the overlay */
  adjustScale?: boolean
}

export function DragOverlay({
  children,
  className,
  style,
  dropAnimation = { duration: 250, easing: 'ease' },
  zIndex = 9999,
  adjustScale = false
}: DragOverlayProps) {
  const { kernel, activeDraggableId } = useDragKitContext()

  const [position, setPosition] = useState<Position | null>(null)
  const [transform, setTransform] = useState<Transform | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [initialRect, setInitialRect] = useState<DOMRect | null>(null)

  const overlayRef = useRef<HTMLDivElement>(null)
  const previousActiveId = useRef<string | null>(null)

  // Subscribe to drag events
  useEffect(() => {
    if (!kernel) return

    // Subscribe to kernel events
    const unsubStart = kernel.on('drag:start', (event) => {
      const draggable = event.draggable
      if (draggable.element) {
        setInitialRect(draggable.element.getBoundingClientRect())
      }
      setPosition(event.position)
      setTransform({ x: 0, y: 0 })
      setIsAnimating(false)
    })

    const unsubMove = kernel.on('drag:move', (event) => {
      setPosition(event.position)
      setTransform(event.delta)
    })

    const unsubEnd = kernel.on('drag:end', () => {
      if (dropAnimation) {
        setIsAnimating(true)
        setTimeout(() => {
          setPosition(null)
          setTransform(null)
          setInitialRect(null)
          setIsAnimating(false)
        }, dropAnimation.duration || 250)
      } else {
        setPosition(null)
        setTransform(null)
        setInitialRect(null)
      }
    })

    const unsubCancel = kernel.on('drag:cancel', () => {
      setPosition(null)
      setTransform(null)
      setInitialRect(null)
      setIsAnimating(false)
    })

    return () => {
      unsubStart()
      unsubMove()
      unsubEnd()
      unsubCancel()
    }
  }, [kernel, dropAnimation])

  // Track active ID changes
  useEffect(() => {
    previousActiveId.current = activeDraggableId
  }, [activeDraggableId])

  // Don't render if no active draggable and not animating
  if (!activeDraggableId && !isAnimating) {
    return null
  }

  // Don't render if no children provided
  if (!children) {
    return null
  }

  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex,
    pointerEvents: 'none',
    touchAction: 'none',
    ...(position && transform
      ? {
          transform: `translate3d(${position.x + transform.x}px, ${position.y + transform.y}px, 0)`,
          transition: isAnimating && dropAnimation
            ? `transform ${dropAnimation.duration}ms ${dropAnimation.easing}`
            : undefined
        }
      : {}),
    ...(initialRect && adjustScale
      ? {
          width: initialRect.width,
          height: initialRect.height
        }
      : {}),
    ...style
  }

  const overlay = (
    <div
      ref={overlayRef}
      className={className}
      style={overlayStyle}
      role="presentation"
      aria-hidden="true"
    >
      {children}
    </div>
  )

  // Render in a portal to avoid stacking context issues
  return createPortal(overlay, document.body)
}
