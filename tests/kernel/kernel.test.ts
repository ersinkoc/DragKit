/**
 * DragKit Kernel Tests
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { DragKitKernel, createDragKit } from '../../src/kernel/kernel'

describe('DragKitKernel', () => {
  let kernel: DragKitKernel

  beforeEach(async () => {
    kernel = await createDragKit()
  })

  describe('initialization', () => {
    it('should create kernel with default options', async () => {
      const k = await createDragKit()
      expect(k).toBeInstanceOf(DragKitKernel)

      const options = k.getOptions()
      expect(options.sensors).toEqual(['pointer', 'touch'])
      expect(options.collision).toBe('rectangle')
      expect(options.autoScroll).toBe(false)
      expect(options.accessibility).toBe(true)
    })

    it('should create kernel with custom options', async () => {
      const k = await createDragKit({
        collision: 'center',
        autoScroll: true
      })

      const options = k.getOptions()
      expect(options.collision).toBe('center')
      expect(options.autoScroll).toBe(true)
    })

    it('should load core plugins on initialization', async () => {
      const plugins = kernel.listPlugins()

      expect(plugins.some(p => p.name === 'drag-manager')).toBe(true)
      expect(plugins.some(p => p.name === 'drop-manager')).toBe(true)
      expect(plugins.some(p => p.name === 'collision-detector')).toBe(true)
      expect(plugins.some(p => p.name === 'pointer-sensor')).toBe(true)
      expect(plugins.some(p => p.name === 'touch-sensor')).toBe(true)
      expect(plugins.some(p => p.name === 'sortable-engine')).toBe(true)
    })
  })

  describe('draggable management', () => {
    it('should register a draggable element', () => {
      const element = document.createElement('div')

      const instance = kernel.draggable(element, {
        id: 'test-draggable'
      })

      expect(instance.id).toBe('test-draggable')
      expect(instance.element).toBe(element)
      expect(kernel.getDraggable('test-draggable')).toBe(instance)
    })

    it('should get all draggables', () => {
      const el1 = document.createElement('div')
      const el2 = document.createElement('div')

      kernel.draggable(el1, { id: 'draggable-1' })
      kernel.draggable(el2, { id: 'draggable-2' })

      const draggables = kernel.getDraggables()

      expect(draggables.size).toBe(2)
      expect(draggables.has('draggable-1')).toBe(true)
      expect(draggables.has('draggable-2')).toBe(true)
    })

    it('should destroy a draggable', () => {
      const element = document.createElement('div')

      const instance = kernel.draggable(element, { id: 'to-destroy' })
      instance.destroy()

      expect(kernel.getDraggable('to-destroy')).toBeUndefined()
    })
  })

  describe('droppable management', () => {
    it('should register a droppable element', () => {
      const element = document.createElement('div')

      const instance = kernel.droppable(element, {
        id: 'test-droppable'
      })

      expect(instance.id).toBe('test-droppable')
      expect(instance.element).toBe(element)
      expect(kernel.getDroppable('test-droppable')).toBe(instance)
    })

    it('should get all droppables', () => {
      const el1 = document.createElement('div')
      const el2 = document.createElement('div')

      kernel.droppable(el1, { id: 'droppable-1' })
      kernel.droppable(el2, { id: 'droppable-2' })

      const droppables = kernel.getDroppables()

      expect(droppables.size).toBe(2)
      expect(droppables.has('droppable-1')).toBe(true)
      expect(droppables.has('droppable-2')).toBe(true)
    })

    it('should destroy a droppable', () => {
      const element = document.createElement('div')

      const instance = kernel.droppable(element, { id: 'to-destroy' })
      instance.destroy()

      expect(kernel.getDroppable('to-destroy')).toBeUndefined()
    })
  })

  describe('event system', () => {
    it('should subscribe to events', () => {
      const handler = vi.fn()

      const unsubscribe = kernel.on('drag:start', handler)

      expect(typeof unsubscribe).toBe('function')
    })

    it('should emit events', () => {
      const handler = vi.fn()
      kernel.on('drag:start', handler)

      const element = document.createElement('div')
      const draggable = kernel.draggable(element, { id: 'test' })

      kernel.emit({
        type: 'drag:start',
        timestamp: Date.now(),
        originalEvent: null,
        draggable,
        position: { x: 0, y: 0 }
      })

      expect(handler).toHaveBeenCalled()
    })

    it('should unsubscribe from events', () => {
      const handler = vi.fn()
      const unsubscribe = kernel.on('drag:start', handler)

      unsubscribe()

      const element = document.createElement('div')
      const draggable = kernel.draggable(element, { id: 'test' })

      kernel.emit({
        type: 'drag:start',
        timestamp: Date.now(),
        originalEvent: null,
        draggable,
        position: { x: 0, y: 0 }
      })

      expect(handler).not.toHaveBeenCalled()
    })
  })

  describe('configuration', () => {
    it('should update configuration', () => {
      kernel.configure({
        collision: 'pointer'
      })

      const options = kernel.getOptions()
      expect(options.collision).toBe('pointer')
    })
  })

  describe('drag state', () => {
    it('should track active draggable', () => {
      expect(kernel.getActiveDraggable()).toBeNull()
      expect(kernel.isDragging()).toBe(false)
    })

    it('should track active droppable', () => {
      expect(kernel.getActiveDroppable()).toBeNull()
    })
  })

  describe('lifecycle', () => {
    it('should destroy kernel', async () => {
      const plugins = kernel.listPlugins()
      expect(plugins.length).toBeGreaterThan(0)

      await kernel.destroy()

      // After destroy, plugin list should be empty
      const pluginsAfter = kernel.listPlugins()
      expect(pluginsAfter.length).toBe(0)
    })
  })

  describe('sensors', () => {
    it('should add a sensor', () => {
      const mockSensor = {
        type: 'custom' as const,
        attach: vi.fn(),
        detach: vi.fn(),
        isActive: vi.fn().mockReturnValue(false),
        activate: vi.fn(),
        deactivate: vi.fn()
      }

      expect(() => kernel.addSensor(mockSensor)).not.toThrow()
      expect(mockSensor.attach).toHaveBeenCalledWith(kernel)
    })

    it('should remove a sensor', () => {
      expect(() => kernel.removeSensor('pointer')).not.toThrow()
    })

    it('should get sensors list', () => {
      const sensors = kernel.getSensors()
      expect(Array.isArray(sensors)).toBe(true)
    })
  })

  describe('collision detection', () => {
    it('should set collision algorithm', () => {
      expect(() => kernel.setCollisionAlgorithm('center')).not.toThrow()
    })

    it('should set custom collision function', () => {
      const customFn = (_draggable: any, _droppables: any[]) => null
      expect(() => kernel.setCollisionAlgorithm(customFn)).not.toThrow()
    })

    it('should detect collision', () => {
      const dragElement = document.createElement('div')
      const dropElement = document.createElement('div')

      const draggable = kernel.draggable(dragElement, { id: 'drag-test' })
      kernel.droppable(dropElement, { id: 'drop-test' })

      const result = kernel.detectCollision(draggable)
      // Result could be null or a droppable depending on collision
      expect(result === null || result !== undefined).toBe(true)
    })
  })

  describe('plugin management', () => {
    it('should register a custom plugin', async () => {
      const customPlugin = {
        name: 'custom-plugin',
        version: '1.0.0',
        type: 'optional' as const,
        install: vi.fn(),
        uninstall: vi.fn()
      }

      await kernel.register(customPlugin)

      const plugins = kernel.listPlugins()
      expect(plugins.some(p => p.name === 'custom-plugin')).toBe(true)
    })

    it('should unregister a plugin', async () => {
      const customPlugin = {
        name: 'to-unregister',
        version: '1.0.0',
        type: 'optional' as const,
        install: vi.fn(),
        uninstall: vi.fn()
      }

      await kernel.register(customPlugin)
      expect(kernel.listPlugins().some(p => p.name === 'to-unregister')).toBe(true)

      await kernel.unregister('to-unregister')
      expect(kernel.listPlugins().some(p => p.name === 'to-unregister')).toBe(false)
    })

    it('should get a plugin by name', () => {
      const plugin = kernel.getPlugin('drag-manager')
      expect(plugin).toBeDefined()
      expect(plugin?.name).toBe('drag-manager')
    })

    it('should return undefined for non-existent plugin', () => {
      const plugin = kernel.getPlugin('non-existent')
      expect(plugin).toBeUndefined()
    })
  })

  describe('event system extended', () => {
    it('should use off to remove event handler', () => {
      const handler = vi.fn()
      kernel.on('drag:move', handler)
      kernel.off('drag:move', handler)

      const element = document.createElement('div')
      const draggable = kernel.draggable(element, { id: 'test-off' })

      kernel.emit({
        type: 'drag:move',
        timestamp: Date.now(),
        originalEvent: null,
        draggable,
        position: { x: 0, y: 0 },
        delta: { x: 0, y: 0 }
      })

      expect(handler).not.toHaveBeenCalled()
    })

    it('should emit sort events', () => {
      const handler = vi.fn()
      kernel.on('sort:end', handler)

      const element = document.createElement('div')
      const draggable = kernel.draggable(element, { id: 'sort-test' })

      kernel.emit({
        type: 'sort:end',
        timestamp: Date.now(),
        originalEvent: null,
        sortable: {
          id: 'sort-1',
          container: element,
          options: { id: 'sort-1', items: [] },
          getItems: () => [],
          getItemElements: () => [],
          isDragging: () => false,
          setItems: () => {},
          addItem: () => {},
          removeItem: () => {},
          moveItem: () => {},
          enable: () => {},
          disable: () => {},
          destroy: () => {}
        },
        item: 'item-1',
        oldIndex: 0,
        newIndex: 1,
        items: ['item-1', 'item-2']
      } as any)

      expect(handler).toHaveBeenCalled()
    })
  })

  describe('sortable management', () => {
    it('should create a sortable', () => {
      const container = document.createElement('div')

      const sortable = kernel.sortable(container, {
        id: 'sortable-1',
        items: ['item-1', 'item-2']
      })

      expect(sortable).toBeDefined()
      expect(sortable.id).toBe('sortable-1')
    })

    it('should create a sortable grid', () => {
      const container = document.createElement('div')

      const grid = kernel.sortableGrid(container, {
        id: 'grid-1',
        items: ['item-1', 'item-2', 'item-3'],
        columns: 3
      })

      expect(grid).toBeDefined()
      expect(grid.id).toBe('grid-1')
    })
  })

  describe('re-initialization', () => {
    it('should not reinitialize if already initialized', async () => {
      // kernel is already initialized in beforeEach
      const pluginsBefore = kernel.listPlugins()

      // Try to initialize again
      await kernel.initialize()

      const pluginsAfter = kernel.listPlugins()
      // Should have the same plugins
      expect(pluginsAfter.length).toBe(pluginsBefore.length)
    })
  })

  describe('custom plugins in options', () => {
    it('should load user plugins from options', async () => {
      const customPlugin = {
        name: 'user-plugin',
        version: '1.0.0',
        type: 'optional' as const,
        install: vi.fn(),
        uninstall: vi.fn()
      }

      const k = await createDragKit({
        plugins: [customPlugin]
      })

      const plugins = k.listPlugins()
      expect(plugins.some(p => p.name === 'user-plugin')).toBe(true)
      expect(customPlugin.install).toHaveBeenCalled()
    })
  })
})
