/**
 * Scroll Utilities
 * Functions for scroll management and calculations
 */

import type { Position } from '../types'

/**
 * Get the scrollable parent of an element
 */
export function getScrollParent(element: HTMLElement): HTMLElement | null {
  let parent: HTMLElement | null = element.parentElement

  while (parent) {
    const { overflow, overflowX, overflowY } = window.getComputedStyle(parent)

    if (/auto|scroll/.test(overflow + overflowX + overflowY)) {
      return parent
    }

    parent = parent.parentElement
  }

  return document.documentElement as HTMLElement
}

/**
 * Scroll element into view smoothly
 */
export function scrollIntoView(element: HTMLElement, container?: HTMLElement): void {
  const targetContainer = container || getScrollParent(element) || document.documentElement

  element.scrollIntoView({
    behavior: 'smooth',
    block: 'nearest',
    inline: 'nearest'
  })
}

/**
 * Get scroll position of an element
 */
export function getScrollPosition(element: HTMLElement | Window = window): Position {
  if (element === window) {
    return {
      x: window.scrollX || window.pageXOffset,
      y: window.scrollY || window.pageYOffset
    }
  }

  return {
    x: (element as HTMLElement).scrollLeft,
    y: (element as HTMLElement).scrollTop
  }
}

/**
 * Set scroll position of an element
 */
export function setScrollPosition(
  element: HTMLElement | Window,
  position: Partial<Position>
): void {
  if (element === window) {
    window.scrollTo(position.x ?? window.scrollX, position.y ?? window.scrollY)
  } else {
    if (position.x !== undefined) {
      (element as HTMLElement).scrollLeft = position.x
    }
    if (position.y !== undefined) {
      (element as HTMLElement).scrollTop = position.y
    }
  }
}

/**
 * Calculate auto-scroll speed based on distance from edge
 */
export function calculateScrollSpeed(
  distanceFromEdge: number,
  threshold: number,
  baseSpeed: number,
  acceleration: number = 1
): number {
  if (distanceFromEdge >= threshold) return 0

  const proximityRatio = 1 - distanceFromEdge / threshold
  return baseSpeed * Math.pow(proximityRatio, acceleration)
}

/**
 * Check if element can scroll in a direction
 */
export function canScroll(
  element: HTMLElement,
  direction: 'up' | 'down' | 'left' | 'right'
): boolean {
  switch (direction) {
    case 'up':
      return element.scrollTop > 0
    case 'down':
      return element.scrollTop < element.scrollHeight - element.clientHeight
    case 'left':
      return element.scrollLeft > 0
    case 'right':
      return element.scrollLeft < element.scrollWidth - element.clientWidth
  }
}
