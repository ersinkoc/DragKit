/**
 * Event Bus
 * Type-safe event system for kernel communication
 */

import type { EventType, EventHandler, DragEvent, Unsubscribe } from '../types'

type HandlerFunction = (...args: unknown[]) => void

export class EventBus {
  private handlers = new Map<EventType, Set<HandlerFunction>>()

  /**
   * Subscribe to an event
   */
  on<E extends EventType>(eventType: E, handler: EventHandler<E>): Unsubscribe {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, new Set())
    }

    const handlers = this.handlers.get(eventType)
    handlers?.add(handler as HandlerFunction)

    // Return unsubscribe function
    return () => {
      this.off(eventType, handler)
    }
  }

  /**
   * Unsubscribe from an event
   */
  off<E extends EventType>(eventType: E, handler: EventHandler<E>): void {
    const handlers = this.handlers.get(eventType)
    if (handlers) {
      handlers.delete(handler as HandlerFunction)
      if (handlers.size === 0) {
        this.handlers.delete(eventType)
      }
    }
  }

  /**
   * Emit an event to all subscribers
   */
  emit<E extends EventType>(event: Extract<DragEvent, { type: E }>): void {
    const handlers = this.handlers.get(event.type)
    if (!handlers) return

    // Call each handler with error handling
    handlers.forEach(handler => {
      try {
        handler(event)
      } catch (error) {
        console.error(`Error in ${event.type} handler:`, error)
      }
    })
  }

  /**
   * Clear all event handlers
   */
  clear(): void {
    this.handlers.clear()
  }

  /**
   * Get number of handlers for an event type
   */
  getHandlerCount(eventType: EventType): number {
    return this.handlers.get(eventType)?.size ?? 0
  }

  /**
   * Check if an event type has any handlers
   */
  hasHandlers(eventType: EventType): boolean {
    return this.getHandlerCount(eventType) > 0
  }
}
