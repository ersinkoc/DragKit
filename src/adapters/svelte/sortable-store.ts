/**
 * Svelte Sortable Store
 */

import { writable } from 'svelte/store'
import { getDragKitStore } from './store'
import { arrayMove } from '../../utils/array'
import type { SortableStore, SortableState, SortableStoreOptions, SortableItemOptions, ActionReturn } from './types'
import type { SortableInstance, DraggableInstance } from '../../types'

export function createSortableStore(options: SortableStoreOptions): SortableStore {
  let sortableInstance: SortableInstance | null = null
  const unsubscribers: (() => void)[] = []
  const dragKitStore = getDragKitStore()

  const initialState: SortableState = {
    items: [...options.items],
    activeId: null,
    overIndex: null,
    isDragging: false
  }

  const { subscribe, update } = writable<SortableState>(initialState)

  // Note: These are used when sortable is initialized with a container
  void sortableInstance
  void dragKitStore

  const store: SortableStore = {
    subscribe,

    setItems(items: string[]) {
      update((state: SortableState) => ({ ...state, items }))
      if (sortableInstance) {
        sortableInstance.setItems(items)
      }
    },

    moveItem(fromIndex: number, toIndex: number) {
      update((state: SortableState) => ({
        ...state,
        items: arrayMove(state.items, fromIndex, toIndex)
      }))
    },

    addItem(id: string, index?: number) {
      update((state: SortableState) => {
        const newItems = [...state.items]
        if (index !== undefined) {
          newItems.splice(index, 0, id)
        } else {
          newItems.push(id)
        }
        return { ...state, items: newItems }
      })
    },

    removeItem(id: string) {
      update((state: SortableState) => ({
        ...state,
        items: state.items.filter((item: string) => item !== id)
      }))
    },

    destroy() {
      unsubscribers.forEach(unsub => unsub())
      if (sortableInstance) {
        sortableInstance.destroy()
        sortableInstance = null
      }
    }
  }

  return store
}

export function sortableItem(node: HTMLElement, options: SortableItemOptions): ActionReturn {
  let instance: DraggableInstance | null = null
  const dragKitStore = getDragKitStore()

  const register = () => {
    const kernel = dragKitStore?.getKernel()
    if (!kernel) return

    try {
      instance = kernel.draggable(node, {
        id: options.id,
        data: { sortable: true },
        disabled: options.disabled
      })

      node.setAttribute('data-sortable-id', options.id)
    } catch (e) {
      // Already registered
    }
  }

  const unregister = () => {
    if (instance) {
      instance.destroy()
      instance = null
    }
    node.removeAttribute('data-sortable-id')
  }

  register()

  return {
    update(newOptions: SortableItemOptions) {
      if (newOptions.id !== options.id) {
        unregister()
        options = newOptions
        register()
      } else if (instance && newOptions.disabled !== options.disabled) {
        if (newOptions.disabled) {
          instance.disable()
        } else {
          instance.enable()
        }
        options = newOptions
      }
    },
    destroy() {
      unregister()
    }
  }
}
