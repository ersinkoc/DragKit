/**
 * Drag Devtools Plugin Tests
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { dragDevtools } from '../../../src/plugins/optional/drag-devtools'
import type { Kernel, DraggableInstance, DroppableInstance } from '../../../src/types'

describe('Drag Devtools Plugin', () => {
  let mockKernel: Kernel
  let plugin: ReturnType<typeof dragDevtools>
  let eventHandlers: Record<string, (event: any) => void>

  beforeEach(() => {
    eventHandlers = {}

    const mockDraggable: DraggableInstance = {
      id: 'drag-1',
      element: document.createElement('div'),
      data: { type: 'item' },
      options: { id: 'drag-1' },
      isDragging: vi.fn().mockReturnValue(false),
      isDisabled: vi.fn().mockReturnValue(false),
      getPosition: vi.fn().mockReturnValue({ x: 100, y: 100 }),
      getTransform: vi.fn().mockReturnValue({ x: 0, y: 0 }),
      enable: vi.fn(),
      disable: vi.fn(),
      destroy: vi.fn(),
      getId: vi.fn().mockReturnValue('drag-1'),
      getElement: vi.fn().mockReturnValue(document.createElement('div')),
      setTransform: vi.fn(),
      resetTransform: vi.fn()
    } as DraggableInstance

    const mockDroppable: DroppableInstance = {
      id: 'drop-1',
      element: document.createElement('div'),
      data: {},
      options: { id: 'drop-1' },
      isOver: vi.fn().mockReturnValue(false),
      isDisabled: vi.fn().mockReturnValue(false),
      canAccept: vi.fn().mockReturnValue(true),
      getRect: vi.fn().mockReturnValue({ left: 0, top: 0, right: 200, bottom: 200, width: 200, height: 200 }),
      enable: vi.fn(),
      disable: vi.fn(),
      destroy: vi.fn(),
      getId: vi.fn().mockReturnValue('drop-1'),
      getElement: vi.fn().mockReturnValue(document.createElement('div')),
      setOver: vi.fn()
    } as DroppableInstance

    const draggables = new Map([['drag-1', mockDraggable]])
    const droppables = new Map([['drop-1', mockDroppable]])

    mockKernel = {
      emit: vi.fn(),
      on: vi.fn().mockImplementation((event: string, handler: (e: any) => void) => {
        eventHandlers[event] = handler
        return () => { delete eventHandlers[event] }
      }),
      getDraggables: vi.fn().mockReturnValue(draggables),
      getDroppables: vi.fn().mockReturnValue(droppables),
      isDragging: vi.fn().mockReturnValue(false),
      getActiveDraggable: vi.fn().mockReturnValue(null)
    } as unknown as Kernel

    plugin = dragDevtools()
  })

  afterEach(() => {
    plugin.uninstall()
    // Clean up any panel elements
    document.querySelectorAll('[data-devtools-panel]').forEach(el => el.remove())
  })

  describe('plugin metadata', () => {
    it('should have correct name', () => {
      expect(plugin.name).toBe('drag-devtools')
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

    it('should show panel', () => {
      plugin.api!.show()
      expect(plugin.api!.isVisible()).toBe(true)
    })

    it('should hide panel', () => {
      plugin.api!.show()
      plugin.api!.hide()
      expect(plugin.api!.isVisible()).toBe(false)
    })

    it('should toggle panel', () => {
      plugin.api!.toggle()
      expect(plugin.api!.isVisible()).toBe(true)

      plugin.api!.toggle()
      expect(plugin.api!.isVisible()).toBe(false)
    })

    it('should clear event log', () => {
      // Trigger some events first
      if (eventHandlers['drag:start']) {
        eventHandlers['drag:start']({ type: 'drag:start', draggable: mockKernel.getDraggables().get('drag-1') })
      }

      plugin.api!.clearLog()
      const log = plugin.api!.getEventLog()
      expect(log).toHaveLength(0)
    })

    it('should get event log', () => {
      const log = plugin.api!.getEventLog()
      expect(Array.isArray(log)).toBe(true)
    })
  })

  describe('event logging', () => {
    beforeEach(() => {
      plugin.install(mockKernel)
    })

    it('should log drag:start events', () => {
      if (eventHandlers['drag:start']) {
        eventHandlers['drag:start']({
          type: 'drag:start',
          draggable: mockKernel.getDraggables().get('drag-1'),
          timestamp: Date.now()
        })
      }

      const log = plugin.api!.getEventLog()
      expect(log.length).toBeGreaterThan(0)
      expect(log[0]?.type).toBe('drag:start')
    })

    it('should log drag:end events', () => {
      if (eventHandlers['drag:end']) {
        eventHandlers['drag:end']({
          type: 'drag:end',
          draggable: mockKernel.getDraggables().get('drag-1'),
          droppable: null,
          dropped: false,
          timestamp: Date.now()
        })
      }

      const log = plugin.api!.getEventLog()
      expect(log.some(e => e.type === 'drag:end')).toBe(true)
    })
  })

  describe('options', () => {
    it('should auto-show if specified', () => {
      const customPlugin = dragDevtools({ autoShow: true })
      customPlugin.install(mockKernel)

      expect(customPlugin.api!.isVisible()).toBe(true)

      customPlugin.uninstall()
    })

    it('should use custom position', () => {
      const customPlugin = dragDevtools({ position: 'top-left' })
      customPlugin.install(mockKernel)
      customPlugin.api!.show()

      expect(customPlugin.api!.isVisible()).toBe(true)

      customPlugin.uninstall()
    })

    it('should limit log entries', () => {
      const customPlugin = dragDevtools({ maxLogEntries: 5 })
      customPlugin.install(mockKernel)

      // Add more than 5 events
      for (let i = 0; i < 10; i++) {
        if (eventHandlers['drag:move']) {
          eventHandlers['drag:move']({
            type: 'drag:move',
            draggable: mockKernel.getDraggables().get('drag-1'),
            position: { x: i, y: i },
            delta: { x: 1, y: 1 },
            timestamp: Date.now()
          })
        }
      }

      const log = customPlugin.api!.getEventLog()
      expect(log.length).toBeLessThanOrEqual(5)

      customPlugin.uninstall()
    })
  })

  describe('keyboard shortcut', () => {
    beforeEach(() => {
      plugin.install(mockKernel)
    })

    it('should toggle panel on Ctrl+Shift+D', () => {
      document.dispatchEvent(new KeyboardEvent('keydown', {
        key: 'D',
        ctrlKey: true,
        shiftKey: true,
        bubbles: true
      }))

      expect(plugin.api!.isVisible()).toBe(true)
    })
  })

  describe('panel rendering', () => {
    beforeEach(() => {
      plugin.install(mockKernel)
    })

    it('should render event entries in panel when visible', () => {
      // Log some events
      if (eventHandlers['drag:start']) {
        eventHandlers['drag:start']({
          type: 'drag:start',
          draggable: mockKernel.getDraggables().get('drag-1'),
          position: { x: 100, y: 100 },
          timestamp: Date.now()
        })
      }

      if (eventHandlers['drag:move']) {
        eventHandlers['drag:move']({
          type: 'drag:move',
          draggable: mockKernel.getDraggables().get('drag-1'),
          position: { x: 150, y: 150 },
          delta: { x: 50, y: 50 },
          timestamp: Date.now()
        })
      }

      if (eventHandlers['drag:end']) {
        eventHandlers['drag:end']({
          type: 'drag:end',
          draggable: mockKernel.getDraggables().get('drag-1'),
          droppable: mockKernel.getDroppables().get('drop-1'),
          dropped: true,
          position: { x: 200, y: 200 },
          timestamp: Date.now()
        })
      }

      // Show panel to trigger rendering
      plugin.api!.show()

      // Panel should be in the DOM
      const panel = document.querySelector('[data-devtools-panel]')
      expect(panel).not.toBeNull()

      // Event log should have entries
      const log = plugin.api!.getEventLog()
      expect(log.length).toBe(3)
    })

    it('should render all event types with correct colors', () => {
      // Test all event types
      const eventTypes = [
        'drag:start',
        'drag:move',
        'drag:end',
        'drag:cancel',
        'drop:enter',
        'drop:leave',
        'drop:drop'
      ]

      eventTypes.forEach(type => {
        if (eventHandlers[type]) {
          eventHandlers[type]({
            type,
            draggable: mockKernel.getDraggables().get('drag-1'),
            droppable: mockKernel.getDroppables().get('drop-1'),
            position: { x: 100, y: 100 },
            delta: { x: 10, y: 10 },
            dropped: type === 'drop:drop',
            timestamp: Date.now()
          })
        }
      })

      plugin.api!.show()

      const log = plugin.api!.getEventLog()
      expect(log.length).toBe(7)

      // Verify all event types are logged
      const types = log.map(e => e.type)
      expect(types).toContain('drag:start')
      expect(types).toContain('drag:move')
      expect(types).toContain('drag:end')
      expect(types).toContain('drag:cancel')
      expect(types).toContain('drop:enter')
      expect(types).toContain('drop:leave')
      expect(types).toContain('drop:drop')
    })

    it('should handle unknown event types', () => {
      // Manually add an unknown event type
      if (eventHandlers['drag:start']) {
        eventHandlers['drag:start']({
          type: 'unknown:event',
          timestamp: Date.now()
        })
      }

      plugin.api!.show()

      // Should not throw and log should have entry
      expect(() => plugin.api!.getEventLog()).not.toThrow()
    })

    it('should close panel when close button is clicked', () => {
      plugin.api!.show()
      expect(plugin.api!.isVisible()).toBe(true)

      const panel = document.querySelector('[data-devtools-panel]')
      const closeBtn = panel?.querySelector('button')

      if (closeBtn) {
        closeBtn.click()
      }

      expect(plugin.api!.isVisible()).toBe(false)
    })

    it('should update panel content when events are logged', () => {
      plugin.api!.show()

      // Log an event while panel is visible
      if (eventHandlers['drag:start']) {
        eventHandlers['drag:start']({
          type: 'drag:start',
          draggable: mockKernel.getDraggables().get('drag-1'),
          position: { x: 100, y: 100 },
          timestamp: Date.now()
        })
      }

      const log = plugin.api!.getEventLog()
      expect(log.length).toBe(1)
    })

    it('should not create duplicate panels on multiple show calls', () => {
      plugin.api!.show()
      plugin.api!.show()
      plugin.api!.show()

      const panels = document.querySelectorAll('[data-devtools-panel]')
      expect(panels.length).toBe(1)
    })

    it('should not throw on hide when already hidden', () => {
      expect(plugin.api!.isVisible()).toBe(false)
      expect(() => plugin.api!.hide()).not.toThrow()
    })
  })

  describe('position options', () => {
    it('should use top-right position', () => {
      const customPlugin = dragDevtools({ position: 'top-right' })
      customPlugin.install(mockKernel)
      customPlugin.api!.show()

      const panel = document.querySelector('[data-devtools-panel]') as HTMLElement
      expect(panel.style.cssText).toContain('top')
      expect(panel.style.cssText).toContain('right')

      customPlugin.uninstall()
    })

    it('should use bottom-left position', () => {
      const customPlugin = dragDevtools({ position: 'bottom-left' })
      customPlugin.install(mockKernel)
      customPlugin.api!.show()

      const panel = document.querySelector('[data-devtools-panel]') as HTMLElement
      expect(panel.style.cssText).toContain('bottom')
      expect(panel.style.cssText).toContain('left')

      customPlugin.uninstall()
    })
  })

  describe('data sanitization', () => {
    beforeEach(() => {
      plugin.install(mockKernel)
    })

    it('should sanitize event data with null values', () => {
      if (eventHandlers['drag:start']) {
        eventHandlers['drag:start'](null)
      }

      const log = plugin.api!.getEventLog()
      expect(log[0]?.data).toBeUndefined()
    })

    it('should sanitize event data with complex objects', () => {
      if (eventHandlers['drag:end']) {
        eventHandlers['drag:end']({
          type: 'drag:end',
          draggable: mockKernel.getDraggables().get('drag-1'),
          droppable: mockKernel.getDroppables().get('drop-1'),
          position: { x: 100, y: 100 },
          delta: { x: 50, y: 50 },
          dropped: true,
          timestamp: Date.now()
        })
      }

      const log = plugin.api!.getEventLog()
      expect(log[0]?.data).toBeDefined()
      expect(log[0]?.data.draggableId).toBe('drag-1')
      expect(log[0]?.data.droppableId).toBe('drop-1')
    })
  })
})
