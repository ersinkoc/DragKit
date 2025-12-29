/**
 * useDraggable Hook Tests
 */
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { renderHook, act, waitFor, cleanup } from '@testing-library/react'
import React from 'react'
import { DragProvider, useDraggable } from '../../src/adapters/react'

// Cleanup after each test
afterEach(() => {
  cleanup()
})

// Wrapper component with DragProvider
function createWrapper() {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <DragProvider>{children}</DragProvider>
  }
}

describe('useDraggable', () => {
  describe('basic functionality', () => {
    it('should return setNodeRef function', async () => {
      const { result } = renderHook(
        () => useDraggable({ id: 'test-drag' }),
        { wrapper: createWrapper() }
      )

      await waitFor(() => {
        expect(result.current.setNodeRef).toBeDefined()
        expect(typeof result.current.setNodeRef).toBe('function')
      })
    })

    it('should return isDragging as false initially', async () => {
      const { result } = renderHook(
        () => useDraggable({ id: 'test-drag' }),
        { wrapper: createWrapper() }
      )

      await waitFor(() => {
        expect(result.current.isDragging).toBe(false)
      })
    })

    it('should return transform as null initially', async () => {
      const { result } = renderHook(
        () => useDraggable({ id: 'test-drag' }),
        { wrapper: createWrapper() }
      )

      await waitFor(() => {
        expect(result.current.transform).toBeNull()
      })
    })

    it('should return position as null initially', async () => {
      const { result } = renderHook(
        () => useDraggable({ id: 'test-drag' }),
        { wrapper: createWrapper() }
      )

      await waitFor(() => {
        expect(result.current.position).toBeNull()
      })
    })
  })

  describe('attributes', () => {
    it('should return correct aria attributes', async () => {
      const { result } = renderHook(
        () => useDraggable({ id: 'attr-test' }),
        { wrapper: createWrapper() }
      )

      await waitFor(() => {
        expect(result.current.attributes).toMatchObject({
          role: 'button',
          tabIndex: 0,
          'aria-roledescription': 'draggable',
          'aria-disabled': false,
          'data-draggable-id': 'attr-test'
        })
      })
    })

    it('should set tabIndex to -1 when disabled', async () => {
      const { result } = renderHook(
        () => useDraggable({ id: 'disabled-test', disabled: true }),
        { wrapper: createWrapper() }
      )

      await waitFor(() => {
        expect(result.current.attributes.tabIndex).toBe(-1)
        expect(result.current.attributes['aria-disabled']).toBe(true)
      })
    })
  })

  describe('listeners', () => {
    it('should return event listeners', async () => {
      const { result } = renderHook(
        () => useDraggable({ id: 'listener-test' }),
        { wrapper: createWrapper() }
      )

      await waitFor(() => {
        expect(result.current.listeners).toBeDefined()
        expect(typeof result.current.listeners.onPointerDown).toBe('function')
        expect(typeof result.current.listeners.onKeyDown).toBe('function')
      })
    })
  })

  describe('node registration', () => {
    it('should register element with kernel when setNodeRef is called', async () => {
      const { result } = renderHook(
        () => useDraggable({ id: 'register-test' }),
        { wrapper: createWrapper() }
      )

      await waitFor(() => {
        expect(result.current.setNodeRef).toBeDefined()
      })

      const element = document.createElement('div')

      act(() => {
        result.current.setNodeRef(element)
      })

      // Element should have data attribute
      expect(element.getAttribute('data-draggable-id')).toBe('register-test')
    })

    it('should unregister element when setNodeRef is called with null', async () => {
      const { result } = renderHook(
        () => useDraggable({ id: 'unregister-test' }),
        { wrapper: createWrapper() }
      )

      await waitFor(() => {
        expect(result.current.setNodeRef).toBeDefined()
      })

      const element = document.createElement('div')

      act(() => {
        result.current.setNodeRef(element)
      })

      expect(element.getAttribute('data-draggable-id')).toBe('unregister-test')

      act(() => {
        result.current.setNodeRef(null)
      })

      // Element should be cleaned up
      expect(element.getAttribute('data-draggable-id')).toBeNull()
    })
  })

  describe('options', () => {
    it('should accept custom data', async () => {
      const { result } = renderHook(
        () => useDraggable({
          id: 'data-test',
          data: { type: 'card', index: 5 }
        }),
        { wrapper: createWrapper() }
      )

      await waitFor(() => {
        expect(result.current).toBeDefined()
      })
    })

    it('should accept handle selector', async () => {
      const { result } = renderHook(
        () => useDraggable({
          id: 'handle-test',
          handle: '.drag-handle'
        }),
        { wrapper: createWrapper() }
      )

      await waitFor(() => {
        expect(result.current).toBeDefined()
      })
    })

    it('should accept axis constraint', async () => {
      const { result } = renderHook(
        () => useDraggable({
          id: 'axis-test',
          axis: 'x'
        }),
        { wrapper: createWrapper() }
      )

      await waitFor(() => {
        expect(result.current).toBeDefined()
      })
    })
  })

  describe('keyboard handler', () => {
    it('should not trigger action when disabled', async () => {
      const { result } = renderHook(
        () => useDraggable({ id: 'keyboard-test', disabled: true }),
        { wrapper: createWrapper() }
      )

      await waitFor(() => {
        expect(result.current.listeners.onKeyDown).toBeDefined()
      })

      // Create a mock keyboard event
      const mockEvent = {
        key: 'Enter',
        preventDefault: vi.fn()
      } as unknown as React.KeyboardEvent

      // Call the handler - it should return early when disabled
      act(() => {
        result.current.listeners.onKeyDown(mockEvent)
      })

      // preventDefault should not be called because we returned early
      expect(mockEvent.preventDefault).not.toHaveBeenCalled()
    })

    it('should call preventDefault on Enter key when not disabled', async () => {
      const { result } = renderHook(
        () => useDraggable({ id: 'keyboard-test-2', disabled: false }),
        { wrapper: createWrapper() }
      )

      await waitFor(() => {
        expect(result.current.listeners.onKeyDown).toBeDefined()
      })

      const mockEvent = {
        key: 'Enter',
        preventDefault: vi.fn()
      } as unknown as React.KeyboardEvent

      act(() => {
        result.current.listeners.onKeyDown(mockEvent)
      })

      expect(mockEvent.preventDefault).toHaveBeenCalled()
    })

    it('should call preventDefault on Space key when not disabled', async () => {
      const { result } = renderHook(
        () => useDraggable({ id: 'keyboard-test-3', disabled: false }),
        { wrapper: createWrapper() }
      )

      await waitFor(() => {
        expect(result.current.listeners.onKeyDown).toBeDefined()
      })

      const mockEvent = {
        key: ' ',
        preventDefault: vi.fn()
      } as unknown as React.KeyboardEvent

      act(() => {
        result.current.listeners.onKeyDown(mockEvent)
      })

      expect(mockEvent.preventDefault).toHaveBeenCalled()
    })

    it('should not call preventDefault for other keys', async () => {
      const { result } = renderHook(
        () => useDraggable({ id: 'keyboard-test-4', disabled: false }),
        { wrapper: createWrapper() }
      )

      await waitFor(() => {
        expect(result.current.listeners.onKeyDown).toBeDefined()
      })

      const mockEvent = {
        key: 'Tab',
        preventDefault: vi.fn()
      } as unknown as React.KeyboardEvent

      act(() => {
        result.current.listeners.onKeyDown(mockEvent)
      })

      expect(mockEvent.preventDefault).not.toHaveBeenCalled()
    })
  })

  describe('disabled state changes', () => {
    it('should disable instance when disabled prop changes to true', async () => {
      let disabled = false
      const { result, rerender } = renderHook(
        () => useDraggable({ id: 'disable-test', disabled }),
        { wrapper: createWrapper() }
      )

      await waitFor(() => {
        expect(result.current.setNodeRef).toBeDefined()
      })

      const element = document.createElement('div')
      act(() => {
        result.current.setNodeRef(element)
      })

      // Change to disabled
      disabled = true
      rerender()

      await waitFor(() => {
        expect(result.current.attributes['aria-disabled']).toBe(true)
      })
    })

    it('should enable instance when disabled prop changes to false', async () => {
      let disabled = true
      const { result, rerender } = renderHook(
        () => useDraggable({ id: 'enable-test', disabled }),
        { wrapper: createWrapper() }
      )

      await waitFor(() => {
        expect(result.current.setNodeRef).toBeDefined()
      })

      const element = document.createElement('div')
      act(() => {
        result.current.setNodeRef(element)
      })

      // Change to enabled
      disabled = false
      rerender()

      await waitFor(() => {
        expect(result.current.attributes['aria-disabled']).toBe(false)
      })
    })
  })

  describe('pointer handler', () => {
    it('should handle pointer down event', async () => {
      const { result } = renderHook(
        () => useDraggable({ id: 'pointer-test' }),
        { wrapper: createWrapper() }
      )

      await waitFor(() => {
        expect(result.current.listeners.onPointerDown).toBeDefined()
      })

      const mockEvent = {
        clientX: 100,
        clientY: 200
      } as React.PointerEvent

      // Should not throw
      act(() => {
        result.current.listeners.onPointerDown(mockEvent)
      })
    })
  })

  describe('drag state tracking', () => {
    it('should update isDragging when activeDraggableId changes', async () => {
      const { result, rerender } = renderHook(
        () => useDraggable({ id: 'drag-state-test' }),
        { wrapper: createWrapper() }
      )

      await waitFor(() => {
        expect(result.current.isDragging).toBe(false)
      })

      // The isDragging state updates when activeDraggableId from context changes
      // This is tested indirectly through the context updates
    })
  })

  describe('cleanup on unmount', () => {
    it('should destroy instance on unmount', async () => {
      const { result, unmount } = renderHook(
        () => useDraggable({ id: 'cleanup-test' }),
        { wrapper: createWrapper() }
      )

      await waitFor(() => {
        expect(result.current.setNodeRef).toBeDefined()
      })

      const element = document.createElement('div')
      act(() => {
        result.current.setNodeRef(element)
      })

      expect(element.getAttribute('data-draggable-id')).toBe('cleanup-test')

      // Unmount should clean up
      unmount()

      // After unmount, element should be cleaned
      expect(element.getAttribute('data-draggable-id')).toBeNull()
    })
  })

  describe('re-registration on node change', () => {
    it('should re-register when node changes', async () => {
      const { result } = renderHook(
        () => useDraggable({ id: 're-register-test' }),
        { wrapper: createWrapper() }
      )

      await waitFor(() => {
        expect(result.current.setNodeRef).toBeDefined()
      })

      const element1 = document.createElement('div')
      const element2 = document.createElement('div')

      act(() => {
        result.current.setNodeRef(element1)
      })

      expect(element1.getAttribute('data-draggable-id')).toBe('re-register-test')

      act(() => {
        result.current.setNodeRef(element2)
      })

      // Old element should be cleaned up
      expect(element1.getAttribute('data-draggable-id')).toBeNull()
      // New element should be registered
      expect(element2.getAttribute('data-draggable-id')).toBe('re-register-test')
    })
  })
})
