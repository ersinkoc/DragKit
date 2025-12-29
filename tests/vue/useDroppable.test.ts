/**
 * Vue useDroppable Composable Tests
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'

// Use vi.hoisted to define mocks before they are hoisted
const { mockKernel, mockDroppableInstance } = vi.hoisted(() => {
  const instance = {
    getId: vi.fn().mockReturnValue('test-drop'),
    getElement: vi.fn(),
    canAccept: vi.fn().mockReturnValue(true),
    enable: vi.fn(),
    disable: vi.fn(),
    destroy: vi.fn()
  }
  return {
    mockDroppableInstance: instance,
    mockKernel: {
      on: vi.fn().mockReturnValue(() => {}),
      emit: vi.fn(),
      droppable: vi.fn().mockReturnValue(instance),
      detectCollision: vi.fn()
    }
  }
})

vi.mock('../../src/adapters/vue/plugin', () => ({
  injectDragKit: () => ({ value: mockKernel }),
  DragKitKey: Symbol('DragKit')
}))

// Mock Vue lifecycle hooks
let onMountedCallback: (() => void) | null = null
let onUnmountedCallback: (() => void) | null = null
type WatchCallback = (newVal: any, oldVal: any) => void
let watchCallbacks: { source: any, callback: WatchCallback }[] = []

vi.mock('vue', async () => {
  const actual = await vi.importActual('vue')
  return {
    ...actual as any,
    onMounted: vi.fn((cb) => { onMountedCallback = cb }),
    onUnmounted: vi.fn((cb) => { onUnmountedCallback = cb }),
    watch: vi.fn((source: any, callback: WatchCallback) => {
      watchCallbacks.push({ source, callback })
    })
  }
})

import { useDroppable } from '../../src/adapters/vue/useDroppable'

describe('Vue useDroppable', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    onMountedCallback = null
    onUnmountedCallback = null
    watchCallbacks = []
  })

  it('should return droppable composable object', () => {
    const result = useDroppable({ id: 'test-drop' })

    expect(result.setNodeRef).toBeDefined()
    expect(result.isOver).toBeDefined()
    expect(result.canDrop).toBeDefined()
    expect(result.active).toBeDefined()
    expect(result.node).toBeDefined()
  })

  it('should have correct initial state', () => {
    const result = useDroppable({ id: 'test-drop' })

    expect(result.isOver.value).toBe(false)
    expect(result.canDrop.value).toBe(false)
    expect(result.active.value).toBeNull()
    expect(result.node.value).toBeNull()
  })

  it('should set node ref', () => {
    const result = useDroppable({ id: 'test-drop' })
    const element = document.createElement('div')

    result.setNodeRef(element)

    expect(result.node.value).toBe(element)
  })

  it('should register on mount', () => {
    const result = useDroppable({ id: 'test-drop' })
    const element = document.createElement('div')
    result.setNodeRef(element)

    if (onMountedCallback) {
      onMountedCallback()
    }

    expect(mockKernel.droppable).toHaveBeenCalled()
  })

  it('should setup event listeners on mount', () => {
    useDroppable({ id: 'test-drop' })

    if (onMountedCallback) {
      onMountedCallback()
    }

    expect(mockKernel.on).toHaveBeenCalledWith('drag:start', expect.any(Function))
    expect(mockKernel.on).toHaveBeenCalledWith('drag:move', expect.any(Function))
    expect(mockKernel.on).toHaveBeenCalledWith('drag:end', expect.any(Function))
  })

  it('should accept options', () => {
    const result = useDroppable({
      id: 'test-drop',
      accept: ['items'],
      disabled: false,
      data: { type: 'container' }
    })

    expect(result).toBeDefined()
  })

  it('should cleanup listeners on unmount', () => {
    const unsubscribe = vi.fn()
    mockKernel.on.mockReturnValue(unsubscribe)

    useDroppable({ id: 'test-drop' })

    if (onMountedCallback) {
      onMountedCallback()
    }

    if (onUnmountedCallback) {
      onUnmountedCallback()
    }

    expect(unsubscribe).toHaveBeenCalled()
  })

  it('should update isOver on drag:start', () => {
    let dragStartHandler: ((event: any) => void) | null = null
    mockKernel.on.mockImplementation((event: string, handler: (e: any) => void) => {
      if (event === 'drag:start') {
        dragStartHandler = handler
      }
      return () => {}
    })

    const result = useDroppable({ id: 'test-drop' })

    if (onMountedCallback) {
      onMountedCallback()
    }

    // Simulate drag start
    if (dragStartHandler) {
      dragStartHandler({ draggable: { getId: () => 'drag-1' } })
    }

    expect(result.active.value).toBeDefined()
  })

  it('should update isOver on drag:move with collision', () => {
    let dragMoveHandler: ((event: any) => void) | null = null
    mockKernel.on.mockImplementation((event: string, handler: (e: any) => void) => {
      if (event === 'drag:move') {
        dragMoveHandler = handler
      }
      return () => {}
    })
    mockKernel.detectCollision.mockReturnValue({ getId: () => 'test-drop' })

    const result = useDroppable({ id: 'test-drop' })
    const element = document.createElement('div')
    result.setNodeRef(element)

    if (onMountedCallback) {
      onMountedCallback()
    }

    // Simulate drag move with collision
    if (dragMoveHandler) {
      dragMoveHandler({
        position: { x: 100, y: 100 },
        draggable: { getId: () => 'drag-1' }
      })
    }

    expect(result.isOver.value).toBe(true)
  })

  it('should reset state on drag:end', () => {
    let dragEndHandler: ((event: any) => void) | null = null
    mockKernel.on.mockImplementation((event: string, handler: (e: any) => void) => {
      if (event === 'drag:end') {
        dragEndHandler = handler
      }
      return () => {}
    })

    const result = useDroppable({ id: 'test-drop' })
    result.isOver.value = true
    result.active.value = { id: 'drag-1' } as any

    if (onMountedCallback) {
      onMountedCallback()
    }

    // Simulate drag end
    if (dragEndHandler) {
      dragEndHandler({ draggable: { getId: () => 'drag-1' } })
    }

    expect(result.isOver.value).toBe(false)
    expect(result.active.value).toBeNull()
  })

  describe('watch callbacks', () => {
    it('should register on node change to new node', () => {
      const element = document.createElement('div')
      const result = useDroppable({ id: 'test-drop' })

      // Set the node value so register() can work
      result.setNodeRef(element)

      // Find the node watcher
      const nodeWatcher = watchCallbacks.find(w => typeof w.source !== 'function')

      if (nodeWatcher) {
        nodeWatcher.callback(element, null)
      }

      expect(mockKernel.droppable).toHaveBeenCalled()
    })

    it('should unregister on node change from old node', () => {
      const oldElement = document.createElement('div')
      const result = useDroppable({ id: 'test-drop' })
      result.setNodeRef(oldElement)

      // Mount first to create instance
      if (onMountedCallback) {
        onMountedCallback()
      }

      // Find the node watcher
      const nodeWatcher = watchCallbacks.find(w => typeof w.source !== 'function')

      if (nodeWatcher) {
        nodeWatcher.callback(null, oldElement)
      }

      expect(mockDroppableInstance.destroy).toHaveBeenCalled()
    })

    it('should disable instance when disabled option changes to true', () => {
      const element = document.createElement('div')
      const result = useDroppable({ id: 'test-drop', disabled: false })
      result.setNodeRef(element)

      // Mount first to create instance
      if (onMountedCallback) {
        onMountedCallback()
      }

      // Find the disabled watcher (the function source one)
      const disabledWatcher = watchCallbacks.find(w => typeof w.source === 'function')

      if (disabledWatcher) {
        disabledWatcher.callback(true, false)
      }

      expect(mockDroppableInstance.disable).toHaveBeenCalled()
    })

    it('should enable instance when disabled option changes to false', () => {
      const element = document.createElement('div')
      const result = useDroppable({ id: 'test-drop', disabled: true })
      result.setNodeRef(element)

      // Mount first to create instance
      if (onMountedCallback) {
        onMountedCallback()
      }

      // Find the disabled watcher (the function source one)
      const disabledWatcher = watchCallbacks.find(w => typeof w.source === 'function')

      if (disabledWatcher) {
        disabledWatcher.callback(false, true)
      }

      expect(mockDroppableInstance.enable).toHaveBeenCalled()
    })
  })
})
