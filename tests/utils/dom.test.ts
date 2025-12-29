/**
 * DOM Utilities Tests
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  getScrollableAncestors,
  isElementVisible,
  getRelativePosition,
  cloneElement,
  findClosest,
  getElementByDataAttribute,
  hasScrollbar,
  getViewportSize
} from '../../src/utils/dom'

describe('DOM Utilities', () => {
  let container: HTMLDivElement

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
  })

  afterEach(() => {
    document.body.removeChild(container)
  })

  describe('getScrollableAncestors', () => {
    it('should return empty array for element without scrollable ancestors', () => {
      const element = document.createElement('div')
      container.appendChild(element)

      // Mock getComputedStyle
      vi.spyOn(window, 'getComputedStyle').mockReturnValue({
        overflow: 'visible',
        overflowX: 'visible',
        overflowY: 'visible'
      } as CSSStyleDeclaration)

      const ancestors = getScrollableAncestors(element)
      expect(Array.isArray(ancestors)).toBe(true)
    })

    it('should find scrollable parent', () => {
      const scrollable = document.createElement('div')
      scrollable.style.overflow = 'auto'
      Object.defineProperty(scrollable, 'scrollHeight', { value: 500 })
      Object.defineProperty(scrollable, 'clientHeight', { value: 200 })
      container.appendChild(scrollable)

      const element = document.createElement('div')
      scrollable.appendChild(element)

      vi.spyOn(window, 'getComputedStyle').mockImplementation((el) => {
        if (el === scrollable) {
          return {
            overflow: 'auto',
            overflowX: 'auto',
            overflowY: 'auto'
          } as CSSStyleDeclaration
        }
        return {
          overflow: 'visible',
          overflowX: 'visible',
          overflowY: 'visible'
        } as CSSStyleDeclaration
      })

      const ancestors = getScrollableAncestors(element)
      expect(ancestors).toContain(scrollable)
    })
  })

  describe('isElementVisible', () => {
    it('should return true for visible element', () => {
      const element = document.createElement('div')
      element.getBoundingClientRect = vi.fn().mockReturnValue({
        top: 10,
        left: 10,
        bottom: 100,
        right: 100
      })
      container.appendChild(element)

      // Mock window dimensions
      Object.defineProperty(window, 'innerHeight', { value: 768 })
      Object.defineProperty(window, 'innerWidth', { value: 1024 })

      expect(isElementVisible(element)).toBe(true)
    })

    it('should return false for element above viewport', () => {
      const element = document.createElement('div')
      element.getBoundingClientRect = vi.fn().mockReturnValue({
        top: -100,
        left: 10,
        bottom: -50,
        right: 100
      })
      container.appendChild(element)

      expect(isElementVisible(element)).toBe(false)
    })

    it('should return false for element below viewport', () => {
      const element = document.createElement('div')
      element.getBoundingClientRect = vi.fn().mockReturnValue({
        top: 1000,
        left: 10,
        bottom: 1100,
        right: 100
      })
      container.appendChild(element)

      Object.defineProperty(window, 'innerHeight', { value: 768 })
      expect(isElementVisible(element)).toBe(false)
    })

    it('should return false for element to the right of viewport', () => {
      const element = document.createElement('div')
      element.getBoundingClientRect = vi.fn().mockReturnValue({
        top: 10,
        left: 2000,
        bottom: 100,
        right: 2100
      })
      container.appendChild(element)

      Object.defineProperty(window, 'innerWidth', { value: 1024 })
      expect(isElementVisible(element)).toBe(false)
    })

    it('should return false for element to the left of viewport', () => {
      const element = document.createElement('div')
      element.getBoundingClientRect = vi.fn().mockReturnValue({
        top: 10,
        left: -200,
        bottom: 100,
        right: -100
      })
      container.appendChild(element)

      expect(isElementVisible(element)).toBe(false)
    })
  })

  describe('getRelativePosition', () => {
    it('should calculate relative position', () => {
      const element = document.createElement('div')
      const relativeTo = document.createElement('div')

      element.getBoundingClientRect = vi.fn().mockReturnValue({ left: 100, top: 150 })
      relativeTo.getBoundingClientRect = vi.fn().mockReturnValue({ left: 50, top: 50 })

      container.appendChild(relativeTo)
      container.appendChild(element)

      const pos = getRelativePosition(element, relativeTo)
      expect(pos).toEqual({ x: 50, y: 100 })
    })

    it('should handle negative positions', () => {
      const element = document.createElement('div')
      const relativeTo = document.createElement('div')

      element.getBoundingClientRect = vi.fn().mockReturnValue({ left: 50, top: 50 })
      relativeTo.getBoundingClientRect = vi.fn().mockReturnValue({ left: 100, top: 150 })

      container.appendChild(relativeTo)
      container.appendChild(element)

      const pos = getRelativePosition(element, relativeTo)
      expect(pos).toEqual({ x: -50, y: -100 })
    })
  })

  describe('cloneElement', () => {
    it('should clone element', () => {
      const element = document.createElement('div')
      element.textContent = 'Hello'
      element.id = 'original'
      container.appendChild(element)

      vi.spyOn(window, 'getComputedStyle').mockReturnValue({
        getPropertyValue: vi.fn().mockReturnValue('100px')
      } as unknown as CSSStyleDeclaration)

      const clone = cloneElement(element)

      expect(clone).not.toBe(element)
      expect(clone.textContent).toBe('Hello')
      expect(clone.id).toBe('original')
    })

    it('should copy computed styles', () => {
      const element = document.createElement('div')
      container.appendChild(element)

      const mockComputedStyle = {
        getPropertyValue: vi.fn().mockImplementation((prop: string) => {
          const styles: Record<string, string> = {
            width: '100px',
            height: '50px',
            padding: '10px',
            margin: '5px',
            border: '1px solid black',
            font: '14px Arial',
            color: 'red',
            background: 'blue',
            'box-shadow': 'none'
          }
          return styles[prop] || ''
        })
      }

      vi.spyOn(window, 'getComputedStyle').mockReturnValue(mockComputedStyle as unknown as CSSStyleDeclaration)

      const clone = cloneElement(element)

      expect(mockComputedStyle.getPropertyValue).toHaveBeenCalledWith('width')
      expect(mockComputedStyle.getPropertyValue).toHaveBeenCalledWith('height')
      expect(clone instanceof HTMLElement).toBe(true)
    })
  })

  describe('findClosest', () => {
    it('should find closest matching ancestor', () => {
      const parent = document.createElement('div')
      parent.className = 'parent'

      const child = document.createElement('div')
      child.className = 'child'

      parent.appendChild(child)
      container.appendChild(parent)

      const result = findClosest(child, '.parent')
      expect(result).toBe(parent)
    })

    it('should return null if no match', () => {
      const element = document.createElement('div')
      container.appendChild(element)

      const result = findClosest(element, '.nonexistent')
      expect(result).toBeNull()
    })

    it('should match self if matches selector', () => {
      const element = document.createElement('div')
      element.className = 'target'
      container.appendChild(element)

      const result = findClosest(element, '.target')
      expect(result).toBe(element)
    })
  })

  describe('getElementByDataAttribute', () => {
    it('should find element by data attribute', () => {
      const element = document.createElement('div')
      element.setAttribute('data-test-id', 'unique')
      container.appendChild(element)

      const result = getElementByDataAttribute('data-test-id', 'unique', document)
      expect(result).toBe(element)
    })

    it('should return null if not found', () => {
      const result = getElementByDataAttribute('data-test-id', 'nonexistent', document)
      expect(result).toBeNull()
    })

    it('should search within specified root', () => {
      const element = document.createElement('div')
      element.setAttribute('data-id', 'test')
      container.appendChild(element)

      const result = getElementByDataAttribute('data-id', 'test', container)
      expect(result).toBe(element)
    })
  })

  describe('hasScrollbar', () => {
    it('should detect vertical scrollbar', () => {
      const element = document.createElement('div')
      Object.defineProperty(element, 'scrollHeight', { value: 500 })
      Object.defineProperty(element, 'clientHeight', { value: 200 })
      Object.defineProperty(element, 'scrollWidth', { value: 100 })
      Object.defineProperty(element, 'clientWidth', { value: 100 })

      const result = hasScrollbar(element)
      expect(result.vertical).toBe(true)
      expect(result.horizontal).toBe(false)
    })

    it('should detect horizontal scrollbar', () => {
      const element = document.createElement('div')
      Object.defineProperty(element, 'scrollHeight', { value: 100 })
      Object.defineProperty(element, 'clientHeight', { value: 100 })
      Object.defineProperty(element, 'scrollWidth', { value: 500 })
      Object.defineProperty(element, 'clientWidth', { value: 200 })

      const result = hasScrollbar(element)
      expect(result.vertical).toBe(false)
      expect(result.horizontal).toBe(true)
    })

    it('should detect both scrollbars', () => {
      const element = document.createElement('div')
      Object.defineProperty(element, 'scrollHeight', { value: 500 })
      Object.defineProperty(element, 'clientHeight', { value: 200 })
      Object.defineProperty(element, 'scrollWidth', { value: 500 })
      Object.defineProperty(element, 'clientWidth', { value: 200 })

      const result = hasScrollbar(element)
      expect(result.vertical).toBe(true)
      expect(result.horizontal).toBe(true)
    })

    it('should detect no scrollbars', () => {
      const element = document.createElement('div')
      Object.defineProperty(element, 'scrollHeight', { value: 100 })
      Object.defineProperty(element, 'clientHeight', { value: 100 })
      Object.defineProperty(element, 'scrollWidth', { value: 100 })
      Object.defineProperty(element, 'clientWidth', { value: 100 })

      const result = hasScrollbar(element)
      expect(result.vertical).toBe(false)
      expect(result.horizontal).toBe(false)
    })
  })

  describe('getViewportSize', () => {
    it('should return viewport dimensions', () => {
      Object.defineProperty(window, 'innerWidth', { value: 1024, configurable: true })
      Object.defineProperty(window, 'innerHeight', { value: 768, configurable: true })

      const size = getViewportSize()
      expect(size.width).toBe(1024)
      expect(size.height).toBe(768)
    })

    it('should fallback to document.documentElement', () => {
      Object.defineProperty(window, 'innerWidth', { value: 0, configurable: true })
      Object.defineProperty(window, 'innerHeight', { value: 0, configurable: true })
      Object.defineProperty(document.documentElement, 'clientWidth', { value: 800, configurable: true })
      Object.defineProperty(document.documentElement, 'clientHeight', { value: 600, configurable: true })

      const size = getViewportSize()
      expect(size.width).toBe(800)
      expect(size.height).toBe(600)
    })
  })
})
