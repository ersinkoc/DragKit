/**
 * Collision Detector Plugin Tests
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { collisionDetectorPlugin } from '../../src/plugins/core/collision-detector'
import type { Kernel, DraggableInstance, DroppableInstance } from '../../src/types'

// Helper to create mock DOMRect
function createRect(left: number, top: number, width: number, height: number): DOMRect {
  return {
    left,
    top,
    right: left + width,
    bottom: top + height,
    width,
    height,
    x: left,
    y: top,
    toJSON: () => ({})
  } as DOMRect
}

// Helper to create mock draggable
function createMockDraggable(rect: DOMRect): DraggableInstance {
  const element = document.createElement('div')
  element.getBoundingClientRect = vi.fn().mockReturnValue(rect)

  return {
    id: 'draggable-1',
    element,
    data: {},
    options: { id: 'draggable-1' },
    isDragging: vi.fn().mockReturnValue(true),
    isDisabled: vi.fn().mockReturnValue(false),
    getPosition: vi.fn().mockReturnValue({ x: rect.left, y: rect.top }),
    getTransform: vi.fn().mockReturnValue({ x: 0, y: 0 }),
    enable: vi.fn(),
    disable: vi.fn(),
    destroy: vi.fn(),
    getId: vi.fn().mockReturnValue('draggable-1'),
    getElement: vi.fn().mockReturnValue(element),
    setTransform: vi.fn(),
    resetTransform: vi.fn()
  } as DraggableInstance
}

// Helper to create mock droppable
function createMockDroppable(id: string, rect: DOMRect): DroppableInstance {
  const element = document.createElement('div')

  return {
    id,
    element,
    data: {},
    options: { id },
    isOver: vi.fn().mockReturnValue(false),
    isDisabled: vi.fn().mockReturnValue(false),
    canAccept: vi.fn().mockReturnValue(true),
    getRect: vi.fn().mockReturnValue(rect),
    enable: vi.fn(),
    disable: vi.fn(),
    destroy: vi.fn(),
    getId: vi.fn().mockReturnValue(id),
    getElement: vi.fn().mockReturnValue(element),
    setOver: vi.fn()
  } as DroppableInstance
}

describe('Collision Detector Plugin', () => {
  let mockKernel: Kernel
  let api: any

  beforeEach(() => {
    mockKernel = {} as Kernel
    collisionDetectorPlugin.install(mockKernel)
    api = collisionDetectorPlugin.api
  })

  describe('plugin metadata', () => {
    it('should have correct name', () => {
      expect(collisionDetectorPlugin.name).toBe('collision-detector')
    })

    it('should have correct version', () => {
      expect(collisionDetectorPlugin.version).toBe('1.0.0')
    })

    it('should have core type', () => {
      expect(collisionDetectorPlugin.type).toBe('core')
    })
  })

  describe('detect', () => {
    it('should return null for empty droppables', () => {
      const draggable = createMockDraggable(createRect(0, 0, 100, 100))
      const result = api.detect(draggable, [])
      expect(result).toBeNull()
    })

    it('should detect rectangle collision', () => {
      api.setAlgorithm('rectangle')

      const draggable = createMockDraggable(createRect(50, 50, 100, 100))
      const droppable = createMockDroppable('drop-1', createRect(75, 75, 100, 100))

      const result = api.detect(draggable, [droppable])
      expect(result).toBe(droppable)
    })

    it('should not detect rectangle collision when not overlapping', () => {
      api.setAlgorithm('rectangle')

      const draggable = createMockDraggable(createRect(0, 0, 100, 100))
      const droppable = createMockDroppable('drop-1', createRect(200, 200, 100, 100))

      const result = api.detect(draggable, [droppable])
      expect(result).toBeNull()
    })

    it('should detect center collision', () => {
      api.setAlgorithm('center')

      // Draggable center is at (50, 50)
      const draggable = createMockDraggable(createRect(0, 0, 100, 100))
      // Droppable covers center
      const droppable = createMockDroppable('drop-1', createRect(25, 25, 100, 100))

      const result = api.detect(draggable, [droppable])
      expect(result).toBe(droppable)
    })

    it('should not detect center collision when center outside', () => {
      api.setAlgorithm('center')

      // Draggable center is at (50, 50)
      const draggable = createMockDraggable(createRect(0, 0, 100, 100))
      // Droppable doesn't cover center
      const droppable = createMockDroppable('drop-1', createRect(100, 100, 100, 100))

      const result = api.detect(draggable, [droppable])
      expect(result).toBeNull()
    })

    it('should detect pointer collision', () => {
      api.setAlgorithm('pointer')
      api.setPointerPosition({ x: 75, y: 75 })

      const draggable = createMockDraggable(createRect(0, 0, 100, 100))
      const droppable = createMockDroppable('drop-1', createRect(50, 50, 100, 100))

      const result = api.detect(draggable, [droppable])
      expect(result).toBe(droppable)
    })

    it('should not detect pointer collision when pointer outside', () => {
      api.setAlgorithm('pointer')
      api.setPointerPosition({ x: 0, y: 0 })

      const draggable = createMockDraggable(createRect(0, 0, 100, 100))
      const droppable = createMockDroppable('drop-1', createRect(50, 50, 100, 100))

      const result = api.detect(draggable, [droppable])
      expect(result).toBeNull()
    })

    it('should detect closest collision', () => {
      api.setAlgorithm('closest')
      api.setPointerPosition({ x: 150, y: 150 })

      const draggable = createMockDraggable(createRect(0, 0, 100, 100))
      const droppable1 = createMockDroppable('drop-1', createRect(0, 0, 100, 100))
      const droppable2 = createMockDroppable('drop-2', createRect(100, 100, 100, 100))

      const result = api.detect(draggable, [droppable1, droppable2])
      expect(result).toBe(droppable2)
    })

    it('should use custom collision function', () => {
      const customFn = vi.fn().mockImplementation((_draggable, droppables) => droppables[0])
      api.setAlgorithm(customFn)

      const draggable = createMockDraggable(createRect(0, 0, 100, 100))
      const droppable = createMockDroppable('drop-1', createRect(200, 200, 100, 100))

      const result = api.detect(draggable, [droppable])

      expect(customFn).toHaveBeenCalledWith(draggable, [droppable])
      expect(result).toBe(droppable)
    })
  })

  describe('detectAll', () => {
    it('should return all overlapping droppables', () => {
      const draggable = createMockDraggable(createRect(50, 50, 100, 100))
      const droppable1 = createMockDroppable('drop-1', createRect(75, 75, 100, 100))
      const droppable2 = createMockDroppable('drop-2', createRect(0, 0, 100, 100))
      const droppable3 = createMockDroppable('drop-3', createRect(300, 300, 100, 100))

      const results = api.detectAll(draggable, [droppable1, droppable2, droppable3])

      expect(results).toHaveLength(2)
      expect(results).toContain(droppable1)
      expect(results).toContain(droppable2)
      expect(results).not.toContain(droppable3)
    })

    it('should return empty array when no overlaps', () => {
      const draggable = createMockDraggable(createRect(0, 0, 50, 50))
      const droppable = createMockDroppable('drop-1', createRect(200, 200, 100, 100))

      const results = api.detectAll(draggable, [droppable])
      expect(results).toEqual([])
    })
  })

  describe('setAlgorithm / getAlgorithm', () => {
    it('should set and get algorithm', () => {
      api.setAlgorithm('center')
      expect(api.getAlgorithm()).toBe('center')

      api.setAlgorithm('pointer')
      expect(api.getAlgorithm()).toBe('pointer')

      api.setAlgorithm('closest')
      expect(api.getAlgorithm()).toBe('closest')
    })

    it('should return "custom" for function algorithm', () => {
      api.setAlgorithm(() => null)
      expect(api.getAlgorithm()).toBe('custom')
    })

    it('should default to rectangle', () => {
      // Fresh install
      collisionDetectorPlugin.install(mockKernel)
      api = collisionDetectorPlugin.api
      expect(api.getAlgorithm()).toBe('rectangle')
    })
  })

  describe('uninstall', () => {
    it('should not throw on uninstall', () => {
      expect(() => collisionDetectorPlugin.uninstall()).not.toThrow()
    })
  })
})
