/**
 * Constraints Plugin
 * Axis locking and bounds constraints
 */

import type { Plugin, Kernel, Position } from '../../types'

export type BoundsOption =
  | 'parent'
  | 'window'
  | 'body'
  | HTMLElement
  | BoundsRect

export interface BoundsRect {
  top?: number
  right?: number
  bottom?: number
  left?: number
}

export interface ConstraintsConfig {
  axis?: 'x' | 'y' | 'both'
  bounds?: BoundsOption
  padding?: number | { top?: number; right?: number; bottom?: number; left?: number }
}

interface ConstraintsAPI {
  setAxisLock(id: string, axis: 'x' | 'y' | 'both'): void
  setBounds(id: string, bounds: BoundsOption): void
  clearConstraints(id: string): void
  getConstraints(id: string): ConstraintsConfig | undefined
}

class ConstraintsImpl implements ConstraintsAPI {
  private constraints = new Map<string, ConstraintsConfig>()
  private unsubscribers: (() => void)[] = []

  constructor(private kernel: Kernel) {}

  attach(): void {
    const unsubMove = this.kernel.on('drag:move', (event) => {
      const id = event.draggable.getId()
      const config = this.constraints.get(id)

      if (!config) return

      const currentTransform = event.draggable.getTransform()
      if (!currentTransform) return

      const constrainedTransform = this.applyConstraints(
        currentTransform,
        config,
        event.draggable.getElement()
      )

      if (
        constrainedTransform.x !== currentTransform.x ||
        constrainedTransform.y !== currentTransform.y
      ) {
        event.draggable.setTransform(constrainedTransform)
      }
    })

    this.unsubscribers = [unsubMove]
  }

  detach(): void {
    this.unsubscribers.forEach(unsub => unsub())
    this.unsubscribers = []
    this.constraints.clear()
  }

  setAxisLock(id: string, axis: 'x' | 'y' | 'both'): void {
    const existing = this.constraints.get(id) ?? {}
    this.constraints.set(id, { ...existing, axis })
  }

  setBounds(id: string, bounds: BoundsOption): void {
    const existing = this.constraints.get(id) ?? {}
    this.constraints.set(id, { ...existing, bounds })
  }

  clearConstraints(id: string): void {
    this.constraints.delete(id)
  }

  getConstraints(id: string): ConstraintsConfig | undefined {
    return this.constraints.get(id)
  }

  setConstraints(id: string, config: ConstraintsConfig): void {
    this.constraints.set(id, config)
  }

  private applyConstraints(
    transform: Position,
    config: ConstraintsConfig,
    element: HTMLElement
  ): Position {
    let { x, y } = transform

    // Apply axis lock
    if (config.axis === 'x') {
      y = 0
    } else if (config.axis === 'y') {
      x = 0
    }

    // Apply bounds
    if (config.bounds) {
      const boundsRect = this.getBoundsRect(config.bounds, element)
      const elementRect = element.getBoundingClientRect()
      const padding = this.normalizePadding(config.padding)

      // Constrain to bounds
      if (boundsRect) {
        const minX = boundsRect.left + padding.left - elementRect.left
        const maxX = boundsRect.right - padding.right - elementRect.width - elementRect.left
        const minY = boundsRect.top + padding.top - elementRect.top
        const maxY = boundsRect.bottom - padding.bottom - elementRect.height - elementRect.top

        x = Math.max(minX, Math.min(maxX, x))
        y = Math.max(minY, Math.min(maxY, y))
      }
    }

    return { x, y }
  }

  private getBoundsRect(bounds: BoundsOption, element: HTMLElement): DOMRect | null {
    if (bounds === 'window') {
      return new DOMRect(0, 0, window.innerWidth, window.innerHeight)
    }

    if (bounds === 'body') {
      return document.body.getBoundingClientRect()
    }

    if (bounds === 'parent') {
      const parent = element.parentElement
      return parent ? parent.getBoundingClientRect() : null
    }

    if (bounds instanceof HTMLElement) {
      return bounds.getBoundingClientRect()
    }

    // BoundsRect object
    if (typeof bounds === 'object') {
      return new DOMRect(
        bounds.left ?? 0,
        bounds.top ?? 0,
        (bounds.right ?? window.innerWidth) - (bounds.left ?? 0),
        (bounds.bottom ?? window.innerHeight) - (bounds.top ?? 0)
      )
    }

    return null
  }

  private normalizePadding(padding?: number | { top?: number; right?: number; bottom?: number; left?: number }): {
    top: number
    right: number
    bottom: number
    left: number
  } {
    if (typeof padding === 'number') {
      return { top: padding, right: padding, bottom: padding, left: padding }
    }

    return {
      top: padding?.top ?? 0,
      right: padding?.right ?? 0,
      bottom: padding?.bottom ?? 0,
      left: padding?.left ?? 0
    }
  }
}

export function constraints(): Plugin & { api?: ConstraintsAPI } {
  let instance: ConstraintsImpl | null = null

  return {
    name: 'constraints',
    version: '1.0.0',
    type: 'optional',

    install(kernel: Kernel) {
      instance = new ConstraintsImpl(kernel)
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

export type { ConstraintsAPI }
