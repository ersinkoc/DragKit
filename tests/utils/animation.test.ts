/**
 * Animation Utilities Tests
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  recordPosition,
  calculateDelta,
  animateMove,
  animateWithKeyframes,
  batchFlipAnimation,
  easingFunctions
} from '../../src/utils/animation'

// Helper function to create DOMRect-like objects
function createRect(left: number, top: number, width: number = 100, height: number = 100): DOMRect {
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

describe('Animation Utilities', () => {
  describe('recordPosition', () => {
    it('should record element position', () => {
      const element = document.createElement('div')
      const mockRect = createRect(100, 200, 50, 75)

      element.getBoundingClientRect = vi.fn().mockReturnValue(mockRect)

      const result = recordPosition(element)

      expect(result).toEqual(mockRect)
      expect(element.getBoundingClientRect).toHaveBeenCalled()
    })
  })

  describe('calculateDelta', () => {
    it('should calculate delta between positions', () => {
      const first = createRect(100, 200)
      const last = createRect(150, 250)

      const delta = calculateDelta(first, last)

      expect(delta).toEqual({ x: -50, y: -50 })
    })

    it('should return zero when positions are same', () => {
      const first = createRect(100, 200)
      const last = createRect(100, 200)

      const delta = calculateDelta(first, last)

      expect(delta).toEqual({ x: 0, y: 0 })
    })

    it('should handle positive delta', () => {
      const first = createRect(150, 250)
      const last = createRect(100, 200)

      const delta = calculateDelta(first, last)

      expect(delta).toEqual({ x: 50, y: 50 })
    })
  })

  describe('animateMove', () => {
    let element: HTMLDivElement
    let mockAnimation: {
      onfinish: (() => void) | null
    }

    beforeEach(() => {
      element = document.createElement('div')
      mockAnimation = { onfinish: null }

      element.animate = vi.fn().mockReturnValue(mockAnimation)
    })

    it('should animate element from one position to another', async () => {
      const from = createRect(100, 100)
      const to = createRect(150, 200)

      const promise = animateMove(element, from, to, { duration: 200, easing: 'ease-out' })

      // Trigger animation finish
      mockAnimation.onfinish?.()

      await promise

      expect(element.animate).toHaveBeenCalledWith(
        [
          { transform: 'translate(-50px, -100px)' },
          { transform: 'translate(0, 0)' }
        ],
        { duration: 200, easing: 'ease-out' }
      )
    })

    it('should resolve immediately if no movement', async () => {
      const from = createRect(100, 100)
      const to = createRect(100, 100)

      const result = await animateMove(element, from, to)

      expect(element.animate).not.toHaveBeenCalled()
      expect(result).toBeUndefined()
    })

    it('should use default options', async () => {
      const from = createRect(100, 100)
      const to = createRect(150, 100)

      const promise = animateMove(element, from, to)
      mockAnimation.onfinish?.()

      await promise

      expect(element.animate).toHaveBeenCalledWith(
        expect.any(Array),
        { duration: 200, easing: 'ease-out' }
      )
    })
  })

  describe('animateWithKeyframes', () => {
    let element: HTMLDivElement
    let mockAnimation: {
      onfinish: (() => void) | null
    }

    beforeEach(() => {
      element = document.createElement('div')
      mockAnimation = { onfinish: null }
      element.animate = vi.fn().mockReturnValue(mockAnimation)
    })

    it('should animate with custom keyframes', async () => {
      const keyframes = [
        { opacity: 0 },
        { opacity: 1 }
      ]

      const promise = animateWithKeyframes(element, keyframes, { duration: 300, easing: 'ease-in' })
      mockAnimation.onfinish?.()

      await promise

      expect(element.animate).toHaveBeenCalledWith(keyframes, {
        duration: 300,
        easing: 'ease-in'
      })
    })
  })

  describe('batchFlipAnimation', () => {
    it('should animate multiple elements', async () => {
      const mockAnimation = { onfinish: null as (() => void) | null }

      const elements = [
        document.createElement('div'),
        document.createElement('div')
      ]

      elements.forEach((el, i) => {
        el.animate = vi.fn().mockReturnValue({ ...mockAnimation })
        el.getBoundingClientRect = vi.fn().mockReturnValue(createRect(100 + i * 50, 100))
      })

      const beforePositions = new Map<HTMLElement, DOMRect>()
      elements.forEach((el, i) => {
        beforePositions.set(el, createRect(50 + i * 50, 50))
      })

      const promises = batchFlipAnimation(elements, beforePositions, { duration: 200, easing: 'ease' })

      // Simulate all animations finishing
      elements.forEach(el => {
        const animate = el.animate as ReturnType<typeof vi.fn>
        const animation = animate.mock.results[0]?.value
        if (animation?.onfinish) {
          animation.onfinish()
        }
      })

      const results = await promises

      expect(results).toHaveLength(2)
      elements.forEach(el => {
        expect(el.animate).toHaveBeenCalled()
      })
    })

    it('should handle elements without recorded position', async () => {
      const element = document.createElement('div')
      element.getBoundingClientRect = vi.fn().mockReturnValue(createRect(100, 100))

      const beforePositions = new Map<HTMLElement, DOMRect>()
      // Don't add the element to beforePositions

      const promises = batchFlipAnimation([element], beforePositions, { duration: 200, easing: 'ease' })

      const results = await promises

      expect(results).toHaveLength(1)
      expect(element.animate).toBeUndefined() // animate was not called
    })
  })

  describe('easingFunctions', () => {
    it('should have standard easing functions', () => {
      expect(easingFunctions.linear).toBe('linear')
      expect(easingFunctions.ease).toBe('ease')
      expect(easingFunctions.easeIn).toBe('ease-in')
      expect(easingFunctions.easeOut).toBe('ease-out')
      expect(easingFunctions.easeInOut).toBe('ease-in-out')
    })

    it('should have quad easing functions', () => {
      expect(easingFunctions.easeInQuad).toContain('cubic-bezier')
      expect(easingFunctions.easeOutQuad).toContain('cubic-bezier')
      expect(easingFunctions.easeInOutQuad).toContain('cubic-bezier')
    })

    it('should have cubic easing functions', () => {
      expect(easingFunctions.easeInCubic).toContain('cubic-bezier')
      expect(easingFunctions.easeOutCubic).toContain('cubic-bezier')
      expect(easingFunctions.easeInOutCubic).toContain('cubic-bezier')
    })

    it('should have quart easing functions', () => {
      expect(easingFunctions.easeInQuart).toContain('cubic-bezier')
      expect(easingFunctions.easeOutQuart).toContain('cubic-bezier')
      expect(easingFunctions.easeInOutQuart).toContain('cubic-bezier')
    })
  })
})
