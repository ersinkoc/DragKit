/**
 * SortableContext Component Tests
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor, cleanup } from '@testing-library/react'
import { renderHook } from '@testing-library/react'
import React from 'react'
import { DragProvider, SortableContext, useSortableContext } from '../../src/adapters/react'

// Cleanup after each test
afterEach(() => {
  cleanup()
})

describe('SortableContext', () => {
  describe('rendering', () => {
    it('should render children', async () => {
      render(
        <DragProvider>
          <SortableContext id="list" items={['1', '2', '3']}>
            <div data-testid="child">Sortable Items</div>
          </SortableContext>
        </DragProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('child')).toBeDefined()
      })
    })
  })

  describe('context', () => {
    it('should provide items to context', async () => {
      function Consumer() {
        const context = useSortableContext()
        return <div data-testid="items">{context.items.join(',')}</div>
      }

      render(
        <DragProvider>
          <SortableContext id="list" items={['a', 'b', 'c']}>
            <Consumer />
          </SortableContext>
        </DragProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('items').textContent).toBe('a,b,c')
      })
    })

    it('should provide containerId to context', async () => {
      function Consumer() {
        const context = useSortableContext()
        return <div data-testid="id">{context.containerId}</div>
      }

      render(
        <DragProvider>
          <SortableContext id="my-list" items={['1']}>
            <Consumer />
          </SortableContext>
        </DragProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('id').textContent).toBe('my-list')
      })
    })

    it('should provide default strategy', async () => {
      function Consumer() {
        const context = useSortableContext()
        return <div data-testid="strategy">{context.strategy}</div>
      }

      render(
        <DragProvider>
          <SortableContext id="list" items={['1']}>
            <Consumer />
          </SortableContext>
        </DragProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('strategy').textContent).toBe('vertical')
      })
    })

    it('should accept custom strategy', async () => {
      function Consumer() {
        const context = useSortableContext()
        return <div data-testid="strategy">{context.strategy}</div>
      }

      render(
        <DragProvider>
          <SortableContext id="list" items={['1']} strategy="horizontal">
            <Consumer />
          </SortableContext>
        </DragProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('strategy').textContent).toBe('horizontal')
      })
    })

    it('should provide activeId as null initially', async () => {
      function Consumer() {
        const context = useSortableContext()
        return <div data-testid="activeId">{context.activeId ?? 'null'}</div>
      }

      render(
        <DragProvider>
          <SortableContext id="list" items={['1', '2']}>
            <Consumer />
          </SortableContext>
        </DragProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('activeId').textContent).toBe('null')
      })
    })

    it('should provide overId as null initially', async () => {
      function Consumer() {
        const context = useSortableContext()
        return <div data-testid="overId">{context.overId ?? 'null'}</div>
      }

      render(
        <DragProvider>
          <SortableContext id="list" items={['1', '2']}>
            <Consumer />
          </SortableContext>
        </DragProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('overId').textContent).toBe('null')
      })
    })
  })

  describe('useSortableContext hook', () => {
    it('should throw when used outside SortableContext', () => {
      // Test that useSortableContext throws when there is no context
      expect(() => {
        const { result } = renderHook(() => useSortableContext())
        // Access result to trigger error
        result.current
      }).toThrow('useSortableContext must be used within a SortableContext')
    })
  })

  describe('grid strategy', () => {
    it('should accept grid strategy', async () => {
      function Consumer() {
        const context = useSortableContext()
        return <div data-testid="strategy">{context.strategy}</div>
      }

      render(
        <DragProvider>
          <SortableContext id="grid-list" items={['1', '2', '3']} strategy="grid">
            <Consumer />
          </SortableContext>
        </DragProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('strategy').textContent).toBe('grid')
      })
    })
  })
})
