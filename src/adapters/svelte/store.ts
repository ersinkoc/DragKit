/**
 * Svelte DragKit Store
 */

import { writable } from 'svelte/store'
import { createDragKit as createKernel } from '../../kernel'
import type { Kernel } from '../../types'
import type { DragKitStore, DragKitState, DragKitStoreOptions } from './types'

let globalStore: DragKitStore | null = null

export function createDragKitStore(options: DragKitStoreOptions = {}): DragKitStore {
  let kernel: Kernel | null = null
  const unsubscribers: (() => void)[] = []

  const initialState: DragKitState = {
    isDragging: false,
    activeId: null,
    activeDraggable: null,
    activeDroppable: null,
    overDroppableId: null
  }

  const { subscribe, update } = writable<DragKitState>(initialState)

  // Initialize kernel
  const initKernel = async () => {
    kernel = await createKernel(options)
    setupEventListeners()
  }

  const setupEventListeners = () => {
    if (!kernel) return

    const unsubStart = kernel.on('drag:start', (event) => {
      update((state: DragKitState) => ({
        ...state,
        isDragging: true,
        activeId: event.draggable.getId(),
        activeDraggable: event.draggable
      }))
    })

    const unsubMove = kernel.on('drag:move', () => {
      if (!kernel) return
      const active = kernel.getActiveDraggable()
      if (active) {
        const droppable = kernel.detectCollision(active)
        update((state: DragKitState) => ({
          ...state,
          activeDroppable: droppable,
          overDroppableId: droppable?.getId() ?? null
        }))
      }
    })

    const unsubEnd = kernel.on('drag:end', () => {
      update((_state: DragKitState) => ({
        isDragging: false,
        activeId: null,
        activeDraggable: null,
        activeDroppable: null,
        overDroppableId: null
      }))
    })

    const unsubCancel = kernel.on('drag:cancel', () => {
      update((_state: DragKitState) => ({
        isDragging: false,
        activeId: null,
        activeDraggable: null,
        activeDroppable: null,
        overDroppableId: null
      }))
    })

    unsubscribers.push(unsubStart, unsubMove, unsubEnd, unsubCancel)
  }

  // Initialize immediately
  initKernel()

  const store: DragKitStore = {
    subscribe,
    getKernel: () => kernel,
    destroy: () => {
      unsubscribers.forEach(unsub => unsub())
      kernel?.destroy()
      kernel = null
    }
  }

  globalStore = store
  return store
}

export function getDragKitStore(): DragKitStore | null {
  return globalStore
}
