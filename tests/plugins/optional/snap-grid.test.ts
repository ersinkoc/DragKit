/**
 * Snap Grid Plugin Tests
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { snapGrid } from '../../../src/plugins/optional/snap-grid'
import type { Kernel, DraggableInstance } from '../../../src/types'

describe('Snap Grid Plugin', () => {
  let mockKernel: Kernel
  let plugin: ReturnType<typeof snapGrid>
  let eventHandlers: Record<string, (event: any) => void>
  let mockDraggable: DraggableInstance

  beforeEach(() => {
    eventHandlers = {}

    const element = document.createElement('div')
    mockDraggable = {
      id: 'drag-1',
      element,
      data: {},
      options: { id: 'drag-1' },
      isDragging: vi.fn().mockReturnValue(true),
      isDisabled: vi.fn().mockReturnValue(false),
      getPosition: vi.fn().mockReturnValue({ x: 0, y: 0 }),
      getTransform: vi.fn().mockReturnValue({ x: 15, y: 25 }),
      enable: vi.fn(),
      disable: vi.fn(),
      destroy: vi.fn(),
      getId: vi.fn().mockReturnValue('drag-1'),
      getElement: vi.fn().mockReturnValue(element),
      setTransform: vi.fn(),
      resetTransform: vi.fn()
    } as DraggableInstance

    mockKernel = {
      emit: vi.fn(),
      on: vi.fn().mockImplementation((event: string, handler: (e: any) => void) => {
        eventHandlers[event] = handler
        return () => { delete eventHandlers[event] }
      }),
      getDraggable: vi.fn().mockReturnValue(mockDraggable)
    } as unknown as Kernel

    plugin = snapGrid()
  })

  afterEach(() => {
    plugin.uninstall()
  })

  describe('plugin metadata', () => {
    it('should have correct name', () => {
      expect(plugin.name).toBe('snap-grid')
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

    it('should be enabled by default', () => {
      expect(plugin.api!.isEnabled()).toBe(true)
    })

    it('should toggle enable/disable', () => {
      plugin.api!.disable()
      expect(plugin.api!.isEnabled()).toBe(false)

      plugin.api!.enable()
      expect(plugin.api!.isEnabled()).toBe(true)
    })

    it('should set grid size with number', () => {
      plugin.api!.setSize(30)
      // Size is internal, verify no errors
      expect(plugin.api!.isEnabled()).toBe(true)
    })

    it('should set grid size with object', () => {
      plugin.api!.setSize({ x: 25, y: 50 })
      expect(plugin.api!.isEnabled()).toBe(true)
    })

    it('should set offset', () => {
      plugin.api!.setOffset({ x: 10, y: 10 })
      expect(plugin.api!.isEnabled()).toBe(true)
    })

    it('should show grid', () => {
      plugin.api!.showGrid()

      const gridOverlay = document.querySelector('[style*="position: fixed"]')
      expect(gridOverlay).not.toBeNull()
    })

    it('should hide grid', () => {
      plugin.api!.showGrid()
      plugin.api!.hideGrid()

      const gridOverlay = document.querySelector('[style*="position: fixed"]')
      expect(gridOverlay).toBeNull()
    })

    it('should not create duplicate overlays', () => {
      plugin.api!.showGrid()
      plugin.api!.showGrid()

      const overlays = document.querySelectorAll('[style*="position: fixed"]')
      expect(overlays).toHaveLength(1)
    })
  })

  describe('snap behavior', () => {
    beforeEach(() => {
      plugin.install(mockKernel)
    })

    it('should snap transform on drag move', () => {
      // Default grid is 20x20
      if (eventHandlers['drag:move']) {
        eventHandlers['drag:move']({
          draggable: mockDraggable,
          position: { x: 100, y: 100 },
          delta: { x: 0, y: 0 }
        })
      }

      // Should snap 15 to 20, 25 to 20
      expect(mockDraggable.setTransform).toHaveBeenCalledWith({ x: 20, y: 20 })
    })

    it('should not snap when disabled', () => {
      plugin.api!.disable()

      if (eventHandlers['drag:move']) {
        eventHandlers['drag:move']({
          draggable: mockDraggable,
          position: { x: 100, y: 100 }
        })
      }

      expect(mockDraggable.setTransform).not.toHaveBeenCalled()
    })
  })

  describe('options', () => {
    it('should use custom size', () => {
      const customPlugin = snapGrid({ size: 50 })
      customPlugin.install(mockKernel)

      ;(mockDraggable.getTransform as ReturnType<typeof vi.fn>).mockReturnValue({ x: 30, y: 70 })

      if (eventHandlers['drag:move']) {
        eventHandlers['drag:move']({
          draggable: mockDraggable,
          position: { x: 100, y: 100 }
        })
      }

      // 30 -> 50, 70 -> 50
      expect(mockDraggable.setTransform).toHaveBeenCalledWith({ x: 50, y: 50 })

      customPlugin.uninstall()
    })

    it('should use separate x and y sizes', () => {
      const customPlugin = snapGrid({ x: 25, y: 50 })
      customPlugin.install(mockKernel)

      ;(mockDraggable.getTransform as ReturnType<typeof vi.fn>).mockReturnValue({ x: 12, y: 30 })

      if (eventHandlers['drag:move']) {
        eventHandlers['drag:move']({
          draggable: mockDraggable,
          position: { x: 100, y: 100 }
        })
      }

      // 12 -> 0 or 25, 30 -> 50
      expect(mockDraggable.setTransform).toHaveBeenCalled()

      customPlugin.uninstall()
    })

    it('should show grid on drag start if enabled', () => {
      const customPlugin = snapGrid({ showGrid: true })
      customPlugin.install(mockKernel)

      if (eventHandlers['drag:start']) {
        eventHandlers['drag:start']({ draggable: mockDraggable })
      }

      const gridOverlay = document.querySelector('[style*="position: fixed"]')
      expect(gridOverlay).not.toBeNull()

      customPlugin.uninstall()
    })

    it('should hide grid on drag end', () => {
      const customPlugin = snapGrid({ showGrid: true })
      customPlugin.install(mockKernel)

      if (eventHandlers['drag:start']) {
        eventHandlers['drag:start']({ draggable: mockDraggable })
      }
      if (eventHandlers['drag:end']) {
        eventHandlers['drag:end']({ draggable: mockDraggable })
      }

      const gridOverlay = document.querySelector('[style*="position: fixed"]')
      expect(gridOverlay).toBeNull()

      customPlugin.uninstall()
    })
  })
})
