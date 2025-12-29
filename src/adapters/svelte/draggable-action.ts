/**
 * Svelte Draggable Action
 */

import { getDragKitStore } from './store'
import type { DraggableActionOptions, ActionReturn } from './types'
import type { DraggableInstance } from '../../types'

export function draggable(node: HTMLElement, options: DraggableActionOptions): ActionReturn {
  let instance: DraggableInstance | null = null
  const store = getDragKitStore()

  const register = () => {
    const kernel = store?.getKernel()
    if (!kernel) {
      console.warn('DragKit store not initialized. Call createDragKitStore first.')
      return
    }

    try {
      const handleElement = options.handle
        ? node.querySelector(options.handle) as HTMLElement
        : undefined

      instance = kernel.draggable(node, {
        id: options.id,
        data: options.data,
        disabled: options.disabled,
        handle: handleElement
      })
    } catch (e) {
      // Already registered or error
      console.warn('Failed to register draggable:', e)
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
    update(newOptions: DraggableActionOptions) {
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
