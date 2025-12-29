/**
 * Svelte Droppable Action
 */

import { getDragKitStore } from './store'
import type { DroppableActionOptions, ActionReturn } from './types'
import type { DroppableInstance } from '../../types'

export function droppable(node: HTMLElement, options: DroppableActionOptions): ActionReturn {
  let instance: DroppableInstance | null = null
  const store = getDragKitStore()

  const register = () => {
    const kernel = store?.getKernel()
    if (!kernel) {
      console.warn('DragKit store not initialized. Call createDragKitStore first.')
      return
    }

    try {
      instance = kernel.droppable(node, {
        id: options.id,
        accept: options.accept,
        disabled: options.disabled,
        data: options.data
      })
    } catch (e) {
      // Already registered or error
      console.warn('Failed to register droppable:', e)
    }
  }

  const unregister = () => {
    if (instance) {
      instance.destroy()
      instance = null
    }
  }

  // Register on mount
  register()

  return {
    update(newOptions: DroppableActionOptions) {
      // If id changed, re-register
      if (newOptions.id !== options.id) {
        unregister()
        options = newOptions
        register()
      } else {
        // Update disabled state
        if (instance && newOptions.disabled !== options.disabled) {
          if (newOptions.disabled) {
            instance.disable()
          } else {
            instance.enable()
          }
        }
        options = newOptions
      }
    },
    destroy() {
      unregister()
    }
  }
}
