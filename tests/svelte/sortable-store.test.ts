/**
 * Svelte Sortable Store Tests
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'

// Mock svelte/store
vi.mock('svelte/store', () => ({
  writable: vi.fn((initial) => {
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
  })
}))

// Mock getDragKitStore
const mockDraggableInstance = {
  enable: vi.fn(),
  disable: vi.fn(),
  destroy: vi.fn()
}

const mockKernel = {
  draggable: vi.fn().mockReturnValue(mockDraggableInstance)
}

vi.mock('../../src/adapters/svelte/store', () => ({
  getDragKitStore: vi.fn().mockReturnValue({
    getKernel: () => mockKernel,
    subscribe: vi.fn()
  })
}))

import { createSortableStore, sortableItem } from '../../src/adapters/svelte/sortable-store'

describe('Svelte Sortable Store', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('createSortableStore', () => {
    it('should create a sortable store', () => {
      const store = createSortableStore({
        id: 'list',
        items: ['item-1', 'item-2', 'item-3']
      })

      expect(store).toBeDefined()
      expect(store.subscribe).toBeDefined()
      expect(store.setItems).toBeDefined()
      expect(store.moveItem).toBeDefined()
      expect(store.addItem).toBeDefined()
      expect(store.removeItem).toBeDefined()
      expect(store.destroy).toBeDefined()
    })

    it('should have initial items', () => {
      const store = createSortableStore({
        id: 'list',
        items: ['item-1', 'item-2']
      })

      let state: any = null
      store.subscribe(s => { state = s })

      expect(state.items).toEqual(['item-1', 'item-2'])
      expect(state.activeId).toBeNull()
      expect(state.overIndex).toBeNull()
      expect(state.isDragging).toBe(false)
    })

    it('should set items', () => {
      const store = createSortableStore({
        id: 'list',
        items: ['item-1']
      })

      let state: any = null
      store.subscribe(s => { state = s })

      store.setItems(['a', 'b', 'c'])

      expect(state.items).toEqual(['a', 'b', 'c'])
    })

    it('should move item', () => {
      const store = createSortableStore({
        id: 'list',
        items: ['item-1', 'item-2', 'item-3']
      })

      let state: any = null
      store.subscribe(s => { state = s })

      store.moveItem(0, 2)

      expect(state.items).toEqual(['item-2', 'item-3', 'item-1'])
    })

    it('should add item at end', () => {
      const store = createSortableStore({
        id: 'list',
        items: ['item-1']
      })

      let state: any = null
      store.subscribe(s => { state = s })

      store.addItem('item-2')

      expect(state.items).toEqual(['item-1', 'item-2'])
    })

    it('should add item at specific index', () => {
      const store = createSortableStore({
        id: 'list',
        items: ['item-1', 'item-3']
      })

      let state: any = null
      store.subscribe(s => { state = s })

      store.addItem('item-2', 1)

      expect(state.items).toEqual(['item-1', 'item-2', 'item-3'])
    })

    it('should remove item', () => {
      const store = createSortableStore({
        id: 'list',
        items: ['item-1', 'item-2', 'item-3']
      })

      let state: any = null
      store.subscribe(s => { state = s })

      store.removeItem('item-2')

      expect(state.items).toEqual(['item-1', 'item-3'])
    })

    it('should destroy store', () => {
      const store = createSortableStore({
        id: 'list',
        items: []
      })

      expect(() => store.destroy()).not.toThrow()
    })
  })

  describe('sortableItem', () => {
    let node: HTMLElement

    beforeEach(() => {
      node = document.createElement('div')
    })

    it('should return action object', () => {
      const action = sortableItem(node, { id: 'item-1' })

      expect(action).toBeDefined()
      expect(action.update).toBeDefined()
      expect(action.destroy).toBeDefined()
    })

    it('should register draggable on init', () => {
      sortableItem(node, { id: 'item-1' })

      expect(mockKernel.draggable).toHaveBeenCalledWith(node, expect.objectContaining({
        id: 'item-1',
        data: { sortable: true }
      }))
    })

    it('should set data attribute', () => {
      sortableItem(node, { id: 'item-1' })

      expect(node.getAttribute('data-sortable-id')).toBe('item-1')
    })

    it('should update disabled state', () => {
      const action = sortableItem(node, { id: 'item-1', disabled: false })

      action.update({ id: 'item-1', disabled: true })

      expect(mockDraggableInstance.disable).toHaveBeenCalled()
    })

    it('should re-register on id change', () => {
      const action = sortableItem(node, { id: 'item-1' })

      action.update({ id: 'item-2' })

      expect(mockDraggableInstance.destroy).toHaveBeenCalled()
      expect(mockKernel.draggable).toHaveBeenCalledTimes(2)
    })

    it('should remove data attribute on destroy', () => {
      const action = sortableItem(node, { id: 'item-1' })

      action.destroy()

      expect(node.getAttribute('data-sortable-id')).toBeNull()
    })
  })
})
