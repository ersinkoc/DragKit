/**
 * Vue useDroppable Hook
 */

import { ref, onMounted, onUnmounted, watch, type Ref } from 'vue'
import { injectDragKit } from './plugin'
import type { UseDroppableOptions, UseDroppableReturn } from './types'
import type { DroppableInstance, DraggableInstance } from '../../types'

export function useDroppable(options: UseDroppableOptions): UseDroppableReturn {
  const kernelRef = injectDragKit()
  const node: Ref<HTMLElement | null> = ref(null)
  const instance: Ref<DroppableInstance | null> = ref(null)
  const isOver = ref(false)
  const canDrop = ref(false)
  const active: Ref<DraggableInstance | null> = ref(null)

  const setNodeRef = (el: HTMLElement | null) => {
    node.value = el
  }

  const register = () => {
    const kernel = kernelRef.value
    if (!kernel || !node.value) return

    try {
      instance.value = kernel.droppable(node.value, {
        id: options.id,
        accept: options.accept,
        disabled: options.disabled,
        data: options.data
      })
    } catch (e) {
      // Already registered
    }
  }

  const unregister = () => {
    if (instance.value) {
      instance.value.destroy()
      instance.value = null
    }
  }

  const setupEventListeners = () => {
    const kernel = kernelRef.value
    if (!kernel) return

    const unsubStart = kernel.on('drag:start', (event) => {
      active.value = event.draggable
      if (instance.value) {
        canDrop.value = instance.value.canAccept(event.draggable)
      }
    })

    const unsubMove = kernel.on('drag:move', () => {
      if (!active.value) return
      const currentDroppable = kernel.detectCollision(active.value)
      if (currentDroppable?.getId() === options.id) {
        isOver.value = true
      } else {
        isOver.value = false
      }
    })

    const unsubEnd = kernel.on('drag:end', () => {
      active.value = null
      isOver.value = false
      canDrop.value = false
    })

    return () => {
      unsubStart()
      unsubMove()
      unsubEnd()
    }
  }

  let cleanupListeners: (() => void) | undefined

  onMounted(() => {
    register()
    cleanupListeners = setupEventListeners()
  })

  onUnmounted(() => {
    unregister()
    cleanupListeners?.()
  })

  // Watch for node changes
  watch(node, (newNode: HTMLElement | null, oldNode: HTMLElement | null) => {
    if (oldNode && instance.value) {
      unregister()
    }
    if (newNode) {
      register()
    }
  })

  // Watch for disabled changes
  watch(() => options.disabled, (newDisabled: boolean | undefined) => {
    if (instance.value) {
      if (newDisabled) {
        instance.value.disable()
      } else {
        instance.value.enable()
      }
    }
  })

  return {
    setNodeRef,
    isOver,
    canDrop,
    active,
    node
  }
}
