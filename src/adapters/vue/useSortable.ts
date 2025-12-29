/**
 * Vue useSortable Hook
 */

import { ref, computed, onMounted, onUnmounted, watch, type Ref } from 'vue'
import { injectDragKit } from './plugin'
import type { UseSortableOptions, UseSortableReturn } from './types'
import type { DraggableInstance, Transform } from '../../types'

export function useSortable(options: UseSortableOptions): UseSortableReturn {
  const kernelRef = injectDragKit()
  const node: Ref<HTMLElement | null> = ref(null)
  const handleNode: Ref<HTMLElement | null> = ref(null)
  const instance: Ref<DraggableInstance | null> = ref(null)
  const isDragging = ref(false)
  const isSorting = ref(false)
  const isDisabled = ref(options.disabled ?? false)
  const transform: Ref<Transform | null> = ref(null)
  const index = ref(-1)
  const transition: Ref<string | undefined> = ref(undefined)

  const setNodeRef = (el: HTMLElement | null) => {
    node.value = el
  }

  const setHandleRef = (el: HTMLElement | null) => {
    handleNode.value = el
  }

  const attributes = computed(() => ({
    'data-draggable-id': options.id,
    'data-sortable-id': options.id,
    'aria-grabbed': isDragging.value ? 'true' : 'false',
    tabindex: '0',
    role: 'listitem'
  }))

  const listeners = computed(() => ({
    // Listeners are handled by the kernel
  }))

  const register = () => {
    const kernel = kernelRef.value
    if (!kernel || !node.value) return

    try {
      instance.value = kernel.draggable(node.value, {
        id: options.id,
        data: { ...options.data, sortable: true },
        disabled: options.disabled,
        handle: handleNode.value ? handleNode.value : undefined
      })

      // Calculate initial index
      updateIndex()
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

  const updateIndex = () => {
    if (!node.value) return
    const parent = node.value.parentElement
    if (!parent) return

    const siblings = Array.from(parent.querySelectorAll('[data-sortable-id]'))
    index.value = siblings.indexOf(node.value)
  }

  const setupEventListeners = () => {
    const kernel = kernelRef.value
    if (!kernel) return

    const unsubStart = kernel.on('drag:start', (event) => {
      if (event.draggable.getId() === options.id) {
        isDragging.value = true
        isSorting.value = true
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

        // Apply transition for smooth animation
        transition.value = 'transform 200ms ease'
        setTimeout(() => {
          transition.value = undefined
          isSorting.value = false
          updateIndex()
        }, 200)
      }
    })

    const unsubSort = kernel.on('sort:end', () => {
      updateIndex()
    })

    return () => {
      unsubStart()
      unsubMove()
      unsubEnd()
      unsubSort()
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
    node,
    index,
    isSorting,
    transition
  }
}
