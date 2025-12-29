/**
 * Vue useDraggable Composable Tests
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { nextTick } from 'vue'

// Use vi.hoisted to define mocks before they are hoisted
const { mockKernel, mockDraggableInstance } = vi.hoisted(() => {
  const instance = {
    getId: vi.fn().mockReturnValue('test-drag'),
    getElement: vi.fn(),
    getTransform: vi.fn().mockReturnValue({ x: 10, y: 20 }),
    enable: vi.fn(),
    disable: vi.fn(),
    destroy: vi.fn()
  }
  return {
    mockDraggableInstance: instance,
    mockKernel: {
      on: vi.fn().mockReturnValue(() => {}),
      emit: vi.fn(),
      draggable: vi.fn().mockReturnValue(instance),
      droppable: vi.fn()
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

import { useDraggable } from '../../src/adapters/vue/useDraggable'

describe('Vue useDraggable', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    onMountedCallback = null
    onUnmountedCallback = null
    watchCallbacks = []
  })

  it('should return draggable composable object', () => {
    const result = useDraggable({ id: 'test-drag' })

    expect(result.setNodeRef).toBeDefined()
    expect(result.setHandleRef).toBeDefined()
    expect(result.attributes).toBeDefined()
    expect(result.listeners).toBeDefined()
    expect(result.isDragging).toBeDefined()
    expect(result.isDisabled).toBeDefined()
    expect(result.transform).toBeDefined()
    expect(result.node).toBeDefined()
  })

  it('should have correct initial state', () => {
    const result = useDraggable({ id: 'test-drag' })

    expect(result.isDragging.value).toBe(false)
    expect(result.isDisabled.value).toBe(false)
    expect(result.transform.value).toBeNull()
    expect(result.node.value).toBeNull()
  })

  it('should set disabled state from options', () => {
    const result = useDraggable({ id: 'test-drag', disabled: true })

    expect(result.isDisabled.value).toBe(true)
  })

  it('should provide correct attributes', () => {
    const result = useDraggable({ id: 'test-drag' })

    expect(result.attributes.value['data-draggable-id']).toBe('test-drag')
    expect(result.attributes.value['aria-grabbed']).toBe('false')
    expect(result.attributes.value.tabindex).toBe('0')
    expect(result.attributes.value.role).toBe('button')
  })

  it('should update aria-grabbed when dragging', async () => {
    const result = useDraggable({ id: 'test-drag' })

    result.isDragging.value = true
    await nextTick()

    expect(result.attributes.value['aria-grabbed']).toBe('true')
  })

  it('should set node ref', () => {
    const result = useDraggable({ id: 'test-drag' })
    const element = document.createElement('div')

    result.setNodeRef(element)

    expect(result.node.value).toBe(element)
  })

  it('should set handle ref', () => {
    const result = useDraggable({ id: 'test-drag' })
    const handle = document.createElement('div')

    result.setHandleRef(handle)

    expect(result.node.value).toBeNull()
  })

  it('should register on mount', () => {
    const result = useDraggable({ id: 'test-drag' })
    const element = document.createElement('div')
    result.setNodeRef(element)

    if (onMountedCallback) {
      onMountedCallback()
    }

    expect(mockKernel.draggable).toHaveBeenCalled()
  })

  it('should setup event listeners on mount', () => {
    useDraggable({ id: 'test-drag' })

    if (onMountedCallback) {
      onMountedCallback()
    }

    expect(mockKernel.on).toHaveBeenCalledWith('drag:start', expect.any(Function))
    expect(mockKernel.on).toHaveBeenCalledWith('drag:move', expect.any(Function))
    expect(mockKernel.on).toHaveBeenCalledWith('drag:end', expect.any(Function))
  })

  it('should cleanup listeners on unmount', () => {
    const unsubscribe = vi.fn()
    mockKernel.on.mockReturnValue(unsubscribe)

    useDraggable({ id: 'test-drag' })

    if (onMountedCallback) {
      onMountedCallback()
    }

    if (onUnmountedCallback) {
      onUnmountedCallback()
    }

    expect(unsubscribe).toHaveBeenCalled()
  })

  it('should update isDragging on drag:start', () => {
    let dragStartHandler: ((event: any) => void) | null = null
    mockKernel.on.mockImplementation((event: string, handler: (e: any) => void) => {
      if (event === 'drag:start') {
        dragStartHandler = handler
      }
      return () => {}
    })

    const result = useDraggable({ id: 'test-drag' })

    if (onMountedCallback) {
      onMountedCallback()
    }

    // Simulate drag start with matching ID
    if (dragStartHandler) {
      dragStartHandler({ draggable: { getId: () => 'test-drag' } })
    }

    expect(result.isDragging.value).toBe(true)
  })

  it('should update transform on drag:move', () => {
    let dragMoveHandler: ((event: any) => void) | null = null
    mockKernel.on.mockImplementation((event: string, handler: (e: any) => void) => {
      if (event === 'drag:move') {
        dragMoveHandler = handler
      }
      return () => {}
    })

    const result = useDraggable({ id: 'test-drag' })

    if (onMountedCallback) {
      onMountedCallback()
    }

    // Simulate drag move with matching ID
    if (dragMoveHandler) {
      dragMoveHandler({
        draggable: {
          getId: () => 'test-drag',
          getTransform: () => ({ x: 50, y: 60 })
        }
      })
    }

    expect(result.transform.value).toEqual({ x: 50, y: 60 })
  })

  it('should reset state on drag:end', () => {
    let dragEndHandler: ((event: any) => void) | null = null
    mockKernel.on.mockImplementation((event: string, handler: (e: any) => void) => {
      if (event === 'drag:end') {
        dragEndHandler = handler
      }
      return () => {}
    })

    const result = useDraggable({ id: 'test-drag' })
    result.isDragging.value = true
    result.transform.value = { x: 10, y: 20 }

    if (onMountedCallback) {
      onMountedCallback()
    }

    // Simulate drag end with matching ID
    if (dragEndHandler) {
      dragEndHandler({ draggable: { getId: () => 'test-drag' } })
    }

    expect(result.isDragging.value).toBe(false)
    expect(result.transform.value).toBeNull()
  })

  it('should handle handle ref', () => {
    const result = useDraggable({ id: 'test-drag' })
    const handle = document.createElement('div')

    result.setHandleRef(handle)

    // Handle node is set internally but node.value should still be null
    expect(result.node.value).toBeNull()
  })

  describe('watch callbacks', () => {
    it('should register on node change to new node', () => {
      const element = document.createElement('div')
      const result = useDraggable({ id: 'test-drag' })

      // Set the node value so register() can work
      result.setNodeRef(element)

      // Find the node watcher
      const nodeWatcher = watchCallbacks.find(w => typeof w.source !== 'function')

      if (nodeWatcher) {
        nodeWatcher.callback(element, null)
      }

      expect(mockKernel.draggable).toHaveBeenCalled()
    })

    it('should unregister on node change from old node', () => {
      const oldElement = document.createElement('div')
      const result = useDraggable({ id: 'test-drag' })
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

      expect(mockDraggableInstance.destroy).toHaveBeenCalled()
    })

    it('should disable instance when disabled option changes to true', () => {
      const element = document.createElement('div')
      const result = useDraggable({ id: 'test-drag', disabled: false })
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

      expect(result.isDisabled.value).toBe(true)
      expect(mockDraggableInstance.disable).toHaveBeenCalled()
    })

    it('should enable instance when disabled option changes to false', () => {
      const element = document.createElement('div')
      const result = useDraggable({ id: 'test-drag', disabled: true })
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

      expect(result.isDisabled.value).toBe(false)
      expect(mockDraggableInstance.enable).toHaveBeenCalled()
    })

    it('should handle undefined disabled value', () => {
      const element = document.createElement('div')
      const result = useDraggable({ id: 'test-drag' })
      result.setNodeRef(element)

      // Mount first to create instance
      if (onMountedCallback) {
        onMountedCallback()
      }

      // Find the disabled watcher
      const disabledWatcher = watchCallbacks.find(w => typeof w.source === 'function')

      if (disabledWatcher) {
        disabledWatcher.callback(undefined, undefined)
      }

      expect(result.isDisabled.value).toBe(false)
    })
  })
})
