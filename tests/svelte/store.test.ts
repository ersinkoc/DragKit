/**
 * Svelte Store Tests
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'

// Use vi.hoisted to define mocks before they are hoisted
const { mockKernel, mockWritable } = vi.hoisted(() => {
  const kernel = {
    on: vi.fn().mockReturnValue(() => {}),
    emit: vi.fn(),
    draggable: vi.fn(),
    droppable: vi.fn(),
    destroy: vi.fn(),
    getActiveDraggable: vi.fn().mockReturnValue(null),
    detectCollision: vi.fn().mockReturnValue(null)
  }

  const createWritable = (initial: any) => {
    let value = initial
    const subscribers: ((v: any) => void)[] = []
    return {
      subscribe: (fn: (v: any) => void) => {
        subscribers.push(fn)
        fn(value)
        return () => {
          const idx = subscribers.indexOf(fn)
          if (idx > -1) subscribers.splice(idx, 1)
        }
      },
      update: (fn: (v: any) => any) => {
        value = fn(value)
        subscribers.forEach(s => s(value))
      },
      set: (v: any) => {
        value = v
        subscribers.forEach(s => s(value))
      }
    }
  }

  return { mockKernel: kernel, mockWritable: createWritable }
})

vi.mock('svelte/store', () => ({
  writable: vi.fn(mockWritable)
}))

vi.mock('../../src/kernel', () => ({
  createDragKit: vi.fn().mockResolvedValue(mockKernel)
}))

import { createDragKitStore, getDragKitStore } from '../../src/adapters/svelte/store'

describe('Svelte Store', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('createDragKitStore', () => {
    it('should create a store', () => {
      const store = createDragKitStore()
      expect(store).toBeDefined()
      expect(store.subscribe).toBeDefined()
      expect(store.getKernel).toBeDefined()
      expect(store.destroy).toBeDefined()
    })

    it('should subscribe to store updates', () => {
      const store = createDragKitStore()
      const subscriber = vi.fn()

      const unsubscribe = store.subscribe(subscriber)

      expect(subscriber).toHaveBeenCalled()
      expect(typeof unsubscribe).toBe('function')

      unsubscribe()
    })

    it('should have initial state', () => {
      const store = createDragKitStore()
      let state: any = null

      store.subscribe(s => { state = s })

      expect(state.isDragging).toBe(false)
      expect(state.activeId).toBeNull()
      expect(state.activeDraggable).toBeNull()
      expect(state.activeDroppable).toBeNull()
      expect(state.overDroppableId).toBeNull()
    })

    it('should accept options', () => {
      const store = createDragKitStore({ plugins: [] })
      expect(store).toBeDefined()
    })

    it('should return kernel via getKernel', async () => {
      const store = createDragKitStore()
      await new Promise(resolve => setTimeout(resolve, 0))

      const kernel = store.getKernel()
      expect(kernel === null || kernel === mockKernel).toBe(true)
    })

    it('should destroy store', () => {
      const store = createDragKitStore()
      expect(() => store.destroy()).not.toThrow()
    })
  })

  describe('getDragKitStore', () => {
    it('should return the global store', () => {
      createDragKitStore()
      const store = getDragKitStore()
      expect(store).not.toBeNull()
    })
  })

  describe('event handlers', () => {
    it('should update state on drag:start', async () => {
      let dragStartHandler: ((event: any) => void) | null = null
      mockKernel.on.mockImplementation((event: string, handler: (e: any) => void) => {
        if (event === 'drag:start') {
          dragStartHandler = handler
        }
        return () => {}
      })

      const store = createDragKitStore()
      await new Promise(resolve => setTimeout(resolve, 10))

      // Simulate drag start
      if (dragStartHandler) {
        dragStartHandler({
          draggable: { getId: () => 'test-drag' }
        })
      }

      let currentState: any
      store.subscribe(state => {
        currentState = state
      })

      expect(currentState.isDragging).toBe(true)
      expect(currentState.activeId).toBe('test-drag')
    })

    it('should update state on drag:move with collision', async () => {
      let dragMoveHandler: (() => void) | null = null
      const mockDroppable = { getId: () => 'drop-1' }
      mockKernel.on.mockImplementation((event: string, handler: (e: any) => void) => {
        if (event === 'drag:move') {
          dragMoveHandler = handler
        }
        return () => {}
      })
      mockKernel.getActiveDraggable.mockReturnValue({ getId: () => 'drag-1' })
      mockKernel.detectCollision.mockReturnValue(mockDroppable)

      const store = createDragKitStore()
      await new Promise(resolve => setTimeout(resolve, 10))

      // Simulate drag move
      if (dragMoveHandler) {
        dragMoveHandler()
      }

      let currentState: any
      store.subscribe(state => {
        currentState = state
      })

      expect(currentState.overDroppableId).toBe('drop-1')
    })

    it('should reset state on drag:end', async () => {
      let dragEndHandler: (() => void) | null = null
      mockKernel.on.mockImplementation((event: string, handler: (e: any) => void) => {
        if (event === 'drag:end') {
          dragEndHandler = handler
        }
        return () => {}
      })

      const store = createDragKitStore()
      await new Promise(resolve => setTimeout(resolve, 10))

      // Simulate drag end
      if (dragEndHandler) {
        dragEndHandler()
      }

      let currentState: any
      store.subscribe(state => {
        currentState = state
      })

      expect(currentState.isDragging).toBe(false)
      expect(currentState.activeId).toBeNull()
    })

    it('should reset state on drag:cancel', async () => {
      let dragCancelHandler: (() => void) | null = null
      mockKernel.on.mockImplementation((event: string, handler: (e: any) => void) => {
        if (event === 'drag:cancel') {
          dragCancelHandler = handler
        }
        return () => {}
      })

      const store = createDragKitStore()
      await new Promise(resolve => setTimeout(resolve, 10))

      // Simulate drag cancel
      if (dragCancelHandler) {
        dragCancelHandler()
      }

      let currentState: any
      store.subscribe(state => {
        currentState = state
      })

      expect(currentState.isDragging).toBe(false)
      expect(currentState.activeId).toBeNull()
    })
  })
})
