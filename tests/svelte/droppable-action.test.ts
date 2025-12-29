/**
 * Svelte Droppable Action Tests
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'

// Mock getDragKitStore
const mockDroppableInstance = {
  getId: vi.fn().mockReturnValue('test-drop'),
  enable: vi.fn(),
  disable: vi.fn(),
  destroy: vi.fn()
}

const mockKernel = {
  droppable: vi.fn().mockReturnValue(mockDroppableInstance)
}

vi.mock('../../src/adapters/svelte/store', () => ({
  getDragKitStore: vi.fn().mockReturnValue({
    getKernel: () => mockKernel,
    subscribe: vi.fn()
  })
}))

import { droppable } from '../../src/adapters/svelte/droppable-action'

describe('Svelte Droppable Action', () => {
  let node: HTMLElement

  beforeEach(() => {
    vi.clearAllMocks()
    node = document.createElement('div')
  })

  it('should return action object', () => {
    const action = droppable(node, { id: 'test-drop' })

    expect(action).toBeDefined()
    expect(action.update).toBeDefined()
    expect(action.destroy).toBeDefined()
  })

  it('should register droppable on init', () => {
    droppable(node, { id: 'test-drop' })

    expect(mockKernel.droppable).toHaveBeenCalledWith(node, expect.objectContaining({
      id: 'test-drop'
    }))
  })

  it('should pass data to kernel', () => {
    droppable(node, { id: 'test-drop', data: { type: 'container' } })

    expect(mockKernel.droppable).toHaveBeenCalledWith(node, expect.objectContaining({
      data: { type: 'container' }
    }))
  })

  it('should pass accept filter to kernel', () => {
    droppable(node, { id: 'test-drop', accept: ['items'] })

    expect(mockKernel.droppable).toHaveBeenCalledWith(node, expect.objectContaining({
      accept: ['items']
    }))
  })

  it('should pass disabled state to kernel', () => {
    droppable(node, { id: 'test-drop', disabled: true })

    expect(mockKernel.droppable).toHaveBeenCalledWith(node, expect.objectContaining({
      disabled: true
    }))
  })

  it('should update disabled state', () => {
    const action = droppable(node, { id: 'test-drop', disabled: false })

    action.update({ id: 'test-drop', disabled: true })

    expect(mockDroppableInstance.disable).toHaveBeenCalled()
  })

  it('should update enabled state', () => {
    const action = droppable(node, { id: 'test-drop', disabled: true })

    action.update({ id: 'test-drop', disabled: false })

    expect(mockDroppableInstance.enable).toHaveBeenCalled()
  })

  it('should re-register on id change', () => {
    const action = droppable(node, { id: 'test-drop' })

    action.update({ id: 'new-id' })

    expect(mockDroppableInstance.destroy).toHaveBeenCalled()
    expect(mockKernel.droppable).toHaveBeenCalledTimes(2)
  })

  it('should destroy on cleanup', () => {
    const action = droppable(node, { id: 'test-drop' })

    action.destroy()

    expect(mockDroppableInstance.destroy).toHaveBeenCalled()
  })
})
