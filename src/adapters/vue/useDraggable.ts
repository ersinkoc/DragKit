/**
 * Vue useDraggable Hook
 */

import { ref, computed, onMounted, onUnmounted, watch, type Ref } from 'vue'
import { injectDragKit } from './plugin'
import type { UseDraggableOptions, UseDraggableReturn } from './types'
import type { DraggableInstance, Transform } from '../../types'

export function useDraggable(options: UseDraggableOptions): UseDraggableReturn {
  const kernelRef = injectDragKit()
  const node: Ref<HTMLElement | null> = ref(null)
  const handleNode: Ref<HTMLElement | null> = ref(null)
  const instance: Ref<DraggableInstance | null> = ref(null)
  const isDragging = ref(false)
  const isDisabled = ref(options.disabled ?? false)
  const transform: Ref<Transform | null> = ref(null)

  const setNodeRef = (el: HTMLElement | null) => {
    node.value = el
  }

  const setHandleRef = (el: HTMLElement | null) => {
    handleNode.value = el
  }

  const attributes = computed(() => ({
    'data-draggable-id': options.id,
    'aria-grabbed': isDragging.value ? 'true' : 'false',
    tabindex: '0',
    role: 'button'
  }))

  const listeners = computed(() => ({
    // Listeners are handled by the kernel via pointer events
  }))

  const register = () => {
    const kernel = kernelRef.value
    if (!kernel || !node.value) return

    try {
      instance.value = kernel.draggable(node.value, {
        id: options.id,
        data: options.data,
        disabled: options.disabled,
        handle: handleNode.value ? handleNode.value : undefined
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
      if (event.draggable.getId() === options.id) {
        isDragging.value = true
      }
    })

    const unsubMove = kernel.on('drag:move', (event) => {
      if (event.draggable.getId() === options.id) {
        transform.value = event.draggable.getTransform()
      }
    })

    const unsubEnd = kernel.on('drag:end', (event) => {
      if (event.draggable.getId() === options.id) {
        isDragging.value = false
        transform.value = null
      }
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
    isDisabled.value = newDisabled ?? false
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
    setHandleRef,
    attributes,
    listeners,
    isDragging,
    isDisabled,
    transform,
    node
  }
}
