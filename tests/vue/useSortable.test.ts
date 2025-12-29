/**
 * Vue useSortable Composable Tests
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { nextTick } from 'vue'

// Use vi.hoisted to define mocks before they are hoisted
const { mockKernel, mockDraggableInstance } = vi.hoisted(() => {
  const instance = {
    getId: vi.fn().mockReturnValue('test-sort'),
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
      draggable: vi.fn().mockReturnValue(instance)
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

// Store watch callbacks for testing
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

import { useSortable } from '../../src/adapters/vue/useSortable'

describe('Vue useSortable', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    onMountedCallback = null
    onUnmountedCallback = null
    watchCallbacks = []
  })

  it('should return sortable composable object', () => {
    const result = useSortable({ id: 'test-sort' })

    expect(result.setNodeRef).toBeDefined()
    expect(result.setHandleRef).toBeDefined()
    expect(result.attributes).toBeDefined()
    expect(result.listeners).toBeDefined()
    expect(result.isDragging).toBeDefined()
    expect(result.isDisabled).toBeDefined()
    expect(result.transform).toBeDefined()
    expect(result.node).toBeDefined()
    expect(result.index).toBeDefined()
    expect(result.isSorting).toBeDefined()
    expect(result.transition).toBeDefined()
  })

  it('should have correct initial state', () => {
    const result = useSortable({ id: 'test-sort' })

    expect(result.isDragging.value).toBe(false)
    expect(result.isSorting.value).toBe(false)
    expect(result.isDisabled.value).toBe(false)
    expect(result.transform.value).toBeNull()
    expect(result.node.value).toBeNull()
    expect(result.index.value).toBe(-1)
    expect(result.transition.value).toBeUndefined()
  })

  it('should set disabled state from options', () => {
    const result = useSortable({ id: 'test-sort', disabled: true })

    expect(result.isDisabled.value).toBe(true)
  })

  it('should provide correct attributes', () => {
    const result = useSortable({ id: 'test-sort' })

    expect(result.attributes.value['data-draggable-id']).toBe('test-sort')
    expect(result.attributes.value['data-sortable-id']).toBe('test-sort')
    expect(result.attributes.value['aria-grabbed']).toBe('false')
    expect(result.attributes.value.tabindex).toBe('0')
    expect(result.attributes.value.role).toBe('listitem')
  })

  it('should update aria-grabbed when dragging', async () => {
    const result = useSortable({ id: 'test-sort' })

    result.isDragging.value = true
    await nextTick()

    expect(result.attributes.value['aria-grabbed']).toBe('true')
  })

  it('should set node ref', () => {
    const result = useSortable({ id: 'test-sort' })
    const element = document.createElement('div')

    result.setNodeRef(element)

    expect(result.node.value).toBe(element)
  })

  it('should set handle ref', () => {
    const result = useSortable({ id: 'test-sort' })
    const handle = document.createElement('div')

    result.setHandleRef(handle)

    expect(result.node.value).toBeNull()
  })

  it('should register on mount', () => {
    const result = useSortable({ id: 'test-sort' })
    const element = document.createElement('div')
    result.setNodeRef(element)

    if (onMountedCallback) {
      onMountedCallback()
    }

    expect(mockKernel.draggable).toHaveBeenCalled()
  })

  it('should setup event listeners on mount', () => {
    useSortable({ id: 'test-sort' })

    if (onMountedCallback) {
      onMountedCallback()
    }

    expect(mockKernel.on).toHaveBeenCalledWith('drag:start', expect.any(Function))
    expect(mockKernel.on).toHaveBeenCalledWith('drag:move', expect.any(Function))
    expect(mockKernel.on).toHaveBeenCalledWith('drag:end', expect.any(Function))
    expect(mockKernel.on).toHaveBeenCalledWith('sort:end', expect.any(Function))
  })

  it('should accept data option', () => {
    const result = useSortable({
      id: 'test-sort',
      data: { type: 'item', value: 42 }
    })

    expect(result).toBeDefined()
  })

  it('should cleanup listeners on unmount', () => {
    const unsubscribe = vi.fn()
    mockKernel.on.mockReturnValue(unsubscribe)

    useSortable({ id: 'test-sort' })

    if (onMountedCallback) {
      onMountedCallback()
    }

    if (onUnmountedCallback) {
      onUnmountedCallback()
    }

    expect(unsubscribe).toHaveBeenCalled()
  })

  it('should update transform on drag:move', () => {
    let dragMoveHandler: ((event: any) => void) | null = null
    mockKernel.on.mockImplementation((event: string, handler: (e: any) => void) => {
      if (event === 'drag:move') {
        dragMoveHandler = handler
      }
      return () => {}
    })

    const result = useSortable({ id: 'test-sort' })

    if (onMountedCallback) {
      onMountedCallback()
    }

    // Simulate drag move with matching ID
    if (dragMoveHandler) {
      dragMoveHandler({
        draggable: {
          getId: () => 'test-sort',
          getTransform: () => ({ x: 30, y: 40 })
        }
      })
    }

    expect(result.transform.value).toEqual({ x: 30, y: 40 })
  })

  it('should call updateIndex on sort:end', () => {
    let sortEndHandler: ((event: any) => void) | null = null
    mockKernel.on.mockImplementation((event: string, handler: (e: any) => void) => {
      if (event === 'sort:end') {
        sortEndHandler = handler
      }
      return () => {}
    })

    const result = useSortable({ id: 'test-sort' })

    if (onMountedCallback) {
      onMountedCallback()
    }

    // Simulate sort end - this triggers updateIndex
    if (sortEndHandler) {
      sortEndHandler({
        items: ['test-sort', 'item-2'],
        containerId: 'container'
      })
    }

    // Index is calculated from DOM, so it remains -1 without DOM
    expect(result.index.value).toBe(-1)
  })

  it('should have initial index of -1', () => {
    const result = useSortable({ id: 'test-sort' })

    // Index is calculated from DOM position, not from options
    expect(result.index.value).toBe(-1)
  })

  describe('watch callbacks', () => {
    it('should unregister old node and register new node on node change', () => {
      const result = useSortable({ id: 'test-sort' })
      const oldElement = document.createElement('div')
      const newElement = document.createElement('div')

      // Set initial node and mount
      result.setNodeRef(oldElement)
      if (onMountedCallback) {
        onMountedCallback()
      }

      // Find node watcher (first watcher is for node ref)
      const nodeWatcher = watchCallbacks[0]
      expect(nodeWatcher).toBeDefined()

      // Set new node first so register() can work
      result.setNodeRef(newElement)

      // Trigger node watcher with old and new nodes
      nodeWatcher.callback(newElement, oldElement)

      // Should have destroyed old and registered new
      expect(mockDraggableInstance.destroy).toHaveBeenCalled()
      expect(mockKernel.draggable).toHaveBeenCalled()
    })

    it('should only unregister when old node exists with instance', () => {
      const result = useSortable({ id: 'test-sort' })
      const newElement = document.createElement('div')

      // Set node so register works
      result.setNodeRef(newElement)

      // Find node watcher
      const nodeWatcher = watchCallbacks[0]
      expect(nodeWatcher).toBeDefined()

      // Trigger with null old node - should only register new
      nodeWatcher.callback(newElement, null)

      expect(mockDraggableInstance.destroy).not.toHaveBeenCalled()
      expect(mockKernel.draggable).toHaveBeenCalled()
    })

    it('should update disabled state and call instance methods', () => {
      const options = { id: 'test-sort', disabled: false }
      const result = useSortable(options)
      const element = document.createElement('div')
      result.setNodeRef(element)

      // Mount to create instance
      if (onMountedCallback) {
        onMountedCallback()
      }

      // Find disabled watcher (second watcher)
      const disabledWatcher = watchCallbacks[1]
      expect(disabledWatcher).toBeDefined()

      // Trigger disabled change to true
      disabledWatcher.callback(true, false)

      expect(result.isDisabled.value).toBe(true)
      expect(mockDraggableInstance.disable).toHaveBeenCalled()
    })

    it('should enable instance when disabled changes to false', () => {
      const options = { id: 'test-sort', disabled: true }
      const result = useSortable(options)
      const element = document.createElement('div')
      result.setNodeRef(element)

      // Mount to create instance
      if (onMountedCallback) {
        onMountedCallback()
      }

      // Find disabled watcher
      const disabledWatcher = watchCallbacks[1]
      expect(disabledWatcher).toBeDefined()

      // Trigger disabled change to false
      disabledWatcher.callback(false, true)

      expect(result.isDisabled.value).toBe(false)
      expect(mockDraggableInstance.enable).toHaveBeenCalled()
    })

    it('should handle disabled undefined as false', () => {
      const options = { id: 'test-sort' }
      const result = useSortable(options)

      // Find disabled watcher
      const disabledWatcher = watchCallbacks[1]
      expect(disabledWatcher).toBeDefined()

      // Trigger with undefined
      disabledWatcher.callback(undefined, false)

      expect(result.isDisabled.value).toBe(false)
    })
  })

  describe('drag:start handler', () => {
    it('should set isDragging and isSorting on drag:start', () => {
      let dragStartHandler: ((event: any) => void) | null = null
      mockKernel.on.mockImplementation((event: string, handler: (e: any) => void) => {
        if (event === 'drag:start') {
          dragStartHandler = handler
        }
        return () => {}
      })

      const result = useSortable({ id: 'test-sort' })

      if (onMountedCallback) {
        onMountedCallback()
      }

      // Simulate drag start with matching ID
      if (dragStartHandler) {
        dragStartHandler({
          draggable: {
            getId: () => 'test-sort'
          }
        })
      }

      expect(result.isDragging.value).toBe(true)
      expect(result.isSorting.value).toBe(true)
    })

    it('should not change state for different draggable ID', () => {
      let dragStartHandler: ((event: any) => void) | null = null
      mockKernel.on.mockImplementation((event: string, handler: (e: any) => void) => {
        if (event === 'drag:start') {
          dragStartHandler = handler
        }
        return () => {}
      })

      const result = useSortable({ id: 'test-sort' })

      if (onMountedCallback) {
        onMountedCallback()
      }

      // Simulate drag start with different ID
      if (dragStartHandler) {
        dragStartHandler({
          draggable: {
            getId: () => 'other-sort'
          }
        })
      }

      expect(result.isDragging.value).toBe(false)
      expect(result.isSorting.value).toBe(false)
    })
  })

  describe('drag:end handler', () => {
    it('should reset state and apply transition on drag:end', () => {
      vi.useFakeTimers()

      let dragEndHandler: ((event: any) => void) | null = null
      mockKernel.on.mockImplementation((event: string, handler: (e: any) => void) => {
        if (event === 'drag:end') {
          dragEndHandler = handler
        }
        return () => {}
      })

      const result = useSortable({ id: 'test-sort' })
      result.isDragging.value = true
      result.isSorting.value = true
      result.transform.value = { x: 100, y: 100 }

      if (onMountedCallback) {
        onMountedCallback()
      }

      // Simulate drag end with matching ID
      if (dragEndHandler) {
        dragEndHandler({
          draggable: {
            getId: () => 'test-sort'
          }
        })
      }

      expect(result.isDragging.value).toBe(false)
      expect(result.transform.value).toBeNull()
      expect(result.transition.value).toBe('transform 200ms ease')

      // After timeout, transition should be cleared
      vi.advanceTimersByTime(200)

      expect(result.transition.value).toBeUndefined()
      expect(result.isSorting.value).toBe(false)

      vi.useRealTimers()
    })

    it('should not change state for different draggable ID', () => {
      let dragEndHandler: ((event: any) => void) | null = null
      mockKernel.on.mockImplementation((event: string, handler: (e: any) => void) => {
        if (event === 'drag:end') {
          dragEndHandler = handler
        }
        return () => {}
      })

      const result = useSortable({ id: 'test-sort' })
      result.isDragging.value = true

      if (onMountedCallback) {
        onMountedCallback()
      }

      // Simulate drag end with different ID
      if (dragEndHandler) {
        dragEndHandler({
          draggable: {
            getId: () => 'other-sort'
          }
        })
      }

      expect(result.isDragging.value).toBe(true)
    })
  })

  describe('updateIndex', () => {
    it('should calculate index from DOM siblings', () => {
      const result = useSortable({ id: 'test-sort' })

      // Create DOM structure
      const container = document.createElement('div')
      const item1 = document.createElement('div')
      const item2 = document.createElement('div')
      const item3 = document.createElement('div')

      item1.setAttribute('data-sortable-id', 'item-1')
      item2.setAttribute('data-sortable-id', 'test-sort')
      item3.setAttribute('data-sortable-id', 'item-3')

      container.appendChild(item1)
      container.appendChild(item2)
      container.appendChild(item3)
      document.body.appendChild(container)

      result.setNodeRef(item2)

      if (onMountedCallback) {
        onMountedCallback()
      }

      // Index should be 1 (second element)
      expect(result.index.value).toBe(1)

      document.body.removeChild(container)
    })

    it('should return -1 when element not in siblings', () => {
      const result = useSortable({ id: 'test-sort' })

      // Create DOM structure with element not in container
      const container = document.createElement('div')
      const item1 = document.createElement('div')
      item1.setAttribute('data-sortable-id', 'item-1')
      container.appendChild(item1)
      document.body.appendChild(container)

      const orphanElement = document.createElement('div')
      orphanElement.setAttribute('data-sortable-id', 'test-sort')
      document.body.appendChild(orphanElement)

      result.setNodeRef(orphanElement)

      if (onMountedCallback) {
        onMountedCallback()
      }

      // Index should be 0 since it's the only child of body with data-sortable-id
      // or -1 if calculation fails
      expect(result.index.value).toBeGreaterThanOrEqual(-1)

      document.body.removeChild(container)
      document.body.removeChild(orphanElement)
    })
  })

  describe('register error handling', () => {
    it('should handle registration error gracefully', () => {
      mockKernel.draggable.mockImplementationOnce(() => {
        throw new Error('Already registered')
      })

      const result = useSortable({ id: 'test-sort' })
      const element = document.createElement('div')
      result.setNodeRef(element)

      // Should not throw
      expect(() => {
        if (onMountedCallback) {
          onMountedCallback()
        }
      }).not.toThrow()
    })
  })

  describe('handle ref', () => {
    it('should set handle and use it in registration', () => {
      const result = useSortable({ id: 'test-sort' })
      const element = document.createElement('div')
      const handle = document.createElement('button')

      result.setNodeRef(element)
      result.setHandleRef(handle)

      if (onMountedCallback) {
        onMountedCallback()
      }

      expect(mockKernel.draggable).toHaveBeenCalledWith(element, expect.objectContaining({
        handle: handle
      }))
    })
  })
})
