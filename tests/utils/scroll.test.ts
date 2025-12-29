/**
 * Scroll Utilities Tests
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  getScrollParent,
  scrollIntoView,
  getScrollPosition,
  setScrollPosition,
  calculateScrollSpeed,
  canScroll
} from '../../src/utils/scroll'

describe('Scroll Utilities', () => {
  let container: HTMLDivElement

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
  })

  afterEach(() => {
    document.body.removeChild(container)
  })

  describe('getScrollParent', () => {
    it('should return document.documentElement if no scrollable parent', () => {
      const element = document.createElement('div')
      container.appendChild(element)

      vi.spyOn(window, 'getComputedStyle').mockReturnValue({
        overflow: 'visible',
        overflowX: 'visible',
        overflowY: 'visible'
      } as CSSStyleDeclaration)

      const result = getScrollParent(element)
      expect(result).toBe(document.documentElement)
    })

    it('should find scrollable parent with overflow auto', () => {
      const scrollable = document.createElement('div')
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

      const result = getScrollParent(element)
      expect(result).toBe(scrollable)
    })

    it('should find scrollable parent with overflow scroll', () => {
      const scrollable = document.createElement('div')
      container.appendChild(scrollable)

      const element = document.createElement('div')
      scrollable.appendChild(element)

      vi.spyOn(window, 'getComputedStyle').mockImplementation((el) => {
        if (el === scrollable) {
          return {
            overflow: 'scroll',
            overflowX: 'scroll',
            overflowY: 'scroll'
          } as CSSStyleDeclaration
        }
        return {
          overflow: 'visible',
          overflowX: 'visible',
          overflowY: 'visible'
        } as CSSStyleDeclaration
      })

      const result = getScrollParent(element)
      expect(result).toBe(scrollable)
    })
  })

  describe('scrollIntoView', () => {
    it('should call scrollIntoView on element', () => {
      const element = document.createElement('div')
      element.scrollIntoView = vi.fn()
      container.appendChild(element)

      scrollIntoView(element)

      expect(element.scrollIntoView).toHaveBeenCalledWith({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'nearest'
      })
    })

    it('should work with container parameter', () => {
      const element = document.createElement('div')
      element.scrollIntoView = vi.fn()
      container.appendChild(element)

      scrollIntoView(element, container)

      expect(element.scrollIntoView).toHaveBeenCalled()
    })
  })

  describe('getScrollPosition', () => {
    it('should get window scroll position', () => {
      Object.defineProperty(window, 'scrollX', { value: 100, configurable: true })
      Object.defineProperty(window, 'scrollY', { value: 200, configurable: true })

      const pos = getScrollPosition(window)
      expect(pos).toEqual({ x: 100, y: 200 })
    })

    it('should get element scroll position', () => {
      const element = document.createElement('div')
      Object.defineProperty(element, 'scrollLeft', { value: 50, configurable: true })
      Object.defineProperty(element, 'scrollTop', { value: 75, configurable: true })

      const pos = getScrollPosition(element)
      expect(pos).toEqual({ x: 50, y: 75 })
    })

    it('should use default window', () => {
      Object.defineProperty(window, 'scrollX', { value: 10, configurable: true })
      Object.defineProperty(window, 'scrollY', { value: 20, configurable: true })

      const pos = getScrollPosition()
      expect(pos).toEqual({ x: 10, y: 20 })
    })

    it('should fallback to pageXOffset/pageYOffset', () => {
      Object.defineProperty(window, 'scrollX', { value: undefined, configurable: true })
      Object.defineProperty(window, 'scrollY', { value: undefined, configurable: true })
      Object.defineProperty(window, 'pageXOffset', { value: 30, configurable: true })
      Object.defineProperty(window, 'pageYOffset', { value: 40, configurable: true })

      const pos = getScrollPosition(window)
      expect(pos.x).toBe(30)
      expect(pos.y).toBe(40)
    })
  })

  describe('setScrollPosition', () => {
    it('should set window scroll position', () => {
      const scrollToSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})

      setScrollPosition(window, { x: 100, y: 200 })

      expect(scrollToSpy).toHaveBeenCalledWith(100, 200)
    })

    it('should set element scroll position', () => {
      const element = document.createElement('div')
      container.appendChild(element)

      setScrollPosition(element, { x: 50, y: 75 })

      expect(element.scrollLeft).toBe(50)
      expect(element.scrollTop).toBe(75)
    })

    it('should set only x position', () => {
      const element = document.createElement('div')
      element.scrollTop = 100
      container.appendChild(element)

      setScrollPosition(element, { x: 50 })

      expect(element.scrollLeft).toBe(50)
      expect(element.scrollTop).toBe(100) // unchanged
    })

    it('should set only y position', () => {
      const element = document.createElement('div')
      element.scrollLeft = 100
      container.appendChild(element)

      setScrollPosition(element, { y: 75 })

      expect(element.scrollLeft).toBe(100) // unchanged
      expect(element.scrollTop).toBe(75)
    })

    it('should handle partial window position', () => {
      Object.defineProperty(window, 'scrollX', { value: 50, configurable: true })
      Object.defineProperty(window, 'scrollY', { value: 100, configurable: true })
      const scrollToSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})

      setScrollPosition(window, { x: 200 })

      expect(scrollToSpy).toHaveBeenCalledWith(200, 100)
    })
  })

  describe('calculateScrollSpeed', () => {
    it('should return 0 when distance is beyond threshold', () => {
      expect(calculateScrollSpeed(100, 50, 10)).toBe(0)
    })

    it('should return base speed at edge', () => {
      expect(calculateScrollSpeed(0, 50, 10)).toBe(10)
    })

    it('should return proportional speed', () => {
      const speed = calculateScrollSpeed(25, 50, 10)
      expect(speed).toBeCloseTo(5)
    })

    it('should apply acceleration', () => {
      const linearSpeed = calculateScrollSpeed(25, 50, 10, 1)
      const acceleratedSpeed = calculateScrollSpeed(25, 50, 10, 2)

      expect(acceleratedSpeed).toBeLessThan(linearSpeed)
    })

    it('should return 0 when exactly at threshold', () => {
      expect(calculateScrollSpeed(50, 50, 10)).toBe(0)
    })
  })

  describe('canScroll', () => {
    it('should detect can scroll up', () => {
      const element = document.createElement('div')
      Object.defineProperty(element, 'scrollTop', { value: 100, configurable: true })

      expect(canScroll(element, 'up')).toBe(true)
    })

    it('should detect cannot scroll up when at top', () => {
      const element = document.createElement('div')
      Object.defineProperty(element, 'scrollTop', { value: 0, configurable: true })

      expect(canScroll(element, 'up')).toBe(false)
    })

    it('should detect can scroll down', () => {
      const element = document.createElement('div')
      Object.defineProperty(element, 'scrollTop', { value: 0, configurable: true })
      Object.defineProperty(element, 'scrollHeight', { value: 500, configurable: true })
      Object.defineProperty(element, 'clientHeight', { value: 200, configurable: true })

      expect(canScroll(element, 'down')).toBe(true)
    })

    it('should detect cannot scroll down when at bottom', () => {
      const element = document.createElement('div')
      Object.defineProperty(element, 'scrollTop', { value: 300, configurable: true })
      Object.defineProperty(element, 'scrollHeight', { value: 500, configurable: true })
      Object.defineProperty(element, 'clientHeight', { value: 200, configurable: true })

      expect(canScroll(element, 'down')).toBe(false)
    })

    it('should detect can scroll left', () => {
      const element = document.createElement('div')
      Object.defineProperty(element, 'scrollLeft', { value: 100, configurable: true })

      expect(canScroll(element, 'left')).toBe(true)
    })

    it('should detect cannot scroll left when at start', () => {
      const element = document.createElement('div')
      Object.defineProperty(element, 'scrollLeft', { value: 0, configurable: true })

      expect(canScroll(element, 'left')).toBe(false)
    })

    it('should detect can scroll right', () => {
      const element = document.createElement('div')
      Object.defineProperty(element, 'scrollLeft', { value: 0, configurable: true })
      Object.defineProperty(element, 'scrollWidth', { value: 500, configurable: true })
      Object.defineProperty(element, 'clientWidth', { value: 200, configurable: true })

      expect(canScroll(element, 'right')).toBe(true)
    })

    it('should detect cannot scroll right when at end', () => {
      const element = document.createElement('div')
      Object.defineProperty(element, 'scrollLeft', { value: 300, configurable: true })
      Object.defineProperty(element, 'scrollWidth', { value: 500, configurable: true })
      Object.defineProperty(element, 'clientWidth', { value: 200, configurable: true })

      expect(canScroll(element, 'right')).toBe(false)
    })
  })
})
