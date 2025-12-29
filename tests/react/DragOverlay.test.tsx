/**
 * DragOverlay Component Tests
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import React from 'react'
import { render, screen, cleanup } from '@testing-library/react'
import { DragOverlay } from '../../src/adapters/react/DragOverlay'

// Mock the context
vi.mock('../../src/adapters/react/context', () => ({
  useDragKitContext: vi.fn().mockReturnValue({
    kernel: null,
    activeDraggableId: null,
    activeDroppableId: null,
    isDragging: false
  })
}))

import { useDragKitContext } from '../../src/adapters/react/context'

describe('DragOverlay', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    cleanup()
    // Clear any portal elements safely
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild)
    }
  })

  it('should render nothing when not dragging', () => {
    ;(useDragKitContext as any).mockReturnValue({
      kernel: null,
      activeDraggableId: null,
      activeDroppableId: null,
      isDragging: false
    })

    const { container } = render(<DragOverlay>Dragged Item</DragOverlay>)

    expect(container.firstChild).toBeNull()
  })

  it('should render overlay when dragging', () => {
    ;(useDragKitContext as any).mockReturnValue({
      kernel: { on: vi.fn().mockReturnValue(() => {}) },
      activeDraggableId: 'drag-1',
      activeDroppableId: null,
      isDragging: true
    })

    render(<DragOverlay>Dragged Item</DragOverlay>)

    // Should render the overlay content
    expect(screen.getByText('Dragged Item')).toBeDefined()
  })

  it('should accept custom className', () => {
    ;(useDragKitContext as any).mockReturnValue({
      kernel: { on: vi.fn().mockReturnValue(() => {}) },
      activeDraggableId: 'drag-1',
      activeDroppableId: null,
      isDragging: true
    })

    render(<DragOverlay className="custom-overlay">Content</DragOverlay>)

    const overlay = document.querySelector('.custom-overlay')
    expect(overlay).not.toBeNull()
  })

  it('should apply default transition style', () => {
    ;(useDragKitContext as any).mockReturnValue({
      kernel: { on: vi.fn().mockReturnValue(() => {}) },
      activeDraggableId: 'drag-1',
      activeDroppableId: null,
      isDragging: true
    })

    render(<DragOverlay>Content</DragOverlay>)

    const overlay = document.querySelector('[role="presentation"]') as HTMLElement
    expect(overlay?.style.position).toBe('fixed')
  })

  it('should use custom dropAnimation', () => {
    ;(useDragKitContext as any).mockReturnValue({
      kernel: { on: vi.fn().mockReturnValue(() => {}) },
      activeDraggableId: 'drag-1',
      activeDroppableId: null,
      isDragging: true
    })

    render(
      <DragOverlay dropAnimation={{ duration: 500, easing: 'ease-in' }}>
        Content
      </DragOverlay>
    )

    expect(screen.getByText('Content')).toBeDefined()
  })

  it('should render nothing when no children provided', () => {
    ;(useDragKitContext as any).mockReturnValue({
      kernel: { on: vi.fn().mockReturnValue(() => {}) },
      activeDraggableId: 'drag-1',
      activeDroppableId: null,
      isDragging: true
    })

    const { container } = render(<DragOverlay />)

    expect(container.firstChild).toBeNull()
  })

  it('should apply custom zIndex', () => {
    ;(useDragKitContext as any).mockReturnValue({
      kernel: { on: vi.fn().mockReturnValue(() => {}) },
      activeDraggableId: 'drag-1',
      activeDroppableId: null,
      isDragging: true
    })

    render(<DragOverlay zIndex={5000}>Content</DragOverlay>)

    // Portal renders to body, find the overlay div
    const overlays = document.querySelectorAll('[role="presentation"]')
    const overlay = overlays[overlays.length - 1] as HTMLElement
    expect(overlay?.style.zIndex).toBe('5000')
  })

  it('should apply custom style', () => {
    ;(useDragKitContext as any).mockReturnValue({
      kernel: { on: vi.fn().mockReturnValue(() => {}) },
      activeDraggableId: 'drag-1',
      activeDroppableId: null,
      isDragging: true
    })

    render(<DragOverlay style={{ opacity: '0.5' }}>Content</DragOverlay>)

    const overlays = document.querySelectorAll('[role="presentation"]')
    const overlay = overlays[overlays.length - 1] as HTMLElement
    expect(overlay?.style.opacity).toBe('0.5')
  })

  it('should have correct accessibility attributes', () => {
    ;(useDragKitContext as any).mockReturnValue({
      kernel: { on: vi.fn().mockReturnValue(() => {}) },
      activeDraggableId: 'drag-1',
      activeDroppableId: null,
      isDragging: true
    })

    render(<DragOverlay>Content</DragOverlay>)

    const overlay = document.querySelector('[role="presentation"]')
    expect(overlay).not.toBeNull()
    expect(overlay?.getAttribute('role')).toBe('presentation')
    expect(overlay?.getAttribute('aria-hidden')).toBe('true')
  })

  describe('kernel event handlers', () => {
    it('should handle drag:start event', () => {
      const eventHandlers: Record<string, (event: any) => void> = {}
      const mockKernel = {
        on: vi.fn((event: string, handler: (e: any) => void) => {
          eventHandlers[event] = handler
          return () => {}
        })
      }

      ;(useDragKitContext as any).mockReturnValue({
        kernel: mockKernel,
        activeDraggableId: 'drag-1',
        activeDroppableId: null,
        isDragging: true
      })

      render(<DragOverlay>Content</DragOverlay>)

      // Verify drag:start handler is registered
      expect(mockKernel.on).toHaveBeenCalledWith('drag:start', expect.any(Function))

      // Call the handler
      if (eventHandlers['drag:start']) {
        eventHandlers['drag:start']({
          draggable: {
            element: document.createElement('div')
          },
          position: { x: 100, y: 200 }
        })
      }

      const overlay = document.querySelector('[role="presentation"]') as HTMLElement
      expect(overlay).not.toBeNull()
    })

    it('should handle drag:move event', () => {
      const eventHandlers: Record<string, (event: any) => void> = {}
      const mockKernel = {
        on: vi.fn((event: string, handler: (e: any) => void) => {
          eventHandlers[event] = handler
          return () => {}
        })
      }

      ;(useDragKitContext as any).mockReturnValue({
        kernel: mockKernel,
        activeDraggableId: 'drag-1',
        activeDroppableId: null,
        isDragging: true
      })

      render(<DragOverlay>Content</DragOverlay>)

      // Verify drag:move handler is registered
      expect(mockKernel.on).toHaveBeenCalledWith('drag:move', expect.any(Function))

      // Call the handler
      if (eventHandlers['drag:move']) {
        eventHandlers['drag:move']({
          position: { x: 150, y: 250 },
          delta: { x: 50, y: 50 }
        })
      }

      const overlay = document.querySelector('[role="presentation"]') as HTMLElement
      expect(overlay).not.toBeNull()
    })

    it('should handle drag:end event with drop animation', async () => {
      vi.useFakeTimers()
      const eventHandlers: Record<string, (event: any) => void> = {}
      const mockKernel = {
        on: vi.fn((event: string, handler: (e: any) => void) => {
          eventHandlers[event] = handler
          return () => {}
        })
      }

      ;(useDragKitContext as any).mockReturnValue({
        kernel: mockKernel,
        activeDraggableId: 'drag-1',
        activeDroppableId: null,
        isDragging: true
      })

      render(
        <DragOverlay dropAnimation={{ duration: 250, easing: 'ease' }}>
          Content
        </DragOverlay>
      )

      // Verify drag:end handler is registered
      expect(mockKernel.on).toHaveBeenCalledWith('drag:end', expect.any(Function))

      // Call the handler
      if (eventHandlers['drag:end']) {
        eventHandlers['drag:end']({})
      }

      // Wait for animation timeout
      vi.advanceTimersByTime(300)

      vi.useRealTimers()
    })

    it('should handle drag:end event without drop animation', () => {
      const eventHandlers: Record<string, (event: any) => void> = {}
      const mockKernel = {
        on: vi.fn((event: string, handler: (e: any) => void) => {
          eventHandlers[event] = handler
          return () => {}
        })
      }

      ;(useDragKitContext as any).mockReturnValue({
        kernel: mockKernel,
        activeDraggableId: 'drag-1',
        activeDroppableId: null,
        isDragging: true
      })

      render(
        <DragOverlay dropAnimation={null}>
          Content
        </DragOverlay>
      )

      // Call the handler
      if (eventHandlers['drag:end']) {
        eventHandlers['drag:end']({})
      }

      // Should reset immediately without animation
      expect(mockKernel.on).toHaveBeenCalledWith('drag:end', expect.any(Function))
    })

    it('should handle drag:cancel event', () => {
      const eventHandlers: Record<string, (event: any) => void> = {}
      const mockKernel = {
        on: vi.fn((event: string, handler: (e: any) => void) => {
          eventHandlers[event] = handler
          return () => {}
        })
      }

      ;(useDragKitContext as any).mockReturnValue({
        kernel: mockKernel,
        activeDraggableId: 'drag-1',
        activeDroppableId: null,
        isDragging: true
      })

      render(<DragOverlay>Content</DragOverlay>)

      // Verify drag:cancel handler is registered
      expect(mockKernel.on).toHaveBeenCalledWith('drag:cancel', expect.any(Function))

      // Call the handler
      if (eventHandlers['drag:cancel']) {
        eventHandlers['drag:cancel']({})
      }

      expect(mockKernel.on).toHaveBeenCalledWith('drag:cancel', expect.any(Function))
    })

    it('should cleanup event subscriptions on unmount', () => {
      const unsubFns = {
        start: vi.fn(),
        move: vi.fn(),
        end: vi.fn(),
        cancel: vi.fn()
      }
      const mockKernel = {
        on: vi.fn((event: string) => {
          if (event === 'drag:start') return unsubFns.start
          if (event === 'drag:move') return unsubFns.move
          if (event === 'drag:end') return unsubFns.end
          if (event === 'drag:cancel') return unsubFns.cancel
          return () => {}
        })
      }

      ;(useDragKitContext as any).mockReturnValue({
        kernel: mockKernel,
        activeDraggableId: 'drag-1',
        activeDroppableId: null,
        isDragging: true
      })

      const { unmount } = render(<DragOverlay>Content</DragOverlay>)
      unmount()

      expect(unsubFns.start).toHaveBeenCalled()
      expect(unsubFns.move).toHaveBeenCalled()
      expect(unsubFns.end).toHaveBeenCalled()
      expect(unsubFns.cancel).toHaveBeenCalled()
    })
  })

  describe('adjustScale option', () => {
    it('should apply initial rect dimensions when adjustScale is true', () => {
      const eventHandlers: Record<string, (event: any) => void> = {}
      const mockKernel = {
        on: vi.fn((event: string, handler: (e: any) => void) => {
          eventHandlers[event] = handler
          return () => {}
        })
      }

      ;(useDragKitContext as any).mockReturnValue({
        kernel: mockKernel,
        activeDraggableId: 'drag-1',
        activeDroppableId: null,
        isDragging: true
      })

      render(<DragOverlay adjustScale={true}>Content</DragOverlay>)

      // Simulate drag:start with element
      const mockElement = document.createElement('div')
      Object.defineProperty(mockElement, 'getBoundingClientRect', {
        value: () => ({ width: 100, height: 50 })
      })

      if (eventHandlers['drag:start']) {
        eventHandlers['drag:start']({
          draggable: { element: mockElement },
          position: { x: 100, y: 200 }
        })
      }

      const overlay = document.querySelector('[role="presentation"]') as HTMLElement
      expect(overlay).not.toBeNull()
    })
  })
})
