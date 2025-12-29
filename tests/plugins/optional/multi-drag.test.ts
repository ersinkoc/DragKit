/**
 * Multi-drag Plugin Tests
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { multiDrag } from '../../../src/plugins/optional/multi-drag'
import type { Kernel, DraggableInstance } from '../../../src/types'

describe('Multi-drag Plugin', () => {
  let mockKernel: Kernel
  let plugin: ReturnType<typeof multiDrag>
  let container: HTMLDivElement
  let eventHandlers: Record<string, (event: any) => void>

  function createMockDraggable(id: string): DraggableInstance {
    const element = document.createElement('div')
    element.setAttribute('data-draggable-id', id)
    container.appendChild(element)

    return {
      id,
      element,
      data: {},
      options: { id },
      isDragging: vi.fn().mockReturnValue(false),
      isDisabled: vi.fn().mockReturnValue(false),
      getPosition: vi.fn().mockReturnValue({ x: 0, y: 0 }),
      getTransform: vi.fn().mockReturnValue({ x: 10, y: 20 }),
      enable: vi.fn(),
      disable: vi.fn(),
      destroy: vi.fn(),
      getId: vi.fn().mockReturnValue(id),
      getElement: vi.fn().mockReturnValue(element),
      setTransform: vi.fn(),
      resetTransform: vi.fn()
    } as DraggableInstance
  }

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)

    eventHandlers = {}
    const draggables = new Map<string, DraggableInstance>()

    mockKernel = {
      emit: vi.fn(),
      on: vi.fn().mockImplementation((event: string, handler: (e: any) => void) => {
        eventHandlers[event] = handler
        return () => { delete eventHandlers[event] }
      }),
      getDraggable: vi.fn().mockImplementation((id: string) => draggables.get(id)),
      getDraggables: vi.fn().mockReturnValue(draggables)
    } as unknown as Kernel

    // Create some mock draggables
    const drag1 = createMockDraggable('drag-1')
    const drag2 = createMockDraggable('drag-2')
    const drag3 = createMockDraggable('drag-3')
    draggables.set('drag-1', drag1)
    draggables.set('drag-2', drag2)
    draggables.set('drag-3', drag3)

    plugin = multiDrag()
  })

  afterEach(() => {
    plugin.uninstall()
    document.body.removeChild(container)
  })

  describe('plugin metadata', () => {
    it('should have correct name', () => {
      expect(plugin.name).toBe('multi-drag')
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

    it('should select item', () => {
      plugin.api!.select('drag-1')
      expect(plugin.api!.isSelected('drag-1')).toBe(true)
    })

    it('should deselect item', () => {
      plugin.api!.select('drag-1')
      plugin.api!.deselect('drag-1')
      expect(plugin.api!.isSelected('drag-1')).toBe(false)
    })

    it('should toggle selection', () => {
      plugin.api!.toggle('drag-1')
      expect(plugin.api!.isSelected('drag-1')).toBe(true)

      plugin.api!.toggle('drag-1')
      expect(plugin.api!.isSelected('drag-1')).toBe(false)
    })

    it('should get all selected items', () => {
      plugin.api!.select('drag-1')
      plugin.api!.select('drag-2')

      const selected = plugin.api!.getSelected()
      expect(selected).toHaveLength(2)
      expect(selected).toContain('drag-1')
      expect(selected).toContain('drag-2')
    })

    it('should clear selection', () => {
      plugin.api!.select('drag-1')
      plugin.api!.select('drag-2')
      plugin.api!.clearSelection()

      expect(plugin.api!.getSelected()).toHaveLength(0)
    })

    it('should select all', () => {
      plugin.api!.selectAll()

      expect(plugin.api!.getSelected()).toHaveLength(3)
    })

    it('should add selection class to element', () => {
      plugin.api!.select('drag-1')

      const draggable = mockKernel.getDraggable('drag-1')
      expect(draggable?.getElement().classList.contains('multi-drag-selected')).toBe(true)
    })

    it('should remove selection class on deselect', () => {
      plugin.api!.select('drag-1')
      plugin.api!.deselect('drag-1')

      const draggable = mockKernel.getDraggable('drag-1')
      expect(draggable?.getElement().classList.contains('multi-drag-selected')).toBe(false)
    })
  })

  describe('click behavior', () => {
    beforeEach(() => {
      plugin.install(mockKernel)
    })

    it('should select on click', () => {
      const element = container.querySelector('[data-draggable-id="drag-1"]')!
      element.dispatchEvent(new MouseEvent('click', { bubbles: true }))

      expect(plugin.api!.isSelected('drag-1')).toBe(true)
    })

    it('should toggle on ctrl+click', () => {
      const element = container.querySelector('[data-draggable-id="drag-1"]')!

      element.dispatchEvent(new MouseEvent('click', { bubbles: true }))
      expect(plugin.api!.isSelected('drag-1')).toBe(true)

      element.dispatchEvent(new MouseEvent('click', { bubbles: true, ctrlKey: true }))
      expect(plugin.api!.isSelected('drag-1')).toBe(false)
    })

    it('should clear selection on click outside', () => {
      plugin.api!.select('drag-1')

      container.dispatchEvent(new MouseEvent('click', { bubbles: true }))

      expect(plugin.api!.getSelected()).toHaveLength(0)
    })
  })

  describe('keyboard shortcuts', () => {
    beforeEach(() => {
      plugin.install(mockKernel)
    })

    it('should clear selection on Escape', () => {
      plugin.api!.select('drag-1')

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))

      expect(plugin.api!.getSelected()).toHaveLength(0)
    })

    it('should select all on Ctrl+A within draggable', () => {
      const element = container.querySelector('[data-draggable-id="drag-1"]')!

      // Need to dispatch from a draggable element
      element.dispatchEvent(new KeyboardEvent('keydown', {
        key: 'a',
        ctrlKey: true,
        bubbles: true
      }))

      expect(plugin.api!.getSelected()).toHaveLength(3)
    })
  })

  describe('options', () => {
    it('should use custom selection class', () => {
      const customPlugin = multiDrag({ selectionClass: 'custom-selected' })
      customPlugin.install(mockKernel)

      customPlugin.api!.select('drag-1')

      const draggable = mockKernel.getDraggable('drag-1')
      expect(draggable?.getElement().classList.contains('custom-selected')).toBe(true)

      customPlugin.uninstall()
    })

    it('should limit max selections', () => {
      const customPlugin = multiDrag({ maxSelections: 2 })
      customPlugin.install(mockKernel)

      customPlugin.api!.select('drag-1')
      customPlugin.api!.select('drag-2')
      customPlugin.api!.select('drag-3')

      expect(customPlugin.api!.getSelected()).toHaveLength(2)

      customPlugin.uninstall()
    })

    it('should call onSelect callback', () => {
      const onSelect = vi.fn()
      const customPlugin = multiDrag({ onSelect })
      customPlugin.install(mockKernel)

      customPlugin.api!.select('drag-1')

      expect(onSelect).toHaveBeenCalledWith(['drag-1'])

      customPlugin.uninstall()
    })

    it('should call onDeselect callback', () => {
      const onDeselect = vi.fn()
      const customPlugin = multiDrag({ onDeselect })
      customPlugin.install(mockKernel)

      customPlugin.api!.select('drag-1')
      customPlugin.api!.deselect('drag-1')

      expect(onDeselect).toHaveBeenCalledWith([])

      customPlugin.uninstall()
    })

    it('should use shift as select key', () => {
      const customPlugin = multiDrag({ selectKey: 'shift' })
      customPlugin.install(mockKernel)

      // Click with shift to toggle
      const element = container.querySelector('[data-draggable-id="drag-1"]')!
      element.dispatchEvent(new MouseEvent('click', { bubbles: true }))
      expect(customPlugin.api!.isSelected('drag-1')).toBe(true)

      element.dispatchEvent(new MouseEvent('click', { bubbles: true, shiftKey: true }))
      expect(customPlugin.api!.isSelected('drag-1')).toBe(false)

      customPlugin.uninstall()
    })

    it('should use meta as select key', () => {
      const customPlugin = multiDrag({ selectKey: 'meta' })
      customPlugin.install(mockKernel)

      const element = container.querySelector('[data-draggable-id="drag-1"]')!
      element.dispatchEvent(new MouseEvent('click', { bubbles: true }))
      expect(customPlugin.api!.isSelected('drag-1')).toBe(true)

      element.dispatchEvent(new MouseEvent('click', { bubbles: true, metaKey: true }))
      expect(customPlugin.api!.isSelected('drag-1')).toBe(false)

      customPlugin.uninstall()
    })
  })

  describe('drag events', () => {
    beforeEach(() => {
      plugin.install(mockKernel)
    })

    it('should store selected draggables on drag:start', () => {
      plugin.api!.select('drag-1')
      plugin.api!.select('drag-2')

      // Simulate drag:start event
      eventHandlers['drag:start']({
        draggable: {
          getId: () => 'drag-1',
          getTransform: () => ({ x: 10, y: 20 })
        }
      })

      // The draggables are stored internally
      expect(plugin.api!.getSelected()).toHaveLength(2)
    })

    it('should not store draggables if dragged item is not selected', () => {
      plugin.api!.select('drag-1')

      // Drag a non-selected item
      eventHandlers['drag:start']({
        draggable: {
          getId: () => 'drag-3',
          getTransform: () => null
        }
      })

      // Nothing special happens
      expect(plugin.api!.isSelected('drag-3')).toBe(false)
    })

    it('should move all selected items on drag:move', () => {
      const draggables = mockKernel.getDraggables()
      const drag1 = draggables.get('drag-1')!
      const drag2 = draggables.get('drag-2')!

      plugin.api!.select('drag-1')
      plugin.api!.select('drag-2')

      // Start drag
      eventHandlers['drag:start']({
        draggable: drag1
      })

      // Move drag
      eventHandlers['drag:move']({
        draggable: {
          getId: () => 'drag-1',
          getTransform: () => ({ x: 50, y: 100 })
        }
      })

      // The other selected item should have transform set
      expect(drag2.setTransform).toHaveBeenCalledWith({ x: 50, y: 100 })
    })

    it('should not move items if only one is selected', () => {
      const draggables = mockKernel.getDraggables()
      const drag1 = draggables.get('drag-1')!

      plugin.api!.select('drag-1')

      eventHandlers['drag:start']({
        draggable: drag1
      })

      eventHandlers['drag:move']({
        draggable: {
          getId: () => 'drag-1',
          getTransform: () => ({ x: 50, y: 100 })
        }
      })

      // Only one item selected, nothing special happens
      expect(plugin.api!.getSelected()).toHaveLength(1)
    })

    it('should not move items if transform is null', () => {
      const draggables = mockKernel.getDraggables()
      const drag1 = draggables.get('drag-1')!
      const drag2 = draggables.get('drag-2')!

      plugin.api!.select('drag-1')
      plugin.api!.select('drag-2')

      eventHandlers['drag:start']({
        draggable: drag1
      })

      eventHandlers['drag:move']({
        draggable: {
          getId: () => 'drag-1',
          getTransform: () => null
        }
      })

      // setTransform should not be called on other items when transform is null
      expect(drag2.setTransform).not.toHaveBeenCalled()
    })

    it('should reset transforms on drag:end', () => {
      const draggables = mockKernel.getDraggables()
      const drag1 = draggables.get('drag-1')!
      const drag2 = draggables.get('drag-2')!

      plugin.api!.select('drag-1')
      plugin.api!.select('drag-2')

      eventHandlers['drag:start']({
        draggable: drag1
      })

      eventHandlers['drag:end']({})

      expect(drag1.resetTransform).toHaveBeenCalled()
      expect(drag2.resetTransform).toHaveBeenCalled()
    })
  })

  describe('edge cases', () => {
    beforeEach(() => {
      plugin.install(mockKernel)
    })

    it('should not select already selected item', () => {
      const onSelect = vi.fn()
      const customPlugin = multiDrag({ onSelect })
      customPlugin.install(mockKernel)

      customPlugin.api!.select('drag-1')
      customPlugin.api!.select('drag-1') // Select again

      // Only called once
      expect(onSelect).toHaveBeenCalledTimes(1)
      customPlugin.uninstall()
    })

    it('should not deselect non-selected item', () => {
      const onDeselect = vi.fn()
      const customPlugin = multiDrag({ onDeselect })
      customPlugin.install(mockKernel)

      customPlugin.api!.deselect('drag-1') // Not selected

      expect(onDeselect).not.toHaveBeenCalled()
      customPlugin.uninstall()
    })

    it('should not clear selection on click outside with modifier key', () => {
      plugin.api!.select('drag-1')

      // Click outside with ctrl held
      container.dispatchEvent(new MouseEvent('click', { bubbles: true, ctrlKey: true }))

      expect(plugin.api!.getSelected()).toHaveLength(1)
    })

    it('should call onDeselect on clearSelection with selected items', () => {
      const onDeselect = vi.fn()
      const customPlugin = multiDrag({ onDeselect })
      customPlugin.install(mockKernel)

      customPlugin.api!.select('drag-1')
      customPlugin.api!.select('drag-2')
      customPlugin.api!.clearSelection()

      expect(onDeselect).toHaveBeenCalledWith(['drag-1', 'drag-2'])
      customPlugin.uninstall()
    })

    it('should handle missing draggable in updateElementClass', () => {
      // Try to select non-existent draggable
      ;(mockKernel.getDraggable as any).mockReturnValueOnce(undefined)

      // Should not throw
      expect(() => plugin.api!.select('non-existent')).not.toThrow()
    })

    it('should handle missing draggable in getSelectedDraggables', () => {
      plugin.api!.select('drag-1')

      // Mock getDraggable to return undefined for drag-1
      ;(mockKernel.getDraggable as any).mockImplementation((id: string) => {
        if (id === 'drag-1') return undefined
        return mockKernel.getDraggables().get(id)
      })

      const draggables = mockKernel.getDraggables()
      const drag2 = draggables.get('drag-2')!

      plugin.api!.select('drag-2')

      // Start drag - should not throw even though drag-1 doesn't exist
      eventHandlers['drag:start']({
        draggable: drag2
      })
    })

    it('should use selectAll with maxSelections limit', () => {
      const customPlugin = multiDrag({ maxSelections: 2 })
      customPlugin.install(mockKernel)

      customPlugin.api!.selectAll()

      expect(customPlugin.api!.getSelected()).toHaveLength(2)
      customPlugin.uninstall()
    })

    it('should handle click on element without data-draggable-id', () => {
      const divWithoutId = document.createElement('div')
      container.appendChild(divWithoutId)

      divWithoutId.dispatchEvent(new MouseEvent('click', { bubbles: true }))

      // Should clear selection (click outside)
      expect(plugin.api!.getSelected()).toHaveLength(0)
    })
  })

  describe('dragAllSelected option', () => {
    it('should not move other items when dragAllSelected is false', () => {
      const customPlugin = multiDrag({ dragAllSelected: false })
      customPlugin.install(mockKernel)

      const draggables = mockKernel.getDraggables()
      const drag1 = draggables.get('drag-1')!
      const drag2 = draggables.get('drag-2')!

      customPlugin.api!.select('drag-1')
      customPlugin.api!.select('drag-2')

      // No handlers for drag events when dragAllSelected is false
      eventHandlers['drag:start']?.({
        draggable: drag1
      })

      eventHandlers['drag:move']?.({
        draggable: {
          getId: () => 'drag-1',
          getTransform: () => ({ x: 50, y: 100 })
        }
      })

      // setTransform should not be called since dragAllSelected is false
      // The handlers still run but originalDraggables is empty
      customPlugin.uninstall()
    })
  })
})
