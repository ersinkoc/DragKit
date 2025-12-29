/**
 * Sortable Engine Plugin Tests
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { sortableEnginePlugin } from '../../src/plugins/core/sortable-engine'
import type { Kernel, SortableOptions, SortableGridOptions } from '../../src/types'

describe('Sortable Engine Plugin', () => {
  let mockKernel: Kernel
  let api: any
  let container: HTMLDivElement

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)

    mockKernel = {
      isDragging: vi.fn().mockReturnValue(false),
      emit: vi.fn()
    } as unknown as Kernel

    sortableEnginePlugin.install(mockKernel)
    api = sortableEnginePlugin.api
  })

  afterEach(() => {
    document.body.removeChild(container)
  })

  describe('plugin metadata', () => {
    it('should have correct name', () => {
      expect(sortableEnginePlugin.name).toBe('sortable-engine')
    })

    it('should have correct version', () => {
      expect(sortableEnginePlugin.version).toBe('1.0.0')
    })

    it('should have core type', () => {
      expect(sortableEnginePlugin.type).toBe('core')
    })
  })

  describe('createSortable', () => {
    it('should create sortable instance', () => {
      const options: SortableOptions = {
        id: 'sortable-1',
        items: ['item-1', 'item-2', 'item-3']
      }

      const instance = api.createSortable(container, options)

      expect(instance.id).toBe('sortable-1')
      expect(instance.container).toBe(container)
      expect(container.getAttribute('data-sortable-id')).toBe('sortable-1')
    })

    it('should register sortable in engine', () => {
      const options: SortableOptions = {
        id: 'sortable-1',
        items: ['item-1', 'item-2']
      }

      api.createSortable(container, options)
      const retrieved = api.get('sortable-1')

      expect(retrieved).toBeDefined()
      expect(retrieved.id).toBe('sortable-1')
    })
  })

  describe('createSortableGrid', () => {
    it('should create sortable grid instance', () => {
      const options: SortableGridOptions = {
        id: 'grid-1',
        items: ['item-1', 'item-2', 'item-3', 'item-4'],
        columns: 2
      }

      const instance = api.createSortableGrid(container, options)

      expect(instance.id).toBe('grid-1')
      expect(instance.getColumns()).toBe(2)
    })

    it('should calculate item position in grid', () => {
      const options: SortableGridOptions = {
        id: 'grid-1',
        items: ['item-0', 'item-1', 'item-2', 'item-3', 'item-4', 'item-5'],
        columns: 3
      }

      const instance = api.createSortableGrid(container, options)

      expect(instance.getItemPosition('item-0')).toEqual({ row: 0, column: 0 })
      expect(instance.getItemPosition('item-1')).toEqual({ row: 0, column: 1 })
      expect(instance.getItemPosition('item-2')).toEqual({ row: 0, column: 2 })
      expect(instance.getItemPosition('item-3')).toEqual({ row: 1, column: 0 })
      expect(instance.getItemPosition('item-4')).toEqual({ row: 1, column: 1 })
      expect(instance.getItemPosition('item-5')).toEqual({ row: 1, column: 2 })
    })

    it('should return null for non-existent item', () => {
      const options: SortableGridOptions = {
        id: 'grid-1',
        items: ['item-1'],
        columns: 2
      }

      const instance = api.createSortableGrid(container, options)
      expect(instance.getItemPosition('non-existent')).toBeNull()
    })

    it('should update columns', () => {
      const options: SortableGridOptions = {
        id: 'grid-1',
        items: ['item-1'],
        columns: 2
      }

      const instance = api.createSortableGrid(container, options)
      instance.setColumns(4)

      expect(instance.getColumns()).toBe(4)
    })
  })

  describe('SortableInstance', () => {
    let instance: any

    beforeEach(() => {
      const options: SortableOptions = {
        id: 'sortable-1',
        items: ['item-1', 'item-2', 'item-3']
      }
      instance = api.createSortable(container, options)
    })

    it('should get items', () => {
      expect(instance.getItems()).toEqual(['item-1', 'item-2', 'item-3'])
    })

    it('should set items', () => {
      instance.setItems(['a', 'b', 'c'])
      expect(instance.getItems()).toEqual(['a', 'b', 'c'])
    })

    it('should add item at end', () => {
      instance.addItem('item-4')
      expect(instance.getItems()).toEqual(['item-1', 'item-2', 'item-3', 'item-4'])
    })

    it('should add item at specific index', () => {
      instance.addItem('item-0', 0)
      expect(instance.getItems()).toEqual(['item-0', 'item-1', 'item-2', 'item-3'])
    })

    it('should remove item', () => {
      instance.removeItem('item-2')
      expect(instance.getItems()).toEqual(['item-1', 'item-3'])
    })

    it('should not fail when removing non-existent item', () => {
      instance.removeItem('non-existent')
      expect(instance.getItems()).toEqual(['item-1', 'item-2', 'item-3'])
    })

    it('should move item', () => {
      instance.moveItem(0, 2)
      expect(instance.getItems()).toEqual(['item-2', 'item-3', 'item-1'])
    })

    it('should check isDragging', () => {
      expect(instance.isDragging()).toBe(false)
      ;(mockKernel.isDragging as ReturnType<typeof vi.fn>).mockReturnValue(true)
      expect(instance.isDragging()).toBe(true)
    })

    it('should enable/disable', () => {
      expect(instance.options.disabled).toBeFalsy()

      instance.disable()
      expect(instance.options.disabled).toBe(true)

      instance.enable()
      expect(instance.options.disabled).toBe(false)
    })

    it('should destroy and remove data attribute', () => {
      instance.destroy()
      expect(container.hasAttribute('data-sortable-id')).toBe(false)
    })

    it('should get item elements', () => {
      // Add mock item elements
      const itemEl1 = document.createElement('div')
      itemEl1.setAttribute('data-item-id', 'item-1')
      container.appendChild(itemEl1)

      const itemEl2 = document.createElement('div')
      itemEl2.setAttribute('data-item-id', 'item-2')
      container.appendChild(itemEl2)

      const elements = instance.getItemElements()
      expect(elements).toHaveLength(2)
      expect(elements[0]).toBe(itemEl1)
      expect(elements[1]).toBe(itemEl2)
    })

    it('should filter out non-existent item elements', () => {
      // Only add one item element
      const itemEl1 = document.createElement('div')
      itemEl1.setAttribute('data-item-id', 'item-1')
      container.appendChild(itemEl1)

      const elements = instance.getItemElements()
      // Should only return 1 element since item-2 and item-3 don't have DOM elements
      expect(elements).toHaveLength(1)
    })
  })

  describe('get / getAll', () => {
    it('should get sortable by id', () => {
      const options: SortableOptions = {
        id: 'sortable-1',
        items: []
      }
      api.createSortable(container, options)

      const retrieved = api.get('sortable-1')
      expect(retrieved).toBeDefined()
      expect(retrieved.id).toBe('sortable-1')
    })

    it('should return undefined for non-existent id', () => {
      expect(api.get('non-existent')).toBeUndefined()
    })

    it('should get all sortables', () => {
      const container2 = document.createElement('div')
      document.body.appendChild(container2)

      api.createSortable(container, { id: 'sort-1', items: [] })
      api.createSortable(container2, { id: 'sort-2', items: [] })

      const all = api.getAll()
      expect(all.size).toBe(2)
      expect(all.has('sort-1')).toBe(true)
      expect(all.has('sort-2')).toBe(true)

      document.body.removeChild(container2)
    })
  })

  describe('uninstall', () => {
    it('should not throw on uninstall', () => {
      expect(() => sortableEnginePlugin.uninstall()).not.toThrow()
    })
  })
})
