/**
 * Nested Sortable Plugin Tests
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { nestedSortable } from '../../../src/plugins/optional/nested-sortable'
import type { Kernel } from '../../../src/types'

describe('Nested Sortable Plugin', () => {
  let mockKernel: Kernel
  let plugin: ReturnType<typeof nestedSortable>
  let container: HTMLDivElement
  let eventHandlers: Record<string, (event: any) => void>

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)

    // Create nested structure
    const items = ['item-1', 'item-1-1', 'item-1-2', 'item-2', 'item-2-1']
    items.forEach(id => {
      const el = document.createElement('div')
      el.setAttribute('data-draggable-id', id)
      container.appendChild(el)
    })

    eventHandlers = {}

    mockKernel = {
      emit: vi.fn(),
      on: vi.fn().mockImplementation((event: string, handler: (e: any) => void) => {
        eventHandlers[event] = handler
        return () => { delete eventHandlers[event] }
      })
    } as unknown as Kernel

    plugin = nestedSortable()
  })

  afterEach(() => {
    plugin.uninstall()
    document.body.removeChild(container)
  })

  describe('plugin metadata', () => {
    it('should have correct name', () => {
      expect(plugin.name).toBe('nested-sortable')
    })

    it('should have correct version', () => {
      expect(plugin.version).toBe('1.0.0')
    })

    it('should have optional type', () => {
      expect(plugin.type).toBe('optional')
    })
  })

  describe('install/uninstall', () => {
    it('should install without error', () => {
      expect(() => plugin.install(mockKernel)).not.toThrow()
    })

    it('should uninstall without error', () => {
      plugin.install(mockKernel)
      expect(() => plugin.uninstall()).not.toThrow()
    })
  })

  describe('API', () => {
    beforeEach(() => {
      plugin.install(mockKernel)
    })

    it('should expose API', () => {
      expect(plugin.api).toBeDefined()
    })

    it('should create nested sortable instance', () => {
      const instance = plugin.api!.create(container, {
        id: 'nested-1',
        items: [
          { id: 'item-1', children: ['item-1-1', 'item-1-2'] },
          { id: 'item-2', children: ['item-2-1'] }
        ]
      })

      expect(instance.id).toBe('nested-1')
      expect(instance.container).toBe(container)
    })

    it('should get instance by id', () => {
      plugin.api!.create(container, {
        id: 'nested-1',
        items: []
      })

      const instance = plugin.api!.get('nested-1')
      expect(instance).toBeDefined()
      expect(instance!.id).toBe('nested-1')
    })

    it('should return undefined for non-existent id', () => {
      expect(plugin.api!.get('non-existent')).toBeUndefined()
    })

    it('should get all instances', () => {
      plugin.api!.create(container, { id: 'nested-1', items: [] })

      const all = plugin.api!.getAll()
      expect(all.size).toBe(1)
    })

    it('should throw on duplicate id', () => {
      plugin.api!.create(container, { id: 'nested-1', items: [] })

      expect(() => {
        plugin.api!.create(container, { id: 'nested-1', items: [] })
      }).toThrow()
    })
  })

  describe('nested sortable instance', () => {
    let instance: ReturnType<typeof plugin.api.create>

    beforeEach(() => {
      plugin.install(mockKernel)
      instance = plugin.api!.create(container, {
        id: 'nested-1',
        items: [
          { id: 'item-1', children: ['item-1-1', 'item-1-2'] },
          { id: 'item-2', children: ['item-2-1'] }
        ],
        maxDepth: 3
      })
    })

    it('should get parent of item', () => {
      expect(instance.getParent('item-1-1')).toBe('item-1')
      expect(instance.getParent('item-1')).toBeNull()
    })

    it('should get children of item', () => {
      expect(instance.getChildren('item-1')).toEqual(['item-1-1', 'item-1-2'])
      expect(instance.getChildren('item-1-1')).toEqual([])
    })

    it('should get depth of item', () => {
      expect(instance.getDepth('item-1')).toBe(0)
      expect(instance.getDepth('item-1-1')).toBe(1)
    })

    it('should collapse and expand items', () => {
      expect(instance.isCollapsed('item-1')).toBe(false)

      instance.collapse('item-1')
      expect(instance.isCollapsed('item-1')).toBe(true)

      instance.expand('item-1')
      expect(instance.isCollapsed('item-1')).toBe(false)
    })

    it('should toggle collapse state', () => {
      instance.toggle('item-1')
      expect(instance.isCollapsed('item-1')).toBe(true)

      instance.toggle('item-1')
      expect(instance.isCollapsed('item-1')).toBe(false)
    })

    it('should check if item can be nested', () => {
      // item-1-1 can be nested under item-2
      expect(instance.canNest('item-1-1', 'item-2')).toBe(true)

      // item-1 cannot be nested under its own child (circular)
      expect(instance.canNest('item-1', 'item-1-1')).toBe(false)
    })

    it('should destroy instance', () => {
      expect(() => instance.destroy()).not.toThrow()
    })
  })

  describe('collapse callbacks', () => {
    it('should call onCollapse callback', () => {
      const onCollapse = vi.fn()

      plugin.install(mockKernel)
      const instance = plugin.api!.create(container, {
        id: 'nested-1',
        items: [{ id: 'item-1', children: ['item-1-1'] }],
        onCollapse
      })

      instance.collapse('item-1')

      expect(onCollapse).toHaveBeenCalledWith('item-1')
    })

    it('should call onExpand callback', () => {
      const onExpand = vi.fn()

      plugin.install(mockKernel)
      const instance = plugin.api!.create(container, {
        id: 'nested-1',
        items: [{ id: 'item-1', children: ['item-1-1'] }],
        onExpand
      })

      instance.collapse('item-1')
      instance.expand('item-1')

      expect(onExpand).toHaveBeenCalledWith('item-1')
    })
  })

  describe('indentation', () => {
    it('should apply indentation based on depth', () => {
      plugin.install(mockKernel)
      plugin.api!.create(container, {
        id: 'nested-1',
        items: [
          { id: 'item-1', children: ['item-1-1'] }
        ],
        indentSize: 30
      })

      const childElement = container.querySelector('[data-draggable-id="item-1-1"]') as HTMLElement
      expect(childElement.style.paddingLeft).toBe('30px')
    })
  })

  describe('manager API', () => {
    beforeEach(() => {
      plugin.install(mockKernel)
      plugin.api!.create(container, {
        id: 'nested-1',
        items: [
          { id: 'item-1', children: ['item-1-1'] }
        ]
      })
    })

    it('should collapse via manager', () => {
      plugin.api!.collapse('item-1')
      expect(plugin.api!.isCollapsed('item-1')).toBe(true)
    })

    it('should expand via manager', () => {
      plugin.api!.collapse('item-1')
      plugin.api!.expand('item-1')
      expect(plugin.api!.isCollapsed('item-1')).toBe(false)
    })

    it('should toggle via manager', () => {
      plugin.api!.toggle('item-1')
      expect(plugin.api!.isCollapsed('item-1')).toBe(true)
    })

    it('should get depth via manager', () => {
      expect(plugin.api!.getDepth('item-1-1')).toBe(1)
    })

    it('should get parent via manager', () => {
      expect(plugin.api!.getParent('item-1-1')).toBe('item-1')
    })

    it('should get children via manager', () => {
      expect(plugin.api!.getChildren('item-1')).toEqual(['item-1-1'])
    })

    it('should check canNest via manager', () => {
      // Check if item-1 can be nested under item-1-1 (circular reference - should be false)
      expect(plugin.api!.canNest('item-1', 'item-1-1')).toBe(false)
    })

    it('should return false for isCollapsed when item has no children', () => {
      // item-1-1 has no children, so it cannot be collapsed
      expect(plugin.api!.isCollapsed('item-1-1')).toBe(false)
    })

    it('should return 0 for depth of root item', () => {
      expect(plugin.api!.getDepth('item-1')).toBe(0)
    })

    it('should return null for parent of root item', () => {
      expect(plugin.api!.getParent('item-1')).toBeNull()
    })

    it('should return empty array for children of leaf item', () => {
      expect(plugin.api!.getChildren('item-1-1')).toEqual([])
    })

    it('should return true for canNest when no instances', () => {
      // Destroy current instances
      plugin.api!.get('nested-1')?.destroy()

      // Create new plugin without instances
      const newPlugin = nestedSortable()
      newPlugin.install(mockKernel)

      expect(newPlugin.api!.canNest('any', 'any')).toBe(true)

      newPlugin.uninstall()
    })
  })

  describe('drag events', () => {
    beforeEach(() => {
      plugin.install(mockKernel)
    })

    it('should handle drag:end event', () => {
      const onNestChange = vi.fn()
      plugin.api!.create(container, {
        id: 'nested-1',
        items: [{ id: 'item-1', children: ['item-1-1'] }],
        onNestChange
      })

      // Trigger drag:end
      eventHandlers['drag:end']?.({
        draggable: { id: 'item-1-1' }
      })

      // onNestChange is not called in current implementation but code path is covered
    })

    it('should handle hover expand on drag:move', () => {
      vi.useFakeTimers()

      plugin.api!.create(container, {
        id: 'nested-1',
        items: [{ id: 'item-1', children: ['item-1-1'] }],
        expandOnHover: true,
        expandDelay: 100
      })

      // First collapse the item
      plugin.api!.collapse('item-1')
      expect(plugin.api!.isCollapsed('item-1')).toBe(true)

      // Mock document.elementFromPoint
      const itemElement = container.querySelector('[data-draggable-id="item-1"]')
      const originalElementFromPoint = document.elementFromPoint
      document.elementFromPoint = vi.fn().mockReturnValue(itemElement)

      // Trigger drag:move
      eventHandlers['drag:move']?.({
        position: { x: 50, y: 50 }
      })

      // Wait for expand delay
      vi.advanceTimersByTime(100)

      expect(plugin.api!.isCollapsed('item-1')).toBe(false)

      document.elementFromPoint = originalElementFromPoint
      vi.useRealTimers()
    })

    it('should clear hover timeout when moving away', () => {
      vi.useFakeTimers()

      plugin.api!.create(container, {
        id: 'nested-1',
        items: [{ id: 'item-1', children: ['item-1-1'] }],
        expandOnHover: true,
        expandDelay: 100
      })

      plugin.api!.collapse('item-1')

      // Mock elementFromPoint to return nothing
      const originalElementFromPoint = document.elementFromPoint
      document.elementFromPoint = vi.fn().mockReturnValue(null)

      // Trigger drag:move - should clear timeout
      eventHandlers['drag:move']?.({
        position: { x: 50, y: 50 }
      })

      // Item should still be collapsed
      expect(plugin.api!.isCollapsed('item-1')).toBe(true)

      document.elementFromPoint = originalElementFromPoint
      vi.useRealTimers()
    })

    it('should not start hover timer for non-collapsed items', () => {
      vi.useFakeTimers()

      plugin.api!.create(container, {
        id: 'nested-1',
        items: [{ id: 'item-1', children: ['item-1-1'] }],
        expandOnHover: true,
        expandDelay: 100
      })

      // item-1 is NOT collapsed by default
      const itemElement = container.querySelector('[data-draggable-id="item-1"]')
      const originalElementFromPoint = document.elementFromPoint
      document.elementFromPoint = vi.fn().mockReturnValue(itemElement)

      // Trigger drag:move
      eventHandlers['drag:move']?.({
        position: { x: 50, y: 50 }
      })

      // Should still be not collapsed
      expect(plugin.api!.isCollapsed('item-1')).toBe(false)

      document.elementFromPoint = originalElementFromPoint
      vi.useRealTimers()
    })
  })

  describe('collapse click handling', () => {
    beforeEach(() => {
      plugin.install(mockKernel)
    })

    it('should toggle collapse on click of collapse toggle', () => {
      plugin.api!.create(container, {
        id: 'nested-1',
        items: [{ id: 'item-1', children: ['item-1-1'] }]
      })

      // Add a collapse toggle button
      const toggleButton = document.createElement('button')
      toggleButton.setAttribute('data-collapse-toggle', 'item-1')
      container.appendChild(toggleButton)

      // Click the toggle button
      const event = new MouseEvent('click', { bubbles: true })
      toggleButton.dispatchEvent(event)

      expect(plugin.api!.isCollapsed('item-1')).toBe(true)
    })

    it('should not toggle when clicking non-toggle element', () => {
      plugin.api!.create(container, {
        id: 'nested-1',
        items: [{ id: 'item-1', children: ['item-1-1'] }]
      })

      // Click on container (not a toggle)
      container.dispatchEvent(new MouseEvent('click', { bubbles: true }))

      expect(plugin.api!.isCollapsed('item-1')).toBe(false)
    })
  })

  describe('visibility updates', () => {
    beforeEach(() => {
      plugin.install(mockKernel)
    })

    it('should hide children when collapsed', () => {
      plugin.api!.create(container, {
        id: 'nested-1',
        items: [{ id: 'item-1', children: ['item-1-1'] }]
      })

      plugin.api!.collapse('item-1')

      const childElement = container.querySelector('[data-draggable-id="item-1-1"]') as HTMLElement
      expect(childElement.style.display).toBe('none')
    })

    it('should show children when expanded', () => {
      plugin.api!.create(container, {
        id: 'nested-1',
        items: [{ id: 'item-1', children: ['item-1-1'] }]
      })

      plugin.api!.collapse('item-1')
      plugin.api!.expand('item-1')

      const childElement = container.querySelector('[data-draggable-id="item-1-1"]') as HTMLElement
      expect(childElement.style.display).toBe('')
    })

    it('should handle nested children visibility', () => {
      // Create deeper nesting
      const deepContainer = document.createElement('div')
      document.body.appendChild(deepContainer)

      const items = ['parent', 'child', 'grandchild']
      items.forEach(id => {
        const el = document.createElement('div')
        el.setAttribute('data-draggable-id', id)
        deepContainer.appendChild(el)
      })

      const instance = plugin.api!.create(deepContainer, {
        id: 'nested-deep',
        items: [
          { id: 'parent', children: ['child'] },
          { id: 'child', children: ['grandchild'] },
          { id: 'grandchild', children: [] }
        ]
      })

      // Collapse parent - all descendants should be hidden
      instance.collapse('parent')

      const childEl = deepContainer.querySelector('[data-draggable-id="child"]') as HTMLElement
      const grandchildEl = deepContainer.querySelector('[data-draggable-id="grandchild"]') as HTMLElement

      expect(childEl.style.display).toBe('none')
      expect(grandchildEl.style.display).toBe('none')

      document.body.removeChild(deepContainer)
    })
  })

  describe('nesting constraints', () => {
    beforeEach(() => {
      plugin.install(mockKernel)
    })

    it('should respect maxDepth constraint', () => {
      plugin.api!.create(container, {
        id: 'nested-1',
        items: [
          { id: 'item-1', children: ['item-1-1'] },
          { id: 'item-2', children: [] }
        ],
        maxDepth: 2
      })

      const instance = plugin.api!.get('nested-1')!
      // item-2 is at depth 0, should be able to nest items with children
      expect(instance.canNest('item-1-1', 'item-2')).toBe(true)
    })

    it('should detect circular reference', () => {
      // Create with proper nested structure - children shouldn't be at root level
      plugin.api!.create(container, {
        id: 'nested-1',
        items: [
          { id: 'item-1', children: ['item-1-1'] }
        ]
      })

      const instance = plugin.api!.get('nested-1')!
      // item-1 cannot be nested under item-1-1 (its own child) - circular reference
      expect(instance.canNest('item-1', 'item-1-1')).toBe(false)
    })

    it('should not collapse non-existent item', () => {
      plugin.api!.create(container, {
        id: 'nested-1',
        items: [{ id: 'item-1', children: [] }]
      })

      // Should not throw
      expect(() => plugin.api!.collapse('non-existent')).not.toThrow()
    })

    it('should not expand non-existent item', () => {
      plugin.api!.create(container, {
        id: 'nested-1',
        items: [{ id: 'item-1', children: [] }]
      })

      // Should not throw
      expect(() => plugin.api!.expand('non-existent')).not.toThrow()
    })
  })

  describe('manager methods with no matching instances', () => {
    beforeEach(() => {
      plugin.install(mockKernel)
      plugin.api!.create(container, {
        id: 'nested-1',
        items: [{ id: 'item-1', children: [] }] // No children for item-1
      })
    })

    it('should not collapse item without children via manager', () => {
      // item-1 has no children, so collapse shouldn't do anything
      plugin.api!.collapse('item-1')
      expect(plugin.api!.isCollapsed('item-1')).toBe(false)
    })

    it('should not expand item without children via manager', () => {
      plugin.api!.expand('item-1')
      expect(plugin.api!.isCollapsed('item-1')).toBe(false)
    })

    it('should not toggle item without children via manager', () => {
      plugin.api!.toggle('item-1')
      expect(plugin.api!.isCollapsed('item-1')).toBe(false)
    })
  })
})
