/**
 * Vue useDragContext Composable Tests
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'

// Use vi.hoisted to define mocks before they are hoisted
const { mockKernel } = vi.hoisted(() => ({
  mockKernel: {
    on: vi.fn().mockReturnValue(() => {}),
    emit: vi.fn(),
    isDragging: vi.fn().mockReturnValue(false),
    getActiveDraggable: vi.fn().mockReturnValue(null),
    getActiveDroppable: vi.fn().mockReturnValue(null),
    getDraggables: vi.fn().mockReturnValue(new Map()),
    getDroppables: vi.fn().mockReturnValue(new Map()),
    detectCollision: vi.fn().mockReturnValue(null)
  }
}))

vi.mock('../../src/adapters/vue/plugin', () => ({
  injectDragKit: () => ({ value: mockKernel }),
  DragKitKey: Symbol('DragKit')
}))

// Mock Vue lifecycle hooks
let onMountedCallback: (() => void) | null = null
let onUnmountedCallback: (() => void) | null = null

vi.mock('vue', async () => {
  const actual = await vi.importActual('vue')
  return {
    ...actual as any,
    onMounted: vi.fn((cb) => { onMountedCallback = cb }),
    onUnmounted: vi.fn((cb) => { onUnmountedCallback = cb })
  }
})

import { useDragContext } from '../../src/adapters/vue/useDragContext'

describe('Vue useDragContext', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    onMountedCallback = null
    onUnmountedCallback = null
  })

  it('should return drag context state', () => {
    const result = useDragContext()

    expect(result.kernel).toBeDefined()
    expect(result.isDragging).toBeDefined()
    expect(result.activeDraggable).toBeDefined()
    expect(result.activeDroppable).toBeDefined()
    expect(result.draggables).toBeDefined()
    expect(result.droppables).toBeDefined()
  })

  it('should have correct initial state', () => {
    const result = useDragContext()

    expect(result.isDragging.value).toBe(false)
    expect(result.activeDraggable.value).toBeNull()
    expect(result.activeDroppable.value).toBeNull()
    expect(result.draggables.value.size).toBe(0)
    expect(result.droppables.value.size).toBe(0)
  })

  it('should update state on mount', () => {
    mockKernel.isDragging.mockReturnValue(true)
    mockKernel.getActiveDraggable.mockReturnValue({ id: 'drag-1' })

    const result = useDragContext()

    if (onMountedCallback) {
      onMountedCallback()
    }

    expect(result.isDragging.value).toBe(true)
    expect(result.activeDraggable.value).toEqual({ id: 'drag-1' })
  })

  it('should setup event listeners on mount', () => {
    useDragContext()

    if (onMountedCallback) {
      onMountedCallback()
    }

    expect(mockKernel.on).toHaveBeenCalledWith('drag:start', expect.any(Function))
    expect(mockKernel.on).toHaveBeenCalledWith('drag:move', expect.any(Function))
    expect(mockKernel.on).toHaveBeenCalledWith('drag:end', expect.any(Function))
    expect(mockKernel.on).toHaveBeenCalledWith('drag:cancel', expect.any(Function))
  })

  it('should cleanup listeners on unmount', () => {
    const unsubscribe = vi.fn()
    mockKernel.on.mockReturnValue(unsubscribe)

    useDragContext()

    if (onMountedCallback) {
      onMountedCallback()
    }

    if (onUnmountedCallback) {
      onUnmountedCallback()
    }

    expect(unsubscribe).toHaveBeenCalled()
  })

  it('should update state on drag:start', () => {
    mockKernel.isDragging.mockReturnValue(false)

    let dragStartHandler: (() => void) | null = null
    mockKernel.on.mockImplementation((event: string, handler: () => void) => {
      if (event === 'drag:start') {
        dragStartHandler = handler
      }
      return () => {}
    })

    const result = useDragContext()

    if (onMountedCallback) {
      onMountedCallback()
    }

    // Simulate drag start
    mockKernel.isDragging.mockReturnValue(true)
    mockKernel.getActiveDraggable.mockReturnValue({ id: 'drag-1' })

    if (dragStartHandler) {
      dragStartHandler()
    }

    expect(result.isDragging.value).toBe(true)
  })

  it('should detect collision on drag:move', () => {
    const mockDroppable = { id: 'drop-1' }
    mockKernel.detectCollision.mockReturnValue(mockDroppable)

    let dragMoveHandler: (() => void) | null = null
    mockKernel.on.mockImplementation((event: string, handler: () => void) => {
      if (event === 'drag:move') {
        dragMoveHandler = handler
      }
      return () => {}
    })

    const result = useDragContext()

    if (onMountedCallback) {
      onMountedCallback()
    }

    // Simulate active draggable
    mockKernel.getActiveDraggable.mockReturnValue({ id: 'drag-1' })

    if (dragMoveHandler) {
      dragMoveHandler()
    }

    expect(mockKernel.detectCollision).toHaveBeenCalled()
    expect(result.activeDroppable.value).toEqual(mockDroppable)
  })

  it('should update state on drag:end', () => {
    mockKernel.isDragging.mockReturnValue(true)

    let dragEndHandler: (() => void) | null = null
    mockKernel.on.mockImplementation((event: string, handler: () => void) => {
      if (event === 'drag:end') {
        dragEndHandler = handler
      }
      return () => {}
    })

    const result = useDragContext()

    if (onMountedCallback) {
      onMountedCallback()
    }

    // First update to set dragging
    result.isDragging.value = true

    // Simulate drag end
    mockKernel.isDragging.mockReturnValue(false)
    mockKernel.getActiveDraggable.mockReturnValue(null)

    if (dragEndHandler) {
      dragEndHandler()
    }

    expect(result.isDragging.value).toBe(false)
  })

  it('should update state on drag:cancel', () => {
    let dragCancelHandler: (() => void) | null = null
    mockKernel.on.mockImplementation((event: string, handler: () => void) => {
      if (event === 'drag:cancel') {
        dragCancelHandler = handler
      }
      return () => {}
    })

    const result = useDragContext()

    if (onMountedCallback) {
      onMountedCallback()
    }

    // Simulate drag cancel
    mockKernel.isDragging.mockReturnValue(false)
    mockKernel.getActiveDraggable.mockReturnValue(null)

    if (dragCancelHandler) {
      dragCancelHandler()
    }

    expect(result.isDragging.value).toBe(false)
    expect(result.activeDraggable.value).toBeNull()
  })

  it('should handle null kernel gracefully', () => {
    vi.doMock('../../src/adapters/vue/plugin', () => ({
      injectDragKit: () => ({ value: null }),
      DragKitKey: Symbol('DragKit')
    }))

    // The function should not throw when kernel is null
    expect(() => useDragContext()).not.toThrow()
  })

  it('should provide kernel reference', () => {
    const result = useDragContext()

    expect(result.kernel.value).toBe(mockKernel)
  })

  it('should track multiple draggables and droppables', () => {
    const draggablesMap = new Map([
      ['drag-1', { id: 'drag-1' }],
      ['drag-2', { id: 'drag-2' }]
    ])
    const droppablesMap = new Map([
      ['drop-1', { id: 'drop-1' }],
      ['drop-2', { id: 'drop-2' }]
    ])

    mockKernel.getDraggables.mockReturnValue(draggablesMap)
    mockKernel.getDroppables.mockReturnValue(droppablesMap)

    const result = useDragContext()

    if (onMountedCallback) {
      onMountedCallback()
    }

    expect(result.draggables.value.size).toBe(2)
    expect(result.droppables.value.size).toBe(2)
  })
})
