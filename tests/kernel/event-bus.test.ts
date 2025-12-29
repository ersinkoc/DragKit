/**
 * Event Bus Tests
 */
import { describe, it, expect, vi } from 'vitest'
import { EventBus } from '../../src/kernel/event-bus'

describe('EventBus', () => {
  it('should create an event bus instance', () => {
    const bus = new EventBus()
    expect(bus).toBeInstanceOf(EventBus)
  })

  it('should subscribe to events', () => {
    const bus = new EventBus()
    const handler = vi.fn()

    const unsubscribe = bus.on('drag:start', handler)

    expect(typeof unsubscribe).toBe('function')
  })

  it('should emit events to subscribers', () => {
    const bus = new EventBus()
    const handler = vi.fn()

    bus.on('drag:start', handler)

    const event = {
      type: 'drag:start' as const,
      timestamp: Date.now(),
      originalEvent: null,
      draggable: {} as any,
      position: { x: 0, y: 0 }
    }

    bus.emit(event)

    expect(handler).toHaveBeenCalledWith(event)
    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('should unsubscribe from events', () => {
    const bus = new EventBus()
    const handler = vi.fn()

    const unsubscribe = bus.on('drag:start', handler)
    unsubscribe()

    bus.emit({
      type: 'drag:start' as const,
      timestamp: Date.now(),
      originalEvent: null,
      draggable: {} as any,
      position: { x: 0, y: 0 }
    })

    expect(handler).not.toHaveBeenCalled()
  })

  it('should support multiple subscribers for same event', () => {
    const bus = new EventBus()
    const handler1 = vi.fn()
    const handler2 = vi.fn()

    bus.on('drag:move', handler1)
    bus.on('drag:move', handler2)

    const event = {
      type: 'drag:move' as const,
      timestamp: Date.now(),
      originalEvent: null,
      draggable: {} as any,
      position: { x: 10, y: 20 },
      delta: { x: 5, y: 5 }
    }

    bus.emit(event)

    expect(handler1).toHaveBeenCalledWith(event)
    expect(handler2).toHaveBeenCalledWith(event)
  })

  it('should remove handler with off method', () => {
    const bus = new EventBus()
    const handler = vi.fn()

    bus.on('drag:end', handler)
    bus.off('drag:end', handler)

    bus.emit({
      type: 'drag:end' as const,
      timestamp: Date.now(),
      originalEvent: null,
      draggable: {} as any,
      droppable: null,
      position: { x: 0, y: 0 },
      dropped: false
    })

    expect(handler).not.toHaveBeenCalled()
  })

  it('should clear all handlers', () => {
    const bus = new EventBus()
    const handler1 = vi.fn()
    const handler2 = vi.fn()

    bus.on('drag:start', handler1)
    bus.on('drag:end', handler2)

    bus.clear()

    bus.emit({
      type: 'drag:start' as const,
      timestamp: Date.now(),
      originalEvent: null,
      draggable: {} as any,
      position: { x: 0, y: 0 }
    })

    expect(handler1).not.toHaveBeenCalled()
    expect(handler2).not.toHaveBeenCalled()
  })

  it('should handle errors in handlers gracefully', () => {
    const bus = new EventBus()
    const errorHandler = vi.fn(() => {
      throw new Error('Handler error')
    })
    const normalHandler = vi.fn()

    // Spy on console.error
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    bus.on('drag:start', errorHandler)
    bus.on('drag:start', normalHandler)

    const event = {
      type: 'drag:start' as const,
      timestamp: Date.now(),
      originalEvent: null,
      draggable: {} as any,
      position: { x: 0, y: 0 }
    }

    // Should not throw, error is caught internally
    expect(() => bus.emit(event)).not.toThrow()

    // Error should be logged
    expect(consoleSpy).toHaveBeenCalled()

    // Normal handler should still be called
    expect(normalHandler).toHaveBeenCalledWith(event)

    consoleSpy.mockRestore()
  })

  it('should return handler count', () => {
    const bus = new EventBus()

    expect(bus.getHandlerCount('drag:start')).toBe(0)

    const handler1 = vi.fn()
    const handler2 = vi.fn()

    bus.on('drag:start', handler1)
    expect(bus.getHandlerCount('drag:start')).toBe(1)

    bus.on('drag:start', handler2)
    expect(bus.getHandlerCount('drag:start')).toBe(2)

    bus.off('drag:start', handler1)
    expect(bus.getHandlerCount('drag:start')).toBe(1)
  })

  it('should check if event type has handlers', () => {
    const bus = new EventBus()

    expect(bus.hasHandlers('drag:start')).toBe(false)

    const handler = vi.fn()
    bus.on('drag:start', handler)

    expect(bus.hasHandlers('drag:start')).toBe(true)
    expect(bus.hasHandlers('drag:end')).toBe(false)

    bus.off('drag:start', handler)
    expect(bus.hasHandlers('drag:start')).toBe(false)
  })

  it('should not emit to non-existent event types', () => {
    const bus = new EventBus()

    // Should not throw when emitting to event with no handlers
    expect(() => bus.emit({
      type: 'drag:start' as const,
      timestamp: Date.now(),
      originalEvent: null,
      draggable: {} as any,
      position: { x: 0, y: 0 }
    })).not.toThrow()
  })

  it('should handle off for non-existent event type', () => {
    const bus = new EventBus()
    const handler = vi.fn()

    // Should not throw when removing handler from non-existent event
    expect(() => bus.off('drag:start', handler)).not.toThrow()
  })
})
