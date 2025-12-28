/**
 * Pointer Sensor Plugin
 * Mouse and pointer event handling
 */

import type { Plugin, Kernel, Sensor, Position } from '../../types'

export const pointerSensorPlugin: Plugin = {
  name: 'pointer-sensor',
  version: '1.0.0',
  type: 'core',

  install(kernel: Kernel) {
    const sensor = new PointerSensor(kernel)
    sensor.attach(kernel)
  },

  uninstall() {
    // Sensor cleanup
  }
}

class PointerSensor implements Sensor {
  type = 'pointer' as const
  private active = false
  private currentDraggable: any = null
  private startPosition: Position | null = null

  constructor(private kernel: Kernel) {}

  attach(_kernel: Kernel): void {
    document.addEventListener('pointerdown', this.handlePointerDown)
  }

  detach(): void {
    document.removeEventListener('pointerdown', this.handlePointerDown)
    document.removeEventListener('pointermove', this.handlePointerMove)
    document.removeEventListener('pointerup', this.handlePointerUp)
  }

  isActive(): boolean {
    return this.active
  }

  activate(_element: HTMLElement, _event: Event): void {
    this.active = true
  }

  deactivate(): void {
    this.active = false
  }

  private handlePointerDown = (e: PointerEvent): void => {
    const target = e.target as HTMLElement
    const draggableEl = target.closest('[data-draggable-id]') as HTMLElement

    if (!draggableEl) return

    const id = draggableEl.getAttribute('data-draggable-id')
    if (!id) return

    const draggable = this.kernel.getDraggable(id)
    if (!draggable || draggable.isDisabled()) return

    this.currentDraggable = draggable
    this.startPosition = { x: e.clientX, y: e.clientY }
    this.active = true

    document.addEventListener('pointermove', this.handlePointerMove)
    document.addEventListener('pointerup', this.handlePointerUp)

    this.kernel.emit({
      type: 'drag:start',
      draggable,
      position: { x: e.clientX, y: e.clientY },
      timestamp: Date.now(),
      originalEvent: e
    })
  }

  private handlePointerMove = (e: PointerEvent): void => {
    if (!this.active || !this.currentDraggable || !this.startPosition) return

    const position = { x: e.clientX, y: e.clientY }
    const delta = {
      x: position.x - this.startPosition.x,
      y: position.y - this.startPosition.y
    }

    this.kernel.emit({
      type: 'drag:move',
      draggable: this.currentDraggable,
      position,
      delta,
      timestamp: Date.now(),
      originalEvent: e
    })
  }

  private handlePointerUp = (e: PointerEvent): void => {
    if (!this.active || !this.currentDraggable) return

    const droppable = this.kernel.detectCollision(this.currentDraggable)

    this.kernel.emit({
      type: 'drag:end',
      draggable: this.currentDraggable,
      droppable,
      position: { x: e.clientX, y: e.clientY },
      dropped: droppable !== null,
      timestamp: Date.now(),
      originalEvent: e
    })

    this.cleanup()
  }

  private cleanup(): void {
    document.removeEventListener('pointermove', this.handlePointerMove)
    document.removeEventListener('pointerup', this.handlePointerUp)
    this.active = false
    this.currentDraggable = null
    this.startPosition = null
  }
}
