/**
 * Keyboard Sensor Plugin
 * Keyboard navigation for accessibility
 */

import type { Plugin, Kernel, Sensor, DraggableInstance, Position } from '../../types'

export interface KeyboardCodes {
  start?: string[]
  cancel?: string[]
  up?: string[]
  down?: string[]
  left?: string[]
  right?: string[]
}

export interface KeyboardSensorOptions {
  moveDistance?: number
  keyboardCodes?: KeyboardCodes
  announcements?: {
    onDragStart?: (draggable: DraggableInstance) => string
    onDragOver?: (droppable: any) => string
    onDragEnd?: (dropped: boolean) => string
  }
}

const defaultKeyboardCodes: Required<KeyboardCodes> = {
  start: ['Space', 'Enter'],
  cancel: ['Escape'],
  up: ['ArrowUp'],
  down: ['ArrowDown'],
  left: ['ArrowLeft'],
  right: ['ArrowRight']
}

interface KeyboardSensorAPI {
  isActive(): boolean
  setMoveDistance(distance: number): void
  getMoveDistance(): number
}

class KeyboardSensorImpl implements Sensor, KeyboardSensorAPI {
  type = 'keyboard' as const
  private active = false
  private currentDraggable: DraggableInstance | null = null
  private currentPosition: Position = { x: 0, y: 0 }
  private moveDistance: number
  private codes: Required<KeyboardCodes>
  private announcer: HTMLElement | null = null
  private options: KeyboardSensorOptions

  constructor(
    private kernel: Kernel,
    options: KeyboardSensorOptions = {}
  ) {
    this.moveDistance = options.moveDistance ?? 10
    this.codes = { ...defaultKeyboardCodes, ...options.keyboardCodes }
    this.options = options
  }

  attach(_kernel: Kernel): void {
    document.addEventListener('keydown', this.handleKeyDown)
    this.createAnnouncer()
  }

  detach(): void {
    document.removeEventListener('keydown', this.handleKeyDown)
    this.removeAnnouncer()
  }

  isActive(): boolean {
    return this.active
  }

  activate(element: HTMLElement, _event: Event): void {
    const id = element.getAttribute('data-draggable-id')
    if (!id) return

    const draggable = this.kernel.getDraggable(id)
    if (!draggable || draggable.isDisabled()) return

    this.active = true
    this.currentDraggable = draggable
    const rect = element.getBoundingClientRect()
    this.currentPosition = { x: rect.left, y: rect.top }

    this.kernel.emit({
      type: 'drag:start',
      draggable,
      position: this.currentPosition,
      timestamp: Date.now(),
      originalEvent: null
    })

    this.announce('onDragStart', draggable)
  }

  deactivate(): void {
    this.active = false
    this.currentDraggable = null
    this.currentPosition = { x: 0, y: 0 }
  }

  setMoveDistance(distance: number): void {
    this.moveDistance = distance
  }

  getMoveDistance(): number {
    return this.moveDistance
  }

  private handleKeyDown = (e: KeyboardEvent): void => {
    const target = e.target as HTMLElement
    const draggableEl = target.closest('[data-draggable-id]') as HTMLElement

    if (!this.active) {
      // Check if we should start dragging
      if (draggableEl && this.codes.start.includes(e.code)) {
        e.preventDefault()
        this.activate(draggableEl, e)
      }
      return
    }

    // Handle active drag
    if (this.codes.cancel.includes(e.code)) {
      e.preventDefault()
      this.cancel()
      return
    }

    if (this.codes.start.includes(e.code)) {
      e.preventDefault()
      this.drop()
      return
    }

    // Movement
    const delta = { x: 0, y: 0 }

    if (this.codes.up.includes(e.code)) {
      delta.y = -this.moveDistance
    } else if (this.codes.down.includes(e.code)) {
      delta.y = this.moveDistance
    } else if (this.codes.left.includes(e.code)) {
      delta.x = -this.moveDistance
    } else if (this.codes.right.includes(e.code)) {
      delta.x = this.moveDistance
    }

    if (delta.x !== 0 || delta.y !== 0) {
      e.preventDefault()
      this.move(delta)
    }
  }

  private move(delta: Position): void {
    if (!this.currentDraggable) return

    this.currentPosition = {
      x: this.currentPosition.x + delta.x,
      y: this.currentPosition.y + delta.y
    }

    this.currentDraggable.setTransform({
      x: this.currentPosition.x - this.currentDraggable.getPosition().x,
      y: this.currentPosition.y - this.currentDraggable.getPosition().y
    })

    this.kernel.emit({
      type: 'drag:move',
      draggable: this.currentDraggable,
      position: this.currentPosition,
      delta,
      timestamp: Date.now(),
      originalEvent: null
    })

    // Check for droppable
    const droppable = this.kernel.detectCollision(this.currentDraggable)
    this.announce('onDragOver', droppable)
  }

  private drop(): void {
    if (!this.currentDraggable) return

    const droppable = this.kernel.detectCollision(this.currentDraggable)

    this.kernel.emit({
      type: 'drag:end',
      draggable: this.currentDraggable,
      droppable,
      position: this.currentPosition,
      dropped: droppable !== null,
      timestamp: Date.now(),
      originalEvent: null
    })

    this.announce('onDragEnd', droppable !== null)
    this.currentDraggable.resetTransform()
    this.deactivate()
  }

  private cancel(): void {
    if (!this.currentDraggable) return

    this.kernel.emit({
      type: 'drag:cancel',
      draggable: this.currentDraggable,
      reason: 'escape',
      timestamp: Date.now(),
      originalEvent: null
    })

    this.currentDraggable.resetTransform()
    this.deactivate()
  }

  private createAnnouncer(): void {
    this.announcer = document.createElement('div')
    this.announcer.setAttribute('role', 'status')
    this.announcer.setAttribute('aria-live', 'polite')
    this.announcer.setAttribute('aria-atomic', 'true')
    this.announcer.style.cssText = `
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    `
    document.body.appendChild(this.announcer)
  }

  private removeAnnouncer(): void {
    if (this.announcer) {
      this.announcer.remove()
      this.announcer = null
    }
  }

  private announce(type: keyof NonNullable<KeyboardSensorOptions['announcements']>, data: any): void {
    if (!this.announcer || !this.options.announcements) return

    const getMessage = this.options.announcements[type]
    if (getMessage) {
      this.announcer.textContent = getMessage(data)
    }
  }
}

export function keyboardSensor(options: KeyboardSensorOptions = {}): Plugin & { api?: KeyboardSensorAPI } {
  let sensorInstance: KeyboardSensorImpl | null = null

  return {
    name: 'keyboard-sensor',
    version: '1.0.0',
    type: 'optional',

    install(kernel: Kernel) {
      sensorInstance = new KeyboardSensorImpl(kernel, options)
      sensorInstance.attach(kernel)
      ;(this as any).api = sensorInstance
    },

    uninstall() {
      if (sensorInstance) {
        sensorInstance.detach()
        sensorInstance = null
      }
    }
  }
}

export type { KeyboardSensorAPI }
