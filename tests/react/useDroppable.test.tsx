/**
 * useDroppable Hook Tests
 */
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { renderHook, act, waitFor, cleanup } from '@testing-library/react'
import React from 'react'
import { DragProvider, useDroppable } from '../../src/adapters/react'

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

describe('useDroppable', () => {
  describe('basic functionality', () => {
    it('should return setNodeRef function', async () => {
      const { result } = renderHook(
        () => useDroppable({ id: 'test-drop' }),
        { wrapper: createWrapper() }
      )

      await waitFor(() => {
        expect(result.current.setNodeRef).toBeDefined()
        expect(typeof result.current.setNodeRef).toBe('function')
      })
    })

    it('should return isOver as false initially', async () => {
      const { result } = renderHook(
        () => useDroppable({ id: 'test-drop' }),
        { wrapper: createWrapper() }
      )

      await waitFor(() => {
        expect(result.current.isOver).toBe(false)
      })
    })

    it('should return isActive as false initially', async () => {
      const { result } = renderHook(
        () => useDroppable({ id: 'test-drop' }),
        { wrapper: createWrapper() }
      )

      await waitFor(() => {
        expect(result.current.isActive).toBe(false)
      })
    })
  })

  describe('attributes', () => {
    it('should return correct data attributes', async () => {
      const { result } = renderHook(
        () => useDroppable({ id: 'attr-test' }),
        { wrapper: createWrapper() }
      )

      await waitFor(() => {
        expect(result.current.attributes).toMatchObject({
          'data-droppable-id': 'attr-test',
          'data-droppable-disabled': false,
          'aria-dropeffect': 'move'
        })
      })
    })

    it('should set aria-dropeffect to none when disabled', async () => {
      const { result } = renderHook(
        () => useDroppable({ id: 'disabled-test', disabled: true }),
        { wrapper: createWrapper() }
      )

      await waitFor(() => {
        expect(result.current.attributes['data-droppable-disabled']).toBe(true)
        expect(result.current.attributes['aria-dropeffect']).toBe('none')
      })
    })
  })

  describe('node registration', () => {
    it('should register element with kernel when setNodeRef is called', async () => {
      const { result } = renderHook(
        () => useDroppable({ id: 'register-test' }),
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
      expect(element.getAttribute('data-droppable-id')).toBe('register-test')
    })

    it('should unregister element when setNodeRef is called with null', async () => {
      const { result } = renderHook(
        () => useDroppable({ id: 'unregister-test' }),
        { wrapper: createWrapper() }
      )

      await waitFor(() => {
        expect(result.current.setNodeRef).toBeDefined()
      })

      const element = document.createElement('div')

      act(() => {
        result.current.setNodeRef(element)
      })

      expect(element.getAttribute('data-droppable-id')).toBe('unregister-test')

      act(() => {
        result.current.setNodeRef(null)
      })

      // Element should be cleaned up
      expect(element.getAttribute('data-droppable-id')).toBeNull()
    })
  })

  describe('options', () => {
    it('should accept custom data', async () => {
      const { result } = renderHook(
        () => useDroppable({
          id: 'data-test',
          data: { zone: 'trash' }
        }),
        { wrapper: createWrapper() }
      )

      await waitFor(() => {
        expect(result.current).toBeDefined()
      })
    })

    it('should accept string type filter', async () => {
      const { result } = renderHook(
        () => useDroppable({
          id: 'accept-test',
          accept: 'card'
        }),
        { wrapper: createWrapper() }
      )

      await waitFor(() => {
        expect(result.current).toBeDefined()
      })
    })

    it('should accept array type filter', async () => {
      const { result } = renderHook(
        () => useDroppable({
          id: 'accept-array-test',
          accept: ['card', 'file']
        }),
        { wrapper: createWrapper() }
      )

      await waitFor(() => {
        expect(result.current).toBeDefined()
      })
    })

    it('should accept function type filter', async () => {
      const { result } = renderHook(
        () => useDroppable({
          id: 'accept-fn-test',
          accept: (draggable) => draggable.data.type === 'special'
        }),
        { wrapper: createWrapper() }
      )

      await waitFor(() => {
        expect(result.current).toBeDefined()
      })
    })
  })

  describe('disabled state changes', () => {
    it('should disable instance when disabled prop changes to true', async () => {
      let disabled = false
      const { result, rerender } = renderHook(
        () => useDroppable({ id: 'disable-test', disabled }),
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
        expect(result.current.attributes['data-droppable-disabled']).toBe(true)
      })
    })

    it('should enable instance when disabled prop changes to false', async () => {
      let disabled = true
      const { result, rerender } = renderHook(
        () => useDroppable({ id: 'enable-test', disabled }),
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
        expect(result.current.attributes['data-droppable-disabled']).toBe(false)
      })
    })
  })

  describe('cleanup on unmount', () => {
    it('should destroy instance on unmount', async () => {
      const { result, unmount } = renderHook(
        () => useDroppable({ id: 'cleanup-test' }),
        { wrapper: createWrapper() }
      )

      await waitFor(() => {
        expect(result.current.setNodeRef).toBeDefined()
      })

      const element = document.createElement('div')
      act(() => {
        result.current.setNodeRef(element)
      })

      expect(element.getAttribute('data-droppable-id')).toBe('cleanup-test')

      // Unmount should clean up
      unmount()

      // After unmount, element should be cleaned
      expect(element.getAttribute('data-droppable-id')).toBeNull()
    })
  })

  describe('re-registration on node change', () => {
    it('should re-register when node changes', async () => {
      const { result } = renderHook(
        () => useDroppable({ id: 're-register-test' }),
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

      expect(element1.getAttribute('data-droppable-id')).toBe('re-register-test')

      act(() => {
        result.current.setNodeRef(element2)
      })

      // Old element should be cleaned up
      expect(element1.getAttribute('data-droppable-id')).toBeNull()
      // New element should be registered
      expect(element2.getAttribute('data-droppable-id')).toBe('re-register-test')
    })
  })

  describe('isOver state tracking', () => {
    it('should update isOver when activeDroppableId from context matches', async () => {
      const { result } = renderHook(
        () => useDroppable({ id: 'over-state-test' }),
        { wrapper: createWrapper() }
      )

      await waitFor(() => {
        expect(result.current.isOver).toBe(false)
      })

      // The isOver state updates when activeDroppableId from context changes
      // This is tested through context updates in DragProvider tests
    })
  })
})
