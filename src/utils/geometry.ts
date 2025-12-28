/**
 * Geometry Utilities
 * Math functions for position, rect, and collision calculations
 */

import type { Position } from '../types'

/**
 * Check if two rectangles intersect
 */
export function rectangleIntersection(a: DOMRect, b: DOMRect): boolean {
  return !(a.right < b.left || a.left > b.right || a.bottom < b.top || a.top > b.bottom)
}

/**
 * Get the center point of a rectangle
 */
export function getCenter(rect: DOMRect): Position {
  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2
  }
}

/**
 * Check if a point is inside a rectangle
 */
export function pointInside(point: Position, rect: DOMRect): boolean {
  return (
    point.x >= rect.left &&
    point.x <= rect.right &&
    point.y >= rect.top &&
    point.y <= rect.bottom
  )
}

/**
 * Calculate distance between two points
 */
export function getDistance(a: Position, b: Position): number {
  const dx = b.x - a.x
  const dy = b.y - a.y
  return Math.sqrt(dx * dx + dy * dy)
}

/**
 * Clamp a number between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

/**
 * Calculate the area of a rectangle
 */
export function getArea(rect: DOMRect): number {
  return rect.width * rect.height
}

/**
 * Calculate intersection area between two rectangles
 */
export function getIntersectionArea(a: DOMRect, b: DOMRect): number {
  if (!rectangleIntersection(a, b)) return 0

  const left = Math.max(a.left, b.left)
  const right = Math.min(a.right, b.right)
  const top = Math.max(a.top, b.top)
  const bottom = Math.min(a.bottom, b.bottom)

  return (right - left) * (bottom - top)
}

/**
 * Get corners of a rectangle
 */
export function getCorners(rect: DOMRect): Position[] {
  return [
    { x: rect.left, y: rect.top }, // top-left
    { x: rect.right, y: rect.top }, // top-right
    { x: rect.right, y: rect.bottom }, // bottom-right
    { x: rect.left, y: rect.bottom } // bottom-left
  ]
}
