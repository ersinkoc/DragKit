/**
 * Snap Grid Plugin
 * Snap to grid during drag
 */

import type { Plugin, Kernel, Position } from '../../types'

export interface SnapGridOptions {
  size?: number
  x?: number
  y?: number
  offset?: Position
  showGrid?: boolean
  gridColor?: string
}

interface SnapGridAPI {
  setSize(size: number | { x: number; y: number }): void
  setOffset(offset: Position): void
  enable(): void
  disable(): void
  isEnabled(): boolean
  showGrid(): void
  hideGrid(): void
}

class SnapGridImpl implements SnapGridAPI {
  private enabled = true
  private gridX: number
  private gridY: number
  private offset: Position
  private gridOverlay: HTMLElement | null = null
  private gridColor: string
  private showGridEnabled: boolean
  private unsubscribers: (() => void)[] = []

  constructor(
    private kernel: Kernel,
    options: SnapGridOptions = {}
  ) {
    this.gridX = options.x ?? options.size ?? 20
    this.gridY = options.y ?? options.size ?? 20
    this.offset = options.offset ?? { x: 0, y: 0 }
    this.gridColor = options.gridColor ?? 'rgba(139, 92, 246, 0.2)'
    this.showGridEnabled = options.showGrid ?? false
  }

  attach(): void {
    const unsubMove = this.kernel.on('drag:move', (event) => {
      if (!this.enabled) return

      const draggable = event.draggable
      const currentTransform = draggable.getTransform()

      if (currentTransform) {
        const snappedTransform = this.snapToGrid(currentTransform)
        draggable.setTransform(snappedTransform)
      }
    })

    const unsubStart = this.kernel.on('drag:start', () => {
      if (this.showGridEnabled) {
        this.showGrid()
      }
    })

    const unsubEnd = this.kernel.on('drag:end', () => {
      if (this.showGridEnabled) {
        this.hideGrid()
      }
    })

    this.unsubscribers = [unsubMove, unsubStart, unsubEnd]
  }

  detach(): void {
    this.unsubscribers.forEach(unsub => unsub())
    this.unsubscribers = []
    this.hideGrid()
  }

  setSize(size: number | { x: number; y: number }): void {
    if (typeof size === 'number') {
      this.gridX = size
      this.gridY = size
    } else {
      this.gridX = size.x
      this.gridY = size.y
    }
    this.updateGridOverlay()
  }

  setOffset(offset: Position): void {
    this.offset = offset
    this.updateGridOverlay()
  }

  enable(): void {
    this.enabled = true
  }

  disable(): void {
    this.enabled = false
  }

  isEnabled(): boolean {
    return this.enabled
  }

  showGrid(): void {
    if (this.gridOverlay) return

    this.gridOverlay = document.createElement('div')
    this.gridOverlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 9998;
    `
    this.gridOverlay.style.backgroundImage = this.createGridPattern()
    this.gridOverlay.style.backgroundPosition = `${this.offset.x}px ${this.offset.y}px`

    document.body.appendChild(this.gridOverlay)
  }

  hideGrid(): void {
    if (this.gridOverlay) {
      this.gridOverlay.remove()
      this.gridOverlay = null
    }
  }

  private snapToGrid(transform: Position): Position {
    return {
      x: Math.round((transform.x - this.offset.x) / this.gridX) * this.gridX + this.offset.x,
      y: Math.round((transform.y - this.offset.y) / this.gridY) * this.gridY + this.offset.y
    }
  }

  private createGridPattern(): string {
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${this.gridX}" height="${this.gridY}">
        <rect width="${this.gridX}" height="${this.gridY}" fill="none" stroke="${this.gridColor}" stroke-width="1"/>
      </svg>
    `
    const encoded = btoa(svg)
    return `url("data:image/svg+xml;base64,${encoded}")`
  }

  private updateGridOverlay(): void {
    if (this.gridOverlay) {
      this.gridOverlay.style.backgroundImage = this.createGridPattern()
      this.gridOverlay.style.backgroundPosition = `${this.offset.x}px ${this.offset.y}px`
    }
  }
}

export function snapGrid(options: SnapGridOptions = {}): Plugin & { api?: SnapGridAPI } {
  let instance: SnapGridImpl | null = null

  return {
    name: 'snap-grid',
    version: '1.0.0',
    type: 'optional',

    install(kernel: Kernel) {
      instance = new SnapGridImpl(kernel, options)
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

export type { SnapGridAPI }
