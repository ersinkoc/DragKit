/**
 * Svelte Draggable Action Tests
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'

// Mock getDragKitStore
const mockDraggableInstance = {
  getId: vi.fn().mockReturnValue('test-drag'),
  enable: vi.fn(),
  disable: vi.fn(),
  destroy: vi.fn()
}

const mockKernel = {
  draggable: vi.fn().mockReturnValue(mockDraggableInstance)
}

vi.mock('../../src/adapters/svelte/store', () => ({
  getDragKitStore: vi.fn().mockReturnValue({
    getKernel: () => mockKernel,
    subscribe: vi.fn()
  })
}))

import { draggable } from '../../src/adapters/svelte/draggable-action'

describe('Svelte Draggable Action', () => {
  let node: HTMLElement

  beforeEach(() => {
    vi.clearAllMocks()
    node = document.createElement('div')
  })

  it('should return action object', () => {
    const action = draggable(node, { id: 'test-drag' })

    expect(action).toBeDefined()
    expect(action.update).toBeDefined()
    expect(action.destroy).toBeDefined()
  })

  it('should register draggable on init', () => {
    draggable(node, { id: 'test-drag' })

    expect(mockKernel.draggable).toHaveBeenCalledWith(node, expect.objectContaining({
      id: 'test-drag'
    }))
  })

  it('should pass data to kernel', () => {
    draggable(node, { id: 'test-drag', data: { type: 'item' } })

    expect(mockKernel.draggable).toHaveBeenCalledWith(node, expect.objectContaining({
      data: { type: 'item' }
    }))
  })

  it('should pass disabled state to kernel', () => {
    draggable(node, { id: 'test-drag', disabled: true })

    expect(mockKernel.draggable).toHaveBeenCalledWith(node, expect.objectContaining({
      disabled: true
    }))
  })

  it('should update disabled state', () => {
    const action = draggable(node, { id: 'test-drag', disabled: false })

    action.update({ id: 'test-drag', disabled: true })

    expect(mockDraggableInstance.disable).toHaveBeenCalled()
  })

  it('should update enabled state', () => {
    const action = draggable(node, { id: 'test-drag', disabled: true })

    action.update({ id: 'test-drag', disabled: false })

    expect(mockDraggableInstance.enable).toHaveBeenCalled()
  })

  it('should re-register on id change', () => {
    const action = draggable(node, { id: 'test-drag' })

    action.update({ id: 'new-id' })

    expect(mockDraggableInstance.destroy).toHaveBeenCalled()
    expect(mockKernel.draggable).toHaveBeenCalledTimes(2)
  })

  it('should destroy on cleanup', () => {
    const action = draggable(node, { id: 'test-drag' })

    action.destroy()

    expect(mockDraggableInstance.destroy).toHaveBeenCalled()
  })

  it('should handle element with handle selector', () => {
    const handle = document.createElement('div')
    handle.className = 'handle'
    node.appendChild(handle)

    draggable(node, { id: 'test-drag', handle: '.handle' })

    expect(mockKernel.draggable).toHaveBeenCalledWith(node, expect.objectContaining({
      handle: handle
    }))
  })
})
