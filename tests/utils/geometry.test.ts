/**
 * Geometry Utilities Tests
 */
import { describe, it, expect } from 'vitest'
import {
  rectangleIntersection,
  getCenter,
  pointInside,
  getDistance,
  clamp,
  getArea,
  getIntersectionArea,
  getCorners
} from '../../src/utils/geometry'

// Helper function to create DOMRect-like objects
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

describe('Geometry Utilities', () => {
  describe('rectangleIntersection', () => {
    it('should detect overlapping rectangles', () => {
      const a = createRect(0, 0, 100, 100)
      const b = createRect(50, 50, 100, 100)
      expect(rectangleIntersection(a, b)).toBe(true)
    })

    it('should detect non-overlapping rectangles', () => {
      const a = createRect(0, 0, 100, 100)
      const b = createRect(200, 200, 100, 100)
      expect(rectangleIntersection(a, b)).toBe(false)
    })

    it('should detect adjacent rectangles (no gap)', () => {
      const a = createRect(0, 0, 100, 100)
      const b = createRect(100, 0, 100, 100)
      expect(rectangleIntersection(a, b)).toBe(true)
    })

    it('should detect contained rectangle', () => {
      const a = createRect(0, 0, 200, 200)
      const b = createRect(50, 50, 50, 50)
      expect(rectangleIntersection(a, b)).toBe(true)
    })

    it('should handle same rectangle', () => {
      const a = createRect(0, 0, 100, 100)
      expect(rectangleIntersection(a, a)).toBe(true)
    })

    it('should detect horizontal gap', () => {
      const a = createRect(0, 0, 100, 100)
      const b = createRect(150, 0, 100, 100)
      expect(rectangleIntersection(a, b)).toBe(false)
    })

    it('should detect vertical gap', () => {
      const a = createRect(0, 0, 100, 100)
      const b = createRect(0, 150, 100, 100)
      expect(rectangleIntersection(a, b)).toBe(false)
    })
  })

  describe('getCenter', () => {
    it('should calculate center of rectangle', () => {
      const rect = createRect(0, 0, 100, 100)
      expect(getCenter(rect)).toEqual({ x: 50, y: 50 })
    })

    it('should handle offset rectangle', () => {
      const rect = createRect(100, 200, 50, 100)
      expect(getCenter(rect)).toEqual({ x: 125, y: 250 })
    })

    it('should handle zero size', () => {
      const rect = createRect(50, 50, 0, 0)
      expect(getCenter(rect)).toEqual({ x: 50, y: 50 })
    })
  })

  describe('pointInside', () => {
    const rect = createRect(0, 0, 100, 100)

    it('should detect point inside', () => {
      expect(pointInside({ x: 50, y: 50 }, rect)).toBe(true)
    })

    it('should detect point outside', () => {
      expect(pointInside({ x: 150, y: 50 }, rect)).toBe(false)
    })

    it('should detect point on edge', () => {
      expect(pointInside({ x: 0, y: 0 }, rect)).toBe(true)
      expect(pointInside({ x: 100, y: 100 }, rect)).toBe(true)
    })

    it('should detect point above', () => {
      expect(pointInside({ x: 50, y: -10 }, rect)).toBe(false)
    })

    it('should detect point below', () => {
      expect(pointInside({ x: 50, y: 150 }, rect)).toBe(false)
    })

    it('should detect point to left', () => {
      expect(pointInside({ x: -10, y: 50 }, rect)).toBe(false)
    })

    it('should detect point to right', () => {
      expect(pointInside({ x: 150, y: 50 }, rect)).toBe(false)
    })
  })

  describe('getDistance', () => {
    it('should calculate distance between points', () => {
      expect(getDistance({ x: 0, y: 0 }, { x: 3, y: 4 })).toBe(5)
    })

    it('should handle same point', () => {
      expect(getDistance({ x: 10, y: 20 }, { x: 10, y: 20 })).toBe(0)
    })

    it('should handle horizontal distance', () => {
      expect(getDistance({ x: 0, y: 0 }, { x: 10, y: 0 })).toBe(10)
    })

    it('should handle vertical distance', () => {
      expect(getDistance({ x: 0, y: 0 }, { x: 0, y: 10 })).toBe(10)
    })

    it('should handle negative coordinates', () => {
      expect(getDistance({ x: -3, y: -4 }, { x: 0, y: 0 })).toBe(5)
    })
  })

  describe('clamp', () => {
    it('should clamp value within range', () => {
      expect(clamp(5, 0, 10)).toBe(5)
    })

    it('should clamp value below min', () => {
      expect(clamp(-5, 0, 10)).toBe(0)
    })

    it('should clamp value above max', () => {
      expect(clamp(15, 0, 10)).toBe(10)
    })

    it('should handle equal min and max', () => {
      expect(clamp(5, 5, 5)).toBe(5)
    })

    it('should handle negative range', () => {
      expect(clamp(-5, -10, -1)).toBe(-5)
      expect(clamp(-15, -10, -1)).toBe(-10)
      expect(clamp(0, -10, -1)).toBe(-1)
    })
  })

  describe('getArea', () => {
    it('should calculate area of rectangle', () => {
      const rect = createRect(0, 0, 100, 50)
      expect(getArea(rect)).toBe(5000)
    })

    it('should handle square', () => {
      const rect = createRect(0, 0, 10, 10)
      expect(getArea(rect)).toBe(100)
    })

    it('should handle zero size', () => {
      const rect = createRect(0, 0, 0, 0)
      expect(getArea(rect)).toBe(0)
    })
  })

  describe('getIntersectionArea', () => {
    it('should calculate intersection area', () => {
      const a = createRect(0, 0, 100, 100)
      const b = createRect(50, 50, 100, 100)
      expect(getIntersectionArea(a, b)).toBe(2500) // 50x50 intersection
    })

    it('should return 0 for non-overlapping', () => {
      const a = createRect(0, 0, 100, 100)
      const b = createRect(200, 200, 100, 100)
      expect(getIntersectionArea(a, b)).toBe(0)
    })

    it('should handle contained rectangle', () => {
      const a = createRect(0, 0, 200, 200)
      const b = createRect(50, 50, 50, 50)
      expect(getIntersectionArea(a, b)).toBe(2500)
    })

    it('should handle same rectangle', () => {
      const a = createRect(0, 0, 100, 100)
      expect(getIntersectionArea(a, a)).toBe(10000)
    })
  })

  describe('getCorners', () => {
    it('should return all four corners', () => {
      const rect = createRect(0, 0, 100, 100)
      const corners = getCorners(rect)

      expect(corners).toHaveLength(4)
      expect(corners[0]).toEqual({ x: 0, y: 0 }) // top-left
      expect(corners[1]).toEqual({ x: 100, y: 0 }) // top-right
      expect(corners[2]).toEqual({ x: 100, y: 100 }) // bottom-right
      expect(corners[3]).toEqual({ x: 0, y: 100 }) // bottom-left
    })

    it('should handle offset rectangle', () => {
      const rect = createRect(50, 100, 200, 150)
      const corners = getCorners(rect)

      expect(corners[0]).toEqual({ x: 50, y: 100 })
      expect(corners[1]).toEqual({ x: 250, y: 100 })
      expect(corners[2]).toEqual({ x: 250, y: 250 })
      expect(corners[3]).toEqual({ x: 50, y: 250 })
    })
  })
})
