/**
 * DOM Utilities
 * Zero-dependency DOM manipulation and query functions
 */

import type { Position } from '../types'

/**
 * Get all scrollable ancestors of an element
 */
export function getScrollableAncestors(element: HTMLElement): HTMLElement[] {
  const scrollableAncestors: HTMLElement[] = []
  let currentElement: HTMLElement | null = element.parentElement

  while (currentElement && currentElement !== document.body) {
    const { overflow, overflowX, overflowY } = window.getComputedStyle(currentElement)

    if (
      /auto|scroll|overlay/.test(overflow + overflowX + overflowY) &&
      (currentElement.scrollHeight > currentElement.clientHeight ||
        currentElement.scrollWidth > currentElement.clientWidth)
    ) {
      scrollableAncestors.push(currentElement)
    }

    currentElement = currentElement.parentElement
  }

  // Always include document.body if it's scrollable
  if (
    document.body.scrollHeight > document.body.clientHeight ||
    document.body.scrollWidth > document.body.clientWidth
  ) {
    scrollableAncestors.push(document.body)
  }

  return scrollableAncestors
}

/**
 * Check if element is visible in viewport
 */
export function isElementVisible(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect()
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  )
}

/**
 * Get element's position relative to another element
 */
export function getRelativePosition(element: HTMLElement, relativeTo: HTMLElement): Position {
  const elementRect = element.getBoundingClientRect()
  const relativeRect = relativeTo.getBoundingClientRect()

  return {
    x: elementRect.left - relativeRect.left,
    y: elementRect.top - relativeRect.top
  }
}

/**
 * Clone element for drag preview
 */
export function cloneElement(element: HTMLElement): HTMLElement {
  const clone = element.cloneNode(true) as HTMLElement

  // Copy computed styles
  const computedStyle = window.getComputedStyle(element)
  const stylesToCopy = [
    'width',
    'height',
    'padding',
    'margin',
    'border',
    'font',
    'color',
    'background',
    'box-shadow'
  ]

  stylesToCopy.forEach(prop => {
    clone.style[prop as unknown as number] = computedStyle.getPropertyValue(prop)
  })

  return clone
}

/**
 * Find closest element matching selector
 */
export function findClosest(element: Element, selector: string): HTMLElement | null {
  return element.closest(selector)
}

/**
 * Get element by data attribute
 */
export function getElementByDataAttribute(
  attribute: string,
  value: string,
  root: Document | HTMLElement = document
): HTMLElement | null {
  return root.querySelector(`[${attribute}="${value}"]`)
}

/**
 * Check if element has scrollbar
 */
export function hasScrollbar(element: HTMLElement): { vertical: boolean; horizontal: boolean } {
  return {
    vertical: element.scrollHeight > element.clientHeight,
    horizontal: element.scrollWidth > element.clientWidth
  }
}

/**
 * Get viewport size
 */
export function getViewportSize(): { width: number; height: number } {
  return {
    width: window.innerWidth || document.documentElement.clientWidth,
    height: window.innerHeight || document.documentElement.clientHeight
  }
}
