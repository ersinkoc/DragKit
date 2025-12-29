/**
 * Auto-scroll Plugin
 * Automatic scrolling when dragging near edges
 */

import type { Plugin, Kernel, Position } from '../../types'

export interface AutoScrollOptions {
  speed?: number
  threshold?: number
  acceleration?: number
  maxSpeed?: number
  scrollableElements?: 'auto' | HTMLElement[]
  scrollWindow?: boolean
}

interface AutoScrollAPI {
  enable(): void
  disable(): void
  isEnabled(): boolean
  setSpeed(speed: number): void
  setThreshold(threshold: number): void
}

interface ScrollableInfo {
  element: HTMLElement | Window
  rect: DOMRect | { top: number; left: number; bottom: number; right: number; width: number; height: number }
}

class AutoScrollImpl implements AutoScrollAPI {
  private enabled = true
  private speed: number
  private threshold: number
  private acceleration: number
  private maxSpeed: number
  private scrollWindow: boolean
  private scrollableElements: 'auto' | HTMLElement[]
  private animationFrame: number | null = null
  private lastPosition: Position | null = null
  private unsubscribers: (() => void)[] = []

  constructor(
    private kernel: Kernel,
    options: AutoScrollOptions = {}
  ) {
    this.speed = options.speed ?? 10
    this.threshold = options.threshold ?? 50
    this.acceleration = options.acceleration ?? 1
    this.maxSpeed = options.maxSpeed ?? 50
    this.scrollWindow = options.scrollWindow ?? true
    this.scrollableElements = options.scrollableElements ?? 'auto'
  }

  attach(): void {
    const unsubMove = this.kernel.on('drag:move', (event) => {
      this.lastPosition = event.position
      this.scheduleScroll()
    })

    const unsubEnd = this.kernel.on('drag:end', () => {
      this.stopScroll()
    })

    const unsubCancel = this.kernel.on('drag:cancel', () => {
      this.stopScroll()
    })

    this.unsubscribers = [unsubMove, unsubEnd, unsubCancel]
  }

  detach(): void {
    this.unsubscribers.forEach(unsub => unsub())
    this.unsubscribers = []
    this.stopScroll()
  }

  enable(): void {
    this.enabled = true
  }

  disable(): void {
    this.enabled = false
    this.stopScroll()
  }

  isEnabled(): boolean {
    return this.enabled
  }

  setSpeed(speed: number): void {
    this.speed = speed
  }

  setThreshold(threshold: number): void {
    this.threshold = threshold
  }

  private scheduleScroll(): void {
    if (this.animationFrame !== null) return
    this.animationFrame = requestAnimationFrame(() => this.performScroll())
  }

  private stopScroll(): void {
    if (this.animationFrame !== null) {
      cancelAnimationFrame(this.animationFrame)
      this.animationFrame = null
    }
    this.lastPosition = null
  }

  private performScroll(): void {
    this.animationFrame = null

    if (!this.enabled || !this.lastPosition) return

    const scrollables = this.getScrollableElements()
    let scrolled = false

    for (const { element, rect } of scrollables) {
      const scrollAmount = this.calculateScrollAmount(this.lastPosition, rect)

      if (scrollAmount.x !== 0 || scrollAmount.y !== 0) {
        if (element === window) {
          window.scrollBy(scrollAmount.x, scrollAmount.y)
        } else {
          (element as HTMLElement).scrollLeft += scrollAmount.x;
          (element as HTMLElement).scrollTop += scrollAmount.y
        }
        scrolled = true
      }
    }

    if (scrolled && this.kernel.isDragging()) {
      this.animationFrame = requestAnimationFrame(() => this.performScroll())
    }
  }

  private calculateScrollAmount(position: Position, rect: ScrollableInfo['rect']): Position {
    const amount = { x: 0, y: 0 }

    // Calculate distance from edges
    const distanceFromTop = position.y - rect.top
    const distanceFromBottom = rect.bottom - position.y
    const distanceFromLeft = position.x - rect.left
    const distanceFromRight = rect.right - position.x

    // Vertical scrolling
    if (distanceFromTop < this.threshold && distanceFromTop > 0) {
      const intensity = 1 - (distanceFromTop / this.threshold)
      amount.y = -this.calculateSpeed(intensity)
    } else if (distanceFromBottom < this.threshold && distanceFromBottom > 0) {
      const intensity = 1 - (distanceFromBottom / this.threshold)
      amount.y = this.calculateSpeed(intensity)
    }

    // Horizontal scrolling
    if (distanceFromLeft < this.threshold && distanceFromLeft > 0) {
      const intensity = 1 - (distanceFromLeft / this.threshold)
      amount.x = -this.calculateSpeed(intensity)
    } else if (distanceFromRight < this.threshold && distanceFromRight > 0) {
      const intensity = 1 - (distanceFromRight / this.threshold)
      amount.x = this.calculateSpeed(intensity)
    }

    return amount
  }

  private calculateSpeed(intensity: number): number {
    const accelerated = this.speed * Math.pow(intensity, this.acceleration)
    return Math.min(accelerated, this.maxSpeed)
  }

  private getScrollableElements(): ScrollableInfo[] {
    const scrollables: ScrollableInfo[] = []

    if (this.scrollWindow) {
      scrollables.push({
        element: window,
        rect: {
          top: 0,
          left: 0,
          bottom: window.innerHeight,
          right: window.innerWidth,
          width: window.innerWidth,
          height: window.innerHeight
        }
      })
    }

    if (this.scrollableElements === 'auto') {
      // Find scrollable elements automatically
      const elements = document.querySelectorAll('[data-droppable-id]')
      elements.forEach(el => {
        if (this.isScrollable(el as HTMLElement)) {
          scrollables.push({
            element: el as HTMLElement,
            rect: el.getBoundingClientRect()
          })
        }
      })
    } else {
      this.scrollableElements.forEach(el => {
        scrollables.push({
          element: el,
          rect: el.getBoundingClientRect()
        })
      })
    }

    return scrollables
  }

  private isScrollable(element: HTMLElement): boolean {
    const style = getComputedStyle(element)
    const overflowY = style.overflowY
    const overflowX = style.overflowX

    return (
      (overflowY === 'auto' || overflowY === 'scroll' || overflowX === 'auto' || overflowX === 'scroll') &&
      (element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth)
    )
  }
}

export function autoScroll(options: AutoScrollOptions = {}): Plugin & { api?: AutoScrollAPI } {
  let instance: AutoScrollImpl | null = null

  return {
    name: 'auto-scroll',
    version: '1.0.0',
    type: 'optional',

    install(kernel: Kernel) {
      instance = new AutoScrollImpl(kernel, options)
      instance.attach()
      ;(this as any).api = instance
    },

    uninstall() {
      if (instance) {
        instance.detach()
        instance = null
      }
    }
  }
}

export type { AutoScrollAPI }
