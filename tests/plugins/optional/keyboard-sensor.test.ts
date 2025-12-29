/**
 * Keyboard Sensor Plugin Tests
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { keyboardSensor } from '../../../src/plugins/optional/keyboard-sensor'
import type { Kernel, DraggableInstance } from '../../../src/types'

describe('Keyboard Sensor Plugin', () => {
  let mockKernel: Kernel
  let plugin: ReturnType<typeof keyboardSensor>
  let container: HTMLDivElement
  let draggableElement: HTMLDivElement

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)

    draggableElement = document.createElement('div')
    draggableElement.setAttribute('data-draggable-id', 'test-drag')
    draggableElement.tabIndex = 0
    container.appendChild(draggableElement)

    const mockDraggable: DraggableInstance = {
      id: 'test-drag',
      element: draggableElement,
      data: {},
      options: { id: 'test-drag' },
      isDragging: vi.fn().mockReturnValue(false),
      isDisabled: vi.fn().mockReturnValue(false),
      getPosition: vi.fn().mockReturnValue({ x: 100, y: 100 }),
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
      on: vi.fn().mockReturnValue(vi.fn()),
      getDraggable: vi.fn().mockReturnValue(mockDraggable),
      detectCollision: vi.fn().mockReturnValue(null)
    } as unknown as Kernel

    plugin = keyboardSensor()
  })

  afterEach(() => {
    plugin.uninstall()
    document.body.removeChild(container)
  })

  describe('plugin metadata', () => {
    it('should have correct name', () => {
      expect(plugin.name).toBe('keyboard-sensor')
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

    it('should create announcer element on install', () => {
      plugin.install(mockKernel)
      const announcer = document.querySelector('[role="status"]')
      expect(announcer).not.toBeNull()
    })

    it('should remove announcer element on uninstall', () => {
      plugin.install(mockKernel)
      plugin.uninstall()
      const announcer = document.querySelector('[role="status"]')
      expect(announcer).toBeNull()
    })
  })

  describe('API', () => {
    beforeEach(() => {
      plugin.install(mockKernel)
    })

    it('should expose API', () => {
      expect(plugin.api).toBeDefined()
    })

    it('should report active state', () => {
      expect(plugin.api!.isActive()).toBe(false)
    })

    it('should get/set move distance', () => {
      expect(plugin.api!.getMoveDistance()).toBe(10) // default
      plugin.api!.setMoveDistance(20)
      expect(plugin.api!.getMoveDistance()).toBe(20)
    })
  })

  describe('keyboard events', () => {
    beforeEach(() => {
      plugin.install(mockKernel)
      draggableElement.focus()
    })

    it('should start drag on Space key', () => {
      const event = new KeyboardEvent('keydown', {
        code: 'Space',
        bubbles: true
      })
      draggableElement.dispatchEvent(event)

      expect(mockKernel.emit).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'drag:start'
        })
      )
    })

    it('should start drag on Enter key', () => {
      const event = new KeyboardEvent('keydown', {
        code: 'Enter',
        bubbles: true
      })
      draggableElement.dispatchEvent(event)

      expect(mockKernel.emit).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'drag:start'
        })
      )
    })

    it('should move on arrow keys', () => {
      // Start drag first
      draggableElement.dispatchEvent(new KeyboardEvent('keydown', { code: 'Space', bubbles: true }))

      // Move down
      draggableElement.dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowDown', bubbles: true }))

      expect(mockKernel.emit).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'drag:move',
          delta: { x: 0, y: 10 }
        })
      )
    })

    it('should cancel on Escape', () => {
      // Start drag first
      draggableElement.dispatchEvent(new KeyboardEvent('keydown', { code: 'Space', bubbles: true }))

      // Cancel
      draggableElement.dispatchEvent(new KeyboardEvent('keydown', { code: 'Escape', bubbles: true }))

      expect(mockKernel.emit).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'drag:cancel'
        })
      )
    })

    it('should drop on Space while dragging', () => {
      // Start drag first
      draggableElement.dispatchEvent(new KeyboardEvent('keydown', { code: 'Space', bubbles: true }))

      // Drop
      draggableElement.dispatchEvent(new KeyboardEvent('keydown', { code: 'Space', bubbles: true }))

      expect(mockKernel.emit).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'drag:end'
        })
      )
    })
  })

  describe('options', () => {
    it('should use custom move distance', () => {
      const customPlugin = keyboardSensor({ moveDistance: 25 })
      customPlugin.install(mockKernel)

      expect(customPlugin.api!.getMoveDistance()).toBe(25)
      customPlugin.uninstall()
    })

    it('should use custom keyboard codes', () => {
      const customPlugin = keyboardSensor({
        keyboardCodes: {
          start: ['KeyD']
        }
      })
      customPlugin.install(mockKernel)

      draggableElement.focus()
      draggableElement.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyD', bubbles: true }))

      expect(mockKernel.emit).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'drag:start'
        })
      )

      customPlugin.uninstall()
    })
  })

  describe('arrow key movement', () => {
    beforeEach(() => {
      plugin.install(mockKernel)
      draggableElement.focus()
      // Start drag first
      draggableElement.dispatchEvent(new KeyboardEvent('keydown', { code: 'Space', bubbles: true }))
    })

    it('should move up on ArrowUp', () => {
      draggableElement.dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowUp', bubbles: true }))

      expect(mockKernel.emit).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'drag:move',
          delta: { x: 0, y: -10 }
        })
      )
    })

    it('should move left on ArrowLeft', () => {
      draggableElement.dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowLeft', bubbles: true }))

      expect(mockKernel.emit).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'drag:move',
          delta: { x: -10, y: 0 }
        })
      )
    })

    it('should move right on ArrowRight', () => {
      draggableElement.dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowRight', bubbles: true }))

      expect(mockKernel.emit).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'drag:move',
          delta: { x: 10, y: 0 }
        })
      )
    })

    it('should not emit move for non-arrow keys', () => {
      const emitCallsBefore = (mockKernel.emit as ReturnType<typeof vi.fn>).mock.calls.length

      draggableElement.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyA', bubbles: true }))

      // Should only have the previous emit calls (start + no new move)
      expect((mockKernel.emit as ReturnType<typeof vi.fn>).mock.calls.length).toBe(emitCallsBefore)
    })
  })

  describe('announcements', () => {
    it('should call announcement callbacks when provided', () => {
      const onDragStart = vi.fn().mockReturnValue('Started dragging')
      const onDragOver = vi.fn().mockReturnValue('Over droppable')
      const onDragEnd = vi.fn().mockReturnValue('Dropped!')

      const customPlugin = keyboardSensor({
        announcements: {
          onDragStart,
          onDragOver,
          onDragEnd
        }
      })
      customPlugin.install(mockKernel)

      draggableElement.focus()

      // Start drag
      draggableElement.dispatchEvent(new KeyboardEvent('keydown', { code: 'Space', bubbles: true }))
      expect(onDragStart).toHaveBeenCalled()

      // Move (triggers collision detection and onDragOver)
      draggableElement.dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowDown', bubbles: true }))
      expect(onDragOver).toHaveBeenCalled()

      // Drop
      draggableElement.dispatchEvent(new KeyboardEvent('keydown', { code: 'Space', bubbles: true }))
      expect(onDragEnd).toHaveBeenCalled()

      customPlugin.uninstall()
    })

    it('should update announcer text content', () => {
      const customPlugin = keyboardSensor({
        announcements: {
          onDragStart: (draggable) => `Picked up ${draggable.id}`
        }
      })
      customPlugin.install(mockKernel)

      draggableElement.focus()
      draggableElement.dispatchEvent(new KeyboardEvent('keydown', { code: 'Space', bubbles: true }))

      const announcer = document.querySelector('[role="status"]')
      expect(announcer?.textContent).toBe('Picked up test-drag')

      customPlugin.uninstall()
    })
  })

  describe('edge cases', () => {
    beforeEach(() => {
      plugin.install(mockKernel)
    })

    it('should not start drag if no draggable element', () => {
      const otherElement = document.createElement('span')
      container.appendChild(otherElement)
      otherElement.focus()

      otherElement.dispatchEvent(new KeyboardEvent('keydown', { code: 'Space', bubbles: true }))

      expect(mockKernel.emit).not.toHaveBeenCalled()
    })

    it('should not start drag if draggable is disabled', () => {
      const disabledDraggable = {
        id: 'test-drag',
        isDisabled: vi.fn().mockReturnValue(true)
      }
      ;(mockKernel.getDraggable as ReturnType<typeof vi.fn>).mockReturnValue(disabledDraggable)

      draggableElement.focus()
      draggableElement.dispatchEvent(new KeyboardEvent('keydown', { code: 'Space', bubbles: true }))

      expect(mockKernel.emit).not.toHaveBeenCalled()
    })

    it('should not start drag if draggable not found in kernel', () => {
      ;(mockKernel.getDraggable as ReturnType<typeof vi.fn>).mockReturnValue(undefined)

      draggableElement.focus()
      draggableElement.dispatchEvent(new KeyboardEvent('keydown', { code: 'Space', bubbles: true }))

      expect(mockKernel.emit).not.toHaveBeenCalled()
    })

    it('should not activate on element without draggable id', () => {
      const noIdElement = document.createElement('div')
      container.appendChild(noIdElement)
      noIdElement.focus()

      noIdElement.dispatchEvent(new KeyboardEvent('keydown', { code: 'Space', bubbles: true }))

      expect(mockKernel.emit).not.toHaveBeenCalled()
    })

    it('should handle drop with a valid droppable', () => {
      const mockDroppable = {
        id: 'drop-1',
        element: document.createElement('div')
      }
      ;(mockKernel.detectCollision as ReturnType<typeof vi.fn>).mockReturnValue(mockDroppable)

      draggableElement.focus()
      // Start drag
      draggableElement.dispatchEvent(new KeyboardEvent('keydown', { code: 'Space', bubbles: true }))
      // Drop
      draggableElement.dispatchEvent(new KeyboardEvent('keydown', { code: 'Space', bubbles: true }))

      expect(mockKernel.emit).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'drag:end',
          dropped: true
        })
      )
    })
  })
})
