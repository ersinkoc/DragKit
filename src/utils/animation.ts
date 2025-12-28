/**
 * Animation Utilities
 * FLIP animation technique for smooth reordering
 */

import type { AnimationOptions } from '../types'

/**
 * Record element's position before change (First)
 */
export function recordPosition(element: HTMLElement): DOMRect {
  return element.getBoundingClientRect()
}

/**
 * Calculate delta between old and new position (Invert)
 */
export function calculateDelta(first: DOMRect, last: DOMRect): { x: number; y: number } {
  return {
    x: first.left - last.left,
    y: first.top - last.top
  }
}

/**
 * Animate element using FLIP technique
 * F - First: Record initial position
 * L - Last: Element is in final position
 * I - Invert: Calculate delta
 * P - Play: Animate from inverted to final
 */
export async function animateMove(
  element: HTMLElement,
  from: DOMRect,
  to: DOMRect,
  options: AnimationOptions = { duration: 200, easing: 'ease-out' }
): Promise<void> {
  // Calculate delta
  const deltaX = from.left - to.left
  const deltaY = from.top - to.top

  // If no movement, skip animation
  if (deltaX === 0 && deltaY === 0) {
    return Promise.resolve()
  }

  // Play animation
  return new Promise(resolve => {
    const animation = element.animate(
      [
        { transform: `translate(${deltaX}px, ${deltaY}px)` },
        { transform: 'translate(0, 0)' }
      ],
      {
        duration: options.duration,
        easing: options.easing
      }
    )

    animation.onfinish = () => resolve()
  })
}

/**
 * Animate element with custom keyframes
 */
export async function animateWithKeyframes(
  element: HTMLElement,
  keyframes: Keyframe[],
  options: AnimationOptions
): Promise<void> {
  return new Promise(resolve => {
    const animation = element.animate(keyframes, {
      duration: options.duration,
      easing: options.easing
    })

    animation.onfinish = () => resolve()
  })
}

/**
 * Batch FLIP animations for multiple elements
 */
export function batchFlipAnimation(
  elements: HTMLElement[],
  beforePositions: Map<HTMLElement, DOMRect>,
  options: AnimationOptions
): Promise<void[]> {
  const animations = elements.map(element => {
    const before = beforePositions.get(element)
    if (!before) return Promise.resolve()

    const after = element.getBoundingClientRect()
    return animateMove(element, before, after, options)
  })

  return Promise.all(animations)
}

/**
 * Easing functions
 */
export const easingFunctions = {
  linear: 'linear',
  ease: 'ease',
  easeIn: 'ease-in',
  easeOut: 'ease-out',
  easeInOut: 'ease-in-out',

  // Custom cubic-bezier easings
  easeInQuad: 'cubic-bezier(0.55, 0.085, 0.68, 0.53)',
  easeOutQuad: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  easeInOutQuad: 'cubic-bezier(0.455, 0.03, 0.515, 0.955)',

  easeInCubic: 'cubic-bezier(0.55, 0.055, 0.675, 0.19)',
  easeOutCubic: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
  easeInOutCubic: 'cubic-bezier(0.645, 0.045, 0.355, 1)',

  easeInQuart: 'cubic-bezier(0.895, 0.03, 0.685, 0.22)',
  easeOutQuart: 'cubic-bezier(0.165, 0.84, 0.44, 1)',
  easeInOutQuart: 'cubic-bezier(0.77, 0, 0.175, 1)'
} as const
