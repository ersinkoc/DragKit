/**
 * Vue useDragContext Hook
 */

import { ref, onMounted, onUnmounted, type Ref } from 'vue'
import { injectDragKit } from './plugin'
import type { DragContextState } from './types'
import type { DraggableInstance, DroppableInstance } from '../../types'

export function useDragContext(): DragContextState {
  const kernelRef = injectDragKit()
  const isDragging = ref(false)
  const activeDraggable: Ref<DraggableInstance | null> = ref(null)
  const activeDroppable: Ref<DroppableInstance | null> = ref(null)
  const draggables: Ref<Map<string, DraggableInstance>> = ref(new Map())
  const droppables: Ref<Map<string, DroppableInstance>> = ref(new Map())

  const updateState = () => {
    const kernel = kernelRef.value
    if (!kernel) return

    isDragging.value = kernel.isDragging()
    activeDraggable.value = kernel.getActiveDraggable()
    activeDroppable.value = kernel.getActiveDroppable()
    draggables.value = kernel.getDraggables()
    droppables.value = kernel.getDroppables()
  }

  const setupEventListeners = () => {
    const kernel = kernelRef.value
    if (!kernel) return

    const unsubStart = kernel.on('drag:start', () => {
      updateState()
    })

    const unsubMove = kernel.on('drag:move', () => {
      // Update active droppable on move
      const active = kernel.getActiveDraggable()
      if (active) {
        activeDroppable.value = kernel.detectCollision(active)
      }
    })

    const unsubEnd = kernel.on('drag:end', () => {
      updateState()
    })

    const unsubCancel = kernel.on('drag:cancel', () => {
      updateState()
    })

    return () => {
      unsubStart()
      unsubMove()
      unsubEnd()
      unsubCancel()
    }
  }

  let cleanupListeners: (() => void) | undefined

  onMounted(() => {
    updateState()
    cleanupListeners = setupEventListeners()
  })

  onUnmounted(() => {
    cleanupListeners?.()
  })

  return {
    kernel: kernelRef,
    isDragging,
    activeDraggable,
    activeDroppable,
    draggables,
    droppables
  }
}
