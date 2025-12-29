/**
 * React useSortable Hook Tests
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import React from 'react'
import { render, screen } from '@testing-library/react'
import { renderHook, act } from '@testing-library/react'
import { useSortable } from '../../src/adapters/react/useSortable'

// Mock the DragKit context
vi.mock('../../src/adapters/react/context', () => ({
  useDragKitContext: vi.fn().mockReturnValue({
    kernel: null,
    activeDraggableId: null,
    activeDroppableId: null,
    isDragging: false
  })
}))

// Mock the SortableContext
vi.mock('../../src/adapters/react/SortableContext', () => ({
  useSortableContext: vi.fn().mockReturnValue({
    items: ['item-1', 'item-2', 'item-3'],
    containerId: 'container-1',
    strategy: 'vertical',
    activeId: null,
    overId: null
  })
}))

import { useDragKitContext } from '../../src/adapters/react/context'
import { useSortableContext } from '../../src/adapters/react/SortableContext'

describe('useSortable', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return sortable interface', () => {
    const { result } = renderHook(() => useSortable({ id: 'item-1' }))

    expect(result.current.setNodeRef).toBeDefined()
    expect(result.current.isDragging).toBe(false)
    expect(result.current.isOver).toBe(false)
    expect(result.current.index).toBe(0)
    expect(result.current.activeIndex).toBe(-1)
    expect(result.current.overIndex).toBe(-1)
    expect(result.current.attributes).toBeDefined()
    expect(result.current.listeners).toBeDefined()
    expect(result.current.transform).toBeNull()
    expect(result.current.transition).toBeUndefined()
    expect(result.current.isSorting).toBe(false)
  })

  it('should return correct index for item', () => {
    const { result: result1 } = renderHook(() => useSortable({ id: 'item-1' }))
    const { result: result2 } = renderHook(() => useSortable({ id: 'item-2' }))
    const { result: result3 } = renderHook(() => useSortable({ id: 'item-3' }))

    expect(result1.current.index).toBe(0)
    expect(result2.current.index).toBe(1)
    expect(result3.current.index).toBe(2)
  })

  it('should have correct attributes', () => {
    const { result } = renderHook(() => useSortable({ id: 'item-1' }))

    expect(result.current.attributes.role).toBe('listitem')
    expect(result.current.attributes.tabIndex).toBe(0)
    expect(result.current.attributes['aria-roledescription']).toBe('sortable')
    expect(result.current.attributes['aria-disabled']).toBe(false)
    expect(result.current.attributes['data-sortable-id']).toBe('item-1')
  })

  it('should set tabIndex to -1 when disabled', () => {
    const { result } = renderHook(() => useSortable({ id: 'item-1', disabled: true }))

    expect(result.current.attributes.tabIndex).toBe(-1)
    expect(result.current.attributes['aria-disabled']).toBe(true)
  })

  it('should have event listeners', () => {
    const { result } = renderHook(() => useSortable({ id: 'item-1' }))

    expect(typeof result.current.listeners.onPointerDown).toBe('function')
    expect(typeof result.current.listeners.onKeyDown).toBe('function')
  })

  it('should detect isDragging when activeDraggableId matches', () => {
    ;(useDragKitContext as any).mockReturnValue({
      kernel: null,
      activeDraggableId: 'item-1',
      activeDroppableId: null,
      isDragging: true
    })

    const { result } = renderHook(() => useSortable({ id: 'item-1' }))

    expect(result.current.isDragging).toBe(true)
  })

  it('should detect isOver when activeDroppableId matches', () => {
    ;(useDragKitContext as any).mockReturnValue({
      kernel: null,
      activeDraggableId: 'item-2',
      activeDroppableId: 'item-1',
      isDragging: true
    })

    const { result } = renderHook(() => useSortable({ id: 'item-1' }))

    expect(result.current.isOver).toBe(true)
  })

  it('should detect isSorting when activeId is set', () => {
    ;(useSortableContext as any).mockReturnValue({
      items: ['item-1', 'item-2', 'item-3'],
      containerId: 'container-1',
      strategy: 'vertical',
      activeId: 'item-1',
      overId: null
    })

    const { result } = renderHook(() => useSortable({ id: 'item-2' }))

    expect(result.current.isSorting).toBe(true)
    expect(result.current.activeIndex).toBe(0)
  })

  it('should compute activeIndex and overIndex', () => {
    ;(useSortableContext as any).mockReturnValue({
      items: ['item-1', 'item-2', 'item-3'],
      containerId: 'container-1',
      strategy: 'vertical',
      activeId: 'item-1',
      overId: 'item-3'
    })

    const { result } = renderHook(() => useSortable({ id: 'item-2' }))

    expect(result.current.activeIndex).toBe(0)
    expect(result.current.overIndex).toBe(2)
  })

  it('should register with kernel when setNodeRef is called', () => {
    const mockDraggable = vi.fn().mockReturnValue({
      getId: () => 'item-1',
      destroy: vi.fn(),
      enable: vi.fn(),
      disable: vi.fn()
    })
    const mockDroppable = vi.fn().mockReturnValue({
      getId: () => 'item-1',
      destroy: vi.fn(),
      enable: vi.fn(),
      disable: vi.fn()
    })

    ;(useDragKitContext as any).mockReturnValue({
      kernel: {
        draggable: mockDraggable,
        droppable: mockDroppable
      },
      activeDraggableId: null,
      activeDroppableId: null,
      isDragging: false
    })

    const { result } = renderHook(() => useSortable({ id: 'item-1' }))
    const element = document.createElement('div')

    act(() => {
      result.current.setNodeRef(element)
    })

    expect(mockDraggable).toHaveBeenCalled()
    expect(mockDroppable).toHaveBeenCalled()
  })

  it('should cleanup instances when setNodeRef receives null', () => {
    const destroyDraggable = vi.fn()
    const destroyDroppable = vi.fn()
    const mockDraggable = vi.fn().mockReturnValue({
      getId: () => 'item-1',
      destroy: destroyDraggable,
      enable: vi.fn(),
      disable: vi.fn()
    })
    const mockDroppable = vi.fn().mockReturnValue({
      getId: () => 'item-1',
      destroy: destroyDroppable,
      enable: vi.fn(),
      disable: vi.fn()
    })

    ;(useDragKitContext as any).mockReturnValue({
      kernel: {
        draggable: mockDraggable,
        droppable: mockDroppable
      },
      activeDraggableId: null,
      activeDroppableId: null,
      isDragging: false
    })

    const { result } = renderHook(() => useSortable({ id: 'item-1' }))
    const element = document.createElement('div')

    act(() => {
      result.current.setNodeRef(element)
    })

    act(() => {
      result.current.setNodeRef(null)
    })

    expect(destroyDraggable).toHaveBeenCalled()
    expect(destroyDroppable).toHaveBeenCalled()
  })

  it('should support custom data', () => {
    const mockDraggable = vi.fn().mockReturnValue({
      destroy: vi.fn(),
      enable: vi.fn(),
      disable: vi.fn()
    })
    const mockDroppable = vi.fn().mockReturnValue({
      destroy: vi.fn(),
      enable: vi.fn(),
      disable: vi.fn()
    })

    ;(useDragKitContext as any).mockReturnValue({
      kernel: {
        draggable: mockDraggable,
        droppable: mockDroppable
      },
      activeDraggableId: null,
      activeDroppableId: null,
      isDragging: false
    })

    const { result } = renderHook(() =>
      useSortable({
        id: 'item-1',
        data: { type: 'custom', value: 42 }
      })
    )

    const element = document.createElement('div')
    act(() => {
      result.current.setNodeRef(element)
    })

    const draggableCall = mockDraggable.mock.calls[0]
    expect(draggableCall[1].data.type).toBe('custom')
    expect(draggableCall[1].data.value).toBe(42)
    expect(draggableCall[1].data.sortable).toBeDefined()
  })

  it('should handle horizontal strategy', () => {
    ;(useSortableContext as any).mockReturnValue({
      items: ['item-1', 'item-2', 'item-3'],
      containerId: 'container-1',
      strategy: 'horizontal',
      activeId: 'item-1',
      overId: 'item-3'
    })

    const { result } = renderHook(() => useSortable({ id: 'item-2' }))

    expect(result.current.isSorting).toBe(true)
  })

  it('should handle keyDown events when not disabled', () => {
    const { result } = renderHook(() => useSortable({ id: 'item-1' }))

    const event = {
      key: 'Enter',
      preventDefault: vi.fn()
    }

    act(() => {
      result.current.listeners.onKeyDown(event as any)
    })

    expect(event.preventDefault).toHaveBeenCalled()
  })

  it('should not handle keyDown events when disabled', () => {
    const { result } = renderHook(() => useSortable({ id: 'item-1', disabled: true }))

    const event = {
      key: 'Enter',
      preventDefault: vi.fn()
    }

    act(() => {
      result.current.listeners.onKeyDown(event as any)
    })

    expect(event.preventDefault).not.toHaveBeenCalled()
  })

  it('should handle space key for accessibility', () => {
    const { result } = renderHook(() => useSortable({ id: 'item-1' }))

    const event = {
      key: ' ',
      preventDefault: vi.fn()
    }

    act(() => {
      result.current.listeners.onKeyDown(event as any)
    })

    expect(event.preventDefault).toHaveBeenCalled()
  })

  describe('disabled state changes', () => {
    it('should disable instances when disabled changes to true', () => {
      const disableDraggable = vi.fn()
      const disableDroppable = vi.fn()
      const enableDraggable = vi.fn()
      const enableDroppable = vi.fn()

      const mockDraggable = vi.fn().mockReturnValue({
        destroy: vi.fn(),
        enable: enableDraggable,
        disable: disableDraggable
      })
      const mockDroppable = vi.fn().mockReturnValue({
        destroy: vi.fn(),
        enable: enableDroppable,
        disable: disableDroppable
      })

      ;(useDragKitContext as any).mockReturnValue({
        kernel: {
          draggable: mockDraggable,
          droppable: mockDroppable
        },
        activeDraggableId: null,
        activeDroppableId: null,
        isDragging: false
      })

      const { result, rerender } = renderHook(
        ({ disabled }) => useSortable({ id: 'item-1', disabled }),
        { initialProps: { disabled: false } }
      )

      const element = document.createElement('div')
      act(() => {
        result.current.setNodeRef(element)
      })

      // Rerender with disabled=true
      rerender({ disabled: true })

      expect(disableDraggable).toHaveBeenCalled()
      expect(disableDroppable).toHaveBeenCalled()
    })

    it('should enable instances when disabled changes to false', () => {
      const disableDraggable = vi.fn()
      const disableDroppable = vi.fn()
      const enableDraggable = vi.fn()
      const enableDroppable = vi.fn()

      const mockDraggable = vi.fn().mockReturnValue({
        destroy: vi.fn(),
        enable: enableDraggable,
        disable: disableDraggable
      })
      const mockDroppable = vi.fn().mockReturnValue({
        destroy: vi.fn(),
        enable: enableDroppable,
        disable: disableDroppable
      })

      ;(useDragKitContext as any).mockReturnValue({
        kernel: {
          draggable: mockDraggable,
          droppable: mockDroppable
        },
        activeDraggableId: null,
        activeDroppableId: null,
        isDragging: false
      })

      const { result, rerender } = renderHook(
        ({ disabled }) => useSortable({ id: 'item-1', disabled }),
        { initialProps: { disabled: true } }
      )

      const element = document.createElement('div')
      act(() => {
        result.current.setNodeRef(element)
      })

      // Rerender with disabled=false
      rerender({ disabled: false })

      expect(enableDraggable).toHaveBeenCalled()
      expect(enableDroppable).toHaveBeenCalled()
    })
  })

  describe('drag callbacks', () => {
    it('should call onDragStart callback', () => {
      let capturedOptions: any = null
      const mockDraggable = vi.fn().mockImplementation((el, opts) => {
        capturedOptions = opts
        return {
          destroy: vi.fn(),
          enable: vi.fn(),
          disable: vi.fn()
        }
      })
      const mockDroppable = vi.fn().mockReturnValue({
        destroy: vi.fn(),
        enable: vi.fn(),
        disable: vi.fn()
      })

      ;(useDragKitContext as any).mockReturnValue({
        kernel: {
          draggable: mockDraggable,
          droppable: mockDroppable
        },
        activeDraggableId: null,
        activeDroppableId: null,
        isDragging: false
      })

      const { result } = renderHook(() => useSortable({ id: 'item-1' }))
      const element = document.createElement('div')

      act(() => {
        result.current.setNodeRef(element)
      })

      // Verify callback is registered
      expect(capturedOptions.onDragStart).toBeDefined()

      // Call onDragStart
      act(() => {
        capturedOptions.onDragStart()
      })

      // Transition should be cleared on drag start
      expect(result.current.transition).toBeUndefined()
    })

    it('should call onDragMove callback and update transform', () => {
      let capturedOptions: any = null
      const mockDraggable = vi.fn().mockImplementation((el, opts) => {
        capturedOptions = opts
        return {
          destroy: vi.fn(),
          enable: vi.fn(),
          disable: vi.fn()
        }
      })
      const mockDroppable = vi.fn().mockReturnValue({
        destroy: vi.fn(),
        enable: vi.fn(),
        disable: vi.fn()
      })

      ;(useDragKitContext as any).mockReturnValue({
        kernel: {
          draggable: mockDraggable,
          droppable: mockDroppable
        },
        activeDraggableId: null,
        activeDroppableId: null,
        isDragging: false
      })

      const { result } = renderHook(() => useSortable({ id: 'item-1' }))
      const element = document.createElement('div')

      act(() => {
        result.current.setNodeRef(element)
      })

      // Call onDragMove with delta
      act(() => {
        capturedOptions.onDragMove({ delta: { x: 50, y: 100 } })
      })

      expect(result.current.transform).toEqual({ x: 50, y: 100 })
    })

    it('should call onDragEnd callback and reset transform', () => {
      let capturedOptions: any = null
      const mockDraggable = vi.fn().mockImplementation((el, opts) => {
        capturedOptions = opts
        return {
          destroy: vi.fn(),
          enable: vi.fn(),
          disable: vi.fn()
        }
      })
      const mockDroppable = vi.fn().mockReturnValue({
        destroy: vi.fn(),
        enable: vi.fn(),
        disable: vi.fn()
      })

      ;(useDragKitContext as any).mockReturnValue({
        kernel: {
          draggable: mockDraggable,
          droppable: mockDroppable
        },
        activeDraggableId: null,
        activeDroppableId: null,
        isDragging: false
      })

      const { result } = renderHook(() => useSortable({ id: 'item-1' }))
      const element = document.createElement('div')

      act(() => {
        result.current.setNodeRef(element)
      })

      // Simulate drag move first
      act(() => {
        capturedOptions.onDragMove({ delta: { x: 50, y: 100 } })
      })

      expect(result.current.transform).toEqual({ x: 50, y: 100 })

      // Call onDragEnd
      act(() => {
        capturedOptions.onDragEnd()
      })

      expect(result.current.transform).toBeNull()
      expect(result.current.transition).toBe('transform 200ms ease')
    })

    it('should call onDragCancel callback and reset transform', () => {
      let capturedOptions: any = null
      const mockDraggable = vi.fn().mockImplementation((el, opts) => {
        capturedOptions = opts
        return {
          destroy: vi.fn(),
          enable: vi.fn(),
          disable: vi.fn()
        }
      })
      const mockDroppable = vi.fn().mockReturnValue({
        destroy: vi.fn(),
        enable: vi.fn(),
        disable: vi.fn()
      })

      ;(useDragKitContext as any).mockReturnValue({
        kernel: {
          draggable: mockDraggable,
          droppable: mockDroppable
        },
        activeDraggableId: null,
        activeDroppableId: null,
        isDragging: false
      })

      const { result } = renderHook(() => useSortable({ id: 'item-1' }))
      const element = document.createElement('div')

      act(() => {
        result.current.setNodeRef(element)
      })

      // Simulate drag move first
      act(() => {
        capturedOptions.onDragMove({ delta: { x: 50, y: 100 } })
      })

      // Call onDragCancel
      act(() => {
        capturedOptions.onDragCancel()
      })

      expect(result.current.transform).toBeNull()
      expect(result.current.transition).toBe('transform 200ms ease')
    })
  })

  describe('transform calculations during sorting', () => {
    it('should apply transform when item should move up', () => {
      ;(useSortableContext as any).mockReturnValue({
        items: ['item-1', 'item-2', 'item-3'],
        containerId: 'container-1',
        strategy: 'vertical',
        activeId: 'item-1', // dragging item at index 0
        overId: 'item-3' // over item at index 2
      })

      // Testing item-2 (index 1) - should move up
      // activeIndex=0, overIndex=2, index=1
      // isAfterActive: 1 > 0 = true
      // isBeforeOver: 1 <= 2 = true
      // shouldMoveUp: true
      const { result } = renderHook(() => useSortable({ id: 'item-2' }))

      // isSorting is true, not isDragging
      expect(result.current.isSorting).toBe(true)
      expect(result.current.isDragging).toBe(false)

      // Should have negative Y transform for vertical strategy
      expect(result.current.transform).toEqual({ x: 0, y: -100 })
      expect(result.current.transition).toBe('transform 200ms ease')
    })

    it('should apply transform when item should move down', () => {
      ;(useSortableContext as any).mockReturnValue({
        items: ['item-1', 'item-2', 'item-3'],
        containerId: 'container-1',
        strategy: 'vertical',
        activeId: 'item-3', // dragging item at index 2
        overId: 'item-1' // over item at index 0
      })

      // Testing item-2 (index 1) - should move down
      // activeIndex=2, overIndex=0, index=1
      // isAfterOver: 1 >= 0 = true
      // isBeforeActive: 1 < 2 = true
      // shouldMoveDown: true
      const { result } = renderHook(() => useSortable({ id: 'item-2' }))

      // Should have positive Y transform for vertical strategy
      expect(result.current.transform).toEqual({ x: 0, y: 100 })
      expect(result.current.transition).toBe('transform 200ms ease')
    })

    it('should apply horizontal transform for horizontal strategy', () => {
      ;(useSortableContext as any).mockReturnValue({
        items: ['item-1', 'item-2', 'item-3'],
        containerId: 'container-1',
        strategy: 'horizontal',
        activeId: 'item-1', // dragging item at index 0
        overId: 'item-3' // over item at index 2
      })

      const { result } = renderHook(() => useSortable({ id: 'item-2' }))

      // Should have X transform for horizontal strategy
      expect(result.current.transform).toEqual({ x: -100, y: 0 })
    })

    it('should not apply transform when not in sorting area', () => {
      ;(useSortableContext as any).mockReturnValue({
        items: ['item-1', 'item-2', 'item-3'],
        containerId: 'container-1',
        strategy: 'vertical',
        activeId: 'item-1', // dragging item at index 0
        overId: 'item-2' // over item at index 1
      })

      // Testing item-3 (index 2) - should not move
      // activeIndex=0, overIndex=1, index=2
      // isAfterActive: 2 > 0 = true, but isBeforeOver: 2 <= 1 = false
      // shouldMoveUp: false
      // isAfterOver: 2 >= 1 = true, but isBeforeActive: 2 < 0 = false
      // shouldMoveDown: false
      const { result } = renderHook(() => useSortable({ id: 'item-3' }))

      expect(result.current.transform).toBeNull()
      expect(result.current.transition).toBe('transform 200ms ease')
    })

    it('should not apply transform when isDragging', () => {
      ;(useDragKitContext as any).mockReturnValue({
        kernel: null,
        activeDraggableId: 'item-1',
        activeDroppableId: null,
        isDragging: true
      })

      ;(useSortableContext as any).mockReturnValue({
        items: ['item-1', 'item-2', 'item-3'],
        containerId: 'container-1',
        strategy: 'vertical',
        activeId: 'item-1',
        overId: 'item-3'
      })

      const { result } = renderHook(() => useSortable({ id: 'item-1' }))

      // isDragging items should not have transform applied through this effect
      expect(result.current.isDragging).toBe(true)
      expect(result.current.transform).toBeNull()
    })

    it('should clear transform when activeIndex equals overIndex', () => {
      ;(useSortableContext as any).mockReturnValue({
        items: ['item-1', 'item-2', 'item-3'],
        containerId: 'container-1',
        strategy: 'vertical',
        activeId: 'item-2',
        overId: 'item-2' // same as active
      })

      const { result } = renderHook(() => useSortable({ id: 'item-1' }))

      expect(result.current.transform).toBeNull()
    })
  })

  describe('cleanup on unmount', () => {
    it('should destroy instances on unmount', () => {
      const destroyDraggable = vi.fn()
      const destroyDroppable = vi.fn()
      const mockDraggable = vi.fn().mockReturnValue({
        destroy: destroyDraggable,
        enable: vi.fn(),
        disable: vi.fn()
      })
      const mockDroppable = vi.fn().mockReturnValue({
        destroy: destroyDroppable,
        enable: vi.fn(),
        disable: vi.fn()
      })

      ;(useDragKitContext as any).mockReturnValue({
        kernel: {
          draggable: mockDraggable,
          droppable: mockDroppable
        },
        activeDraggableId: null,
        activeDroppableId: null,
        isDragging: false
      })

      const { result, unmount } = renderHook(() => useSortable({ id: 'item-1' }))
      const element = document.createElement('div')

      act(() => {
        result.current.setNodeRef(element)
      })

      // Unmount the hook
      unmount()

      expect(destroyDraggable).toHaveBeenCalled()
      expect(destroyDroppable).toHaveBeenCalled()
    })
  })

  describe('handle option', () => {
    it('should pass handle option to draggable', () => {
      const mockDraggable = vi.fn().mockReturnValue({
        destroy: vi.fn(),
        enable: vi.fn(),
        disable: vi.fn()
      })
      const mockDroppable = vi.fn().mockReturnValue({
        destroy: vi.fn(),
        enable: vi.fn(),
        disable: vi.fn()
      })

      ;(useDragKitContext as any).mockReturnValue({
        kernel: {
          draggable: mockDraggable,
          droppable: mockDroppable
        },
        activeDraggableId: null,
        activeDroppableId: null,
        isDragging: false
      })

      const { result } = renderHook(() =>
        useSortable({
          id: 'item-1',
          handle: '.drag-handle'
        })
      )

      const element = document.createElement('div')
      act(() => {
        result.current.setNodeRef(element)
      })

      expect(mockDraggable).toHaveBeenCalledWith(
        element,
        expect.objectContaining({
          handle: '.drag-handle'
        })
      )
    })
  })
})
