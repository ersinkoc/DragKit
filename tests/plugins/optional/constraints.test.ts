/**
 * Constraints Plugin Tests
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { constraints } from '../../../src/plugins/optional/constraints'
import type { Kernel, DraggableInstance } from '../../../src/types'

// Polyfill DOMRect for happy-dom
if (typeof globalThis.DOMRect === 'undefined') {
  (globalThis as any).DOMRect = class DOMRect {
    x: number
    y: number
    width: number
    height: number
    top: number
    right: number
    bottom: number
    left: number

    constructor(x = 0, y = 0, width = 0, height = 0) {
      this.x = x
      this.y = y
      this.width = width
      this.height = height
      this.top = y
      this.left = x
      this.right = x + width
      this.bottom = y + height
    }

    toJSON() {
      return { x: this.x, y: this.y, width: this.width, height: this.height }
    }
  }
}

describe('Constraints Plugin', () => {
  let mockKernel: Kernel
  let plugin: ReturnType<typeof constraints>
  let eventHandlers: Record<string, (event: any) => void>
  let mockDraggable: DraggableInstance
  let element: HTMLDivElement
  let parentElement: HTMLDivElement

  beforeEach(() => {
    eventHandlers = {}

    // Mock window dimensions
    Object.defineProperty(window, 'innerWidth', { value: 1024, writable: true })
    Object.defineProperty(window, 'innerHeight', { value: 768, writable: true })

    parentElement = document.createElement('div')
    document.body.appendChild(parentElement)

    element = document.createElement('div')
    parentElement.appendChild(element)

    // Mock getBoundingClientRect
    element.getBoundingClientRect = vi.fn().mockReturnValue({
      left: 100,
      top: 100,
      right: 200,
      bottom: 200,
      width: 100,
      height: 100,
      x: 100,
      y: 100,
      toJSON: () => ({})
    })

    parentElement.getBoundingClientRect = vi.fn().mockReturnValue({
      left: 0,
      top: 0,
      right: 500,
      bottom: 500,
      width: 500,
      height: 500,
      x: 0,
      y: 0,
      toJSON: () => ({})
    })

    mockDraggable = {
      id: 'drag-1',
      element,
      data: {},
      options: { id: 'drag-1' },
      isDragging: vi.fn().mockReturnValue(true),
      isDisabled: vi.fn().mockReturnValue(false),
      getPosition: vi.fn().mockReturnValue({ x: 100, y: 100 }),
      getTransform: vi.fn().mockReturnValue({ x: 50, y: 50 }),
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

    plugin = constraints()
  })

  afterEach(() => {
    plugin.uninstall()
    document.body.removeChild(parentElement)
  })

  describe('plugin metadata', () => {
    it('should have correct name', () => {
      expect(plugin.name).toBe('constraints')
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

    it('should set axis lock', () => {
      plugin.api!.setAxisLock('drag-1', 'x')

      const config = plugin.api!.getConstraints('drag-1')
      expect(config?.axis).toBe('x')
    })

    it('should set bounds', () => {
      plugin.api!.setBounds('drag-1', 'parent')

      const config = plugin.api!.getConstraints('drag-1')
      expect(config?.bounds).toBe('parent')
    })

    it('should clear constraints', () => {
      plugin.api!.setAxisLock('drag-1', 'y')
      plugin.api!.clearConstraints('drag-1')

      expect(plugin.api!.getConstraints('drag-1')).toBeUndefined()
    })

    it('should preserve existing constraints when adding new ones', () => {
      plugin.api!.setAxisLock('drag-1', 'x')
      plugin.api!.setBounds('drag-1', 'window')

      const config = plugin.api!.getConstraints('drag-1')
      expect(config?.axis).toBe('x')
      expect(config?.bounds).toBe('window')
    })
  })

  describe('axis locking', () => {
    beforeEach(() => {
      plugin.install(mockKernel)
    })

    it('should lock to x-axis (only horizontal movement)', () => {
      plugin.api!.setAxisLock('drag-1', 'x')

      if (eventHandlers['drag:move']) {
        eventHandlers['drag:move']({
          draggable: mockDraggable,
          position: { x: 150, y: 150 }
        })
      }

      expect(mockDraggable.setTransform).toHaveBeenCalledWith(
        expect.objectContaining({ y: 0 })
      )
    })

    it('should lock to y-axis (only vertical movement)', () => {
      plugin.api!.setAxisLock('drag-1', 'y')

      if (eventHandlers['drag:move']) {
        eventHandlers['drag:move']({
          draggable: mockDraggable,
          position: { x: 150, y: 150 }
        })
      }

      expect(mockDraggable.setTransform).toHaveBeenCalledWith(
        expect.objectContaining({ x: 0 })
      )
    })

    it('should allow both axes', () => {
      plugin.api!.setAxisLock('drag-1', 'both')

      ;(mockDraggable.getTransform as ReturnType<typeof vi.fn>).mockReturnValue({ x: 50, y: 50 })

      if (eventHandlers['drag:move']) {
        eventHandlers['drag:move']({
          draggable: mockDraggable,
          position: { x: 150, y: 150 }
        })
      }

      // When both axes allowed and no bounds, no constraint applied
      expect(mockDraggable.setTransform).not.toHaveBeenCalled()
    })
  })

  describe('bounds constraints', () => {
    beforeEach(() => {
      plugin.install(mockKernel)
    })

    it('should constrain to window bounds', () => {
      plugin.api!.setBounds('drag-1', 'window')

      // Mock a transform that would go out of bounds
      ;(mockDraggable.getTransform as ReturnType<typeof vi.fn>).mockReturnValue({ x: 1000, y: 1000 })

      if (eventHandlers['drag:move']) {
        eventHandlers['drag:move']({
          draggable: mockDraggable,
          position: { x: 1000, y: 1000 }
        })
      }

      expect(mockDraggable.setTransform).toHaveBeenCalled()
    })

    it('should constrain to parent bounds', () => {
      plugin.api!.setBounds('drag-1', 'parent')

      ;(mockDraggable.getTransform as ReturnType<typeof vi.fn>).mockReturnValue({ x: 500, y: 500 })

      if (eventHandlers['drag:move']) {
        eventHandlers['drag:move']({
          draggable: mockDraggable,
          position: { x: 500, y: 500 }
        })
      }

      expect(mockDraggable.setTransform).toHaveBeenCalled()
    })

    it('should constrain to body bounds', () => {
      plugin.api!.setBounds('drag-1', 'body')

      ;(mockDraggable.getTransform as ReturnType<typeof vi.fn>).mockReturnValue({ x: 10000, y: 10000 })

      if (eventHandlers['drag:move']) {
        eventHandlers['drag:move']({
          draggable: mockDraggable,
          position: { x: 10000, y: 10000 }
        })
      }

      expect(mockDraggable.setTransform).toHaveBeenCalled()
    })

    it('should constrain to custom element bounds', () => {
      const customBounds = document.createElement('div')
      customBounds.getBoundingClientRect = vi.fn().mockReturnValue({
        left: 50,
        top: 50,
        right: 300,
        bottom: 300,
        width: 250,
        height: 250
      })

      plugin.api!.setBounds('drag-1', customBounds)

      ;(mockDraggable.getTransform as ReturnType<typeof vi.fn>).mockReturnValue({ x: 500, y: 500 })

      if (eventHandlers['drag:move']) {
        eventHandlers['drag:move']({
          draggable: mockDraggable,
          position: { x: 500, y: 500 }
        })
      }

      expect(mockDraggable.setTransform).toHaveBeenCalled()
    })

    it('should constrain to custom rect bounds', () => {
      plugin.api!.setBounds('drag-1', { left: 0, top: 0, right: 200, bottom: 200 })

      ;(mockDraggable.getTransform as ReturnType<typeof vi.fn>).mockReturnValue({ x: 500, y: 500 })

      if (eventHandlers['drag:move']) {
        eventHandlers['drag:move']({
          draggable: mockDraggable,
          position: { x: 500, y: 500 }
        })
      }

      expect(mockDraggable.setTransform).toHaveBeenCalled()
    })
  })

  describe('no constraints', () => {
    beforeEach(() => {
      plugin.install(mockKernel)
    })

    it('should not modify transform when no constraints set', () => {
      if (eventHandlers['drag:move']) {
        eventHandlers['drag:move']({
          draggable: mockDraggable,
          position: { x: 1000, y: 1000 }
        })
      }

      expect(mockDraggable.setTransform).not.toHaveBeenCalled()
    })
  })
})
