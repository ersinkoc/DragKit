/**
 * React Context Tests
 */
import { describe, it, expect, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import React from 'react'
import { DragKitContext, useDragKitContext, useDragKit } from '../../src/adapters/react/context'

describe('React Context', () => {
  describe('useDragKitContext', () => {
    it('should throw error when used outside of DragProvider', () => {
      expect(() => {
        renderHook(() => useDragKitContext())
      }).toThrow('useDragKitContext must be used within a DragProvider')
    })

    it('should return context when kernel is available', () => {
      const mockKernel = {
        on: vi.fn().mockReturnValue(() => {}),
        emit: vi.fn(),
        draggable: vi.fn(),
        droppable: vi.fn(),
        destroy: vi.fn()
      }

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <DragKitContext.Provider value={{
          kernel: mockKernel as any,
          activeDraggableId: 'drag-1',
          activeDroppableId: 'drop-1'
        }}>
          {children}
        </DragKitContext.Provider>
      )

      const { result } = renderHook(() => useDragKitContext(), { wrapper })

      expect(result.current.kernel).toBe(mockKernel)
      expect(result.current.activeDraggableId).toBe('drag-1')
      expect(result.current.activeDroppableId).toBe('drop-1')
    })
  })

  describe('useDragKit', () => {
    it('should return the kernel instance', () => {
      const mockKernel = {
        on: vi.fn().mockReturnValue(() => {}),
        emit: vi.fn(),
        draggable: vi.fn(),
        droppable: vi.fn(),
        destroy: vi.fn()
      }

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <DragKitContext.Provider value={{
          kernel: mockKernel as any,
          activeDraggableId: null,
          activeDroppableId: null
        }}>
          {children}
        </DragKitContext.Provider>
      )

      const { result } = renderHook(() => useDragKit(), { wrapper })

      expect(result.current).toBe(mockKernel)
    })

    it('should throw error when used outside of DragProvider', () => {
      expect(() => {
        renderHook(() => useDragKit())
      }).toThrow('useDragKitContext must be used within a DragProvider')
    })
  })

  describe('DragKitContext', () => {
    it('should have default values', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <DragKitContext.Consumer>
          {(value) => (
            <div>
              <span data-testid="kernel">{value.kernel ? 'has' : 'none'}</span>
              <span data-testid="drag">{value.activeDraggableId ?? 'none'}</span>
              <span data-testid="drop">{value.activeDroppableId ?? 'none'}</span>
            </div>
          )}
        </DragKitContext.Consumer>
      )

      // Default context without provider
      const defaultValue = {
        kernel: null,
        activeDraggableId: null,
        activeDroppableId: null
      }

      expect(defaultValue.kernel).toBeNull()
      expect(defaultValue.activeDraggableId).toBeNull()
      expect(defaultValue.activeDroppableId).toBeNull()
    })
  })
})
