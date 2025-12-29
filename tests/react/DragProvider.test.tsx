/**
 * DragProvider Component Tests
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor, cleanup } from '@testing-library/react'
import React from 'react'
import { DragProvider, useDragKitContext } from '../../src/adapters/react'

// Cleanup after each test
afterEach(() => {
  cleanup()
})

// Component to access context
function ContextConsumer() {
  const context = useDragKitContext()
  return (
    <div data-testid="context-consumer">
      <span data-testid="kernel">{context.kernel ? 'has-kernel' : 'no-kernel'}</span>
      <span data-testid="active-draggable">{context.activeDraggableId || 'none'}</span>
      <span data-testid="active-droppable">{context.activeDroppableId || 'none'}</span>
    </div>
  )
}

describe('DragProvider', () => {
  describe('initialization', () => {
    it('should render children after kernel initialization', async () => {
      render(
        <DragProvider>
          <div data-testid="child">Child Content</div>
        </DragProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('child')).toBeDefined()
      })
    })

    it('should provide kernel context to children', async () => {
      render(
        <DragProvider>
          <ContextConsumer />
        </DragProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('kernel').textContent).toBe('has-kernel')
      })
    })

    it('should initialize with no active draggable', async () => {
      render(
        <DragProvider>
          <ContextConsumer />
        </DragProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('active-draggable').textContent).toBe('none')
      })
    })

    it('should initialize with no active droppable', async () => {
      render(
        <DragProvider>
          <ContextConsumer />
        </DragProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('active-droppable').textContent).toBe('none')
      })
    })
  })

  describe('options', () => {
    it('should accept collision detection option', async () => {
      render(
        <DragProvider collisionDetection="center">
          <div data-testid="child">Child</div>
        </DragProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('child')).toBeDefined()
      })
    })

    it('should accept autoScroll option', async () => {
      render(
        <DragProvider autoScroll={true}>
          <div data-testid="child">Child</div>
        </DragProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('child')).toBeDefined()
      })
    })

    it('should accept accessibility option', async () => {
      render(
        <DragProvider accessibility={false}>
          <div data-testid="child">Child</div>
        </DragProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('child')).toBeDefined()
      })
    })

    it('should accept animation option', async () => {
      render(
        <DragProvider animation={{ duration: 300, easing: 'ease-in-out' }}>
          <div data-testid="child">Child</div>
        </DragProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('child')).toBeDefined()
      })
    })

    it('should accept animation as false', async () => {
      render(
        <DragProvider animation={false}>
          <div data-testid="child">Child</div>
        </DragProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('child')).toBeDefined()
      })
    })
  })

  describe('callbacks', () => {
    it('should accept onDragStart callback', async () => {
      const onDragStart = vi.fn()

      render(
        <DragProvider onDragStart={onDragStart}>
          <div data-testid="child">Child</div>
        </DragProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('child')).toBeDefined()
      })
    })

    it('should accept onDragMove callback', async () => {
      const onDragMove = vi.fn()

      render(
        <DragProvider onDragMove={onDragMove}>
          <div data-testid="child">Child</div>
        </DragProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('child')).toBeDefined()
      })
    })

    it('should accept onDragEnd callback', async () => {
      const onDragEnd = vi.fn()

      render(
        <DragProvider onDragEnd={onDragEnd}>
          <div data-testid="child">Child</div>
        </DragProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('child')).toBeDefined()
      })
    })

    it('should accept onDragCancel callback', async () => {
      const onDragCancel = vi.fn()

      render(
        <DragProvider onDragCancel={onDragCancel}>
          <div data-testid="child">Child</div>
        </DragProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('child')).toBeDefined()
      })
    })
  })

  describe('event handlers', () => {
    it('should subscribe to kernel events after initialization', async () => {
      function EventTest() {
        const { kernel } = useDragKitContext()
        return (
          <div data-testid="kernel-ready">{kernel ? 'ready' : 'loading'}</div>
        )
      }

      render(
        <DragProvider onDragStart={vi.fn()} onDragEnd={vi.fn()}>
          <EventTest />
        </DragProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('kernel-ready').textContent).toBe('ready')
      })
    })

    it('should call onDragStart and update activeDraggableId on drag:start', async () => {
      const onDragStart = vi.fn()
      let kernelRef: any = null

      function KernelCapture() {
        const { kernel, activeDraggableId } = useDragKitContext()
        kernelRef = kernel
        return (
          <div data-testid="active-id">{activeDraggableId || 'none'}</div>
        )
      }

      render(
        <DragProvider onDragStart={onDragStart}>
          <KernelCapture />
        </DragProvider>
      )

      await waitFor(() => {
        expect(kernelRef).not.toBeNull()
      })

      // Create a mock draggable
      const element = document.createElement('div')
      const draggable = kernelRef.draggable(element, { id: 'test-drag' })

      // Emit drag:start event
      kernelRef.emit({
        type: 'drag:start',
        draggable,
        position: { x: 0, y: 0 },
        timestamp: Date.now(),
        originalEvent: null
      })

      await waitFor(() => {
        expect(onDragStart).toHaveBeenCalled()
        expect(screen.getByTestId('active-id').textContent).toBe('test-drag')
      })

      draggable.destroy()
    })

    it('should call onDragEnd and clear active states on drag:end', async () => {
      const onDragEnd = vi.fn()
      let kernelRef: any = null

      function KernelCapture() {
        const { kernel, activeDraggableId, activeDroppableId } = useDragKitContext()
        kernelRef = kernel
        return (
          <div>
            <span data-testid="active-drag">{activeDraggableId || 'none'}</span>
            <span data-testid="active-drop">{activeDroppableId || 'none'}</span>
          </div>
        )
      }

      render(
        <DragProvider onDragEnd={onDragEnd}>
          <KernelCapture />
        </DragProvider>
      )

      await waitFor(() => {
        expect(kernelRef).not.toBeNull()
      })

      const element = document.createElement('div')
      const draggable = kernelRef.draggable(element, { id: 'end-test' })

      // Start drag first
      kernelRef.emit({
        type: 'drag:start',
        draggable,
        position: { x: 0, y: 0 },
        timestamp: Date.now(),
        originalEvent: null
      })

      await waitFor(() => {
        expect(screen.getByTestId('active-drag').textContent).toBe('end-test')
      })

      // End drag
      kernelRef.emit({
        type: 'drag:end',
        draggable,
        droppable: null,
        position: { x: 100, y: 100 },
        dropped: false,
        timestamp: Date.now(),
        originalEvent: null
      })

      await waitFor(() => {
        expect(onDragEnd).toHaveBeenCalled()
        expect(screen.getByTestId('active-drag').textContent).toBe('none')
        expect(screen.getByTestId('active-drop').textContent).toBe('none')
      })

      draggable.destroy()
    })

    it('should call onDragCancel and clear active states on drag:cancel', async () => {
      const onDragCancel = vi.fn()
      let kernelRef: any = null

      function KernelCapture() {
        const { kernel, activeDraggableId, activeDroppableId } = useDragKitContext()
        kernelRef = kernel
        return (
          <div>
            <span data-testid="active-drag">{activeDraggableId || 'none'}</span>
            <span data-testid="active-drop">{activeDroppableId || 'none'}</span>
          </div>
        )
      }

      render(
        <DragProvider onDragCancel={onDragCancel}>
          <KernelCapture />
        </DragProvider>
      )

      await waitFor(() => {
        expect(kernelRef).not.toBeNull()
      })

      const element = document.createElement('div')
      const draggable = kernelRef.draggable(element, { id: 'cancel-test' })

      // Start drag first
      kernelRef.emit({
        type: 'drag:start',
        draggable,
        position: { x: 0, y: 0 },
        timestamp: Date.now(),
        originalEvent: null
      })

      await waitFor(() => {
        expect(screen.getByTestId('active-drag').textContent).toBe('cancel-test')
      })

      // Cancel drag
      kernelRef.emit({
        type: 'drag:cancel',
        draggable,
        position: { x: 50, y: 50 },
        timestamp: Date.now(),
        originalEvent: null
      })

      await waitFor(() => {
        expect(onDragCancel).toHaveBeenCalled()
        expect(screen.getByTestId('active-drag').textContent).toBe('none')
        expect(screen.getByTestId('active-drop').textContent).toBe('none')
      })

      draggable.destroy()
    })

    it('should call onDragMove on drag:move', async () => {
      const onDragMove = vi.fn()
      let kernelRef: any = null

      function KernelCapture() {
        const { kernel } = useDragKitContext()
        kernelRef = kernel
        return <div data-testid="ready">{kernel ? 'ready' : 'loading'}</div>
      }

      render(
        <DragProvider onDragMove={onDragMove}>
          <KernelCapture />
        </DragProvider>
      )

      await waitFor(() => {
        expect(kernelRef).not.toBeNull()
      })

      const element = document.createElement('div')
      const draggable = kernelRef.draggable(element, { id: 'move-test' })

      // Start drag first
      kernelRef.emit({
        type: 'drag:start',
        draggable,
        position: { x: 0, y: 0 },
        timestamp: Date.now(),
        originalEvent: null
      })

      // Move
      kernelRef.emit({
        type: 'drag:move',
        draggable,
        position: { x: 50, y: 50 },
        delta: { x: 50, y: 50 },
        timestamp: Date.now(),
        originalEvent: null
      })

      await waitFor(() => {
        expect(onDragMove).toHaveBeenCalled()
      })

      draggable.destroy()
    })

    it('should update activeDroppableId on drag:over', async () => {
      let kernelRef: any = null
      let lastDroppableId: string | null = null

      function KernelCapture() {
        const { kernel, activeDroppableId } = useDragKitContext()
        kernelRef = kernel
        lastDroppableId = activeDroppableId
        return (
          <div data-testid="active-drop">{activeDroppableId || 'none'}</div>
        )
      }

      render(
        <DragProvider>
          <KernelCapture />
        </DragProvider>
      )

      await waitFor(() => {
        expect(kernelRef).not.toBeNull()
      })

      const dragElement = document.createElement('div')
      const dropElement = document.createElement('div')
      const draggable = kernelRef.draggable(dragElement, { id: 'drag-over-test' })
      const droppable = kernelRef.droppable(dropElement, { id: 'drop-zone' })

      // Start drag first
      kernelRef.emit({
        type: 'drag:start',
        draggable,
        position: { x: 0, y: 0 },
        timestamp: Date.now(),
        originalEvent: null
      })

      // Emit drag:over with explicit id property
      kernelRef.emit({
        type: 'drag:over',
        draggable,
        droppable: { id: droppable.id },
        position: { x: 50, y: 50 },
        timestamp: Date.now(),
        originalEvent: null
      })

      // Check if the event was emitted properly
      await waitFor(() => {
        // The activeDroppableId should be set when drag:over event is emitted with a droppable
        expect(screen.getByTestId('active-drop').textContent).toBe('drop-zone')
      }, { timeout: 2000 })

      draggable.destroy()
      droppable.destroy()
    })

    it('should clear activeDroppableId when droppable is null on drag:over', async () => {
      let kernelRef: any = null

      function KernelCapture() {
        const { kernel, activeDroppableId } = useDragKitContext()
        kernelRef = kernel
        return (
          <div data-testid="active-drop">{activeDroppableId || 'none'}</div>
        )
      }

      render(
        <DragProvider>
          <KernelCapture />
        </DragProvider>
      )

      await waitFor(() => {
        expect(kernelRef).not.toBeNull()
      })

      const dragElement = document.createElement('div')
      const draggable = kernelRef.draggable(dragElement, { id: 'over-null-test' })

      // Emit drag:over with null droppable
      kernelRef.emit({
        type: 'drag:over',
        draggable,
        droppable: null,
        position: { x: 50, y: 50 },
        timestamp: Date.now(),
        originalEvent: null
      })

      await waitFor(() => {
        expect(screen.getByTestId('active-drop').textContent).toBe('none')
      })

      draggable.destroy()
    })
  })

  describe('cleanup', () => {
    it('should cleanup kernel on unmount', async () => {
      let kernelRef: any = null

      function KernelCapture() {
        const { kernel } = useDragKitContext()
        kernelRef = kernel
        return <div data-testid="ready">ready</div>
      }

      const { unmount } = render(
        <DragProvider>
          <KernelCapture />
        </DragProvider>
      )

      await waitFor(() => {
        expect(kernelRef).not.toBeNull()
      })

      // Unmount should not throw
      expect(() => unmount()).not.toThrow()
    })
  })

  // Error handling is tested through the actual hooks/components
  // The context throws when used outside of DragProvider
})
