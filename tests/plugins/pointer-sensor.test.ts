/**
 * Pointer Sensor Plugin Tests
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { pointerSensorPlugin } from '../../src/plugins/core/pointer-sensor'
import type { Kernel, DraggableInstance } from '../../src/types'

describe('Pointer Sensor Plugin', () => {
  let mockKernel: Kernel
  let container: HTMLDivElement
  let draggableElement: HTMLDivElement

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)

    draggableElement = document.createElement('div')
    draggableElement.setAttribute('data-draggable-id', 'test-drag')
    container.appendChild(draggableElement)

    const mockDraggable: DraggableInstance = {
      id: 'test-drag',
      element: draggableElement,
      data: {},
      options: { id: 'test-drag' },
      isDragging: vi.fn().mockReturnValue(false),
      isDisabled: vi.fn().mockReturnValue(false),
      getPosition: vi.fn().mockReturnValue({ x: 0, y: 0 }),
      getTransform: vi.fn().mockReturnValue({ x: 0, y: 0 }),
      enable: vi.fn(),
      disable: vi.fn(),
      destroy: vi.fn(),
      getId: vi.fn().mockReturnValue('test-drag'),
      getElement: vi.fn().mockReturnValue(draggableElement),
      setTransform: vi.fn(),
      resetTransform: vi.fn()
    }

    mockKernel = {
      emit: vi.fn(),
      getDraggable: vi.fn().mockReturnValue(mockDraggable),
      detectCollision: vi.fn().mockReturnValue(null)
    } as unknown as Kernel
  })

  afterEach(() => {
    document.body.removeChild(container)
    pointerSensorPlugin.uninstall()
  })

  describe('plugin metadata', () => {
    it('should have correct name', () => {
      expect(pointerSensorPlugin.name).toBe('pointer-sensor')
    })

    it('should have correct version', () => {
      expect(pointerSensorPlugin.version).toBe('1.0.0')
    })

    it('should have core type', () => {
      expect(pointerSensorPlugin.type).toBe('core')
    })
  })

  describe('install/uninstall', () => {
    it('should install without error', () => {
      expect(() => pointerSensorPlugin.install(mockKernel)).not.toThrow()
    })

    it('should uninstall without error', () => {
      pointerSensorPlugin.install(mockKernel)
      expect(() => pointerSensorPlugin.uninstall()).not.toThrow()
    })
  })

  describe('pointer events', () => {
    beforeEach(() => {
      pointerSensorPlugin.install(mockKernel)
    })

    it('should emit drag:start on pointerdown', () => {
      const event = new PointerEvent('pointerdown', {
        clientX: 100,
        clientY: 100,
        bubbles: true
      })

      draggableElement.dispatchEvent(event)

      expect(mockKernel.emit).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'drag:start',
          position: { x: 100, y: 100 }
        })
      )
    })

    it('should emit drag:move on pointermove', () => {
      // Start drag
      const downEvent = new PointerEvent('pointerdown', {
        clientX: 100,
        clientY: 100,
        bubbles: true
      })
      draggableElement.dispatchEvent(downEvent)

      // Move
      const moveEvent = new PointerEvent('pointermove', {
        clientX: 150,
        clientY: 200,
        bubbles: true
      })
      document.dispatchEvent(moveEvent)

      expect(mockKernel.emit).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'drag:move',
          position: { x: 150, y: 200 },
          delta: { x: 50, y: 100 }
        })
      )
    })

    it('should emit drag:end on pointerup', () => {
      // Start drag
      const downEvent = new PointerEvent('pointerdown', {
        clientX: 100,
        clientY: 100,
        bubbles: true
      })
      draggableElement.dispatchEvent(downEvent)

      // End drag
      const upEvent = new PointerEvent('pointerup', {
        clientX: 150,
        clientY: 150,
        bubbles: true
      })
      document.dispatchEvent(upEvent)

      expect(mockKernel.emit).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'drag:end',
          position: { x: 150, y: 150 },
          dropped: false
        })
      )
    })

    it('should not start drag if no draggable element found', () => {
      const otherElement = document.createElement('span')
      container.appendChild(otherElement)

      const event = new PointerEvent('pointerdown', {
        clientX: 100,
        clientY: 100,
        bubbles: true
      })

      otherElement.dispatchEvent(event)

      expect(mockKernel.emit).not.toHaveBeenCalled()
    })

    it('should not start drag if draggable not found in kernel', () => {
      (mockKernel.getDraggable as ReturnType<typeof vi.fn>).mockReturnValue(undefined)

      const event = new PointerEvent('pointerdown', {
        clientX: 100,
        clientY: 100,
        bubbles: true
      })

      draggableElement.dispatchEvent(event)

      expect(mockKernel.emit).not.toHaveBeenCalled()
    })

    it('should not start drag if draggable is disabled', () => {
      const disabledDraggable = {
        id: 'test-drag',
        isDisabled: vi.fn().mockReturnValue(true)
      }
      ;(mockKernel.getDraggable as ReturnType<typeof vi.fn>).mockReturnValue(disabledDraggable)

      const event = new PointerEvent('pointerdown', {
        clientX: 100,
        clientY: 100,
        bubbles: true
      })

      draggableElement.dispatchEvent(event)

      expect(mockKernel.emit).not.toHaveBeenCalled()
    })

    it('should not emit move if not active', () => {
      const moveEvent = new PointerEvent('pointermove', {
        clientX: 150,
        clientY: 200,
        bubbles: true
      })
      document.dispatchEvent(moveEvent)

      expect(mockKernel.emit).not.toHaveBeenCalled()
    })

    it('should not emit end if not active', () => {
      const upEvent = new PointerEvent('pointerup', {
        clientX: 150,
        clientY: 150,
        bubbles: true
      })
      document.dispatchEvent(upEvent)

      expect(mockKernel.emit).not.toHaveBeenCalled()
    })
  })
})
